type PageShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
  hideHeader?: boolean;
};

export function PageShell({ title, description, children, hideHeader }: PageShellProps) {
  return (
    <section className="space-y-8 pb-12 pt-28 md:pb-16 md:pt-32">
      {hideHeader ? null : (
        <div className="space-y-3">
          <h1 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-neutral-600 md:text-lg dark:text-neutral-300">{description}</p>
        </div>
      )}
      {children}
    </section>
  );
}
