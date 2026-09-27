// Frases de abertura da Alma: a primeira é o padrão; as outras se revezam.
export const PH = [
      { lines: ['Muitos caminhos,', 'uma mesma montanha.'], mid: 'Cada tradição vê um lado dela.', gold: 'Suba com o coração aberto.' },
      { lines: ['Religiões e filosofias', 'não devem dividir,', 'e sim aconselhar.'], mid: 'Tudo importa.', gold: 'Flua com sabedoria e leve a luz.' },
      { lines: ['Nenhuma voz', 'guarda a luz inteira.'], mid: 'Juntas, iluminam mais.', gold: 'Escute todas, escolha com amor.' },
      { lines: ['A verdade não cabe', 'em uma única história.'], mid: 'Ela cabe na escuta.', gold: 'Abra espaço para o outro.' },
      { lines: ['O que nos une', 'é mais antigo', 'do que o que nos separa.'], mid: 'A compaixão fala muitas línguas.', gold: 'Aprenda todas com o coração.' },
      { lines: ['Rios diferentes,', 'o mesmo mar.'], mid: 'Toda sabedoria deságua no amor.', gold: 'Deixe a sua fluir.' },
      { lines: ['Aprender com a fé', 'do outro não é trair', 'a sua.'], mid: 'É fazer ela crescer.', gold: 'Cresça sem muros.' },
      { lines: ['A luz não pertence', 'a uma só janela.'], mid: 'Ela entra por todas.', gold: 'Abra as suas.' }
    ];

// Frase do dia: muda a cada dia, sempre a mesma para a data.
export function phraseOfDay(date = new Date()) {
  const k = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 864e5);
  return PH[k % PH.length];
}
