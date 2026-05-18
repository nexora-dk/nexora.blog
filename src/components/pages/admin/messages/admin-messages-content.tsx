"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { MessageCircle, Search, Trash2 } from "lucide-react";

import { deleteAdminGuestbookCommentAction } from "@/app/actions/admin-guestbook-comments";
import type { AdminGuestbookCommentItem } from "@/db/queries/guestbook-comments.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminMessagesContentProps = {
  messages: AdminGuestbookCommentItem[];
  pageSize: number;
};

function formatMessageDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getAvatar(name: string) {
  return name.trim().slice(0, 1).toUpperCase() || "访";
}

export function AdminMessagesContent({ messages, pageSize }: AdminMessagesContentProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const filteredMessages = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return messages;
    }

    return messages.filter((message) => {
      return [
        message.authorName,
        message.authorEmail,
        message.content,
        message.parentId ? "回复" : "留言",
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [messages, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMessages.length / pageSize),
  );
  const pagedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm("确定删除这条留言吗？");

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminGuestbookCommentAction({ id });

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="留言"
        description="查看站点留言页的公开留言和回复。"
        icon={MessageCircle}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              全部留言
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {filteredMessages.length} 条
            </span>
          </div>

          <label className="relative block sm:w-80">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="按作者/邮箱/内容搜索..."
              className="h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
            />
          </label>
        </div>

        <div className="mt-7 divide-y divide-neutral-200/70 dark:divide-white/10">
          {pagedMessages.length > 0 ? (
            pagedMessages.map((message) => (
              <article
                key={message.id}
                className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
              >
                <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                  {message.authorImage ? (
                    <Image
                      src={message.authorImage}
                      alt={message.authorName}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    getAvatar(message.authorName)
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="min-w-0 break-words font-semibold text-neutral-950 dark:text-neutral-50">
                      {message.authorName}
                    </h3>
                    <span className="break-all text-sm text-neutral-400">
                      {message.authorEmail}
                    </span>
                    {message.parentId ? (
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                        回复
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                        留言
                      </span>
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {message.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <time className="text-sm text-neutral-400 sm:text-right">
                    {formatMessageDate(message.createdAt)}
                  </time>

                  <button
                    type="button"
                    onClick={() => handleDelete(message.id)}
                    disabled={isPending}
                    className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                    aria-label={`删除 ${message.authorName} 的留言`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <AdminEmptyState>
              {messages.length === 0 ? "暂无留言" : "没有找到匹配的留言"}
            </AdminEmptyState>
          )}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredMessages.length}
          itemLabel="条留言"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
