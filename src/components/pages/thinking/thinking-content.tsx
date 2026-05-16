import { ThinkingCard } from "./thinking-card";
import type { ThinkingItem } from "./thinking-data";

type ThinkingContentProps = {
  thoughts: ThinkingItem[];
};

// ThinkingContent 是碎碎念页面的列表容器，负责按顺序展示所有动态卡片。
export function ThinkingContent({ thoughts }: ThinkingContentProps) {
  return (
    <section className="mx-auto max-w-2xl py-10 ">
      {/* 使用垂直间距组织每条动态，形成类似时间流的阅读节奏。 */}
      <div className="space-y-15">
        {/* 循环渲染动态数据，组合日期、时间和正文生成唯一 key。 */}
        {thoughts.map((item) => (
          <ThinkingCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
