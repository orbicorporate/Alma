import React, { useEffect, useMemo, useRef, useState } from 'react';
import { save } from '../store.js';
import { today, iso } from '../dates.js';
import { moment, dismiss, track, buzz } from '../insight.js';
import './moment.css';

// Cartão do momento: uma coisa só para fazer agora, com a ação a um toque.
const uid = () => Math.random().toString(36).slice(2, 10);
const go = (hash, detail) => {
  if (detail) window.dispatchEvent(new CustomEvent('alma:go', { detail }));
  window.location.hash = hash;
};

export default function Moment({ data, onData, onWhy }) {
  const [tick, setTick] = useState(0);
  const [stage, setStage] = useState(null); // confirmação ou segundo passo dentro do mesmo cartão
  const [leaving, setLeaving] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const live = useMemo(() => moment(data), [data, tick]);
  // Durante uma confirmação o cartão fica parado, mesmo que os dados mudem por baixo.
  const card = stage ? stage.card : live;
  if (!card) return null;

  const entries = data.entries || [];
  const setEntries = (fn) => {
    const list = entries.slice();
    list[card.ref.i] = fn(Object.assign({}, list[card.ref.i]));
    save({ entries: list });
    onData({ entries: list });
  };
  const addJournal = (rec) => {
    const list = (data.journal || []).concat([Object.assign({ id: uid(), at: Date.now(), iso: iso(today()), text: '' }, rec)]);
    save({ journal: list });
    onData({ journal: list });
  };
  // Depois de uma confirmação, o cartão sai com suavidade e o próximo momento entra.
  const next = (ms = 1500) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setLeaving(true);
      timer.current = setTimeout(() => { setLeaving(false); setStage(null); setOpen(false); setTick((t) => t + 1); }, 200);
    }, ms);
  };
  const later = () => { dismiss(card.k); setLeaving(true); timer.current = setTimeout(() => { setLeaving(false); setStage(null); setOpen(false); setTick((t) => t + 1); }, 200); };
  const confirm = (msg) => { buzz(); track(); setStage({ done: msg, card }); next(); };

  let body;
  if (stage && stage.done) {
    body = (
      <div className="mm-done" role="status" key="done">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        <span>{stage.done}</span>
      </div>
    );
  } else if (stage && stage.heavy) {
    const e = entries[card.ref.i] || {};
    body = (
      <div className="mm-body" key="heavy">
        <span className="mm-k" style={{ color: card.color }}>Obrigada por contar</span>
        <p className="mm-title">Vamos dar um próximo passo?</p>
        <div className="mm-actions">
          <button className="mm-btn mm-primary" style={{ '--c': card.color }} onClick={() => go('#/', e.plan ? { screen: 'plan', planIdx: card.ref.i, planPrev: 'journal' } : { screen: 'journal', prev: 'ask', sheet: card.ref.i })}>{e.plan ? 'Abrir o plano' : 'Criar um plano'}</button>
          <button className="mm-btn" onClick={() => go('#/', { screen: 'ask', text: e.q || '', kindPicked: false, kind: e.kind || 'Dúvida', ans: [null, null, null], step: 0, stars: [], savedNow: false, councilKey: null, fromWhere: '' })}>Perguntar de novo</button>
        </div>
      </div>
    );
  } else {
    const t = card.type;
    // Fechado: uma linha com o título e a ação principal. Aberto: contexto, outras ações e o porquê.
    let quick = null, actions = null;
    if (t === 'passo') {
      quick = { label: 'Concluí', run: () => { setEntries((e) => { e.plan = e.plan.map((x, k) => (k === card.ref.j ? Object.assign({}, x, { done: true }) : x)); return e; }); confirm(`Passo ${card.ref.j + 1} concluído. Um a menos.`); } };
      actions = <div className="mm-actions"><button className="mm-btn" onClick={() => go('#/', { screen: 'plan', planIdx: card.ref.i, planPrev: 'journal' })}>Ver plano</button></div>;
    } else if (t === 'check') {
      actions = (
        <div className="mm-actions mm-actions-2">
          <button className="mm-btn mm-primary" style={{ '--c': '#8fe3b0' }} onClick={() => { setEntries((e) => { e.resolved = true; e.checkin = iso(today()); return e; }); confirm('Que bom. Essa estrela agora brilha em paz.'); }}>Resolvi</button>
          <button className="mm-btn" onClick={() => { setEntries((e) => { e.checkin = iso(today()); return e; }); track(); setStage({ heavy: true, card }); }}>Ainda pesa</button>
        </div>
      );
    } else if (t === 'intencao') {
      actions = (
        <div className="mm-chips">
          {card.options.map((o) => <button key={o} className="mm-chip" onClick={() => { addJournal({ type: 'intencao', title: o }); confirm('Intenção guardada no seu diário.'); }}>{o}</button>)}
        </div>
      );
    } else if (t === 'reflexao') {
      actions = (
        <div className="mm-chips mm-chips-4">
          {card.options.map((o) => <button key={o} className="mm-chip" onClick={() => { addJournal({ type: o === 'Grato' ? 'gratidao' : 'nota', title: o === 'Grato' ? 'Dia de gratidão' : `Dia ${o.toLowerCase()}`, reflexao: true }); confirm('Guardado. Boa noite.'); }}>{o}</button>)}
        </div>
      );
    } else {
      actions = (
        <div className="mm-actions mm-actions-2">
          <button className="mm-btn mm-primary" style={{ '--c': '#c9b8ff' }} onClick={() => go('#/', { screen: 'breath', count: 0, inhale: true, medit: false })}>Perguntar à Alma</button>
          <button className="mm-btn" onClick={onWhy}>Por que essa dica</button>
        </div>
      );
    }
    body = (
      <div className="mm-body" key={card.k}>
        <div className="mm-row">
          <button className="mm-head" onClick={() => setOpen(!open)} aria-expanded={open ? 'true' : 'false'} aria-controls="mm-more">
            <span className="mm-k" style={{ color: card.color }}>{card.kicker}</span>
            <span className="mm-title">{card.title}</span>
          </button>
          {quick ? <button className="mm-quick" style={{ '--c': card.color }} onClick={quick.run}>{quick.label}</button> : null}
          <button className="mm-chev" onClick={() => setOpen(!open)} aria-label={open ? 'Recolher' : 'Ver mais'} aria-expanded={open ? 'true' : 'false'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
        </div>
        {open ? (
          <div className="mm-more" id="mm-more">
            {card.line ? <p className="mm-line">{card.line}</p> : null}
            {card.sky ? (
              <p className="mm-sky">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19.5 14.5A7.5 7.5 0 1 1 9.5 4.5a6 6 0 0 0 10 10z" /></svg>
                {card.sky}
              </p>
            ) : null}
            {actions}
            <div className="mm-foot">
              <span className="mm-why">{card.why}</span>
              <button className="mm-later" onClick={later}>Agora não</button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section className={'hm-card mm' + (open ? ' mm-open' : '') + (leaving ? ' mm-out' : '')} style={{ '--c': card.color }} aria-label="Para agora" key={card.k}>
      {stage && stage.heavy ? <button className="mm-later mm-later-top" onClick={later}>Agora não</button> : null}
      {body}
    </section>
  );
}
