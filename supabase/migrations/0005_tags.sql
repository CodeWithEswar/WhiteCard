-- Purpose: User-scoped tags table with semantic color key constraints
-- Dependencies: auth.users
-- Tables/functions affected: public.tags

create table public.tags (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null check (char_length(name) between 1 and 50),
  color_key text not null check (color_key in ('zinc', 'blue', 'violet', 'emerald', 'amber', 'rose', 'cyan')),

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id, name)
);
