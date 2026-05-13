"use server";

import { revalidatePath } from "next/cache";

import { createWritingComment } from "@/db/queries/writing-comments.query";

type CommentActionResult =
  | { success: true }
  | { success: false; message: string };

export async function createWritingCommentAction(input: {
  slug: string;
  authorName: string;
  content: string;
}): Promise<CommentActionResult> {
  const authorName = input.authorName.trim() || "匿名访客";
  const content = input.content.trim();

  if (!content) {
    return { success: false, message: "评论内容不能为空" };
  }

  if (authorName.length > 80) {
    return { success: false, message: "昵称不能超过 80 个字" };
  }

  if (content.length > 2000) {
    return { success: false, message: "评论不能超过 2000 个字" };
  }

  try {
    await createWritingComment({
      slug: input.slug,
      authorName,
      content,
    });

    revalidatePath(`/writing/${input.slug}`);

    return { success: true };
  } catch {
    return { success: false, message: "评论发布失败，请稍后再试" };
  }
}
