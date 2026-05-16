"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import matter from "gray-matter";

import {
  createWriting,
  deleteWritingBySlug,
  getAdminWritingBySlug,
  getWritingExistsBySlugOrHref,
  updateWritingBySlug,
} from "@/db/queries/writings.query";
import {
  isArticleCategory,
  writingCategories,
  type ArticleCategory,
} from "@/components/pages/writing/writing-data";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT_LENGTH = 200000;

export type AdminWritingFormInput = {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
  date: string;
  readingTime: string;
  content: string;
};

export type CreateAdminWritingInput = AdminWritingFormInput;
export type UpdateAdminWritingInput = AdminWritingFormInput;

type NormalizedWritingInput = {
  title: string;
  slug: string;
  description: string;
  category: ArticleCategory;
  categoryLabel: string;
  tags: string[];
  date: string;
  readingTime: string;
  content: string;
};

type AdminWritingActionResult =
  | { success: true; slug: string }
  | { success: false; message: string };

type AdminWritingActionError = Extract<
  AdminWritingActionResult,
  { success: false }
>;

function getTodayText() {
  const date = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日星期${weekdays[date.getDay()]}`;
}

function parseTags(value: string) {
  return Array.from(
    new Set(
      value
        .split(/[,，\n]/)
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ).slice(0, 10);
}

function estimateReadingTime(content: string) {
  const plainText = content.replace(/```[\s\S]*?```/g, "").replace(/[#*_`>\-[\]()]/g, "");
  const minutes = Math.max(1, Math.ceil(plainText.trim().length / 500));

  return `${minutes} 分钟`;
}

function getSafeWritingPath(slug: string) {
  const writingDirectory = path.resolve(process.cwd(), "data", "writing");
  const filePath = path.resolve(writingDirectory, `${slug}.md`);
  const relativePath = path.relative(writingDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return {
    writingDirectory,
    filePath,
  };
}

function normalizeWritingInput(input: AdminWritingFormInput): AdminWritingActionError | NormalizedWritingInput {
  const title = input.title.trim();
  const slug = input.slug.trim().toLowerCase();
  const description = input.description.trim();
  const category = input.category.trim();
  const content = input.content.trim();
  const date = input.date.trim() || getTodayText();
  const readingTime = input.readingTime.trim() || estimateReadingTime(content);
  const tags = parseTags(input.tags);

  if (!title) {
    return { success: false, message: "标题不能为空" };
  }

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return { success: false, message: "Slug 格式无效，请使用小写英文、数字和连字符" };
  }

  if (!description) {
    return { success: false, message: "文稿摘要不能为空" };
  }

  if (!isArticleCategory(category)) {
    return { success: false, message: "文稿分类无效" };
  }

  if (!content) {
    return { success: false, message: "文稿正文不能为空" };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { success: false, message: "文稿正文过长" };
  }

  const categoryLabel = writingCategories.find((item) => item.value === category)?.label ?? "技术";

  return {
    title,
    slug,
    description,
    category,
    categoryLabel,
    tags,
    date,
    readingTime,
    content,
  };
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

function buildWritingMarkdown(input: NormalizedWritingInput, counts: { views: number; likes: number }) {
  return matter.stringify(input.content, {
    title: input.title,
    description: input.description,
    date: input.date,
    category: input.category,
    categoryLabel: input.categoryLabel,
    tags: input.tags,
    readingTime: input.readingTime,
    views: String(counts.views),
    likes: String(counts.likes),
    modifiedTime: input.date,
  });
}

function isActionError(value: AdminWritingActionError | NormalizedWritingInput): value is AdminWritingActionError {
  return "success" in value && !value.success;
}

export async function createAdminWritingAction(
  input: CreateAdminWritingInput,
): Promise<AdminWritingActionResult> {
  const normalizedInput = normalizeWritingInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const paths = getSafeWritingPath(normalizedInput.slug);

  if (!paths) {
    return { success: false, message: "Slug 格式无效，请使用小写英文、数字和连字符" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const href = `/writing/${normalizedInput.slug}`;
  const contentPath = `data/writing/${normalizedInput.slug}.md`;
  const markdown = buildWritingMarkdown(normalizedInput, {
    views: 0,
    likes: 0,
  });

  try {
    const exists = await getWritingExistsBySlugOrHref({
      slug: normalizedInput.slug,
      href,
    });

    if (exists) {
      return { success: false, message: "Slug 已存在，请换一个" };
    }

    await fs.mkdir(paths.writingDirectory, { recursive: true });
    await fs.writeFile(paths.filePath, markdown, {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
      return { success: false, message: "同名 Markdown 文件已存在" };
    }

    return { success: false, message: "Markdown 文件创建失败，请稍后再试" };
  }

  try {
    const writing = await createWriting({
      slug: normalizedInput.slug,
      title: normalizedInput.title,
      description: normalizedInput.description,
      href,
      date: normalizedInput.date,
      category: normalizedInput.category,
      categoryLabel: normalizedInput.categoryLabel,
      tags: normalizedInput.tags,
      readingTime: normalizedInput.readingTime,
      views: 0,
      likes: 0,
      modifiedTime: normalizedInput.date,
      contentPath,
    });

    revalidatePath("/admin/writings");
    revalidatePath("/writing");
    revalidatePath(href);

    return { success: true, slug: writing.slug };
  } catch {
    try {
      await fs.unlink(paths.filePath);
    } catch {
      return { success: false, message: "文稿创建失败，请手动清理同名 Markdown 文件" };
    }

    return { success: false, message: "文稿创建失败，请稍后再试" };
  }
}

export async function updateAdminWritingAction(
  slug: string,
  input: UpdateAdminWritingInput,
): Promise<AdminWritingActionResult> {
  const targetSlug = slug.trim().toLowerCase();
  const normalizedInput = normalizeWritingInput(input);

  if (!targetSlug || !SLUG_PATTERN.test(targetSlug)) {
    return { success: false, message: "文稿不存在" };
  }

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  if (normalizedInput.slug !== targetSlug) {
    return { success: false, message: "Slug 暂不支持修改" };
  }

  const paths = getSafeWritingPath(targetSlug);

  if (!paths) {
    return { success: false, message: "文稿不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const writing = await getAdminWritingBySlug(targetSlug);

  if (!writing) {
    return { success: false, message: "文稿不存在" };
  }

  let previousMarkdown: string;

  try {
    previousMarkdown = await fs.readFile(paths.filePath, "utf8");
  } catch {
    return { success: false, message: "Markdown 文件不存在" };
  }

  const markdown = buildWritingMarkdown(normalizedInput, {
    views: writing.views,
    likes: writing.likes,
  });

  try {
    await fs.writeFile(paths.filePath, markdown, "utf8");
  } catch {
    return { success: false, message: "Markdown 文件更新失败，请稍后再试" };
  }

  try {
    const updatedWriting = await updateWritingBySlug(targetSlug, {
      title: normalizedInput.title,
      description: normalizedInput.description,
      date: normalizedInput.date,
      category: normalizedInput.category,
      categoryLabel: normalizedInput.categoryLabel,
      tags: normalizedInput.tags,
      readingTime: normalizedInput.readingTime,
      modifiedTime: normalizedInput.date,
    });

    if (!updatedWriting) {
      throw new Error("Writing not found");
    }

    revalidatePath("/admin/writings");
    revalidatePath(`/admin/writings/${targetSlug}/edit`);
    revalidatePath("/writing");
    revalidatePath(`/writing/${targetSlug}`);

    return { success: true, slug: updatedWriting.slug };
  } catch {
    try {
      await fs.writeFile(paths.filePath, previousMarkdown, "utf8");
    } catch {
      return { success: false, message: "文稿更新失败，且 Markdown 回滚失败，请手动检查文件" };
    }

    return { success: false, message: "文稿更新失败，请稍后再试" };
  }
}

export async function deleteAdminWritingAction(
  slug: string,
): Promise<AdminWritingActionResult> {
  const targetSlug = slug.trim().toLowerCase();

  if (!targetSlug || !SLUG_PATTERN.test(targetSlug)) {
    return { success: false, message: "文稿不存在" };
  }

  const paths = getSafeWritingPath(targetSlug);

  if (!paths) {
    return { success: false, message: "文稿不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const writing = await getAdminWritingBySlug(targetSlug);

  if (!writing) {
    return { success: false, message: "文稿不存在或已被删除" };
  }

  let previousMarkdown: string;

  try {
    previousMarkdown = await fs.readFile(paths.filePath, "utf8");
  } catch {
    return { success: false, message: "Markdown 文件不存在" };
  }

  try {
    await fs.unlink(paths.filePath);
  } catch {
    return { success: false, message: "Markdown 文件删除失败，请稍后再试" };
  }

  try {
    const deletedWriting = await deleteWritingBySlug(targetSlug);

    if (!deletedWriting) {
      throw new Error("Writing not found");
    }

    revalidatePath("/admin/writings");
    revalidatePath("/writing");
    revalidatePath(`/writing/${targetSlug}`);
    revalidatePath(`/admin/writings/${targetSlug}/edit`);
    revalidatePath("/admin/comments");

    return { success: true, slug: deletedWriting.slug };
  } catch {
    try {
      await fs.writeFile(paths.filePath, previousMarkdown, {
        encoding: "utf8",
        flag: "wx",
      });
    } catch {
      return { success: false, message: "文稿删除失败，且 Markdown 回滚失败，请手动恢复文件" };
    }

    return { success: false, message: "文稿删除失败，请稍后再试" };
  }
}
