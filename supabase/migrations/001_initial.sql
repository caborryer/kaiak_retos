-- KAIAK K21 App - Initial Schema
-- Run this in Supabase SQL Editor

-- ===========================================
-- Strava Connections
-- ===========================================
create table if not exists public.strava_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strava_user_id bigint not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  athlete_name text,
  athlete_profile text,
  connected_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table public.strava_connections enable row level security;

create policy "Users can view own strava connection"
  on public.strava_connections for select
  using (auth.uid() = user_id);

create policy "Users can insert own strava connection"
  on public.strava_connections for insert
  with check (auth.uid() = user_id);

create policy "Users can update own strava connection"
  on public.strava_connections for update
  using (auth.uid() = user_id);

create policy "Users can delete own strava connection"
  on public.strava_connections for delete
  using (auth.uid() = user_id);

-- ===========================================
-- Activities (from Strava)
-- ===========================================
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  strava_activity_id bigint not null,
  name text,
  type text not null check (type in ('Run', 'Walk', 'Hike', 'VirtualRun')),
  distance_km numeric(8, 3) not null default 0,
  elapsed_time_seconds integer,
  start_date timestamptz not null,
  synced_at timestamptz default now(),
  unique(user_id, strava_activity_id)
);

alter table public.activities enable row level security;

create policy "Users can view own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on public.activities for update
  using (auth.uid() = user_id);

-- ===========================================
-- Challenges (catalog - public read)
-- ===========================================
create table if not exists public.challenges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  distance_km numeric(8, 3),
  points_reward integer not null default 0,
  icon text not null default 'run',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Challenges are publicly readable (no RLS needed for select)
alter table public.challenges enable row level security;

create policy "Challenges are publicly readable"
  on public.challenges for select
  using (true);

-- ===========================================
-- User Challenges (completed challenges per user)
-- ===========================================
create table if not exists public.user_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.challenges(id),
  completed_at timestamptz default now(),
  evidence_activity_id uuid references public.activities(id),
  unique(user_id, challenge_id)
);

alter table public.user_challenges enable row level security;

create policy "Users can view own completed challenges"
  on public.user_challenges for select
  using (auth.uid() = user_id);

create policy "Users can insert own completed challenges"
  on public.user_challenges for insert
  with check (auth.uid() = user_id);

-- ===========================================
-- Rewards (catalog - public read)
-- ===========================================
create table if not exists public.rewards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  points_required integer not null,
  image_url text,
  category text not null default 'product',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.rewards enable row level security;

create policy "Rewards are publicly readable"
  on public.rewards for select
  using (true);

-- ===========================================
-- User Rewards (unlocked rewards per user)
-- ===========================================
create table if not exists public.user_rewards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reward_id uuid not null references public.rewards(id),
  unlocked_at timestamptz default now(),
  unique(user_id, reward_id)
);

alter table public.user_rewards enable row level security;

create policy "Users can view own unlocked rewards"
  on public.user_rewards for select
  using (auth.uid() = user_id);

create policy "Users can insert own unlocked rewards"
  on public.user_rewards for insert
  with check (auth.uid() = user_id);

-- ===========================================
-- Seed: Challenges
-- ===========================================
insert into public.challenges (slug, name, description, distance_km, points_reward, icon, sort_order)
values
  ('5k', '5K', 'Completá tu primera carrera de 5K', 5.0, 100, 'run', 1),
  ('10k', '10K', 'Desafío activo: corré 10K acumulados', 10.0, 200, 'run', 2),
  ('21k', '21K', 'Retate: alcanzá los 21K totales', 21.0, 500, 'run', 3),
  ('invite', 'Invitá a un amigo', 'Compartí la experiencia con alguien especial', null, 150, 'share', 4)
on conflict (slug) do nothing;

-- ===========================================
-- Seed: Rewards
-- ===========================================
insert into public.rewards (slug, name, description, points_required, image_url, category, sort_order)
values
  ('mini-21k', 'Mini 21K Eau de Parfum', 'Fragancia KAIAK K21 tamaño viaje', 1000, '/rewards/mini-21k.jpg', 'product', 1),
  ('camiseta-k21', 'Camiseta K21', 'Remera deportiva oficial KAIAK K21', 3000, '/rewards/camiseta.jpg', 'product', 2),
  ('bolso-deportivo', 'Bolso Deportivo', 'Bolso para entrenamientos con logo KAIAK', 5000, '/rewards/bolso.jpg', 'product', 3),
  ('run-camp', 'Experiencia Run Camp', 'Entrenamiento grupal exclusivo con coaches', 10000, '/rewards/run-camp.jpg', 'experience', 4),
  ('asics-edicion-especial', 'ASICS Edición Especial', 'Zapatillas de running edición limitada KAIAK', 15000, '/rewards/asics.jpg', 'product', 5)
on conflict (slug) do nothing;
