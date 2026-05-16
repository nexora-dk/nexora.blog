import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { AdminContentPanel } from "./admin-content-panel";
import { AdminPageHeader } from "./admin-page-header";

type AdminEmptyPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
};

export function AdminEmptyPage({ title, description, icon, actionLabel = "新增" }: AdminEmptyPageProps) {
  return (
    <div className="space-y-8">
      <AdminPageHeader title={title} description={description} icon={icon} />
      <AdminContentPanel className="min-h-[62vh] p-8 sm:p-10">
        <div className="flex h-full min-h-[52vh] flex-col items-center justify-center text-center">
          <div className="grid size-16 place-items-center rounded-[1.4rem] border border-neutral-200/70 bg-white/80 text-neutral-500 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-400">
            <Plus className="size-6" />
          </div>
          <h2 className="mt-5 text-xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">
            {title}管理静态页
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            这里先保留静态管理界面占位，后续再接入真实列表、搜索和操作能力。
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-neutral-950/15 transition hover:-translate-y-0.5 dark:bg-neutral-100 dark:text-neutral-950"
          >
            <Plus className="size-4" />
            {actionLabel}
          </button>
        </div>
      </AdminContentPanel>
    </div>
  );
}
