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
  name: 'resposta', description: 'Resposta da Alma em seções curtas e o plano de ação',
  input_schema: { type: 'object', required: ['tensao', 'leitura', 'tradicoes', 'ponto_cego', 'mudaria', 'pergunta', 'step', 'plan'], properties: {
    tensao: { type: 'string', description: 'O que está em jogo de verdade, usando as palavras dela. 1 ou 2 frases curtas.' },
    leitura: { type: 'string', description: 'Sua recomendação firme e o porquê. 2 ou 3 frases curtas, sem citar tradições aqui.' },
    tradicoes: { type: 'array', minItems: 2, maxItems: 3, description: 'As tradições que mais iluminam o caso', items: { type: 'object', required: ['nome', 'ideia'], properties: { nome: { type: 'string', description: 'Nome exato de uma das 14 tradições' }, ideia: { type: 'string', description: 'Uma frase: o que essa tradição diz sobre ESSA situação, aplicado ao caso.' } } } },
    ponto_cego: { type: 'string', description: 'O ponto cego dela, com gentileza e honestidade. 1 frase.' },
    mudaria: { type: 'string', description: 'Em que condição você mudaria a recomendação. 1 frase curta, começando com "Se".' },
    pergunta: { type: 'string', description: 'Uma pergunta que incomoda, para ela levar. 1 frase.' },
    ceu: { type: 'string', description: 'Opcional. Meia frase ligando o céu do dia (informado no contexto) ao passo das próximas 24 horas, como convite simbólico e nunca como previsão. Deixe vazio se não ajudar.' },
    step: { type: 'string', description: 'Uma ação concreta para as próximas 24 horas' },
    plan: { type: 'array', minItems: 4, maxItems: 5, items: { type: 'string' }, description: 'Passos curtos: verbo + algo específico + resultado. O primeiro cabe em 24h; o último é um ponto de decisão.' }
  } }
};
const V_TOOL = {
  name: 'vozes', description: 'Reflexões das tradições',
  input_schema: { type: 'object', required: ['reflections'], properties: { reflections: { type: 'array', items: { type: 'string' } } } }
};

const D_TOOL = {
  name: 'leitura_sonho', description: 'Leitura profissional e profunda de um sonho, em blocos curtos',
  input_schema: { type: 'object', required: ['essencia', 'simbolos', 'psi', 'esp', 'pergunta'], properties: {
    essencia: { type: 'string', description: 'Uma frase que nomeia o tema central do sonho, específica para ESTE sonho (ex.: "Um sonho sobre perder o controle do que você construiu"). Sem "pode significar".' },
    simbolos: { type: 'array', minItems: 2, maxItems: 4, description: 'As imagens mais carregadas do relato, na ordem de importância', items: { type: 'object', required: ['imagem', 'psi', 'esp'], properties: {
      imagem: { type: 'string', description: 'A imagem como aparece no sonho, 1 a 4 palavras' },
      psi: { type: 'string', description: 'Leitura psicanalítica dessa imagem NESTE sonho: o que ela condensa ou desloca, que parte da pessoa representa. 1 ou 2 frases.' },
      esp: { type: 'string', description: 'Sentido simbólico e espiritual dessa imagem, citando a tradição de onde vem quando fizer sentido. 1 ou 2 frases.' } } } },
    psi: { type: 'object', required: ['elabora', 'compensa', 'ponte'], properties: {
      elabora: { type: 'string', description: 'O desejo ou o conflito que o sonho está elaborando (Freud: realização de desejo, condensação, deslocamento). 2 frases.' },
      compensa: { type: 'string', description: 'Que atitude da vida desperta o sonho compensa ou equilibra (Jung: compensação, sombra, anima/animus, Self). 1 ou 2 frases.' },
      ponte: { type: 'string', description: 'A ponte concreta com a vida desperta: que situação atual provavelmente acionou esse sonho (restos diurnos), usando o que a pessoa contou. 1 ou 2 frases.' } } },
    esp: { type: 'object', required: ['mensagem', 'pratica'], properties: {
      mensagem: { type: 'string', description: 'A mensagem do sonho para a alma, com a tradição que sustenta essa leitura (bíblica, sufi, budista tibetana, indígena, espírita, etc.). 2 frases.' },
      pratica: { type: 'string', description: 'Uma prática concreta para hoje ou para antes de dormir, ligada ao sonho. 1 frase com verbo de ação.' } } },
    pergunta: { type: 'string', description: 'Uma pergunta afiada para a pessoa levar, ligada à imagem central. 1 frase.' }
  } }
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
      const sky = String(body.sky || '').slice(0, 160);
      const ctx = `A pessoa trouxe (${kind}): "${text}"\nAprofundamento:\n${qa || '(sem respostas)'}${sky ? `\nCéu do dia (tradição simbólica, use só no campo ceu): ${sky}` : ''}`;
      const voiceBatch = (list, offset) => claude(MODEL_C, `${ctx}

Escreva a reflexão de cada tradição abaixo sobre ESSA situação. Regras para cada reflexão:
- 2 a 3 frases, falando a partir do conceito próprio da tradição (indicado entre colchetes) e conectando o texto citado à situação concreta e às respostas.
- Termine com uma orientação direta, algo que a pessoa possa fazer ou decidir.
- Cada reflexão com um ângulo diferente das outras; não repita ideias, estruturas nem começos de frase.
${list.map((v, i) => `${i + 1}. ${v.name} [${LENS[v.name] || ''}] (${v.ref}): "${v.tr}"`).join('\n')}
Devolva exatamente ${list.length} reflexões, na mesma ordem.`, V_TOOL, 2500).then((o) => ({ offset, list: o.reflections || [] }));
      const half = Math.ceil(voices.length / 2);
      const [alma, v1, v2] = await Promise.all([
        claude(MODEL_C, `${ctx}\n\nAs 14 tradições do Conselho: ${voices.map((v) => v.name).join(', ')}.\nEscreva a resposta da Alma seguindo as regras de ouro: firme, profunda, direcional, usando os detalhes dela. Ela será lida no celular em seções curtas com subtítulos, então cada campo precisa ser enxuto e se sustentar sozinho, sem repetir o que outro campo já disse. Depois, o plano de ação específico para essa situação.`, A_TOOL, 1800),
        voiceBatch(voices.slice(0, half), 0),
        voiceBatch(voices.slice(half), half)
      ]);
      const reflections = new Array(voices.length).fill('');
      [v1, v2].forEach((b) => b.list.forEach((r, i) => { if (b.offset + i < reflections.length) reflections[b.offset + i] = String(r); }));
      const trad = (alma.tradicoes || []).slice(0, 3).map((t) => ({ nome: String(t.nome || ''), ideia: String(t.ideia || '') }));
      const sec = { tensao: alma.tensao, leitura: alma.leitura, tradicoes: trad, ponto_cego: alma.ponto_cego, mudaria: alma.mudaria, pergunta: alma.pergunta, ceu: alma.ceu ? String(alma.ceu).slice(0, 220) : undefined };
      const p2 = [alma.leitura, trad.map((t) => `${t.nome}: ${t.ideia}`).join(' '), alma.ponto_cego, alma.pergunta].filter(Boolean).join(' ');
      return json({ reflections, alma: { p1: alma.tensao, p2, step: alma.step, sec }, plan: alma.plan });
    }
    if (body.mode === 'dream') {
      const d = body.dream || {};
      const deep = d.deep || {};
      const facts = [
        d.title ? `Título: ${String(d.title).slice(0, 120)}` : '',
        d.wake ? `Ao acordar se sentiu: ${String(d.wake).slice(0, 40)}` : '',
        deep.emo ? `Emoção principal no sonho: ${deep.emo}` : '', deep.who ? `Quem estava: ${deep.who}` : '',
        deep.act ? `O que fazia: ${deep.act}` : '', deep.place ? `Lugar: ${deep.place}` : '',
        deep.extra ? `Detalhe a mais: ${String(deep.extra).slice(0, 200)}` : '',
        d.recent ? `Imagens que se repetem em outros sonhos: ${String(d.recent).slice(0, 200)}` : ''
      ].filter(Boolean).join('\n');
      const out = await claude(MODEL_Q, `Você agora lê sonhos como um analista experiente, com formação em psicanálise (Freud e Jung) e profundo conhecimento das tradições espirituais sobre sonhos.

Relato do sonho: "${text}"
${facts}

Como ler:
- Trabalhe com as imagens exatas do relato, nunca com um dicionário genérico de símbolos. Se a mesma imagem aparecesse em outro sonho, a leitura seria outra.
- Use os conceitos com precisão (condensação, deslocamento, restos diurnos, realização de desejo, compensação, sombra, anima ou animus, Self, amplificação), explicando em linguagem simples, sem jargão solto.
- Assuma uma hipótese interpretativa clara, como um bom analista faria, sem prometer certeza. Evite "pode significar muitas coisas".
- Ligue o sonho à vida desperta usando a emoção e os detalhes que a pessoa contou.
- Nada de previsão do futuro, presságio ou diagnóstico. Se o sonho trouxer sofrimento intenso ou repetido, sugira com delicadeza conversar com um terapeuta.
- Cada campo é lido no celular em blocos curtos: frases curtas, sem repetir o que outro campo já disse.`, D_TOOL, 1800);
      return json(out);
    }
    return json({ error: 'mode' }, 400);
  } catch (e) {
    const msg = String((e && e.message) || e);
    console.error('alma-ai error:', msg);
    return json({ error: msg === 'no-key' ? 'no-key' : 'fail', detail: msg.slice(0, 300) }, msg === 'no-key' ? 503 : 500);
  }
}
