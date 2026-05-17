export type FriendLink = {
  name: string;
  description: string;
  avatarUrl: string;
  blogUrl: string;
};

const defaultAvatarUrl = "https://nexora.blog/images/avatar/avatar.jpg";

export const friendLinks: FriendLink[] = [
  {
    name: "星河旅人",
    description: "记录前端、生活和小灵感。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
  {
    name: "猫尾实验室",
    description: "喜欢折腾交互动画和有趣的小工具。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
  {
    name: "午后代码",
    description: "写代码，也写日常，偶尔分享踩坑笔记。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
  {
    name: "蓝莓汽水",
    description: "一个收集 UI 灵感和网页设计案例的角落。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
  {
    name: "像素花园",
    description: "关于独立开发、产品想法和个人成长。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
  {
    name: "云端手记",
    description: "长期更新工程化、部署和学习路线。",
    avatarUrl: defaultAvatarUrl,
    blogUrl: "https://nexora.blog/",
  },
];
