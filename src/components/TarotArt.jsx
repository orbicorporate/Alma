import React, { useId } from 'react';

// Arte das cartas do tarô, gerada a partir do número do arcano: céu, astro, estrelas e
// camadas de montanha com bordas douradas. Cada arcano tem cores e composição próprias.
const rng = (seed) => { let x = seed * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };

// Astro de cada arcano: sol, lua cheia, crescente ou estrela.
const ASTRO = { 0: 'sol', 1: 'estrela', 2: 'crescente', 3: 'sol', 4: 'sol', 5: 'cheia', 6: 'estrela', 7: 'sol', 8: 'sol', 9: 'crescente', 10: 'cheia', 11: 'cheia', 12: 'crescente', 13: 'crescente', 14: 'cheia', 15: 'crescente', 16: 'estrela', 17: 'estrela', 18: 'cheia', 19: 'sol', 20: 'estrela', 21: 'cheia' };

function ridge(r, base, amp, peaks) {
  const pts = [[0, base]];
  for (let i = 1; i <= peaks; i++) {
    const x = (i / (peaks + 1)) * 100 + (r() - 0.5) * 10;
    pts.push([x, base - amp * (0.45 + r() * 0.55)]);
    pts.push([x + 6 + r() * 6, base - amp * r() * 0.25]);
  }
  pts.push([100, base - amp * r() * 0.3]);
  let d = `M0 ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], mx = (x0 + x1) / 2;
    d += ` Q${x0.toFixed(1)} ${y0.toFixed(1)} ${mx.toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
  }
  return d + ' L100 160 L0 160 Z';
}

export function TarotFace({ n, name, num }) {
  const id = useId().replace(/:/g, '');
  const r = rng(n + 7);
  const astro = ASTRO[n] || 'cheia';
  // Arcanos de sol ganham céu de amanhecer; os de lua e estrela, céu noturno com tons próprios.
  const h = astro === 'sol' ? 18 + (n * 11) % 26 : (n * 47 + 250) % 360, h2 = (h + 40) % 360, h3 = astro === 'sol' ? 250 + (n * 13) % 40 : (h + 170) % 360;
  const ax = 28 + r() * 44, ay = 30 + r() * 16, ar = astro === 'sol' ? 15 : astro === 'estrela' ? 7 : 13;
  const stars = Array.from({ length: 34 }, () => [r() * 100, r() * 92, r() * 0.9 + 0.2, r()]);
  const warm = astro === 'sol';
  return (
    <svg className="ta-svg" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`s${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${h} 48% ${warm ? 22 : 9}%)`} />
          <stop offset="0.75" stopColor={`hsl(${h2} 46% ${warm ? 46 : 26}%)`} />
        </linearGradient>
        <radialGradient id={`g${id}`}>
          <stop offset="0" stopColor={warm ? '#fff3c4' : '#ffffff'} stopOpacity=".95" />
          <stop offset="0.35" stopColor={warm ? '#ffd27a' : '#e8e4ff'} stopOpacity=".55" />
          <stop offset="1" stopColor={warm ? '#ff9a5a' : '#c9b8ff'} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7dc8f" /><stop offset="0.55" stopColor="#d6a645" /><stop offset="1" stopColor="#8a5f1c" />
        </linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`hsl(${h3} 42% 34%)`} /><stop offset="1" stopColor={`hsl(${h3} 46% 14%)`} />
        </linearGradient>
      </defs>
      <rect width="100" height="160" fill={`url(#s${id})`} />
      {stars.map(([x, y, s, o], i) => <circle key={i} cx={x} cy={y} r={s * 0.5} fill="#fff" opacity={0.25 + o * 0.6} />)}
      <circle cx={ax} cy={ay} r={ar * 2.6} fill={`url(#g${id})`} />
      {astro === 'estrela' ? (
        <path d={`M${ax} ${ay - ar} L${ax + ar * 0.28} ${ay - ar * 0.28} L${ax + ar} ${ay} L${ax + ar * 0.28} ${ay + ar * 0.28} L${ax} ${ay + ar} L${ax - ar * 0.28} ${ay + ar * 0.28} L${ax - ar} ${ay} L${ax - ar * 0.28} ${ay - ar * 0.28} Z`} fill="#fffaf0" />
      ) : astro === 'crescente' ? (
        <path d={`M${ax} ${ay - ar} A${ar} ${ar} 0 1 0 ${ax} ${ay + ar} A${ar * 0.75} ${ar} 0 1 1 ${ax} ${ay - ar} Z`} fill="#f6f1ff" />
      ) : (
        <circle cx={ax} cy={ay} r={ar} fill={warm ? '#ffe7a3' : '#f2efff'} />
      )}
      <path d={ridge(r, 108, 30, 3)} fill={`hsl(${h} 30% ${warm ? 30 : 20}%)`} opacity=".9" />
      <path d={ridge(r, 120, 26, 2)} fill={`url(#m${id})`} />
      <path d={ridge(r, 132, 20, 3)} fill={`url(#f${id})`} />
      <path d={ridge(r, 146, 12, 2)} fill={`hsl(${h} 35% 8%)`} />
      <rect x="4" y="4" width="92" height="152" rx="5" fill="none" stroke="#e9c97a" strokeOpacity=".75" strokeWidth=".6" />
      <text x="50" y="16" textAnchor="middle" fontSize="7.5" fontWeight="600" letterSpacing="1" fill="#f7e2a6">{num}</text>
      <rect x="10" y="142" width="80" height="12" rx="6" fill="rgba(10,8,24,.55)" />
      <text x="50" y="150.6" textAnchor="middle" fontSize="6.4" fontWeight="600" fill="#f7e2a6">{name}</text>
    </svg>
  );
}

export function TarotBack() {
  const id = useId().replace(/:/g, '');
  const r = rng(3);
  const pts = Array.from({ length: 16 }, (_, i) => {
    const t = (i / 16) * Math.PI * 2, rad = i % 2 ? 9 : 24;
    return `${(50 + rad * Math.cos(t)).toFixed(1)},${(80 + rad * Math.sin(t)).toFixed(1)}`;
  }).join(' ');
  return (
    <svg className="ta-svg" viewBox="0 0 100 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a2d7a" /><stop offset="1" stopColor="#120e2c" /></linearGradient>
        <radialGradient id={`c${id}`}><stop offset="0" stopColor="#f3d98b" stopOpacity=".35" /><stop offset="1" stopColor="#f3d98b" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="100" height="160" fill={`url(#b${id})`} />
      {Array.from({ length: 26 }, (_, i) => <circle key={i} cx={r() * 100} cy={r() * 160} r={r() * 0.5 + 0.15} fill="#f3d98b" opacity={0.3 + r() * 0.5} />)}
      <circle cx="50" cy="80" r="38" fill={`url(#c${id})`} />
      <rect x="4" y="4" width="92" height="152" rx="5" fill="none" stroke="#e9c97a" strokeOpacity=".8" strokeWidth=".7" />
      <rect x="8" y="8" width="84" height="144" rx="3" fill="none" stroke="#e9c97a" strokeOpacity=".35" strokeWidth=".5" />
      <circle cx="50" cy="80" r="30" fill="none" stroke="#e9c97a" strokeOpacity=".55" strokeWidth=".6" />
      <circle cx="50" cy="80" r="24" fill="none" stroke="#e9c97a" strokeOpacity=".3" strokeWidth=".5" strokeDasharray="1 2" />
      <polygon points={pts} fill="#f3d98b" fillOpacity=".85" />
      <circle cx="50" cy="80" r="3" fill="#120e2c" />
      <path d="M50 24 A7 7 0 1 0 50 38 A5 7 0 1 1 50 24 Z" fill="#f3d98b" opacity=".8" />
      <path d="M50 122 L52 127 L57 128 L52 129 L50 134 L48 129 L43 128 L48 127 Z" fill="#f3d98b" opacity=".8" />
    </svg>
  );
}
