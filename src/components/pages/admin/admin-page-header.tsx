import type { LucideIcon } from "lucide-react";

import { AdminTopbar } from "./admin-topbar";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
};

export function AdminPageHeader({ title, description, icon: Icon }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="grid size-11 place-items-center rounded-2xl border border-neutral-200/70 bg-white/70 text-neutral-950 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-50">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <AdminTopbar />
    </header>
  );
}
