"use client";

// Client Component：首行必须保留 use client；目录高亮和阅读进度依赖滚动监听。
import { useEffect, useState } from "react";
import { RotateCw } from "lucide-react";
import type { NoteTocItem } from "./notes-data";

// 目录接收从 Markdown 二、三级标题解析出的条目。
type NoteTocProps = {
  items: NoteTocItem[];
};

// 桌面侧边目录：根据滚动位置高亮当前标题，并显示文章内阅读进度。
export function NoteToc({ items }: NoteTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 没有标题时不注册滚动监听，组件后续也会条件渲染为空。
    if (items.length === 0) {
      return;
    }

    function updateTocState() {
      // 按目录顺序寻找最后一个越过阈值的标题，作为当前阅读位置。
      const nextActiveId = items.reduce((currentId, item) => {
        const element = document.getElementById(item.id);

        if (!element) {
          return currentId;
        }

        return element.getBoundingClientRect().top <= 128 ? item.id : currentId;
      }, items[0].id);
      const paperElement = document.getElementById("note-paper");

      // 如果纸张容器不存在，仍更新当前标题，但进度回到 0。
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

  // 没有目录数据时不渲染 aside，避免空导航出现在页面上。
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="absolute bottom-0 left-[calc(100%+2.5rem)] top-0 hidden w-[13rem] min-w-0 xl:block">
      <nav className="sticky top-32 border-l border-zinc-200/80 pl-4 font-[ui-sans-serif,system-ui,sans-serif] text-xs dark:border-white/10" aria-label="手记目录">
        {/* 目录标题区作为侧栏识别，不参与跳转。 */}
        <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-zinc-300 dark:text-neutral-600">
          <span className="h-px w-4 bg-zinc-200 dark:bg-white/10" />
          目录
        </div>
        <div className="space-y-1">
          {/* 循环渲染目录项，三级标题额外缩进并显示小圆点。 */}
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

        {/* 阅读进度区与目录分隔，显示当前纸张阅读百分比。 */}
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
