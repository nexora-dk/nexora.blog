"use client";

// 客户端目录组件负责根据滚动位置高亮当前阅读到的二/三级标题。
import { useEffect, useState } from "react";
import type { ArticleTocItem } from "./writing-data";

// items 来自文章内容解析出的目录数据，每项包含 id、标题文本和标题层级。
type ArticleTocProps = {
  items: ArticleTocItem[];
};

// ArticleToc 需要访问 window 和 document，因此保持为 Client Component。
export function ArticleToc({ items }: ArticleTocProps) {
  // activeId 表示当前视口中最近经过顶部阈值的标题，初始取第一项。
  const [activeId, setActiveId] = useState(items[0]?.id);

  // 监听滚动和窗口尺寸变化，动态计算目录高亮项。
  useEffect(() => {
    // 没有目录项时不绑定任何浏览器事件。
    if (items.length === 0) {
      return;
    }

    let frameId = 0;

    // 逐项读取真实 DOM 位置，找到最后一个 top 小于阈值的标题。
    function updateActiveId() {
      frameId = 0;
      const scrollAnchor = window.scrollY + 128;
      const nextActiveId = items.reduce((currentId, item) => {
        const element = document.getElementById(item.id);

        // 文章中找不到对应标题节点时保留当前高亮结果。
        if (!element) {
          return currentId;
        }

        const headingTop = element.getBoundingClientRect().top + window.scrollY;

        return headingTop <= scrollAnchor ? item.id : currentId;
      }, items[0].id);

      setActiveId(nextActiveId);
    }

    function scheduleUpdateActiveId() {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateActiveId);
    }

    // 首次挂载立即同步一次，随后通过 scroll/resize 保持高亮状态准确。
    scheduleUpdateActiveId();
    window.addEventListener("scroll", scheduleUpdateActiveId, { passive: true });
    window.addEventListener("resize", scheduleUpdateActiveId);

    // 清理事件监听，避免组件卸载后继续触发状态更新。
    return () => {
      window.removeEventListener("scroll", scheduleUpdateActiveId);
      window.removeEventListener("resize", scheduleUpdateActiveId);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [items]);

  // 没有二/三级标题时不渲染目录区域。
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="absolute bottom-0 left-[calc(100%+2.5rem)] top-0 hidden w-[13rem] min-w-0 xl:block">
      {/* nav 提供文章目录语义，桌面宽度下吸附在正文右侧。 */}
      <nav className="sticky top-32 border-l border-zinc-200/80 pl-4 font-[ui-sans-serif,system-ui,sans-serif] text-xs dark:border-white/10" aria-label="文章目录">
        {/* 目录标题行用于标识右侧导航区域。 */}
        <div className="mb-2 flex items-center gap-2 text-[10px] font-medium tracking-[0.18em] text-zinc-300 dark:text-neutral-600">
          <span className="h-px w-4 bg-zinc-200 dark:bg-white/10" />
          目录
        </div>
        <div className="space-y-1">
          {/* 循环目录项生成锚点链接，并根据 activeId 设置当前项样式。 */}
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <a key={item.id} href={`#${item.id}`} aria-current={isActive ? "true" : undefined} title={item.title} className={`relative block py-0.5 leading-4 transition-colors hover:text-zinc-800 dark:hover:text-neutral-200 ${item.level === 3 ? "pl-4 text-[11px]" : "font-medium"} ${isActive ? "-ml-[17px] border-l-2 border-zinc-900 pl-[15px] text-zinc-900 dark:border-neutral-100 dark:text-neutral-100" : "text-zinc-400 dark:text-neutral-500"}`}>
                {/* 三级标题增加小圆点，帮助和二级标题形成视觉层级。 */}
                {item.level === 3 ? <span className="absolute left-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-zinc-200 dark:bg-neutral-700" /> : null}
                <span className="line-clamp-2">{item.title}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
