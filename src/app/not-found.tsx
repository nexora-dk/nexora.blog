// Next.js Link 用于在 404 页面提供无刷新返回首页的导航。
import Link from "next/link";

/**
 * 全站 404 页面：现代极简风，带有网格质感与平滑交互。
 */
export default function NotFound() {
  return (
    // 外层容器：溢出隐藏，保证光晕不会撑破页面
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-5 dark:bg-neutral-950">
      {/* 装饰层：纯 CSS 绘制的现代点阵纹理背景 */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] opacity-40 [background-size:20px_20px] dark:bg-[radial-gradient(#262626_1px,transparent_1px)]" />

      {/* 装饰层：页面中央的微弱发光模糊圆块，增加空间层次 */}
      <div className="absolute left-1/2 top-1/4 -z-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-neutral-200/60 blur-[100px] dark:bg-neutral-900/60" />

      {/* 内容主体：限制最大宽度，居中对齐 */}
      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* 巨大的背景 404 字样：采用渐变透明效果 */}
        <div className="mb-2 select-none text-[8rem] font-black leading-none tracking-tighter sm:text-[10rem]">
          <span className="bg-gradient-to-br from-neutral-300 to-neutral-400/50 bg-clip-text text-transparent dark:from-neutral-700 dark:to-neutral-800/50">
            404
          </span>
        </div>

        {/* 主标题保留你指定的自定义字体 */}
        <h1 className="mb-4 font-[family-name:var(--font-dingtalk)] text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
          页面好像迷路了
        </h1>

        {/* 辅助文案：适当增加行高，提升阅读体验 */}
        <p className="mb-8 max-w-xs text-base leading-relaxed text-neutral-500 dark:text-neutral-400 sm:max-w-sm">
          你访问的页面不存在，或者之后才会被写出来。不如先回首页看看别的？
        </p>

        {/* 返回首页按钮 */}
        <Link
          href="/"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-950 px-6 py-3 text-sm font-semibold !text-white shadow-lg shadow-neutral-950/15 transition-all hover:-translate-y-0.5 hover:bg-neutral-800 hover:ring-4 hover:ring-neutral-200 active:scale-95 dark:bg-white dark:!text-neutral-950 dark:hover:bg-neutral-200 dark:hover:ring-neutral-800"
        >
          {/* 左侧箭头 SVG：颜色跟随 currentColor，也就是按钮文字颜色 */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>

          <span>回到首页</span>
        </Link>
      </div>
    </main>
  );
}