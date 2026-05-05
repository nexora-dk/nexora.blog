export type NoteColumn = "travel" | "recent" | "memory" | "summary" | "emo";

export type NoteColumnMeta = {
  label: string;
  value: NoteColumn;
  description: string;
};

export type NoteItem = {
  title: string;
  description: string;
  href: string;
  date: string;
  column: NoteColumn;
  columnLabel: string;
  mood?: string;
  location?: string;
  tags: string[];
  publishedAt: string;
  views: string;
  likes: string;
};

export const noteColumns: NoteColumnMeta[] = [
  { label: "游记", value: "travel", description: "城市、路途和短暂出走。" },
  { label: "近况", value: "recent", description: "生活切片、近况更新和即时感受。" },
  { label: "朝花夕拾", value: "memory", description: "旧事、回忆和被时间留下的细节。" },
  { label: "阶段性总结", value: "summary", description: "阶段复盘、年度记录和自我校准。" },
  { label: "深夜 emo", value: "emo", description: "低落、敏感和一些不那么明亮的时刻。" },
];

export const noteItems: NoteItem[] = [
  {
    title: "26y: 健康、AI行业变化与自我反思",
    description: "把二十六岁这一年的身体状态、行业变化和自我节奏放在一起复盘。",
    href: "/notes/26y",
    date: "11天前",
    column: "summary",
    columnLabel: "阶段性总结",
    mood: "清醒",
    tags: ["复盘", "健康", "AI"],
    publishedAt: "2026年4月23日",
    views: "1.1k",
    likes: "72",
  },
  {
    title: "单调里的褶皱",
    description: "有些日子看起来没有波澜，但仔细翻开，也会藏着细小的褶皱。",
    href: "/notes/folds",
    date: "25天前",
    column: "emo",
    columnLabel: "深夜 emo",
    mood: "低频",
    tags: ["日常", "情绪", "自省"],
    publishedAt: "2026年4月9日",
    views: "836",
    likes: "58",
  },
  {
    title: "键盘上的春节",
    description: "春节的热闹隔着屏幕传来，而我在键盘前记录另一种年味。",
    href: "/notes/spring-festival",
    date: "2026年3月1日星期日",
    column: "memory",
    columnLabel: "朝花夕拾",
    location: "家里",
    tags: ["春节", "回忆", "生活"],
    publishedAt: "2026年3月1日",
    views: "694",
    likes: "47",
  },
  {
    title: "年味渐淡的春节记忆",
    description: "小时候觉得漫长的春节，后来慢慢变成几张照片和一顿团圆饭。",
    href: "/notes/new-year-memory",
    date: "2026年2月16日星期一",
    column: "memory",
    columnLabel: "朝花夕拾",
    mood: "怀旧",
    tags: ["春节", "童年", "记忆"],
    publishedAt: "2026年2月16日",
    views: "612",
    likes: "39",
  },
  {
    title: "午后散步和一杯冰美式",
    description: "短暂离开屏幕，沿着街边走一圈，回来时脑子也跟着松了一点。",
    href: "/notes/afternoon-walk",
    date: "2026年1月12日星期一",
    column: "recent",
    columnLabel: "近况",
    location: "街角咖啡店",
    tags: ["近况", "散步", "咖啡"],
    publishedAt: "2026年1月12日",
    views: "485",
    likes: "31",
  },
  {
    title: "一次没有计划的短途出走",
    description: "没有做攻略，也没有赶景点，只是换个城市让自己慢下来。",
    href: "/notes/short-trip",
    date: "2025年12月7日星期日",
    column: "travel",
    columnLabel: "游记",
    location: "海边",
    tags: ["旅行", "城市", "放空"],
    publishedAt: "2025年12月7日",
    views: "530",
    likes: "35",
  },
];

export function isNoteColumn(column: string | undefined): column is NoteColumn {
  return noteColumns.some((item) => item.value === column);
}
