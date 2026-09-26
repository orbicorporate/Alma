// Datas relativas ao dia de hoje (horário local), usadas por planos, horóscopo e numerologia.
export const WD = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WD_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
export const MO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MO_FULL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export function today() { const d = new Date(); d.setHours(12, 0, 0, 0); return d; }
export function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
export function addMonths(d, n) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
export function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function fromIso(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d, 12); }
export function daysUntil(s) { return Math.round((fromIso(s) - today()) / 864e5); }
export function short(d) { return `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`; }
export function dayMonth(d) { return `${d.getDate()} ${MO[d.getMonth()]}`; }
export function stepLabel(s) {
  const n = daysUntil(s), d = fromIso(s);
  return n === 0 ? `Hoje · ${short(d)}` : n === 1 ? `Amanhã · ${short(d)}` : short(d);
}
// Normaliza um passo de plano: datas guardadas como ISO viram rótulo e dias restantes.
export function stepInfo(x) { return x && x.iso ? Object.assign({}, x, { date: stepLabel(x.iso), due: daysUntil(x.iso) }) : x; }
