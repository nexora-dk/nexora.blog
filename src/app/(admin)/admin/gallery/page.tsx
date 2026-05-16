import { AdminGalleryContent } from "@/components/pages/admin/gallery/admin-gallery-content";
import { getAdminGalleryPhotos } from "@/db/queries/gallery.query";

export default async function AdminGalleryPage() {
  const photos = await getAdminGalleryPhotos();

  return <AdminGalleryContent photos={photos} />;
}
