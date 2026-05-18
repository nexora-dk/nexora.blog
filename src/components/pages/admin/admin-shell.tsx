"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileSidebarOpen(false);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(245,218,205,0.48),transparent_34%),radial-gradient(circle_at_top_right,rgba(214,224,255,0.42),transparent_30%),linear-gradient(135deg,#faf7f2_0%,#f7f7f8_45%,#f1f3f6_100%)] p-4 text-neutral-950 dark:bg-[radial-gradient(circle_at_top_left,rgba(80,42,32,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(42,54,95,0.28),transparent_30%),linear-gradient(135deg,#090909_0%,#111113_55%,#090909_100%)] dark:text-neutral-50 sm:p-6 lg:p-8">
      <div
        className={`mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-[1720px] gap-5 transition-[grid-template-columns] duration-300 lg:min-h-[calc(100vh-4rem)] ${
          isSidebarCollapsed
            ? "lg:grid-cols-[5.5rem_minmax(0,1fr)]"
            : "lg:grid-cols-[18rem_minmax(0,1fr)]"
        }`}
      >
        <div className="hidden lg:block">
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
          />
        </div>

        <main className="min-w-0 rounded-3xl border border-white/55 bg-white/35 p-4 shadow-[0_26px_80px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.03] dark:shadow-black/30 sm:rounded-[2.15rem] sm:p-7 lg:p-9">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-neutral-200/70 bg-white/70 px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm backdrop-blur transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:hover:text-neutral-50 lg:hidden"
            aria-label="打开后台导航"
          >
            <Menu className="size-4" />
            后台导航
          </button>
          {children}
        </main>
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-[220] lg:hidden" role="dialog" aria-modal="true" aria-label="后台导航">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-950/35 backdrop-blur-sm dark:bg-black/55"
            aria-label="关闭后台导航"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          <div className="absolute inset-y-3 left-3 w-[min(19rem,calc(100vw-1.5rem))] overflow-y-auto rounded-[2rem]">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute right-4 top-4 z-10 grid size-8 place-items-center rounded-full border border-neutral-200 bg-white/85 text-neutral-500 shadow-sm backdrop-blur transition hover:text-neutral-950 dark:border-white/10 dark:bg-neutral-900/85 dark:text-neutral-300 dark:hover:text-white"
              aria-label="关闭后台导航"
            >
              <X className="size-4" />
            </button>
            <AdminSidebar
              isCollapsed={false}
              onCollapsedChange={() => undefined}
              onNavigate={() => setIsMobileSidebarOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
