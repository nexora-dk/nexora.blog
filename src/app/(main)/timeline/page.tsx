import { getTimelineItemsFromDb } from "@/db/queries/timeline.query";

import { TimelineContent } from "@/components/pages/timeline/timeline-content";

// 时间线页面接收 URL 查询参数，Next.js 16 中 searchParams 是 Promise。
type TimelinePageProps = {
  searchParams: Promise<{ type?: string | string[] }>;
};

/**
 * 时间线页面：从 URL 中读取 type 筛选条件，并交给内容组件渲染对应时间线。
 */
export default async function TimelinePage({ searchParams }: TimelinePageProps) {
  // 读取 type 查询参数，用于筛选时间线事件类型。
  const typeParam = (await searchParams).type;
  // 如果 URL 中出现多个 type 参数，只使用第一个作为当前筛选值。
  const selectedType = Array.isArray(typeParam) ? typeParam[0] : typeParam;
  const timelineItems = await getTimelineItemsFromDb();


  // 内容组件负责具体的页面布局、筛选导航和时间线条目渲染。
  return <TimelineContent timelineItems={timelineItems} selectedType={selectedType} />;

}
