import Link from "next/link";
import {
  ArrowUpRight,
  LayoutDashboard,
  MessageCircle,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Plus,
  Rocket,
} from "lucide-react";

import { AdminContentPanel } from "./admin-content-panel";
import { AdminPageHeader } from "./admin-page-header";

const stats = [
  { label: "文稿", value: "18", trend: "+3 本月", icon: PenLine },
  { label: "手记", value: "27", trend: "+6 本月", icon: NotebookPen },
  { label: "评论", value: "64", trend: "12 待查看", icon: MessageSquareText },
  { label: "留言", value: "19", trend: "5 条新留言", icon: MessageCircle },
];

const activities = [
  { title: "完成留言页评论系统", time: "今天 23:10", type: "功能" },
  { title: "新增手记评论模块", time: "昨天 21:35", type: "手记" },
  { title: "优化文稿详情页互动区", time: "5 月 13 日", type: "文稿" },
  { title: "整理项目展示静态数据", time: "5 月 10 日", type: "项目" },
];

const quickLinks = [
  { title: "写一篇文稿", href: "/admin/writings", icon: PenLine },
  { title: "记录一条手记", href: "/admin/notes", icon: NotebookPen },
  { title: "管理留言", href: "/admin/messages", icon: MessageCircle },
  { title: "新增项目", href: "/admin/projects", icon: Rocket },
];

export function AdminDashboardContent() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="后台管理"
        description="管理站点内容、互动数据和个人博客的静态资源。"
        icon={LayoutDashboard}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <AdminContentPanel key={item.label} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{item.value}</p>
                  <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">{item.trend}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-2xl bg-neutral-950 text-white shadow-lg shadow-neutral-950/15 dark:bg-neutral-100 dark:text-neutral-950">
                  <Icon className="size-5" />
                </span>
              </div>
            </AdminContentPanel>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
        <AdminContentPanel className="p-6 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">最近动态</h2>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">静态预览后续会接入真实操作日志。</p>
            </div>
            <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
              查看项目
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-6 divide-y divide-neutral-200/70 dark:divide-white/10">
            {activities.map((item) => (
              <div key={item.title} className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{item.time}</p>
                </div>
                <span className="w-fit rounded-full border border-neutral-200/70 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </AdminContentPanel>

        <AdminContentPanel className="p-6 sm:p-7">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">快捷入口</h2>
          <div className="mt-5 grid gap-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-white/65 px-4 py-3 text-sm font-medium text-neutral-600 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-neutral-50"
                >
                  <span className="inline-flex items-center gap-3">
                    <Icon className="size-4 text-neutral-400 group-hover:text-current" />
                    {item.title}
                  </span>
                  <Plus className="size-4 text-neutral-400" />
                </Link>
              );
            })}
          </div>
        </AdminContentPanel>
      </div>
    </div>
  );
}
