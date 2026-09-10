-- Purpose: Cryptographically hashed temporary document share links with view and click tracking
-- Dependencies: public.documents, auth.users
-- Tables/functions affected: public.share_links

create table public.share_links (
  id uuid primary key default gen_random_uuid(),

  document_id uuid not null
    references public.documents(id)
    on delete cascade,

  owner_id uuid not null
    references auth.users(id)
    on delete cascade,

  token_hash text not null unique,

  -- Link tracking metrics
  view_count integer not null default 0 check (view_count >= 0),
  click_count integer not null default 0 check (click_count >= 0),

  expires_at timestamptz not null,
  revoked_at timestamptz,

  created_at timestamptz not null default now()
);
