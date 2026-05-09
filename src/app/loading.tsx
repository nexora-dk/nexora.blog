/**
 * 全局路由加载态：当 App Router 正在切换或等待页面数据时展示简短提示。
 */
export default function Loading() {
  return (
    // 使用居中容器保持加载文案与站点主体宽度一致，并兼容亮色/暗色主题文本颜色。
    <div className="mx-auto flex min-h-screen max-w-5xl items-center px-5 text-sm text-neutral-500 dark:text-neutral-400">
      正在加载…
    </div>
  );
}
