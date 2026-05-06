import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { NoteCard } from "./note-card";
import { isNoteColumn, noteColumns, noteItems } from "./notes-data";

const columnIcons = {
  travel: "🌎",
  recent: "🧘",
  memory: "🌿",
  summary: "🫧",
  emo: "😳",
} as const;

type NotesContentProps = {
  selectedColumn?: string;
};

function getNoteYear(date: string) {
  return date.match(/^(\d{4})年/)?.[1] ?? "近期";
}

function getNoteShortDate(date: string) {
  const match = date.match(/^\d{4}年(\d{1,2})月(\d{1,2})日/);
  return match ? `${match[1]}月${match[2]}日` : date;
}

export function NotesContent({ selectedColumn }: NotesContentProps) {
  const activeColumn = isNoteColumn(selectedColumn) ? selectedColumn : undefined;
  const activeColumnMeta = noteColumns.find((column) => column.value === activeColumn);
  const notes = activeColumn ? noteItems.filter((note) => note.column === activeColumn) : noteItems;
  const yearGroups = notes.reduce<Array<{ year: string; items: typeof notes }>>((groups, note) => {
    const year = getNoteYear(note.publishedAt);
    const group = groups.find((item) => item.year === year);

    if (group) {
      group.items.push(note);
    } else {
      groups.push({ year, items: [note] });
    }

    return groups;
  }, []);
  const startYear = yearGroups.at(-1)?.year;

  if (activeColumn && activeColumnMeta) {
    return (
      <div className="pt-2">
        {notes.length > 0 ? (
          <section className="space-y-7">
            <header className="grid gap-4 border-b border-zinc-200/65 pb-6 dark:border-white/10 md:grid-cols-[8rem_1fr] md:items-end">
              <div>
                <p className="text-xs tracking-[0.24em] text-zinc-400 dark:text-neutral-500">专栏</p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-5xl font-light tracking-tight text-zinc-900 dark:text-neutral-50">{notes.length}</span>
                  <span className="pb-2 text-xs text-zinc-400 dark:text-neutral-500">篇</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    {columnIcons[activeColumn]}
                  </span>
                  <h2 className="font-[family-name:var(--font-dingtalk)] text-2xl font-semibold tracking-tight text-zinc-900 dark:text-neutral-50">{activeColumnMeta.label}</h2>
                </div>
                <p className="mt-2 text-sm text-zinc-400 dark:text-neutral-500">{startYear ? `始于 ${startYear} 年 · ` : ""}{activeColumnMeta.description}</p>
                <div className="mt-5 h-px w-14 bg-gradient-to-r from-emerald-300 via-sky-300 to-transparent dark:from-emerald-300/70 dark:via-sky-300/70" />
              </div>
            </header>

            <div className="space-y-5">
              {yearGroups.map((group) => (
                <section key={group.year} className="grid gap-2 md:grid-cols-[8rem_1fr]">
                  <div className="flex items-baseline gap-2 pt-1.5 md:block">
                    <h3 className="text-3xl font-light tracking-tight text-zinc-300 dark:text-neutral-600">{group.year}</h3>
                    <span className="text-xs text-zinc-400 dark:text-neutral-600 md:mt-1 md:block">{group.items.length} 篇</span>
                  </div>

                  <div className="divide-y divide-zinc-200/65 border-t border-zinc-200/65 dark:divide-white/10 dark:border-white/10">
                    {group.items.map((note) => (
                      <Link key={note.title} href={note.href} className="group grid gap-x-5 gap-y-2 py-3 transition md:grid-cols-[minmax(0,1fr)_auto_4.5rem] md:items-center">
                        <span className="relative w-fit text-[0.95rem] font-medium leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-emerald-400 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200 dark:after:bg-emerald-300">{note.title}</span>
                        <span className="flex min-w-0 flex-wrap gap-1.5 md:justify-end">
                          {[note.mood, note.location].filter(Boolean).map((item) => (
                            <span key={item} className="rounded-full border border-zinc-200/80 bg-zinc-50/70 px-2 py-0.5 text-[0.68rem] leading-4 text-zinc-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
                              {item}
                            </span>
                          ))}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 md:justify-end dark:text-neutral-500">
                          {getNoteShortDate(note.publishedAt)}
                          <ArrowUpRight className="size-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个专栏下暂时还没有手记。</section>
        )}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {notes.length > 0 ? (
        <section className="grid gap-4">
          {notes.map((note) => (
            <NoteCard key={note.title} note={note} />
          ))}
        </section>
      ) : (
        <section className="rounded-[1.5rem] border border-dashed border-neutral-200/80 bg-white/45 p-8 text-center text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-950/25 dark:text-neutral-400">这个专栏下暂时还没有手记。</section>
      )}
    </div>
  );
}
