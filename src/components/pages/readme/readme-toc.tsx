"use client";

import { createPortal } from "react-dom";
import type { RefObject } from "react";

import { readmeTocItems } from "./readme-data";

type ReadmeTocProps = {
  activeId: string;
  tocLeft: number | null;
  tocOffset: number;
  tocRef: RefObject<HTMLDivElement | null>;
};

export function ReadmeToc({ activeId, tocLeft, tocOffset, tocRef }: ReadmeTocProps) {
  return createPortal(
    <div ref={tocRef} className={`fixed top-[190px] z-50 hidden transition-[opacity,transform] duration-200 ease-out lg:block ${tocLeft === null ? "opacity-0" : "opacity-100"}`} style={{ left: tocLeft ?? 0, transform: `translateY(-${tocOffset}px)` }}>
      <nav className="space-y-2 border-l border-zinc-200 pl-4 text-sm dark:border-white/10" aria-label="自述目录">
        {readmeTocItems.map((item) => {
          const isActive = activeId === item.href.slice(1);

          return (
            <a key={item.href} href={item.href} className={`block transition hover:text-zinc-950 dark:hover:text-neutral-50 ${isActive ? "border-l-2 border-sky-400 -ml-[17px] pl-[15px] font-medium text-zinc-950 dark:text-neutral-50" : "text-zinc-400 dark:text-neutral-500"}`}>
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>,
    document.body,
  );
}
