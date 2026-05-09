import type { CollectionGroup } from "./collection-data";
import { CollectionCard } from "./collection-card";

// 收藏页的分组区块组件，接收一个分组并渲染标题装饰和卡片网格。
export function CollectionSection({ group }: { group: CollectionGroup }) {
  return (
    <section className="relative pt-14">
      {/* 绝对定位的分组标题背景层，pointer-events-none 避免遮挡下方卡片交互。 */}
      <div className="pointer-events-none absolute top-2 left-2 flex select-none items-center gap-3 md:-top-1">
        {/* 两个彩色圆点作为标题前的装饰符号，并通过 aria-hidden 排除辅助朗读。 */}
        <span className="flex -space-x-1.5 pt-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-gradient-to-br from-pink-300 to-orange-200 opacity-75 dark:from-pink-400/45 dark:to-orange-300/35" />
          <span className="size-2.5 rounded-full bg-gradient-to-br from-sky-200 to-violet-200 opacity-75 dark:from-sky-300/35 dark:to-violet-300/35" />
        </span>
        <h2 className="font-[family-name:var(--font-dingtalk)] text-4xl tracking-[0.12em] text-transparent [-webkit-text-stroke:1.35px_rgb(209_213_219_/_0.78)] md:text-6xl dark:[-webkit-text-stroke:1.35px_rgb(82_82_91_/_0.9)]">
          {group.title}
        </h2>
      </div>
      {/* 卡片网格位于标题背景层之上，随屏幕宽度从一列扩展到三列。 */}
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => (
          // 每个收藏条目交给 CollectionCard 处理链接、图标和文案展示。
          <CollectionCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
