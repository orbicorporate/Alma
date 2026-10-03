import React, { useEffect, useMemo, useRef, useState } from 'react';
import './sphere.css';

// Esfera do mapa natal: planetas do nascimento em órbita 3D ao redor de uma esfera de vidro.
// Toque em um símbolo para ver como ele age na vida da pessoa e dicas por área.

const TIPS = {
  sun: ['Assuma projetos em que você possa aparecer e liderar.', 'Compartilhe seus planos: brilhar junto aproxima.', 'Invista no que fortalece a sua identidade profissional.', 'Luz natural e movimento pela manhã recarregam você.'],
  moon: ['Ambientes acolhedores rendem mais para você; cuide do clima à sua volta.', 'Diga do que você precisa, sem esperar que adivinhem.', 'Evite compras por impulso nos dias mais emocionais.', 'Respeite seus ciclos de energia e de sono.'],
  mercury: ['Escreva, organize e negocie: sua mente é sua ferramenta.', 'Conversas sinceras resolvem mais do que gestos.', 'Pesquise e compare antes de decidir.', 'Pausas longe das telas ajudam a mente a descansar.'],
  venus: ['Parcerias e bom gosto abrem portas para você.', 'Cultive pequenos rituais de carinho no dia a dia.', 'Gaste com o que traz beleza duradoura, não só prazer rápido.', 'Arte, música e natureza recarregam sua energia.'],
  mars: ['Comece o que está parado; você rende com metas claras.', 'Paixão sim, impulsividade não: respire antes de reagir.', 'Tenha coragem para investir, com limite definido.', 'Exercício físico canaliza a sua energia.'],
  jupiter: ['Estude e expanda: cursos e viagens favorecem você.', 'Generosidade e bom humor fortalecem os vínculos.', 'Cuidado com o excesso de otimismo nos gastos.', 'Ter um propósito maior te move e te cura.'],
  saturn: ['Constância vence talento: construa devagar e firme.', 'Compromisso e responsabilidade trazem segurança à relação.', 'Planejamento de longo prazo é o seu ponto forte.', 'Limites claros protegem a sua energia.'],
  asc: ['Seu jeito natural abre portas: não esconda como você chega.', 'Deixe as pessoas conhecerem você além da primeira impressão.', 'Invista na sua imagem com propósito, não por comparação.', 'Cuide do corpo: ele é sua porta de entrada no mundo.']
};
const AREAS = [['Trabalho', '#a8d8ff'], ['Amor e vínculos', '#f5a8c8'], ['Finanças', '#f3d98b'], ['Bem-estar', '#8fe3b0']];
const TONE = {
  conj: 'intensifica essa energia e coloca o tema em evidência',
  tri: 'faz essa energia fluir com facilidade',
  sext: 'abre pequenas portas que pedem um passo seu',
  sq: 'pede um ajuste: o atrito de hoje é motor de mudança',
  opp: 'pede equilíbrio entre você e o outro'
};

export default function NatalSphere({ sim, profile }) {
  const ch = sim.chart(profile);
  const [rot, setRot] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [landed, setLanded] = useState(false);
  const [settled, setSettled] = useState(false);
  const [sel, setSel] = useState('sun');
  const [needsMotion, setNeedsMotion] = useState(false);
  useEffect(() => { if (!landed) return; const k2 = setTimeout(() => setSettled(true), 2400); return () => clearTimeout(k2); }, [landed]);
  const box = useRef(null);

  useEffect(() => {
    let raf, last = performance.now();
    const loop = (t) => { const dt = Math.min(64, t - last); last = t; setRot((r) => (r + dt * 0.004) % 360); raf = requestAnimationFrame(loop); };
    // Movimento reduzido: o mapa fica parado, sem órbita contínua.
    const still = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!still) raf = requestAnimationFrame(loop);
    // os planetas caem na órbita quando a esfera aparece na tela
    let k = null;
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { k = setTimeout(() => setLanded(true), 60); io.disconnect(); } }, { threshold: 0.35 }) : null;
    if (io && box.current) io.observe(box.current); else k = setTimeout(() => setLanded(true), 60);
    const onOri = (e) => {
      if (e.gamma == null) return;
      setTilt({ x: Math.max(-1, Math.min(1, e.gamma / 30)), y: Math.max(-1, Math.min(1, (e.beta - 45) / 30)) });
    };
    window.addEventListener('deviceorientation', onOri);
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') setNeedsMotion(true);
    return () => { cancelAnimationFrame(raf); clearTimeout(k); io && io.disconnect(); window.removeEventListener('deviceorientation', onOri); };
  }, []);

  // Trânsitos de hoje sobre os pontos do mapa (orbe de até 3°).
  const active = useMemo(() => {
    const d = new Date();
    const jd = sim.jdOf(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), -d.getTimezoneOffset() / 60);
    const keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const tr = keys.map((k) => ({ k, lon: sim.lonOf(k, jd) }));
    const pts = ch.planets.map((p) => ({ k: p.k, lon: p.lon })).concat([{ k: 'asc', lon: ch.asc }]);
    const out = {};
    pts.forEach((p) => tr.forEach((t) => {
      const a = sim.aspect(t.lon, p.lon);
      if (a && a.orb <= 3 && !(t.k === p.k && a.k === 'conj' && t.k !== 'moon')) (out[p.k] = out[p.k] || []).push({ tk: t.k, name: a.name, k: a.k, orb: a.orb });
    }));
    return out;
  }, [ch]);

  const W = 350, H = 280, cx = W / 2, cy = H / 2 - 6;
  const rx = 150, ry = 54 + tilt.y * 18;
  const place = (lon, radX, radY) => {
    const a = (180 - (lon - ch.asc) - rot) * Math.PI / 180;
    const depth = Math.sin(a);
    return { x: cx + radX * Math.cos(a) + tilt.x * 10 * depth, y: cy + radY * Math.sin(a), depth };
  };
  const points = ch.planets.map((p) => ({ k: p.k, lon: p.lon, sign: p.sign, deg: p.deg, house: p.house, g: sim.PL[p.k].g, name: sim.PL[p.k].name, color: sim.PL[p.k].color }))
    .concat([{ k: 'asc', lon: ch.asc, sign: ch.ascSign, deg: ch.asc % 30, house: 1, g: 'AC', name: 'Ascendente', color: '#f3d98b' }]);
  // Espalha símbolos muito próximos para não se sobreporem (mantém a ordem real do zodíaco).
  const sorted = points.slice().sort((a, b) => a.lon - b.lon);
  const shown = {};
  let prev = -99;
  sorted.forEach((p) => { const v = Math.max(p.lon, prev + 30); shown[p.k] = v; prev = v; });
  const over = prev - (sorted[0].lon + 360 - 30);
  if (over > 0) sorted.forEach((p, i) => { shown[p.k] -= over * (i / Math.max(1, sorted.length - 1)); });
  const laneOf = {};
  sorted.forEach((p, i) => { laneOf[p.k] = Math.abs(shown[p.k] - p.lon) > 8 ? (i % 2) : 0; });

  const onMove = (e) => {
    const r = box.current.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 });
  };
  const askMotion = async () => { try { await DeviceOrientationEvent.requestPermission(); } catch (e) { /* recusado */ } setNeedsMotion(false); };

  const s = points.find((p) => p.k === sel) || points[0];
  const act = active[s.k] || [];
  const how = s.k === 'asc'
    ? `O ascendente em ${sim.SIGNS[s.sign]} é o jeito como você chega ao mundo: com ${sim.SIGN_KW[s.sign]}. É a primeira impressão e a porta de entrada do seu mapa.`
    : `${sim.PL[s.k].fn.charAt(0).toUpperCase() + sim.PL[s.k].fn.slice(1)} ${sim.SIGN_KW[s.sign]}. Na casa ${s.house}, isso aparece principalmente em ${sim.HOUSE[s.house - 1]}.`;

  return (
    <div className="sp">
      <div ref={box} className="sp-stage" style={{ width: W, height: H }} onPointerMove={onMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })}>
        <div className="sp-halo" style={{ left: cx - 130, top: cy - 130, transform: `translate(${tilt.x * 8}px, ${tilt.y * 8}px)` }} />
        <div className="sp-orbit" style={{ left: cx - rx, top: cy - ry, width: rx * 2, height: ry * 2 }} />
        <div className="sp-orbit sp-orbit2" style={{ left: cx - rx - 22, top: cy - ry - 12, width: (rx + 22) * 2, height: (ry + 12) * 2 }} />
        {sim.SG.map((g, i) => {
          const p = place(i * 30 + 15, rx + 22, ry + 12);
          return <span key={'z' + i} className="sp-zod sym" style={{ left: p.x - 9, top: p.y - 9, zIndex: p.depth > 0 ? 4 : 1, opacity: p.depth > 0 ? 0.7 : 0.25, color: sim.ELC[i % 4] }} aria-hidden="true">{g}</span>;
        })}
        <div className="sp-ball" style={{ left: cx - 78, top: cy - 78 }}>
          <div className="sp-sheen" style={{ transform: `translate(${-tilt.x * 14}px, ${-tilt.y * 14}px)` }} />
          <div className="sp-core" />
        </div>
        {points.map((p, i) => {
          const r = 1 - laneOf[p.k] * 0.14;
          const pos = place(shown[p.k], rx * r, ry * r);
          const sc = 0.72 + 0.38 * (pos.depth + 1) / 2;
          const isSel = sel === p.k, isAct = !!active[p.k];
          return (
            <div key={p.k} className="sp-slot" style={{ left: pos.x - 20, top: pos.y - 20, zIndex: pos.depth > 0 ? 5 : 1, opacity: landed ? 0.5 + 0.5 * (pos.depth + 1) / 2 : 0, transition: 'opacity .8s ease' }}>
              <button
                className={'sp-planet sym' + (isAct ? ' sp-active' : '') + (isSel ? ' sp-sel' : '')}
                onClick={() => setSel(p.k)}
                aria-label={`${p.name} em ${sim.SIGNS[p.sign]}`}
                aria-pressed={isSel ? 'true' : 'false'}
                style={{ color: p.color, borderColor: p.color + (isSel ? '' : '88'), background: isSel ? `color-mix(in srgb, ${p.color} 22%, #17123a)` : undefined, boxShadow: `0 0 ${isSel ? 26 : 14}px ${p.color}${isSel ? 'aa' : '55'}`, transform: `translateY(${landed ? 0 : -150}px) scale(${sc * (isSel ? 1.18 : 1)})`, transition: settled ? 'box-shadow .2s ease, border-color .2s ease, background-color .2s ease' : `transform 1.2s cubic-bezier(.2,.9,.3,1.12) ${i * 100}ms`, fontSize: p.k === 'asc' ? 13 : 17 }}
              >{p.g}</button>
            </div>
          );
        })}
      </div>
      <div className="sp-legend">
        <span>Toque em um planeta para ler</span>
        <span className="sp-key"><span className="sp-dot" aria-hidden="true" />ativo hoje</span>
        {needsMotion ? <button className="sp-motion" onClick={askMotion}>Ativar movimento</button> : null}
      </div>

      <div className="sp-card" key={s.k} style={{ '--pc': s.color }}>
        <div className="sp-head">
          <span className="sp-badge sym" style={{ color: s.color, borderColor: s.color, fontSize: s.k === 'asc' ? 14 : 19 }} aria-hidden="true">{s.g}</span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span className="sp-title">{s.name} em {sim.SIGNS[s.sign]}</span>
            <span className="sp-sub">{Math.floor(s.deg)}°, casa {s.house}: {sim.HOUSE[s.house - 1]}</span>
          </span>
        </div>
        <div className="sp-sec">
          <span className="sp-k">Como age em você</span>
          <p className="sp-text">{how}</p>
        </div>
        {act.length ? (
          <div className="sp-today">
            <span className="sp-k">Hoje no céu</span>
            {act.map((a, j) => (
              <p key={j}>{sim.PL[a.tk].name} em trânsito forma {a.name} com {({ asc: 'o seu ascendente', moon: 'a sua Lua', venus: 'a sua Vênus' })[s.k] || `o seu ${s.name}`} (orbe {a.orb.toFixed(1).replace('.', ',')}°): {TONE[a.k]}.</p>
            ))}
          </div>
        ) : null}
        <div className="sp-sec">
          <span className="sp-k">Dicas para cada área</span>
          <div className="sp-tips">
            {AREAS.map((a, j) => (
              <div key={j} className="sp-tip" style={{ '--c': a[1] }}>
                <span>{a[0]}</span>
                <p>{TIPS[s.k][j]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
