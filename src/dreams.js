// Leitura de sonhos: dois olhares sobre as mesmas imagens.
// Psicanálise (Freud, Jung e seguidores) e tradições espirituais.
// São leituras simbólicas, convites à reflexão, nunca diagnóstico nem previsão.

export const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// re: raízes das palavras (texto sem acentos, minúsculo)
export const SYMBOLS = [
  { k: 'agua', name: 'Água', re: /\b(agua|mar\b|oceano|rio\b|rios\b|onda|piscina|lago|cachoeira|praia|inunda|enchente)/,
    psy: 'A água é a imagem clássica do inconsciente e das emoções. Água calma costuma falar de sentimentos acolhidos; água revolta ou funda, de algo que transborda e ainda não tem nome.',
    spi: 'Nas tradições, a água purifica e renova. Sonhar com ela pode ser um convite a lavar mágoas e deixar a vida fluir de novo.',
    q: 'O que em você está pedindo para transbordar ou para ser acalmado?' },
  { k: 'voar', name: 'Voar', re: /\b(voa|voe|voo|voando|flutua|levita)/,
    psy: 'Freud via no voo um desejo de liberdade e de prazer sem peso. Para Jung, pode compensar uma vida desperta muito presa ao chão, ou alertar para o risco de fugir da realidade.',
    spi: 'Voar é sinal de expansão da consciência. Muitas tradições entendem como a alma lembrando que é maior do que os problemas.',
    q: 'Do que você gostaria de se libertar agora?' },
  { k: 'cair', name: 'Cair', re: /\b(cai|caia|cair|caindo|queda|despenc)/,
    psy: 'A queda costuma expressar medo de perder o controle, o lugar ou a aprovação. Muitas vezes aparece em fases de insegurança ou de mudança.',
    spi: 'A queda pode ser um chamado para soltar o controle e confiar. O chão que você teme perder talvez não seja o único que sustenta você.',
    q: 'Onde você sente que está perdendo o chão?' },
  { k: 'dentes', name: 'Dentes', re: /\b(dente|dentes|banguela)/,
    psy: 'Dentes caindo são um dos sonhos mais comuns. A psicanálise liga a imagem à autoimagem, ao medo de envelhecer, de perder força ou de não ser bem visto.',
    spi: 'Tradicionalmente, perder dentes marca o fim de uma fase. É um convite a aceitar uma passagem e cuidar da própria força.',
    q: 'Que mudança na sua imagem ou no seu papel está mexendo com você?' },
  { k: 'casa', name: 'Casa', re: /\b(casa|apartamento|quarto|comodo|sala\b|porao|sotao|lar\b)/,
    psy: 'Para Jung, a casa é o próprio eu: os andares são níveis da psique. Cômodos novos falam de potenciais descobertos; porões, de memórias guardadas.',
    spi: 'A casa é o templo interior. O estado dela no sonho mostra como está o seu abrigo por dentro.',
    q: 'Que parte da sua casa interior pede cuidado ou arrumação?' },
  { k: 'morte', name: 'Morte', re: /\b(morr|morte|morto|morta|enterro|funeral|velorio|caixao)/,
    psy: 'Sonhar com morte quase nunca fala de morte real. Na psicanálise, costuma representar o fim de uma etapa, de um papel ou de um desejo antigo.',
    spi: 'Em quase todas as tradições, a morte simbólica anuncia renascimento. Algo termina para que outra coisa possa nascer.',
    q: 'O que está terminando na sua vida, e o que quer nascer no lugar?' },
  { k: 'falecido', name: 'Alguém que já partiu', re: /\b(falecid|ja morreu|que morreu|ja partiu|que partiu)/,
    psy: 'Sonhar com quem já partiu é parte do luto: o inconsciente segue conversando com quem amamos e elabora o que ficou por dizer.',
    spi: 'Muitas tradições entendem esses sonhos como visitas de afeto. Receba com gratidão o que a presença trouxe.',
    q: 'O que você gostaria de dizer ou ouvir dessa pessoa?' },
  { k: 'bebe', name: 'Bebê ou gravidez', re: /\b(bebe|bebês|gravid|gestante|parto|nascimento|nasceu)/,
    psy: 'Um bebê costuma simbolizar algo novo e frágil em você: um projeto, uma ideia, uma parte da personalidade que precisa de cuidado para crescer.',
    spi: 'Nascimento em sonho é sinal de começo abençoado. Algo em gestação pede paciência e proteção.',
    q: 'Que projeto ou parte de você está nascendo e precisa de cuidado?' },
  { k: 'cobra', name: 'Cobra', re: /\b(cobra|serpente|jiboia|cascavel)/,
    psy: 'Freud associava a cobra à sexualidade e ao desejo. Para Jung, ela é também transformação e cura, energia instintiva que pede consciência.',
    spi: 'A serpente troca de pele: é símbolo de renovação, de sabedoria e de energia vital que desperta.',
    q: 'Que energia instintiva ou mudança você tem evitado olhar?' },
  { k: 'perseguicao', name: 'Ser perseguido', re: /\b(persegu|fugi|fugindo|correndo atras|escond)/,
    psy: 'Quem persegue costuma ser uma parte de nós que rejeitamos: a sombra, para Jung. Enquanto fugimos, ela corre atrás. Quando olhamos, ela perde a força.',
    spi: 'Fugir em sonho é sinal de algo que pede para ser enfrentado com coragem e compaixão, não com medo.',
    q: 'Do que você tem fugido na vida desperta?' },
  { k: 'prova', name: 'Prova ou escola', re: /\b(prova|escola|vestibular|exame|colegio|faculdade|professor)/,
    psy: 'Sonhos de prova falam de autoexigência e medo de ser avaliado. Freud notou que costumam surgir antes de desafios reais, lembrando que você já passou por outros.',
    spi: 'A escola do sonho é a escola da vida: há uma lição em curso. Pergunte-se o que está aprendendo, não se vai passar.',
    q: 'Por quem, ou por qual régua, você sente que está sendo avaliado?' },
  { k: 'nudez', name: 'Estar nu', re: /\b(nu\b|nua\b|pelad|sem roupa|despid)/,
    psy: 'A nudez em público fala de exposição e vulnerabilidade: medo de que vejam quem você é de verdade, ou desejo de ser aceito sem máscaras.',
    spi: 'Estar nu é também autenticidade. Um convite a se mostrar mais inteiro, sem tantos disfarces.',
    q: 'Onde você gostaria de ser visto como realmente é?' },
  { k: 'ex', name: 'Ex ou amor antigo', re: /\b(ex\b|ex-|antigo namorad|antiga namorad|meu ex|minha ex|ex namorad|ex marido|ex mulher)/,
    psy: 'Um ex no sonho raramente é sobre a pessoa. Costuma representar uma parte sua daquela época, ou um padrão afetivo que volta a se repetir.',
    spi: 'Pode ser a alma pedindo para fechar um ciclo com perdão, para você e para a história.',
    q: 'Que qualidade daquela fase você sente falta, ou que padrão quer encerrar?' },
  { k: 'mae', name: 'Mãe', re: /\b(mae|mamae|maezinha)/,
    psy: 'A figura materna fala de cuidado, acolhimento e também de dependência. Jung via nela o arquétipo da Grande Mãe, que nutre e às vezes prende.',
    spi: 'A mãe no sonho lembra a fonte de amor que sustenta você. Pode ser um convite a se cuidar como quem cuida de um filho.',
    q: 'Como anda o cuidado que você oferece a si mesmo?' },
  { k: 'pai', name: 'Pai', re: /\b(pai\b|papai|meu pai)/,
    psy: 'O pai simboliza a lei, a autoridade e a estrutura. Sonhar com ele pode falar da sua relação com limites, com regras e com a própria autoridade.',
    spi: 'A figura paterna aponta para proteção e direção. Pergunte-se de onde vem a firmeza que você procura.',
    q: 'Qual é a sua relação hoje com limites e autoridade?' },
  { k: 'carro', name: 'Carro ou dirigir', re: /\b(carro|dirigi|dirigindo|volante|freio|acidente|estrada)/,
    psy: 'O carro costuma representar o jeito como você conduz a vida. Quem dirige, se há freio, se o caminho é claro: tudo isso fala de controle e autonomia.',
    spi: 'O caminho do sonho é o seu caminho. Veja se você está no volante ou deixando outros decidirem a direção.',
    q: 'Quem está no volante da sua vida neste momento?' },
  { k: 'viagem', name: 'Viagem', re: /\b(viag|aviao|aeroporto|mala|malas|trem|onibus|navio)/,
    psy: 'Viagens falam de transição e de desejo de mudança. Perder o voo ou a mala costuma mostrar ansiedade diante de uma passagem importante.',
    spi: 'A viagem é a jornada da alma. Uma nova etapa está se aproximando: prepare a bagagem interior.',
    q: 'Para onde você sente que precisa ir, por dentro ou por fora?' },
  { k: 'porta', name: 'Porta', re: /\b(porta|portao|chave|fechadura|tranc)/,
    psy: 'Portas e chaves falam de acesso: ao que você deseja, ao que está reprimido ou a uma nova fase. Porta trancada pode ser algo que você ainda não se permite.',
    spi: 'Uma porta é passagem entre mundos. Oportunidades e caminhos novos se anunciam para quem tem coragem de atravessar.',
    q: 'Que porta você tem vontade de abrir, e o que segura sua mão?' },
  { k: 'escada', name: 'Escada ou elevador', re: /\b(escada|degrau|elevador|subir|subindo|descer|descendo)/,
    psy: 'Subir e descer falam de ambição, status e também de acesso a camadas mais profundas de si. Descer pode ser mergulhar no inconsciente.',
    spi: 'A escada liga a terra ao céu: é imagem de crescimento espiritual, degrau por degrau.',
    q: 'Você está subindo, descendo ou parado em algum degrau da vida?' },
  { k: 'fogo', name: 'Fogo', re: /\b(fogo|incendio|queima|chama|fogueira|brasa)/,
    psy: 'O fogo é paixão, raiva e desejo. Pode mostrar uma emoção intensa que precisa de canal para não queimar tudo por perto.',
    spi: 'O fogo transforma e purifica. Algo em você está sendo refinado: o que queimar era o que não servia.',
    q: 'Que emoção intensa pede um lugar seguro para arder?' },
  { k: 'cachorro', name: 'Cachorro', re: /\b(cachorr|cao\b|caes\b|cadela|filhote)/,
    psy: 'O cachorro costuma representar lealdade, instinto e amizade. Um cão bravo pode ser um instinto negado; um cão amigo, uma parte fiel de você.',
    spi: 'Em muitas tradições, o cão é guardião e guia. Pode indicar proteção e amizades verdadeiras por perto.',
    q: 'Em quem, ou em que parte sua, você confia de verdade?' },
  { k: 'gato', name: 'Gato', re: /\b(gato|gata|felino)/,
    psy: 'O gato fala de independência, sensualidade e do feminino instintivo. Pode apontar para a necessidade de mais autonomia.',
    spi: 'O gato é associado à intuição e ao mistério. Um convite a confiar mais no que você sente sem explicar.',
    q: 'Onde você precisa de mais independência ou de mais intuição?' },
  { k: 'sangue', name: 'Sangue', re: /\b(sangue|sangra|ferida|machuc)/,
    psy: 'O sangue fala de vitalidade e de feridas. Pode indicar um desgaste emocional ou algo que ainda dói e pede cuidado.',
    spi: 'O sangue é força vital e laço de família. Pode ser um chamado a cuidar da própria energia e das raízes.',
    q: 'Onde você está gastando energia vital demais?' },
  { k: 'dinheiro', name: 'Dinheiro', re: /\b(dinheiro|nota\b|notas\b|moeda|ouro|tesouro|rico|pagar|divida)/,
    psy: 'Freud ligava o dinheiro ao valor que damos a nós e ao que retemos. Encontrar dinheiro pode falar de autoestima; perdê-lo, de medo de perder valor.',
    spi: 'O tesouro do sonho aponta para talentos e dons. A verdadeira riqueza pode estar em algo que você ainda não valoriza.',
    q: 'Que valor seu você ainda não reconhece?' },
  { k: 'perdido', name: 'Estar perdido', re: /\b(perdid|perdi\b|perdendo|nao achava|procurava|labirinto)/,
    psy: 'Estar perdido ou procurar algo fala de confusão sobre rumo e identidade. É comum em fases de escolha importante.',
    spi: 'Perder-se é parte de toda busca. O sonho pede pausa e confiança: o caminho aparece quando você para de correr.',
    q: 'O que você está procurando de verdade?' },
  { k: 'atraso', name: 'Chegar atrasado', re: /\b(atrasad|atraso|perdi o|perder o (onibus|voo|aviao|trem|horario))/,
    psy: 'Atrasos em sonho mostram ansiedade e sensação de não dar conta. Muitas vezes, cobrança interna maior do que a real.',
    spi: 'Um lembrete de que cada coisa tem seu tempo. Não existe atraso para a alma, só o seu ritmo.',
    q: 'Que cobrança de tempo você pode aliviar?' },
  { k: 'banheiro', name: 'Banheiro', re: /\b(banheiro|privada|vaso sanitario|fezes|xixi)/,
    psy: 'Banheiros falam de privacidade e de eliminar o que não serve. Não achar um banheiro pode indicar dificuldade de colocar para fora o que sente.',
    spi: 'É um sonho de limpeza. Soltar o que pesa é parte do caminho espiritual.',
    q: 'O que você precisa colocar para fora?' },
  { k: 'casamento', name: 'Casamento', re: /\b(casamento|casar|noiva|noivo|alianca|altar)/,
    psy: 'Para Jung, o casamento em sonho é a união de opostos dentro de você: razão e emoção, feminino e masculino. Pode anunciar integração.',
    spi: 'É símbolo de aliança e compromisso. Com quem, ou com o quê, você está pronto para se comprometer?',
    q: 'Que partes de você estão pedindo para se unir?' },
  { k: 'traicao', name: 'Traição', re: /\b(trai|traicao|traindo|chifre|infiel)/,
    psy: 'Sonhos de traição costumam falar de insegurança e de medo de abandono, ou de uma parte sua que sente que está traindo os próprios valores.',
    spi: 'Pode ser um convite a ser fiel a si mesmo antes de tudo.',
    q: 'Onde você sente que não está sendo fiel a si?' },
  { k: 'crianca', name: 'Criança', re: /\b(crianca|menino|menina|infancia|filho|filha)/,
    psy: 'A criança é o arquétipo do novo e também a sua criança interior: necessidades antigas, espontaneidade, feridas da infância.',
    spi: 'A criança lembra pureza e começo. A alma pede leveza, brincadeira e confiança.',
    q: 'O que a criança que você foi precisa ouvir hoje?' },
  { k: 'montanha', name: 'Montanha', re: /\b(montanha|morro|serra|pico|trilha|escalar)/,
    psy: 'A montanha fala de metas e de esforço. Escalar costuma mostrar um desafio que você está enfrentando passo a passo.',
    spi: 'Muitos caminhos, uma mesma montanha. Subir é aproximar-se do sagrado e de uma visão mais ampla.',
    q: 'Qual é a montanha que você está subindo agora?' },
  { k: 'luz', name: 'Luz', re: /\b(luz|brilh|iluminad|sol\b|estrela|clarao)/,
    psy: 'A luz representa consciência: algo que estava no escuro está se tornando claro para você.',
    spi: 'Luz em sonho é sinal de presença divina, proteção e clareza. Um bom presságio para o seu caminho.',
    q: 'O que ficou mais claro para você nos últimos dias?' },
  { k: 'escuro', name: 'Escuridão', re: /\b(escur|breu|sombra|apagad)/,
    psy: 'O escuro é o território do desconhecido e da sombra. Não é mau: é onde estão partes suas que ainda não foram vistas.',
    spi: 'Toda noite antecede um amanhecer. O escuro do sonho pede fé e paciência.',
    q: 'O que em você ainda está no escuro e pede um pouco de luz?' },
  { k: 'espelho', name: 'Espelho', re: /\b(espelho|reflexo)/,
    psy: 'O espelho fala da autoimagem. Um reflexo estranho pode mostrar uma parte sua que você ainda não reconhece.',
    spi: 'O espelho convida ao autoconhecimento: olhar para si com verdade e compaixão.',
    q: 'Como você tem se enxergado ultimamente?' },
  { k: 'peixe', name: 'Peixe', re: /\b(peixe|pescar|pesca)/,
    psy: 'Peixes são conteúdos que emergem do inconsciente. Pescar pode indicar que você está trazendo à tona algo importante.',
    spi: 'O peixe é símbolo de fé, fartura e fecundidade em várias tradições.',
    q: 'Que ideia ou sentimento está emergindo em você?' },
  { k: 'aranha', name: 'Aranha', re: /\b(aranha|teia)/,
    psy: 'A aranha pode representar uma figura que prende ou controla, ou a sensação de estar enredado em uma situação.',
    spi: 'A aranha é tecelã do destino: lembra que você também tece a sua história, fio por fio.',
    q: 'Em que teia você se sente preso, e qual fio pode soltar?' },
  { k: 'cavalo', name: 'Cavalo', re: /\b(cavalo|egua|potro|cavalgar)/,
    psy: 'O cavalo é energia instintiva e vitalidade. Controlá-lo ou não fala da relação entre vontade e impulso.',
    spi: 'O cavalo é liberdade e força que leva adiante. Um sinal de energia disponível para seguir.',
    q: 'Para onde você quer direcionar sua força?' },
  { k: 'arvore', name: 'Árvore ou floresta', re: /\b(arvore|floresta|mata\b|bosque|raiz|raizes|folhas)/,
    psy: 'A árvore é imagem do crescimento da personalidade. A floresta, para Jung, é o inconsciente: rico e às vezes assustador.',
    spi: 'A árvore une raízes e céu. Um convite a se enraizar para poder crescer.',
    q: 'Que raízes sustentam você hoje?' },
  { k: 'ponte', name: 'Ponte', re: /\b(ponte|atravess|travessia)/,
    psy: 'A ponte fala de transição entre duas fases ou dois estados emocionais.',
    spi: 'Atravessar uma ponte é passar de um ciclo a outro. Confie na travessia.',
    q: 'De qual margem para qual margem você está passando?' },
  { k: 'tempestade', name: 'Tempestade', re: /\b(tempestade|trovao|raio|furacao|vento forte|temporal)/,
    psy: 'Tempestades expressam tensão emocional acumulada, conflitos que pedem descarga.',
    spi: 'Depois da tempestade o ar fica limpo. O sonho pode anunciar uma limpeza necessária.',
    q: 'Que tensão está pedindo para ser liberada?' },
  { k: 'telefone', name: 'Telefone', re: /\b(telefone|celular|ligacao|mensagem)/,
    psy: 'Telefones falam de comunicação: algo que precisa ser dito, ou uma conexão difícil com alguém.',
    spi: 'Uma mensagem tentando chegar até você. Esteja atento aos sinais dos próximos dias.',
    q: 'Que conversa está esperando para acontecer?' },
  { k: 'ataque', name: 'Briga ou ataque', re: /\b(briga|brigando|ataca|atacad|bater|soco|arma|tiro|assalt)/,
    psy: 'Conflitos em sonho mostram agressividade reprimida ou conflitos internos entre desejos opostos.',
    spi: 'Pede proteção e paz. Cuide da sua energia e do que você deixa entrar.',
    q: 'Que conflito, dentro ou fora de você, pede uma trégua?' }
];

const EMO = [
  { re: /\b(medo|panico|pavor|assust|angusti|desesper|terror)/, tone: 'tense' },
  { re: /\b(triste|chorei|chorando|choro|saudade)/, tone: 'sad' },
  { re: /\b(feliz|alegr|paz\b|leve|lindo|amor|abraco|sorri)/, tone: 'light' }
];

const WAKE_PSY = {
  'Em paz': 'Você acordou em paz: sinal de que o sonho elaborou algo com sucesso. Freud diria que ele cumpriu a sua função de guardar o sono realizando um desejo.',
  'Leve': 'Você acordou leve. Muitas vezes o sonho resolve em imagens o que a mente acordada ainda não conseguiu organizar.',
  'Emocionado': 'Você acordou emocionado. Na psicanálise, o afeto é a parte mais honesta do sonho: as imagens se disfarçam, a emoção não.',
  'Inquieto': 'Você acordou inquieto. A emoção ao acordar é a melhor pista: ela aponta para uma tensão real que as imagens tentaram traduzir.',
  'Confuso': 'Você acordou confuso. Freud chamava isso de condensação: o sonho junta várias ideias numa só imagem. Vale separar as partes com calma.'
};
const WAKE_SPI = {
  'Em paz': 'A paz ao acordar é sinal de alinhamento. Receba o sonho como bênção.',
  'Leve': 'A leveza indica que algo foi liberado durante a noite.',
  'Emocionado': 'A emoção mostra que o sonho tocou algo verdadeiro na sua alma.',
  'Inquieto': 'A inquietação é um convite a cuidar da sua energia hoje: silêncio, oração ou respiração.',
  'Confuso': 'A confusão pede tempo. Anote o que lembrar e deixe o sentido se revelar nos próximos dias.'
};

export function readDream(dream) {
  const txt = norm(`${dream.title || ''} ${dream.text || ''}`);
  // na ordem em que aparecem no relato
  const found = SYMBOLS.map((s) => ({ s, i: txt.search(s.re) })).filter((x) => x.i >= 0).sort((a, b) => a.i - b.i).map((x) => x.s);
  const tone = (EMO.find((e) => e.re.test(txt)) || {}).tone || null;
  const top = found.slice(0, 3);
  const psyIntro = WAKE_PSY[dream.wake] || (tone === 'tense'
    ? 'O sonho trouxe medo ou angústia. Na psicanálise, a angústia costuma sinalizar um desejo ou um conflito que chegou perto demais da consciência.'
    : tone === 'sad' ? 'O sonho trouxe tristeza. Pode ser parte de um luto, grande ou pequeno, que está sendo elaborado.'
    : tone === 'light' ? 'O sonho trouxe sensações boas. Freud diria que ele realiza um desejo; Jung, que mostra um potencial seu.'
    : 'Freud chamava o sonho de via régia para o inconsciente: ele junta restos do dia com desejos que não encontraram lugar.');
  const spiIntro = WAKE_SPI[dream.wake] || (tone === 'tense'
    ? 'Sonhos difíceis também trazem mensagens. Muitas tradições pedem proteção e oração antes de dormir.'
    : 'Muitas tradições veem o sonho como uma conversa da alma com você.');
  const psyClose = found.length
    ? 'Para Jung, todo sonho compensa algo da vida desperta. Pergunte-se que atitude sua ele está equilibrando.'
    : 'Repare em quem aparecia, onde você estava e o que queria no sonho: isso costuma apontar o tema. Anote detalhes como lugares, pessoas, cores e animais para uma leitura mais rica.';
  const spiClose = found.length
    ? 'Guarde a imagem que mais ficou e leve-a como intenção para o dia.'
    : 'Leve a sensação principal do sonho como intenção para o dia e observe os sinais que aparecerem.';
  return {
    symbols: top,
    more: found.length - top.length,
    psy: { intro: psyIntro, close: psyClose },
    spi: { intro: spiIntro, close: spiClose },
    question: top.length ? top[0].q : 'Qual foi a sensação mais forte do sonho, e onde ela aparece na sua vida desperta?'
  };
}

// Símbolos que se repetem entre todos os sonhos registrados.
export function recurring(dreams) {
  const c = {};
  dreams.forEach((d) => {
    const txt = norm(`${d.title || ''} ${d.text || ''}`);
    SYMBOLS.forEach((s) => { if (s.re.test(txt)) c[s.k] = (c[s.k] || 0) + 1; });
  });
  return SYMBOLS.filter((s) => c[s.k] > 1).map((s) => ({ name: s.name, n: c[s.k] })).sort((a, b) => b.n - a.n).slice(0, 5);
}
