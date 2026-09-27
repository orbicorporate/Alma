// Astronomia leve compartilhada (mesmas fórmulas do mapa em Céu e Símbolos):
// Sol e Lua (Meeus simplificado) e planetas por elementos keplerianos (JPL).

export const SIGNS = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
export const SIGNS_EM = ['em Áries', 'em Touro', 'em Gêmeos', 'em Câncer', 'em Leão', 'em Virgem', 'em Libra', 'em Escorpião', 'em Sagitário', 'em Capricórnio', 'em Aquário', 'em Peixes'];
export const HOUSE = ['identidade e presença', 'dinheiro e valores', 'conversas e aprendizados', 'casa e família', 'criatividade, prazer e romance', 'rotina, trabalho e saúde', 'parcerias e relações', 'intimidade e transformação', 'estudos, viagens e sentido', 'carreira e vocação', 'amizades e projetos coletivos', 'descanso e espiritualidade'];
export const PNAME = { sun: 'o Sol', moon: 'a Lua', mercury: 'Mercúrio', venus: 'Vênus', mars: 'Marte', jupiter: 'Júpiter', saturn: 'Saturno' };
export const PNATAL = { sun: 'seu Sol', moon: 'sua Lua', venus: 'sua Vênus', asc: 'seu Ascendente' };

const CITIES = {
  'São Paulo': [-23.55, -46.63, -3], 'Sorocaba': [-23.50, -47.46, -3], 'Campinas': [-22.91, -47.06, -3], 'Rio de Janeiro': [-22.91, -43.17, -3],
  'Belo Horizonte': [-19.92, -43.94, -3], 'Curitiba': [-25.43, -49.27, -3], 'Florianópolis': [-27.60, -48.55, -3], 'Porto Alegre': [-30.03, -51.23, -3],
  'Brasília': [-15.79, -47.88, -3], 'Goiânia': [-16.68, -49.25, -3], 'Salvador': [-12.97, -38.51, -3], 'Recife': [-8.05, -34.88, -3],
  'Fortaleza': [-3.73, -38.52, -3], 'Belém': [-1.46, -48.49, -3], 'Manaus': [-3.12, -60.02, -4]
};

const norm = (x) => ((x % 360) + 360) % 360;
export function jdOf(y, mo, d, h, mi, tz) {
  const ut = h - tz + mi / 60;
  let Y = y, M = mo;
  if (M <= 2) { Y -= 1; M += 12; }
  const A = Math.floor(Y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 + ut / 24;
}
export const jdDate = (date) => date.getTime() / 86400000 + 2440587.5;

const EL = {
  mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
  venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
  earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0],
  mars: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
  jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
  saturn: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794]
};
export function lonOf(k, jd) {
  const R = Math.PI / 180, T = (jd - 2451545) / 36525;
  if (k === 'sun') {
    const L0 = 280.46646 + 36000.76983 * T, M = (357.52911 + 35999.05029 * T) * R;
    return norm(L0 + (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M));
  }
  if (k === 'moon') {
    const Lp = 218.3164477 + 481267.88123421 * T;
    const D = (297.8501921 + 445267.1114034 * T) * R, M = (357.5291092 + 35999.0502909 * T) * R;
    const Mp = (134.9633964 + 477198.8675055 * T) * R, F = (93.2720950 + 483202.0175233 * T) * R;
    return norm(Lp + 6.289 * Math.sin(Mp) + 1.274 * Math.sin(2 * D - Mp) + 0.658 * Math.sin(2 * D) + 0.214 * Math.sin(2 * Mp)
      - 0.186 * Math.sin(M) - 0.114 * Math.sin(2 * F) + 0.059 * Math.sin(2 * D - 2 * Mp) + 0.057 * Math.sin(2 * D - M - Mp)
      + 0.053 * Math.sin(2 * D + Mp) + 0.046 * Math.sin(2 * D - M) + 0.041 * Math.sin(Mp - M) - 0.035 * Math.sin(D) - 0.030 * Math.sin(Mp + M));
  }
  const helio = (e0) => {
    const a = e0[0] + e0[1] * T, e = e0[2] + e0[3] * T, I = (e0[4] + e0[5] * T) * R;
    const L = e0[6] + e0[7] * T, vp = e0[8] + e0[9] * T, Om = e0[10] + e0[11] * T;
    const M = norm(L - vp) * R, w = (vp - Om) * R, O = Om * R;
    let E = M + e * Math.sin(M);
    for (let i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
    const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I);
    return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp];
  };
  const p = helio(EL[k]), ea = helio(EL.earth);
  return norm(Math.atan2(p[1] - ea[1], p[0] - ea[0]) / R + 1.3970 * T);
}
function ascOf(jd, lat, lonE) {
  const R = Math.PI / 180, d = jd - 2451545.0, T = d / 36525;
  const ramc = norm(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T + lonE) * R;
  const eps = (23.439291 - 0.0130042 * T) * R;
  return norm(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat * R) * Math.sin(eps))) / R);
}

// Pontos natais principais a partir do perfil salvo (ou null).
let cache = { key: '', v: null };
export function natal(profile) {
  if (!profile) return null;
  const key = JSON.stringify(profile);
  if (cache.key === key) return cache.v;
  const dm = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((profile.date || '').trim());
  const tm = /^(\d{1,2})(?::(\d{1,2}))?$/.exec((profile.time || '12:00').trim());
  if (!dm) return null;
  const c = CITIES[profile.city] || CITIES['São Paulo'];
  const jd = jdOf(+dm[3], +dm[2], +dm[1], tm ? +tm[1] : 12, tm ? +(tm[2] || 0) : 0, c[2]);
  const v = { sun: lonOf('sun', jd), moon: lonOf('moon', jd), venus: lonOf('venus', jd), asc: ascOf(jd, c[0], c[1]) };
  v.sunSign = Math.floor(v.sun / 30);
  v.ascSign = Math.floor(v.asc / 30);
  cache = { key, v };
  return v;
}

export const ASPECTS = [[0, 'conjunção', 'mix'], [60, 'sextil', 'soft'], [90, 'quadratura', 'hard'], [120, 'trígono', 'soft'], [180, 'oposição', 'hard']];
export function aspectOf(a, b, orbMax) {
  let d = Math.abs(norm(a - b)); if (d > 180) d = 360 - d;
  let best = null;
  ASPECTS.forEach((x) => { const o = Math.abs(d - x[0]); if (o <= orbMax && (!best || o < best.orb)) best = { name: x[1], nature: x[2], orb: o }; });
  return best;
}

// Posições do céu num momento (meio-dia local).
export function skyAt(date) {
  const d = new Date(date); d.setHours(12, 0, 0, 0);
  const jd = jdDate(d);
  const o = {};
  ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'].forEach((k) => { o[k] = lonOf(k, jd); });
  return o;
}
