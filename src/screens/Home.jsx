import React, { useEffect, useMemo, useState } from 'react';
import { load, save, onData, getAuth, onAuth } from '../store.js';
import { today, iso, WD_FULL, MO_FULL, stepInfo } from '../dates.js';
import { phaseOf, dayAdvice, PD_TEXT } from '../cosmos.js';
import { phraseOfDay } from '../phrases.js';
import { dayTip, weekTip } from '../tips.js';
import { Moon } from './Diario.jsx';
import './home.css';
import Starfield from '../components/Starfield.jsx';

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
        if (!best || p.due < best.due) best = { i, j, t: p.t, date: p.date, due: p.due, n: j + 1, total: e.plan.length, q: e.q };
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

  return (
    <div className="hm">
      <div className="hm-aurora" />
      <Starfield />
      <div className="hm-scroll">
        <header className="hm-head">
          <span className="hm-word">alma</span>
          <span className="hm-date">{WD_FULL[t.getDay()]}, {t.getDate()} de {MO_FULL[t.getMonth()]}</span>
        </header>

        <section className="hm-hello">
          <h1>{hello}{name ? `, ${name}` : ''}.</h1>
          <p>O que você quer fazer hoje?</p>
        </section>

        <button className="hm-ask" onClick={() => go('#/', { screen: 'breath', count: 0, inhale: true, medit: false })}>
          <span className="hm-ask-orb" />
          <span className="hm-ask-text">
            <b>Fazer uma pergunta</b>
            <span>Uma dúvida, um medo, uma alegria. A Alma e 14 sabedorias refletem com você.</span>
          </span>
          <span className="hm-chev" aria-hidden="true">›</span>
        </button>

        {next ? (
          <section className="hm-card hm-next">
            <div className="hm-k" style={{ color: '#8fe3b0' }}>Seu próximo passo · {rel}</div>
            <div className="hm-step">
              <span className="hm-num">{next.n}</span>
              <span className="hm-step-t">{next.t}</span>
            </div>
            <p className="hm-sub">Do plano da pergunta “{next.q}”</p>
            <div className="hm-row">
              <button className="hm-btn hm-btn-green" onClick={doneStep}>Concluí</button>
              <button className="hm-btn" onClick={() => go('#/', { screen: 'plan', planIdx: next.i, planPrev: 'journal' })}>Ver plano</button>
            </div>
          </section>
        ) : null}

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

        <section className="hm-card hm-phrase">
          <div className="hm-k">Sabedoria desta hora</div>
          <p className="hm-quote">“{ph.lines.join(' ')}”</p>
          <p className="hm-gold">{ph.by} <span className="hm-from">· {ph.from}</span></p>
        </section>

        <div className="hm-k hm-sec">Atalhos</div>
        <div className="hm-grid">
          <button className="hm-tile" onClick={() => toDiary('dia')}>
            <span className="hm-tile-ic" style={{ color: '#a8d8ff' }}>✎</span>
            <b>Registrar o dia</b>
            <span>Gratidão, intenção, decisão</span>
          </button>
          <button className="hm-tile" onClick={() => toDiary('sonhos')}>
            <span className="hm-tile-ic" style={{ color: '#c9a8ff' }}>☁︎</span>
            <b>Sonhos</b>
            <span>Anote e veja o significado</span>
          </button>
          <button className="hm-tile" onClick={() => go('#/banhos')}>
            <span className="hm-tile-ic" style={{ color: '#8fe3b0' }}>❀</span>
            <b>Banhos da Lua</b>
            <span>Limpeza, amor, prosperidade</span>
          </button>
          <button className="hm-tile" onClick={() => { window.dispatchEvent(new CustomEvent('sym:go', { detail: 'tarot' })); go('#/simbolos'); }}>
            <span className="hm-tile-ic" style={{ color: '#f3d98b' }}>✦</span>
            <b>Carta do dia</b>
            <span>Tarô guiado</span>
          </button>
          <button className="hm-tile" onClick={() => { window.dispatchEvent(new CustomEvent('sym:go', { detail: 'horo' })); go('#/simbolos'); }}>
            <span className="hm-tile-ic" style={{ color: '#c9b8ff' }}>☾</span>
            <b>Horóscopo</b>
            <span>Pelo seu mapa</span>
          </button>
          <button className="hm-tile" onClick={() => go('#/constelacao')}>
            <span className="hm-tile-ic" style={{ color: '#f5a8c8' }}>✧</span>
            <b>Ver meu céu</b>
            <span>{counts.q} {counts.q === 1 ? 'pergunta' : 'perguntas'} · {counts.j} {counts.j === 1 ? 'registro' : 'registros'}</span>
          </button>
        </div>

        <button className="hm-tour" onClick={() => window.dispatchEvent(new Event('alma:tour'))}>Como a Alma funciona</button>
      </div>
    </div>
  );
}
