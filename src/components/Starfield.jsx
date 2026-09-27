import React, { useMemo } from 'react';
import './starfield.css';

// Estrelas que piscam e, de vez em quando, uma estrela cadente. Só decoração, sem toque.
export default function Starfield({ n = 46 }) {
  const stars = useMemo(() => Array.from({ length: n }, (_, i) => {
    const r = Math.random();
    return { left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, size: r > 0.9 ? 2.6 : r > 0.6 ? 1.8 : 1.1, delay: `${(Math.random() * 5).toFixed(2)}s`, dur: `${(2.5 + Math.random() * 4).toFixed(2)}s`, c: ['#fff', '#fff', '#e4d6ff', '#ffe7c4', '#c9d8ff'][i % 5] };
  }), [n]);
  return (
    <div className="stf" aria-hidden="true">
      {stars.map((s, i) => <i key={i} style={{ left: s.left, top: s.top, width: s.size, height: s.size, background: s.c, animationDelay: s.delay, animationDuration: s.dur, boxShadow: s.size > 2 ? `0 0 6px ${s.c}` : 'none' }} />)}
      <b className="stf-shoot" />
      <b className="stf-shoot stf-shoot-2" />
    </div>
  );
}
