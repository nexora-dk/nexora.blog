"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  createReadmeComment,
  deleteReadmeComment,
} from "@/db/queries/readme-comments.query";
import { auth } from "@/lib/auth";

type CommentActionResult =
  | { success: true }
  | { success: false; message: string };

export async function createReadmeCommentAction(input: {
  content: string;
  parentId?: number | null;
}): Promise<CommentActionResult> {
  const content = input.content.trim();

  if (!content) {
    return { success: false, message: "评论内容不能为空" };
  }

  if (content.length > 2000) {
    return { success: false, message: "评论不能超过 2000 个字" };
  }

  if (
    input.parentId !== undefined &&
    input.parentId !== null &&
    (!Number.isInteger(input.parentId) || input.parentId <= 0)
  ) {
    return { success: false, message: "回复目标无效" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "请先登录后再评论" };
  }

  try {
    await createReadmeComment({
      userId: session.user.id,
      content,
      parentId: input.parentId ?? null,
    });

    revalidatePath("/Readme");

    return { success: true };
  } catch {
    return { success: false, message: "评论发布失败，请稍后再试" };
  }
}

export async function deleteReadmeCommentAction(input: {
  id: number;
}): Promise<CommentActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "请先登录后再操作" };
  }

  try {
    const deleted = await deleteReadmeComment({
      id: input.id,
      userId: session.user.id,
    });

    if (!deleted) {
      return { success: false, message: "只能删除自己的评论" };
    }

    revalidatePath("/Readme");

    return { success: true };
  } catch {
    return { success: false, message: "评论删除失败，请稍后再试" };
  }
}
