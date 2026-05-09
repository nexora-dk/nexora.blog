"use client";

// Client Component：需要持有 DOM ref，并根据客户端滚动状态渲染目录。
import { useRef } from "react";

import { ReadmeSections } from "./readme-sections";
import { ReadmeToc } from "./readme-toc";
import { useReadmeToc } from "./use-readme-toc";

// ReadmeContent 是自述页面的顶层内容组件，负责组合正文、占位栏和悬浮目录。
export function ReadmeContent() {
  // containerRef 指向整体内容容器，供目录 hook 计算右侧定位边界。
  const containerRef = useRef<HTMLDivElement>(null);
  // tocRef 指向 Portal 中的目录 DOM，供 hook 读取目录高度。
  const tocRef = useRef<HTMLDivElement>(null);
  // useReadmeToc 统一计算目录是否可渲染、当前高亮章节和位置偏移。
  const { isClient, activeId, tocLeft, tocOffset } = useReadmeToc(containerRef, tocRef);

  return (
    <div ref={containerRef} className="relative mx-auto grid max-w-6xl gap-16 py-12 lg:grid-cols-[minmax(0,1fr)_8rem] lg:items-start">
      {/* 背景装饰字不参与交互，用 pointer-events-none 避免影响页面操作。 */}
      <div className="pointer-events-none absolute -top-8 left-4 -z-10 font-[family-name:var(--font-dingtalk)] text-8xl font-black tracking-tighter text-zinc-100 dark:text-white/[0.035] md:text-9xl">
        Bio
      </div>

      {/* 正文区包含所有与目录锚点对应的 section。 */}
      <ReadmeSections />
      {/* 桌面布局右侧占位列，用来给 Portal 悬浮目录预留视觉空间。 */}
      <aside className="hidden lg:block" />
      {/* 条件渲染目录：只在客户端可用后渲染，避免服务端访问 document.body。 */}
      {isClient ? <ReadmeToc activeId={activeId} tocLeft={tocLeft} tocOffset={tocOffset} tocRef={tocRef} /> : null}
    </div>
  );
}
