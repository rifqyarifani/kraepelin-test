-- Drop the old Prisma-created PascalCase table and create the lowercase
-- familyledger-style table with permissive RLS (no auth).
--
-- Run this in the Supabase dashboard SQL Editor.

drop table if exists public."LeaderboardEntry";

create extension if not exists pgcrypto;

create table if not exists public.leaderboard_entries (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 30),
  score       integer not null,
  correct     integer not null,
  incorrect   integer not null,
  accuracy    real not null check (accuracy between 0 and 100),
  created_at  timestamptz not null default now()
);

create index if not exists leaderboard_score_idx
  on public.leaderboard_entries (score desc);
create index if not exists leaderboard_date_score_idx
  on public.leaderboard_entries (created_at desc, score desc);

alter table public.leaderboard_entries enable row level security;

drop policy if exists "leaderboard_select_all" on public.leaderboard_entries;
drop policy if exists "leaderboard_insert_all" on public.leaderboard_entries;

create policy "leaderboard_select_all" on public.leaderboard_entries
  for select using (true);
create policy "leaderboard_insert_all" on public.leaderboard_entries
  for insert with check (true);
