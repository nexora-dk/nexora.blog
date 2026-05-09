"use client";

// React hooks 用于监听滚动进度并控制按钮状态。
import { useEffect, useState } from "react";

/**
 * 读取当前页面滚动状态，返回滚动百分比和顶部距离。
 */
function getScrollState() {
  // document.scrollingElement 是当前文档真实滚动容器，兜底使用 documentElement。
  const scrollElement = document.scrollingElement || document.documentElement;
  // 当前已滚动的垂直距离。
  const scrollTop = scrollElement.scrollTop;
  // 可滚动总高度等于内容高度减去视口高度。
  const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;
  // 将滚动距离换算成 0 到 100 的百分比，并在无可滚动空间时回退为 0。
  const progress = scrollHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100)) : 0;

  return {
    // 当前滚动进度百分比。
    progress,
    // 当前滚动距离，用于判断按钮是否需要显示。
    scrollTop,
  };
}

/**
 * 滚动进度按钮：展示阅读进度，并在点击时平滑返回页面顶部。
 */
export function ScrollProgressButton() {
  // progress 用于显示百分比文字和按钮背景填充高度。
  const [progress, setProgress] = useState(0);
  // isVisible 控制按钮在页面顶部附近隐藏，滚动后显示。
  const [isVisible, setIsVisible] = useState(false);
  // isLaunching 控制点击回到顶部时的火箭发射动画。
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    // frameId 用于合并高频 scroll/resize 事件，避免每个事件都立即 setState。
    let frameId: number | null = null;

    /**
     * 真正读取滚动状态并更新 React 状态的函数。
     */
    function updateProgress() {
      // 统一从辅助函数读取滚动百分比和滚动距离。
      const scrollState = getScrollState();

      // 当前 requestAnimationFrame 已执行完毕，允许下一次事件重新排队。
      frameId = null;
      // 百分比取整显示，避免按钮文案频繁出现小数。
      setProgress(Math.round(scrollState.progress));
      // 滚动超过 8px 后再显示按钮，避免页面顶部出现多余控件。
      setIsVisible(scrollState.scrollTop > 8);
    }

    /**
     * 请求一次滚动进度更新；如果已有帧在等待，就不重复排队。
     */
    function requestProgressUpdate() {
      if (frameId !== null) {
        return;
      }

      // 使用 requestAnimationFrame 把 DOM 读取和状态更新对齐到浏览器绘制节奏。
      frameId = window.requestAnimationFrame(updateProgress);
    }

    // 初始化时立即计算一次，保证刷新在页面中段时按钮状态正确。
    requestProgressUpdate();
    // 监听滚动更新进度，passive 避免阻塞滚动。
    window.addEventListener("scroll", requestProgressUpdate, { passive: true });
    // 监听窗口大小变化，因为可滚动高度会随视口尺寸改变。
    window.addEventListener("resize", requestProgressUpdate);

    return () => {
      // 卸载时取消尚未执行的动画帧，避免回调访问已卸载组件。
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      // 移除事件监听，防止内存泄漏和重复绑定。
      window.removeEventListener("scroll", requestProgressUpdate);
      window.removeEventListener("resize", requestProgressUpdate);
    };
  }, []);

  /**
   * 点击按钮后触发火箭动效，并平滑滚动回页面顶部。
   */
  function scrollToTop() {
    // 启动短暂的发射动画状态。
    setIsLaunching(true);
    // 使用浏览器原生平滑滚动回顶部。
    window.scrollTo({ top: 0, behavior: "smooth" });
    // 动画时间结束后关闭发射状态。
    window.setTimeout(() => setIsLaunching(false), 520);
  }

  return (
    // 固定在右下角的浮动按钮容器，根据可见状态切换透明度、位移和指针事件。
    <div className={`group fixed right-6 bottom-6 z-[999] transition-all duration-500 ease-out ${isVisible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
      {/* hover 提示气泡，说明按钮功能是返回顶部。 */}
      <div className="pointer-events-none absolute left-1/2 bottom-[calc(100%+0.7rem)] -translate-x-1/2 translate-y-2 rounded-full border border-zinc-200/80 bg-white/85 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-zinc-600 opacity-0 shadow-lg shadow-zinc-950/10 backdrop-blur-xl transition-all duration-300 ease-out group-hover:-translate-x-1/2 group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-300 dark:shadow-black/30">
        返回顶部
      </div>
      {/* 火箭按钮本体，背景渐变高度随滚动进度变化。 */}
      <button
        type="button"
        aria-label="返回顶部"
        onClick={scrollToTop}
        className={`rocket-button relative grid size-12 place-items-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-800 shadow-[0_12px_30px_rgb(15_23_42/0.12)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1 hover:text-sky-500 hover:shadow-[0_16px_40px_rgb(14_165_233/0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-100 dark:shadow-black/35 dark:hover:text-sky-300 dark:focus-visible:ring-offset-neutral-950 ${isLaunching ? "rocket-launching" : ""}`}
        style={{ backgroundImage: `linear-gradient(to top, rgb(14 165 233 / 0.16) ${progress}%, transparent 0)` }}
      >
        {/* 火箭 SVG 图标，aria-hidden 避免重复朗读，按钮已有 aria-label。 */}
        <svg className="rocket-icon size-7" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          {/* 火箭主体轮廓。 */}
          <path d="M32 5C44 16 47 31 40 46H24C17 31 20 16 32 5Z" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 左侧尾翼。 */}
          <path d="M24 35 14 45v12l10-7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 右侧尾翼。 */}
          <path d="M40 35 50 45v12l-10-7" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 火箭底部喷口。 */}
          <path d="M26 46h12l-2 6h-8Z" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 左侧火焰线条。 */}
          <path d="M28 55 24 62l1-10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 右侧火焰线条。 */}
          <path d="M36 55 40 62l-1-10" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* 火箭舷窗。 */}
          <circle cx="32" cy="24" r="6" stroke="currentColor" strokeWidth="4.5" />
        </svg>
        {/* 进度数字徽标，使用 tabular-nums 保持数字宽度稳定。 */}
        <span className="absolute -bottom-1.5 rounded-full border border-zinc-200 bg-white px-1.5 py-0.5 text-[0.58rem] font-semibold leading-none tabular-nums text-zinc-500 shadow-sm dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-400">{progress}%</span>
      </button>
    </div>
  );
}
