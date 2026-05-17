"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { updateSiteSettings } from "@/db/queries/site-settings.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";
import { defaultSiteSettings, type SiteSettings } from "@/lib/site-settings-defaults";

const MAX_SHORT_TEXT_LENGTH = 160;
const MAX_TEXT_LENGTH = 1000;
const MAX_URL_LENGTH = 1000;
const MAX_KEYWORDS_COUNT = 20;
const MAX_KEYWORD_LENGTH = 40;
const MAX_ROTATING_TEXTS_COUNT = 10;
const MAX_NOTES_COUNT = 10;
const adminEntryOptions = new Set([
  "/admin",
  "/admin/writings",
  "/admin/notes",
  "/admin/comments",
  "/admin/messages",
  "/admin/projects",
  "/admin/friends",
  "/admin/settings",
]);
const adminPageSizeOptions = new Set([5, 10, 20]);

type AdminSiteSettingsActionResult =
  | { success: true }
  | { success: false; message: string };

type AdminSiteSettingsActionError = Extract<
  AdminSiteSettingsActionResult,
  { success: false }
>;

function getStringField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBooleanField(formData: FormData, key: string) {
  return formData.get(key) === "true";
}

function parseStringList(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[，,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrlOrPath(value: string) {
  if (!value) {
    return false;
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

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getSelectNumberField(formData: FormData, key: string, fallback: number) {
  const value = Number(getStringField(formData, key));
  return Number.isInteger(value) ? value : fallback;
}

function requireText(
  input: SiteSettings,
  key: keyof SiteSettings,
  label: string,
  maxLength = MAX_TEXT_LENGTH,
): AdminSiteSettingsActionError | undefined {
  const value = input[key];

  if (typeof value !== "string") {
    return undefined;
  }

  if (!value) {
    return { success: false, message: `${label}不能为空` };
  }

  if (value.length > maxLength) {
    return { success: false, message: `${label}过长` };
  }

  return undefined;
}

function validateUrlOrPath(value: string, label: string) {
  if (value.length > MAX_URL_LENGTH) {
    return { success: false as const, message: `${label}过长` };
  }

  if (!isValidUrlOrPath(value)) {
    return { success: false as const, message: `${label}必须是 / 开头路径或有效的 http(s) 地址` };
  }

  return undefined;
}

function validateHttpUrl(value: string, label: string) {
  if (value.length > MAX_URL_LENGTH) {
    return { success: false as const, message: `${label}过长` };
  }

  if (!isValidHttpUrl(value)) {
    return { success: false as const, message: `${label}必须是有效的 http(s) 地址` };
  }

  return undefined;
}

function normalizeSiteSettings(
  formData: FormData,
): SiteSettings | AdminSiteSettingsActionError {
  const seoKeywords = parseStringList(getStringField(formData, "seoKeywords"));
  const homeRotatingTexts = parseStringList(getStringField(formData, "homeRotatingTexts"));
  const friendApplyNotes = parseStringList(getStringField(formData, "friendApplyNotes"));
  const adminPageSize = getSelectNumberField(
    formData,
    "adminPageSize",
    defaultSiteSettings.adminPageSize,
  );
  const adminDefaultEntry = getStringField(formData, "adminDefaultEntry");
  const settings: SiteSettings = {
    siteName: getStringField(formData, "siteName"),
    siteDescription: getStringField(formData, "siteDescription"),
    siteUrl: getStringField(formData, "siteUrl"),
    rssUrl: getStringField(formData, "rssUrl"),
    seoTitleTemplate: getStringField(formData, "seoTitleTemplate"),
    seoKeywords,
    seoDescription: getStringField(formData, "seoDescription"),
    authorName: getStringField(formData, "authorName"),
    avatarUrl: getStringField(formData, "avatarUrl"),
    signatureUrl: getStringField(formData, "signatureUrl"),
    contactEmail: getStringField(formData, "contactEmail"),
    githubUrl: getStringField(formData, "githubUrl"),
    neteaseMusicUrl: getStringField(formData, "neteaseMusicUrl"),
    douyinUrl: getStringField(formData, "douyinUrl"),
    wechatQrUrl: getStringField(formData, "wechatQrUrl"),
    footerDescription: getStringField(formData, "footerDescription"),
    footerStatusText: getStringField(formData, "footerStatusText"),
    homeHeroPrefix: getStringField(formData, "homeHeroPrefix"),
    homeHeroSuffix: getStringField(formData, "homeHeroSuffix"),
    homeShareText: getStringField(formData, "homeShareText"),
    homeLocationText: getStringField(formData, "homeLocationText"),
    homeRotatingTexts,
    learningStartedAt: getStringField(formData, "learningStartedAt"),
    mottoCodeText: getStringField(formData, "mottoCodeText"),
    mottoCnPrefix: getStringField(formData, "mottoCnPrefix"),
    mottoCnHighlightA: getStringField(formData, "mottoCnHighlightA"),
    mottoCnMiddle: getStringField(formData, "mottoCnMiddle"),
    mottoCnHighlightB: getStringField(formData, "mottoCnHighlightB"),
    mottoCnSuffix: getStringField(formData, "mottoCnSuffix"),
    mottoEnText: getStringField(formData, "mottoEnText"),
    friendPageTitle: getStringField(formData, "friendPageTitle"),
    friendPageDescription: getStringField(formData, "friendPageDescription"),
    friendApplyEnabled: getBooleanField(formData, "friendApplyEnabled"),
    friendApplyIntro: getStringField(formData, "friendApplyIntro"),
    friendApplyNotes,
    friendOwnName: getStringField(formData, "friendOwnName"),
    friendOwnUrl: getStringField(formData, "friendOwnUrl"),
    friendOwnAvatarUrl: getStringField(formData, "friendOwnAvatarUrl"),
    friendOwnDescription: getStringField(formData, "friendOwnDescription"),
    friendApplySuccessMessage: getStringField(formData, "friendApplySuccessMessage"),
    adminPageSize,
    adminDefaultEntry,
  };

  const requiredTextFields: Array<[keyof SiteSettings, string, number?]> = [
    ["siteName", "站点名称", MAX_SHORT_TEXT_LENGTH],
    ["siteDescription", "站点描述"],
    ["seoTitleTemplate", "标题模板", MAX_SHORT_TEXT_LENGTH],
    ["seoDescription", "SEO 默认描述"],
    ["authorName", "作者名称", 80],
    ["footerDescription", "页脚描述"],
    ["footerStatusText", "页脚状态", 80],
    ["homeHeroPrefix", "Hero 前缀", 80],
    ["homeHeroSuffix", "Hero 后缀", 120],
    ["homeShareText", "首页分享引导", 80],
    ["homeLocationText", "位置文本", 120],
    ["learningStartedAt", "学习开始时间", 40],
    ["mottoCodeText", "座右铭代码", 120],
    ["mottoCnPrefix", "中文座右铭前缀", 80],
    ["mottoCnHighlightA", "中文座右铭高亮一", 80],
    ["mottoCnMiddle", "中文座右铭中段", 80],
    ["mottoCnHighlightB", "中文座右铭高亮二", 80],
    ["mottoCnSuffix", "中文座右铭后缀", 80],
    ["mottoEnText", "英文座右铭"],
    ["friendPageTitle", "友链页标题", 80],
    ["friendPageDescription", "友链页描述"],
    ["friendApplyIntro", "友链申请说明"],
    ["friendOwnName", "本站友链名称", 120],
    ["friendOwnDescription", "本站友链描述"],
    ["friendApplySuccessMessage", "友链申请成功文案"],
  ];

  for (const [key, label, maxLength] of requiredTextFields) {
    const error = requireText(settings, key, label, maxLength);

    if (error) {
      return error;
    }
  }

  if (!isValidEmail(settings.contactEmail)) {
    return { success: false, message: "联系邮箱格式不正确" };
  }

  if (settings.seoKeywords.length > MAX_KEYWORDS_COUNT) {
    return { success: false, message: "SEO 关键词过多" };
  }

  if (settings.seoKeywords.some((keyword) => keyword.length > MAX_KEYWORD_LENGTH)) {
    return { success: false, message: "SEO 关键词过长" };
  }

  if (settings.homeRotatingTexts.length === 0) {
    return { success: false, message: "首页滚动文案不能为空" };
  }

  if (settings.homeRotatingTexts.length > MAX_ROTATING_TEXTS_COUNT) {
    return { success: false, message: "首页滚动文案过多" };
  }

  if (settings.friendApplyNotes.length === 0) {
    return { success: false, message: "友链申请确认事项不能为空" };
  }

  if (settings.friendApplyNotes.length > MAX_NOTES_COUNT) {
    return { success: false, message: "友链申请确认事项过多" };
  }

  const urlChecks = [
    validateHttpUrl(settings.siteUrl, "站点 URL"),
    validateUrlOrPath(settings.rssUrl, "RSS 地址"),
    validateUrlOrPath(settings.avatarUrl, "头像地址"),
    validateUrlOrPath(settings.signatureUrl, "签名图片地址"),
    validateHttpUrl(settings.githubUrl, "GitHub 地址"),
    validateHttpUrl(settings.neteaseMusicUrl, "网易云音乐地址"),
    validateHttpUrl(settings.douyinUrl, "抖音地址"),
    validateUrlOrPath(settings.wechatQrUrl, "微信二维码地址"),
    validateHttpUrl(settings.friendOwnUrl, "本站友链链接"),
    validateHttpUrl(settings.friendOwnAvatarUrl, "本站友链头像"),
  ];

  for (const error of urlChecks) {
    if (error) {
      return error;
    }
  }

  if (!adminPageSizeOptions.has(settings.adminPageSize)) {
    return { success: false, message: "后台每页显示数量无效" };
  }

  if (!adminEntryOptions.has(settings.adminDefaultEntry)) {
    return { success: false, message: "默认后台入口无效" };
  }

  return settings;
}

function isActionError(
  value: SiteSettings | AdminSiteSettingsActionError,
): value is AdminSiteSettingsActionError {
  return "success" in value && !value.success;
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

export async function updateAdminSiteSettingsAction(
  formData: FormData,
): Promise<AdminSiteSettingsActionResult> {
  const normalizedSettings = normalizeSiteSettings(formData);

  if (isActionError(normalizedSettings)) {
    return normalizedSettings;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  try {
    await updateSiteSettings(normalizedSettings);
    revalidatePath("/admin/settings");
    revalidatePath("/friends");
    revalidatePath("/", "layout");

    return { success: true };
  } catch {
    return { success: false, message: "设置保存失败，请稍后再试" };
  }
}
