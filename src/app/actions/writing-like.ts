"use server";

import { updateWritingLikes } from "@/db/queries/writings.query";

export async function updateWritingLikeAction(slug: string, liked: boolean) {
  await updateWritingLikes(slug, liked ? 1 : -1);
}
