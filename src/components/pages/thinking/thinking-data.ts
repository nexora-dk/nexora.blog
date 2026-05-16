// ThinkingItem 描述一条碎碎念动态所需的数据字段。
export type ThinkingItem = {
  id: number;
  // content 是动态正文，会保留换行并展示在气泡中。
  content: string;
  // publishedAt 是发布日期，始终展示在作者名旁边。
  publishedAt: string;
  // time 是可选的具体时间，存在时才渲染。
  time?: string;
  // mood 是可选的心情或状态标签，存在时才渲染。
  mood?: string;
  isVisible: boolean;
};

// thinkingItems 仅作为迁移到数据库时的 seed 数据来源。
export const thinkingItems: ThinkingItem[] = [
  {
    id: 1,
    content: "有些想法不一定要立刻写成文章。先把它放在这里，像在桌角压住一张便签，等它自己慢慢长出形状。",
    publishedAt: "2026年5月6日",
    time: "22:18",
    mood: "整理中",
    isVisible: true,
  },
  {
    id: 2,
    content: "工具越强，越需要知道自己想要什么。否则效率只是把不确定性推进得更快。",
    publishedAt: "2026年4月26日",
    time: "09:42",
    mood: "想到一句",
    isVisible: true,
  },
  {
    id: 3,
    content: "长期主义不是一直用力，而是知道什么时候该慢下来，什么时候该继续一点点往前挪。",
    publishedAt: "2026年4月12日",
    time: "23:05",
    mood: "睡前",
    isVisible: true,
  },
  {
    id: 4,
    content: "很多复杂问题不是缺一个答案，而是缺一段足够安静的观察期。",
    publishedAt: "2026年3月28日",
    mood: "备忘",
    isVisible: true,
  },
  {
    id: 5,
    content: "如果一件事反复出现在脑子里，它大概就值得被认真记录一次。",
    publishedAt: "2026年3月9日",
    time: "18:30",
    mood: "复盘后",
    isVisible: true,
  },
  {
    id: 6,
    content: "写代码和写作有点像：最难的不是开始打字，而是承认第一版一定会很粗糙。",
    publishedAt: "2026年2月16日",
    mood: "随手记",
    isVisible: true,
  },
];
