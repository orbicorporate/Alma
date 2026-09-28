// Alma AI (Vercel): perguntas de aprofundamento e respostas do Conselho escritas por um modelo Claude,
// no contexto exato do que a pessoa trouxe. A chave fica na variável ANTHROPIC_API_KEY do projeto na Vercel.
const MODEL_Q = process.env.ALMA_MODEL_QUESTIONS || 'claude-sonnet-5';
const MODEL_C = process.env.ALMA_MODEL_COUNCIL || 'claude-opus-5-5';
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 40;
}
const STYLE = `Você é a Alma, uma conselheira acolhedora e profunda que reúne religiões e filosofias para aconselhar, nunca para dividir.
Escreva em português do Brasil, com calor humano, precisão e profundidade, sem clichês, sem jargão e sem travessões (use vírgulas, dois-pontos ou pontos).
Fale diretamente com a pessoa (você). Nunca invente citações: use apenas os textos fornecidos.
Não dê diagnóstico médico, jurídico ou financeiro. Se houver sinais de risco à vida, recomende com delicadeza o CVV (188).`;


async function claude(model, system, user, maxTokens) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('no-key');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] })
  });
  if (!r.ok) throw new Error('api ' + r.status + ' ' + (await r.text()).slice(0, 300));
  const j = await r.json();
  const txt = (j.content || []).map((c) => c.text || '').join('');
  const m = txt.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no-json');
  return JSON.parse(m[0]);
}

export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  const json = (b, s = 200) => res.status(s).json(b);
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  try {
    const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0];
    if (limited(ip)) return json({ error: 'rate' }, 429);
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const text = String(body.text || '').slice(0, 1200);
    const kind = String(body.kind || '').slice(0, 30);
    if (!text.trim()) return json({ error: 'empty' }, 400);

    if (body.mode === 'questions') {
      const out = await claude(MODEL_Q, STYLE, `A pessoa escreveu: "${text}"
Tipo escolhido (pode estar errado, confie mais no texto): ${kind || 'não informado'}.

Primeiro identifique o sentimento real (Dúvida, Alegria, Medo, Aflição, Pensamento ou Sugestão) e o assunto concreto.
Depois crie 3 perguntas curtas de aprofundamento, específicas para ESSA situação (cite o assunto com as palavras dela), que ajudem a Alma a aconselhar melhor.
Cada pergunta tem 5 opções de resposta curtas (1 a 4 palavras), concretas e diferentes entre si, que façam sentido para essa pessoa.
Responda só com JSON: {"kind":"...","topic":"assunto em poucas palavras","questions":[{"q":"...","tags":["...","...","...","...","..."]}]}`, 900);
      return json(out);
    }

    if (body.mode === 'council') {
      const answers = (body.answers || []).filter(Boolean).slice(0, 3).map((a) => String(a).slice(0, 200));
      const qs = (body.questions || []).slice(0, 3).map((q) => String(q).slice(0, 200));
      const voices = (body.voices || []).slice(0, 14).map((v) => ({ name: String(v.name), ref: String(v.ref).slice(0, 80), tr: String(v.tr).slice(0, 300) }));
      const qa = qs.map((q, i) => `${q} → ${answers[i] || '(pulou)'}`).join('\n');
      const out = await claude(MODEL_C, STYLE, `A pessoa trouxe (${kind}): "${text}"
Aprofundamento:
${qa || '(sem respostas)'}

Estas são as 14 tradições do Conselho e o texto que cada uma traz (não altere os textos):
${voices.map((v, i) => `${i + 1}. ${v.name} (${v.ref}): "${v.tr}"`).join('\n')}

Tarefas:
1. Para cada tradição, escreva uma reflexão de 2 a 3 frases que conecte aquele texto, com a visão própria daquela tradição, à situação concreta da pessoa e às respostas dela. Cada reflexão deve trazer um ângulo diferente das outras, sem repetir ideias nem estruturas de frase.
2. Escreva a resposta da Alma: p1 (1 a 2 frases que mostram que você entendeu exatamente a situação), p2 (3 a 4 frases com uma síntese profunda e honesta, integrando as tensões e o que as tradições convergem, citando pelo nome 2 ou 3 delas), step (um passo concreto, pequeno e possível para os próximos dias).
3. Crie um plano de ação com 4 ou 5 passos curtos, práticos e em ordem, específicos para essa situação.
Responda só com JSON: {"reflections":["...14 itens na mesma ordem..."],"alma":{"p1":"...","p2":"...","step":"..."},"plan":["...","..."]}`, 4000);
      return json(out);
    }
    return json({ error: 'mode' }, 400);
  } catch (e) {
    const msg = String((e && e.message) || e);
    return json({ error: msg === 'no-key' ? 'no-key' : 'fail', detail: msg.slice(0, 200) }, msg === 'no-key' ? 503 : 500);
  }
}
