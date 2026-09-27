// As 14 vozes do Conselho, com textos escolhidos pelo sentimento da pergunta
// (dúvida, alegria, medo, aflição, pensamento) e reflexões que citam o assunto trazido.
// o = o assunto (ex.: "a viagem para os EUA"); sem assunto reconhecido, "isso que você trouxe".

const C = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// contrações do português: "de o" vira "do", "em a" vira "na", "por o" vira "pelo"...
const contract = (t) => t
  .replace(/\b([Dd])e (o|a|os|as) /g, (m, d, a) => `${d}${a === 'o' ? 'o' : a === 'a' ? 'a' : a === 'os' ? 'os' : 'as'} `)
  .replace(/\b([Ee])m (o|a|os|as) /g, (m, e, a) => `${e === 'E' ? 'N' : 'n'}${a} `)
  .replace(/\b([Pp])or (o|a|os|as) /g, (m, p, a) => `${p}el${a} `);

export const VOICES = {
  'Cristianismo': {
    'Dúvida': { ref: 'Mateus 7:7', lang: 'Grego koiné', orig: 'Αἰτεῖτε, καὶ δοθήσεται ὑμῖν· ζητεῖτε, καὶ εὑρήσετε', tr: 'Pedi, e vos será dado; buscai, e encontrareis; batei, e a porta vos será aberta.',
      r: (o) => `Buscar não é falta de fé. Jesus trata a procura como parte do caminho: diante de ${o}, pergunte com sinceridade, peça orientação e bata à porta. Quem busca de coração não fica do lado de fora.` },
    'Alegria': { ref: '1 Tessalonicenses 5:16-18', lang: 'Grego koiné', orig: 'Πάντοτε χαίρετε, ἀδιαλείπτως προσεύχεσθε, ἐν παντὶ εὐχαριστεῖτε', tr: 'Alegrai-vos sempre, orai sem cessar, em tudo dai graças.',
      r: (o) => `Paulo liga a alegria à gratidão: agradecer por ${o} é o que faz a alegria durar. Transforme esse sentimento em oração ou em um obrigado dito a alguém hoje.` },
    'Medo': { ref: 'Mateus 6:34', lang: 'Grego koiné', orig: 'μὴ οὖν μεριμνήσητε εἰς τὴν αὔριον', tr: 'Não vos inquieteis pelo dia de amanhã, pois o amanhã trará os seus cuidados.',
      r: (o) => `Jesus não nega o medo, ele o traz para o tamanho de hoje. Sobre ${o}, olhe só para o que cabe nas próximas 24 horas: o resto ainda não chegou.` },
    'Aflição': { ref: 'Mateus 11:28', lang: 'Grego koiné', orig: 'Δεῦτε πρός με πάντες οἱ κοπιῶντες καὶ πεφορτισμένοι, κἀγὼ ἀναπαύσω ὑμᾶς', tr: 'Vinde a mim todos os que estais cansados e sobrecarregados, e eu vos aliviarei.',
      r: (o) => `O convite é para quem já não aguenta carregar sozinho. O peso de ${o} pode ser dividido: com Deus, na oração, e com alguém de confiança, numa conversa.` },
    'Pensamento': { ref: '1 Coríntios 13:12', lang: 'Grego koiné', orig: 'βλέπομεν γὰρ ἄρτι δι᾽ ἐσόπτρου ἐν αἰνίγματι', tr: 'Agora vemos como por um espelho, de modo obscuro.',
      r: (o) => `Paulo admite que vemos só em parte. Pensar sobre ${o} sem ter todas as respostas é humano: a clareza vem aos poucos, e o amor é o que guia enquanto isso.` }
  },
  'Judaísmo': {
    'Dúvida': { ref: 'Gênesis 12:1', lang: 'Hebraico', orig: 'לֶךְ־לְךָ מֵאַרְצְךָ', tr: 'Vai-te da tua terra.',
      r: (o) => `Lech lecha também pode ser lido como "vai para ti mesmo". Abraão parte sem o mapa completo. Diante de ${o}, a pergunta é: esse caminho te leva mais perto de quem você é?` },
    'Alegria': { ref: 'Salmos 118:24', lang: 'Hebraico', orig: 'זֶה־הַיּוֹם עָשָׂה יְהוָה נָגִילָה וְנִשְׂמְחָה בוֹ', tr: 'Este é o dia que o Senhor fez; alegremo-nos e exultemos nele.',
      r: (o) => `O salmista não adia a alegria: é neste dia que se celebra. Viva ${o} por inteiro hoje, com uma bênção, um brinde, um momento de presença.` },
    'Medo': { ref: 'Salmos 23:4', lang: 'Hebraico', orig: 'גַּם כִּי־אֵלֵךְ בְּגֵיא צַלְמָוֶת לֹא־אִירָא רָע כִּי־אַתָּה עִמָּדִי', tr: 'Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo.',
      r: (o) => `O salmo não promete que o vale some, promete companhia dentro dele. No medo de ${o}, lembre quem caminha com você.` },
    'Aflição': { ref: 'Salmos 30:6', lang: 'Hebraico', orig: 'בָּעֶרֶב יָלִין בֶּכִי וְלַבֹּקֶר רִנָּה', tr: 'Ao anoitecer pode vir o choro, mas pela manhã vem a alegria.',
      r: (o) => `A tradição dá lugar ao choro, sem pressa de apagá-lo. O que pesa em ${o} é noite, e noites terminam. Permita-se sentir, e espere a manhã.` },
    'Pensamento': { ref: 'Pirkei Avot 1:14', lang: 'Hebraico', orig: 'אִם אֵין אֲנִי לִי, מִי לִי', tr: 'Se eu não for por mim, quem será por mim? E, se agora não, quando?',
      r: (o) => `Hillel junta cuidado de si e urgência. Pensar em ${o} é legítimo, e a pergunta final é prática: o que você pode fazer agora?` }
  },
  'Hinduísmo': {
    'Dúvida': { ref: 'Bhagavad Gita 3.35', lang: 'Sânscrito', orig: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्', tr: 'Melhor é o próprio caminho, ainda que imperfeito, do que o caminho alheio bem trilhado.',
      r: (o) => `Krishna fala de svadharma, a natureza própria de cada um. Sobre ${o}, a pergunta não é o que parece melhor aos outros, e sim o que é de fato seu.` },
    'Alegria': { ref: 'Taittiriya Upanishad 3.6', lang: 'Sânscrito', orig: 'आनन्दो ब्रह्मेति व्यजानात्', tr: 'Ele compreendeu que a bem-aventurança é o próprio Absoluto.',
      r: (o) => `Para os Upanishads, a alegria verdadeira não é detalhe: é um vislumbre do sagrado. Em ${o}, você tocou algo essencial. Guarde esse sabor.` },
    'Medo': { ref: 'Bhagavad Gita 2.20', lang: 'Sânscrito', orig: 'न जायते म्रियते वा कदाचित्', tr: 'A alma nunca nasce e nunca morre.',
      r: (o) => `Krishna lembra Arjuna de que o essencial em você não pode ser destruído. O medo de ${o} toca a superfície; o centro permanece inteiro.` },
    'Aflição': { ref: 'Bhagavad Gita 2.14', lang: 'Sânscrito', orig: 'आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत', tr: 'Eles vêm e vão, são passageiros: suporta-os com paciência.',
      r: (o) => `Prazer e dor, frio e calor, tudo passa. O que dói em ${o} também é passageiro. Paciência aqui não é resignação: é firmeza enquanto a estação muda.` },
    'Pensamento': { ref: 'Bhagavad Gita 2.47', lang: 'Sânscrito', orig: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', tr: 'Teu direito é apenas à ação, nunca aos seus frutos.',
      r: (o) => `O Gita propõe agir bem e soltar o resultado. Ao pensar em ${o}, foque no que depende de você e deixe o resto seguir seu curso.` }
  },
  'Budismo': {
    'Dúvida': { ref: 'Kalama Sutta, AN 3.65', lang: 'Páli', orig: 'Yadā tumhe, kālāmā, attanāva jāneyyātha', tr: 'Quando souberdes por vós mesmos que algo conduz ao bem-estar, então segui-o.',
      r: (o) => `O Buda pede que você não decida pela opinião alheia nem pelo costume, mas pela experiência direta. Sobre ${o}, experimente em pequeno antes de decidir em grande.` },
    'Alegria': { ref: 'Dhammapada 204', lang: 'Páli', orig: 'Ārogyaparamā lābhā, santuṭṭhiparamaṃ dhanaṃ', tr: 'A saúde é o maior ganho, o contentamento é a maior riqueza.',
      r: (o) => `O contentamento é chamado de riqueza. A alegria de ${o} fica maior quando você a sente sem precisar de mais nada: respire e perceba que agora já basta.` },
    'Medo': { ref: 'Dhammapada 212', lang: 'Páli', orig: 'Piyato jāyatī soko, piyato jāyatī bhayaṃ', tr: 'Do apego nasce a tristeza, do apego nasce o medo.',
      r: (o) => `O Buda aponta a raiz: tememos perder o que seguramos com força. No medo de ${o}, observe o que você está tentando controlar e afrouxe um pouco a mão.` },
    'Aflição': { ref: 'Dhammapada 277', lang: 'Páli', orig: 'Sabbe saṅkhārā aniccā', tr: 'Todas as coisas condicionadas são impermanentes.',
      r: (o) => `A impermanência também vale para a dor. O que você sente com ${o} não é o fim da história; olhe para ele com compaixão, como olharia para um amigo.` },
    'Pensamento': { ref: 'Dhammapada 1', lang: 'Páli', orig: 'Manopubbaṅgamā dhammā, manoseṭṭhā manomayā', tr: 'A mente precede todas as coisas; tudo é feito pela mente.',
      r: (o) => `O jeito como você olha para ${o} já molda a experiência. Antes de concluir, repare nos pensamentos que surgem e escolha com quais quer ficar.` }
  },
  'Islamismo': {
    'Dúvida': { ref: 'Alcorão 3:159', lang: 'Árabe', orig: 'وَشَاوِرْهُمْ فِي الْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ', tr: 'Consulta-os nos assuntos; e, quando estiveres decidido, confia em Deus.',
      r: (o) => `Primeiro escute quem você ama e quem conhece o caminho de ${o}. Depois decida com firmeza. A confiança vem depois da decisão, não no lugar dela.` },
    'Alegria': { ref: 'Alcorão 14:7', lang: 'Árabe', orig: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', tr: 'Se fordes agradecidos, certamente vos darei mais.',
      r: (o) => `A gratidão, shukr, multiplica o bem. Agradecer por ${o} não é só educação: é abrir espaço para que mais coisas boas cheguem.` },
    'Medo': { ref: 'Alcorão 2:286', lang: 'Árabe', orig: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا', tr: 'Deus não impõe a nenhuma alma uma carga maior do que ela pode suportar.',
      r: (o) => `O versículo é uma promessa de medida: você tem força para o que está diante de você. O medo de ${o} não diz que você não dá conta.` },
    'Aflição': { ref: 'Alcorão 94:5-6', lang: 'Árabe', orig: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', tr: 'Com a dificuldade vem a facilidade.',
      r: (o) => `A frase é repetida duas vezes no Alcorão, como quem insiste num consolo. Dentro do peso de ${o} já existe uma abertura, mesmo que ainda não esteja visível.` },
    'Pensamento': { ref: 'Alcorão 13:11', lang: 'Árabe', orig: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', tr: 'Deus não muda a condição de um povo até que ele mude o que há em si.',
      r: (o) => `A mudança começa por dentro. Ao pensar em ${o}, pergunte-se o que, em você, precisa se mover primeiro.` }
  },
  'Taoísmo': {
    'Dúvida': { ref: 'Tao Te Ching 64', lang: 'Chinês clássico', orig: '千里之行，始於足下', tr: 'A jornada de mil léguas começa sob os teus pés.',
      r: (o) => `Lao Tsé lembra que nada grande começa grande. Com ${o}, dê um passo pequeno e real hoje: uma pesquisa, uma conversa, um teste.` },
    'Alegria': { ref: 'Tao Te Ching 33', lang: 'Chinês clássico', orig: '知足者富', tr: 'Quem sabe que tem o suficiente é rico.',
      r: (o) => `Para o Tao, riqueza é reconhecer que já basta. A alegria de ${o} é um desses momentos em que nada falta: saboreie sem pressa de buscar o próximo.` },
    'Medo': { ref: 'Tao Te Ching 16', lang: 'Chinês clássico', orig: '致虛極，守靜篤', tr: 'Alcança o vazio extremo, guarda a quietude firme.',
      r: (o) => `O Tao convida a esvaziar a agitação antes de agir. Diante do medo de ${o}, sente-se em silêncio por alguns minutos: a água parada fica transparente.` },
    'Aflição': { ref: 'Tao Te Ching 22', lang: 'Chinês clássico', orig: '曲則全', tr: 'O que se curva permanece inteiro.',
      r: (o) => `O bambu se curva na tempestade e não quebra. Se ${o} te dobrou, não é derrota: é o jeito de atravessar sem se partir.` },
    'Pensamento': { ref: 'Tao Te Ching 33', lang: 'Chinês clássico', orig: '知人者智，自知者明', tr: 'Quem conhece os outros é sábio; quem conhece a si mesmo é iluminado.',
      r: (o) => `Pensar sobre ${o} é também uma chance de se conhecer. O que esse pensamento revela sobre o que você valoriza?` }
  },
  'Espiritismo': {
    'Dúvida': { ref: 'Allan Kardec, inscrição em seu túmulo', lang: 'Francês', orig: 'Naître, mourir, renaître encore et progresser sans cesse, telle est la loi.', tr: 'Nascer, morrer, renascer ainda e progredir sem cessar, tal é a lei.',
      r: (o) => `Para o Espiritismo, a vida é movimento e aprendizado. A escolha sobre ${o} é boa quando te faz crescer como pessoa, não só quando dá certo por fora.` },
    'Alegria': { ref: 'O Evangelho segundo o Espiritismo, cap. XV', lang: 'Francês', orig: 'Hors la charité point de salut.', tr: 'Fora da caridade não há salvação.',
      r: (o) => `Kardec coloca o bem ao outro no centro. A alegria de ${o} fica completa quando transborda: divida com alguém, faça um gesto de bondade hoje.` },
    'Medo': { ref: 'O Evangelho segundo o Espiritismo, cap. XXV', lang: 'Francês', orig: 'Aide-toi, le ciel t\'aidera.', tr: 'Ajuda-te, e o céu te ajudará.',
      r: (o) => `A fé espírita não é passiva: pede que você faça a sua parte. No medo de ${o}, dê o primeiro passo que depende de você e confie na ajuda que vem depois.` },
    'Aflição': { ref: 'O Evangelho segundo o Espiritismo, cap. V', lang: 'Francês', orig: 'Bienheureux les affligés, car ils seront consolés.', tr: 'Bem-aventurados os aflitos, porque serão consolados.',
      r: (o) => `Kardec ensina que nenhuma dor é inútil nem eterna. O que você vive com ${o} tem um sentido que talvez só apareça depois, e o consolo é promessa.` },
    'Pensamento': { ref: 'O Livro dos Espíritos, q. 919', lang: 'Francês', orig: 'Connais-toi toi-même.', tr: 'Conhece-te a ti mesmo.',
      r: (o) => `Os espíritos respondem a Kardec que o meio mais eficaz de melhorar é o autoconhecimento. Use ${o} como espelho: o que ele mostra sobre você?` }
  },
  'Confucionismo': {
    'Dúvida': { ref: 'Analectos 2.17', lang: 'Chinês clássico', orig: '知之為知之，不知為不知，是知也', tr: 'Saber o que se sabe e reconhecer o que não se sabe: isso é conhecimento.',
      r: (o) => `Confúcio convida à honestidade: sobre ${o}, o que você realmente sabe, e o que ainda é imaginação? Separar os dois já clareia a decisão.` },
    'Alegria': { ref: 'Analectos 1.1', lang: 'Chinês clássico', orig: '有朋自遠方來，不亦樂乎', tr: 'Ter amigos que vêm de longe: não é uma alegria?',
      r: (o) => `A primeira página dos Analectos fala de alegria compartilhada. Chame alguém querido para celebrar ${o} com você.` },
    'Medo': { ref: 'Analectos 9.29', lang: 'Chinês clássico', orig: '知者不惑，仁者不憂，勇者不懼', tr: 'O sábio não se confunde, o bondoso não se aflige, o corajoso não teme.',
      r: (o) => `Para Confúcio, coragem se treina. No medo de ${o}, pergunte: o que uma pessoa sábia, bondosa e corajosa faria agora?` },
    'Aflição': { ref: 'Analectos 9.28', lang: 'Chinês clássico', orig: '歲寒，然後知松柏之後彫也', tr: 'Só quando o ano esfria se vê que o pinheiro e o cipreste são os últimos a perder as folhas.',
      r: (o) => `É no inverno que a força aparece. O frio de ${o} também está mostrando a sua resistência, mesmo que você não a sinta agora.` },
    'Pensamento': { ref: 'Analectos 2.15', lang: 'Chinês clássico', orig: '學而不思則罔，思而不學則殆', tr: 'Aprender sem pensar é inútil; pensar sem aprender é perigoso.',
      r: (o) => `Refletir sobre ${o} é bom, e fica melhor com informação. Busque alguém que já viveu algo parecido e aprenda com essa experiência.` }
  },
  'Estoicismo': {
    'Dúvida': { ref: 'Epicteto, Manual 1', lang: 'Grego antigo', orig: 'Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν', tr: 'Das coisas, umas dependem de nós, outras não.',
      r: (o) => `Epicteto começa pela divisão essencial. Sobre ${o}, liste o que depende de você e o que não depende, e decida só com base na primeira lista.` },
    'Alegria': { ref: 'Sêneca, Cartas a Lucílio 23', lang: 'Latim', orig: 'Disce gaudere.', tr: 'Aprende a alegrar-te.',
      r: (o) => `Sêneca diz que a alegria verdadeira nasce de dentro e se aprende. Sobre ${o}, repare no que em você tornou essa alegria possível: é isso que se cultiva.` },
    'Medo': { ref: 'Sêneca, Cartas a Lucílio 13', lang: 'Latim', orig: 'Saepius opinione quam re laboramus.', tr: 'Sofremos mais na imaginação do que na realidade.',
      r: (o) => `Sêneca separa o fato da imaginação. Sobre ${o}, escreva o que realmente está acontecendo e o que é só previsão. O medo costuma morar na segunda parte.` },
    'Aflição': { ref: 'Epicteto, Manual 5', lang: 'Grego antigo', orig: 'Ταράσσει τοὺς ἀνθρώπους οὐ τὰ πράγματα, ἀλλὰ τὰ περὶ τῶν πραγμάτων δόγματα', tr: 'Não são as coisas que perturbam as pessoas, mas as opiniões que elas têm sobre as coisas.',
      r: (o) => `Não se trata de negar a dor, e sim de olhar para a história que você conta sobre ${o}. Há outra leitura possível, um pouco mais gentil com você?` },
    'Pensamento': { ref: 'Sêneca, Cartas a Lucílio 28', lang: 'Latim', orig: 'Animum debes mutare, non caelum.', tr: 'É a alma que deves mudar, não o céu.',
      r: (o) => `Sêneca lembra que levamos a nós mesmos aonde vamos. Ao pensar em ${o}, observe o que precisa mudar em você, e não só ao seu redor.` }
  },
  'Existencialismo': {
    'Dúvida': { ref: 'Kierkegaard, Diários, 1843', lang: 'Dinamarquês', orig: 'Livet maa forstaaes baglænds, men leves forlænds.', tr: 'A vida só se compreende olhando para trás, mas precisa ser vivida olhando para frente.',
      r: (o) => `Você nunca terá certeza total sobre ${o} antes de viver. Toda escolha real envolve um salto, e a clareza costuma chegar depois do passo.` },
    'Alegria': { ref: 'Camus, O Mito de Sísifo', lang: 'Francês', orig: 'Il faut imaginer Sisyphe heureux.', tr: 'É preciso imaginar Sísifo feliz.',
      r: (o) => `Camus defende a alegria como escolha lúcida, mesmo num mundo imperfeito. A felicidade de ${o} é sua por direito: não precisa de justificativa.` },
    'Medo': { ref: 'Kierkegaard, O Conceito de Angústia', lang: 'Dinamarquês', orig: 'Angest er Frihedens Svimmelhed.', tr: 'A angústia é a vertigem da liberdade.',
      r: (o) => `Para Kierkegaard, sentir medo diante de ${o} é sinal de que existe escolha. A vertigem mostra que o caminho é seu.` },
    'Aflição': { ref: 'Camus, O Verão', lang: 'Francês', orig: 'Au milieu de l\'hiver, j\'ai découvert en moi un invincible été.', tr: 'No meio do inverno, descobri em mim um verão invencível.',
      r: (o) => `Camus escreve do fundo da dificuldade. Mesmo com ${o} pesando, existe em você um lugar que continua quente. Procure por ele.` },
    'Pensamento': { ref: 'Sartre, O Existencialismo é um Humanismo', lang: 'Francês', orig: 'L\'homme n\'est rien d\'autre que ce qu\'il se fait.', tr: 'O ser humano não é nada além daquilo que faz de si mesmo.',
      r: (o) => `Para Sartre, somos o que escolhemos fazer. O que você decidir sobre ${o} também vai dizer quem você é.` }
  },
  'Filosofia africana': {
    'Dúvida': { ref: 'Provérbio zulu, filosofia Ubuntu', lang: 'Zulu', orig: 'Umuntu ngumuntu ngabantu.', tr: 'Uma pessoa é uma pessoa por meio das outras pessoas.',
      r: (o) => `O Ubuntu lembra que ninguém decide sozinho. Sobre ${o}, pergunte quem será afetado e quem pode te apoiar: a boa escolha também cuida dos vínculos.` },
    'Alegria': { ref: 'Provérbio suaíle', lang: 'Suaíle', orig: 'Mgeni njoo, mwenyeji apone.', tr: 'Que venha o visitante, para que o anfitrião se cure.',
      r: (o) => `Na sabedoria suaíle, receber e partilhar faz bem a quem oferece. Abra a porta: a alegria de ${o} cresce quando entra mais gente.` },
    'Medo': { ref: 'Provérbio suaíle', lang: 'Suaíle', orig: 'Penye nia pana njia.', tr: 'Onde há vontade, há caminho.',
      r: (o) => `O medo de ${o} não fecha a estrada. Se existe vontade verdadeira, o caminho aparece, às vezes por onde você não esperava.` },
    'Aflição': { ref: 'Provérbio suaíle', lang: 'Suaíle', orig: 'Baada ya dhiki faraja.', tr: 'Depois da aflição vem o conforto.',
      r: (o) => `Os mais velhos repetem isso aos mais novos há gerações. O que dói em ${o} tem começo, meio e fim, e o conforto também chega.` },
    'Pensamento': { ref: 'Provérbio suaíle', lang: 'Suaíle', orig: 'Haba na haba hujaza kibaba.', tr: 'Pouco a pouco se enche a medida.',
      r: (o) => `Não é preciso resolver ${o} de uma vez. Pequenos gestos repetidos enchem a medida.` }
  },
  'Sufismo': {
    'Dúvida': { ref: 'Rumi, Masnavi I.1', lang: 'Persa', orig: 'بشنو این نی چون شکایت می‌کند · از جدایی‌ها حکایت می‌کند', tr: 'Escuta a flauta de junco: ela conta sua história e lamenta as separações.',
      r: (o) => `Para Rumi, a flauta chora com saudade de onde veio. Escute o que ${o} desperta em você: essa saudade pode ser a alma apontando para onde se sente inteira.` },
    'Alegria': { ref: 'Rumi, Divan-e Shams', lang: 'Persa', orig: 'ما ز بالاییم و بالا می‌رویم', tr: 'Somos do alto, e ao alto voltamos.',
      r: (o) => `Rumi vê a alegria como lembrança da nossa origem. Em ${o}, algo em você lembrou de onde veio. Dance, cante, agradeça.` },
    'Medo': { ref: 'Rumi, Masnavi I', lang: 'Persa', orig: 'صبر و خاموشی جذوب رحمت است', tr: 'Paciência e silêncio atraem a misericórdia.',
      r: (o) => `No medo de ${o}, Rumi sugere o contrário da pressa: silêncio e paciência. Nesse espaço quieto, a ajuda encontra por onde entrar.` },
    'Aflição': { ref: 'Rumi, Masnavi V', lang: 'Persa', orig: 'هست مهمان‌خانه این تن ای جوان', tr: 'Este corpo é uma casa de hóspedes.',
      r: (o) => `Rumi pede que você receba cada sentimento como um hóspede que vem e vai. A tristeza de ${o} está de passagem; trate-a com cuidado, ela pode trazer algo novo.` },
    'Pensamento': { ref: 'Rumi, Masnavi I', lang: 'Persa', orig: 'این جهان کوه است و فعل ما ندا', tr: 'Este mundo é a montanha, e nossos atos são o grito que ecoa de volta.',
      r: (o) => `O que você coloca no mundo volta para você. Ao pensar em ${o}, pergunte qual eco você quer ouvir.` }
  },
  'Sikhismo': {
    'Dúvida': { ref: 'Japji Sahib, Guru Nanak', lang: 'Gurmukhi', orig: 'ਹੁਕਮਿ ਰਜਾਈ ਚਲਣਾ ਨਾਨਕ ਲਿਖਿਆ ਨਾਲਿ', tr: 'Caminhar em harmonia com a Vontade divina, ó Nanak: isso está escrito em nós.',
      r: (o) => `Guru Nanak ensina hukam, a ordem viva por trás de tudo. Sobre ${o}, em vez de forçar uma resposta, observe para onde a vida já vem te conduzindo.` },
    'Alegria': { ref: 'Ardas, oração sikh', lang: 'Gurmukhi', orig: 'ਨਾਨਕ ਨਾਮ ਚੜ੍ਹਦੀ ਕਲਾ, ਤੇਰੇ ਭਾਣੇ ਸਰਬੱਤ ਦਾ ਭਲਾ', tr: 'Nanak, pelo Nome, o ânimo sempre elevado; pela tua vontade, o bem de todos.',
      r: (o) => `Chardi kala é o espírito sempre alto. A alegria de ${o} fica completa quando se estende ao bem de todos.` },
    'Medo': { ref: 'Mool Mantar, Guru Granth Sahib', lang: 'Gurmukhi', orig: 'ਨਿਰਭਉ ਨਿਰਵੈਰੁ', tr: 'Sem medo, sem ódio.',
      r: (o) => `Nirbhau, sem medo, é uma das primeiras qualidades do divino no Mool Mantar. Diante de ${o}, lembre que essa qualidade também mora em você.` },
    'Aflição': { ref: 'Guru Nanak, Guru Granth Sahib 469', lang: 'Gurmukhi', orig: 'ਦੁਖੁ ਦਾਰੂ ਸੁਖੁ ਰੋਗੁ ਭਇਆ', tr: 'A dor tornou-se o remédio, e o conforto, a doença.',
      r: (o) => `Guru Nanak vira a lógica: a dor pode curar ao nos despertar. O que você atravessa com ${o} pode estar te levando a algo mais verdadeiro.` },
    'Pensamento': { ref: 'Japji Sahib 28', lang: 'Gurmukhi', orig: 'ਮਨਿ ਜੀਤੈ ਜਗੁ ਜੀਤੁ', tr: 'Quem conquista a própria mente conquista o mundo.',
      r: (o) => `Antes de mudar ${o}, conquiste a própria mente: aquiete-a, observe-a, e então escolha.` }
  },
  'Filosofia grega': {
    'Dúvida': { ref: 'Heráclito, fragmento 91', lang: 'Grego antigo', orig: 'ποταμῷ γὰρ οὐκ ἔστιν ἐμβῆναι δὶς τῷ αὐτῷ', tr: 'Não é possível entrar duas vezes no mesmo rio.',
      r: (o) => `Heráclito lembra que tudo flui, inclusive você. Ao decidir sobre ${o}, pense na pessoa que você está se tornando, não só em quem você é hoje.` },
    'Alegria': { ref: 'Aristóteles, Ética a Nicômaco I.7', lang: 'Grego antigo', orig: 'μία γὰρ χελιδὼν ἔαρ οὐ ποιεῖ', tr: 'Uma andorinha só não faz verão.',
      r: (o) => `Para Aristóteles, a felicidade é um modo de viver, não um instante. Que ${o} vire hábito: repita o que te trouxe até aqui.` },
    'Medo': { ref: 'Epicuro, Tetrapharmakos', lang: 'Grego antigo', orig: 'ἄφοβον ὁ θεός, ἀνύποπτον ὁ θάνατος', tr: 'Não há o que temer nos deuses, não há o que recear na morte.',
      r: (o) => `Epicuro receitava quatro remédios contra o medo. Aplicado a ${o}: o que é ruim costuma ser suportável, e o que é bom está mais perto do que parece.` },
    'Aflição': { ref: 'Heráclito, fragmento 111', lang: 'Grego antigo', orig: 'νοῦσος ὑγιείην ἐποίησεν ἡδύ, κάματος ἀνάπαυσιν', tr: 'A doença torna a saúde doce, e o cansaço, o repouso.',
      r: (o) => `Heráclito vê os opostos se ensinando. O peso de ${o} vai fazer o alívio, quando vier, ter um sabor novo.` },
    'Pensamento': { ref: 'Heráclito, fragmento 119', lang: 'Grego antigo', orig: 'ἦθος ἀνθρώπῳ δαίμων', tr: 'O caráter de uma pessoa é o seu destino.',
      r: (o) => `O que você pensa e faz a respeito de ${o} vai formando o seu caráter, e o caráter molda o caminho.` }
  }
};

const KIND_OF = { 'Dúvida': 'Dúvida', 'Alegria': 'Alegria', 'Medo': 'Medo', 'Aflição': 'Aflição', 'Pensamento': 'Pensamento', 'Sugestão': 'Pensamento' };

export function voiceFor(name, kind, obj) {
  const set = VOICES[name]; if (!set) return null;
  const v = set[KIND_OF[kind] || 'Dúvida'] || set['Dúvida'];
  const o = obj || 'o que você está vivendo';
  return { ref: v.ref, lang: v.lang, orig: v.orig, tr: v.tr, reflection: C(contract(v.r(o))) };
}
