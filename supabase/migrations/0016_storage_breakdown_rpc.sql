-- Purpose: High-performance storage breakdown aggregation RPC for authenticated user
-- Dependencies: public.documents, auth.users
-- Tables/functions affected: public.get_storage_breakdown

create or replace function public.get_storage_breakdown()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
  v_result jsonb;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object(
      'totalBytes', 0,
      'totalDocuments', 0,
      'governmentBytes', 0,
      'governmentCount', 0,
      'studentBytes', 0,
      'studentCount', 0,
      'fileTypes', '[]'::jsonb,
      'largestDocuments', '[]'::jsonb
    );
  end if;

  with active_docs as (
    select
      id,
      title,
      original_name,
      space,
      category,
      mime_type,
      extension,
      size_bytes,
      created_at
    from public.documents
    where user_id = v_user_id and status = 'active'
  ),
  totals as (
    select
      coalesce(sum(size_bytes), 0)::bigint as total_bytes,
      count(*)::int as total_count,
      coalesce(sum(case when space = 'government' then size_bytes else 0 end), 0)::bigint as gov_bytes,
      count(case when space = 'government' then 1 end)::int as gov_count,
      coalesce(sum(case when space = 'student' then size_bytes else 0 end), 0)::bigint as student_bytes,
      count(case when space = 'student' then 1 end)::int as student_count
    from active_docs
  ),
  file_types_agg as (
    select
      case
        when mime_type ilike '%pdf%' or lower(coalesce(extension, '')) = 'pdf' then 'pdf'
        when mime_type ilike 'image/%' or lower(coalesce(extension, '')) in ('png','jpg','jpeg','webp','svg','gif','bmp','tiff') then 'image'
        when lower(coalesce(extension, '')) in ('zip','tar','gz','rar','7z','bz2') or mime_type ilike '%zip%' or mime_type ilike '%compressed%' then 'archive'
        when lower(coalesce(extension, '')) in ('doc','docx','odt','txt','rtf','md') or mime_type ilike '%word%' or mime_type ilike '%document%' or mime_type ilike '%text%' then 'document'
        when lower(coalesce(extension, '')) in ('xls','xlsx','csv','ods','tsv') or mime_type ilike '%sheet%' or mime_type ilike '%excel%' or mime_type ilike '%csv%' then 'spreadsheet'
        else 'other'
      end as type_key,
      count(*)::int as type_count,
      coalesce(sum(size_bytes), 0)::bigint as type_bytes
    from active_docs
    group by 1
  ),
  top_docs as (
    select
      id,
      title,
      original_name as "originalFilename",
      space,
      category,
      coalesce(mime_type, 'application/octet-stream') as "mimeType",
      size_bytes as "sizeBytes",
      created_at as "createdAt"
    from active_docs
    order by size_bytes desc, created_at desc
    limit 10
  )
  select jsonb_build_object(
    'totalBytes', coalesce(t.total_bytes, 0),
    'totalDocuments', coalesce(t.total_count, 0),
    'governmentBytes', coalesce(t.gov_bytes, 0),
    'governmentCount', coalesce(t.gov_count, 0),
    'studentBytes', coalesce(t.student_bytes, 0),
    'studentCount', coalesce(t.student_count, 0),
    'fileTypes', coalesce((select jsonb_agg(f) from file_types_agg f), '[]'::jsonb),
    'largestDocuments', coalesce((select jsonb_agg(d) from top_docs d), '[]'::jsonb)
  )
  into v_result
  from totals t;

  return v_result;
end;
$$;

grant execute on function public.get_storage_breakdown() to authenticated;
