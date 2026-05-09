// 占位卡片的输入参数，用于在真实内容未完成前展示标题和说明。
type PlaceholderCardProps = {
  // 卡片标题，说明当前占位区域代表的功能或页面。
  title: string;
  // 卡片描述，向用户解释该区域后续会承载的内容。
  description: string;
};

/**
 * 通用占位卡片：用于暂未开发完成的页面或模块，保持界面结构完整。
 */
export function PlaceholderCard({ title, description }: PlaceholderCardProps) {
  return (
    // article 语义化表示一张独立卡片，并提供亮暗主题下的边框和背景。
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/60">
      {/* 占位卡片标题。 */}
      <h2 className="font-medium">{title}</h2>
      {/* 占位卡片说明文字。 */}
      <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">{description}</p>
    </article>
  );
}
