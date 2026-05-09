// readmeTocItems 定义自述页面右侧目录的数据源，与正文 section 的 id 一一对应。
export const readmeTocItems = [
  { href: "#intro", label: "自述" },
  { href: "#interests", label: "兴趣爱好" },
  { href: "#status", label: "目前状况" },
  { href: "#future", label: "展望未来" },
] as const;

// initialReadmeSectionId 取第一项目录的锚点 id，作为页面初始高亮章节。
export const initialReadmeSectionId = readmeTocItems[0].href.slice(1);
