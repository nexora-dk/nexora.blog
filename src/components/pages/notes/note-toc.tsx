"use client";

import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import type { NoteTocItem } from "./notes-data";

type NoteTocProps = {
  items: NoteTocItem[];
};

export function NoteToc({ items }: NoteTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    function updateTocState() {
      const nextActiveId = items.reduce((currentId, item) => {
        const element = document.getElementById(item.id);

        if (!element) {
          return currentId;
        }

        return element.getBoundingClientRect().top <= 128 ? item.id : currentId;
      }, items[0].id);
      const paperElement = document.getElementById("note-paper");

      if (!paperElement) {
        setActiveId(nextActiveId);
        setProgress(0);
        return;
      }

      const readingOffset = 128;
      const paperTop = paperElement.getBoundingClientRect().top + window.scrollY;
      const readableHeight = Math.max(1, paperElement.offsetHeight - readingOffset);
      const nextProgress = Math.min(100, Math.max(0, ((window.scrollY + readingOffset - paperTop) / readableHeight) * 100));

      setActiveId(nextActiveId);
      setProgress(Math.round(nextProgress));
    }

    updateTocState();
    window.addEventListener("scroll", updateTocState, { passive: true });
    window.addEventListener("resize", updateTocState);

    return () => {
      window.removeEventListener("scroll", updateTocState);
      window.removeEventListener("resize", updateTocState);
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-32 w-52 self-start">
      <nav className="border-l border-zinc-200/80 pl-4 font-[ui-sans-serif,system-ui,sans-serif] text-xs dark:border-white/10" aria-label="手记目录">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-zinc-300 dark:text-neutral-600">
          <span className="h-px w-4 bg-zinc-200 dark:bg-white/10" />
          目录
        </div>
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <a key={item.id} href={`#${item.id}`} aria-current={isActive ? "true" : undefined} title={item.title} className={`relative block py-0.5 leading-4 transition-colors hover:text-zinc-800 dark:hover:text-neutral-200 ${item.level === 3 ? "pl-4 text-[11px]" : "font-medium"} ${isActive ? "-ml-[17px] border-l-2 border-zinc-900 pl-[15px] text-zinc-900 dark:border-neutral-100 dark:text-neutral-100" : "text-zinc-400 dark:text-neutral-500"}`}>
                {item.level === 3 ? <span className="absolute left-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-neutral-700" /> : null}
                <span className="line-clamp-2">{item.title}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-5 border-t border-zinc-200/80 pt-4 text-zinc-500 dark:border-white/10 dark:text-neutral-400">
          <div className="mb-4 h-px bg-zinc-100 dark:bg-white/[0.06]" />
          <div className="flex items-center gap-2 text-sm font-medium tabular-nums">
            <RotateCw className="size-3.5 text-[#18181b] dark:text-[#f4f4f5]" />
            <span>{progress}%</span>
          </div>
        </div>
      </nav>
    </aside>
  );
}
