-- ==============================================================================
-- WHITE CARD — VIEW & DOWNLOAD METRICS, TRIGGERS & RPC PERMISSIONS
-- Run this in your Supabase SQL Editor to enable real-time view/click tracking
-- ==============================================================================

-- 1. Safely increment document view count
create or replace function public.increment_document_view(p_document_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.documents
  set view_count = coalesce(view_count, 0) + 1
  where id = p_document_id;
end;
$$;

-- 2. Safely increment document click/download count & record 'downloaded' activity
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
  set click_count = coalesce(click_count, 0) + 1
  where id = p_document_id
  returning user_id into v_owner_id;

  if v_owner_id is not null then
    insert into public.activity_events (user_id, document_id, action)
    values (v_owner_id, p_document_id, 'downloaded');
  end if;
end;
$$;

-- 3. Safely increment share link view count and associated document view count
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
  set view_count = coalesce(view_count, 0) + 1
  where token_hash = p_token_hash and revoked_at is null and expires_at > now()
  returning document_id into v_doc_id;

  if v_doc_id is not null then
    update public.documents
    set view_count = coalesce(view_count, 0) + 1
    where id = v_doc_id;
  end if;
end;
$$;

-- 4. Safely increment share link click/download count, document click count, and record audit event
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
  set click_count = coalesce(click_count, 0) + 1
  where token_hash = p_token_hash and revoked_at is null and expires_at > now()
  returning document_id, owner_id into v_doc_id, v_owner_id;

  if v_doc_id is not null then
    update public.documents
    set click_count = coalesce(click_count, 0) + 1
    where id = v_doc_id;

    if v_owner_id is not null then
      insert into public.activity_events (user_id, document_id, action)
      values (v_owner_id, v_doc_id, 'downloaded');
    end if;
  end if;
end;
$$;

-- 5. Grant explicit execution permissions to authenticated, anon, and service_role
grant execute on function public.increment_document_view(uuid) to anon, authenticated, service_role;
grant execute on function public.increment_document_click(uuid) to anon, authenticated, service_role;
grant execute on function public.increment_share_view(text) to anon, authenticated, service_role;
grant execute on function public.increment_share_click(text) to anon, authenticated, service_role;

-- 6. Add public RLS policies for active share link resolution
drop policy if exists "Public can view active share links by token" on public.share_links;
create policy "Public can view active share links by token"
  on public.share_links for select
  to anon, authenticated
  using (revoked_at is null and expires_at > now());

drop policy if exists "Public can view documents with active share link" on public.documents;
create policy "Public can view documents with active share link"
  on public.documents for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.share_links sl
      where sl.document_id = documents.id
        and sl.revoked_at is null
        and sl.expires_at > now()
    )
  );
