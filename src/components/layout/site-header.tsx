"use client";

// React hooks 用于根据滚动位置控制导航栏显示状态。
import { useEffect, useRef, useState } from "react";
// Next.js Link 提供客户端路由跳转能力。
import Link from "next/link";
import { AuthButton } from "@/components/layout/auth-button";
// 主导航组件负责渲染导航菜单和悬浮面板。
import { SiteNav } from "@/components/layout/site-nav";
// 主题切换按钮放在头部右侧操作区。
import { ThemeToggle } from "@/components/theme-toggle";
// Header 专用 CSS Module，承载复杂背景、边框和布局样式。
import styles from "@/styles/page/header.module.css";

// 超过该滚动距离并继续向下滚动时隐藏头部，避免遮挡阅读内容。
const HIDE_SCROLL_Y = 150;

/**
 * 站点头部：固定在页面顶部，包含品牌入口、主导航和主题切换按钮。
 */
type SiteHeaderProps = {
  siteName: string;
};

export function SiteHeader({ siteName }: SiteHeaderProps) {
  // isHidden 控制头部是否向上收起并淡出。
  const [isHidden, setIsHidden] = useState(false);
  // 记录上一次滚动位置，用于判断当前是向上滚动还是向下滚动。
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    /**
     * 根据当前滚动位置更新头部显示状态。
     */
    function handleScroll() {
      // 优先读取 window.scrollY，兜底读取 documentElement.scrollTop。
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      // 从 ref 中拿到上一帧滚动位置，避免每次滚动都触发额外渲染。
      const lastScrollY = lastScrollYRef.current;
      // 当前滚动位置更大说明用户正在向下滚动。
      const isScrollingDown = scrollY > lastScrollY;

      // 只有向下滚动且超过阈值时才隐藏头部，向上滚动会立即显示。
      setIsHidden(isScrollingDown && scrollY > HIDE_SCROLL_Y);
      // 保存本次滚动位置，供下一次事件比较。
      lastScrollYRef.current = scrollY;
    }

    // 初始化执行一次，确保页面刷新在非顶部位置时状态正确。
    handleScroll();
    // passive 监听滚动事件，避免阻塞浏览器滚动性能。
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 卸载时移除监听，防止组件销毁后仍继续触发回调。
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    // fixed 让头部悬浮在顶部；根据 isHidden 切换位移和透明度动画。
    <header className={`fixed inset-x-0 top-3 z-100 px-5 transition-all duration-500 ease-out ${isHidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}`}>
      <div className={styles.wrapper}>
        <div className={styles.shell}>
          <Link href="/" className={styles.brand}>
            {siteName}
          </Link>
          <SiteNav />
          <div className={styles.actions}>
            <ThemeToggle />
          </div>
        </div>

        <div className={styles.authAction}>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
