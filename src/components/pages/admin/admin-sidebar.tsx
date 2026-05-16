"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut, Settings } from "lucide-react";

import { adminNavItems } from "./admin-nav-data";

type AdminSidebarProps = {
  isCollapsed: boolean;
  onCollapsedChange: (isCollapsed: boolean) => void;
};

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ isCollapsed, onCollapsedChange }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`flex h-full w-full flex-col rounded-[1.85rem] border border-white/70 bg-white/72 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl transition-[padding,width] duration-300 dark:border-white/10 dark:bg-neutral-950/70 dark:shadow-black/30 ${
        isCollapsed ? "px-3 lg:w-[5.5rem]" : "px-5 lg:w-[18rem]"
      }`}
    >
      <div className={`flex gap-3 ${isCollapsed ? "flex-col items-center" : "items-center justify-between"}`}>
        <Link href="/admin" className="inline-flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-neutral-950 text-white shadow-lg shadow-neutral-950/15 dark:bg-neutral-100 dark:text-neutral-950">
            <Settings className="size-4" />
          </span>
          <span
            className={`whitespace-nowrap text-lg font-semibold tracking-tight text-neutral-950 transition dark:text-neutral-50 ${
              isCollapsed ? "hidden" : "inline"
            }`}
          >
            后台管理
          </span>
        </Link>
        <button
          type="button"
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="hidden size-7 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white/80 text-neutral-400 shadow-sm transition hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:text-neutral-50 lg:grid"
          aria-label={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
          title={isCollapsed ? "展开侧边栏" : "收起侧边栏"}
        >
          <ChevronLeft
            className={`size-3.5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="mt-10 grid gap-1.5 overflow-y-auto pr-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.title : undefined}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                isCollapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-neutral-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] dark:bg-neutral-100 dark:text-neutral-950"
                  : "hover:bg-neutral-200/55 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-neutral-50"
              }`}
            >
              <Icon className={`size-4 shrink-0 ${isActive ? "text-current" : "text-neutral-400 group-hover:text-current"}`} />
              <span className={`whitespace-nowrap ${isCollapsed ? "hidden" : "inline"}`}>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-neutral-200/70 pt-5 dark:border-white/10">
        <div
          className={`flex items-center gap-3 rounded-[1.35rem] border border-neutral-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Image
            src="/images/avatar/avatar.jpg"
            alt="管理员头像"
            width={44}
            height={44}
            className="size-11 rounded-2xl object-cover"
          />
          <div className={`min-w-0 ${isCollapsed ? "hidden" : "block"}`}>
            <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">Nexora</p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">admin@nexora.space</p>
          </div>
        </div>
        <div className={`mt-3 grid gap-2 ${isCollapsed ? "grid-cols-1" : "grid-cols-2"}`}>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-2 text-xs font-medium text-neutral-600 transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
            title="前台"
          >
            {isCollapsed ? "前" : "前台"}
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs font-medium text-rose-500 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300"
            title="登出"
          >
            <LogOut className="size-3.5" />
            <span className={isCollapsed ? "hidden" : "inline"}>登出</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
