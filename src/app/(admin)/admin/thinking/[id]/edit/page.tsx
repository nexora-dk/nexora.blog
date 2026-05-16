import { notFound } from "next/navigation";

import { AdminThinkingCreateContent } from "@/components/pages/admin/thinking/admin-thinking-create-content";
import { getAdminThinkingById } from "@/db/queries/thinking.query";

type AdminEditThinkingPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditThinkingPage({
  params,
}: AdminEditThinkingPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const thought = await getAdminThinkingById(numericId);

  if (!thought) {
    notFound();
  }

  return (
    <AdminThinkingCreateContent
      mode="edit"
      initialValue={{
        id: thought.id,
        content: thought.content,
        publishedAt: thought.publishedAt,
        time: thought.time ?? "",
        mood: thought.mood ?? "",
        isVisible: thought.isVisible,
      }}
    />
  );
}
