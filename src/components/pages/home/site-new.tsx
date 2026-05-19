import Link from "next/link";

import { getDateParts, type TimelineItem } from "@/components/pages/timeline/timeline-data";

const activityColors = ["bg-rose-300", "bg-violet-300", "bg-amber-300"];

type SiteNewProps = {
  items: TimelineItem[];
};

// 渲染首页动态区块：顶部标题和“查看全部”入口，下方按时间记录循环输出列表。
export function SiteNew({ items }: SiteNewProps) {
  return (
    <section className="space-y-10">
      {/* 区块头部负责说明当前模块，并提供跳转到完整时间线的入口。 */}
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">site new</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">最新动态</h2>
        </div>
        <Link href="/timeline" className="text-sm text-neutral-500 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
          查看全部 →
        </Link>
      </div>

      {/* 使用 divide-y 形成时间线条目之间的分隔线。 */}
      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {items.map((item, index) => {
          const dateParts = getDateParts(item.date);
          const [, month = dateParts.shortDate, day = ""] = dateParts.shortDate.match(/^(\d+)月(\d+)日$/) ?? [];

          return (
            // 每条动态整体作为 Link，key 使用类型和地址，点击区域覆盖日期、内容和标签。
            <Link key={`${item.type}-${item.href}`} href={item.href} className="group grid gap-5 py-8 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1.75rem_1fr_auto] sm:items-start sm:gap-8">
              {/* 日期列把日期数字和月份分开，强化时间感。 */}
              <time className="leading-none text-neutral-400 dark:text-neutral-500" dateTime={item.date}>
                <span className="block text-3xl font-semibold tracking-tight">{day || dateParts.shortDate}</span>
                <span className="mt-2 block text-sm">{day ? `${month} 月` : ""}</span>
              </time>
              {/* 彩色圆点根据列表位置循环取色，作为动态分类的视觉标记。 */}
              <span className={`mt-2 hidden size-2.5 rounded-full shadow-[0_0_22px_currentColor] sm:block ${activityColors[index % activityColors.length]}`} />
              {/* 主内容列展示标题和摘要，group-hover 让整条链接悬停时标题响应。 */}
              <span>
                <span className="block text-lg font-semibold tracking-tight transition group-hover:text-neutral-600 dark:group-hover:text-neutral-300">{item.title}</span>
                <span className="mt-2 block text-sm leading-6 text-neutral-500 dark:text-neutral-400">{item.description}</span>
              </span>
              {/* 右侧元信息列展示年份和标签，桌面端竖向右对齐。 */}
              <span className="flex items-center gap-3 text-sm text-neutral-400 sm:flex-col sm:items-end sm:gap-2 dark:text-neutral-500">
                <span className="font-medium tabular-nums tracking-wide">{dateParts.year}</span>
                <span># {item.typeLabel}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
