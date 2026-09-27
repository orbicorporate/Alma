import React, { useEffect, useMemo, useRef, useState } from 'react';
import { load, save, onData } from '../store.js';
import { today, iso, fromIso, MO_FULL, WD_FULL } from '../dates.js';
import { phaseOf, moonPath, dayAdvice, nextFavorable, PD_TEXT } from '../cosmos.js';
import { readDream, recurring, DEEP } from '../dreams.js';
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
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} aria-hidden="true" style={{ flexShrink: 0, overflow: 'visible' }}>
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
  (entries || []).forEach((e) => (e.plan || []).forEach((s, j) => { if (s.iso === dayIso) out.push({ q: e.q, t: s.t, n: j + 1, done: s.done }); }));
  return out;
}

export default function Diario() {
  const data0 = load();
  const [journal, setJournal] = useState(data0.journal || []);
  const [postits, setPostits] = useState(data0.postits || []);
  const [entries, setEntries] = useState(data0.entries || []);
  const [profile, setProfile] = useState(data0.profile || null);
  const [view, setView] = useState('dia');
  const [sel, setSel] = useState(iso(today()));
  const [month, setMonth] = useState(() => { const t = today(); return { y: t.getFullYear(), m: t.getMonth() }; });
  const [editor, setEditor] = useState(null);
  const [reading, setReading] = useState(null);
  const [readTab, setReadTab] = useState('psy');
  const [deepSkip, setDeepSkip] = useState(false);
  const [extra, setExtra] = useState('');
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
    if (saved.type === 'sonho') { setReadTab('psy'); setDeepSkip(false); setReading(saved); return; }
    flash(e.id ? 'Registro atualizado' : `${TYPES[e.type].label} ${TYPES[e.type].f ? 'guardada' : 'guardado'} no seu céu`);
  };
  const delEditor = () => { setJournal(journal.filter((j) => j.id !== editor.id)); setEditor(null); flash('Registro apagado'); };

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
          <span><b className="dz-fav dz-fav-act" /> agir</span>
          <span><b className="dz-fav dz-fav-dec" /> decidir</span>
          <span><i className="dz-step" /> passo do plano</span>
        </div>
        <div className="glass dz-daysum">
          <Moon f={adv.phase.frac} size={36} />
          <span className="dz-daysum-t">
            <b>{sel === iso(today()) ? 'Hoje, ' : ''}{selDate.getDate()} de {MO_FULL[selDate.getMonth()]}</b>
            <small>{adv.phase.name} · {(byDay[sel] || []).length} {(byDay[sel] || []).length === 1 ? 'registro' : 'registros'}</small>
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
    const meta = [showType ? t.label : null, showDate ? `${d.getDate()} de ${MO_FULL[d.getMonth()]}` : null, r.wake ? `acordei ${r.wake.toLowerCase()}` : null, r.decideBy ? `decidir até ${fromIso(r.decideBy).getDate()}/${fromIso(r.decideBy).getMonth() + 1}` : null].filter(Boolean).join(' · ');
    return (
      <div key={r.id} className="dz-rec" style={{ '--c': t.color }}>
        <button className="dz-rec-main" onClick={() => openEditor(r.type, r)}>
          {meta ? <span className="dz-rec-k">{meta}</span> : null}
          <span className="dz-rec-t">{r.title || (r.text || '').split('\n')[0].slice(0, 60)}</span>
          {r.text && r.title ? <span className="dz-rec-x">{r.text}</span> : null}
        </button>
        {r.type === 'sonho' ? (
          <button className="dz-read" onClick={() => { setReadTab('psy'); setDeepSkip(false); setReading(r); }}>
            <span className="dz-read-ic">✦</span> Ver o que o sonho diz
          </button>
        ) : null}
      </div>
    );
  };

  // ---------- Dia
  const renderDayCard = () => {
    const recs = byDay[sel] || [];
    const steps = planStepsOn(entries, sel);
    const favs = [adv.agir && ['Agir', '#8fe3b0'], adv.decidir && ['Decidir', '#c9a8ff'], adv.descansar && ['Descansar', '#a8d8ff']].filter(Boolean);
    const groups = Object.keys(TYPES).map((k) => [k, recs.filter((r) => r.type === k)]).filter((g) => g[1].length);
    return (
      <div className="dz-day-panel">
        <div className="dz-daynav">
          <button className="dz-ic" aria-label="Dia anterior" onClick={() => { const d = fromIso(sel); d.setDate(d.getDate() - 1); setSel(iso(d)); setMonth({ y: d.getFullYear(), m: d.getMonth() }); }}>‹</button>
          <span className="dz-daynav-t">{sel === iso(today()) ? 'Hoje' : `${WD_FULL[selDate.getDay()]}`}<small>{selDate.getDate()} de {MO_FULL[selDate.getMonth()]}</small></span>
          <button className="dz-ic" aria-label="Próximo dia" onClick={() => { const d = fromIso(sel); d.setDate(d.getDate() + 1); setSel(iso(d)); setMonth({ y: d.getFullYear(), m: d.getMonth() }); }}>›</button>
        </div>
        <div className="glass dz-sky">
          <div className="dz-moon-big"><Moon f={adv.phase.frac} size={52} /><div className="dz-moon-glow" /></div>
          <div className="dz-sky-txt">
            <span className="dz-phase">{adv.phase.name} <small>{adv.phase.lit}%</small></span>
            <div className="dz-chips">
              {favs.length ? favs.map((f, i) => <span key={i} className="dz-chip dz-chip-sm" style={{ borderColor: f[1], color: f[1] }}>{f[0]}{adv.strong && f[0] !== 'Descansar' ? ' · forte' : ''}</span>) : <span className="dz-chip dz-chip-sm dz-chip-mute">Observar e preparar</span>}
              {adv.pd ? <span className="dz-chip dz-chip-sm dz-chip-mute" title={PD_TEXT[adv.pd]}>Dia pessoal {adv.pd}</span> : null}
            </div>
          </div>
        </div>
        {steps.length ? (
          <div className="dz-group">
            <span className="dz-group-h" style={{ color: '#8fe3b0' }}><i style={{ background: '#8fe3b0' }} />Passos do plano</span>
            <div className="glass dz-steps">
              {steps.map((s, i) => <span key={i} className={'dz-stepline' + (s.done ? ' dz-done' : '')}><b>{s.n}</b>{s.t}</span>)}
            </div>
          </div>
        ) : null}
        {groups.map(([k, list]) => (
          <div key={k} className="dz-group">
            <span className="dz-group-h" style={{ color: TYPES[k].color }}><i style={{ background: TYPES[k].color }} />{list.length > 1 ? TYPES[k].plural : TYPES[k].label}{list.length > 1 ? <em>{list.length}</em> : null}</span>
            {list.map((r) => recCard(r, false))}
          </div>
        ))}
        {!groups.length && !steps.length ? <p className="dz-empty-day">Nada registrado neste dia ainda.</p> : null}
        <div className="dz-group">
          <span className="dz-group-h">Registrar</span>
          <div className="dz-add">
            {Object.entries(TYPES).map(([k, t]) => (
              <button key={k} className="dz-addbtn pill" onClick={() => openEditor(k)} style={{ borderColor: t.color + '77' }}>
                <i style={{ background: t.color }} />{t.label}
              </button>
            ))}
          </div>
        </div>
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
          <span className="dz-hero-t">Seus sonhos</span>
          <span className="dz-hero-x">Anote ao acordar. A Alma lê cada sonho por dois caminhos: a psicanálise e a espiritualidade.</span>
          <button className="dz-hero-cta" onClick={() => { setSel(iso(today())); setEditor({ id: null, type: 'sonho', iso: iso(today()), title: '', text: '', wake: '', decideBy: '' }); }}>+ Anotar um sonho</button>
        </div>
        {rec.length ? (
          <div className="dz-group">
            <span className="dz-group-h">Símbolos que se repetem</span>
            <div className="dz-chips">{rec.map((r) => <span key={r.name} className="dz-chip dz-chip-sm" style={{ borderColor: '#c9a8ff88', color: '#e4d6ff' }}>{r.name} · {r.n}×</span>)}</div>
          </div>
        ) : null}
        {list.length ? list.map((r) => recCard(r, true)) : <p className="dz-empty-day">Nenhum sonho anotado ainda. Deixe o celular perto da cama e escreva o que lembrar logo ao acordar, mesmo que seja só uma imagem.</p>}
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
        <div className="dz-chips">
          <button className="dz-chip" onClick={() => setNoteFilter('all')} style={{ borderColor: 'rgba(255,255,255,.3)', background: noteFilter === 'all' ? '#f4f1ea' : 'transparent', color: noteFilter === 'all' ? '#1a1030' : '#f4f1ea' }}>Tudo</button>
          {NOTE_TYPES.map((k) => <button key={k} className="dz-chip" onClick={() => setNoteFilter(k)} style={{ borderColor: TYPES[k].color, background: noteFilter === k ? TYPES[k].color : 'transparent', color: noteFilter === k ? '#1a1408' : TYPES[k].color }}>{TYPES[k].plural}</button>)}
        </div>
        <button className="dz-newline" onClick={() => { setSel(iso(today())); setEditor({ id: null, type: addType, iso: iso(today()), title: '', text: '', wake: '', decideBy: '' }); }} style={{ borderColor: TYPES[addType].color + '88' }}>
          <i style={{ background: TYPES[addType].color }} />+ {noteFilter === 'all' ? 'Nova anotação' : `Nova ${TYPES[addType].label.toLowerCase()}`}
        </button>
        {byDate.map(([d, rs]) => {
          const dd = fromIso(d);
          return (
            <div key={d} className="dz-group">
              <span className="dz-group-h">{d === iso(today()) ? 'Hoje' : `${WD_FULL[dd.getDay()].split('-')[0]}, ${dd.getDate()} de ${MO_FULL[dd.getMonth()]}`}</span>
              {rs.map((r) => recCard(r, false, noteFilter === 'all'))}
            </div>
          );
        })}
        {!list.length ? <p className="dz-empty-day">Nada por aqui ainda. Intenções, gratidões e decisões que você registrar aparecem nesta lista.</p> : null}
      </div>
    );
  };

  // ---------- Leitura do sonho
  const renderReading = () => {
    const r = journal.find((j) => j.id === reading.id) || reading;
    const L = readDream(r), P = readTab === 'psy' ? L.psy : L.spi;
    const deep = r.deep || {};
    const setDeep = (patch) => setJournal(journal.map((j) => (j.id === r.id ? Object.assign({}, j, { deep: Object.assign({}, j.deep || {}, patch) }) : j)));
    const qi = DEEP.findIndex((d) => !deep[d.k]);
    const askNow = qi >= 0 && !deepSkip;
    const deepList = readTab === 'psy' ? L.deepPsy : L.deepSpi;
    const acc = readTab === 'psy' ? '#c9a8ff' : '#f3d98b';
    const keepQ = () => {
      setJournal(journal.concat([{ id: uid(), at: Date.now(), type: 'intencao', iso: iso(today()), title: L.question, text: `Do sonho “${r.title || 'sem título'}”` }]));
      setReading(null); flash('Pergunta guardada nas suas intenções de hoje');
    };

    return (
      <>
        <button className="dz-scrim" aria-label="Fechar" onClick={() => setReading(null)} />
        <div className="dz-sheet dz-reading" role="dialog" aria-modal="true" aria-label="Leitura do sonho">
          <div className="dz-handle" />
          <span className="kicker" style={{ fontSize: 11.5, color: '#c9a8ff' }}>O que o sonho pode dizer</span>
          <span className="dz-read-title">{r.title || 'Seu sonho'}</span>
          {L.symbols.length ? (
            <div className="dz-chips">{L.symbols.map((x) => <span key={x.k} className="dz-chip dz-chip-sm" style={{ borderColor: '#c9a8ff88', color: '#e4d6ff' }}>{x.name}</span>)}{L.more > 0 ? <span className="dz-chip dz-chip-sm dz-chip-mute">+{L.more}</span> : null}</div>
          ) : null}
          {askNow ? (
            <div className="dz-deep" key={qi}>
              <div className="dz-deep-top">
                <span className="kicker" style={{ fontSize: 11.5, color: '#f3d98b' }}>Aprofundar a leitura · {qi + 1} de {DEEP.length}</span>
                <button className="dz-deep-skip" onClick={() => setDeepSkip(true)}>Pular</button>
              </div>
              <span className="dz-deep-q">{DEEP[qi].q}</span>
              <div className="dz-chips">
                {DEEP[qi].opts.map((o) => <button key={o[0]} className="dz-chip dz-deep-opt" onClick={() => setDeep({ [DEEP[qi].k]: o[0] })}>{o[0]}</button>)}
              </div>
              <div className="dz-deep-bar"><i style={{ width: `${(qi / DEEP.length) * 100}%` }} /></div>
            </div>
          ) : null}
          {!askNow && !deep.extra ? (
            <div className="dz-extra">
              <input className="dz-input" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="Um detalhe a mais? Uma cor, um objeto, um lugar" aria-label="Detalhe do sonho" />
              <button className="dz-extra-ok" disabled={!extra.trim()} onClick={() => { setDeep({ extra: extra.trim() }); setExtra(''); }}>Reler</button>
            </div>
          ) : null}
          <div className="dz-seg" role="tablist">
            <button role="tab" aria-selected={readTab === 'psy'} className={'dz-seg-b' + (readTab === 'psy' ? ' on' : '')} onClick={() => setReadTab('psy')}>Psicanálise</button>
            <button role="tab" aria-selected={readTab === 'spi'} className={'dz-seg-b' + (readTab === 'spi' ? ' on' : '')} onClick={() => setReadTab('spi')}>Espiritual</button>
          </div>
          <div className="dz-read-body" key={readTab} style={{ '--c': acc }}>
            <p className="dz-read-p">{P.intro}</p>
            {L.symbols.map((x) => (
              <div key={x.k} className="dz-sym">
                <span className="dz-sym-n">{x.name}</span>
                <p>{readTab === 'psy' ? x.psy : x.spi}</p>
              </div>
            ))}
            {deepList.length ? <span className="dz-group-h" style={{ marginTop: 4 }}>O que você contou</span> : null}
            {deepList.map((x) => (
              <div key={x.k} className="dz-sym dz-sym-you">
                <span className="dz-sym-n">{x.label}</span>
                <p>{x.t}</p>
              </div>
            ))}
            <p className="dz-read-p">{P.close}</p>
          </div>
          <div className="dz-question">
            <span className="kicker" style={{ fontSize: 11.5, color: '#f3d98b' }}>Pergunta para levar com você</span>
            <p>{L.question}</p>
          </div>
          <p className="dz-foot">Leituras simbólicas, não diagnóstico nem previsão. O sentido final é seu: só você sabe o que cada imagem desperta.</p>
          <div className="dz-sheet-actions">
            <button className="dz-del" style={{ color: 'rgba(244,241,234,.8)' }} onClick={() => setReading(null)}>Fechar</button>
            <button className="dz-save cta" onClick={keepQ} style={{ background: 'linear-gradient(120deg, #fff4d1, #f3d98b)', padding: '0 22px' }}>Guardar a pergunta</button>
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
              <button key={m} className="glass dz-ymonth pill" onClick={() => { setMonth({ y, m }); setView('mes'); }}>
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
        <span className="dz-hint">Arraste, escreva e mude a cor. Seus post-its também flutuam na constelação.</span>
        <button className="dz-new pill" onClick={addPost}>+ Post-it</button>
      </div>
      <div ref={board} className="dz-board" onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {postits.length === 0 ? <p className="dz-empty">Seu quadro está vazio. Toque em “+ Post-it”.</p> : null}
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
        <button className="dz-scrim" aria-label="Fechar" onClick={() => setEditor(null)} />
        <div className="dz-sheet">
          <div className="dz-handle" />
          <div className="dz-chips">
            {Object.entries(TYPES).map(([k, tt]) => (
              <button key={k} className="dz-chip" onClick={() => setEditor(Object.assign({}, e, { type: k }))} style={{ borderColor: tt.color, color: k === e.type ? '#1a1408' : tt.color, background: k === e.type ? tt.color : 'transparent' }}>{tt.label}</button>
            ))}
          </div>
          <span className="kicker" style={{ fontSize: 11.5 }}>{fromIso(e.iso).getDate()} de {MO_FULL[fromIso(e.iso).getMonth()]}</span>
          <input className="dz-input" value={e.title} placeholder={e.type === 'sonho' ? 'Um nome para o sonho' : e.type === 'decisao' ? 'O que você precisa decidir?' : 'Título'} onChange={(ev) => setEditor(Object.assign({}, e, { title: ev.target.value }))} />
          <textarea className="dz-area" value={e.text} rows={5} placeholder={e.type === 'sonho' ? 'Conte o sonho: lugares, pessoas, cores, sensações.' : e.type === 'gratidao' ? 'Pelo que você é grato hoje?' : e.type === 'intencao' ? 'Qual intenção você quer sustentar?' : e.type === 'decisao' ? 'Quais são as opções e o que pesa em cada uma?' : 'Escreva livremente.'} onChange={(ev) => setEditor(Object.assign({}, e, { text: ev.target.value }))} />
          {e.type === 'sonho' ? <span className="dz-hint">Ao guardar, a Alma lê o seu sonho pela psicanálise e pela espiritualidade.</span> : null}
          {e.type === 'sonho' ? (
            <div className="dz-sub">
              <span className="kicker" style={{ fontSize: 11.5 }}>Como você acordou?</span>
              <div className="dz-chips">{WAKE.map((w) => <button key={w} className="dz-chip" onClick={() => setEditor(Object.assign({}, e, { wake: e.wake === w ? '' : w }))} style={{ borderColor: t.color, background: e.wake === w ? t.color : 'transparent', color: e.wake === w ? '#1a1408' : '#f4f1ea' }}>{w}</button>)}</div>
            </div>
          ) : null}
          {e.type === 'decisao' ? (
            <div className="dz-sub">
              <span className="kicker" style={{ fontSize: 11.5, color: '#c9a8ff' }}>Dias favoráveis para decidir</span>
              <div className="dz-chips">
                {sugg.map((s, i) => {
                  const di = iso(s.date);
                  return <button key={i} className="dz-chip" onClick={() => setEditor(Object.assign({}, e, { decideBy: di }))} style={{ borderColor: '#c9a8ff', background: e.decideBy === di ? '#c9a8ff' : 'transparent', color: e.decideBy === di ? '#1a1030' : '#f4f1ea' }}>{WD_FULL[s.date.getDay()].slice(0, 3)} {s.date.getDate()}/{s.date.getMonth() + 1} · {s.advice.phase.name}</button>;
                })}
              </div>
              <span className="dz-hint">Escolha um dia para decidir. Ele aparece marcado no seu calendário.</span>
            </div>
          ) : null}
          <div className="dz-sheet-actions">
            {e.id ? <button className="dz-del" onClick={delEditor}>Apagar</button> : <span />}
            <button className="dz-save cta" onClick={saveEditor} style={{ background: t.color }}>Guardar</button>
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
          <span className="dz-purpose">{{ dia: 'Seu dia, a Lua e o que você registrou.', sonhos: 'Anote sonhos e veja o que eles podem dizer.', notas: 'Intenções, gratidões e decisões em um só lugar.', quadro: 'Lembretes soltos para arrastar e colorir.', mes: 'A Lua e os dias bons para agir e decidir.', ano: 'Seu ano em cores.' }[view]}</span>
        </span>
        <button className="dz-ic dz-todaybtn" onClick={() => { const t = today(); setSel(iso(t)); setMonth({ y: t.getFullYear(), m: t.getMonth() }); }}>Hoje</button>
      </div>
      <div className="dz-tabs">
        {TABS.map(([k, l]) => <button key={k} className={'dz-tab' + (view === k || (k === 'mes' && view === 'ano') ? ' dz-tab-on' : '')} onClick={() => setView(k)} aria-pressed={view === k ? 'true' : 'false'}>{l}</button>)}
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
