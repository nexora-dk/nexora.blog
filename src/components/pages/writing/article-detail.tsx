import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { CalendarDays, Eye, Heart, Timer } from "lucide-react";
import { ArticleCodeBlock } from "./article-code-block";
import { ArticleComments } from "./article-comments";
import { ArticleLikeButton } from "./article-like-button";
import { ArticleToc } from "./article-toc";
import type { ArticleDetail } from "./writing-data";

type ArticleDetailProps = {
  article: ArticleDetail;
};

function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
}

const articleTextColor = "text-zinc-900/90 dark:text-neutral-100/90";
const articleMutedColor = "text-zinc-600/90 dark:text-neutral-300/90";

function formatArticleDate(date: string) {
  const parsedDate = new Date(date);

  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsedDate);
  }

  return date;
}

function getCodeLanguage(className?: string) {
  return className?.match(/language-(\w+)/)?.[1];
}

const mdxComponents = {
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
    const child = props.children;

    if (typeof child === "object" && child && "props" in child) {
      const codeProps = child.props as { children?: React.ReactNode; className?: string };
      const code = getTextContent(codeProps.children);

      return <ArticleCodeBlock code={code} language={getCodeLanguage(codeProps.className)} />;
    }

    return <pre {...props} />;
  },
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
    <h1 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-8 text-[1.875rem] font-semibold leading-tight tracking-normal ${articleTextColor}`} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-6 text-2xl font-semibold leading-tight tracking-normal ${articleTextColor}`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-4 text-xl font-semibold leading-tight tracking-normal ${articleTextColor}`} {...props}>
      {children}
    </h3>
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] ${articleTextColor}`} {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`list-disc space-y-1.5 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] marker:text-zinc-300 dark:marker:text-neutral-600 ${articleTextColor}`} {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className={`list-decimal space-y-1.5 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] marker:text-zinc-400 dark:marker:text-neutral-500 ${articleTextColor}`} {...props} />,
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="pl-1 [&>figure]:my-4 [&>p]:my-0" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => <blockquote className={`border-l-2 border-zinc-300 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] ${articleMutedColor} dark:border-neutral-700`} {...props} />,
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-950 dark:text-neutral-50 dark:decoration-neutral-600 dark:hover:decoration-neutral-50" {...props} />,
  code: (props: React.ComponentPropsWithoutRef<"code">) => <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[0.88em] text-zinc-800 dark:bg-white/10 dark:text-neutral-100" {...props} />,
};

export function ArticleDetail({ article }: ArticleDetailProps) {
  return (
    <article className="relative -mx-5 space-y-10 px-5 pt-2 lg:-mx-28 lg:px-28 xl:-mx-72 xl:px-72">
      <header className="space-y-7 py-1 text-center">
        <h1 className={`mx-auto max-w-[58rem] text-balance font-[ui-sans-serif,system-ui,sans-serif] text-3xl font-semibold leading-tight tracking-normal md:text-[2.6rem] ${articleTextColor}`}>{article.title}</h1>

        <dl className="mx-auto flex max-w-[44rem] flex-wrap items-center justify-center gap-x-8 gap-y-2 font-[ui-sans-serif,system-ui,sans-serif] text-sm font-medium">
          <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
            <dt className="sr-only">发布日期</dt>
            <CalendarDays className="size-3.5" />
            <dd>{formatArticleDate(article.date)}</dd>
          </div>
          <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
            <dt className="sr-only">阅读时间</dt>
            <Timer className="size-3.5" />
            <dd>{article.readingTime}</dd>
          </div>
          <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
            <dt className="sr-only">浏览量</dt>
            <Eye className="size-3.5" />
            <dd>{article.views}</dd>
          </div>
          <div className={`inline-flex items-center gap-1.5 ${articleTextColor}`}>
            <dt className="sr-only">喜欢</dt>
            <Heart className="size-3.5" />
            <dd>{article.likes}</dd>
          </div>
        </dl>
      </header>

      <div className="mx-auto grid w-full max-w-[52rem] overflow-visible xl:grid-cols-[minmax(0,52rem)_0]">
        <div className="min-w-0 space-y-[17.5px]">
          <MDXRemote source={article.content} components={mdxComponents} />

          <div className="mt-12 border-t border-zinc-200/70 pt-8 dark:border-white/10">
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-xs font-medium tracking-[0.18em] text-zinc-400 uppercase dark:text-neutral-500">喜欢这篇文稿吗</p>
              <ArticleLikeButton articleSlug={article.slug} initialLikes={article.likes} />
            </div>
          </div>

          <footer className="grid gap-3 border-t border-zinc-200/70 pt-6 text-sm text-zinc-500 dark:border-white/10 dark:text-neutral-400 md:grid-cols-2">
            <Link href="/writing" className="transition hover:text-zinc-950 dark:hover:text-neutral-50">
              返回全部文稿
            </Link>
            <span className="md:text-right">最后修改于 {formatArticleDate(article.modifiedTime)}</span>
          </footer>
        </div>

        <ArticleToc items={article.toc} />
      </div>

      <div className="mx-auto w-full max-w-[52rem]">
        <ArticleComments articleTitle={article.title} />
      </div>
    </article>
  );
}
