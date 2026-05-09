// Next.js Link 用于页脚内部导航和外部入口跳转。
import Link from "next/link";
// 站点配置提供站点名称和简介。
import { siteConfig } from "@/lib/site";

// 页脚主导航入口，保持与顶部导航的核心栏目一致。
const navLinks = [
  // 首页入口。
  { title: "首页", href: "/" },
  // 文稿列表入口。
  { title: "文稿", href: "/writing" },
  // 手记列表入口。
  { title: "手记", href: "/notes" },
  // 时间线入口。
  { title: "时光", href: "/timeline" },
];

// 页脚更多页面入口，用于收纳辅助页面。
const moreLinks = [
  // 留言页入口。
  { title: "留言", href: "/Comments" },
  // 友链页入口。
  { title: "友链", href: "/friends" },
  // 项目页入口。
  { title: "项目", href: "/projects" },
  // 关于页入口。
  { title: "关于", href: "/about" },
];

// 页脚额外链接，包含外部平台和站点相关入口。
const extraLinks = [
  // GitHub 外部入口，目前指向 GitHub 首页。
  { title: "GitHub", href: "https://github.com" },
  // RSS 订阅入口。
  { title: "RSS", href: "/rss.xml" },
  // 此站点说明页面入口。
  { title: "站点", href: "/Site" },
];

// 页脚列表链接的统一样式，包含 hover 背景、文字颜色和箭头动效基础。
const linkClassName = "group flex items-center justify-between rounded-full px-2.5 py-1.5 text-[0.86rem] font-medium text-neutral-700 transition duration-150 hover:bg-white/55 hover:text-neutral-950 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-white";

/**
 * 站点页脚：展示品牌说明、常用导航、更多入口、外部链接和版权信息。
 */
export function SiteFooter() {
  return (
    // 页脚外层提供左右边距和与正文的顶部间距。
    <footer className="px-5 pb-7 pt-14">
      {/* 玻璃拟态卡片网格，在桌面端拆成三列布局。 */}
      <div className="mx-auto grid max-w-[830px] gap-2.5 rounded-[1.85rem] border border-neutral-200/55 bg-white/60 p-2.5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur-[40px] backdrop-saturate-150 md:grid-cols-[1.12fr_0.88fr_0.88fr] dark:border-neutral-800/55 dark:bg-neutral-950/30">
        {/* 品牌信息区，占据桌面端左侧两行高度。 */}
        <section className="p-5 md:row-span-2">
          {/* 使用纵向分布让品牌说明和状态标签分别贴近卡片上下两端。 */}
          <div className="flex h-full min-h-44 flex-col justify-between gap-8">
            {/* 站点名称和简介。 */}
            <div className="space-y-3">
              {/* 站点名称链接，点击返回首页。 */}
              <Link
                href="/"
                className="inline-flex text-[1.05rem] font-semibold tracking-[-0.035em] text-neutral-900 transition hover:text-orange-500 dark:text-zinc-100 dark:hover:text-amber-200"
              >
                {siteConfig.name}
              </Link>
              {/* 站点一句话说明，结合全局描述和博客主题。 */}
              <p className="max-w-60 text-[0.86rem] leading-6 text-neutral-500 dark:text-zinc-500">
                {siteConfig.description}，记录代码、生活和一些阶段性的想法。
              </p>
            </div>

            {/* 站点状态徽标，表达博客仍在持续更新和折腾。 */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/38 px-3 py-1.5 text-xs font-medium text-neutral-500 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.38)] dark:border-transparent dark:bg-white/[0.025] dark:text-zinc-500">
              {/* 绿色圆点模拟在线或活跃状态。 */}
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(34_197_94_/_0.55)]" />
              持续折腾中
            </div>
          </div>
        </section>

        {/* 主导航链接区。 */}
        <section className="p-4">
          {/* 分组标题使用小号大写字距，形成页脚栏目标签。 */}
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">导航</h2>
          {/* 纵向链接列表。 */}
          <div className="grid gap-1.5">
            {/* 根据 navLinks 数据生成页脚主导航链接。 */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.title}
                {/* hover 时出现的右箭头，提示可点击跳转。 */}
                <span className="text-neutral-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-600">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 更多页面链接区。 */}
        <section className="p-4">
          {/* 分组标题。 */}
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">更多</h2>
          {/* 纵向链接列表。 */}
          <div className="grid gap-1.5">
            {/* 根据 moreLinks 数据生成辅助页面入口。 */}
            {moreLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.title}
                {/* hover 时出现的右箭头，保持和主导航一致的交互反馈。 */}
                <span className="text-neutral-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-600">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 外部/补充链接与版权信息区，在桌面端横跨右侧两列。 */}
        <section className="p-4 md:col-span-2">
          {/* 小屏纵向堆叠，大屏横向对齐链接和版权。 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* 补充链接按钮组。 */}
            <div>
              {/* 分组标题。 */}
              <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">链接</h2>
              {/* 链接按钮允许换行，适配不同屏幕宽度。 */}
              <div className="flex flex-wrap gap-2">
                {/* 根据 extraLinks 数据渲染胶囊按钮。 */}
                {extraLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-white/28 bg-white/34 px-3 py-1.5 text-[0.82rem] font-medium text-neutral-700 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.32)] transition duration-150 hover:-translate-y-0.5 hover:bg-white/58 hover:text-neutral-950 dark:border-transparent dark:bg-white/[0.025] dark:text-zinc-400 dark:hover:bg-white/[0.045] dark:hover:text-zinc-100"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            {/* 版权和技术栈简短说明。 */}
            <p className="text-xs leading-5 text-neutral-400 dark:text-zinc-600">
              © {new Date().getFullYear()} {siteConfig.name}
              <br />
              Built with Next.js
            </p>
          </div>
        </section>
      </div>
    </footer>
  );
}
