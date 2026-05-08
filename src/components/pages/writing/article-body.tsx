import { MDXRemote } from "next-mdx-remote/rsc";

import { articleMdxComponents } from "./article-mdx-components";

type ArticleBodyProps = {
  content: string;
};

export function ArticleBody({ content }: ArticleBodyProps) {
  return <MDXRemote source={content} components={articleMdxComponents} />;
}
