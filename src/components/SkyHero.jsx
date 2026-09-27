import React, { useEffect, useMemo, useRef, useState } from 'react';
import { skyAt, SIGNS } from '../sky.js';
import { phaseOf, moonPath } from '../cosmos.js';
import './skyhero.css';
import { Moon } from '../screens/Diario.jsx';

// Céu vivo do topo de Céu e Símbolos: roda do zodíaco girando, com o Sol, a Lua e os
// planetas nas posições reais de hoje, nebulosa em movimento e estrelas cadentes.
const GLY = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
const ELC = ['#ffb38a', '#b8e0a0', '#a8d8ff', '#b9a6ff'];
const PL = [
  { k: 'mercury', g: '☿︎', c: '#a8d8ff', r: 5 }, { k: 'venus', g: '♀︎', c: '#f5a8c8', r: 6 }, { k: 'mars', g: '♂︎', c: '#ff8f7a', r: 5.5 },
  { k: 'jupiter', g: '♃︎', c: '#c9a8ff', r: 7 }, { k: 'saturn', g: '♄︎', c: '#d8cfa8', r: 6.5 }
];
const S = 320, C = S / 2;
const pos = (lon, rad) => { const a = (180 - lon) * Math.PI / 180; return { left: C + rad * Math.cos(a), top: C - rad * Math.sin(a) }; };
const em = (s) => 'em ' + s;

export default function SkyHero({ onOpen }) {
  const sky = useMemo(() => skyAt(new Date()), []);
  const ph = useMemo(() => phaseOf(new Date()), []);
  const stage = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const ori = (e) => { if (e.beta == null) return; setTilt({ x: Math.max(-10, Math.min(10, (e.beta - 45) / 4)), y: Math.max(-10, Math.min(10, e.gamma / 4)) }); };
    window.addEventListener('deviceorientation', ori);
    return () => window.removeEventListener('deviceorientation', ori);
  }, []);
  const move = (e) => {
    const r = stage.current.getBoundingClientRect();
    setTilt({ x: -((e.clientY - r.top) / r.height - 0.5) * 16, y: ((e.clientX - r.left) / r.width - 0.5) * 16 });
  };
  const sunSign = SIGNS[Math.floor(sky.sun / 30)], moonSign = SIGNS[Math.floor(sky.moon / 30)];
  const moonR = 11;

  return (
    <div className="skh" onClick={onOpen} role="button" aria-label="Ver o horóscopo de hoje">
      <div className="skh-neb skh-neb-a" />
      <div className="skh-neb skh-neb-b" />
      <span className="skh-shoot" />
      <span className="skh-shoot skh-shoot-2" />
      <div ref={stage} className="skh-stage" onPointerMove={move} onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transform: `perspective(900px) rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)` }}>
        <div className="skh-halo" />
        <div className="skh-wheel">
          <div className="skh-ring skh-ring-o" />
          <div className="skh-ring skh-ring-i" />
          {GLY.map((g, i) => {
            const p = pos(i * 30 + 15, 139), t = pos(i * 30, 150), t2 = pos(i * 30, 124);
            return (
              <React.Fragment key={i}>
                <span className="skh-tick" style={{ left: t2.left, top: t2.top, width: 26, transform: `rotate(${-(180 - i * 30)}deg)` }} />
                <span className="skh-sign skh-up" style={{ left: p.left, top: p.top, color: ELC[i % 4], animationDelay: `${i * 0.08}s` }}>{g}</span>
                <i className="skh-dotmark" style={{ left: t.left, top: t.top }} />
              </React.Fragment>
            );
          })}
          {PL.map((p, i) => {
            const q = pos(sky[p.k], 96);
            return (
              <span key={p.k} className="skh-pl skh-up" style={{ left: q.left, top: q.top, '--c': p.c, animationDelay: `${0.6 + i * 0.12}s` }}>
                <i style={{ width: p.r * 2, height: p.r * 2 }} /><b>{p.g}</b>
              </span>
            );
          })}
          {(() => { const q = pos(sky.sun, 96); return <span className="skh-sun skh-up" style={{ left: q.left, top: q.top }} />; })()}
          {(() => {
            const q = pos(sky.moon, 96);
            return (
              <span className="skh-moon skh-up" style={{ left: q.left, top: q.top }}>
                <Moon f={ph.frac} size={moonR * 2 + 2} />
              </span>
            );
          })()}
        </div>
        <div className="skh-core">
          <span className="skh-k">Céu de hoje</span>
          <span className="skh-t">Céu e<br />Símbolos</span>
        </div>
      </div>
      <div className="skh-now">
        <span><i style={{ background: '#f3d98b', boxShadow: '0 0 10px #f3d98b' }} />Sol {em(sunSign)}</span>
        <span><i style={{ background: '#f7f1e0', boxShadow: '0 0 10px #f7f1e0' }} />{ph.name} {em(moonSign)}</span>
      </div>
    </div>
  );
}
