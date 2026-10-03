import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import './gallery3d.css';

// Galeria em perspectiva (coverflow): a carta do centro de frente e as laterais viradas para ela.
// Arrastar move a galeria com o dedo; ao soltar, ela encaixa na carta mais próxima.
// As transformações são escritas direto nos elementos (sem re-render a cada quadro).
const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Gallery3D({ count, index, onIndex, onActivate, renderCard, cardW = 190, cardH = 300, step = 150, label = 'Galeria de cartas' }) {
  const wrap = useRef(null);
  const nodes = useRef([]);
  const pos = useRef(index);
  const anim = useRef(0);
  const drag = useRef(null);
  const moved = useRef(false);

  const layout = useCallback((p) => {
    const flat = reduced();
    nodes.current.forEach((el, i) => {
      if (!el) return;
      const d = i - p, ad = Math.abs(d), sg = Math.sign(d);
      const x = sg * (ad < 1 ? ad * step : step + (ad - 1) * step * 0.5);
      const rot = flat ? 0 : -sg * Math.min(ad, 1) * 34;
      const z = flat ? 0 : -Math.min(ad, 4) * 110;
      const sc = 1 - Math.min(ad, 3) * (flat ? 0.12 : 0.07);
      const op = ad > 3.4 ? 0 : ad > 2.4 ? 1 - (ad - 2.4) : 1;
      el.style.transform = `translate3d(${x.toFixed(1)}px, 0, ${z.toFixed(1)}px) rotateY(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
      el.style.opacity = op.toFixed(3);
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.pointerEvents = op < 0.05 ? 'none' : 'auto';
      el.style.setProperty('--dim', Math.min(ad, 1).toFixed(3));
    });
  }, [step]);

  const glide = useCallback((to) => {
    cancelAnimationFrame(anim.current);
    const from = pos.current;
    if (reduced() || Math.abs(to - from) < 0.001) { pos.current = to; layout(to); return; }
    const dur = Math.min(620, 360 + Math.abs(to - from) * 70), t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      pos.current = from + (to - from) * easeOut(k);
      layout(pos.current);
      if (k < 1) anim.current = requestAnimationFrame(tick);
    };
    anim.current = requestAnimationFrame(tick);
  }, [layout]);

  // Primeira montagem: as cartas abrem a partir do centro.
  useLayoutEffect(() => {
    if (reduced()) { layout(index); return; }
    pos.current = index; layout(index);
    nodes.current.forEach((el, i) => { if (el) el.style.setProperty('--enter', String(Math.abs(i - index))); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => { layout(pos.current); });
  useEffect(() => { if (!drag.current && Math.abs(pos.current - index) > 0.001) glide(index); }, [index, glide]);
  useEffect(() => () => cancelAnimationFrame(anim.current), []);

  const clamp = (v) => Math.max(0, Math.min(count - 1, v));
  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    cancelAnimationFrame(anim.current);
    drag.current = { x: e.clientX, p: pos.current, t: performance.now(), vx: 0, lx: e.clientX, lt: performance.now() };
    moved.current = false;
  };
  const onMove = (e) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 6 && !moved.current) { moved.current = true; try { wrap.current.setPointerCapture(e.pointerId); } catch (er) { /* sem captura */ } }
    if (!moved.current) return;
    const now = performance.now();
    d.vx = (e.clientX - d.lx) / Math.max(1, now - d.lt); d.lx = e.clientX; d.lt = now;
    let p = d.p - dx / step;
    if (p < 0) p = p * 0.35; if (p > count - 1) p = count - 1 + (p - count + 1) * 0.35;
    pos.current = p; layout(p);
  };
  const onUp = () => {
    const d = drag.current; drag.current = null; if (!d) return;
    if (!moved.current) return;
    const fling = Math.abs(d.vx) > 0.35 ? -Math.sign(d.vx) * Math.min(3, Math.round(Math.abs(d.vx) * 2)) : 0;
    const to = clamp(Math.round(pos.current + fling * 0.6));
    glide(to);
    if (to !== index) onIndex(to);
  };
  const tap = (i) => () => {
    if (moved.current) { moved.current = false; return; }
    if (i === index) onActivate && onActivate(i); else onIndex(i);
  };
  const onKey = (e) => {
    if (e.key === 'ArrowLeft' && index > 0) { e.preventDefault(); onIndex(index - 1); }
    if (e.key === 'ArrowRight' && index < count - 1) { e.preventDefault(); onIndex(index + 1); }
  };

  return (
    <div className="g3d" ref={wrap} role="group" aria-roledescription="carrossel" aria-label={label}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onKeyDown={onKey}
      style={{ '--cw': cardW + 'px', '--ch': cardH + 'px' }}>
      <div className="g3d-stage">
        {Array.from({ length: count }, (_, i) => (
          <button key={i} ref={(el) => { nodes.current[i] = el; }} className={'g3d-card' + (i === index ? ' g3d-on' : '')}
            onClick={tap(i)} tabIndex={i === index ? 0 : -1} aria-current={i === index ? 'true' : undefined}>
            {renderCard(i, i === index)}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GalleryArrows({ index, count, onIndex, prevLabel = 'Carta anterior', nextLabel = 'Próxima carta' }) {
  const Arrow = ({ d }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} /></svg>;
  return (
    <div className="g3d-arrows">
      <button className="g3d-arrow" onClick={() => onIndex(Math.max(0, index - 1))} disabled={index <= 0} aria-label={prevLabel}><Arrow d={0} /></button>
      <button className="g3d-arrow g3d-next" onClick={() => onIndex(Math.min(count - 1, index + 1))} disabled={index >= count - 1} aria-label={nextLabel}><Arrow d={1} /></button>
    </div>
  );
}
