"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="size-full" />,
});

const SCENE_URL = "https://prod.spline.design/6cYiSZGQi3oFQyEM/scene.splinecode";

export function KanbanSplineScene() {
  return (
    <Spline
      scene={SCENE_URL}
      className="block size-full"
    />
  );
}
