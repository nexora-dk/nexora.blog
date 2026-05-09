// Next.js Link 用于手记专栏和近期手记跳转。
import Link from "next/link";
// 手记面板专用样式，控制专栏列、手记列和底部入口。
import styles from "@/styles/page/notes-panel.module.css";

// 手记专栏入口，每项包含表情图标、标题和筛选链接。
const columns = [
  // 游记专栏。
  { icon: "🌎", title: "游记", href: "/notes?column=travel" },
  // 近况专栏。
  { icon: "🧘", title: "近况", href: "/notes?column=recent" },
  // 回忆类专栏。
  { icon: "🌿", title: "朝花夕拾", href: "/notes?column=memory" },
  // 阶段性总结专栏。
  { icon: "🫧", title: "阶段性总结", href: "/notes?column=summary" },
  // 情绪记录专栏。
  { icon: "😳", title: "深夜 emo", href: "/notes?column=emo" },
];

// 近期手记列表，用于在导航面板中快速访问最近更新。
const recentNotes = [
  // 近期手记入口。
  { title: "26y: 健康、AI行业变化与自我反思", date: "11天前", href: "/notes/26y" },
  // 近期手记入口。
  { title: "单调里的褶皱", date: "25天前", href: "/notes/folds" },
  // 近期手记入口。
  { title: "键盘上的春节", date: "2026年3月1日星期日", href: "/notes/spring-festival" },
  // 近期手记入口。
  { title: "年味渐淡的春节记忆", date: "2026年2月16日星期一", href: "/notes/new-year-memory" },
];

/**
 * 手记导航面板：展示手记专栏和近期手记入口。
 */
export function NotesPanel() {
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
            {columns.map((column) => (
              <Link key={column.title} href={column.href} className={styles.categoryLink}>
                {/* 图标和标题组成专栏标签。 */}
                <span className={styles.categoryLabel}>
                  <span>{column.icon}</span>
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
            {recentNotes.map((note) => (
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
        <Link href="/notes">全部专栏</Link>
      </div>
    </div>
  );
}
