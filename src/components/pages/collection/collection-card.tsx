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

const cardClassName =
  "group flex h-32 items-start gap-4 rounded-[1.35rem] border border-neutral-200/55 bg-white/65 p-6 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075),inset_0_-1px_0_rgba(255,255,255,0.025)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88 dark:hover:shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.09),inset_0_-1px_0_rgba(255,255,255,0.035)]";

export function CollectionCard({ item }: { item: CollectionItem }) {
  const content = (
    <>
      <CollectionIcon icon={item.icon} />
      <div className="min-w-0 pt-0.5">
        <h3 className="text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{item.title}</h3>
        <p className="mt-1 line-clamp-3 text-xs leading-[1.35] text-neutral-500 dark:text-neutral-400">{item.description}</p>
      </div>
    </>
  );

  if (!item.href) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={item.href} className={cardClassName} target="_blank" rel="noreferrer">
      {content}
    </Link>
  );
}

function CollectionIcon({ icon }: { icon: CollectionIcon }) {
  const shellClassName = "grid size-12 shrink-0 place-items-center overflow-hidden rounded-full bg-neutral-100 shadow-inner ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800";

  if (icon.type === "image") {
    if (!icon.src) {
      return (
        <span className={shellClassName}>
          <ImageIcon className="size-7 text-neutral-400 dark:text-neutral-500" />
        </span>
      );
    }

    return (
      <span className={`relative size-12 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 ${icon.className ?? ""}`}>
        <Image src={icon.src} alt={icon.alt ?? "收藏图标"} fill sizes="48px" className="object-cover" />
      </span>
    );
  }

  const Icon = simpleIcons[icon.name];
  const className = `size-8 ${icon.className ?? "text-neutral-950 dark:text-neutral-50"}`;

  return (
    <span className={shellClassName}>
      <Icon className={className} />
    </span>
  );
}
