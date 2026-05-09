// 文稿数据层负责从 data/writing 的 Markdown 文件读取文章元数据、正文和目录。
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 文章分类枚举约束 URL query、frontmatter 和筛选组件之间可用的分类值。
export type ArticleCategory = "programming" | "tinkering" | "archive" | "tech";

// 分类展示结构，label 用于界面文案，value 用于数据筛选和路由参数。
export type WritingCategory = {
  label: string;
  value: ArticleCategory;
};

// ArticleItem 是列表页使用的轻量文章数据，不包含正文和目录。
export type ArticleItem = {
  title: string;
  slug: string;
  description: string;
  href: string;
  date: string;
  category: ArticleCategory;
  categoryLabel: string;
  tags: string[];
  readingTime: string;
  views: string;
  likes: string;
  modifiedTime: string;
};

// 目录项只收集二级和三级标题，id 与 MDX 标题 slug 保持一致。
export type ArticleTocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

// ArticleDetail 扩展列表数据，额外包含正文 content 和 toc 供详情页使用。
export type ArticleDetail = ArticleItem & {
  content: string;
  toc: ArticleTocItem[];
};

// frontmatter 先按 unknown 接收，再由类型守卫逐字段校验，避免不合法元数据直接进入页面。
type ArticleFrontmatter = {
  title?: unknown;
  description?: unknown;
  intro?: unknown;
  date?: unknown;
  category?: unknown;
  categoryLabel?: unknown;
  tags?: unknown;
  readingTime?: unknown;
  views?: unknown;
  likes?: unknown;
  modifiedTime?: unknown;
};

// 可选分类列表是筛选导航和分类标签兜底的唯一来源。
export const writingCategories: WritingCategory[] = [
  { label: "编程", value: "programming" },
  { label: "折腾", value: "tinkering" },
  { label: "归档", value: "archive" },
  { label: "技术", value: "tech" },
];

// Markdown 文件目录固定在项目根目录 data/writing 下。
const writingDirectory = path.join(process.cwd(), "data", "writing");

// 字符串类型守卫用于校验 frontmatter 字段。
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// 字符串数组类型守卫用于校验 tags 字段。
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

// 读取必填字符串字段；缺失或类型错误时抛出带文件名的错误，便于定位内容问题。
function getRequiredString(frontmatter: ArticleFrontmatter, key: keyof ArticleFrontmatter, slug: string) {
  const value = frontmatter[key];

  if (!isString(value)) {
    throw new Error(`Missing or invalid ${String(key)} in data/writing/${slug}.md`);
  }

  return value;
}

// 读取可选字符串字段；字段不存在或类型不对时使用调用方提供的 fallback。
function getOptionalString(frontmatter: ArticleFrontmatter, key: keyof ArticleFrontmatter, fallback: string) {
  const value = frontmatter[key];
  return isString(value) ? value : fallback;
}

// 从正文中提取首个普通段落作为摘要兜底，跳过标题、代码围栏、列表和空行。
function getPlainTextExcerpt(content: string) {
  const paragraph = content
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("#") && !line.startsWith("```") && !line.startsWith("-") && !/^\d+\./.test(line));

  if (!paragraph) {
    return "";
  }

  return paragraph.replace(/[*_`>#]/g, "").slice(0, 96);
}

// 文章描述优先使用 description，其次 intro，最后回退到正文摘要。
function getArticleDescription(frontmatter: ArticleFrontmatter, content: string) {
  const description = getOptionalString(frontmatter, "description", "");

  if (description) {
    return description;
  }

  const intro = getOptionalString(frontmatter, "intro", "");

  if (intro) {
    return intro;
  }

  return getPlainTextExcerpt(content);
}

// tags 必须是字符串数组；不符合时返回空数组，保证列表循环安全。
function getArticleTags(frontmatter: ArticleFrontmatter) {
  return isStringArray(frontmatter.tags) ? frontmatter.tags : [];
}

// 文件名去掉 .md 后缀作为 slug，同时用于详情页路径。
function getArticleSlug(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

// 标题 slug 生成逻辑与 MDX 标题组件保持一致，用于目录锚点跳转。
function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

// 从 Markdown 正文中收集二级/三级标题，生成详情页右侧目录数据。
function getArticleToc(content: string): ArticleTocItem[] {
  return content
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);

      // 只有以 ## 或 ### 开头的标题行才进入目录。
      if (!match) {
        return null;
      }

      const [, marks, title] = match;

      return {
        id: slugifyHeading(title),
        title,
        level: marks.length as 2 | 3,
      };
    })
    .filter((item): item is ArticleTocItem => item !== null);
}

// 读取单个 Markdown 文件并组装完整 ArticleDetail。
function readArticleFile(fileName: string): ArticleDetail {
  const slug = getArticleSlug(fileName);
  const filePath = path.join(writingDirectory, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as ArticleFrontmatter;
  const category = getOptionalString(frontmatter, "category", "tech");

  // 分类必须在预设枚举内，防止筛选和路由出现未知分类。
  if (!isArticleCategory(category)) {
    throw new Error(`Invalid category in data/writing/${slug}.md`);
  }

  // 返回详情数据；可选字段逐项提供中文或数字兜底。
  return {
    title: getRequiredString(frontmatter, "title", slug),
    slug,
    description: getArticleDescription(frontmatter, content),
    href: `/writing/${slug}`,
    date: getOptionalString(frontmatter, "date", "未发布"),
    category,
    categoryLabel: getOptionalString(frontmatter, "categoryLabel", writingCategories.find((item) => item.value === category)?.label ?? "技术"),
    tags: getArticleTags(frontmatter),
    readingTime: getOptionalString(frontmatter, "readingTime", "5 分钟"),
    views: getOptionalString(frontmatter, "views", "0"),
    likes: getOptionalString(frontmatter, "likes", "0"),
    modifiedTime: getOptionalString(frontmatter, "modifiedTime", getOptionalString(frontmatter, "date", "未发布")),
    content: content.trim(),
    toc: getArticleToc(content),
  };
}

// 扫描文章目录，仅读取 .md 文件并映射为详情数据。
function getArticleDetails() {
  return fs
    .readdirSync(writingDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readArticleFile);
}

// 把“YYYY年M月D日”格式转成时间戳，用于文章倒序排序。
function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

// articleDetails 是详情页数据源，按发布日期从新到旧排序。
export const articleDetails: ArticleDetail[] = getArticleDetails().sort((first, second) => getDateTime(second.date) - getDateTime(first.date));

// articleItems 从详情数据投影出列表页所需字段，避免列表携带正文内容。
export const articleItems: ArticleItem[] = articleDetails.map((article) => ({
  title: article.title,
  slug: article.slug,
  description: article.description,
  href: article.href,
  date: article.date,
  category: article.category,
  categoryLabel: article.categoryLabel,
  tags: article.tags,
  readingTime: article.readingTime,
  views: article.views,
  likes: article.likes,
  modifiedTime: article.modifiedTime,
}));

// 根据 slug 查找文章详情，供动态详情页读取。
export function getArticleBySlug(slug: string) {
  return articleDetails.find((article) => article.slug === slug);
}

// 生成静态路由参数，供 Next.js 预渲染每篇文章详情页。
export function getArticleStaticParams() {
  return articleItems.map((article) => ({ slug: article.slug }));
}

// 分类类型守卫复用 writingCategories，确保外部字符串能安全收窄为 ArticleCategory。
export function isArticleCategory(category: string | undefined): category is ArticleCategory {
  return writingCategories.some((item) => item.value === category);
}
