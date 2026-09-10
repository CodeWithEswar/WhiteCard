-- Purpose: Central documents domain table with size, space, path, category, and interaction metrics
-- Dependencies: auth.users, public.document_space, public.document_status
-- Tables/functions affected: public.documents

create table public.documents (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  space public.document_space not null,

  title text not null check (char_length(title) between 1 and 200),
  original_name text not null,

  storage_bucket text not null default 'documents',
  storage_path text not null unique,

  mime_type text,
  extension text,
  size_bytes bigint not null check (size_bytes >= 0),

  category text check (category is null or char_length(category) <= 80),
  notes text check (notes is null or char_length(notes) <= 4000),

  -- Engagement & analytics metrics
  view_count integer not null default 0 check (view_count >= 0),
  click_count integer not null default 0 check (click_count >= 0),

  issued_on date,
  expires_on date,

  status public.document_status not null default 'active',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
