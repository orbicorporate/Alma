-- Dados de cada pessoa na Alma: constelação (perguntas, estrelas, planos), perfil de nascimento,
-- diário, post-its e leituras de tarô.
create table if not exists public.alma_user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  entries jsonb not null default '[]'::jsonb,
  profile jsonb,
  journal jsonb not null default '[]'::jsonb,
  postits jsonb not null default '[]'::jsonb,
  readings jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.alma_user_data enable row level security;

create policy "alma: ler os próprios dados" on public.alma_user_data
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "alma: criar os próprios dados" on public.alma_user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "alma: atualizar os próprios dados" on public.alma_user_data
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "alma: apagar os próprios dados" on public.alma_user_data
  for delete to authenticated using ((select auth.uid()) = user_id);
