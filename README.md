# Alma

Um conselheiro que responde às suas dúvidas com a sabedoria de muitas tradições, e ajuda a transformar reflexão em ação.

## O que tem

- Abertura com manifesto, ritual de respiração e a esfera "alma" que reage ao que você escreve.
- Três perguntas de aprofundamento, o Conselho com 14 sabedorias, a resposta da Alma e o plano de ação com lembretes.
- Constelação pessoal: perguntas guardadas, estrelas, planos, resolver e excluir.
- Céu e Símbolos: perfil de nascimento, mapa natal calculado, horóscopo (dia a 1 ano), numerologia completa e tarô guiado.
- Login por link no e-mail (Supabase) para guardar tudo na nuvem; sem login, os dados ficam no aparelho.

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
