-- Purpose: User preferences table for theme presets and appearance modes
-- Dependencies: auth.users, public.appearance_mode
-- Tables/functions affected: public.user_preferences

create table public.user_preferences (
  user_id uuid primary key
    references auth.users(id)
    on delete cascade,

  theme_id text not null default 'zinc'
    check (
      theme_id in (
        'zinc',
        'graphite',
        'slate',
        'stone',
        'blue',
        'indigo',
        'violet',
        'emerald',
        'amber',
        'rose'
      )
    ),

  appearance public.appearance_mode not null default 'system',

  default_document_view text not null default 'grid'
    check (default_document_view in ('grid', 'list')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
