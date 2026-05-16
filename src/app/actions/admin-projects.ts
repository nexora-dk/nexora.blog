"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createProject,
  deleteProjectById,
  getAdminProjectById,
  updateProjectById,
} from "@/db/queries/projects.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 1000;
const MAX_STATUS_LENGTH = 80;
const MAX_CATEGORY_LENGTH = 120;
const MAX_DEVELOPMENT_TIME_LENGTH = 80;
const MAX_TAGS_COUNT = 12;
const MAX_TAG_LENGTH = 40;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const imageExtensionsByType = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export type AdminProjectFormInput = {
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string;
  href: string;
  repoHref: string;
  developmentTime: string;
  coverImageUrl: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

type NormalizedProjectMetadata = {
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string[];
  href: string | null;
  repoHref: string | null;
  developmentTime: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

type ProjectCoverUpload = {
  coverImageUrl: string;
  coverBlobKey: string;
};

type AdminProjectActionResult =
  | { success: true; id: number }
  | { success: false; message: string };

type AdminProjectActionError = Extract<AdminProjectActionResult, { success: false }>;

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

function normalizeOptionalLink(value: string) {
  if (!value || value === "#") {
    return null;
  }

  return value;
}

function isValidLink(value: string | null) {
  if (!value) {
    return true;
  }

  if (value.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[，,\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

function normalizeProjectMetadata(
  formData: FormData,
): AdminProjectActionError | NormalizedProjectMetadata {
  const title = getStringField(formData, "title");
  const description = getStringField(formData, "description");
  const status = getStringField(formData, "status");
  const category = getStringField(formData, "category");
  const tags = parseTags(getStringField(formData, "tags"));
  const href = normalizeOptionalLink(getStringField(formData, "href"));
  const repoHref = normalizeOptionalLink(getStringField(formData, "repoHref"));
  const developmentTime = getStringField(formData, "developmentTime");

  if (!title) {
    return { success: false, message: "项目标题不能为空" };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { success: false, message: "项目标题过长" };
  }

  if (!description) {
    return { success: false, message: "项目描述不能为空" };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { success: false, message: "项目描述过长" };
  }

  if (!status) {
    return { success: false, message: "项目状态不能为空" };
  }

  if (status.length > MAX_STATUS_LENGTH) {
    return { success: false, message: "项目状态过长" };
  }

  if (!category) {
    return { success: false, message: "项目分类不能为空" };
  }

  if (category.length > MAX_CATEGORY_LENGTH) {
    return { success: false, message: "项目分类过长" };
  }

  if (!developmentTime) {
    return { success: false, message: "开发时间不能为空" };
  }

  if (developmentTime.length > MAX_DEVELOPMENT_TIME_LENGTH) {
    return { success: false, message: "开发时间过长" };
  }

  if (tags.length > MAX_TAGS_COUNT) {
    return { success: false, message: "项目标签过多" };
  }

  if (tags.some((tag) => tag.length > MAX_TAG_LENGTH)) {
    return { success: false, message: "项目标签过长" };
  }

  if (!isValidLink(href)) {
    return { success: false, message: "项目链接必须是 / 开头路径或有效的 http(s) 地址" };
  }

  if (!isValidLink(repoHref)) {
    return { success: false, message: "仓库链接必须是 / 开头路径或有效的 http(s) 地址" };
  }

  return {
    title,
    description,
    status,
    category,
    tags,
    href,
    repoHref,
    developmentTime,
    isFeatured: getBooleanField(formData, "isFeatured"),
    isVisible: getBooleanField(formData, "isVisible"),
    sortOrder: normalizeSortOrder(getStringField(formData, "sortOrder")),
  };
}

function isActionError(
  value: AdminProjectActionError | NormalizedProjectMetadata,
): value is AdminProjectActionError {
  return "success" in value && !value.success;
}

function getCoverImageFile(formData: FormData) {
  const value = formData.get("coverImageFile");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function validateImageFile(file: File | null) {
  if (!file) {
    return undefined;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { success: false as const, message: "封面图片大小不能超过 5MB" };
  }

  if (!imageExtensionsByType.has(file.type)) {
    return { success: false as const, message: "仅支持 JPG、PNG、WebP 或 GIF 封面图片" };
  }

  return undefined;
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function uploadProjectCover(file: File): Promise<ProjectCoverUpload> {
  const extension = imageExtensionsByType.get(file.type) ?? ".jpg";
  const pathname = `projects/${crypto.randomUUID()}${extension}`;
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  return {
    coverImageUrl: blob.url,
    coverBlobKey: blob.pathname,
  };
}

async function deleteProjectCoverBlob(coverBlobKey: string | null | undefined) {
  if (!coverBlobKey) {
    return;
  }

  try {
    await del(coverBlobKey);
  } catch (error) {
    console.error("Failed to delete project cover blob:", error);
  }
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

export async function createAdminProjectAction(
  formData: FormData,
): Promise<AdminProjectActionResult> {
  const normalizedMetadata = normalizeProjectMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const coverFile = getCoverImageFile(formData);
  const fileError = validateImageFile(coverFile);

  if (fileError) {
    return fileError;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  if (coverFile && !hasBlobToken()) {
    return { success: false, message: "缺少 BLOB_READ_WRITE_TOKEN，无法上传封面" };
  }

  let uploadedCover: ProjectCoverUpload | undefined;

  try {
    uploadedCover = coverFile ? await uploadProjectCover(coverFile) : undefined;
  } catch {
    return { success: false, message: "封面上传失败，请稍后再试" };
  }

  try {
    const project = await createProject({
      ...normalizedMetadata,
      coverImageUrl: uploadedCover?.coverImageUrl ?? null,
      coverBlobKey: uploadedCover?.coverBlobKey ?? null,
    });

    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, id: project.id };
  } catch {
    await deleteProjectCoverBlob(uploadedCover?.coverBlobKey);
    return { success: false, message: "项目创建失败，请稍后再试" };
  }
}

export async function updateAdminProjectAction(
  id: number,
  formData: FormData,
): Promise<AdminProjectActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "项目不存在" };
  }

  const normalizedMetadata = normalizeProjectMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const coverFile = getCoverImageFile(formData);
  const fileError = validateImageFile(coverFile);

  if (fileError) {
    return fileError;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentProject = await getAdminProjectById(id);

  if (!currentProject) {
    return { success: false, message: "项目不存在" };
  }

  if (coverFile && !hasBlobToken()) {
    return { success: false, message: "缺少 BLOB_READ_WRITE_TOKEN，无法上传封面" };
  }

  let uploadedCover: ProjectCoverUpload | undefined;

  try {
    uploadedCover = coverFile ? await uploadProjectCover(coverFile) : undefined;
  } catch {
    return { success: false, message: "封面上传失败，请稍后再试" };
  }

  try {
    const project = await updateProjectById(id, {
      ...normalizedMetadata,
      coverImageUrl: uploadedCover?.coverImageUrl ?? currentProject.coverImageUrl ?? null,
      coverBlobKey: uploadedCover?.coverBlobKey ?? currentProject.coverBlobKey,
    });

    if (!project) {
      await deleteProjectCoverBlob(uploadedCover?.coverBlobKey);
      return { success: false, message: "项目不存在" };
    }

    if (uploadedCover) {
      await deleteProjectCoverBlob(currentProject.coverBlobKey);
    }

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}/edit`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, id: project.id };
  } catch {
    await deleteProjectCoverBlob(uploadedCover?.coverBlobKey);
    return { success: false, message: "项目更新失败，请稍后再试" };
  }
}

export async function deleteAdminProjectAction(id: number): Promise<AdminProjectActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "项目不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentProject = await getAdminProjectById(id);

  if (!currentProject) {
    return { success: false, message: "项目不存在或已被删除" };
  }

  try {
    const project = await deleteProjectById(id);

    if (!project) {
      return { success: false, message: "项目不存在或已被删除" };
    }

    await deleteProjectCoverBlob(currentProject.coverBlobKey);

    revalidatePath("/admin/projects");
    revalidatePath(`/admin/projects/${id}/edit`);
    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, id: project.id };
  } catch {
    return { success: false, message: "项目删除失败，请稍后再试" };
  }
}
