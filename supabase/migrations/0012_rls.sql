-- Purpose: Enable Row Level Security (RLS) on all application tables with strict owner-only policies
-- Dependencies: auth.users, public.profiles, public.documents, public.tags, public.document_tags, public.share_links, public.activity_events, public.user_preferences
-- Tables/functions affected: RLS policies on all public tables

-- 1. Enable RLS across all tables
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.tags enable row level security;
alter table public.document_tags enable row level security;
alter table public.share_links enable row level security;
alter table public.activity_events enable row level security;
alter table public.user_preferences enable row level security;

-- 2. Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- 3. Documents Policies
create policy "Users can view own documents"
  on public.documents for select
  using (user_id = auth.uid());

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

create policy "Users can insert own documents"
  on public.documents for insert
  with check (user_id = auth.uid());

create policy "Users can update own documents"
  on public.documents for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own documents"
  on public.documents for delete
  using (user_id = auth.uid());

-- 4. Tags Policies
create policy "Users can view own tags"
  on public.tags for select
  using (user_id = auth.uid());

create policy "Users can insert own tags"
  on public.tags for insert
  with check (user_id = auth.uid());

create policy "Users can update own tags"
  on public.tags for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "Users can delete own tags"
  on public.tags for delete
  using (user_id = auth.uid());

-- 5. Document_Tags Policies (Must own both document and tag)
create policy "Users can view own document tags"
  on public.document_tags for select
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Users can link own document tags"
  on public.document_tags for insert
  with check (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and d.user_id = auth.uid()
    )
    and
    exists (
      select 1 from public.tags t
      where t.id = document_tags.tag_id
        and t.user_id = auth.uid()
    )
  );

create policy "Users can delete own document tags"
  on public.document_tags for delete
  using (
    exists (
      select 1 from public.documents d
      where d.id = document_tags.document_id
        and d.user_id = auth.uid()
    )
  );

-- 6. Share Links Policies (Owner only, plus public active token resolution)
create policy "Owners can view own share links"
  on public.share_links for select
  using (owner_id = auth.uid());

create policy "Public can view active share links by token"
  on public.share_links for select
  to anon, authenticated
  using (revoked_at is null and expires_at > now());

create policy "Owners can create own share links"
  on public.share_links for insert
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.documents d
      where d.id = share_links.document_id
        and d.user_id = auth.uid()
    )
  );

create policy "Owners can update or revoke own share links"
  on public.share_links for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Owners can delete own share links"
  on public.share_links for delete
  using (owner_id = auth.uid());

-- 7. Activity Events Policies
create policy "Users can view own activity events"
  on public.activity_events for select
  using (user_id = auth.uid());

create policy "Users can insert own activity events"
  on public.activity_events for insert
  with check (user_id = auth.uid());

-- 8. User Preferences Policies
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (user_id = auth.uid());

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
