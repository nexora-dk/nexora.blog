import Link from "next/link";
import styles from "@/styles/page/writing-panel.module.css";

const categories = [
  { title: "编程", count: 38, href: "/writing?category=programming" },
  { title: "折腾", count: 8, href: "/writing?category=tinkering" },
  { title: "归档", count: 69, href: "/writing?category=archive" },
  { title: "技术", count: 38, href: "/writing?category=tech" },
];

const recentPosts = [
  { title: "AI 时代的重构方式：从 RFC 到五个 Plan", date: "2026年3月9日星期一", href: "/writing/ai-rfc-plan" },
  { title: "初探 Context Engineering", date: "2025年7月11日星期五", href: "/writing/context-engineering" },
  { title: "虚拟列表中的选区操作", date: "2024年4月15日星期一", href: "/writing/virtual-list-selection" },
  { title: "Server Action & Streamable UI", date: "2024年3月6日星期三", href: "/writing/server-action-streamable-ui" },
];

export function WritingPanel() {
  return (
    <div className={styles.writingPanel}>
      <div className={styles.panelBody}>
        <section className={styles.categoriesColumn}>
          <div className={styles.panelHeader}>分类</div>
          <div className={styles.categoryList}>
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className={styles.categoryLink}>
                <span>{category.title}</span>
                <span className={styles.categoryCount}>{category.count}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.postsColumn}>
          <div className={styles.panelHeader}>编程 · 最近</div>
          <div className={styles.postList}>
            {recentPosts.map((post) => (
              <Link key={post.title} href={post.href} className={styles.postLink}>
                <span className={styles.postTitle}>{post.title}</span>
                <span className={styles.postDate}>{post.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className={styles.panelFooter}>
        <Link href="/writing">查看全部文稿</Link>
        <span>153 篇文稿</span>
      </div>
    </div>
  );
}
