import { asc, eq } from "drizzle-orm";

import type {
  CollectionGroup,
  CollectionIcon,
  CollectionItem,
  SimpleIconName,
} from "@/components/pages/collection/collection-data";
import { isSimpleIconName } from "@/components/pages/collection/collection-data";
import { db } from "../db";
import { collectionGroups, collectionItems } from "../schemas/schema";
import { retryDatabaseRead } from "./retry";

export type CollectionIconType = "simple" | "image";

export type AdminCollectionGroupOption = {
  id: number;
  title: string;
  slug: string;
};

export type AdminCollectionItem = CollectionItem & {
  id: number;
  groupId: number;
  groupTitle: string;
  isVisible: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type CollectionItemInput = {
  groupId: number;
  title: string;
  description: string;
  href: string | null;
  iconType: CollectionIconType;
  iconName: string | null;
  iconSrc: string | null;
  iconAlt: string | null;
  iconClassName: string | null;
  isVisible: boolean;
  sortOrder: number;
  sourceKey?: string | null;
};

type CollectionRow = typeof collectionItems.$inferSelect & {
  groupTitle: string;
};

function mapCollectionIcon(row: typeof collectionItems.$inferSelect): CollectionIcon {
  if (row.iconType === "simple") {
    const iconName = row.iconName ?? "";

    return {
      type: "simple",
      name: isSimpleIconName(iconName) ? iconName : ("github" satisfies SimpleIconName),
      className: row.iconClassName ?? undefined,
    };
  }

  return {
    type: "image",
    src: row.iconSrc ?? "",
    alt: row.iconAlt ?? row.title,
    className: row.iconClassName ?? undefined,
  };
}

function mapAdminCollectionItem(row: CollectionRow): AdminCollectionItem {
  return {
    id: row.id,
    groupId: row.groupId,
    groupTitle: row.groupTitle,
    title: row.title,
    description: row.description,
    href: row.href ?? undefined,
    icon: mapCollectionIcon(row),
    isVisible: row.isVisible,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getCollectionGroups(): Promise<CollectionGroup[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select({
        groupId: collectionGroups.id,
        groupTitle: collectionGroups.title,
        item: collectionItems,
      })
      .from(collectionGroups)
      .innerJoin(collectionItems, eq(collectionItems.groupId, collectionGroups.id))
      .where(eq(collectionItems.isVisible, true))
      .orderBy(
        asc(collectionGroups.sortOrder),
        asc(collectionGroups.id),
        asc(collectionItems.sortOrder),
        asc(collectionItems.id),
      ),
  );

  const groups = new Map<number, CollectionGroup>();

  for (const row of rows) {
    const group = groups.get(row.groupId) ?? {
      title: row.groupTitle,
      items: [],
    };
    group.items.push({
      title: row.item.title,
      description: row.item.description,
      href: row.item.href ?? undefined,
      icon: mapCollectionIcon(row.item),
    });
    groups.set(row.groupId, group);
  }

  return Array.from(groups.values());
}

export async function getAdminCollectionItems(): Promise<AdminCollectionItem[]> {
  const rows = await retryDatabaseRead(() =>
    db
      .select({
        id: collectionItems.id,
        groupId: collectionItems.groupId,
        groupTitle: collectionGroups.title,
        title: collectionItems.title,
        description: collectionItems.description,
        href: collectionItems.href,
        iconType: collectionItems.iconType,
        iconName: collectionItems.iconName,
        iconSrc: collectionItems.iconSrc,
        iconAlt: collectionItems.iconAlt,
        iconClassName: collectionItems.iconClassName,
        isVisible: collectionItems.isVisible,
        sortOrder: collectionItems.sortOrder,
        sourceKey: collectionItems.sourceKey,
        createdAt: collectionItems.createdAt,
        updatedAt: collectionItems.updatedAt,
      })
      .from(collectionItems)
      .innerJoin(collectionGroups, eq(collectionItems.groupId, collectionGroups.id))
      .orderBy(
        asc(collectionGroups.sortOrder),
        asc(collectionGroups.id),
        asc(collectionItems.sortOrder),
        asc(collectionItems.id),
      ),
  );

  return rows.map(mapAdminCollectionItem);
}

export async function getAdminCollectionItemById(id: number) {
  const [item] = await retryDatabaseRead(() =>
    db
      .select({
        id: collectionItems.id,
        groupId: collectionItems.groupId,
        groupTitle: collectionGroups.title,
        title: collectionItems.title,
        description: collectionItems.description,
        href: collectionItems.href,
        iconType: collectionItems.iconType,
        iconName: collectionItems.iconName,
        iconSrc: collectionItems.iconSrc,
        iconAlt: collectionItems.iconAlt,
        iconClassName: collectionItems.iconClassName,
        isVisible: collectionItems.isVisible,
        sortOrder: collectionItems.sortOrder,
        sourceKey: collectionItems.sourceKey,
        createdAt: collectionItems.createdAt,
        updatedAt: collectionItems.updatedAt,
      })
      .from(collectionItems)
      .innerJoin(collectionGroups, eq(collectionItems.groupId, collectionGroups.id))
      .where(eq(collectionItems.id, id))
      .limit(1),
  );

  return item ? mapAdminCollectionItem(item) : undefined;
}

export async function getCollectionGroupsForSelect(): Promise<AdminCollectionGroupOption[]> {
  return retryDatabaseRead(() =>
    db
      .select({
        id: collectionGroups.id,
        title: collectionGroups.title,
        slug: collectionGroups.slug,
      })
      .from(collectionGroups)
      .orderBy(asc(collectionGroups.sortOrder), asc(collectionGroups.id)),
  );
}

export async function getCollectionGroupById(id: number) {
  const [group] = await retryDatabaseRead(() =>
    db.select().from(collectionGroups).where(eq(collectionGroups.id, id)).limit(1),
  );

  return group;
}

export async function createCollectionItem(input: CollectionItemInput) {
  const [item] = await db
    .insert(collectionItems)
    .values({
      ...input,
      updatedAt: new Date(),
    })
    .returning({ id: collectionItems.id });

  return item;
}

export async function updateCollectionItemById(
  id: number,
  input: CollectionItemInput,
) {
  const [item] = await db
    .update(collectionItems)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(collectionItems.id, id))
    .returning({ id: collectionItems.id });

  return item;
}

export async function deleteCollectionItemById(id: number) {
  const [item] = await db
    .delete(collectionItems)
    .where(eq(collectionItems.id, id))
    .returning({ id: collectionItems.id });

  return item;
}
