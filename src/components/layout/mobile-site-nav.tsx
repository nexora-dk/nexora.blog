"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import type { NavigationLink } from "@/components/layout/navigation/navigation-data";
import { siteConfig } from "@/lib/site";

type MobileSiteNavProps = {
  secondaryLinks: NavigationLink[];
};

export function MobileSiteNav({ secondaryLinks }: MobileSiteNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-950 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:text-white"
        aria-label={isOpen ? "关闭移动导航" : "打开移动导航"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-120 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-[1.7rem] border border-white/70 bg-white/95 p-3 text-sm shadow-2xl shadow-zinc-950/12 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/95 dark:shadow-black/40">
          <nav className="grid gap-1" aria-label="移动端主导航">
            {siteConfig.nav.map((item) =>
              "href" in item ? (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3 font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              ) : null,
            )}
          </nav>

          <div className="my-2 h-px bg-neutral-200/80 dark:bg-white/10" />

          <div className="grid grid-cols-2 gap-1" aria-label="移动端更多导航">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="min-w-0 rounded-2xl px-4 py-2.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <span className="block truncate">{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
