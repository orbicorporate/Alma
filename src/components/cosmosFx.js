// Efeitos de universo desenhados em canvas: galáxias espirais girando, cometas e poeira estelar.

// Galáxia espiral: partículas em braços logarítmicos, com núcleo brilhante.
export function makeGalaxy({ arms = 2, n = 420, size = 90, tilt = 0.45, rot = 0, hue = ['#c9b8ff', '#f5a8c8', '#a8d8ff'], speed = 0.05 } = {}) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const arm = i % arms, d = Math.pow(Math.random(), 0.7);
    const a = arm * (Math.PI * 2 / arms) + d * 4.2 + (Math.random() - 0.5) * 0.5 * (1.2 - d);
    pts.push({ d, a, r: Math.random() * 1.1 + 0.25, c: hue[Math.floor(Math.random() * hue.length)], p: Math.random() * 6 });
  }
  return { pts, size, tilt, rot, speed, hue };
}

export function drawGalaxy(ctx, g, x, y, t, alpha = 1, scale = 1) {
  const S = g.size * scale, spin = t * g.speed;
  ctx.save();
  ctx.translate(x, y); ctx.rotate(g.rot);
  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = 'lighter';
  // halo e núcleo
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 1.1);
  halo.addColorStop(0, `rgba(255,240,220,${0.22 * alpha})`); halo.addColorStop(0.15, `rgba(201,184,255,${0.08 * alpha})`); halo.addColorStop(1, 'rgba(201,184,255,0)');
  ctx.save(); ctx.scale(1, g.tilt); ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, S * 1.1, 0, 6.283); ctx.fill(); ctx.restore();
  g.pts.forEach((q) => {
    const a = q.a + spin * (1.4 - q.d); // o centro gira mais rápido
    const px = Math.cos(a) * q.d * S, py = Math.sin(a) * q.d * S * g.tilt;
    ctx.globalAlpha = alpha * (0.15 + 0.3 * (1 - q.d)) * (0.6 + 0.4 * Math.sin(t * 1.4 + q.p));
    ctx.fillStyle = q.c; ctx.beginPath(); ctx.arc(px, py, q.r * 0.6 * scale, 0, 6.283); ctx.fill();
  });
  ctx.globalAlpha = alpha;
  const core = ctx.createRadialGradient(0, 0, 0, 0, 0, S * 0.12);
  core.addColorStop(0, 'rgba(255,255,255,.5)'); core.addColorStop(1, 'rgba(255,230,200,0)');
  ctx.fillStyle = core; ctx.beginPath(); ctx.arc(0, 0, S * 0.12, 0, 6.283); ctx.fill();
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = prev;
  ctx.restore();
}

// Cometa: cabeça brilhante, cauda longa curva e partículas soltando.
export function makeComet(W, H, t) {
  const fromLeft = Math.random() < 0.5;
  const y0 = H * (0.1 + Math.random() * 0.45);
  return {
    t0: t, dur: 8 + Math.random() * 4,
    x0: fromLeft ? -60 : W + 60, y0,
    x1: fromLeft ? W + 80 : -80, y1: y0 + H * (0.15 + Math.random() * 0.25),
    bend: (Math.random() - 0.5) * H * 0.2, c: ['#a8d8ff', '#c9b8ff', '#9ff0e0'][Math.floor(Math.random() * 3)], dust: []
  };
}
const bez = (a, b, c, k) => (1 - k) * (1 - k) * a + 2 * (1 - k) * k * b + k * k * c;
export function drawComet(ctx, cm, t) {
  const k = (t - cm.t0) / cm.dur;
  if (k > 1.15) return false;
  const mx = (cm.x0 + cm.x1) / 2, my = (cm.y0 + cm.y1) / 2 + cm.bend;
  const at = (u) => ({ x: bez(cm.x0, mx, cm.x1, u), y: bez(cm.y0, my, cm.y1, u) });
  const prev = ctx.globalCompositeOperation; ctx.globalCompositeOperation = 'lighter';
  const kk = Math.min(1, k);
  // cauda: vários círculos cada vez menores e mais apagados
  for (let i = 40; i >= 0; i--) {
    const u = kk - i * 0.005; if (u < 0) continue;
    const p = at(u), f = 1 - i / 40;
    const r = 0.4 + f * 1.6;
    const gg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
    gg.addColorStop(0, cm.c + Math.round(f * f * 70).toString(16).padStart(2, '0')); gg.addColorStop(1, cm.c + '00');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, 6.283); ctx.fill();
  }
  if (k <= 1) {
    const h = at(kk);
    const head = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 7);
    head.addColorStop(0, 'rgba(255,255,255,.85)'); head.addColorStop(0.3, cm.c + '66'); head.addColorStop(1, cm.c + '00');
    ctx.fillStyle = head; ctx.beginPath(); ctx.arc(h.x, h.y, 7, 0, 6.283); ctx.fill();
    if (Math.random() < 0.25) cm.dust.push({ x: h.x, y: h.y, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 + 0.2, t: t });
  }
  cm.dust = cm.dust.filter((d) => t - d.t < 1.6);
  cm.dust.forEach((d) => {
    const a = 1 - (t - d.t) / 1.6; d.x += d.vx; d.y += d.vy;
    ctx.globalAlpha = a * 0.45; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(d.x, d.y, 0.5, 0, 6.283); ctx.fill();
  });
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = prev;
  return true;
}
