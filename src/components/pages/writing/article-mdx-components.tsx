// MDX 组件映射集中定义文章详情正文中各类 Markdown 标签的渲染方式。
import { ArticleCodeBlock } from "./article-code-block";

// 正文主文本颜色在标题、段落和元信息组件之间复用。
export const articleTextColor = "text-zinc-900/90 dark:text-neutral-100/90";
const articleMutedColor = "text-zinc-600/90 dark:text-neutral-300/90";

// 生成标题锚点 id，必须与 writing-data 中目录生成逻辑保持一致。
function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

// 从 React children 中递归提取纯文本，供标题 id 和代码块内容使用。
function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
}

// 从 code 标签 className 中提取语言名，例如 language-ts 得到 ts。
function getCodeLanguage(className?: string) {
  return className?.match(/language-(\w+)/)?.[1];
}

// articleMdxComponents 传给 MDXRemote，用于替换默认 Markdown 标签输出。
export const articleMdxComponents = {
  // pre 包裹代码块；识别内部 code 子节点后交给自定义代码块组件渲染。
  pre: (props: React.ComponentPropsWithoutRef<"pre">) => {
    const child = props.children;

    if (typeof child === "object" && child && "props" in child) {
      const codeProps = child.props as { children?: React.ReactNode; className?: string };
      const code = getTextContent(codeProps.children);

      return <ArticleCodeBlock code={code} language={getCodeLanguage(codeProps.className)} />;
    }

    return <pre {...props} />;
  },
  // h1/h2/h3 都写入可跳转 id，并设置滚动定位间距，支撑目录锚点体验。
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
  // 段落、列表、引用、链接和行内代码分别覆盖排版、颜色和交互细节。
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className={`break-words font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] ${articleTextColor}`} {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`list-disc space-y-1.5 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] marker:text-zinc-300 dark:marker:text-neutral-600 ${articleTextColor}`} {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className={`list-decimal space-y-1.5 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] marker:text-zinc-400 dark:marker:text-neutral-500 ${articleTextColor}`} {...props} />,
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="pl-1 [&>figure]:my-4 [&>p]:my-0" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => <blockquote className={`border-l-2 border-zinc-300 pl-5 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.75] ${articleMutedColor} dark:border-neutral-700`} {...props} />,
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="break-words font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition hover:decoration-zinc-950 dark:text-neutral-50 dark:decoration-neutral-600 dark:hover:decoration-neutral-50" {...props} />,
  code: (props: React.ComponentPropsWithoutRef<"code">) => <code className="break-words rounded-md bg-zinc-100 px-1.5 py-0.5 text-[0.88em] text-zinc-800 dark:bg-white/10 dark:text-neutral-100" {...props} />,
  img: ({ alt = "", ...props }: React.ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} className="my-6 h-auto max-w-full rounded-2xl border border-zinc-200/80 shadow-sm dark:border-white/10" {...props} />
  ),
  table: (props: React.ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto rounded-2xl border border-zinc-200/80 dark:border-white/10">
      <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-white/10" {...props} />
    </div>
  ),
  th: (props: React.ComponentPropsWithoutRef<"th">) => <th className="whitespace-nowrap bg-zinc-50 px-4 py-3 font-semibold text-zinc-900 dark:bg-white/5 dark:text-neutral-100" {...props} />,
  td: (props: React.ComponentPropsWithoutRef<"td">) => <td className="break-words px-4 py-3 text-zinc-700 dark:text-neutral-300" {...props} />,
};
