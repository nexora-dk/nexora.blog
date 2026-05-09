// 分类筛选组件负责在文稿页顶部渲染“全部”和各文章分类入口。
import Link from "next/link";
import type { ArticleCategory } from "./writing-data";
import { writingCategories } from "./writing-data";

// Props 只接收当前激活分类，用于决定每个筛选项的视觉状态。
type CategoryFilterProps = {
  activeCategory?: ArticleCategory;
};

// 根据是否激活返回 Tailwind 类名；只抽离样式分支，不参与业务数据计算。
function getFilterClassName(active: boolean) {
  return active
    ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950"
    : "border-neutral-200/70 bg-white/65 text-neutral-500 hover:border-neutral-300 hover:text-neutral-950 dark:border-white/10 dark:bg-neutral-950/35 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-neutral-100";
}

// CategoryFilter 输出分类导航；链接本身由 Next.js Link 处理路由跳转。
export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* “全部”入口不带查询参数；当 activeCategory 为空时展示激活态。 */}
      <Link href="/writing" className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(!activeCategory)}`}>
        全部
      </Link>
      {/* 循环 writingCategories 生成分类入口，value 写入 query，label 作为展示文案。 */}
      {writingCategories.map((category) => (
        <Link key={category.value} href={`/writing?category=${category.value}`} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${getFilterClassName(activeCategory === category.value)}`}>
          {category.label}
        </Link>
      ))}
    </div>
  );
}
