'use strict';

// Write a short first-person "diary" line for the pet using GitHub Models
// (free inference with GITHUB_TOKEN + `permissions: models: read`).
// Always degrades gracefully to a local template — never throws.

const { MOOD_LABEL } = require('./stats');

function fallbackDiary(stats, name, lang) {
  const n = name || 'Commit Pet';
  if (lang === 'en') {
    if (stats.mood === 'sick') return `${n}: It's been ${stats.daysSince} days... I miss your commits. 🥲`;
    if (stats.mood === 'hungry') return `${n}: A little hungry. One commit would cheer me up! 🌱`;
    if (stats.streak >= 7) return `${n}: ${stats.streak}-day streak! You're on fire. 🔥`;
    return `${n}: Lv${stats.level} and feeling great today! ✨`;
  }
  if (stats.mood === 'sick') return `${n}：もう${stats.daysSince}日も会えてない…コミットして〜 🥲`;
  if (stats.mood === 'hungry') return `${n}：ちょっとおなかすいた。コミット1個ちょうだい！ 🌱`;
  if (stats.streak >= 7) return `${n}：${stats.streak}日連続だよ！その調子！ 🔥`;
  return `${n}：Lv${stats.level}、今日もごきげん！ ✨`;
}

async function writeDiary(opts) {
  const { stats, name, lang = 'jp', token, model = 'openai/gpt-4o-mini' } = opts;
  if (!token) return fallbackDiary(stats, name, lang);

  const moodWord = (MOOD_LABEL[lang] || MOOD_LABEL.jp)[stats.mood];
  const sys = lang === 'en'
    ? 'You are a tiny pixel pet living in a GitHub README. Reply with ONE short, cute first-person diary line (max 90 chars). No quotes.'
    : 'あなたはGitHubのREADMEに住む小さなドットのペットです。一人称でかわいい日記を1行だけ返してください（最大45文字）。カギカッコ不要。';
  const user = lang === 'en'
    ? `My name is ${name || 'Commit Pet'}. Level ${stats.level}, mood ${moodWord}, ${stats.streak}-day streak, ${stats.todayCount} commits today, idle ${stats.daysSince} days.`
    : `わたしの名前は${name || 'Commit Pet'}。レベル${stats.level}、きぶんは${moodWord}、${stats.streak}日連続、今日のコミット${stats.todayCount}、${stats.daysSince}日さわってもらえてない。`;

  try {
    const res = await fetch('https://models.github.ai/inference/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'commit-pet',
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        max_tokens: 80,
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user },
        ],
      }),
    });
    if (!res.ok) return fallbackDiary(stats, name, lang);
    const json = await res.json();
    const text = json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
    const line = (text || '').trim().replace(/^["'「」]+|["'「」]+$/g, '').split('\n')[0];
    return line || fallbackDiary(stats, name, lang);
  } catch (_e) {
    return fallbackDiary(stats, name, lang);
  }
}

module.exports = { writeDiary, fallbackDiary };
