import { ArticleCodeBlock } from "./article-code-block";

export const articleTextColor = "text-zinc-900/90 dark:text-neutral-100/90";
const articleMutedColor = "text-zinc-600/90 dark:text-neutral-300/90";

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

function getCodeLanguage(className?: string) {
  return className?.match(/language-(\w+)/)?.[1];
}

export const articleMdxComponents = {
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
