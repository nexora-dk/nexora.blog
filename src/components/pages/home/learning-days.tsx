// 记录开始学习前端的基准时间，后续天数都从这个时间点开始计算。
const FRONTEND_STARTED_AT = "2026-01-20T00:00:00+08:00";

// 计算从基准日期到当前时间的学习天数，并至少返回 1 天避免首日显示为 0。
function getLearningDays() {
  // 将固定开始时间转成毫秒时间戳，便于与 Date.now() 做差。
  const start = new Date(FRONTEND_STARTED_AT).getTime();
  // 使用当前时间让组件每次渲染时都能得到最新天数。
  const now = Date.now();
  // 86_400_000 是一天的毫秒数；floor 去掉不足一天的部分，+1 表示包含开始当天。
  const days = Math.max(1, Math.floor((now - start) / 86_400_000) + 1);

  // 按中文地区格式输出，未来天数变大时会自动带千分位。
  return days.toLocaleString("zh-CN");
}

// 只渲染纯文本天数，方便父组件把它嵌入任意句子或卡片布局中。
export function LearningDays() {
  return <>{getLearningDays()}</>;
}
