"use client";

// Client Component：目录通过 Portal 挂载到 document.body，因此必须保留 use client 在第一行。
import { createPortal } from "react-dom";
import type { RefObject } from "react";

import { readmeTocItems } from "./readme-data";

// ReadmeTocProps 由 useReadmeToc 计算得到，用于控制目录高亮和固定定位。
type ReadmeTocProps = {
  activeId: string;
  progress: number;
  tocLeft: number | null;
  tocOffset: number;
  tocRef: RefObject<HTMLDivElement | null>;
};

// ReadmeToc 负责渲染桌面端悬浮目录，并根据 activeId 标记当前章节。
export function ReadmeToc({ activeId, progress, tocLeft, tocOffset, tocRef }: ReadmeTocProps) {
  return createPortal(
    <div ref={tocRef} className={`fixed top-[220px] z-50 hidden transition-[opacity,transform] duration-200 ease-out lg:block ${tocLeft === null ? "opacity-0" : "opacity-100"}`} style={{ left: tocLeft ?? 0, transform: `translateY(-${tocOffset}px)` }}>
      <div className="space-y-8">
        <nav className="space-y-2 border-l border-zinc-200 pl-4 text-sm dark:border-white/10" aria-label="自述目录">
          {/* 循环渲染目录链接，并根据当前 activeId 切换高亮样式。 */}
          {readmeTocItems.map((item) => {
            const isActive = activeId === item.href.slice(1);

            return (
              <a key={item.href} href={item.href} className={`block transition hover:text-zinc-950 dark:hover:text-neutral-50 ${isActive ? "border-l-2 border-sky-400 -ml-[17px] pl-[15px] font-medium text-zinc-950 dark:text-neutral-50" : "text-zinc-400 dark:text-neutral-500"}`}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="w-28 border-t border-zinc-200 pt-4 dark:border-white/10">
          <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-neutral-500">
            <span>Read</span>
            <span className="tabular-nums">{progress}%</span>
          </div>
          <div className="h-px overflow-hidden rounded-full bg-zinc-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-sky-400 transition-[width] duration-200 dark:bg-sky-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
