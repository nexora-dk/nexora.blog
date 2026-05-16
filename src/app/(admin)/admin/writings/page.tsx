import { AdminWritingsContent } from "@/components/pages/admin/writings/admin-writings-content";
import { getWritingItems } from "@/db/queries/writings.query";

export default async function AdminWritingsPage() {
  const writings = await getWritingItems();

  return <AdminWritingsContent writings={writings} />;
}
