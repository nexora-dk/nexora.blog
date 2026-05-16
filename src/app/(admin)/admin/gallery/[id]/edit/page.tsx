import { notFound } from "next/navigation";

import { AdminGalleryCreateContent } from "@/components/pages/admin/gallery/admin-gallery-create-content";
import { getAdminGalleryPhotoById } from "@/db/queries/gallery.query";

type AdminEditGalleryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditGalleryPage({
  params,
}: AdminEditGalleryPageProps) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId) || numericId <= 0) {
    notFound();
  }

  const photo = await getAdminGalleryPhotoById(numericId);

  if (!photo) {
    notFound();
  }

  return (
    <AdminGalleryCreateContent
      mode="edit"
      initialValue={{
        id: photo.id,
        imageSrc: photo.imageSrc,
        alt: photo.alt,
        title: photo.title,
        location: photo.location,
        isFeatured: photo.isFeatured,
        isVisible: photo.isVisible,
        sortOrder: photo.sortOrder,
      }}
    />
  );
}
