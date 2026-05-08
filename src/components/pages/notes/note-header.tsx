import { Clock3, Eye, Heart, MapPin, SmilePlus, Timer } from "lucide-react";

import { noteHeadingColor } from "./note-mdx-components";
import type { NoteDetail } from "./notes-data";

type NoteHeaderProps = {
  note: NoteDetail;
};

export function NoteHeader({ note }: NoteHeaderProps) {
  const metadataItems = [
    { label: "发布日期", value: note.publishedAt, icon: Clock3 },
    note.location ? { label: "地点", value: note.location, icon: MapPin } : null,
    note.mood ? { label: "心情", value: note.mood, icon: SmilePlus } : null,
    { label: "阅读时间", value: note.readingTime, icon: Timer },
    { label: "浏览量", value: note.views, icon: Eye },
    { label: "喜欢", value: note.likes, icon: Heart },
  ].filter((item): item is { label: string; value: string; icon: typeof Clock3 } => item !== null);

  return (
    <header className="space-y-7">
      <h1 className={`text-balance font-[ui-sans-serif,system-ui,sans-serif] text-[2rem] font-semibold leading-tight tracking-[-0.025em] ${noteHeadingColor}`}>{note.title}</h1>

      <dl className="flex flex-wrap items-center gap-x-0 gap-y-2 font-[ui-sans-serif,system-ui,sans-serif] text-[13px] font-medium leading-none text-[#7d746b] dark:text-neutral-300/85">
        {metadataItems.map(({ label, value, icon: Icon }) => (
          <div key={label} className="inline-flex items-center gap-1.5 border-r border-[#d9d0c7] px-2.5 first:pl-0 last:border-r-0 last:pr-0 dark:border-white/12">
            <dt className="sr-only">{label}</dt>
            <Icon className="size-3.5 shrink-0 stroke-[1.7]" />
            <dd className="whitespace-nowrap">{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
