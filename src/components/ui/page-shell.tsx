// 通用页面壳组件的参数，供普通页面、分类页和详情页复用统一布局。
type PageShellProps = {
  // 页面主标题，通常显示为中文标题，也会参与 eyebrow 推导。
  title: string;
  // 页面描述，显示在标题下方或仅用于传递页面语义。
  description: string;
  // 页面主体内容，由具体页面传入。
  children?: React.ReactNode;
  // 是否隐藏默认页头，适合详情页或自定义首屏组件。
  hideHeader?: boolean;
  // 自定义英文眉标；未传时会根据 title 自动推导。
  eyebrow?: string;
};

// 中文页面标题到英文眉标的映射，用于统一页面头部的英文小标题。
const titleEyebrows: Record<string, string> = {
  关于: "About",
  收藏夹: "Collection",
  友链: "Friends",
  留言: "Comments",
  迭代: "Iteration",
  相册: "Gallery",
  项目: "Projects",
  此站点: "Site",
  赞助: "Sponsor",
  思考: "Thinking",
  文稿: "Writing",
  手记: "Notes",
};

/**
 * 根据页面标题和可选自定义值得到页头眉标。
 */
function getEyebrow(title: string, eyebrow?: string) {
  // 调用方显式传入 eyebrow 时优先使用，方便特殊页面覆盖默认映射。
  if (eyebrow) {
    return eyebrow;
  }

  // 文稿分类页标题以“分类-”开头，统一显示 Category。
  if (title.startsWith("分类-")) {
    return "Category";
  }

  // 手记专栏页标题以“专栏-”开头，统一显示 Column。
  if (title.startsWith("专栏-")) {
    return "Column";
  }

  // 普通页面从映射表中读取英文眉标，未命中时回退到原始标题。
  return titleEyebrows[title] ?? title;
}

/**
 * 通用页面壳：统一页面上下间距、标题区域和主体内容位置。
 */
export function PageShell({ title, description, children, hideHeader, eyebrow }: PageShellProps) {
  return (
    // section 作为页面主容器，统一顶部避开固定导航并保留底部间距。
    <section className="space-y-8 pb-12 pt-28 md:pb-16 md:pt-32">
      {/* hideHeader 为 true 时完全跳过默认页头，让子组件自定义开场区域。 */}
      {hideHeader ? null : (
        // 默认页头包含英文眉标、中文标题和描述文本。
        <div className="space-y-3">
          {/* 英文眉标用于增强页面层级感和视觉节奏。 */}
          <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-neutral-400">{getEyebrow(title, eyebrow)}</p>
          {/* 页面主标题。 */}
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-zinc-950 dark:text-neutral-50 sm:text-5xl">{title}</h1>
          {/* 页面描述限制最大宽度，避免长文案在大屏上过宽。 */}
          <p className="max-w-2xl text-[15px] leading-7 text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
      )}
      {/* 具体页面传入的主体内容。 */}
      {children}
    </section>
  );
}
