import { Suspense } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";

import { RouteTransitionIndicator } from "@/components/layout/route-transition-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/db/queries/site-settings.query";
import { cn } from "@/lib/utils";
import styles from "@/styles/page/background.module.css";
import "./globals.css";

const dingTalk = localFont({
  src: "../assets/fonts/DingTalk-JinBuTi.ttf",
  variable: "--font-dingtalk",
  display: "swap",
});


export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default: settings.siteName,
      template: settings.seoTitleTemplate,
    },
    description: settings.seoDescription || settings.siteDescription,
    keywords: settings.seoKeywords,
    metadataBase: new URL(settings.siteUrl),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("font-sans", dingTalk.variable)}
    >
      <body>
        <ThemeProvider>
          <div className={`${styles.siteBg} min-h-screen text-neutral-950 dark:text-neutral-50`}>
            <Suspense fallback={null}>
              <RouteTransitionIndicator />
            </Suspense>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
