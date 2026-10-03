import React, { useEffect, useRef } from 'react';
import { makeGalaxy, drawGalaxy, makeComet, drawComet } from './cosmosFx.js';

// Um pedaço de universo vivo para caber dentro de um cartão: galáxia, poeira, estrelas e cometas.
export default function MiniCosmos({ w = 350, h = 240 }) {
  const cv = useRef(null);
  useEffect(() => {
    const c = cv.current, ctx = c.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * DPR; c.height = h * DPR;
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1 + 0.2, p: Math.random() * 6 }));
    const gal = makeGalaxy({ size: 64, tilt: 0.42, rot: -0.35, n: 340, speed: 0.08 });
    const gal2 = makeGalaxy({ size: 26, tilt: 0.35, rot: 0.9, n: 120, speed: -0.12, hue: ['#a8d8ff', '#ffffff'] });
    const comets = []; let next = 2.5, raf;
    const t0 = performance.now();
    const draw = (now) => {
      const t = (now - t0) / 1000;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const neb = ctx.createRadialGradient(w * 0.7, h * 0.35, 0, w * 0.7, h * 0.35, w * 0.7);
      neb.addColorStop(0, `rgba(140,110,255,${0.3 + 0.06 * Math.sin(t * 0.5)})`); neb.addColorStop(0.5, 'rgba(245,168,200,.1)'); neb.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = neb; ctx.fillRect(0, 0, w, h);
      stars.forEach((s) => { ctx.globalAlpha = 0.4 + 0.55 * (0.5 + 0.5 * Math.sin(t * 1.4 + s.p)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); });
      ctx.globalAlpha = 1;
      drawGalaxy(ctx, gal, w * 0.74, h * 0.38, t, Math.min(1, t / 2) * 0.8, 0.85);
      drawGalaxy(ctx, gal2, w * 0.14, h * 0.2, t, Math.min(1, t / 2) * 0.6, 0.8);
      if (t > next) { comets.push(makeComet(w, h, t)); next = t + 10 + Math.random() * 8; }
      for (let i = comets.length - 1; i >= 0; i--) if (!drawComet(ctx, comets[i], t)) comets.splice(i, 1);
      raf = requestAnimationFrame(draw);
    };
    // Movimento reduzido: um único quadro parado, já com as galáxias acesas e sem cometas.
    const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { next = Infinity; draw(t0 + 3000); cancelAnimationFrame(raf); return () => {}; }
    // Fora da tela, o céu para de desenhar (poupa bateria) e volta quando aparece.
    let on = true;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !on) { on = true; raf = requestAnimationFrame(draw); }
      else if (!en.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    }) : null;
    if (io) io.observe(c);
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); if (io) io.disconnect(); };
  }, [w, h]);
  return <canvas ref={cv} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}
