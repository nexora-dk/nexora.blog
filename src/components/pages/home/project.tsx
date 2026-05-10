import Link from "next/link";
import { Hammer } from "lucide-react";

// 首页精选项目数据源，每一项对应一个项目卡片。
const projects = [
  {
    title: "Personal Blog",
    description: "一个用 Next.js 搭建的个人博客，用来记录文章、手记、项目和长期收藏。",
    status: "Building",
    href: "/projects",
  },
  {
    title: "Frontend Notes",
    description: "整理前端学习路线、工程化经验和一些容易忘记的实现细节。",
    status: "Writing",
    href: "/writing",
  },
];

// 复用的区块标题组件，包含英文小标签、中文标题和背景幽灵字。
function SectionTitle({ label, title, ghost }: { label: string; title: string; ghost: string }) {
  return (
    <div className="relative mx-auto w-fit px-10 py-4 text-center">
      {/* 背景幽灵字使用绝对定位，不参与文档流，只提供视觉层次。 */}
      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 text-6xl font-black uppercase tracking-tight text-neutral-100 dark:text-neutral-900/80">
        {ghost}
      </span>
      {/* 椭圆描边增强标题区域的手绘标记感。 */}
      <span className="absolute left-1/2 top-1/2 -z-10 h-14 w-48 -translate-x-1/2 -translate-y-1/2 -rotate-[-8deg] rounded-[50%] border border-neutral-300 dark:border-neutral-800" />
      <p className="font-serif text-sm italic leading-none text-neutral-500 dark:text-neutral-400">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    </div>
  );
}

// 渲染首页“精选项目”区块，展示项目卡片并提供查看全部项目入口。
export function Project() {
  return (
    <section className="space-y-10">
      <SectionTitle label="project" title="精选项目" ghost="works" />
      {/* 项目列表在桌面端两列排列。 */}
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project) => (
          // 每个项目卡片整体可点击，跳转到项目或文章聚合页面。
          <Link
            key={project.title}
            href={project.href}
            className="group overflow-hidden rounded-[2rem] border border-neutral-200/55 bg-white/60 p-4 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 dark:border-neutral-800/55 dark:bg-neutral-900/35"
          >
            {/* 卡片顶部展示类型标签和项目状态。 */}
            <div className="flex items-center justify-between px-2 pb-4 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <Hammer className="size-4" />
                项目
              </span>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">{project.status}</span>
            </div>
            {/* 渐变封面区域承载项目标题和简介。 */}
            <div className="relative min-h-56 overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-400 p-7 text-white dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-950">
              {/* 叠加径向高光与底部暗角，保证白色文字在封面上可读。 */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.7),transparent_32%),linear-gradient(to_top,rgba(0,0,0,0.65),transparent_58%)]" />
              {/* 内容固定在封面底部，形成作品卡片的海报感。 */}
              <div className="relative flex h-full min-h-44 flex-col justify-end">
                <h3 className="text-2xl font-semibold tracking-tight">{project.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/82">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* 底部按钮跳转到完整项目页。 */}
      <div className="flex justify-center">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 py-1.5 pl-5 pr-1.5 text-sm font-medium text-neutral-600 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900/55 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-50"
        >
          查看全部项目
          <span className="grid size-7 place-items-center rounded-full bg-neutral-950 text-xs text-white transition group-hover:translate-x-0.5 dark:bg-neutral-50 dark:text-neutral-950" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
