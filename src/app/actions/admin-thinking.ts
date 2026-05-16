"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createThinking,
  deleteThinkingById,
  getAdminThinkingById,
  updateThinkingById,
} from "@/db/queries/thinking.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

const MAX_CONTENT_LENGTH = 5000;

export type AdminThinkingFormInput = {
  content: string;
  publishedAt: string;
  time: string;
  mood: string;
  isVisible: boolean;
};

type NormalizedThinkingInput = {
  content: string;
  publishedAt: string;
  time: string | null;
  mood: string | null;
  isVisible: boolean;
};

type AdminThinkingActionResult =
  | { success: true; id: number }
  | { success: false; message: string };

type AdminThinkingActionError = Extract<AdminThinkingActionResult, { success: false }>;

function getTodayText() {
  const date = new Date();

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function normalizeThinkingInput(
  input: AdminThinkingFormInput,
): AdminThinkingActionError | NormalizedThinkingInput {
  const content = input.content.trim();
  const publishedAt = input.publishedAt.trim() || getTodayText();
  const time = input.time.trim() || null;
  const mood = input.mood.trim() || null;

  if (!content) {
    return { success: false, message: "思考内容不能为空" };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return { success: false, message: "思考内容过长" };
  }

  if (typeof input.isVisible !== "boolean") {
    return { success: false, message: "展示状态无效" };
  }

  return {
    content,
    publishedAt,
    time,
    mood,
    isVisible: input.isVisible,
  };
}

function isActionError(value: AdminThinkingActionError | NormalizedThinkingInput): value is AdminThinkingActionError {
  return "success" in value && !value.success;
}

function isValidId(id: number) {
  return Number.isInteger(id) && id > 0;
}

async function isCurrentUserAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return isAdminEmail(session?.user.email);
}

export async function createAdminThinkingAction(
  input: AdminThinkingFormInput,
): Promise<AdminThinkingActionResult> {
  const normalizedInput = normalizeThinkingInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  try {
    const thought = await createThinking(normalizedInput);

    revalidatePath("/admin/thinking");
    revalidatePath("/thinking");

    return { success: true, id: thought.id };
  } catch {
    return { success: false, message: "思考创建失败，请稍后再试" };
  }
}

export async function updateAdminThinkingAction(
  id: number,
  input: AdminThinkingFormInput,
): Promise<AdminThinkingActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "思考不存在" };
  }

  const normalizedInput = normalizeThinkingInput(input);

  if (isActionError(normalizedInput)) {
    return normalizedInput;
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentThought = await getAdminThinkingById(id);

  if (!currentThought) {
    return { success: false, message: "思考不存在" };
  }

  try {
    const thought = await updateThinkingById(id, normalizedInput);

    if (!thought) {
      return { success: false, message: "思考不存在" };
    }

    revalidatePath("/admin/thinking");
    revalidatePath(`/admin/thinking/${id}/edit`);
    revalidatePath("/thinking");

    return { success: true, id: thought.id };
  } catch {
    return { success: false, message: "思考更新失败，请稍后再试" };
  }
}

export async function deleteAdminThinkingAction(id: number): Promise<AdminThinkingActionResult> {
  if (!isValidId(id)) {
    return { success: false, message: "思考不存在" };
  }

  const isAdmin = await isCurrentUserAdmin();

  if (!isAdmin) {
    return { success: false, message: "没有操作权限" };
  }

  const currentThought = await getAdminThinkingById(id);

  if (!currentThought) {
    return { success: false, message: "思考不存在或已被删除" };
  }

  try {
    const thought = await deleteThinkingById(id);

    if (!thought) {
      return { success: false, message: "思考不存在或已被删除" };
    }

    revalidatePath("/admin/thinking");
    revalidatePath(`/admin/thinking/${id}/edit`);
    revalidatePath("/thinking");

    return { success: true, id: thought.id };
  } catch {
    return { success: false, message: "思考删除失败，请稍后再试" };
  }
}
