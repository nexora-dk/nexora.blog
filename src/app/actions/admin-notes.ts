"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import matter from "gray-matter";

import {
  createNote,
  deleteNoteBySlug,
  getAdminNoteBySlug,
  getNoteExistsBySlugOrHref,
  updateNoteBySlug,
} from "@/db/queries/notes.query";
import {
  isNoteColumn,
  noteColumns,
  type NoteColumn,
} from "@/components/pages/notes/notes-data";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT_LENGTH = 200000;

export type AdminNoteFormInput = {
  title: string;
  slug: string;
  description: string;
  column: string;
  mood: string;
  location: string;
  tags: string;
  date: string;
  publishedAt: string;
  readingTime: string;
  insight: string;
  content: string;
};

export type CreateAdminNoteInput = AdminNoteFormInput;
export type UpdateAdminNoteInput = AdminNoteFormInput;

type NormalizedNoteInput = {
  title: string;
  slug: string;
  description: string;
  column: NoteColumn;
  columnLabel: string;
  mood: string | null;
  location: string | null;
  tags: string[];
  date: string;
  publishedAt: string;
  readingTime: string;
  insight: string;
  content: string;
};

type AdminNoteActionResult =
  | { success: true; slug: string }
  | { success: false; message: string };

type AdminNoteActionError = Extract<AdminNoteActionResult, { success: false }>;

function getTodayText() {
  const date = new Date();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日星期${weekdays[date.getDay()]}`;
}

function getPublishedAtFromDate(date: string) {
  return date.replace(/星期[日一二三四五六]$/, "");
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

function getSafeNotePath(slug: string) {
  const notesDirectory = path.resolve(process.cwd(), "data", "notes");
  const filePath = path.resolve(notesDirectory, `${slug}.md`);
  const relativePath = path.relative(notesDirectory, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return {
    notesDirectory,
    filePath,
  };
}

function normalizeNoteInput(input: AdminNoteFormInput): AdminNoteActionError | NormalizedNoteInput {
  const title = input.title.trim();
  const slug = input.slug.trim().toLowerCase();
  const description = input.description.trim();
  const column = input.column.trim();
  const mood = input.mood.trim() || null;
  const location = input.location.trim() || null;
  const content = input.content.trim();
  const date = input.date.trim() || getTodayText();
  const publishedAt = input.publishedAt.trim() || getPublishedAtFromDate(date);
  const readingTime = input.readingTime.trim() || estimateReadingTime(content);
  const insight = input.insight.trim() || description;
  const tags = parseTags(input.tags);

  if (!title) {
    return { success: false, message: "标题不能为空" };
  }

  if (!slug || !SLUG_PATTERN.test(slug)) {
    return { success: false, message: "Slug 格式无效，请使用小写英文、数字和连字符" };
  }

  if (!description) {
    return { success: false, message: "手记摘要不能为空" };
  }

  if (!isNoteColumn(column)) {
    return { success: false, message: "手记专栏无效" };
  }

  if (!content) {
    return { success: false, message: "手记正文不能为空" };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { success: false, message: "手记正文过长" };
  }

  const columnLabel = noteColumns.find((item) => item.value === column)?.label ?? "近况";

  return {
    title,
    slug,
    description,
    column,
    columnLabel,
    mood,
    location,
    tags,
    date,
    publishedAt,
    readingTime,
    insight,
    content,
  };
}

function isActionError(value: AdminNoteActionError | NormalizedNoteInput): value is AdminNoteActionError {
  return "success" in value && !value.success;
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

function buildNoteMarkdown(input: NormalizedNoteInput, counts: { views: number; likes: number }) {
  return matter.stringify(input.content, {
    title: input.title,
    description: input.description,
    date: input.date,
    column: input.column,
    columnLabel: input.columnLabel,
    ...(input.mood ? { mood: input.mood } : {}),
    ...(input.location ? { location: input.location } : {}),
    tags: input.tags,
    publishedAt: input.publishedAt,
    views: String(counts.views),
    likes: String(counts.likes),
    readingTime: input.readingTime,
    insight: input.insight,
  });
}

export async function createAdminNoteAction(
  input: CreateAdminNoteInput,
): Promise<AdminNoteActionResult> {
  const normalizedInput = normalizeNoteInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const paths = getSafeNotePath(normalizedInput.slug);

  if (!paths) {
    return { success: false, message: "Slug 格式无效，请使用小写英文、数字和连字符" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const href = `/notes/${normalizedInput.slug}`;
  const contentPath = `data/notes/${normalizedInput.slug}.md`;
  const markdown = buildNoteMarkdown(normalizedInput, {
    views: 0,
    likes: 0,
  });

  try {
    const exists = await getNoteExistsBySlugOrHref({
      slug: normalizedInput.slug,
      href,
    });

    if (exists) {
      return { success: false, message: "Slug 已存在，请换一个" };
    }

    await fs.mkdir(paths.notesDirectory, { recursive: true });
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
    const note = await createNote({
      slug: normalizedInput.slug,
      title: normalizedInput.title,
      description: normalizedInput.description,
      href,
      date: normalizedInput.date,
      column: normalizedInput.column,
      columnLabel: normalizedInput.columnLabel,
      mood: normalizedInput.mood,
      location: normalizedInput.location,
      tags: normalizedInput.tags,
      publishedAt: normalizedInput.publishedAt,
      views: 0,
      likes: 0,
      readingTime: normalizedInput.readingTime,
      insight: normalizedInput.insight,
      contentPath,
    });

    revalidatePath("/admin/notes");
    revalidatePath("/notes");
    revalidatePath(href);

    return { success: true, slug: note.slug };
  } catch {
    try {
      await fs.unlink(paths.filePath);
    } catch {
      return { success: false, message: "手记创建失败，请手动清理同名 Markdown 文件" };
    }

    return { success: false, message: "手记创建失败，请稍后再试" };
  }
}

export async function updateAdminNoteAction(
  slug: string,
  input: UpdateAdminNoteInput,
): Promise<AdminNoteActionResult> {
  const targetSlug = slug.trim().toLowerCase();
  const normalizedInput = normalizeNoteInput(input);

  if (!targetSlug || !SLUG_PATTERN.test(targetSlug)) {
    return { success: false, message: "手记不存在" };
  }

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  if (normalizedInput.slug !== targetSlug) {
    return { success: false, message: "Slug 暂不支持修改" };
  }

  const paths = getSafeNotePath(targetSlug);

  if (!paths) {
    return { success: false, message: "手记不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const note = await getAdminNoteBySlug(targetSlug);

  if (!note) {
    return { success: false, message: "手记不存在" };
  }

  let previousMarkdown: string;

  try {
    previousMarkdown = await fs.readFile(paths.filePath, "utf8");
  } catch {
    return { success: false, message: "Markdown 文件不存在" };
  }

  const markdown = buildNoteMarkdown(normalizedInput, {
    views: note.views,
    likes: note.likes,
  });

  try {
    await fs.writeFile(paths.filePath, markdown, "utf8");
  } catch {
    return { success: false, message: "Markdown 文件更新失败，请稍后再试" };
  }

  try {
    const updatedNote = await updateNoteBySlug(targetSlug, {
      title: normalizedInput.title,
      description: normalizedInput.description,
      date: normalizedInput.date,
      column: normalizedInput.column,
      columnLabel: normalizedInput.columnLabel,
      mood: normalizedInput.mood,
      location: normalizedInput.location,
      tags: normalizedInput.tags,
      publishedAt: normalizedInput.publishedAt,
      readingTime: normalizedInput.readingTime,
      insight: normalizedInput.insight,
    });

    if (!updatedNote) {
      throw new Error("Note not found");
    }

    revalidatePath("/admin/notes");
    revalidatePath(`/admin/notes/${targetSlug}/edit`);
    revalidatePath("/notes");
    revalidatePath(`/notes/${targetSlug}`);

    return { success: true, slug: updatedNote.slug };
  } catch {
    try {
      await fs.writeFile(paths.filePath, previousMarkdown, "utf8");
    } catch {
      return { success: false, message: "手记更新失败，且 Markdown 回滚失败，请手动检查文件" };
    }

    return { success: false, message: "手记更新失败，请稍后再试" };
  }
}

export async function deleteAdminNoteAction(slug: string): Promise<AdminNoteActionResult> {
  const targetSlug = slug.trim().toLowerCase();

  if (!targetSlug || !SLUG_PATTERN.test(targetSlug)) {
    return { success: false, message: "手记不存在" };
  }

  const paths = getSafeNotePath(targetSlug);

  if (!paths) {
    return { success: false, message: "手记不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const note = await getAdminNoteBySlug(targetSlug);

  if (!note) {
    return { success: false, message: "手记不存在或已被删除" };
  }

  let previousMarkdown: string | undefined;

  try {
    previousMarkdown = await fs.readFile(paths.filePath, "utf8");
  } catch (error) {
    const errorCode = error && typeof error === "object" && "code" in error ? error.code : undefined;

    if (errorCode !== "ENOENT") {
      return { success: false, message: "Markdown 文件读取失败，请稍后再试" };
    }
  }

  if (previousMarkdown) {
    try {
      await fs.unlink(paths.filePath);
    } catch {
      return { success: false, message: "Markdown 文件删除失败，请稍后再试" };
    }
  }

  try {
    const deletedNote = await deleteNoteBySlug(targetSlug);

    if (!deletedNote) {
      throw new Error("Note not found");
    }

    revalidatePath("/admin/notes");
    revalidatePath(`/admin/notes/${targetSlug}/edit`);
    revalidatePath("/notes");
    revalidatePath(`/notes/${targetSlug}`);
    revalidatePath("/admin/comments");

    return { success: true, slug: deletedNote.slug };
  } catch {
    if (previousMarkdown) {
      try {
        await fs.writeFile(paths.filePath, previousMarkdown, {
          encoding: "utf8",
          flag: "wx",
        });
      } catch {
        return { success: false, message: "手记删除失败，且 Markdown 回滚失败，请手动恢复文件" };
      }
    }

    return { success: false, message: "手记删除失败，请稍后再试" };
  }
}
