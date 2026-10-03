import React, { useEffect, useMemo, useState } from 'react';
import { load, save, onData, getAuth, onAuth } from '../store.js';
import { today, iso, WD_FULL, MO_FULL, stepInfo } from '../dates.js';
import { phaseOf, dayAdvice, PD_TEXT } from '../cosmos.js';
import { phraseOfDay } from '../phrases.js';
import { dayTip, weekTip } from '../tips.js';
import { planNameOf } from '../questions.js';
import { Moon } from './Diario.jsx';
import './home.css';
import Starfield from '../components/Starfield.jsx';
import Moment from '../components/Moment.jsx';

// Início: o lugar onde a pessoa se encontra todos os dias.
const go = (hash, detail) => {
  if (detail) window.dispatchEvent(new CustomEvent('alma:go', { detail }));
  window.location.hash = hash;
};

export default function Home() {
  const [data, setData] = useState(load());
  const [auth, setAuth] = useState(getAuth());
  useEffect(() => {
    const a = onData(() => setData(load()));
    const b = onAuth(setAuth);
    const c = () => setData(load());
    window.addEventListener('alma:saved', c);
    return () => { a(); b(); window.removeEventListener('alma:saved', c); };
  }, []);

  const t = today();
  const hour = new Date().getHours();
  const hello = hour < 5 ? 'Boa noite' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const name = (data.profile && data.profile.name ? data.profile.name.split(' ')[0] : '') || (auth.email ? auth.email.split('@')[0] : '');
  const ph = phraseOfDay(new Date());
  const adv = dayAdvice(t, data.profile);
  const entries = data.entries || [];

  const next = useMemo(() => {
    let best = null;
    entries.forEach((e, i) => {
      if (e.resolved || !e.plan) return;
      e.plan.forEach((p0, j) => {
        const p = stepInfo(p0);
        if (p.done) return;
        if (!best || p.due < best.due) best = { i, j, t: p.t, date: p.date, due: p.due, n: j + 1, total: e.plan.length, q: planNameOf(e) };
      });
    });
    return best;
  }, [entries]);

  const doneStep = () => {
    const list = entries.slice();
    const e = Object.assign({}, list[next.i]);
    e.plan = e.plan.map((x, k) => (k === next.j ? Object.assign({}, x, { done: true }) : x));
    list[next.i] = e;
    save({ entries: list });
    setData(Object.assign({}, data, { entries: list }));
  };

  const tipD = useMemo(() => dayTip(t, data.profile), [data.profile, iso(t)]);
  const tipW = useMemo(() => weekTip(t, data.profile), [data.profile, iso(t)]);
  const [whyD, setWhyD] = useState(false);
  const [whyW, setWhyW] = useState(false);
  const toDiary = (v) => { try { sessionStorage.setItem('diario:view', v); } catch (e) { /* sem armazenamento */ } window.dispatchEvent(new CustomEvent('diario:go', { detail: { view: v } })); go('#/diario'); };
  const favs = [adv.agir && ['Agir', '#8fe3b0'], adv.decidir && ['Decidir', '#c9a8ff'], adv.descansar && ['Descansar', '#a8d8ff']].filter(Boolean);
  const rel = next ? (next.due < 0 ? 'atrasado' : next.due === 0 ? 'hoje' : next.due === 1 ? 'amanhã' : `em ${next.due} dias`) : '';
  const counts = { q: entries.length, j: (data.journal || []).filter((x) => !x.linkOf).length };

  const [sheet, setSheet] = useState(null);
  useEffect(() => { window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'inicio', hide: !!sheet } })); }, [sheet]);
  useEffect(() => () => window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'inicio', hide: false } })), []);
  const sym = (d) => { window.dispatchEvent(new CustomEvent('sym:go', { detail: d })); go('#/simbolos'); };
  // planetas em órbita ao redor da esfera: cada um abre um cartão ou leva a uma área
  const planets = [
    { k: 'lua', label: 'Dica do dia', c: '#f3d98b', ic: <Moon f={adv.phase.frac} size={30} />, open: () => setSheet('lua') },
    next ? { k: 'passo', label: 'Próximo passo', c: '#8fe3b0', ic: <span className="hm-pl-n">{next.n}</span>, dot: next.due <= 0, open: () => setSheet('passo') } : null,
    { k: 'semana', label: 'Semana', c: '#c9b8ff', ic: '✧', open: () => setSheet('semana') },
    { k: 'frase', label: 'Sabedoria', c: '#ffd3a8', ic: '❝', open: () => setSheet('frase') },
    { k: 'sonhos', label: 'Sonhos', c: '#c9a8ff', ic: '☁︎', open: () => toDiary('sonhos') },
    { k: 'banhos', label: 'Banhos', c: '#8fe3b0', ic: '❀', open: () => go('#/banhos') },
    { k: 'taro', label: 'Tarô', c: '#f5a8c8', ic: '✦', open: () => sym('tarot') }
  ].filter(Boolean);
  const R = 148;

  return (
    <div className="hm">
      <div className="hm-aurora" />
      <Starfield />
      <div className="hm-scroll hm-scroll2">
        <header className="hm-top">
          <div className="hm-top-l">
            <h1 className="hm-hi">{hello}{name ? `, ${name}` : ''}.</h1>
            <span className="hm-date">{WD_FULL[t.getDay()].split('-')[0]}, {t.getDate()} de {MO_FULL[t.getMonth()]}</span>
          </div>
          <button className="hm-gear" aria-label="Ajustes" onClick={() => go('#/ajustes')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
          </button>
        </header>

        <Moment data={data} onData={(patch) => setData((d) => Object.assign({}, d, patch))} onWhy={() => { setWhyD(true); setSheet('lua'); }} />

        <div className="hm-orbit">
          <div className="hm-ring" />
          <div className="hm-ring hm-ring2" />
          <div className="hm-spin">
            {planets.map((p, i) => {
              const a = (-90 + i * 360 / planets.length) * Math.PI / 180;
              return (
                <button key={p.k} className="hm-pl" onClick={p.open} aria-label={p.label}
                  style={{ left: 170 + R * Math.cos(a), top: 170 + R * Math.sin(a), '--c': p.c, animationDelay: `${0.2 + i * 0.1}s` }}>
                  <span className="hm-pl-in">
                    <span className="hm-pl-ic">{p.ic}{p.dot ? <i className="hm-pl-dot" /> : null}</span>
                    <span className="hm-pl-l">{p.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <button className="hm-core" onClick={() => go('#/', { screen: 'breath', count: 0, inhale: true, medit: false })} aria-label="Fazer uma pergunta">
            <span className="hm-core-orb orb-live" />
            <span className="hm-core-l">Perguntar</span>
          </button>
        </div>


        <nav className="hm-quick hm-quick2" aria-label="Atalhos">
          <button onClick={() => toDiary('dia')}><span aria-hidden="true" style={{ color: '#a8d8ff' }}>✎</span>Registrar</button>
          <button onClick={() => sym('horo')}><span aria-hidden="true" style={{ color: '#c9b8ff' }}>☾</span>Horóscopo</button>
          <button onClick={() => go('#/constelacao')}><span aria-hidden="true" style={{ color: '#f5a8c8' }}>✧</span>Meu céu</button>
          <button onClick={() => window.dispatchEvent(new Event('alma:tour'))} aria-label="Ajuda: como a Alma funciona" className="hm-q-help"><span aria-hidden="true" style={{ color: '#f3d98b' }}>?</span></button>
        </nav>
      </div>

      {sheet ? (
        <>
          <button className="hm-scrim" aria-label="Fechar" onClick={() => setSheet(null)} />
          <div className="hm-sheet" role="dialog" aria-modal="true">
            <div className="hm-handle" />
            <div className="hm-sheet-body">
              {sheet === 'lua' ? (<>
        <section className="hm-card hm-tip">
          <div className="hm-tip-top">
            <span className="hm-k" style={{ color: '#f3d98b' }}>Dica do dia</span>
            <span className="hm-tip-moon"><Moon f={adv.phase.frac} size={22} /></span>
          </div>
          <div className="hm-tip-t">{tipD.title}</div>
          <p className="hm-tip-act">{tipD.act}</p>
          <p className="hm-sub">{tipD.line}</p>
          {favs.length ? (
            <div className="hm-chips">
              {favs.map((f, i) => <span key={i} className="hm-chip" style={{ borderColor: f[1], color: f[1] }}>Bom para {f[0].toLowerCase()}</span>)}
            </div>
          ) : null}
          <button className="hm-why" onClick={() => setWhyD(!whyD)} aria-expanded={whyD}>{whyD ? 'Fechar' : 'Por que essa dica?'}<span className={'hm-why-ar' + (whyD ? ' on' : '')}>›</span></button>
          {whyD ? (
            <div className="hm-why-list">
              {tipD.why.map((w) => <div key={w.k} className="hm-why-i"><span className="hm-why-k">{w.k} · {w.v}</span><span>{w.t}</span></div>)}
              {!tipD.personal ? <button className="hm-why-cta" onClick={() => { window.dispatchEvent(new CustomEvent('sym:go', { detail: 'horo' })); go('#/simbolos'); }}>Crie seu perfil para somar horóscopo e numerologia ›</button> : null}
            </div>
          ) : null}
        </section>
              </>) : null}
              {sheet === 'semana' ? (<>
        <section className="hm-card hm-tip hm-tip-w">
          <span className="hm-k" style={{ color: '#c9b8ff' }}>Dica da semana</span>
          <div className="hm-tip-t">{tipW.title}</div>
          <p className="hm-sub">{tipW.line}</p>
          {tipW.marks.length ? (
            <div className="hm-marks">
              {tipW.marks.map((m) => <span key={m.k} className="hm-mark"><i style={{ background: m.c, boxShadow: `0 0 8px ${m.c}` }} /><b>{m.k}</b><span>{m.v}</span></span>)}
            </div>
          ) : null}
          <button className="hm-why" onClick={() => setWhyW(!whyW)} aria-expanded={whyW}>{whyW ? 'Fechar' : 'Por que essa dica?'}<span className={'hm-why-ar' + (whyW ? ' on' : '')}>›</span></button>
          {whyW ? (
            <div className="hm-why-list">
              {tipW.why.map((w) => <div key={w.k} className="hm-why-i"><span className="hm-why-k">{w.k} · {w.v}</span><span>{w.t}</span></div>)}
            </div>
          ) : null}
        </section>
              </>) : null}
              {sheet === 'frase' ? (<>
        <section className="hm-card hm-phrase">
          <div className="hm-k">Sabedoria desta hora</div>
          <p className="hm-quote">“{ph.lines.join(' ')}”</p>
          <p className="hm-gold">{ph.by} <span className="hm-from">· {ph.from}</span></p>
        </section>
              </>) : null}
              {sheet === 'passo' ? (<>
        {next ? (
          <section className="hm-card hm-next">
            <div className="hm-k" style={{ color: '#8fe3b0' }}>Seu próximo passo · {rel}</div>
            <div className="hm-step">
              <span className="hm-num">{next.n}</span>
              <span className="hm-step-t">{next.t}</span>
            </div>
            <p className="hm-sub">Plano: {next.q}</p>
            <div className="hm-row">
              <button className="hm-btn hm-btn-green" onClick={doneStep}>Concluí</button>
              <button className="hm-btn" onClick={() => go('#/', { screen: 'plan', planIdx: next.i, planPrev: 'journal' })}>Ver plano</button>
            </div>
            <button className="hm-why" onClick={() => go('#/', { screen: 'journal', prev: 'ask' })}>Ver todos os seus planos ›</button>
          </section>
        ) : null}
              </>) : null}
            </div>
            <button className="hm-close" onClick={() => setSheet(null)}>Fechar</button>
          </div>
        </>
      ) : null}
    </div>
  );
}
