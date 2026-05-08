"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

import { initialReadmeSectionId, readmeTocItems } from "./readme-data";

function subscribeToClientReady(onStoreChange: () => void) {
  onStoreChange();
  return () => {};
}

function getClientSnapshot() {
  return typeof document !== "undefined";
}

function getServerSnapshot() {
  return false;
}

export function useReadmeToc(containerRef: RefObject<HTMLDivElement | null>, tocRef: RefObject<HTMLDivElement | null>) {
  const isClient = useSyncExternalStore(subscribeToClientReady, getClientSnapshot, getServerSnapshot);
  const [activeId, setActiveId] = useState(initialReadmeSectionId);
  const [tocLeft, setTocLeft] = useState<number | null>(null);
  const [tocOffset, setTocOffset] = useState(0);

  useEffect(() => {
    function updateActiveSection() {
      const currentSection = readmeTocItems.reduce((current, item) => {
        const section = document.getElementById(item.href.slice(1));

        if (!section) {
          return current;
        }

        return section.getBoundingClientRect().top <= 180 ? item.href.slice(1) : current;
      }, initialReadmeSectionId);
      const container = containerRef.current;
      const toc = tocRef.current;

      setActiveId(currentSection);

      if (container && toc) {
        const containerRect = container.getBoundingClientRect();
        const tocHeight = toc.offsetHeight;
        const statusSection = document.getElementById("status");
        const fixedTop = 190;
        const statusTop = statusSection?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
        const statusOverflow = fixedTop - statusTop;
        const bottomOverflow = fixedTop + tocHeight - containerRect.bottom;

        setTocLeft(containerRect.right - 128);
        setTocOffset(Math.max(0, statusOverflow, bottomOverflow));
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [containerRef, tocRef]);

  return { isClient, activeId, tocLeft, tocOffset };
}
