# Alma, sistema visual

Leitura: app mobile de reflexão e autoconhecimento para quem busca calma e direção. Linguagem leve, moderna e luminosa, com vidro e luz (pedido original: "uma alma leve", fonte fina e limpa, muita animação com propósito). Redesign que preserva a marca: mesma esfera, mesmo céu violeta, mesmas cores por área, só que mais vivo, mais legível e mais enxuto.

Mostradores: variação 5, movimento 6, densidade 4.

## Cor (tokens em `src/index.css`)

| Token | Valor | Uso |
|---|---|---|
| `--night` | `#120E2C` | fundo base de todas as telas |
| `--surface` | `rgba(255,255,255,.07)` sobre o fundo | cartões |
| `--surface-2` | `rgba(255,255,255,.11)` | cartão em destaque, controle ativo |
| `--line` | `rgba(255,255,255,.14)` | bordas |
| `--ink` | `#F6F3FF` | texto principal (17:1) |
| `--ink-2` | `#CFC8EE` | texto de apoio (10:1) |
| `--ink-3` | `#A49CD0` | legendas e metadados (6:1). Nada abaixo disso. |
| `--gold` | `#F3D98B` | ação principal (botão dourado, texto `#1A1408`) |
| `--lilac` | `#C9B8FF` | Alma, Perguntar, Céu |
| `--sky` | `#8EC8FF` | Diário |
| `--mint` | `#8FE3B0` | planos e passos |
| `--rose` | `#F5A8C8` | tarô, post-its |
| `--peach` | `#FFB38A` | decisões |

Regras:
- Proibido texto em `rgba(244,241,234,.45 a .6)`: use `--ink-2` ou `--ink-3`.
- Cada área tem uma cor de destaque e só ela: Diário azul-céu, Céu lilás, planos menta. O dourado é reservado para a ação principal da tela (uma por tela).
- Cartão com cor: fundo `color-mix(in srgb, var(--c) 12%, transparent)` com borda `color-mix(in srgb, var(--c) 32%, transparent)`. Assim os cartões deixam de ser todos iguais e cinzas.
- Brilho só onde há significado (o item ativo, o passo de hoje). Nada de brilho em todo cartão.

## Tipografia

Manrope (marca). Pesos 300 para títulos e 400/500 para interface. Sem fonte nova.

| Papel | Tamanho / peso / entrelinha |
|---|---|
| Título de tela | 28px / 300 / 1.15, tracking -0.01em |
| Título de seção | 19px / 500 / 1.3 |
| Título de cartão | 17px / 500 / 1.35 |
| Corpo | 16.5px / 300 / 1.5 |
| Legenda | 14.5px / 400 / 1.4, cor `--ink-3` |

Regras:
- Fim dos rótulos em CAIXA ALTA com letras espaçadas acima de tudo. Rótulo de seção vira frase normal em 15px/500 na cor da área. No máximo um rótulo por bloco, e só quando ajuda a entender.
- Nada de ponto do meio em sequência ("a · b · c"); no máximo um por linha.
- Texto nunca menor que 14px.

## Forma e espaço

- Raio: cartões 22px, cartões pequenos e campos 16px, controles e chips em pílula. Sempre esse trio.
- Espaço base 4px (`--s1` a `--s6`). Margem lateral 16px. Entre seções 24px, dentro de cartão 16px.
- Alvo de toque mínimo 44px.
- Cartões só quando agrupam algo de verdade; listas simples usam espaço, não caixa.

## Movimento (design-motion-principles, peso Jakub e depois Emil)

- Entrada: opacidade + 8px + blur 4px, 320 a 420ms, `cubic-bezier(.22,.8,.24,1)`.
- Saída mais discreta que a entrada: 180ms, 6px.
- Toque: escala .97 em 120ms. Nunca animar altura, largura ou posição de layout.
- Itens repetidos (trocar de aba, abrir/fechar cartão) são rápidos ou instantâneos.
- Sem pulsar em loop para chamar atenção. A esfera e o céu podem respirar porque são o "ser" da Alma, não um botão.
- Tudo com `prefers-reduced-motion: reduce` desligando a animação.

## Estados

- Vazio: diz o que fazer e oferece a ação ali mesmo (um botão), nunca só um texto pontilhado.
- Carregando: forma do conteúdo final, sem spinner genérico.
- Foco visível em tudo (`outline: 2px solid var(--ink)`).

## Texto

- Português do Brasil, frases curtas, verbo de ação nos botões ("Registrar sonho", não "Enviar").
- Nunca travessão. Use vírgula, dois-pontos ou ponto.
