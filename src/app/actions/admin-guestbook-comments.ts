"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { deleteAdminGuestbookComment } from "@/db/queries/guestbook-comments.query";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

type AdminCommentActionResult =
  | { success: true }
  | { success: false; message: string };

export async function deleteAdminGuestbookCommentAction(input: {
  id: number;
}): Promise<AdminCommentActionResult> {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    return { success: false, message: "留言不存在" };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!isAdminEmail(session?.user.email)) {
    return { success: false, message: "没有操作权限" };
  }

  try {
    const deleted = await deleteAdminGuestbookComment({ id: input.id });

    if (!deleted) {
      return { success: false, message: "留言不存在或已被删除" };
    }

    revalidatePath("/admin/messages");
    revalidatePath("/Comments");

    return { success: true };
  } catch {
    return { success: false, message: "留言删除失败，请稍后再试" };
  }
}
