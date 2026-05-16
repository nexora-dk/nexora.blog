"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import {
  deleteAdminComment,
  type AdminCommentItem,
} from "@/db/queries/admin-comments.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

type AdminCommentActionResult =
  | { success: true }
  | { success: false; message: string };

export async function deleteAdminCommentAction(input: {
  id: number;
  source: AdminCommentItem["source"];
}): Promise<AdminCommentActionResult> {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    return { success: false, message: "评论不存在" };
  }

  if (input.source !== "writing" && input.source !== "note") {
    return { success: false, message: "评论来源无效" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!isAdminEmail(session?.user.email)) {
    return { success: false, message: "没有操作权限" };
  }

  try {
    const deleted = await deleteAdminComment({
      id: input.id,
      source: input.source,
    });

    if (!deleted) {
      return { success: false, message: "评论不存在或已被删除" };
    }

    revalidatePath("/admin/comments");

    return { success: true };
  } catch {
    return { success: false, message: "评论删除失败，请稍后再试" };
  }
}
