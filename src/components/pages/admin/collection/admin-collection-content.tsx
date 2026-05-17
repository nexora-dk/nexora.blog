"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
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
import { ArrowUpRight, FolderHeart, ImageIcon, Pencil, Trash2 } from "lucide-react";

import { deleteAdminCollectionAction } from "@/app/actions/admin-collection";
import type {
  CollectionIcon,
  SimpleIconName,
} from "@/components/pages/collection/collection-data";
import type { AdminCollectionItem } from "@/db/queries/collection.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminCollectionContentProps = {
  items: AdminCollectionItem[];
  pageSize: number;
};

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

function getStatusLabel(isVisible: boolean) {
  return isVisible ? "展示中" : "已隐藏";
}

function getIconLabel(item: AdminCollectionItem) {
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

export function AdminCollectionContent({ items, pageSize }: AdminCollectionContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return items;
    }

    return items.filter((item) => {
      const iconLabel = getIconLabel(item);

      return [
        item.title,
        item.description,
        item.groupTitle,
        item.href,
        item.icon.type,
        iconLabel,
        getStatusLabel(item.isVisible),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [items, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / pageSize),
  );
  const pagedItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleDelete(item: AdminCollectionItem) {
    const confirmed = window.confirm(`确定删除「${item.title}」吗？此操作不可撤销。`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminCollectionAction(item.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  }

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
        <AdminListToolbar
          title="全部收藏"
          count={filteredItems.length}
          countLabel="个"
          searchPlaceholder="按名称/描述/分类搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/collection/new"
        />

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[18%]" />
              <col className="w-[9rem]" />
              <col className="w-[26%]" />
              <col className="w-[7rem]" />
              <col className="w-[8rem]" />
              <col className="w-[22%]" />
              <col className="w-[8rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">名称</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">分类</th>
                <th className="px-4 py-2 text-left">描述</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">图标</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">状态</th>
                <th className="px-4 py-2 text-center">链接</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedItems.map((item) => (
                <tr
                  key={item.id}
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
                          {getIconLabel(item)} · 排序 {item.sortOrder}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {item.groupTitle}
                    </span>
                  </td>

                  <td className="max-w-md border-y border-transparent px-4 py-4 leading-6 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="line-clamp-2">{item.description}</p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {item.icon.type}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {item.isVisible ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                        展示中
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                        已隐藏
                      </span>
                    )}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mx-auto inline-flex max-w-[14rem] items-center gap-1 truncate text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                      >
                        <ArrowUpRight className="size-3 shrink-0" />
                        <span className="truncate">{item.href}</span>
                      </a>
                    ) : (
                      <span className="text-xs text-neutral-400">未设置</span>
                    )}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2 whitespace-nowrap">
                      <Link
                        href={`/admin/collection/${item.id}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label="编辑收藏"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label="删除收藏"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredItems.length === 0 ? (
            <AdminEmptyState>
              {items.length === 0 ? "暂无收藏" : "没有找到匹配的收藏"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredItems.length}
          itemLabel="个收藏"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
