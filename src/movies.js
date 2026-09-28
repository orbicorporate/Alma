// Dicas de filme escolhidas pelo sentimento e pelo assunto da pergunta.
// k: sentimentos; t: assuntos (mesmas chaves de questions.js); why: por que combina.
export const MOVIES = [
  { title: 'A Vida Secreta de Walter Mitty', year: 2013, by: 'Ben Stiller', k: ['Dúvida', 'Medo'], t: ['viagem', 'trabalho', 'mudanca'], why: 'Um homem que só sonhava acordado decide, enfim, viver a aventura de verdade.' },
  { title: 'Na Natureza Selvagem', year: 2007, by: 'Sean Penn', k: ['Dúvida', 'Pensamento'], t: ['viagem', 'mudanca', 'familia'], why: 'A busca radical por liberdade e o que ela ensina sobre partilhar a vida.' },
  { title: 'Comer, Rezar, Amar', year: 2010, by: 'Ryan Murphy', k: ['Dúvida', 'Aflição'], t: ['viagem', 'amor', 'fe', 'mudanca'], why: 'Uma viagem de um ano para se reencontrar depois de um fim.' },
  { title: 'Sociedade dos Poetas Mortos', year: 1989, by: 'Peter Weir', k: ['Dúvida', 'Pensamento'], t: ['estudo', 'trabalho', 'familia'], why: 'Carpe diem: sobre seguir a própria voz mesmo quando esperam outra coisa de você.' },
  { title: 'Soul', year: 2020, by: 'Pete Docter', k: ['Pensamento', 'Dúvida', 'Alegria'], t: ['musica', 'trabalho', 'hobby'], why: 'Um músico descobre que o sentido da vida também mora nos momentos simples.' },
  { title: 'Whiplash', year: 2014, by: 'Damien Chazelle', k: ['Dúvida', 'Medo'], t: ['musica', 'estudo', 'hobby'], why: 'Até onde vale ir por um sonho, e o preço da busca pela perfeição.' },
  { title: 'Um Senhor Estagiário', year: 2015, by: 'Nancy Meyers', k: ['Alegria', 'Dúvida'], t: ['trabalho', 'amizade'], why: 'Recomeçar em qualquer idade e aprender com gerações diferentes.' },
  { title: 'À Procura da Felicidade', year: 2006, by: 'Gabriele Muccino', k: ['Medo', 'Aflição'], t: ['trabalho', 'dinheiro', 'familia'], why: 'Persistência em meio à falta de tudo, pelo amor a um filho.' },
  { title: 'Sob o Sol da Toscana', year: 2003, by: 'Audrey Wells', k: ['Dúvida', 'Aflição'], t: ['mudanca', 'casa', 'viagem'], why: 'Comprar uma casa velha num lugar novo e reconstruir a vida junto com ela.' },
  { title: 'Antes do Amanhecer', year: 1995, by: 'Richard Linklater', k: ['Alegria', 'Pensamento'], t: ['amor', 'viagem'], why: 'Uma noite de conversa que mostra como os encontros mudam a gente.' },
  { title: 'Divertida Mente', year: 2015, by: 'Pete Docter', k: ['Aflição', 'Pensamento', 'Alegria'], t: ['familia', 'mudanca'], why: 'Por que a tristeza também tem lugar, e como ela nos aproxima de quem amamos.' },
  { title: 'Questão de Tempo', year: 2013, by: 'Richard Curtis', k: ['Alegria', 'Pensamento'], t: ['amor', 'familia'], why: 'Um lembrete delicado de que o dia comum, vivido com atenção, já é extraordinário.' },
  { title: 'O Fabuloso Destino de Amélie Poulain', year: 2001, by: 'Jean-Pierre Jeunet', k: ['Alegria'], t: ['amor', 'amizade'], why: 'A alegria dos pequenos gestos e a coragem de viver a própria vida.' },
  { title: 'Pequena Miss Sunshine', year: 2006, by: 'Jonathan Dayton e Valerie Faris', k: ['Alegria', 'Aflição'], t: ['familia', 'viagem'], why: 'Uma família imperfeita que descobre que estar junto importa mais que vencer.' },
  { title: 'Intocáveis', year: 2011, by: 'Olivier Nakache e Éric Toledano', k: ['Alegria', 'Aflição'], t: ['amizade', 'saude'], why: 'Uma amizade improvável que devolve leveza e riso a duas vidas.' },
  { title: 'Dias Perfeitos', year: 2023, by: 'Wim Wenders', k: ['Pensamento', 'Alegria'], t: ['trabalho', 'fe', 'hobby'], why: 'A beleza de uma rotina simples, vivida com gratidão e presença.' },
  { title: 'A Chegada', year: 2016, by: 'Denis Villeneuve', k: ['Pensamento', 'Aflição'], t: ['familia', 'fe'], why: 'Sobre aceitar a vida inteira, com suas dores, por causa do amor que ela contém.' },
  { title: 'Gênio Indomável', year: 1997, by: 'Gus Van Sant', k: ['Medo', 'Dúvida'], t: ['estudo', 'amizade', 'saude'], why: 'Deixar alguém entrar e parar de fugir do próprio potencial.' },
  { title: 'O Discurso do Rei', year: 2010, by: 'Tom Hooper', k: ['Medo'], t: ['trabalho', 'amizade'], why: 'Enfrentar o medo com ajuda, um passo e uma palavra de cada vez.' },
  { title: 'Central do Brasil', year: 1998, by: 'Walter Salles', k: ['Aflição', 'Pensamento'], t: ['familia', 'viagem'], why: 'Uma viagem pelo sertão que transforma duas pessoas que não se conheciam.' },
  { title: 'Que Horas Ela Volta?', year: 2015, by: 'Anna Muylaert', k: ['Pensamento', 'Dúvida'], t: ['familia', 'trabalho', 'estudo'], why: 'Sobre lugares, limites e a coragem de uma nova geração.' },
  { title: 'A Vida É Bela', year: 1997, by: 'Roberto Benigni', k: ['Aflição', 'Medo'], t: ['familia'], why: 'Como o amor e a imaginação protegem a esperança nos piores dias.' },
  { title: 'Sempre ao Seu Lado', year: 2009, by: 'Lasse Hallström', k: ['Aflição', 'Alegria'], t: ['pet'], why: 'A lealdade de um cão e o amor que continua além da ausência.' },
  { title: 'Marley & Eu', year: 2008, by: 'David Frankel', k: ['Alegria', 'Aflição'], t: ['pet', 'familia', 'casa'], why: 'Como um cachorro bagunceiro ensina uma família a amar a vida real.' },
  { title: 'Viva: A Vida É uma Festa', year: 2017, by: 'Lee Unkrich', k: ['Aflição', 'Alegria'], t: ['familia', 'musica'], why: 'Memória, raízes e música: quem amamos continua vivo quando lembramos.' },
  { title: 'Up: Altas Aventuras', year: 2009, by: 'Pete Docter', k: ['Aflição', 'Dúvida'], t: ['viagem', 'casa', 'amor'], why: 'Luto e recomeço: a aventura pode estar nas pessoas que chegam depois.' },
  { title: 'Minari', year: 2020, by: 'Lee Isaac Chung', k: ['Dúvida', 'Medo'], t: ['mudanca', 'familia', 'casa'], why: 'Uma família que recomeça em terra nova e aprende a criar raízes.' },
  { title: 'O Lado Bom da Vida', year: 2012, by: 'David O. Russell', k: ['Aflição', 'Medo'], t: ['saude', 'amor', 'familia'], why: 'Encontrar um jeito de seguir depois de tudo desandar.' },
  { title: 'Livre', year: 2014, by: 'Jean-Marc Vallée', k: ['Aflição', 'Dúvida'], t: ['viagem', 'saude', 'familia'], why: 'Uma trilha de mil quilômetros para atravessar o luto e se perdoar.' },
  { title: 'Patch Adams: O Amor É Contagioso', year: 1998, by: 'Tom Shadyac', k: ['Alegria', 'Pensamento'], t: ['saude', 'estudo', 'trabalho'], why: 'O riso e o cuidado como forma de curar.' },
  { title: 'Forrest Gump', year: 1994, by: 'Robert Zemeckis', k: ['Pensamento', 'Alegria'], t: ['amor', 'amizade', 'familia'], why: 'A vida como uma caixa de chocolates, vivida com bondade e simplicidade.' },
  { title: 'O Diabo Veste Prada', year: 2006, by: 'David Frankel', k: ['Dúvida'], t: ['trabalho', 'amizade'], why: 'Até onde ir pela carreira sem se perder de quem você é.' }
];

// Ordena os filmes pelo que combina mais com a pergunta.
export function rankMovies(kind, topic, seed = 0) {
  return MOVIES.map((m, i) => ({ m, s: (topic && m.t.includes(topic) ? 3 : 0) + (m.k.includes(kind) ? 2 : 0) + ((i * 7 + seed) % 11) / 20 }))
    .sort((a, b) => b.s - a.s).map((x) => x.m);
}

// cores da capinha a partir do título
export function coverColors(title) {
  let h = 0; for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) >>> 0;
  const a = h % 360, b = (a + 40 + (h >> 8) % 80) % 360;
  return [`hsl(${a} 55% 40%)`, `hsl(${b} 60% 16%)`, `hsl(${(a + 180) % 360} 75% 72% / .45)`];
}
