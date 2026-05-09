// 文章正文组件负责把 Markdown/MDX 字符串交给 RSC 版 MDXRemote 渲染。
import { MDXRemote } from "next-mdx-remote/rsc";

import { articleMdxComponents } from "./article-mdx-components";

// content 是从文章 Markdown 文件读取出的正文，不包含 frontmatter。
type ArticleBodyProps = {
  content: string;
};

// ArticleBody 只做 MDX 渲染桥接；具体标签样式和代码块映射由 articleMdxComponents 控制。
export function ArticleBody({ content }: ArticleBodyProps) {
  return <MDXRemote source={content} components={articleMdxComponents} />;
}
