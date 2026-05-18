import { NoteBody } from "./note-body";
import { NoteComments } from "./note-comments";
import { NoteEngagement } from "./note-engagement";
import { NoteHeader } from "./note-header";
import { NotePaper } from "./note-paper";
import { NoteToc } from "./note-toc";
import type { NoteDetail as NoteDetailData } from "./notes-data";
import type { NoteCommentTreeItem } from "@/db/queries/note-comments.query";

// 详情页组件接收单篇完整手记数据，由路由层按 slug 查找后传入。
type NoteDetailProps = {
  note: NoteDetailData;
  comments: NoteCommentTreeItem[];
};

// 手记详情页主体：组合纸张、头部、正文、点赞、目录和评论区。
export function NoteDetail({ note, comments }: NoteDetailProps) {
  return (
    <article className="relative -mx-4 -mt-28 px-4 pb-20 pt-36 md:-mt-32 md:pt-44">
      <div className="mx-auto grid w-full max-w-[67rem] gap-10 xl:grid-cols-[minmax(0,820px)_13rem] xl:items-start">
        {/* 中央阅读纸张承载详情页核心内容，保持最大宽度提高可读性。 */}
        <div className="min-w-0">
          <NotePaper>
            <NoteHeader note={note} />
            <NoteBody content={note.content} />
            <NoteEngagement noteSlug={note.slug} initialLikes={note.likes} />
          </NotePaper>
        </div>

        {/* 桌面宽屏时把目录放在阅读纸张右侧，窄屏下隐藏避免挤压正文。 */}
        <div className="hidden min-w-0 xl:block">
          <NoteToc items={note.toc} />
        </div>
      </div>

      {/* 评论区放在纸张外部，使用文章标题生成可访问标签。 */}
      <div className="mx-auto mt-10 max-w-[820px]">
        <NoteComments noteTitle={note.title} slug={note.slug} initialComments={comments} />
      </div>
    </article>
  );
}
