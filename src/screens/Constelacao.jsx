import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { load, onData } from '../store.js';
import { MO } from '../dates.js';
import './constelacao.css';

// A constelação reflete tudo o que a pessoa coloca na Alma: perguntas, respostas estreladas,
// planos, diário, sonhos, post-its e leituras de tarô. Itens se agrupam por tema em nebulosas.

const THEMES = [
  { k: 'trabalho', label: 'Trabalho', color: '#a8d8ff', re: /trabalh|emprego|carreira|projeto|empresa|neg[oó]cio|chefe|profiss|client|vend|reuni/ },
  { k: 'amor', label: 'Amor', color: '#f5a8c8', re: /amor|namor|casament|relacion|parceir|marido|esposa|paix|cora[cç][aã]o|perdo/ },
  { k: 'familia', label: 'Família', color: '#ffd6a0', re: /fam[ií]lia|m[aã]e\b|\bpai\b|filh|irm[aã]|\blar\b/ },
  { k: 'mudanca', label: 'Mudança', color: '#8fe3c8', re: /mud|cidade|viag|recome|decid|escolh|propost|caminho/ },
  { k: 'espirito', label: 'Espiritualidade', color: '#c9a8ff', re: /deus|\bf[eé]\b|ora[cç]|espirit|medit|sagrad|universo|tar[oô]|alma\b/ },
  { k: 'bem', label: 'Bem-estar', color: '#8fe3b0', re: /sa[uú]de|corpo|dormi|sono|ansie|cansa|energia|exerc|medo|paz|calma|grat/ },
  { k: 'dinheiro', label: 'Finanças', color: '#f3d98b', re: /dinheiro|financ|d[ií]vida|invest|sal[aá]rio|gasto|conta|compra/ },
  { k: 'cria', label: 'Criatividade', color: '#ffb38a', re: /cria|arte|escrev|m[uú]sica|ideia|inspira|livro/ },
  { k: 'sonhos', label: 'Sonhos', color: '#b8c8ff', re: /sonh/ },
  { k: 'vida', label: 'Vida', color: '#e8e2d4', re: /$^/ }
];
const KIND = {
  pergunta: 'Pergunta', estrela: 'Resposta estrelada', plano: 'Plano de ação', nota: 'Anotação', sonho: 'Sonho',
  gratidao: 'Gratidão', intencao: 'Intenção', decisao: 'Decisão', postit: 'Post-it', taro: 'Tarô'
};
const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967295; };
const fmt = (t) => { const d = new Date(t); return `${d.getDate()} ${MO[d.getMonth()]} ${d.getFullYear()}`; };

function themeOf(text, kind) {
  if (kind === 'sonho') return 'sonhos';
  const t = (text || '').toLowerCase();
  const hit = THEMES.find((th) => th.re.test(t));
  if (hit) return hit.k;
  if (kind === 'gratidao') return 'bem';
  if (kind === 'taro') return 'espirito';
  return 'vida';
}

function buildItems(d) {
  const items = [];
  const now = Date.now();
  const entries = d.entries || [];
  entries.forEach((e, i) => {
    const at = e.at || now - (entries.length - i) * 86400000 * 3;
    const text = [e.q, (e.tags || []).join(' ')].join(' ');
    const th = themeOf(text, 'pergunta');
    const q = { id: 'q' + i, kind: 'pergunta', title: e.q, text: e.alma || '', at, theme: th, meta: e.kind, resolved: e.resolved, stars: e.stars || [], plan: e.plan };
    items.push(q);
    (e.stars || []).forEach((s, j) => items.push({ id: `q${i}s${j}`, kind: 'estrela', title: `${s.name} · ${s.ref}`, text: s.tr, at: at + 1000 * (j + 1), theme: th, parent: q.id, color: s.color }));
    if (e.plan && e.plan.length) {
      const done = e.plan.filter((x) => x.done).length;
      items.push({ id: `q${i}p`, kind: 'plano', title: `Plano de ação · ${done} de ${e.plan.length} passos`, text: e.plan.map((x, k) => `${k + 1}. ${x.t}${x.done ? ' (feito)' : ''}`).join('\n'), at: at + 5000, theme: th, parent: q.id, progress: done / e.plan.length });
    }
  });
  (d.journal || []).filter((j) => !j.linkOf).forEach((j) => items.push({ id: 'j' + j.id, kind: j.type, title: j.title || KIND[j.type], text: j.text, at: j.at || new Date(j.iso).getTime(), theme: themeOf(`${j.title} ${j.text}`, j.type), dayIso: j.iso }));
  (d.postits || []).forEach((p) => items.push({ id: 'p' + p.id, kind: 'postit', title: (p.text || 'Post-it').split('\n')[0].slice(0, 40), text: p.text, at: p.at || now - 3600000, theme: themeOf(p.text, 'postit'), color: p.color }));
  (d.readings || []).forEach((r, i) => items.push({ id: 't' + i, kind: 'taro', title: `Tarô: ${r.cards.join(', ')}`, text: r.q || 'Tiragem sem pergunta escrita', at: r.at, theme: themeOf(r.q, 'taro') }));
  return items.sort((a, b) => a.at - b.at);
}

function layout(items) {
  const used = THEMES.filter((t) => items.some((i) => i.theme === t.k));
  const centers = {};
  const n = used.filter((t) => t.k !== 'vida').length;
  let k = 0;
  used.forEach((t) => {
    if (t.k === 'vida') { centers[t.k] = { x: 0, y: 0 }; return; }
    const a = (k / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2 + 0.3; k++;
    const R = n <= 1 ? 0 : 230 + n * 18;
    centers[t.k] = { x: Math.cos(a) * R, y: Math.sin(a) * R };
  });
  if (centers.vida && n > 0) centers.vida = { x: 0, y: 0 };
  const count = {};
  const pos = {};
  items.filter((i) => !i.parent).forEach((i) => {
    const c = centers[i.theme]; const m = count[i.theme] = (count[i.theme] || 0) + 1;
    const ang = m * 2.39996 + hash(i.id) * 0.6, r = 34 + 30 * Math.sqrt(m);
    pos[i.id] = { x: c.x + Math.cos(ang) * r, y: c.y + Math.sin(ang) * r };
  });
  const sat = {};
  items.filter((i) => i.parent).forEach((i) => {
    const p = pos[i.parent] || { x: 0, y: 0 }; const m = sat[i.parent] = (sat[i.parent] || 0) + 1;
    const ang = m * 1.9 + hash(i.id), r = i.kind === 'plano' ? 30 : 22 + m * 3;
    pos[i.id] = { x: p.x + Math.cos(ang) * r, y: p.y + Math.sin(ang) * r };
  });
  return { centers, pos, count, used };
}

export default function Constelacao() {
  const [data, setData] = useState(load());
  const items = useMemo(() => buildItems(data), [data]);
  const L = useMemo(() => layout(items), [items]);
  const [sel, setSel] = useState(null);
  const [cut, setCut] = useState(1000);
  const cv = useRef(null);
  const st = useRef({ cam: { x: 0, y: 0, z: 0.4 }, target: null, light: { x: 195, y: 360 }, pointers: new Map(), moved: 0, t0: performance.now() });

  useEffect(() => onData((d) => setData(Object.assign({}, load(), d))), []);

  const minAt = items.length ? items[0].at : Date.now();
  const cutAt = minAt + (Date.now() - minAt) * (cut / 1000) + 1;
  st.current.sel = sel; st.current.cutAt = cutAt;

  // câmera inicial: enquadra tudo
  useEffect(() => {
    const xs = Object.values(L.pos);
    if (!xs.length) return;
    const minX = Math.min(...xs.map((p) => p.x)), maxX = Math.max(...xs.map((p) => p.x)), minY = Math.min(...xs.map((p) => p.y)), maxY = Math.max(...xs.map((p) => p.y));
    const z = Math.min(1.6, Math.max(0.35, Math.min(330 / (maxX - minX + 140), 600 / (maxY - minY + 160))));
    st.current.target = { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z };
  }, [L]);

  // o céu ocupa a tela inteira do aparelho, não só a coluna de 390
  const [dim, setDim] = useState({ W: 390, H: 844 });
  useLayoutEffect(() => {
    const fit = () => { const r = cv.current && cv.current.closest('.route'); if (r) setDim({ W: Math.max(390, r.offsetWidth), H: Math.max(600, r.offsetHeight) }); };
    fit(); window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  st.current.dim = dim;

  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    const { W, H } = dim;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * DPR; c.height = H * DPR;
    const CX = W / 2, CY = H * 0.46;
    // três camadas de estrelas (paralaxe), algumas coloridas
    const TINT = ['#ffffff', '#ffffff', '#ffffff', '#c9d8ff', '#ffe7c4', '#e4d6ff'];
    const bg = [];
    for (let i = 0; i < Math.round(W * H / 900); i++) bg.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.2 + 0.2, p: Math.random() * 6, d: [0.15, 0.35, 0.7][i % 3], c: TINT[Math.floor(Math.random() * TINT.length)] });
    // faixa da Via Láctea
    const dust = [];
    for (let i = 0; i < 260; i++) { const u = Math.random(), v = (Math.random() + Math.random() + Math.random() - 1.5) * 0.28; dust.push({ u, v, r: Math.random() * 0.9 + 0.2, p: Math.random() * 6 }); }
    const shoots = [];
    const ripples = st.current.ripples || (st.current.ripples = []);
    let raf, lastShoot = 0;
    const hex = (a) => Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
    const ease = (x) => 1 - Math.pow(1 - x, 3);
    const draw = (now) => {
      const S = st.current, t = (now - S.t0) / 1000;
      if (S.target) { const k = 0.06; S.cam.x += (S.target.x - S.cam.x) * k; S.cam.y += (S.target.y - S.cam.y) * k; S.cam.z += (S.target.z - S.cam.z) * k; if (Math.abs(S.target.z - S.cam.z) < 0.002 && Math.abs(S.target.x - S.cam.x) < 0.5) S.target = null; }
      const { x: cx, y: cy, z } = S.cam;
      const toS = (p) => ({ x: CX + (p.x - cx) * z, y: CY + (p.y - cy) * z });
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      const g = ctx.createRadialGradient(CX, H * 0.35, 40, CX, H * 0.5, Math.max(W, H) * 0.8);
      g.addColorStop(0, '#1b1546'); g.addColorStop(0.5, '#0d0b22'); g.addColorStop(1, '#05040c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // Via Láctea: faixa diagonal que respira e desliza devagar
      ctx.globalCompositeOperation = 'lighter';
      const ang = -0.5 + Math.sin(t * 0.03) * 0.05, ca = Math.cos(ang), sa = Math.sin(ang), L0 = Math.hypot(W, H);
      const bx = CX - (cx * z) * 0.03, by = H * 0.5 - (cy * z) * 0.03;
      for (let k = 0; k < 3; k++) {
        const ox = bx + (k - 1) * 90 * ca, oy = by + (k - 1) * 90 * sa;
        const mg = ctx.createRadialGradient(ox, oy, 0, ox, oy, 240);
        mg.addColorStop(0, ['#7a5cff', '#f5a8c8', '#6fb4ff'][k] + hex(0.10 + 0.03 * Math.sin(t * 0.4 + k))); mg.addColorStop(1, '#00000000');
        ctx.save(); ctx.translate(ox, oy); ctx.rotate(ang); ctx.scale(2.6, 0.55); ctx.translate(-ox, -oy);
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(ox, oy, 240, 0, 6.283); ctx.fill(); ctx.restore();
      }
      dust.forEach((d) => {
        const along = (d.u - 0.5) * L0, px = bx + along * ca - d.v * 260 * sa, py = by + along * sa + d.v * 260 * ca;
        ctx.globalAlpha = 0.25 + 0.3 * (0.5 + 0.5 * Math.sin(t * 1.1 + d.p));
        ctx.fillStyle = '#e8e2ff'; ctx.beginPath(); ctx.arc(px, py, d.r, 0, 6.283); ctx.fill();
      });
      // estrelas com paralaxe em três profundidades
      bg.forEach((s) => {
        const px = ((s.x - (cx * z) * 0.08 * s.d) % W + W) % W, py = ((s.y - (cy * z) * 0.08 * s.d) % H + H) % H;
        const tw = 0.5 + 0.5 * Math.sin(t * (0.8 + s.d * 1.5) + s.p);
        ctx.globalAlpha = 0.2 + 0.6 * tw * s.d + 0.1;
        ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(px, py, s.r * (0.8 + s.d * 0.6), 0, 6.283); ctx.fill();
        if (s.r > 1.2 && tw > 0.85) { ctx.globalAlpha *= 0.5; ctx.fillRect(px - 3, py - 0.3, 6, 0.6); ctx.fillRect(px - 0.3, py - 3, 0.6, 6); }
      });
      ctx.globalAlpha = 1;
      // estrelas cadentes
      if (t - lastShoot > 4 + Math.random() * 5 && t > 3) { lastShoot = t; shoots.push({ x: Math.random() * W * 0.8 + W * 0.2, y: Math.random() * H * 0.4, t0: t, a: 2.5 + Math.random() * 0.4 }); }
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i], k = (t - sh.t0) / 1.1; if (k > 1) { shoots.splice(i, 1); continue; }
        const hx = sh.x + Math.cos(sh.a) * 260 * ease(k), hy = sh.y + Math.sin(sh.a) * 260 * ease(k);
        const tg = ctx.createLinearGradient(hx, hy, hx - Math.cos(sh.a) * 90, hy - Math.sin(sh.a) * 90);
        tg.addColorStop(0, `rgba(255,255,255,${(1 - k) * 0.9})`); tg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.strokeStyle = tg; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - Math.cos(sh.a) * 90, hy - Math.sin(sh.a) * 90); ctx.stroke();
      }
      const reveal = (i) => Math.max(0, Math.min(1, (t - 0.6 - i * (2.4 / Math.max(8, items.length))) / 1.1));
      // nebulosas: várias nuvens por tema, girando e mudando de brilho
      L.used.forEach((th, ti) => {
        const c0 = toS(L.centers[th.k]); const n = L.count[th.k] || 0;
        const base = (90 + 36 * Math.sqrt(n)) * z;
        const a0 = Math.min(1, t / 3);
        for (let k = 0; k < 4; k++) {
          const w = t * (0.05 + k * 0.02) * (k % 2 ? -1 : 1) + ti * 1.7 + k * 1.57;
          const off = base * 0.32;
          const x = c0.x + Math.cos(w) * off, y = c0.y + Math.sin(w) * off * 0.7;
          const R = base * (0.75 + 0.12 * Math.sin(t * 0.6 + k + ti));
          const rg = ctx.createRadialGradient(x, y, 0, x, y, R);
          const col = k === 3 ? '#b9a6ff' : th.color;
          rg.addColorStop(0, col + hex(a0 * (k === 0 ? 0.2 : 0.11))); rg.addColorStop(0.5, col + hex(a0 * 0.05)); rg.addColorStop(1, col + '00');
          ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(x, y, R, 0, 6.283); ctx.fill();
        }
      });
      // luz que segue o dedo
      const lg = ctx.createRadialGradient(S.light.x, S.light.y, 0, S.light.x, S.light.y, 200);
      lg.addColorStop(0, 'rgba(201,184,255,.18)'); lg.addColorStop(1, 'rgba(201,184,255,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const cutAt = S.cutAt, sel = S.sel;
      const visible = items.map((it, i) => ({ it, i, r: reveal(i) * (it.at <= cutAt ? 1 : 0) }));
      // nascem no centro do céu e voam até o lugar delas
      const posNow = (it, r = 1) => {
        const p = L.pos[it.id]; const w = hash(it.id) * 6.28, e = ease(r);
        const ox = L.centers[it.theme] ? L.centers[it.theme].x : 0, oy = L.centers[it.theme] ? L.centers[it.theme].y : 0;
        return { x: ox + (p.x - ox) * e + Math.sin(t * 0.5 + w) * 4, y: oy + (p.y - oy) * e + Math.cos(t * 0.4 + w) * 4 };
      };
      const rOf = {}; visible.forEach((v) => { rOf[v.it.id] = v.r; });
      // fios de luz com pulsos de energia correndo
      ctx.globalCompositeOperation = 'lighter';
      const byTheme = {};
      visible.forEach((v) => { if (v.r > 0 && !v.it.parent) (byTheme[v.it.theme] = byTheme[v.it.theme] || []).push(v); });
      Object.entries(byTheme).forEach(([k, arr]) => {
        const th = THEMES.find((x) => x.k === k);
        for (let i = 1; i < arr.length; i++) {
          const a = toS(posNow(arr[i - 1].it, arr[i - 1].r)), b = toS(posNow(arr[i].it, arr[i].r));
          const al = Math.min(arr[i - 1].r, arr[i].r);
          const lgd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          lgd.addColorStop(0, th.color + hex(0.4 * al)); lgd.addColorStop(0.5, th.color + hex(0.12 * al)); lgd.addColorStop(1, th.color + hex(0.4 * al));
          ctx.strokeStyle = lgd; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          const f = ((t * 0.35 + i * 0.37) % 1);
          const px = a.x + (b.x - a.x) * f, py = a.y + (b.y - a.y) * f;
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
          pg.addColorStop(0, `rgba(255,255,255,${0.8 * al})`); pg.addColorStop(0.4, th.color + hex(0.5 * al)); pg.addColorStop(1, th.color + '00');
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 7, 0, 6.283); ctx.fill();
        }
      });
      visible.forEach((v) => {
        if (!v.it.parent || v.r <= 0) return;
        const par = items.find((x) => x.id === v.it.parent);
        const a = toS(posNow(par, rOf[par.id] || 1)), b = toS(posNow(v.it, v.r));
        ctx.strokeStyle = '#f3d98b'; ctx.globalAlpha = 0.4 * v.r; ctx.setLineDash([2, 4]); ctx.lineDashOffset = -t * 8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
      });
      ctx.globalAlpha = 1;
      // nós
      const hits = [];
      const glow = (x, y, rad, c, a) => { const gg = ctx.createRadialGradient(x, y, 0, x, y, rad); gg.addColorStop(0, c + hex(a)); gg.addColorStop(0.35, c + hex(a * 0.35)); gg.addColorStop(1, c + '00'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill(); };
      const spark = (x, y, len, rot, col, a) => {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a;
        [[len, 1.1], [len * 0.55, 0.8]].forEach(([l, w], j) => {
          ctx.rotate(j * 0.785);
          const sg = ctx.createLinearGradient(-l, 0, l, 0); sg.addColorStop(0, col + '00'); sg.addColorStop(0.5, '#ffffff'); sg.addColorStop(1, col + '00');
          ctx.fillStyle = sg; ctx.fillRect(-l, -w / 2, l * 2, w); ctx.fillRect(-w / 2, -l, w, l * 2);
        });
        ctx.restore(); ctx.globalAlpha = 1;
      };
      visible.forEach(({ it, r }) => {
        if (r <= 0) return;
        const p = toS(posNow(it, r)); const th = THEMES.find((x) => x.k === it.theme);
        const col = it.color || th.color; const selNow = sel && sel.id === it.id;
        const pop = r < 1 ? 1 + Math.sin(r * Math.PI) * 0.8 : 1;
        const hs = hash(it.id), tw = 0.8 + 0.2 * Math.sin(t * 2 + hs * 9);
        const zz = Math.max(0.8, Math.min(1.5, z));
        ctx.globalCompositeOperation = 'lighter';
        let size = 5;
        if (it.kind === 'pergunta') {
          size = 7 * pop * zz;
          glow(p.x, p.y, size * 7 * tw, col, 0.55);
          glow(p.x, p.y, size * 2.2, '#ffffff', 0.7);
          spark(p.x, p.y, size * 3.4 * tw, t * 0.15 + hs, col, 0.9 * r);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, size * 0.5, 0, 6.283); ctx.fill();
          if (it.resolved) { ctx.strokeStyle = '#8fe3b0'; ctx.lineWidth = 1.2; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(p.x, p.y, size * 1.7, t * 0.5, t * 0.5 + 5.6); ctx.stroke(); ctx.globalAlpha = 1; }
        } else if (it.kind === 'estrela') {
          size = 3.5; glow(p.x, p.y, 14 * tw, '#f3d98b', 0.7); spark(p.x, p.y, 7 * tw, -t * 0.3 + hs, '#f3d98b', 0.8 * r);
        } else if (it.kind === 'plano') {
          size = 7; glow(p.x, p.y, 16, '#8fe3b0', 0.25);
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 6.283); ctx.stroke();
          ctx.strokeStyle = '#8fe3b0'; ctx.beginPath(); ctx.arc(p.x, p.y, 7, -1.57, -1.57 + 6.283 * (it.progress || 0.001)); ctx.stroke(); ctx.lineWidth = 1;
        } else if (it.kind === 'taro') {
          size = 10; glow(p.x, p.y, 22 * tw, '#f3d98b', 0.35);
          ctx.globalCompositeOperation = 'source-over';
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(t * 0.6 + hs * 6) * 0.15);
          ctx.fillStyle = '#2c2356'; ctx.strokeStyle = '#f3d98b'; ctx.beginPath(); ctx.roundRect(-6 * zz, -9 * zz, 12 * zz, 18 * zz, 2.5); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#f3d98b'; ctx.beginPath(); ctx.arc(0, 0, 1.6 * zz, 0, 6.283); ctx.fill(); ctx.restore();
        } else if (it.kind === 'sonho') {
          // sonho: uma pequena lua em quarto, envolta em névoa
          size = 5 * zz; glow(p.x, p.y, 22 * tw * zz, col, 0.45);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#f4efff'; ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, 6.283); ctx.fill();
          ctx.fillStyle = '#0d0b22'; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(p.x + size * 0.45, p.y - size * 0.3, size * 0.85, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1;
        } else {
          // anotações, post-its, gratidão, intenção, decisão: estrelas-cristal na cor do tipo
          size = 4.5 * zz;
          const shape = it.kind === 'postit' ? '#ffe9a8' : col;
          glow(p.x, p.y, 18 * tw * zz, shape, 0.6);
          spark(p.x, p.y, 8 * tw * zz, t * 0.2 + hs * 3, shape, 0.75 * r);
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = '#fff';
          if (it.kind === 'intencao' || it.kind === 'decisao') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(0.785 + t * 0.2); ctx.fillRect(-2.4, -2.4, 4.8, 4.8); ctx.restore(); }
          else { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 6.283); ctx.fill(); }
        }
        ctx.globalCompositeOperation = 'source-over';
        if (z > 1.05 && it.kind !== 'estrela') {
          ctx.globalAlpha = r * Math.min(1, (z - 1.05) * 3) * 0.9; ctx.fillStyle = '#f4f1ea'; ctx.font = '300 11px Manrope, sans-serif'; ctx.textAlign = 'center';
          const lab = (it.title || '').length > 26 ? it.title.slice(0, 25) + '…' : it.title || '';
          ctx.fillText(lab, p.x, p.y + size * 2.2 + 12); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
        }
        if (selNow) {
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
          for (let k = 0; k < 2; k++) { const f = ((t * 0.8 + k * 0.5) % 1); ctx.globalAlpha = 0.8 * (1 - f); ctx.beginPath(); ctx.arc(p.x, p.y, size * 2 + f * 26, 0, 6.283); ctx.stroke(); }
          ctx.globalAlpha = 1;
        }
        hits.push({ it, x: p.x, y: p.y, r: Math.max(18, size * 2.4) });
      });
      // ondas do toque
      for (let i = ripples.length - 1; i >= 0; i--) {
        const q = ripples[i], k = (now - q.t) / 900; if (k > 1) { ripples.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(201,184,255,${0.6 * (1 - k)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(q.x, q.y, 6 + ease(k) * 50, 0, 6.283); ctx.stroke();
      }
      // rótulos das nebulosas
      L.used.forEach((th) => {
        const c0 = toS(L.centers[th.k]); if (!(L.count[th.k] > 0)) return;
        const ly = c0.y - (90 + 36 * Math.sqrt(L.count[th.k])) * z * 0.7;
        ctx.globalAlpha = Math.min(1, Math.max(0, (t - 1.5) / 1.5)) * 0.8 * Math.min(1, Math.max(0, (ly - 150) / 60));
        ctx.fillStyle = th.color; ctx.font = '400 11.5px Manrope, sans-serif'; ctx.textAlign = 'center';
        ctx.shadowColor = th.color; ctx.shadowBlur = 12;
        ctx.fillText(th.label.toUpperCase().split('').join(' '), c0.x, ly);
        ctx.shadowBlur = 0; ctx.textAlign = 'left';
      });
      ctx.globalAlpha = 1;
      // véu de entrada
      const veil = Math.max(0, 1 - t / 1.8);
      if (veil > 0) { ctx.fillStyle = `rgba(20,16,44,${veil})`; ctx.fillRect(0, 0, W, H); }
      S.hits = hits;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [items, L, dim]);

  // gestos: arrastar, pinça, roda do mouse, toque para abrir
  const local = (e) => { const r = cv.current.getBoundingClientRect(); const sc = r.width / st.current.dim.W; return { x: (e.clientX - r.left) / sc, y: (e.clientY - r.top) / sc }; };
  const onDown = (e) => { const S = st.current; S.pointers.set(e.pointerId, local(e)); S.moved = 0; S.target = null; cv.current.setPointerCapture(e.pointerId); S.light = local(e); };
  const onMove = (e) => {
    const S = st.current, p = local(e); S.light = p;
    if (!S.pointers.has(e.pointerId)) return;
    const prev = S.pointers.get(e.pointerId);
    if (S.pointers.size === 1) { S.cam.x -= (p.x - prev.x) / S.cam.z; S.cam.y -= (p.y - prev.y) / S.cam.z; S.moved += Math.abs(p.x - prev.x) + Math.abs(p.y - prev.y); }
    else if (S.pointers.size === 2) {
      const [a, b] = [...S.pointers.values()];
      const other = a === prev ? b : a;
      const d0 = Math.hypot(prev.x - other.x, prev.y - other.y), d1 = Math.hypot(p.x - other.x, p.y - other.y);
      if (d0 > 0) S.cam.z = Math.max(0.25, Math.min(3, S.cam.z * d1 / d0));
      S.moved += 10;
    }
    S.pointers.set(e.pointerId, p);
  };
  const onUp = (e) => {
    const S = st.current, p = local(e);
    if (S.pointers.size === 1 && S.moved < 6) {
      (S.ripples || (S.ripples = [])).push({ x: p.x, y: p.y, t: performance.now() });
      const h = (S.hits || []).slice().reverse().find((q) => Math.hypot(q.x - p.x, q.y - p.y) < q.r);
      setSel(h ? h.it : null);
      if (h) S.target = { x: L.pos[h.it.id].x, y: L.pos[h.it.id].y + 60 / Math.max(0.6, S.cam.z), z: Math.max(S.cam.z, 1.1) };
    }
    S.pointers.delete(e.pointerId);
  };
  const onWheel = (e) => { const S = st.current; S.target = null; S.cam.z = Math.max(0.25, Math.min(3, S.cam.z * (e.deltaY > 0 ? 0.9 : 1.1))); };
  const focusTheme = (k) => { const c = L.centers[k]; st.current.target = { x: c.x, y: c.y, z: 1.2 }; setSel(null); };

  const parentOf = sel && sel.parent ? items.find((i) => i.id === sel.parent) : null;
  const counts = { pergunta: 0, diario: 0, estrela: 0 };
  items.forEach((i) => { if (i.kind === 'pergunta') counts.pergunta++; else if (i.kind === 'estrela') counts.estrela++; else if (!['plano', 'taro'].includes(i.kind)) counts.diario++; });

  return (
    <div className="cz">
      <canvas ref={cv} className="cz-canvas" style={{ width: dim.W, height: dim.H, left: (390 - dim.W) / 2 }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel} aria-label="Sua constelação" role="img" />
      <div className="cz-veil-top" />
      <div className="cz-top">
        <button className="cz-ic" aria-label="Voltar" onClick={() => { window.location.hash = '#/'; }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="cz-title">Sua constelação</span>
          <span className="cz-sub">{counts.pergunta} {counts.pergunta === 1 ? 'pergunta' : 'perguntas'} · {counts.estrela} {counts.estrela === 1 ? 'estrela' : 'estrelas'} · {counts.diario} {counts.diario === 1 ? 'registro' : 'registros'}</span>
        </div>
      </div>
      <div className="cz-themes">
        {L.used.map((th) => <button key={th.k} className="cz-chip" onClick={() => focusTheme(th.k)} style={{ borderColor: th.color + '88', color: th.color }}><i style={{ background: th.color }} />{th.label} · {L.count[th.k] || 0}</button>)}
      </div>
      {items.length === 0 ? (
        <div className="cz-empty">
          <p>Seu céu começa com a primeira pergunta, anotação ou sonho.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="cz-btn" onClick={() => { window.location.hash = '#/'; }}>Perguntar à Alma</button>
            <button className="cz-btn" onClick={() => { window.location.hash = '#/diario'; }}>Abrir o diário</button>
          </div>
        </div>
      ) : null}
      {items.length > 1 ? (
        <div className="cz-time">
          <span>{cut >= 1000 ? 'Hoje' : fmt(cutAt)}</span>
          <input className="cz-range" style={{ '--p': `${cut / 10}%` }} type="range" min="0" max="1000" value={cut} onChange={(e) => setCut(+e.target.value)} aria-label="Linha do tempo da constelação" />
          <span className="cz-time-hint">Rebobine o tempo · pince para aproximar</span>
        </div>
      ) : null}
      {sel ? (
        <div className="cz-card" key={sel.id}>
          <div className="cz-card-head">
            <span className="cz-kind" style={{ color: (THEMES.find((x) => x.k === sel.theme) || {}).color }}>{KIND[sel.kind]} · {(THEMES.find((x) => x.k === sel.theme) || {}).label}</span>
            <button className="cz-x" aria-label="Fechar" onClick={() => setSel(null)}>×</button>
          </div>
          <span className="cz-date">{fmt(sel.at)}{sel.resolved ? ' · resolvida' : ''}</span>
          <span className="cz-card-title">{sel.title}</span>
          {sel.text ? <p className="cz-card-text">{sel.text}</p> : null}
          {parentOf ? <span className="cz-parent">Da pergunta: “{parentOf.title}”</span> : null}
          {sel.kind === 'pergunta' && sel.stars.length ? <span className="cz-parent">{sel.stars.length} {sel.stars.length === 1 ? 'resposta estrelada' : 'respostas estreladas'} orbitando esta estrela</span> : null}
        </div>
      ) : null}
    </div>
  );
}
