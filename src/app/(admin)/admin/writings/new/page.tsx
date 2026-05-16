import { AdminWritingCreateContent } from "@/components/pages/admin/writings/admin-writing-create-content";
import { writingCategories } from "@/components/pages/writing/writing-data";

export default function AdminNewWritingPage() {
  return <AdminWritingCreateContent categories={writingCategories} />;
}
