// 时间线支持的内容类型；同时用于筛选参数、类型元信息索引和条目标记。
export type TimelineType = "writing" | "notes" | "memory";

// 时间线列表渲染所需的统一条目结构，屏蔽文章与手记原始字段差异。
export type TimelineItem = {
  // 列表主标题。
  title: string;
  // 条目摘要，保留给需要展示描述的区块使用。
  description: string;
  // 点击条目后跳转的目标地址。
  href: string;
  // 原始中文日期字符串，用于解析年份、短日期和排序时间戳。
  date: string;
  // 条目所属类型，用于筛选、生成 key 和展示类型标签。
  type: TimelineType;
  // 类型中文标签，直接显示在条目元信息中。
  typeLabel: string;
  // 来源侧的补充信息：文稿为分类，手记为栏目。
  meta: string;
};

// 每一种时间线类型的展示文案；Record 保证三种类型都有对应配置。
export const timelineTypeMeta: Record<TimelineType, { label: string; description: string }> = {
  // 长文与技术记录的类型信息。
  writing: {
    label: "文稿",
    description: "按时间回看写下的长文与技术记录。",
  },
  // 普通手记的类型信息。
  notes: {
    label: "手记",
    description: "整理日常观察和阶段性想法。",
  },
  // 回忆类手记的类型信息。
  memory: {
    label: "回忆",
    description: "收藏朝花夕拾里的生活片段。",
  },
};

// 类型守卫：把外部传入的未知值收窄为时间线支持的三种类型之一。
export function isTimelineType(value: unknown): value is TimelineType {
  return value === "writing" || value === "notes" || value === "memory";
}

// 从中文日期字符串中拆出年份、列表短日期和用于排序的时间戳。
export function getDateParts(date: string) {
  // 匹配形如“2026年5月9日”的日期前缀；后面若有其它文字不会影响解析。
  const match = date.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日/);

  // 无法解析时返回兜底年份与原始日期，并用 0 时间戳让它在排序中靠后。
  if (!match) {
    return { year: "近期", shortDate: date, time: 0 };
  }

  // 正则捕获到的年、月、日字符串；第一个元素是完整匹配内容，因此跳过。
  const [, year, month, day] = match;
  // 返回列表分组、行内日期展示和倒序排序所需的数据。
  return {
    year,
    shortDate: `${month}月${day}日`,
    time: new Date(Number(year), Number(month) - 1, Number(day)).getTime(),
  };
}

