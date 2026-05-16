import { and, asc, eq, ne } from "drizzle-orm";

import type { GalleryPhoto } from "@/components/pages/gallery/gallery-data";
import { db } from "../db";
import { galleryPhotos } from "../schemas/schema";
import { retryDatabaseRead } from "./retry";

export type AdminGalleryPhoto = GalleryPhoto & {
  id: number;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  sourceKey: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type GalleryPhotoInput = {
  imageSrc: string;
  alt: string;
  title: string;
  location: string;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  sourceKey?: string | null;
};

function mapGalleryPhoto(row: typeof galleryPhotos.$inferSelect): AdminGalleryPhoto {
  return {
    id: row.id,
    imageSrc: row.imageSrc,
    alt: row.alt,
    title: row.title,
    location: row.location,
    isFeatured: row.isFeatured,
    isVisible: row.isVisible,
    sortOrder: row.sortOrder,
    sourceKey: row.sourceKey,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getGalleryPhotos(): Promise<AdminGalleryPhoto[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.isVisible, true))
      .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.id)),
  );

  return rows.map(mapGalleryPhoto);
}

export async function getFeaturedGalleryPhoto() {
  const [photo] = await retryDatabaseRead(() =>
    db
      .select()
      .from(galleryPhotos)
      .where(and(eq(galleryPhotos.isVisible, true), eq(galleryPhotos.isFeatured, true)))
      .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.id))
      .limit(1),
  );

  return photo ? mapGalleryPhoto(photo) : undefined;
}

export async function getAdminGalleryPhotos(): Promise<AdminGalleryPhoto[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select()
      .from(galleryPhotos)
      .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.id)),
  );

  return rows.map(mapGalleryPhoto);
}

export async function getAdminGalleryPhotoById(id: number) {
  const [photo] = await retryDatabaseRead(() =>
    db.select().from(galleryPhotos).where(eq(galleryPhotos.id, id)).limit(1),
  );

  return photo ? mapGalleryPhoto(photo) : undefined;
}

export async function createGalleryPhoto(input: GalleryPhotoInput) {
  const [photo] = await db
    .insert(galleryPhotos)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ id: galleryPhotos.id });

  return photo;
}

export async function updateGalleryPhotoById(id: number, input: GalleryPhotoInput) {
  const [photo] = await db
    .update(galleryPhotos)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(galleryPhotos.id, id))
    .returning({ id: galleryPhotos.id });

  return photo;
}

export async function deleteGalleryPhotoById(id: number) {
  const [photo] = await db
    .delete(galleryPhotos)
    .where(eq(galleryPhotos.id, id))
    .returning({ id: galleryPhotos.id });

  return photo;
}

export async function clearFeaturedGalleryPhotosExcept(id: number) {
  await db
    .update(galleryPhotos)
    .set({
      isFeatured: false,
      updatedAt: new Date(),
    })
    .where(ne(galleryPhotos.id, id));
}
