"use client";

// Client Component：首行必须保留 use client；阅读面板依赖 DOM、滚动事件和字号按钮状态。
import { useEffect, useState } from "react";
import type { NoteTocItem } from "./notes-data";

// 阅读面板接收目录项，用于侧栏目录高亮。
type NoteReadingPanelProps = {
  items: NoteTocItem[];
};

// 字形选项定义了正文容器上的 CSS 变量值，不改变实际 MDX 内容。
const typographyOptions = [
  { label: "A", name: "紧凑", fontSize: "15px", lineHeight: "1.82" },
  { label: "A", name: "舒适", fontSize: "16px", lineHeight: "1.95" },
  { label: "A", name: "宽松", fontSize: "17px", lineHeight: "2.08" },
];

// 阅读辅助面板：展示目录、全页进度和字形选择控件。
export function NoteReadingPanel({ items }: NoteReadingPanelProps) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);
  const [typographyIndex, setTypographyIndex] = useState(1);

  useEffect(() => {
    const option = typographyOptions[typographyIndex];
    const element = document.getElementById("note-paper-content");

    // 正文容器不存在时跳过设置，避免客户端首轮渲染访问空 DOM。
    if (!element) {
      return;
    }

    element.style.setProperty("--note-font-size", option.fontSize);
    element.style.setProperty("--note-line-height", option.lineHeight);
  }, [typographyIndex]);

  useEffect(() => {
    function updateReadingState() {
      // 进度按整个文档可滚动高度计算，与右侧目录的文章纸张进度不同。
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollableHeight > 0 ? Math.min(100, Math.max(0, Math.round((window.scrollY / scrollableHeight) * 100))) : 0;
      setProgress(nextProgress);

      // 没有目录项时只更新进度，不做标题高亮计算。
      if (items.length === 0) {
        return;
      }

      const nextActiveId = items.reduce((currentId, item) => {
        const element = document.getElementById(item.id);

        if (!element) {
          return currentId;
        }

        return element.getBoundingClientRect().top <= 140 ? item.id : currentId;
      }, items[0].id);

      setActiveId(nextActiveId);
    }

    updateReadingState();
    window.addEventListener("scroll", updateReadingState, { passive: true });
    window.addEventListener("resize", updateReadingState);

    return () => {
      window.removeEventListener("scroll", updateReadingState);
      window.removeEventListener("resize", updateReadingState);
    };
  }, [items]);

  return (
    <aside className="sticky top-32 hidden self-start xl:block">
      <div className="space-y-6 font-[ui-sans-serif,system-ui,sans-serif] text-sm text-[#938a7f] dark:text-neutral-500">
        {/* 有目录时才渲染目录区；没有标题的手记仍保留进度和字形控件。 */}
        {items.length > 0 ? (
          <nav className="border-l border-[#eadfce] pl-4 dark:border-white/10" aria-label="手记目录">
            <div className="mb-3 text-[11px] font-medium tracking-[0.2em] text-[#a3459e] dark:text-violet-200/80">目录</div>
            <div className="space-y-1.5">
              {/* 循环输出目录锚点，activeId 决定当前标题的强调样式。 */}
              {items.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <a key={item.id} href={`#${item.id}`} title={item.title} aria-current={isActive ? "true" : undefined} className={`relative block py-0.5 leading-5 transition-colors hover:text-[#a3459e] dark:hover:text-violet-100 ${item.level === 3 ? "pl-4 text-xs" : "font-medium"} ${isActive ? "-ml-[17px] border-l-2 border-[#a3459e] pl-[15px] text-[#a3459e] dark:border-violet-200 dark:text-violet-100" : "text-[#9d9489] dark:text-neutral-500"}`}>
                    {item.level === 3 ? <span className="absolute left-1 top-1/2 size-1 -translate-y-1/2 rounded-full bg-[#d6bdd6] dark:bg-violet-300/35" /> : null}
                    <span className="line-clamp-2">{item.title}</span>
                  </a>
                );
              })}
            </div>
          </nav>
        ) : null}

        {/* 阅读进度条根据 progress 百分比设置内部条宽度。 */}
        <div className="space-y-3 border-l border-[#eadfce] pl-4 dark:border-white/10">
          <div className="text-[11px] font-medium tracking-[0.2em] text-[#a3459e] dark:text-violet-200/80">进度</div>
          <div className="flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eadfce] dark:bg-white/10">
              <div className="h-full rounded-full bg-[#a3459e] transition-[width] dark:bg-violet-200" style={{ width: `${progress}%` }} />
            </div>
            <span className="w-9 tabular-nums text-[#6d6258] dark:text-neutral-300">{progress}%</span>
          </div>
        </div>

        {/* 字形选择循环渲染三个按钮，点击后切换正文 CSS 变量。 */}
        <div className="space-y-3 border-l border-[#eadfce] pl-4 dark:border-white/10">
          <div className="text-[11px] font-medium tracking-[0.2em] text-[#a3459e] dark:text-violet-200/80">字形选择</div>
          <div className="flex items-center gap-2">
            {typographyOptions.map((option, index) => {
              const isActive = typographyIndex === index;

              return (
                <button key={option.name} type="button" onClick={() => setTypographyIndex(index)} aria-pressed={isActive} className={`grid size-9 place-items-center rounded-full border text-sm transition ${isActive ? "border-[#a3459e] bg-[#a3459e] text-white shadow-[0_8px_20px_rgba(126,50,132,0.2)] dark:border-violet-200 dark:bg-violet-200 dark:text-neutral-950" : "border-[#eadfce] bg-[#fffaf4] text-[#9d9489] hover:border-[#cda4cc] hover:text-[#a3459e] dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-500 dark:hover:border-violet-200/50 dark:hover:text-violet-100"}`} title={option.name}>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
