// Metadata 类型用于约束 Next.js 静态元信息配置。
import type { Metadata } from "next";
// 页面过渡组件包裹每个路由页面，负责切换时的动效体验。
import { PageTransition } from "@/components/layout/page-transition";
// 站点页脚组件，展示版权、备案或补充链接等底部信息。
import { SiteFooter } from "@/components/layout/site-footer";
// 滚动进度按钮用于提示阅读进度并提供回到顶部能力。
import { ScrollProgressButton } from "@/components/layout/scroll-progress-button";
// 站点头部组件，承载主导航和主题切换等全局入口。
import { SiteHeader } from "@/components/layout/site-header";
// 主题提供器负责在客户端管理亮色、暗色和系统主题。
import { ThemeProvider } from "@/components/theme-provider";
// 站点配置提供默认标题、描述和导航等全局配置。
import { siteConfig } from "@/lib/site";
// 背景样式模块提供全站背景纹理或渐变效果。
import styles from "@/styles/page/background.module.css";
// 全局样式必须在根布局引入，以便 Tailwind、主题变量和基础样式作用于全站。
import "./globals.css";
// Next.js Google Font 工具用于自托管并优化 Geist 字体。
import { Geist } from "next/font/google";
// cn 用于合并字体变量和基础字体类名。
import { cn } from "@/lib/utils";
// localFont 用于加载本地钉钉进步体字体文件。
import localFont from "next/font/local";

// 本地字体配置：把钉钉进步体注册为 CSS 变量，供标题等位置通过 font-family 使用。
const dingTalk = localFont({
  // 字体文件位于 app 相邻的 assets/fonts 目录。
  src: "../assets/fonts/DingTalk-JinBuTi.ttf",
  // CSS 变量名会挂载到 html className 上，后续样式可通过 var(--font-dingtalk) 引用。
  variable: "--font-dingtalk",
  // swap 让页面先使用后备字体显示，字体加载完成后再切换，减少空白等待。
  display: "swap",
});

// Google Geist 字体配置：注册为全站 sans 字体变量。
const geist = Geist({subsets:['latin'],variable:'--font-sans'});

// Next.js 静态 metadata：用于生成默认 title 与 description，提升基础 SEO 和分享展示。
export const metadata: Metadata = {
  // title 支持默认标题和子页面标题模板。
  title: {
    // 未指定页面标题时使用站点名称。
    default: siteConfig.name,
    // 子页面标题会被格式化为“页面标题 | 站点名称”。
    template: `%s | ${siteConfig.name}`,
  },
  // 默认站点描述来自统一配置，避免多处重复维护。
  description: siteConfig.description,
};

/**
 * 根布局组件：Next.js App Router 必需的最外层布局，负责提供 html/body、主题、导航和页面容器。
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // html 标签声明中文语言环境；suppressHydrationWarning 用于避免主题类名在服务端和客户端初始值不一致时产生警告。
    <html lang="zh-CN" suppressHydrationWarning className={cn("font-sans", geist.variable,dingTalk.variable) }>
      <body>
        {/* ThemeProvider 包裹整站，让暗色模式状态对所有子组件可用。 */}
        <ThemeProvider>
          {/* 全站背景和文字主题容器，保证页面至少撑满一屏。 */}
          <div className={`${styles.siteBg} min-h-screen text-neutral-950 dark:text-neutral-50`}>
            {/* 固定的站点头部和导航入口。 */}
            <SiteHeader />
            {/* 页面主内容区域，限制最大宽度并预留左右间距。 */}
            <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[870px] px-5">
              {/* 路由内容通过过渡组件渲染，children 是当前匹配页面。 */}
              <PageTransition>{children}</PageTransition>
            </main>
            {/* 全站页脚放在内容区域之后。 */}
            <SiteFooter />
          </div>
          {/* 滚动进度按钮放在背景容器外，便于作为全局浮动控件定位。 */}
          <ScrollProgressButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
