// Alma AI (Vercel): leitura da pergunta, perguntas de aprofundamento que se adaptam a cada resposta
// e a resposta do Conselho, escritas por um modelo Claude no contexto exato do que a pessoa trouxe.
// A chave fica na variável ANTHROPIC_API_KEY do projeto na Vercel. Os modelos podem ser trocados por variável.
const MODEL_Q = process.env.ALMA_MODEL_QUESTIONS || 'claude-sonnet-5-5';
const MODEL_C = process.env.ALMA_MODEL_COUNCIL || 'claude-sonnet-5-5';
const MODEL_A = process.env.ALMA_MODEL_ANSWER || MODEL_C;
const MODEL_FALLBACK = 'claude-sonnet-5';
const hits = new Map();
function limited(ip) {
  const now = Date.now(), arr = (hits.get(ip) || []).filter((t) => now - t < 3600000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 90;
}

// Regras da Alma: entender primeiro; depois firme, profunda, concreta e direcional.
const RULES = `Você é a Alma, uma conselheira sábia que reúne religiões e filosofias para aconselhar, nunca para dividir.
Escreva em português do Brasil, de um jeito próximo e simples. Nunca use travessões: use vírgulas, dois-pontos ou pontos.

COMO LER
- Leve a sério o que está escrito. Leia gírias, abreviações e erros de digitação pelo sentido. Nunca troque o assunto concreto dela por um tema genérico.
- Separe a pergunta literal (o que está escrito) da pergunta por trás (o que ela precisa resolver) e do pedido (o que ela quer de você: decidir, entender, se acalmar, celebrar, agir ou desabafar).
- O que ela já contou é sabido. Nunca pergunte de novo, nunca finja que não leu.

REGRAS DE OURO
1. Tome posição. Diga com clareza o que você recomendaria e por quê, e em que condição mudaria de ideia. Nada de "só você pode decidir" sem antes dar a sua leitura.
2. Nomeie a tensão real. Em uma frase, diga o que está de fato em jogo por baixo da pergunta (o medo, o desejo, o valor em conflito).
3. Use os detalhes da pessoa. Cite as palavras e as respostas dela. Se o conselho servir para qualquer pessoa, reescreva.
4. Seja concreto. Toda sugestão tem verbo de ação, algo específico e, quando fizer sentido, um prazo ou número.
5. Aponte o ponto cego com gentileza e honestidade, mesmo que incomode.
6. Frases curtas. No máximo uma expressão de dúvida (talvez, pode ser) em toda a resposta.
7. Proibido usar clichês: "confie no processo", "siga seu coração", "tudo tem seu tempo", "cada caso é um caso", "o universo conspira", "não existe certo ou errado", "só você sabe", "respeite seu tempo", "ouça sua intuição".
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

async function callOnce(model, user, tool, maxTokens) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('no-key');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: maxTokens, system: RULES, tools: [tool], tool_choice: { type: 'tool', name: tool.name }, messages: [{ role: 'user', content: user }] })
  });
  if (!r.ok) { const t = (await r.text()).slice(0, 400); const err = new Error('api ' + r.status + ' ' + t); err.status = r.status; err.body = t; throw err; }
  const j = await r.json();
  const use = (j.content || []).find((c) => c.type === 'tool_use');
  if (!use) throw new Error('no-tool ' + JSON.stringify(j).slice(0, 300));
  return use.input;
}
// Se um modelo configurado não existir nesta conta, cai para o modelo que já funcionava.
async function claude(model, user, tool, maxTokens) {
  try { return await callOnce(model, user, tool, maxTokens); } catch (e) {
    if (model !== MODEL_FALLBACK && (e.status === 404 || (e.status === 400 && /model/i.test(e.body || '')))) {
      console.warn('alma-ai: modelo indisponível, usando fallback:', model);
      return callOnce(MODEL_FALLBACK, user, tool, maxTokens);
    }
    throw e;
  }
}

const PEDIDOS = ['decidir', 'entender', 'acalmar', 'celebrar', 'agir', 'desabafar'];
const LEITURA = {
  type: 'object', required: ['entendi', 'pedido', 'ja_disse', 'lacunas'], properties: {
    entendi: { type: 'string', description: 'Uma frase falando com ela ("Você quer saber se...", "Você está..."), específica, mas só com o que está escrito: nunca acrescente sentimentos, culpas ou desejos que ela não disse. Se a mensagem for curta ou ambígua, diga como hipótese ("Parece que é sobre..."). Até 28 palavras.' },
    pedido: { type: 'string', enum: PEDIDOS },
    ja_disse: { type: 'array', maxItems: 6, items: { type: 'string' }, description: 'Fatos concretos que já estão no texto: pessoas, tempos, valores, o que aconteceu, o que ela sente.' },
    lacunas: { type: 'array', minItems: 3, maxItems: 4, items: { type: 'string' }, description: 'O que você ainda NÃO sabe e mudaria o conselho, da mais para a menos importante.' }
  }
};
const QUESTION = {
  type: 'object', required: ['foco', 'q', 'tags'], properties: {
    foco: { type: 'string', description: 'Qual lacuna essa pergunta resolve' },
    q: { type: 'string', description: 'A pergunta, até 14 palavras, com as palavras dela' },
    tags: { type: 'array', minItems: 3, maxItems: 5, items: { type: 'string' }, description: 'Respostas como ela diria, 1 a 6 palavras cada' }
  }
};
const Q_TOOL = {
  name: 'perguntas', description: 'Leitura da pergunta e perguntas de aprofundamento',
  input_schema: { type: 'object', required: ['leitura', 'kind', 'topic', 'questions'], properties: {
    leitura: LEITURA,
    kind: { type: 'string', enum: ['Dúvida', 'Alegria', 'Medo', 'Aflição', 'Pensamento', 'Sugestão'] },
    topic: { type: 'string', description: 'O assunto concreto em 2 a 4 palavras' },
    questions: { type: 'array', minItems: 3, maxItems: 3, items: QUESTION }
  } }
};
const N_TOOL = {
  name: 'proxima', description: 'A próxima pergunta de aprofundamento, à luz das respostas',
  input_schema: { type: 'object', required: ['pronto'], properties: {
    pronto: { type: 'boolean', description: 'true se já há o bastante para um conselho firme e outra pergunta seria repetição' },
    foco: QUESTION.properties.foco,
    q: { type: 'string', description: 'A pergunta, até 14 palavras, com as palavras dela. Vazio se pronto for true.' },
    tags: { type: 'array', maxItems: 5, items: { type: 'string' }, description: '3 a 5 respostas como ela diria, 1 a 6 palavras cada. Vazio se pronto for true.' }
  } }
};
const A_TOOL = {
  name: 'resposta', description: 'Resposta da Alma em seções curtas e o plano de ação',
  input_schema: { type: 'object', required: ['analise', 'resposta', 'tensao', 'leitura', 'tradicoes', 'ponto_cego', 'mudaria', 'pergunta', 'step', 'plan'], properties: {
    analise: { type: 'string', description: 'Privado, ela não vê. 4 a 7 frases pensando como um conselheiro experiente: a pergunta por trás da pergunta, o que cada resposta revela, contradições entre o que ela diz querer e o que descreve, o que se repete das conversas anteriores, e o que alguém que a conhece e se importa diria.' },
    resposta: { type: 'string', description: 'A resposta direta à pergunta literal dela, na primeira frase. Se for decisão ("devo X?"), comece com sim, não, ainda não, ou depende de uma coisa só (e diga qual). Se não for decisão, entregue o que ela pediu. Nunca afirme o que não dá para saber (o que outra pessoa sentia, pensava ou quis dizer). 1 ou 2 frases.' },
    tensao: { type: 'string', description: 'O que está em jogo de verdade, usando as palavras dela. 1 ou 2 frases curtas.' },
    leitura: { type: 'string', description: 'Por que você responde assim, com pelo menos dois detalhes concretos do que ela contou. 2 ou 3 frases curtas, sem citar tradições aqui.' },
    tradicoes: { type: 'array', minItems: 2, maxItems: 3, description: 'As tradições que mais iluminam o caso', items: { type: 'object', required: ['nome', 'ideia'], properties: { nome: { type: 'string', description: 'Nome exato de uma das 14 tradições' }, ideia: { type: 'string', description: 'Uma frase: o que essa tradição diz sobre ESSA situação, aplicado ao caso.' } } } },
    ponto_cego: { type: 'string', description: 'O ponto cego dela, com gentileza e honestidade. 1 frase.' },
    mudaria: { type: 'string', description: 'Em que condição você mudaria a resposta. 1 frase curta, começando com "Se". Em luto ou celebração, diga quando revisitar ou buscar apoio, sem soar como condição de negócio.' },
    pergunta: { type: 'string', description: 'Uma pergunta que incomoda, para ela levar. 1 frase. Não comece com "Se" e nada parecido com as do aprofundamento. Proibido: "se uma amiga te contasse", "o que você diria se tivesse mais cinco minutos", "quem você seria se", "o que seu eu do futuro".' },
    ceu: { type: 'string', description: 'Opcional. Meia frase ligando o céu do dia (informado no contexto) ao passo das próximas 24 horas, como convite simbólico e nunca como previsão. Vazio se não ajudar.' },
    step: { type: 'string', description: 'Uma ação concreta para as próximas 24 horas, específica para o caso dela' },
    plan: { type: 'array', minItems: 4, maxItems: 5, items: { type: 'string' }, description: 'Passos curtos: verbo + algo específico + resultado. O primeiro cabe em 24h; o último é um ponto de decisão.' }
  } }
};
const V_TOOL = {
  name: 'vozes', description: 'Reflexões das tradições',
  input_schema: { type: 'object', required: ['reflections'], properties: { reflections: { type: 'array', items: { type: 'string' } } } }
};

// Contexto que vem do app, sempre limpo e curto.
const str = (x, n) => String(x == null ? '' : x).replace(/\s+/g, ' ').trim().slice(0, n);
function readLeitura(l) {
  if (!l || typeof l !== 'object') return null;
  const out = { entendi: str(l.entendi, 260), pedido: PEDIDOS.includes(l.pedido) ? l.pedido : '', ja_disse: (Array.isArray(l.ja_disse) ? l.ja_disse : []).slice(0, 6).map((x) => str(x, 140)).filter(Boolean), lacunas: (Array.isArray(l.lacunas) ? l.lacunas : []).slice(0, 4).map((x) => str(x, 140)).filter(Boolean) };
  return out.entendi ? out : null;
}
function historyText(h) {
  return (Array.isArray(h) ? h : []).slice(0, 4).map((e) => {
    const tags = (Array.isArray(e.tags) ? e.tags : []).slice(0, 3).map((t) => str(t, 60)).join(', ');
    return `- ${str(e.date, 12)} (${str(e.kind, 20)}, ${e.resolved ? 'resolvida' : 'em aberto'}): "${str(e.q, 220)}"${tags ? ` · escolhas: ${tags}` : ''}${e.step ? ` · passo sugerido na época: ${str(e.step, 160)}` : ''}`;
  }).join('\n');
}
const listText = (arr, n, len) => (Array.isArray(arr) ? arr : []).slice(0, n).map((x) => `- ${str(x, len)}`).filter((x) => x.length > 2).join('\n');

const FORMA = `Regras de forma de toda pergunta:
- Teste: se ela responder A ou B, o seu conselho muda? Se não muda, troque a pergunta.
- Nunca pergunte o que ela já contou, nem "como você se sente" quando o sentimento já está claro.
- Até 14 palavras, usando as palavras dela. Pergunta direta, sem rodeio nem elogio.
- Opções: 3 a 5, escritas como ela responderia (1 a 6 palavras), concretas para essa situação, bem diferentes entre si, incluindo a resposta desconfortável ou ambivalente quando ela existir. Proibido palavra abstrata solta ("Paz", "Crescer", "Equilíbrio") sem dizer de quê.
- Quando a resposta é um fato que você não tem como adivinhar (qual concurso, qual cidade, qual cargo), não chute exemplos específicos: use opções amplas ou peça o fato de outro jeito. Não repita o molde "Sim, X / Não, Y / Não sei" em todas.
- Uma pergunta por vez, nunca duas na mesma frase.`;

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
    const hist = historyText(body.history);
    const recentQs = listText(body.recentQs, 10, 160);

    if (body.mode === 'questions') {
      const out = await claude(MODEL_Q, `A pessoa escreveu: "${text}"
Tipo que ela marcou (pode estar errado, confie mais no texto): ${kind || 'não informado'}.
${hist ? `\nConversas anteriores dela na Alma (contexto; não volte ao que já foi tratado, mas perceba se é o mesmo assunto):\n${hist}\n` : ''}${recentQs ? `\nPerguntas que a Alma já fez a ela recentemente (não repita nem parafraseie):\n${recentQs}\n` : ''}
PASSO 1, LEITURA. Antes de perguntar qualquer coisa, entenda:
- entendi: o que ela está pedindo de verdade, numa frase falando com ela. Se o texto for ambíguo, a leitura mais provável.
- pedido: o que ela quer da Alma.
- ja_disse: os fatos concretos que já estão no texto. Nada disso pode virar pergunta.
- lacunas: o que ainda falta saber e mudaria o seu conselho, em ordem de importância.

PASSO 2, TRÊS PERGUNTAS para as lacunas que mais mudam o conselho. A primeira é a que mais importa; as outras são rascunho e vão mudar conforme ela responder. Se uma lacuna revela se é fuga de algo ou desejo de algo, ela vem antes.
- Se o texto for ambíguo, a primeira pergunta tira a ambiguidade.
- Não siga fórmula. Nunca use o trio pronto "o que te atrai / o que te impede / como se sentiria", nem o trio "fato / desejo / cenário" em ordem fixa.
- No máximo uma das três começa com "O que" (ou "Do que"), no máximo uma com "Se" e no máximo uma com "Você já". Cada pergunta precisa soar impossível de fazer a outra pessoa.
- Adapte ao pedido: celebrar pede saborear e dar sentido, nunca obstáculos; desabafar e acalmar pedem perguntas gentis e concretas sobre o que aconteceu e o que ajudaria; decidir pede critérios, custos reais e o que ela perderia; entender pede o padrão por trás.
- Em celebrar e desabafar, o teste da pergunta muda: a resposta deixa o conselho mais pessoal? Em luto, nunca pergunte se ela se culpa nem sugira culpa: pergunte sobre quem partiu e o que ficou por dizer, e deixe ela trazer a culpa se existir.
${FORMA}`, Q_TOOL, 1600);
      const leitura = readLeitura(out.leitura);
      return json({ kind: out.kind, topic: out.topic, leitura, questions: (out.questions || []).map((q) => ({ q: q.q, tags: q.tags, foco: q.foco })) });
    }

    if (body.mode === 'next') {
      const lt = readLeitura(body.leitura);
      const asked = (Array.isArray(body.asked) ? body.asked : []).slice(0, 3).map((x) => ({ q: str(x && x.q, 200), a: str(x && x.a, 200) })).filter((x) => x.q);
      if (!asked.length) return json({ error: 'empty' }, 400);
      const planned = (Array.isArray(body.planned) ? body.planned : []).slice(0, 2).map((p) => ({ q: str(p && p.q, 200), tags: (p && Array.isArray(p.tags) ? p.tags : []).slice(0, 5).map((t) => str(t, 60)) })).filter((p) => p.q);
      const answered = asked.filter((x) => x.a).length;
      const out = await claude(MODEL_Q, `A pessoa escreveu: "${text}"
${lt ? `Como a Alma entendeu: ${lt.entendi}${lt.pedido ? ` (pedido: ${lt.pedido})` : ''}
O que ela já tinha contado: ${lt.ja_disse.join('; ') || 'nada além do texto'}
Lacunas que a Alma queria resolver: ${lt.lacunas.join('; ')}
Antes de perguntar, separe o que as respostas já resolveram (nunca volte a isso) das lacunas ainda abertas, e escolha a que mais muda o conselho agora.` : ''}

Perguntas já feitas e respostas dela:
${asked.map((x, i) => `${i + 1}. ${x.q} → ${x.a || '(pulou)'}`).join('\n')}

Pergunta que estava planejada para agora:
${planned.length ? planned.map((p) => `- ${p.q} [${p.tags.join(' | ')}]`).join('\n') : '- nenhuma'}
${recentQs ? `\nPerguntas de outras conversas (não repita):\n${recentQs}\n` : ''}
Decida a próxima pergunta à luz da última resposta:
- Se a última resposta abriu algo importante (uma pessoa, um medo novo, uma contradição, um "não sei"), aprofunde ali, retomando as palavras dela.
- Se ela já respondeu sem querer o que a pergunta planejada queria saber, troque por outra lacuna.
- Se a planejada continua a melhor, devolva-a, ajustando as opções ao que ela acabou de dizer.
- Nunca repita nem parafraseie uma pergunta já feita.
- pronto: ${answered >= 2 ? 'true se já dá para um conselho firme e mais uma pergunta seria repetição; false se ainda falta algo que muda o conselho.' : 'sempre false nesta etapa.'}
${FORMA}`, N_TOOL, 700);
      const pronto = answered >= 2 && !!out.pronto;
      return json({ pronto, q: pronto ? '' : str(out.q, 200), tags: pronto ? [] : (Array.isArray(out.tags) ? out.tags : []).slice(0, 5).map((t) => str(t, 60)), foco: str(out.foco, 140) });
    }

    if (body.mode === 'council') {
      const answers = (body.answers || []).slice(0, 3).map((a) => (a ? String(a).slice(0, 200) : ''));
      const qs = (body.questions || []).slice(0, 3).map((q) => String(q).slice(0, 200));
      const voices = (body.voices || []).slice(0, 14).map((v) => ({ name: String(v.name), ref: String(v.ref).slice(0, 80), tr: String(v.tr).slice(0, 300) }));
      const lt = readLeitura(body.leitura);
      const qa = qs.map((q, i) => `${q} → ${answers[i] || '(pulou)'}`).join('\n');
      const sky = str(body.sky, 160);
      const ctx = `A pessoa trouxe (${kind}): "${text}"
${lt ? `Como a Alma entendeu: ${lt.entendi}${lt.pedido ? ` (pedido: ${lt.pedido})` : ''}
O que ela já tinha contado: ${lt.ja_disse.join('; ') || 'só o texto'}\n` : ''}Aprofundamento (pergunta → resposta dela):
${qa || '(sem respostas)'}${hist ? `\nConversas anteriores dela na Alma (perceba padrões; cite só se ajudar):\n${hist}` : ''}${sky ? `\nCéu do dia (tradição simbólica, use só no campo ceu): ${sky}` : ''}`;
      const ferida = /morr|faleci|falec|luto|velório|velorio|enterro|perdi (meu|minha)|bloque|me culp|me trai|traiç|traic|abuso|agred|humilh|desprez|demiti|demissão|diagnóst|diagnost|câncer|cancer|depress|ansiedade|pânico|panico/i.test(text + ' ' + answers.join(' '));
      const TOM = lt && lt.pedido === 'celebrar' ? 'Ela quer celebrar: comemore com ela, dê sentido à conquista e ajude a fazer durar. O ponto cego aqui é leve e cuidadoso.'
        : (lt && (lt.pedido === 'desabafar' || lt.pedido === 'acalmar')) || ferida ? 'Ela está ferida ou cansada: a resposta começa reconhecendo o que ela vive, com as palavras dela, antes de qualquer direção. Firme quando precisar, mas com calor.'
        : 'Ela precisa de clareza: seja direta e prática.';
      const voiceBatch = (list, offset) => claude(MODEL_C, `${ctx}

Tom: ${TOM}

Escreva a reflexão de cada tradição abaixo sobre ESSA situação. Regras para cada reflexão:
- Em celebração ou luto, conceitos duros (impermanência, preparação para o pior, karma, provas) entram só como consolo ou sentido, nunca como alerta.
- Não repita prazos, contas nem o plano de ação: traga o que só essa tradição enxerga.
- 2 a 3 frases, falando a partir do conceito próprio da tradição (indicado entre colchetes) e conectando o texto citado à situação concreta.
- Cite pelo menos um detalhe concreto do que ela contou ou respondeu. Se a reflexão servir para outra pessoa, reescreva.
- Termine com uma orientação direta, algo que ela possa fazer ou decidir.
- Cada reflexão com um ângulo diferente das outras; não repita ideias, estruturas nem começos de frase.
${list.map((v, i) => `${i + 1}. ${v.name} [${LENS[v.name] || ''}] (${v.ref}): "${v.tr}"`).join('\n')}
Devolva exatamente ${list.length} reflexões, na mesma ordem.`, V_TOOL, 2600).then((o) => ({ offset, list: o.reflections || [] }));
      const half = Math.ceil(voices.length / 2);
      const [alma, v1, v2] = await Promise.all([
        claude(MODEL_A, `${ctx}

As 14 tradições do Conselho: ${voices.map((v) => v.name).join(', ')}.
Escreva a resposta da Alma. ${TOM}
Primeiro pense no campo analise. Depois:
- resposta responde a pergunta literal dela já na primeira frase.
- Use pelo menos dois detalhes concretos das respostas dela, com as palavras dela.
- Se um assunto se repete das conversas anteriores, nomeie com cuidado.
- A pergunta para levar precisa ser nova: nada parecido com as perguntas do aprofundamento.
Ela lê no celular, em seções curtas: cada campo enxuto, se sustentando sozinho, sem repetir outro campo. Depois, o plano de ação específico para essa situação.`, A_TOOL, 3000),
        voiceBatch(voices.slice(0, half), 0),
        voiceBatch(voices.slice(half), half)
      ]);
      const reflections = new Array(voices.length).fill('');
      [v1, v2].forEach((b) => b.list.forEach((r, i) => { if (b.offset + i < reflections.length) reflections[b.offset + i] = String(r); }));
      const trad = (alma.tradicoes || []).slice(0, 3).map((t) => ({ nome: String(t.nome || ''), ideia: String(t.ideia || '') }));
      const sec = { entendi: lt ? lt.entendi : undefined, resposta: alma.resposta, tensao: alma.tensao, leitura: alma.leitura, tradicoes: trad, ponto_cego: alma.ponto_cego, mudaria: alma.mudaria, pergunta: alma.pergunta, ceu: alma.ceu ? String(alma.ceu).slice(0, 220) : undefined };
      const p2 = [alma.leitura, trad.map((t) => `${t.nome}: ${t.ideia}`).join(' '), alma.ponto_cego, alma.pergunta].filter(Boolean).join(' ');
      return json({ reflections, alma: { p1: [alma.resposta, alma.tensao].filter(Boolean).join(' '), p2, step: alma.step, sec }, plan: alma.plan });
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
