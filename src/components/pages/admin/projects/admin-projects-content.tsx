import { GalleryHorizontalEnd, Plus, Search } from "lucide-react";

import { AdminContentPanel } from "../admin-content-panel";
import { AdminPageHeader } from "../admin-page-header";
import { adminProjectItems } from "./admin-projects-data";
import { AdminProjectsTable } from "./admin-projects-table";

export function AdminProjectsContent() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="项目"
        description="管理站点项目展示、链接、标签和发布状态。"
        icon={GalleryHorizontalEnd}
      />

      <AdminContentPanel className="min-h-[72vh] p-6 sm:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-neutral-50">全部项目</h2>
            <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500 dark:bg-white/10 dark:text-neutral-400">
              {adminProjectItems.length} 个
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-neutral-300" />
              <input
                type="search"
                placeholder="按名称/描述/标签搜索..."
                className="h-12 w-full rounded-2xl border border-neutral-200/70 bg-white/70 pl-11 pr-4 text-sm text-neutral-700 shadow-sm outline-none transition placeholder:text-neutral-300 focus:border-neutral-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-200 dark:placeholder:text-neutral-600 dark:focus:border-white/20"
              />
            </label>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(15,23,42,0.18)] transition hover:-translate-y-0.5 dark:bg-neutral-100 dark:text-neutral-950"
            >
              <Plus className="size-4" />
              新增
            </button>
          </div>
        </div>

        <div className="mt-7">
          <AdminProjectsTable projects={adminProjectItems} />
        </div>
      </AdminContentPanel>
    </div>
  );
}
