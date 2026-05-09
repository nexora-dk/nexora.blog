// PageShell 提供统一页面标题、描述和主体容器。
import { PageShell } from "@/components/ui/page-shell";

/**
 * 赞助页面：用于未来开放赞助入口，目前展示开发中提示。
 */
export default function SponsorPage() {
  return (
    // 页面壳定义赞助页标题和感谢说明。
    <PageShell title="赞助" description="谢谢你请我喝咖啡">
      {/* 开发中状态卡片，用于在功能未开放前保持页面反馈。 */}
      <div className="rounded-3xl border border-zinc-200/70 bg-white/65 px-6 py-8 text-zinc-600 shadow-sm shadow-zinc-950/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300">
        {/* 状态标题，明确告知赞助功能尚未完成。 */}
        <p className="text-lg font-semibold text-zinc-950 dark:text-neutral-50">此功能还在积极开发中</p>
        {/* 辅助说明，回应用户关注并说明入口开放时机。 */}
        <p className="mt-3 text-sm font-medium leading-7">赞助入口会在准备完善后开放，感谢你的关注与支持。</p>
      </div>
    </PageShell>
  );
}
