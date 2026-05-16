import { GalleryContent } from "@/components/pages/gallery/gallery-content";
import { PageShell } from "@/components/ui/page-shell";
import {
  getFeaturedGalleryPhoto,
  getGalleryPhotos,
} from "@/db/queries/gallery.query";

export default async function GalleryPage() {
  const [photos, featuredPhoto] = await Promise.all([
    getGalleryPhotos(),
    getFeaturedGalleryPhoto(),
  ]);

  return (
    <PageShell title="相册" description="收藏一些风景、光影和路上遇见的瞬间。">
      <GalleryContent featuredPhoto={featuredPhoto ?? photos[0]} photos={photos} />
    </PageShell>
  );
}
