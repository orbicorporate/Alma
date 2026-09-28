// Alma AI (Vercel): perguntas de aprofundamento e respostas do Conselho escritas por um modelo Claude,
// no contexto exato do que a pessoa trouxe. A chave fica na variável ANTHROPIC_API_KEY do projeto na Vercel.
const MODEL_Q = process.env.ALMA_MODEL_QUESTIONS || 'claude-sonnet-5';
const MODEL_C = process.env.ALMA_MODEL_COUNCIL || 'claude-sonnet-5';
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 60;
}

// Regras da Alma: firme, profunda, concreta e direcional.
const RULES = `Você é a Alma, uma conselheira sábia que reúne religiões e filosofias para aconselhar, nunca para dividir.
Escreva em português do Brasil. Nunca use travessões: use vírgulas, dois-pontos ou pontos.

REGRAS DE OURO
1. Tome posição. Diga com clareza o que você recomendaria e por quê, e em que condição mudaria de ideia. Nada de "só você pode decidir" sem antes dar a sua leitura.
2. Nomeie a tensão real. Em uma frase, diga o que está de fato em jogo por baixo da pergunta (o medo, o desejo, o valor em conflito).
3. Use os detalhes da pessoa. Cite as palavras e as respostas dela. Se o conselho servir para qualquer pessoa, reescreva.
4. Seja concreto. Toda sugestão tem verbo de ação, algo específico e, quando fizer sentido, um prazo ou número.
5. Aponte o ponto cego com gentileza e honestidade, mesmo que incomode.
6. Frases curtas. No máximo uma expressão de dúvida (talvez, pode ser) em toda a resposta.
7. Proibido usar clichês: "confie no processo", "siga seu coração", "tudo tem seu tempo", "cada caso é um caso", "o universo conspira", "não existe certo ou errado", "só você sabe", "respeite seu tempo".
8. Nunca invente citações: use apenas os textos fornecidos.
9. Não dê diagnóstico médico, jurídico ou financeiro definitivo; indique quando procurar um profissional. Se houver sinal de risco à vida, recomende com delicadeza o CVV (188).`;

// O que cada tradição tem de único: cada voz precisa falar a partir disso.
const LENS = {
  'Cristianismo': 'amor ao próximo, graça, entrega e discernimento pela oração',
  'Judaísmo': 'responsabilidade, teshuvá (retorno), debate honesto e o valor da vida concreta',
  'Hinduísmo': 'dharma (o dever próprio), karma e ação sem apego aos frutos',
  'Budismo': 'apego, impermanência, caminho do meio e experiência direta',
  'Islamismo': 'shura (consulta), istikhara (pedir orientação), tawakkul (confiar depois de agir) e gratidão',
  'Taoísmo': 'wu wei (agir sem forçar), fluidez, simplicidade e o poder do pequeno passo',
  'Espiritismo': 'evolução do espírito, livre-arbítrio, caridade e aprendizado nas provas',
  'Confucionismo': 'dever nos vínculos, honestidade sobre o que se sabe, aprendizado e virtude no cotidiano',
  'Estoicismo': 'dicotomia do controle, virtude, razão sobre a emoção e preparação para o pior',
  'Existencialismo': 'liberdade radical, responsabilidade, angústia como sinal de escolha e autenticidade',
  'Filosofia africana': 'Ubuntu, comunidade, ancestralidade e a sabedoria dos provérbios',
  'Sufismo': 'amor, saudade da origem, escuta do coração e entrega mística',
  'Sikhismo': 'hukam (a ordem divina), serviço (seva), coragem sem medo e igualdade',
  'Filosofia grega': 'autoconhecimento, virtude como hábito, mudança constante e razão'
};

async function claude(model, user, tool, maxTokens) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('no-key');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, system: RULES, tools: [tool], tool_choice: { type: 'tool', name: tool.name }, messages: [{ role: 'user', content: user }] })
  });
  if (!r.ok) throw new Error('api ' + r.status + ' ' + (await r.text()).slice(0, 400));
  const j = await r.json();
  const use = (j.content || []).find((c) => c.type === 'tool_use');
  if (!use) throw new Error('no-tool ' + JSON.stringify(j).slice(0, 300));
  return use.input;
}

const Q_TOOL = {
  name: 'perguntas', description: 'Perguntas de aprofundamento para a pessoa',
  input_schema: { type: 'object', required: ['kind', 'topic', 'questions'], properties: {
    kind: { type: 'string', enum: ['Dúvida', 'Alegria', 'Medo', 'Aflição', 'Pensamento', 'Sugestão'] },
    topic: { type: 'string' },
    questions: { type: 'array', minItems: 3, maxItems: 3, items: { type: 'object', required: ['q', 'tags'], properties: { q: { type: 'string' }, tags: { type: 'array', minItems: 5, maxItems: 5, items: { type: 'string' } } } } }
  } }
};
const A_TOOL = {
  name: 'resposta', description: 'Resposta da Alma e plano de ação',
  input_schema: { type: 'object', required: ['p1', 'p2', 'step', 'plan'], properties: {
    p1: { type: 'string', description: 'Tensão real + mostrar que entendeu, 2 frases' },
    p2: { type: 'string', description: 'Sua leitura firme: o que recomenda e por quê, citando 2 ou 3 tradições pelo nome, o ponto cego e em que condição mudaria de ideia. Termine com uma pergunta que incomoda. 4 a 6 frases.' },
    step: { type: 'string', description: 'Uma ação concreta para as próximas 24 horas' },
    plan: { type: 'array', minItems: 4, maxItems: 5, items: { type: 'string' }, description: 'Passos curtos: verbo + algo específico + resultado. O primeiro cabe em 24h; o último é um ponto de decisão.' }
  } }
};
const V_TOOL = {
  name: 'vozes', description: 'Reflexões das tradições',
  input_schema: { type: 'object', required: ['reflections'], properties: { reflections: { type: 'array', items: { type: 'string' } } } }
};

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
      const out = await claude(MODEL_Q, `A pessoa escreveu: "${text}"
Tipo escolhido (pode estar errado, confie mais no texto): ${kind || 'não informado'}.
Identifique o sentimento real e o assunto concreto. Crie 3 perguntas curtas e afiadas, específicas para ESSA situação, usando as palavras dela, que revelem o que a Alma precisa saber para dar um conselho firme: o que ela quer de verdade, o que a impede, e o que está em jogo.
Cada pergunta tem 5 opções curtas (1 a 4 palavras), concretas, mutuamente diferentes e realistas para essa pessoa.`, Q_TOOL, 1000);
      return json(out);
    }

    if (body.mode === 'council') {
      const answers = (body.answers || []).slice(0, 3).map((a) => (a ? String(a).slice(0, 200) : ''));
      const qs = (body.questions || []).slice(0, 3).map((q) => String(q).slice(0, 200));
      const voices = (body.voices || []).slice(0, 14).map((v) => ({ name: String(v.name), ref: String(v.ref).slice(0, 80), tr: String(v.tr).slice(0, 300) }));
      const qa = qs.map((q, i) => `${q} → ${answers[i] || '(pulou)'}`).join('\n');
      const ctx = `A pessoa trouxe (${kind}): "${text}"\nAprofundamento:\n${qa || '(sem respostas)'}`;
      const voiceBatch = (list, offset) => claude(MODEL_C, `${ctx}

Escreva a reflexão de cada tradição abaixo sobre ESSA situação. Regras para cada reflexão:
- 2 a 3 frases, falando a partir do conceito próprio da tradição (indicado entre colchetes) e conectando o texto citado à situação concreta e às respostas.
- Termine com uma orientação direta, algo que a pessoa possa fazer ou decidir.
- Cada reflexão com um ângulo diferente das outras; não repita ideias, estruturas nem começos de frase.
${list.map((v, i) => `${i + 1}. ${v.name} [${LENS[v.name] || ''}] (${v.ref}): "${v.tr}"`).join('\n')}
Devolva exatamente ${list.length} reflexões, na mesma ordem.`, V_TOOL, 2500).then((o) => ({ offset, list: o.reflections || [] }));
      const half = Math.ceil(voices.length / 2);
      const [alma, v1, v2] = await Promise.all([
        claude(MODEL_C, `${ctx}\n\nAs 14 tradições do Conselho: ${voices.map((v) => v.name).join(', ')}.\nEscreva a resposta da Alma seguindo as regras de ouro: firme, profunda, direcional, usando os detalhes dela. Depois, o plano de ação específico para essa situação.`, A_TOOL, 1800),
        voiceBatch(voices.slice(0, half), 0),
        voiceBatch(voices.slice(half), half)
      ]);
      const reflections = new Array(voices.length).fill('');
      [v1, v2].forEach((b) => b.list.forEach((r, i) => { if (b.offset + i < reflections.length) reflections[b.offset + i] = String(r); }));
      return json({ reflections, alma: { p1: alma.p1, p2: alma.p2, step: alma.step }, plan: alma.plan });
    }
    return json({ error: 'mode' }, 400);
  } catch (e) {
    const msg = String((e && e.message) || e);
    console.error('alma-ai error:', msg);
    return json({ error: msg === 'no-key' ? 'no-key' : 'fail', detail: msg.slice(0, 300) }, msg === 'no-key' ? 503 : 500);
  }
}
