import { LiveTimeProgress } from "./live-time-progress";
import { timelineTypeMeta, type TimelineType } from "./timeline-data";
import type { TimeProgressStats } from "./time-progress";

type TimelineHeroProps = {
  activeType?: TimelineType;
  itemCount: number;
  yearCount: number;
  initialTimeProgressStats: TimeProgressStats;
};

export function TimelineHero({ activeType, itemCount, yearCount, initialTimeProgressStats }: TimelineHeroProps) {
  const heroTitle = activeType === "memory" ? timelineTypeMeta.memory.label : "时间线";
  const heroDescription = activeType ? timelineTypeMeta[activeType].description : "把文章、手记和回忆按时间重新串起。慢慢记录，也慢慢往前走。";

  return (
    <header className="space-y-8 border-b border-zinc-200/65 pb-10 dark:border-white/10">
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300/80">Timeline</p>
          <h1 className="mt-3 font-[family-name:var(--font-dingtalk)] text-4xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50 md:text-5xl">{heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-neutral-400">{heroDescription}</p>
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-emerald-300 via-sky-300 to-transparent dark:from-emerald-300/70 dark:via-sky-300/70" />
        </div>

        <div className="md:text-right">
          <p className="text-xs tracking-[0.24em] text-zinc-400 dark:text-neutral-500">共记录</p>
          <div className="mt-2 flex items-end gap-2 md:justify-end">
            <span className="text-6xl font-light tracking-tight text-zinc-950 dark:text-neutral-50">{itemCount}</span>
            <span className="pb-3 text-sm text-zinc-500 dark:text-neutral-400">篇</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 dark:text-neutral-500">分布在 {yearCount} 个年份</p>
        </div>
      </div>

      <LiveTimeProgress initialStats={initialTimeProgressStats} />
    </header>
  );
}
