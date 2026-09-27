// Perguntas de aprofundamento no contexto do que a pessoa escreveu.
// Detecta o assunto (violão, trabalho, relação...) e a ação (continuar, parar, começar...)
// e monta as perguntas e as tags com essas palavras. Sem assunto reconhecido, usa as perguntas do tipo.

const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const TOPICS = [
  { k: 'musica', re: /\b(violao|guitarra|piano|teclado|bateria|baixo|ukulele|flauta|violino|canto|cantar|musica|instrumento|banda)\b/,
    obj: { violao: 'o violão', guitarra: 'a guitarra', piano: 'o piano', teclado: 'o teclado', bateria: 'a bateria', baixo: 'o baixo', ukulele: 'o ukulele', flauta: 'a flauta', violino: 'o violino', canto: 'o canto', cantar: 'cantar', banda: 'a banda', _: 'a música' },
    pull: ['Prazer de tocar', 'Relaxar', 'Me expressar', 'Ver minha evolução', 'Um sonho antigo'],
    hold: ['Falta de tempo', 'Custo das aulas', 'Não vejo evolução', 'Cansaço', 'Perdi o ânimo'],
    fear: ['Não ter talento', 'Desperdiçar dinheiro', 'Desistir de novo', 'Ser julgado'] },
  { k: 'estudo', re: /\b(curso|faculdade|estudar|estudo|estudos|aula|aulas|ingles|espanhol|idioma|prova|concurso|mestrado|doutorado|vestibular|enem|escola|pos)\b/,
    obj: { faculdade: 'a faculdade', curso: 'o curso', concurso: 'o concurso', mestrado: 'o mestrado', doutorado: 'o doutorado', ingles: 'o inglês', espanhol: 'o espanhol', idioma: 'o idioma', prova: 'a prova', vestibular: 'o vestibular', enem: 'o Enem', _: 'os estudos' },
    pull: ['Crescer na carreira', 'Aprender', 'Realizar um sonho', 'Me sentir capaz', 'Abrir portas'],
    hold: ['Falta de tempo', 'Dinheiro', 'Cansaço', 'Medo de não dar conta', 'Outras prioridades'],
    fear: ['Não passar', 'Não dar conta', 'Escolher errado', 'Perder tempo'] },
  { k: 'trabalho', re: /\b(trabalho|emprego|proposta|chefe|empresa|carreira|demissao|demitir|promocao|negocio|cliente|clientes|vaga|entrevista|salario|cargo|empreender)\b/,
    obj: { proposta: 'a proposta', negocio: 'o negócio', empresa: 'a empresa', vaga: 'a vaga', promocao: 'a promoção', carreira: 'a carreira', empreender: 'empreender', entrevista: 'a entrevista', _: 'o trabalho' },
    pull: ['Crescimento', 'Dinheiro', 'Propósito', 'Reconhecimento', 'Liberdade'],
    hold: ['Estabilidade', 'Dinheiro', 'As pessoas de lá', 'Medo de errar', 'Não sei o próximo passo'],
    fear: ['Perder o emprego', 'Fracassar', 'Não ser suficiente', 'Ficar sem renda'] },
  { k: 'amor', re: /\b(namor\w*|relacionamento|casamento|casar|marido|esposa|noivo|noiva|ex|crush|paixao|terminar|separar|separacao|divorcio)\b/,
    obj: { casamento: 'o casamento', casar: 'casar', _: 'essa relação' },
    pull: ['Carinho', 'Parceria', 'Admiração', 'Companhia', 'Futuro juntos'],
    hold: ['Brigas', 'Falta de reciprocidade', 'Medo de ficar só', 'O costume', 'Diferenças'],
    fear: ['Ser abandonado', 'Me machucar', 'Ficar só', 'Repetir erros'] },
  { k: 'familia', re: /\b(mae|pai|filho|filha|filhos|irma|irmao|familia|avo|sogra|sogro)\b/,
    obj: { mae: 'sua mãe', pai: 'seu pai', filho: 'seu filho', filha: 'sua filha', filhos: 'seus filhos', irma: 'sua irmã', irmao: 'seu irmão', _: 'sua família' },
    pull: ['Amor', 'Proximidade', 'Cuidado', 'Paz em casa', 'Orgulho'],
    hold: ['Conflitos', 'Culpa', 'Distância', 'Cobranças', 'Mágoas antigas'],
    fear: ['Perder alguém', 'Decepcionar', 'Brigar', 'Não estar presente'] },
  { k: 'viagem', re: /\b(ferias|viagem|viajar|viajo|passeio|turismo|eua|estados unidos|europa|disney|orlando|miami|nova york|paris|londres|portugal|lisboa|italia|espanha|japao|chile|argentina|mexico|cancun|nordeste|praia|mochilao|cruzeiro|passagem|passagens)\b/,
    obj: { _: 'a viagem' },
    pull: ['Descansar', 'Conhecer lugares novos', 'Viver experiências', 'Estar com quem amo', 'Realizar um sonho'],
    hold: ['Dinheiro', 'Trabalho', 'Tempo de férias', 'Documentos e visto', 'Medo de gastar demais'],
    fear: ['Gastar demais', 'Algo dar errado', 'Me arrepender', 'Ir sozinho'] },
  { k: 'casa', re: /\b(reforma|reformar|apartamento novo|casa nova|alugar|aluguel|comprar uma casa|comprar um apartamento|decorar)\b/,
    obj: { reforma: 'a reforma', reformar: 'a reforma', aluguel: 'o aluguel', alugar: 'alugar', _: 'a casa' },
    pull: ['Conforto', 'Ter meu canto', 'Segurança', 'Espaço para a família', 'Um sonho antigo'],
    hold: ['Dinheiro', 'Parcelas longas', 'Localização', 'Tempo e obra', 'Medo de errar'],
    fear: ['Me endividar', 'Escolher errado', 'Dar dor de cabeça', 'Me arrepender'] },
  { k: 'pet', re: /\b(cachorro|cachorrinho|gato|gatinho|pet|adotar)\b/,
    obj: { _: 'a adoção' },
    pull: ['Companhia', 'Amor', 'Alegria em casa', 'Cuidar de alguém', 'Rotina mais leve'],
    hold: ['Tempo', 'Espaço', 'Custos', 'Viagens', 'Responsabilidade'],
    fear: ['Não dar conta', 'Ele ficar sozinho', 'Custos altos', 'Me apegar'] },
  { k: 'mudanca', re: /\b(mudar de cidade|mudar de pais|me mudar|mudanca|morar|intercambio|exterior)\b/,
    obj: { intercambio: 'o intercâmbio', viagem: 'a viagem', viajar: 'viajar', _: 'a mudança' },
    pull: ['Recomeço', 'Liberdade', 'Qualidade de vida', 'Novas oportunidades', 'Conhecer o mundo'],
    hold: ['Pessoas que amo', 'Trabalho', 'Dinheiro', 'Medo do novo', 'Minhas raízes'],
    fear: ['Solidão', 'Não me adaptar', 'Me arrepender', 'Faltar dinheiro'] },
  { k: 'saude', re: /\b(saude|academia|treino|treinar|dieta|emagrecer|corrida|correr|doenca|dormir|sono|ansiedade|terapia|fumar|beber|yoga|meditar)\b/,
    obj: { academia: 'a academia', treino: 'o treino', treinar: 'treinar', dieta: 'a dieta', corrida: 'a corrida', correr: 'correr', terapia: 'a terapia', yoga: 'o yoga', meditar: 'meditar', _: 'sua saúde' },
    pull: ['Disposição', 'Autoestima', 'Leveza', 'Cuidar de mim', 'Viver mais'],
    hold: ['Falta de tempo', 'Preguiça', 'Rotina corrida', 'Falta de resultado', 'Cansaço'],
    fear: ['Adoecer', 'Não conseguir manter', 'Voltar atrás', 'Sentir dor'] },
  { k: 'dinheiro', re: /\b(dinheiro|divida|dividas|investir|investimento|comprar|compra|carro|apartamento|casa propria|financiamento|emprestimo|guardar dinheiro)\b/,
    obj: { carro: 'o carro', apartamento: 'o apartamento', investir: 'investir', investimento: 'o investimento', financiamento: 'o financiamento', emprestimo: 'o empréstimo', compra: 'a compra', comprar: 'essa compra', _: 'essa decisão financeira' },
    pull: ['Segurança', 'Conforto', 'Realizar um sonho', 'Liberdade', 'Pensar no futuro'],
    hold: ['Dívidas', 'Incerteza', 'Outras prioridades', 'Medo de perder', 'Parcelas longas'],
    fear: ['Perder dinheiro', 'Me endividar', 'Faltar no fim do mês', 'Me arrepender'] },
  { k: 'hobby', re: /\b(pintura|pintar|desenho|desenhar|danca|dancar|futebol|natacao|nadar|escrever|livro|fotografia|teatro|cozinhar|surf|luta|jiu)\b/,
    obj: { pintura: 'a pintura', pintar: 'pintar', desenho: 'o desenho', desenhar: 'desenhar', danca: 'a dança', dancar: 'dançar', futebol: 'o futebol', natacao: 'a natação', nadar: 'nadar', escrever: 'escrever', livro: 'o livro', fotografia: 'a fotografia', teatro: 'o teatro', cozinhar: 'cozinhar', surf: 'o surf', luta: 'a luta', jiu: 'o jiu-jítsu', _: 'esse hobby' },
    pull: ['Prazer', 'Me expressar', 'Relaxar', 'Evoluir', 'Encontrar pessoas'],
    hold: ['Falta de tempo', 'Custo', 'Não vejo evolução', 'Cansaço', 'Perdi o ânimo'],
    fear: ['Não ser bom nisso', 'Perder tempo', 'Desistir de novo', 'Ser julgado'] },
  { k: 'amizade', re: /\b(amigo|amiga|amigos|amizade)\b/, obj: { _: 'essa amizade' },
    pull: ['Confiança', 'Histórias juntos', 'Alegria', 'Apoio', 'Afinidade'],
    hold: ['Mágoa', 'Distância', 'Falta de reciprocidade', 'Mudamos muito', 'Orgulho'],
    fear: ['Perder a amizade', 'Ser rejeitado', 'Magoar', 'Ficar sozinho'] },
  { k: 'fe', re: /\b(deus|fe|religiao|igreja|espiritual|espiritualidade|orar|oracao|templo|centro)\b/, obj: { _: 'sua fé' },
    pull: ['Sentido', 'Paz', 'Comunidade', 'Esperança', 'Gratidão'],
    hold: ['Dúvidas', 'Decepção', 'Falta de tempo', 'Julgamentos', 'Silêncio de Deus'],
    fear: ['Perder a fé', 'Estar errado', 'Ser julgado', 'Ficar sem chão'] }
];

// Ação principal no texto: muda a pergunta sobre o que segura a pessoa.
const ACTIONS = [
  { re: /\b(continuar|manter|seguir|permanecer|ficar)\b/, verb: 'continuar', hold: 'E o que te faz pensar em parar?' },
  { re: /\b(parar|largar|sair|desistir|terminar|abandonar|trancar|pedir demissao)\b/, verb: 'parar', hold: 'E o que ainda te prende?' },
  { re: /\b(voltar|retomar)\b/, verb: 'voltar', hold: 'E o que te fez parar da outra vez?' },
  { re: /\b(comecar|iniciar|entrar|aceitar|tentar|fazer|abrir)\b/, verb: 'começar', hold: 'E o que te segura?' },
  { re: /\b(mudar|trocar)\b/, verb: 'mudar', hold: 'E o que te prende onde você está?' }
];

function detect(text) {
  const t = norm(text);
  // "aula de violão", "curso de inglês": usa as palavras da própria pessoa
  const raw = (text || '').match(/\b(aulas? de [\wÀ-ú]+|curso de [\wÀ-ú]+|faculdade de [\wÀ-ú]+)/i);
  let hits = [];
  TOPICS.forEach((tp) => { const m = t.match(tp.re); if (m) hits.push({ tp, i: m.index, w: m[1] }); });
  // "aula de violão" é sobre música, não sobre estudos
  if (hits.length > 1 && hits.some((h) => ['musica', 'hobby', 'saude'].includes(h.tp.k))) hits = hits.filter((h) => h.tp.k !== 'estudo');
  const best = hits.sort((a, b) => a.i - b.i)[0];
  if (!best) return null;
  let obj = best.tp.obj[best.w] || best.tp.obj._;
  if (raw) obj = (/^aulas/i.test(raw[1]) ? 'as ' : 'a ') + raw[1].toLowerCase();
  if (raw && /^curso/i.test(raw[1])) obj = 'o ' + raw[1].toLowerCase();
  if (best.tp.k === 'viagem' || best.tp.k === 'mudanca') {
    const dest = (text || '').match(/\b(?:para|pra|pro) (os |as |o |a )?(eua|estados unidos|[A-ZÀ-Ú][\wÀ-ú]+(?: [A-ZÀ-Ú][\wÀ-ú]+)?)/i);
    if (dest) { const d = /^eua$/i.test(dest[2]) ? 'EUA' : dest[2].replace(/^\w/, (c) => c.toUpperCase()); obj = `${best.tp.k === 'viagem' ? 'a viagem' : 'a mudança'} para ${dest[1] || ''}${d}`; }
  }
  const act = ACTIONS.find((a) => a.re.test(t)) || null;
  return { topic: best.tp, obj, act };
}

const withObj = (obj) => obj;
// "em + o violão" -> "no violão"
const em = (obj) => obj.replace(/^o /, 'no ').replace(/^a /, 'na ').replace(/^os /, 'nos ').replace(/^as /, 'nas ').replace(/^(sua|suas) /, (m) => 'na ' + m).replace(/^(seu|seus) /, (m) => 'no ' + m).replace(/^essa /, 'nessa ').replace(/^esse /, 'nesse ').replace(/^(?!n[oa]s? |nessa |nesse )/, 'em ');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function contextQS(text, kind, base) {
  if (kind === 'Alegria' || kind === 'Aflição' || kind === 'Medo') {
    const dj = detect(text);
    if (!dj) return base[kind];
  }
  const d = detect(text);
  const def = base[kind] || base['Dúvida'];
  if (!d) return def;
  const { topic: tp, obj, act } = d;
  const o = withObj(obj);
  const where = tp.k === 'familia' || tp.k === 'amizade' ? `na relação com ${o}` : em(o);
  const verbQ = act && act.verb === 'continuar' ? `O que mais te faz querer continuar com ${o}?`
    : act && act.verb === 'parar' ? `O que ${o} ainda te traz de bom?`
    : act && act.verb === 'voltar' ? `O que te chama de volta para ${o}?`
    : `O que mais te atrai ${where}?`;
  switch (kind) {
    case 'Aflição':
      return [{ q: `O que mais pesa ${where}?`, tags: tp.hold }, def[1], def[2]];
    case 'Medo':
      return [{ q: `Seu medo com ${o} é mais de…`, tags: tp.fear }, def[1], def[2]];
    case 'Alegria':
      return [{ q: `O que ${o} trouxe de melhor?`, tags: tp.pull }, def[1], def[2]];
    case 'Pensamento':
      return [def[0], { q: `O que ${o} representa para você hoje?`, tags: tp.pull }, def[2]];
    case 'Sugestão':
      return [{ q: `Sobre ${o}, você busca uma sugestão para…`, tags: ['Começar', 'Manter a constância', 'Decidir', 'Evoluir'] }, def[1], def[2]];
    default:
      return [
        { q: verbQ, tags: tp.pull },
        { q: act ? act.hold : 'E o que te segura?', tags: tp.hold },
        { q: act && act.verb === 'parar' ? `Imaginando a vida sem ${o}, você se sente…` : act && act.verb === 'continuar' ? `Imaginando daqui a um ano, ainda com ${o}, você se sente…` : `Imaginando que deu certo com ${o}, você se sente…`, tags: act && act.verb === 'parar' ? ['Aliviado', 'Livre', 'Com saudade', 'Com culpa', 'Ainda não sei'] : ['Leve', 'Feliz', 'Orgulhoso', 'Realizado', 'Ainda não sei'] }
      ];
  }
}

export { cap };

// Síntese e plano de ação no contexto da pergunta.
const STEP = {
  musica: 'Faça um teste de 30 dias: pratique 15 minutos por dia e anote como se sente depois de cada vez.',
  hobby: 'Faça um teste de 30 dias com o menor tempo possível por dia e observe como você se sente.',
  trabalho: 'Converse com alguém que já está onde você quer chegar e liste, em números, o que ganha e o que perde.',
  estudo: 'Converse com quem já fez esse caminho e calcule o tempo real que você tem por semana.',
  viagem: 'Coloque no papel o custo total da viagem e compare com sua reserva antes de decidir.',
  casa: 'Faça as contas com calma: valor total, parcelas e uma reserva para imprevistos.',
  pet: 'Passe um fim de semana cuidando do bichinho de alguém para sentir a rotina de verdade.',
  mudanca: 'Antes da mudança, viva um mês por lá como morador, não como turista: rotina, trabalho, dia de chuva.',
  amor: 'Tenha uma conversa honesta, sem pressa, sobre o que você sente e o que precisa.',
  saude: 'Escolha a menor versão possível desse hábito e mantenha por 14 dias.',
  dinheiro: 'Espere 7 dias antes de decidir e coloque tudo numa folha: custo total, parcelas e reserva.',
  familia: 'Escreva o que você gostaria de dizer e escolha um momento tranquilo para dizer.',
  amizade: 'Escreva o que você gostaria de dizer e escolha um momento tranquilo para dizer.',
  fe: 'Reserve 10 minutos por dia de silêncio ou oração durante uma semana.'
};
const PLAN = {
  _: ['Escrever numa folha o que te move e o que te segura', 'Conversar com duas pessoas de confiança sobre isso', 'Buscar as informações que ainda faltam', 'Fazer um teste pequeno antes da decisão', 'Revisitar esta pergunta na Alma e decidir'],
  viagem: ['Definir quanto você pode gastar', 'Pesquisar passagens e hospedagem', 'Conferir documentos, visto e datas', 'Montar um roteiro leve', 'Revisitar esta pergunta na Alma e decidir'],
  casa: ['Definir quanto você pode investir', 'Visitar ou orçar pelo menos três opções', 'Pedir a opinião de alguém de confiança', 'Esperar 7 dias antes de fechar', 'Revisitar esta pergunta na Alma e decidir'],
  pet: ['Pesquisar o porte e a rotina ideal para você', 'Calcular os custos do mês', 'Visitar uma ONG ou abrigo', 'Combinar quem ajuda nas viagens', 'Revisitar esta pergunta na Alma e decidir'],
  mudanca: ['Escrever numa folha o que te move e o que te segura', 'Conversar com duas pessoas que você ama sobre isso', 'Pesquisar custo de vida, trabalho e bairros', 'Passar um mês lá vivendo como morador', 'Revisitar esta pergunta na Alma e decidir'],
  musica: ['Escrever por que você começou', 'Olhar o quanto já evoluiu desde o início', 'Ajustar horário ou formato para caber na rotina', 'Praticar 15 minutos por dia durante um mês', 'Revisitar esta pergunta na Alma e decidir'],
  hobby: ['Escrever por que você começou', 'Olhar o quanto já evoluiu desde o início', 'Ajustar horário ou formato para caber na rotina', 'Praticar um pouco por dia durante um mês', 'Revisitar esta pergunta na Alma e decidir'],
  trabalho: ['Listar o que ganha e o que perde, em números', 'Conversar com alguém que já está nesse caminho', 'Tirar as dúvidas que ainda faltam', 'Definir o seu limite: o mínimo que você aceita', 'Revisitar esta pergunta na Alma e decidir'],
  estudo: ['Escrever onde você quer chegar com isso', 'Conversar com quem já fez esse caminho', 'Calcular o tempo e o dinheiro reais por semana', 'Testar a rotina de estudo por um mês', 'Revisitar esta pergunta na Alma e decidir'],
  amor: ['Escrever o que você sente, sem se julgar', 'Pensar no que você precisa numa relação', 'Ter uma conversa honesta e tranquila', 'Observar como você se sente nas semanas seguintes', 'Revisitar esta pergunta na Alma e decidir'],
  saude: ['Escrever por que isso importa para você', 'Escolher a menor versão possível do hábito', 'Marcar dia e hora fixos na semana', 'Manter por 14 dias e anotar como se sente', 'Revisitar esta pergunta na Alma'],
  dinheiro: ['Colocar custo total, parcelas e reserva numa folha', 'Esperar 7 dias antes de decidir', 'Pedir a opinião de alguém de confiança', 'Comparar pelo menos três opções', 'Revisitar esta pergunta na Alma e decidir'],
  familia: ['Escrever o que você gostaria de dizer', 'Escolher um momento tranquilo para conversar', 'Ouvir o outro lado até o fim', 'Fazer um gesto de cuidado', 'Revisitar esta pergunta na Alma'],
  amizade: ['Escrever o que você gostaria de dizer', 'Escolher um momento tranquilo para conversar', 'Ouvir o outro lado até o fim', 'Fazer um gesto de cuidado', 'Revisitar esta pergunta na Alma'],
  fe: ['Reservar 10 minutos de silêncio ou oração', 'Ler um texto que te inspira', 'Conversar com alguém da sua tradição', 'Anotar o que muda em você em uma semana', 'Revisitar esta pergunta na Alma']
};

export function contextOf(text) { return detect(text); }
export function stepFor(text) { const d = detect(text); return (d && STEP[d.topic.k]) || 'Faça um teste pequeno antes da decisão grande e depois faça esta pergunta de novo.'; }
export function planSteps(text) { const d = detect(text); return (d && PLAN[d.topic.k]) || PLAN._; }

// Nome do plano: o que a pessoa escolheu ou, por padrão, a própria pergunta resumida.
export function planNameOf(e) {
  if (e.planName) return e.planName;
  const q = (e.q || '').replace(/^(estou pensando em|penso em|devo|será que devo|quero)\s+/i, '').replace(/\?$/, '');
  const t = q.charAt(0).toUpperCase() + q.slice(1);
  return t.length > 48 ? t.slice(0, 47).trim() + '…' : t;
}


// Lê o sentimento principal do texto. Usado quando a pessoa não escolheu o tipo:
// quem escreve 'estou feliz e grato' não está trazendo uma dúvida.
const MOODS = [
  { kind: 'Alegria', re: /\b(feliz|felizes|felicidade|grat[oa]|gratidao|alegr\w*|contente|realizad[oa]|conquistei|consegui|passei|celebr\w*|orgulhos[oa]|abencoad[oa]|em paz|radiante|animad[oa])\b/ },
  { kind: 'Medo', re: /\b(medo|receio|pavor|panico|assustad[oa]|tenho medo|temo|inseguran\w*)\b/ },
  { kind: 'Aflição', re: /\b(triste|tristeza|ansios[oa]|ansiedade|angusti\w*|sofr\w*|dor\b|luto|perdi|chorando|sozinh[oa]|solidao|desanimad[oa]|cansad[oa]|esgotad[oa]|magoad[oa]|decepcionad[oa]|brig\w*|raiva)\b/ },
  { kind: 'Sugestão', re: /\b(sugest\w*|dica|dicas|me indica|recomenda\w*|ideia de|como posso)\b/ },
  { kind: 'Dúvida', re: /\b(devo|deveria|sera que|nao sei se|pensando em|pensando se|decidir|decisao|escolher|ou nao|vale a pena)\b|\?/ }
];
export function moodOf(text) {
  const t = norm(text);
  const hit = MOODS.find((m) => m.re.test(t));
  return hit ? hit.kind : null;
}
