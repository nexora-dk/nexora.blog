import Link from "next/link";
import { Heart, NotebookPen, PenTool } from "lucide-react";
import styles from "@/styles/page/timeline-panel.module.css";

const timelineLinks = [
  { title: "文稿", href: "/timeline?type=writing", icon: NotebookPen },
  { title: "手记", href: "/timeline?type=notes", icon: PenTool },
  { title: "回忆", href: "/timeline?type=memory", icon: Heart },
];

const recentActivities = [
  { title: "AI 时代的重构方式：从 RFC 到五个 Plan", date: "3月9日", href: "/writing/ai-rfc-plan", typeLabel: "文稿" },
  { title: "把博客首页重做成一张安静的书桌", date: "1月18日", href: "/writing/quiet-desk-homepage", typeLabel: "文稿" },
  { title: "26y: 健康、AI行业变化与自我反思", date: "4月23日", href: "/notes/26y", typeLabel: "手记" },
  { title: "单调里的褶皱", date: "4月9日", href: "/notes/folds", typeLabel: "手记" },
];

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
            <Link key={activity.href} href={activity.href} className={styles.activityLink}>
              <span className={styles.activityText}>
                <span className={styles.activityTitle}>{activity.title}</span>
                <span className={styles.activityDate}>{activity.date}</span>
              </span>
              <span className={styles.activityType}>{activity.typeLabel}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
