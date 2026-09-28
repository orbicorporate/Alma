import React, { useEffect, useState } from 'react';
import Starfield from '../components/Starfield.jsx';
import { ORBS, BGS, GLOWS, SPEEDS, DEFAULT_THEME, loadTheme, saveTheme, orbColors } from '../theme.js';
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

  return (
    <div className="aj es">
      <div className="aj-aurora" />
      <Starfield n={30} />
      <div className="aj-scroll">
        <header className="aj-head">
          <button className="aj-back" aria-label="Voltar" onClick={back}>‹</button>
          <span className="aj-title">Personalizar minha Alma</span>
        </header>

        <div className="es-stage">
          <span className="es-ring" />
          <span className="es-ring es-ring2" />
          <span key={pop} className="es-orb orb-live" />
          <span className="es-cap">{t.orb === 'custom' ? 'Sua mistura' : (ORBS.find((o) => o.id === t.orb) || ORBS[0]).name} · {bgName}</span>
        </div>

        <div className="es-actions">
          <button className="aj-btn aj-btn-light es-surprise" onClick={surprise}>✦ Surpreenda-me</button>
          <button className="aj-btn" onClick={() => { setT(Object.assign({}, DEFAULT_THEME)); saveTheme(Object.assign({}, DEFAULT_THEME)); setPop((p) => p + 1); }}>Restaurar</button>
        </div>

        <section className="aj-sec">
          <span className="aj-k">Cores da esfera</span>
          <div className="es-grid">
            {ORBS.map((o) => (
              <button key={o.id} className={'es-sw' + (t.orb === o.id ? ' on' : '')} onClick={() => upd({ orb: o.id })}>
                <span className="es-mini th-keep" style={{ background: conic(o.c) }} />
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
          <span className="aj-k">Ritmo do giro</span>
          <div className="es-seg">
            {SPEEDS.map((s) => <button key={s.id} className={t.spd === s.id ? 'on' : ''} onClick={() => upd({ spd: s.id })}>{s.name}</button>)}
          </div>
        </section>

        <section className="aj-sec">
          <span className="aj-k">Fundo</span>
          <div className="es-bgs">
            {BGS.map((b) => (
              <button key={b.id} className={'es-bg' + (t.bg === b.id ? ' on' : '')} onClick={() => upd({ bg: b.id })}>
                <span className="es-bg-sw th-keep" style={{ background: `radial-gradient(circle at 30% 20%, ${b.sw[0]}, ${b.sw[1]} 80%)` }}>
                  <i style={{ background: conic(colors) }} />
                </span>
                <span className="es-lb">{b.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="aj-sec">
          <span className="aj-k">Brilho das bordas</span>
          <div className="es-glows">
            {GLOWS.map((g) => (
              <button key={g.id} className={'es-glow' + (t.glow === g.id ? ' on' : '')} onClick={() => upd({ glow: g.id })}>
                <span className="es-glow-dot th-keep" style={{ background: g.id === 'off' ? 'transparent' : `linear-gradient(135deg, ${g.c[0]}, ${g.c[1]})` }}>{g.id === 'off' ? '○' : ''}</span>
                <span className="es-lb">{g.name}</span>
              </button>
            ))}
          </div>
          <div className="es-demo aj-card"><span>Assim ficam as caixas do app.</span></div>
        </section>

        <p className="aj-small es-note">Tudo muda na hora, em todas as telas. Fica guardado neste aparelho.</p>
      </div>
    </div>
  );
}
