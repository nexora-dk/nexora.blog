import { TimelineItemRow } from "./timeline-item-row";
import type { TimelineItem } from "./timeline-data";

export type TimelineYearGroup = {
  year: string;
  items: TimelineItem[];
};

type TimelineListProps = {
  yearGroups: TimelineYearGroup[];
};

export function TimelineList({ yearGroups }: TimelineListProps) {
  return (
    <div className="space-y-10 pt-12">
      {yearGroups.map((group) => (
        <section key={group.year} className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="h-6 w-px bg-sky-300" />
            <h2 className="text-lg font-medium text-zinc-800 dark:text-neutral-100">{group.year}</h2>
            <span className="text-sm text-zinc-500 dark:text-neutral-500">({group.items.length})</span>
          </div>

          <div className="relative ml-px space-y-0 border-l border-sky-300/70 pl-5">
            {group.items.map((item) => (
              <TimelineItemRow key={`${item.type}-${item.href}`} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
