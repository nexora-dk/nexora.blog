"use server";

import { updateNoteLikes } from "@/db/queries/notes.query";

export async function updateNoteLikeAction(slug: string, liked: boolean) {
  await updateNoteLikes(slug, liked ? 1 : -1);
}
