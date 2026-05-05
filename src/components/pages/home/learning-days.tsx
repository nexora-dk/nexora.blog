const FRONTEND_STARTED_AT = "2026-01-20T00:00:00+08:00";

function getLearningDays() {
  const start = new Date(FRONTEND_STARTED_AT).getTime();
  const now = Date.now();
  const days = Math.max(1, Math.floor((now - start) / 86_400_000) + 1);

  return days.toLocaleString("zh-CN");
}

export function LearningDays() {
  return <>{getLearningDays()}</>;
}
