import {
  SiApifox,
  SiBun,
  SiCloudflare,
  SiCss,
  SiFigma,
  SiFirebase,
  SiGit,
  SiGithub,
  SiHtml5,
  SiIconify,
  SiJavascript,
  SiMarkdown,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiVitest,
  SiVuedotjs,
  type IconType,
} from "@icons-pack/react-simple-icons";
import { Wrench } from "lucide-react";

// 单个技术栈条目的数据结构：展示名称和对应图标组件。
type StackItem = {
  label: string;
  icon: IconType;
};

// 第一行技术栈图标数据，按横向跑马灯顺序展示。
const firstRow: StackItem[] = [
  { label: "HTML", icon: SiHtml5 },
  { label: "CSS", icon: SiCss },
  { label: "JavaScript", icon: SiJavascript },
  { label: "TypeScript", icon: SiTypescript },
  { label: "Figma", icon: SiFigma },
  { label: "Tailwind CSS", icon: SiTailwindcss },
  { label: "Next.js", icon: SiNextdotjs },
  { label: "Vue", icon: SiVuedotjs },
  { label: "React", icon: SiReact },
  { label: "Node.js", icon: SiNodedotjs },
  { label: "PostgreSQL", icon: SiPostgresql },
  { label: "Apifox", icon: SiApifox },
];

// 第二行技术栈图标数据，组件中会反向滚动以增加动态层次。
const secondRow: StackItem[] = [
  { label: "Bun", icon: SiBun },
  { label: "MySQL", icon: SiMysql },
  { label: "Firebase", icon: SiFirebase },
  { label: "Git", icon: SiGit },
  { label: "Vite", icon: SiVite },
  { label: "Cloudflare", icon: SiCloudflare },
  { label: "Markdown", icon: SiMarkdown },
  { label: "Vitest", icon: SiVitest },
  { label: "GitHub", icon: SiGithub },
  { label: "Iconify", icon: SiIconify },
];

// 渲染单个技术图标，title 提供悬停提示和辅助说明。
function StackIcon({ item }: { item: StackItem }) {
  // 将数据中的图标组件赋值为大写变量，满足 JSX 组件渲染规则。
  const Icon = item.icon;

  return (
    <div className="grid size-11 shrink-0 place-items-center text-neutral-950 dark:text-neutral-50" title={item.label}>
      <Icon className="size-9" />
    </div>
  );
}

// 渲染一行无缝滚动的技术栈图标，reverse 控制动画方向。
function MarqueeRow({ items, reverse = false }: { items: StackItem[]; reverse?: boolean }) {
  // 复制一份数组接在后面，让 CSS 位移动画循环时首尾能自然衔接。
  const repeatedItems = [...items, ...items];

  return (
    <div className="group relative min-w-0 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      {/* 根据 reverse 选择正向或反向动画，悬停时暂停便于查看图标。 */}
      <div className={`flex w-max gap-8 ${reverse ? "animate-[marquee-reverse_24s_linear_infinite]" : "animate-[marquee_24s_linear_infinite]"} group-hover:[animation-play-state:paused]`}>
        {repeatedItems.map((item, index) => (
          // key 组合 label 和 index，因为 repeatedItems 中会出现重复 label。
          <StackIcon key={`${item.label}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

// 首页关于我区域的技术栈卡片，包含两行方向相反的图标跑马灯。
export function StacksCard() {
  return (
    <div className="min-h-[220px] min-w-0 overflow-hidden rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30 sm:min-h-0 sm:flex-1">
      {/* 卡片标题行，用扳手图标表达工具/技术栈主题。 */}
      <div className="flex items-center gap-3 text-base font-semibold tracking-tight">
        <Wrench className="size-5" />
        技术栈
      </div>
      {/* 两行跑马灯分别承载不同技术集合，第二行反向滚动。 */}
      <div className="mt-7 space-y-3">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
      </div>
    </div>
  );
}
