'use strict';

const { hslToHex } = require('./colors');

// Each builder returns the INNER svg (shadow + bobbing group) inside a 192x192 box.
// Animations use SMIL so they play inside a GitHub README <img>.

const SPECIES = ['slime', 'cat', 'ghost'];

function bob(inner) {
  return (
    '<rect x="60" y="158" width="72" height="9" fill="#000" opacity="0.12">' +
    '<animate attributeName="width" values="72;56;72" dur="2s" repeatCount="indefinite"/>' +
    '<animate attributeName="x" values="60;68;60" dur="2s" repeatCount="indefinite"/></rect>' +
    '<g><animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" ' +
    'dur="2s" repeatCount="indefinite" calcMode="spline" ' +
    'keySplines="0.4 0 0.6 1;0.4 0 0.6 1" keyTimes="0;0.5;1"/>' +
    inner +
    '</g>'
  );
}

function blinkEye(x, y, w, h, eye, dur) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${eye}">` +
    `<animate attributeName="height" values="${h};${h};${h};6;${h};${h}" ` +
    `keyTimes="0;0.85;0.9;0.93;0.96;1" dur="${dur}" repeatCount="indefinite"/></rect>`
  );
}

// p: { ex1, ex2, ey, ew, eh, hi, mx, my, mw, fx, fy }
function face(mood, p, eye) {
  let s = '';
  if (mood === 'sick') {
    const cy = p.ey + Math.floor(p.eh / 2) - 3;
    s += `<rect x="${p.ex1}" y="${cy}" width="${p.ew}" height="6" fill="${eye}"/>`;
    s += `<rect x="${p.ex2}" y="${cy}" width="${p.ew}" height="6" fill="${eye}"/>`;
  } else {
    s += blinkEye(p.ex1, p.ey, p.ew, p.eh, eye, '4s');
    s += blinkEye(p.ex2, p.ey, p.ew, p.eh, eye, '4s');
    if (p.hi) {
      s += `<rect x="${p.ex1}" y="${p.ey}" width="12" height="12" fill="#ffffff"/>`;
      s += `<rect x="${p.ex2}" y="${p.ey}" width="12" height="12" fill="#ffffff"/>`;
    }
  }

  const cmx = p.mx + Math.floor(p.mw / 2 - 6);
  if (mood === 'happy') {
    s += `<rect x="${p.mx}" y="${p.my}" width="${p.mw}" height="12" fill="${eye}"/>`;
    s += `<rect x="${p.fx}" y="${p.fy}" width="10" height="10" fill="#fff7ad">` +
      '<animate attributeName="opacity" values="0.2;1;0.2" dur="1.6s" repeatCount="indefinite"/></rect>';
  } else if (mood === 'content') {
    s += `<rect x="${cmx}" y="${p.my}" width="12" height="12" fill="${eye}"/>`;
  } else if (mood === 'hungry') {
    s += `<rect x="${cmx}" y="${p.my}" width="12" height="12" fill="${eye}"/>`;
    s += `<rect x="${p.fx}" y="${p.fy}" width="10" height="14" fill="#6fc3ff" opacity="0.85">` +
      '<animate attributeName="opacity" values="0.85;0.3;0.85" dur="1.5s" repeatCount="indefinite"/></rect>';
  } else {
    // sick mouth (wavy) + sick marks
    const half = Math.floor(p.mw / 2);
    s += `<rect x="${p.mx}" y="${p.my + 4}" width="${half}" height="8" fill="${eye}"/>`;
    s += `<rect x="${p.mx + half}" y="${p.my - 2}" width="${half}" height="8" fill="${eye}"/>`;
    s += `<rect x="${p.fx}" y="${p.fy}" width="6" height="14" fill="#7aa7d8"/>`;
    s += `<rect x="${p.fx + 10}" y="${p.fy - 3}" width="6" height="16" fill="#7aa7d8"/>`;
  }
  return s;
}

function slime(hue, mood) {
  const sick = mood === 'sick';
  const light = hslToHex(hue, sick ? 30 : 62, sick ? 62 : 68);
  const dark = hslToHex(hue, sick ? 26 : 52, sick ? 48 : 52);
  const cheek = sick ? '#a9c7a0' : '#ff9bb3';
  const body =
    `<g fill="${light}">` +
    '<rect x="84" y="36" width="24" height="12"/><rect x="72" y="48" width="48" height="12"/>' +
    '<rect x="60" y="60" width="72" height="12"/><rect x="48" y="72" width="96" height="12"/>' +
    '<rect x="48" y="84" width="96" height="12"/><rect x="48" y="96" width="96" height="12"/></g>' +
    `<g fill="${dark}">` +
    '<rect x="48" y="108" width="96" height="12"/><rect x="48" y="120" width="96" height="12"/>' +
    '<rect x="60" y="132" width="72" height="12"/></g>' +
    '<rect x="60" y="48" width="12" height="24" fill="#ffffff" opacity="0.4"/>' +
    `<rect x="48" y="84" width="12" height="12" fill="${cheek}"/>` +
    `<rect x="132" y="84" width="12" height="12" fill="${cheek}"/>`;
  const f = face(mood, { ex1: 60, ex2: 108, ey: 72, ew: 24, eh: 24, hi: true, mx: 84, my: 96, mw: 24, fx: 138, fy: 56 }, '#1d3329');
  return bob(body + f);
}

function cat(hue, mood) {
  const sick = mood === 'sick';
  const fur = hslToHex(hue, sick ? 32 : 60, sick ? 56 : 62);
  const stripe = hslToHex(hue, sick ? 28 : 55, sick ? 42 : 46);
  const cheek = sick ? '#bcae9b' : '#ff9bb3';
  const body =
    `<g fill="${fur}">` +
    '<rect x="48" y="36" width="24" height="12"/><rect x="120" y="36" width="24" height="12"/>' +
    '<rect x="36" y="48" width="120" height="12"/><rect x="36" y="60" width="120" height="12"/>' +
    '<rect x="36" y="72" width="120" height="12"/><rect x="36" y="84" width="120" height="12"/>' +
    '<rect x="48" y="96" width="96" height="12"/><rect x="48" y="108" width="96" height="12"/>' +
    '<rect x="48" y="120" width="96" height="12"/><rect x="60" y="132" width="72" height="12"/>' +
    '<rect x="144" y="84" width="12" height="12"/><rect x="144" y="96" width="12" height="48"/></g>' +
    '<rect x="60" y="36" width="12" height="12" fill="#ff9bb3"/>' +
    '<rect x="120" y="36" width="12" height="12" fill="#ff9bb3"/>' +
    `<g fill="${stripe}"><rect x="72" y="48" width="12" height="12"/>` +
    '<rect x="96" y="48" width="12" height="12"/><rect x="120" y="48" width="12" height="12"/>' +
    '<rect x="144" y="108" width="12" height="12"/><rect x="144" y="132" width="12" height="12"/></g>' +
    `<rect x="36" y="72" width="12" height="12" fill="${cheek}"/>` +
    `<rect x="144" y="72" width="12" height="12" fill="${cheek}"/>` +
    '<rect x="84" y="84" width="24" height="12" fill="#ff7aa2"/>';
  const f = face(mood, { ex1: 72, ex2: 108, ey: 60, ew: 12, eh: 24, hi: false, mx: 84, my: 96, mw: 24, fx: 132, fy: 44 }, '#1d3329');
  return bob(body + f);
}

function ghost(hue, mood) {
  const sick = mood === 'sick';
  const light = hslToHex(hue, sick ? 22 : 40, sick ? 88 : 93);
  const shade = hslToHex(hue, sick ? 20 : 35, sick ? 78 : 80);
  const blush = sick ? '#bcd0c4' : '#ffb3c7';
  const body =
    `<g fill="${light}">` +
    '<rect x="72" y="36" width="48" height="12"/><rect x="60" y="48" width="72" height="12"/>' +
    '<rect x="60" y="60" width="72" height="12"/><rect x="60" y="72" width="72" height="12"/>' +
    '<rect x="60" y="84" width="72" height="12"/><rect x="60" y="96" width="72" height="12"/>' +
    '<rect x="60" y="108" width="72" height="12"/>' +
    '<rect x="60" y="120" width="12" height="12"/><rect x="84" y="120" width="12" height="12"/>' +
    '<rect x="108" y="120" width="12" height="12"/></g>' +
    `<rect x="120" y="60" width="12" height="60" fill="${shade}"/>` +
    `<rect x="60" y="84" width="12" height="12" fill="${blush}"/>` +
    `<rect x="120" y="84" width="12" height="12" fill="${blush}"/>`;
  const f = face(mood, { ex1: 72, ex2: 108, ey: 60, ew: 12, eh: 24, hi: false, mx: 84, my: 84, mw: 24, fx: 122, fy: 46 }, '#2a2f45');
  return bob(body + f);
}

const BUILDERS = { slime, cat, ghost };

function renderPet(species, hue, mood) {
  const fn = BUILDERS[species] || slime;
  return fn(hue, mood);
}

module.exports = { renderPet, SPECIES };
