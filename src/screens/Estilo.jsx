import React, { useEffect, useState } from 'react';
import Starfield from '../components/Starfield.jsx';
import { ORBS, BGS, GLOWS, SPEEDS, DEFAULT_THEME, loadTheme, saveTheme, orbColors } from '../theme.js';
import { BackIc } from './Ajustes.jsx';
import './ajustes.css';
import './estilo.css';

// Personalizar minha Alma: a pessoa brinca com as cores da esfera, o fundo, o brilho e o ritmo.
const conic = (c) => `conic-gradient(from 0deg, ${c[0]}, ${c[1]}, ${c[2]}, ${c[3]}, ${c[4]}, ${c[0]})`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randHex = () => { const h = Math.random() * 360, s = 70 + Math.random() * 25, l = 62 + Math.random() * 16; return hsl2hex(h, s, l); };
function hsl2hex(h, s, l) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))).toString(16).padStart(2, '0');
  return '#' + f(0) + f(8) + f(4);
}

export default function Estilo() {
  const [t, setT] = useState(loadTheme());
  const [pop, setPop] = useState(0);
  const upd = (patch) => { const n = Object.assign({}, t, patch); setT(n); saveTheme(n); setPop((p) => p + 1); };
  const custom = t.custom || ['#b9a6ff', '#ff9ccc', '#8ff0ff'];
  const setCustom = (i, v) => { const c = custom.slice(); c[i] = v; upd({ orb: 'custom', custom: c }); };
  const surprise = () => {
    const useCustom = Math.random() < .45;
    upd({
      orb: useCustom ? 'custom' : pick(ORBS).id,
      custom: useCustom ? [randHex(), randHex(), randHex()] : t.custom,
      bg: pick(BGS).id, glow: pick(GLOWS.filter((g) => g.id !== 'off')).id, spd: pick(SPEEDS).id
    });
  };
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.hash = '#/ajustes'; };
  useEffect(() => { window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'estilo', hide: false } })); }, []);
  const colors = orbColors(t);
  const bgName = (BGS.find((b) => b.id === t.bg) || BGS[0]).name;

  const orbName = t.orb === 'custom' ? 'Sua mistura' : (ORBS.find((o) => o.id === t.orb) || ORBS[0]).name;
  const glowName = (GLOWS.find((g) => g.id === t.glow) || GLOWS[0]).name;
  const spdName = (SPEEDS.find((s) => s.id === t.spd) || SPEEDS[1]).name;

  return (
    <div className="aj es">
      <div className="aj-aurora" />
      <Starfield n={30} />
      <div className="aj-scroll">
        <header className="aj-head">
          <button className="aj-back" aria-label="Voltar" onClick={back}><BackIc /></button>
          <h1 className="aj-title">Personalizar</h1>
        </header>

        <div className="es-stage" aria-hidden="true">
          <span className="es-ring" />
          <span className="es-ring es-ring2" />
          <span key={pop} className="es-orb orb-live" />
        </div>
        <p className="es-cap" aria-live="polite"><b>{orbName}</b> sobre {bgName.toLowerCase()}, ritmo {spdName.toLowerCase()}</p>

        <div className="es-actions">
          <button className="aj-btn aj-btn-light es-surprise" onClick={surprise}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l1.9 6.1 6.1 1.9-6.1 1.9-1.9 6.1-1.9-6.1L4 10.5l6.1-1.9z" /><path d="M19 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" opacity=".7" /></svg>
            Surpreenda-me
          </button>
          <button className="aj-btn" onClick={() => { setT(Object.assign({}, DEFAULT_THEME)); saveTheme(Object.assign({}, DEFAULT_THEME)); setPop((p) => p + 1); }}>Restaurar</button>
        </div>

        <section className="aj-sec">
          <h2 className="aj-k">Cores da esfera</h2>
          <div className="es-grid">
            {ORBS.map((o) => (
              <button key={o.id} className={'es-sw' + (t.orb === o.id ? ' on' : '')} aria-pressed={t.orb === o.id ? 'true' : 'false'} onClick={() => upd({ orb: o.id })}>
                <span className="es-mini th-keep" style={{ background: conic(o.c) }} aria-hidden="true" />
                <span className="es-lb">{o.name}</span>
              </button>
            ))}
          </div>
          <div className={'es-mix' + (t.orb === 'custom' ? ' on' : '')}>
            <div className="es-mix-txt"><span>Criar a minha</span><small>Toque nos círculos e escolha três cores</small></div>
            <div className="es-picks">
              {custom.map((c, i) => (
                <label key={i} className="es-pick th-keep" style={{ background: c }}>
                  <input type="color" value={c} onChange={(e) => setCustom(i, e.target.value)} aria-label={'Cor ' + (i + 1)} />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Ritmo do giro</h2>
          <div className="es-seg" role="group" aria-label="Ritmo do giro">
            {SPEEDS.map((s) => <button key={s.id} className={t.spd === s.id ? 'on' : ''} aria-pressed={t.spd === s.id ? 'true' : 'false'} onClick={() => upd({ spd: s.id })}>{s.name}</button>)}
          </div>
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Fundo</h2>
          <div className="es-bgs">
            {BGS.map((b) => (
              <button key={b.id} className={'es-bg' + (t.bg === b.id ? ' on' : '')} aria-pressed={t.bg === b.id ? 'true' : 'false'} onClick={() => upd({ bg: b.id })}>
                <span className="es-bg-sw th-keep" style={{ background: `radial-gradient(circle at 30% 20%, ${b.sw[0]}, ${b.sw[1]} 80%)` }} aria-hidden="true">
                  <i style={{ background: conic(colors) }} />
                </span>
                <span className="es-lb">{b.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="aj-sec">
          <h2 className="aj-k">Brilho das bordas</h2>
          <div className="es-glows">
            {GLOWS.map((g) => (
              <button key={g.id} className={'es-glow' + (t.glow === g.id ? ' on' : '')} aria-pressed={t.glow === g.id ? 'true' : 'false'} onClick={() => upd({ glow: g.id })}>
                <span className={'es-glow-dot th-keep' + (g.id === 'off' ? ' off' : '')} style={{ background: g.id === 'off' ? 'transparent' : `linear-gradient(135deg, ${g.c[0]}, ${g.c[1]})` }} aria-hidden="true" />
                <span className="es-lb">{g.name}</span>
              </button>
            ))}
          </div>
          <div className="es-demo aj-card"><span>Assim ficam as caixas do app com o brilho {glowName.toLowerCase()}.</span></div>
        </section>

        <p className="aj-small es-note">Tudo muda na hora, em todas as telas, e fica guardado neste aparelho.</p>
      </div>
    </div>
  );
}
