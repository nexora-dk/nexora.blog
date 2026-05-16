import { AdminGalleryContent } from "@/components/pages/admin/gallery/admin-gallery-content";
import { featuredPhoto, galleryPhotos } from "@/components/pages/gallery/gallery-data";

export default function AdminGalleryPage() {
  return <AdminGalleryContent featuredPhoto={featuredPhoto} photos={galleryPhotos} />;
}
