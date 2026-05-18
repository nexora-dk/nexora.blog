"use client";

// useRef/useSyncExternalStore 用于安全判断组件是否已经在客户端挂载，并读取按钮位置驱动主题切换动画。
import { useRef, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
// useTheme 提供当前解析后的主题和切换主题的方法。
import { useTheme } from "next-themes";

// 空订阅函数：这里只需要利用 useSyncExternalStore 区分服务端快照和客户端快照，不需要真实外部 store。
const subscribe = () => () => {};
// 客户端快照返回 true，表示组件已经可以安全读取浏览器端主题结果。
const getSnapshot = () => true;
// 服务端快照返回 false，避免服务端提前判断具体主题导致水合差异。
const getServerSnapshot = () => false;

type ViewTransition = {
  finished: Promise<void>;
  skipTransition: () => void;
};

type ViewTransitionDocument = Document & {
  startViewTransition?: (updateCallback: () => void) => ViewTransition;
};

function applyThemeClass(theme: "light" | "dark") {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
  document.documentElement.style.colorScheme = theme;
}

/**
 * 主题切换按钮：在亮色和暗色主题之间切换，并用图标表达当前可切换方向。
 */
export function ThemeToggle() {
  // mounted 为 true 后才使用 resolvedTheme，避免服务端渲染阶段无法确定系统主题。
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // resolvedTheme 是 next-themes 解析系统主题后的实际主题，setTheme 用于切换主题。
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  // 只有客户端挂载后且解析结果为 dark，才认为当前处于暗色模式。
  const isDark = mounted && resolvedTheme === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";
    const viewTransitionDocument = document as ViewTransitionDocument;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!viewTransitionDocument.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const root = document.documentElement;

    root.style.setProperty("--theme-transition-x", `${x}px`);
    root.style.setProperty("--theme-transition-y", `${y}px`);
    root.classList.add("theme-transitioning");

    const transition = viewTransitionDocument.startViewTransition(() => {
      applyThemeClass(nextTheme);
      flushSync(() => setTheme(nextTheme));
    });

    void transition.finished.finally(() => {
      root.classList.remove("theme-transitioning");
      root.style.removeProperty("--theme-transition-x");
      root.style.removeProperty("--theme-transition-y");
    });
  }

  return (
    // 点击按钮时根据当前主题在 light 和 dark 之间切换。
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "切换到亮色模式" : "切换到暗色模式"}
      className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white text-base text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
    >
      {/* 暗色模式下显示太阳，提示点击后可切换回亮色；亮色模式下显示月亮。 */}
      <span className={`absolute transition-all duration-300 ease-out ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`}>☀</span>
      <span className={`absolute transition-all duration-300 ease-out ${isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`}>☾</span>
    </button>
  );
}
