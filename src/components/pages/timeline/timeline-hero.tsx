// Hero 组件组合页面标题、当前筛选说明、数量统计与实时进度组件。
import { LiveTimeProgress } from "./live-time-progress";
import { timelineTypeMeta, type TimelineType } from "./timeline-data";
import type { TimeProgressStats } from "./time-progress";

// 页面头部所需数据：筛选状态、条目统计、年份统计和初始时间进度。
type TimelineHeroProps = {
  activeType?: TimelineType;
  itemCount: number;
  yearCount: number;
  initialTimeProgressStats: TimeProgressStats;
};

// 渲染时间线页头；根据筛选类型切换标题与描述，其余统计来自父组件计算结果。
export function TimelineHero({ activeType, itemCount, yearCount, initialTimeProgressStats }: TimelineHeroProps) {
  // 回忆筛选下标题直接显示“回忆”，其它场景保持总览标题“时间线”。
  const heroTitle = activeType === "memory" ? timelineTypeMeta.memory.label : "时间线";
  // 有筛选类型时使用对应说明；无筛选时使用总览描述。
  const heroDescription = activeType ? timelineTypeMeta[activeType].description : "把文章、手记和回忆按时间重新串起。慢慢记录，也慢慢往前走。";

  return (
    <header className="space-y-8 border-b border-zinc-200/65 pb-10 dark:border-white/10">
      {/* 顶部主栅格：左侧标题文案，右侧记录数量统计。 */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
        {/* 标题与页面说明区，承担当前时间线范围的语义说明。 */}
        <div>
          <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-neutral-400">Timeline</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-normal text-zinc-950 dark:text-neutral-50">{heroTitle}</h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-zinc-500 dark:text-neutral-400">{heroDescription}</p>
          {/* 渐变短线用于分隔标题内容，并延续页面的天空蓝视觉线索。 */}
          <div className="mt-6 h-px w-24 bg-gradient-to-r from-emerald-300 via-sky-300 to-transparent dark:from-emerald-300/70 dark:via-sky-300/70" />
        </div>

        {/* 数量统计区：显示当前筛选结果共有多少篇、覆盖多少年份。 */}
        <div className="md:text-right">
          <p className="text-xs tracking-[0.24em] text-zinc-400 dark:text-neutral-500">共记录</p>
          <div className="mt-2 flex items-end gap-2 md:justify-end">
            <span className="text-6xl font-light tracking-tight text-zinc-950 dark:text-neutral-50">{itemCount}</span>
            <span className="pb-3 text-sm text-zinc-500 dark:text-neutral-400">篇</span>
          </div>
          <p className="mt-2 text-xs text-zinc-400 dark:text-neutral-500">分布在 {yearCount} 个年份</p>
        </div>
      </div>

      {/* 实时时间进度区：初始值来自父组件，客户端挂载后自行刷新。 */}
      <LiveTimeProgress initialStats={initialTimeProgressStats} />
    </header>
  );
}
