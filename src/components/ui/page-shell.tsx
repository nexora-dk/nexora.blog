type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
  eyebrow?: string;
};

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

function getEyebrow(title: string, eyebrow?: string) {
  if (eyebrow) {
    return eyebrow;
  }

  if (title.startsWith("分类-")) {
    return "Category";
  }

  if (title.startsWith("专栏-")) {
    return "Column";
  }

  return titleEyebrows[title] ?? title;
}

export function PageShell({ title, description, children, hideHeader, eyebrow }: PageShellProps) {
  return (
    <section className="space-y-8 pb-12 pt-28 md:pb-16 md:pt-32">
      {hideHeader ? null : (
        <div className="space-y-3">
          <p className="text-[13px] font-medium uppercase tracking-[0.28em] text-zinc-500 dark:text-neutral-400">{getEyebrow(title, eyebrow)}</p>
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-normal text-zinc-950 dark:text-neutral-50 sm:text-5xl">{title}</h1>
          <p className="max-w-2xl text-[15px] leading-7 text-neutral-600 dark:text-neutral-300">{description}</p>
        </div>
      )}
      {children}
    </section>
  );
}
