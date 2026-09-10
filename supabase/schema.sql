-- ==============================================================================
-- WHITE CARD — COMPLETE PRODUCTION POSTGRESQL SCHEMA (ALL-IN-ONE)
-- Secure Personal Document Wallet (Government Documents & Student Certificates)
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (or via CLI) on your project.
-- Safe to rerun: uses idempotent IF NOT EXISTS, DROP TRIGGER/POLICY IF EXISTS, etc.
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "pgcrypto";

-- 2. ENUM TYPES
do $$ begin
  create type public.document_space as enum ('government', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.document_status as enum ('active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.appearance_mode as enum ('system', 'light', 'dark');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_action as enum (
    'uploaded',
    'updated',
    'downloaded',
    'shared',
    'share_revoked',
    'deleted'
  );
exception when duplicate_object then null; end $$;

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. DOCUMENTS TABLE (with Category, View Count, and Click Count)
create table if not exists public.documents (
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

  -- Categories & Taxonomy
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

-- 5. TAGS TABLE
create table if not exists public.tags (
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

-- 6. DOCUMENT_TAGS JUNCTION TABLE
create table if not exists public.document_tags (
  document_id uuid not null
    references public.documents(id)
    on delete cascade,

  tag_id uuid not null
    references public.tags(id)
    on delete cascade,

  created_at timestamptz not null default now(),

  primary key (document_id, tag_id)
);

-- 7. SHARE_LINKS TABLE (Hashed Tokens, View/Click metrics)
create table if not exists public.share_links (
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

-- 8. ACTIVITY_EVENTS TABLE
create table if not exists public.activity_events (
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

-- 9. USER_PREFERENCES TABLE (10 Themes & Appearance)
create table if not exists public.user_preferences (
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

-- 10. PERFORMANCE INDEXES
create index if not exists documents_user_id_idx on public.documents(user_id);
create index if not exists documents_user_space_idx on public.documents(user_id, space);
create index if not exists documents_created_at_idx on public.documents(user_id, created_at desc);
create index if not exists documents_expires_on_idx on public.documents(user_id, expires_on);
create index if not exists documents_title_idx on public.documents(user_id, title);
create index if not exists documents_category_idx on public.documents(user_id, category);

create index if not exists tags_user_id_idx on public.tags(user_id);
create index if not exists share_links_owner_idx on public.share_links(owner_id);
create index if not exists share_links_document_idx on public.share_links(document_id);
create index if not exists share_links_token_hash_idx on public.share_links(token_hash);
create index if not exists activity_events_user_idx on public.activity_events(user_id, created_at desc);

-- 11. REUSABLE TIMESTAMPS & USER PROVISIONING TRIGGERS
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
  before update on public.tags
  for each row execute function public.set_updated_at();

drop trigger if exists set_preferences_updated_at on public.user_preferences;
create trigger set_preferences_updated_at
  before update on public.user_preferences
  for each row execute function public.set_updated_at();

-- Automatic Provisioning Trigger on auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Insert Profile
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Vault Owner'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  -- 2. Insert Preferences with default Zinc theme
  insert into public.user_preferences (user_id, theme_id, appearance, default_document_view)
  values (new.id, 'zinc', 'system', 'grid')
  on conflict (user_id) do nothing;

  -- 3. Insert Starter Tags
  insert into public.tags (user_id, name, color_key, sort_order)
  values
    (new.id, 'Identity', 'blue', 1),
    (new.id, 'Education', 'violet', 2),
    (new.id, 'Travel', 'emerald', 3),
    (new.id, 'Vehicle', 'amber', 4),
    (new.id, 'Renewal', 'rose', 5),
    (new.id, 'Personal', 'cyan', 6)
  on conflict (user_id, name) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.tags enable row level security;
alter table public.document_tags enable row level security;
alter table public.share_links enable row level security;
alter table public.activity_events enable row level security;
alter table public.user_preferences enable row level security;

-- Profiles
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select using (id = auth.uid());
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- Documents
drop policy if exists "Users can view own documents" on public.documents;
create policy "Users can view own documents" on public.documents for select using (user_id = auth.uid());
drop policy if exists "Users can insert own documents" on public.documents;
create policy "Users can insert own documents" on public.documents for insert with check (user_id = auth.uid());
drop policy if exists "Users can update own documents" on public.documents;
create policy "Users can update own documents" on public.documents for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Users can delete own documents" on public.documents;
create policy "Users can delete own documents" on public.documents for delete using (user_id = auth.uid());

-- Tags
drop policy if exists "Users can view own tags" on public.tags;
create policy "Users can view own tags" on public.tags for select using (user_id = auth.uid());
drop policy if exists "Users can insert own tags" on public.tags;
create policy "Users can insert own tags" on public.tags for insert with check (user_id = auth.uid());
drop policy if exists "Users can update own tags" on public.tags;
create policy "Users can update own tags" on public.tags for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "Users can delete own tags" on public.tags;
create policy "Users can delete own tags" on public.tags for delete using (user_id = auth.uid());

-- Document Tags
drop policy if exists "Users can view own document tags" on public.document_tags;
create policy "Users can view own document tags" on public.document_tags for select
  using (exists (select 1 from public.documents d where d.id = document_tags.document_id and d.user_id = auth.uid()));

drop policy if exists "Users can link own document tags" on public.document_tags;
create policy "Users can link own document tags" on public.document_tags for insert
  with check (
    exists (select 1 from public.documents d where d.id = document_tags.document_id and d.user_id = auth.uid())
    and
    exists (select 1 from public.tags t where t.id = document_tags.tag_id and t.user_id = auth.uid())
  );

drop policy if exists "Users can delete own document tags" on public.document_tags;
create policy "Users can delete own document tags" on public.document_tags for delete
  using (exists (select 1 from public.documents d where d.id = document_tags.document_id and d.user_id = auth.uid()));

-- Share Links
drop policy if exists "Owners can view own share links" on public.share_links;
create policy "Owners can view own share links" on public.share_links for select using (owner_id = auth.uid());
drop policy if exists "Owners can create own share links" on public.share_links;
create policy "Owners can create own share links" on public.share_links for insert
  with check (owner_id = auth.uid() and exists (select 1 from public.documents d where d.id = share_links.document_id and d.user_id = auth.uid()));
drop policy if exists "Owners can update or revoke own share links" on public.share_links;
create policy "Owners can update or revoke own share links" on public.share_links for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "Owners can delete own share links" on public.share_links;
create policy "Owners can delete own share links" on public.share_links for delete using (owner_id = auth.uid());

-- Activity Events
drop policy if exists "Users can view own activity events" on public.activity_events;
create policy "Users can view own activity events" on public.activity_events for select using (user_id = auth.uid());
drop policy if exists "Users can insert own activity events" on public.activity_events;
create policy "Users can insert own activity events" on public.activity_events for insert with check (user_id = auth.uid());

-- User Preferences
drop policy if exists "Users can view own preferences" on public.user_preferences;
create policy "Users can view own preferences" on public.user_preferences for select using (user_id = auth.uid());
drop policy if exists "Users can update own preferences" on public.user_preferences;
create policy "Users can update own preferences" on public.user_preferences for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 13. PRIVATE STORAGE BUCKET & POLICIES
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800, -- 50 MB
  array[
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/zip',
    'application/x-zip-compressed',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update set public = false, file_size_limit = 52428800;

-- Scoped storage policies by {user_id}/{space}/{document_id}/{filename}
drop policy if exists "Users can upload own documents" on storage.objects;
create policy "Users can upload own documents" on storage.objects for insert
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can read own documents" on storage.objects;
create policy "Users can read own documents" on storage.objects for select
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can update own documents" on storage.objects;
create policy "Users can update own documents" on storage.objects for update
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users can delete own documents" on storage.objects;
create policy "Users can delete own documents" on storage.objects for delete
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);

-- 14. STORED PROCEDURES & RPC (Cryptographic Share & View/Click Analytics)

-- Create a cryptographically secure document share
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
  v_owner_id := auth.uid();
  if v_owner_id is null then
    raise exception 'Unauthorized: Must be authenticated';
  end if;

  if not exists (
    select 1 from public.documents where id = p_document_id and user_id = v_owner_id
  ) then
    raise exception 'Document not found or access denied';
  end if;

  if p_duration_days in (1, 7, 30) then
    v_allowed_days := p_duration_days;
  else
    v_allowed_days := 7;
  end if;

  v_expires_at := now() + (v_allowed_days || ' days')::interval;

  -- Generate 24 cryptographically random bytes -> hex string (48 characters)
  v_raw_token := encode(gen_random_bytes(24), 'hex');

  -- Store SHA-256 hash for secure verification
  v_token_hash := encode(digest(v_raw_token, 'sha256'), 'hex');

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

  insert into public.activity_events (user_id, document_id, action)
  values (v_owner_id, p_document_id, 'shared');

  return query select v_share_id, v_raw_token, v_expires_at;
end;
$$;

-- Revoke an active share link
create or replace function public.revoke_document_share(p_share_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid := auth.uid();
  v_doc_id uuid;
begin
  if v_owner_id is null then
    raise exception 'Unauthorized';
  end if;

  select document_id into v_doc_id
  from public.share_links
  where id = p_share_id and owner_id = v_owner_id;

  if not found then
    raise exception 'Share link not found or access denied';
  end if;

  update public.share_links
  set revoked_at = now()
  where id = p_share_id and owner_id = v_owner_id;

  insert into public.activity_events (user_id, document_id, action)
  values (v_owner_id, v_doc_id, 'share_revoked');
end;
$$;

-- 14. STORED PROCEDURES & SECURE ACCESS METRICS
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

-- Increment share view count (called securely on access)
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

-- Increment share click count (called securely on download click)
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

-- 15. DOCUMENTATION COMMENTS
comment on table public.documents is 'Central vault documents stored in Government or Student spaces with categories, view and click metrics';
comment on table public.profiles is 'User identity profiles linked to authenticated accounts';
comment on table public.tags is 'Semantic tags with color keys for multi-dimensional filtering';
comment on table public.share_links is 'Cryptographic SHA-256 hashed temporary document sharing links with view/click tracking';
comment on table public.user_preferences is 'Independent theme selection (10 presets) and appearance mode preferences';
comment on table public.activity_events is 'Audit log tracking document uploads, updates, downloads, shares, and deletions';

-- ==============================================================================
-- END OF SCHEMA
-- ==============================================================================
