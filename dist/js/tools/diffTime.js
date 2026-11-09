export function diffTime(date1, date2) {
  const diffMinute = new Set();
  const diffClock = new Set();
  const diffDay = new Set();
  const diffWeek = new Set();
  const diffMonth = new Set();
  const diffYear = new Set();
  const diffTime = Math.abs(date2 - date1);
  diffMinute.add(Math.floor(diffTime / (1000 * 60)));
  diffClock.add(Math.floor(diffTime / (1000 * 60 * 60)));
  diffDay.add(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  diffWeek.add(Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7)));
  diffMonth.add(Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30)));
  diffYear.add(Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365)));

  return {
    diffMinute: [...diffMinute],
    diffClock: [...diffClock],
    diffDay: [...diffDay],
    diffWeek: [...diffWeek],
    diffMonth: [...diffMonth],
    diffYear: [...diffYear],
  };
}
