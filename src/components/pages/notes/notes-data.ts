import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type NoteColumn = "travel" | "recent" | "memory" | "summary" | "emo";

export type NoteColumnMeta = {
  label: string;
  value: NoteColumn;
  description: string;
};

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

export type NoteTocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type NoteDetail = NoteItem & {
  slug: string;
  content: string;
  toc: NoteTocItem[];
  insight: string;
};

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

export const noteColumns: NoteColumnMeta[] = [
  { label: "游记", value: "travel", description: "城市、路途和短暂出走。" },
  { label: "近况", value: "recent", description: "生活切片、近况更新和即时感受。" },
  { label: "朝花夕拾", value: "memory", description: "旧事、回忆和被时间留下的细节。" },
  { label: "阶段性总结", value: "summary", description: "阶段复盘、年度记录和自我校准。" },
  { label: "深夜 emo", value: "emo", description: "低落、敏感和一些不那么明亮的时刻。" },
];

const notesDirectory = path.join(process.cwd(), "data", "notes");

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function getRequiredString(frontmatter: NoteFrontmatter, key: keyof NoteFrontmatter, slug: string) {
  const value = frontmatter[key];

  if (!isString(value)) {
    throw new Error(`Missing or invalid ${String(key)} in data/notes/${slug}.md`);
  }

  return value;
}

function getOptionalString(frontmatter: NoteFrontmatter, key: keyof NoteFrontmatter, fallback: string) {
  const value = frontmatter[key];
  return isString(value) ? value : fallback;
}

function getOptionalNoteMeta(frontmatter: NoteFrontmatter, key: "mood" | "location") {
  const value = frontmatter[key];
  return isString(value) && value ? value : undefined;
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

function getNoteTags(frontmatter: NoteFrontmatter) {
  return isStringArray(frontmatter.tags) ? frontmatter.tags : [];
}

function getNoteSlug(fileName: string) {
  return fileName.replace(/\.md$/, "");
}

function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function getNoteToc(content: string): NoteTocItem[] {
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
    .filter((item): item is NoteTocItem => item !== null);
}

function getDateTime(date: string) {
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!match) {
    return 0;
  }

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime();
}

function readNoteFile(fileName: string): NoteDetail {
  const slug = getNoteSlug(fileName);
  const filePath = path.join(notesDirectory, fileName);
  const file = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as NoteFrontmatter;
  const column = getOptionalString(frontmatter, "column", "recent");

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

function getNoteDetails() {
  return fs
    .readdirSync(notesDirectory)
    .filter((fileName) => fileName.endsWith(".md"))
    .map(readNoteFile);
}

export const noteDetails: NoteDetail[] = getNoteDetails().sort((first, second) => getDateTime(second.publishedAt) - getDateTime(first.publishedAt));

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

export function getNoteBySlug(slug: string) {
  return noteDetails.find((note) => note.slug === slug);
}

export function getNoteStaticParams() {
  return noteDetails.map((note) => ({ slug: note.slug }));
}

export function isNoteColumn(column: string | undefined): column is NoteColumn {
  return noteColumns.some((item) => item.value === column);
}
