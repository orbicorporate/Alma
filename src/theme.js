// Tema pessoal da Alma: cores da esfera, fundo, brilho das bordas e velocidade do giro.
// Fica salvo neste aparelho e é aplicado por variáveis CSS no app inteiro.

export const ORBS = [
  { id: 'aurora', name: 'Aurora', c: ['#b9a6ff', '#f5a8c8', '#ffd3a8', '#a8d8ff', '#7a5cff'] },
  { id: 'oceano', name: 'Oceano', c: ['#7fd8ff', '#3f7bff', '#a8fff0', '#2a4cc9', '#9fe7ff'] },
  { id: 'floresta', name: 'Floresta', c: ['#8fe3b0', '#2f9e6e', '#e6f7a8', '#1f6f5c', '#b8f5d0'] },
  { id: 'fogo', name: 'Fogo', c: ['#ffb36b', '#ff5e7a', '#ffe08a', '#c2305a', '#ff9a4d'] },
  { id: 'rosa', name: 'Rosa', c: ['#ffb8d9', '#ff6fae', '#ffe1f0', '#b34fd1', '#ff9ccc'] },
  { id: 'ouro', name: 'Ouro', c: ['#f3d98b', '#d99a3a', '#fff4c9', '#a5702a', '#ffe6a0'] },
  { id: 'lua', name: 'Lua', c: ['#e8e6f2', '#9d9ab8', '#ffffff', '#6d6a8c', '#cfcce3'] },
  { id: 'galaxia', name: 'Galáxia', c: ['#7a5cff', '#20c5d6', '#ff5ec4', '#3b1f9e', '#8ff0ff'] }
];

export const BGS = [
  { id: 'noite', name: 'Noite', dark: true, f: 'none', fix: 'none', sw: ['#2a2064', '#0b0a18'] },
  { id: 'oceano', name: 'Oceano', dark: true, f: 'hue-rotate(-48deg)', fix: 'hue-rotate(48deg)', sw: ['#16306a', '#07101c'] },
  { id: 'floresta', name: 'Floresta', dark: true, f: 'hue-rotate(-115deg) saturate(.8)', fix: 'saturate(1.25) hue-rotate(115deg)', sw: ['#123f33', '#06140f'] },
  { id: 'rosa', name: 'Rosa', dark: true, f: 'hue-rotate(58deg)', fix: 'hue-rotate(-58deg)', sw: ['#4f1a4f', '#140713'] },
  { id: 'sol', name: 'Pôr do sol', dark: true, f: 'hue-rotate(115deg) saturate(1.1)', fix: 'saturate(.9) hue-rotate(-115deg)', sw: ['#5a2a1a', '#170a07'] },
  { id: 'meia', name: 'Meia-noite', dark: true, f: 'saturate(.25) brightness(.85)', fix: 'brightness(1.18) saturate(4)', sw: ['#26252e', '#08080a'] },
  { id: 'lavanda', name: 'Claro lavanda', dark: false, f: 'invert(1) hue-rotate(180deg)', fix: 'hue-rotate(180deg) invert(1)', sw: ['#ece8ff', '#d9d0ff'] },
  { id: 'areia', name: 'Claro areia', dark: false, f: 'invert(1) hue-rotate(-32deg) saturate(.75)', fix: 'saturate(1.33) hue-rotate(32deg) invert(1)', sw: ['#f7efe2', '#ead9bf'] },
  { id: 'ceu', name: 'Claro céu', dark: false, f: 'invert(1) hue-rotate(140deg)', fix: 'hue-rotate(-140deg) invert(1)', sw: ['#e6f3ff', '#c9e2fb'] }
];

export const GLOWS = [
  { id: 'lilas', name: 'Lilás', c: ['#c9b8ff', '#f5a8c8'] },
  { id: 'ouro', name: 'Dourado', c: ['#f3d98b', '#ffb36b'] },
  { id: 'aqua', name: 'Aqua', c: ['#8ff0ff', '#8fe3b0'] },
  { id: 'rosa', name: 'Rosa', c: ['#ff9ccc', '#ffb8d9'] },
  { id: 'arco', name: 'Arco-íris', c: ['#7fd8ff', '#ffe08a'] },
  { id: 'off', name: 'Desligado', c: ['transparent', 'transparent'] }
];

export const SPEEDS = [{ id: 14, name: 'Calma' }, { id: 7, name: 'Suave' }, { id: 3.5, name: 'Viva' }];

export const DEFAULT_THEME = { orb: 'aurora', custom: null, bg: 'noite', glow: 'lilas', spd: 7 };

export function loadTheme() {
  try { return Object.assign({}, DEFAULT_THEME, JSON.parse(localStorage.getItem('alma:theme') || '{}')); } catch (e) { return Object.assign({}, DEFAULT_THEME); }
}

export function orbColors(t) {
  if (t.orb === 'custom' && t.custom && t.custom.length === 3) {
    const [a, b, c] = t.custom;
    return [a, b, c, mix(a, b), mix(b, c)];
  }
  return (ORBS.find((o) => o.id === t.orb) || ORBS[0]).c;
}

function hex(h) { const n = parseInt(h.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a, b) { const x = hex(a), y = hex(b); return '#' + x.map((v, i) => Math.round((v + y[i]) / 2).toString(16).padStart(2, '0')).join(''); }
export function rgba(h, a) { if (!h.startsWith('#')) return h; const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; }

export function applyTheme(t = loadTheme()) {
  const root = document.documentElement;
  const c = orbColors(t);
  const bg = BGS.find((b) => b.id === t.bg) || BGS[0];
  const gl = (GLOWS.find((g) => g.id === t.glow) || GLOWS[0]).c;
  const set = (k, v) => root.style.setProperty(k, v);
  ['--oa', '--ob', '--oc', '--od', '--oe'].forEach((k, i) => set(k, c[i]));
  set('--o-base', mix(c[0], c[3]));
  set('--o-glow', rgba(c[0], .6));
  set('--o-glow2', rgba(c[3], .32));
  set('--o-spd', t.spd + 's');
  set('--g1', gl[0] === 'transparent' ? 'transparent' : rgba(gl[0], .7));
  set('--g2', gl[1] === 'transparent' ? 'transparent' : rgba(gl[1], .8));
  set('--g0', gl[0] === 'transparent' ? 'transparent' : '#ffffff');
  set('--bg-f', bg.f);
  set('--bg-fix', bg.fix);
  root.dataset.bg = bg.id;
  root.classList.toggle('theme-light', !bg.dark);
  root.classList.toggle('theme-filter', bg.f !== 'none');
}

export function saveTheme(t) {
  try { localStorage.setItem('alma:theme', JSON.stringify(t)); } catch (e) { /* sem armazenamento */ }
  applyTheme(t);
}
