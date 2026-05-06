"use client";

import { useEffect, useState } from "react";
import { getTimeProgressStats, type TimeProgressStats } from "./time-progress";

type LiveTimeProgressProps = {
  initialStats: TimeProgressStats;
};

export function LiveTimeProgress({ initialStats }: LiveTimeProgressProps) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    const updateStats = () => setStats(getTimeProgressStats());
    updateStats();

    const timer = window.setInterval(updateStats, 100);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <div className="grid gap-4 text-base text-zinc-600 dark:text-neutral-300 sm:grid-cols-3">
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今天</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.year} 年第 {stats.dayOfYear} 天</span>
        </p>
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今年已过</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.yearProgress}%</span>
        </p>
        <p>
          <span className="block text-sm text-zinc-400 dark:text-neutral-500">今天已过</span>
          <span className="mt-1.5 block font-medium tabular-nums text-zinc-700 dark:text-neutral-200">{stats.dayProgress}%</span>
        </p>
      </div>

      <p className="text-[0.95rem] font-medium tracking-[0.18em] text-zinc-400 dark:text-neutral-500">
        活在当下
        <span className="mx-3 text-sky-300 dark:text-sky-300/70">·</span>
        珍惜眼下
      </p>
    </>
  );
}
