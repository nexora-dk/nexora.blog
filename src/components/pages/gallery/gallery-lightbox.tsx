"use client";

import Image, { type StaticImageData } from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type GalleryPhoto = {
  image: StaticImageData;
  alt: string;
  title: string;
  location: string;
};

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

export function GalleryLightbox({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrevious = useCallback(() => setActiveIndex((current) => (current === null ? current : (current - 1 + photos.length) % photos.length)), [photos.length]);
  const showNext = useCallback(() => setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length)), [photos.length]);

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
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {photos.map((photo, index) => (
          <button key={photo.alt} type="button" onClick={() => setActiveIndex(index)} className="group relative block w-full break-inside-avoid overflow-hidden rounded-[1.1rem] bg-neutral-100 text-left shadow-[0_1px_18px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-0.5 dark:bg-neutral-900">
            <Image src={photo.image} alt={photo.alt} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 290px" className="h-auto w-full transition duration-700 group-hover:scale-[1.025]" />
            <PhotoOverlay title={photo.title} location={photo.location} />
          </button>
        ))}
      </div>

      {activePhoto && typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-neutral-950/95 text-white backdrop-blur-sm">
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2 sm:left-6 sm:top-6">
            <button type="button" onClick={close} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/18">
              <ArrowLeft className="size-4" />
              返回相册
            </button>
          </div>

          <button type="button" onClick={close} className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:right-6 sm:top-6" aria-label="关闭预览">
            <X className="size-5" />
          </button>

          <button type="button" onClick={showPrevious} className="absolute left-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:left-6" aria-label="上一张">
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" onClick={showNext} className="absolute right-3 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/18 sm:right-6" aria-label="下一张">
            <ChevronRight className="size-6" />
          </button>

          <div className="flex h-full items-center justify-center px-6 py-20 sm:px-16">
            <div className="relative h-full max-h-[78vh] w-full max-w-6xl">
              <Image src={activePhoto.image} alt={activePhoto.alt} fill sizes="100vw" className="object-contain" priority />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-6 text-center">
            <p className="text-lg font-semibold tracking-tight">{activePhoto.title}</p>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm text-white/70">
              <MapPin className="size-4" />
              {activePhoto.location}
              <span className="text-white/35">/</span>
              {activeIndex + 1} / {photos.length}
            </div>
          </div>
          </div>,
          document.body,
        )}
    </>
  );
}
