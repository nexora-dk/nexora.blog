// Next.js Link 用于文稿分类和近期文章跳转。
import Link from "next/link";
// 文稿面板专用样式，控制分类列、文章列和底部状态。
import styles from "@/styles/page/writing-panel.module.css";

// 文稿分类入口，count 用于展示每类文章数量。
const categories = [
  // 编程分类入口。
  { title: "编程", count: 38, href: "/writing?category=programming" },
  // 折腾分类入口。
  { title: "折腾", count: 8, href: "/writing?category=tinkering" },
  // 归档分类入口。
  { title: "归档", count: 69, href: "/writing?category=archive" },
  // 技术分类入口。
  { title: "技术", count: 38, href: "/writing?category=tech" },
];

// 最近文章列表，用于在导航面板中快速访问近期文稿。
const recentPosts = [
  // 最近文稿入口。
  { title: "AI 时代的重构方式：从 RFC 到五个 Plan", date: "2026年3月9日星期一", href: "/writing/ai-rfc-plan" },
  // 最近文稿入口。
  { title: "初探 Context Engineering", date: "2025年7月11日星期五", href: "/writing/context-engineering" },
  // 最近文稿入口。
  { title: "虚拟列表中的选区操作", date: "2024年4月15日星期一", href: "/writing/virtual-list-selection" },
  // 最近文稿入口。
  { title: "Server Action & Streamable UI", date: "2024年3月6日星期三", href: "/writing/server-action-streamable-ui" },
];

/**
 * 文稿导航面板：展示文章分类和近期文章入口。
 */
export function WritingPanel() {
  return (
    // 文稿面板根容器。
    <div className={styles.writingPanel}>
      {/* 面板主体采用双列布局：左侧分类，右侧近期文章。 */}
      <div className={styles.panelBody}>
        {/* 分类列表列。 */}
        <section className={styles.categoriesColumn}>
          {/* 分组标题。 */}
          <div className={styles.panelHeader}>分类</div>
          {/* 分类链接列表。 */}
          <div className={styles.categoryList}>
            {/* 遍历分类数据生成筛选链接。 */}
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className={styles.categoryLink}>
                <span>{category.title}</span>
                {/* 分类文章数量。 */}
                <span className={styles.categoryCount}>{category.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 近期文章列表列。 */}
        <section className={styles.postsColumn}>
          {/* 分组标题，强调当前展示的是编程方向近期内容。 */}
          <div className={styles.panelHeader}>编程 · 最近</div>
          {/* 文章链接列表。 */}
          <div className={styles.postList}>
            {/* 遍历近期文章数据生成详情页入口。 */}
            {recentPosts.map((post) => (
              <Link key={post.title} href={post.href} className={styles.postLink}>
                {/* 文章标题。 */}
                <span className={styles.postTitle}>{post.title}</span>
                {/* 发布日期。 */}
                <span className={styles.postDate}>{post.date}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* 面板底部提供查看全部文稿入口和总数说明。 */}
      <div className={styles.panelFooter}>
        <Link href="/writing">查看全部文稿</Link>
        <span>153 篇文稿</span>
      </div>
    </div>
  );
}
