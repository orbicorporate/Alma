// Intuição da Alma: tudo o que faz o app parecer que já conhece a pessoa.
// Funções puras sobre os dados que já existem (perguntas, diário, perfil) e alguns
// hábitos de uso guardados só neste aparelho. Nada aqui chama a rede.
import { today, iso, fromIso, stepInfo, daysUntil } from './dates.js';
import { dayAdvice } from './cosmos.js';
import { dayTip } from './tips.js';
import { planNameOf } from './questions.js';

/* ---------- texto ---------- */
const STOP = new Set(('a o as os um uma uns umas de da do das dos em na no nas nos por pra para com sem que se e ou mas mais muito muita ' +
  'eu me mim meu minha meus minhas voce voces ele ela eles elas isso isto esse essa este esta aquilo ja ainda nao sim tambem ' +
  'como quando onde porque pq qual quais quem sobre ate entre depois antes agora hoje sempre nunca so tudo nada algo alguem ' +
  'estou esta estao estar ser sou era foi tem tenho ter ha vai vou ir fazer faz fiz devo deveria sera seria pode posso quero ' +
  'pensando penso acho sinto sei saber coisa coisas vida dia dias vez vezes bem mal').split(' '));
export const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// Palavras com conteúdo, reduzidas ao começo (trabalho, trabalhar e trabalhando viram "traba").
export function terms(text) {
  const out = new Set();
  norm(text).split(/[^a-z0-9]+/).forEach((w) => { if (w.length >= 4 && !STOP.has(w)) out.add(w.slice(0, 5)); });
  return out;
}
function overlap(a, b) {
  if (!a.size || !b.size) return { n: 0, score: 0 };
  let n = 0; a.forEach((t) => { if (b.has(t)) n++; });
  return { n, score: n / Math.sqrt(a.size * b.size) };
}

/* ---------- 2. continuar em vez de recomeçar ---------- */
// A pergunta guardada mais parecida com o que a pessoa está escrevendo agora.
export function similarEntry(text, entries, skip) {
  const t = terms(text);
  if (t.size < 2) return null;
  let best = null;
  (entries || []).forEach((e, i) => {
    if (i === skip || !e || !e.q) return;
    const o = overlap(t, terms(e.q + ' ' + (e.tags || []).join(' ')));
    // Perguntas em aberto pesam um pouco mais: é mais provável que a pessoa esteja voltando a elas.
    const score = o.score * (e.resolved ? 0.85 : 1);
    if (o.n >= 2 && score >= 0.3 && (!best || score > best.score)) best = { i, e, score, name: planNameOf(e) };
  });
  return best;
}

/* ---------- 3. respostas pré-selecionadas ---------- */
export function tagCounts(entries) {
  const m = {};
  (entries || []).forEach((e) => (e.tags || []).forEach((t) => { const k = norm(t); m[k] = (m[k] || 0) + 1; }));
  return m;
}
// Para cada pergunta de aprofundamento, a opção que a pessoa provavelmente escolheria:
// a mesma da conversa parecida ou a que ela já escolheu pelo menos duas vezes.
export function suggestTags(questions, entries, sim) {
  const counts = tagCounts(entries);
  const prev = new Set(((sim && sim.e && sim.e.tags) || []).map(norm));
  return (questions || []).map((q) => {
    let best = null, bs = 0;
    (q.tags || []).forEach((tg) => {
      const k = norm(tg), c = counts[k] || 0;
      const sc = (prev.has(k) ? 3 : 0) + (c >= 2 ? c : 0);
      if (sc > bs) { bs = sc; best = tg; }
    });
    return bs >= 2 ? best : null;
  });
}

/* ---------- 4. suas vozes ---------- */
// Tradições que a pessoa mais marca com estrela (pelo menos duas vezes), da mais querida em diante.
export function voiceRank(entries, max = 3) {
  const m = {};
  (entries || []).forEach((e) => (e.stars || []).forEach((s) => { if (s && s.name) m[s.name] = (m[s.name] || 0) + 1; }));
  return Object.keys(m).filter((k) => m[k] >= 2).sort((a, b) => m[b] - m[a]).slice(0, max);
}
export function namesLine(list) {
  return list.length <= 1 ? (list[0] || '') : list.slice(0, -1).join(', ') + ' e ' + list[list.length - 1];
}

/* ---------- hábitos (só neste aparelho) ---------- */
const HK = 'alma:habits';
function readH() { try { return JSON.parse(localStorage.getItem(HK) || '{}'); } catch (e) { return {}; } }
function writeH(h) { try { localStorage.setItem(HK, JSON.stringify(h)); } catch (e) { /* sem armazenamento */ } }
// Registra a hora de uma ação importante (perguntar, concluir um passo, responder um check-in).
export function track() {
  const h = readH(), hr = new Date().getHours();
  h.hours = h.hours || new Array(24).fill(0);
  h.hours[hr] = (h.hours[hr] || 0) + 1;
  writeH(h);
}
// O horário em que a pessoa costuma estar na Alma vira o horário dos lembretes.
export function reminderHour() {
  const hs = readH().hours || [];
  let best = 8, bc = 0, total = 0;
  for (let i = 7; i <= 21; i++) { total += hs[i] || 0; if ((hs[i] || 0) > bc) { bc = hs[i]; best = i; } }
  return total >= 3 ? best : 8;
}
// Sugestões dispensadas hoje ("Agora não") não voltam no mesmo dia.
export function dismissed() { const h = readH(); return h.dIso === iso(today()) ? (h.d || []) : []; }
export function dismiss(key) {
  const h = readH(), d = iso(today());
  if (h.dIso !== d) { h.dIso = d; h.d = []; }
  if (!h.d.includes(key)) h.d.push(key);
  writeH(h);
}

/* ---------- 8. ritmo do dia ---------- */
export function daypart(date = new Date()) {
  const h = date.getHours();
  return h < 5 ? 'noite' : h < 12 ? 'manha' : h < 18 ? 'tarde' : 'noite';
}

/* ---------- 5. o céu conversando com o resto ---------- */
// Uma linha curta sobre o céu de hoje, para acompanhar respostas e passos.
export function skyLine(profile, date = today()) {
  const a = dayAdvice(date, profile);
  const what = a.decidir ? 'bom para decidir' : a.agir ? 'bom para dar um passo' : a.descansar ? 'pede um ritmo mais calmo' : a.phase.text.split('.')[0].toLowerCase();
  return `${a.phase.name}${a.pd ? ` e dia pessoal ${a.pd}` : ''}: ${what}.`;
}

// Retoque tátil, só nas confirmações (nunca em todo toque).
export function buzz() { try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) { /* sem vibração */ } }

/* ---------- 1. o cartão do momento ---------- */
// Escolhe UMA coisa para a pessoa fazer agora, já com a ação pronta.
// Ordem: passo do plano que vence hoje, pergunta em aberto que pede notícia, ritual do período do dia, dica do dia.
export function moment(data, now = new Date()) {
  const entries = data.entries || [], journal = data.journal || [], profile = data.profile || null;
  const tIso = iso(today()), part = daypart(now), off = dismissed();
  const sky = skyLine(profile);
  const out = [];

  // Passo vencendo
  let step = null;
  entries.forEach((e, i) => {
    if (!e || e.resolved || !e.plan) return;
    e.plan.forEach((p0, j) => {
      const p = stepInfo(p0);
      if (p.done || p.due == null || p.due > 0) return;
      if (!step || p.due < step.due) step = { i, j, e, t: p.t, due: p.due, n: j + 1, total: e.plan.length };
    });
  });
  if (step) {
    out.push({
      k: `passo:${step.e.at || step.i}:${step.j}`, type: 'passo', color: '#8fe3b0',
      kicker: step.due === 0 ? `Hoje · passo ${step.n} de ${step.total}` : `Ficou de ${step.due === -1 ? 'ontem' : `${-step.due} dias atrás`} · passo ${step.n} de ${step.total}`,
      title: step.t, line: `Plano: ${planNameOf(step.e)}`, sky,
      why: step.due === 0 ? 'Este passo estava marcado para hoje.' : 'Este passo ainda está esperando por você.',
      ref: { i: step.i, j: step.j }
    });
  }

  // Pergunta em aberto há alguns dias, sem notícia recente
  const DAY = 864e5, nowMs = now.getTime();
  const open = entries.map((e, i) => ({ e, i })).filter(({ e }) => {
    if (!e || e.resolved || !e.at) return false;
    const last = e.checkin ? fromIso(e.checkin).getTime() : e.at;
    const hasDueStep = (e.plan || []).some((p) => !p.done && p.iso && daysUntil(p.iso) <= 0);
    return nowMs - e.at >= 3 * DAY && nowMs - last >= 4 * DAY && !hasDueStep;
  }).sort((a, b) => (a.e.checkin ? fromIso(a.e.checkin).getTime() : a.e.at) - (b.e.checkin ? fromIso(b.e.checkin).getTime() : b.e.at));
  if (open.length) {
    const { e, i } = open[0];
    const d = Math.round((nowMs - e.at) / DAY);
    out.push({
      k: `check:${e.at}`, type: 'check', color: '#c9b8ff',
      kicker: `Em aberto há ${d} dias`, title: `Como ficou “${planNameOf(e)}”?`,
      line: 'Me conta em um toque. Se resolveu, essa estrela passa a brilhar em paz.',
      why: 'A Alma acompanha as perguntas que ainda estão em aberto.', ref: { i }
    });
  }

  // Ritual do período
  const todays = journal.filter((j) => j && j.iso === tIso);
  if (part === 'manha' && !todays.some((j) => j.type === 'intencao')) {
    const tip = dayTip(today(), profile);
    out.push({
      k: `int:${tIso}`, type: 'intencao', color: '#f3d98b',
      kicker: 'Manhã', title: 'Qual é a sua intenção para hoje?', line: 'Escolha uma e ela vai para o seu diário.', sky,
      options: [tip.title, 'Fazer uma coisa de cada vez', 'Ter paciência comigo'],
      why: 'Toda manhã a Alma sugere uma intenção a partir do céu do dia.'
    });
  }
  if (part === 'noite' && now.getHours() >= 19 && !todays.some((j) => j.reflexao)) {
    out.push({
      k: `ref:${tIso}`, type: 'reflexao', color: '#a8d8ff',
      kicker: 'Antes de dormir', title: 'Como foi o seu dia?', line: 'Um toque e fica registrado no seu diário.',
      options: ['Leve', 'Cheio', 'Pesado', 'Grato'],
      why: 'À noite, a Alma guarda uma reflexão de dez segundos.'
    });
  }

  // Dica do dia, sempre disponível
  const tip = dayTip(today(), profile);
  out.push({ k: 'dica', type: 'dica', color: '#f3d98b', kicker: 'Dica do dia', title: tip.title, line: tip.act, sky, why: 'A partir da Lua de hoje' + (profile ? ', do seu dia pessoal e do seu mapa.' : '.') });

  return out.find((c) => !off.includes(c.k)) || null;
}
