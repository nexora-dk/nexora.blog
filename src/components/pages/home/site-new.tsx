import Link from "next/link";

const activities = [
  {
    year: "2026",
    day: "01",
    month: "5 月",
    title: "把个人博客先搭起来",
    summary: "从首页、导航和基础页面开始，让这个站点先有一个可以继续生长的骨架。",
    tag: "博客",
    color: "bg-rose-300",
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

export function SiteNew() {
  return (
    <section className="space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">site new</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">最新动态</h2>
        </div>
        <Link href="/timeline" className="text-sm text-neutral-500 transition hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50">
          查看全部 →
        </Link>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {activities.map((item) => (
          <Link key={item.title} href={item.href} className="group grid gap-5 py-8 first:pt-0 last:pb-0 sm:grid-cols-[4rem_1.75rem_1fr_auto] sm:items-start sm:gap-8">
            <time className="leading-none text-neutral-400 dark:text-neutral-500">
              <span className="block text-3xl font-semibold tracking-tight">{item.day}</span>
              <span className="mt-2 block text-sm">{item.month}</span>
            </time>
            <span className={`mt-2 hidden size-2.5 rounded-full shadow-[0_0_22px_currentColor] sm:block ${item.color}`} />
            <span>
              <span className="block text-lg font-semibold tracking-tight transition group-hover:text-neutral-600 dark:group-hover:text-neutral-300">{item.title}</span>
              <span className="mt-2 block text-sm leading-6 text-neutral-500 dark:text-neutral-400">{item.summary}</span>
            </span>
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
