"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut, Settings } from "lucide-react";

import { adminNavItems } from "./admin-nav-data";

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col rounded-[1.85rem] border border-white/70 bg-white/72 px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/70 dark:shadow-black/30 lg:w-[18rem]">
      <div className="flex items-center justify-between gap-3">
        <Link href="/admin" className="inline-flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-2xl bg-neutral-950 text-white shadow-lg shadow-neutral-950/15 dark:bg-neutral-100 dark:text-neutral-950">
            <Settings className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            后台管理
          </span>
        </Link>
        <button
          type="button"
          className="hidden size-7 place-items-center rounded-full border border-neutral-200 bg-white/80 text-neutral-400 shadow-sm transition hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:hover:text-neutral-50 lg:grid"
          aria-label="收起侧边栏"
        >
          <ChevronLeft className="size-3.5" />
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
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                isActive
                  ? "bg-neutral-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.16)] dark:bg-neutral-100 dark:text-neutral-950"
                  : "hover:bg-neutral-200/55 hover:text-neutral-950 dark:hover:bg-white/10 dark:hover:text-neutral-50"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-current" : "text-neutral-400 group-hover:text-current"}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-neutral-200/70 pt-5 dark:border-white/10">
        <div className="flex items-center gap-3 rounded-[1.35rem] border border-neutral-200/70 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
          <Image
            src="/images/avatar/avatar.jpg"
            alt="管理员头像"
            width={44}
            height={44}
            className="size-11 rounded-2xl object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">Nexora</p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">admin@nexora.space</p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-200/70 bg-white/70 px-3 py-2 text-xs font-medium text-neutral-600 transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
          >
            前台
          </Link>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-rose-200/80 bg-rose-50/80 px-3 py-2 text-xs font-medium text-rose-500 transition hover:bg-rose-100 dark:border-rose-400/20 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <LogOut className="size-3.5" />
            登出
          </button>
        </div>
      </div>
    </aside>
  );
}
