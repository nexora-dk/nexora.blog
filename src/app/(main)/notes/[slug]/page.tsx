import {
  getNoteItemBySlug,
  incrementNoteViews,
} from "@/db/queries/notes.query";
import { getNoteComments } from "@/db/queries/note-comments.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";

import { notFound } from "next/navigation";
// 手记详情组件负责展示正文、目录、评论和点赞等具体内容。
import { NoteDetail } from "@/components/pages/notes/note-detail";
// 手记数据工具提供通过 slug 查找手记以及生成静态参数的能力。
import {
  getNoteBySlug,
  getNoteStaticParams,
} from "@/components/pages/notes/notes-data";
// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

// 手记详情页接收动态路由参数，Next.js 16 中 params 是 Promise。
type NotesDetailPageProps = {
  params: Promise<{
    // slug 对应 URL 中的 [slug] 片段，用于查找具体手记。
    slug: string;
  }>;
};

/**
 * 生成手记详情页的静态路径参数，让 Next.js 在构建时预生成已有手记页面。
 */
export function generateStaticParams() {
  // 静态参数由手记数据文件统一生成，避免路由层重复维护 slug 列表。
  return getNoteStaticParams();
}

/**
 * 手记详情页面：根据 slug 查找手记，存在则渲染详情，不存在则进入 404。
 */
export default async function NotesDetailPage({
  params,
}: NotesDetailPageProps) {
  // 等待动态路由参数 Promise，并取出手记 slug。
  const { slug } = await params;
  // 通过 slug 从本地手记数据中查找对应内容。
  const markdownNote = getNoteBySlug(slug);

  if (!markdownNote) {
    notFound();
  }

  try {
    await incrementNoteViews(slug);
  } catch (error) {
    console.warn(`Failed to increment note views for ${slug}: ${getDatabaseErrorMessage(error)}`);
  }

  let databaseNote: Awaited<ReturnType<typeof getNoteItemBySlug>>;
  let comments: Awaited<ReturnType<typeof getNoteComments>> = [];

  try {
    databaseNote = await getNoteItemBySlug(slug);
  } catch (error) {
    console.warn(`Failed to load note database item for ${slug}: ${getDatabaseErrorMessage(error)}`);
  }

  try {
    comments = await getNoteComments(slug);
  } catch (error) {
    console.warn(`Failed to load note comments for ${slug}: ${getDatabaseErrorMessage(error)}`);
  }

  const note = {
    ...markdownNote,
    ...(databaseNote ?? {}),
    slug,
    content: markdownNote.content,
    toc: markdownNote.toc,
    insight: markdownNote.insight,
  };

  return (
    // 详情页标题和描述来自手记本身；hideHeader 让 NoteDetail 控制自己的头部排版。
    <PageShell title={note.title} description={note.description} hideHeader>
      {/* 手记详情组件负责正文、目录、互动区等完整展示。 */}
      <NoteDetail note={note} comments={comments} />
    </PageShell>
  );
}
