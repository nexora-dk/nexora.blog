import { NoteLikeButton } from "./note-like-button";

// 互动区把手记唯一 slug 和初始喜欢数传递给客户端点赞按钮。
type NoteEngagementProps = {
  noteSlug: string;
  initialLikes: string;
};

// 详情页底部互动模块：当前只包含点赞入口，外层负责与正文视觉分隔。
export function NoteEngagement({ noteSlug, initialLikes }: NoteEngagementProps) {
  return (
    <div className="mt-12 border-t border-zinc-200/60 pt-8 dark:border-white/10">
      <div className="flex flex-col items-center gap-3 text-center">
        {/* 提示文案说明按钮语义，按钮内部处理本地点赞状态和计数展示。 */}
        <p className="text-xs font-medium tracking-[0.18em] text-[#9c8d80] uppercase dark:text-neutral-500">喜欢这篇手记吗</p>
        <NoteLikeButton noteSlug={noteSlug} initialLikes={initialLikes} />
      </div>
    </div>
  );
}
