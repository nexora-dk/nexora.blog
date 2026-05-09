import { featuredPhoto, galleryPhotos } from "./gallery-data";
import { GalleryFeatured } from "./gallery-featured";
import { GalleryLightbox } from "./gallery-lightbox";

// GalleryContent 是相册页面的内容容器，负责组合精选大图和图片灯箱列表。
export function GalleryContent() {
  return (
    <div className="space-y-6">
      {/* 顶部精选图片区域，传入单张 featuredPhoto 数据。 */}
      <GalleryFeatured photo={featuredPhoto} />

      {/* 下方相册列表区包含栏目标题和可点击预览的瀑布流。 */}
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500">Gallery</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">风景记录</h2>
        </div>
        {/* GalleryLightbox 内部负责循环渲染照片和处理预览交互。 */}
        <GalleryLightbox photos={galleryPhotos} />
      </section>
    </div>
  );
}
