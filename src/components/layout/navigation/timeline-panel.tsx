import Link from "next/link";
import { FileText, Heart, Leaf, NotebookPen, PenTool } from "lucide-react";
import styles from "@/styles/page/timeline-panel.module.css";

const timelineLinks = [
  { title: "文稿", href: "/timeline?type=writing", icon: NotebookPen },
  { title: "手记", href: "/timeline?type=notes", icon: PenTool },
  { title: "回忆", href: "/timeline?type=memory", icon: Heart },
];

const recentActivities = [
  { title: "26y: 健康、AI行业变化与自我反思", date: "11天前", type: "手记", href: "/notes/26y" },
  { title: "单调里的褶皱", date: "25天前", type: "手记", href: "/notes/folds" },
  { title: "AI 时代的重构方式：从 RFC 到五个 Plan", date: "2026年3月9日星期一", type: "文稿", href: "/writing/ai-rfc-plan" },
  { title: "键盘上的春节", date: "2026年3月1日星期日", type: "手记", href: "/notes/spring-festival" },
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
            <Link key={activity.title} href={activity.href} className={styles.activityLink}>
              <span className={styles.activityText}>
                <span className={styles.activityTitle}>{activity.title}</span>
                <span className={styles.activityDate}>{activity.date}</span>
              </span>
              <span className={styles.activityType}>{activity.type}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
