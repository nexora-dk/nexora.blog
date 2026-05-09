// simple-icons 图标名称白名单，CollectionCard 会用这些字符串映射到具体图标组件。
export type SimpleIconName =
  | "tldraw"
  | "excalidraw"
  | "figma"
  | "github"
  | "iconify"
  | "railway"
  | "resend"
  | "nextdotjs"
  | "drizzle"
  | "vercel"
  | "supabase"
  | "upstash"
  | "awwwards"
  | "dribbble"
  | "shadcnui"
  | "daisyui";

// 收藏图标的联合类型：可以使用 simple-icons，也可以使用本地图片资源。
export type CollectionIcon =
  | {
      // simple 类型通过 name 从映射表中找到对应图标组件。
      type: "simple";
      name: SimpleIconName;
      className?: string;
    }
  | {
      // image 类型通过 src/alt 渲染本地图片；src 为空时由卡片组件展示占位图标。
      type: "image";
      src?: string;
      alt?: string;
      className?: string;
    };

// 单个收藏条目的数据结构，href 可选以支持暂不提供跳转的收藏项。
export type CollectionItem = {
  title: string;
  description: string;
  href?: string;
  icon: CollectionIcon;
};

// 收藏分组结构，页面按 group 渲染标题和卡片网格。
export type CollectionGroup = {
  title: string;
  items: CollectionItem[];
};

// 收藏页面的完整分组数据源，按工具、设计、开发、组件库等主题组织。
export const collectionGroups: CollectionGroup[] = [
  {
    title: "好用工具",
    items: [
      {
        title: "Tldraw",
        description: "在线白板与草图工具",
        href: "https://www.tldraw.com/",
        icon: { type: "simple", name: "tldraw" },
      },
      {
        title: "Excalidraw",
        description: "手绘风格流程图工具",
        href: "https://excalidraw.com/",
        icon: { type: "simple", name: "excalidraw", className: "text-[#6965db]" },
      },
      {
        title: "草料二维码",
        description: "二维码生成与管理工具",
        href: "https://cli.im/",
        icon: { type: "image", src: "/images/collection-icon/caoliaoerweima.png", alt: "草料二维码" },
      },
      {
        title: "Squoosh",
        description: "图片压缩工具",
        href: "https://squoosh.app/",
        icon: { type: "image", src: "/images/collection-icon/squoosh.png", alt: "Squoosh" },
      },
    ],
  },
  {
    title: "美工设计",
    items: [
      {
        title: "Figma",
        description: "The Collaborative Interface Design Tool",
        href: "https://www.figma.com/",
        icon: { type: "simple", name: "figma" },
      },
      {
        title: "改图宝",
        description: "快速、简单的在线修改图片工具",
        href: "https://www.gaitubao.com/",
        icon: { type: "image", src: "/images/collection-icon/gaitubao.png", alt: "改图宝" },
      },
    ],
  },
  {
    title: "技术开发",
    items: [
      {
        title: "GitHub",
        description: "全球最大的开源代码托管平台，开发者的聚集地。",
        href: "https://github.com/",
        icon: { type: "simple", name: "github" },
      },
      {
        title: "Iconify",
        description: "All popular icon sets, one framework.",
        href: "https://icon-sets.iconify.design/",
        icon: { type: "simple", name: "iconify" },
      },
      {
        title: "Railway",
        description: "Shipping great products is hard. Scaling infrastructure is easy.",
        href: "https://railway.com/",
        icon: { type: "simple", name: "railway" },
      },
      {
        title: "Resend",
        description: "The best way to reach humans instead of spam folders.",
        href: "https://resend.com/",
        icon: { type: "simple", name: "resend" },
      },
      {
        title: "bolt.new",
        description: "AI-Powered Web Development at Your Fingertips",
        href: "https://bolt.new/",
        icon: { type: "image", src: "/images/collection-icon/boltnew.svg", alt: "bolt.new" },
      },
      {
        title: "Logto",
        description: "The better auth and identity infrastructure",
        href: "https://auth.logto.io/",
        icon: { type: "image", src: "/images/collection-icon/logto.png", alt: "Logto" },
      },
    ],
  },
  {
    title: "开发套餐",
    items: [
      {
        title: "Nextjs",
        description: "The React Framework for the Web.",
        href: "https://nextjs.org/",
        icon: { type: "simple", name: "nextdotjs" },
      },
      {
        title: "Drizzle-orm",
        description: "Drizzle ORM is a headless TypeScript ORM with a head.",
        href: "https://orm.drizzle.team/",
        icon: { type: "simple", name: "drizzle" },
      },
      {
        title: "Vercel",
        description: "一个云平台，用于构建、部署和扩展静态网站与应用。",
        href: "https://vercel.com/",
        icon: { type: "simple", name: "vercel" },
      },
      {
        title: "Supabase",
        description: "Supabase is an open source Firebase alternative.",
        href: "https://supabase.com/",
        icon: { type: "simple", name: "supabase" },
      },
      {
        title: "Upstash",
        description: "Redis Serverless Server",
        href: "https://upstash.com/",
        icon: { type: "simple", name: "upstash" },
      },
    ],
  },
  {
    title: "灵感找寻",
    items: [
      {
        title: "Codepen",
        description: "An online community for testing and showcasing user-created HTML, CSS and JS.",
        href: "https://codepen.io/",
        icon: { type: "image", src: "/images/collection-icon/codepen.png", alt: "Codepen" },
      },
      {
        title: "uiverse",
        description: "The Largest Library of Open-Source UI",
        href: "https://uiverse.io/",
        icon: { type: "image", src: "/images/collection-icon/uiverse.png", alt: "uiverse" },
      },
      {
        title: "awwwards",
        description: "Website Awards - Best Web Design Trends",
        href: "https://www.awwwards.com/",
        icon: { type: "simple", name: "awwwards" },
      },
      {
        title: "dribbble",
        description: "Discover the world's top designers",
        href: "https://dribbble.com/",
        icon: { type: "simple", name: "dribbble" },
      },
      {
        title: "UI 中国",
        description: "一个设计师必逛的灵感网站！",
        href: "https://www.ui.cn/",
        icon: { type: "image", src: "/images/collection-icon/uichina.png", alt: "UI 中国" },
      },
    ],
  },
  {
    title: "UI 组件库",
    items: [
      {
        title: "Shadcn UI",
        description: "A set of beautifully-designed, accessible and customizable components.",
        href: "https://ui.shadcn.com/",
        icon: { type: "simple", name: "shadcnui" },
      },
      {
        title: "Daisy UI",
        description: "The most popular component library for Tailwind CSS",
        href: "https://daisyui.com/",
        icon: { type: "simple", name: "daisyui" },
      },
      {
        title: "Hover.dev",
        description: "Animated UI Component and Template for React",
        href: "https://www.hover.dev/",
        icon: { type: "image", src: "/images/collection-icon/hover.png", alt: "Hover.dev" },
      },
      {
        title: "Magic UI",
        description: "UI library for Design Engineers",
        href: "https://magicui.design/",
        icon: { type: "image", src: "/images/collection-icon/magic.png", alt: "Magic UI" },
      },
      {
        title: "Aceternity UI",
        description: "Make your websites look 10x better",
        href: "https://ui.aceternity.com/",
        icon: { type: "image", src: "/images/collection-icon/aceternityuI.png", alt: "Aceternity UI" },
      },
      {
        title: "Lunar UI",
        description: "Build sites that sell well.",
        href: "https://lunarui.dev/",
        icon: { type: "image", src: "/images/collection-icon/lunar.png", alt: "Lunar UI" },
      },
      {
        title: "Animata Design",
        description: "Hand-crafted interaction animations and effects from around the web.",
        href: "https://animata.design/",
        icon: { type: "image", src: "", alt: "Animata Design" },
      },
      {
        title: "Inspira UI",
        description: "Build beautiful websites using Vue & Nuxt",
        href: "https://inspira-ui.com/",
        icon: { type: "image", src: "", alt: "Inspira UI" },
      },
      {
        title: "Reactbits",
        description: "Animated UI Components For React",
        href: "https://www.reactbits.dev/",
        icon: { type: "image", src: "/images/collection-icon/reactbits.png", alt: "Reactbits" },
      },
    ],
  },
];
