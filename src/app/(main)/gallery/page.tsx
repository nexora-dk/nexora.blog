import { GalleryContent } from "@/components/pages/gallery/gallery-content";
import { PageShell } from "@/components/ui/page-shell";

export default function GalleryPage() {
  return (
    <PageShell title="相册" description="收藏一些风景、光影和路上遇见的瞬间。">
      <GalleryContent />
    </PageShell>
  );
}
