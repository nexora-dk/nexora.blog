import { AdminDashboardContent } from "@/components/pages/admin/admin-dashboard-content";
import { getAdminDashboardOverview } from "@/db/queries/admin-dashboard.query";

export default async function AdminPage() {
  const overview = await getAdminDashboardOverview();

  return <AdminDashboardContent overview={overview} />;
}
