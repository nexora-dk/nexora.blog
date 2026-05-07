import { PageShell } from "@/components/ui/page-shell";

export default function IterationPage() {
  return (
    <PageShell title="迭代" description="关于项目的迭代记录">
      <div className="rounded-3xl border border-zinc-200/70 bg-white/65 px-6 py-8 text-zinc-600 shadow-sm shadow-zinc-950/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300">
        <p className="text-lg font-semibold text-zinc-950 dark:text-neutral-50">暂无迭代内容</p>
        <p className="mt-3 text-sm font-medium leading-7">这是我的第一版博客，后续的更新、优化和功能记录会整理在这里。</p>
      </div>
    </PageShell>
  );
}
