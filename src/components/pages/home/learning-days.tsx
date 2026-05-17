type LearningDaysProps = {
  startedAt: string;
};

function getLearningDays(startedAt: string) {
  const start = new Date(startedAt).getTime();
  const now = Date.now();

  if (!Number.isFinite(start)) {
    return "1";
  }

  const days = Math.max(1, Math.floor((now - start) / 86_400_000) + 1);
  return days.toLocaleString("zh-CN");
}

export function LearningDays({ startedAt }: LearningDaysProps) {
  return <>{getLearningDays(startedAt)}</>;
}
