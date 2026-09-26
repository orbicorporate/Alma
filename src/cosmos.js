// Fases da Lua, ciclos pessoais (numerologia) e sugestões de momentos favoráveis.
// São tradições simbólicas: o app apresenta como convite, nunca como regra.

const SYNODIC = 29.530588853;
function jdOfDate(d) {
  return d.getTime() / 86400000 + 2440587.5;
}
// Fração da lunação: 0 = Lua nova, 0.5 = Lua cheia.
export function moonFrac(date) {
  const d = new Date(date); d.setHours(12, 0, 0, 0);
  const f = ((jdOfDate(d) - 2451550.1) / SYNODIC) % 1;
  return f < 0 ? f + 1 : f;
}
export const PHASES = [
  { name: 'Lua nova', mode: 'intencao', text: 'Plante intenções. Decida em silêncio o que você quer começar.' },
  { name: 'Lua crescente', mode: 'agir', text: 'Dê os primeiros passos. Bom momento para começar, pedir e propor.' },
  { name: 'Quarto crescente', mode: 'agir', text: 'Hora de agir com coragem e atravessar os obstáculos.' },
  { name: 'Crescente gibosa', mode: 'ajustar', text: 'Refine e persista no que você já começou.' },
  { name: 'Lua cheia', mode: 'decidir', text: 'Clareza para decidir, colher e celebrar. Bom para conversas importantes.' },
  { name: 'Minguante gibosa', mode: 'partilhar', text: 'Compartilhe, agradeça e ensine o que aprendeu.' },
  { name: 'Quarto minguante', mode: 'soltar', text: 'Revise e solte o que não serve mais.' },
  { name: 'Lua minguante', mode: 'descansar', text: 'Descanse, encerre ciclos e prepare o terreno.' }
];
export function phaseIndex(f) {
  if (f < 0.034 || f >= 0.966) return 0;
  if (f < 0.216) return 1;
  if (f < 0.284) return 2;
  if (f < 0.466) return 3;
  if (f < 0.534) return 4;
  if (f < 0.716) return 5;
  if (f < 0.784) return 6;
  return 7;
}
export function phaseOf(date) {
  const f = moonFrac(date), i = phaseIndex(f);
  return Object.assign({ frac: f, idx: i, lit: Math.round(((1 - Math.cos(2 * Math.PI * f)) / 2) * 100) }, PHASES[i]);
}
// Caminho SVG da parte iluminada da Lua, centrado em (0,0) com raio r.
export function moonPath(f, r) {
  const k = Math.abs(Math.cos(2 * Math.PI * f)) * r;
  if (f < 0.5) {
    const sweep = f < 0.25 ? 0 : 1;
    return `M0,${-r} A${r},${r} 0 0 1 0,${r} A${k.toFixed(2)},${r} 0 0 ${sweep} 0,${-r}Z`;
  }
  const sweep = f < 0.75 ? 0 : 1;
  return `M0,${-r} A${r},${r} 0 0 0 0,${r} A${k.toFixed(2)},${r} 0 0 ${sweep} 0,${-r}Z`;
}

const red = (n, keep) => { while (n > 9 && !(keep && (n === 11 || n === 22 || n === 33))) n = String(n).split('').reduce((a, b) => a + +b, 0); return n; };
export function parseBirth(profile) {
  const m = profile && /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(profile.date || '');
  return m ? { d: +m[1], mo: +m[2], y: +m[3] } : null;
}
export function personalDay(profile, date) {
  const b = parseBirth(profile); if (!b) return null;
  const Y = date.getFullYear(), M = date.getMonth() + 1, D = date.getDate();
  const py = red(red(b.d) + red(b.mo) + red(Y));
  const pm = red(py + red(M));
  return red(pm + red(D));
}
export const PD_TEXT = {
  1: 'dia de começar e tomar a frente', 2: 'dia de cooperar e ouvir', 3: 'dia de se expressar e encontrar pessoas',
  4: 'dia de organizar e trabalhar com método', 5: 'dia de mudar a rotina e experimentar', 6: 'dia de cuidar de quem você ama',
  7: 'dia de refletir e estudar', 8: 'dia de negociar e decidir sobre recursos', 9: 'dia de concluir e soltar'
};

// Sugestão do dia: combina a fase da Lua com o dia pessoal (quando há perfil de nascimento).
export function dayAdvice(date, profile) {
  const ph = phaseOf(date), pd = personalDay(profile, date);
  const actMoon = ph.idx === 1 || ph.idx === 2 || ph.idx === 3;
  const decideMoon = ph.idx === 4 || ph.idx === 2;
  const restMoon = ph.idx === 6 || ph.idx === 7 || ph.idx === 0;
  const actNum = pd == null ? null : [1, 3, 5, 8].includes(pd);
  const decideNum = pd == null ? null : [1, 4, 8].includes(pd);
  const restNum = pd == null ? null : [2, 7, 9].includes(pd);
  const agir = actMoon && actNum !== false;
  const decidir = decideMoon && decideNum !== false;
  const descansar = restMoon && restNum !== false;
  const strong = (agir && actNum) || (decidir && decideNum);
  return { phase: ph, pd, agir, decidir, descansar, strong };
}
export function nextFavorable(kind, from, profile, n = 3, limit = 45) {
  const out = [];
  for (let i = 0; i < limit && out.length < n; i++) {
    const d = new Date(from); d.setDate(d.getDate() + i); d.setHours(12, 0, 0, 0);
    const a = dayAdvice(d, profile);
    if (a[kind]) out.push({ date: d, advice: a });
  }
  return out;
}
