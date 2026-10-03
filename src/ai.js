// Cliente da Alma AI (função /api/alma-ai na Vercel). Se a IA não estiver disponível,
// devolve null e o app usa as respostas locais.
async function call(body, ms) {
  const ctl = new AbortController();
  const k = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch('/api/alma-ai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal });
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; } finally { clearTimeout(k); }
}
const KINDS = ['Dúvida', 'Alegria', 'Medo', 'Aflição', 'Pensamento', 'Sugestão'];
// ctx: { history, recentQs } da própria pessoa, para a Alma lembrar e não se repetir.
export async function aiQuestions(text, kind, ctx = {}) {
  const r = await call({ mode: 'questions', text, kind, history: ctx.history || [], recentQs: ctx.recentQs || [] }, 20000);
  if (!r || !Array.isArray(r.questions) || r.questions.length < 3) return null;
  const qs = r.questions.slice(0, 3).map((q) => ({ q: String(q.q || ''), tags: (q.tags || []).slice(0, 5).map(String), foco: q.foco ? String(q.foco) : '' })).filter((q) => q.q && q.tags.length >= 3);
  if (qs.length < 3) return null;
  const l = r.leitura && r.leitura.entendi ? r.leitura : null;
  return { kind: KINDS.includes(r.kind) ? r.kind : null, questions: qs, leitura: l };
}
// Próxima pergunta, pensada a partir da última resposta. Rápida; se demorar, o app segue com a planejada.
export async function aiNext(payload) {
  const r = await call(Object.assign({ mode: 'next' }, payload), 12000);
  if (!r || !r.q || !Array.isArray(r.tags) || r.tags.length < 3) return r && r.pronto ? { pronto: true } : null;
  return { pronto: !!r.pronto, q: String(r.q), tags: r.tags.slice(0, 5).map(String), foco: r.foco ? String(r.foco) : '' };
}
export async function aiCouncil(payload) {
  const r = await call(Object.assign({ mode: 'council' }, payload), 55000);
  if (!r || !Array.isArray(r.reflections) || !r.alma) return null;
  return { reflections: r.reflections.map(String), alma: { p1: String(r.alma.p1 || ''), p2: String(r.alma.p2 || ''), step: String(r.alma.step || ''), sec: r.alma.sec && r.alma.sec.leitura ? r.alma.sec : null }, plan: Array.isArray(r.plan) ? r.plan.map(String).filter(Boolean).slice(0, 6) : null };
}

// Leitura do sonho escrita pela IA; volta null se não estiver disponível.
export async function aiDream(dream, recent) {
  const r = await call({ mode: 'dream', text: String(dream.text || dream.title || ''), dream: { title: dream.title, wake: dream.wake, deep: dream.deep || {}, recent } }, 40000);
  if (!r || !r.essencia || !Array.isArray(r.simbolos) || !r.psi || !r.esp) return null;
  return r;
}
