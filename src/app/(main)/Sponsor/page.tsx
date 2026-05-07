import { PageShell } from "@/components/ui/page-shell";

export default function SponsorPage() {
  return (
    <PageShell title="赞助" description="谢谢你请我喝咖啡">
      <div className="rounded-3xl border border-zinc-200/70 bg-white/65 px-6 py-8 text-zinc-600 shadow-sm shadow-zinc-950/[0.03] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:text-neutral-300">
        <p className="text-lg font-semibold text-zinc-950 dark:text-neutral-50">此功能还在积极开发中</p>
        <p className="mt-3 text-sm font-medium leading-7">赞助入口会在准备完善后开放，感谢你的关注与支持。</p>
      </div>
    </PageShell>
  );
}
