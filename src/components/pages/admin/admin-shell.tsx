"use client";

import { useState } from "react";

import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,218,205,0.48),transparent_34%),radial-gradient(circle_at_top_right,rgba(214,224,255,0.42),transparent_30%),linear-gradient(135deg,#faf7f2_0%,#f7f7f8_45%,#f1f3f6_100%)] p-4 text-neutral-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(80,42,32,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(42,54,95,0.28),transparent_30%),linear-gradient(135deg,#090909_0%,#111113_55%,#090909_100%)] dark:text-neutral-50 sm:p-6 lg:p-8">
      <div
        className={`mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1720px] gap-5 transition-[grid-template-columns] duration-300 lg:min-h-[calc(100vh-4rem)] ${
          isSidebarCollapsed
            ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]"
            : "lg:grid-cols-[18rem_minmax(0,1fr)]"
        }`}
      >
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          onCollapsedChange={setIsSidebarCollapsed}
        />
        <main className="min-w-0 rounded-[2.15rem] border border-white/55 bg-white/35 p-5 shadow-[0_26px_80px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-black/30 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}
