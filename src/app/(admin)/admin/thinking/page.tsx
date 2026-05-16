import { Sparkles } from "lucide-react";

import { AdminEmptyPage } from "@/components/pages/admin/admin-empty-page";

export default function AdminThinkingPage() {
  return (
    <AdminEmptyPage
      title="思考"
      description="管理思考条目、灵感片段和公开展示状态。"
      icon={Sparkles}
      actionLabel="新增思考"
    />
  );
}
