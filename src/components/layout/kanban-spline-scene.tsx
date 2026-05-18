"use client";

import { Application } from "@splinetool/runtime";
import { useEffect, useRef } from "react";

const SCENE_URL = "https://prod.spline.design/6cYiSZGQi3oFQyEM/scene.splinecode";

function isSplineRuntimeStack(value: unknown) {
  return typeof value === "string" && (value.includes("@splinetool/runtime") || value.includes("_%40splinetool_runtime_"));
}

function isSplineMissingPropertyConsoleError(args: unknown[]) {
  if (args[0] !== "Missing property") {
    return false;
  }

  return isSplineRuntimeStack(new Error().stack) || args.some(isSplineRuntimeStack);
}

export function KanbanSplineScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const originalConsoleError = console.error;
    const canvas = document.createElement("canvas");
    let app: Application | undefined;

    canvas.className = "block size-full";
    container.replaceChildren(canvas);

    console.error = (...args) => {
      if (isSplineMissingPropertyConsoleError(args)) {
        return;
      }

      originalConsoleError(...args);
    };

    try {
      app = new Application(canvas, {
        renderOnDemand: true,
      });

      app.load(SCENE_URL).catch((error) => {
        console.warn("Spline scene failed to load:", error);
      });
    } catch (error) {
      console.warn("Spline scene failed to initialize:", error);
    }

    return () => {
      console.error = originalConsoleError;
      app?.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={containerRef} className="block size-full" />;
}
