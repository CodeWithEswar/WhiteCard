-- Purpose: Lightweight audit log for document lifecycle events
-- Dependencies: auth.users, public.documents, public.activity_action
-- Tables/functions affected: public.activity_events

create table public.activity_events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  document_id uuid
    references public.documents(id)
    on delete set null,

  action public.activity_action not null,

  created_at timestamptz not null default now()
);
