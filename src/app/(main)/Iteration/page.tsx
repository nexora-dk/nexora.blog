// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 迭代页面：用于记录博客项目后续版本、优化和功能更新。
 */
export default function IterationPage() {
  return (
    // 页面壳定义迭代页标题和说明。
    <PageShell title="迭代" description="关于项目的迭代记录">
      {/* 当前为空状态卡片，用于在尚无迭代记录时保持页面完整。 */}
      <div className="rounded-3xl border border-zinc-200/70 bg-white/65 px-6 py-8 text-zinc-600 shadow-sm shadow-zinc-950/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300">
        {/* 空状态标题，提示暂时没有可展示内容。 */}
        <p className="text-lg font-semibold text-zinc-950 dark:text-neutral-50">暂无迭代内容</p>
        {/* 空状态说明，告诉用户后续更新记录会放在这里。 */}
        <p className="mt-3 text-sm font-medium leading-7">这是我的第一版博客，后续的更新、优化和功能记录会整理在这里。</p>
      </div>
    </PageShell>
  );
}
