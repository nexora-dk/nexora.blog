import {
  FolderHeart,
  GalleryHorizontalEnd,
  Grid2X2,
  HeartHandshake,
  Images,
  LayoutDashboard,
  MessageCircle,
  MessageSquareText,
  NotebookPen,
  PenLine,
  Settings,
  Sparkles,
} from "lucide-react";

export const adminNavItems = [
  { title: "仪表盘", href: "/admin", icon: LayoutDashboard },
  { title: "文稿", href: "/admin/writings", icon: PenLine },
  { title: "手记", href: "/admin/notes", icon: NotebookPen },
  { title: "思考", href: "/admin/thinking", icon: Sparkles },
  { title: "评论", href: "/admin/comments", icon: MessageSquareText },
  { title: "留言", href: "/admin/messages", icon: MessageCircle },
  { title: "收藏", href: "/admin/collection", icon: FolderHeart },
  { title: "相册", href: "/admin/gallery", icon: Images },
  { title: "项目", href: "/admin/projects", icon: Grid2X2 },
  { title: "友链", href: "/admin/friends", icon: HeartHandshake },
  { title: "设置", href: "/admin/settings", icon: Settings },
] as const;

export const adminSectionIcons = {
  dashboard: LayoutDashboard,
  projects: GalleryHorizontalEnd,
};
