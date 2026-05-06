import { ThinkingCard } from "./thinking-card";
import { thinkingItems } from "./thinking-data";

export function ThinkingContent() {
  return (
    <section className="mx-auto max-w-2xl py-10 ">
      <div className="space-y-15">
        {thinkingItems.map((item) => (
          <ThinkingCard key={`${item.publishedAt}-${item.time ?? "day"}-${item.content}`} item={item} />
        ))}
      </div>
    </section>
  );
}
