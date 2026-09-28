// Gerado a partir de Simbolos.dc.html (protótipo Alma) e mantido à mão a partir daqui.
import React from 'react';
import { DCLogic, css } from '../dc/runtime.js';
import { load, save, onData } from '../store.js';
import { today, addDays, addMonths, WD_FULL } from '../dates.js';
import NatalSphere from '../components/NatalSphere.jsx';
import SkyHero from '../components/SkyHero.jsx';

class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.SIGNS = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];
    this.SG = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
    this.ELC = ['#ffb38a', '#b8e0a0', '#a8d8ff', '#b9a6ff'];
    this.SIGN_KW = ['iniciativa e coragem', 'estabilidade e prazer', 'curiosidade e troca', 'cuidado e memória', 'expressão e brilho', 'análise e serviço', 'harmonia e relação', 'intensidade e profundidade', 'expansão e sentido', 'construção e responsabilidade', 'originalidade e coletivo', 'sensibilidade e entrega'];
    this.HOUSE = ['identidade e presença', 'recursos e valores', 'comunicação e aprendizados', 'lar, família e raízes', 'criatividade, prazer e romance', 'rotina, trabalho diário e cuidados', 'parcerias e relações', 'intimidade e transformação', 'viagens, estudos e sentido da vida', 'carreira e vocação', 'amizades e projetos coletivos', 'interioridade e espiritualidade'];
    this.PL = {
      sun: { art: 'O Sol', name: 'Sol', g: '☉︎', color: '#f3d98b', fn: 'sua essência e vitalidade se expressam com', energy: 'foco e vitalidade' },
      moon: { art: 'A Lua', name: 'Lua', g: '☽︎', color: '#e8e2d4', fn: 'suas emoções e necessidades se movem com', energy: 'sensibilidade e necessidade de acolhimento' },
      mercury: { name: 'Mercúrio', g: '☿︎', color: '#a8d8ff', fn: 'sua mente e sua comunicação funcionam com', energy: 'ideias, conversas e decisões práticas' },
      venus: { name: 'Vênus', g: '♀︎', color: '#f5a8c8', fn: 'seu jeito de amar e de apreciar a vida vem com', energy: 'afeto, beleza e acordos' },
      mars: { name: 'Marte', g: '♂︎', color: '#ff8f7a', fn: 'sua ação e sua coragem aparecem com', energy: 'impulso, coragem e iniciativa' },
      jupiter: { name: 'Júpiter', g: '♃︎', color: '#c9a8ff', fn: 'sua forma de crescer e de confiar vem com', energy: 'expansão, oportunidades e confiança' },
      saturn: { name: 'Saturno', g: '♄︎', color: '#b5b0a0', fn: 'suas lições de maturidade pedem', energy: 'estrutura, compromisso e maturidade' }
    };
    this.AREAS = {
      moon: ['Observe o clima emocional à sua volta: decisões rendem mais quando você está bem nutrido.', 'Gestos simples de cuidado falam mais alto que palavras.', 'Respeite o ritmo do corpo. Pausa também é produtividade.'],
      sun: ['Bom momento para mostrar o que você faz e assumir protagonismo.', 'Presença verdadeira vale mais do que grandes gestos.', 'Energia para retomar o que te dá sentido.'],
      mercury: ['Conversas, propostas e contratos pedem clareza: releia antes de enviar.', 'Diga o que sente com palavras simples e diretas.', 'Escreva. Organizar pensamentos no papel abre caminhos.'],
      venus: ['Parcerias e acordos tendem a fluir quando há gentileza.', 'Tempo de aproximar, reconciliar e apreciar quem está perto.', 'Cerque-se de beleza: ela recarrega você.'],
      mars: ['Iniciativa em alta: comece o que está parado, sem atropelar ninguém.', 'Desejo e franqueza, com cuidado para não ferir.', 'Movimento físico ajuda a canalizar a energia.'],
      jupiter: ['Portas se abrem para crescer, estudar e expandir projetos.', 'Generosidade e leveza aproximam as pessoas.', 'Confie mais no processo: a fé amplia horizontes.'],
      saturn: ['Estrutura, disciplina e compromissos de longo prazo ganham peso.', 'Relações pedem maturidade e responsabilidade mútua.', 'Limites claros são uma forma de cuidado consigo.']
    };
    this.CITIES = [
      ['São Paulo', 'SP', -23.55, -46.63, -3], ['Sorocaba', 'SP', -23.50, -47.46, -3], ['Campinas', 'SP', -22.91, -47.06, -3],
      ['Rio de Janeiro', 'RJ', -22.91, -43.17, -3], ['Belo Horizonte', 'MG', -19.92, -43.94, -3], ['Curitiba', 'PR', -25.43, -49.27, -3],
      ['Florianópolis', 'SC', -27.60, -48.55, -3], ['Porto Alegre', 'RS', -30.03, -51.23, -3], ['Brasília', 'DF', -15.79, -47.88, -3],
      ['Goiânia', 'GO', -16.68, -49.25, -3], ['Salvador', 'BA', -12.97, -38.51, -3], ['Recife', 'PE', -8.05, -34.88, -3],
      ['Fortaleza', 'CE', -3.73, -38.52, -3], ['Belém', 'PA', -1.46, -48.49, -3], ['Manaus', 'AM', -3.12, -60.02, -4]
    ];
    this.MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    this.NUMM = {
      1: ['Liderança', 'Iniciativa, independência e coragem de abrir caminhos.'],
      2: ['Cooperação', 'Sensibilidade, parceria e escuta. Força na delicadeza.'],
      3: ['Criatividade', 'Criatividade, comunicação e alegria de se mostrar.'],
      4: ['Construção', 'Método, estabilidade e trabalho que dura.'],
      5: ['Liberdade', 'Movimento, mudança e sede de experiência.'],
      6: ['Cuidado', 'Amor, responsabilidade e harmonia com quem está perto.'],
      7: ['Busca', 'Introspecção, estudo e sabedoria interior.'],
      8: ['Realização', 'Poder de concretizar, prosperidade e autoridade.'],
      9: ['Compaixão', 'Generosidade, encerramento de ciclos e visão ampla.'],
      11: ['Inspiração · número mestre', 'Intuição elevada e vocação para iluminar os outros.'],
      22: ['Construtor · número mestre', 'Transformar grandes visões em obras concretas.'],
      33: ['Amor · número mestre', 'Serviço amoroso e cura pela presença.']
    };
    this.NUMX = {
      1: ['O 1 é a energia do começo. É quem abre caminho, toma a frente e confia na própria visão.', 'Iniciativa, coragem, autonomia, capacidade de liderar e de inventar o novo.', 'Impaciência, dificuldade de pedir ajuda e tendência a querer controlar tudo.', 'Lidere, mas deixe espaço para os outros contribuírem. Comece, e peça ajuda para terminar.'],
      2: ['O 2 é a energia da parceria. Sente o ambiente, percebe o que não é dito e costura relações.', 'Diplomacia, sensibilidade, escuta profunda, talento para cooperar e mediar.', 'Insegurança, dependência da aprovação dos outros e dificuldade de dizer não.', 'Sua delicadeza é força. Pratique colocar a sua voz com a mesma gentileza que oferece aos outros.'],
      3: ['O 3 é a energia da expressão. Transforma o que sente em palavras, arte, humor e encontro.', 'Criatividade, comunicação, carisma, otimismo e facilidade de inspirar.', 'Dispersão, superficialidade e começar muitas coisas sem concluir.', 'Escolha um canal para a sua criatividade e dê constância a ele.'],
      4: ['O 4 é a energia da construção. Gosta de bases sólidas, processos claros e trabalho bem feito.', 'Disciplina, confiabilidade, organização, persistência e senso prático.', 'Rigidez, excesso de controle e medo de mudanças.', 'Construa, mas deixe janelas abertas: a flexibilidade também sustenta.'],
      5: ['O 5 é a energia do movimento. Precisa de experiência, variedade e liberdade para crescer.', 'Adaptabilidade, curiosidade, coragem para mudar e facilidade de se comunicar com todos.', 'Inquietação, impulsividade e dificuldade de manter compromissos.', 'Use a liberdade a favor de um propósito. Mudar é bom quando você sabe para onde vai.'],
      6: ['O 6 é a energia do cuidado. Sente-se responsável por quem ama e busca harmonia ao redor.', 'Amor, acolhimento, senso de justiça, beleza e talento para cuidar.', 'Cobrança excessiva, dificuldade de delegar e de cuidar de si.', 'Cuide de você com a mesma dedicação com que cuida dos outros.'],
      7: ['O 7 é a energia da busca. Quer entender o sentido das coisas e confia no silêncio.', 'Profundidade, intuição, capacidade de análise, espiritualidade e sabedoria.', 'Isolamento, desconfiança e excesso de autocrítica.', 'Compartilhe o que você descobre. A sabedoria cresce quando circula.'],
      8: ['O 8 é a energia da realização. Tem visão, ambição e capacidade de materializar.', 'Liderança prática, prosperidade, determinação e senso estratégico.', 'Materialismo, dureza com os outros e medo de perder o controle.', 'Use o seu poder de realizar a serviço de algo maior do que você.'],
      9: ['O 9 é a energia da compaixão. Enxerga o todo e se importa com o coletivo.', 'Generosidade, empatia, idealismo, sabedoria e capacidade de perdoar.', 'Dificuldade de encerrar ciclos, sacrifício excessivo e melancolia.', 'Solte o que já cumpriu seu papel. Doar também inclui se dar descanso.'],
      11: ['O 11 é um número mestre: carrega a sensibilidade do 2 elevada à intuição. Veio para inspirar. Nos dias de tensão, ele costuma se viver como um 2.', 'Visão, intuição aguçada, espiritualidade e capacidade de iluminar caminhos.', 'Ansiedade, hipersensibilidade e a pressão de corresponder ao próprio potencial.', 'Cuide da sua energia e confie no que sente. Inspirar começa por viver o que você acredita.'],
      22: ['O 22 é o mestre construtor: une a visão do 11 à solidez do 4. Veio para realizar obras que ficam.', 'Visão ampla, pragmatismo, liderança e capacidade de concretizar sonhos coletivos.', 'Peso da responsabilidade, perfeccionismo e medo de não estar à altura.', 'Divida o grande sonho em passos pequenos. A obra se faz tijolo por tijolo.'],
      33: ['O 33 é o mestre do amor: une a criatividade do 3 ao cuidado do 6. Veio para servir e curar.', 'Compaixão profunda, presença amorosa, sabedoria e dom de ensinar.', 'Autossacrifício, carregar a dor dos outros e esquecer de si.', 'Sirva com amor, sem se esvaziar. Quem cuida também precisa de cuidado.']
    };
    this.CYC = {
      1: ['Começos e sementes. Tudo o que você iniciar agora tende a marcar os próximos anos.', 'Iniciar projetos, tomar decisões, afirmar quem você é.', 'Esperar a permissão dos outros para começar.'],
      2: ['Paciência e parcerias. As coisas amadurecem no tempo delas.', 'Cultivar relações, negociar, deixar as coisas amadurecerem.', 'Forçar resultados rápidos.'],
      3: ['Expressão e encontros. Tempo de aparecer e se comunicar.', 'Criar, comunicar, se mostrar, celebrar.', 'Dispersar energia em mil frentes.'],
      4: ['Base e trabalho. Hora de organizar e firmar os alicerces.', 'Organizar, estruturar, cuidar da rotina e das finanças com método.', 'Fugir do esforço necessário.'],
      5: ['Mudanças e liberdade. O novo bate à porta.', 'Viajar, experimentar, abrir-se a novas possibilidades.', 'Decisões impulsivas sem reflexão.'],
      6: ['Família e responsabilidades. O afeto pede presença.', 'Cuidar do lar e dos vínculos, assumir compromissos afetivos.', 'Carregar tudo sozinho.'],
      7: ['Recolhimento e estudo. Um tempo para olhar para dentro.', 'Estudar, meditar, rever a rota com calma.', 'Exigir de si ação o tempo todo.'],
      8: ['Colheita e conquistas. O esforço dos últimos anos começa a dar frutos.', 'Buscar reconhecimento, negociar, investir no que você construiu.', 'Esquecer o equilíbrio entre ganhar e viver.'],
      9: ['Encerramentos e desapego. Um ciclo de nove anos se completa.', 'Concluir, perdoar, limpar o que não serve mais.', 'Começar grandes projetos antes de fechar os antigos.']
    };
    this.PY = { 1: 'um ano de começos e sementes', 2: 'um ano de paciência, parcerias e escuta', 3: 'um ano de expressão, encontros e alegria', 4: 'um ano de base, esforço e organização', 5: 'um ano de mudanças e liberdade', 6: 'um ano de família, afeto e responsabilidades', 7: 'um ano de recolhimento, estudo e fé', 8: 'um ano de colheita, conquistas e decisões', 9: 'um ano de encerramentos e desapego' };
    this.TAROT = [
      ['O Louco', '0', 'começos, liberdade e salto de fé', 'um salto de fé', 'Algo novo chama, e não precisa de todas as respostas para começar.', 'Dê o primeiro passo com leveza.'],
      ['O Mago', 'I', 'vontade, habilidade e iniciativa', 'a força da vontade', 'Você já tem as ferramentas. Falta direcionar a atenção.', 'Escolha um foco e aja.'],
      ['A Sacerdotisa', 'II', 'intuição, silêncio e saber interior', 'o saber silencioso', 'A resposta está mais dentro do que fora. Escute antes de agir.', 'Reserve um momento de silêncio.'],
      ['A Imperatriz', 'III', 'abundância, cuidado e criação', 'a abundância que cresce', 'O que é cuidado com paciência floresce. Nutra o que importa.', 'Cuide do que você quer ver crescer.'],
      ['O Imperador', 'IV', 'estrutura, limites e liderança', 'a estrutura firme', 'Organização e limites claros trazem segurança para avançar.', 'Defina regras simples para você.'],
      ['O Hierofante', 'V', 'tradição, ensinamento e pertencimento', 'a sabedoria de quem veio antes', 'Um conselho experiente ou uma tradição pode iluminar o caminho.', 'Procure alguém que já trilhou isso.'],
      ['Os Enamorados', 'VI', 'escolhas, união e valores', 'uma escolha do coração', 'Há uma escolha que revela o que você realmente valoriza.', 'Decida pelo que é coerente com seus valores.'],
      ['O Carro', 'VII', 'direção, determinação e avanço', 'a direção decidida', 'Quando as forças internas se alinham, o movimento acontece.', 'Assuma as rédeas.'],
      ['A Força', 'VIII', 'coragem gentil e paciência', 'a coragem gentil', 'A verdadeira força é mansa: acolhe o medo em vez de brigar com ele.', 'Trate-se com firmeza e ternura.'],
      ['O Eremita', 'IX', 'recolhimento, busca e sabedoria', 'a busca interior', 'Um tempo a sós pode trazer a clareza que o barulho esconde.', 'Recolha-se para enxergar melhor.'],
      ['A Roda da Fortuna', 'X', 'ciclos, mudança e oportunidade', 'um ciclo que gira', 'Nada fica parado. Um momento favorável pede atenção para ser aproveitado.', 'Esteja pronto quando a roda girar.'],
      ['A Justiça', 'XI', 'verdade, equilíbrio e responsabilidade', 'o equilíbrio justo', 'Clareza e honestidade colocam as coisas no lugar certo.', 'Seja justo, inclusive com você.'],
      ['O Enforcado', 'XII', 'pausa, entrega e nova perspectiva', 'uma nova perspectiva', 'Parar não é perder tempo. Olhar de outro ângulo muda tudo.', 'Mude o ponto de vista antes de agir.'],
      ['A Morte', 'XIII', 'fim de ciclo e transformação', 'uma transformação necessária', 'Algo termina para que outra coisa nasça. Não é perda, é passagem.', 'Deixe ir o que já cumpriu seu papel.'],
      ['A Temperança', 'XIV', 'equilíbrio, integração e paciência', 'o caminho do meio', 'Misturar com calma, sem extremos, traz o ponto certo.', 'Busque o meio-termo.'],
      ['O Diabo', 'XV', 'apegos, padrões e desejos', 'um apego a observar', 'Um padrão antigo pode estar prendendo você. Reconhecer já é começar a se soltar.', 'Nomeie o que te prende.'],
      ['A Torre', 'XVI', 'ruptura, revelação e libertação', 'uma ruptura que liberta', 'Estruturas frágeis podem ruir, e isso abre espaço para algo verdadeiro.', 'Não segure o que já está caindo.'],
      ['A Estrela', 'XVII', 'esperança, renovação e inspiração', 'a esperança renovada', 'Depois da tempestade, a luz volta. Confie no que te inspira.', 'Alimente sua esperança com pequenos atos.'],
      ['A Lua', 'XVIII', 'incerteza, sonhos e intuição', 'a travessia na névoa', 'Nem tudo está claro ainda. Vá devagar e confie na intuição.', 'Não decida no escuro: espere a clareza.'],
      ['O Sol', 'XIX', 'alegria, clareza e vitalidade', 'a clareza luminosa', 'Um tempo de luz, verdade e alegria simples.', 'Celebre e compartilhe.'],
      ['O Julgamento', 'XX', 'despertar, chamado e renovação', 'um chamado ao despertar', 'Algo te chama para uma versão mais inteira de você.', 'Responda ao chamado.'],
      ['O Mundo', 'XXI', 'conclusão, integração e plenitude', 'a plenitude de um ciclo', 'Um ciclo se completa. Reconheça o caminho percorrido.', 'Honre o que você concluiu.']
    ];
    this.state = {
      screen: 'hub', hist: [],
      profile: load().profile || { name: 'Mariana Alves Costa', date: '14/03/1992', time: '07:40', city: 'São Paulo' },
      profileSaved: !!load().profile,
      dName: '', dDate: '', dTime: '', dCity: 'São Paulo', perr: '',
      period: 0, showTech: false, openPlanet: -1, numSel: 'expr', numOpen: '',
      spread: 3, tq: '', prog: 0, holding: false, tick: 0, deck: [], cut: -1, picked: [], flipped: 0
    };
  }
  componentDidMount() {
    this.offData = onData((d) => { if (d.profile) this.setState({ profile: d.profile, profileSaved: true }); });
    this.onGo = (e) => {
      const k = e.detail;
      if (k === 'hub') this.setState({ screen: 'hub', hist: [] });
      else if (k === 'profile') { const p = this.state.profile || {}; this.setState(this.state.profileSaved ? { screen: 'profile', hist: ['hub'], dName: p.name, dDate: p.date, dTime: p.time, dCity: p.city, perr: '' } : { screen: 'profile', hist: ['hub'], perr: '' }); }
      else if (k === 'tarot') this.setState({ screen: 'tSpread', hist: ['hub'] });
      else if (k === 'horo') this.setState(this.state.profileSaved ? { screen: 'horo', hist: ['hub'], period: 0 } : { screen: 'profile', hist: ['hub'], perr: '' });
    };
    window.addEventListener('sym:go', this.onGo);
    this.emitChrome();
  }
  emitChrome() {
    const hide = ['calc', 'tQuestion', 'tShuffle', 'tCut', 'tFan'].includes(this.state.screen);
    window.dispatchEvent(new CustomEvent('alma:chrome', { detail: { src: 'sym', screen: this.state.screen, hide } }));
  }
  componentDidUpdate(pp, ps) { if (this.state.profileSaved && ps.profile !== this.state.profile) save({ profile: this.state.profile }); if (ps.screen !== this.state.screen) this.emitChrome(); }
  componentWillUnmount() { window.removeEventListener('sym:go', this.onGo); this.offData && this.offData(); clearInterval(this.hi); clearTimeout(this.tc); clearTimeout(this.tcut); }

  /* ---------- astronomy ---------- */
  norm(x) { return ((x % 360) + 360) % 360; }
  jdOf(y, mo, d, h, mi, tz) {
    const ut = h - tz + mi / 60;
    let Y = y, M = mo;
    if (M <= 2) { Y -= 1; M += 12; }
    const A = Math.floor(Y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + d + B - 1524.5 + ut / 24;
  }
  lonOf(k, jd) {
    const R = Math.PI / 180, T = (jd - 2451545) / 36525;
    if (k === 'sun') {
      const L0 = 280.46646 + 36000.76983 * T, M = (357.52911 + 35999.05029 * T) * R;
      return this.norm(L0 + (1.914602 - 0.004817 * T) * Math.sin(M) + 0.019993 * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M));
    }
    if (k === 'moon') {
      const Lp = 218.3164477 + 481267.88123421 * T;
      const D = (297.8501921 + 445267.1114034 * T) * R, M = (357.5291092 + 35999.0502909 * T) * R;
      const Mp = (134.9633964 + 477198.8675055 * T) * R, F = (93.2720950 + 483202.0175233 * T) * R;
      return this.norm(Lp + 6.289 * Math.sin(Mp) + 1.274 * Math.sin(2 * D - Mp) + 0.658 * Math.sin(2 * D) + 0.214 * Math.sin(2 * Mp)
        - 0.186 * Math.sin(M) - 0.114 * Math.sin(2 * F) + 0.059 * Math.sin(2 * D - 2 * Mp) + 0.057 * Math.sin(2 * D - M - Mp)
        + 0.053 * Math.sin(2 * D + Mp) + 0.046 * Math.sin(2 * D - M) + 0.041 * Math.sin(Mp - M) - 0.035 * Math.sin(D) - 0.030 * Math.sin(Mp + M));
    }
    const EL = {
      mercury: [0.38709927, 0.00000037, 0.20563593, 0.00001906, 7.00497902, -0.00594749, 252.25032350, 149472.67411175, 77.45779628, 0.16047689, 48.33076593, -0.12534081],
      venus: [0.72333566, 0.00000390, 0.00677672, -0.00004107, 3.39467605, -0.00078890, 181.97909950, 58517.81538729, 131.60246718, 0.00268329, 76.67984255, -0.27769418],
      earth: [1.00000261, 0.00000562, 0.01671123, -0.00004392, -0.00001531, -0.01294668, 100.46457166, 35999.37244981, 102.93768193, 0.32327364, 0, 0],
      mars: [1.52371034, 0.00001847, 0.09339410, 0.00007882, 1.84969142, -0.00813131, -4.55343205, 19140.30268499, -23.94362959, 0.44441088, 49.55953891, -0.29257343],
      jupiter: [5.20288700, -0.00011607, 0.04838624, -0.00013253, 1.30439695, -0.00183714, 34.39644051, 3034.74612775, 14.72847983, 0.21252668, 100.47390909, 0.20469106],
      saturn: [9.53667594, -0.00125060, 0.05386179, -0.00050991, 2.48599187, 0.00193609, 49.95424423, 1222.49362201, 92.59887831, -0.41897216, 113.66242448, -0.28867794]
    };
    const helio = (e0) => {
      const a = e0[0] + e0[1] * T, e = e0[2] + e0[3] * T, I = (e0[4] + e0[5] * T) * R;
      const L = e0[6] + e0[7] * T, vp = e0[8] + e0[9] * T, Om = e0[10] + e0[11] * T;
      const M = this.norm(L - vp) * R, w = (vp - Om) * R, O = Om * R;
      let E = M + e * Math.sin(M);
      for (let i = 0; i < 8; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      const xp = a * (Math.cos(E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(E);
      const cw = Math.cos(w), sw = Math.sin(w), cO = Math.cos(O), sO = Math.sin(O), cI = Math.cos(I);
      return [(cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp, (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp];
    };
    const p = helio(EL[k]), ea = helio(EL.earth);
    return this.norm(Math.atan2(p[1] - ea[1], p[0] - ea[0]) / R + 1.3970 * T);
  }
  ascOf(jd, lat, lonE) {
    const R = Math.PI / 180, d = jd - 2451545.0, T = d / 36525;
    const ramc = this.norm(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T + lonE) * R;
    const eps = (23.439291 - 0.0130042 * T) * R;
    return this.norm(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat * R) * Math.sin(eps))) / R);
  }
  parse(p) {
    const dm = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((p.date || '').trim());
    const tm = /^(\d{1,2})(?::(\d{1,2}))?$/.exec((p.time || '').trim());
    if (!dm) return { err: 'Digite a data completa: dia, mês e ano (ex.: 29/01/1988).' };
    if (!tm) return { err: 'Digite a hora em que nasceu (ex.: 13:00). Se não souber, use 12:00.' };
    const d = +dm[1], mo = +dm[2], y = +dm[3], h = +tm[1], mi = +(tm[2] || 0);
    if (mo < 1 || mo > 12 || d < 1 || d > 31 || y < 1900 || y > new Date().getFullYear() || h > 23 || mi > 59) return { err: 'Confira a data e a hora.' };
    if (!(p.name || '').trim()) return { err: 'Escreva seu nome completo.' };
    return { d, mo, y, h, mi };
  }
  chart(p) {
    const key = JSON.stringify(p);
    if (this._ck === key) return this._cv;
    const q = this.parse(p);
    const c = this.CITIES.find((x) => x[0] === p.city) || this.CITIES[0];
    const jd = this.jdOf(q.y, q.mo, q.d, q.h, q.mi, c[4]);
    const asc = this.ascOf(jd, c[2], c[3]);
    const ascSign = Math.floor(asc / 30);
    const keys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const planets = keys.map((k) => {
      const lon = this.lonOf(k, jd), sign = Math.floor(lon / 30);
      return { k, lon, sign, deg: lon % 30, house: ((sign - ascSign + 12) % 12) + 1 };
    });
    this._ck = key;
    this._cv = { q, city: c, jd, asc, ascSign, planets, by: Object.fromEntries(planets.map((x) => [x.k, x])) };
    return this._cv;
  }
  aspect(a, b) {
    let d = Math.abs(this.norm(a - b));
    if (d > 180) d = 360 - d;
    const A = [[0, 8, 'conjunção', 'conj'], [60, 5, 'sextil', 'sext'], [90, 7, 'quadratura', 'sq'], [120, 7, 'trígono', 'tri'], [180, 8, 'oposição', 'opp']];
    let best = null;
    A.forEach((x) => { const o = Math.abs(d - x[0]); if (o <= x[1] && (!best || o < best.orb)) best = { name: x[2], k: x[3], orb: o }; });
    return best;
  }

  /* ---------- numerology ---------- */
  red(n, keep) {
    while (n > 9 && !(keep && (n === 11 || n === 22 || n === 33))) n = String(n).split('').reduce((a, b) => a + +b, 0);
    return n;
  }
  numbers(p) {
    const q = this.parse(p);
    const letters = (p.name || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z]/g, '').split('');
    const val = (ch) => ((ch.charCodeAt(0) - 65) % 9) + 1;
    const V = 'AEIOU';
    const sum = (arr) => arr.reduce((a, ch) => a + val(ch), 0);
    const all = sum(letters), vow = sum(letters.filter((c) => V.includes(c))), con = sum(letters.filter((c) => !V.includes(c)));
    const rd = this.red(q.d, true), rm = this.red(q.mo, true), ry = this.red(q.y, true);
    const path = this.red(rd + rm + ry, true);
    const NOW = today(), YY = NOW.getFullYear(), MM = NOW.getMonth() + 1, DDAY = NOW.getDate();
    const py = this.red(this.red(q.d) + this.red(q.mo) + this.red(YY));
    const pm = this.red(py + this.red(MM)), pd = this.red(pm + this.red(DDAY));
    return {
      path: { n: path, calc: `${q.d} → ${rd} · ${q.mo} → ${rm} · ${q.y} → ${ry} · ${rd} + ${rm} + ${ry} = ${rd + rm + ry} → ${path}` },
      expr: { n: this.red(all, true), calc: `Todas as letras do nome: ${all} → ${this.red(all, true)}` },
      soul: { n: this.red(vow, true), calc: `Vogais do nome: ${vow} → ${this.red(vow, true)}` },
      pers: { n: this.red(con, true), calc: `Consoantes do nome: ${con} → ${this.red(con, true)}` },
      bday: { n: this.red(q.d, true), calc: `Dia ${q.d} → ${this.red(q.d, true)}` },
      py: { n: py, calc: `Dia + mês + ${YY} → ${py}` },
      pm: { n: pm, calc: `Ano pessoal ${py} + ${this.MONTHS[MM - 1]} (${MM}) → ${pm}` },
      pd: { n: pd, calc: `Mês pessoal ${pm} + dia ${DDAY} → ${pd}` }
    };
  }

  go(screen) { this.setState({ screen, hist: this.state.hist.concat([this.state.screen]) }); }

  renderVals() {
    const s = this.state;
    const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
    const stars = [];
    for (let i = 0; i < 40; i++) {
      const z = 1 + rnd(i, 3) * 2;
      stars.push({ style: `left: ${(rnd(i, 1) * 100).toFixed(1)}%; top: ${(rnd(i, 2) * 100).toFixed(1)}%; width: ${z.toFixed(1)}px; height: ${z.toFixed(1)}px; animation-delay: -${(rnd(i, 5) * 3).toFixed(1)}s; animation-duration: ${(2 + rnd(i, 6) * 3).toFixed(1)}s` });
    }
    const p = s.profile;
    const ch = this.chart(p);
    const q = ch.q;
    const SIGNS = this.SIGNS, SG = this.SG, PL = this.PL;
    const signColor = (i) => this.ELC[i % 4];
    const pf = {
      name: p.name, first: p.name.split(' ')[0],
      line: `${q.d} de ${this.MONTHS[q.mo - 1]} de ${q.y} · ${p.time} · ${ch.city[0]}, ${ch.city[1]}`
    };
    const bigThree = [
      { label: 'Sol', sign: SIGNS[ch.by.sun.sign], glyph: SG[ch.by.sun.sign], color: signColor(ch.by.sun.sign) },
      { label: 'Lua', sign: SIGNS[ch.by.moon.sign], glyph: SG[ch.by.moon.sign], color: signColor(ch.by.moon.sign) },
      { label: 'Ascendente', sign: SIGNS[ch.ascSign], glyph: SG[ch.ascSign], color: signColor(ch.ascSign) }
    ];

    /* mandala */
    const pos = (lon, r, size) => {
      const th = (180 - (lon - ch.asc)) * Math.PI / 180;
      return { x: 160 + r * Math.cos(th) - size / 2, y: 160 - r * Math.sin(th) - size / 2 };
    };
    const mlines = [], msigns = [];
    for (let i = 0; i < 12; i++) {
      const th = 180 - (i * 30 - ch.asc);
      mlines.push({ style: `left: 160px; top: 160px; width: 150px; transform: rotate(${(-th).toFixed(2)}deg)` });
      const g = pos(i * 30 + 15, 135, 26);
      msigns.push({ g: SG[i], style: `left: ${g.x.toFixed(1)}px; top: ${g.y.toFixed(1)}px; color: ${signColor(i)}` });
    }
    const sorted = ch.planets.slice().sort((a, b) => a.lon - b.lon);
    let lastLon = -99, bump = 0;
    const mplanets = sorted.map((pl, i) => {
      if (pl.lon - lastLon < 10) bump = bump === 0 ? 1 : 0; else bump = 0;
      lastLon = pl.lon;
      const g = pos(pl.lon, bump ? 76 : 100, 26);
      return { g: PL[pl.k].g, style: `left: ${g.x.toFixed(1)}px; top: ${g.y.toFixed(1)}px; color: ${PL[pl.k].color}; border: 1px solid ${PL[pl.k].color}88; box-shadow: 0 0 14px ${PL[pl.k].color}55; animation-delay: ${(0.8 + i * 0.12).toFixed(2)}s` };
    });
    const planetRows = [{ k: 'asc', name: 'Ascendente', g: 'AC', color: '#f3d98b', sign: ch.ascSign, deg: ch.asc % 30, house: 1 }]
      .concat(ch.planets.map((x) => ({ k: x.k, name: PL[x.k].name, g: PL[x.k].g, color: PL[x.k].color, sign: x.sign, deg: x.deg, house: x.house })))
      .map((r, i) => ({
        name: r.name, g: r.g, color: r.color, sign: SIGNS[r.sign], sg: SG[r.sign], signColor: signColor(r.sign),
        deg: `${Math.floor(r.deg)}°${String(Math.floor((r.deg % 1) * 60)).padStart(2, '0')}′`, house: `Casa ${r.house}`,
        open: s.openPlanet === i, expanded: s.openPlanet === i ? 'true' : 'false',
        text: r.k === 'asc'
          ? `O ascendente em ${SIGNS[r.sign]} mostra o jeito como você chega ao mundo: com ${this.SIGN_KW[r.sign]}. É a porta de entrada do seu mapa.`
          : `${r.name} em ${SIGNS[r.sign]}: ${PL[r.k].fn} ${this.SIGN_KW[r.sign]}. Na casa ${r.house}, isso se vive no campo de ${this.HOUSE[r.house - 1]}.`,
        pick: () => this.setState({ openPlanet: this.state.openPlanet === i ? -1 : i })
      }));

    /* horoscope */
    const T0 = today(), TY = T0.getFullYear(), TM = T0.getMonth() + 1, TD = T0.getDate();
    const base = this.jdOf(TY, TM, TD, 12, 0, -3);
    const nb = (q.mo > TM || (q.mo === TM && q.d > TD)) ? TY : TY + 1;
    const dm = (d) => `${d.getDate()} de ${this.MONTHS[d.getMonth()]}`;
    const my = (d) => `${this.MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
    const PER = [
      { label: 'Hoje', title: 'Seu dia', range: `${WD_FULL[T0.getDay()]}, ${dm(T0)}`, keys: ['moon'], off: 0, invite: 'Escolha uma única intenção para hoje e volte a ela sempre que se dispersar.' },
      { label: 'Semana', title: 'Sua semana', range: `${dm(T0)} a ${dm(addDays(T0, 6))}`, keys: ['sun', 'mercury'], off: 3, invite: 'Reserve um momento da semana para conversar sobre o que ficou pendente.' },
      { label: 'Mês', title: 'Seu mês', range: 'Próximos 30 dias', keys: ['venus', 'mars'], off: 15, invite: 'Equilibre desejo e cuidado: avance, mas leve as pessoas junto.' },
      { label: '6 meses', title: 'Seus próximos 6 meses', range: `Até ${my(addMonths(T0, 6))}`, keys: ['jupiter', 'saturn'], off: 90, invite: 'Escolha uma área para crescer de verdade e dê a ela constância.' },
      { label: '1 ano', title: 'Seu próximo ano', range: `Até ${my(addMonths(T0, 12))}`, keys: ['saturn', 'jupiter'], off: 180, invite: `Na sua revolução solar, em ${q.d} de ${this.MONTHS[q.mo - 1]} de ${nb}, escreva o que você quer construir no novo ciclo.` }
    ];
    const per = PER[s.period];
    const jdT = base + per.off;
    const tr = per.keys.map((k) => {
      const lon = this.lonOf(k, jdT), sign = Math.floor(lon / 30);
      return { k, lon, sign, deg: lon % 30, house: ((sign - ch.ascSign + 12) % 12) + 1 };
    });
    const main = tr[0];
    const targets = [['Sol', ch.by.sun.lon], ['Lua', ch.by.moon.lon], ['Ascendente', ch.asc]];
    let asp = null;
    targets.forEach((t) => { const a = this.aspect(main.lon, t[1]); if (a && (!asp || a.orb < asp.orb)) asp = Object.assign(a, { to: t[0] }); });
    const TONE = {
      conj: 'intensifica esse tema e coloca você no centro dele',
      tri: 'traz fluidez: o que você semear tende a crescer com menos esforço',
      sext: 'abre pequenas oportunidades que pedem um passo seu',
      sq: 'cria um atrito produtivo: algo pede ajuste, e o desconforto é o motor da mudança',
      opp: 'pede equilíbrio entre o que você quer e o que o outro traz'
    };
    const mp = PL[main.k];
    const second = tr[1];
    const horo = {
      title: per.title, range: per.range,
      sun: SIGNS[ch.by.sun.sign], moon: SIGNS[ch.by.moon.sign], asc: SIGNS[ch.ascSign],
      g: mp.g, color: mp.color, glow: mp.color + '55',
      head: `${mp.name} em ${SIGNS[main.sign]} na sua casa ${main.house}`,
      p1: `${mp.art || mp.name} atravessa ${SIGNS[main.sign]} e ativa a sua casa ${main.house}, a área de ${this.HOUSE[main.house - 1]}. O período traz ${mp.energy} para esse campo da sua vida.`,
      p2: asp ? `Ao formar ${asp.name} com ${({ 'Sol': 'o seu Sol', 'Lua': 'a sua Lua', 'Ascendente': 'o seu ascendente' })[asp.to]} de nascimento, ${(mp.art || mp.name).replace(/^O /, 'o ').replace(/^A /, 'a ')} ${TONE[asp.k]}.` : 'Sem contatos exatos com os seus pontos pessoais, é um período de fundo: um bom momento para observar antes de agir.',
      hasExtra: !!second,
      extra: second ? `Também em jogo: ${PL[second.k].name} em ${SIGNS[second.sign]}, na casa ${second.house} (${this.HOUSE[second.house - 1]}), acrescenta ${PL[second.k].energy}.` : '',
      areas: [['Trabalho', 'T', '#a8d8ff'], ['Amor e vínculos', 'A', '#f5a8c8'], ['Energia interior', 'E', '#8fe3b0']].map((a, i) => ({ label: a[0], ic: a[1], color: a[2], text: this.AREAS[main.k][i] })),
      invite: per.invite,
      anim: `animation-name: ${s.period % 2 ? 'wordIn' : 'screenIn'}`,
      tech: tr.map((x) => ({ t: `${PL[x.k].name} em trânsito: ${Math.floor(x.deg)}° de ${SIGNS[x.sign]}, casa ${x.house} do seu mapa (casas por signo inteiro).` }))
        .concat(asp ? [{ t: `Aspecto principal: ${asp.name} de ${mp.name} com ${asp.to} natal, orbe de ${asp.orb.toFixed(1).replace('.', ',')}°.` }] : [])
        .concat([{ t: `Natal: Sol ${Math.floor(ch.by.sun.deg)}° ${SIGNS[ch.by.sun.sign]}, Lua ${Math.floor(ch.by.moon.deg)}° ${SIGNS[ch.by.moon.sign]}, Ascendente ${Math.floor(ch.asc % 30)}° ${SIGNS[ch.ascSign]}.` }])
    };
    const periods = PER.map((x, i) => ({
      label: x.label, pressed: s.period === i ? 'true' : 'false',
      style: s.period === i ? 'background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.5)' : 'background: rgba(255,255,255,.04); color: rgba(244,241,234,.75)',
      pick: () => this.setState({ period: i })
    }));

    /* numerology */
    const N = this.numbers(p);
    const nm = (n) => this.NUMM[n] || this.NUMM[this.red(n)];
    const num = { path: { n: N.path.n, title: nm(N.path.n)[0], text: nm(N.path.n)[1], calc: N.path.calc } };
    const CY = today().getFullYear(), CMN = this.MONTHS[today().getMonth()], CD = today().getDate();
    const NT = [
      ['expr', 'Expressão', 'A expressão mostra seus talentos e a forma como você age no mundo.'],
      ['soul', 'Desejo da alma', 'O desejo da alma revela o que te move por dentro.'],
      ['pers', 'Personalidade', 'A personalidade é a primeira impressão que você causa.'],
      ['bday', 'Dom do aniversário', 'O dia do nascimento traz um dom especial.'],
      ['py', `Ano pessoal ${CY}`, `O ano pessoal indica o grande tema de ${CY} para você.`],
      ['pm', 'Mês pessoal', `O mês pessoal colore este ${CMN}.`],
      ['pd', 'Dia pessoal', 'O dia pessoal indica a vibração de hoje.']
    ];
    const numTiles = NT.map((t) => ({
      n: N[t[0]].n, label: t[1], title: nm(N[t[0]].n)[0].replace(' · número mestre', ''), pressed: s.numSel === t[0] ? 'true' : 'false',
      style: s.numSel === t[0] ? 'border-color: rgba(243,217,139,.6); box-shadow: 0 0 24px rgba(243,217,139,.15)' : '',
      pick: () => this.setState({ numSel: t[0] })
    }));
    const DEF = {
      path: ['Caminho de vida', 'É o número mais importante do seu mapa numerológico: a grande lição e a direção desta vida.', 'Somamos dia, mês e ano de nascimento, reduzindo cada parte a um dígito e mantendo os números mestres 11, 22 e 33.'],
      expr: ['Expressão', 'Mostra seus talentos naturais e o jeito como você age no mundo.', 'Cada letra do nome completo de registro vale de 1 a 9 (A=1, B=2, até I=9, e recomeça em J=1). Somamos todas e reduzimos.'],
      soul: ['Desejo da alma', 'Revela o que te move por dentro: desejos, motivações e o que faz você se sentir inteiro.', 'Somamos apenas as vogais do nome completo de registro.'],
      pers: ['Personalidade', 'É a primeira impressão que você causa, o que o mundo percebe antes de te conhecer de verdade.', 'Somamos apenas as consoantes do nome completo de registro.'],
      bday: ['Dom do aniversário', 'O dia em que você nasceu traz um talento específico, que complementa o seu caminho de vida.', 'Reduzimos o dia do nascimento a um dígito, mantendo 11 e 22.'],
      py: [`Ano pessoal ${CY}`, `Indica o tema que atravessa o seu ${CY}. Os anos pessoais seguem um ciclo de 9, e cada um tem um papel.`, 'Somamos dia e mês de nascimento ao ano atual, e reduzimos.'],
      pm: ['Mês pessoal', 'Colore o mês atual dentro do tema do seu ano.', `Somamos o seu ano pessoal ao número do mês (${CMN} = ${today().getMonth() + 1}).`],
      pd: ['Dia pessoal', 'Mostra a vibração de hoje, útil para escolher o foco do dia.', `Somamos o seu mês pessoal ao dia de hoje (${CD}).`]
    };
    const mkItem = (k) => {
      const n = N[k].n, cyc = k === 'py' || k === 'pm' || k === 'pd';
      const X = this.NUMX[n] || this.NUMX[this.red(n)], C = this.CYC[this.red(n)];
      const open = s.numOpen === k;
      return {
        n, label: DEF[k][0], what: DEF[k][1], how: DEF[k][2], calc: N[k].calc,
        title: cyc ? C[0].split('.')[0] : nm(n)[0], short: cyc ? '' : nm(n)[1].replace(new RegExp('^' + nm(n)[0].split(' ')[0] + ',\\s*', 'i'), (m) => '').replace(/^./, (c) => c.toUpperCase()),
        ess: !cyc ? X[0] : k === 'py' ? C[0] : `${C[0].split('.')[0]}. Esta vibração colore ${k === 'pm' ? `o seu mês de ${CMN}, dentro do tema do ano` : 'o seu dia de hoje: um bom foco para as próximas horas'}.`, luz: X[1], sombra: X[2], convite: X[3], fazer: C[1], evitar: C[2],
        isPerson: !cyc, isCycle: cyc, isPY: k === 'py',
        dots: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({ n: d, style: d === this.red(n) ? 'background: #f3d98b; color: #1a1408; font-weight: 500; box-shadow: 0 0 12px rgba(243,217,139,.6)' : d < this.red(n) ? 'background: rgba(243,217,139,.18); color: rgba(244,241,234,.7)' : 'background: rgba(255,255,255,.05); color: rgba(244,241,234,.45)' })),
        open, expanded: open ? 'true' : 'false', btn: open ? 'Fechar explicação' : 'Entender meu caminho de vida',
        chev: `transition: transform .4s ease; transform: rotate(${open ? 180 : 0}deg)`,
        cardStyle: open ? 'border-color: rgba(243,217,139,.45)' : '',
        toggle: () => this.setState({ numOpen: this.state.numOpen === k ? '' : k })
      };
    };
    const px = mkItem('path');
    const nameItems = ['expr', 'soul', 'pers'].map(mkItem);
    const dateItems = ['bday', 'py', 'pm', 'pd'].map(mkItem).map((it) => Object.assign(it, { short: it.short || ({ [`Ano pessoal ${CY}`]: 'o tema do seu ano', 'Mês pessoal': `o tom de ${CMN}`, 'Dia pessoal': 'a vibração de hoje' })[it.label] || '' }));
    const sel = NT.find((t) => t[0] === s.numSel);
    const sn = N[sel[0]].n;
    const numDetail = {
      label: sel[1], n: sn, intro: sel[2], calc: N[sel[0]].calc,
      text: sel[0] === 'py' ? `Para você, ${CY} é ${this.PY[this.red(sn)]}. ${nm(sn)[1]}` : `${nm(sn)[0]}: ${nm(sn)[1]}`,
      anim: `animation-name: ${NT.indexOf(sel) % 2 ? 'wordIn' : 'screenIn'}`
    };

    /* tarot */
    const holding = s.holding;
    const shufCards = [];
    for (let i = 0; i < 7; i++) {
      const j = holding ? (s.tick + i * 3) : 0;
      const dx = holding ? ((rnd(j, 1) - 0.5) * 120) : (i - 3) * 1.2;
      const dy = holding ? ((rnd(j, 2) - 0.5) * 40) : -i * 1.5;
      const rot = holding ? ((rnd(j, 3) - 0.5) * 30) : (i - 3) * 0.8;
      shufCards.push({ style: `transform: translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${rot.toFixed(1)}deg)` });
    }
    const pct = Math.min(100, Math.round(s.prog));
    const piles = [0, 1, 2].map((i) => {
      const chosen = s.cut === i, other = s.cut >= 0 && !chosen;
      return {
        aria: `Monte ${i + 1}`,
        style: other ? 'opacity: .15; transform: scale(.9)' : chosen ? 'transform: translateY(-16px) scale(1.06)' : '',
        topStyle: chosen ? 'box-shadow: 0 0 34px rgba(243,217,139,.6), inset 0 0 0 4px #15112b, inset 0 0 0 5px rgba(243,217,139,.5)' : '',
        pick: () => {
          if (this.state.cut >= 0) return;
          this.setState({ cut: i });
          clearTimeout(this.tcut);
          this.tcut = setTimeout(() => {
            const k = [0, 7, 14][i], d = this.state.deck;
            this.setState({ deck: d.slice(k).concat(d.slice(0, k)), screen: 'tFan', picked: [], hist: this.state.hist.concat(['tCut']) });
          }, 1000);
        }
      };
    });
    const need = s.spread;
    const fan = [];
    for (let i = 0; i < 22; i++) {
      const a = -52 + i * (104 / 21);
      const pk = s.picked.includes(i);
      fan.push({
        aria: `Carta ${i + 1} do leque`, pressed: pk ? 'true' : 'false',
        style: `--a: ${a.toFixed(1)}deg; transform: rotate(${a.toFixed(1)}deg) translateY(${pk ? -34 : 0}px); ${pk ? 'box-shadow: 0 0 26px rgba(243,217,139,.8), inset 0 0 0 4px #15112b, inset 0 0 0 5px rgba(243,217,139,.6); z-index: 2;' : ''} animation-delay: ${(i * 0.03).toFixed(2)}s`,
        pick: () => {
          const pkd = this.state.picked.slice();
          const k = pkd.indexOf(i);
          if (k >= 0) pkd.splice(k, 1); else if (pkd.length < need) pkd.push(i);
          this.setState({ picked: pkd });
        }
      });
    }
    const POS = need === 1 ? [['Conselho do dia', 'Como conselho, ']] : [['Raiz', 'Na raiz, '], ['Presente', 'No presente, '], ['Caminho', 'No caminho, ']];
    const cards = s.picked.map((fi) => this.TAROT[s.deck[fi]]);
    const big = need === 1;
    const W = big ? 170 : 104, H = big ? 280 : 172;
    const slots = cards.map((c, j) => {
      const n = s.deck[s.picked[j]];
      const hue = `hsl(${(n * 37) % 360} 60% 60%)`, hueSoft = `hsl(${(n * 37) % 360} 70% 88%)`;
      const k = 3 + (n % 5), rot = n * 13 * Math.PI / 180;
      const poly = [], star = [];
      for (let i = 0; i < k; i++) {
        const t = rot + i * 2 * Math.PI / k;
        poly.push(`${(30 + 17 * Math.cos(t)).toFixed(1)},${(30 + 17 * Math.sin(t)).toFixed(1)}`);
      }
      for (let i = 0; i < 2 * k; i++) {
        const t = -rot + i * Math.PI / k, r = i % 2 ? 4 : 11;
        star.push(`${(30 + r * Math.cos(t)).toFixed(1)},${(30 + r * Math.sin(t)).toFixed(1)}`);
      }
      const flipped = j < s.flipped;
      return {
        pos: POS[j][0], num: c[1], name: c[0], hue, hueSoft, poly: poly.join(' '), star: star.join(' '),
        aria: flipped ? `${POS[j][0]}: ${c[0]}` : `Virar a carta: ${POS[j][0]}`,
        box: `width: ${W}px; height: ${H}px; ${j === s.flipped ? 'filter: drop-shadow(0 0 16px rgba(243,217,139,.55));' : ''}`,
        inner: `transform: rotateY(${flipped ? 180 : 0}deg)`,
        backStyle: 'border-radius: 12px',
        frontPad: big ? 'padding: 18px 10px' : 'padding: 10px 6px',
        numSize: big ? '16px' : '11px', nameSize: big ? '16px' : '11px',
        sigilSize: big ? 'width: 120px; height: 120px' : 'width: 64px; height: 64px',
        flipIt: () => { if (j === this.state.flipped) { this.setState({ flipped: j + 1 }); if (j + 1 === cards.length) save({ readings: (load().readings || []).concat([{ at: Date.now(), q: this.state.tq || '', cards: cards.map((c) => c[0]), spread: cards.length }]) }); } }
      };
    });
    const low = (n) => n.replace(/^(O|A|Os) /, (m) => m.toLowerCase());
    const cj = (prep, x) => {
      const M = { de: { 'o ': 'do ', 'a ': 'da ', 'os ': 'dos ', 'as ': 'das ' }, por: { 'o ': 'pelo ', 'a ': 'pela ', 'os ': 'pelos ', 'as ': 'pelas ' }, a: { 'o ': 'ao ', 'a ': 'à ', 'os ': 'aos ', 'as ': 'às ' } };
      const m = /^(os |as |o |a )/.exec(x);
      return m ? M[prep][m[1]] + x.slice(m[1].length) : `${prep} ${x}`;
    };
    const readings = cards.slice(0, s.flipped).map((c, j) => {
      const txt = `${POS[j][1]}${low(c[0])} ${/^Os /.test(c[0]) ? 'falam' : 'fala'} ${cj('de', c[3])}. ${c[4]}`;
      return { pos: POS[j][0], name: c[0], kw: c[2], words: txt.split(' ').map((w, i) => ({ w, style: `animation-delay: ${(0.5 + i * 0.05).toFixed(2)}s` })) };
    });
    const allFlipped = cards.length > 0 && s.flipped >= cards.length;
    let synth = { p1: '', p2: '', adv: '' };
    if (allFlipped) {
      if (need === 1) synth = { p1: `Hoje, ${low(cards[0][0])} pede a sua atenção para ${cards[0][3]}.`, p2: 'Leve esta imagem com você ao longo do dia e perceba onde ela aparece.', adv: cards[0][5] };
      else synth = {
        p1: `Sua tiragem vai ${cj('de', cards[0][3])} ${cj('a', cards[2][3])}, passando ${cj('por', cards[1][3])}.`,
        p2: s.tq ? `Sobre a sua pergunta, as cartas sugerem olhar para o presente com atenção: é ali que ${low(cards[1][0])} mostra onde está a sua força agora.` : `O presente, com ${low(cards[1][0])}, é a ponte: é ali que está a sua escolha.`,
        adv: cards[2][5]
      };
    }
    const tqChips = ['O que preciso saber hoje?', 'Como está meu caminho profissional?', 'O que o amor me pede agora?'].map((t) => ({ t, pick: () => this.setState({ tq: t }) }));
    const CRUMB = { profile: 'Perfil', calc: 'Calculando', map: 'Mapa natal', horo: 'Horóscopo', num: 'Numerologia', tSpread: 'Tarô', tQuestion: 'Tarô · Intenção', tShuffle: 'Tarô · Embaralhar', tCut: 'Tarô · Cortar', tFan: 'Tarô · Escolher', tReveal: 'Tarô · Leitura' };
    const calcRing = SG.map((g, i) => {
      const t = (-90 + i * 30) * Math.PI / 180;
      return { g, style: `left: ${(120 + 105 * Math.cos(t) - 15).toFixed(1)}px; top: ${(120 + 105 * Math.sin(t) - 15).toFixed(1)}px; color: ${signColor(i)}; animation-delay: ${(i * 0.08).toFixed(2)}s` };
    });
    const scr = s.screen;
    const startDeck = () => {
      const d = []; for (let i = 0; i < 22; i++) d.push(i);
      for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = d[i]; d[i] = d[j]; d[j] = t; }
      return d;
    };
    const finishShuffle = () => {
      clearInterval(this.hi);
      this.setState({ holding: false, prog: 100, deck: startDeck() });
      clearTimeout(this.tc);
      this.tc = setTimeout(() => this.setState({ screen: 'tCut', cut: -1, hist: this.state.hist.concat(['tShuffle']) }), 500);
    };

    return {
      stars, pf, bigThree, num, numTiles, numDetail, calcRing, px, nameItems, dateItems,
      mandala: { lines: mlines, signs: msigns, planets: mplanets }, planetRows,
      horo, periods, showTech: s.showTech, techExpanded: s.showTech ? 'true' : 'false', techChev: `transition: transform .4s ease; transform: rotate(${s.showTech ? 180 : 0}deg)`,
      isHub: scr === 'hub', notHub: scr !== 'hub', crumb: CRUMB[scr] || '',
      isProfile: scr === 'profile', isCalc: scr === 'calc', isMap: scr === 'map', isHoro: scr === 'horo', isNum: scr === 'num',
      isTSpread: scr === 'tSpread', isTQuestion: scr === 'tQuestion', isTShuffle: scr === 'tShuffle', isTCut: scr === 'tCut', isTFan: scr === 'tFan', isTReveal: scr === 'tReveal',
      dName: s.dName, dDate: s.dDate, dTime: s.dTime, dCity: s.dCity, perr: s.perr, hasErr: !!s.perr,
      cityOpts: this.CITIES.map((c) => ({ name: c[0], label: `${c[0]}, ${c[1]}` })),
      onName: (e) => this.setState({ dName: e.target.value, perr: '' }),
      onDate: (e) => {
        const d = e.target.value.replace(/\D/g, '').slice(0, 8);
        const v = d.length <= 2 ? d : d.length <= 4 ? `${d.slice(0, 2)}/${d.slice(2)}` : `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
        this.setState({ dDate: v, perr: '' });
      },
      onTime: (e) => {
        const d = e.target.value.replace(/\D/g, '').slice(0, 4);
        const v = d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
        this.setState({ dTime: v, perr: '' });
      },
      onCity: (e) => this.setState({ dCity: e.target.value }),
      saveProfile: () => {
        const np = { name: this.state.dName.replace(/\s+/g, ' ').trim(), date: this.state.dDate.trim(), time: this.state.dTime.trim(), city: this.state.dCity };
        const tm0 = /^(\d{1,2})(?::(\d{1,2}))?$/.exec(np.time);
        if (tm0) np.time = `${tm0[1].padStart(2, '0')}:${(tm0[2] || '0').padStart(2, '0')}`;
        const dm0 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(np.date);
        if (dm0) np.date = `${dm0[1].padStart(2, '0')}/${dm0[2].padStart(2, '0')}/${dm0[3]}`;
        const r = this.parse(np);
        if (r.err) { this.setState({ perr: r.err }); return; }
        this.setState({ profile: np, profileSaved: true, screen: 'calc', perr: '', openPlanet: -1 });
        clearTimeout(this.tc);
        this.tc = setTimeout(() => this.setState({ screen: 'map', hist: ['hub'] }), 2600);
      },
      back: () => {
        const h = this.state.hist.slice();
        let prev = h.pop() || 'hub';
        if (prev === 'calc' || prev === 'tShuffle' || prev === 'tCut') prev = 'hub';
        clearInterval(this.hi);
        this.setState({ screen: prev, hist: h, holding: false });
      },
      goProfile: () => this.setState(this.state.profileSaved ? { screen: 'profile', hist: ['hub'], dName: p.name, dDate: p.date, dTime: p.time, dCity: p.city, perr: '' } : { screen: 'profile', hist: ['hub'], perr: '' }),
      goMap: () => this.setState(this.state.profileSaved ? { screen: 'map', hist: ['hub'] } : { screen: 'profile', hist: ['hub'], perr: '' }),
      goHoro: () => this.setState(this.state.profileSaved ? { screen: 'horo', hist: ['hub'] } : { screen: 'profile', hist: ['hub'], perr: '' }),
      mapToHoro: () => this.setState({ screen: 'horo', hist: ['hub', 'map'], period: 0 }),
      mapToNum: () => this.setState({ screen: 'num', hist: ['hub', 'map'] }),
      goNum: () => this.setState(this.state.profileSaved ? { screen: 'num', hist: ['hub'] } : { screen: 'profile', hist: ['hub'], perr: '' }),
      goTarot: () => this.setState({ screen: 'tSpread', hist: ['hub'] }),
      toggleTech: () => this.setState({ showTech: !this.state.showTech }),
      pick1: () => this.setState({ spread: 1, screen: 'tQuestion', hist: ['hub', 'tSpread'], tq: '' }),
      pick3: () => this.setState({ spread: 3, screen: 'tQuestion', hist: ['hub', 'tSpread'], tq: '' }),
      tq: s.tq, hasTq: !!s.tq.trim(), tqChips,
      onTq: (e) => this.setState({ tq: e.target.value }),
      toShuffle: () => this.setState({ screen: 'tShuffle', prog: 0, holding: false, flipped: 0, picked: [], cut: -1, hist: this.state.hist.concat(['tQuestion']) }),
      shufCards, shufPct: pct >= 100 ? 'Pronto' : `${pct}%`,
      shufGuide: pct >= 100 ? 'Pronto. As cartas já conhecem a sua intenção.' : holding ? 'Isso, continue. Pense na sua pergunta enquanto as cartas se misturam.' : 'Segure o botão para embaralhar. Solte quando quiser respirar, e volte a segurar.',
      shufRing: `background: conic-gradient(#f3d98b 0% ${pct}%, rgba(255,255,255,.12) ${pct}% 100%); box-shadow: 0 0 ${holding ? 40 : 16}px rgba(243,217,139,${holding ? '.5' : '.2'})`,
      holdStart: () => {
        if (this.state.prog >= 100) return;
        this.held = true; this.holdT = Date.now();
        this.setState({ holding: true });
        clearInterval(this.hi);
        this.hi = setInterval(() => {
          const np = this.state.prog + 3.2;
          if (np >= 100) { finishShuffle(); return; }
          this.setState({ prog: np, tick: this.state.tick + 1 });
        }, 90);
      },
      holdEnd: () => { clearInterval(this.hi); if (this.state.holding) this.setState({ holding: false }); },
      shufClick: () => {
        const wasLongHold = this.held && Date.now() - (this.holdT || 0) > 300;
        this.held = false;
        if (wasLongHold) return;
        const np = this.state.prog + 25;
        if (np >= 100) finishShuffle(); else this.setState({ prog: np, tick: this.state.tick + 7 });
      },
      piles, fan,
      fanGuide: s.picked.length >= need ? 'Suas cartas foram escolhidas. Quando sentir, coloque-as na mesa.' : need === 1 ? 'Deslize os olhos pelo leque e toque na carta que te chamar.' : 'Escolha três cartas, sem pensar demais. Toque de novo para devolver uma carta.',
      fanCount: `${s.picked.length} de ${need} ${need === 1 ? 'carta' : 'cartas'}`,
      fanReady: s.picked.length >= need,
      toReveal: () => this.setState({ screen: 'tReveal', flipped: 0, hist: ['hub'] }),
      slots, readings, allFlipped, synth,
      revealGuide: allFlipped ? 'Esta é a sua leitura. Fique com o que ressoar.' : s.flipped === 0 ? 'As cartas estão na mesa. Toque na primeira para revelá-la.' : 'Respire. Quando estiver pronto, toque na próxima carta.',
      newReading: () => this.setState({ screen: 'tSpread', hist: ['hub'], picked: [], flipped: 0, tq: '' }),
      handoff: () => {
        const names = cards.map((c) => c[0]);
        const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} e ${names[names.length - 1]}` : names[0];
        const q = (s.tq || '').trim()
          ? `${s.tq.trim()} No tarô, tirei ${list}. O que isso pode me ensinar agora?`
          : `No tarô, tirei ${list}. O que isso pode me ensinar agora?`;
        try { localStorage.setItem('alma-handoff', JSON.stringify({ q, from: 'tarô', at: Date.now() })); } catch (e) {}
      }
    };
  }
}

Component.prototype.render = function render() {
  const R = this.renderVals();
  return (
    <div className="sc-sym">
      <div style={css("width: 390px; height: 844px; position: relative; overflow: hidden; background: #0a0918")}>
        <div className="aurora" style={css("width: 420px; height: 420px; left: -170px; top: -140px; background: #5b4bc4")}></div>
        <div className="aurora" style={css("width: 360px; height: 360px; right: -170px; top: 300px; background: #b07bd8; opacity: .28; animation-duration: 26s")}></div>
        <div className="aurora" style={css("width: 320px; height: 320px; left: -60px; bottom: -150px; background: #d9a85c; opacity: .22; animation-duration: 31s")}></div>
        {(R.stars || []).map((L1_m, I1) => (
          <React.Fragment key={I1}>
            <span className="mote" style={css(L1_m?.style)}></span>
          </React.Fragment>
        ))}
        <div style={css("position: absolute; top: calc(-1 * var(--sat, 0px)); left: -600px; right: -600px; height: calc(104px + var(--sat, 0px)); z-index: 3; pointer-events: none; background: linear-gradient(180deg, #0a0918 55%, rgba(10,9,24,0))")}></div>
        <div style={css("position: absolute; top: 36px; left: 12px; right: 12px; height: 44px; z-index: 5; display: flex; align-items: center; gap: 4px")}>
          {R.isHub ? (
            <span style={css("padding-left: 10px; font-size: 17px; font-weight: 300; letter-spacing: .38em; color: rgba(244,241,234,.85)")}>{"alma"}</span>
          ) : null}
          {R.notHub ? (
            <>
              <button onClick={R.back} aria-label="Voltar" style={css("width: 44px; height: 44px; display: flex; align-items: center; justify-content: center")}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f4f1ea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <span className="kicker" style={css("font-size: 15px")}>
                {R.crumb}
              </span>
            </>
          ) : null}
        </div>
        {R.isHub ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 64px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <SkyHero onOpen={R.goHoro} />
                <p style={css("margin: -4px 0 4px; text-align: center; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.66)")}>
                  {"Astrologia, numerologia e tarô como espelhos para se conhecer. Convites à reflexão, não sentenças sobre o futuro."}
                </p>
                {!this.state.profileSaved ? (
                <button className="glass pill" onClick={R.goProfile} style={css("width: 100%; border-radius: 24px; padding: 18px; text-align: left; display: flex; flex-direction: column; gap: 10px; border-color: rgba(243,217,139,.45)")}>
                  <span style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #f3d98b")}>Comece por aqui</span>
                  <span style={css("font-size: 18px; font-weight: 300; line-height: 1.35")}>Crie seu perfil de nascimento</span>
                  <span style={css("font-size: 17px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.7)")}>Com data, hora e cidade, a Alma calcula seu mapa, seu horóscopo e seus números. Leva menos de um minuto.</span>
                  <span style={css("align-self: flex-start; margin-top: 4px; height: 40px; padding: 0 18px; border-radius: 999px; display: inline-flex; align-items: center; font-size: 17.5px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #ffc79a)")}>Criar meu perfil</span>
                </button>
              ) : null}
              {this.state.profileSaved ? (
                <button className="glass pill" onClick={R.goProfile} style={css("width: 100%; border-radius: 24px; padding: 18px; text-align: left; display: flex; flex-direction: column; gap: 14px")}>
                  <span style={css("width: 100%; display: flex; align-items: center; justify-content: space-between")}>
                    <span className="kicker">
                      {this.state.profileSaved ? 'Seu perfil da alma' : 'Perfil de exemplo'}
                    </span>
                    <span style={css("font-size: 17px; color: #f3d98b")}>
                      {this.state.profileSaved ? 'Editar' : 'Criar'}
                    </span>
                  </span>
                  <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("font-size: 18px; font-weight: 400")}>
                      {R.pf?.name}
                    </span>
                    <span style={css("font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.65)")}>
                      {R.pf?.line}
                    </span>
                  </span>
                  <span style={css("display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px")}>
                    {(R.bigThree || []).map((L2_b, I2) => (
                      <React.Fragment key={I2}>
                        <span style={css("border-radius: 16px; padding: 10px 8px; background: rgba(255,255,255,.05); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center")}>
                          <span className="sym" style={css(`font-size: 22px; line-height: 1; color: ${(L2_b?.color) ?? ''}`)}>
                            {L2_b?.glyph}
                          </span>
                          <span style={css("font-size: 15px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,234,.5)")}>
                            {L2_b?.label}
                          </span>
                          <span style={css("font-size: 17.5px")}>
                            {L2_b?.sign}
                          </span>
                        </span>
                      </React.Fragment>
                    ))}
                  </span>
                </button>
              ) : null}
                <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
                  <button className="glass pill sky-tile" onClick={R.goTarot} style={css("grid-column: span 2; border-radius: 24px; padding: 20px; text-align: left; display: flex; align-items: center; gap: 16px; border-color: rgba(243,217,139,.4)")}>
                    <span className="sky-float" style={css("position: relative; width: 58px; height: 80px; flex-shrink: 0")}>
                      <span className="cardback" style={css("position: absolute; left: 0; top: 4px; width: 46px; height: 72px; border-radius: 8px; transform: rotate(-10deg)")}></span>
                      <span className="cardback" style={css("position: absolute; left: 12px; top: 0; width: 46px; height: 72px; border-radius: 8px; transform: rotate(8deg)")}></span>
                    </span>
                    <span style={css("display: flex; flex-direction: column; gap: 6px")}>
                      <span className="goldtext" style={css("font-size: 16px; letter-spacing: .22em; text-transform: uppercase")}>
                        {"Tarô guiado"}
                      </span>
                      <span style={css("font-size: 18px; font-weight: 300; line-height: 1.3")}>
                        {"Jogue as cartas com a Alma"}
                      </span>
                      <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                        {"Embaralhe, corte e escolha. Ela lê cada carta."}
                      </span>
                    </span>
                  </button>
                  <button className="glass pill sky-tile" onClick={R.goHoro} style={css("border-radius: 24px; padding: 18px 16px; text-align: left; display: flex; flex-direction: column; gap: 10px; min-height: 150px")}>
                    <span className="sym sky-spin" style={css("display: inline-block; width: 26px; font-size: 26px; line-height: 1; color: #b9a6ff; text-shadow: 0 0 14px #b9a6ff")}>
                      {"☉︎"}
                    </span>
                    <span style={css("font-size: 17px; font-weight: 400")}>
                      {"Horóscopo"}
                    </span>
                    <span style={css("font-size: 17px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.6)")}>
                      {"Do dia a um ano, pelo seu mapa completo"}
                    </span>
                  </button>
                  <button className="glass pill sky-tile" onClick={R.goMap} style={css("border-radius: 24px; padding: 18px 16px; text-align: left; display: flex; flex-direction: column; gap: 10px; min-height: 150px")}>
                    <svg className="sky-spin" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a8d8ff" strokeWidth="1.3" aria-hidden="true" style={{ filter: "drop-shadow(0 0 6px #a8d8ff)" }}>
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="5" />
                      <path d="M2 12h20M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" opacity=".5" />
                    </svg>
                    <span style={css("font-size: 17px; font-weight: 400")}>
                      {"Mapa natal"}
                    </span>
                    <span style={css("font-size: 17px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.6)")}>
                      {"Planetas, signos e casas do seu nascimento"}
                    </span>
                  </button>
                  <button className="glass pill sky-tile" onClick={R.goNum} style={css("grid-column: span 2; border-radius: 24px; padding: 18px; text-align: left; display: flex; align-items: center; gap: 16px")}>
                    <span className="sky-pulse" style={css("width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 200; color: #f3d98b; border: 1px solid rgba(243,217,139,.5); box-shadow: 0 0 24px rgba(243,217,139,.2)")}>
                      {this.state.profileSaved ? R.num?.path?.n : '#'}
                    </span>
                    <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                      <span style={css("font-size: 17px; font-weight: 400")}>
                        {"Numerologia completa"}
                      </span>
                      <span style={css("font-size: 17px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.6)")}>
                        {this.state.profileSaved ? `Caminho de vida ${(R.num?.path?.n) ?? ''}, expressão, alma, ciclos e seu ano pessoal` : 'Caminho de vida, expressão, alma, ciclos e seu ano pessoal'}
                      </span>
                    </span>
                  </button>
                  <button className="glass pill sky-tile" onClick={() => { window.location.hash = '#/banhos'; }} style={css("grid-column: span 2; border-radius: 24px; padding: 18px; text-align: left; display: flex; align-items: center; gap: 16px; border-color: rgba(143,227,176,.35)")}>
                    <span className="sky-bubble orb-live" style={css("width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; --o1: #8fe3b0; --o2: #a8e0e0; box-shadow: 0 0 24px rgba(143,227,176,.45)")}></span>
                    <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                      <span style={css("font-size: 17px; font-weight: 400")}>Banhos da Lua</span>
                      <span style={css("font-size: 17px; font-weight: 300; line-height: 1.5; color: rgba(244,241,234,.6)")}>Limpeza, amor, prosperidade, calma. Banhos de ervas que combinam com a Lua de hoje</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {R.isProfile ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"Perfil da alma"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 28px; line-height: 1.2; font-weight: 300")}>
                    {"Conte à Alma quando você chegou"}
                  </h1>
                  <p style={css("margin: 8px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.66)")}>
                    {"Com data, hora e cidade, a leitura vai muito além do signo: ascendente, Lua, casas e ciclos pessoais."}
                  </p>
                </div>
                <div className="glass" style={css("border-radius: 24px; padding: 18px; display: flex; flex-direction: column; gap: 14px")}>
                  <label style={css("display: flex; flex-direction: column; gap: 6px")}>
                    <span className="kicker" style={css("font-size: 15px")}>
                      {"Nome completo de registro"}
                    </span>
                    <input value={R.dName} onChange={R.onName} style={css("height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.05); font-size: 17px; font-weight: 300; outline: none")} />
                  </label>
                  <div style={css("display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px")}>
                    <label style={css("display: flex; flex-direction: column; gap: 6px")}>
                      <span className="kicker" style={css("font-size: 15px; letter-spacing: .12em")}>
                        {"Data de nascimento"}
                      </span>
                      <input value={R.dDate} onChange={R.onDate} placeholder="dd/mm/aaaa" inputMode="numeric" maxLength="10" autoComplete="bday" style={css("height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.05); font-size: 17px; font-weight: 300; outline: none; min-width: 0")} />
                    </label>
                    <label style={css("display: flex; flex-direction: column; gap: 6px")}>
                      <span className="kicker" style={css("font-size: 15px; letter-spacing: .12em")}>
                        {"Hora em que nasceu"}
                      </span>
                      <input value={R.dTime} onChange={R.onTime} placeholder="hh:mm" inputMode="numeric" maxLength="5" style={css("height: 48px; padding: 0 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.05); font-size: 17px; font-weight: 300; outline: none; min-width: 0")} />
                    </label>
                  </div>
                  <label style={css("display: flex; flex-direction: column; gap: 6px")}>
                    <span className="kicker" style={css("font-size: 15px")}>
                      {"Cidade de nascimento"}
                    </span>
                    <select value={R.dCity} onChange={R.onCity} style={css("height: 48px; padding: 0 12px; border-radius: 14px; border: 1px solid rgba(255,255,255,.16); background: #1a1733; font-size: 17px; font-weight: 300; outline: none")}>
                      {(R.cityOpts || []).map((L3_c, I3) => (
                        <React.Fragment key={I3}>
                          <option value={L3_c?.name}>
                            {L3_c?.label}
                          </option>
                        </React.Fragment>
                      ))}
                    </select>
                  </label>
                  {R.hasErr ? (
                    <>
                      <p style={css("margin: 0; font-size: 17.5px; color: #ffb0a0")}>
                        {R.perr}
                      </p>
                    </>
                  ) : null}
                </div>
                <div style={css("display: flex; gap: 10px; padding: 12px 14px; border-radius: 16px; background: rgba(255,255,255,.04)")}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f3d98b" strokeWidth="1.5" strokeLinecap="round" style={css("flex-shrink: 0; margin-top: 2px")} aria-hidden="true">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                  <span style={css("font-size: 17px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.7)")}>
                    {"A hora muda o ascendente e as casas. Sem a hora certa, use 12:00: signos e numerologia continuam válidos, e o ascendente fica aproximado."}
                  </span>
                </div>
                <button className="cta" onClick={R.saveProfile} style={css("height: 58px; border-radius: 999px; font-size: 17px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); box-shadow: 0 0 30px rgba(243,217,139,.22)")}>
                  {"Calcular meu céu"}
                </button>
                <p style={css("margin: 0; text-align: center; font-size: 16px; font-weight: 300; color: rgba(244,241,234,.45)")}>
                  {"Seus dados de nascimento ficam só no seu perfil."}
                </p>
              </div>
            </div>
          </>
        ) : null}
        {R.isCalc ? (
          <>
            <div className="screen">
              <div className="spinfast" style={css("position: absolute; left: 75px; top: 230px; width: 240px; height: 240px")}>
                {(R.calcRing || []).map((L4_z, I4) => (
                  <React.Fragment key={I4}>
                    <span className="sym pdot" style={css(`position: absolute; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 20px; ${(L4_z?.style) ?? ''}`)}>
                      {L4_z?.g}
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <div style={css("position: absolute; left: 155px; top: 310px; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fff6dc, #f3d98b 40%, rgba(243,217,139,0) 72%); filter: blur(1px); animation: pulseS 2s ease-in-out infinite")}></div>
              <div style={css("position: absolute; top: 520px; left: 32px; right: 32px; text-align: center; display: flex; flex-direction: column; gap: 10px")}>
                <span className="fade" style={css("font-size: 22px; font-weight: 200")}>
                  {"Lendo o céu do seu nascimento"}
                </span>
                <span className="fade" style={css("font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.65); animation-delay: .5s")}>
                  {R.pf?.line}
                </span>
              </div>
            </div>
          </>
        ) : null}
        {R.isMap ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"Mapa natal"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 26px; line-height: 1.2; font-weight: 300")}>
                    {`O céu de ${(R.pf?.first) ?? ''}`}
                  </h1>
                  <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                    {R.pf?.line}
                  </p>
                </div>
                <div className="glass" style={css("border-radius: 28px; padding: 15px; display: flex; justify-content: center")}>
                  <div className="draw" style={css("position: relative; width: 320px; height: 320px")}>
                    <div style={css("position: absolute; left: 10px; top: 10px; width: 300px; height: 300px; border-radius: 50%; border: 1px solid rgba(243,217,139,.35)")}></div>
                    <div style={css("position: absolute; left: 40px; top: 40px; width: 240px; height: 240px; border-radius: 50%; border: 1px solid rgba(255,255,255,.14)")}></div>
                    <div style={css("position: absolute; left: 100px; top: 100px; width: 120px; height: 120px; border-radius: 50%; border: 1px solid rgba(255,255,255,.1); background: radial-gradient(circle, rgba(243,217,139,.08), transparent 70%)")}></div>
                    {(R.mandala?.lines || []).map((L5_l, I5) => (
                      <React.Fragment key={I5}>
                        <div className="divline" style={css(L5_l?.style)}></div>
                      </React.Fragment>
                    ))}
                    {(R.mandala?.signs || []).map((L6_g, I6) => (
                      <React.Fragment key={I6}>
                        <span className="sym" style={css(`position: absolute; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 17.5px; ${(L6_g?.style) ?? ''}`)}>
                          {L6_g?.g}
                        </span>
                      </React.Fragment>
                    ))}
                    <div style={css("position: absolute; left: 10px; top: 159px; width: 150px; height: 2px; background: linear-gradient(90deg, #f3d98b, rgba(243,217,139,0)); box-shadow: 0 0 10px #f3d98b")}></div>
                    <span style={css("position: absolute; left: 14px; top: 140px; font-size: 14px; letter-spacing: .18em; color: #f3d98b")}>
                      {"ASC"}
                    </span>
                    {(R.mandala?.planets || []).map((L7_p, I7) => (
                      <React.Fragment key={I7}>
                        <span className="pdot sym" style={css(`position: absolute; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17.5px; background: rgba(12,10,28,.85); ${(L7_p?.style) ?? ''}`)}>
                          {L7_p?.g}
                        </span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                  {(R.planetRows || []).map((L8_r, I8) => (
                    <React.Fragment key={I8}>
                      <button className="glass pill" onClick={L8_r?.pick} aria-expanded={L8_r?.expanded} style={css("width: 100%; border-radius: 18px; padding: 12px 14px; text-align: left; display: flex; flex-direction: column; gap: 8px")}>
                        <span style={css("width: 100%; display: flex; align-items: center; gap: 12px")}>
                          <span className="sym" style={css(`width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; border: 1px solid ${(L8_r?.color) ?? ''}; color: ${(L8_r?.color) ?? ''}`)}>
                            {L8_r?.g}
                          </span>
                          <span style={css("flex-grow: 1; display: flex; flex-direction: column; gap: 2px")}>
                            <span style={css("font-size: 17.5px")}>
                              {`${(L8_r?.name) ?? ''} em ${(L8_r?.sign) ?? ''}`}
                            </span>
                            <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                              {`${(L8_r?.deg) ?? ''} · ${(L8_r?.house) ?? ''}`}
                            </span>
                          </span>
                          <span className="sym" style={css(`font-size: 18px; color: ${(L8_r?.signColor) ?? ''}`)}>
                            {L8_r?.sg}
                          </span>
                        </span>
                        {L8_r?.open ? (
                          <>
                            <span className="fade" style={css("font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.82)")}>
                              {L8_r?.text}
                            </span>
                          </>
                        ) : null}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className="glass" style={css("margin-top: 6px; border-radius: 24px; padding: 20px 18px; display: flex; flex-direction: column; gap: 12px; border-color: rgba(185,166,255,.4)")}>
                  <span className="kicker" style={css("color: #c9b8ff")}>
                    {"Agora que você conhece o seu céu"}
                  </span>
                  <span style={css("font-size: 18px; font-weight: 300; line-height: 1.35")}>
                    {"Veja como os planetas de hoje conversam com o seu mapa"}
                  </span>
                  <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.65)")}>
                    {"Leituras para hoje, a semana, o mês, os próximos 6 meses e o próximo ano."}
                  </span>
                  <button className="cta" onClick={R.mapToHoro} style={css("height: 54px; border-radius: 999px; display: flex; align-items: center; justify-content: center; gap: 10px; font-size: 17px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); box-shadow: 0 0 30px rgba(243,217,139,.22)")}>
                    <span className="sym" style={css("font-size: 18px")}>
                      {"☉︎"}
                    </span>
                    {"Ver meu horóscopo"}
                  </button>
                  <button className="pill" onClick={R.mapToNum} style={css("height: 44px; border-radius: 999px; font-size: 17.5px; color: rgba(244,241,234,.8); border: 1px solid rgba(255,255,255,.16)")}>
                    {"Ver minha numerologia"}
                  </button>
                </div>
                <p style={css("margin: 0; font-size: 16px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.45)")}>
                  {"Posições calculadas por efemérides aproximadas (precisão de cerca de 1°), zodíaco tropical e casas por signo inteiro. Fuso sem horário de verão histórico."}
                </p>
              </div>
            </div>
          </>
        ) : null}
        {R.isHoro ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"Horóscopo pelo seu mapa"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 26px; line-height: 1.2; font-weight: 300")}>
                    {R.horo?.title}
                  </h1>
                  <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                    {`Sol em ${(R.horo?.sun) ?? ''} · Lua em ${(R.horo?.moon) ?? ''} · Ascendente em ${(R.horo?.asc) ?? ''}`}
                  </p>
                </div>
                <div className="scroll" style={css("display: flex; gap: 8px; overflow-x: auto; margin: 0 -14px; padding: 0 14px 2px")}>
                  {(R.periods || []).map((L9_p, I9) => (
                    <React.Fragment key={I9}>
                      <button className="pill" onClick={L9_p?.pick} aria-pressed={L9_p?.pressed} style={css(`flex-shrink: 0; height: 44px; padding: 0 18px; border-radius: 999px; font-size: 17.5px; white-space: nowrap; border: 1px solid rgba(255,255,255,.14); ${(L9_p?.style) ?? ''}`)}>
                        {L9_p?.label}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <div className="glass fade" style={css(`border-radius: 26px; padding: 22px 20px; display: flex; flex-direction: column; gap: 12px; border-color: rgba(185,166,255,.35); ${(R.horo?.anim) ?? ''}`)}>
                  <div style={css("display: flex; align-items: center; gap: 12px")}>
                    <span className="sym" style={css(`width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1px solid ${(R.horo?.color) ?? ''}; color: ${(R.horo?.color) ?? ''}; box-shadow: 0 0 20px ${(R.horo?.glow) ?? ''}`)}>
                      {R.horo?.g}
                    </span>
                    <span style={css("display: flex; flex-direction: column; gap: 2px")}>
                      <span className="kicker" style={css("font-size: 15px")}>
                        {R.horo?.range}
                      </span>
                      <span style={css("font-size: 17px")}>
                        {R.horo?.head}
                      </span>
                    </span>
                  </div>
                  <p style={css("margin: 0; font-size: 17px; font-weight: 300; line-height: 1.65")}>
                    {R.horo?.p1}
                  </p>
                  <p style={css("margin: 0; font-size: 17.5px; font-weight: 300; line-height: 1.65; color: rgba(244,241,234,.82)")}>
                    {R.horo?.p2}
                  </p>
                  {R.horo?.hasExtra ? (
                    <>
                      <p style={css("margin: 0; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.72)")}>
                        {R.horo?.extra}
                      </p>
                    </>
                  ) : null}
                </div>
                <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                  {(R.horo?.areas || []).map((L10_a, I10) => (
                    <React.Fragment key={I10}>
                      <div className="glass" style={css("border-radius: 20px; padding: 14px 16px; display: flex; gap: 14px; align-items: flex-start")}>
                        <span style={css(`width: 34px; height: 34px; flex-shrink: 0; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,.06); color: ${(L10_a?.color) ?? ''}; font-size: 17px; font-weight: 500`)}>
                          {L10_a?.ic}
                        </span>
                        <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                          <span className="kicker" style={css(`font-size: 15px; color: ${(L10_a?.color) ?? ''}`)}>
                            {L10_a?.label}
                          </span>
                          <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                            {L10_a?.text}
                          </span>
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                <div style={css("border-radius: 22px; padding: 16px 18px; background: rgba(243,217,139,.07); border: 1px solid rgba(243,217,139,.28)")}>
                  <div className="goldtext" style={css("font-size: 16px; letter-spacing: .24em; text-transform: uppercase")}>
                    {"Convite do período"}
                  </div>
                  <p style={css("margin: 8px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                    {R.horo?.invite}
                  </p>
                </div>
                <button onClick={R.toggleTech} aria-expanded={R.techExpanded} style={css("height: 44px; display: flex; align-items: center; justify-content: space-between; font-size: 17px; letter-spacing: .14em; text-transform: uppercase; color: rgba(244,241,234,.6)")}>
                  <span>
                    {"Base técnica da leitura"}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={css(R.techChev)} aria-hidden="true">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                {R.showTech ? (
                  <>
                    <div className="fade" style={css("border-radius: 18px; padding: 14px 16px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; gap: 8px")}>
                      {(R.horo?.tech || []).map((L11_t, I11) => (
                        <React.Fragment key={I11}>
                          <span style={css("font-size: 17px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.75)")}>
                            {L11_t?.t}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                <div style={css("margin-top: 8px; font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: rgba(244,241,234,.6)")}>Seu mapa em movimento</div>
                <NatalSphere sim={this} profile={this.state.profile} />
              </div>
            </div>
          </>
        ) : null}
        {R.isNum ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"Numerologia pitagórica"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 26px; line-height: 1.2; font-weight: 300")}>
                    {`Os números de ${(R.pf?.first) ?? ''}`}
                  </h1>
                  <p style={css("margin: 8px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.66)")}>
                    {"A numerologia pitagórica transforma seu nome de registro e sua data de nascimento em números de 1 a 9, além dos números mestres 11, 22 e 33. Cada número é um símbolo para refletir sobre quem você é e o momento que vive. Toque em cada um para entender."}
                  </p>
                </div>
                <div className="glass" style={css("border-radius: 28px; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; position: relative; overflow: hidden")}>
                  <div className="spin" style={css("position: absolute; left: 50%; top: 24px; width: 150px; height: 150px; margin-left: -75px; border-radius: 50%; border: 1px dashed rgba(243,217,139,.35)")}></div>
                  <div style={css("position: relative; width: 150px; height: 150px; display: flex; align-items: center; justify-content: center")}>
                    <span className="goldtext" style={css("font-size: 72px; font-weight: 200; line-height: 1")}>
                      {R.px?.n}
                    </span>
                  </div>
                  <span className="kicker">
                    {"Caminho de vida"}
                  </span>
                  <span style={css("font-size: 20px; font-weight: 300")}>
                    {R.px?.title}
                  </span>
                  <p style={css("margin: 0; font-size: 17.5px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.8)")}>
                    {R.px?.short}
                  </p>
                  <button onClick={R.px?.toggle} aria-expanded={R.px?.expanded} style={css("height: 44px; padding: 0 18px; border-radius: 999px; display: flex; align-items: center; gap: 8px; font-size: 17.5px; color: #f3d98b; border: 1px solid rgba(243,217,139,.4)")}>
                    {R.px?.btn}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={css(R.px?.chev)} aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {R.px?.open ? (
                    <>
                      <div className="fade" style={css("display: flex; flex-direction: column; gap: 14px; text-align: left")}>
                        <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                          <span className="kicker" style={css("font-size: 15px")}>
                            {"O que é"}
                          </span>
                          <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.65; color: rgba(244,241,234,.8)")}>
                            {R.px?.what}
                          </span>
                        </div>
                        <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                          <span className="kicker" style={css("font-size: 15px; color: #f3d98b")}>
                            {`Seu número: ${(R.px?.n) ?? ''} · ${(R.px?.title) ?? ''}`}
                          </span>
                          <span style={css("font-size: 17px; font-weight: 300; line-height: 1.6")}>
                            {R.px?.ess}
                          </span>
                        </div>
                        {R.px?.isPerson ? (
                          <>
                            <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                  {"Sua luz"}
                                </div>
                                <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                  {R.px?.luz}
                                </p>
                              </div>
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                  {"Seu desafio"}
                                </div>
                                <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                  {R.px?.sombra}
                                </p>
                              </div>
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(243,217,139,.08); border: 1px solid rgba(243,217,139,.28)")}>
                                <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #f3d98b")}>
                                  {"Convite"}
                                </div>
                                <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 400; line-height: 1.55")}>
                                  {R.px?.convite}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {R.px?.isCycle ? (
                          <>
                            <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                              {R.px?.isPY ? (
                                <>
                                  <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                    <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                                      {`Você está no ano ${(R.px?.n) ?? ''} de um ciclo de 9`}
                                    </span>
                                    <div style={css("display: flex; gap: 6px")}>
                                      {(R.px?.dots || []).map((L12_d, I12) => (
                                        <React.Fragment key={I12}>
                                          <span style={css(`flex-grow: 1; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; ${(L12_d?.style) ?? ''}`)}>
                                            {L12_d?.n}
                                          </span>
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                  {"Favorece"}
                                </div>
                                <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                  {R.px?.fazer}
                                </p>
                              </div>
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                  {"Evite"}
                                </div>
                                <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                  {R.px?.evitar}
                                </p>
                              </div>
                            </div>
                          </>
                        ) : null}
                        <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; gap: 6px")}>
                          <span className="kicker" style={css("font-size: 15px")}>
                            {"Como calculamos"}
                          </span>
                          <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.75)")}>
                            {R.px?.how}
                          </span>
                          <span style={css("font-size: 17px; font-weight: 400; color: #f3d98b")}>
                            {R.px?.calc}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="kicker" style={css("margin-top: 6px")}>
                  {"Seu nome"}
                </div>
                {(R.nameItems || []).map((L13_it, I13) => (
                  <React.Fragment key={I13}>
                    <div className="glass" style={css(`border-radius: 22px; overflow: hidden; ${(L13_it?.cardStyle) ?? ''}`)}>
                      <button onClick={L13_it?.toggle} aria-expanded={L13_it?.expanded} style={css("width: 100%; padding: 14px 16px; display: flex; align-items: center; gap: 14px; text-align: left")}>
                        <span style={css("width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 200; color: #f3d98b; border: 1px solid rgba(243,217,139,.45)")}>
                          {L13_it?.n}
                        </span>
                        <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                          <span style={css("font-size: 17.5px; font-weight: 400")}>
                            {L13_it?.label}
                          </span>
                          <span style={css("font-size: 17px; font-weight: 300; line-height: 1.45; color: rgba(244,241,234,.6)")}>
                            {`${(L13_it?.title) ?? ''} · ${(L13_it?.short) ?? ''}`}
                          </span>
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,.6)" strokeWidth="1.6" strokeLinecap="round" style={css(`flex-shrink: 0; ${(L13_it?.chev) ?? ''}`)} aria-hidden="true">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {L13_it?.open ? (
                        <>
                          <div style={css("padding: 0 16px 18px")}>
                            <div className="fade" style={css("display: flex; flex-direction: column; gap: 14px; text-align: left")}>
                              <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px")}>
                                  {"O que é"}
                                </span>
                                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.65; color: rgba(244,241,234,.8)")}>
                                  {L13_it?.what}
                                </span>
                              </div>
                              <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px; color: #f3d98b")}>
                                  {`Seu número: ${(L13_it?.n) ?? ''} · ${(L13_it?.title) ?? ''}`}
                                </span>
                                <span style={css("font-size: 17px; font-weight: 300; line-height: 1.6")}>
                                  {L13_it?.ess}
                                </span>
                              </div>
                              {L13_it?.isPerson ? (
                                <>
                                  <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                        {"Sua luz"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L13_it?.luz}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                        {"Seu desafio"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L13_it?.sombra}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(243,217,139,.08); border: 1px solid rgba(243,217,139,.28)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #f3d98b")}>
                                        {"Convite"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 400; line-height: 1.55")}>
                                        {L13_it?.convite}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              {L13_it?.isCycle ? (
                                <>
                                  <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                    {L13_it?.isPY ? (
                                      <>
                                        <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                          <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                                            {`Você está no ano ${(L13_it?.n) ?? ''} de um ciclo de 9`}
                                          </span>
                                          <div style={css("display: flex; gap: 6px")}>
                                            {(L13_it?.dots || []).map((L14_d, I14) => (
                                              <React.Fragment key={I14}>
                                                <span style={css(`flex-grow: 1; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; ${(L14_d?.style) ?? ''}`)}>
                                                  {L14_d?.n}
                                                </span>
                                              </React.Fragment>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    ) : null}
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                        {"Favorece"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L13_it?.fazer}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                        {"Evite"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L13_it?.evitar}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px")}>
                                  {"Como calculamos"}
                                </span>
                                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.75)")}>
                                  {L13_it?.how}
                                </span>
                                <span style={css("font-size: 17px; font-weight: 400; color: #f3d98b")}>
                                  {L13_it?.calc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
                <div className="kicker" style={css("margin-top: 6px")}>
                  {"Sua data e seus ciclos"}
                </div>
                {(R.dateItems || []).map((L15_it, I15) => (
                  <React.Fragment key={I15}>
                    <div className="glass" style={css(`border-radius: 22px; overflow: hidden; ${(L15_it?.cardStyle) ?? ''}`)}>
                      <button onClick={L15_it?.toggle} aria-expanded={L15_it?.expanded} style={css("width: 100%; padding: 14px 16px; display: flex; align-items: center; gap: 14px; text-align: left")}>
                        <span style={css("width: 48px; height: 48px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 200; color: #f3d98b; border: 1px solid rgba(243,217,139,.45)")}>
                          {L15_it?.n}
                        </span>
                        <span style={css("flex-grow: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px")}>
                          <span style={css("font-size: 17.5px; font-weight: 400")}>
                            {L15_it?.label}
                          </span>
                          <span style={css("font-size: 17px; font-weight: 300; line-height: 1.45; color: rgba(244,241,234,.6)")}>
                            {`${(L15_it?.title) ?? ''} · ${(L15_it?.short) ?? ''}`}
                          </span>
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,.6)" strokeWidth="1.6" strokeLinecap="round" style={css(`flex-shrink: 0; ${(L15_it?.chev) ?? ''}`)} aria-hidden="true">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                      {L15_it?.open ? (
                        <>
                          <div style={css("padding: 0 16px 18px")}>
                            <div className="fade" style={css("display: flex; flex-direction: column; gap: 14px; text-align: left")}>
                              <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px")}>
                                  {"O que é"}
                                </span>
                                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.65; color: rgba(244,241,234,.8)")}>
                                  {L15_it?.what}
                                </span>
                              </div>
                              <div style={css("display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px; color: #f3d98b")}>
                                  {`Seu número: ${(L15_it?.n) ?? ''} · ${(L15_it?.title) ?? ''}`}
                                </span>
                                <span style={css("font-size: 17px; font-weight: 300; line-height: 1.6")}>
                                  {L15_it?.ess}
                                </span>
                              </div>
                              {L15_it?.isPerson ? (
                                <>
                                  <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                        {"Sua luz"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L15_it?.luz}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                        {"Seu desafio"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L15_it?.sombra}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(243,217,139,.08); border: 1px solid rgba(243,217,139,.28)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #f3d98b")}>
                                        {"Convite"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 400; line-height: 1.55")}>
                                        {L15_it?.convite}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              {L15_it?.isCycle ? (
                                <>
                                  <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                    {L15_it?.isPY ? (
                                      <>
                                        <div style={css("display: flex; flex-direction: column; gap: 8px")}>
                                          <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                                            {`Você está no ano ${(L15_it?.n) ?? ''} de um ciclo de 9`}
                                          </span>
                                          <div style={css("display: flex; gap: 6px")}>
                                            {(L15_it?.dots || []).map((L16_d, I16) => (
                                              <React.Fragment key={I16}>
                                                <span style={css(`flex-grow: 1; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; ${(L16_d?.style) ?? ''}`)}>
                                                  {L16_d?.n}
                                                </span>
                                              </React.Fragment>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    ) : null}
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(143,227,176,.08); border: 1px solid rgba(143,227,176,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8fe3b0")}>
                                        {"Favorece"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L15_it?.fazer}
                                      </p>
                                    </div>
                                    <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,179,138,.08); border: 1px solid rgba(255,179,138,.25)")}>
                                      <div style={css("font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #ffb38a")}>
                                        {"Evite"}
                                      </div>
                                      <p style={css("margin: 6px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                                        {L15_it?.evitar}
                                      </p>
                                    </div>
                                  </div>
                                </>
                              ) : null}
                              <div style={css("border-radius: 16px; padding: 12px 14px; background: rgba(255,255,255,.04); display: flex; flex-direction: column; gap: 6px")}>
                                <span className="kicker" style={css("font-size: 15px")}>
                                  {"Como calculamos"}
                                </span>
                                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55; color: rgba(244,241,234,.75)")}>
                                  {L15_it?.how}
                                </span>
                                <span style={css("font-size: 17px; font-weight: 400; color: #f3d98b")}>
                                  {L15_it?.calc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
                <p style={css("margin: 4px 0 0; font-size: 16px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.45)")}>
                  {"Os números são símbolos para autoconhecimento. Use o que fizer sentido e deixe o resto."}
                </p>
              </div>
            </div>
          </>
        ) : null}
        {R.isTSpread ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 40px; display: flex; flex-direction: column; gap: 16px")}>
                <div>
                  <div className="kicker">
                    {"Tarô guiado"}
                  </div>
                  <h1 style={css("margin: 8px 0 0; font-size: 28px; line-height: 1.2; font-weight: 300")}>
                    {"Como você quer jogar?"}
                  </h1>
                  <p style={css("margin: 8px 0 0; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.66)")}>
                    {"Arcanos maiores, os 22 grandes símbolos do tarô. A Alma guia cada gesto e lê as cartas com você."}
                  </p>
                </div>
                <button className="glass pill" onClick={R.pick1} style={css("width: 100%; border-radius: 24px; padding: 20px; text-align: left; display: flex; align-items: center; gap: 18px")}>
                  <span className="cardback" style={css("width: 50px; height: 80px; flex-shrink: 0; border-radius: 8px")}></span>
                  <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("font-size: 18px; font-weight: 300")}>
                      {"Uma carta"}
                    </span>
                    <span style={css("font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                      {"Conselho do dia. Rápido e direto."}
                    </span>
                  </span>
                </button>
                <button className="glass pill" onClick={R.pick3} style={css("width: 100%; border-radius: 24px; padding: 20px; text-align: left; display: flex; align-items: center; gap: 18px; border-color: rgba(243,217,139,.4)")}>
                  <span style={css("display: flex; gap: 4px; flex-shrink: 0")}>
                    <span className="cardback" style={css("width: 30px; height: 50px; border-radius: 6px")}></span>
                    <span className="cardback" style={css("width: 30px; height: 50px; border-radius: 6px")}></span>
                    <span className="cardback" style={css("width: 30px; height: 50px; border-radius: 6px")}></span>
                  </span>
                  <span style={css("display: flex; flex-direction: column; gap: 4px")}>
                    <span style={css("font-size: 18px; font-weight: 300")}>
                      {"Três cartas"}
                    </span>
                    <span style={css("font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                      {"Raiz, presente e caminho."}
                    </span>
                  </span>
                </button>
                <div style={css("border-radius: 20px; padding: 14px 16px; background: rgba(255,255,255,.04); font-size: 17px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.6)")}>
                  {"Em breve: Cruz Celta com 10 cartas e os 56 arcanos menores."}
                </div>
              </div>
            </div>
          </>
        ) : null}
        {R.isTQuestion ? (
          <>
            <div className="screen">
              <div style={css("position: absolute; left: 0; right: 0; top: 110px; display: flex; justify-content: center")}>
                <div style={css("position: relative; width: 120px; height: 190px")}>
                  <div className="glow" style={css("left: -40px; top: -30px; width: 200px; height: 200px")}></div>
                  <div className="flame" style={css("top: 34px")}></div>
                  <div style={css("position: absolute; left: 50%; top: 66px; width: 2px; height: 10px; margin-left: -1px; background: #3a2e20")}></div>
                  <div style={css("position: absolute; left: 34px; top: 74px; width: 52px; height: 100px; border-radius: 6px 6px 10px 10px; background: linear-gradient(90deg, #efe4cf, #fff8ea 45%, #d9ccb2)")}></div>
                </div>
              </div>
              <div style={css("position: absolute; left: 20px; right: 20px; top: 320px; display: flex; flex-direction: column; gap: 16px")}>
                <div className="glass" style={css("border-radius: 20px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start")}>
                  <span style={css("width: 10px; height: 10px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f3d98b; box-shadow: 0 0 12px #f3d98b")}></span>
                  <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                    {"A vela está acesa. Respire fundo e pense no que você quer compreender. Pode escrever, ou apenas sentir."}
                  </span>
                </div>
                <label style={css("display: flex; flex-direction: column; gap: 6px")}>
                  <span className="kicker" style={css("font-size: 15px")}>
                    {"Sua pergunta (opcional)"}
                  </span>
                  <input value={R.tq} onChange={R.onTq} placeholder="O que preciso compreender agora?" style={css("height: 52px; padding: 0 16px; border-radius: 16px; border: 1px solid rgba(255,255,255,.16); background: rgba(255,255,255,.05); font-size: 17px; font-weight: 300; outline: none")} />
                </label>
                <div style={css("display: flex; flex-wrap: wrap; gap: 8px")}>
                  {(R.tqChips || []).map((L17_c, I17) => (
                    <React.Fragment key={I17}>
                      <button className="pill" onClick={L17_c?.pick} style={css("height: 40px; padding: 0 14px; border-radius: 999px; font-size: 17.5px; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.12)")}>
                        {L17_c?.t}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <button className="cta" onClick={R.toShuffle} style={css("margin-top: 8px; height: 58px; border-radius: 999px; font-size: 17px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a)")}>
                  {"Estou pronto"}
                </button>
              </div>
            </div>
          </>
        ) : null}
        {R.isTShuffle ? (
          <>
            <div className="screen">
              <div className="glass" style={css("position: absolute; left: 20px; right: 20px; top: 100px; border-radius: 20px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start")}>
                <span style={css("width: 10px; height: 10px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f3d98b; box-shadow: 0 0 12px #f3d98b")}></span>
                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                  {R.shufGuide}
                </span>
              </div>
              <div style={css("position: absolute; left: 135px; top: 260px; width: 120px; height: 190px")}>
                {(R.shufCards || []).map((L18_c, I18) => (
                  <React.Fragment key={I18}>
                    <span className="cardback shuf" style={css(`left: 0; top: 0; width: 120px; height: 190px; border-radius: 12px; ${(L18_c?.style) ?? ''}`)}></span>
                  </React.Fragment>
                ))}
              </div>
              <div style={css("position: absolute; left: 0; right: 0; top: 560px; display: flex; flex-direction: column; align-items: center; gap: 14px")}>
                <button onPointerDown={R.holdStart} onPointerUp={R.holdEnd} onPointerLeave={R.holdEnd} onClick={R.shufClick} aria-label="Embaralhar" style={css(`position: relative; width: 116px; height: 116px; border-radius: 50%; touch-action: none; user-select: none; -webkit-user-select: none; ${(R.shufRing) ?? ''}`)}>
                  <span style={css("position: absolute; inset: 6px; border-radius: 50%; background: #16122e; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px")}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f3d98b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7h3.5c4 0 5 10 9 10H20M17 14l3 3-3 3M4 17h3.5c1.4 0 2.4-1.2 3.3-2.8M13.2 9.8C14.1 8.2 15.1 7 16.5 7H20M17 4l3 3-3 3" />
                    </svg>
                    <span style={css("font-size: 17px; color: rgba(244,241,234,.85)")}>
                      {R.shufPct}
                    </span>
                  </span>
                </button>
                <span style={css("font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.6)")}>
                  {"Segure para embaralhar"}
                </span>
              </div>
            </div>
          </>
        ) : null}
        {R.isTCut ? (
          <>
            <div className="screen">
              <div className="glass" style={css("position: absolute; left: 20px; right: 20px; top: 100px; border-radius: 20px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start")}>
                <span style={css("width: 10px; height: 10px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f3d98b; box-shadow: 0 0 12px #f3d98b")}></span>
                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                  {"Agora corte o baralho. Três montes estão à sua frente: toque no que chamar você."}
                </span>
              </div>
              <div style={css("position: absolute; left: 20px; right: 20px; top: 320px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px")}>
                {(R.piles || []).map((L19_p, I19) => (
                  <React.Fragment key={I19}>
                    <button onClick={L19_p?.pick} aria-label={L19_p?.aria} style={css(`position: relative; height: 200px; transition: opacity .8s ease, transform .8s cubic-bezier(.2,.8,.2,1); ${(L19_p?.style) ?? ''}`)}>
                      <span className="cardback" style={css("position: absolute; left: 6px; top: 12px; right: 6px; bottom: 12px; border-radius: 10px; transform: rotate(-4deg)")}></span>
                      <span className="cardback" style={css("position: absolute; left: 6px; top: 6px; right: 6px; bottom: 18px; border-radius: 10px; transform: rotate(3deg)")}></span>
                      <span className="cardback" style={css(`position: absolute; left: 6px; top: 0; right: 6px; bottom: 24px; border-radius: 10px; ${(L19_p?.topStyle) ?? ''}`)}></span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        ) : null}
        {R.isTFan ? (
          <>
            <div className="screen">
              <div className="glass" style={css("position: absolute; left: 20px; right: 20px; top: 100px; border-radius: 20px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start")}>
                <span style={css("width: 10px; height: 10px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f3d98b; box-shadow: 0 0 12px #f3d98b")}></span>
                <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                  {R.fanGuide}
                </span>
              </div>
              <div style={css("position: absolute; left: 0; right: 0; top: 250px; text-align: center; font-size: 17.5px; letter-spacing: .16em; text-transform: uppercase; color: #f3d98b")}>
                {R.fanCount}
              </div>
              <div style={css("position: absolute; left: 0; top: 320px; width: 390px; height: 400px")}>
                {(R.fan || []).map((L20_c, I20) => (
                  <React.Fragment key={I20}>
                    <button className="fancard cardback" onClick={L20_c?.pick} aria-label={L20_c?.aria} aria-pressed={L20_c?.pressed} style={css(`left: 168px; top: 20px; width: 54px; height: 88px; border-radius: 8px; ${(L20_c?.style) ?? ''}`)}></button>
                  </React.Fragment>
                ))}
              </div>
              {R.fanReady ? (
                <>
                  <div className="fade" style={css("position: absolute; left: 20px; right: 20px; top: 740px")}>
                    <button className="cta" onClick={R.toReveal} style={css("width: 100%; height: 58px; border-radius: 999px; font-size: 17px; font-weight: 500; color: #1a1408; background: linear-gradient(120deg, #f3d98b, #fff1c9 45%, #ffc79a); box-shadow: 0 0 30px rgba(243,217,139,.3)")}>
                      {"Colocar na mesa"}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </>
        ) : null}
        {R.isTReveal ? (
          <>
            <div className="screen scroll">
              <div style={css("box-sizing: border-box; padding: 100px 14px 48px; display: flex; flex-direction: column; gap: 16px")}>
                <div className="glass" style={css("border-radius: 20px; padding: 14px 16px; display: flex; gap: 12px; align-items: flex-start")}>
                  <span style={css("width: 10px; height: 10px; margin-top: 6px; flex-shrink: 0; border-radius: 50%; background: #f3d98b; box-shadow: 0 0 12px #f3d98b")}></span>
                  <span style={css("font-size: 17.5px; font-weight: 300; line-height: 1.55")}>
                    {R.revealGuide}
                  </span>
                </div>
                {R.hasTq ? (
                  <>
                    <p style={css("margin: 0; text-align: center; font-size: 17.5px; font-weight: 300; color: rgba(244,241,234,.7)")}>
                      {`“${(R.tq) ?? ''}”`}
                    </p>
                  </>
                ) : null}
                <div style={css("display: flex; justify-content: center; gap: 12px")}>
                  {(R.slots || []).map((L21_s, I21) => (
                    <React.Fragment key={I21}>
                      <div style={css("display: flex; flex-direction: column; align-items: center; gap: 8px")}>
                        <button className="flip" onClick={L21_s?.flipIt} aria-label={L21_s?.aria} style={css(L21_s?.box)}>
                          <span className="flipin" style={css(`display: block; ${(L21_s?.inner) ?? ''}`)}>
                            <span className="face cardback" style={css(`display: block; ${(L21_s?.backStyle) ?? ''}`)}></span>
                            <span className="face front" style={css(`display: flex; flex-direction: column; align-items: center; justify-content: space-between; box-sizing: border-box; border: 1px solid rgba(243,217,139,.6); background: linear-gradient(170deg, #fbf5e6, #efe3c8); color: #2a1f3d; ${(L21_s?.frontPad) ?? ''}`)}>
                              <span style={css(`font-size: ${(L21_s?.numSize) ?? ''}; letter-spacing: .1em; font-weight: 500; color: #8a6a2a`)}>
                                {L21_s?.num}
                              </span>
                              <svg viewBox="0 0 60 60" style={css(L21_s?.sigilSize)} aria-hidden="true">
                                <circle cx="30" cy="30" r="27" fill="none" stroke={L21_s?.hue} strokeWidth="1" />
                                <circle cx="30" cy="30" r="20" fill={L21_s?.hueSoft} />
                                <polygon points={L21_s?.poly} fill="none" stroke="#3a2c58" strokeWidth="1.2" strokeLinejoin="round" />
                                <polygon points={L21_s?.star} fill={L21_s?.hue} opacity=".85" />
                                <circle cx="30" cy="30" r="2.4" fill="#3a2c58" />
                              </svg>
                              <span style={css(`font-size: ${(L21_s?.nameSize) ?? ''}; font-weight: 500; text-align: center; line-height: 1.2`)}>
                                {L21_s?.name}
                              </span>
                            </span>
                          </span>
                        </button>
                        <span className="kicker" style={css("font-size: 15px")}>
                          {L21_s?.pos}
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                {(R.readings || []).map((L22_r, I22) => (
                  <React.Fragment key={I22}>
                    <div className="glass fade" style={css("border-radius: 22px; padding: 16px 18px; display: flex; flex-direction: column; gap: 8px")}>
                      <span className="kicker" style={css("font-size: 15px; color: #f3d98b")}>
                        {`${(L22_r?.pos) ?? ''} · ${(L22_r?.name) ?? ''}`}
                      </span>
                      <span style={css("font-size: 17px; font-weight: 300; color: rgba(244,241,234,.55)")}>
                        {L22_r?.kw}
                      </span>
                      <span style={css("font-size: 17px; font-weight: 300; line-height: 1.55")}>
                        {(L22_r?.words || []).map((L23_w, I23) => (
                          <React.Fragment key={I23}>
                            <span className="word" style={css(L23_w?.style)}>
                              {L23_w?.w}
                            </span>
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
                {R.allFlipped ? (
                  <>
                    <div className="glass fade" style={css("border-radius: 26px; padding: 22px 20px; display: flex; flex-direction: column; gap: 10px; border-color: rgba(243,217,139,.4); animation-delay: 1.2s")}>
                      <div className="goldtext" style={css("font-size: 16px; letter-spacing: .26em; text-transform: uppercase")}>
                        {"A leitura da Alma"}
                      </div>
                      <p style={css("margin: 0; font-size: 17px; font-weight: 300; line-height: 1.6")}>
                        {R.synth?.p1}
                      </p>
                      <p style={css("margin: 0; font-size: 17.5px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.75)")}>
                        {R.synth?.p2}
                      </p>
                      <div style={css("margin-top: 4px; padding: 12px 14px; border-radius: 16px; background: rgba(243,217,139,.08); border: 1px solid rgba(243,217,139,.22)")}>
                        <div style={css("font-size: 15px; letter-spacing: .2em; text-transform: uppercase; color: #f3d98b")}>
                          {"Convite"}
                        </div>
                        <p style={css("margin: 6px 0 0; font-size: 17.5px; line-height: 1.5")}>
                          {R.synth?.adv}
                        </p>
                      </div>
                    </div>
                    <a href="Main.dc.html" onClick={R.handoff} className="glass pill fade" style={css("border-radius: 22px; padding: 16px 18px; display: flex; align-items: center; gap: 14px; border-color: rgba(185,166,255,.45); animation-delay: 1.6s")}>
                      <span style={css("width: 44px; height: 44px; flex-shrink: 0; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 35% 30%, #fff, #c9b8ff 45%, rgba(201,184,255,.2) 75%); box-shadow: 0 0 20px rgba(201,184,255,.5)")}></span>
                      <span style={css("flex-grow: 1; display: flex; flex-direction: column; gap: 4px")}>
                        <span style={css("font-size: 17.5px; font-weight: 400")}>
                          {"Perguntar ao Conselho da Alma"}
                        </span>
                        <span style={css("font-size: 17px; font-weight: 300; line-height: 1.45; color: rgba(244,241,234,.62)")}>
                          {"Sua pergunta e suas cartas vão para as 14 sabedorias, que refletem com você e ajudam a criar um plano."}
                        </span>
                      </span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(244,241,234,.7)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                    <button className="glass pill fade" onClick={R.newReading} style={css("height: 50px; border-radius: 18px; font-size: 17.5px; animation-delay: 1.7s")}>
                      {"Fazer nova tiragem"}
                    </button>
                    <p className="fade" style={css("margin: 0; text-align: center; font-size: 16px; font-weight: 300; line-height: 1.6; color: rgba(244,241,234,.45); animation-delay: 1.8s")}>
                      {"O tarô é um espelho, não uma sentença. Fique com o que ressoar."}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Component;
