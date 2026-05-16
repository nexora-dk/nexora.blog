"use server";

import { del, put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  clearFeaturedGalleryPhotosExcept,
  createGalleryPhoto,
  deleteGalleryPhotoById,
  getAdminGalleryPhotoById,
  updateGalleryPhotoById,
} from "@/db/queries/gallery.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_TITLE_LENGTH = 120;
const MAX_ALT_LENGTH = 160;
const MAX_LOCATION_LENGTH = 120;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const imageExtensionsByType = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

export type AdminGalleryFormInput = {
  imageSrc: string;
  alt: string;
  title: string;
  location: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

type NormalizedGalleryMetadata = {
  alt: string;
  title: string;
  location: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

type GalleryImageUpload = {
  imageSrc: string;
  sourceKey: string;
};

type AdminGalleryActionResult =
  | { success: true; id: number }
  | { success: false; message: string };

type AdminGalleryActionError = Extract<AdminGalleryActionResult, { success: false }>;

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanField(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "true";
}

function normalizeSortOrder(value: string) {
  const sortOrder = Number(value);
  return Number.isInteger(sortOrder) ? sortOrder : 0;
}

function normalizeGalleryMetadata(
  formData: FormData,
): AdminGalleryActionError | NormalizedGalleryMetadata {
  const title = getStringField(formData, "title");
  const alt = getStringField(formData, "alt") || title;
  const location = getStringField(formData, "location") || "未知地点";

  if (!title) {
    return { success: false, message: "照片标题不能为空" };
  }

  if (title.length > MAX_TITLE_LENGTH) {
    return { success: false, message: "照片标题过长" };
  }

  if (alt.length > MAX_ALT_LENGTH) {
    return { success: false, message: "图片 Alt 文案过长" };
  }

  if (location.length > MAX_LOCATION_LENGTH) {
    return { success: false, message: "地点文案过长" };
  }

  return {
    title,
    alt,
    location,
    isFeatured: getBooleanField(formData, "isFeatured"),
    isVisible: getBooleanField(formData, "isVisible"),
    sortOrder: normalizeSortOrder(getStringField(formData, "sortOrder")),
  };
}

function isActionError(
  value: AdminGalleryActionError | NormalizedGalleryMetadata,
): value is AdminGalleryActionError {
  return "success" in value && !value.success;
}

function getImageFile(formData: FormData) {
  const value = formData.get("imageFile");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function validateImageFile(file: File | null, isRequired: boolean) {
  if (!file) {
    return isRequired ? { success: false as const, message: "请选择要上传的图片" } : undefined;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { success: false as const, message: "图片大小不能超过 5MB" };
  }

  if (!imageExtensionsByType.has(file.type)) {
    return { success: false as const, message: "仅支持 JPG、PNG、WebP 或 GIF 图片" };
  }

  return undefined;
}

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function uploadGalleryImage(file: File): Promise<GalleryImageUpload> {
  const extension = imageExtensionsByType.get(file.type) ?? ".jpg";
  const pathname = `gallery/${crypto.randomUUID()}${extension}`;
  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
    contentType: file.type,
  });

  return {
    imageSrc: blob.url,
    sourceKey: blob.pathname,
  };
}

async function deleteGalleryBlob(sourceKey: string | null | undefined) {
  if (!sourceKey) {
    return;
  }

  try {
    await del(sourceKey);
  } catch (error) {
    console.error("Failed to delete gallery blob:", error);
  }
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

async function enforceSingleFeaturedPhoto(id: number, isFeatured: boolean) {
  if (isFeatured) {
    await clearFeaturedGalleryPhotosExcept(id);
  }
}

export async function createAdminGalleryAction(
  formData: FormData,
): Promise<AdminGalleryActionResult> {
  const normalizedMetadata = normalizeGalleryMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const file = getImageFile(formData);
  const fileError = validateImageFile(file, true);

  if (fileError) {
    return fileError;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  if (!hasBlobToken()) {
    return { success: false, message: "缺少 BLOB_READ_WRITE_TOKEN，无法上传图片" };
  }

  let uploadedImage: GalleryImageUpload;

  try {
    uploadedImage = await uploadGalleryImage(file as File);
  } catch {
    return { success: false, message: "图片上传失败，请稍后再试" };
  }

  try {
    const photo = await createGalleryPhoto({
      ...normalizedMetadata,
      imageSrc: uploadedImage.imageSrc,
      sourceKey: uploadedImage.sourceKey,
    });

    try {
      await enforceSingleFeaturedPhoto(photo.id, normalizedMetadata.isFeatured);
    } catch (error) {
      console.error("Failed to update featured gallery photo:", error);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");

    return { success: true, id: photo.id };
  } catch {
    await deleteGalleryBlob(uploadedImage.sourceKey);
    return { success: false, message: "照片创建失败，请稍后再试" };
  }
}

export async function updateAdminGalleryAction(
  id: number,
  formData: FormData,
): Promise<AdminGalleryActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "照片不存在" };
  }

  const normalizedMetadata = normalizeGalleryMetadata(formData);

  if (isActionError(normalizedMetadata)) {
    return normalizedMetadata;
  }

  const file = getImageFile(formData);
  const fileError = validateImageFile(file, false);

  if (fileError) {
    return fileError;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentPhoto = await getAdminGalleryPhotoById(id);

  if (!currentPhoto) {
    return { success: false, message: "照片不存在" };
  }

  if (file && !hasBlobToken()) {
    return { success: false, message: "缺少 BLOB_READ_WRITE_TOKEN，无法上传图片" };
  }

  let uploadedImage: GalleryImageUpload | undefined;

  try {
    uploadedImage = file ? await uploadGalleryImage(file) : undefined;
  } catch {
    return { success: false, message: "图片上传失败，请稍后再试" };
  }

  try {
    const photo = await updateGalleryPhotoById(id, {
      ...normalizedMetadata,
      imageSrc: uploadedImage?.imageSrc ?? currentPhoto.imageSrc,
      sourceKey: uploadedImage?.sourceKey ?? currentPhoto.sourceKey,
    });

    if (!photo) {
      await deleteGalleryBlob(uploadedImage?.sourceKey);
      return { success: false, message: "照片不存在" };
    }

    try {
      await enforceSingleFeaturedPhoto(id, normalizedMetadata.isFeatured);
    } catch (error) {
      console.error("Failed to update featured gallery photo:", error);
    }

    if (uploadedImage) {
      await deleteGalleryBlob(currentPhoto.sourceKey);
    }

    revalidatePath("/admin/gallery");
    revalidatePath(`/admin/gallery/${id}/edit`);
    revalidatePath("/gallery");

    return { success: true, id: photo.id };
  } catch {
    await deleteGalleryBlob(uploadedImage?.sourceKey);
    return { success: false, message: "照片更新失败，请稍后再试" };
  }
}

export async function deleteAdminGalleryAction(id: number): Promise<AdminGalleryActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "照片不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentPhoto = await getAdminGalleryPhotoById(id);

  if (!currentPhoto) {
    return { success: false, message: "照片不存在或已被删除" };
  }

  try {
    const photo = await deleteGalleryPhotoById(id);

    if (!photo) {
      return { success: false, message: "照片不存在或已被删除" };
    }

    await deleteGalleryBlob(currentPhoto.sourceKey);

    revalidatePath("/admin/gallery");
    revalidatePath(`/admin/gallery/${id}/edit`);
    revalidatePath("/gallery");

    return { success: true, id: photo.id };
  } catch {
    return { success: false, message: "照片删除失败，请稍后再试" };
  }
}
