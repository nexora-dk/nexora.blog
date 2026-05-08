import { featuredPhoto, galleryPhotos } from "./gallery-data";
import { GalleryFeatured } from "./gallery-featured";
import { GalleryLightbox } from "./gallery-lightbox";

export function GalleryContent() {
  return (
    <div className="space-y-6">
      <GalleryFeatured photo={featuredPhoto} />

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">风景记录</h2>
        </div>
        <GalleryLightbox photos={galleryPhotos} />
      </section>
    </div>
  );
}
