"use client";

import { useState } from "react";
import { ArrowUpRight, HeartHandshake, Plus, Search } from "lucide-react";

import type { FriendLink } from "@/components/pages/friends/friends-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";

type AdminFriendsContentProps = {
  friends: FriendLink[];
};

const FRIENDS_PER_PAGE = 5;

export function AdminFriendsContent({ friends }: AdminFriendsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(friends.length / FRIENDS_PER_PAGE));
  const pagedFriends = friends.slice(
    (currentPage - 1) * FRIENDS_PER_PAGE,
    currentPage * FRIENDS_PER_PAGE,
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
        title="友链"
        description="管理友链站点、站长信息和展示状态。"
        icon={HeartHandshake}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
              全部友链
            </h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {friends.length} 个
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                placeholder="按站点名称/描述搜索..."
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
          <table className="w-full min-w-[820px] border-separate border-spacing-y-3 text-left">
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2">站点</th>
                <th className="px-4 py-2">描述</th>
                <th className="px-4 py-2">链接</th>
                <th className="px-4 py-2">头像</th>
                <th className="px-4 py-2 text-right">操作</th>
              </tr>
            </thead>

            <tbody>
              {pagedFriends.map((friend) => (
                <tr
                  key={friend.name}
                  className="group text-sm text-neutral-600 transition dark:text-neutral-300"
                >
                  <td className="rounded-l-[1.4rem] border-y border-l border-transparent bg-white/0 px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-pink-200 via-orange-100 to-sky-100 font-[family-name:var(--font-dingtalk)] text-lg text-neutral-800 shadow-inner ring-1 ring-white/70 dark:from-pink-500/25 dark:via-orange-400/15 dark:to-sky-400/20 dark:text-neutral-100 dark:ring-white/10">
                        {friend.avatar}
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-neutral-950 dark:text-neutral-50">
                          {friend.name}
                        </div>
                        <p className="mt-1 text-xs text-neutral-400">友链站点</p>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-md border-y border-transparent px-4 py-4 leading-6 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <p className="line-clamp-2">{friend.description}</p>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <a
                      href={friend.href}
                      className="inline-flex max-w-[16rem] items-center gap-1 truncate text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                    >
                      <ArrowUpRight className="size-3 shrink-0" />
                      <span className="truncate">{friend.href}</span>
                    </a>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {friend.avatar}
                    </span>
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-end">
                      <a
                        href={friend.href}
                        className="grid size-9 place-items-center rounded-full border border-neutral-200/70 bg-white/70 text-neutral-400 shadow-sm transition hover:text-neutral-950 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-neutral-50"
                        aria-label={`访问 ${friend.name}`}
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {friends.length === 0 ? (
            <div className="flex min-h-[42vh] items-center justify-center text-sm text-neutral-400 dark:text-neutral-500">
              暂无友链
            </div>
          ) : null}
        </div>

        {friends.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200/70 pt-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-400">
              第 {currentPage} / {totalPages} 页，共 {friends.length} 个友链
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
