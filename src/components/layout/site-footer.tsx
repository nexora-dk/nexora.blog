import Link from "next/link";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { title: "首页", href: "/" },
  { title: "文稿", href: "/writing" },
  { title: "手记", href: "/notes" },
  { title: "时光", href: "/timeline" },
];

const moreLinks = [
  { title: "留言", href: "/Comments" },
  { title: "友链", href: "/friends" },
  { title: "项目", href: "/projects" },
  { title: "关于", href: "/about" },
];

const extraLinks = [
  { title: "GitHub", href: "https://github.com" },
  { title: "RSS", href: "/rss.xml" },
  { title: "站点", href: "/Site" },
];

const linkClassName = "group flex items-center justify-between rounded-full px-2.5 py-1.5 text-[0.86rem] font-medium text-neutral-700 transition duration-150 hover:bg-white/55 hover:text-neutral-950 dark:text-zinc-300 dark:hover:bg-white/8 dark:hover:text-white";

export function SiteFooter() {
  return (
    <footer className="px-5 pb-7 pt-14">
      <div className="mx-auto grid max-w-[830px] gap-2.5 rounded-[1.85rem] border border-neutral-200/55 bg-white/60 p-2.5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur-[40px] backdrop-saturate-150 md:grid-cols-[1.12fr_0.88fr_0.88fr] dark:border-neutral-800/55 dark:bg-neutral-950/30">
        <section className="p-5 md:row-span-2">
          <div className="flex h-full min-h-44 flex-col justify-between gap-8">
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex text-[1.05rem] font-semibold tracking-[-0.035em] text-neutral-900 transition hover:text-orange-500 dark:text-zinc-100 dark:hover:text-amber-200"
              >
                {siteConfig.name}
              </Link>
              <p className="max-w-60 text-[0.86rem] leading-6 text-neutral-500 dark:text-zinc-500">
                {siteConfig.description}，记录代码、生活和一些阶段性的想法。
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/38 px-3 py-1.5 text-xs font-medium text-neutral-500 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.38)] dark:border-transparent dark:bg-white/[0.025] dark:text-zinc-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgb(34_197_94_/_0.55)]" />
              持续折腾中
            </div>
          </div>
        </section>

        <section className="p-4">
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">导航</h2>
          <div className="grid gap-1.5">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.title}
                <span className="text-neutral-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-600">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="p-4">
          <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">更多</h2>
          <div className="grid gap-1.5">
            {moreLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClassName}>
                {link.title}
                <span className="text-neutral-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-zinc-600">→</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="p-4 md:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-3 text-[0.7rem] font-semibold tracking-[0.18em] text-neutral-400 dark:text-zinc-600">链接</h2>
              <div className="flex flex-wrap gap-2">
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
