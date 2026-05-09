"use client";

// useSyncExternalStore 用于安全判断组件是否已经在客户端挂载，避免主题水合不一致。
import { useSyncExternalStore } from "react";
// useTheme 提供当前解析后的主题和切换主题的方法。
import { useTheme } from "next-themes";

// 空订阅函数：这里只需要利用 useSyncExternalStore 区分服务端快照和客户端快照，不需要真实外部 store。
const subscribe = () => () => {};
// 客户端快照返回 true，表示组件已经可以安全读取浏览器端主题结果。
const getSnapshot = () => true;
// 服务端快照返回 false，避免服务端提前判断具体主题导致水合差异。
const getServerSnapshot = () => false;

/**
 * 主题切换按钮：在亮色和暗色主题之间切换，并用图标表达当前可切换方向。
 */
export function ThemeToggle() {
  // mounted 为 true 后才使用 resolvedTheme，避免服务端渲染阶段无法确定系统主题。
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // resolvedTheme 是 next-themes 解析系统主题后的实际主题，setTheme 用于切换主题。
  const { resolvedTheme, setTheme } = useTheme();
  // 只有客户端挂载后且解析结果为 dark，才认为当前处于暗色模式。
  const isDark = mounted && resolvedTheme === "dark";

  return (
    // 点击按钮时根据当前主题在 light 和 dark 之间切换。
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-base text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
    >
      {/* 暗色模式下显示太阳，提示点击后可切换回亮色；亮色模式下显示月亮。 */}
      <span>{isDark ? "☀" : "☾"}</span>
    </button>
  );
}
