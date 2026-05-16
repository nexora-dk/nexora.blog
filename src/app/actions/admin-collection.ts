"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { isSimpleIconName } from "@/components/pages/collection/collection-data";
import {
  createCollectionItem,
  deleteCollectionItemById,
  getAdminCollectionItemById,
  getCollectionGroupById,
  updateCollectionItemById,
  type CollectionIconType,
} from "@/db/queries/collection.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;

export type AdminCollectionFormInput = {
  groupId: number;
  title: string;
  description: string;
  href: string;
  iconType: CollectionIconType;
  iconName: string;
  iconSrc: string;
  iconAlt: string;
  iconClassName: string;
  isVisible: boolean;
  sortOrder: number;
};

type NormalizedCollectionInput = {
  groupId: number;
  title: string;
  description: string;
  href: string | null;
  iconType: CollectionIconType;
  iconName: string | null;
  iconSrc: string | null;
  iconAlt: string | null;
  iconClassName: string | null;
  isVisible: boolean;
  sortOrder: number;
};

type AdminCollectionActionResult =
  | { success: true; id: number }
  | { success: false; message: string };

type AdminCollectionActionError = Extract<
  AdminCollectionActionResult,
  { success: false }
>;

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeSortOrder(value: number) {
  return Number.isInteger(value) ? value : 0;
}

function normalizeCollectionInput(
  input: AdminCollectionFormInput,
): AdminCollectionActionError | NormalizedCollectionInput {
  const groupId = Number(input.groupId);
  const title = input.title.trim();
  const description = input.description.trim();
  const href = input.href.trim();
  const iconType = input.iconType;
  const iconName = input.iconName.trim();
  const iconSrc = input.iconSrc.trim();
  const iconAlt = input.iconAlt.trim();
  const iconClassName = input.iconClassName.trim();

  if (!isValidId(groupId)) {
    return { success: false, message: "收藏分组无效" };
  }

  if (!title) {
    return { success: false, message: "收藏名称不能为空" };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { success: false, message: "收藏名称过长" };
  }

  if (!description) {
    return { success: false, message: "收藏描述不能为空" };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { success: false, message: "收藏描述过长" };
  }

  if (href && !isValidUrl(href)) {
    return { success: false, message: "收藏链接必须是有效的 http 或 https 地址" };
  }

  if (iconType !== "simple" && iconType !== "image") {
    return { success: false, message: "图标类型无效" };
  }

  if (iconType === "simple" && !isSimpleIconName(iconName)) {
    return { success: false, message: "请选择有效的 simple-icons 图标" };
  }

  if (typeof input.isVisible !== "boolean") {
    return { success: false, message: "展示状态无效" };
  }

  return {
    groupId,
    title,
    description,
    href: href || null,
    iconType,
    iconName: iconType === "simple" ? iconName : null,
    iconSrc: iconType === "image" ? iconSrc || null : null,
    iconAlt: iconType === "image" ? iconAlt || title : null,
    iconClassName: iconClassName || null,
    isVisible: input.isVisible,
    sortOrder: normalizeSortOrder(Number(input.sortOrder)),
  };
}

function isActionError(
  value: AdminCollectionActionError | NormalizedCollectionInput,
): value is AdminCollectionActionError {
  return "success" in value && !value.success;
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

async function validateGroupExists(groupId: number) {
  const group = await getCollectionGroupById(groupId);
  return Boolean(group);
}

export async function createAdminCollectionAction(
  input: AdminCollectionFormInput,
): Promise<AdminCollectionActionResult> {
  const normalizedInput = normalizeCollectionInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  if (!(await validateGroupExists(normalizedInput.groupId))) {
    return { success: false, message: "收藏分组不存在" };
  }

  try {
    const item = await createCollectionItem(normalizedInput);

    revalidatePath("/admin/collection");
    revalidatePath("/collection");

    return { success: true, id: item.id };
  } catch {
    return { success: false, message: "收藏创建失败，请稍后再试" };
  }
}

export async function updateAdminCollectionAction(
  id: number,
  input: AdminCollectionFormInput,
): Promise<AdminCollectionActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "收藏不存在" };
  }

  const normalizedInput = normalizeCollectionInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentItem = await getAdminCollectionItemById(id);

  if (!currentItem) {
    return { success: false, message: "收藏不存在" };
  }

  if (!(await validateGroupExists(normalizedInput.groupId))) {
    return { success: false, message: "收藏分组不存在" };
  }

  try {
    const item = await updateCollectionItemById(id, normalizedInput);

    if (!item) {
      return { success: false, message: "收藏不存在" };
    }

    revalidatePath("/admin/collection");
    revalidatePath(`/admin/collection/${id}/edit`);
    revalidatePath("/collection");

    return { success: true, id: item.id };
  } catch {
    return { success: false, message: "收藏更新失败，请稍后再试" };
  }
}

export async function deleteAdminCollectionAction(
  id: number,
): Promise<AdminCollectionActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "收藏不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentItem = await getAdminCollectionItemById(id);

  if (!currentItem) {
    return { success: false, message: "收藏不存在或已被删除" };
  }

  try {
    const item = await deleteCollectionItemById(id);

    if (!item) {
      return { success: false, message: "收藏不存在或已被删除" };
    }

    revalidatePath("/admin/collection");
    revalidatePath(`/admin/collection/${id}/edit`);
    revalidatePath("/collection");

    return { success: true, id: item.id };
  } catch {
    return { success: false, message: "收藏删除失败，请稍后再试" };
  }
}
