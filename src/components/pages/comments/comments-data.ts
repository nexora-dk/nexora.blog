export type CommentReply = {
  name: string;
  role?: string;
  date: string;
  message: string;
  avatar: string;
};

export type CommentItem = {
  name: string;
  role?: string;
  date: string;
  location?: string;
  message: string;
  avatar: string;
  replies?: CommentReply[];
};

export const commentItems: CommentItem[] = [
  {
    name: "路过的朋友",
    date: "刚刚",
    message: "共勉，加油！！！",
    avatar: "友",
    replies: [
      {
        name: "Nexora",
        role: "站长",
        date: "刚刚",
        message: "一起加油，欢迎常来坐坐。",
        avatar: "N",
      },
    ],
  },
  {
    name: "Lark-AI",
    date: "1 天前",
    message: "想问问这个博客系统后续会开源吗？如果可以部署自己的版本就太好了。",
    avatar: "L",
    replies: [
      {
        name: "Nexora",
        role: "站长",
        date: "1 天前",
        message: "会考虑整理成可复用版本，不过要先把评论、文章和后台体验打磨好。",
        avatar: "N",
      },
    ],
  },
  {
    name: "specialhua",
    date: "3 天前",
    message: "页面的风格很清爽，尤其是自述和时间线部分，读起来有种安静记录生活的感觉。",
    avatar: "S",
  },
  {
    name: "Noarii",
    date: "2026年5月6日 星期三",
    location: "来自：个人博客访客",
    message: "留言功能准备好以后，可以在这里留下建议、问题，或者只是简单打个招呼。",
    avatar: "の",
  },
];
