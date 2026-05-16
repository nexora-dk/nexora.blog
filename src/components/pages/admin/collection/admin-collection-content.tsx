"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { useState } from "react";
import {
  SiAwwwards,
  SiDaisyui,
  SiDribbble,
  SiDrizzle,
  SiExcalidraw,
  SiFigma,
  SiGithub,
  SiIconify,
  SiNextdotjs,
  SiRailway,
  SiResend,
  SiShadcnui,
  SiSupabase,
  SiTldraw,
  SiUpstash,
  SiVercel,
} from "@icons-pack/react-simple-icons";
import { ArrowUpRight, FolderHeart, ImageIcon, Plus, Search } from "lucide-react";

import type {
  CollectionGroup,
  CollectionIcon,
  CollectionItem,
  SimpleIconName,
} from "@/components/pages/collection/collection-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminCollectionContentProps = {
  groups: CollectionGroup[];
};

const COLLECTION_ITEMS_PER_PAGE = 5;

const simpleIcons: Record<SimpleIconName, ComponentType<{ className?: string }>> = {
  tldraw: SiTldraw,
  excalidraw: SiExcalidraw,
  figma: SiFigma,
  github: SiGithub,
  iconify: SiIconify,
  railway: SiRailway,
  resend: SiResend,
  nextdotjs: SiNextdotjs,
  drizzle: SiDrizzle,
  vercel: SiVercel,
  supabase: SiSupabase,
  upstash: SiUpstash,
  awwwards: SiAwwwards,
  dribbble: SiDribbble,
  shadcnui: SiShadcnui,
  daisyui: SiDaisyui,
};

function flattenCollectionGroups(groups: CollectionGroup[]) {
  return groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      groupTitle: group.title,
    })),
  );
}

function getIconLabel(item: CollectionItem) {
  if (item.icon.type === "simple") {
    return item.icon.name;
  }

  return item.icon.src ? "本地图标" : "占位图标";
}

function AdminCollectionIcon({ icon }: { icon: CollectionIcon }) {
  const shellClassName = "grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800";

  if (icon.type === "image") {
    if (!icon.src) {
      return (
        <span className={shellClassName}>
          <ImageIcon className="size-6 text-neutral-400 dark:text-neutral-500" />
        </span>
      );
    }

    return (
      <span className={`relative size-12 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 ${icon.className ?? ""}`}>
        <Image
          src={icon.src}
          alt={icon.alt ?? "收藏图标"}
          fill
          sizes="48px"
          className="object-cover"
        />
      </span>
    );
  }

  const Icon = simpleIcons[icon.name];

  return (
    <span className={shellClassName}>
      <Icon className={`size-7 ${icon.className ?? "text-neutral-950 dark:text-neutral-50"}`} />
    </span>
  );
}

export function AdminCollectionContent({ groups }: AdminCollectionContentProps) {
  const items = flattenCollectionGroups(groups);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / COLLECTION_ITEMS_PER_PAGE));
  const pagedItems = items.slice(
    (currentPage - 1) * COLLECTION_ITEMS_PER_PAGE,
    currentPage * COLLECTION_ITEMS_PER_PAGE,
  );

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="收藏"
        description="管理收藏夹链接、分类和外部资源。"
        icon={FolderHeart}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              全部收藏
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {items.length} 个
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                placeholder="按名称/描述/分类搜索..."
                className="h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
              />
            </label>

            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-neutral-100 dark:text-neutral-950"
            >
              <Plus className="size-4" />
              新增
            </button>
          </div>
        </div>

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[920px] border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2">名称</th>
                <th className="px-4 py-2">分类</th>
                <th className="px-4 py-2">描述</th>
                <th className="px-4 py-2">图标</th>
                <th className="px-4 py-2">链接</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedItems.map((item) => (
                <tr
                  key={`${item.groupTitle}-${item.title}`}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <AdminCollectionIcon icon={item.icon} />
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                          {item.title}
                        </div>
                        <p className="mt-1 text-xs text-neutral-400">
                          {getIconLabel(item)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {item.groupTitle}
                    </span>
                  </td>

                  <td className="max-w-md border-y border-transparent px-4 py-4 leading-6 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="line-clamp-2">{item.description}</p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {item.icon.type}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="inline-flex max-w-[16rem] items-center gap-1 truncate text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                      >
                        <ArrowUpRight className="size-3 shrink-0" />
                        <span className="truncate">{item.href}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-400">未设置</span>
                    )}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-end">
                      {item.href ? (
                        <a
                          href={item.href}
                          className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                          aria-label={`访问 ${item.title}`}
                        >
                          <ArrowUpRight className="size-4" />
                        </a>
                      ) : (
                        <span className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/40 text-neutral-300 dark:border-white/10 dark:bg-white/[0.03] dark:text-neutral-600">
                          <ArrowUpRight className="size-4" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 ? (
            <div className="flex min-h-[42vh] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
              暂无收藏
            </div>
          ) : null}
        </div>

        {items.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200/70 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-400">
              第 {currentPage} / {totalPages} 页，共 {items.length} 个收藏
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                上一页
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-45 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:text-neutral-50"
              >
                下一页
              </button>
            </div>
          </div>
        ) : null}
      </AdminContentPanel>
    </div>
  );
}
