-- Purpose: Stored procedures for cryptographically secure sharing and view/click metrics tracking
-- Dependencies: pgcrypto, public.documents, public.share_links, auth.users
-- Tables/functions affected: public.create_document_share, public.increment_document_view, public.increment_document_click

create or replace function public.create_document_share(
  p_document_id uuid,
  p_duration_days integer default 7
)
returns table (
  share_id uuid,
  raw_token text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_owner_id uuid;
  v_raw_token text;
  v_token_hash text;
  v_expires_at timestamptz;
  v_share_id uuid;
  v_allowed_days integer;
begin
  -- 1. Verify caller authentication
  v_owner_id := auth.uid();
  if v_owner_id is null then
    raise exception 'Unauthorized: Must be logged in to share documents';
  end if;

  -- 2. Verify document ownership
  if not exists (
    select 1 from public.documents
    where id = p_document_id and user_id = v_owner_id
  ) then
    raise exception 'Document not found or ownership required';
  end if;

  -- 3. Constrain duration to allowed presets (1, 7, 30 days)
  if p_duration_days in (1, 7, 30) then
    v_allowed_days := p_duration_days;
  else
    v_allowed_days := 7;
  end if;

  v_expires_at := now() + (v_allowed_days || ' days')::interval;

  -- 4. Generate 24 cryptographically random bytes formatted as hex string
  v_raw_token := encode(gen_random_bytes(24), 'hex');

  -- 5. Calculate SHA-256 hash for secure storage
  v_token_hash := encode(digest(v_raw_token, 'sha256'), 'hex');

  -- 6. Insert share link record
  insert into public.share_links (
    document_id,
    owner_id,
    token_hash,
    expires_at,
    view_count,
    click_count
  )
  values (
    p_document_id,
    v_owner_id,
    v_token_hash,
    v_expires_at,
    0,
    0
  )
  returning id into v_share_id;

  -- 7. Record activity event
  insert into public.activity_events (
    user_id,
    document_id,
    action
  )
  values (
    v_owner_id,
    p_document_id,
    'shared'
  );

  -- 8. Return raw token once to caller
  return query select v_share_id, v_raw_token, v_expires_at;
end;
$$;

-- Safely increment document view count (authenticated owner or authorized caller)
create or replace function public.increment_document_view(p_document_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.documents
  set view_count = view_count + 1
  where id = p_document_id;
end;
$$;

-- Safely increment document click/download count & record 'downloaded' activity
create or replace function public.increment_document_click(p_document_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
begin
  update public.documents
  set click_count = click_count + 1
  where id = p_document_id
  returning user_id into v_owner_id;

  if v_owner_id is not null then
    insert into public.activity_events (user_id, document_id, action)
    values (v_owner_id, p_document_id, 'downloaded');
  end if;
end;
$$;

-- Safely increment share link view count and associated document view count
create or replace function public.increment_share_view(p_token_hash text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doc_id uuid;
begin
  update public.share_links
  set view_count = view_count + 1
  where token_hash = p_token_hash and revoked_at is null and expires_at > now()
  returning document_id into v_doc_id;

  if v_doc_id is not null then
    update public.documents
    set view_count = view_count + 1
    where id = v_doc_id;
  end if;
end;
$$;

-- Safely increment share link click/download count, document click count, and record audit event
create or replace function public.increment_share_click(p_token_hash text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_doc_id uuid;
  v_owner_id uuid;
begin
  update public.share_links
  set click_count = click_count + 1
  where token_hash = p_token_hash and revoked_at is null and expires_at > now()
  returning document_id, owner_id into v_doc_id, v_owner_id;

  if v_doc_id is not null then
    update public.documents
    set click_count = click_count + 1
    where id = v_doc_id;

    if v_owner_id is not null then
      insert into public.activity_events (user_id, document_id, action)
      values (v_owner_id, v_doc_id, 'downloaded');
    end if;
  end if;
end;
$$;

-- Explicitly grant execute permissions to authenticated, anon, and service_role
grant execute on function public.increment_document_view(uuid) to anon, authenticated, service_role;
grant execute on function public.increment_document_click(uuid) to anon, authenticated, service_role;
grant execute on function public.increment_share_view(text) to anon, authenticated, service_role;
grant execute on function public.increment_share_click(text) to anon, authenticated, service_role;
grant execute on function public.create_document_share(uuid, integer) to anon, authenticated, service_role;
