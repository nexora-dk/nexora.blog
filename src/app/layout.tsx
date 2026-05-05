import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import styles from "@/styles/page/background.module.css";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import localFont from "next/font/local";

const dingTalk = localFont({
  src: "../assets/fonts/DingTalk-JinBuTi.ttf",
  variable: "--font-dingtalk",
  display: "swap",
});


const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn("font-sans", geist.variable,dingTalk.variable) }>
      <body>
        <ThemeProvider>
          <div className={`${styles.siteBg} min-h-screen text-neutral-950 dark:text-neutral-50`}>
            <SiteHeader />
            <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-[870px] px-5">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
