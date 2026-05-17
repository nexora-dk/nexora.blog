"use server";

import { revalidatePath } from "next/cache";

import { createFriendLinkApplication } from "@/db/queries/friend-links.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

const MAX_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;
const MAX_URL_LENGTH = 1000;

type FriendLinkApplicationActionResult =
  | { success: true }
  | { success: false; message: string };

type FriendLinkApplicationActionError = Extract<
  FriendLinkApplicationActionResult,
  { success: false }
>;

type FriendLinkApplicationInput = {
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
};

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeFriendLinkApplication(
  formData: FormData,
): FriendLinkApplicationActionError | FriendLinkApplicationInput {
  const name = getStringField(formData, "name");
  const blogUrl = getStringField(formData, "blogUrl");
  const avatarUrl = getStringField(formData, "avatarUrl");
  const description = getStringField(formData, "description");

  if (!name) {
    return { success: false, message: "请填写站点名称" };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { success: false, message: "站点名称过长" };
  }

  if (!blogUrl) {
    return { success: false, message: "请填写博客 URL" };
  }

  if (!avatarUrl) {
    return { success: false, message: "请填写头像 URL" };
  }

  if (!description) {
    return { success: false, message: "请填写站点描述" };
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return { success: false, message: "站点描述过长" };
  }

  if (blogUrl.length > MAX_URL_LENGTH || avatarUrl.length > MAX_URL_LENGTH) {
    return { success: false, message: "链接地址过长" };
  }

  if (!isValidUrl(blogUrl)) {
    return { success: false, message: "博客 URL 必须是有效的 http(s) 地址" };
  }

  if (!isValidUrl(avatarUrl)) {
    return { success: false, message: "头像 URL 必须是有效的 http(s) 地址" };
  }

  return {
    name,
    description,
    avatarUrl,
    blogUrl,
  };
}

function isActionError(
  value: FriendLinkApplicationActionError | FriendLinkApplicationInput,
): value is FriendLinkApplicationActionError {
  return "success" in value && !value.success;
}

export async function createFriendLinkApplicationAction(
  formData: FormData,
): Promise<FriendLinkApplicationActionResult> {
  const normalizedApplication = normalizeFriendLinkApplication(formData);

  if (isActionError(normalizedApplication)) {
    return normalizedApplication;
  }

  try {
    const settings = await getSiteSettings();

    if (!settings.friendApplyEnabled) {
      return { success: false, message: "友链申请暂未开放" };
    }

    await createFriendLinkApplication(normalizedApplication);
    revalidatePath("/admin/friends");

    return { success: true };
  } catch {
    return { success: false, message: "友链申请提交失败，请稍后再试" };
  }
}
