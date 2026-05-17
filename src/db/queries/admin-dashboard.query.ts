import { and, count, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "../db";
import {
  collectionGroups,
  collectionItems,
  friendLinks,
  galleryPhotos,
  guestbookComments,
  noteComments,
  notes,
  projects,
  thinking,
  writingComments,
  writings,
} from "../schemas/schema";
import { retryDatabaseRead } from "./retry";
import type { FriendLinkStatus } from "./friend-links.query";

export type AdminDashboardModuleKey =
  | "writings"
  | "notes"
  | "thinking"
  | "collection"
  | "gallery"
  | "projects"
  | "friends"
  | "comments"
  | "guestbook";

export type AdminDashboardModuleCount = {
  key: AdminDashboardModuleKey;
  label: string;
  value: number;
  helper: string;
  href: string;
};

export type AdminDashboardPendingWorkItem = {
  key: string;
  label: string;
  count: number;
  href: string;
  tone: "amber" | "emerald" | "neutral" | "red";
  description: string;
};

export type AdminDashboardActivityItem = {
  id: string;
  type:
    | "writing"
    | "note"
    | "thinking"
    | "collection"
    | "gallery"
    | "project"
    | "friend"
    | "comment"
    | "guestbook";
  label: string;
  title: string;
  description: string;
  href: string;
  occurredAt: Date;
};

export type AdminDashboardTopContent = {
  title: string;
  slug: string;
  views: number;
  likes: number;
  comments: number;
  href: string;
};

export type AdminDashboardContentPerformance = {
  totals: {
    views: number;
    likes: number;
    comments: number;
    engagementRate: number;
  };
  topWritings: AdminDashboardTopContent[];
  topNotes: AdminDashboardTopContent[];
};

export type AdminDashboardManagementHealth = {
  visibleTotal: number;
  hiddenTotal: number;
  featuredGalleryPhotos: number;
  featuredProjects: number;
  friendStatuses: Record<FriendLinkStatus, number>;
};

export type AdminDashboardOverview = {
  generatedAt: Date;
  moduleCounts: AdminDashboardModuleCount[];
  pendingWork: {
    total: number;
    items: AdminDashboardPendingWorkItem[];
  };
  recentActivity: AdminDashboardActivityItem[];
  contentPerformance: AdminDashboardContentPerformance;
  managementHealth: AdminDashboardManagementHealth;
};

function toNumber(value: unknown) {
  return Number(value ?? 0);
}

function createSnippet(value: string, maxLength = 42) {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength)}…`;
}

async function readSingleNumber(operation: () => Promise<Array<{ value: unknown }>>) {
  const [row] = await retryDatabaseRead(operation);

  return toNumber(row?.value);
}

async function getAdminModuleCounts(): Promise<AdminDashboardModuleCount[]> {
  const [
    writingCount,
    noteCount,
    thinkingCount,
    collectionGroupCount,
    collectionItemCount,
    galleryCount,
    projectCount,
    friendCount,
    writingCommentCount,
    noteCommentCount,
    guestbookCount,
  ] = await Promise.all([
    readSingleNumber(() => db.select({ value: count() }).from(writings)),
    readSingleNumber(() => db.select({ value: count() }).from(notes)),
    readSingleNumber(() => db.select({ value: count() }).from(thinking)),
    readSingleNumber(() => db.select({ value: count() }).from(collectionGroups)),
    readSingleNumber(() => db.select({ value: count() }).from(collectionItems)),
    readSingleNumber(() => db.select({ value: count() }).from(galleryPhotos)),
    readSingleNumber(() => db.select({ value: count() }).from(projects)),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks)),
    readSingleNumber(() => db.select({ value: count() }).from(writingComments)),
    readSingleNumber(() => db.select({ value: count() }).from(noteComments)),
    readSingleNumber(() => db.select({ value: count() }).from(guestbookComments)),
  ]);

  return [
    { key: "writings", label: "文稿", value: writingCount, helper: "长文内容", href: "/admin/writings" },
    { key: "notes", label: "手记", value: noteCount, helper: "短篇记录", href: "/admin/notes" },
    { key: "thinking", label: "思考", value: thinkingCount, helper: "碎片想法", href: "/admin/thinking" },
    { key: "collection", label: "收藏", value: collectionItemCount, helper: `${collectionGroupCount} 个分组`, href: "/admin/collection" },
    { key: "gallery", label: "相册", value: galleryCount, helper: "照片记录", href: "/admin/gallery" },
    { key: "projects", label: "项目", value: projectCount, helper: "作品展示", href: "/admin/projects" },
    { key: "friends", label: "友链", value: friendCount, helper: "站点朋友", href: "/admin/friends" },
    { key: "comments", label: "评论", value: writingCommentCount + noteCommentCount, helper: "文稿与手记", href: "/admin/comments" },
    { key: "guestbook", label: "留言", value: guestbookCount, helper: "留言板互动", href: "/admin/messages" },
  ];
}

async function getAdminManagementHealth(): Promise<AdminDashboardManagementHealth> {
  const [
    visibleThinking,
    hiddenThinking,
    visibleCollectionItems,
    hiddenCollectionItems,
    visibleGalleryPhotos,
    hiddenGalleryPhotos,
    featuredGalleryPhotos,
    visibleProjects,
    hiddenProjects,
    featuredProjects,
    pendingFriendLinks,
    approvedFriendLinks,
    approvedVisibleFriendLinks,
    approvedHiddenFriendLinks,
    rejectedFriendLinks,
    hiddenFriendLinks,
  ] = await Promise.all([
    readSingleNumber(() => db.select({ value: count() }).from(thinking).where(eq(thinking.isVisible, true))),
    readSingleNumber(() => db.select({ value: count() }).from(thinking).where(eq(thinking.isVisible, false))),
    readSingleNumber(() => db.select({ value: count() }).from(collectionItems).where(eq(collectionItems.isVisible, true))),
    readSingleNumber(() => db.select({ value: count() }).from(collectionItems).where(eq(collectionItems.isVisible, false))),
    readSingleNumber(() => db.select({ value: count() }).from(galleryPhotos).where(eq(galleryPhotos.isVisible, true))),
    readSingleNumber(() => db.select({ value: count() }).from(galleryPhotos).where(eq(galleryPhotos.isVisible, false))),
    readSingleNumber(() => db.select({ value: count() }).from(galleryPhotos).where(eq(galleryPhotos.isFeatured, true))),
    readSingleNumber(() => db.select({ value: count() }).from(projects).where(eq(projects.isVisible, true))),
    readSingleNumber(() => db.select({ value: count() }).from(projects).where(eq(projects.isVisible, false))),
    readSingleNumber(() => db.select({ value: count() }).from(projects).where(eq(projects.isFeatured, true))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(eq(friendLinks.status, "pending"))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(eq(friendLinks.status, "approved"))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(and(eq(friendLinks.status, "approved"), eq(friendLinks.isVisible, true)))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(and(eq(friendLinks.status, "approved"), eq(friendLinks.isVisible, false)))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(eq(friendLinks.status, "rejected"))),
    readSingleNumber(() => db.select({ value: count() }).from(friendLinks).where(eq(friendLinks.status, "hidden"))),
  ]);

  return {
    visibleTotal: visibleThinking + visibleCollectionItems + visibleGalleryPhotos + visibleProjects + approvedVisibleFriendLinks,
    hiddenTotal: hiddenThinking + hiddenCollectionItems + hiddenGalleryPhotos + hiddenProjects + approvedHiddenFriendLinks + hiddenFriendLinks,
    featuredGalleryPhotos,
    featuredProjects,
    friendStatuses: {
      pending: pendingFriendLinks,
      approved: approvedFriendLinks,
      rejected: rejectedFriendLinks,
      hidden: hiddenFriendLinks,
    },
  };
}

function getPendingWorkFromHealth(
  health: AdminDashboardManagementHealth,
): AdminDashboardOverview["pendingWork"] {
  const hiddenContentCount = health.hiddenTotal;
  const missingFeaturedGalleryCount = health.featuredGalleryPhotos === 0 ? 1 : 0;
  const missingFeaturedProjectCount = health.featuredProjects === 0 ? 1 : 0;
  const items: AdminDashboardPendingWorkItem[] = [
    {
      key: "friend-links-pending",
      label: "友链待审核",
      count: health.friendStatuses.pending,
      href: "/admin/friends",
      tone: health.friendStatuses.pending > 0 ? "amber" : "emerald",
      description: health.friendStatuses.pending > 0 ? "有新的友链申请需要处理" : "暂无待审核友链",
    },
    {
      key: "hidden-content",
      label: "未展示内容",
      count: hiddenContentCount,
      href: "/admin/collection",
      tone: hiddenContentCount > 0 ? "neutral" : "emerald",
      description: hiddenContentCount > 0 ? "存在已隐藏或未公开的内容" : "所有内容展示状态良好",
    },
    {
      key: "featured-gallery",
      label: "精选相册",
      count: missingFeaturedGalleryCount,
      href: "/admin/gallery",
      tone: missingFeaturedGalleryCount > 0 ? "amber" : "emerald",
      description: missingFeaturedGalleryCount > 0 ? "相册还没有精选封面" : "精选相册已配置",
    },
    {
      key: "featured-projects",
      label: "精选项目",
      count: missingFeaturedProjectCount,
      href: "/admin/projects",
      tone: missingFeaturedProjectCount > 0 ? "amber" : "emerald",
      description: missingFeaturedProjectCount > 0 ? "首页还没有精选项目" : "精选项目已配置",
    },
  ];

  return {
    total: health.friendStatuses.pending + hiddenContentCount + missingFeaturedGalleryCount + missingFeaturedProjectCount,
    items,
  };
}

async function getWritingCommentCountMap(ids: number[]) {
  if (ids.length === 0) {
    return new Map<number, number>();
  }

  const rows = await retryDatabaseRead(() =>
    db
      .select({ id: writingComments.writingId, value: count() })
      .from(writingComments)
      .where(inArray(writingComments.writingId, ids))
      .groupBy(writingComments.writingId),
  );

  return new Map(rows.map((row) => [row.id, toNumber(row.value)]));
}

async function getNoteCommentCountMap(ids: number[]) {
  if (ids.length === 0) {
    return new Map<number, number>();
  }

  const rows = await retryDatabaseRead(() =>
    db
      .select({ id: noteComments.noteId, value: count() })
      .from(noteComments)
      .where(inArray(noteComments.noteId, ids))
      .groupBy(noteComments.noteId),
  );

  return new Map(rows.map((row) => [row.id, toNumber(row.value)]));
}

async function getAdminContentPerformance(): Promise<AdminDashboardContentPerformance> {
  const [
    writingViews,
    noteViews,
    writingLikes,
    noteLikes,
    writingCommentCount,
    noteCommentCount,
    topWritingRows,
    topNoteRows,
  ] = await Promise.all([
    readSingleNumber(() => db.select({ value: sql<number>`coalesce(sum(${writings.views}), 0)` }).from(writings)),
    readSingleNumber(() => db.select({ value: sql<number>`coalesce(sum(${notes.views}), 0)` }).from(notes)),
    readSingleNumber(() => db.select({ value: sql<number>`coalesce(sum(${writings.likes}), 0)` }).from(writings)),
    readSingleNumber(() => db.select({ value: sql<number>`coalesce(sum(${notes.likes}), 0)` }).from(notes)),
    readSingleNumber(() => db.select({ value: count() }).from(writingComments)),
    readSingleNumber(() => db.select({ value: count() }).from(noteComments)),
    retryDatabaseRead(() =>
      db
        .select({ id: writings.id, title: writings.title, slug: writings.slug, views: writings.views, likes: writings.likes })
        .from(writings)
        .orderBy(desc(writings.views), desc(writings.likes))
        .limit(5),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: notes.id, title: notes.title, slug: notes.slug, views: notes.views, likes: notes.likes })
        .from(notes)
        .orderBy(desc(notes.views), desc(notes.likes))
        .limit(5),
    ),
  ]);
  const [writingCommentCounts, noteCommentCounts] = await Promise.all([
    getWritingCommentCountMap(topWritingRows.map((writing) => writing.id)),
    getNoteCommentCountMap(topNoteRows.map((note) => note.id)),
  ]);
  const views = writingViews + noteViews;
  const likes = writingLikes + noteLikes;
  const comments = writingCommentCount + noteCommentCount;
  const engagementRate = views > 0 ? ((likes + comments) / views) * 100 : 0;

  return {
    totals: {
      views,
      likes,
      comments,
      engagementRate,
    },
    topWritings: topWritingRows.map((writing) => ({
      title: writing.title,
      slug: writing.slug,
      views: writing.views,
      likes: writing.likes,
      comments: writingCommentCounts.get(writing.id) ?? 0,
      href: `/admin/writings/${writing.slug}/edit`,
    })),
    topNotes: topNoteRows.map((note) => ({
      title: note.title,
      slug: note.slug,
      views: note.views,
      likes: note.likes,
      comments: noteCommentCounts.get(note.id) ?? 0,
      href: `/admin/notes/${note.slug}/edit`,
    })),
  };
}

async function getAdminRecentActivity(limit = 8): Promise<AdminDashboardActivityItem[]> {
  const [
    recentWritings,
    recentNotes,
    recentThinking,
    recentCollectionItems,
    recentGalleryPhotos,
    recentProjects,
    recentFriendLinks,
    recentWritingComments,
    recentNoteComments,
    recentGuestbookComments,
  ] = await Promise.all([
    retryDatabaseRead(() =>
      db
        .select({ slug: writings.slug, title: writings.title, description: writings.description, updatedAt: writings.updatedAt })
        .from(writings)
        .orderBy(desc(writings.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ slug: notes.slug, title: notes.title, description: notes.description, updatedAt: notes.updatedAt })
        .from(notes)
        .orderBy(desc(notes.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: thinking.id, content: thinking.content, updatedAt: thinking.updatedAt })
        .from(thinking)
        .orderBy(desc(thinking.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: collectionItems.id, title: collectionItems.title, description: collectionItems.description, updatedAt: collectionItems.updatedAt })
        .from(collectionItems)
        .orderBy(desc(collectionItems.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: galleryPhotos.id, title: galleryPhotos.title, location: galleryPhotos.location, updatedAt: galleryPhotos.updatedAt })
        .from(galleryPhotos)
        .orderBy(desc(galleryPhotos.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: projects.id, title: projects.title, status: projects.status, updatedAt: projects.updatedAt })
        .from(projects)
        .orderBy(desc(projects.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: friendLinks.id, name: friendLinks.name, status: friendLinks.status, updatedAt: friendLinks.updatedAt })
        .from(friendLinks)
        .orderBy(desc(friendLinks.updatedAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: writingComments.id, content: writingComments.content, createdAt: writingComments.createdAt, targetTitle: writings.title })
        .from(writingComments)
        .innerJoin(writings, eq(writingComments.writingId, writings.id))
        .orderBy(desc(writingComments.createdAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: noteComments.id, content: noteComments.content, createdAt: noteComments.createdAt, targetTitle: notes.title })
        .from(noteComments)
        .innerJoin(notes, eq(noteComments.noteId, notes.id))
        .orderBy(desc(noteComments.createdAt))
        .limit(4),
    ),
    retryDatabaseRead(() =>
      db
        .select({ id: guestbookComments.id, content: guestbookComments.content, createdAt: guestbookComments.createdAt })
        .from(guestbookComments)
        .orderBy(desc(guestbookComments.createdAt))
        .limit(4),
    ),
  ]);
  const activities: AdminDashboardActivityItem[] = [
    ...recentWritings.map((writing) => ({
      id: `writing-${writing.slug}`,
      type: "writing" as const,
      label: "文稿",
      title: `更新文稿：${writing.title}`,
      description: createSnippet(writing.description),
      href: `/admin/writings/${writing.slug}/edit`,
      occurredAt: writing.updatedAt,
    })),
    ...recentNotes.map((note) => ({
      id: `note-${note.slug}`,
      type: "note" as const,
      label: "手记",
      title: `更新手记：${note.title}`,
      description: createSnippet(note.description),
      href: `/admin/notes/${note.slug}/edit`,
      occurredAt: note.updatedAt,
    })),
    ...recentThinking.map((item) => ({
      id: `thinking-${item.id}`,
      type: "thinking" as const,
      label: "思考",
      title: "更新思考",
      description: createSnippet(item.content),
      href: "/admin/thinking",
      occurredAt: item.updatedAt,
    })),
    ...recentCollectionItems.map((item) => ({
      id: `collection-${item.id}`,
      type: "collection" as const,
      label: "收藏",
      title: `更新收藏：${item.title}`,
      description: createSnippet(item.description),
      href: "/admin/collection",
      occurredAt: item.updatedAt,
    })),
    ...recentGalleryPhotos.map((photo) => ({
      id: `gallery-${photo.id}`,
      type: "gallery" as const,
      label: "相册",
      title: `更新照片：${photo.title}`,
      description: photo.location,
      href: "/admin/gallery",
      occurredAt: photo.updatedAt,
    })),
    ...recentProjects.map((project) => ({
      id: `project-${project.id}`,
      type: "project" as const,
      label: "项目",
      title: `更新项目：${project.title}`,
      description: project.status,
      href: "/admin/projects",
      occurredAt: project.updatedAt,
    })),
    ...recentFriendLinks.map((friend) => ({
      id: `friend-${friend.id}`,
      type: "friend" as const,
      label: "友链",
      title: friend.status === "pending" ? `友链申请：${friend.name}` : `更新友链：${friend.name}`,
      description: friend.status === "pending" ? "等待审核" : "友链信息已更新",
      href: "/admin/friends",
      occurredAt: friend.updatedAt,
    })),
    ...recentWritingComments.map((comment) => ({
      id: `writing-comment-${comment.id}`,
      type: "comment" as const,
      label: "评论",
      title: `收到文稿评论：${comment.targetTitle}`,
      description: createSnippet(comment.content),
      href: "/admin/comments",
      occurredAt: comment.createdAt,
    })),
    ...recentNoteComments.map((comment) => ({
      id: `note-comment-${comment.id}`,
      type: "comment" as const,
      label: "评论",
      title: `收到手记评论：${comment.targetTitle}`,
      description: createSnippet(comment.content),
      href: "/admin/comments",
      occurredAt: comment.createdAt,
    })),
    ...recentGuestbookComments.map((comment) => ({
      id: `guestbook-${comment.id}`,
      type: "guestbook" as const,
      label: "留言",
      title: "收到留言",
      description: createSnippet(comment.content),
      href: "/admin/messages",
      occurredAt: comment.createdAt,
    })),
  ];

  return activities
    .sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime())
    .slice(0, limit);
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverview> {
  const [moduleCounts, managementHealth, recentActivity, contentPerformance] = await Promise.all([
    getAdminModuleCounts(),
    getAdminManagementHealth(),
    getAdminRecentActivity(),
    getAdminContentPerformance(),
  ]);

  return {
    generatedAt: new Date(),
    moduleCounts,
    pendingWork: getPendingWorkFromHealth(managementHealth),
    recentActivity,
    contentPerformance,
    managementHealth,
  };
}
