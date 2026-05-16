import { Settings } from "lucide-react";

import { AdminEmptyPage } from "@/components/pages/admin/admin-empty-page";

export default function AdminSettingsPage() {
  return (
    <AdminEmptyPage
      title="设置"
      description="管理站点信息、SEO、社交链接和后台偏好。"
      icon={Settings}
      actionLabel="保存设置"
    />
  );
}
