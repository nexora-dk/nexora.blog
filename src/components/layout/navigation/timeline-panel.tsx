// Next.js Link 用于时间线筛选入口和近期动态跳转。
import Link from "next/link";
// lucide 图标用于区分不同时间线类型。
import { Heart, NotebookPen, PenTool } from "lucide-react";
import type { TimelinePanelData } from "@/components/layout/navigation/navigation-data";
// 时间线面板专用样式，控制标签、列表和动态类型徽标。
import styles from "@/styles/page/timeline-panel.module.css";

type TimelinePanelProps = {
  data: TimelinePanelData;
};

const timelineIconMap = {
  "notebook-pen": NotebookPen,
  "pen-tool": PenTool,
  heart: Heart,
};

/**
 * 时间线导航面板：提供时间线类型筛选入口和近期动态列表。
 */
export function TimelinePanel({ data }: TimelinePanelProps) {
  return (
    // 时间线面板根容器。
    <div className={styles.timelinePanel}>
      {/* 顶部筛选标签区域。 */}
      <div className={styles.timelineTabs}>
        {/* 遍历时间线类型入口，动态取出对应图标组件。 */}
        {data.links.map((link) => {
          const Icon = timelineIconMap[link.iconKey];

          return (
            <Link key={link.title} href={link.href} className={styles.timelineTab}>
              {/* 类型图标，用于增强入口辨识度。 */}
              <Icon className={styles.timelineTabIcon} strokeWidth={2.4} />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </div>

      {/* 分隔线区分筛选入口和近期动态。 */}
      <div className={styles.panelDivider} />

      {/* 近期动态列表区域。 */}
      <section className={styles.timelineBody}>
        {/* 分组标题。 */}
        <div className={styles.panelHeader}>近期动态</div>
        {/* 动态链接列表。 */}
        <div className={styles.activityList}>
          {/* 遍历近期动态数据生成对应内容链接。 */}
          {data.recentActivities.map((activity) => (
            <Link key={activity.href} href={activity.href} className={styles.activityLink}>
              {/* 左侧包含标题和日期。 */}
              <span className={styles.activityText}>
                <span className={styles.activityTitle}>{activity.title}</span>
                <span className={styles.activityDate}>{activity.date}</span>
              </span>
              {/* 右侧类型徽标标记该动态属于文稿还是手记。 */}
              <span className={styles.activityType}>{activity.typeLabel}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
