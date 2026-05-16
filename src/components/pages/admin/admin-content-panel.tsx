type AdminContentPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminContentPanel({ children, className = "" }: AdminContentPanelProps) {
  return (
    <section
      className={`rounded-[2rem] border border-white/75 bg-white/74 shadow-[0_28px_90px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/62 dark:shadow-black/30 ${className}`}
    >
      {children}
    </section>
  );
}
