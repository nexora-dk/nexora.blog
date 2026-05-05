import Link from "next/link";
import type { FriendLink } from "./friends-data";

export function FriendCard({ friend }: { friend: FriendLink }) {
  return (
    <Link
      href={friend.href}
      className="group flex h-32 gap-4 rounded-[1.35rem] border border-neutral-200/55 bg-white/65 p-5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink-200 via-orange-100 to-sky-100 font-[family-name:var(--font-dingtalk)] text-xl text-neutral-800 shadow-inner ring-1 ring-white/70 dark:from-pink-500/25 dark:via-orange-400/15 dark:to-sky-400/20 dark:text-neutral-100 dark:ring-white/10">
        {friend.avatar}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{friend.name}</span>
          <span className="text-sm text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400">→</span>
        </span>
        <span className="mt-2 line-clamp-3 block text-xs leading-5 text-neutral-500 dark:text-neutral-400">{friend.description}</span>
      </span>
    </Link>
  );
}
