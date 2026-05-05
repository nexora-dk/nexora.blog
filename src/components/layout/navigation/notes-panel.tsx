import Link from "next/link";
import styles from "@/styles/page/notes-panel.module.css";

const columns = [
  { icon: "🌎", title: "游记", href: "/notes?column=travel" },
  { icon: "🧘", title: "近况", href: "/notes?column=recent" },
  { icon: "🌿", title: "朝花夕拾", href: "/notes?column=memory" },
  { icon: "🫧", title: "阶段性总结", href: "/notes?column=summary" },
  { icon: "😳", title: "深夜 emo", href: "/notes?column=emo" },
];

const recentNotes = [
  { title: "26y: 健康、AI行业变化与自我反思", date: "11天前", href: "/notes/26y" },
  { title: "单调里的褶皱", date: "25天前", href: "/notes/folds" },
  { title: "键盘上的春节", date: "2026年3月1日星期日", href: "/notes/spring-festival" },
  { title: "年味渐淡的春节记忆", date: "2026年2月16日星期一", href: "/notes/new-year-memory" },
];

export function NotesPanel() {
  return (
    <div className={styles.notesPanel}>
      <div className={styles.panelBody}>
        <section className={styles.categoriesColumn}>
          <div className={styles.panelHeader}>专栏</div>
          <div className={styles.categoryList}>
            {columns.map((column) => (
              <Link key={column.title} href={column.href} className={styles.categoryLink}>
                <span className={styles.categoryLabel}>
                  <span>{column.icon}</span>
                  <span>{column.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.postsColumn}>
          <div className={styles.panelHeader}>近期手记</div>
          <div className={styles.postList}>
            {recentNotes.map((note) => (
              <Link key={note.title} href={note.href} className={styles.postLink}>
                <span className={styles.postTitle}>{note.title}</span>
                <span className={styles.postDate}>{note.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.panelFooter}>
        <Link href="/notes">查看全部手记</Link>
        <Link href="/notes">全部专栏</Link>
      </div>
    </div>
  );
}
