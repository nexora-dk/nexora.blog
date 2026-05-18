// Next.js Link 用于手记专栏和近期手记跳转。
import Link from "next/link";
import type { NotesPanelData } from "@/components/layout/navigation/navigation-data";
// 手记面板专用样式，控制专栏列、手记列和底部入口。
import styles from "@/styles/page/notes-panel.module.css";

type NotesPanelProps = {
  data: NotesPanelData;
};

const noteColumnIcons: Record<string, string> = {
  travel: "🌎",
  recent: "🧘",
  memory: "🌿",
  summary: "🫧",
  emo: "😳",
};

/**
 * 手记导航面板：展示手记专栏和近期手记入口。
 */
export function NotesPanel({ data }: NotesPanelProps) {
  return (
    // 手记面板根容器。
    <div className={styles.notesPanel}>
      {/* 面板主体采用双列布局：左侧专栏，右侧近期手记。 */}
      <div className={styles.panelBody}>
        {/* 专栏列表列。 */}
        <section className={styles.categoriesColumn}>
          {/* 分组标题。 */}
          <div className={styles.panelHeader}>专栏</div>
          {/* 专栏链接列表。 */}
          <div className={styles.categoryList}>
            {/* 遍历专栏数据生成筛选链接。 */}
            {data.columns.map((column) => (
              <Link key={column.title} href={column.href} className={styles.categoryLink}>
                {/* 图标和标题组成专栏标签。 */}
                <span className={styles.categoryLabel}>
                  <span>{noteColumnIcons[column.value]}</span>
                  <span>{column.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 近期手记列表列。 */}
        <section className={styles.postsColumn}>
          {/* 分组标题。 */}
          <div className={styles.panelHeader}>近期手记</div>
          {/* 手记链接列表。 */}
          <div className={styles.postList}>
            {/* 遍历近期手记数据生成详情页入口。 */}
            {data.recentNotes.map((note) => (
              <Link key={note.href} href={note.href} className={styles.postLink}>
                {/* 手记标题。 */}
                <span className={styles.postTitle}>{note.title}</span>
                {/* 发布时间或相对时间。 */}
                <span className={styles.postDate}>{note.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 面板底部提供列表页和专栏入口。 */}
      <div className={styles.panelFooter}>
        <Link href="/notes">查看全部手记</Link>
        <span>{data.totalCount} 篇手记</span>
      </div>
    </div>
  );
}
