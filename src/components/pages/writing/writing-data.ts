import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ArticleCategory = "programming" | "tinkering" | "archive" | "tech";

export type WritingCategory = {
  label: string;
  value: ArticleCategory;
};

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

export type ArticleTocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type ArticleDetail = ArticleItem & {
  content: string;
  toc: ArticleTocItem[];
};

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

export const writingCategories: WritingCategory[] = [
  { label: "编程", value: "programming" },
  { label: "折腾", value: "tinkering" },
  { label: "归档", value: "archive" },
  { label: "技术", value: "tech" },
];

const writingDirectory = path.join(process.cwd(), "data", "writing");

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function getRequiredString(frontmatter: ArticleFrontmatter, key: keyof ArticleFrontmatter, slug: string) {
  const value = frontmatter[key];

  if (!isString(value)) {
    throw new Error(`Missing or invalid ${String(key)} in data/writing/${slug}.md`);
  }

  return value;
}

function getOptionalString(frontmatter: ArticleFrontmatter, key: keyof ArticleFrontmatter, fallback: string) {
  const value = frontmatter[key];
  return isString(value) ? value : fallback;
}

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

function getArticleTags(frontmatter: ArticleFrontmatter) {
  return isStringArray(frontmatter.tags) ? frontmatter.tags : [];
}

function getArticleSlug(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function getArticleToc(content: string): ArticleTocItem[] {
  return content
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);

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

function readArticleFile(fileName: string): ArticleDetail {
  const slug = getArticleSlug(fileName);
  const filePath = path.join(writingDirectory, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as ArticleFrontmatter;
  const category = getOptionalString(frontmatter, "category", "tech");

  if (!isArticleCategory(category)) {
    throw new Error(`Invalid category in data/writing/${slug}.md`);
  }

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

function getArticleDetails() {
  return fs
    .readdirSync(writingDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readArticleFile);
}

function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

export const articleDetails: ArticleDetail[] = getArticleDetails().sort((first, second) => getDateTime(second.date) - getDateTime(first.date));

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

export function getArticleBySlug(slug: string) {
  return articleDetails.find((article) => article.slug === slug);
}

export function getArticleStaticParams() {
  return articleItems.map((article) => ({ slug: article.slug }));
}

export function isArticleCategory(category: string | undefined): category is ArticleCategory {
  return writingCategories.some((item) => item.value === category);
}
