"use client";

// Client Component：灯箱需要响应点击、键盘事件、Portal 和浏览器滚动锁定。
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import type { GalleryPhoto } from "./gallery-data";

// PhotoOverlay 负责渲染单张缩略图 hover 时出现的标题和地点覆盖层。
function PhotoOverlay({ title, location }: { title: string; location: string }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent p-5 text-white opacity-0 transition duration-300 group-hover:opacity-100">
      <p className="text-sm font-semibold tracking-tight">{title}</p>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
        <MapPin className="size-3" />
        {location}
      </div>
    </div>
  );
}

// GalleryLightbox 负责渲染瀑布流图片，并在点击后打开全屏预览灯箱。
export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  // activeIndex 为 null 表示灯箱关闭，否则表示当前预览的图片下标。
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // activePhoto 根据当前下标派生，供条件渲染和灯箱 Image 使用。
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  // close 关闭灯箱；useCallback 保持事件监听依赖稳定。
  const close = useCallback(() => setActiveIndex(null), []);
  // showPrevious 使用取模实现首尾循环切换上一张。
  const showPrevious = useCallback(() => setActiveIndex((current) => (current === null ? current : (current - 1 + photos.length) % photos.length)), [photos.length]);
  // showNext 使用取模实现末尾回到第一张。
  const showNext = useCallback(() => setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length)), [photos.length]);

  // 灯箱打开时锁定 body 滚动并绑定键盘快捷键，关闭或卸载时清理。
  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrevious]);

  return (
    <>
      {/* 瀑布流缩略图区域：columns 布局按屏幕宽度自动增加列数。 */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {/* 循环渲染每张照片，点击按钮时记录对应 index 并打开灯箱。 */}
        {photos.map((photo, index) => (
          <button key={photo.alt} type="button" onClick={() => setActiveIndex(index)} className="group relative block w-full break-inside-avoid overflow-hidden rounded-[1.1rem] bg-neutral-100 text-left shadow-[0_1px_18px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 dark:bg-neutral-900">
            <Image src={photo.image} alt={photo.alt} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 290px" className="h-auto w-full transition duration-700 group-hover:scale-[1.025]" />
            <PhotoOverlay title={photo.title} location={photo.location} />
          </button>
        ))}
      </div>

      {/* 条件渲染 Portal：只有存在 activePhoto 且处于浏览器环境时才挂载全屏灯箱。 */}
      {activePhoto && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-neutral-950/95 text-white backdrop-blur-sm">
          {/* 左上角返回按钮与关闭逻辑一致，用于回到相册列表。 */}
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 sm:left-6 sm:top-6">
            <button type="button" onClick={close} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/18">
              <ArrowLeft className="size-4" />
              返回相册
            </button>
          </div>

          {/* 右上角关闭按钮提供仅图标的关闭入口。 */}
          <button type="button" onClick={close} className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:right-6 sm:top-6" aria-label="关闭预览">
            <X className="size-5" />
          </button>

          {/* 左右切换按钮调用循环切换函数，实现上一张/下一张预览。 */}
          <button type="button" onClick={showPrevious} className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:left-6" aria-label="上一张">
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" onClick={showNext} className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:right-6" aria-label="下一张">
            <ChevronRight className="size-6" />
          </button>

          {/* 中央预览区使用 object-contain 保持图片完整显示。 */}
          <div className="flex h-full items-center justify-center px-6 py-20 sm:px-16">
            <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
              <Image src={activePhoto.image} alt={activePhoto.alt} fill sizes="100vw" className="object-contain" priority />
            </div>
          </div>

          {/* 底部信息栏展示当前图片标题、地点和在相册中的序号。 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-6 text-center">
            <p className="text-lg font-semibold tracking-tight">{activePhoto.title}</p>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/70">
              <MapPin className="size-4" />
              {activePhoto.location}
              <span className="text-white/35">/</span>
              {(activeIndex ?? 0) + 1} / {photos.length}
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
