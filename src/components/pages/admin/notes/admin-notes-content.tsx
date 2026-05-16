"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowUpRight, NotebookPen, Pencil, Trash2 } from "lucide-react";

import { deleteAdminNoteAction } from "@/app/actions/admin-notes";
import type { NoteItem } from "@/components/pages/notes/notes-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminNotesContentProps = {
  notes: NoteItem[];
};

const NOTES_PER_PAGE = 5;

export function AdminNotesContent({ notes }: AdminNotesContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotes = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return notes;
    }

    return notes.filter((note) => {
      return [
        note.title,
        note.description,
        note.columnLabel,
        note.mood,
        note.location,
        ...note.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [notes, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotes.length / NOTES_PER_PAGE),
  );
  const pagedNotes = filteredNotes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleDelete(note: NoteItem) {
    const confirmed = window.confirm(
      `确定删除手记「${note.title}」吗？此操作会同时删除 Markdown 文件和相关评论，且不可撤销。`,
    );

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminNoteAction(note.slug);

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
        title="手记"
        description="管理短内容、专栏、心情、位置和阅读数据。"
        icon={NotebookPen}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部手记"
          count={filteredNotes.length}
          countLabel="篇"
          searchPlaceholder="按标题/描述/标签搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/notes/new"
        />

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1260px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[32%]" />
              <col className="w-[7rem]" />
              <col className="w-[16%]" />
              <col className="w-[12rem]" />
              <col className="w-[5rem]" />
              <col className="w-[5rem]" />
              <col className="w-[12rem]" />
              <col className="w-[9rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">标题</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">专栏</th>
                <th className="px-4 py-2 text-center">标签</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">心情/地点</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">浏览</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">点赞</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">发布</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedNotes.map((note) => (
                <tr
                  key={note.slug}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {note.title}
                    </div>
                    <p className="mt-1 max-w-md line-clamp-2 text-xs leading-5 text-neutral-400">
                      {note.description}
                    </p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {note.columnLabel}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="mx-auto flex max-w-xs flex-wrap justify-center gap-1.5">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="mx-auto flex max-w-[12rem] flex-wrap justify-center gap-1.5">
                      {note.mood ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
                          {note.mood}
                        </span>
                      ) : null}
                      {note.location ? (
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                          {note.location}
                        </span>
                      ) : null}
                      {!note.mood && !note.location ? (
                        <span className="text-xs text-neutral-400">—</span>
                      ) : null}
                    </div>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.views}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.likes}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.publishedAt}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2 whitespace-nowrap">
                      <Link
                        href={`/admin/notes/${note.slug}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`编辑 ${note.title}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <Link
                        href={note.href}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`查看 ${note.title}`}
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(note)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label={`删除 ${note.title}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredNotes.length === 0 ? (
            <AdminEmptyState>
              {notes.length === 0 ? "暂无手记" : "没有找到匹配的手记"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredNotes.length}
          itemLabel="篇手记"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
