import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SiAwwwards,
  SiDaisyui,
  SiDribbble,
  SiDrizzle,
  SiExcalidraw,
  SiFigma,
  SiGithub,
  SiIconify,
  SiNextdotjs,
  SiRailway,
  SiResend,
  SiShadcnui,
  SiSupabase,
  SiTldraw,
  SiUpstash,
  SiVercel,
} from "@icons-pack/react-simple-icons";
import { ImageIcon } from "lucide-react";
import type { CollectionIcon, CollectionItem, SimpleIconName } from "./collection-data";

// simple-icons 名称到真实 React 图标组件的映射表，和 collection-data.ts 的类型白名单一一对应。
const simpleIcons: Record<SimpleIconName, ComponentType<{ className?: string }>> = {
  tldraw: SiTldraw,
  excalidraw: SiExcalidraw,
  figma: SiFigma,
  github: SiGithub,
  iconify: SiIconify,
  railway: SiRailway,
  resend: SiResend,
  nextdotjs: SiNextdotjs,
  drizzle: SiDrizzle,
  vercel: SiVercel,
  supabase: SiSupabase,
  upstash: SiUpstash,
  awwwards: SiAwwwards,
  dribbble: SiDribbble,
  shadcnui: SiShadcnui,
  daisyui: SiDaisyui,
};

// 收藏卡片的统一样式字符串，Link 和普通 div 复用以保持视觉一致。
const cardClassName =
  "group flex h-32 items-start gap-4 rounded-[1.35rem] border border-neutral-200/55 bg-white/65 p-6 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075),inset_0_-1px_0_rgba(255,255,255,0.025)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88 dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(255,255,255,0.035)]";

// 单张收藏卡片，根据 item.href 决定渲染为外链 Link 还是不可点击的 div。
export function CollectionCard({ item }: { item: CollectionItem }) {
  // content 抽出来复用，避免 Link 分支和 div 分支重复维护图标与文案结构。
  const content = (
    <>
      {/* 左侧图标根据数据类型渲染 simple icon、本地图片或占位图标。 */}
      <CollectionIcon icon={item.icon} />
      {/* 右侧文字列使用 min-w-0，配合 line-clamp 防止长文本撑破卡片。 */}
      <div className="min-w-0 pt-0.5">
        <h3 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{item.title}</h3>
        <p className="mt-1 line-clamp-3 text-xs leading-[1.35] text-neutral-500 dark:text-neutral-400">{item.description}</p>
      </div>
    </>
  );

  if (!item.href) {
    // 没有 href 的收藏项只作为静态卡片展示，不提供跳转行为。
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    // 有 href 时整张卡片作为外链打开，并使用 noreferrer 降低外站引用风险。
    <Link href={item.href} className={cardClassName} target="_blank" rel="noreferrer">
      {content}
    </Link>
  );
}

// 收藏卡片图标渲染器，处理 simple-icons、本地图片和图片缺失占位三种情况。
function CollectionIcon({ icon }: { icon: CollectionIcon }) {
  // 图标外壳样式统一尺寸、圆角、背景和描边，让不同来源图标保持一致。
  const shellClassName = "grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-100 shadow-inner ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800";

  if (icon.type === "image") {
    if (!icon.src) {
      // 图片类型但没有 src 时，展示通用图片占位图标。
      return (
        <span className={shellClassName}>
          <ImageIcon className="size-7 text-neutral-400 dark:text-neutral-500" />
        </span>
      );
    }

    return (
      // 本地图片图标用 fill 铺满圆形容器，className 可从数据侧微调背景等样式。
      <span className={`relative size-12 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 ${icon.className ?? ""}`}>
        <Image src={icon.src} alt={icon.alt ?? "收藏图标"} fill sizes="48px" className="object-cover" />
      </span>
    );
  }

  // simple 类型从映射表取出具体组件，并合并数据侧传入的颜色类名。
  const Icon = simpleIcons[icon.name];
  const className = `size-8 ${icon.className ?? "text-neutral-950 dark:text-neutral-50"}`;

  return (
    <span className={shellClassName}>
      <Icon className={className} />
    </span>
  );
}
