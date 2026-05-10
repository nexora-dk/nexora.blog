// 共享正文标题和文本颜色，供 MDX 映射与详情头部复用。
export const noteHeadingColor = "text-[#151d31] dark:text-neutral-50";
const noteTextColor = "text-[#473d35] dark:text-neutral-100/90";

// 将标题文本转换为稳定 id，便于目录链接和滚动定位。
function slugifyHeading(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

// 从 React children 中提取纯文本，标题包含多个文本节点时也能生成同一个锚点。
function getTextContent(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join("");
  }

  return "";
}

// MDX 组件映射：统一手记正文里的标题、段落、列表、引用、链接和行内代码样式。
export const noteMdxComponents = {
  // 一级标题也生成锚点，兼容 MDX 内容中出现 h1 的情况。
  h1: ({ children, ...props }: React.ComponentPropsWithoutRef<"h1">) => (
    <h1 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-6 text-[2rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h1>
  ),
  // 二级标题是目录提取的主要层级，id 规则需与 notes-data 中的 toc 生成保持一致。
  h2: ({ children, ...props }: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-7 font-[ui-sans-serif,system-ui,sans-serif] text-[21px] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h2>
  ),
  // 三级标题用于目录缩进层级，滚动偏移与二级标题一致。
  h3: ({ children, ...props }: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 id={slugifyHeading(getTextContent(children))} className={`scroll-mt-28 pt-2 font-[ui-sans-serif,system-ui,sans-serif] text-[1.28rem] font-semibold leading-tight tracking-normal ${noteHeadingColor}`} {...props}>
      {children}
    </h3>
  ),
  // 段落使用正文色、缩进和固定行高，是手记阅读体验的基础样式。
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  // 无序列表保留项目符号，并沿用正文排版节奏。
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className={`list-disc space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#d4d4d8] ${noteTextColor}`} {...props} />,
  // 有序列表使用数字标记，用于步骤、阶段总结等结构化内容。
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className={`list-decimal space-y-2 pl-6 font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] marker:text-[#a1a1aa] ${noteTextColor}`} {...props} />,
  // 列表项消除内部段落缩进，避免列表文本被二次缩进。
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="pl-1 [&>p]:my-0 [&>p]:[text-indent:0]" {...props} />,
  // 引用块延续正文语气样式，目前只负责文字排版而不额外包卡片。
  blockquote: (props: React.ComponentPropsWithoutRef<"blockquote">) => <blockquote className={`font-[ui-sans-serif,system-ui,sans-serif] text-[15px] font-normal leading-[1.85] [text-indent:2em] ${noteTextColor}`} {...props} />,
  // 链接保持正文内联形态，用下划线和 hover 状态提示可点击。
  a: (props: React.ComponentPropsWithoutRef<"a">) => <a className="font-medium text-[#18181b] underline decoration-[#d4d4d8] underline-offset-4 transition hover:text-[#27272a] hover:decoration-[#a1a1aa] dark:text-neutral-100 dark:decoration-neutral-600 dark:hover:text-white" {...props} />,
  // 行内代码使用轻量背景强调，不改变 MDX 中的实际代码文本。
  code: (props: React.ComponentPropsWithoutRef<"code">) => <code className="rounded-md bg-[#f2e7dd] px-1.5 py-0.5 text-[0.88em] text-[#5f3f2c] dark:bg-white/10 dark:text-neutral-100" {...props} />,
};
