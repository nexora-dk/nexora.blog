// Next.js Link 用于文稿分类和近期文章跳转。
import Link from "next/link";
import type { WritingPanelData } from "@/components/layout/navigation/navigation-data";
// 文稿面板专用样式，控制分类列、文章列和底部状态。
import styles from "@/styles/page/writing-panel.module.css";

type WritingPanelProps = {
  data: WritingPanelData;
};

/**
 * 文稿导航面板：展示文章分类和近期文章入口。
 */
export function WritingPanel({ data }: WritingPanelProps) {
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
            {data.categories.map((category) => (
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
          <div className={styles.panelHeader}>最近更新</div>
          {/* 文章链接列表。 */}
          <div className={styles.postList}>
            {/* 遍历近期文章数据生成详情页入口。 */}
            {data.recentPosts.map((post) => (
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
        <span>{data.totalCount} 篇文稿</span>
      </div>
    </div>
  );
}
