export const readmeTocItems = [
  { href: "#intro", label: "自述" },
  { href: "#interests", label: "兴趣爱好" },
  { href: "#status", label: "目前状况" },
  { href: "#future", label: "展望未来" },
] as const;

export const initialReadmeSectionId = readmeTocItems[0].href.slice(1);
