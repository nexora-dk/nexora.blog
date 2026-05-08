"use client";

import { useRef } from "react";

import { ReadmeSections } from "./readme-sections";
import { ReadmeToc } from "./readme-toc";
import { useReadmeToc } from "./use-readme-toc";

export function ReadmeContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLDivElement>(null);
  const { isClient, activeId, tocLeft, tocOffset } = useReadmeToc(containerRef, tocRef);

  return (
    <div ref={containerRef} className="relative mx-auto grid max-w-6xl gap-16 py-12 lg:grid-cols-[minmax(0,1fr)_8rem] lg:items-start">
      <div className="pointer-events-none absolute -top-8 left-4 -z-10 font-[family-name:var(--font-dingtalk)] text-8xl font-black tracking-tighter text-zinc-100 dark:text-white/[0.035] md:text-9xl">
        Bio
      </div>

      <ReadmeSections />
      <aside className="hidden lg:block" />
      {isClient ? <ReadmeToc activeId={activeId} tocLeft={tocLeft} tocOffset={tocOffset} tocRef={tocRef} /> : null}
    </div>
  );
}
