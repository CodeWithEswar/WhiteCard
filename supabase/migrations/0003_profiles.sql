-- Purpose: Create user profiles linked to auth.users for personal vault identification
-- Dependencies: auth.users
-- Tables/functions affected: public.profiles

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,

  display_name text,
  avatar_url text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
