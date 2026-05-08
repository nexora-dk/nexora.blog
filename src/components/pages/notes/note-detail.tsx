import { NoteBody } from "./note-body";
import { NoteComments } from "./note-comments";
import { NoteEngagement } from "./note-engagement";
import { NoteHeader } from "./note-header";
import { NotePaper } from "./note-paper";
import { NoteToc } from "./note-toc";
import type { NoteDetail as NoteDetailData } from "./notes-data";

type NoteDetailProps = {
  note: NoteDetailData;
};

export function NoteDetail({ note }: NoteDetailProps) {
  return (
    <article className="relative -mx-5 -mt-28 px-4 pb-20 pt-36 md:-mt-32 md:px-6 md:pt-44 lg:-mx-28 lg:px-8 xl:-mx-80 xl:px-10">
      <div className="relative mx-auto max-w-[82rem]">
        <div className="mx-auto max-w-[820px]">
          <NotePaper>
            <NoteHeader note={note} />
            <NoteBody content={note.content} />
            <NoteEngagement noteSlug={note.slug} initialLikes={note.likes} />
          </NotePaper>
        </div>

        <div className="absolute bottom-0 left-[calc(50%+430px)] top-[70px] hidden xl:block">
          <NoteToc items={note.toc} />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[820px]">
        <NoteComments noteTitle={note.title} />
      </div>
    </article>
  );
}
