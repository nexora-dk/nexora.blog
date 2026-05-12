"use client";

import { updateWritingLikeAction } from "@/app/actions/writing-like";

// 客户端点赞按钮负责本地记录用户是否已点赞，并即时更新展示计数。
import { useEffect, useMemo, useState, useTransition } from "react";
import { Heart } from "lucide-react";

// articleSlug 用于生成 localStorage key，initialLikes 是服务端文章数据中的初始喜欢数。
type ArticleLikeButtonProps = {
  articleSlug: string;
  initialLikes: string;
};

// 把展示用的喜欢数字符串解析成数值，兼容逗号、k 和“万”等格式。
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

// 把数值重新格式化为紧凑展示文本，保持点赞后计数风格一致。
function formatLikeCount(value: number) {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1).replace(/\.0$/, "")}万`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }

  return String(value);
}

// ArticleLikeButton 包含本地状态、localStorage 持久化和提示气泡交互。
export function ArticleLikeButton({
  articleSlug,
  initialLikes,
}: ArticleLikeButtonProps) {
  const storageKey = `personal-blog:article-like:${articleSlug}`;
  
  const [liked, setLiked] = useState(false);
  // showTip 控制“谢谢喜欢”提示的显隐动画。
  const [showTip, setShowTip] = useState(false);
  const [isPending, startTransition] = useTransition();

  const baseLikes = useMemo(() => parseLikeCount(initialLikes), [initialLikes]);
  const [likeCount, setLikeCount] = useState(baseLikes);

  useEffect(() => {
    setLiked(window.localStorage.getItem(storageKey) === "true");
    setLikeCount(baseLikes);
  }, [baseLikes, storageKey]);

  // 切换点赞状态，并同步更新 localStorage 与短暂提示。
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

    startTransition(() => {
      void updateWritingLikeAction(articleSlug, nextLiked);
    });
  }

  return (
    <div className="relative inline-flex flex-col items-center gap-2">
      {/* 按钮通过 aria-pressed 暴露点赞状态，样式随 liked 条件切换。 */}
      <button
        type="button"
        aria-label={liked ? "取消点赞" : "点赞"}
        aria-pressed={liked}
        disabled={isPending}
        onClick={toggleLike}
        className={`inline-flex min-w-32 items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 ${liked ? "border-zinc-950 bg-zinc-950 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950" : "border-zinc-200/80 bg-white/60 text-zinc-600 hover:border-zinc-300 hover:bg-white/80 hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/[0.07] dark:hover:text-white"}`}
      >
        <Heart
          className={`size-4 shrink-0 stroke-[1.7] ${liked ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{liked ? "已点赞" : "点赞"}</span>
        <span className="tabular-nums">{formatLikeCount(likeCount)}</span>
      </button>
      {/* 状态提示使用 aria-live 让辅助技术感知点赞反馈，显隐由 showTip 控制。 */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none absolute top-[calc(100%+0.55rem)] rounded-full border border-zinc-200/70 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-500 shadow-[0_10px_26px_rgba(24,24,27,0.08)] backdrop-blur transition duration-200 dark:border-white/10 dark:bg-neutral-900/90 dark:text-neutral-300 ${showTip ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}
      >
        谢谢喜欢
      </div>
    </div>
  );
}
