"use client";

// next-themes 的 ThemeProvider 负责在客户端把主题状态同步到 DOM class 上。
import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * 全站主题提供器：让子组件可以读取和切换亮色、暗色或系统主题。
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    // attribute="class" 会把 dark 等主题类名挂到 html 上，Tailwind 的 dark: 变体依赖这个类名生效。
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* children 是整站页面内容，包裹后即可共享主题上下文。 */}
      {children}
    </NextThemesProvider>
  );
}
