// CommentReply 描述一条评论回复的数据结构。
export type CommentReply = {
  // name 是回复者名称。
  name: string;
  // role 是可选身份标签，例如站长。
  role?: string;
  // date 是回复时间文案。
  date: string;
  // message 是回复正文。
  message: string;
  // avatar 是头像字符占位。
  avatar: string;
};

// CommentItem 描述顶层留言，字段在 CommentCard 和 CommentBubble 中消费。
export type CommentItem = {
  name: string;
  role?: string;
  date: string;
  // location 只存在于顶层留言，渲染前会用 in 运算符判断。
  location?: string;
  message: string;
  avatar: string;
  // replies 是可选回复列表，存在时会在顶层留言下循环渲染。
  replies?: CommentReply[];
};

// commentItems 是留言页面的静态数据源，用于展示初始留言和回复。
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
