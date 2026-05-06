"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";
import styles from "@/styles/page/header.module.css";

const HIDE_SCROLL_Y = 150;

export function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const lastScrollY = lastScrollYRef.current;
      const isScrollingDown = scrollY > lastScrollY;

      setIsHidden(isScrollingDown && scrollY > HIDE_SCROLL_Y);
      lastScrollYRef.current = scrollY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-3 z-100 px-5 transition-all duration-500 ease-out ${isHidden ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"}`}>
      <div className={styles.shell}>
        <Link href="/" className={styles.brand}>
          {siteConfig.name}
        </Link>
        <SiteNav />
        <div className={styles.actions}>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
