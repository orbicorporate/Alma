// Gerado a partir de Main.dc.html (protótipo Alma) e mantido à mão a partir daqui.
import React from 'react';
import { DCLogic, css } from '../dc/runtime.js';
import { today, addDays, iso, dayMonth, stepInfo } from '../dates.js';
import { load, save, getAuth, onAuth, onData, sendMagicLink, signInWithGoogle, signOut } from '../store.js';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.AG = [
      { name: 'Cristianismo', glyph: 'Cr', color: '#9fc4ff', ref: 'Mateus 7:7', lang: 'Grego koiné', dir: 'ltr', script: 'latin',
        orig: 'Αἰτεῖτε, καὶ δοθήσεται ὑμῖν· ζητεῖτε, καὶ εὑρήσετε',
        tr: 'Pedi, e vos será dado; buscai, e encontrareis; batei, e a porta vos será aberta.',
        reflection: 'Buscar não é falta de fé nem ingratidão pelo que você já tem. Jesus trata a procura como parte do caminho: quem bate à porta com sinceridade não fica do lado de fora.' },
      { name: 'Judaísmo', glyph: 'Ju', color: '#f3d98b', ref: 'Gênesis 12:1', lang: 'Hebraico', dir: 'rtl', script: 'hebrew',
        orig: 'לֶךְ־לְךָ מֵאַרְצְךָ אֶל־הָאָרֶץ אֲשֶׁר אַרְאֶךָּ',
        tr: 'Vai-te da tua terra, para a terra que eu te mostrarei.',
        reflection: 'Lech lecha também pode ser lido como vai para ti mesmo. Abraão parte sem o mapa completo. A tradição ensina que toda mudança verdadeira é também uma ida em direção a quem você é.' },
      { name: 'Hinduísmo', glyph: 'Hi', color: '#ffb38a', ref: 'Bhagavad Gita 3.35', lang: 'Sânscrito', dir: 'ltr', script: 'deva',
        orig: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्',
        tr: 'Melhor é o próprio caminho, ainda que imperfeito, do que o caminho alheio bem trilhado.',
        reflection: 'Krishna fala de svadharma, a natureza própria de cada um. A pergunta não é qual cidade é melhor, e sim qual vida é de fato sua.' },
      { name: 'Budismo', glyph: 'Bu', color: '#c9a8ff', ref: 'Kalama Sutta, AN 3.65', lang: 'Páli', dir: 'ltr', script: 'latin',
        orig: 'Yadā tumhe, kālāmā, attanāva jāneyyātha',
        tr: 'Quando souberdes por vós mesmos que algo conduz ao bem-estar, então segui-o.',
        reflection: 'O Buda pede que você não decida pela opinião alheia nem pelo costume, mas pela experiência direta. Viver o lugar antes de mudar é um jeito budista de saber.' },
      { name: 'Islamismo', glyph: 'Is', color: '#8fe3c8', ref: 'Alcorão 3:159', lang: 'Árabe', dir: 'rtl', script: 'arabic',
        orig: 'وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ',
        tr: 'Consulta-os nos assuntos; e, quando estiveres decidido, confia em Deus.',
        reflection: 'Primeiro escuta quem você ama e quem conhece o caminho. Depois decide com firmeza. A confiança vem depois da decisão, não no lugar dela.' },
      { name: 'Taoísmo', glyph: 'Ta', color: '#7fd4e8', ref: 'Tao Te Ching 64', lang: 'Chinês clássico', dir: 'ltr', script: 'han',
        orig: '千里之行，始於足下',
        tr: 'A jornada de mil léguas começa sob os teus pés.',
        reflection: 'Lao Tsé lembra que nada grande começa grande. Uma visita, uma conversa, uma semana de teste: a viagem já está acontecendo.' },
      { name: 'Espiritismo', glyph: 'Es', color: '#b8c8ff', ref: 'Allan Kardec, inscrição em seu túmulo', lang: 'Francês', dir: 'ltr', script: 'latin',
        orig: 'Naître, mourir, renaître encore et progresser sans cesse, telle est la loi.',
        tr: 'Nascer, morrer, renascer ainda e progredir sem cessar, tal é a lei.',
        reflection: 'Para o Espiritismo, a vida é movimento e aprendizado contínuo. Mudar de lugar pode ser progresso, desde que você leve junto o propósito de crescer.' },
      { name: 'Confucionismo', glyph: 'Co', color: '#f5a8b8', ref: 'Analectos 2.17', lang: 'Chinês clássico', dir: 'ltr', script: 'han',
        orig: '知之為知之，不知為不知，是知也',
        tr: 'Saber o que se sabe e reconhecer o que não se sabe: isso é conhecimento.',
        reflection: 'Confúcio convida à honestidade: o que você realmente sabe sobre viver lá, e o que ainda é imagem de férias? Separar os dois clareia a decisão.' },
      { name: 'Estoicismo', glyph: 'St', color: '#e8e2d4', ref: 'Sêneca, Cartas a Lucílio 28', lang: 'Latim', dir: 'ltr', script: 'latin',
        orig: 'Animum debes mutare, non caelum.',
        tr: 'É a alma que deves mudar, não o céu.',
        reflection: 'Sêneca é a voz do contraponto: se você foge de algo, isso vai junto na mala. Mas se você vai em direção a algo, um novo céu pode ajudar uma nova alma.' },
      { name: 'Existencialismo', glyph: 'Ex', color: '#a8e6a0', ref: 'Kierkegaard, Diários, 1843', lang: 'Dinamarquês', dir: 'ltr', script: 'latin',
        orig: 'Livet maa forstaaes baglænds, men leves forlænds.',
        tr: 'A vida só se compreende olhando para trás, mas precisa ser vivida olhando para frente.',
        reflection: 'Você nunca terá certeza total antes de viver. Toda escolha real envolve um salto, e a clareza costuma chegar depois do passo, não antes.' },
      { name: 'Filosofia africana', glyph: 'Af', color: '#e39a5c', ref: 'Provérbio zulu, filosofia Ubuntu', lang: 'Zulu', dir: 'ltr', script: 'latin',
        orig: 'Umuntu ngumuntu ngabantu.',
        tr: 'Uma pessoa é uma pessoa por meio das outras pessoas.',
        reflection: 'O Ubuntu lembra que ninguém floresce sozinho. Antes de escolher o lugar, pergunte quem estará perto: uma cidade bonita sem vínculos pesa, e uma comunidade viva transforma qualquer lugar em casa.' },
      { name: 'Sufismo', glyph: 'Su', color: '#e0a0f5', ref: 'Rumi, Masnavi I.1', lang: 'Persa', dir: 'rtl', script: 'arabic',
        orig: 'بشنو این نی چون شکایت می‌کند · از جدایی‌ها حکایت می‌کند',
        tr: 'Escuta a flauta de junco: ela conta sua história e lamenta as separações.',
        reflection: 'Para Rumi, a flauta chora porque foi tirada do juncal de onde veio. A saudade que você sente do mar e da natureza pode ser esse chamado de origem: a alma lembrando onde se sente inteira.' },
      { name: 'Sikhismo', glyph: 'Si', color: '#e6e08a', ref: 'Japji Sahib, Guru Nanak', lang: 'Gurmukhi', dir: 'ltr', script: 'gurmukhi',
        orig: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਖਿਆ ਨਾਲਿ',
        tr: 'Caminhar em harmonia com a Vontade divina, ó Nanak: isso está escrito em nós.',
        reflection: 'Guru Nanak ensina hukam, a ordem viva por trás de tudo. Em vez de forçar uma resposta, observe para onde a vida já vem te conduzindo, e caminhe junto com ela.' },
      { name: 'Filosofia grega', glyph: 'Gr', color: '#80a8ff', ref: 'Heráclito, fragmento 91', lang: 'Grego antigo', dir: 'ltr', script: 'latin',
        orig: 'ποταμῷ γὰρ οὐκ ἔστιν ἐμβῆναι δὶς τῷ αὐτῷ',
        tr: 'Não é possível entrar duas vezes no mesmo rio.',
        reflection: 'Heráclito lembra que tudo flui, inclusive você. A cidade de hoje já não é a de antes, e a que você imagina também vai mudar. Escolha pensando na pessoa que você está se tornando.' }
    ];
    this.PH = [
      { lines: ['Religiões e filosofias', 'não devem dividir,', 'e sim aconselhar.'], mid: 'Tudo importa.', gold: 'Flua com sabedoria e leve a luz.' },
      { lines: ['Muitos caminhos,', 'uma mesma montanha.'], mid: 'Cada tradição vê um lado dela.', gold: 'Suba com o coração aberto.' },
      { lines: ['Nenhuma voz', 'guarda a luz inteira.'], mid: 'Juntas, iluminam mais.', gold: 'Escute todas, escolha com amor.' },
      { lines: ['A verdade não cabe', 'em uma única história.'], mid: 'Ela cabe na escuta.', gold: 'Abra espaço para o outro.' },
      { lines: ['O que nos une', 'é mais antigo', 'do que o que nos separa.'], mid: 'A compaixão fala muitas línguas.', gold: 'Aprenda todas com o coração.' },
      { lines: ['Rios diferentes,', 'o mesmo mar.'], mid: 'Toda sabedoria deságua no amor.', gold: 'Deixe a sua fluir.' },
      { lines: ['Aprender com a fé', 'do outro não é trair', 'a sua.'], mid: 'É fazer ela crescer.', gold: 'Cresça sem muros.' },
      { lines: ['A luz não pertence', 'a uma só janela.'], mid: 'Ela entra por todas.', gold: 'Abra as suas.' }
    ];
    this.QS = {
      'Pensamento': [
        { q: 'Esse pensamento é mais…', tags: ['Uma ideia', 'Uma lembrança', 'Uma pergunta sobre a vida', 'Um incômodo'] },
        { q: 'Ele te deixa…', tags: ['Curioso', 'Inquieto', 'Grato', 'Confuso'] },
        { q: 'O que você busca com ele?', tags: ['Entender', 'Aceitar', 'Aprofundar', 'Soltar'] }
      ],
      'Dúvida': [
        { q: 'O que mais te move nessa escolha?', tags: ['Paz', 'Natureza', 'Liberdade', 'Recomeço', 'Qualidade de vida'] },
        { q: 'E o que mais te segura?', tags: ['Trabalho', 'Dinheiro', 'Pessoas que amo', 'Medo de errar', 'Só a coragem'] },
        { q: 'Ao imaginar que deu certo, como você se sente?', tags: ['Leve', 'Em casa', 'Livre', 'Inteiro', 'Ainda não sei'] }
      ],
      'Aflição': [
        { q: 'Isso envolve principalmente…', tags: ['Uma relação', 'Trabalho', 'Família', 'Saúde', 'Eu mesmo'] },
        { q: 'Há quanto tempo te acompanha?', tags: ['Dias', 'Semanas', 'Meses', 'Anos'] },
        { q: 'Do que você mais precisa agora?', tags: ['Consolo', 'Clareza', 'Força', 'Perdão', 'Descanso'] }
      ],
      'Medo': [
        { q: 'Esse medo é sobre…', tags: ['O futuro', 'Perder alguém', 'Falhar', 'Saúde', 'Dinheiro'] },
        { q: 'Quando ele aparece mais?', tags: ['À noite', 'Ao acordar', 'No silêncio', 'O tempo todo'] },
        { q: 'O que te acalma, mesmo que um pouco?', tags: ['Natureza', 'Pessoas', 'Oração', 'Movimento', 'Silêncio'] }
      ],
      'Alegria': [
        { q: 'Essa alegria vem de…', tags: ['Uma conquista', 'Um encontro', 'Uma cura', 'Um recomeço', 'Algo simples'] },
        { q: 'Com quem você quer dividir?', tags: ['Família', 'Amigos', 'Deus', 'Comigo mesmo'] },
        { q: 'O que você quer fazer com ela?', tags: ['Agradecer', 'Celebrar', 'Guardar', 'Multiplicar'] }
      ],
      'Sugestão': [
        { q: 'Você busca uma sugestão para…', tags: ['Uma decisão', 'Um hábito', 'Uma relação', 'Um recomeço'] },
        { q: 'Você prefere algo…', tags: ['Prático', 'Profundo', 'Rápido', 'Contemplativo'] },
        { q: 'Seu momento agora é de…', tags: ['Agir', 'Esperar', 'Soltar', 'Aprender'] }
      ]
    };
    this.state = {
      screen: 'intro', pi: 0, planIdx: -1, savedIdx: -1, prev: 'ask', inhale: false, count: 0, medit: false,
      text: '',
      kind: 'Dúvida', step: 0, voicesOpen: false, ans: [null, null, null], other: false, otherText: '', jfilter: 'all', confirmDel: false, lit: 0, focus: -1, open: -1, stars: [], filter: 'all',
      savedNow: false, toast: '', sheet: -1, tx: 0, ty: 0,
      entries: load().entries || [],
      auth: getAuth(), loginEmail: '', loginMsg: ''
    };
  }
  componentDidMount() {
    this.checkHandoff = this.checkHandoff.bind(this);
    this.checkHandoff();
    window.addEventListener('alma:show', this.checkHandoff);
    this.offAuth = onAuth((auth) => {
      const entering = auth.loggedIn && this.state.screen === 'welcome';
      this.setState(entering ? { auth, screen: 'breath', count: 0, inhale: true } : { auth });
    });
    this.offData = onData((d) => this.setState({ entries: d.entries || [] }));
    this.k = setTimeout(() => this.setState({ inhale: true }), 80);
    this.b = setInterval(() => {
      const s = this.state;
      if (s.screen !== 'breath') return;
      this.setState({ inhale: !s.inhale, count: s.inhale ? s.count + 1 : s.count });
    }, 4000);
  }
  componentWillUnmount() {
    window.removeEventListener('alma:show', this.checkHandoff); this.offAuth && this.offAuth(); this.offData && this.offData();
    clearTimeout(this.k); clearInterval(this.b); clearTimeout(this.t1); clearInterval(this.ci); clearTimeout(this.ts); clearTimeout(this.tq);
  }
  flash(msg) {
    this.setState({ toast: msg });
    clearTimeout(this.ts);
    this.ts = setTimeout(() => this.setState({ toast: '' }), 2800);
  }
  startCouncil() {
    clearInterval(this.ci);
    this.setState({ screen: 'council', lit: 0, focus: -1 });
    this.ci = setInterval(() => {
      const n = this.state.lit + 1;
      this.setState({ lit: n });
      if (n >= this.AG.length) clearInterval(this.ci);
    }, 300);
  }
  advance() {
    const s = this.state;
    this.setState({ other: false, otherText: '' });
    if (s.step < 2) this.setState({ step: s.step + 1 });
    else this.startCouncil();
  }
  composeAlma() {
    const s = this.state, A = s.ans;
    if (s.kind === 'Dúvida') {
      const MOVE = { 'Paz': 'a paz', 'Natureza': 'a natureza', 'Liberdade': 'a liberdade', 'Recomeço': 'um recomeço', 'Qualidade de vida': 'mais qualidade de vida' };
      const HOLD = { 'Trabalho': 'o trabalho', 'Dinheiro': 'a questão financeira', 'Pessoas que amo': 'as pessoas que você ama', 'Medo de errar': 'o medo de errar', 'Só a coragem': 'apenas a coragem de começar' };
      const FEEL = { 'Leve': 'leve', 'Em casa': 'em casa', 'Livre': 'livre', 'Inteiro': 'inteiro' };
      const low = (x) => x ? x.charAt(0).toLowerCase() + x.slice(1) : x;
      const move = MOVE[A[0]] || (A[0] ? low(A[0]) : 'algo que você sente, mesmo sem nome ainda');
      const hold = HOLD[A[1]] || (A[1] ? low(A[1]) : 'algo que ainda não tem nome');
      const feel = FEEL[A[2]] || (A[2] && A[2] !== 'Ainda não sei' ? low(A[2]) : null);
      return {
        p1: `Você trouxe uma escolha, não um problema. O que te move é ${move}; o que te segura é ${hold}.`,
        p2: 'Quase todas as vozes concordam que buscar o que te chama é legítimo. Mas pedem pés no chão: Sêneca lembra que a alma vai junto na mala, e Confúcio pede que você separe o que sabe do que ainda é imagem de férias. ' +
          (feel ? `Ao se imaginar lá, você se sente ${feel}. Um sentimento assim costuma ser bússola, não capricho.` : 'Você ainda não sabe como se sentiria, e tudo bem: é exatamente isso que um teste pequeno responde.'),
        step: 'Antes da mudança, viva um mês por lá como morador, não como turista: rotina, trabalho, dia de chuva. Depois faça esta pergunta de novo.'
      };
    }
    const tags = A.filter(Boolean).map((t) => t.toLowerCase()).join(', ');
    return {
      p1: tags ? `Você trouxe ${this.KP(s.kind)} e contou um pouco mais: ${tags}.` : `Você trouxe ${this.KP(s.kind)}.`,
      p2: 'Vindas de lugares muito diferentes, as vozes apontam para o mesmo chão: o passo possível de hoje, feito com inteireza, e a confiança de que você não caminha sozinho.',
      step: 'Marque com estrela a voz que mais tocou você e releia amanhã cedo, com calma.'
    };
  }
  planFor(kind) {
    const D = [0, 7, 9, 36, 66], G = [0, 1, 3, 14];
    const mk = (list, offs) => list.map((t, i) => ({ t, iso: iso(addDays(today(), offs[i])), done: false, remind: i < 2 }));
    if (kind === 'Dúvida') return mk([
      'Escrever numa folha o que te move e o que te segura',
      'Conversar com duas pessoas que você ama sobre isso',
      'Pesquisar custo de vida, trabalho e bairros',
      'Passar um mês lá vivendo como morador',
      'Revisitar esta pergunta na Alma e decidir'
    ], D);
    return mk([
      'Reler a voz que mais tocou você',
      'Dar um passo pequeno e concreto',
      'Conversar com alguém de confiança',
      'Revisitar esta pergunta na Alma'
    ], G);
  }
  updAt(idx, fn) {
    const list = this.state.entries.slice();
    if (!list[idx]) return;
    list[idx] = fn(Object.assign({}, list[idx]));
    this.setState({ entries: list });
  }
  planView() {
    const s = this.state;
    const e = s.entries[s.planIdx];
    const empty = { q: '', doneN: 0, total: 0, headline: '', sub: '', ringStyle: '', steps: [], allDone: false, resolve: () => {}, resolveLabel: '' };
    if (!e || !e.plan) return empty;
    const idx = s.planIdx;
    const plan = e.plan.map(stepInfo), total = plan.length, doneN = plan.filter((x) => x.done).length;
    const cur = plan.findIndex((x) => !x.done);
    const setStep = (j, patch) => this.updAt(idx, (en) => { en.plan = en.plan.map((x, k) => k === j ? Object.assign({}, x, patch) : x); return en; });
    const pct = Math.round(100 * doneN / total);
    return {
      q: `“${e.q}”`, doneN, total, allDone: doneN === total,
      headline: doneN === total ? 'Plano concluído' : doneN === 0 ? 'Vamos começar pelo passo 1' : `Você está no passo ${cur + 1}`,
      sub: doneN === total ? 'Todos os passos feitos. Que caminho bonito.' : `Próximo: ${plan[cur].date.replace('Hoje · ', 'hoje, ')}`,
      ringStyle: `background: conic-gradient(#8fe3b0 0% ${pct}%, rgba(255,255,255,.1) ${pct}% 100%); transition: background 1s ease`,
      resolveLabel: e.resolved ? 'Pergunta resolvida' : 'Sim, já resolvi',
      resolve: () => {
        if (e.resolved) return;
        this.updAt(idx, (en) => { en.resolved = true; return en; });
        this.flash('Que bom. Essa estrela agora brilha em paz');
      },
      steps: plan.map((x, j) => {
        const isCurrent = j === cur, done = x.done;
        return {
          n: j + 1, t: x.t, date: x.date, kicker: `Passo ${j + 1} de ${total}`,
          done, todo: !done, isCurrent, isFuture: !done && !isCurrent,
          badgeOn: done || isCurrent, badge: done ? 'Concluído' : 'Agora',
          badgeStyle: done ? 'background: rgba(143,227,176,.16); color: #8fe3b0' : 'background: rgba(243,217,139,.18); color: #f3d98b',
          cardStyle: isCurrent ? 'border-color: rgba(243,217,139,.55); box-shadow: 0 0 40px rgba(243,217,139,.12), inset 0 1px 0 rgba(255,255,255,.14)' : done ? 'opacity: .7' : 'opacity: .85',
          numStyle: done ? 'background: #8fe3b0' : isCurrent ? 'background: #f3d98b; color: #1a1408; box-shadow: 0 0 18px rgba(243,217,139,.6)' : 'border: 1px solid rgba(244,241,234,.4); color: rgba(244,241,234,.85)',
          textStyle: done ? 'text-decoration: line-through; opacity: .6' : '',
          dateColor: done ? 'rgba(244,241,234,.45)' : (x.due <= 0 ? '#f3d98b' : 'rgba(244,241,234,.75)'),
          remindP: x.remind ? 'true' : 'false',
          bellLabel: x.remind ? 'Lembrete ligado' : 'Sem lembrete',
          bellStyle: x.remind && !done ? 'background: rgba(243,217,139,.14); color: #f3d98b; border: 1px solid rgba(243,217,139,.4)' : 'background: rgba(255,255,255,.04); color: rgba(244,241,234,.6); border: 1px solid rgba(255,255,255,.12)',
          bellFill: x.remind && !done ? '#f3d98b' : 'none', bellStroke: x.remind && !done ? '#f3d98b' : 'currentColor',
          complete: () => { setStep(j, { done: true }); this.flash(j === total - 1 ? 'Último passo concluído' : `Passo ${j + 1} concluído`); },
          undo: () => setStep(j, { done: false }),
          bell: () => { setStep(j, { remind: !x.remind }); if (!x.remind) this.flash(`Lembrete ligado para ${x.date.replace('Hoje · ', '')}`); }
        };
      })
    };
  }
  KP(k) {
    return { 'Pensamento': 'um pensamento', 'Dúvida': 'uma dúvida', 'Aflição': 'uma aflição', 'Medo': 'um medo', 'Alegria': 'uma alegria', 'Sugestão': 'um pedido de sugestão' }[k] || 'algo seu';
  }
  renderVals() {
    const s = this.state;
    const AG = this.AG;
    const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
    const KC = { 'Pensamento': '#b9a6ff', 'Dúvida': '#a8d8ff', 'Aflição': '#9a86ff', 'Medo': '#6f8cff', 'Alegria': '#ffd27a', 'Sugestão': '#8fe3b0' };

    const MOODS = {
      calma: { c: ['#9fb8ff', '#c9a8ff', '#7fe0d6'], label: 'serenidade' },
      medo: { c: ['#6f8cff', '#8a6bff', '#46c6e0'], label: 'medo' },
      alegria: { c: ['#ffd27a', '#ffb38a', '#fff1b8'], label: 'alegria' },
      gratidao: { c: ['#8fe3b0', '#ffd98a', '#9fd6ff'], label: 'gratidão' },
      tristeza: { c: ['#9a86ff', '#6d8bd6', '#c3b1ff'], label: 'melancolia' },
      raiva: { c: ['#ff8f8f', '#ffb07a', '#d98ac0'], label: 'inquietação' },
      duvida: { c: ['#a8d8ff', '#b9a6ff', '#8fe3c8'], label: 'busca' }
    };
    const t = (s.text || '').toLowerCase();
    let mood = null;
    if (/medo|ansie|preocup|pânico|panico|receio|inseg/.test(t)) mood = 'medo';
    else if (/grat|agradeç|agradec/.test(t)) mood = 'gratidao';
    else if (/alegr|feliz|conquist|nasceu|consegui/.test(t)) mood = 'alegria';
    else if (/trist|perd|luto|saudade|sozinh|vazio/.test(t)) mood = 'tristeza';
    else if (/raiva|ódio|odio|injust|irrit/.test(t)) mood = 'raiva';
    else if (/mud|decid|escolh|devo |será/.test(t)) mood = 'duvida';
    if (!mood) mood = { 'Pensamento': 'calma', 'Medo': 'medo', 'Alegria': 'alegria', 'Aflição': 'tristeza', 'Dúvida': 'duvida', 'Sugestão': 'calma' }[s.kind] || 'calma';
    const M = (s.screen === 'breath' || s.screen === 'intro') ? MOODS.calma : MOODS[mood];
    const c = M.c;
    const vars = `--m1: ${c[0]}; --m2: ${c[1]}; --m3: ${c[2]};`;
    const auroraA = `transform: translate(${(-s.tx * 22).toFixed(1)}px, ${(-s.ty * 22).toFixed(1)}px)`;
    const auroraB = `transform: translate(${(s.tx * 16).toFixed(1)}px, ${(s.ty * 16).toFixed(1)}px)`;

    const POS = {
      intro: [195, 300, 140], welcome: [195, 196, 120], breath: [195, 320, 220], ask: [195, 162, 124], releasing: [195, 320, 200], deepen: [195, 160, 110],
      council: [195, 380, 96], answers: [195, 58, 38], journal: [195, 58, 38], plan: [195, 58, 38]
    };
    const p = POS[s.screen];
    let sc = 1;
    if (s.screen === 'breath') sc = s.inhale ? 1.18 : 0.84;
    if (s.screen === 'releasing') sc = 1.15;
    const orbStyle = `left: ${p[0] - p[2] / 2}px; top: ${p[1] - p[2] / 2}px; width: ${p[2]}px; height: ${p[2]}px; transform: translate(${(s.tx * 8).toFixed(1)}px, ${(s.ty * 8).toFixed(1)}px) scale(${sc});`;

    const motes = [];
    for (let i = 0; i < 26; i++) {
      const size = 2 + rnd(i, 3) * 3.5;
      motes.push({ style: `left: ${(rnd(i, 1) * 100).toFixed(1)}%; top: ${(rnd(i, 2) * 100).toFixed(1)}%; width: ${size.toFixed(1)}px; height: ${size.toFixed(1)}px; background: var(--m${(i % 3) + 1}); box-shadow: 0 0 ${(size * 3).toFixed(0)}px var(--m${(i % 3) + 1}); animation-duration: ${(10 + rnd(i, 4) * 14).toFixed(1)}s; animation-delay: -${(rnd(i, 5) * 20).toFixed(1)}s` });
    }
    const TH = ['agora', 'calma', 'fé', 'luz'];
    const TP = [[28, 104], [300, 118], [36, 208], [318, 214]];
    const thoughts = TH.map((w, i) => ({ w, style: `left: ${TP[i][0]}px; top: ${TP[i][1]}px; font-size: ${15 + Math.round(rnd(i, 9) * 6)}px; animation-delay: ${(i * 2.4).toFixed(1)}s` }));

    const KINDS = ['Pensamento', 'Dúvida', 'Aflição', 'Medo', 'Alegria', 'Sugestão'];
    const chips = KINDS.map((k) => {
      const on = s.kind === k;
      return {
        label: k, pressed: on ? 'true' : 'false',
        pick: () => this.setState({ kind: k }),
        style: on ? 'background: rgba(255,255,255,.18); border-color: rgba(255,255,255,.5); box-shadow: 0 0 22px var(--m1)' : 'background: rgba(255,255,255,.04); color: rgba(244,241,234,.78)'
      };
    });
    const dots = [0, 1, 2].map((i) => ({ style: s.count > i ? 'background: #f3d98b; box-shadow: 0 0 14px #f3d98b' : 'background: rgba(255,255,255,.18)' }));
    const relWords = (s.text || '').split(/\s+/).filter(Boolean).slice(0, 40).map((w, i) => ({
      w, style: `--dx: ${((rnd(i, 7) - 0.5) * 140).toFixed(0)}px; --rot: ${((rnd(i, 8) - 0.5) * 40).toFixed(0)}deg; animation-delay: ${400 + i * 70}ms`
    }));

    const qs = this.QS[s.kind] || this.QS['Dúvida'];
    const cq = qs[Math.min(s.step, 2)];
    const bars = [0, 1, 2].map((i) => ({ style: i <= s.step ? 'background: #f3d98b; box-shadow: 0 0 10px rgba(243,217,139,.6)' : 'background: rgba(255,255,255,.16)' }));
    const dtags = cq.tags.map((tg) => {
      const on = s.ans[s.step] === tg;
      return {
        label: tg, pressed: on ? 'true' : 'false',
        style: on ? 'background: rgba(243,217,139,.18); border-color: #f3d98b; box-shadow: 0 0 26px rgba(243,217,139,.45); color: #fff4d1' : 'background: rgba(255,255,255,.05)',
        pick: () => {
          const ans = this.state.ans.slice();
          ans[this.state.step] = tg;
          this.setState({ ans, other: false });
          clearTimeout(this.tq);
          this.tq = setTimeout(() => this.advance(), 650);
        }
      };
    });
    const txt = s.text || '';
    const textShort = txt.length > 110 ? txt.slice(0, 108).trim() + '…' : txt;

    const SYM = {
      'Cristianismo': { d: 'M12 3v18M7 8.5h10', about: 'Evangelhos e cartas dos apóstolos' },
      'Judaísmo': { d: 'M12 3.5l7.4 12.8H4.6zM12 20.5L4.6 7.7h14.8z', about: 'Torá, Salmos e Talmud' },
      'Hinduísmo': { t: 'ॐ', tf: "'Noto Sans Devanagari', sans-serif", about: 'Vedas, Upanishads e Bhagavad Gita' },
      'Budismo': { d: 'M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16zM12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM12 4v6M12 14v6M4 12h6M14 12h6M6.3 6.3l4.3 4.3M13.4 13.4l4.3 4.3M17.7 6.3l-4.3 4.3M10.6 13.4l-4.3 4.3', about: 'Ensinamentos do Buda' },
      'Islamismo': { d: 'M6 6h12v12H6zM12 3.5l8.5 8.5-8.5 8.5L3.5 12zM12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4z', about: 'Alcorão e tradição profética' },
      'Taoísmo': { d: 'M12 3.5a8.5 8.5 0 1 0 0 17a8.5 8.5 0 1 0 0-17zM12 3.5a4.25 4.25 0 0 1 0 8.5a4.25 4.25 0 0 0 0 8.5M12 6.9a.85.85 0 1 0 0 1.7a.85.85 0 1 0 0-1.7zM12 15.4a.85.85 0 1 0 0 1.7a.85.85 0 1 0 0-1.7z', about: 'Lao Tsé e Chuang Tsé' },
      'Espiritismo': { d: 'M9 3c0 3.5 2 5.5 3 8.2M12 11c2-3 5-4 7.5-3.2-1 3-4.2 4.2-7.5 3.2M10.2 13.3a1.8 1.8 0 1 0 0 .1zM15.4 13.3a1.8 1.8 0 1 0 0 .1zM11.9 16.6a1.8 1.8 0 1 0 0 .1zM8.5 16.6a1.8 1.8 0 1 0 0 .1zM10.2 19.9a1.8 1.8 0 1 0 0 .1z', about: 'Obras de Allan Kardec' },
      'Confucionismo': { t: '仁', tf: "'Noto Sans TC', sans-serif", about: 'Confúcio e Mêncio' },
      'Estoicismo': { d: 'M5 5.5l7-2.5 7 2.5zM6 7.5h12M8 7.5v10M12 7.5v10M16 7.5v10M6 17.5h12M4.5 20.5h15', about: 'Sêneca, Epicteto e Marco Aurélio' },
      'Existencialismo': { d: 'M3 16.5h18M7 16.5a5 5 0 0 1 10 0M12 6.5v2.2M5.8 9.8l1.5 1.5M18.2 9.8l-1.5 1.5M6 20h12', about: 'Kierkegaard, Sartre e Camus' },
      'Filosofia africana': { d: 'M3.5 12a4.5 3.4 0 1 0 9 0a4.5 3.4 0 1 0 -9 0zM11.5 12a4.5 3.4 0 1 0 9 0a4.5 3.4 0 1 0 -9 0z', about: 'Ubuntu e sabedorias do continente africano' },
      'Sufismo': { d: 'M4.5 19.5L19.5 4.5M7 15.5l1.5 1.5M10 12.5l1.5 1.5M13 9.5l1.5 1.5M16.5 4l3.5 3.5', about: 'Rumi, Hafez e a mística do Islã' },
      'Sikhismo': { t: 'ੴ', tf: "'Noto Sans Gurmukhi', sans-serif", about: 'Guru Granth Sahib e os Gurus' },
      'Filosofia grega': { d: 'M3 9.5c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.5-1.5 5-.5M3 14.5c2.2-2 4.3-2 6.5 0s4.3 2 6.5 0 3.5-1.5 5-.5', about: 'Heráclito, Sócrates e Platão' }
    };
    const icon = (a) => {
      const g = SYM[a.name];
      return g.d ? { isSvg: true, isText: false, d: g.d, t: '', tf: '' } : { isSvg: false, isText: true, d: '', t: g.t, tf: g.tf };
    };
    const introIcons = AG.map((a, i) => {
      const rr = (-90 + i * 360 / AG.length) * Math.PI / 180;
      return Object.assign(icon(a), {
        color: a.color,
        style: `left: ${(130 + 130 * Math.cos(rr) - 14).toFixed(1)}px; top: ${(130 + 130 * Math.sin(rr) - 14).toFixed(1)}px; opacity: .75; animation-delay: ${(i * 0.12).toFixed(2)}s`
      });
    });
    const cx = 195, cy = 380, R = 146, N = AG.length;
    const ang = AG.map((a, i) => -90 + i * 360 / N);
    const rays = AG.map((a, i) => ({
      style: `left: ${cx}px; top: ${cy}px; width: ${R}px; transform: rotate(${ang[i]}deg); background-image: repeating-linear-gradient(90deg, ${a.color} 0 3px, transparent 3px 11px); opacity: ${s.lit > i || s.focus === i ? 0.85 : 0.06}`
    }));
    const councilAgents = AG.map((a, i) => {
      const on = s.lit > i;
      const foc = s.focus === i;
      const rad = ang[i] * Math.PI / 180;
      const x = cx + R * Math.cos(rad), y = cy + R * Math.sin(rad);
      return Object.assign(icon(a), {
        name: a.name, color: a.color,
        showName: foc || (s.focus < 0 && s.lit < N && s.lit - 1 === i),
        pick: () => this.setState({ focus: i }),
        style: `left: ${(x - 23).toFixed(1)}px; top: ${(y - 23).toFixed(1)}px; z-index: ${foc ? 2 : 1}; opacity: ${on ? 1 : 0.25}; transform: scale(${foc ? 1.14 : on ? 1 : 0.84}); border-color: ${on ? a.color : 'rgba(255,255,255,.14)'}; box-shadow: ${on ? '0 0 ' + (foc ? 44 : 28) + 'px ' + a.color + (foc ? '99' : '55') + ', inset 0 1px 0 rgba(255,255,255,.2)' : 'none'}`
      });
    });
    let councilStatus, councilSub, statusColor = 'rgba(244,241,234,.85)';
    if (s.focus >= 0) {
      councilStatus = AG[s.focus].name; councilSub = SYM[AG[s.focus].name].about; statusColor = AG[s.focus].color;
    } else if (s.lit < N) {
      councilStatus = `Refletindo: ${AG[s.lit].name}`; councilSub = SYM[AG[s.lit].name].about;
    } else {
      councilStatus = 'O Conselho está pronto'; councilSub = 'Toque em um símbolo para conhecer cada sabedoria';
    }

    const almaT = this.composeAlma();
    const FONTS = {
      latin: "font-family: 'Manrope', 'Noto Sans', sans-serif; font-size: 19px; font-weight: 300",
      hebrew: "font-family: 'Noto Sans Hebrew', sans-serif; font-size: 21px",
      arabic: "font-family: 'Noto Sans Arabic', sans-serif; font-size: 22px",
      deva: "font-family: 'Noto Sans Devanagari', sans-serif; font-size: 20px",
      han: "font-family: 'Noto Sans TC', sans-serif; font-size: 24px; letter-spacing: .08em",
      gurmukhi: "font-family: 'Noto Sans Gurmukhi', sans-serif; font-size: 21px"
    };
    let idx = AG.map((a, i) => i);
    if (s.filter === 'stars') idx = idx.filter((i) => s.stars.includes(i));
    else if (typeof s.filter === 'number') idx = [s.filter];
    const cards = idx.map((i, pos) => {
      const a = AG[i];
      const open = s.open === i;
      const on = s.stars.includes(i);
      const base = Math.min(pos, 5) * 180;
      return Object.assign(icon(a), {
        name: a.name, color: a.color, ref: a.ref, lang: a.lang, dir: a.dir, orig: a.orig,
        reflection: a.reflection, open, on, off: !on, pressed: on ? 'true' : 'false', expanded: open ? 'true' : 'false',
        origStyle: `${FONTS[a.script]}; color: ${a.color}; text-align: ${a.dir === 'rtl' ? 'right' : 'left'}; animation-delay: ${base + 150}ms`,
        glyphStyle: `border: 1px solid ${a.color}88; background: rgba(11,10,22,.6); box-shadow: 0 0 16px ${a.color}44`,
        style: `animation-delay: ${base}ms; ${on ? 'border-color: rgba(243,217,139,.5); box-shadow: 0 0 36px rgba(243,217,139,.12), inset 0 1px 0 rgba(255,255,255,.12)' : ''}`,
        chev: `transition: transform .5s ease; transform: rotate(${open ? 180 : 0}deg)`,
        words: a.tr.split(' ').map((w, j) => ({ w, style: `animation-delay: ${base + 500 + j * 45}ms` })),
        toggle: () => this.setState({ open: open ? -1 : i }),
        star: () => {
          const st = this.state.stars.slice();
          const k = st.indexOf(i);
          if (k >= 0) st.splice(k, 1); else st.push(i);
          this.setState({ stars: st, savedNow: false });
        }
      });
    });
    const FIL = [{ id: 'all', label: 'Todas as vozes', color: '#f4f1ea' }, { id: 'stars', label: `Estreladas · ${s.stars.length}`, color: '#f3d98b' }]
      .concat(AG.map((a, i) => ({ id: i, label: a.name, color: a.color })));
    const filters = FIL.map((f) => {
      const on = s.filter === f.id;
      return {
        label: f.label, color: f.color, pressed: on ? 'true' : 'false',
        style: on ? 'background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.5)' : 'background: rgba(255,255,255,.04); color: rgba(244,241,234,.75)',
        pick: () => this.setState({ filter: f.id, open: -1 })
      };
    });

    const P = [[40, 150], [120, 50], [205, 128], [270, 36], [168, 178], [60, 40]];
    const ents = s.entries;
    const openSheet = (i) => () => this.setState({ sheet: i, confirmDel: false });
    const skyStars = ents.map((e, i) => {
      const q = P[i % P.length];
      const col = KC[e.kind] || '#f3d98b';
      return {
        label: e.resolved ? 'resolvida' : e.date, aria: `Revisitar: ${e.q}`,
        style: `left: ${q[0]}px; top: ${q[1]}px`,
        dot: e.resolved ? `background: #fff4d1; box-shadow: 0 0 0 4px rgba(143,227,176,.22), 0 0 16px #f3d98b; animation-delay: -${(i * 0.7).toFixed(1)}s` : `background: ${col}; box-shadow: 0 0 12px ${col}, 0 0 28px ${col}88; animation-delay: -${(i * 0.7).toFixed(1)}s`,
        open: openSheet(i)
      };
    });
    const skyLines = [];
    for (let i = 1; i < ents.length; i++) {
      const a = P[(i - 1) % P.length], b = P[i % P.length];
      const x1 = a[0] + 32, y1 = a[1] + 27, x2 = b[0] + 32, y2 = b[1] + 27;
      const len = Math.hypot(x2 - x1, y2 - y1), dg = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      skyLines.push({ style: `left: ${x1}px; top: ${y1}px; width: ${len.toFixed(1)}px; transform: rotate(${dg.toFixed(1)}deg)` });
    }
    let nextStep = null;
    ents.forEach((e, i) => {
      if (e.resolved || !e.plan) return;
      e.plan.forEach((pp0, j) => {
        const pp = stepInfo(pp0);
        if (pp.done) return;
        if (!nextStep || pp.due < nextStep.due) {
          const rel = pp.due < 0 ? `atrasado há ${-pp.due} ${pp.due === -1 ? 'dia' : 'dias'}` : pp.due === 0 ? 'hoje' : pp.due === 1 ? 'amanhã' : `em ${pp.due} dias`;
          const col = KC[e.kind] || '#f3d98b';
          nextStep = {
            due: pp.due, t: pp.t, n: j + 1, total: e.plan.length, q: e.q, kind: e.kind,
            when: `${pp.date.replace('Hoje · ', '')} · ${rel}`,
            bell: pp.remind ? 'Lembrete ligado' : 'Sem lembrete', bellFill: pp.remind ? 'currentColor' : 'none',
            dot: `background: ${col}; box-shadow: 0 0 10px ${col}`,
            open: () => this.setState({ screen: 'plan', planIdx: i, planPrev: 'journal', sheet: -1 }),
            done: () => {
              this.updAt(i, (en) => { en.plan = en.plan.map((x, k) => k === j ? Object.assign({}, x, { done: true }) : x); return en; });
              this.flash(`Passo ${j + 1} concluído`);
            }
          };
        }
      });
    });
    const nRes = ents.filter((e) => e.resolved).length;
    const JF = [{ id: 'all', label: `Todas · ${ents.length}` }, { id: 'open', label: `Em aberto · ${ents.length - nRes}` }, { id: 'resolved', label: `Resolvidas · ${nRes}` }];
    const jfilters = JF.map((f) => {
      const on = s.jfilter === f.id;
      return {
        label: f.label, pressed: on ? 'true' : 'false',
        style: on ? 'background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.5)' : 'background: rgba(255,255,255,.04); color: rgba(244,241,234,.75)',
        pick: () => this.setState({ jfilter: f.id })
      };
    });
    const entryRows = ents.map((e, i) => ({ i, e })).reverse()
      .filter(({ e }) => s.jfilter === 'all' || (s.jfilter === 'resolved' ? e.resolved : !e.resolved))
      .map(({ i, e }) => {
        const col = KC[e.kind] || '#f3d98b';
        return {
          q: e.q, meta: `${e.date} · ${e.kind}${e.resolved ? ' · Resolvida' : (e.plan ? ' · Plano ' + e.plan.filter((x) => x.done).length + '/' + e.plan.length : '')}`, n: e.stars.length, resolved: !!e.resolved,
          rowStyle: e.resolved ? 'opacity: .75' : '',
          dot: e.resolved ? 'background: #fff4d1; box-shadow: 0 0 10px #f3d98b' : `background: ${col}; box-shadow: 0 0 12px ${col}`,
          open: openSheet(i)
        };
      });
    const se = s.sheet >= 0 ? ents[s.sheet] : null;
    const updEntry = (fn) => {
      const list = this.state.entries.slice();
      list[this.state.sheet] = fn(Object.assign({}, list[this.state.sheet]));
      this.setState({ entries: list });
    };
    const sheet = se ? {
      meta: `${se.date} · ${se.kind}${se.resolved ? ' · Resolvida' : ''}`, q: se.q, alma: se.alma, step: se.step,
      tags: se.tags.map((x) => ({ t: x })), n: se.stars.length, none: se.stars.length === 0,
      hasPlan: !!se.plan, noPlan: !se.plan,
      nextText: se.plan ? ((se.plan.find((x) => !x.done) || {}).t ? 'Próximo: ' + se.plan.find((x) => !x.done).t : 'Todos os passos concluídos') : '',
      progress: se.plan ? `${se.plan.filter((x) => x.done).length} de ${se.plan.length} passos` : '',
      barStyle: se.plan ? `width: ${Math.round(100 * se.plan.filter((x) => x.done).length / se.plan.length)}%` : 'width: 0%',
      plan: (se.plan || []).map((pp, j) => ({
        t: pp.t, date: pp.date, n: j + 1, done: pp.done, todo: !pp.done,
        pressed: pp.done ? 'true' : 'false', aria: `Passo ${j + 1}: marcar como concluído`, remindP: pp.remind ? 'true' : 'false',
        numStyle: pp.done ? 'background: #8fe3b0; box-shadow: 0 0 14px rgba(143,227,176,.6)' : 'border: 1px solid rgba(244,241,234,.4); color: rgba(244,241,234,.85)',
        textStyle: pp.done ? 'opacity: .5; text-decoration: line-through' : '',
        dateColor: pp.done ? 'rgba(244,241,234,.4)' : (pp.due <= 0 ? '#f3d98b' : 'rgba(244,241,234,.55)'),
        bellFill: pp.remind && !pp.done ? '#f3d98b' : 'none', bellStroke: pp.remind && !pp.done ? '#f3d98b' : 'rgba(244,241,234,.45)',
        toggle: () => updEntry((e) => { e.plan = e.plan.map((x, k) => k === j ? Object.assign({}, x, { done: !x.done }) : x); return e; }),
        bell: () => {
          updEntry((e) => { e.plan = e.plan.map((x, k) => k === j ? Object.assign({}, x, { remind: !x.remind }) : x); return e; });
          if (!pp.remind) this.flash(`Lembrete ativado: ${pp.date.replace('Hoje · ', '')}`);
        }
      })),
      stars: se.stars.map((st, j) => Object.assign({}, st, {
        remove: () => updEntry((e) => { e.stars = e.stars.filter((_, k) => k !== j); return e; })
      }))
    } : { meta: '', q: '', alma: '', step: '', tags: [], stars: [], n: 0, none: true };

    const scr = s.screen;
    return {
      vars, auroraA, auroraB, orbStyle, motes, thoughts, chips, dots, relWords,
      bars, dtags, dq: cq.q, qAnim: `animation: ${s.step % 2 ? 'qIn1' : 'qIn2'} .9s cubic-bezier(.2,.7,.2,1) both`, textShort,
      introIcons, isIntro: s.screen === 'intro', introA: s.pi % 2 === 0, introB: s.pi % 2 === 1,
      ph: (() => {
        const f = this.PH[s.pi % this.PH.length];
        const n = f.lines.length, mid = 0.6 + n * 0.9 + 0.3;
        return {
          kicker: s.pi === 0 ? 'Manifesto Alma' : 'Frase de hoje',
          lines: f.lines.map((t, i) => ({ t, style: `animation-delay: ${(0.6 + i * 0.9).toFixed(1)}s` })),
          mid: f.mid, gold: f.gold,
          midStyle: `animation-delay: ${mid.toFixed(1)}s`,
          goldStyle: `animation-delay: ${(mid + 1.1).toFixed(1)}s`,
          btnStyle: `animation-delay: ${(mid + 2.2).toFixed(1)}s`
        };
      })(),
      nextPhrase: () => this.setState({ pi: (this.state.pi + 1) % this.PH.length }),
      startJourney: () => {
        const a = this.state.auth;
        let skipped = false;
        try { skipped = localStorage.getItem('alma:skipLogin') === '1'; } catch (e) { /* sem armazenamento */ }
        if (a.enabled && !a.loggedIn && !skipped) this.setState({ screen: 'welcome', loginMsg: '' });
        else this.setState({ screen: 'breath', count: 0, inhale: true });
      },
      rays, councilAgents, councilStatus, councilSub, statusColor, councilReady: s.lit >= N,
      cards, filters, noCards: cards.length === 0,
      voicesOpen: s.voicesOpen, voicesClosed: !s.voicesOpen, voiceCount: AG.length,
      voiceSyms: AG.map((a, i) => Object.assign(icon(a), {
        name: a.name, color: a.color,
        border: s.stars.includes(i) ? 'rgba(243,217,139,.7)' : a.color + '44',
        pick: () => this.setState({ voicesOpen: true, filter: i, open: i })
      })),
      openVoices: () => this.setState({ voicesOpen: true, filter: 'all' }),
      closeVoices: () => this.setState({ voicesOpen: false, open: -1 }),
      almaP1: almaT.p1, almaP2: almaT.p2, almaStep: almaT.step,
      givenTags: s.ans.filter(Boolean).map((x) => ({ t: x })),
      starHint: s.stars.length ? `${s.stars.length} com estrela` : 'Marque as melhores com estrela',
      kindPhrase: ({ 'Pensamento': 'o seu pensamento', 'Dúvida': 'a sua dúvida', 'Aflição': 'a sua aflição', 'Medo': 'o seu medo', 'Alegria': 'a sua alegria', 'Sugestão': 'o seu pedido' })[s.kind],
      saveLabel: s.savedNow ? 'Guardado na sua constelação' : 'Guardar na minha Alma',
      saveStyle: s.savedNow ? 'opacity: .6' : 'box-shadow: 0 0 30px rgba(243,217,139,.22)',
      isPlan: scr === 'plan', pl: this.planView(),
      previewSteps: this.planFor(s.kind).slice(0, 3).map((x, i) => ({ n: i + 1, t: x.t })),
      previewMore: `+ ${this.planFor(s.kind).length - 3} passos, com datas e lembretes`,
      planCta: (s.savedNow && s.savedIdx >= 0 && ents[s.savedIdx] && ents[s.savedIdx].plan) ? 'Ver meu plano de ação' : 'Criar meu plano de ação',
      createPlan: () => {
        const st = this.state;
        let list = st.entries.slice(), idx = st.savedIdx;
        if (!st.savedNow || idx < 0 || !list[idx]) {
          const a = this.composeAlma();
          list.push({
            date: dayMonth(today()), at: Date.now(), kind: st.kind, q: st.text, tags: st.ans.filter(Boolean), resolved: false, plan: null,
            alma: a.p1 + ' ' + a.p2, step: a.step,
            stars: st.stars.map((i) => ({ name: this.AG[i].name, ref: this.AG[i].ref, color: this.AG[i].color, tr: this.AG[i].tr }))
          });
          idx = list.length - 1;
        }
        if (!list[idx].plan) list[idx] = Object.assign({}, list[idx], { plan: this.planFor(list[idx].kind) });
        this.setState({ entries: list, savedNow: true, savedIdx: idx, screen: 'plan', planIdx: idx, planPrev: 'answers' });
      },
      openPlanFromSheet: () => this.setState({ screen: 'plan', planIdx: this.state.sheet, planPrev: 'journal', sheet: -1 }),
      makePlanFromSheet: () => {
        const k = this.state.sheet;
        updEntry((e) => { e.plan = this.planFor(e.kind); return e; });
        this.setState({ screen: 'plan', planIdx: k, planPrev: 'journal', sheet: -1 });
      },
      hasNext: !!nextStep, next: nextStep || { t: '', n: '', total: '', q: '', kind: '', when: '', bell: '', bellFill: 'none', dot: '', open: () => {}, done: () => {} },
      makePlan: () => updEntry((e) => { e.plan = this.planFor(e.kind); return e; }),
      skyStars, skyLines, entryRows, jfilters, noEntries: entryRows.length === 0, sheet, sheetOpen: s.sheet >= 0, entryCount: ents.length,
      resolveLabel: se && se.resolved ? 'Reabrir esta pergunta' : 'Já resolvi',
      resolveStyle: se && se.resolved ? '' : 'border-color: rgba(143,227,176,.45); background: rgba(143,227,176,.08)',
      confirmOn: s.confirmDel, confirmOff: !s.confirmDel,
      toggleResolved: () => {
        const was = !!(this.state.entries[this.state.sheet] || {}).resolved;
        updEntry((e) => { e.resolved = !was; return e; });
        if (!was) this.flash('Que bom. Essa estrela agora brilha em paz');
      },
      askDelete: () => this.setState({ confirmDel: true }),
      cancelDelete: () => this.setState({ confirmDel: false }),
      doDelete: () => {
        const k = this.state.sheet;
        const wasToday = k === this.state.savedIdx;
        const si = this.state.savedIdx;
        this.setState({ entries: this.state.entries.filter((_, i) => i !== k), sheet: -1, confirmDel: false, savedNow: wasToday ? false : this.state.savedNow, savedIdx: k === si ? -1 : (k < si ? si - 1 : si) });
        this.flash('Estrela apagada do seu céu');
      },
      showOtherBtn: !s.other, otherOpen: s.other, otherText: s.otherText,
      openOther: () => this.setState({ other: true }),
      onOther: (e) => this.setState({ otherText: e.target.value.slice(0, 120) }),
      submitOther: () => {
        const v = (this.state.otherText || '').trim();
        if (!v) return;
        const ans = this.state.ans.slice();
        ans[this.state.step] = v;
        this.setState({ ans });
        this.advance();
      },
      text: s.text, moodLabel: M.label,
      qLabel: s.fromWhere ? `Trazido do ${s.fromWhere} · edite se quiser` : 'Escreva do seu jeito',
      qLabelStyle: s.fromWhere ? 'color: #c9b8ff' : '',
      isBreath: scr === 'breath', isAsk: scr === 'ask', isRelease: scr === 'releasing', isDeepen: scr === 'deepen',
      isCouncil: scr === 'council', isAnswers: scr === 'answers', isJournal: scr === 'journal',
      compactHeader: scr === 'answers' || scr === 'journal' || scr === 'plan',
      showBack: scr === 'journal' || scr === 'plan', showWord: scr !== 'journal' && scr !== 'plan', showJournal: scr === 'ask' || scr === 'answers',
      breathWord: s.inhale ? 'Inspire' : 'Solte',
      breathWordStyle: s.inhale ? 'letter-spacing: .14em; color: #f4f1ea' : 'letter-spacing: .02em; color: rgba(244,241,234,.8)',
      breathSub: s.medit ? 'Com o que depende de você, inspire. Com o que não depende, solte. Fique o tempo que precisar.' : 'Três respirações antes de perguntar. A Alma escuta melhor no silêncio.',
      breathReady: s.medit || s.count >= 3, showSkip: !s.medit && s.count < 3,
      breathCta: s.medit ? 'Voltar ao Conselho' : 'Entrar',
      toastOn: !!s.toast, toast: s.toast,
      onMove: (e) => {
        const r = e.currentTarget.getBoundingClientRect();
        this.setState({ tx: ((e.clientX - r.left) / r.width - 0.5) * 2, ty: ((e.clientY - r.top) / r.height - 0.5) * 2 });
      },
      onText: (e) => this.setState({ text: e.target.value }),
      enter: () => this.setState({ screen: 'ask' }),
      breathDone: () => this.setState(this.state.medit ? { screen: 'answers', medit: false } : { screen: 'ask' }),
      release: () => {
        if (!(this.state.text || '').trim()) return;
        this.setState({ screen: 'releasing', step: 0, ans: [null, null, null] });
        clearTimeout(this.t1);
        this.t1 = setTimeout(() => this.setState({ screen: 'deepen' }), 3000);
      },
      skipQ: () => this.advance(),
      hear: () => this.setState({ screen: 'answers', open: -1, filter: 'all', voicesOpen: false }),
      meditate: () => this.setState({ screen: 'breath', medit: true, count: 0 }),
      share: () => this.flash('Card de compartilhamento pronto'),
      saveEntry: () => {
        if (this.state.savedNow) return;
        const st = this.state;
        const a = this.composeAlma();
        const entry = {
          date: dayMonth(today()), at: Date.now(), kind: st.kind, q: st.text, tags: st.ans.filter(Boolean), resolved: false, plan: null,
          alma: a.p1 + ' ' + a.p2, step: a.step,
          stars: st.stars.map((i) => ({ name: this.AG[i].name, ref: this.AG[i].ref, color: this.AG[i].color, tr: this.AG[i].tr }))
        };
        this.setState({ entries: st.entries.concat([entry]), savedNow: true, savedIdx: st.entries.length });
        this.flash('Uma nova estrela na sua constelação');
      },
      openJournal: () => this.setState({ prev: this.state.screen, screen: 'journal', sheet: -1 }),
      back: () => this.setState(this.state.screen === 'plan' ? { screen: this.state.planPrev || 'journal' } : { screen: this.state.prev || 'ask', sheet: -1 }),
      closeSheet: () => this.setState({ sheet: -1, confirmDel: false }),
      restart: () => this.setState({ screen: 'ask', open: -1, lit: 0, stars: [], filter: 'all', savedNow: false, ans: [null, null, null], step: 0, text: '', fromWhere: '' })
    };
  }
}

Object.assign(Component.prototype, {
  componentDidUpdate(pp, ps) {
    if (ps.entries !== this.state.entries) save({ entries: this.state.entries });
  },
  checkHandoff() {
    try {
      const raw = localStorage.getItem('alma-handoff');
      if (!raw) return;
      localStorage.removeItem('alma-handoff');
      const h = JSON.parse(raw);
      if (h && h.q && Date.now() - h.at < 10 * 60 * 1000) {
        this.setState({ screen: 'ask', text: h.q, kind: 'Pensamento', fromWhere: h.from, ans: [null, null, null], step: 0, stars: [], savedNow: false, sheet: -1 });
      }
    } catch (e) { /* sem armazenamento */ }
  },
  async sendLink() {
    const email = (this.state.loginEmail || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { this.setState({ loginMsg: 'Digite um e-mail válido.' }); return; }
    this.setState({ loginMsg: 'Enviando...' });
    const r = await sendMagicLink(email);
    this.setState({ loginMsg: r.error ? r.error : 'Pronto. Abra o link que enviamos para ' + email + ' neste aparelho.' });
  },
  renderWelcome() {
    const skip = () => { try { localStorage.setItem('alma:skipLogin', '1'); } catch (e) { /* sem armazenamento */ } this.setState({ screen: 'breath', count: 0, inhale: true }); };
    const G = (
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>
    );
    const perks = [['#c9b8ff', 'Sua constelação de perguntas, estrelas e planos'], ['#a8d8ff', 'Seu diário, sonhos e post-its'], ['#f3d98b', 'Seu mapa natal e suas leituras']];
    return (
      <div className="screen">
        <div style={css('position: absolute; inset: 0; box-sizing: border-box; padding: 290px 24px 28px; display: flex; flex-direction: column; gap: 14px')}>
          <div style={css('display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center')}>
            <span className="kicker">Bem-vindo à Alma</span>
            <h1 style={css('margin: 0; font-size: 26px; line-height: 1.25; font-weight: 300')}>Guarde a sua jornada<br />em qualquer aparelho</h1>
          </div>
          <div style={css('display: flex; flex-direction: column; gap: 8px; margin: 4px 0 6px')}>
            {perks.map((p, i) => (
              <span key={i} className="fade" style={css(`display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.82); animation-delay: ${0.3 + i * 0.15}s`)}>
                <i style={css(`width: 8px; height: 8px; border-radius: 50%; background: ${p[0]}; box-shadow: 0 0 10px ${p[0]}; flex-shrink: 0`)} />{p[1]}
              </span>
            ))}
          </div>
          <button className="cta" onClick={async () => { const r = await signInWithGoogle(); if (r.error) this.setState({ loginMsg: r.error }); }} style={css('height: 54px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; font-weight: 500; color: #1f1f1f; background: #ffffff; box-shadow: 0 0 30px rgba(255,255,255,.15)')}>
            {G}Continuar com Google
          </button>
          <div style={css('display: flex; align-items: center; gap: 10px; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,234,.4)')}>
            <span style={css('flex-grow: 1; height: 1px; background: rgba(255,255,255,.12)')} />ou com e-mail<span style={css('flex-grow: 1; height: 1px; background: rgba(255,255,255,.12)')} />
          </div>
          <div style={css('display: flex; gap: 8px')}>
            <input type="email" value={this.state.loginEmail} onChange={(e) => this.setState({ loginEmail: e.target.value, loginMsg: '' })} placeholder="seu@email.com" aria-label="Seu e-mail" style={css('flex-grow: 1; min-width: 0; height: 50px; padding: 0 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.06); color: #f4f1ea; font: inherit; font-size: 15px; outline: none')} />
            <button className="cta" onClick={() => this.sendLink()} style={css('flex-shrink: 0; height: 50px; padding: 0 18px; border-radius: 999px; font-size: 14px; font-weight: 500; color: #1a1030; background: linear-gradient(120deg, #c9b8ff, #efe8ff 50%, #b8d8ff)')}>Enviar link</button>
          </div>
          {this.state.loginMsg ? <span style={css('text-align: center; font-size: 12px; line-height: 1.5; color: #f3d98b')}>{this.state.loginMsg}</span> : <span style={css('text-align: center; font-size: 12px; line-height: 1.5; color: rgba(244,241,234,.5)')}>Sem senha: enviamos um link de acesso para o seu e-mail.</span>}
          <div style={css('flex-grow: 1')} />
          <button onClick={skip} style={css('height: 44px; align-self: center; padding: 0 18px; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.7)')}>Continuar sem conta</button>
          <span style={css('text-align: center; font-size: 11px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.42)')}>Sem conta, tudo fica salvo só neste aparelho. Você pode entrar depois na sua constelação.</span>
        </div>
      </div>
    );
  },
  renderLogin() {
    const a = this.state.auth;
    if (a.loggedIn) {
      return (
        <div style={css('border-radius: 18px; padding: 12px 16px; background: rgba(143,227,176,.07); border: 1px solid rgba(143,227,176,.25); display: flex; align-items: center; gap: 10px')}>
          <span style={css('flex-grow: 1; font-size: 13px; font-weight: 300; color: rgba(244,241,234,.8)')}>Constelação salva na nuvem · {a.email}</span>
          <button onClick={() => signOut()} style={css('height: 36px; padding: 0 12px; font-size: 12px; color: rgba(244,241,234,.7)')}>Sair</button>
        </div>
      );
    }
    return (
      <div className="glass" style={css('border-radius: 22px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px')}>
        <span className="kicker" style={css('color: #c9b8ff')}>Guarde sua constelação</span>
        <span style={css('font-size: 13px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.75)')}>Entre com seu e-mail para ver suas perguntas, estrelas e planos em qualquer aparelho. Sem senha: enviamos um link de acesso.</span>
        {a.enabled ? (
          <>
            <button className="cta" onClick={async () => { const r = await signInWithGoogle(); if (r.error) this.setState({ loginMsg: r.error }); }} style={css('height: 46px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 14px; font-weight: 500; color: #1f1f1f; background: #ffffff')}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.4 13.7 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.1 24.6c0-1.6-.1-3.1-.4-4.6H24v9h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-17z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.2-13.5-10l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>
              Continuar com Google
            </button>
            <span style={css('text-align: center; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,234,.4)')}>ou</span>
            <input type="email" value={this.state.loginEmail} onChange={(e) => this.setState({ loginEmail: e.target.value, loginMsg: '' })} placeholder="seu@email.com" aria-label="Seu e-mail" style={css('height: 46px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.05); color: #f4f1ea; font: inherit; font-size: 15px; outline: none')} />
            <button className="cta" onClick={() => this.sendLink()} style={css('height: 46px; border-radius: 999px; font-size: 14px; font-weight: 500; color: #1a1030; background: linear-gradient(120deg, #c9b8ff, #efe8ff 50%, #b8d8ff)')}>Enviar link de acesso</button>
          </>
        ) : (
          <span style={css('font-size: 12px; color: rgba(244,241,234,.5)')}>Por enquanto, tudo fica salvo neste aparelho.</span>
        )}
        {this.state.loginMsg ? <span style={css('font-size: 12px; line-height: 1.5; color: #f3d98b')}>{this.state.loginMsg}</span> : null}
      </div>
    );
  }
});

Component.prototype.render = function render() {
  const R = this.renderVals();
  return (
    <div className="sc-main">
      <div className="alma" style={css(`width: 390px; height: 844px; position: relative; overflow: hidden; background: #0b0a16; ${(R.vars) ?? ''}`)} onMouseMove={R.onMove}>
        <div className="aurora" style={css(`width: 420px; height: 420px; left: -160px; top: -120px; background: var(--m2); ${(R.auroraA) ?? ''}`)}></div>
        <div className="aurora" style={css(`width: 380px; height: 380px; right: -170px; bottom: -110px; background: var(--m1); animation-duration: 23s; ${(R.auroraB) ?? ''}`)}></div>
        <div className="aurora" style={css("width: 260px; height: 260px; left: 120px; top: 420px; background: var(--m3); opacity: .2; animation-duration: 29s")}></div>
        {(R.motes || []).map((L1_m, I1) => (
          <React.Fragment key={I1}>
            <div className="mote" style={css(L1_m?.style)}></div>
          </React.Fragment>
        ))}
        {R.compactHeader ? (
          <>
            <div style={css("position: absolute; top: 0; left: 0; right: 0; height: 112px; z-index: 3; pointer-events: none; background: linear-gradient(180deg, #0b0a16 55%, rgba(11,10,22,0))")}></div>
          </>
        ) : null}
        <div className="orbwrap" style={css(R.orbStyle)}>
          <div className="halo"></div>
          <div className="ring"></div>
          <div className="ring ring2"></div>
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <div className="blob b3"></div>
          <div className="shell"></div>
        </div>
        <div style={css("position: absolute; top: 36px; left: 12px; right: 12px; height: 44px; z-index: 5; display: flex; align-items: center; justify-content: space-between; pointer-events: none")}>
          {R.showBack ? (
            <>
              <button onClick={R.back} aria-label="Voltar" style={css("pointer-events: auto; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
            </>
          ) : null}
          {R.showWord ? (
            <>
              <span style={css("padding-left: 10px; font-size: 16px; font-weight: 300; letter-spacing: .38em; color: rgba(244,241,234,.85)")}>
                {"alma"}
              </span>
            </>
          ) : null}
          {R.showJournal ? (
            <>
              <span style={css("display: flex; align-items: center; gap: 2px; pointer-events: auto")}>
                <a href="#/diario" aria-label="Meu diário" style={css("width: 44px; height: 44px; display: flex; align-items: center; justify-content: center")}>
                  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#a8d8ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                    <path d="M3.5 10h17M8 3v4M16 3v4" />
                    <circle cx="15.5" cy="15" r="2.2" fill="#f4efe0" stroke="none" />
                  </svg>
                </a>
                <a href="Simbolos.dc.html" aria-label="Céu e Símbolos" style={css("width: 44px; height: 44px; display: flex; align-items: center; justify-content: center")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9b8ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
                    <path d="M17 3.5l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="#f3d98b" stroke="#f3d98b" />
                  </svg>
                </a>
                <button onClick={R.openJournal} aria-label="Minha constelação" style={css("pointer-events: auto; height: 44px; padding: 0 12px; display: flex; align-items: center; gap: 8px; border-radius: 999px; font-size: 13px; color: rgba(244,241,234,.85)")}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f3d98b" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 17L11 7L19 12" opacity=".55" />
                    <circle cx="5" cy="17" r="1.8" fill="#f3d98b" />
                    <circle cx="11" cy="7" r="1.8" fill="#f3d98b" />
                    <circle cx="19" cy="12" r="1.8" fill="#f3d98b" />
                  </svg>
                  <span>
                    {R.entryCount}
                  </span>
                </button>
              </span>
            </>
          ) : null}
        </div>
        {R.isIntro ? (
          <>
            <div className="screen">
              <div className="orbit" aria-hidden="true" style={css("position: absolute; left: 65px; top: 170px; width: 260px; height: 260px")}>
                {(R.introIcons || []).map((L2_a, I2) => (
                  <React.Fragment key={I2}>
                    <span className="fade" style={css(`position: absolute; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; ${(L2_a?.style) ?? ''}`)}>
                      {L2_a?.isSvg ? (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={L2_a?.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                            <path d={L2_a?.d} />
                          </svg>
                        </>
                      ) : null}
                      {L2_a?.isText ? (
                        <>
                          <span style={css(`font-family: ${(L2_a?.tf) ?? ''}; font-size: 16px; line-height: 1; color: ${(L2_a?.color) ?? ''}`)}>
                            {L2_a?.t}
                          </span>
                        </>
                      ) : null}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              {R.introA ? (
                <>
                  <div style={css("position: absolute; top: 450px; left: 28px; right: 28px; display: flex; flex-direction: column; align-items: center; text-align: center")}>
                    <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                      {(R.ph?.lines || []).map((L3_l, I3) => (
                        <React.Fragment key={I3}>
                          <p className="fade" style={css(`margin: 0; font-size: 25px; font-weight: 300; line-height: 1.28; letter-spacing: -.01em; ${(L3_l?.style) ?? ''}`)}>
                            {L3_l?.t}
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="fade" style={css(`margin: 20px 0 0; font-size: 16px; font-weight: 200; letter-spacing: .05em; color: rgba(244,241,234,.78); ${(R.ph?.midStyle) ?? ''}`)}>
                      {R.ph?.mid}
                    </p>
                    <div className="fade" style={css(`margin-top: 6px; ${(R.ph?.goldStyle) ?? ''}`)}>
                      <span className="goldtext" style={css("font-size: 19px; font-weight: 400; letter-spacing: .01em")}>
                        {R.ph?.gold}
                      </span>
                    </div>
                  </div>
                  <div className="fade" style={css(`position: absolute; top: 706px; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; ${(R.ph?.btnStyle) ?? ''}`)}>
                    <button className="glass cta" onClick={R.startJourney} style={css("height: 56px; padding: 0 48px; border-radius: 999px; font-size: 16px; letter-spacing: .06em")}>
                      {"Começar"}
                    </button>
                    <button onClick={R.nextPhrase} style={css("height: 44px; padding: 0 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(244,241,234,.6)")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 12a8 8 0 1 1-2.4-5.7" />
                        <path d="M20 4v5h-5" />
                      </svg>
                      {"Outra frase"}
                    </button>
                  </div>
                </>
              ) : null}
              {R.introB ? (
                <>
                  <div style={css("position: absolute; top: 450px; left: 28px; right: 28px; display: flex; flex-direction: column; align-items: center; text-align: center")}>
                    <div style={css("display: flex; flex-direction: column; gap: 2px")}>
                      {(R.ph?.lines || []).map((L4_l, I4) => (
                        <React.Fragment key={I4}>
                          <p className="fade" style={css(`margin: 0; font-size: 25px; font-weight: 300; line-height: 1.28; letter-spacing: -.01em; ${(L4_l?.style) ?? ''}`)}>
                            {L4_l?.t}
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="fade" style={css(`margin: 20px 0 0; font-size: 16px; font-weight: 200; letter-spacing: .05em; color: rgba(244,241,234,.78); ${(R.ph?.midStyle) ?? ''}`)}>
                      {R.ph?.mid}
                    </p>
                    <div className="fade" style={css(`margin-top: 6px; ${(R.ph?.goldStyle) ?? ''}`)}>
                      <span className="goldtext" style={css("font-size: 19px; font-weight: 400; letter-spacing: .01em")}>
                        {R.ph?.gold}
                      </span>
                    </div>
                  </div>
                  <div className="fade" style={css(`position: absolute; top: 706px; left: 0; right: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; ${(R.ph?.btnStyle) ?? ''}`)}>
                    <button className="glass cta" onClick={R.startJourney} style={css("height: 56px; padding: 0 48px; border-radius: 999px; font-size: 16px; letter-spacing: .06em")}>
                      {"Começar"}
                    </button>
                    <button onClick={R.nextPhrase} style={css("height: 44px; padding: 0 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(244,241,234,.6)")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 12a8 8 0 1 1-2.4-5.7" />
                        <path d="M20 4v5h-5" />
                      </svg>
                      {"Outra frase"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        {this.state.screen === 'welcome' ? this.renderWelcome() : null}
        {R.isBreath ? (
          <>
            <div className="screen">
              <div className="breathword" style={css(`position: absolute; top: 478px; left: 0; right: 0; text-align: center; font-size: 42px; font-weight: 200; ${(R.breathWordStyle) ?? ''}`)}>
                {R.breathWord}
              </div>
              <p style={css("position: absolute; top: 546px; left: 44px; right: 44px; margin: 0; text-align: center; font-size: 15px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.66)")}>
                {R.breathSub}
              </p>
              <div style={css("position: absolute; top: 636px; left: 0; right: 0; display: flex; justify-content: center; gap: 12px")}>
                {(R.dots || []).map((L5_d, I5) => (
                  <React.Fragment key={I5}>
                    <span className="dot" style={css(`width: 7px; height: 7px; border-radius: 50%; ${(L5_d?.style) ?? ''}`)}></span>
                  </React.Fragment>
                ))}
              </div>
              {R.breathReady ? (
                <>
                  <div className="fade" style={css("position: absolute; top: 676px; left: 0; right: 0; display: flex; justify-content: center")}>
                    <button className="glass cta" onClick={R.breathDone} style={css("height: 56px; padding: 0 44px; border-radius: 999px; font-size: 16px; font-weight: 400; letter-spacing: .06em")}>
                      {R.breathCta}
                    </button>
                  </div>
                </>
              ) : null}
              {R.showSkip ? (
                <>
                  <div style={css("position: absolute; top: 760px; left: 0; right: 0; display: flex; justify-content: center")}>
                    <button onClick={R.enter} style={css("height: 44px; padding: 0 20px; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: rgba(244,241,234,.55)")}>
                      {"Pular"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        {R.isAsk ? (
          <>
            <div className="screen">
              {(R.thoughts || []).map((L6_t, I6) => (
                <React.Fragment key={I6}>
                  <span className="thought" style={css(L6_t?.style)}>
                    {L6_t?.w}
                  </span>
                </React.Fragment>
              ))}
              <div style={css("position: absolute; inset: 0; box-sizing: border-box; padding: 252px 20px 28px; display: flex; flex-direction: column; gap: 20px")}>
                <div style={css("display: flex; flex-direction: column; align-items: center; gap: 10px")}>
                  <div className="kicker">
                    {"A Alma sente "}
                    <span style={css("color: var(--m1); transition: color 1.8s ease")}>
                      {R.moodLabel}
                    </span>
                  </div>
                  <h1 style={css("margin: 0; text-align: center; font-size: 29px; line-height: 1.2; font-weight: 300; letter-spacing: -.01em")}>
                    {"O que pesa ou ilumina"}
                    <br />
                    {"você hoje?"}
                  </h1>
                </div>
                <div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
                  {(R.chips || []).map((L7_c, I7) => (
                    <React.Fragment key={I7}>
                      <button className="pill" onClick={L7_c?.pick} aria-pressed={L7_c?.pressed} style={css(`height: 44px; border-radius: 999px; font-size: 14px; font-weight: 400; text-align: center; border: 1px solid rgba(255,255,255,.14); ${(L7_c?.style) ?? ''}`)}>
                        {L7_c?.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className="glass" style={css("height: 158px; border-radius: 26px; box-sizing: border-box; padding: 16px 20px; display: flex; flex-direction: column; gap: 8px")}>
                  <label htmlFor="alma-q" className="kicker" style={css(`font-size: 10px; ${(R.qLabelStyle) ?? ''}`)}>
                    {R.qLabel}
                  </label>
                  <textarea id="alma-q" value={R.text} onChange={R.onText} placeholder="Uma dúvida, um medo, uma alegria. Ninguém está com pressa aqui." style={css("flex-grow: 1; font-size: 18px; font-weight: 300; line-height: 1.45")}></textarea>
                </div>
                <div style={css("display: flex; flex-direction: column; align-items: center; gap: 12px")}>
                  <button className="cta" onClick={R.release} style={css("width: 100%; height: 58px; border-radius: 999px; font-size: 17px; font-weight: 500; letter-spacing: .02em; text-align: center; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); box-shadow: 0 0 30px rgba(243,217,139,.22)")}>
                    {"Soltar para a Alma"}
                  </button>
                  <span style={css("font-size: 12px; font-weight: 300; color: rgba(244,241,234,.5)")}>
                    {"Catorze sabedorias vão refletir com você"}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {R.isRelease ? (
          <>
            <div className="screen">
              <div style={css("position: absolute; top: 470px; left: 0; right: 0; text-align: center; font-size: 22px; font-weight: 200; letter-spacing: .04em; color: rgba(244,241,234,.9)")}>
                {"A Alma está ouvindo"}
              </div>
              <div style={css("position: absolute; top: 528px; left: 36px; right: 36px; text-align: center; font-size: 19px; font-weight: 300; line-height: 1.5")}>
                {(R.relWords || []).map((L8_w, I8) => (
                  <React.Fragment key={I8}>
                    <span className="rise" style={css(L8_w?.style)}>
                      {L8_w?.w}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {R.isDeepen ? (
          <>
            <div className="screen scroll" style={css("overflow-y: auto")}>
              <div style={css("min-height: 844px; box-sizing: border-box; padding: 246px 24px 24px; display: flex; flex-direction: column; gap: 20px")}>
                <div style={css("display: flex; flex-direction: column; align-items: center; gap: 12px")}>
                  <div className="kicker">
                    {"Antes de responder"}
                  </div>
                  <div style={css("display: flex; gap: 6px")}>
                    {(R.bars || []).map((L9_b, I9) => (
                      <React.Fragment key={I9}>
                        <span className="bar" style={css(`width: 36px; height: 3px; border-radius: 3px; ${(L9_b?.style) ?? ''}`)}></span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={css(`display: flex; flex-direction: column; gap: 22px; ${(R.qAnim) ?? ''}`)}>
                  <h2 style={css("margin: 0; text-align: center; font-size: 26px; line-height: 1.25; font-weight: 300")}>
                    {R.dq}
                  </h2>
                  <div style={css("display: flex; flex-wrap: wrap; justify-content: center; gap: 10px")}>
                    {(R.dtags || []).map((L10_t, I10) => (
                      <React.Fragment key={I10}>
                        <button className="pill" onClick={L10_t?.pick} aria-pressed={L10_t?.pressed} style={css(`height: 46px; padding: 0 20px; border-radius: 999px; font-size: 15px; font-weight: 400; border: 1px solid rgba(255,255,255,.16); ${(L10_t?.style) ?? ''}`)}>
                          {L10_t?.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                  {R.showOtherBtn ? (
                    <>
                      <button className="pill" onClick={R.openOther} style={css("align-self: center; height: 44px; padding: 0 18px; border-radius: 999px; display: flex; align-items: center; gap: 8px; font-size: 14px; color: rgba(244,241,234,.75); border: 1px dashed rgba(255,255,255,.28)")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 20h4L19 9l-4-4L4 16z" />
                          <path d="M13.5 6.5l4 4" />
                        </svg>
                        {"Responder com minhas palavras"}
                      </button>
                    </>
                  ) : null}
                  {R.otherOpen ? (
                    <>
                      <div className="glass fade" style={css("border-radius: 22px; padding: 12px 12px 12px 18px; display: flex; align-items: flex-end; gap: 10px")}>
                        <textarea rows="2" aria-label="Sua resposta" value={R.otherText} onChange={R.onOther} placeholder="Em até duas linhas, do seu jeito" style={css("flex-grow: 1; height: 50px; font-size: 16px; font-weight: 300; line-height: 1.55")}></textarea>
                        <button onClick={R.submitOther} aria-label="Continuar" style={css("width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: linear-gradient(120deg, #f3d98b, #ffc79a)")}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1408" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={css("flex-grow: 1")}></div>
                <div className="glass" style={css("border-radius: 20px; padding: 14px 18px")}>
                  <div className="kicker" style={css("font-size: 10px")}>
                    {"Você trouxe"}
                  </div>
                  <p style={css("margin: 6px 0 0; font-size: 14px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.78)")}>
                    {R.textShort}
                  </p>
                </div>
                <button onClick={R.skipQ} style={css("height: 44px; align-self: center; padding: 0 20px; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: rgba(244,241,234,.5)")}>
                  {"Pular pergunta"}
                </button>
              </div>
            </div>
          </>
        ) : null}
        {R.isCouncil ? (
          <>
            <div className="screen">
              <h1 style={css("position: absolute; top: 104px; left: 0; right: 0; margin: 0; text-align: center; font-size: 32px; font-weight: 200; letter-spacing: .02em")}>
                {"O Conselho"}
              </h1>
              <p style={css("position: absolute; top: 152px; left: 40px; right: 40px; margin: 0; text-align: center; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                {"Catorze sabedorias refletem sobre o que você trouxe"}
              </p>
              <div style={css("position: absolute; left: 49px; top: 234px; width: 292px; height: 292px; border-radius: 50%; border: 1px solid rgba(255,255,255,.07)")}></div>
              {(R.rays || []).map((L11_r, I11) => (
                <React.Fragment key={I11}>
                  <div className="ray" style={css(L11_r?.style)}></div>
                </React.Fragment>
              ))}
              {(R.councilAgents || []).map((L12_a, I12) => (
                <React.Fragment key={I12}>
                  <button className="agent glass" onClick={L12_a?.pick} onMouseEnter={L12_a?.pick} aria-label={L12_a?.name} style={css(L12_a?.style)}>
                    {L12_a?.isSvg ? (
                      <>
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={L12_a?.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={L12_a?.d} />
                        </svg>
                      </>
                    ) : null}
                    {L12_a?.isText ? (
                      <>
                        <span aria-hidden="true" style={css(`font-family: ${(L12_a?.tf) ?? ''}; font-size: 19px; line-height: 1; font-weight: 300; color: ${(L12_a?.color) ?? ''}`)}>
                          {L12_a?.t}
                        </span>
                      </>
                    ) : null}
                    {L12_a?.showName ? (
                      <>
                        <span className="fade" style={css(`position: absolute; top: 54px; left: 50%; transform: translateX(-50%); height: 26px; padding: 0 12px; border-radius: 999px; display: flex; align-items: center; white-space: nowrap; font-size: 12px; letter-spacing: .04em; background: rgba(22,20,40,.85); border: 1px solid ${(L12_a?.color) ?? ''}; color: #f4f1ea; pointer-events: none`)}>
                          {L12_a?.name}
                        </span>
                      </>
                    ) : null}
                  </button>
                </React.Fragment>
              ))}
              <div style={css("position: absolute; top: 562px; left: 24px; right: 24px; display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center")}>
                <span style={css(`font-size: 18px; font-weight: 300; color: ${(R.statusColor) ?? ''}; transition: color .6s ease`)}>
                  {R.councilStatus}
                </span>
                <span style={css("font-size: 13px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                  {R.councilSub}
                </span>
              </div>
              {R.councilReady ? (
                <>
                  <div className="fade" style={css("position: absolute; top: 640px; left: 20px; right: 20px")}>
                    <button className="cta" onClick={R.hear} style={css("width: 100%; height: 58px; border-radius: 999px; font-size: 17px; font-weight: 500; text-align: center; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); box-shadow: 0 0 30px rgba(243,217,139,.22)")}>
                      {"Ouvir o Conselho"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        {R.isAnswers ? (
          <>
            <div className="screen scroll" style={css("overflow-y: auto")}>
              <div style={css("box-sizing: border-box; padding: 108px 20px 56px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"O Conselho respondeu"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 28px; line-height: 1.2; font-weight: 300")}>
                    {`Catorze vozes para ${(R.kindPhrase) ?? ''}`}
                  </h1>
                </div>
                <div className="glass" style={css("border-radius: 22px; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px")}>
                  <div className="kicker" style={css("font-size: 10px")}>
                    {"Você trouxe"}
                  </div>
                  <p style={css("margin: 0; font-size: 15px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.88)")}>
                    {R.text}
                  </p>
                  <div style={css("display: flex; flex-wrap: wrap; gap: 6px")}>
                    {(R.givenTags || []).map((L13_g, I13) => (
                      <React.Fragment key={I13}>
                        <span style={css("height: 26px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; background: rgba(255,255,255,.08); color: rgba(244,241,234,.8)")}>
                          {L13_g?.t}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="glass cardin" style={css("border-radius: 26px; padding: 22px 20px; position: relative; overflow: hidden; border-color: rgba(243,217,139,.36)")}>
                  <div className="goldglow"></div>
                  <div className="goldtext" style={css("position: relative; font-size: 11px; letter-spacing: .26em; text-transform: uppercase")}>
                    {"A resposta da Alma"}
                  </div>
                  <p style={css("position: relative; margin: 12px 0 0; font-size: 17px; font-weight: 300; line-height: 1.55")}>
                    {R.almaP1}
                  </p>
                  <p style={css("position: relative; margin: 10px 0 0; font-size: 15px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.82)")}>
                    {R.almaP2}
                  </p>
                  <div style={css("position: relative; margin-top: 16px; padding: 14px 16px; border-radius: 18px; background: rgba(243,217,139,.08); border: 1px solid rgba(243,217,139,.2)")}>
                    <div style={css("font-size: 10px; letter-spacing: .2em; text-transform: uppercase; color: #f3d98b")}>
                      {"Um passo possível"}
                    </div>
                    <p style={css("margin: 6px 0 0; font-size: 14px; font-weight: 400; line-height: 1.55")}>
                      {R.almaStep}
                    </p>
                  </div>
                </div>
                <div className="glass cardin" style={css("border-radius: 26px; padding: 22px 20px 20px; border-color: rgba(143,227,176,.4); box-shadow: 0 0 40px rgba(143,227,176,.08), inset 0 1px 0 rgba(255,255,255,.12); animation-delay: 300ms")}>
                  <div style={css("display: flex; align-items: center; gap: 10px")}>
                    <span style={css("width: 36px; height: 36px; flex-shrink: 0; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(143,227,176,.14); color: #8fe3b0")}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                        <path d="M3.5 10h17M8 3v4M16 3v4" />
                      </svg>
                    </span>
                    <span className="kicker" style={css("color: #8fe3b0")}>
                      {"Da reflexão para a ação"}
                    </span>
                  </div>
                  <h2 style={css("margin: 14px 0 0; font-size: 22px; line-height: 1.3; font-weight: 300")}>
                    {"Transforme estas respostas em um plano"}
                  </h2>
                  <p style={css("margin: 8px 0 0; font-size: 14px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.75)")}>
                    {"A Alma cria um passo a passo com datas e lembretes, e acompanha você até resolver."}
                  </p>
                  <div style={css("margin-top: 16px; display: flex; flex-direction: column; gap: 10px")}>
                    {(R.previewSteps || []).map((L14_pv, I14) => (
                      <React.Fragment key={I14}>
                        <div style={css("display: flex; align-items: center; gap: 12px")}>
                          <span style={css("width: 26px; height: 26px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #8fe3b0; border: 1px solid rgba(143,227,176,.55)")}>
                            {L14_pv?.n}
                          </span>
                          <span style={css("font-size: 14px; font-weight: 300; line-height: 1.4; color: rgba(244,241,234,.88)")}>
                            {L14_pv?.t}
                          </span>
                        </div>
                      </React.Fragment>
                    ))}
                    <span style={css("padding-left: 38px; font-size: 12px; color: rgba(244,241,234,.5)")}>
                      {R.previewMore}
                    </span>
                  </div>
                  <button className="cta" onClick={R.createPlan} style={css("margin-top: 18px; width: 100%; height: 54px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 500; color: #0c1f15; background: linear-gradient(120deg, #8fe3b0, #d4f7e0)")}>
                    {R.planCta}
                  </button>
                </div>
                {R.voicesClosed ? (
                  <>
                    <div className="glass cardin" style={css("margin-top: 8px; border-radius: 26px; padding: 20px 18px; display: flex; flex-direction: column; gap: 16px; border-color: rgba(201,184,255,.4); animation-delay: 450ms")}>
                      <div style={css("display: flex; flex-direction: column; gap: 4px")}>
                        <span className="kicker" style={css("color: #c9b8ff")}>
                          {"O Conselho"}
                        </span>
                        <span style={css("font-size: 20px; font-weight: 300; line-height: 1.3")}>
                          {`${(R.voiceCount) ?? ''} sabedorias refletiram sobre o que você trouxe`}
                        </span>
                        <span style={css("font-size: 13px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.62)")}>
                          {"Cada uma traz um texto original e uma reflexão. Toque num símbolo para ouvir uma voz, ou veja todas."}
                        </span>
                      </div>
                      <div style={css("display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px")}>
                        {(R.voiceSyms || []).map((L15_v, I15) => (
                          <React.Fragment key={I15}>
                            <button className="pill" onClick={L15_v?.pick} aria-label={`Ver conselho: ${(L15_v?.name) ?? ''}`} style={css(`height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.05); border: 1px solid ${(L15_v?.border) ?? ''}`)}>
                              {L15_v?.isSvg ? (
                                <>
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={L15_v?.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d={L15_v?.d} />
                                  </svg>
                                </>
                              ) : null}
                              {L15_v?.isText ? (
                                <>
                                  <span aria-hidden="true" style={css(`font-family: ${(L15_v?.tf) ?? ''}; font-size: 16px; line-height: 1; color: ${(L15_v?.color) ?? ''}`)}>
                                    {L15_v?.t}
                                  </span>
                                </>
                              ) : null}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <button className="cta" onClick={R.openVoices} style={css("height: 56px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 500; color: #1a1030; background: linear-gradient(120deg, #c9b8ff, #efe8ff 50%, #b8d8ff); box-shadow: 0 0 30px rgba(201,184,255,.3)")}>
                        {"Ver todos os conselhos"}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1030" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      <span style={css("text-align: center; font-size: 12px; font-weight: 300; color: rgba(244,241,234,.5)")}>
                        {R.starHint}
                      </span>
                    </div>
                  </>
                ) : null}
                {R.voicesOpen ? (
                  <>
                    <div className="fade" style={css("display: flex; flex-direction: column; gap: 16px")}>
                      <div style={css("display: flex; align-items: baseline; justify-content: space-between; margin-top: 8px")}>
                        <div className="kicker">
                          {"As vozes"}
                        </div>
                        <div style={css("font-size: 12px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                          {R.starHint}
                        </div>
                      </div>
                      <div className="scroll" style={css("display: flex; gap: 8px; overflow-x: auto; margin: 0 -20px; padding: 0 20px 4px")}>
                        {(R.filters || []).map((L16_f, I16) => (
                          <React.Fragment key={I16}>
                            <button className="pill" onClick={L16_f?.pick} aria-pressed={L16_f?.pressed} style={css(`flex-shrink: 0; height: 44px; padding: 0 16px; border-radius: 999px; display: flex; align-items: center; gap: 8px; font-size: 13px; white-space: nowrap; border: 1px solid rgba(255,255,255,.14); ${(L16_f?.style) ?? ''}`)}>
                              <span style={css(`width: 7px; height: 7px; border-radius: 50%; background: ${(L16_f?.color) ?? ''}`)}></span>
                              {L16_f?.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      {R.noCards ? (
                        <>
                          <p style={css("margin: 8px 0; text-align: center; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                            {"Toque na estrela das respostas que mais tocarem você."}
                          </p>
                        </>
                      ) : null}
                      {(R.cards || []).map((L17_c, I17) => (
                        <React.Fragment key={I17}>
                          <div className="glass cardin" style={css(`border-radius: 24px; padding: 16px 16px 8px 18px; ${(L17_c?.style) ?? ''}`)}>
                            <div style={css("display: flex; align-items: center; gap: 12px")}>
                              <span style={css(`width: 40px; height: 40px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; ${(L17_c?.glyphStyle) ?? ''}`)}>
                                {L17_c?.isSvg ? (
                                  <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={L17_c?.color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d={L17_c?.d} />
                                    </svg>
                                  </>
                                ) : null}
                                {L17_c?.isText ? (
                                  <>
                                    <span aria-hidden="true" style={css(`font-family: ${(L17_c?.tf) ?? ''}; font-size: 18px; line-height: 1; color: ${(L17_c?.color) ?? ''}`)}>
                                      {L17_c?.t}
                                    </span>
                                  </>
                                ) : null}
                              </span>
                              <span style={css("display: flex; flex-direction: column; gap: 2px; flex-grow: 1; min-width: 0")}>
                                <span style={css("font-size: 15px; font-weight: 500")}>
                                  {L17_c?.name}
                                </span>
                                <span style={css("font-size: 12px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                                  {L17_c?.ref}
                                </span>
                              </span>
                              <button onClick={L17_c?.star} aria-pressed={L17_c?.pressed} aria-label="Marcar com estrela" style={css("width: 44px; height: 44px; flex-shrink: 0; display: flex; align-items: center; justify-content: center")}>
                                {L17_c?.on ? (
                                  <>
                                    <svg className="pop" width="22" height="22" viewBox="0 0 24 24" fill="#f3d98b" stroke="#f3d98b" strokeWidth="1.2" strokeLinejoin="round" style={css("filter: drop-shadow(0 0 8px rgba(243,217,139,.8))")} aria-hidden="true">
                                      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
                                    </svg>
                                  </>
                                ) : null}
                                {L17_c?.off ? (
                                  <>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,.55)" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
                                    </svg>
                                  </>
                                ) : null}
                              </button>
                            </div>
                            <div className="orig" dir={L17_c?.dir} style={css(`margin-top: 14px; line-height: 1.6; ${(L17_c?.origStyle) ?? ''}`)}>
                              {L17_c?.orig}
                            </div>
                            <div style={css("margin-top: 4px; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: rgba(244,241,234,.42)")}>
                              {`${(L17_c?.lang) ?? ''} · tradução livre`}
                            </div>
                            <div style={css("margin-top: 10px; font-size: 17px; font-weight: 300; line-height: 1.5")}>
                              {(L17_c?.words || []).map((L18_w, I18) => (
                                <React.Fragment key={I18}>
                                  <span className="word" style={css(L18_w?.style)}>
                                    {L18_w?.w}
                                  </span>
                                </React.Fragment>
                              ))}
                            </div>
                            <button onClick={L17_c?.toggle} aria-expanded={L17_c?.expanded} style={css(`width: 100%; height: 44px; margin-top: 6px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: ${(L17_c?.color) ?? ''}`)}>
                              <span>
                                {"O que essa voz quer te dizer"}
                              </span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={css(L17_c?.chev)} aria-hidden="true">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            </button>
                            {L17_c?.open ? (
                              <>
                                <p className="fade" style={css("margin: 0 0 12px; font-size: 14px; font-weight: 300; line-height: 1.65; color: rgba(244,241,234,.85)")}>
                                  {L17_c?.reflection}
                                </p>
                              </>
                            ) : null}
                          </div>
                        </React.Fragment>
                      ))}
                      <button onClick={R.closeVoices} style={css("height: 44px; align-self: center; padding: 0 18px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(244,241,234,.65)")}>
                        {"Recolher conselhos"}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 15l6-6 6 6" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : null}
                <button className="cta" onClick={R.saveEntry} style={css(`margin-top: 8px; width: 100%; height: 58px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 16px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); ${(R.saveStyle) ?? ''}`)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1408" aria-hidden="true">
                    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
                  </svg>
                  {R.saveLabel}
                </button>
                <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
                  <button className="glass pill" onClick={R.meditate} style={css("height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.4" aria-hidden="true">
                      <circle cx="12" cy="12" r="3" />
                      <circle cx="12" cy="12" r="7" opacity=".6" />
                      <circle cx="12" cy="12" r="10.5" opacity=".3" />
                    </svg>
                    {"Respirar 2 min"}
                  </button>
                  <button className="glass pill" onClick={R.share} style={css("height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 13px")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 15V3" />
                      <path d="M7 8l5-5 5 5" />
                      <path d="M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
                    </svg>
                    {"Compartilhar"}
                  </button>
                </div>
                <button onClick={R.restart} style={css("height: 48px; align-self: center; padding: 0 20px; font-size: 15px; font-weight: 300; color: rgba(244,241,234,.8)")}>
                  {"Fazer outra pergunta"}
                </button>
                <p style={css("margin: 0; text-align: center; font-size: 12px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.5)")}>
                  {"Se o peso estiver grande demais, você não precisa carregar sozinho. CVV, ligue 188, 24 horas, gratuito."}
                </p>
              </div>
            </div>
          </>
        ) : null}
        {R.isJournal ? (
          <>
            <div className="screen scroll" style={css("overflow-y: auto")}>
              <div style={css("box-sizing: border-box; padding: 108px 20px 48px; display: flex; flex-direction: column; gap: 18px")}>
                <div>
                  <div className="kicker">
                    {"Minha Alma"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 28px; line-height: 1.2; font-weight: 300")}>
                    {"Sua constelação"}
                  </h1>
                  <p style={css("margin: 6px 0 0; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                    {"Cada pergunta vira uma estrela. Toque para revisitar."}
                  </p>
                </div>
                <a href="#/constelacao" className="cta" style={css('position: relative; overflow: hidden; height: 64px; border-radius: 22px; display: flex; align-items: center; gap: 14px; padding: 0 18px; text-decoration: none; color: #f4f1ea; background: radial-gradient(circle at 20% 50%, rgba(201,184,255,.35), rgba(20,16,44,.9) 60%); border: 1px solid rgba(201,184,255,.45); box-shadow: 0 0 30px rgba(201,184,255,.2)')}>
                  <span style={css('width: 34px; height: 34px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff, #c9b8ff 45%, rgba(201,184,255,0) 72%); box-shadow: 0 0 20px #c9b8ff')} />
                  <span style={css('display: flex; flex-direction: column; gap: 2px')}>
                    <span style={css('font-size: 15px; font-weight: 400')}>Abrir o céu em tela inteira</span>
                    <span style={css('font-size: 12px; font-weight: 300; color: rgba(244,241,234,.65)')}>Tudo o que você viveu na Alma, em luz</span>
                  </span>
                </a>
                {this.renderLogin()}
                {R.hasNext ? (
                  <>
                    <div className="glass cardin" style={css("border-radius: 24px; padding: 18px; display: flex; flex-direction: column; gap: 14px; border-color: rgba(143,227,176,.4)")}>
                      <div style={css("display: flex; flex-direction: column; gap: 4px")}>
                        <span className="kicker" style={css("color: #8fe3b0")}>
                          {"Seu próximo passo"}
                        </span>
                        <span style={css("font-size: 12px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                          {"A Alma acompanha seus planos de ação. Este é o passo mais próximo."}
                        </span>
                      </div>
                      <div style={css("border-radius: 18px; padding: 14px; background: rgba(255,255,255,.05); display: flex; flex-direction: column; gap: 10px")}>
                        <div style={css("display: flex; align-items: center; gap: 10px")}>
                          <span style={css("width: 30px; height: 30px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; background: #f3d98b; color: #1a1408")}>
                            {R.next?.n}
                          </span>
                          <span className="kicker" style={css("font-size: 10px")}>
                            {`Passo ${(R.next?.n) ?? ''} de ${(R.next?.total) ?? ''}`}
                          </span>
                        </div>
                        <span style={css("font-size: 17px; font-weight: 300; line-height: 1.4")}>
                          {R.next?.t}
                        </span>
                        <div style={css("display: flex; flex-wrap: wrap; gap: 8px")}>
                          <span style={css("height: 30px; padding: 0 12px; border-radius: 999px; display: flex; align-items: center; gap: 6px; font-size: 12px; background: rgba(243,217,139,.12); color: #f3d98b")}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                              <path d="M3.5 10h17M8 3v4M16 3v4" />
                            </svg>
                            {R.next?.when}
                          </span>
                          <span style={css("height: 30px; padding: 0 12px; border-radius: 999px; display: flex; align-items: center; gap: 6px; font-size: 12px; background: rgba(255,255,255,.06); color: rgba(244,241,234,.75)")}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill={R.next?.bellFill} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
                              <path d="M10 20.5a2 2 0 0 0 4 0" fill="none" />
                            </svg>
                            {R.next?.bell}
                          </span>
                        </div>
                      </div>
                      <div style={css("display: flex; align-items: flex-start; gap: 10px")}>
                        <span style={css(`width: 8px; height: 8px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; ${(R.next?.dot) ?? ''}`)}></span>
                        <span style={css("display: flex; flex-direction: column; gap: 2px; min-width: 0")}>
                          <span style={css("font-size: 11px; letter-spacing: .12em; text-transform: uppercase; color: rgba(244,241,234,.5)")}>
                            {`Do plano da sua pergunta · ${(R.next?.kind) ?? ''}`}
                          </span>
                          <span style={css("font-size: 14px; font-weight: 300; line-height: 1.45; color: rgba(244,241,234,.8)")}>
                            {`“${(R.next?.q) ?? ''}”`}
                          </span>
                        </span>
                      </div>
                      <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
                        <button className="cta" onClick={R.next?.done} style={css("height: 46px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 14px; font-weight: 500; color: #0c1f15; background: linear-gradient(120deg, #8fe3b0, #d4f7e0)")}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0c1f15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                          {"Concluí"}
                        </button>
                        <button className="pill" onClick={R.next?.open} style={css("height: 46px; border-radius: 999px; font-size: 14px; border: 1px solid rgba(255,255,255,.18)")}>
                          {"Ver plano completo"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
                <div style={css("display: flex; gap: 8px")}>
                  {(R.jfilters || []).map((L19_f, I19) => (
                    <React.Fragment key={I19}>
                      <button className="pill" onClick={L19_f?.pick} aria-pressed={L19_f?.pressed} style={css(`height: 44px; padding: 0 16px; border-radius: 999px; font-size: 13px; white-space: nowrap; border: 1px solid rgba(255,255,255,.14); ${(L19_f?.style) ?? ''}`)}>
                        {L19_f?.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className="glass" style={css("position: relative; height: 240px; border-radius: 26px; overflow: hidden; background: radial-gradient(circle at 50% 110%, rgba(243,217,139,.08), rgba(255,255,255,.03) 60%)")}>
                  {(R.skyLines || []).map((L20_l, I20) => (
                    <React.Fragment key={I20}>
                      <div style={css(`position: absolute; height: 1px; transform-origin: 0 50%; background: linear-gradient(90deg, rgba(243,217,139,.15), rgba(243,217,139,.55), rgba(243,217,139,.15)); ${(L20_l?.style) ?? ''}`)}></div>
                    </React.Fragment>
                  ))}
                  {(R.skyStars || []).map((L21_s, I21) => (
                    <React.Fragment key={I21}>
                      <button onClick={L21_s?.open} aria-label={L21_s?.aria} style={css(`position: absolute; width: 64px; height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; ${(L21_s?.style) ?? ''}`)}>
                        <span className="twinkle" style={css(`width: 10px; height: 10px; border-radius: 50%; ${(L21_s?.dot) ?? ''}`)}></span>
                        <span style={css("font-size: 10px; letter-spacing: .08em; color: rgba(244,241,234,.7)")}>
                          {L21_s?.label}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div style={css("display: flex; flex-direction: column; gap: 10px")}>
                  {(R.entryRows || []).map((L22_e, I22) => (
                    <React.Fragment key={I22}>
                      <button className="glass pill" onClick={L22_e?.open} style={css(`width: 100%; border-radius: 20px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; text-align: left; ${(L22_e?.rowStyle) ?? ''}`)}>
                        <span style={css(`width: 10px; height: 10px; flex-shrink: 0; border-radius: 50%; ${(L22_e?.dot) ?? ''}`)}></span>
                        <span style={css("display: flex; flex-direction: column; gap: 4px; flex-grow: 1; min-width: 0")}>
                          <span style={css("font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,234,.5)")}>
                            {L22_e?.meta}
                          </span>
                          <span style={css("font-size: 15px; font-weight: 300; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap")}>
                            {L22_e?.q}
                          </span>
                        </span>
                        {L22_e?.resolved ? (
                          <>
                            <span aria-label="Resolvida" style={css("width: 28px; height: 28px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: rgba(143,227,176,.14); border: 1px solid rgba(143,227,176,.5)")}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8fe3b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            </span>
                          </>
                        ) : null}
                        <span style={css("display: flex; align-items: center; gap: 4px; font-size: 13px; color: #f3d98b")}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#f3d98b" aria-hidden="true">
                            <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
                          </svg>
                          {L22_e?.n}
                        </span>
                      </button>
                    </React.Fragment>
                  ))}
                  {R.noEntries ? (
                    <>
                      <p style={css("margin: 8px 0; text-align: center; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                        {"Nenhuma estrela aqui por enquanto."}
                      </p>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
        {R.isPlan ? (
          <>
            <div className="screen scroll" style={css("overflow-y: auto")}>
              <div style={css("box-sizing: border-box; padding: 108px 20px 56px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker" style={css("color: #8fe3b0")}>
                    {"Plano de ação"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 28px; line-height: 1.2; font-weight: 300")}>
                    {"Um passo de cada vez"}
                  </h1>
                  <p style={css("margin: 8px 0 0; font-size: 14px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.65)")}>
                    {R.pl?.q}
                  </p>
                </div>
                <div className="glass" style={css("border-radius: 24px; padding: 18px 20px; display: flex; align-items: center; gap: 18px")}>
                  <div style={css(`position: relative; width: 68px; height: 68px; flex-shrink: 0; border-radius: 50%; ${(R.pl?.ringStyle) ?? ''}`)}>
                    <div style={css("position: absolute; inset: 5px; border-radius: 50%; background: #16142a; display: flex; flex-direction: column; align-items: center; justify-content: center")}>
                      <span style={css("font-size: 20px; font-weight: 300; line-height: 1")}>
                        {`${(R.pl?.doneN) ?? ''}/${(R.pl?.total) ?? ''}`}
                      </span>
                    </div>
                  </div>
                  <div style={css("display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("font-size: 16px; font-weight: 400")}>
                      {R.pl?.headline}
                    </span>
                    <span style={css("font-size: 13px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.65)")}>
                      {R.pl?.sub}
                    </span>
                  </div>
                </div>
                <div style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
                  <div style={css("border-radius: 18px; padding: 12px 10px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center")}>
                    <span style={css("width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #f3d98b; border: 1px solid rgba(243,217,139,.6)")}>
                      {"1"}
                    </span>
                    <span style={css("font-size: 11px; line-height: 1.4; color: rgba(244,241,234,.7)")}>
                      {"Siga na ordem, um passo por vez"}
                    </span>
                  </div>
                  <div style={css("border-radius: 18px; padding: 12px 10px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center")}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f3d98b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
                      <path d="M10 20.5a2 2 0 0 0 4 0" />
                    </svg>
                    <span style={css("font-size: 11px; line-height: 1.4; color: rgba(244,241,234,.7)")}>
                      {"A Alma te lembra no dia de cada passo"}
                    </span>
                  </div>
                  <div style={css("border-radius: 18px; padding: 12px 10px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center")}>
                    <span style={css("width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #8fe3b0")}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0b0a16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    </span>
                    <span style={css("font-size: 11px; line-height: 1.4; color: rgba(244,241,234,.7)")}>
                      {"Marque ao concluir e veja seu avanço"}
                    </span>
                  </div>
                </div>
                {(R.pl?.steps || []).map((L23_st, I23) => (
                  <React.Fragment key={I23}>
                    <div className="glass cardin" style={css(`border-radius: 24px; padding: 18px; display: flex; flex-direction: column; gap: 12px; transition: border-color .6s ease, opacity .6s ease; ${(L23_st?.cardStyle) ?? ''}`)}>
                      <div style={css("display: flex; align-items: center; gap: 12px")}>
                        <span style={css(`width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 400; transition: background .5s ease; ${(L23_st?.numStyle) ?? ''}`)}>
                          {L23_st?.done ? (
                            <>
                              <span className="pop" style={css("display: flex")}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b0a16" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                                </svg>
                              </span>
                            </>
                          ) : null}
                          {L23_st?.todo ? (
                            <>
                              {L23_st?.n}
                            </>
                          ) : null}
                        </span>
                        <span className="kicker" style={css("flex-grow: 1; font-size: 10px")}>
                          {L23_st?.kicker}
                        </span>
                        {L23_st?.badgeOn ? (
                          <>
                            <span style={css(`height: 24px; padding: 0 10px; border-radius: 999px; display: flex; align-items: center; font-size: 11px; font-weight: 500; ${(L23_st?.badgeStyle) ?? ''}`)}>
                              {L23_st?.badge}
                            </span>
                          </>
                        ) : null}
                      </div>
                      <p style={css(`margin: 0; font-size: 18px; font-weight: 300; line-height: 1.4; ${(L23_st?.textStyle) ?? ''}`)}>
                        {L23_st?.t}
                      </p>
                      <div style={css("display: flex; flex-wrap: wrap; gap: 8px")}>
                        <span style={css(`height: 34px; padding: 0 12px; border-radius: 999px; display: flex; align-items: center; gap: 6px; font-size: 12px; background: rgba(255,255,255,.06); color: ${(L23_st?.dateColor) ?? ''}`)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                            <path d="M3.5 10h17M8 3v4M16 3v4" />
                          </svg>
                          {L23_st?.date}
                        </span>
                        <button onClick={L23_st?.bell} aria-pressed={L23_st?.remindP} style={css(`height: 34px; padding: 0 12px; border-radius: 999px; display: flex; align-items: center; gap: 6px; font-size: 12px; ${(L23_st?.bellStyle) ?? ''}`)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={L23_st?.bellFill} stroke={L23_st?.bellStroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z" />
                            <path d="M10 20.5a2 2 0 0 0 4 0" fill="none" />
                          </svg>
                          {L23_st?.bellLabel}
                        </button>
                      </div>
                      {L23_st?.isCurrent ? (
                        <>
                          <button className="cta" onClick={L23_st?.complete} style={css("height: 50px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 15px; font-weight: 500; color: #0c1f15; background: linear-gradient(120deg, #8fe3b0, #d4f7e0)")}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0c1f15" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                            {"Concluí este passo"}
                          </button>
                        </>
                      ) : null}
                      {L23_st?.isFuture ? (
                        <>
                          <button onClick={L23_st?.complete} style={css("height: 44px; border-radius: 999px; font-size: 13px; color: rgba(244,241,234,.7); border: 1px solid rgba(255,255,255,.14)")}>
                            {"Já fiz este passo"}
                          </button>
                        </>
                      ) : null}
                      {L23_st?.done ? (
                        <>
                          <button onClick={L23_st?.undo} style={css("height: 44px; align-self: flex-start; padding: 0 4px; font-size: 13px; color: rgba(244,241,234,.55)")}>
                            {"Desfazer"}
                          </button>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
                {R.pl?.allDone ? (
                  <>
                    <div className="glass cardin" style={css("border-radius: 26px; padding: 22px 20px; position: relative; overflow: hidden; border-color: rgba(243,217,139,.4); text-align: center")}>
                      <div className="goldglow"></div>
                      <div className="goldtext" style={css("position: relative; font-size: 12px; letter-spacing: .26em; text-transform: uppercase")}>
                        {"Plano concluído"}
                      </div>
                      <p style={css("position: relative; margin: 10px 0 16px; font-size: 16px; font-weight: 300; line-height: 1.5")}>
                        {"Você caminhou até o fim. Essa pergunta já encontrou sua resposta?"}
                      </p>
                      <button onClick={R.pl?.resolve} className="cta" style={css("position: relative; width: 100%; height: 50px; border-radius: 999px; font-size: 15px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a)")}>
                        {R.pl?.resolveLabel}
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
        {R.sheetOpen ? (
          <>
            <button className="scrim" onClick={R.closeSheet} aria-label="Fechar" style={css("position: absolute; inset: 0; z-index: 7; background: rgba(5,4,12,.6)")}></button>
            <div className="sheet scroll" style={css("position: absolute; left: 0; right: 0; bottom: 0; height: 660px; z-index: 8; overflow-y: auto; border-radius: 32px 32px 0 0; background: rgba(22,20,40,.9); border-top: 1px solid rgba(255,255,255,.14); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px)")}>
              <div style={css("box-sizing: border-box; padding: 12px 20px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div style={css("display: flex; justify-content: center")}>
                  <span style={css("width: 40px; height: 4px; border-radius: 4px; background: rgba(255,255,255,.25)")}></span>
                </div>
                <div style={css("display: flex; align-items: center; justify-content: space-between")}>
                  <span className="kicker">
                    {R.sheet?.meta}
                  </span>
                  <button onClick={R.closeSheet} aria-label="Fechar painel" style={css("width: 44px; height: 44px; display: flex; align-items: center; justify-content: center")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
                <h2 style={css("margin: 0; font-size: 22px; line-height: 1.35; font-weight: 300")}>
                  {R.sheet?.q}
                </h2>
                <div style={css("display: flex; flex-wrap: wrap; gap: 6px")}>
                  {(R.sheet?.tags || []).map((L24_g, I24) => (
                    <React.Fragment key={I24}>
                      <span style={css("height: 26px; padding: 0 12px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 12px; background: rgba(255,255,255,.08); color: rgba(244,241,234,.8)")}>
                        {L24_g?.t}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
                <div style={css("border-radius: 22px; padding: 18px; position: relative; overflow: hidden; background: rgba(243,217,139,.06); border: 1px solid rgba(243,217,139,.3)")}>
                  <div className="goldtext" style={css("font-size: 11px; letter-spacing: .26em; text-transform: uppercase")}>
                    {"A resposta da Alma"}
                  </div>
                  <p style={css("margin: 10px 0 0; font-size: 15px; font-weight: 300; line-height: 1.6")}>
                    {R.sheet?.alma}
                  </p>
                  <p style={css("margin: 10px 0 0; font-size: 13px; font-weight: 400; line-height: 1.55; color: #f3d98b")}>
                    {R.sheet?.step}
                  </p>
                </div>
                {R.sheet?.hasPlan ? (
                  <>
                    <button className="glass pill" onClick={R.openPlanFromSheet} style={css("width: 100%; border-radius: 22px; padding: 16px 18px; text-align: left; display: flex; flex-direction: column; gap: 10px; border-color: rgba(143,227,176,.4)")}>
                      <span style={css("width: 100%; display: flex; align-items: center; justify-content: space-between")}>
                        <span className="kicker" style={css("color: #8fe3b0")}>
                          {"Plano de ação"}
                        </span>
                        <span style={css("font-size: 13px; color: #8fe3b0")}>
                          {R.sheet?.progress}
                        </span>
                      </span>
                      <span style={css("width: 100%; height: 4px; border-radius: 4px; background: rgba(255,255,255,.1); overflow: hidden; display: block")}>
                        <span style={css(`display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, #8fe3b0, #f3d98b); ${(R.sheet?.barStyle) ?? ''}`)}></span>
                      </span>
                      <span style={css("font-size: 14px; font-weight: 300; line-height: 1.45; color: rgba(244,241,234,.85)")}>
                        {R.sheet?.nextText}
                      </span>
                      <span style={css("font-size: 13px; font-weight: 500; color: #f4f1ea")}>
                        {"Abrir plano"}
                      </span>
                    </button>
                  </>
                ) : null}
                {R.sheet?.noPlan ? (
                  <>
                    <div className="glass" style={css("border-radius: 22px; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; border-color: rgba(143,227,176,.35)")}>
                      <span className="kicker" style={css("color: #8fe3b0")}>
                        {"Plano de ação"}
                      </span>
                      <span style={css("font-size: 14px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.8)")}>
                        {"Esta pergunta ainda não tem plano. A Alma cria um passo a passo com datas e lembretes para você agir."}
                      </span>
                      <button className="cta" onClick={R.makePlanFromSheet} style={css("height: 50px; border-radius: 999px; font-size: 15px; font-weight: 500; color: #0c1f15; background: linear-gradient(120deg, #8fe3b0, #d4f7e0)")}>
                        {"Criar plano de ação"}
                      </button>
                    </div>
                  </>
                ) : null}
                <div className="kicker" style={css("margin-top: 8px")}>
                  {`Suas estrelas · ${(R.sheet?.n) ?? ''}`}
                </div>
                {R.sheet?.none ? (
                  <>
                    <p style={css("margin: 0; font-size: 14px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                      {"Nenhuma resposta estrelada nesta pergunta."}
                    </p>
                  </>
                ) : null}
                {(R.sheet?.stars || []).map((L25_s, I25) => (
                  <React.Fragment key={I25}>
                    <div className="glass" style={css("border-radius: 20px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px")}>
                      <div style={css("display: flex; align-items: center; gap: 8px")}>
                        <span style={css(`font-size: 14px; font-weight: 500; color: ${(L25_s?.color) ?? ''}`)}>
                          {L25_s?.name}
                        </span>
                        <span style={css("flex-grow: 1; font-size: 12px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                          {L25_s?.ref}
                        </span>
                        <button onClick={L25_s?.remove} aria-label="Tirar estrela" style={css("width: 44px; height: 44px; margin: -12px -10px -12px 0; display: flex; align-items: center; justify-content: center")}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f3d98b" aria-hidden="true">
                            <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
                          </svg>
                        </button>
                      </div>
                      <p style={css("margin: 0; font-size: 15px; font-weight: 300; line-height: 1.5")}>
                        {L25_s?.tr}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
                <div style={css("height: 1px; margin: 6px 0; background: rgba(255,255,255,.1)")}></div>
                <button className="glass pill" onClick={R.toggleResolved} style={css(`height: 52px; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 15px; ${(R.resolveStyle) ?? ''}`)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8fe3b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {R.resolveLabel}
                </button>
                {R.confirmOff ? (
                  <>
                    <button onClick={R.askDelete} style={css("height: 48px; display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 14px; color: #ffa3a3")}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
                      </svg>
                      {"Excluir esta estrela"}
                    </button>
                  </>
                ) : null}
                {R.confirmOn ? (
                  <>
                    <div className="fade" style={css("border-radius: 18px; padding: 14px 16px; background: rgba(255,120,120,.08); border: 1px solid rgba(255,150,150,.32); display: flex; flex-direction: column; gap: 12px")}>
                      <span style={css("font-size: 14px; font-weight: 300; line-height: 1.5")}>
                        {"Apagar esta pergunta e as respostas estreladas? Não dá para desfazer."}
                      </span>
                      <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px")}>
                        <button className="glass" onClick={R.cancelDelete} style={css("height: 44px; border-radius: 14px; font-size: 14px")}>
                          {"Cancelar"}
                        </button>
                        <button onClick={R.doDelete} style={css("height: 44px; border-radius: 14px; font-size: 14px; font-weight: 500; background: #ff9c9c; color: #2a0b0b")}>
                          {"Excluir"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
        {R.toastOn ? (
          <>
            <div className="toast glass" style={css("height: 48px; padding: 0 20px; border-radius: 999px; display: flex; align-items: center; gap: 10px; font-size: 14px; white-space: nowrap; background: rgba(22,20,40,.85)")}>
              <svg className="twinkle" width="16" height="16" viewBox="0 0 24 24" fill="#f3d98b" aria-hidden="true">
                <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.1l-5.7 3.2 1.2-6.4-4.7-4.4 6.4-.8z" />
              </svg>
              {R.toast}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Component;
