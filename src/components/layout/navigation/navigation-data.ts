import { getGalleryPhotos } from "@/db/queries/gallery.query";
import { getCollectionGroups } from "@/db/queries/collection.query";
import { getFriendLinks } from "@/db/queries/friend-links.query";
import { getNoteItems } from "@/db/queries/notes.query";
import { getProjects } from "@/db/queries/projects.query";
import { getDatabaseErrorMessage } from "@/db/queries/retry";
import { getTimelineItemsFromDb } from "@/db/queries/timeline.query";
import { getWritingItems } from "@/db/queries/writings.query";
import {
  getArticleItemsFromMarkdown,
  writingCategories,
} from "@/components/pages/writing/writing-data";
import { noteColumns, noteItems } from "@/components/pages/notes/notes-data";
import { getDateParts } from "@/components/pages/timeline/timeline-data";
import type { SiteSettings } from "@/lib/site-settings-defaults";

export type NavigationLink = {
  title: string;
  href: string;
};

export type HomePanelData = {
  profile: {
    name: string;
    avatarUrl: string;
    status: string;
  };
  links: NavigationLink[];
};

export type WritingPanelData = {
  categories: Array<{
    title: string;
    count: number;
    href: string;
  }>;
  recentPosts: Array<{
    title: string;
    date: string;
    href: string;
  }>;
  totalCount: number;
};

export type NotesPanelData = {
  columns: Array<{
    value: string;
    title: string;
    href: string;
  }>;
  recentNotes: Array<{
    title: string;
    date: string;
    href: string;
  }>;
  totalCount: number;
};

export type TimelinePanelData = {
  links: Array<{
    title: string;
    href: string;
    iconKey: "notebook-pen" | "pen-tool" | "heart";
  }>;
  recentActivities: Array<{
    title: string;
    date: string;
    href: string;
    typeLabel: string;
  }>;
};

export type MorePanelData = {
  links: Array<{
    title: string;
    href: string;
    description: string;
    iconKey: "images" | "box" | "folder-cog" | "users" | "user";
  }>;
};

export type NavigationPanelData = {
  home: HomePanelData;
  writing: WritingPanelData;
  notes: NotesPanelData;
  timeline: TimelinePanelData;
  more: MorePanelData;
  mobileSecondaryLinks: NavigationLink[];
};

const homeLinks: NavigationLink[] = [
  { title: "留言", href: "/Comments" },
  { title: "自述", href: "/Readme" },
  { title: "此站点", href: "/Site" },
  { title: "迭代", href: "/Iteration" },
  { title: "赞助", href: "/Sponsor" },
];

const timelineLinks: TimelinePanelData["links"] = [
  { title: "文稿", href: "/timeline?type=writing", iconKey: "notebook-pen" },
  { title: "手记", href: "/timeline?type=notes", iconKey: "pen-tool" },
  { title: "回忆", href: "/timeline?type=memory", iconKey: "heart" },
];

async function safeQuery<T>(label: string, query: () => Promise<T>, fallback: T) {
  try {
    return await query();
  } catch (error) {
    console.warn(`Failed to load ${label}: ${getDatabaseErrorMessage(error)}`);
    return fallback;
  }
}

export async function getNavigationPanelData(settings: SiteSettings): Promise<NavigationPanelData> {
  const [writings, notes, galleryPhotos, collectionGroups, projects, friendLinks] = await Promise.all([
    safeQuery("navigation writings", getWritingItems, getArticleItemsFromMarkdown()),
    safeQuery("navigation notes", getNoteItems, noteItems),
    safeQuery("navigation gallery", getGalleryPhotos, []),
    safeQuery("navigation collection", getCollectionGroups, []),
    safeQuery("navigation projects", getProjects, []),
    safeQuery("navigation friend links", getFriendLinks, []),
  ]);
  const timelineItems = await safeQuery("navigation timeline", () => getTimelineItemsFromDb(), []);
  const collectionCount = collectionGroups.reduce((count, group) => count + group.items.length, 0);
  const moreLinks: MorePanelData["links"] = [
    {
      title: "相册",
      href: "/gallery",
      description: `${galleryPhotos.length} 张按下快门的瞬间`,
      iconKey: "images",
    },
    {
      title: "收藏",
      href: "/collection",
      description: `${collectionCount} 个值得反复回访的链接`,
      iconKey: "box",
    },
    {
      title: "项目",
      href: "/projects",
      description: `${projects.length} 个亲手造过的开源东西`,
      iconKey: "folder-cog",
    },
    {
      title: "友链",
      href: "/friends",
      description: `${friendLinks.length} 位互联网上的朋友`,
      iconKey: "users",
    },
    {
      title: "关于",
      href: "/about",
      description: "关于我与这个站点",
      iconKey: "user",
    },
  ];

  return {
    home: {
      profile: {
        name: settings.authorName,
        avatarUrl: settings.avatarUrl,
        status: settings.footerStatusText,
      },
      links: homeLinks,
    },
    writing: {
      categories: writingCategories.map((category) => ({
        title: category.label,
        href: `/writing?category=${category.value}`,
        count: writings.filter((writing) => writing.category === category.value).length,
      })),
      recentPosts: writings.slice(0, 4).map((writing) => ({
        title: writing.title,
        date: writing.date,
        href: writing.href,
      })),
      totalCount: writings.length,
    },
    notes: {
      columns: noteColumns.map((column) => ({
        value: column.value,
        title: column.label,
        href: `/notes?column=${column.value}`,
      })),
      recentNotes: notes.slice(0, 4).map((note) => ({
        title: note.title,
        date: note.publishedAt,
        href: note.href,
      })),
      totalCount: notes.length,
    },
    timeline: {
      links: timelineLinks,
      recentActivities: timelineItems.slice(0, 4).map((item) => ({
        title: item.title,
        date: getDateParts(item.date).shortDate,
        href: item.href,
        typeLabel: item.typeLabel,
      })),
    },
    more: {
      links: moreLinks,
    },
    mobileSecondaryLinks: [
      ...homeLinks,
      ...moreLinks.map((link) => ({ title: link.title, href: link.href })),
    ],
  };
}
