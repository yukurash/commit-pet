'use strict';

const { renderPet } = require('./pets');
const { hueFromSeed } = require('./colors');
const { MOOD_LABEL, MOOD_ICON } = require('./stats');

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// stats: { total, todayCount, streak, mood, level }
function buildCard(opts) {
  const { username, species = 'slime', name, stats, theme = 'jp' } = opts;
  const lang = theme === 'en' ? 'en' : 'jp';
  const hue = hueFromSeed(username || species);
  const petName = name || (username ? username : 'Commit Pet');

  const moodLabel = MOOD_LABEL[lang][stats.mood];
  const moodIcon = MOOD_ICON[stats.mood];

  const t = lang === 'en'
    ? { lv: 'Lv', mood: 'Mood', streak: 'streak', today: 'today', total: 'contributions (1y)', feed: 'Commit to feed me!' }
    : { lv: 'Lv', mood: 'きぶん', streak: '日連続', today: '今日', total: 'コントリビューション(1年)', feed: 'コミットでごはん！' };

  // feed bar: fuller when recently active (mood happy/content)
  const feedMap = { happy: 5, content: 4, hungry: 2, sick: 1 };
  const filled = feedMap[stats.mood] != null ? feedMap[stats.mood] : 3;
  let bar = '';
  for (let i = 0; i < 5; i++) {
    const fill = i < filled ? '#ffd166' : '#3a3f55';
    bar += `<rect x="${248 + i * 26}" y="150" width="20" height="14" rx="2" fill="${fill}"/>`;
  }

  const pet = renderPet(species, hue, stats.mood);

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="200" viewBox="0 0 480 200" ` +
    `role="img" aria-label="${esc(petName)} - ${t.lv}${stats.level} ${moodLabel}">` +
    '<defs><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#1b2030"/><stop offset="1" stop-color="#11151f"/></linearGradient></defs>' +
    '<rect x="0" y="0" width="480" height="200" rx="16" fill="url(#bg)"/>' +
    '<rect x="1" y="1" width="478" height="198" rx="15" fill="none" stroke="#2c3346" stroke-width="2"/>' +
    // pet stage (left)
    '<rect x="16" y="16" width="200" height="168" rx="12" fill="#0d1018"/>' +
    `<g transform="translate(12,8)" shape-rendering="crispEdges">${pet}</g>` +
    // HUD (right)
    `<text x="240" y="46" font-family="'Segoe UI',Verdana,sans-serif" font-size="22" font-weight="700" fill="#f4f6ff">${esc(petName)}</text>` +
    `<text x="240" y="74" font-family="'Segoe UI',Verdana,sans-serif" font-size="15" fill="#9aa7c7">${t.lv} ${stats.level} ・ ${moodIcon} ${moodLabel}</text>` +
    `<text x="240" y="104" font-family="'Segoe UI',Verdana,sans-serif" font-size="15" fill="#cdd6ef">🔥 ${stats.streak} ${t.streak}　🌱 ${t.today} ${stats.todayCount}</text>` +
    `<text x="240" y="130" font-family="'Segoe UI',Verdana,sans-serif" font-size="13" fill="#7e8aa8">${stats.total} ${t.total}</text>` +
    bar +
    `<a href="https://github.com/yukurash/commit-pet"><text x="464" y="190" text-anchor="end" font-family="'Segoe UI',Verdana,sans-serif" font-size="11" fill="#6b76a0">★ Commit Pet</text></a>` +
    '</svg>'
  );
}

module.exports = { buildCard };
