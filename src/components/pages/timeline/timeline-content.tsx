// 页面内容组件负责组织数据：计算进度、筛选类型、分组年份，并拼装 Hero 与列表。
import { getTimeProgressStats } from "./time-progress";
import { TimelineHero } from "./timeline-hero";
import { TimelineList, type TimelineYearGroup } from "./timeline-list";
import { getDateParts, getTimelineItems, isTimelineType, type TimelineItem } from "./timeline-data";

// 外部路由或页面传入的筛选类型仍是字符串，需要在组件内部做类型守卫。
type TimelineContentProps = {
  selectedType?: string;
};

// 把已经按时间倒序排列的条目聚合成年份分组；保持原有顺序，不额外排序。
function groupTimelineItemsByYear(items: TimelineItem[]) {
  // reduce 的累加器是年份分组数组，每处理一个条目就放入对应年份桶。
  return items.reduce<TimelineYearGroup[]>((groups, item) => {
    // 解析条目日期得到年份，用作分组键。
    const { year } = getDateParts(item.date);
    // 查找当前年份是否已经有分组。
    const group = groups.find((entry) => entry.year === year);

    // 条件渲染前的数据分支：已有年份则追加，否则创建新年份分组。
    if (group) {
      group.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }

    // 返回同一个分组数组供下一轮 reduce 继续累积。
    return groups;
  }, []);
}

// 时间线页面主体：根据筛选类型生成页面顶部统计和下方时间轴列表。
export function TimelineContent({ selectedType }: TimelineContentProps) {
  // 将 URL 或父级传入的字符串收窄为合法类型；非法值视为未筛选。
  const activeType = isTimelineType(selectedType) ? selectedType : undefined;
  // 获取统一时间线数据；activeType 存在时只返回对应类型条目。
  const timelineItems = getTimelineItems(activeType);
  // 按年份组织列表数据，供 TimelineList 外层循环使用。
  const yearGroups = groupTimelineItemsByYear(timelineItems);
  // 服务端/首次渲染时计算一次时间进度，再交给客户端组件继续刷新。
  const initialTimeProgressStats = getTimeProgressStats();

  return (
    <section className="mx-auto max-w-5xl pb-12 pt-28 md:pb-16 md:pt-32">
      {/* 页面内容纵向容器：上方 Hero 说明与统计，下方是按年份分组的列表。 */}
      <div className="space-y-10">
        {/* Hero 接收筛选类型、条目数量、年份数量和初始时间进度。 */}
        <TimelineHero activeType={activeType} itemCount={timelineItems.length} yearCount={yearGroups.length} initialTimeProgressStats={initialTimeProgressStats} />
        {/* 列表组件只关心年份分组后的数据，具体行渲染再下放到 TimelineItemRow。 */}
        <TimelineList yearGroups={yearGroups} />
      </div>
    </section>
  );
}
