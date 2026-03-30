-- Auth Whitelist — utilisateurs autorises
-- Seuls les emails dans cette table peuvent acceder a l'app

create table if not exists public.authorized_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text not null default 'user', -- 'admin' ou 'user'
  invited_by text,                   -- email de celui qui a invite
  created_at timestamptz default now(),
  last_seen_at timestamptz,
  is_active boolean default true
);

-- RLS
alter table public.authorized_users enable row level security;

-- Seul un admin peut lire/modifier la table
create policy "Admin full access" on public.authorized_users
  for all using (
    auth.jwt() ->> 'email' in (
      select email from public.authorized_users where role = 'admin' and is_active = true
    )
  );

-- Un user peut voir sa propre ligne (pour verifier s'il est autorise)
create policy "User can read own row" on public.authorized_users
  for select using (auth.jwt() ->> 'email' = email);

-- Index
create index on public.authorized_users(email);
create index on public.authorized_users(is_active);

-- Seed : ajouter l'admin par defaut
-- REMPLACE par ton email avant de lancer la migration
insert into public.authorized_users (email, name, role)
values ('diazarel93@gmail.com', 'Romain', 'admin')
on conflict (email) do nothing;
