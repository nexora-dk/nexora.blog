export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  rssUrl: string;
  seoTitleTemplate: string;
  seoKeywords: string[];
  seoDescription: string;
  authorName: string;
  avatarUrl: string;
  signatureUrl: string;
  contactEmail: string;
  githubUrl: string;
  neteaseMusicUrl: string;
  douyinUrl: string;
  wechatQrUrl: string;
  footerDescription: string;
  footerStatusText: string;
  homeHeroPrefix: string;
  homeHeroSuffix: string;
  homeShareText: string;
  homeLocationText: string;
  homeRotatingTexts: string[];
  learningStartedAt: string;
  mottoCodeText: string;
  mottoCnPrefix: string;
  mottoCnHighlightA: string;
  mottoCnMiddle: string;
  mottoCnHighlightB: string;
  mottoCnSuffix: string;
  mottoEnText: string;
  friendPageTitle: string;
  friendPageDescription: string;
  friendApplyEnabled: boolean;
  friendApplyIntro: string;
  friendApplyNotes: string[];
  friendOwnName: string;
  friendOwnUrl: string;
  friendOwnAvatarUrl: string;
  friendOwnDescription: string;
  friendApplySuccessMessage: string;
  adminPageSize: number;
  adminDefaultEntry: string;
};

export const defaultSiteSettings: SiteSettings = {
  siteName: "Nexora's Space",
  siteDescription: "一个爱捣鼓的前端",
  siteUrl: "https://nexora.space",
  rssUrl: "/rss.xml",
  seoTitleTemplate: "%s | Nexora's Space",
  seoKeywords: ["Next.js", "React", "Frontend", "Blog"],
  seoDescription: "Nexora's Space 是一个记录前端、生活、思考和长期成长的个人博客。",
  authorName: "Nexora",
  avatarUrl: "/images/avatar/avatar.jpg",
  signatureUrl: "/images/signature/signature.svg",
  contactEmail: "codernexora@foxmail.com",
  githubUrl: "https://github.com/Nexora-ydk",
  neteaseMusicUrl: "https://music.163.com/#/user/home?id=1598827836",
  douyinUrl: "https://www.douyin.com/user/self?from_tab_name=main",
  wechatQrUrl: "/images/wechat-qr.jpg",
  footerDescription: "一个爱捣鼓的前端，记录代码、生活和一些阶段性的想法。",
  footerStatusText: "持续折腾中",
  homeHeroPrefix: "我是",
  homeHeroSuffix: "，一个爱捣鼓的码农",
  homeShareText: "在这里分享",
  homeLocationText: "广东 • UTC/GMT +8",
  homeRotatingTexts: [
    "记录生活的照片",
    "随性记录的手记",
    "私藏已久的好物",
    "奇妙的代码世界",
    "鲜活的生活切片",
  ],
  learningStartedAt: "2026-01-20T00:00:00+08:00",
  mottoCodeText: 'console.log("Hello World")',
  mottoCnPrefix: "今天的",
  mottoCnHighlightA: "“世界你好”",
  mottoCnMiddle: "，就是明天的",
  mottoCnHighlightB: "“改变世界”",
  mottoCnSuffix: "。",
  mottoEnText: "Today's “Hello World” is tomorrow's change the world.",
  friendPageTitle: "友链",
  friendPageDescription: "互联网上走散又相遇的朋友。",
  friendApplyEnabled: true,
  friendApplyIntro: "提交后会进入待审核状态，审核通过后公开展示。",
  friendApplyNotes: ["请先在你的友链中添加本站", "确保你的网站可以正常访问", "博客内容不违反国家法律法规"],
  friendOwnName: "nexora",
  friendOwnUrl: "https://nexora.blog/",
  friendOwnAvatarUrl: "https://nexora.blog/images/avatar/avatar.jpg",
  friendOwnDescription: "不努力就只能旁听别人的好消息",
  friendApplySuccessMessage: "申请已提交，审核通过后会展示在友链页。",
  adminPageSize: 5,
  adminDefaultEntry: "/admin/writings",
};
