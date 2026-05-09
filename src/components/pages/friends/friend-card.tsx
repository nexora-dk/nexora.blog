import Link from "next/link";
import type { FriendLink } from "./friends-data";

// FriendCard 负责把单个友链数据渲染成可点击卡片。
// friend 使用 FriendLink 类型，包含名称、描述、跳转地址和头像占位字符。
export function FriendCard({ friend }: { friend: FriendLink }) {
  return (
    // 整张卡片使用 Next.js Link 包裹，点击任意区域都会跳转到友链地址。
    <Link
      href={friend.href}
      className="group flex h-32 gap-4 rounded-[1.35rem] border border-neutral-200/55 bg-white/65 p-5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88"
    >
      {/* 左侧圆形区域展示友链头像字符，作为轻量头像占位。 */}
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink-200 via-orange-100 to-sky-100 font-[family-name:var(--font-dingtalk)] text-xl text-neutral-800 shadow-inner ring-1 ring-white/70 dark:from-pink-500/25 dark:via-orange-400/15 dark:to-sky-400/20 dark:text-neutral-100 dark:ring-white/10">
        {friend.avatar}
      </span>
      {/* 右侧内容区承载名称、箭头和简介，min-w-0 用于让截断生效。 */}
      <span className="min-w-0 flex-1">
        {/* 顶部横排展示友链名称和 hover 时有位移动效的箭头提示。 */}
        <span className="flex items-center justify-between gap-3">
          <span className="truncate text-base font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">{friend.name}</span>
          <span className="text-sm text-neutral-300 transition group-hover:translate-x-0.5 group-hover:text-neutral-500 dark:text-neutral-700 dark:group-hover:text-neutral-400">→</span>
        </span>
        {/* 简介文本限制为三行，避免不同长度描述破坏卡片高度。 */}
        <span className="mt-2 line-clamp-3 block text-xs leading-5 text-neutral-500 dark:text-neutral-400">{friend.description}</span>
      </span>
    </Link>
  );
}
