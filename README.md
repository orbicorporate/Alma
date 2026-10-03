# Alma

Um conselheiro que responde às suas dúvidas com a sabedoria de muitas tradições, e ajuda a transformar reflexão em ação.

## O que tem

- Abertura com manifesto, ritual de respiração e a esfera "alma" que reage ao que você escreve.
- Três perguntas de aprofundamento, o Conselho com 14 sabedorias, a resposta da Alma e o plano de ação com lembretes.
- Constelação pessoal: perguntas guardadas, estrelas, planos, resolver e excluir.
- Céu e Símbolos: perfil de nascimento, mapa natal calculado, horóscopo (dia a 1 ano), numerologia completa e tarô guiado.
- Login por link no e-mail (Supabase) para guardar tudo na nuvem; sem login, os dados ficam no aparelho.

## Intuição (o app que adivinha)

Tudo em `src/insight.js`, sem rede e sem tabela nova:

- Cartão do momento no Início: uma ação só, na ordem passo do plano que vence hoje, pergunta em aberto pedindo notícia (Resolvi / Ainda pesa), intenção da manhã, reflexão da noite, dica do dia. "Agora não" esconde até amanhã.
- Continuar em vez de recomeçar: ao escrever, a Alma reconhece uma pergunta parecida já guardada e oferece seguir de lá.
- Perguntas de aprofundamento buscadas enquanto a pessoa ainda escreve; a resposta que ela costuma dar já vem marcada.
- Suas vozes: tradições mais estreladas aparecem primeiro, com o motivo dito em uma linha.
- O céu do dia acompanha o passo sugerido (e vai para a IA como contexto); o tarô sugere a pergunta em aberto.
- Ações de um toque na resposta: virar plano e lembrar amanhã no horário em que a pessoa costuma usar o app.
- Ritmo do dia: o céu do Início muda de tom de manhã, à tarde e à noite.
- Hábitos de uso (horários, sugestões dispensadas) ficam só no aparelho; o check-in fica na própria pergunta e sincroniza.

## Rodar localmente

```bash
npm install
cp .env.example .env   # preencha com a URL e a chave pública do Supabase
npm run dev
```

## Estrutura

- `src/screens/Alma.jsx` e `src/screens/Simbolos.jsx`: as duas áreas do app (geradas a partir do protótipo e mantidas à mão).
- `src/store.js`: login e dados (Supabase + cópia local).
- `src/dates.js`: datas relativas ao dia de hoje.
- `supabase/migrations/`: tabela `alma_user_data` com RLS (cada pessoa só lê e grava os próprios dados).

## Variáveis de ambiente (Vercel)

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (chave pública)

## Próximos passos

- Gerar as respostas do Conselho com IA a partir da pergunta e das tags (hoje são respostas de exemplo).
- Notificações push para os lembretes do plano.
- Base completa de cidades e fusos históricos para o mapa natal.
