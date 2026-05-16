"use client";

import { updateNoteLikeAction } from "@/app/actions/note-like";
import { useRouter } from "next/navigation";

// Client Component：首行必须保留 use client；点赞状态依赖浏览器 localStorage 和点击事件。
import { useEffect, useMemo, useState, useTransition } from "react";
import { Heart } from "lucide-react";

// 点赞按钮需要手记 slug 做本地存储隔离，并接收 frontmatter 中的初始喜欢数。
type NoteLikeButtonProps = {
  noteSlug: string;
  initialLikes: string;
};

// 把展示用喜欢数字符串转成可计算数值，兼容 k、万和逗号分隔格式。
function parseLikeCount(value: string) {
  const normalizedValue = value.trim().toLowerCase().replace(/,/g, "");

  if (normalizedValue.endsWith("k")) {
    return Math.round((Number.parseFloat(normalizedValue) || 0) * 1000);
  }

  if (normalizedValue.endsWith("万")) {
    return Math.round((Number.parseFloat(normalizedValue) || 0) * 10000);
  }

  return Number.parseInt(normalizedValue, 10) || 0;
}

// 把内部数值重新格式化为页面展示字符串，保持大数显示简洁。
function formatLikeCount(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
}

// 点赞交互组件：在客户端读取/写入 localStorage，并即时更新按钮状态和计数。
export function NoteLikeButton({ noteSlug, initialLikes }: NoteLikeButtonProps) {
  const router = useRouter();
  const storageKey = `personal-blog:note-like:${noteSlug}`;
  const [liked, setLiked] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [isPending, startTransition] = useTransition();
  const baseLikes = useMemo(() => parseLikeCount(initialLikes), [initialLikes]);
  const [likeCount, setLikeCount] = useState(baseLikes);

  useEffect(() => {
    queueMicrotask(() => {
      setLiked(window.localStorage.getItem(storageKey) === "true");
      setLikeCount(baseLikes);
    });
  }, [baseLikes, storageKey]);

  // 切换点赞状态时同步本地存储；点赞成功短暂显示感谢提示。
  function toggleLike() {
    const nextLiked = !liked;

    setLiked(nextLiked);
    setLikeCount((currentCount) => Math.max(0, currentCount + (nextLiked ? 1 : -1)));

    if (nextLiked) {
      window.localStorage.setItem(storageKey, "true");
      setShowTip(true);
      window.setTimeout(() => setShowTip(false), 1600);
    } else {
      window.localStorage.removeItem(storageKey);
      setShowTip(false);
    }

    startTransition(async () => {
      await updateNoteLikeAction(noteSlug, nextLiked);
      router.refresh();
    });
  }

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      {/* 按钮使用 aria-pressed 暴露点赞状态，样式根据 liked 条件切换。 */}
      <button type="button" aria-label={liked ? "取消点赞" : "点赞"} aria-pressed={liked} disabled={isPending} onClick={toggleLike} className={`inline-flex min-w-32 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 ${liked ? "border-[#18181b] bg-[#18181b] text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950" : "border-zinc-200/80 bg-white/60 text-[#756b62] hover:border-zinc-300 hover:bg-white/80 hover:text-[#18181b] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"}`}>
        <Heart className={`size-4 shrink-0 stroke-[1.7] ${liked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{liked ? "已点赞" : "点赞"}</span>
        <span className="tabular-nums">{formatLikeCount(likeCount)}</span>
      </button>
      {/* 状态提示用 aria-live 礼貌播报，未显示时只通过透明度隐藏。 */}
      <div role="status" aria-live="polite" className={`pointer-events-none absolute top-[calc(100%+0.55rem)] rounded-full border border-zinc-200/70 bg-white/90 px-3 py-1 text-xs font-medium text-[#756b62] shadow-[0_10px_26px_rgba(35,31,28,0.08)] backdrop-blur transition duration-200 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-300 ${showTip ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
        谢谢喜欢
      </div>
    </div>
  );
}
