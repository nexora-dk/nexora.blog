// FriendLink 描述友链卡片所需的全部数据字段。
export type FriendLink = {
  // name 用于展示站点名称，同时作为列表渲染 key。
  name: string;
  // description 是友链简介，会在卡片内以多行截断方式展示。
  description: string;
  // href 是点击友链卡片后的跳转地址。
  href: string;
  // avatar 是圆形头像区域展示的字符占位。
  avatar: string;
};

// friendLinks 是友链页面的静态数据源，FriendsContent 会遍历它生成卡片列表。
export const friendLinks: FriendLink[] = [
  {
    name: "星河旅人",
    description: "记录前端、生活和小灵感。",
    href: "#",
    avatar: "星",
  },
  {
    name: "猫尾实验室",
    description: "喜欢折腾交互动画和有趣的小工具。",
    href: "#",
    avatar: "猫",
  },
  {
    name: "午后代码",
    description: "写代码，也写日常，偶尔分享踩坑笔记。",
    href: "#",
    avatar: "午",
  },
  {
    name: "蓝莓汽水",
    description: "一个收集 UI 灵感和网页设计案例的角落。",
    href: "#",
    avatar: "蓝",
  },
  {
    name: "像素花园",
    description: "关于独立开发、产品想法和个人成长。",
    href: "#",
    avatar: "像",
  },
  {
    name: "云端手记",
    description: "长期更新工程化、部署和学习路线。",
    href: "#",
    avatar: "云",
  },
];
