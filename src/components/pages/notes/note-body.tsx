import { MDXRemote } from "next-mdx-remote/rsc";

import { noteMdxComponents } from "./note-mdx-components";

// 正文组件只需要已经从 Markdown 文件读取出的 MDX 字符串。
type NoteBodyProps = {
  content: string;
};

// 手记正文渲染区：把内容交给 MDXRemote，并通过组件映射统一标题、段落等排版。
export function NoteBody({ content }: NoteBodyProps) {
  return (
    <div id="note-paper-content" className="mt-7 space-y-3">
      {/* id 供阅读面板调整字号行高；MDXRemote 负责把字符串内容渲染为 React 节点。 */}
      <MDXRemote source={content} components={noteMdxComponents} />
    </div>
  );
}
