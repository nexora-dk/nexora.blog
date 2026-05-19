"use server";

import { put } from "@vercel/blob";
import { headers } from "next/headers";

import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const imageExtensionsByType = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

type AdminMarkdownImageActionResult =
  | { success: true; url: string }
  | { success: false; message: string };

function getImageFile(formData: FormData) {
  const value = formData.get("imageFile");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

function validateImageFile(file: File | null) {
  if (!file) {
    return { success: false as const, message: "请选择要上传的图片" };
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

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

export async function uploadAdminMarkdownImageAction(
  formData: FormData,
): Promise<AdminMarkdownImageActionResult> {
  const file = getImageFile(formData);
  const fileError = validateImageFile(file);

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

  try {
    const extension = imageExtensionsByType.get((file as File).type) ?? ".jpg";
    const pathname = `markdown/${crypto.randomUUID()}${extension}`;
    const blob = await put(pathname, file as File, {
      access: "public",
      addRandomSuffix: false,
      contentType: (file as File).type,
    });

    return { success: true, url: blob.url };
  } catch {
    return { success: false, message: "图片上传失败，请稍后再试" };
  }
}
