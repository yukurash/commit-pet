'use strict';

// Turn a GitHub contribution calendar into pet stats.
// calendar: [{ date: 'YYYY-MM-DD', count: Number }, ...]

const LEVEL_TIERS = [0, 20, 60, 150, 300, 600, 1000, 1800, 3000, 5000, 8000];

function levelFromTotal(total) {
  let lv = 1;
  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (total >= LEVEL_TIERS[i]) lv = i + 1;
  }
  return lv;
}

function moodFromDays(days) {
  if (days <= 0) return 'happy';
  if (days <= 2) return 'content';
  if (days <= 5) return 'hungry';
  return 'sick';
}

const MOOD_LABEL = {
  jp: { happy: 'ごきげん', content: 'まあまあ', hungry: 'おなかすいた', sick: 'びょうき' },
  en: { happy: 'Happy', content: 'Okay', hungry: 'Hungry', sick: 'Sick' },
};
const MOOD_ICON = { happy: '✨', content: '🙂', hungry: '🍙', sick: '🤒' };

function computeStats(calendar, override) {
  let total = 0;
  let todayCount = 0;
  let daysSince = 999;
  let streak = 0;

  if (calendar && calendar.length) {
    const days = [...calendar].sort((a, b) => (a.date < b.date ? -1 : 1));
    total = days.reduce((s, d) => s + (d.count || 0), 0);
    todayCount = days[days.length - 1].count || 0;

    let lastActive = -1;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) { lastActive = i; break; }
    }
    daysSince = lastActive < 0 ? 999 : days.length - 1 - lastActive;

    let start = days.length - 1;
    if (days[start].count === 0) start--; // today not committed yet: count streak up to yesterday
    for (let i = start; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else break;
    }
  }

  if (override) {
    if (override.total != null) total = override.total;
    if (override.daysSince != null) daysSince = override.daysSince;
    if (override.streak != null) streak = override.streak;
    if (override.todayCount != null) todayCount = override.todayCount;
  }

  const level = levelFromTotal(total);
  const mood = moodFromDays(daysSince);
  return { total, todayCount, daysSince, streak, level, mood };
}

module.exports = { computeStats, levelFromTotal, moodFromDays, MOOD_LABEL, MOOD_ICON };
