// Next.js Link 用于在 404 页面提供无刷新返回首页的导航。
import Link from "next/link";

/**
 * 全站 404 页面：当访问不存在的路由或页面主动触发 notFound 时展示。
 */
export default function NotFound() {
  return (
    // 使用全屏网格把 404 提示居中，并根据主题切换背景和文字颜色。
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-5 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {/* 限制内容宽度并居中排版，让错误信息在移动端和桌面端都易读。 */}
      <div className="max-w-md space-y-4 text-center">
        {/* 404 状态码提示，用较弱颜色降低视觉重量。 */}
        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">404</p>
        {/* 主标题使用自定义字体，强化错误页面的个性化表达。 */}
        <h1 className="font-[family-name:var(--font-dingtalk)] text-3xl font-semibold tracking-tight">页面走丢了</h1>
        {/* 辅助文案说明页面不存在或尚未发布。 */}
        <p className="text-neutral-600 dark:text-neutral-300">你访问的页面不存在，或者之后才会被写出来。</p>
        {/* 返回首页按钮，帮助用户从错误路径回到站点主入口。 */}
        <Link href="/" className="inline-flex rounded-full bg-neutral-950 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-950">
          回到首页
        </Link>
      </div>
    </main>
  );
}
