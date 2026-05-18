"use client";

// Client hook：需要读取 document、监听滚动和计算 DOM 尺寸，因此必须保留 use client 在第一行。
import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

import { initialReadmeSectionId, readmeTocItems } from "./readme-data";

// subscribeToClientReady 用于 useSyncExternalStore，挂载后立即触发一次客户端状态更新。
function subscribeToClientReady(onStoreChange: () => void) {
  onStoreChange();
  return () => {};
}

// getClientSnapshot 在浏览器中返回是否存在 document，用来判断 Portal 是否可安全渲染。
function getClientSnapshot() {
  return typeof document !== "undefined";
}

// getServerSnapshot 固定返回 false，避免服务端渲染阶段访问浏览器对象。
function getServerSnapshot() {
  return false;
}

// useReadmeToc 负责计算自述目录的客户端可用状态、当前高亮章节和固定定位偏移。
export function useReadmeToc(containerRef: RefObject<HTMLDivElement | null>, tocRef: RefObject<HTMLDivElement | null>) {
  // isClient 用于让调用方只在浏览器端渲染依赖 document.body 的目录 Portal。
  const isClient = useSyncExternalStore(subscribeToClientReady, getClientSnapshot, getServerSnapshot);
  // activeId 记录当前滚动位置对应的正文 section id。
  const [activeId, setActiveId] = useState(initialReadmeSectionId);
  // tocLeft 记录目录固定定位的 left 坐标，null 时让目录保持透明。
  const [tocLeft, setTocLeft] = useState<number | null>(null);
  // tocOffset 记录目录纵向上移距离，用于避开指定区块和容器底部。
  const [tocOffset, setTocOffset] = useState(0);
  // progress 记录当前自述正文的阅读进度百分比。
  const [progress, setProgress] = useState(0);

  // 监听滚动和窗口尺寸变化，实时更新目录高亮与位置。
  useEffect(() => {
    function updateActiveSection() {
      // 遍历目录项，选出顶部已经越过阈值的最后一个 section 作为当前高亮。
      const currentSection = readmeTocItems.reduce((current, item) => {
        const section = document.getElementById(item.href.slice(1));

        if (!section) {
          return current;
        }

        return section.getBoundingClientRect().top <= 180 ? item.href.slice(1) : current;
      }, initialReadmeSectionId);
      const container = containerRef.current;
      const toc = tocRef.current;

      setActiveId(currentSection);

      // 当容器和目录 DOM 都可用时，计算目录的横向位置和避免溢出的纵向偏移。
      if (container && toc) {
        const containerRect = container.getBoundingClientRect();
        const tocHeight = toc.offsetHeight;
        const statusSection = document.getElementById("status");
        const fixedTop = 220;
        const statusTop = statusSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        const statusOverflow = fixedTop - statusTop;
        const bottomOverflow = fixedTop + tocHeight - containerRect.bottom;
        const containerTop = window.scrollY + containerRect.top;
        const readableDistance = Math.max(1, container.offsetHeight - window.innerHeight);
        const readableProgress = ((window.scrollY - containerTop) / readableDistance) * 100;

        setTocLeft(Math.min(window.innerWidth - 160, containerRect.right + 32));
        setTocOffset(Math.max(0, statusOverflow, bottomOverflow));
        setProgress(Math.min(100, Math.max(0, Math.round(readableProgress))));
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [containerRef, tocRef]);

  // 返回目录组件渲染所需的全部派生状态。
  return { isClient, activeId, tocLeft, tocOffset, progress };
}
