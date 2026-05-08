"use client";

import { useMemo, useState } from "react";
import { Heart } from "lucide-react";

type NoteLikeButtonProps = {
  noteSlug: string;
  initialLikes: string;
};

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

function formatLikeCount(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
}

export function NoteLikeButton({ noteSlug, initialLikes }: NoteLikeButtonProps) {
  const storageKey = `personal-blog:note-like:${noteSlug}`;
  const [liked, setLiked] = useState(() => (typeof window === "undefined" ? false : window.localStorage.getItem(storageKey) === "true"));
  const [showTip, setShowTip] = useState(false);
  const baseLikes = useMemo(() => parseLikeCount(initialLikes), [initialLikes]);
  const likeCount = baseLikes + (liked ? 1 : 0);

  function toggleLike() {
    setLiked((currentLiked) => {
      const nextLiked = !currentLiked;

      if (nextLiked) {
        window.localStorage.setItem(storageKey, "true");
        setShowTip(true);
        window.setTimeout(() => setShowTip(false), 1600);
      } else {
        window.localStorage.removeItem(storageKey);
        setShowTip(false);
      }

      return nextLiked;
    });
  }

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      <button type="button" aria-label={liked ? "取消点赞" : "点赞"} aria-pressed={liked} onClick={toggleLike} className={`inline-flex min-w-32 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 ${liked ? "border-[#18181b] bg-[#18181b] text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950" : "border-zinc-200/80 bg-white/60 text-[#756b62] hover:border-zinc-300 hover:bg-white/80 hover:text-[#18181b] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"}`}>
        <Heart className={`size-4 shrink-0 stroke-[1.7] ${liked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{liked ? "已点赞" : "点赞"}</span>
        <span className="tabular-nums">{formatLikeCount(likeCount)}</span>
      </button>
      <div role="status" aria-live="polite" className={`pointer-events-none absolute top-[calc(100%+0.55rem)] rounded-full border border-zinc-200/70 bg-white/90 px-3 py-1 text-xs font-medium text-[#756b62] shadow-[0_10px_26px_rgba(35,31,28,0.08)] backdrop-blur transition duration-200 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-300 ${showTip ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
        谢谢喜欢
      </div>
    </div>
  );
}
