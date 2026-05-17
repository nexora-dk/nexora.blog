"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Sparkles, Trash2 } from "lucide-react";

import { deleteAdminThinkingAction } from "@/app/actions/admin-thinking";
import type { ThinkingItem } from "@/components/pages/thinking/thinking-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminThinkingContentProps = {
  thoughts: ThinkingItem[];
  pageSize: number;
};

function getStatusLabel(isVisible: boolean) {
  return isVisible ? "展示中" : "已隐藏";
}

export function AdminThinkingContent({ thoughts, pageSize }: AdminThinkingContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredThoughts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return thoughts;
    }

    return thoughts.filter((thought) => {
      return [
        thought.content,
        thought.mood,
        thought.publishedAt,
        thought.time,
        getStatusLabel(thought.isVisible),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [thoughts, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredThoughts.length / pageSize),
  );
  const pagedThoughts = filteredThoughts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleDelete(thought: ThinkingItem) {
    const confirmed = window.confirm(`确定删除这条思考吗？此操作不可撤销。`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminThinkingAction(thought.id);

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
        title="思考"
        description="管理思考条目、灵感片段和公开展示状态。"
        icon={Sparkles}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部思考"
          count={filteredThoughts.length}
          countLabel="条"
          searchPlaceholder="按内容/心情搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/thinking/new"
        />

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1080px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[42%]" />
              <col className="w-[8rem]" />
              <col className="w-[12rem]" />
              <col className="w-[7rem]" />
              <col className="w-[8rem]" />
              <col className="w-[8rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">内容</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">心情</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">日期</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">时间</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">状态</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedThoughts.map((thought) => (
                <tr
                  key={thought.id}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="max-w-2xl whitespace-pre-wrap leading-6 text-neutral-700 dark:text-neutral-200">
                      {thought.content}
                    </p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {thought.mood ? (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                        {thought.mood}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">—</span>
                    )}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {thought.publishedAt}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {thought.time ?? "—"}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {thought.isVisible ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                        展示中
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                        已隐藏
                      </span>
                    )}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2 whitespace-nowrap">
                      <Link
                        href={`/admin/thinking/${thought.id}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label="编辑思考"
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(thought)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label="删除思考"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredThoughts.length === 0 ? (
            <AdminEmptyState>
              {thoughts.length === 0 ? "暂无思考" : "没有找到匹配的思考"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredThoughts.length}
          itemLabel="条思考"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
