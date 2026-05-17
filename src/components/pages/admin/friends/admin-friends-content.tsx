"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowUpRight, Check, HeartHandshake, Pencil, Trash2, X } from "lucide-react";

import {
  approveAdminFriendLinkAction,
  deleteAdminFriendLinkAction,
  rejectAdminFriendLinkAction,
} from "@/app/actions/admin-friend-links";
import type { AdminFriendLinkItem, FriendLinkStatus } from "@/db/queries/friend-links.query";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminFriendsContentProps = {
  friends: AdminFriendLinkItem[];
  pageSize: number;
};

const statusLabels: Record<FriendLinkStatus, string> = {
  pending: "待审核",
  approved: "已通过",
  rejected: "已拒绝",
  hidden: "已隐藏",
};

function getStatusClassName(status: FriendLinkStatus) {
  if (status === "pending") {
    return "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300";
  }

  if (status === "approved") {
    return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300";
  }

  return "bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-400";
}

function getStatusLabel(friend: AdminFriendLinkItem) {
  if (friend.status === "approved" && !friend.isVisible) {
    return "已通过 / 未展示";
  }

  if (friend.status === "approved" && friend.isVisible) {
    return "已通过 / 展示中";
  }

  return statusLabels[friend.status];
}

export function AdminFriendsContent({ friends, pageSize }: AdminFriendsContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pendingFriends = useMemo(
    () => friends.filter((friend) => friend.status === "pending"),
    [friends],
  );
  const pendingFriendNames = pendingFriends
    .slice(0, 3)
    .map((friend) => friend.name)
    .join("、");

  const filteredFriends = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return friends;
    }

    return friends.filter((friend) => {
      return [
        friend.name,
        friend.description,
        friend.blogUrl,
        friend.avatarUrl,
        getStatusLabel(friend),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [friends, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFriends.length / pageSize),
  );
  const pagedFriends = filteredFriends.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  function handleSearchChange(value: string) {
    setSearchValue(value);
    setCurrentPage(1);
  }

  function handleApprove(friend: AdminFriendLinkItem) {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      const result = await approveAdminFriendLinkAction(friend.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  function handleReject(friend: AdminFriendLinkItem) {
    const confirmed = window.confirm(`确定拒绝「${friend.name}」的友链申请吗？`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await rejectAdminFriendLinkAction(friend.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete(friend: AdminFriendLinkItem) {
    const confirmed = window.confirm(`确定删除「${friend.name}」吗？此操作不可撤销。`);

    if (!confirmed || isPending) {
      return;
    }

    startTransition(async () => {
      const result = await deleteAdminFriendLinkAction(friend.id);

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
        title="友链"
        description="管理友链申请、审核状态、头像、博客地址和展示状态。"
        icon={HeartHandshake}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部友链"
          count={filteredFriends.length}
          countLabel="个"
          searchPlaceholder="按站点名称/描述/链接/状态搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          actionHref="/admin/friends/new"
        />

        {pendingFriends.length > 0 ? (
          <div className="mt-6 rounded-[1.4rem] border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm text-amber-700 shadow-sm dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold">有 {pendingFriends.length} 条友链待审核</p>
                <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-200/70">
                  {pendingFriendNames}
                  {pendingFriends.length > 3 ? ` 等 ${pendingFriends.length} 个站点` : ""}
                  ，请在列表中处理通过或拒绝。
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-white/10 dark:text-amber-200">
                待处理 {pendingFriends.length}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[1160px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[23%]" />
              <col className="w-[25%]" />
              <col className="w-[21%]" />
              <col className="w-[7rem]" />
              <col className="w-[10rem]" />
              <col className="w-[11rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">站点</th>
                <th className="px-4 py-2 text-left">描述</th>
                <th className="px-4 py-2 text-center">链接</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">排序</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">状态</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedFriends.map((friend) => (
                <tr
                  key={friend.id}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 shadow-sm ring-1 ring-white/70 dark:bg-neutral-900 dark:ring-white/10">
                        <img
                          src={friend.avatarUrl}
                          alt={`${friend.name} 头像`}
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                          {friend.name}
                        </div>
                        <p className="mt-1 max-w-[12rem] truncate text-xs text-neutral-400">
                          {friend.avatarUrl}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-md border-y border-transparent px-4 py-4 leading-6 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="line-clamp-2">{friend.description}</p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <a
                      href={friend.blogUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mx-auto inline-flex max-w-[16rem] items-center gap-1 truncate text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                    >
                      <ArrowUpRight className="size-3 shrink-0" />
                      <span className="truncate">{friend.blogUrl}</span>
                    </a>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap tabular-nums transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    {friend.sortOrder}
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClassName(friend.status)}`}>
                      {getStatusLabel(friend)}
                    </span>
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center gap-2">
                      {friend.status === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(friend)}
                            disabled={isPending}
                            className="grid size-9 place-items-center rounded-full border border-emerald-200/80 bg-emerald-50/80 text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                            aria-label={`通过 ${friend.name}`}
                          >
                            <Check className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(friend)}
                            disabled={isPending}
                            className="grid size-9 place-items-center rounded-full border border-amber-200/80 bg-amber-50/80 text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/15"
                            aria-label={`拒绝 ${friend.name}`}
                          >
                            <X className="size-4" />
                          </button>
                        </>
                      ) : null}
                      <Link
                        href={`/admin/friends/${friend.id}/edit`}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`编辑 ${friend.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(friend)}
                        disabled={isPending}
                        className="grid size-9 place-items-center rounded-full border border-red-200/80 bg-red-50/80 text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
                        aria-label={`删除 ${friend.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFriends.length === 0 ? (
            <AdminEmptyState>
              {friends.length === 0 ? "暂无友链" : "没有找到匹配的友链"}
            </AdminEmptyState>
          ) : null}
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredFriends.length}
          itemLabel="个友链"
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
        />
      </AdminContentPanel>
    </div>
  );
}
