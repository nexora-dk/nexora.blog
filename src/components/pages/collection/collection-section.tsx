import type { CollectionGroup } from "./collection-data";
import { CollectionCard } from "./collection-card";

export function CollectionSection({ group }: { group: CollectionGroup }) {
  return (
    <section className="relative pt-14">
      <div className="pointer-events-none absolute top-2 left-2 flex select-none items-center gap-3 md:-top-1">
        <span className="flex -space-x-1.5 pt-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-gradient-to-br from-pink-300 to-orange-200 opacity-75 dark:from-pink-400/45 dark:to-orange-300/35" />
          <span className="size-2.5 rounded-full bg-gradient-to-br from-sky-200 to-violet-200 opacity-75 dark:from-sky-300/35 dark:to-violet-300/35" />
        </span>
        <h2 className="font-[family-name:var(--font-dingtalk)] text-4xl tracking-[0.12em] text-transparent [-webkit-text-stroke:1.35px_rgb(209_213_219_/_0.78)] md:text-6xl dark:[-webkit-text-stroke:1.35px_rgb(82_82_91_/_0.9)]">
          {group.title}
        </h2>
      </div>
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => (
          <CollectionCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
