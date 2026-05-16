"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowUpRight, PenLine, Pencil, Trash2 } from "lucide-react";

import { deleteAdminWritingAction } from "@/app/actions/admin-writings";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";
import type { ArticleItem } from "@/components/pages/writing/writing-data";

type AdminWritingsContentProps = {
  writings: ArticleItem[];
};

const WRITINGS_PER_PAGE = 5;

export function AdminWritingsContent({ writings }: AdminWritingsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWritings = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return writings;
    }

    return writings.filter((writing) => {
      return [
        writing.title,
        writing.description,
        writing.categoryLabel,
        ...writing.tags,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [writings, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredWritings.length / WRITINGS_PER_PAGE),
  );
  const pagedWritings = filteredWritings.slice(
    (currentPage - 1) * WRITINGS_PER_PAGE,
    currentPage * WRITINGS_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleDelete(writing: ArticleItem) {
    const confirmed = window.confirm(
      `确定删除文稿「${writing.title}」吗？此操作会同时删除 Markdown 文件和相关评论，且不可撤销。`,
    );

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminWritingAction(writing.slug);

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
        title="文稿"
        description="管理长文内容、分类、标签和发布状态。"
        icon={PenLine}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部文稿"
          count={filteredWritings.length}
          countLabel="篇"
          searchPlaceholder="按标题/描述/标签搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/writings/new"
        />

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1180px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[38%]" />
              <col className="w-[7rem]" />
              <col className="w-[18%]" />
              <col className="w-[5rem]" />
              <col className="w-[5rem]" />
              <col className="w-[12rem]" />
              <col className="w-[9rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">标题</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">分类</th>
                <th className="px-4 py-2 text-center">标签</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">浏览</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">点赞</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">更新</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedWritings.map((writing) => (
                <tr
                  key={writing.slug}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {writing.title}
                    </div>
                    <p className="mt-1 max-w-md line-clamp-2 text-xs leading-5 text-neutral-400">
                      {writing.description}
                    </p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {writing.categoryLabel}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="mx-auto flex max-w-xs flex-wrap justify-center gap-1.5">
                      {writing.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {writing.views}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {writing.likes}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {writing.modifiedTime}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2 whitespace-nowrap">
                      <Link
                        href={`/admin/writings/${writing.slug}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`编辑 ${writing.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <Link
                        href={writing.href}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`查看 ${writing.title}`}
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(writing)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label={`删除 ${writing.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredWritings.length === 0 ? (
            <AdminEmptyState>
              {writings.length === 0 ? "暂无文稿" : "没有找到匹配的文稿"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredWritings.length}
          itemLabel="篇文稿"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
