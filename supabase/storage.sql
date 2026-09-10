-- ==============================================================================
-- WHITE CARD — STORAGE BUCKET CONFIGURATION & RLS POLICIES
-- ==============================================================================
-- Bucket: 'documents' (Private Vault)
-- Structure: {user_id}/{space}/{document_id}/{filename}
-- Size Limit: 50MB per file
-- ==============================================================================

-- 1. Create or update private bucket 'documents'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false, -- MUST BE FALSE (Private vault, accessible only via signed URLs or user session)
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
on conflict (id) do update set
  public = false,
  file_size_limit = 52428800,
  allowed_mime_types = excluded.allowed_mime_types;

-- 2. Storage RLS Policies: Enforce strict user folder ownership
-- Path rule: (storage.foldername(name))[1] must equal auth.uid()::text

-- INSERT (Upload)
drop policy if exists "Users can upload own documents" on storage.objects;
create policy "Users can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- SELECT (View / Download for authenticated owner)
drop policy if exists "Users can read own documents" on storage.objects;
create policy "Users can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- UPDATE (Overwrite / Replace)
drop policy if exists "Users can update own documents" on storage.objects;
create policy "Users can update own documents"
  on storage.objects for update
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- DELETE (Remove file)
drop policy if exists "Users can delete own documents" on storage.objects;
create policy "Users can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
