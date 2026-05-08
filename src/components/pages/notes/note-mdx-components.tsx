export const noteHeadingColor = "text-[#151d31] dark:text-neutral-50";
export const noteTextColor = "text-[#473d35] dark:text-neutral-100/90";

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

export const noteMdxComponents = {
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
    <h1 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-6 text-[2rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-7 font-[ui-sans-serif,system-ui,sans-serif] text-[21px] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-2 font-[ui-sans-serif,system-ui,sans-serif] text-[1.28rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h3>
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`list-disc space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#d4d4d8] ${noteTextColor}`} {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className={`list-decimal space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#a1a1aa] ${noteTextColor}`} {...props} />,
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="pl-1 [&>p]:my-0 [&>p]:[text-indent:0]" {...props} />,
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => <blockquote className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="font-medium text-[#18181b] underline decoration-[#d4d4d8] underline-offset-4 transition hover:text-[#27272a] hover:decoration-[#a1a1aa] dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:text-white" {...props} />,
  code: (props: React.ComponentPropsWithoutRef<"code">) => <code className="rounded-md bg-[#f2e7dd] px-1.5 py-0.5 text-[0.88em] text-[#5f3f2c] dark:bg-white/10 dark:text-neutral-100" {...props} />,
};
