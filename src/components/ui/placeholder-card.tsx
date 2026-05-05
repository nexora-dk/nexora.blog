type PlaceholderCardProps = {
  title: string;
  description: string;
};

export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      <h2 className="font-medium">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
    </article>
  );
}
