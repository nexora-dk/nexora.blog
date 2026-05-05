export const siteConfig = {
  name: "Nexora's",
  description: "一个爱捣鼓的前端",
  nav: [
    {
      title: "首页",
      href: "/",
      panel: { type: "home" },
    },
    {
      title: "文稿",
      href: "/writing",
      panel: { type: "writing" },
    },
    {
      title: "手记",
      href: "/notes",
      panel: { type: "notes" },
    },
    {
      title: "时光",
      href: "/timeline",
      panel: { type: "timeline" },
    },
    {
      title: "思考",
      href: "/thinking",
    },
    {
      title: "更多",
      panel: { type: "more" },
    },
  ],
} as const;
