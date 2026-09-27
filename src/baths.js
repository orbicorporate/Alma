// Banhos de ervas: tradição popular brasileira e fitoterapia de uso externo.
// Rituais de cuidado e intenção. Não substituem tratamento de saúde.

export const TAGS = [
  { k: 'limpeza', label: 'Limpeza', c: '#a8d8ff' },
  { k: 'protecao', label: 'Proteção', c: '#b9a6ff' },
  { k: 'amor', label: 'Amor', c: '#f5a8c8' },
  { k: 'autoamor', label: 'Autoamor', c: '#ffc2d9' },
  { k: 'prosperidade', label: 'Prosperidade', c: '#f3d98b' },
  { k: 'caminhos', label: 'Abrir caminhos', c: '#ffb38a' },
  { k: 'calma', label: 'Calma', c: '#8fe3b0' },
  { k: 'sono', label: 'Sono', c: '#9fb4ff' },
  { k: 'energia', label: 'Energia', c: '#ffcf7a' },
  { k: 'foco', label: 'Foco', c: '#c9e7a0' },
  { k: 'cura', label: 'Cura emocional', c: '#e2b8ff' },
  { k: 'intuicao', label: 'Intuição', c: '#d7c9ff' }
];

// Grupos de Lua usados pela tradição dos banhos.
export const MOONS = [
  { k: 'nova', label: 'Nova', idx: [0], text: 'Lua nova: tempo de plantar. Banhos de intenção, de recomeço e de abrir caminhos.' },
  { k: 'crescente', label: 'Crescente', idx: [1, 2, 3], text: 'Lua crescente: tempo de atrair e fazer crescer. Amor, prosperidade e energia.' },
  { k: 'cheia', label: 'Cheia', idx: [4], text: 'Lua cheia: tempo de potencializar e agradecer. Intuição, amor e celebração.' },
  { k: 'minguante', label: 'Minguante', idx: [5, 6, 7], text: 'Lua minguante: tempo de limpar e soltar. Descarrego, proteção e cura.' }
];
export const moonGroup = (phaseIdx) => MOONS.find((m) => m.idx.includes(phaseIdx));

const BASE = 'Ferva a água, desligue o fogo, junte as ervas e tampe. Deixe descansar por 10 a 15 minutos.';

export const BATHS = [
  { id: 'sal-alecrim', name: 'Sal grosso e alecrim', tags: ['limpeza', 'protecao'], moons: ['minguante'], c: '#a8d8ff',
    intent: 'Tirar o peso de um dia difícil e renovar a energia.',
    items: ['2 litros de água', '2 colheres (sopa) de sal grosso', '1 ramo de alecrim fresco ou 2 colheres de alecrim seco'],
    steps: [BASE, 'Coe e misture o sal até dissolver. Espere amornar.', 'Depois do banho de higiene, jogue do pescoço para baixo, devagar.', 'Enxague com água limpa se a pele for sensível.'],
    word: 'Eu solto o que não é meu. Fico com o que me fortalece.',
    care: 'O sal resseca a pele: hidrate depois e não use sobre feridas. Uma vez por semana é suficiente.' },
  { id: 'arruda-guine', name: 'Arruda e guiné', tags: ['limpeza', 'protecao'], moons: ['minguante'], c: '#b9a6ff',
    intent: 'Proteção e limpeza de ambientes pesados, na tradição do descarrego.',
    items: ['2 litros de água', '1 ramo pequeno de arruda', '1 ramo pequeno de guiné'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo, mentalizando proteção.', 'Descarte as ervas na terra ou num vaso.'],
    word: 'Estou protegido. Só o bem me alcança.',
    care: 'Faça à noite: a arruda pode manchar ou queimar a pele exposta ao sol no dia seguinte. Não use na gestação. Guiné é tóxica se ingerida. Uso somente externo.' },
  { id: 'rosa-canela', name: 'Rosas vermelhas e canela em pau', tags: ['amor'], moons: ['crescente', 'cheia'], c: '#f5a8c8',
    intent: 'Atrair amor, aquecer uma relação e acender o encanto.',
    items: ['2 litros de água', 'Pétalas de 2 rosas vermelhas', '1 canela em pau'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo pensando no amor que você quer viver.', 'Coloque as pétalas num jardim ou num vaso.'],
    word: 'Eu me abro para amar e ser amado com leveza.',
    care: 'Canela pode irritar peles sensíveis: use só o pau, em pouca quantidade, e teste numa pequena área antes.' },
  { id: 'rosa-mel', name: 'Rosa, mel e camomila', tags: ['autoamor', 'amor', 'calma'], moons: ['crescente', 'cheia'], c: '#ffc2d9',
    intent: 'Se olhar com carinho, fortalecer a autoestima e suavizar a autocrítica.',
    items: ['2 litros de água', 'Pétalas de 2 rosas cor-de-rosa', '1 colher (sopa) de camomila', '1 colher (chá) de mel'],
    steps: [BASE, 'Coe, misture o mel e espere amornar.', 'Jogue do pescoço para baixo e diga uma qualidade sua em voz alta.', 'Enxague se sentir a pele grudenta.'],
    word: 'Eu sou suficiente. Eu mereço o meu próprio cuidado.',
    care: 'Quem tem alergia a plantas da família das margaridas (como a camomila) deve evitar.' },
  { id: 'louro-cravo', name: 'Louro, cravo e casca de laranja', tags: ['prosperidade', 'caminhos'], moons: ['crescente'], c: '#f3d98b',
    intent: 'Atrair prosperidade, boas oportunidades e reconhecimento no trabalho.',
    items: ['2 litros de água', '5 folhas de louro', '3 cravos-da-índia', 'Casca de 1 laranja'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo imaginando portas se abrindo.', 'Guarde uma folha de louro seca na carteira, como lembrete da intenção.'],
    word: 'Eu recebo com gratidão a abundância que chega.',
    care: 'Cravo e casca de laranja podem irritar peles sensíveis. Evite sol logo depois do banho com cascas cítricas.' },
  { id: 'manjericao-hortela', name: 'Manjericão e hortelã', tags: ['energia', 'foco', 'caminhos'], moons: ['crescente', 'nova'], c: '#c9e7a0',
    intent: 'Despertar disposição e clareza para começar algo novo.',
    items: ['2 litros de água', '1 punhado de manjericão fresco', '1 punhado de hortelã fresca'],
    steps: ['Macere as folhas com as mãos em água fria ou morna, sem ferver, por alguns minutos.', 'Coe.', 'Jogue do pescoço para baixo pela manhã.', 'Comece o dia com uma tarefa importante.'],
    word: 'Minha mente está clara e meu corpo, disposto.',
    care: 'Refrescante: evite em dias frios se você sente frio fácil. Uso externo.' },
  { id: 'camomila-melissa', name: 'Camomila e melissa', tags: ['calma', 'sono', 'cura'], moons: ['minguante', 'nova'], c: '#8fe3b0',
    intent: 'Acalmar a ansiedade e preparar o corpo para descansar.',
    items: ['2 litros de água', '2 colheres (sopa) de camomila', '2 colheres (sopa) de melissa (erva-cidreira)'],
    steps: [BASE, 'Coe e espere ficar morno.', 'Tome à noite, jogando do pescoço para baixo com respirações lentas.', 'Evite telas depois do banho.'],
    word: 'Eu posso descansar. O mundo continua enquanto eu durmo.',
    care: 'Evite se tiver alergia a camomila.' },
  { id: 'lavanda', name: 'Lavanda para dormir', tags: ['sono', 'calma'], moons: ['nova', 'crescente', 'cheia', 'minguante'], c: '#9fb4ff',
    intent: 'Desacelerar a mente e ter um sono mais tranquilo. Serve em qualquer Lua.',
    items: ['2 litros de água', '2 colheres (sopa) de flores de lavanda (alfazema) secas'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo antes de dormir.', 'Deixe um ramo de lavanda perto do travesseiro.'],
    word: 'Eu solto o dia. Minha noite é de paz.',
    care: 'Suave e seguro para a maioria das pessoas. Teste se tiver pele sensível.' },
  { id: 'rosa-branca', name: 'Rosas brancas e alfazema', tags: ['cura', 'calma', 'autoamor'], moons: ['cheia', 'minguante'], c: '#e2b8ff',
    intent: 'Acolher uma tristeza, uma perda ou um término.',
    items: ['2 litros de água', 'Pétalas de 2 rosas brancas', '1 colher (sopa) de alfazema'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo e permita-se sentir.', 'Escreva no diário o que você quer deixar ir.'],
    word: 'Eu me acolho. A dor passa e o amor fica.',
    care: 'Se a tristeza persistir por semanas, converse com um profissional de saúde mental.' },
  { id: 'girassol', name: 'Girassol e capim-limão', tags: ['energia', 'prosperidade', 'autoamor'], moons: ['crescente', 'cheia'], c: '#ffcf7a',
    intent: 'Trazer alegria, brilho pessoal e vontade de viver.',
    items: ['2 litros de água', 'Pétalas de 1 girassol (ou 2 colheres de calêndula)', '3 folhas de capim-limão'],
    steps: [BASE, 'Coe e espere amornar.', 'Tome pela manhã, jogando do pescoço para baixo.', 'Vista uma cor alegre no dia.'],
    word: 'Eu brilho do meu jeito.',
    care: 'Faça um teste de pele antes, especialmente com calêndula.' },
  { id: 'eucalipto', name: 'Eucalipto e sal marinho', tags: ['limpeza', 'energia'], moons: ['minguante'], c: '#a8e0e0',
    intent: 'Limpar o cansaço acumulado e respirar melhor.',
    items: ['2 litros de água', '5 folhas de eucalipto', '1 colher (sopa) de sal marinho'],
    steps: [BASE, 'Respire o vapor por um minuto, com os olhos fechados.', 'Coe, dissolva o sal e espere amornar.', 'Jogue do pescoço para baixo.'],
    word: 'Eu renovo o ar e a energia que me move.',
    care: 'Não use em crianças pequenas. Evite o contato com olhos e mucosas.' },
  { id: 'louro-erva-doce', name: 'Louro e erva-doce da Lua nova', tags: ['caminhos', 'intuicao'], moons: ['nova'], c: '#ffb38a',
    intent: 'Plantar uma intenção para o novo ciclo.',
    items: ['2 litros de água', '3 folhas de louro', '1 colher (sopa) de erva-doce'],
    steps: ['Escreva sua intenção num papel antes do banho.', BASE, 'Coe, espere amornar e jogue do pescoço para baixo, lendo a intenção.', 'Guarde o papel até a próxima Lua cheia.'],
    word: 'Eu planto hoje o que quero colher.',
    care: 'Suave. Teste se tiver pele sensível.' },
  { id: 'lua-cheia', name: 'Água de Lua cheia e pétalas brancas', tags: ['intuicao', 'amor', 'cura'], moons: ['cheia'], c: '#f4efe0',
    intent: 'Potencializar a intuição e agradecer o ciclo.',
    items: ['2 litros de água filtrada', 'Pétalas de flores brancas', '1 colher (sopa) de alfazema'],
    steps: ['Deixe a água num recipiente de vidro, tampado com um pano, sob a luz da Lua cheia.', 'No dia seguinte, aqueça a água, junte as flores e a alfazema e deixe descansar 10 minutos.', 'Coe e jogue do pescoço para baixo, agradecendo.', 'Anote um sonho ou uma intuição nos dias seguintes.'],
    word: 'Eu confio no que sinto. Obrigado por este ciclo.',
    care: 'Aqueça a água antes do uso. Uso externo.' },
  { id: 'boldo-alecrim', name: 'Boldo e alecrim para clareza', tags: ['foco', 'limpeza'], moons: ['minguante', 'nova'], c: '#b8e0a0',
    intent: 'Limpar a confusão mental antes de uma decisão.',
    items: ['2 litros de água', '3 folhas de boldo', '1 ramo de alecrim'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo com a pergunta que você precisa responder em mente.', 'Anote a primeira ideia que vier depois.'],
    word: 'Eu vejo com clareza o próximo passo.',
    care: 'Não use na gestação. Uso somente externo.' },
  { id: 'hibisco', name: 'Hibisco e rosa para autoestima', tags: ['autoamor', 'amor', 'energia'], moons: ['crescente'], c: '#ff8fb0',
    intent: 'Se sentir bonito, confiante e magnético.',
    items: ['2 litros de água', '1 colher (sopa) de flor de hibisco seca', 'Pétalas de 1 rosa'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo olhando-se no espelho com carinho.', 'Enxague se a cor manchar toalhas claras.'],
    word: 'Eu gosto de quem eu sou.',
    care: 'O hibisco tinge: cuidado com toalhas e roupas claras.' },
  { id: 'salvia-louro', name: 'Sálvia, louro e alecrim', tags: ['protecao', 'limpeza', 'foco'], moons: ['minguante', 'nova'], c: '#c6b8ff',
    intent: 'Fechar o corpo depois de ambientes cheios ou conversas pesadas.',
    items: ['2 litros de água', '5 folhas de sálvia', '3 folhas de louro', '1 ramo de alecrim'],
    steps: [BASE, 'Coe e espere amornar.', 'Jogue do pescoço para baixo mentalizando um escudo de luz.', 'Beba um copo de água e descanse.'],
    word: 'Meu campo está protegido e em paz.',
    care: 'Evite na gestação e na amamentação. Uso externo.' }
];

// Ordena pela intenção escolhida e pela Lua; nunca some com um banho, só explica quando é melhor.
export function searchBaths({ tags = [], moon = null, q = '' }) {
  const nq = q.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const hay = (b) => `${b.name} ${b.intent} ${b.items.join(' ')} ${b.tags.join(' ')}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return BATHS
    .filter((b) => (!tags.length || tags.some((t) => b.tags.includes(t))) && (!nq || hay(b).includes(nq)))
    .map((b) => ({ b, fit: !moon || b.moons.includes(moon), hits: tags.filter((t) => b.tags.includes(t)).length }))
    .sort((x, y) => (y.fit - x.fit) || (y.hits - x.hits));
}
