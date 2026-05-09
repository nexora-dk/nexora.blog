import Link from "next/link";

// 首页“最新动态”列表的数据源，每一项对应一条可点击的时间线记录。
const activities = [
  {
    // year/day/month 拆分存储，便于在卡片左侧按不同字号排版。
    year: "2026",
    day: "01",
    month: "5 月",
    // title 与 summary 负责主要内容说明，tag 和 color 负责辅助分类视觉。
    title: "把个人博客先搭起来",
    summary: "从首页、导航和基础页面开始，让这个站点先有一个可以继续生长的骨架。",
    tag: "博客",
    color: "bg-rose-300",
    // href 决定整条动态点击后跳转到哪个站内页面。
    href: "/writing",
  },
  {
    year: "2026",
    day: "29",
    month: "4 月",
    title: "为什么想要一个自己的角落",
    summary: "比起散落在不同平台的动态，更想有一个可以沉淀想法和作品的地方。",
    tag: "随想",
    color: "bg-violet-300",
    href: "/notes",
  },
  {
    year: "2025",
    day: "27",
    month: "4 月",
    title: "最近在折腾的前端工具链",
    summary: "Next.js、Tailwind、MDX，以及一些让写作体验更舒服的小工具。",
    tag: "前端",
    color: "bg-amber-300",
    href: "/writing",
  },
];

// 渲染首页动态区块：顶部标题和“查看全部”入口，下方按时间记录循环输出列表。
export function SiteNew() {
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
        {activities.map((item) => (
          // 每条动态整体作为 Link，key 使用稳定标题，点击区域覆盖日期、内容和标签。
          <Link key={item.title} href={item.href} className="group grid gap-5 py-8 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1.75rem_1fr_auto] sm:items-start sm:gap-8">
            {/* 日期列把日期数字和月份分开，强化时间感。 */}
            <time className="leading-none text-neutral-400 dark:text-neutral-500">
              <span className="block text-3xl font-semibold tracking-tight">{item.day}</span>
              <span className="mt-2 block text-sm">{item.month}</span>
            </time>
            {/* 彩色圆点使用每条数据的 color，作为动态分类的视觉标记。 */}
            <span className={`mt-2 hidden size-2.5 rounded-full shadow-[0_0_22px_currentColor] sm:block ${item.color}`} />
            {/* 主内容列展示标题和摘要，group-hover 让整条链接悬停时标题响应。 */}
            <span>
              <span className="block text-lg font-semibold tracking-tight transition group-hover:text-neutral-600 dark:group-hover:text-neutral-300">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-neutral-500 dark:text-neutral-400">{item.summary}</span>
            </span>
            {/* 右侧元信息列展示年份和标签，桌面端竖向右对齐。 */}
            <span className="flex items-center gap-3 text-sm text-neutral-400 sm:flex-col sm:items-end sm:gap-2 dark:text-neutral-500">
              <span className="font-medium tabular-nums tracking-wide">{item.year}</span>
              <span># {item.tag}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
