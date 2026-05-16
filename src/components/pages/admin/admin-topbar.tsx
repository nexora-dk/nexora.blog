"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function AdminTopbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      setTime(formatTime(new Date()));
    }

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000 * 30);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center justify-end gap-3">
      <div className="rounded-full border border-neutral-200/70 bg-white/70 p-1 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
        <ThemeToggle />
      </div>
      <div className="inline-flex h-11 min-w-24 items-center gap-2 rounded-full border border-neutral-200/70 bg-white/70 px-4 text-sm font-medium text-neutral-500 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-300">
        <Clock3 className="size-4 text-neutral-400" />
        {time || "--:--"}
      </div>
    </div>
  );
}
