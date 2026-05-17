"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createFriendLink,
  deleteFriendLinkById,
  getAdminFriendLinkById,
  updateFriendLinkById,
  updateFriendLinkStatusById,
  type FriendLinkStatus,
} from "@/db/queries/friend-links.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 1000;
const friendLinkStatuses = new Set<FriendLinkStatus>([
  "pending",
  "approved",
  "rejected",
  "hidden",
]);

export type AdminFriendLinkFormInput = {
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
  status: FriendLinkStatus;
  isVisible: boolean;
  sortOrder: number;
};

type NormalizedFriendLinkMetadata = AdminFriendLinkFormInput;

type AdminFriendLinkActionResult =
  | { success: true; id: number }
  | { success: false; message: string };

type AdminFriendLinkActionError = Extract<AdminFriendLinkActionResult, { success: false }>;

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanField(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function normalizeSortOrder(value: string) {
  const sortOrder = Number(value);
  return Number.isInteger(sortOrder) ? sortOrder : 0;
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeStatus(value: string) {
  return friendLinkStatuses.has(value as FriendLinkStatus)
    ? (value as FriendLinkStatus)
    : undefined;
}

function normalizeVisibility(status: FriendLinkStatus, isVisible: boolean) {
  return status === "approved" ? isVisible : false;
}

function normalizeFriendLinkMetadata(
  formData: FormData,
): AdminFriendLinkActionError | NormalizedFriendLinkMetadata {
  const name = getStringField(formData, "name");
  const description = getStringField(formData, "description");
  const avatarUrl = getStringField(formData, "avatarUrl");
  const blogUrl = getStringField(formData, "blogUrl");
  const status = normalizeStatus(getStringField(formData, "status") || "approved");

  if (!name) {
    return { success: false, message: "友链名称不能为空" };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { success: false, message: "友链名称过长" };
  }

  if (!description) {
    return { success: false, message: "友链描述不能为空" };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { success: false, message: "友链描述过长" };
  }

  if (!avatarUrl) {
    return { success: false, message: "头像 URL 不能为空" };
  }

  if (!blogUrl) {
    return { success: false, message: "博客 URL 不能为空" };
  }

  if (!status) {
    return { success: false, message: "友链审核状态无效" };
  }

  if (avatarUrl.length > MAX_URL_LENGTH || blogUrl.length > MAX_URL_LENGTH) {
    return { success: false, message: "链接地址过长" };
  }

  if (!isValidUrl(avatarUrl)) {
    return { success: false, message: "头像 URL 必须是有效的 http(s) 地址" };
  }

  if (!isValidUrl(blogUrl)) {
    return { success: false, message: "博客 URL 必须是有效的 http(s) 地址" };
  }

  return {
    name,
    description,
    avatarUrl,
    blogUrl,
    status,
    isVisible: normalizeVisibility(status, getBooleanField(formData, "isVisible")),
    sortOrder: normalizeSortOrder(getStringField(formData, "sortOrder")),
  };
}

function isActionError(
  value: AdminFriendLinkActionError | NormalizedFriendLinkMetadata,
): value is AdminFriendLinkActionError {
  return "success" in value && !value.success;
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

function revalidateFriendLinkPaths(id?: number) {
  revalidatePath("/admin/friends");
  revalidatePath("/friends");

  if (id) {
    revalidatePath(`/admin/friends/${id}/edit`);
  }
}

export async function createAdminFriendLinkAction(
  formData: FormData,
): Promise<AdminFriendLinkActionResult> {
  const normalizedMetadata = normalizeFriendLinkMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  try {
    const friendLink = await createFriendLink(normalizedMetadata);

    revalidateFriendLinkPaths();

    return { success: true, id: friendLink.id };
  } catch {
    return { success: false, message: "友链创建失败，请稍后再试" };
  }
}

export async function updateAdminFriendLinkAction(
  id: number,
  formData: FormData,
): Promise<AdminFriendLinkActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "友链不存在" };
  }

  const normalizedMetadata = normalizeFriendLinkMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentFriendLink = await getAdminFriendLinkById(id);

  if (!currentFriendLink) {
    return { success: false, message: "友链不存在" };
  }

  try {
    const friendLink = await updateFriendLinkById(id, normalizedMetadata);

    if (!friendLink) {
      return { success: false, message: "友链不存在" };
    }

    revalidateFriendLinkPaths(id);

    return { success: true, id: friendLink.id };
  } catch {
    return { success: false, message: "友链更新失败，请稍后再试" };
  }
}

export async function approveAdminFriendLinkAction(
  id: number,
): Promise<AdminFriendLinkActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "友链不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentFriendLink = await getAdminFriendLinkById(id);

  if (!currentFriendLink) {
    return { success: false, message: "友链不存在" };
  }

  try {
    const friendLink = await updateFriendLinkStatusById(id, "approved", true);

    if (!friendLink) {
      return { success: false, message: "友链不存在" };
    }

    revalidateFriendLinkPaths(id);

    return { success: true, id: friendLink.id };
  } catch {
    return { success: false, message: "友链通过失败，请稍后再试" };
  }
}

export async function rejectAdminFriendLinkAction(
  id: number,
): Promise<AdminFriendLinkActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "友链不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentFriendLink = await getAdminFriendLinkById(id);

  if (!currentFriendLink) {
    return { success: false, message: "友链不存在" };
  }

  try {
    const friendLink = await updateFriendLinkStatusById(id, "rejected", false);

    if (!friendLink) {
      return { success: false, message: "友链不存在" };
    }

    revalidateFriendLinkPaths(id);

    return { success: true, id: friendLink.id };
  } catch {
    return { success: false, message: "友链拒绝失败，请稍后再试" };
  }
}

export async function deleteAdminFriendLinkAction(id: number): Promise<AdminFriendLinkActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "友链不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentFriendLink = await getAdminFriendLinkById(id);

  if (!currentFriendLink) {
    return { success: false, message: "友链不存在或已被删除" };
  }

  try {
    const friendLink = await deleteFriendLinkById(id);

    if (!friendLink) {
      return { success: false, message: "友链不存在或已被删除" };
    }

    revalidateFriendLinkPaths(id);

    return { success: true, id: friendLink.id };
  } catch {
    return { success: false, message: "友链删除失败，请稍后再试" };
  }
}
