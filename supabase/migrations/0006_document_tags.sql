-- Purpose: Many-to-many junction table between documents and tags
-- Dependencies: public.documents, public.tags
-- Tables/functions affected: public.document_tags

create table public.document_tags (
  document_id uuid not null
    references public.documents(id)
    on delete cascade,

  tag_id uuid not null
    references public.tags(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key (document_id, tag_id)
);
