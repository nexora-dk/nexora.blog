import { NoteLikeButton } from "./note-like-button";

type NoteEngagementProps = {
  noteSlug: string;
  initialLikes: string;
};

export function NoteEngagement({ noteSlug, initialLikes }: NoteEngagementProps) {
  return (
    <div className="mt-12 border-t border-zinc-200/60 pt-8 dark:border-white/10">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-[#9c8d80] uppercase dark:text-neutral-500">喜欢这篇手记吗</p>
        <NoteLikeButton noteSlug={noteSlug} initialLikes={initialLikes} />
      </div>
    </div>
  );
}
