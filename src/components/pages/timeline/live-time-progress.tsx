"use client";

// 客户端组件：使用 React hooks 在浏览器中持续刷新时间进度。
import { useEffect, useState } from "react";
import { getTimeProgressStats, type TimeProgressStats } from "./time-progress";

// 由服务端父组件传入初始进度，避免首屏没有时间数据。
type LiveTimeProgressProps = {
  initialStats: TimeProgressStats;
};

// 实时进度展示组件：先使用初始值渲染，再在客户端定时更新。
export function LiveTimeProgress({ initialStats }: LiveTimeProgressProps) {
  // stats 保存当前展示的年份、年内天数、年度进度和日内进度。
  const [stats, setStats] = useState(initialStats);

  // 组件挂载后启动浏览器定时器；卸载时清理，避免后台继续更新状态。
  useEffect(() => {
    // 每次刷新都重新计算当前时间进度，并写入 state 触发界面更新。
    const updateStats = () => setStats(getTimeProgressStats());
    // 挂载后立即刷新一次，减少服务端初始值与客户端当前时间的偏差。
    updateStats();

    // 每 100ms 更新一次，让百分比数字呈现近实时变化。
    const timer = window.setInterval(updateStats, 100);
    // 清理函数在组件卸载时取消定时器。
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      {/* 三列进度信息区：分别展示今天、今年已过、今天已过。 */}
      <div className="grid gap-4 text-base text-zinc-600 dark:text-neutral-300 sm:grid-cols-3">
        {/* 当前年份与年内第几天，使用 tabular-nums 保持数字宽度稳定。 */}
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今天</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.year} 年第 {stats.dayOfYear} 天</span>
        </p>
        {/* 年度进度百分比，对应 getTimeProgressStats 中的 yearProgress。 */}
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今年已过</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.yearProgress}%</span>
        </p>
        {/* 当天进度百分比，对应 getTimeProgressStats 中的 dayProgress。 */}
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今天已过</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.dayProgress}%</span>
        </p>
      </div>

      {/* 时间线页的结语口号区，与上方实时数字形成节奏上的收束。 */}
      <p className="text-[0.95rem] font-medium tracking-[0.18em] text-zinc-400 dark:text-neutral-500">
        活在当下
        <span className="mx-3 text-sky-300 dark:text-sky-300/70">·</span>
        珍惜眼下
      </p>
    </>
  );
}
