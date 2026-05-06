import Link from "next/link";
import { getDateParts, type TimelineItem } from "./timeline-data";

type TimelineItemRowProps = {
  item: TimelineItem;
};

export function TimelineItemRow({ item }: TimelineItemRowProps) {
  const dateParts = getDateParts(item.date);

  return (
    <Link href={item.href} className="group relative grid gap-x-6 gap-y-1 py-2.5 md:grid-cols-[5rem_minmax(0,1fr)_12rem] md:items-baseline">
      <span className="absolute -left-[1.53rem] top-4 size-2.5 rounded-full bg-sky-300 ring-4 ring-white dark:ring-[#080808]" />
      <span className="text-sm tabular-nums text-zinc-500 dark:text-neutral-500">{dateParts.shortDate}</span>
      <span className="min-w-0">
        <span className="relative w-fit text-[0.95rem] leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sky-300 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200">{item.title}</span>
      </span>
      <span className="text-sm text-zinc-500 md:text-right dark:text-neutral-500">
        {item.meta}/{item.typeLabel}
      </span>
    </Link>
  );
}
