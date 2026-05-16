"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { MessageSquareText, Search, Trash2 } from "lucide-react";
import { deleteAdminCommentAction } from "@/app/actions/admin-comments";

import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";
import type { AdminCommentItem } from "@/db/queries/admin-comments.query";

type AdminCommentsContentProps = {
  comments: AdminCommentItem[];
};

const COMMENTS_PER_PAGE = 5;

type CommentTargetOption = {
  key: string;
  label: string;
};

function formatCommentDate(date: Date) {
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

function getSourceLabel(source: AdminCommentItem["source"]) {
  return source === "writing" ? "文稿" : "手记";
}

type AdminCommentGroup = {
  key: string;
  source: AdminCommentItem["source"];
  targetTitle: string;
  targetSlug: string;
  comments: AdminCommentItem[];
};

function groupCommentsByTarget(comments: AdminCommentItem[]) {
  const groups = new Map<string, AdminCommentGroup>();

  for (const comment of comments) {
    const key = `${comment.source}-${comment.targetSlug}`;
    const group = groups.get(key);

    if (group) {
      group.comments.push(comment);
      continue;
    }

    groups.set(key, {
      key,
      source: comment.source,
      targetTitle: comment.targetTitle,
      targetSlug: comment.targetSlug,
      comments: [comment],
    });
  }

  return Array.from(groups.values()).sort((left, right) => {
    const leftTime = left.comments[0]?.createdAt.getTime() ?? 0;
    const rightTime = right.comments[0]?.createdAt.getTime() ?? 0;

    return rightTime - leftTime;
  });
}

function getCommentTargetOptions(groups: AdminCommentGroup[]) {
  const options: CommentTargetOption[] = [
    {
      key: "all",
      label: "全部内容",
    },
  ];

  for (const group of groups) {
    options.push({
      key: group.key,
      label: `${getSourceLabel(group.source)} · ${group.targetTitle}`,
    });
  }

  return options;
}

export function AdminCommentsContent({ comments }: AdminCommentsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const groups = useMemo(() => groupCommentsByTarget(comments), [comments]);
  const targetOptions = useMemo(
    () => getCommentTargetOptions(groups),
    [groups],
  );
  const [selectedTargetKey, setSelectedTargetKey] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredComments = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    return comments.filter((comment) => {
      const key = `${comment.source}-${comment.targetSlug}`;
      const matchesTarget = selectedTargetKey === "all" || key === selectedTargetKey;

      if (!matchesTarget) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return [
        getSourceLabel(comment.source),
        comment.targetTitle,
        comment.targetSlug,
        comment.authorName,
        comment.authorEmail,
        comment.content,
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [comments, selectedTargetKey, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredComments.length / COMMENTS_PER_PAGE),
  );
  const pagedComments = filteredComments.slice(
    (currentPage - 1) * COMMENTS_PER_PAGE,
    currentPage * COMMENTS_PER_PAGE,
  );

  const writingCount = comments.filter(
    (comment) => comment.source === "writing",
  ).length;
  const noteCount = comments.filter(
    (comment) => comment.source === "note",
  ).length;
  const replyCount = filteredComments.filter(
    (comment) => comment.parentId !== null,
  ).length;
  const selectedTargetLabel =
    targetOptions.find((option) => option.key === selectedTargetKey)?.label ??
    "全部内容";

  function handleTargetChange(value: string) {
    setSelectedTargetKey(value);
    setCurrentPage(1);
  }

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

  function handleDelete(comment: AdminCommentItem) {
    const confirmed = window.confirm("确定删除这条评论吗？");

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminCommentAction({
        id: comment.id,
        source: comment.source,
      });

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
        title="评论"
        description="查看文稿和手记下的用户评论与回复。"
        icon={MessageSquareText}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            { label: "当前评论", value: filteredComments.length },
            { label: "文稿评论", value: writingCount },
            { label: "手记评论", value: noteCount },
            { label: "回复", value: replyCount },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral-200/70 bg-white/60 px-4 py-3 shadow-sm dark:border-white/10 dark:bg-white/[0.04]"
            >
              <p className="text-xs font-medium text-neutral-400">
                {item.label}
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 rounded-[1.4rem] border border-neutral-200/70 bg-white/55 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">
              当前查看：{selectedTargetLabel}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              每页显示 {COMMENTS_PER_PAGE} 条评论，可按文稿或手记筛选。
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                value={searchValue}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="按作者/邮箱/内容搜索..."
                className="h-11 w-full rounded-2xl border border-neutral-200/80 bg-white/80 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-neutral-950/70 dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
              />
            </label>

            <select
              value={selectedTargetKey}
              onChange={(event) => handleTargetChange(event.target.value)}
              className="h-11 rounded-2xl border border-neutral-200/80 bg-white/80 px-4 text-sm font-medium text-neutral-700 shadow-sm outline-none transition focus:border-neutral-300 dark:border-white/10 dark:bg-neutral-950/70 dark:text-neutral-200 dark:focus:border-white/20"
            >
              {targetOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-7 divide-y divide-neutral-200/70 dark:divide-white/10">
          {pagedComments.length > 0 ? (
            pagedComments.map((comment) => (
              <article
                key={`${comment.source}-${comment.id}`}
                className="grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
              >
                <div className="grid size-12 place-items-center overflow-hidden rounded-2xl border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                  {comment.authorImage ? (
                    <Image
                      src={comment.authorImage}
                      alt={comment.authorName}
                      width={48}
                      height={48}
                      className="size-full object-cover"
                    />
                  ) : (
                    getAvatar(comment.authorName)
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-neutral-950 dark:text-neutral-50">
                      {comment.authorName}
                    </h3>
                    <span className="text-sm text-neutral-400">
                      {comment.authorEmail}
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {getSourceLabel(comment.source)}
                    </span>
                    {comment.parentId ? (
                      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                        回复
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                        评论
                      </span>
                    )}
                  </div>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                    {comment.content}
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <time className="text-sm text-neutral-400 sm:text-right">
                    {formatCommentDate(comment.createdAt)}
                  </time>

                  <button
                    type="button"
                    onClick={() => handleDelete(comment)}
                    disabled={isPending}
                    className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                    aria-label={`删除 ${comment.authorName} 的评论`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <AdminEmptyState>
              {comments.length === 0 ? "暂无评论" : "没有找到匹配的评论"}
            </AdminEmptyState>
          )}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredComments.length}
          itemLabel="条评论"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
