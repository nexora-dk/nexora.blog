"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, HeartHandshake } from "lucide-react";

import type { FriendLink } from "@/components/pages/friends/friends-data";
import { AdminContentPanel } from "../admin-content-panel";
import { AdminEmptyState } from "../admin-empty-state";
import { AdminListToolbar } from "../admin-list-toolbar";
import { AdminPageHeader } from "../admin-page-header";
import { AdminPagination } from "../admin-pagination";

type AdminFriendsContentProps = {
  friends: FriendLink[];
};

const FRIENDS_PER_PAGE = 5;

export function AdminFriendsContent({ friends }: AdminFriendsContentProps) {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFriends = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return friends;
    }

    return friends.filter((friend) => {
      return [friend.name, friend.description, friend.href, friend.avatar]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [friends, searchValue]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFriends.length / FRIENDS_PER_PAGE),
  );
  const pagedFriends = filteredFriends.slice(
    (currentPage - 1) * FRIENDS_PER_PAGE,
    currentPage * FRIENDS_PER_PAGE,
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

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="友链"
        description="管理友链站点、站长信息和展示状态。"
        icon={HeartHandshake}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <AdminListToolbar
          title="全部友链"
          count={filteredFriends.length}
          countLabel="个"
          searchPlaceholder="按站点名称/描述搜索..."
          actionLabel="新增"
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />

        <div className="mt-7 overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed border-separate border-spacing-y-3 text-left">
            <colgroup>
              <col className="w-[26%]" />
              <col className="w-[28%]" />
              <col className="w-[24%]" />
              <col className="w-[7rem]" />
              <col className="w-[6rem]" />
            </colgroup>
            <thead>
              <tr className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
                <th className="px-4 py-2 text-left">站点</th>
                <th className="px-4 py-2 text-left">描述</th>
                <th className="px-4 py-2 text-center">链接</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">头像</th>
                <th className="px-4 py-2 text-center whitespace-nowrap">操作</th>
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

                  <td className="border-y border-transparent px-4 py-4 text-center transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <a
                      href={friend.href}
                      className="mx-auto inline-flex max-w-[16rem] items-center gap-1 truncate text-xs text-neutral-400 transition hover:text-neutral-950 dark:hover:text-neutral-50"
                    >
                      <ArrowUpRight className="size-3 shrink-0" />
                      <span className="truncate">{friend.href}</span>
                    </a>
                  </td>

                  <td className="border-y border-transparent px-4 py-4 text-center whitespace-nowrap transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                      {friend.avatar}
                    </span>
                  </td>

                  <td className="rounded-r-[1.4rem] border-y border-r border-transparent px-4 py-4 transition group-hover:border-neutral-200/70 group-hover:bg-white/55 dark:group-hover:border-white/10 dark:group-hover:bg-white/[0.04]">
                    <div className="flex justify-center">
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
