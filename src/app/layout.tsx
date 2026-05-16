import type { Metadata } from "next";
import { Geist } from "next/font/google";
import localFont from "next/font/local";

import { ThemeProvider } from "@/components/theme-provider";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import styles from "@/styles/page/background.module.css";
import "./globals.css";

const dingTalk = localFont({
  src: "../assets/fonts/DingTalk-JinBuTi.ttf",
  variable: "--font-dingtalk",
  display: "swap",
});

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("font-sans", geist.variable, dingTalk.variable)}
    >
      <body>
        <ThemeProvider>
          <div className={`${styles.siteBg} min-h-screen text-neutral-950 dark:text-neutral-50`}>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
