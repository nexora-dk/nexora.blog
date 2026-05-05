import Link from "next/link";
import { articleItems } from "@/components/pages/writing/writing-data";
import { noteItems } from "@/components/pages/notes/notes-data";

type TimelineType = "writing" | "notes" | "memory";

type TimelineItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  type: TimelineType;
  typeLabel: string;
  meta: string;
};

function getDateParts(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return { year: "近期", shortDate: date, time: 0 };
  }

  const [, year, month, day] = match;
  return {
    year,
    shortDate: `${month}月${day}日`,
    time: new Date(Number(year), Number(month) - 1, Number(day)).getTime(),
  };
}

function getCurrentYearProgress() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1).getTime();
  const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
  return (((now.getTime() - start) / (end - start)) * 100).toFixed(6);
}

function getCurrentDayProgress() {
  const now = new Date();
  return (((now.getHours() * 60 + now.getMinutes()) / 1440) * 100).toFixed(6);
}

function getDayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  return Math.floor((now.getTime() - start) / 86400000);
}

export default function TimelinePage() {
  const timelineItems: TimelineItem[] = [
    ...articleItems.map((article) => ({
      title: article.title,
      description: article.description,
      href: article.href,
      date: article.date,
      type: "writing" as const,
      typeLabel: "文稿",
      meta: article.categoryLabel,
    })),
    ...noteItems.map((note) => ({
      title: note.title,
      description: note.description,
      href: note.href,
      date: note.publishedAt,
      type: note.column === "memory" ? ("memory" as const) : ("notes" as const),
      typeLabel: note.column === "memory" ? "回忆" : "手记",
      meta: note.columnLabel,
    })),
  ].sort((first, second) => getDateParts(second.date).time - getDateParts(first.date).time);
  const yearGroups = timelineItems.reduce<Array<{ year: string; items: TimelineItem[] }>>((groups, item) => {
    const { year } = getDateParts(item.date);
    const group = groups.find((entry) => entry.year === year);

    if (group) {
      group.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }

    return groups;
  }, []);

  return (
    <section className="mx-auto max-w-5xl pb-12 pt-28 md:pb-16 md:pt-32">
      <div className="space-y-10">
        <header className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50 md:text-5xl">时间线</h1>
            <div className="space-y-3">
              <p className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-neutral-50">共有 {timelineItems.length} 篇文章，再接再厉</p>
              <div className="h-px w-24 bg-zinc-200 dark:bg-white/10" />
            </div>
          </div>

          <div className="space-y-3 text-sm leading-7 text-zinc-700 dark:text-neutral-300">
            <p>今天是 {new Date().getFullYear()} 年的第 {getDayOfYear()} 天</p>
            <p>今年已过 {getCurrentYearProgress()}%</p>
            <p>今天已过 {getCurrentDayProgress()}%</p>
            <p>活在当下，珍惜眼下</p>
          </div>
        </header>

        <div className="space-y-10 pt-12">
          {yearGroups.map((group) => (
            <section key={group.year} className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="h-6 w-px bg-violet-300" />
                <h2 className="text-lg font-medium text-zinc-800 dark:text-neutral-100">{group.year}</h2>
                <span className="text-sm text-zinc-500 dark:text-neutral-500">({group.items.length})</span>
              </div>

              <div className="relative ml-px space-y-0 border-l border-violet-300/70 pl-5">
                {group.items.map((item) => {
                  const dateParts = getDateParts(item.date);

                  return (
                    <Link key={`${item.type}-${item.href}`} href={item.href} className="group relative grid gap-x-6 gap-y-1 py-2.5 md:grid-cols-[5rem_minmax(0,1fr)_12rem] md:items-baseline">
                      <span className="absolute -left-[1.53rem] top-4 size-2.5 rounded-full bg-violet-300 ring-4 ring-white dark:ring-[#080808]" />
                      <span className="text-sm tabular-nums text-zinc-500 dark:text-neutral-500">{dateParts.shortDate}</span>
                      <span className="min-w-0">
                        <span className="relative w-fit text-[0.95rem] leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-violet-300 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200">{item.title}</span>
                      </span>
                      <span className="text-sm text-zinc-500 md:text-right dark:text-neutral-500">
                        {item.meta}/{item.typeLabel}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
