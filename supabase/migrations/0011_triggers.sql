-- Purpose: Automated updated_at triggers and new user provisioning trigger
-- Dependencies: auth.users, public.profiles, public.documents, public.tags, public.user_preferences
-- Tables/functions affected: public.set_updated_at(), public.handle_new_user()

-- 1. Reusable timestamp update trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to app tables
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_tags_updated_at on public.tags;
create trigger set_tags_updated_at
  before update on public.tags
  for each row
  execute function public.set_updated_at();

drop trigger if exists set_preferences_updated_at on public.user_preferences;
create trigger set_preferences_updated_at
  before update on public.user_preferences
  for each row
  execute function public.set_updated_at();

-- 2. New user provisioning trigger on auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Provision Profile
  insert into public.profiles (
    id,
    display_name,
    avatar_url
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Vault Owner'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;

  -- Provision Preferences with Default Zinc Theme
  insert into public.user_preferences (
    user_id,
    theme_id,
    appearance,
    default_document_view
  )
  values (
    new.id,
    'zinc',
    'system',
    'grid'
  )
  on conflict (user_id) do nothing;

  -- Provision Standard Starter Tags
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

-- Trigger fires after new user insertion in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
