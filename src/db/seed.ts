import { config } from "dotenv";

config({ path: ".env.local" });

function parseCount(value: string) {
  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue.endsWith("k")) {
    return Math.round(Number(normalizedValue.slice(0, -1)) * 1000);
  }

  const count = Number(normalizedValue);
  return Number.isFinite(count) ? count : 0;
}

const collectionGroupSlugs: Record<string, string> = {
  好用工具: "tools",
  美工设计: "design",
  技术开发: "development",
  开发套餐: "dev-stack",
  灵感找寻: "inspiration",
  "UI 组件库": "ui-components",
};

function getCollectionGroupSlug(title: string, index: number) {
  return collectionGroupSlugs[title] ?? `collection-group-${index + 1}`;
}

async function seedContent() {
  const [
    { db },
    {
      writings,
      notes,
      thinking,
      collectionGroups: collectionGroupsTable,
      collectionItems,
      galleryPhotos: galleryPhotosTable,
    },
    { getArticleItemsFromMarkdown },
    { noteItems },
    { thinkingItems },
    { collectionGroups: seedCollectionGroups },
    { galleryPhotos: seedGalleryPhotos },
  ] = await Promise.all([
    import("./db"),
    import("./schemas/schema"),
    import("../components/pages/writing/writing-data"),
    import("../components/pages/notes/notes-data"),
    import("../components/pages/thinking/thinking-data"),
    import("../components/pages/collection/collection-data"),
    import("../components/pages/gallery/gallery-data"),
  ]);
  const articleItems = getArticleItemsFromMarkdown();

  for (const article of articleItems) {
    const values = {
      slug: article.slug,
      title: article.title,
      description: article.description,
      href: article.href,
      date: article.date,
      category: article.category,
      categoryLabel: article.categoryLabel,
      tags: article.tags,
      readingTime: article.readingTime,
      views: parseCount(article.views),
      likes: parseCount(article.likes),
      modifiedTime: article.modifiedTime,
      contentPath: `data/writing/${article.slug}.md`,
    };

    await db
      .insert(writings)
      .values(values)
      .onConflictDoUpdate({
        target: writings.slug,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  for (const note of noteItems) {
    const values = {
      slug: note.slug,
      title: note.title,
      description: note.description,
      href: note.href,
      date: note.date,
      column: note.column,
      columnLabel: note.columnLabel,
      mood: note.mood,
      location: note.location,
      tags: note.tags,
      publishedAt: note.publishedAt,
      views: parseCount(note.views),
      likes: parseCount(note.likes),
      readingTime: note.readingTime,
      insight: note.description,
      contentPath: `data/notes/${note.slug}.md`,
    };

    await db
      .insert(notes)
      .values(values)
      .onConflictDoUpdate({
        target: notes.slug,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  for (const [index, item] of thinkingItems.entries()) {
    const sourceKey = `${item.publishedAt}-${item.time ?? "day"}-${index}`;
    const values = {
      content: item.content,
      publishedAt: item.publishedAt,
      time: item.time ?? null,
      mood: item.mood ?? null,
      isVisible: item.isVisible,
      sourceKey,
    };

    await db
      .insert(thinking)
      .values(values)
      .onConflictDoUpdate({
        target: thinking.sourceKey,
        set: {
          ...values,
          updatedAt: new Date(),
        },
      });
  }

  let seededCollectionItemCount = 0;

  for (const [groupIndex, group] of seedCollectionGroups.entries()) {
    const groupSourceKey = `collection-group-${groupIndex}-${group.title}`;
    const [savedGroup] = await db
      .insert(collectionGroupsTable)
      .values({
        title: group.title,
        slug: getCollectionGroupSlug(group.title, groupIndex),
        sortOrder: groupIndex,
        sourceKey: groupSourceKey,
      })
      .onConflictDoUpdate({
        target: collectionGroupsTable.sourceKey,
        set: {
          title: group.title,
          slug: getCollectionGroupSlug(group.title, groupIndex),
          sortOrder: groupIndex,
          updatedAt: new Date(),
        },
      })
      .returning({ id: collectionGroupsTable.id });

    for (const [itemIndex, item] of group.items.entries()) {
      const itemSourceKey = `collection-item-${groupIndex}-${itemIndex}-${item.title}`;
      const values = {
        groupId: savedGroup.id,
        title: item.title,
        description: item.description,
        href: item.href ?? null,
        iconType: item.icon.type,
        iconName: item.icon.type === "simple" ? item.icon.name : null,
        iconSrc: item.icon.type === "image" ? item.icon.src ?? null : null,
        iconAlt: item.icon.type === "image" ? item.icon.alt ?? item.title : null,
        iconClassName: item.icon.className ?? null,
        isVisible: true,
        sortOrder: itemIndex,
        sourceKey: itemSourceKey,
      };

      await db
        .insert(collectionItems)
        .values(values)
        .onConflictDoNothing({ target: collectionItems.sourceKey });
      seededCollectionItemCount += 1;
    }
  }

  for (const [index, photo] of seedGalleryPhotos.entries()) {
    const sourceKey = `gallery-photo-${index}-${photo.title}`;

    await db
      .insert(galleryPhotosTable)
      .values({
        imageSrc: photo.imageSrc,
        alt: photo.alt,
        title: photo.title,
        location: photo.location,
        isFeatured: photo.isFeatured ?? index === 0,
        isVisible: photo.isVisible ?? true,
        sortOrder: photo.sortOrder ?? index,
        sourceKey,
      })
      .onConflictDoNothing({ target: galleryPhotosTable.sourceKey });
  }

  console.log(
    `Seeded ${articleItems.length} writings, ${noteItems.length} notes, ${thinkingItems.length} thinking items, ${seedCollectionGroups.length} collection groups, ${seededCollectionItemCount} collection items and ${seedGalleryPhotos.length} gallery photos.`,
  );
}

seedContent().catch((error) => {
  console.error("Failed to seed content:", error);
  process.exit(1);
});
