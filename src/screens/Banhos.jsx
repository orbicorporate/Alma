import React, { useEffect, useMemo, useState } from 'react';
import { load, save } from '../store.js';
import { today, iso } from '../dates.js';
import { phaseOf } from '../cosmos.js';
import { TAGS, MOONS, moonGroup, searchBaths } from '../baths.js';
import { Moon } from './Diario.jsx';
import './banhos.css';

const TAG = Object.fromEntries(TAGS.map((t) => [t.k, t]));
const MOON = Object.fromEntries(MOONS.map((m) => [m.k, m]));
const uid = () => Math.random().toString(36).slice(2, 10);

export default function Banhos() {
  const ph = phaseOf(today());
  const todayMoon = moonGroup(ph.idx);
  const [tags, setTags] = useState([]);
  const [moon, setMoon] = useState(todayMoon.k);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'banhos', hide: !!open } })); }, [open]);
  useEffect(() => () => window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'banhos', hide: false } })), []);

  const res = useMemo(() => searchBaths({ tags, moon, q }), [tags, moon, q]);
  const fit = res.filter((r) => r.fit), other = res.filter((r) => !r.fit);
  const toggle = (k) => setTags(tags.includes(k) ? tags.filter((x) => x !== k) : tags.concat([k]));
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#/inicio'; };

  const keep = (b) => {
    const d = load();
    const j = (d.journal || []).concat([{ id: uid(), at: Date.now(), type: 'intencao', iso: iso(today()), title: `Banho: ${b.name}`, text: b.word }]);
    save({ journal: j });
    setToast('Guardado como intenção de hoje no seu diário');
    clearTimeout(keep.k); keep.k = setTimeout(() => setToast(''), 2600);
  };

  const card = (r) => {
    const b = r.b;
    return (
      <button key={b.id} className="bh-card" onClick={() => setOpen(b)} style={{ '--c': b.c }}>
        <span className="bh-orb" />
        <span className="bh-card-txt">
          <span className="bh-card-t">{b.name}</span>
          <span className="bh-card-x">{b.intent}</span>
          <span className="bh-card-tags">
            {b.tags.slice(0, 3).map((t) => <span key={t} className="bh-mini" style={{ color: TAG[t].c, borderColor: TAG[t].c + '66' }}>{TAG[t].label}</span>)}
          </span>
          {!r.fit ? <span className="bh-when">Melhor na Lua {b.moons.map((m) => MOON[m].label.toLowerCase()).join(' ou ')}</span> : null}
        </span>
        <span className="bh-chev" aria-hidden="true">›</span>
      </button>
    );
  };

  const b = open;
  const bFit = b && b.moons.includes(todayMoon.k);
  return (
    <div className="bh">
      <div className="bh-aurora" />
      <div className="bh-scroll">
        <header className="bh-head">
          <button className="bh-back" aria-label="Voltar" onClick={back}>‹</button>
          <span className="bh-headtxt">
            <span className="bh-title">Banhos da Lua</span>
            <span className="bh-purpose">Escolha o que você precisa. A Alma sugere banhos de ervas que combinam com a Lua.</span>
          </span>
        </header>

        <section className="bh-moon">
          <div className="bh-moon-img"><Moon f={ph.frac} size={52} /></div>
          <div className="bh-moon-txt">
            <span className="bh-k">Hoje · {ph.name}</span>
            <span className="bh-moon-t">{todayMoon.text}</span>
          </div>
        </section>

        <label className="bh-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar erva ou intenção (ex.: alecrim)" aria-label="Buscar banho" />
          {q ? <button className="bh-clear" aria-label="Limpar busca" onClick={() => setQ('')}>×</button> : null}
        </label>

        <div className="bh-block">
          <span className="bh-k">O que você precisa?</span>
          <div className="bh-chips">
            {TAGS.map((t) => {
              const on = tags.includes(t.k);
              return <button key={t.k} className="bh-chip" aria-pressed={on ? 'true' : 'false'} onClick={() => toggle(t.k)} style={{ borderColor: on ? t.c : t.c + '55', background: on ? t.c : 'transparent', color: on ? '#1a1030' : t.c }}>{t.label}</button>;
            })}
          </div>
        </div>

        <div className="bh-block">
          <span className="bh-k">Combinar com a Lua</span>
          <div className="bh-seg">
            {MOONS.map((m) => (
              <button key={m.k} className={'bh-seg-b' + (moon === m.k ? ' on' : '')} onClick={() => setMoon(moon === m.k ? null : m.k)} aria-pressed={moon === m.k ? 'true' : 'false'}>
                {m.label}{m.k === todayMoon.k ? <i className="bh-dot" title="Lua de hoje" /> : null}
              </button>
            ))}
          </div>
          {moon && moon !== todayMoon.k ? <span className="bh-note">{MOON[moon].text}</span> : null}
        </div>

        {fit.length ? (
          <div className="bh-block">
            <span className="bh-k bh-k-hi">{moon ? `Combinam com a Lua ${MOON[moon].label.toLowerCase()}` : 'Banhos'} · {fit.length}</span>
            {fit.map(card)}
          </div>
        ) : null}
        {other.length ? (
          <div className="bh-block">
            <span className="bh-k">Para outras luas · {other.length}</span>
            {other.map(card)}
          </div>
        ) : null}
        {!res.length ? <p className="bh-empty">Nenhum banho com essa busca. Tente outra erva ou tire um filtro.</p> : null}

        <p className="bh-foot">Banhos de ervas da tradição popular brasileira, de uso externo. São rituais de cuidado e intenção e não substituem tratamento de saúde.</p>
      </div>

      {b ? (
        <>
          <button className="bh-scrim" aria-label="Fechar" onClick={() => setOpen(null)} />
          <div className="bh-sheet" role="dialog" aria-modal="true" aria-label={b.name} style={{ '--c': b.c }}>
            <div className="bh-handle" />
            <div className="bh-s-head">
              <span className="bh-orb bh-orb-lg" />
              <div className="bh-s-titles">
                <span className="bh-s-t">{b.name}</span>
                <span className="bh-s-x">{b.intent}</span>
              </div>
            </div>
            <div className="bh-chips">
              {b.tags.map((t) => <span key={t} className="bh-mini" style={{ color: TAG[t].c, borderColor: TAG[t].c + '66' }}>{TAG[t].label}</span>)}
            </div>
            <div className={'bh-fit' + (bFit ? ' ok' : '')}>
              <Moon f={ph.frac} size={20} />
              <span>{bFit ? `Combina com a Lua de hoje (${ph.name.toLowerCase()}).` : `Melhor na Lua ${b.moons.map((m) => MOON[m].label.toLowerCase()).join(' ou ')}. Hoje a Lua é ${todayMoon.label.toLowerCase()}.`}</span>
            </div>
            <div className="bh-sec">
              <span className="bh-k">Você vai precisar de</span>
              <ul className="bh-list">{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
            </div>
            <div className="bh-sec">
              <span className="bh-k">Como fazer</span>
              <ol className="bh-steps">{b.steps.map((x, i) => <li key={i}><b>{i + 1}</b><span>{x}</span></li>)}</ol>
            </div>
            <div className="bh-word">
              <span className="bh-k">Para mentalizar</span>
              <p>“{b.word}”</p>
            </div>
            <div className="bh-care">
              <span className="bh-k" style={{ color: '#ffcf9a' }}>Cuidados</span>
              <p>{b.care}{/beba|externo/i.test(b.care) ? '' : ' Uso externo, não beba.'}{/teste/i.test(b.care) ? '' : ' Na dúvida, teste numa pequena área da pele.'}</p>
            </div>
            <div className="bh-actions">
              <button className="bh-btn" onClick={() => setOpen(null)}>Fechar</button>
              <button className="bh-btn bh-btn-main" onClick={() => keep(b)}>Guardar no diário</button>
            </div>
          </div>
        </>
      ) : null}
      {toast ? <div className="bh-toast">{toast}</div> : null}
    </div>
  );
}
