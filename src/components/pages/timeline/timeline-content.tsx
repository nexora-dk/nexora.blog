import { getTimeProgressStats } from "./time-progress";
import { TimelineHero } from "./timeline-hero";
import { TimelineList, type TimelineYearGroup } from "./timeline-list";
import { getDateParts, getTimelineItems, isTimelineType, type TimelineItem } from "./timeline-data";

type TimelineContentProps = {
  selectedType?: string;
};

function groupTimelineItemsByYear(items: TimelineItem[]) {
  return items.reduce<TimelineYearGroup[]>((groups, item) => {
    const { year } = getDateParts(item.date);
    const group = groups.find((entry) => entry.year === year);

    if (group) {
      group.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }

    return groups;
  }, []);
}

export function TimelineContent({ selectedType }: TimelineContentProps) {
  const activeType = isTimelineType(selectedType) ? selectedType : undefined;
  const timelineItems = getTimelineItems(activeType);
  const yearGroups = groupTimelineItemsByYear(timelineItems);
  const initialTimeProgressStats = getTimeProgressStats();

  return (
    <section className="mx-auto max-w-5xl pb-12 pt-28 md:pb-16 md:pt-32">
      <div className="space-y-10">
        <TimelineHero activeType={activeType} itemCount={timelineItems.length} yearCount={yearGroups.length} initialTimeProgressStats={initialTimeProgressStats} />
        <TimelineList yearGroups={yearGroups} />
      </div>
    </section>
  );
}
