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

type StackItem = {
  label: string;
  icon: IconType;
};

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

function StackIcon({ item }: { item: StackItem }) {
  const Icon = item.icon;

  return (
    <div className="grid size-11 shrink-0 place-items-center text-neutral-950 dark:text-neutral-50" title={item.label}>
      <Icon className="size-9" />
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: StackItem[]; reverse?: boolean }) {
  const repeatedItems = [...items, ...items];

  return (
    <div className="group relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className={`flex w-max gap-8 ${reverse ? "animate-[marquee-reverse_24s_linear_infinite]" : "animate-[marquee_24s_linear_infinite]"} group-hover:[animation-play-state:paused]`}>
        {repeatedItems.map((item, index) => (
          <StackIcon key={`${item.label}-${index}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function StacksCard() {
  return (
    <div className="min-h-0 flex-1 overflow-hidden rounded-[1.35rem] border border-neutral-200/55 bg-white/60 p-7 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur dark:border-neutral-800/55 dark:bg-neutral-950/30">
      <div className="flex items-center gap-3 text-base font-semibold tracking-tight">
        <Wrench className="size-5" />
        技术栈
      </div>
      <div className="mt-7 space-y-3">
        <MarqueeRow items={firstRow} />
        <MarqueeRow items={secondRow} reverse />
      </div>
    </div>
  );
}
