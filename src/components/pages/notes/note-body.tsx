import { MDXRemote } from "next-mdx-remote/rsc";

import { noteMdxComponents } from "./note-mdx-components";

type NoteBodyProps = {
  content: string;
};

export function NoteBody({ content }: NoteBodyProps) {
  return (
    <div id="note-paper-content" className="mt-7 space-y-3">
      <MDXRemote source={content} components={noteMdxComponents} />
    </div>
  );
}
