#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { buildCard } = require('./card');
const { computeStats } = require('./stats');

function parseArgs(argv) {
  const a = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k.startsWith('--')) {
      const key = k.slice(2);
      const next = argv[i + 1];
      if (next == null || next.startsWith('--')) { a[key] = true; }
      else { a[key] = next; i++; }
    }
  }
  return a;
}

// Deterministic fake calendar for offline demos/tests.
function demoCalendar(seed, idle) {
  const days = [];
  let h = 2166136261 >>> 0;
  const s = String(seed);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  for (let d = 364; d >= 0; d--) {
    h = (Math.imul(h, 1103515245) + 12345) >>> 0;
    let count = (h % 100) < 55 ? (h % 6) : 0;
    if (d < Number(idle || 0)) count = 0; // force last N days idle
    days.push({ date: `2025-${String(((364 - d) % 12) + 1).padStart(2, '0')}-01`, count });
  }
  // ensure dates are unique & sortable: use index-based date
  return days.map((x, i) => ({ date: String(i).padStart(4, '0'), count: x.count }));
}

async function main() {
  const a = parseArgs(process.argv);
  const username = a.user || a.username || 'octocat';
  const species = a.species || 'slime';
  const name = a.name || null;
  const theme = a.theme || 'jp';
  const out = a.out || 'pet.svg';

  let calendar;
  const override = {};
  if (a.total != null && a.total !== true) override.total = Number(a.total);
  if (a.streak != null && a.streak !== true) override.streak = Number(a.streak);
  if (a.today != null && a.today !== true) override.todayCount = Number(a.today);
  if (a.idle != null && a.idle !== true) override.daysSince = Number(a.idle);

  if (a.demo) {
    calendar = demoCalendar(username + species, a.idle);
  } else {
    const { fetchCalendar } = require('./github');
    calendar = await fetchCalendar(username, a.token || process.env.GITHUB_TOKEN);
  }

  const stats = computeStats(calendar, override);
  const svg = buildCard({ username, species, name, stats, theme });

  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, svg, 'utf8');
  console.log(`commit-pet: wrote ${out}  (Lv${stats.level} ${stats.mood} streak=${stats.streak} total=${stats.total})`);

  if (a.diary) {
    const { writeDiary } = require('./diary');
    const line = await writeDiary({
      stats, name, lang: theme === 'en' ? 'en' : 'jp',
      token: a.demo ? null : (a.token || process.env.GITHUB_TOKEN),
    });
    const diaryPath = a.diary === true ? 'pet-diary.txt' : a.diary;
    fs.writeFileSync(diaryPath, line + '\n', 'utf8');
    console.log(`commit-pet: diary -> ${line}`);
  }
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
