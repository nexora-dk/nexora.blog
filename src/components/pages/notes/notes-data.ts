import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// 手记专栏枚举：所有列表筛选、归档图标和 frontmatter 校验都围绕这些值展开。
export type NoteColumn = "travel" | "recent" | "memory" | "summary" | "emo";

// 专栏元信息用于筛选按钮和归档页头部展示。
export type NoteColumnMeta = {
  label: string;
  value: NoteColumn;
  description: string;
};

// 列表态手记数据结构：只包含卡片、分页、归档和详情头部需要的摘要字段。
export type NoteItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  column: NoteColumn;
  columnLabel: string;
  mood?: string;
  location?: string;
  tags: string[];
  publishedAt: string;
  views: string;
  likes: string;
  readingTime: string;
};

// 目录项由 Markdown 二、三级标题生成，level 决定阅读面板中的缩进。
export type NoteTocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

// 详情态在列表态基础上补充 slug、正文、目录和摘要洞察。
export type NoteDetail = NoteItem & {
  slug: string;
  content: string;
  toc: NoteTocItem[];
  insight: string;
};

// gray-matter 读取的 frontmatter 先按 unknown 接收，再逐项校验成业务数据。
type NoteFrontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  column?: unknown;
  columnLabel?: unknown;
  mood?: unknown;
  location?: unknown;
  tags?: unknown;
  publishedAt?: unknown;
  views?: unknown;
  likes?: unknown;
  readingTime?: unknown;
  insight?: unknown;
};

// 专栏配置是筛选、归档和默认专栏文案的唯一来源。
export const noteColumns: NoteColumnMeta[] = [
  { label: "游记", value: "travel", description: "城市、路途和短暂出走。" },
  { label: "近况", value: "recent", description: "生活切片、近况更新和即时感受。" },
  { label: "朝花夕拾", value: "memory", description: "旧事、回忆和被时间留下的细节。" },
  { label: "阶段性总结", value: "summary", description: "阶段复盘、年度记录和自我校准。" },
  { label: "深夜 emo", value: "emo", description: "低落、敏感和一些不那么明亮的时刻。" },
];

// Markdown 手记文件统一放在 data/notes，组件层只消费这里读出的结构化数据。
const notesDirectory = path.join(process.cwd(), "data", "notes");

// 基础类型守卫：确保 required/optional 字段不会把非字符串带入页面。
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// tags 必须是纯字符串数组，避免归档或标签展示时遇到混合类型。
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

// 必填字符串缺失时直接抛错，让内容问题在构建/渲染阶段尽早暴露。
function getRequiredString(frontmatter: NoteFrontmatter, key: keyof NoteFrontmatter, slug: string) {
  const value = frontmatter[key];

  if (!isString(value)) {
    throw new Error(`Missing or invalid ${String(key)} in data/notes/${slug}.md`);
  }

  return value;
}

// 可选字符串读取失败时使用 fallback，保证列表和详情页始终有可展示内容。
function getOptionalString(frontmatter: NoteFrontmatter, key: keyof NoteFrontmatter, fallback: string) {
  const value = frontmatter[key];
  return isString(value) ? value : fallback;
}

// 心情和地点为空字符串时视为不存在，便于条件渲染跳过空徽标。
function getOptionalNoteMeta(frontmatter: NoteFrontmatter, key: "mood" | "location") {
  const value = frontmatter[key];
  return isString(value) && value ? value : undefined;
}

// 当 frontmatter 未写 description 时，从正文第一段普通文本生成简短摘要。
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

// 标签字段不合法时降级为空数组，列表数据结构仍保持稳定。
function getNoteTags(frontmatter: NoteFrontmatter) {
  return isStringArray(frontmatter.tags) ? frontmatter.tags : [];
}

// 文件名去掉 .md 后作为 slug，用于详情路由和点赞本地存储键。
function getNoteSlug(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

// 标题锚点生成规则需要与 MDX 组件映射保持一致，目录点击才能定位到对应标题。
function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

// 从 Markdown 内容中提取二、三级标题，生成详情页右侧目录数据。
function getNoteToc(content: string): NoteTocItem[] {
  return content
    .split("\n")
    .map((line) => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);

      // 非二/三级标题不进入目录。
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
    .filter((item): item is NoteTocItem => item !== null);
}

// 中文日期转时间戳用于倒序排序；无法解析时排到较后位置。
function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

// 读取单个 Markdown 文件并归一化为详情态数据，是手记数据结构的核心入口。
function readNoteFile(fileName: string): NoteDetail {
  const slug = getNoteSlug(fileName);
  const filePath = path.join(notesDirectory, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as NoteFrontmatter;
  const column = getOptionalString(frontmatter, "column", "recent");

  // 专栏值必须在 NoteColumn 范围内，否则筛选和归档无法正确匹配。
  if (!isNoteColumn(column)) {
    throw new Error(`Invalid column in data/notes/${slug}.md`);
  }

  const description = getOptionalString(frontmatter, "description", getPlainTextExcerpt(content));

  return {
    title: getRequiredString(frontmatter, "title", slug),
    slug,
    description,
    href: `/notes/${slug}`,
    date: getOptionalString(frontmatter, "date", "未发布"),
    column,
    columnLabel: getOptionalString(frontmatter, "columnLabel", noteColumns.find((item) => item.value === column)?.label ?? "近况"),
    mood: getOptionalNoteMeta(frontmatter, "mood"),
    location: getOptionalNoteMeta(frontmatter, "location"),
    tags: getNoteTags(frontmatter),
    publishedAt: getOptionalString(frontmatter, "publishedAt", getOptionalString(frontmatter, "date", "未发布")),
    views: getOptionalString(frontmatter, "views", "0"),
    likes: getOptionalString(frontmatter, "likes", "0"),
    readingTime: getOptionalString(frontmatter, "readingTime", "5 分钟"),
    insight: getOptionalString(frontmatter, "insight", description),
    content: content.trim(),
    toc: getNoteToc(content),
  };
}

// 扫描手记目录，只读取 Markdown 文件并映射为详情态数组。
function getNoteDetails() {
  return fs
    .readdirSync(notesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readNoteFile);
}

// 全量详情数据按发布日期倒序排序，列表、归档和静态参数都共享这一顺序。
const noteDetails: NoteDetail[] = getNoteDetails().sort((first, second) => getDateTime(second.publishedAt) - getDateTime(first.publishedAt));

// 列表数据从详情数据裁剪而来，避免列表组件接触正文内容。
export const noteItems: NoteItem[] = noteDetails.map((note) => ({
  title: note.title,
  description: note.description,
  href: note.href,
  date: note.date,
  column: note.column,
  columnLabel: note.columnLabel,
  mood: note.mood,
  location: note.location,
  tags: note.tags,
  publishedAt: note.publishedAt,
  views: note.views,
  likes: note.likes,
  readingTime: note.readingTime,
}));

// 详情路由按 slug 查找单篇完整手记。
export function getNoteBySlug(slug: string) {
  return noteDetails.find((note) => note.slug === slug);
}

// 静态路由参数来自全部详情数据的 slug。
export function getNoteStaticParams() {
  return noteDetails.map((note) => ({ slug: note.slug }));
}

// 查询参数校验入口：只有合法专栏值才会触发筛选和归档视图。
export function isNoteColumn(column: string | undefined): column is NoteColumn {
  return noteColumns.some((item) => item.value === column);
}
