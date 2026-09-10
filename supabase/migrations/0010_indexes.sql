-- Purpose: Performance indexes for documents, tags, and share resolution
-- Dependencies: public.documents, public.tags, public.share_links
-- Tables/functions affected: database indexes

create index if not exists documents_user_id_idx
  on public.documents(user_id);

create index if not exists documents_user_space_idx
  on public.documents(user_id, space);

create index if not exists documents_created_at_idx
  on public.documents(user_id, created_at desc);

create index if not exists documents_expires_on_idx
  on public.documents(user_id, expires_on);

create index if not exists documents_title_idx
  on public.documents(user_id, title);

create index if not exists tags_user_id_idx
  on public.tags(user_id);

create index if not exists share_links_owner_idx
  on public.share_links(owner_id);

create index if not exists share_links_document_idx
  on public.share_links(document_id);

create index if not exists share_links_token_hash_idx
  on public.share_links(token_hash);
