import React, { useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    c.width = 390 * DPR; c.height = 844 * DPR;
    const bg = st.current.bg || (st.current.bg = []);
    if (!bg.length) for (let i = 0; i < 220; i++) bg.push({ x: Math.random() * 390, y: Math.random() * 844, r: Math.random() * 1.3 + 0.2, p: Math.random() * 6, d: Math.random() * 0.6 + 0.2 });
    let raf;
    const draw = (now) => {
      const S = st.current, t = (now - S.t0) / 1000;
      if (S.target) { const k = 0.06; S.cam.x += (S.target.x - S.cam.x) * k; S.cam.y += (S.target.y - S.cam.y) * k; S.cam.z += (S.target.z - S.cam.z) * k; if (Math.abs(S.target.z - S.cam.z) < 0.002 && Math.abs(S.target.x - S.cam.x) < 0.5) S.target = null; }
      const { x: cx, y: cy, z } = S.cam;
      const toS = (p) => ({ x: 195 + (p.x - cx) * z, y: 400 + (p.y - cy) * z });
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const g = ctx.createRadialGradient(195, 300, 40, 195, 420, 620);
      g.addColorStop(0, '#15123a'); g.addColorStop(0.55, '#0b0a1c'); g.addColorStop(1, '#05040c');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 390, 844);
      // estrelas de fundo com paralaxe
      bg.forEach((s) => {
        const px = ((s.x - (cx * z) * 0.05 * s.d) % 390 + 390) % 390, py = ((s.y - (cy * z) * 0.05 * s.d) % 844 + 844) % 844;
        ctx.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.p));
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, s.r, 0, 6.283); ctx.fill();
      });
      ctx.globalAlpha = 1;
      const reveal = (i) => Math.max(0, Math.min(1, (t - 0.8 - i * (2.6 / Math.max(8, items.length))) / 0.7));
      // nebulosas por tema
      ctx.globalCompositeOperation = 'lighter';
      L.used.forEach((th, ti) => {
        const c0 = toS(L.centers[th.k]); const n = L.count[th.k] || 0;
        const R = (80 + 34 * Math.sqrt(n)) * z * (1 + 0.05 * Math.sin(t * 0.7 + ti));
        const a = Math.min(1, t / 3) * 0.22;
        const rg = ctx.createRadialGradient(c0.x, c0.y, 0, c0.x, c0.y, R);
        rg.addColorStop(0, th.color + Math.round(a * 255).toString(16).padStart(2, '0')); rg.addColorStop(1, th.color + '00');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(c0.x, c0.y, R, 0, 6.283); ctx.fill();
      });
      // luz que segue o dedo
      const lg = ctx.createRadialGradient(S.light.x, S.light.y, 0, S.light.x, S.light.y, 180);
      lg.addColorStop(0, 'rgba(201,184,255,.16)'); lg.addColorStop(1, 'rgba(201,184,255,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, 390, 844);
      ctx.globalCompositeOperation = 'source-over';
      const cutAt = S.cutAt, sel = S.sel;
      const visible = items.map((it, i) => ({ it, i, r: reveal(i) * (it.at <= cutAt ? 1 : 0) }));
      const posNow = (it) => { const p = L.pos[it.id]; const w = hash(it.id) * 6.28; return { x: p.x + Math.sin(t * 0.5 + w) * 4, y: p.y + Math.cos(t * 0.4 + w) * 4 }; };
      // fios
      ctx.lineWidth = 1;
      const byTheme = {};
      visible.forEach((v) => { if (v.r > 0 && !v.it.parent) (byTheme[v.it.theme] = byTheme[v.it.theme] || []).push(v); });
      Object.entries(byTheme).forEach(([k, arr]) => {
        const th = THEMES.find((x) => x.k === k);
        for (let i = 1; i < arr.length; i++) {
          const a = toS(posNow(arr[i - 1].it)), b = toS(posNow(arr[i].it));
          ctx.strokeStyle = th.color; ctx.globalAlpha = 0.28 * Math.min(arr[i - 1].r, arr[i].r);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      });
      visible.forEach((v) => {
        if (!v.it.parent || v.r <= 0) return;
        const a = toS(posNow(items.find((x) => x.id === v.it.parent))), b = toS(posNow(v.it));
        ctx.strokeStyle = '#f3d98b'; ctx.globalAlpha = 0.35 * v.r; ctx.setLineDash([2, 4]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
      });
      ctx.globalAlpha = 1;
      // nós
      const hits = [];
      visible.forEach(({ it, r }) => {
        if (r <= 0) return;
        const p = toS(posNow(it)); const th = THEMES.find((x) => x.k === it.theme);
        const col = it.color || th.color; const selNow = sel && sel.id === it.id;
        const pop = r < 1 ? 1 + (1 - r) * 1.5 : 1;
        const tw = 0.85 + 0.15 * Math.sin(t * 2 + hash(it.id) * 9);
        ctx.globalAlpha = r;
        const glow = (rad, c, a) => { const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad); gg.addColorStop(0, c + a); gg.addColorStop(1, c + '00'); ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, rad, 0, 6.283); ctx.fill(); };
        let size = 5;
        if (it.kind === 'pergunta') {
          size = 7 * pop * Math.max(0.8, z);
          glow(size * 5 * tw, col, '88');
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, size * 0.55, 0, 6.283); ctx.fill();
          // reflexo em cruz
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.5 * tw).toFixed(2) + ')'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x - size * 2.6, p.y); ctx.lineTo(p.x + size * 2.6, p.y); ctx.moveTo(p.x, p.y - size * 2.6); ctx.lineTo(p.x, p.y + size * 2.6); ctx.stroke();
          if (it.resolved) { ctx.strokeStyle = '#8fe3b0'; ctx.beginPath(); ctx.arc(p.x, p.y, size * 1.5, 0, 6.283); ctx.stroke(); }
        } else if (it.kind === 'estrela') {
          size = 3.5; glow(12 * tw, '#f3d98b', '99'); ctx.fillStyle = '#fff4d1'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 6.283); ctx.fill();
        } else if (it.kind === 'plano') {
          size = 6; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 6.283); ctx.stroke();
          ctx.strokeStyle = '#8fe3b0'; ctx.beginPath(); ctx.arc(p.x, p.y, 7, -1.57, -1.57 + 6.283 * (it.progress || 0.001)); ctx.stroke(); ctx.lineWidth = 1;
        } else if (it.kind === 'postit' || it.kind === 'nota' || it.kind === 'taro') {
          const w = it.kind === 'taro' ? 14 : 26 * Math.max(0.8, Math.min(1.3, z)), h = it.kind === 'taro' ? 22 : 18 * Math.max(0.8, Math.min(1.3, z));
          const ang = Math.sin(t * 0.6 + hash(it.id) * 6) * 0.12;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(ang);
          ctx.shadowColor = col; ctx.shadowBlur = 14;
          ctx.fillStyle = it.kind === 'taro' ? '#2c2356' : it.kind === 'postit' ? col : 'rgba(168,216,255,.18)';
          ctx.strokeStyle = it.kind === 'taro' ? '#f3d98b' : col; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 3); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          if (it.kind !== 'taro' && z > 0.9) { ctx.fillStyle = it.kind === 'postit' ? 'rgba(31,26,16,.8)' : '#f4f1ea'; ctx.font = '300 5px Manrope, sans-serif'; ctx.fillText((it.title || '').slice(0, 12), -w / 2 + 3, 2); }
          ctx.restore(); size = 10;
        } else {
          size = 4.5; glow(16 * tw, col, '99');
          ctx.fillStyle = col;
          if (it.kind === 'intencao' || it.kind === 'decisao') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(0.785); ctx.fillRect(-3, -3, 6, 6); ctx.restore(); }
          else { ctx.beginPath(); ctx.arc(p.x, p.y, it.kind === 'sonho' ? 4 : 3, 0, 6.283); ctx.fill(); }
        }
        if (z > 1.05 && it.kind !== 'estrela') {
          ctx.globalAlpha = r * Math.min(1, (z - 1.05) * 3) * 0.85; ctx.fillStyle = '#f4f1ea'; ctx.font = '300 10.5px Manrope, sans-serif'; ctx.textAlign = 'center';
          const lab = (it.title || '').length > 26 ? it.title.slice(0, 25) + '…' : it.title || '';
          ctx.fillText(lab, p.x, p.y + size * 2.2 + 10); ctx.textAlign = 'left'; ctx.globalAlpha = r;
        }
        if (selNow) { ctx.strokeStyle = '#fff'; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(p.x, p.y, size * 2.4 + 3 * Math.sin(t * 4), 0, 6.283); ctx.stroke(); }
        ctx.globalAlpha = 1;
        hits.push({ it, x: p.x, y: p.y, r: Math.max(16, size * 2) });
      });
      // rótulos das nebulosas
      L.used.forEach((th) => {
        const c0 = toS(L.centers[th.k]); if (!(L.count[th.k] > 0)) return;
        ctx.globalAlpha = Math.min(1, Math.max(0, (t - 1.5) / 1.5)) * 0.75;
        ctx.fillStyle = th.color; ctx.font = '400 11.5px Manrope, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(th.label.toUpperCase().split('').join(' '), c0.x, c0.y - (80 + 34 * Math.sqrt(L.count[th.k])) * z * 0.72);
        ctx.textAlign = 'left';
      });
      ctx.globalAlpha = 1;
      // véu de entrada
      const veil = Math.max(0, 1 - t / 2.4);
      if (veil > 0) { ctx.fillStyle = `rgba(20,16,44,${veil})`; ctx.fillRect(0, 0, 390, 844); }
      S.hits = hits;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [items, L]);

  // gestos: arrastar, pinça, roda do mouse, toque para abrir
  const local = (e) => { const r = cv.current.getBoundingClientRect(); const sc = r.width / 390; return { x: (e.clientX - r.left) / sc, y: (e.clientY - r.top) / sc }; };
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
      <canvas ref={cv} className="cz-canvas" style={{ width: 390, height: 844 }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel} aria-label="Sua constelação" role="img" />
      <div className="cz-top">
        <button className="cz-ic" aria-label="Voltar" onClick={() => { window.location.hash = '#/'; }}>‹</button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="cz-title">Sua constelação</span>
          <span className="cz-sub">{counts.pergunta} {counts.pergunta === 1 ? 'pergunta' : 'perguntas'} · {counts.estrela} {counts.estrela === 1 ? 'estrela' : 'estrelas'} · {counts.diario} {counts.diario === 1 ? 'registro' : 'registros'} · pince para aproximar</span>
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
          <input type="range" min="0" max="1000" value={cut} onChange={(e) => setCut(+e.target.value)} aria-label="Linha do tempo da constelação" />
          <span className="cz-time-hint">Arraste para rebobinar o seu céu</span>
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
