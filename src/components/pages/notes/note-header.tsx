import { Clock3, Eye, Heart, MapPin, SmilePlus, Timer } from "lucide-react";

import { noteHeadingColor } from "./note-mdx-components";
import type { NoteDetail } from "./notes-data";

// 详情页头部接收完整手记数据，包含列表字段之外的 slug、content、toc 和 insight。
type NoteHeaderProps = {
  note: NoteDetail;
};

// 手记详情头部：渲染标题和一组可选/固定元信息。
export function NoteHeader({ note }: NoteHeaderProps) {
  // 先把可能为空的地点、心情合入数组，再通过类型守卫过滤，方便统一 map 渲染。
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
      {/* 标题颜色来自 MDX 映射共享常量，保证正文标题和详情标题风格一致。 */}
      <h1 className={`text-balance font-[ui-sans-serif,system-ui,sans-serif] text-[2rem] font-semibold leading-tight tracking-[-0.025em] ${noteHeadingColor}`}>{note.title}</h1>

      {/* dl 表达元数据键值关系；视觉上用图标和横向分隔线呈现。 */}
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
