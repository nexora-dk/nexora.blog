import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { AdminShell } from "@/components/pages/admin/admin-shell";
import { isAdminEmail } from "@/lib/admin";
import { auth } from "@/lib/auth";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!isAdminEmail(session?.user.email)) {
    notFound();
  }

  return <AdminShell>{children}</AdminShell>;
}
