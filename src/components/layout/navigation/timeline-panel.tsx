import Link from "next/link";
import { Heart, NotebookPen, PenTool } from "lucide-react";
import { getDateParts, getTimelineItems } from "@/components/pages/timeline/timeline-data";
import styles from "@/styles/page/timeline-panel.module.css";

const timelineLinks = [
  { title: "文稿", href: "/timeline?type=writing", icon: NotebookPen },
  { title: "手记", href: "/timeline?type=notes", icon: PenTool },
  { title: "回忆", href: "/timeline?type=memory", icon: Heart },
];

const recentActivities = getTimelineItems().slice(0, 4);

export function TimelinePanel() {
  return (
    <div className={styles.timelinePanel}>
      <div className={styles.timelineTabs}>
        {timelineLinks.map((link) => {
          const Icon = link.icon;

          return (
            <Link key={link.title} href={link.href} className={styles.timelineTab}>
              <Icon className={styles.timelineTabIcon} strokeWidth={2.4} />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.panelDivider} />

      <section className={styles.timelineBody}>
        <div className={styles.panelHeader}>近期动态</div>
        <div className={styles.activityList}>
          {recentActivities.map((activity) => (
            <Link key={`${activity.type}-${activity.href}`} href={activity.href} className={styles.activityLink}>
              <span className={styles.activityText}>
                <span className={styles.activityTitle}>{activity.title}</span>
                <span className={styles.activityDate}>{getDateParts(activity.date).shortDate}</span>
              </span>
              <span className={styles.activityType}>{activity.typeLabel}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
