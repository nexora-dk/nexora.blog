import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowUpRight,
  BadgeAlert,
  BarChart3,
  Clock3,
  Eye,
  FolderHeart,
  Grid2X2,
  Heart,
  HeartHandshake,
  Images,
  LayoutDashboard,
  Layers3,
  MessageCircle,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Plus,
  Rocket,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type {
  AdminDashboardActivityItem,
  AdminDashboardModuleCount,
  AdminDashboardOverview,
  AdminDashboardPendingWorkItem,
  AdminDashboardTopContent,
} from "@/db/queries/admin-dashboard.query";
import { AdminContentPanel } from "./admin-content-panel";
import { AdminEmptyState } from "./admin-empty-state";
import { AdminPageHeader } from "./admin-page-header";

type AdminDashboardContentProps = {
  overview: AdminDashboardOverview;
};

type Tone = "neutral" | "amber" | "emerald" | "red" | "sky";

type DashboardStatCardProps = {
  label: string;
  value: string;
  helper: string;
  href: string;
  icon: LucideIcon;
  tone?: Tone;
};

type DashboardSectionHeaderProps = {
  title: string;
  description?: string;
  href?: string;
  actionLabel?: string;
};

const moduleIcons: Record<AdminDashboardModuleCount["key"], LucideIcon> = {
  writings: PenLine,
  notes: NotebookPen,
  thinking: Sparkles,
  collection: FolderHeart,
  gallery: Images,
  projects: Grid2X2,
  friends: HeartHandshake,
  comments: MessageSquareText,
  guestbook: MessageCircle,
};

const activityToneByType: Record<AdminDashboardActivityItem["type"], Tone> = {
  writing: "sky",
  note: "emerald",
  thinking: "amber",
  collection: "neutral",
  gallery: "sky",
  project: "emerald",
  friend: "amber",
  comment: "neutral",
  guestbook: "neutral",
};

const quickActions = [
  { title: "写一篇文稿", href: "/admin/writings/new", icon: PenLine, helper: "发布新的长文" },
  { title: "记录一条手记", href: "/admin/notes/new", icon: NotebookPen, helper: "补充日常记录" },
  { title: "写一条思考", href: "/admin/thinking/new", icon: Sparkles, helper: "保存碎片想法" },
  { title: "新增收藏", href: "/admin/collection/new", icon: FolderHeart, helper: "收录新的资源" },
  { title: "上传相片", href: "/admin/gallery/new", icon: Images, helper: "更新相册内容" },
  { title: "新增项目", href: "/admin/projects/new", icon: Rocket, helper: "展示新的作品" },
  { title: "新增友链", href: "/admin/friends/new", icon: HeartHandshake, helper: "手动添加友链" },
  { title: "审核友链", href: "/admin/friends", icon: BadgeAlert, helper: "处理待审核申请" },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getToneClassName(tone: Tone = "neutral") {
  if (tone === "amber") {
    return "border-amber-200/80 bg-amber-50/80 text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/10 dark:text-amber-200";
  }

  if (tone === "emerald") {
    return "border-emerald-200/80 bg-emerald-50/80 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200";
  }

  if (tone === "red") {
    return "border-red-200/80 bg-red-50/80 text-red-600 dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-200";
  }

  if (tone === "sky") {
    return "border-sky-200/80 bg-sky-50/80 text-sky-700 dark:border-sky-400/20 dark:bg-sky-500/10 dark:text-sky-200";
  }

  return "border-neutral-200/80 bg-neutral-50/80 text-neutral-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300";
}

function DashboardSectionHeader({
  title,
  description,
  href,
  actionLabel,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
          {actionLabel ?? "查看"}
          <ArrowUpRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

function DashboardStatCard({
  label,
  value,
  helper,
  href,
  icon: Icon,
  tone = "neutral",
}: DashboardStatCardProps) {
  return (
    <Link href={href} className="group block">
      <AdminContentPanel className="h-full p-4 transition group-hover:-translate-y-0.5 group-hover:border-neutral-300/80 group-hover:bg-white/85 dark:group-hover:border-white/20 dark:group-hover:bg-neutral-950/76">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{value}</p>
            <p className="mt-1 line-clamp-1 text-xs text-neutral-400 dark:text-neutral-500">{helper}</p>
          </div>
          <span className={`grid size-9 shrink-0 place-items-center rounded-xl border shadow-sm ${getToneClassName(tone)}`}>
            <Icon className="size-4" />
          </span>
        </div>
      </AdminContentPanel>
    </Link>
  );
}

function ModuleOverviewGrid({ modules }: { modules: AdminDashboardModuleCount[] }) {
  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader title="模块概览" description="各内容模块规模。" />
      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = moduleIcons[module.key];

          return (
            <Link
              key={module.key}
              href={module.href}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-neutral-200/70 bg-white/55 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white/80 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20 dark:hover:bg-white/[0.06]"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-white/10 dark:text-neutral-300">
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">{module.label}</span>
                  <span className="mt-0.5 block truncate text-xs text-neutral-400">{module.helper}</span>
                </span>
              </span>
              <span className="text-lg font-semibold tabular-nums text-neutral-950 dark:text-neutral-50">
                {formatNumber(module.value)}
              </span>
            </Link>
          );
        })}
      </div>
    </AdminContentPanel>
  );
}

function PendingWorkPanel({ items, total }: { items: AdminDashboardPendingWorkItem[]; total: number }) {
  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader
        title="待处理事项"
        description={total > 0 ? `共有 ${formatNumber(total)} 项需要关注。` : "当前没有待处理事项。"}
        href="/admin/friends"
        actionLabel="去处理"
      />
      <div className="mt-4 grid gap-2">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`group rounded-2xl border px-3 py-2.5 transition hover:-translate-y-0.5 hover:shadow-sm ${getToneClassName(item.tone)}`}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs opacity-75">{item.description}</p>
              </div>
              <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold tabular-nums dark:bg-white/10">
                {formatNumber(item.count)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </AdminContentPanel>
  );
}

function RecentActivityTimeline({ activities }: { activities: AdminDashboardActivityItem[] }) {
  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader title="最近动态" description="跨模块的内容更新和互动记录。" />
      {activities.length > 0 ? (
        <div className="mt-4 space-y-2.5">
          {activities.slice(0, 5).map((activity) => (
            <Link key={activity.id} href={activity.href} className="group grid gap-2.5 rounded-2xl border border-transparent px-2 py-1 transition hover:border-neutral-200/70 hover:bg-white/55 dark:hover:border-white/10 dark:hover:bg-white/[0.04] sm:grid-cols-[auto_1fr_auto] sm:items-start">
              <span className={`mt-1 grid size-8 place-items-center rounded-full border ${getToneClassName(activityToneByType[activity.type])}`}>
                <Activity className="size-3.5" />
              </span>
              <span className="min-w-0">
                <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
                  {activity.label}
                </span>
                <span className="mt-1.5 block truncate text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                  {activity.title}
                </span>
                <span className="mt-0.5 block line-clamp-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                  {activity.description}
                </span>
              </span>
              <span className="text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                {formatDateTime(activity.occurredAt)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <AdminEmptyState>暂无最近动态</AdminEmptyState>
      )}
    </AdminContentPanel>
  );
}

function TopContentList({ title, items }: { title: string; items: AdminDashboardTopContent[] }) {
  const maxViews = Math.max(1, ...items.map((item) => item.views));

  return (
    <div>
      <h3 className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <Link key={item.slug} href={item.href} className="group block rounded-2xl border border-neutral-200/70 bg-white/55 p-2.5 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20 dark:hover:bg-white/[0.06]">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-950 dark:text-neutral-50">
                    #{index + 1} {item.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatNumber(item.views)} 浏览 · {formatNumber(item.likes)} 喜欢 · {formatNumber(item.comments)} 评论
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-neutral-300 transition group-hover:text-neutral-500" />
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-neutral-950 dark:bg-neutral-100"
                  style={{ width: `${Math.max(6, (item.views / maxViews) * 100)}%` }}
                />
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200/70 p-5 text-sm text-neutral-400 dark:border-white/10 dark:text-neutral-500">
            暂无内容数据
          </div>
        )}
      </div>
    </div>
  );
}

function ContentPerformancePanel({ overview }: { overview: AdminDashboardOverview }) {
  const { totals, topWritings, topNotes } = overview.contentPerformance;
  const metrics = [
    { label: "总浏览", value: formatNumber(totals.views), icon: Eye },
    { label: "总喜欢", value: formatNumber(totals.likes), icon: Heart },
    { label: "评论数", value: formatNumber(totals.comments), icon: MessageSquareText },
    { label: "互动率", value: formatPercent(totals.engagementRate), icon: TrendingUp },
  ];

  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader title="内容表现" description="文稿与手记的浏览、喜欢和评论表现。" />
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div key={metric.label} className="rounded-2xl border border-neutral-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-neutral-400">{metric.label}</p>
                <Icon className="size-3.5 text-neutral-300" />
              </div>
              <p className="mt-1.5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{metric.value}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <TopContentList title="热门文稿" items={topWritings.slice(0, 3)} />
        <TopContentList title="热门手记" items={topNotes.slice(0, 3)} />
      </div>
    </AdminContentPanel>
  );
}

function QuickActionsPanel() {
  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader title="快捷操作" description="常用管理动作快速入口。" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-white/65 px-3 py-2.5 text-sm font-medium text-neutral-600 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 hover:shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:text-neutral-50"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <Icon className="size-4 shrink-0 text-neutral-400 group-hover:text-current" />
                <span className="block min-w-0 truncate">{item.title}</span>
              </span>
              <Plus className="size-3.5 shrink-0 text-neutral-400" />
            </Link>
          );
        })}
      </div>
    </AdminContentPanel>
  );
}

function ManagementHealthPanel({ overview }: { overview: AdminDashboardOverview }) {
  const health = overview.managementHealth;
  const healthItems = [
    { label: "公开内容", value: health.visibleTotal, helper: "当前对外展示", tone: "emerald" as Tone },
    { label: "隐藏内容", value: health.hiddenTotal, helper: "后台保留未公开", tone: health.hiddenTotal > 0 ? "neutral" as Tone : "emerald" as Tone },
    { label: "精选相册", value: health.featuredGalleryPhotos, helper: "首页/相册重点展示", tone: health.featuredGalleryPhotos > 0 ? "emerald" as Tone : "amber" as Tone },
    { label: "精选项目", value: health.featuredProjects, helper: "首页项目展示", tone: health.featuredProjects > 0 ? "emerald" as Tone : "amber" as Tone },
  ];

  return (
    <AdminContentPanel className="p-5 sm:p-6">
      <DashboardSectionHeader title="管理状态" description="公开、隐藏、精选和友链审核状态。" />
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {healthItems.map((item) => (
          <div key={item.label} className={`rounded-2xl border p-3 ${getToneClassName(item.tone)}`}>
            <p className="text-xs font-medium opacity-75">{item.label}</p>
            <p className="mt-1.5 text-xl font-semibold tabular-nums">{formatNumber(item.value)}</p>
            <p className="mt-0.5 truncate text-xs opacity-70">{item.helper}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border border-neutral-200/70 bg-white/55 p-3 dark:border-white/10 dark:bg-white/[0.035]">
        <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">友链状态分布</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <span className="rounded-full bg-amber-50 px-3 py-1.5 text-center font-medium text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">待审核 {health.friendStatuses.pending}</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-center font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">已通过 {health.friendStatuses.approved}</span>
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-center font-medium text-red-500 dark:bg-red-500/10 dark:text-red-300">已拒绝 {health.friendStatuses.rejected}</span>
          <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-center font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">已隐藏 {health.friendStatuses.hidden}</span>
        </div>
      </div>
    </AdminContentPanel>
  );
}

export function AdminDashboardContent({ overview }: AdminDashboardContentProps) {
  const moduleValueByKey = new Map(overview.moduleCounts.map((item) => [item.key, item.value]));
  const contentTotal = ["writings", "notes", "thinking", "collection", "gallery", "projects"]
    .reduce((total, key) => total + (moduleValueByKey.get(key as AdminDashboardModuleCount["key"]) ?? 0), 0);
  const interactionTotal = (moduleValueByKey.get("comments") ?? 0) + (moduleValueByKey.get("guestbook") ?? 0);
  const primaryStats = [
    {
      label: "内容总量",
      value: formatNumber(contentTotal),
      helper: "文稿、手记、思考、收藏、相册和项目",
      href: "/admin/writings",
      icon: Layers3,
      tone: "sky" as Tone,
    },
    {
      label: "互动总量",
      value: formatNumber(interactionTotal),
      helper: "评论与留言累计数量",
      href: "/admin/comments",
      icon: MessageCircle,
      tone: "neutral" as Tone,
    },
    {
      label: "待处理",
      value: formatNumber(overview.pendingWork.total),
      helper: overview.pendingWork.total > 0 ? "有事项需要关注" : "当前无需处理",
      href: "/admin/friends",
      icon: Clock3,
      tone: overview.pendingWork.total > 0 ? "amber" as Tone : "emerald" as Tone,
    },
    {
      label: "内容表现",
      value: formatNumber(overview.contentPerformance.totals.views),
      helper: `${formatNumber(overview.contentPerformance.totals.likes)} 喜欢 · ${formatPercent(overview.contentPerformance.totals.engagementRate)} 互动率`,
      href: "/admin/writings",
      icon: BarChart3,
      tone: "emerald" as Tone,
    },
  ];

  return (
    <div className="space-y-5">
      <AdminPageHeader
        title="后台管理"
        description="查看站点内容规模、待处理事项、互动表现和管理状态。"
        icon={LayoutDashboard}
      />

      <div className="rounded-[1.6rem] border border-white/75 bg-gradient-to-br from-white/80 via-white/58 to-neutral-100/70 px-5 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.07),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl dark:border-white/10 dark:from-neutral-950/76 dark:via-neutral-950/54 dark:to-neutral-900/52 dark:shadow-black/30">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-2xl">
              数据来自当前数据库
            </h2>
            <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              实时统计 {formatNumber(contentTotal)} 个内容项、{formatNumber(interactionTotal)} 条互动记录、{formatNumber(overview.pendingWork.total)} 项待关注事项。
            </p>
          </div>
          <span className="w-fit rounded-full bg-white/70 px-3 py-1.5 text-xs text-neutral-500 shadow-sm dark:bg-white/10 dark:text-neutral-400">更新于 {formatDateTime(overview.generatedAt)}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {primaryStats.map((item) => (
          <DashboardStatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.6fr)]">
        <ModuleOverviewGrid modules={overview.moduleCounts} />
        <PendingWorkPanel items={overview.pendingWork.items} total={overview.pendingWork.total} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <RecentActivityTimeline activities={overview.recentActivity} />
        <QuickActionsPanel />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <ContentPerformancePanel overview={overview} />
        <ManagementHealthPanel overview={overview} />
      </div>
    </div>
  );
}
