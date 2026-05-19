type NotePaperProps = {
  children: React.ReactNode;
};

// 纸张容器负责详情页正文的边框、背景、角标和内边距，不关心具体手记内容。
export function NotePaper({ children }: NotePaperProps) {
  return (
    <div className="relative min-w-0">
      <div id="note-paper" className="relative z-10 overflow-hidden rounded-[0.35rem] border border-zinc-200/60 bg-[#fdfcfa]/90 shadow-[0_16px_48px_rgba(82,76,70,0.045)] backdrop-blur dark:border-white/8 dark:bg-[#141414]/94 dark:shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
        {/* 以下绝对定位元素都是阅读纸张的装饰层，不参与内容布局。 */}
        <div className="pointer-events-none absolute inset-2 rounded-[0.25rem] border border-[#eee8df]/70 dark:border-white/[0.035] sm:inset-3" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#d9cfc1]/80 to-transparent dark:via-white/10 sm:inset-x-10" />
        <div className="pointer-events-none absolute left-4 top-4 size-6 border-l border-t border-[#e6ded3] dark:border-white/[0.06] sm:left-6 sm:top-6 sm:size-8" />
        <div className="pointer-events-none absolute right-4 top-4 size-6 border-r border-t border-[#e6ded3] dark:border-white/[0.06] sm:right-6 sm:top-6 sm:size-8" />
        <div className="pointer-events-none absolute bottom-4 left-4 size-6 border-b border-l border-[#e6ded3] dark:border-white/[0.06] sm:bottom-6 sm:left-6 sm:size-8" />
        <div className="pointer-events-none absolute right-4 bottom-4 size-6 border-r border-b border-[#e6ded3] dark:border-white/[0.06] sm:right-6 sm:bottom-6 sm:size-8" />
        <div className="pointer-events-none absolute right-10 top-10 size-1.5 rounded-full bg-emerald-300/45 dark:bg-emerald-300/18" />
        <div className="pointer-events-none absolute bottom-10 left-10 size-1 rounded-full bg-sky-300/45 dark:bg-sky-300/18" />
        {/* 真正的详情页内容插槽，承载标题、正文和互动组件。 */}
        <div className="relative z-10 px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16 md:px-8 md:pb-16 md:pt-20 lg:px-10 xl:px-12">{children}</div>
      </div>
    </div>
  );
}
