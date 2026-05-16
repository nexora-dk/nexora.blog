import type { GalleryPhoto } from "./gallery-data";
import { GalleryFeatured } from "./gallery-featured";
import { GalleryLightbox } from "./gallery-lightbox";

type GalleryContentProps = {
  featuredPhoto?: GalleryPhoto;
  photos: GalleryPhoto[];
};

export function GalleryContent({ featuredPhoto, photos }: GalleryContentProps) {
  return (
    <div className="space-y-6">
      {featuredPhoto ? <GalleryFeatured photo={featuredPhoto} /> : null}

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">风景记录</h2>
        </div>

        {photos.length > 0 ? (
          <GalleryLightbox photos={photos} />
        ) : (
          <div className="rounded-[1.35rem] border border-dashed border-neutral-200/70 bg-white/55 p-10 text-center text-sm text-neutral-400 dark:border-white/10 dark:bg-white/[0.035] dark:text-neutral-500">
            暂无公开照片
          </div>
        )}
      </section>
    </div>
  );
}
