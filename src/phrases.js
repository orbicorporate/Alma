// Frases de abertura: citações curtas de culturas e tradições diferentes, sempre assinadas.
// A primeira abertura mostra o manifesto da Alma; depois, cada abertura traz uma citação nova,
// sem repetir até passar por todas e sem duas tradições iguais em sequência.

export const PH = [
  { lines: ['Muitos caminhos,', 'uma mesma montanha.'], by: 'Alma', from: 'Manifesto' },
  { lines: ['A verdade é uma;', 'os sábios a chamam', 'por muitos nomes.'], by: 'Rig Veda', from: 'Hinduísmo · Índia antiga' },
  { lines: ['Ninguém entra duas vezes', 'no mesmo rio.'], by: 'Heráclito', from: 'Filosofia grega · Éfeso' },
  { lines: ['Uma jornada de mil léguas', 'começa com um passo.'], by: 'Lao-Tsé', from: 'Taoísmo · China' },
  { lines: ['Quem conhece a si mesmo', 'é iluminado.'], by: 'Lao-Tsé', from: 'Taoísmo · China' },
  { lines: ['O ódio não cessa com ódio.', 'Só o amor o faz cessar.'], by: 'Buda', from: 'Budismo · Dhammapada' },
  { lines: ['A ferida é o lugar', 'por onde a luz entra.'], by: 'Rumi', from: 'Sufismo · Pérsia' },
  { lines: ['Aja, mas não se prenda', 'aos frutos da ação.'], by: 'Bhagavad Gita', from: 'Hinduísmo · Índia' },
  { lines: ['Para tudo há um tempo', 'debaixo do céu.'], by: 'Eclesiastes', from: 'Tradição judaico-cristã' },
  { lines: ['O amor é paciente,', 'o amor é bondoso.'], by: 'Paulo de Tarso', from: 'Cristianismo · Coríntios' },
  { lines: ['Se não agora,', 'quando?'], by: 'Hillel', from: 'Judaísmo · Pirkei Avot' },
  { lines: ['Quem salva uma vida', 'salva o mundo inteiro.'], by: 'Talmude', from: 'Judaísmo' },
  { lines: ['Com a dificuldade', 'vem a facilidade.'], by: 'Alcorão', from: 'Islamismo · Surata 94' },
  { lines: ['Sou porque nós somos.'], by: 'Ubuntu', from: 'Filosofia africana · povos Nguni' },
  { lines: ['Sofremos mais na imaginação', 'do que na realidade.'], by: 'Sêneca', from: 'Estoicismo · Roma' },
  { lines: ['Não são as coisas que nos perturbam,', 'mas o que pensamos delas.'], by: 'Epicteto', from: 'Estoicismo · Grécia' },
  { lines: ['A alma se tinge', 'da cor dos seus pensamentos.'], by: 'Marco Aurélio', from: 'Estoicismo · Roma' },
  { lines: ['Uma vida sem exame', 'não vale a pena ser vivida.'], by: 'Sócrates', from: 'Filosofia grega · Atenas' },
  { lines: ['A vida se entende olhando para trás,', 'mas se vive olhando para frente.'], by: 'Kierkegaard', from: 'Existencialismo · Dinamarca' },
  { lines: ['Quem tem um porquê', 'suporta quase qualquer como.'], by: 'Nietzsche', from: 'Filosofia · Alemanha' },
  { lines: ['Em todos há uma luz,', 'e essa luz é Uma.'], by: 'Guru Nanak', from: 'Sikhismo · Punjab' },
  { lines: ['Fora da caridade', 'não há salvação.'], by: 'Allan Kardec', from: 'Espiritismo · França' },
  { lines: ['Caia sete vezes,', 'levante-se oito.'], by: 'Provérbio japonês', from: 'Japão' },
  { lines: ['Velho tanque.', 'Uma rã salta.', 'O som da água.'], by: 'Bashō', from: 'Haicai zen · Japão' },
  { lines: ['Todos somos parentes.'], by: 'Mitákuye Oyás’iŋ', from: 'Povo Lakota · América do Norte' },
  { lines: ['Caminho para o futuro', 'olhando para o passado.'], by: 'Provérbio maori', from: 'Aotearoa · Nova Zelândia' },
  { lines: ['Quanto mais fundo a tristeza cava,', 'mais alegria você pode conter.'], by: 'Khalil Gibran', from: 'Líbano · O Profeta' },
  { lines: ['A fé é o pássaro que canta', 'quando a madrugada', 'ainda está escura.'], by: 'Rabindranath Tagore', from: 'Índia · Bengala' },
  { lines: ['Inquieto está o coração', 'até repousar em Ti.'], by: 'Santo Agostinho', from: 'Cristianismo · Norte da África' },
  { lines: ['Nada te perturbe.', 'Tudo passa.'], by: 'Teresa de Ávila', from: 'Mística cristã · Espanha' },
  { lines: ['Fui eu que sonhei ser borboleta,', 'ou a borboleta sonha ser eu?'], by: 'Zhuangzi', from: 'Taoísmo · China' },
  { lines: ['Se há solução, por que se preocupar?', 'Se não há, de que adianta?'], by: 'Shantideva', from: 'Budismo · Índia' },
  { lines: ['O coração tem razões', 'que a razão desconhece.'], by: 'Blaise Pascal', from: 'Filosofia · França' },
  { lines: ['O que a vida quer', 'da gente é coragem.'], by: 'Guimarães Rosa', from: 'Sertão · Brasil' },
  { lines: ['Meu coração tornou-se capaz', 'de todas as formas.'], by: 'Ibn Arabi', from: 'Sufismo · Al-Andalus' },
  { lines: ['Nada é mais suave que a água,', 'e nada vence melhor a pedra.'], by: 'Lao-Tsé', from: 'Taoísmo · China' },
  { lines: ['Aquietai-vos', 'e sabei.'], by: 'Salmo 46', from: 'Tradição judaico-cristã' },
  { lines: ['Aprender sem pensar é inútil.', 'Pensar sem aprender é perigoso.'], by: 'Confúcio', from: 'Confucionismo · China' },
  { lines: ['Tu és Aquilo.'], by: 'Upanishads', from: 'Hinduísmo · Índia antiga' },
  { lines: ['Se quer ir rápido, vá sozinho.', 'Se quer ir longe, vá junto.'], by: 'Provérbio africano', from: 'África' },
  { lines: ['Deus não muda um povo', 'até que ele mude', 'o que há em si.'], by: 'Alcorão', from: 'Islamismo · Surata 13' }
];

const fam = (p) => p.from.split(' · ')[0];

// Embaralha as citações sem repetir a mesma tradição em sequência.
function shuffled(last) {
  const idx = PH.map((_, i) => i).slice(1);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const out = [];
  let prev = last;
  while (idx.length) {
    let k = idx.findIndex((i) => prev == null || fam(PH[i]) !== fam(PH[prev]));
    if (k < 0) k = 0;
    prev = idx.splice(k, 1)[0];
    out.push(prev);
  }
  return out;
}

// Próxima citação: a cada abertura (ou toque em "Outra frase") vem uma nova.
export function nextPhraseIndex() {
  try {
    const seen = localStorage.getItem('alma:phSeen') === '1';
    if (!seen) { localStorage.setItem('alma:phSeen', '1'); localStorage.setItem('alma:phLast', '0'); return 0; }
    const last = +(localStorage.getItem('alma:phLast') || 0);
    let q = JSON.parse(localStorage.getItem('alma:phQ') || '[]').filter((i) => i > 0 && i < PH.length);
    if (!q.length) q = shuffled(last);
    const i = q.shift();
    localStorage.setItem('alma:phQ', JSON.stringify(q));
    localStorage.setItem('alma:phLast', String(i));
    return i;
  } catch (e) {
    return 1 + Math.floor(Math.random() * (PH.length - 1));
  }
}

// Frase do Início: muda a cada hora, sempre de outra tradição.
export function phraseOfDay(date = new Date()) {
  const k = Math.floor(date.getTime() / 36e5);
  const order = PH.map((_, i) => i).slice(1).sort((a, b) => ((a * 7919) % 97) - ((b * 7919) % 97));
  return PH[order[k % order.length]];
}
