// ProjectItem 描述项目卡片展示所需的数据结构。
export type ProjectItem = {
  // title 是项目名称，同时用于列表 key。
  title: string;
  // description 是项目简介，会在卡片正文中显示并限制行数。
  description: string;
  // status 表示项目阶段，当前数据保留给后续展示扩展。
  status: string;
  // category 表示项目分类，当前数据保留给后续展示扩展。
  category: string;
  // tags 是技术或主题标签数组，ProjectCard 会循环渲染。
  tags: string[];
  // href 是可选的项目访问地址。
  href?: string;
  // repoHref 是可选的代码仓库地址。
  repoHref?: string;
  // developmentTime 是项目开发或计划时间，在卡片头图区域展示。
  developmentTime: string;
};

// projectItems 是项目页面的静态项目列表，由 ProjectsContent 遍历生成卡片。
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

