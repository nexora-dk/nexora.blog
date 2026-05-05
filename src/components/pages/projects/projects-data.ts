export type ProjectItem = {
  title: string;
  description: string;
  status: string;
  category: string;
  tags: string[];
  href?: string;
  repoHref?: string;
  developmentTime: string;
};

export const projectItems: ProjectItem[] = [
  {
    title: "Personal Blog",
    description: "一个用 Next.js 搭建的个人博客，用来记录文章、手记、项目和长期收藏。",
    status: "Building",
    category: "个人站点",
    developmentTime: "2026.04",
    tags: ["Next.js", "Tailwind CSS", "MDX"],
    href: "/",
    repoHref: "#",
  },
  {
    title: "Frontend Notes",
    description: "整理前端学习路线、工程化经验和一些容易忘记的实现细节。",
    status: "Writing",
    category: "笔记系统",
    developmentTime: "2026.05",
    tags: ["React", "TypeScript", "Notes"],
    href: "/writing",
    repoHref: "#",
  },
  {
    title: "Tiny Tools",
    description: "收集日常开发中顺手做的小工具，把重复工作变成可复用的页面。",
    status: "Planned",
    category: "实验项目",
    developmentTime: "未开始",
    tags: ["Tools", "UI", "Workflow"],
  },
  {
    title: "Design Lab",
    description: "用于尝试交互动效、页面排版和组件视觉风格的实验场。",
    status: "Exploring",
    category: "设计实验",
    developmentTime: "2026.05",
    tags: ["Animation", "Design", "Prototype"],
  },
];

export const projectStats = ["持续迭代中", "开源优先", "记录构建过程"];
