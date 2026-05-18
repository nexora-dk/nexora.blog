"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { PageLoading } from "@/components/ui/page-loading";

const ROUTE_TRANSITION_START_EVENT = "route-transition:start";
const PENDING_TIMEOUT_MS = 8_000;

type PendingTransition = {
  startPath: string;
  targetPath: string | null;
};

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function getTransitionTargetPath(link: HTMLAnchorElement) {
  if (link.target && link.target !== "_self") {
    return null;
  }

  if (link.hasAttribute("download")) {
    return null;
  }

  const targetURL = new URL(link.href, window.location.href);

  if (targetURL.origin !== window.location.origin) {
    return null;
  }

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const targetPath = `${targetURL.pathname}${targetURL.search}`;

  return targetPath === currentPath ? null : targetPath;
}

export function RouteTransitionIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<number | null>(null);
  const currentPath = `${pathname}${searchParams.size ? `?${searchParams.toString()}` : ""}`;
  const [pendingTransition, setPendingTransition] = useState<PendingTransition | null>(null);
  const isPending = Boolean(pendingTransition && pendingTransition.startPath === currentPath && pendingTransition.targetPath !== currentPath);

  useEffect(() => {
    function startPending(targetPath: string | null = null) {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      setPendingTransition({
        startPath: `${window.location.pathname}${window.location.search}`,
        targetPath,
      });
      timeoutRef.current = window.setTimeout(() => {
        setPendingTransition(null);
        timeoutRef.current = null;
      }, PENDING_TIMEOUT_MS);
    }

    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || isModifiedClick(event)) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const link = target.closest("a[href]");

      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      const targetPath = getTransitionTargetPath(link);

      if (!targetPath) {
        return;
      }

      startPending(targetPath);
    }

    function handleTransitionStart() {
      startPending();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener(ROUTE_TRANSITION_START_EVENT, handleTransitionStart);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener(ROUTE_TRANSITION_START_EVENT, handleTransitionStart);

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return isPending ? <PageLoading fixed label="页面正在跳转" /> : null;
}

export function startRouteTransition() {
  window.dispatchEvent(new CustomEvent(ROUTE_TRANSITION_START_EVENT));
}
