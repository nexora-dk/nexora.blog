"use client";

import { useEffect, useState } from "react";
import type { ArticleTocItem } from "./writing-data";

type ArticleTocProps = {
  items: ArticleTocItem[];
};

export function ArticleToc({ items }: ArticleTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    function updateActiveId() {
      const nextActiveId = items.reduce((currentId, item) => {
        const element = document.getElementById(item.id);

        if (!element) {
          return currentId;
        }

        return element.getBoundingClientRect().top <= 128 ? item.id : currentId;
      }, items[0].id);

      setActiveId(nextActiveId);
    }

    updateActiveId();
    window.addEventListener("scroll", updateActiveId, { passive: true });
    window.addEventListener("resize", updateActiveId);

    return () => {
      window.removeEventListener("scroll", updateActiveId);
      window.removeEventListener("resize", updateActiveId);
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-32 ml-12 hidden w-52 self-start xl:block 2xl:ml-16">
      <nav className="space-y-2 border-l border-zinc-200 pl-4 font-[ui-sans-serif,system-ui,sans-serif] text-xs dark:border-white/10" aria-label="文章目录">
        {items.map((item) => {
          const isActive = activeId === item.id;

          return (
            <a key={item.id} href={`#${item.id}`} aria-current={isActive ? "true" : undefined} className={`block leading-5 transition hover:text-zinc-900 dark:hover:text-neutral-100 ${item.level === 3 ? "pl-3 text-[11px]" : "font-medium"} ${isActive ? "-ml-[17px] border-l-2 border-zinc-900 pl-[15px] text-zinc-900 dark:border-neutral-100 dark:text-neutral-100" : "text-zinc-400 dark:text-neutral-500"}`}>
              {item.title}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
