export type TimeProgressStats = {
  year: number;
  dayOfYear: number;
  yearProgress: string;
  dayProgress: string;
};

export function getTimeProgressStats(): TimeProgressStats {
  const now = new Date();
  const nowTime = now.getTime();
  const yearStart = new Date(now.getFullYear(), 0, 1).getTime();
  const nextYearStart = new Date(now.getFullYear() + 1, 0, 1).getTime();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return {
    year: now.getFullYear(),
    dayOfYear: Math.floor((nowTime - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000),
    yearProgress: (((nowTime - yearStart) / (nextYearStart - yearStart)) * 100).toFixed(6),
    dayProgress: (((nowTime - dayStart) / 86400000) * 100).toFixed(6),
  };
}
