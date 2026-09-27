// Dica do dia e da semana: combina Lua (fase e signo), numerologia (dia e mês pessoal)
// e horóscopo (trânsitos sobre o mapa natal). Tradições simbólicas, como convite.
import { phaseOf, personalDay, parseBirth, dayAdvice, nextFavorable, PD_TEXT } from './cosmos.js';
import { SIGNS_EM, HOUSE, PNAME, PNATAL, natal, skyAt, aspectOf } from './sky.js';
import { WD_FULL } from './dates.js';

const MOON_SIGN = ['coragem e impulso', 'conforto, calma e prazeres simples', 'curiosidade e conversa', 'sensibilidade e vontade de casa', 'vontade de brilhar e ser visto', 'vontade de organizar e cuidar dos detalhes', 'busca de harmonia e companhia', 'emoções intensas e profundas', 'otimismo e vontade de expandir', 'foco, seriedade e responsabilidade', 'desejo de liberdade e ideias novas', 'intuição, sonho e empatia'];

const PD_TITLE = { 1: 'Comece algo pequeno', 2: 'Escute antes de responder', 3: 'Diga o que você sente', 4: 'Organize uma coisa só', 5: 'Mude um detalhe da rotina', 6: 'Cuide de alguém, e de você', 7: 'Reserve um tempo de silêncio', 8: 'Resolva uma pendência prática', 9: 'Encerre o que já deu' };
const PD_DO = { 1: 'Dê o primeiro passo em algo que você vem adiando.', 2: 'Peça uma opinião e ouça até o fim antes de responder.', 3: 'Mande aquela mensagem ou mostre algo que você criou.', 4: 'Escolha uma tarefa e termine do começo ao fim.', 5: 'Troque o caminho, o horário ou o lugar de sempre.', 6: 'Faça um gesto de cuidado por alguém e reserve outro para você.', 7: 'Separe 15 minutos para silêncio, leitura ou meditação.', 8: 'Resolva uma conta, um contrato ou uma negociação.', 9: 'Doe, perdoe ou encerre algo que já cumpriu seu papel.' };
const PH_TITLE = { intencao: 'Plante uma intenção', agir: 'Dê um passo concreto', ajustar: 'Ajuste e persista', decidir: 'Decida com clareza', partilhar: 'Compartilhe e agradeça', soltar: 'Solte um peso', descansar: 'Desacelere' };
const PH_DO = { intencao: 'Escreva uma intenção para este ciclo em uma frase.', agir: 'Faça hoje a primeira ação do que você quer ver crescer.', ajustar: 'Revise o que já começou e corrija um detalhe.', decidir: 'Tome aquela decisão que já está madura.', partilhar: 'Agradeça a alguém ou ensine o que aprendeu.', soltar: 'Tire da sua lista uma coisa que não serve mais.', descansar: 'Diminua o ritmo e durma mais cedo.' };
const PM_TEXT = { 1: 'mês de começos', 2: 'mês de parcerias e paciência', 3: 'mês de expressão e encontros', 4: 'mês de organizar a base', 5: 'mês de mudanças e movimento', 6: 'mês de família e cuidado', 7: 'mês de recolhimento e estudo', 8: 'mês de colheita e negócios', 9: 'mês de encerramentos' };

const ASP_TXT = {
  soft: { sun: 'energia e confiança fluem a seu favor', moon: 'emoções mais leves e fáceis de acolher', mercury: 'conversas e ideias encontram caminho', venus: 'afeto, beleza e acordos fluem', mars: 'coragem na medida certa para agir' },
  hard: { sun: 'um atrito que pede ajuste de rota', moon: 'emoções à flor da pele: vá com calma', mercury: 'risco de ruído: releia antes de enviar', venus: 'desejos e acordos pedem mais diálogo', mars: 'pressa e irritação: canalize em movimento' }
};
const WEEK_TITLE = {
  sun: ['Semana de brilhar', 'Semana de ajustar a rota'],
  mercury: ['Semana boa para conversar e fechar acordos', 'Semana de revisar antes de enviar'],
  venus: ['Semana boa para aproximar', 'Semana de cuidar dos acordos afetivos'],
  mars: ['Semana de coragem e iniciativa', 'Semana de canalizar a pressa']
};
const WEEK_PHASE = { 0: 'Semana de Lua nova: plante intenções', 2: 'Semana de quarto crescente: hora de agir', 4: 'Semana de Lua cheia: colher e decidir', 6: 'Semana de quarto minguante: soltar e revisar' };
const MAIN_PHASE = { 0: 'Lua nova', 2: 'Quarto crescente', 4: 'Lua cheia', 6: 'Quarto minguante' };
const natureOf = (k, n) => (n !== 'mix' ? n : (k === 'mars' ? 'hard' : 'soft'));

function personalMonth(profile, date) {
  const b = parseBirth(profile); if (!b) return null;
  const red = (n) => { while (n > 9) n = String(n).split('').reduce((a, c) => a + +c, 0); return n; };
  return red(red(red(b.d) + red(b.mo) + red(date.getFullYear())) + red(date.getMonth() + 1));
}
const sdate = (d) => `${WD_FULL[d.getDay()].split('-')[0].toLowerCase()} ${d.getDate()}/${d.getMonth() + 1}`;

export function dayTip(date, profile) {
  const ph = phaseOf(date), pd = personalDay(profile, date), n = natal(profile);
  const sky = skyAt(date), mSign = Math.floor(sky.moon / 30);
  const why = [{ k: 'Lua', v: `${ph.name} ${SIGNS_EM[mSign]}`, t: `${ph.text} A Lua ${SIGNS_EM[mSign]} traz ${MOON_SIGN[mSign]}.` }];
  let line;
  if (n) {
    const house = ((mSign - n.ascSign + 12) % 12) + 1;
    line = `Com a Lua na sua casa ${house}, o coração do dia está em ${HOUSE[house - 1]}.`;
    why.push({ k: 'Numerologia', v: `Dia pessoal ${pd}`, t: `No seu mapa numerológico, hoje é ${PD_TEXT[pd]}.` });
    let best = null;
    ['moon', 'sun', 'mercury', 'venus', 'mars'].forEach((tk) => ['sun', 'moon', 'venus', 'asc'].forEach((nk) => {
      if (tk === 'moon' && nk === 'moon') return;
      const lim = tk === 'moon' ? 4 : 2.5, a = aspectOf(sky[tk], n[nk], lim);
      if (a && (!best || a.orb / lim < best.score)) best = { tk, nk, a, score: a.orb / lim };
    }));
    const hz = { k: 'Horóscopo', v: `Lua na casa ${house}`, t: `Pelo seu mapa, a Lua de hoje ilumina ${HOUSE[house - 1]}.` };
    if (best) {
      const nat = natureOf(best.tk, best.a.nature);
      hz.t += ` ${PNAME[best.tk][0].toUpperCase() + PNAME[best.tk].slice(1)} faz ${best.a.name} com ${PNATAL[best.nk]}: ${ASP_TXT[nat][best.tk]}.`;
    }
    why.push(hz);
  } else {
    line = `A Lua ${SIGNS_EM[mSign]} traz ${MOON_SIGN[mSign]}.`;
  }
  return {
    title: pd ? PD_TITLE[pd] : PH_TITLE[ph.mode],
    act: pd ? PD_DO[pd] : PH_DO[ph.mode],
    line, why, personal: !!n
  };
}

export function weekTip(date, profile) {
  const n = natal(profile), pm = personalMonth(profile, date);
  const days = [];
  for (let i = 0; i < 7; i++) { const d = new Date(date); d.setDate(d.getDate() + i); d.setHours(12, 0, 0, 0); days.push(d); }
  // fases principais que começam na semana
  let event = null;
  for (let i = 1; i < 7 && !event; i++) {
    const a = phaseOf(days[i - 1]).idx, b = phaseOf(days[i]).idx;
    if (a !== b && MAIN_PHASE[b] != null) event = { idx: b, date: days[i] };
  }
  // trânsito mais exato da semana sobre o mapa
  let best = null;
  if (n) {
    days.forEach((d) => {
      const s = skyAt(d);
      ['sun', 'mercury', 'venus', 'mars'].forEach((tk) => ['sun', 'moon', 'venus', 'asc'].forEach((nk) => {
        if (tk === nk) return;
        const a = aspectOf(s[tk], n[nk], 2);
        if (a && (!best || a.orb < best.a.orb)) best = { tk, nk, a, date: d };
      }));
    });
  }
  const agir = nextFavorable('agir', date, profile, 1, 7)[0];
  const decidir = nextFavorable('decidir', date, profile, 1, 7)[0];
  const ph = phaseOf(date);
  let title, line;
  if (best) {
    const nat = natureOf(best.tk, best.a.nature);
    title = WEEK_TITLE[best.tk][nat === 'soft' ? 0 : 1];
    line = `${PNAME[best.tk][0].toUpperCase() + PNAME[best.tk].slice(1)} faz ${best.a.name} com ${PNATAL[best.nk]}: ${ASP_TXT[nat][best.tk]}. Mais forte ${sdate(best.date)}.`;
  } else if (event) {
    title = WEEK_PHASE[event.idx];
    line = `${MAIN_PHASE[event.idx]} a partir de ${sdate(event.date)}. ${phaseOf(event.date).text}`;
  } else {
    title = PH_TITLE[ph.mode];
    line = ph.text;
  }
  const marks = [];
  if (agir) marks.push({ k: 'Agir', v: sdate(agir.date), c: '#8fe3b0' });
  if (decidir) marks.push({ k: 'Decidir', v: sdate(decidir.date), c: '#c9a8ff' });
  if (!agir && !decidir) { const r = nextFavorable('descansar', date, profile, 1, 7)[0]; if (r) marks.push({ k: 'Descansar', v: sdate(r.date), c: '#a8d8ff' }); }
  if (event) marks.push({ k: MAIN_PHASE[event.idx], v: sdate(event.date), c: '#f4efe0' });
  const why = [{ k: 'Lua', v: event ? `${MAIN_PHASE[event.idx]} ${sdate(event.date)}` : ph.name, t: event ? phaseOf(event.date).text : ph.text }];
  if (pm) why.push({ k: 'Numerologia', v: `Mês pessoal ${pm}`, t: `Você está num ${PM_TEXT[pm]}: a semana é um capítulo dele.` });
  if (best) why.push({ k: 'Horóscopo', v: `${PNAME[best.tk].replace(/^(o|a) /, '')} e ${PNATAL[best.nk]}`, t: line });
  return { title, line, marks, why, personal: !!n };
}

export { dayAdvice };
