export type ArticleCategory = "programming" | "tinkering" | "archive" | "tech";

export type WritingCategory = {
  label: string;
  value: ArticleCategory;
};

export type ArticleItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  category: ArticleCategory;
  categoryLabel: string;
  tags: string[];
  readingTime: string;
  views: string;
  likes: string;
};

export const writingCategories: WritingCategory[] = [
  { label: "编程", value: "programming" },
  { label: "折腾", value: "tinkering" },
  { label: "归档", value: "archive" },
  { label: "技术", value: "tech" },
];

export const articleItems: ArticleItem[] = [
  {
    title: "AI 时代的重构方式：从 RFC 到五个 Plan",
    description: "从需求梳理到实施计划，记录一次在 AI 辅助开发中更稳妥推进重构的方式。",
    href: "/writing/ai-rfc-plan",
    date: "2026年3月9日星期一",
    category: "tech",
    categoryLabel: "技术",
    tags: ["AI", "重构", "工程化"],
    readingTime: "8 分钟",
    views: "1.2k",
    likes: "86",
  },
  {
    title: "初探 Context Engineering",
    description: "整理上下文工程的基础概念，以及它在日常开发、提示词组织和协作流程里的作用。",
    href: "/writing/context-engineering",
    date: "2025年7月11日星期五",
    category: "programming",
    categoryLabel: "编程",
    tags: ["Context", "LLM", "Prompt"],
    readingTime: "6 分钟",
    views: "986",
    likes: "64",
  },
  {
    title: "虚拟列表中的选区操作",
    description: "记录虚拟列表里实现连续选择、多选和滚动同步时遇到的细节。",
    href: "/writing/virtual-list-selection",
    date: "2024年4月15日星期一",
    category: "programming",
    categoryLabel: "编程",
    tags: ["React", "交互", "性能"],
    readingTime: "10 分钟",
    views: "742",
    likes: "51",
  },
  {
    title: "Server Action & Streamable UI",
    description: "一次关于 Server Action、流式 UI 和前后端协作边界的学习笔记。",
    href: "/writing/server-action-streamable-ui",
    date: "2024年3月6日星期三",
    category: "tinkering",
    categoryLabel: "折腾",
    tags: ["Next.js", "Server Action", "Stream"],
    readingTime: "7 分钟",
    views: "658",
    likes: "43",
  },
  {
    title: "把博客首页重做成一张安静的书桌",
    description: "记录视觉方向、布局节奏和内容层级如何一起服务于个人站点的气质。",
    href: "/writing/quiet-desk-homepage",
    date: "2026年1月18日星期日",
    category: "tech",
    categoryLabel: "技术",
    tags: ["设计", "博客", "UI"],
    readingTime: "5 分钟",
    views: "812",
    likes: "52",
  },
  {
    title: "给组件留白：一次 Tailwind 与 CSS Module 的分工",
    description: "把页面级布局交给 Tailwind，把细腻交互和动画留给 CSS Module。",
    href: "/writing/tailwind-css-module-balance",
    date: "2025年11月2日星期日",
    category: "programming",
    categoryLabel: "编程",
    tags: ["Tailwind", "CSS", "组件"],
    readingTime: "7 分钟",
    views: "903",
    likes: "61",
  },
  {
    title: "在 Next.js 里整理 MDX 内容流",
    description: "从 frontmatter、阅读时间到文章索引，搭出一个可维护的内容管线。",
    href: "/writing/next-mdx-content-flow",
    date: "2025年8月24日星期日",
    category: "programming",
    categoryLabel: "编程",
    tags: ["Next.js", "MDX", "内容"],
    readingTime: "9 分钟",
    views: "1.1k",
    likes: "78",
  },
  {
    title: "把旧笔记迁移进新的归档结构",
    description: "整理标题、标签、日期和链接时，顺手把内容的可发现性重新设计了一遍。",
    href: "/writing/archive-migration-notes",
    date: "2025年5月16日星期五",
    category: "archive",
    categoryLabel: "归档",
    tags: ["归档", "笔记", "整理"],
    readingTime: "6 分钟",
    views: "534",
    likes: "37",
  },
  {
    title: "导航二级面板的玻璃感尝试",
    description: "通过模糊、透明度和轻量边框，让导航面板既有层次又不过分抢眼。",
    href: "/writing/navigation-glass-panel",
    date: "2025年3月28日星期五",
    category: "tinkering",
    categoryLabel: "折腾",
    tags: ["导航", "动效", "视觉"],
    readingTime: "4 分钟",
    views: "476",
    likes: "29",
  },
  {
    title: "用数据文件驱动文章列表",
    description: "在真实内容系统完成前，先用类型安全的数据文件承载列表和详情入口。",
    href: "/writing/data-driven-writing-list",
    date: "2024年11月9日星期六",
    category: "programming",
    categoryLabel: "编程",
    tags: ["TypeScript", "数据", "列表"],
    readingTime: "5 分钟",
    views: "689",
    likes: "45",
  },
  {
    title: "给暗色模式调一层更温柔的灰",
    description: "避免纯黑和高对比，让阅读页在夜间也保持低负担的视觉层次。",
    href: "/writing/soft-dark-mode",
    date: "2024年8月13日星期二",
    category: "tech",
    categoryLabel: "技术",
    tags: ["暗色模式", "设计", "CSS"],
    readingTime: "5 分钟",
    views: "621",
    likes: "42",
  },
  {
    title: "把零散想法放回时间线",
    description: "用年份、月份和标签把碎片重新串起来，让文章列表更像一份生活索引。",
    href: "/writing/timeline-as-index",
    date: "2023年10月6日星期五",
    category: "archive",
    categoryLabel: "归档",
    tags: ["时间线", "信息架构", "博客"],
    readingTime: "6 分钟",
    views: "588",
    likes: "39",
  },
  {
    title: "周末把站点的细节又磨了一遍",
    description: "一些按钮、边框、hover 状态和字重的小修小补。",
    href: "/writing/weekend-polish",
    date: "2023年6月17日星期六",
    category: "tinkering",
    categoryLabel: "折腾",
    tags: ["打磨", "UI", "细节"],
    readingTime: "3 分钟",
    views: "421",
    likes: "28",
  },
  {
    title: "我如何给文章命名和打标签",
    description: "把标题当作入口，把标签当作线索，减少归档系统里的噪声。",
    href: "/writing/title-and-tagging",
    date: "2022年12月3日星期六",
    category: "archive",
    categoryLabel: "归档",
    tags: ["标签", "写作", "整理"],
    readingTime: "4 分钟",
    views: "377",
    likes: "25",
  },
  {
    title: "第一次把个人站点跑起来",
    description: "从脚手架、字体到第一版导航，记录这个博客最初的样子。",
    href: "/writing/first-personal-site",
    date: "2021年9月12日星期日",
    category: "archive",
    categoryLabel: "归档",
    tags: ["个人站", "Next.js", "开始"],
    readingTime: "5 分钟",
    views: "463",
    likes: "31",
  },
];

export function isArticleCategory(category: string | undefined): category is ArticleCategory {
  return writingCategories.some((item) => item.value === category);
}
