// 行组件依赖 Next.js Link 负责整行可点击跳转。
import Link from "next/link";
import { getDateParts, type TimelineItem } from "./timeline-data";

// 单条时间线行的 props：接收已经归一化后的时间线条目。
type TimelineItemRowProps = {
  item: TimelineItem;
};

// 渲染时间线中的一条记录，包含节点圆点、短日期、标题和元信息。
export function TimelineItemRow({ item }: TimelineItemRowProps) {
  // 从中文日期中提取“月日”短日期，供行首展示。
  const dateParts = getDateParts(item.date);

  return (
    <Link href={item.href} className="group relative grid min-w-0 gap-x-6 gap-y-1 rounded-2xl py-2.5 md:grid-cols-[5rem_minmax(0,1fr)_12rem] md:items-baseline">
      {/* 时间轴上的圆点节点，绝对定位到左侧竖线附近。 */}
      <span className="absolute -left-[1.53rem] top-4 size-2.5 rounded-full bg-sky-300 ring-4 ring-white dark:ring-[#080808]" />
      {/* 行首日期，只显示月日，年份由外层分组标题承担。 */}
      <span className="text-sm tabular-nums text-zinc-500 dark:text-neutral-500">{dateParts.shortDate}</span>
      {/* 标题容器限制内容宽度，并为标题下划线动效提供包裹层。 */}
      <span className="min-w-0">
        {/* 条目标题；group-hover 触发伪元素横向展开，形成悬停下划线。 */}
        <span className="relative inline break-words text-[0.95rem] leading-6 text-zinc-700 after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-sky-300 after:transition-transform after:duration-300 group-hover:after:scale-x-100 dark:text-neutral-200">{item.title}</span>
      </span>
      {/* 右侧元信息：来源分类或栏目，加上归一化后的类型标签。 */}
      <span className="min-w-0 break-words text-sm text-zinc-500 md:text-right dark:text-neutral-500">
        {item.meta}/{item.typeLabel}
      </span>
    </Link>
  );
}
