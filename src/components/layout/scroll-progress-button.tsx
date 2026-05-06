"use client";

import { useEffect, useState } from "react";

function getScrollState() {
  const scrollElement = document.scrollingElement || document.documentElement;
  const scrollTop = scrollElement.scrollTop;
  const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
  const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;

  return {
    progress,
    scrollTop,
  };
}

export function ScrollProgressButton() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    let frameId: number | null = null;

    function updateProgress() {
      const scrollState = getScrollState();

      frameId = null;
      setProgress(Math.round(scrollState.progress));
      setIsVisible(scrollState.scrollTop > 8);
    }

    function requestProgressUpdate() {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(updateProgress);
    }

    requestProgressUpdate();
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
    };
  }, []);

  function scrollToTop() {
    setIsLaunching(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setIsLaunching(false), 520);
  }

  return (
    <div className={`group fixed right-6 bottom-6 z-[999] transition-all duration-500 ease-out ${isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      <div className="pointer-events-none absolute left-1/2 bottom-[calc(100%+0.7rem)] -translate-x-1/2 translate-y-2 rounded-full border border-zinc-200/80 bg-white/85 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-600 opacity-0 shadow-lg shadow-zinc-950/10 backdrop-blur-xl transition-all duration-300 ease-out group-hover:-translate-x-1/2 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-300 dark:shadow-black/30">
        返回顶部
      </div>
      <button
        type="button"
        aria-label="返回顶部"
        onClick={scrollToTop}
        className={`rocket-button relative grid size-12 place-items-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-800 shadow-[0_12px_30px_rgb(15_23_42/0.12)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:text-sky-500 hover:shadow-[0_16px_40px_rgb(14_165_233/0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-100 dark:shadow-black/35 dark:hover:text-sky-300 dark:focus-visible:ring-offset-neutral-950 ${isLaunching ? "rocket-launching" : ""}`}
        style={{ backgroundImage: `linear-gradient(to top, rgb(14 165 233 / 0.16) ${progress}%, transparent 0)` }}
      >
        <svg className="rocket-icon size-7" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M32 5C44 16 47 31 40 46H24C17 31 20 16 32 5Z" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 35 14 45v12l10-7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M40 35 50 45v12l-10-7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M26 46h12l-2 6h-8Z" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M28 55 24 62l1-10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36 55 40 62l-1-10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="24" r="6" stroke="currentColor" strokeWidth="4.5" />
        </svg>
        <span className="absolute -bottom-1.5 rounded-full border border-zinc-200 bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold leading-none tabular-nums text-zinc-500 shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400">{progress}%</span>
      </button>
    </div>
  );
}
