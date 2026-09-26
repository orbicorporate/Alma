import React, { useEffect, useMemo, useRef, useState } from 'react';
import { load, save, onData } from '../store.js';
import { today, iso, fromIso, MO_FULL, WD_FULL } from '../dates.js';
import { phaseOf, moonPath, dayAdvice, nextFavorable, PD_TEXT } from '../cosmos.js';
import './diario.css';

export const TYPES = {
  nota: { label: 'Anotação', color: '#a8d8ff' },
  sonho: { label: 'Sonho', color: '#c9a8ff' },
  gratidao: { label: 'Gratidão', color: '#8fe3b0' },
  intencao: { label: 'Intenção', color: '#f3d98b' },
  decisao: { label: 'Decisão', color: '#ffb38a' }
};
const POST_COLORS = ['#f3d98b', '#f5a8c8', '#a8d8ff', '#8fe3b0', '#c9a8ff'];
const WAKE = ['Em paz', 'Leve', 'Emocionado', 'Inquieto', 'Confuso'];
const WDS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const uid = () => Math.random().toString(36).slice(2, 10);

export function Moon({ f, size = 14 }) {
  const r = size / 2 - 1;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`} aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle r={r} fill="rgba(255,255,255,.07)" stroke="rgba(244,239,224,.35)" strokeWidth=".6" />
      <path d={moonPath(f, r)} fill="#f4efe0" />
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
  const [view, setView] = useState('mes');
  const [sel, setSel] = useState(iso(today()));
  const [month, setMonth] = useState(() => { const t = today(); return { y: t.getFullYear(), m: t.getMonth() }; });
  const [editor, setEditor] = useState(null);
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
    if (e.id) setJournal(journal.map((j) => (j.id === e.id ? e : j)));
    else setJournal(journal.concat([Object.assign({}, e, { id: uid(), at: Date.now() })]));
    setEditor(null);
    flash(e.id ? 'Registro atualizado' : `${TYPES[e.type].label} guardada no seu céu`);
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
        {renderDayCard(true)}
      </div>
    );
  };

  // ---------- Dia
  const renderDayCard = (compact) => {
    const recs = byDay[sel] || [];
    const steps = planStepsOn(entries, sel);
    const favs = [adv.agir && ['Agir', '#8fe3b0'], adv.decidir && ['Decidir', '#c9a8ff'], adv.descansar && ['Descansar', '#a8d8ff']].filter(Boolean);
    return (
      <div className="dz-day-panel">
        <div className="glass dz-moon-card">
          <div className="dz-moon-big"><Moon f={adv.phase.frac} size={64} /><div className="dz-moon-glow" /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <span className="kicker" style={{ fontSize: 10 }}>{WD_FULL[selDate.getDay()]}, {selDate.getDate()} de {MO_FULL[selDate.getMonth()]}</span>
            <span className="dz-phase">{adv.phase.name} · {adv.phase.lit}% iluminada</span>
            <span className="dz-phase-text">{adv.phase.text}</span>
          </div>
        </div>
        <div className="glass dz-favs">
          <span className="kicker" style={{ fontSize: 10, color: '#f3d98b' }}>Momento favorável para</span>
          <div className="dz-chips">
            {favs.length ? favs.map((f, i) => <span key={i} className="dz-chip" style={{ borderColor: f[1], color: f[1] }}>{f[0]}{adv.strong && f[0] !== 'Descansar' ? ' · forte' : ''}</span>) : <span className="dz-chip dz-chip-mute">Observar e preparar</span>}
          </div>
          {adv.pd ? <span className="dz-hint">Seu dia pessoal é {adv.pd}: {PD_TEXT[adv.pd]}.</span> : <span className="dz-hint">Crie seu perfil em Céu e Símbolos para somar a sua numerologia às sugestões.</span>}
        </div>
        {steps.length ? (
          <div className="glass dz-steps">
            <span className="kicker" style={{ fontSize: 10, color: '#8fe3b0' }}>Do seu plano de ação</span>
            {steps.map((s, i) => <span key={i} className={'dz-stepline' + (s.done ? ' dz-done' : '')}><b>{s.n}</b>{s.t}</span>)}
          </div>
        ) : null}
        {recs.map((r) => (
          <button key={r.id} className="glass dz-rec" onClick={() => openEditor(r.type, r)} style={{ borderColor: TYPES[r.type].color + '66' }}>
            <span className="dz-rec-k" style={{ color: TYPES[r.type].color }}>{TYPES[r.type].label}{r.wake ? ` · acordei ${r.wake.toLowerCase()}` : ''}{r.decideBy ? ` · decidir até ${fromIso(r.decideBy).getDate()}/${fromIso(r.decideBy).getMonth() + 1}` : ''}</span>
            {r.title ? <span className="dz-rec-t">{r.title}</span> : null}
            {r.text ? <span className="dz-rec-x">{r.text}</span> : null}
          </button>
        ))}
        <div className="dz-add">
          {Object.entries(TYPES).map(([k, t]) => (
            <button key={k} className="dz-addbtn pill" onClick={() => openEditor(k)} style={{ borderColor: t.color + '77' }}>
              <i style={{ background: t.color }} />{t.label}
            </button>
          ))}
        </div>
        {compact ? null : <p className="dz-foot">Sugestões inspiradas nas fases da Lua e na numerologia, tradições simbólicas. Use como convite, não como regra.</p>}
      </div>
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
          <span className="kicker" style={{ fontSize: 10 }}>{fromIso(e.iso).getDate()} de {MO_FULL[fromIso(e.iso).getMonth()]}</span>
          <input className="dz-input" value={e.title} placeholder={e.type === 'sonho' ? 'Um nome para o sonho' : e.type === 'decisao' ? 'O que você precisa decidir?' : 'Título'} onChange={(ev) => setEditor(Object.assign({}, e, { title: ev.target.value }))} />
          <textarea className="dz-area" value={e.text} rows={5} placeholder={e.type === 'sonho' ? 'Conte o sonho: lugares, pessoas, cores, sensações.' : e.type === 'gratidao' ? 'Pelo que você é grato hoje?' : e.type === 'intencao' ? 'Qual intenção você quer sustentar?' : e.type === 'decisao' ? 'Quais são as opções e o que pesa em cada uma?' : 'Escreva livremente.'} onChange={(ev) => setEditor(Object.assign({}, e, { text: ev.target.value }))} />
          {e.type === 'sonho' ? (
            <div className="dz-sub">
              <span className="kicker" style={{ fontSize: 10 }}>Como você acordou?</span>
              <div className="dz-chips">{WAKE.map((w) => <button key={w} className="dz-chip" onClick={() => setEditor(Object.assign({}, e, { wake: e.wake === w ? '' : w }))} style={{ borderColor: t.color, background: e.wake === w ? t.color : 'transparent', color: e.wake === w ? '#1a1408' : '#f4f1ea' }}>{w}</button>)}</div>
            </div>
          ) : null}
          {e.type === 'decisao' ? (
            <div className="dz-sub">
              <span className="kicker" style={{ fontSize: 10, color: '#c9a8ff' }}>Dias favoráveis para decidir</span>
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

  const TABS = [['mes', 'Mês'], ['dia', 'Dia'], ['ano', 'Ano'], ['quadro', 'Post-its']];
  return (
    <div className="dz">
      <div className="dz-aurora" />
      <div className="dz-top">
        <button className="dz-ic" aria-label="Voltar para a Alma" onClick={() => { window.location.hash = '#/'; }}>‹</button>
        <span className="dz-title">Meu diário</span>
        <button className="dz-ic dz-todaybtn" onClick={() => { const t = today(); setSel(iso(t)); setMonth({ y: t.getFullYear(), m: t.getMonth() }); }}>Hoje</button>
      </div>
      <div className="dz-tabs">
        {TABS.map(([k, l]) => <button key={k} className={'dz-tab' + (view === k ? ' dz-tab-on' : '')} onClick={() => setView(k)} aria-pressed={view === k ? 'true' : 'false'}>{l}</button>)}
      </div>
      <div className="dz-body" key={view}>
        {view === 'mes' ? renderMonth() : view === 'dia' ? <div className="dz-fade">{renderDayCard(false)}</div> : view === 'ano' ? renderYear() : renderBoard()}
      </div>
      {editor ? renderEditor() : null}
      {toast ? <div className="dz-toast">{toast}</div> : null}
    </div>
  );
}
