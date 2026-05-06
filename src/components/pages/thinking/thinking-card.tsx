import Image from "next/image";
import avatarImage from "@/../public/images/avatar/avatar.jpg";
import type { ThinkingItem } from "./thinking-data";

type ThinkingCardProps = {
  item: ThinkingItem;
};

export function ThinkingCard({ item }: ThinkingCardProps) {
  return (
    <article className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4">
      <Image src={avatarImage} alt="Nexora 头像" className="mt-1 size-11 rounded-full object-cover ring-1 ring-zinc-200/80 dark:ring-white/10" />

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-base font-medium text-zinc-950 dark:text-neutral-50">Nexora</span>
          <time className="text-xs text-zinc-400 dark:text-neutral-500">{item.publishedAt}</time>
          {item.time ? <span className="text-xs tabular-nums text-zinc-400 dark:text-neutral-500">{item.time}</span> : null}
          {item.mood ? <span className="text-xs text-sky-500 dark:text-sky-300/80">{item.mood}</span> : null}
        </div>

        <div className="mt-3 w-fit max-w-full rounded-2xl rounded-tl-md bg-zinc-100/85 px-4 py-3 dark:bg-white/[0.07]">
          <p className="whitespace-pre-line text-[0.96rem] font-medium leading-7 text-zinc-700 dark:text-neutral-200">{item.content}</p>
        </div>
      </div>
    </article>
  );
}
