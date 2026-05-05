"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/layout/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site";
import styles from "@/styles/page/header.module.css";

const HIDE_SCROLL_Y = 150;

export function SiteHeader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      setIsHidden(scrollY > HIDE_SCROLL_Y);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-3 z-100 px-5 ${isHidden ? "hidden" : "block"}`}>
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
