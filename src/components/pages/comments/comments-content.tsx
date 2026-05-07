import { CommentCard } from "./comment-card";
import { commentItems } from "./comments-data";

export function CommentsContent() {
  return (
    <div className="mx-auto max-w-3xl pb-10 pt-2">
      <div className="mb-8 flex items-center justify-between border-b border-zinc-200/70 pb-4 dark:border-white/10">
        <p className="text-sm font-semibold text-zinc-500 dark:text-neutral-400">{commentItems.length} 条留言</p>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm shadow-zinc-950/[0.03] transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-500 dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300 dark:hover:border-sky-300/25 dark:hover:text-sky-300">
          <span className="text-base leading-none">+</span>
          写留言
        </button>
      </div>

      <section className="space-y-10">
        {commentItems.map((item) => (
          <CommentCard key={`${item.name}-${item.date}`} item={item} />
        ))}
      </section>
    </div>
  );
}
