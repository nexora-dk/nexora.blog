// 列表组件按年份分组后，逐条委托 TimelineItemRow 渲染具体记录。
import { TimelineItemRow } from "./timeline-item-row";
import type { TimelineItem } from "./timeline-data";

// 年份分组结构：一个年份标题对应若干时间线条目。
export type TimelineYearGroup = {
  year: string;
  items: TimelineItem[];
};

// 时间线列表接收已经排好序并分好组的数据。
type TimelineListProps = {
  yearGroups: TimelineYearGroup[];
};

// 渲染完整时间线列表：外层循环年份，内层循环该年份下的条目。
export function TimelineList({ yearGroups }: TimelineListProps) {
  return (
    <div className="space-y-10 pt-12">
      {/* 年份分组循环：每个 section 负责一个年份块。 */}
      {yearGroups.map((group) => (
        <section key={group.year} className="space-y-5">
          {/* 年份标题行：装饰竖线、年份文本和该年条目数量。 */}
          <div className="flex items-center gap-3">
            <span className="h-6 w-px bg-sky-300" />
            <h2 className="text-lg font-medium text-zinc-800 dark:text-neutral-100">{group.year}</h2>
            <span className="text-sm text-zinc-500 dark:text-neutral-500">({group.items.length})</span>
          </div>

          {/* 该年份的条目列表区域：左边框形成时间轴竖线，内边距给节点留空间。 */}
          <div className="relative ml-px space-y-0 border-l border-sky-300/70 pl-5">
            {/* 条目循环：使用类型与链接组合为 key，避免不同来源链接相近时冲突。 */}
            {group.items.map((item) => (
              <TimelineItemRow key={`${item.type}-${item.href}`} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
