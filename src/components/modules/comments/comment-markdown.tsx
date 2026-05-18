import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type CommentMarkdownProps = {
  content: string;
};

function getSafeHref(href: string | undefined) {
  if (!href) {
    return undefined;
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return href;
  }

  try {
    const url = new URL(href);

    if (["http:", "https:", "mailto:"].includes(url.protocol)) {
      return href;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function CommentMarkdown({ content }: CommentMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="my-0 break-words">{children}</p>,
        a: ({ children, href }) => {
          const safeHref = getSafeHref(href);

          return (
            <a
              href={safeHref}
              target={
                safeHref?.startsWith("/") || safeHref?.startsWith("#")
                  ? undefined
                  : "_blank"
              }
              rel={
                safeHref?.startsWith("/") || safeHref?.startsWith("#")
                  ? undefined
                  : "noreferrer"
              }
              className="break-all font-semibold !text-blue-600 !underline decoration-blue-400 underline-offset-4 transition hover:!text-blue-500 dark:!text-sky-300 dark:decoration-sky-500/70 dark:hover:!text-sky-200"
            >
              {children}
            </a>
          );
        },

        code: ({ children }) => (
          <code className="break-words rounded-md bg-zinc-100 px-1.5 py-0.5 text-[0.9em] text-zinc-800 dark:bg-white/10 dark:text-neutral-100">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="my-2 overflow-x-auto rounded-xl bg-zinc-950 px-4 py-3 text-sm text-zinc-50 dark:bg-black/60">
            {children}
          </pre>
        ),
        ul: ({ children }) => (
          <ul className="my-2 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="my-2 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-2 border-l-2 border-zinc-300 pl-3 text-zinc-500 dark:border-white/20 dark:text-neutral-400">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
