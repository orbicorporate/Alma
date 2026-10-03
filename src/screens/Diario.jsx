import React, { useEffect, useMemo, useRef, useState } from 'react';
import { load, save, onData } from '../store.js';
import { today, iso, fromIso, MO_FULL, WD_FULL } from '../dates.js';
import { phaseOf, moonPath, dayAdvice, nextFavorable, PD_TEXT } from '../cosmos.js';
import { readDream, recurring, DEEP } from '../dreams.js';
import { aiDream } from '../ai.js';
import { planNameOf } from '../questions.js';
import './diario.css';
import Starfield from '../components/Starfield.jsx';

export const TYPES = {
  sonho: { label: 'Sonho', plural: 'Sonhos', color: '#c9a8ff' },
  intencao: { label: 'Intenção', plural: 'Intenções', color: '#f3d98b', f: true },
  gratidao: { label: 'Gratidão', plural: 'Gratidões', color: '#8fe3b0', f: true },
  decisao: { label: 'Decisão', plural: 'Decisões', color: '#ffb38a', f: true },
  nota: { label: 'Anotação', plural: 'Anotações', color: '#a8d8ff', f: true }
};
const NOTE_TYPES = ['intencao', 'gratidao', 'decisao', 'nota'];
const POST_COLORS = ['#f3d98b', '#f5a8c8', '#a8d8ff', '#8fe3b0', '#c9a8ff'];
const WAKE = ['Em paz', 'Leve', 'Emocionado', 'Inquieto', 'Confuso'];
const WDS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const uid = () => Math.random().toString(36).slice(2, 10);

// Lua fiel à fase: disco com mares lunares e crateras, borda mais escura (como a real),
// terminador suave e o lado escuro levemente visível (luz da Terra).
let moonSeq = 0;
export function Moon({ f, size = 14 }) {
  const id = useMemo(() => 'mn' + (++moonSeq), []);
  const r = size / 2 - 0.5;
  const small = size < 24;
  // mares e crateras em coordenadas relativas ao raio (lado visível da Lua)
  const MARIA = [[-0.3, -0.34, 0.24, 0.18, -20], [0.1, -0.36, 0.16, 0.13, 10], [0.26, -0.1, 0.2, 0.15, 30], [0.6, -0.18, 0.11, 0.09, 0], [-0.52, 0.08, 0.2, 0.34, -10], [0.24, 0.26, 0.12, 0.1, 0], [-0.22, 0.34, 0.1, 0.08, 0]];
  const CRAT = [[-0.08, 0.66, 0.08], [0.46, -0.52, 0.05], [-0.55, -0.5, 0.05], [0.58, 0.2, 0.04], [0.05, -0.7, 0.04]];
  return (
    <svg className="moon-real" width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} aria-hidden="true" style={{ flexShrink: 0, overflow: 'visible' }}>
      <defs>
        <radialGradient id={id + 'g'} cx="60%" cy="62%" r="70%">
          <stop offset="0" stopColor="#fbf7ec" /><stop offset=".6" stopColor="#e9e3d2" /><stop offset="1" stopColor="#b9b2a0" />
        </radialGradient>
        <radialGradient id={id + 'd'} cx="45%" cy="40%" r="70%">
          <stop offset="0" stopColor="#2a2745" /><stop offset="1" stopColor="#15132a" />
        </radialGradient>
        <filter id={id + 'b'} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={Math.max(0.3, r * 0.06)} /></filter>
        <filter id={id + 's'} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation={Math.max(0.4, r * 0.07)} /></filter>
        <radialGradient id={id + 't'}><stop offset="0" stopColor="#fffdf5" stopOpacity=".9" /><stop offset="1" stopColor="#fffdf5" stopOpacity="0" /></radialGradient>
        <mask id={id + 'm'}><path d={moonPath(f, r)} transform="scale(1.12)" fill="#fff" filter={`url(#${id}b)`} /></mask>
        <clipPath id={id + 'c'}><circle r={r} /></clipPath>
      </defs>
      {/* no hemisfério sul (Brasil) a Lua aparece girada 180°: crescente iluminada à esquerda */}
      <g transform="rotate(180)">
      {/* lado escuro, com um leve brilho da Terra */}
      <circle r={r} fill={`url(#${id}d)`} />
      {!small ? <g clipPath={`url(#${id}c)`} opacity=".2" filter={`url(#${id}s)`}>{MARIA.map((m, i) => <ellipse key={i} cx={m[0] * r} cy={m[1] * r} rx={m[2] * r} ry={m[3] * r} transform={`rotate(${m[4]} ${m[0] * r} ${m[1] * r})`} fill="#0e0c1e" />)}</g> : null}
      {/* parte iluminada */}
      <g mask={`url(#${id}m)`} clipPath={`url(#${id}c)`}>
        <circle r={r} fill={`url(#${id}g)`} />
        <g filter={`url(#${id}s)`} opacity={small ? 0.28 : 0.34}>
          {MARIA.map((m, i) => <ellipse key={i} cx={m[0] * r} cy={m[1] * r} rx={m[2] * r} ry={m[3] * r} transform={`rotate(${m[4]} ${m[0] * r} ${m[1] * r})`} fill="#8f8876" />)}
        </g>
        {!small ? <circle cx={-0.08 * r} cy={0.66 * r} r={0.16 * r} fill={`url(#${id}t)`} /> : null}
        {!small ? CRAT.slice(1).map((c, i) => <circle key={i} cx={c[0] * r} cy={c[1] * r} r={c[2] * r} fill="#b8b09c" opacity=".35" filter={`url(#${id}s)`} />) : null}
      </g>
      </g>
      <circle r={r} fill="none" stroke="rgba(244,239,224,.28)" strokeWidth={small ? 0.5 : 0.7} />
    </svg>
  );
}

function planStepsOn(entries, dayIso) {
  const out = [];
  (entries || []).forEach((e, ei) => (e.plan || []).forEach((s, j) => { if (s.iso === dayIso) out.push({ q: e.q, name: planNameOf(e), note: s.note || '', t: s.t, n: j + 1, total: e.plan.length, done: s.done, ei, j }); }));
  return out;
}
// Ícones de traço único (mesma família, mesmo peso) para cada tipo de registro
const ICON_PATHS = {
  sonho: ['M19.5 14.6A8 8 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z'],
  intencao: ['M12 3c.8 5.2 2.6 7.2 7.5 9-4.9 1.8-6.7 3.8-7.5 9-.8-5.2-2.6-7.2-7.5-9 4.9-1.8 6.7-3.8 7.5-9z'],
  gratidao: ['M12 19.6s-7.4-4.5-7.4-10a4.2 4.2 0 0 1 7.4-2.7 4.2 4.2 0 0 1 7.4 2.7c0 5.5-7.4 10-7.4 10z'],
  decisao: ['M12 3.6 20.4 12 12 20.4 3.6 12z', 'M12 8.2v7.6'],
  nota: ['M4.5 19.5h3.8L18.9 8.9a2.7 2.7 0 0 0-3.8-3.8L4.5 15.7z', 'M13.6 6.6l3.8 3.8']
};
function TypeIcon({ type, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {(ICON_PATHS[type] || ICON_PATHS.nota).map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
// Sugestão de registro para um dia vazio, conforme a hora (manhã: intenção; tarde: nota; noite: gratidão)
function suggestFor(isToday, isFuture) {
  if (isFuture) return { type: 'intencao', t: 'Nada marcado para este dia', x: 'Deixe uma intenção pronta para quando ele chegar.', b: 'Definir intenção' };
  if (!isToday) return { type: 'nota', t: 'Nada registrado neste dia', x: 'Você ainda pode anotar o que lembra dele.', b: 'Escrever sobre este dia' };
  const h = new Date().getHours();
  if (h >= 4 && h < 12) return { type: 'intencao', t: 'Comece com uma intenção', x: 'Uma frase sobre como você quer atravessar o dia de hoje.', b: 'Definir intenção', alt: true };
  if (h >= 12 && h < 18) return { type: 'nota', t: 'Como está o seu dia até aqui?', x: 'Anote um pensamento, uma conversa, algo que ficou com você.', b: 'Escrever uma nota' };
  return { type: 'gratidao', t: 'Feche o dia com uma gratidão', x: 'Algo pequeno já vale: um café, uma conversa, um momento de calma.', b: 'Registrar gratidão' };
}

export default function Diario() {
  const data0 = load();
  const [journal, setJournal] = useState(data0.journal || []);
  const [postits, setPostits] = useState(data0.postits || []);
  const [entries, setEntries] = useState(data0.entries || []);
  const [profile, setProfile] = useState(data0.profile || null);
  const [view, setView] = useState('dia');
  const [planOpen, setPlanOpen] = useState(-1);
  const [noteDraft, setNoteDraft] = useState(null);
  const [sel, setSel] = useState(iso(today()));
  const [month, setMonth] = useState(() => { const t = today(); return { y: t.getFullYear(), m: t.getMonth() }; });
  const [editor, setEditor] = useState(null);
  const [reading, setReading] = useState(null);
  const [readTab, setReadTab] = useState('psy');
  const [deepSkip, setDeepSkip] = useState(false);
  const [extra, setExtra] = useState('');
  const [dreamAi, setDreamAi] = useState({});
  const [symOpen, setSymOpen] = useState(0);
  const [extraOpen, setExtraOpen] = useState(false);
  const [noteFilter, setNoteFilter] = useState('all');
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'diario', hide: !!editor || !!reading } }));
  }, [editor, reading]);
  // atalho vindo de outras telas (ex.: Início abre direto em Sonhos)
  useEffect(() => {
    const on = (e) => { if (e.detail && e.detail.view) setView(e.detail.view); };
    window.addEventListener('diario:go', on);
    try { const v = sessionStorage.getItem('diario:view'); if (v) { setView(v); sessionStorage.removeItem('diario:view'); } } catch (e) { /* sem armazenamento */ }
    return () => window.removeEventListener('diario:go', on);
  }, []);
  useEffect(() => () => window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'diario', hide: false } })), []);
  const [toast, setToast] = useState('');
  const first = useRef(true);

  useEffect(() => onData((d) => { setJournal(d.journal || []); setPostits(d.postits || []); setEntries(d.entries || []); if (d.profile) setProfile(d.profile); }), []);
  useEffect(() => { if (first.current) { first.current = false; return; } save({ journal }); }, [journal]);
  useEffect(() => { save({ postits }); }, [postits]);
  const flash = (t) => { setToast(t); clearTimeout(flash.k); flash.k = setTimeout(() => setToast(''), 2400); };

  const byDay = useMemo(() => {
    const m = {}; journal.forEach((j) => { (m[j.iso] = m[j.iso] || []).push(j); }); return m;
  }, [journal]);

  const openEditor = (type, entry) => setEditor(entry ? Object.assign({}, entry) : { id: null, type, iso: sel, title: '', text: '', wake: '', decideBy: '' });
  const saveEditor = () => {
    const e = editor;
    if (!(e.title || '').trim() && !(e.text || '').trim()) { flash('Escreva algo antes de guardar.'); return; }
    const saved = e.id ? e : Object.assign({}, e, { id: uid(), at: Date.now() });
    if (e.id) setJournal(journal.map((j) => (j.id === e.id ? e : j)));
    else setJournal(journal.concat([saved]));
    setEditor(null);
    if (saved.type === 'sonho') { setReadTab('psy'); setDeepSkip(false); setSymOpen(0); setExtraOpen(false); setReading(saved); return; }
    flash(e.id ? 'Registro atualizado' : `${TYPES[e.type].label} ${TYPES[e.type].f ? 'guardada' : 'guardado'} no seu céu`);
  };
  const delEditor = () => { setJournal(journal.filter((j) => j.id !== editor.id)); setEditor(null); flash('Registro apagado'); };
  // Saída das folhas: mais discreta que a entrada (180ms), depois desmonta
  const [leaving, setLeaving] = useState(false);
  const closeSheet = (fn) => { if (leaving) return; setLeaving(true); setTimeout(() => { fn(); setLeaving(false); }, 180); };
  const closeEditor = () => closeSheet(() => setEditor(null));
  const closeReading = () => closeSheet(() => setReading(null));
  useEffect(() => {
    if (!editor && !reading) return undefined;
    const onKey = (ev) => { if (ev.key === 'Escape') { if (reading) closeReading(); else closeEditor(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const selDate = fromIso(sel);
  const adv = dayAdvice(selDate, profile);

  // ---------- Mês
  const renderMonth = () => {
    const firstDay = new Date(month.y, month.m, 1, 12);
    const days = new Date(month.y, month.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay.getDay(); i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(month.y, month.m, d, 12));
    const tIso = iso(today());
    return (
      <div className="dz-fade">
        <div className="dz-monthbar">
          <button className="dz-ic" aria-label="Mês anterior" onClick={() => setMonth(month.m === 0 ? { y: month.y - 1, m: 11 } : { y: month.y, m: month.m - 1 })}>‹</button>
          <span className="dz-monthname">{MO_FULL[month.m]} <span>{month.y}</span></span>
          <button className="dz-ic" aria-label="Próximo mês" onClick={() => setMonth(month.m === 11 ? { y: month.y + 1, m: 0 } : { y: month.y, m: month.m + 1 })}>›</button>
        </div>
        <div className="dz-grid dz-wd">{WDS.map((w, i) => <span key={i}>{w}</span>)}</div>
        <div className="dz-grid">
          {cells.map((d, i) => {
            if (!d) return <span key={i} />;
            const di = iso(d), a = dayAdvice(d, profile), recs = byDay[di] || [], steps = planStepsOn(entries, di);
            const cls = 'dz-day' + (di === sel ? ' dz-sel' : '') + (di === tIso ? ' dz-today' : '') + (a.phase.idx === 4 || a.phase.idx === 0 ? ' dz-lunar' : '');
            return (
              <button key={i} className={cls} onClick={() => setSel(di)} aria-label={`${d.getDate()} de ${MO_FULL[d.getMonth()]}`} aria-pressed={di === sel ? 'true' : 'false'}>
                <span className="dz-dnum">{d.getDate()}</span>
                <Moon f={a.phase.frac} size={15} />
                <span className="dz-marks">
                  {recs.slice(0, 3).map((r, k) => <i key={k} style={{ background: TYPES[r.type].color }} />)}
                  {steps.length ? <i className="dz-step" /> : null}
                </span>
                {a.agir ? <b className="dz-fav dz-fav-act" title="Favorável para agir" /> : a.decidir ? <b className="dz-fav dz-fav-dec" title="Favorável para decidir" /> : null}
              </button>
            );
          })}
        </div>
        <div className="dz-legend">
          <span><b className="dz-fav dz-fav-act" />Bom para agir</span>
          <span><b className="dz-fav dz-fav-dec" />Bom para decidir</span>
          <span><i className="dz-step" />Passo do plano</span>
        </div>
        <div className="glass dz-daysum">
          <Moon f={adv.phase.frac} size={36} />
          <span className="dz-daysum-t">
            <b>{sel === iso(today()) ? 'Hoje, ' : ''}{selDate.getDate()} de {MO_FULL[selDate.getMonth()]}</b>
            <small>{adv.phase.name}, {(byDay[sel] || []).length} {(byDay[sel] || []).length === 1 ? 'registro' : 'registros'}</small>
          </span>
          <button className="dz-open" onClick={() => setView('dia')}>Abrir o dia</button>
        </div>
        <button className="dz-yearlink" onClick={() => setView('ano')}>Ver o ano em cores</button>
      </div>
    );
  };

  // ---------- Cartões de registro (curtos: título e duas linhas)
  const recCard = (r, showDate, showType) => {
    const t = TYPES[r.type], d = fromIso(r.iso);
    const meta = [showType ? t.label : null, showDate ? `${d.getDate()} de ${MO_FULL[d.getMonth()]}` : null, r.wake ? `acordei ${r.wake.toLowerCase()}` : null, r.decideBy ? `decidir até ${fromIso(r.decideBy).getDate()}/${fromIso(r.decideBy).getMonth() + 1}` : null].filter(Boolean).join(', ');
    return (
      <div key={r.id} className="dz-rec" style={{ '--c': t.color }}>
        <button className="dz-rec-main" onClick={() => openEditor(r.type, r)}>
          <span className="dz-rec-ic"><TypeIcon type={r.type} size={18} /></span>
          <span className="dz-rec-body">
            {meta ? <span className="dz-rec-k">{meta}</span> : null}
            <span className="dz-rec-t">{r.title || (r.text || '').split('\n')[0].slice(0, 60)}</span>
            {r.text && r.title ? <span className="dz-rec-x">{r.text}</span> : null}
          </span>
        </button>
        {r.type === 'sonho' ? (
          <button className="dz-read" onClick={() => { setReadTab('psy'); setDeepSkip(false); setSymOpen(0); setExtraOpen(false); setReading(r); }}>
            <span className="dz-read-ic" aria-hidden="true">✦</span>Ver o que o sonho diz<span className="dz-read-chev" aria-hidden="true">›</span>
          </button>
        ) : null}
      </div>
    );
  };

  // ---------- Dia
  const toggleStep = (st) => {
    const list = entries.slice(); const e = Object.assign({}, list[st.ei]);
    e.plan = e.plan.map((x, k) => (k === st.j ? Object.assign({}, x, { done: !x.done }) : x));
    list[st.ei] = e; setEntries(list); save({ entries: list });
    if (!st.done) flash('Passo concluído. Que bom!');
  };
  const saveStepNote = (st, v, finish) => {
    const list = entries.slice(); const e = Object.assign({}, list[st.ei]);
    e.plan = e.plan.map((x, k) => (k === st.j ? Object.assign({}, x, { note: v.trim() || undefined }, finish ? { done: true } : {}) : x));
    list[st.ei] = e; setEntries(list); save({ entries: list }); setNoteDraft(null);
    flash(finish ? 'Resposta guardada e passo concluído' : 'Resposta guardada');
  };
  const renderDayCard = () => {
    const recs = byDay[sel] || [];
    const steps = planStepsOn(entries, sel);
    const groups = Object.keys(TYPES).map((k) => [k, recs.filter((r) => r.type === k)]).filter((g) => g[1].length);
    const isToday = sel === iso(today());
    const good = adv.agir ? 'Bom dia para agir' : adv.decidir ? 'Bom dia para decidir' : adv.descansar ? 'Bom dia para descansar' : 'Dia de observar e preparar';
    const goodC = adv.agir ? 'var(--mint)' : adv.decidir ? 'var(--lilac)' : adv.descansar ? 'var(--sky)' : 'var(--gold)';
    const move = (n) => { const d = fromIso(sel); d.setDate(d.getDate() + n); setSel(iso(d)); setMonth({ y: d.getFullYear(), m: d.getMonth() }); };
    const sugg = suggestFor(isToday, sel > iso(today()));
    return (
      <div className="dz-day-panel">
        <div className="glass dz-sky" style={{ '--g': goodC }}>
          <div className="dz-daynav">
            <button className="dz-ic" aria-label="Dia anterior" onClick={() => move(-1)}>‹</button>
            <span className="dz-daynav-t" aria-live="polite">{isToday ? 'Hoje' : WD_FULL[selDate.getDay()].split('-')[0]}<small>{selDate.getDate()} de {MO_FULL[selDate.getMonth()]}</small></span>
            <button className="dz-ic" aria-label="Próximo dia" onClick={() => move(1)}>›</button>
          </div>
          <div className="dz-sky-main">
            <div className="dz-moon-big"><div className="dz-moon-glow" /><Moon f={adv.phase.frac} size={60} /></div>
            <div className="dz-sky-txt">
              <span className="dz-good">{good}{adv.strong ? <em>forte</em> : null}</span>
              <span className="dz-phase">{adv.phase.name}<small>{adv.phase.lit}% iluminada</small></span>
            </div>
          </div>
          {adv.pd ? <p className="dz-pd"><span>Dia pessoal {adv.pd}</span>{PD_TEXT[adv.pd].charAt(0).toUpperCase() + PD_TEXT[adv.pd].slice(1)}.</p> : null}
        </div>
        <div className="dz-group">
          <span className="dz-group-h dz-area-h">{isToday ? 'Registrar hoje' : 'Registrar neste dia'}</span>
          <div className="dz-addgrid">
            {Object.entries(TYPES).map(([k, t]) => (
              <button key={k} className="dz-addtile" onClick={() => openEditor(k)} style={{ '--c': t.color }}>
                <span className="dz-addic"><TypeIcon type={k} /></span>
                <span>{k === 'nota' ? 'Nota' : t.label}</span>
              </button>
            ))}
          </div>
        </div>
        {steps.length ? (
          <div className="dz-group">
            <span className="dz-group-h" style={{ color: 'var(--mint)' }}><i style={{ background: 'var(--mint)' }} />Passo de plano para este dia</span>
            {steps.map((st, i) => {
              const open = planOpen === i;
              return (
                <div key={i} className={'glass dz-plancard' + (st.done ? ' dz-plan-done' : '') + (open ? ' open' : '')}>
                  <button className="dz-pc-head" onClick={() => { setPlanOpen(open ? -1 : i); setNoteDraft(null); }} aria-expanded={open ? 'true' : 'false'}>
                    <span className="dz-pc-ring" style={{ '--p': (st.done ? st.n : st.n - 1) / st.total }}><b>{st.done ? '✓' : st.n}</b></span>
                    <span className="dz-pc-txt">
                      <small>Passo {st.n} de {st.total}{st.done ? ' · feito' : ''}</small>
                      <span className="dz-pc-t">{st.t}</span>
                    </span>
                    <span className="dz-pc-chev" aria-hidden="true">›</span>
                  </button>
                  {open ? (
                    <div className="dz-pc-body">
                      <span className="dz-plan-from">Do plano: {st.name}</span>
                      {noteDraft != null ? (
                        <div className="dz-pc-note-ed">
                          <textarea className="dz-pc-input" rows={4} autoFocus value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} placeholder="Escreva aqui o que este passo pede de você" />
                          <div className="dz-pc-btns">
                            {!st.done ? <button className="dz-pc-done" onClick={() => saveStepNote(st, noteDraft, true)}>Guardar e concluir</button> : null}
                            <button className="dz-pc-all" onClick={() => saveStepNote(st, noteDraft, false)}>Guardar</button>
                            <button className="dz-pc-all dz-pc-ghost" onClick={() => setNoteDraft(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : st.note ? (
                        <button className="dz-pc-note" onClick={() => setNoteDraft(st.note)}><small>Sua resposta · ✎ editar</small><span>{st.note}</span></button>
                      ) : (
                        <button className="dz-pc-noteadd" onClick={() => setNoteDraft('')}>✎ Responder dentro deste passo</button>
                      )}
                      {noteDraft == null ? <div className="dz-pc-btns">
                        <button className={'dz-pc-done' + (st.done ? ' on' : '')} onClick={() => toggleStep(st)} aria-pressed={st.done ? 'true' : 'false'}>{st.done ? '✓ Feito' : 'Marcar como feito'}</button>
                        <button className="dz-pc-all" onClick={() => { window.dispatchEvent(new CustomEvent('alma:go', { detail: { screen: 'plan', planIdx: st.ei, planPrev: 'journal' } })); window.location.hash = '#/'; }}>Plano completo ›</button>
                      </div> : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {groups.map(([k, list]) => (
          <div key={k} className="dz-group">
            <span className="dz-group-h" style={{ color: TYPES[k].color }}><i style={{ background: TYPES[k].color }} />{list.length > 1 ? TYPES[k].plural : TYPES[k].label}{list.length > 1 ? <em>{list.length}</em> : null}</span>
            {list.map((r) => recCard(r, false))}
          </div>
        ))}
        {!groups.length && !steps.length ? (
          <div className="dz-invite" style={{ '--c': TYPES[sugg.type].color }}>
            <span className="dz-invite-ic"><TypeIcon type={sugg.type} size={22} /></span>
            <span className="dz-invite-t">{sugg.t}</span>
            <span className="dz-invite-x">{sugg.x}</span>
            <div className="dz-invite-btns">
              <button className="dz-invite-cta" onClick={() => openEditor(sugg.type)}>{sugg.b}</button>
              {sugg.alt ? <button className="dz-invite-alt" onClick={() => openEditor('sonho')} style={{ '--c': TYPES.sonho.color }}>Anotar um sonho</button> : null}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // ---------- Sonhos
  const renderDreams = () => {
    const list = journal.filter((j) => j.type === 'sonho').sort((a, b) => (b.iso + (b.at || 0)).localeCompare(a.iso + (a.at || 0)));
    const rec = recurring(list);
    return (
      <div className="dz-fade">
        <div className="glass dz-hero" style={{ '--c': TYPES.sonho.color }}>
          <span className="dz-hero-ic"><TypeIcon type="sonho" size={22} /></span>
          <span className="dz-hero-t">Seus sonhos</span>
          <span className="dz-hero-x">Anote ao acordar. A Alma lê cada sonho por dois caminhos: a psicanálise e a espiritualidade.</span>
          <button className="dz-hero-cta" onClick={() => { setSel(iso(today())); setEditor({ id: null, type: 'sonho', iso: iso(today()), title: '', text: '', wake: '', decideBy: '' }); }}>Anotar um sonho</button>
        </div>
        {rec.length ? (
          <div className="dz-group">
            <span className="dz-group-h" style={{ color: TYPES.sonho.color }}>Símbolos que se repetem</span>
            <div className="dz-chips">{rec.map((r) => <span key={r.name} className="dz-chip dz-chip-sm dz-chip-sym">{r.name}<em>{r.n}×</em></span>)}</div>
          </div>
        ) : null}
        {list.length ? (
          <div className="dz-group">
            <span className="dz-group-h" style={{ color: TYPES.sonho.color }}>{list.length === 1 ? '1 sonho anotado' : `${list.length} sonhos anotados`}</span>
            {list.map((r) => recCard(r, true))}
          </div>
        ) : <p className="dz-empty-note">Nenhum sonho anotado ainda. Deixe o celular perto da cama e escreva o que lembrar logo ao acordar, mesmo que seja só uma imagem.</p>}
      </div>
    );
  };

  // ---------- Notas (intenções, gratidões, decisões, anotações)
  const renderNotes = () => {
    const kinds = noteFilter === 'all' ? NOTE_TYPES : [noteFilter];
    const list = journal.filter((j) => kinds.includes(j.type)).sort((a, b) => (b.iso + (b.at || 0)).localeCompare(a.iso + (a.at || 0)));
    const byDate = [];
    list.forEach((r) => { const last = byDate[byDate.length - 1]; if (last && last[0] === r.iso) last[1].push(r); else byDate.push([r.iso, [r]]); });
    const addType = noteFilter === 'all' ? 'nota' : noteFilter;
    return (
      <div className="dz-fade">
        <div className="dz-chips dz-filter" role="group" aria-label="Filtrar anotações">
          <button className={'dz-chip dz-fchip' + (noteFilter === 'all' ? ' on' : '')} onClick={() => setNoteFilter('all')} aria-pressed={noteFilter === 'all' ? 'true' : 'false'} style={{ '--c': 'var(--sky)' }}>Tudo</button>
          {NOTE_TYPES.map((k) => <button key={k} className={'dz-chip dz-fchip' + (noteFilter === k ? ' on' : '')} onClick={() => setNoteFilter(k)} aria-pressed={noteFilter === k ? 'true' : 'false'} style={{ '--c': TYPES[k].color }}>{TYPES[k].plural}</button>)}
        </div>
        <button className="dz-newline" onClick={() => { setSel(iso(today())); setEditor({ id: null, type: addType, iso: iso(today()), title: '', text: '', wake: '', decideBy: '' }); }} style={{ '--c': TYPES[addType].color }}>
          <span className="dz-newline-ic"><TypeIcon type={addType} size={18} /></span>{noteFilter === 'all' ? 'Nova anotação' : `Nova ${TYPES[addType].label.toLowerCase()}`}
        </button>
        {byDate.map(([d, rs]) => {
          const dd = fromIso(d);
          return (
            <div key={d} className="dz-group">
              <span className="dz-group-h dz-area-h">{d === iso(today()) ? 'Hoje' : `${WD_FULL[dd.getDay()].split('-')[0]}, ${dd.getDate()} de ${MO_FULL[dd.getMonth()]}`}</span>
              {rs.map((r) => recCard(r, false, noteFilter === 'all'))}
            </div>
          );
        })}
        {!list.length ? <p className="dz-empty-note">Nada por aqui ainda. Intenções, gratidões e decisões que você registrar aparecem nesta lista.</p> : null}
      </div>
    );
  };

  // ---------- Leitura do sonho
  const dreamKey = (r) => JSON.stringify([r.title || '', r.text || '', r.wake || '', r.deep || {}]);
  // A Alma lê o sonho com IA assim que as perguntas de aprofundamento terminam; fica guardado no próprio sonho.
  useEffect(() => {
    if (!reading) return;
    const r = journal.find((j) => j.id === reading.id) || reading;
    const deep = r.deep || {};
    const ready = DEEP.every((d) => deep[d.k]) || deepSkip;
    const key = dreamKey(r);
    if (!ready || (r.ai && r.aiKey === key) || dreamAi[r.id] === key) return;
    setDreamAi((m) => Object.assign({}, m, { [r.id]: key }));
    const recent = recurring(journal.filter((j) => j.type === 'sonho')).map((x) => x.name).join(', ');
    aiDream(r, recent).then((out) => {
      setDreamAi((m) => Object.assign({}, m, { [r.id]: out ? 'ok' : 'off' }));
      if (!out) return;
      setJournal((list) => { const next = list.map((j) => (j.id === r.id ? Object.assign({}, j, { ai: out, aiKey: key }) : j)); save({ journal: next }); return next; });
    });
  }, [reading, journal, deepSkip]);

  const renderReading = () => {
    const r = journal.find((j) => j.id === reading.id) || reading;
    const L = readDream(r);
    const deep = r.deep || {};
    const setDeep = (patch) => setJournal(journal.map((j) => (j.id === r.id ? Object.assign({}, j, { deep: Object.assign({}, j.deep || {}, patch) }) : j)));
    const qi = DEEP.findIndex((d) => !deep[d.k]);
    const askNow = qi >= 0 && !deepSkip;
    const psy = readTab === 'psy';
    const acc = psy ? TYPES.sonho.color : 'var(--gold)';
    const key = dreamKey(r);
    const ai = r.ai && r.aiKey === key ? r.ai : null;
    const loading = !askNow && !ai && dreamAi[r.id] === key;
    // Mesmo formato para a leitura da IA e para a leitura local
    const syms = ai ? ai.simbolos.map((x) => ({ name: x.imagem, t: psy ? x.psi : x.esp }))
      : L.symbols.map((x) => ({ name: x.name, t: psy ? x.psy : x.spi }));
    const items = ai
      ? (psy ? [['◐', 'O que o sonho elabora', ai.psi.elabora], ['⚖', 'O que ele equilibra', ai.psi.compensa], ['↔', 'Ponte com o seu dia', ai.psi.ponte]]
        : [['✧', 'A mensagem', ai.esp.mensagem], ['☾', 'Uma prática', ai.esp.pratica]])
      : [['◐', psy ? 'O que o sonho elabora' : 'A mensagem', (psy ? L.psy : L.spi).intro]]
        .concat((psy ? L.deepPsy : L.deepSpi).map((x) => ['•', x.label, x.t]))
        .concat([[psy ? '⚖' : '☾', psy ? 'Para pensar' : 'Para levar', (psy ? L.psy : L.spi).close]]);
    const question = ai ? ai.pergunta : L.question;
    const keepQ = () => {
      setJournal(journal.concat([{ id: uid(), at: Date.now(), type: 'intencao', iso: iso(today()), title: question, text: `Do sonho “${r.title || 'sem título'}”` }]));
      setReading(null); flash('Pergunta guardada nas suas intenções de hoje');
    };

    return (
      <>
        <button className={'dz-scrim' + (leaving ? ' dz-out' : '')} aria-label="Fechar" onClick={closeReading} />
        <div className={'dz-sheet dz-reading' + (leaving ? ' dz-out' : '')} role="dialog" aria-modal="true" aria-label="Leitura do sonho" style={{ '--c': TYPES.sonho.color }}>
          <div className="dz-handle" />
          <span className="dz-label" style={{ color: TYPES.sonho.color }}>Leitura do sonho</span>
          <span className="dz-read-title">{r.title || 'Seu sonho'}</span>
          {askNow ? (
            <div className="dz-deep" key={qi}>
              <div className="dz-deep-top">
                <span className="dz-label" style={{ color: 'var(--gold)' }}>Antes de ler, {qi + 1} de {DEEP.length}</span>
                <button className="dz-deep-skip" onClick={() => setDeepSkip(true)}>Pular</button>
              </div>
              <span className="dz-deep-q">{DEEP[qi].q}</span>
              <div className="dz-chips">
                {DEEP[qi].opts.map((o) => <button key={o[0]} className="dz-chip dz-deep-opt" onClick={() => setDeep({ [DEEP[qi].k]: o[0] })}>{o[0]}</button>)}
              </div>
              <div className="dz-deep-bar"><i style={{ width: `${(qi / DEEP.length) * 100}%` }} /></div>
            </div>
          ) : loading ? (
            <div className="dz-rl-load">
              <span className="dz-rl-orb orb-live" />
              <span className="dz-rl-lt">A Alma está lendo o seu sonho</span>
              <span className="dz-rl-ls">Psicanálise e tradições espirituais, imagem por imagem</span>
              <i /><i /><i />
            </div>
          ) : (
            <>
              {ai ? <p className="dz-rl-lead">{ai.essencia}</p> : null}
              <div className="dz-seg" role="tablist">
                <button role="tab" aria-selected={psy} className={'dz-seg-b' + (psy ? ' on' : '')} onClick={() => setReadTab('psy')}>Psicanálise</button>
                <button role="tab" aria-selected={!psy} className={'dz-seg-b' + (!psy ? ' on' : '')} onClick={() => setReadTab('spi')}>Espiritual</button>
              </div>
              <div className="dz-rl-body" key={readTab} style={{ '--c': acc }}>
                {syms.length ? (
                  <div className="dz-rl-block">
                    <span className="dz-rl-h">As imagens do sonho</span>
                    {syms.map((x, i) => (
                      <button key={i} className={'dz-rl-sym' + (symOpen === i ? ' open' : '')} onClick={() => setSymOpen(symOpen === i ? -1 : i)} aria-expanded={symOpen === i ? 'true' : 'false'}>
                        <span className="dz-rl-sym-top"><i />{x.name}<em aria-hidden="true">›</em></span>
                        {symOpen === i ? <span className="dz-rl-sym-t">{x.t}</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="dz-rl-block">
                  <span className="dz-rl-h">{psy ? 'A leitura psicanalítica' : 'A leitura espiritual'}</span>
                  {items.map((it, i) => (
                    <div key={i} className="dz-rl-item">
                      <span className="dz-rl-ic" aria-hidden="true">{it[0]}</span>
                      <div><span className="dz-rl-k">{it[1]}</span><p>{it[2]}</p></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dz-question">
                <span className="dz-label" style={{ color: 'var(--gold)' }}>Pergunta para levar</span>
                <p>{question}</p>
              </div>
              {extraOpen ? (
                <div className="dz-extra">
                  <input className="dz-input" autoFocus value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Uma cor, um objeto, um lugar, uma fala" aria-label="Detalhe do sonho" />
                  <button className="dz-extra-ok" disabled={!extra.trim()} onClick={() => { setDeep({ extra: [deep.extra, extra.trim()].filter(Boolean).join('. ') }); setExtra(''); setExtraOpen(false); }}>Reler</button>
                </div>
              ) : (
                <button className="dz-rl-more" onClick={() => setExtraOpen(true)}>+ Lembrei de um detalhe, reler o sonho</button>
              )}
              {!ai && dreamAi[r.id] === 'off' ? <p className="dz-foot">Leitura básica: a leitura completa da Alma não respondeu agora. Feche e abra de novo para tentar outra vez.</p> : null}
              <p className="dz-foot">Leitura simbólica, não diagnóstico nem previsão. O sentido final é seu.</p>
            </>
          )}
          <div className="dz-sheet-actions">
            <button className="dz-del dz-ghost" onClick={closeReading}>Fechar</button>
            {!askNow && !loading ? <button className="dz-save cta" onClick={keepQ} style={{ '--c': 'var(--gold)', padding: '0 22px' }}>Guardar a pergunta</button> : null}
          </div>
        </div>
      </>
    );
  };

  // ---------- Ano em cores
  const renderYear = () => {
    const y = month.y;
    return (
      <div className="dz-fade">
        <div className="dz-monthbar">
          <button className="dz-ic" aria-label="Ano anterior" onClick={() => setMonth({ y: y - 1, m: month.m })}>‹</button>
          <span className="dz-monthname">{y} <span>em cores</span></span>
          <button className="dz-ic" aria-label="Próximo ano" onClick={() => setMonth({ y: y + 1, m: month.m })}>›</button>
        </div>
        <div className="dz-year">
          {MO_FULL.map((mn, m) => {
            const first = new Date(y, m, 1, 12).getDay(), days = new Date(y, m + 1, 0).getDate();
            const dots = [];
            for (let i = 0; i < first; i++) dots.push(<i key={'e' + i} className="dz-ydot dz-yempty" />);
            for (let d = 1; d <= days; d++) {
              const di = iso(new Date(y, m, d, 12)); const r = byDay[di];
              const c = r ? TYPES[r[r.length - 1].type].color : null;
              dots.push(<i key={d} className={'dz-ydot' + (di === iso(today()) ? ' dz-ytoday' : '')} style={c ? { background: c, boxShadow: `0 0 6px ${c}` } : undefined} />);
            }
            return (
              <button key={m} className={'glass dz-ymonth' + (y === today().getFullYear() && m === today().getMonth() ? ' dz-ynow' : '')} onClick={() => { setMonth({ y, m }); setView('mes'); }}>
                <span>{mn.slice(0, 3)}</span>
                <div className="dz-ygrid">{dots}</div>
              </button>
            );
          })}
        </div>
        <div className="dz-legend">{Object.values(TYPES).map((t, i) => <span key={i}><i className="dz-ldot" style={{ background: t.color }} />{t.label}</span>)}</div>
        <p className="dz-foot">Cada dia ganha a cor do que você registrou. Com o tempo, seu ano vira um mosaico da sua história.</p>
      </div>
    );
  };

  // ---------- Quadro de post-its
  const board = useRef(null);
  const drag = useRef(null);
  const [dropped, setDropped] = useState(null);
  const addPost = () => {
    const n = { id: uid(), at: Date.now(), x: 16 + Math.random() * 220, y: 16 + Math.random() * 400, color: POST_COLORS[postits.length % POST_COLORS.length], text: '', rot: (Math.random() - 0.5) * 8 };
    setPostits(postits.concat([n]));
  };
  const onDown = (e, p) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return;
    const r = board.current.getBoundingClientRect(), sc = r.width / board.current.offsetWidth;
    drag.current = { id: p.id, dx: (e.clientX - r.left) / sc - p.x, dy: (e.clientY - r.top) / sc - p.y, sc };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const r = board.current.getBoundingClientRect();
    const x = Math.max(-10, Math.min(250, (e.clientX - r.left) / d.sc - d.dx)), y = Math.max(-10, Math.min(420, (e.clientY - r.top) / d.sc - d.dy));
    setPostits((ps) => ps.map((p) => (p.id === d.id ? Object.assign({}, p, { x, y }) : p)));
  };
  const onUp = () => { if (drag.current) { setDropped(drag.current.id + ':' + Date.now()); drag.current = null; } };
  const renderBoard = () => (
    <div className="dz-fade">
      <div className="dz-boardbar">
        <span className="dz-hint">Arraste, escreva e mude a cor.</span>
        <button className="dz-new" onClick={addPost}>Novo post-it</button>
      </div>
      <div ref={board} className="dz-board" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {postits.length === 0 ? (
          <div className="dz-empty">
            <span>Seu quadro está vazio.</span>
            <button className="dz-empty-cta" onClick={addPost}>Colar o primeiro post-it</button>
          </div>
        ) : null}
        {postits.map((p) => (
          <div key={p.id} className={'dz-post' + (dropped && dropped.startsWith(p.id + ':') ? ' dz-wobble' : '')} style={{ left: p.x, top: p.y, background: p.color, '--r': `${p.rot}deg` }} onPointerDown={(e) => onDown(e, p)}>
            <textarea value={p.text} placeholder="Escreva aqui" aria-label="Texto do post-it" onChange={(e) => setPostits(postits.map((q) => (q.id === p.id ? Object.assign({}, q, { text: e.target.value }) : q)))} />
            <div className="dz-post-bar">
              {POST_COLORS.map((c) => <button key={c} aria-label="Mudar cor" className="dz-sw" style={{ background: c, outline: c === p.color ? '2px solid rgba(0,0,0,.5)' : 'none' }} onClick={() => setPostits(postits.map((q) => (q.id === p.id ? Object.assign({}, q, { color: c }) : q)))} />)}
              <button className="dz-x" aria-label="Apagar post-it" onClick={() => setPostits(postits.filter((q) => q.id !== p.id))}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ---------- Editor
  const renderEditor = () => {
    const e = editor, t = TYPES[e.type];
    const sugg = e.type === 'decisao' ? nextFavorable('decidir', today(), profile, 3) : [];
    return (
      <>
        <button className={'dz-scrim' + (leaving ? ' dz-out' : '')} aria-label="Fechar" onClick={closeEditor} />
        <div className={'dz-sheet dz-editor' + (leaving ? ' dz-out' : '')} role="dialog" aria-modal="true" aria-label={t.label} style={{ '--c': t.color }}>
          <div className="dz-handle" />
          <div className="dz-edhead">
            <span className="dz-addic"><TypeIcon type={e.type} /></span>
            <span className="dz-edhead-t">{e.id ? 'Editar ' + t.label.toLowerCase() : e.type === 'nota' ? 'Nova anotação' : (t.f ? 'Nova ' : 'Novo ') + t.label.toLowerCase()}<small>{fromIso(e.iso).getDate()} de {MO_FULL[fromIso(e.iso).getMonth()]}</small></span>
            <button className="dz-ic dz-close" aria-label="Fechar" onClick={closeEditor}>×</button>
          </div>
          <input className="dz-input" value={e.title} aria-label="Título" placeholder={e.type === 'sonho' ? 'Um nome para o sonho' : e.type === 'decisao' ? 'O que você precisa decidir?' : 'Título'} onChange={(ev) => setEditor(Object.assign({}, e, { title: ev.target.value }))} />
          <textarea className="dz-area" value={e.text} rows={5} aria-label="Texto" placeholder={e.type === 'sonho' ? 'Conte o sonho: lugares, pessoas, cores, sensações.' : e.type === 'gratidao' ? 'Pelo que você é grato hoje?' : e.type === 'intencao' ? 'Qual intenção você quer sustentar?' : e.type === 'decisao' ? 'Quais são as opções e o que pesa em cada uma?' : 'Escreva livremente.'} onChange={(ev) => setEditor(Object.assign({}, e, { text: ev.target.value }))} />
          {e.type === 'sonho' ? <span className="dz-hint">Ao guardar, a Alma lê o seu sonho pela psicanálise e pela espiritualidade.</span> : null}
          {e.type === 'sonho' ? (
            <div className="dz-sub">
              <span className="dz-label">Como você acordou?</span>
              <div className="dz-chips">{WAKE.map((w) => <button key={w} className={'dz-chip dz-fchip' + (e.wake === w ? ' on' : '')} aria-pressed={e.wake === w ? 'true' : 'false'} onClick={() => setEditor(Object.assign({}, e, { wake: e.wake === w ? '' : w }))}>{w}</button>)}</div>
            </div>
          ) : null}
          {e.type === 'decisao' ? (
            <div className="dz-sub">
              <span className="dz-label">Dias favoráveis para decidir</span>
              <div className="dz-chips">
                {sugg.map((s, i) => {
                  const di = iso(s.date);
                  return <button key={i} className={'dz-chip dz-fchip' + (e.decideBy === di ? ' on' : '')} aria-pressed={e.decideBy === di ? 'true' : 'false'} onClick={() => setEditor(Object.assign({}, e, { decideBy: di }))}>{WD_FULL[s.date.getDay()].slice(0, 3)} {s.date.getDate()}/{s.date.getMonth() + 1}, {s.advice.phase.name.toLowerCase()}</button>;
                })}
              </div>
              <span className="dz-hint">Escolha um dia para decidir. Ele aparece marcado no seu calendário.</span>
            </div>
          ) : null}
          <div className="dz-sheet-actions">
            {e.id ? <button className="dz-del" onClick={delEditor}>Apagar</button> : <span />}
            <button className="dz-save cta" onClick={saveEditor}>{e.type === 'sonho' ? 'Guardar e ler o sonho' : e.type === 'nota' ? 'Guardar anotação' : 'Guardar ' + t.label.toLowerCase()}</button>
          </div>
        </div>
      </>
    );
  };

  // decisões com dia marcado aparecem como registro no dia escolhido
  useEffect(() => {
    const need = journal.filter((j) => j.type === 'decisao' && j.decideBy && !journal.some((k) => k.linkOf === j.id));
    if (need.length) setJournal(journal.concat(need.map((j) => ({ id: uid(), linkOf: j.id, type: 'decisao', iso: j.decideBy, title: `Dia de decidir: ${j.title || 'sua decisão'}`, text: '', at: Date.now() }))));
  }, [journal]);

  const TABS = [['dia', 'Dia'], ['sonhos', 'Sonhos'], ['notas', 'Notas'], ['quadro', 'Post-its'], ['mes', 'Mês']];
  return (
    <div className="dz">
      <div className="dz-aurora" />
      <Starfield />
      <div className="dz-top">
        <span className="dz-headtxt">
          <span className="dz-title">Meu diário</span>
          <span className="dz-purpose">{{ dia: 'Seu dia, a Lua e o que você registrou.', sonhos: 'Anote sonhos e veja o que eles dizem.', notas: 'Intenções, gratidões e decisões.', quadro: 'Lembretes soltos para arrastar e colorir.', mes: 'A Lua e os dias bons para agir e decidir.', ano: 'Seu ano em cores.' }[view]}</span>
        </span>
        {sel !== iso(today()) && (view === 'dia' || view === 'mes') ? <button className="dz-todaybtn" onClick={() => { const t = today(); setSel(iso(t)); setMonth({ y: t.getFullYear(), m: t.getMonth() }); }}>Voltar a hoje</button> : null}
      </div>
      <div className="dz-tabs">
        {TABS.map(([k, l]) => { const on = view === k || (k === 'mes' && view === 'ano'); return <button key={k} className={'dz-tab' + (on ? ' dz-tab-on' : '')} onClick={() => setView(k)} aria-pressed={on ? 'true' : 'false'}>{l}</button>; })}
      </div>
      <div className="dz-body" key={view}>
        {view === 'mes' ? renderMonth() : view === 'dia' ? <div className="dz-fade">{renderDayCard()}</div> : view === 'ano' ? renderYear() : view === 'sonhos' ? renderDreams() : view === 'notas' ? renderNotes() : renderBoard()}
      </div>
      {editor ? renderEditor() : null}
      {reading ? renderReading() : null}
      {toast ? <div className="dz-toast">{toast}</div> : null}
    </div>
  );
}
