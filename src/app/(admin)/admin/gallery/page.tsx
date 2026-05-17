import { AdminGalleryContent } from "@/components/pages/admin/gallery/admin-gallery-content";
import { getAdminGalleryPhotos } from "@/db/queries/gallery.query";
import { getSiteSettings } from "@/db/queries/site-settings.query";

export default async function AdminGalleryPage() {
  const [photos, settings] = await Promise.all([
    getAdminGalleryPhotos(),
    getSiteSettings(),
  ]);

  return <AdminGalleryContent photos={photos} pageSize={settings.adminPageSize} />;
}
