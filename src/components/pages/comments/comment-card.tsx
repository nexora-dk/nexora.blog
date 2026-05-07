import type { CommentItem, CommentReply } from "./comments-data";

type CommentCardProps = {
  item: CommentItem;
};

type CommentBubbleProps = {
  comment: CommentItem | CommentReply;
  isReply?: boolean;
};

function CommentBubble({ comment, isReply }: CommentBubbleProps) {
  return (
    <div className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 md:grid-cols-[3rem_minmax(0,1fr)] ${isReply ? "ml-10 md:ml-16" : ""}`}>
      <div className="pt-1">
        <div className="grid size-11 place-items-center rounded-full border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 text-sm font-semibold text-zinc-700 shadow-sm shadow-zinc-950/[0.04] ring-4 ring-white dark:border-white/10 dark:from-neutral-800 dark:to-neutral-950 dark:text-neutral-100 dark:ring-neutral-950 md:size-12">
          {comment.avatar}
        </div>
      </div>

      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <h2 className="font-semibold text-zinc-950 dark:text-neutral-50">{comment.name}</h2>
          {comment.role ? <span className="rounded-md bg-sky-50 px-1.5 py-0.5 text-xs font-medium text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">{comment.role}</span> : null}
          <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">{comment.date}</span>
          {"location" in comment && comment.location ? <span className="text-xs font-medium text-zinc-400 dark:text-neutral-500">{comment.location}</span> : null}
        </div>

        <div className="group/bubble flex max-w-full items-center gap-2">
          <div className={`${isReply ? "bg-zinc-50/85 text-[0.93rem] dark:bg-white/[0.04]" : "bg-white/80 text-[0.98rem] dark:bg-white/[0.06]"} inline-block max-w-full rounded-2xl rounded-tl-md border border-zinc-200/75 px-4 py-3 font-medium leading-7 text-zinc-700 shadow-sm shadow-zinc-950/[0.035] backdrop-blur-xl transition duration-300 group-hover/bubble:border-sky-200 dark:border-white/10 dark:text-neutral-200 dark:group-hover/bubble:border-sky-300/25`}>
            {comment.message}
          </div>
          <button type="button" className="grid size-8 shrink-0 place-items-center rounded-full border border-zinc-200/70 bg-white/80 text-zinc-400 opacity-0 shadow-sm shadow-zinc-950/[0.03] transition group-hover/bubble:opacity-100 hover:border-sky-200 hover:text-sky-500 dark:border-white/10 dark:bg-neutral-950/80 dark:text-neutral-500 dark:hover:border-sky-300/25 dark:hover:text-sky-300" aria-label={`回复 ${comment.name}`}>
            <svg className="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 10h6M7 17l-3 3v-4.5A7 7 0 0 1 7 3h10a5 5 0 0 1 0 10H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentCard({ item }: CommentCardProps) {
  return (
    <article className="space-y-5">
      <CommentBubble comment={item} />
      {item.replies?.map((reply) => (
        <CommentBubble key={`${reply.name}-${reply.date}-${reply.message}`} comment={reply} isReply />
      ))}
    </article>
  );
}
