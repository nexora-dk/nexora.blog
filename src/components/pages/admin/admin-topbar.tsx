import { Clock3 } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function AdminTopbar() {
  return (
    <div className="flex items-center justify-end gap-3">
      <div className="rounded-full border border-neutral-200/70 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
        <ThemeToggle />
      </div>
      <div className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
        <Clock3 className="size-4 text-neutral-400" />
        23:30
      </div>
    </div>
  );
}
