// 时间进度统计的数据结构：供服务端初始渲染与客户端实时刷新共用。
export type TimeProgressStats = {
  // 当前年份，用于展示“今天”所属年份。
  year: number;
  // 当天是一年中的第几天，按本地时间从 1 月 1 日开始累计。
  dayOfYear: number;
  // 今年已过百分比，保留 6 位小数后以字符串形式展示。
  yearProgress: string;
  // 今天已过百分比，保留 6 位小数后以字符串形式展示。
  dayProgress: string;
};

// 计算当前时间对应的年度与日内进度；不接收参数，始终基于调用瞬间的本地时间。
export function getTimeProgressStats(): TimeProgressStats {
  // 当前 Date 对象作为所有时间差计算的基准。
  const now = new Date();
  // 当前毫秒时间戳，避免重复调用 getTime。
  const nowTime = now.getTime();
  // 本年第一天零点的毫秒时间戳，用于计算年度已过比例的起点。
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
  // 下一年第一天零点的毫秒时间戳，用于得到本年度总时长，兼容闰年。
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1).getTime();
  // 今天零点的毫秒时间戳，用于计算当天已经过去的比例。
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // 汇总组件需要展示的年份、天数、年度进度和日内进度。
  return {
    year: now.getFullYear(),
    // 通过当前时间减去“本年前一天零点”得到已跨过的天数，再向下取整为一年中的第几天。
    dayOfYear: Math.floor((nowTime - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000),
    // 年度进度 = 已过毫秒 / 本年总毫秒 * 100；toFixed 保持界面数字宽度稳定。
    yearProgress: (((nowTime - yearStart) / (nextYearStart - yearStart)) * 100).toFixed(6),
    // 日内进度 = 今天已过毫秒 / 一天毫秒数 * 100；与年度进度保持同样的小数位。
    dayProgress: (((nowTime - dayStart) / 86400000) * 100).toFixed(6),
  };
}
