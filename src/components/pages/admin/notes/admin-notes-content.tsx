"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, NotebookPen, Plus, Search } from "lucide-react";

import type { NoteItem } from "@/components/pages/notes/notes-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminNotesContentProps = {
  notes: NoteItem[];
};

const NOTES_PER_PAGE = 5;

export function AdminNotesContent({ notes }: AdminNotesContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(notes.length / NOTES_PER_PAGE));
  const pagedNotes = notes.slice(
    (currentPage - 1) * NOTES_PER_PAGE,
    currentPage * NOTES_PER_PAGE,
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
        title="手记"
        description="管理短内容、专栏、心情、位置和阅读数据。"
        icon={NotebookPen}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              全部手记
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {notes.length} 篇
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                placeholder="按标题/描述/标签搜索..."
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
          <table className="w-full min-w-[980px] border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2">标题</th>
                <th className="px-4 py-2">专栏</th>
                <th className="px-4 py-2">标签</th>
                <th className="px-4 py-2">心情/地点</th>
                <th className="px-4 py-2">浏览</th>
                <th className="px-4 py-2">点赞</th>
                <th className="px-4 py-2">发布</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedNotes.map((note) => (
                <tr
                  key={note.href}
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

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {note.columnLabel}
                    </span>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex max-w-xs flex-wrap gap-1.5">
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
                    <div className="flex max-w-[12rem] flex-wrap gap-1.5">
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

                  <td className="border-y border-transparent px-4 py-4 tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.views}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.likes}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {note.publishedAt}
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-end">
                      <Link
                        href={note.href}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`查看 ${note.title}`}
                      >
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {notes.length === 0 ? (
            <div className="flex min-h-[42vh] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
              暂无手记
            </div>
          ) : null}
        </div>

        {notes.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200/70 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-400">
              第 {currentPage} / {totalPages} 页，共 {notes.length} 篇手记
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
