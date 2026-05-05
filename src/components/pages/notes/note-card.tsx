import Link from "next/link";
import { ArrowUpRight, CalendarDays, Eye, Heart } from "lucide-react";
import type { NoteItem } from "./notes-data";

type NoteCardProps = {
  note: NoteItem;
};

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={note.href} className="group block rounded-[1.6rem] border border-neutral-200/55 bg-white/65 p-5 shadow-[0_1px_18px_rgba(0,0,0,0.035)] backdrop-blur transition hover:-translate-y-1 hover:border-neutral-300/70 hover:bg-white/80 dark:border-white/10 dark:bg-[#101010]/82 dark:shadow-[0_18px_48px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.075)] dark:hover:border-white/16 dark:hover:bg-[#151515]/88">
      <article className="grid gap-5 md:grid-cols-[1fr_auto] md:items-start">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-950 transition group-hover:text-neutral-700 dark:text-neutral-50 dark:group-hover:text-neutral-200">{note.title}</h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{note.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-neutral-400 dark:text-neutral-500">
            <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">{note.columnLabel}</span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-3.5" />
              发布于 {note.publishedAt}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-3.5" />
              {note.views}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Heart className="size-3.5" />
              {note.likes}
            </span>
          </div>
        </div>

        <span className="hidden size-10 place-items-center rounded-full bg-neutral-100 text-neutral-400 transition group-hover:translate-x-1 group-hover:bg-neutral-950 group-hover:text-white md:grid dark:bg-neutral-900 dark:text-neutral-500 dark:group-hover:bg-neutral-50 dark:group-hover:text-neutral-950" aria-hidden="true">
          <ArrowUpRight className="size-4" />
        </span>
      </article>
    </Link>
  );
}
