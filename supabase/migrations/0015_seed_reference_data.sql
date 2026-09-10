-- Purpose: Reference data and validation rules documentation
-- Dependencies: none
-- Tables/functions affected: database reference metadata

comment on table public.documents is 'Central vault documents stored in Government or Student spaces';
comment on table public.profiles is 'User identity profiles linked to authenticated accounts';
comment on table public.tags is 'Semantic tags with color keys for multi-dimensional filtering';
comment on table public.share_links is 'Cryptographic SHA-256 hashed temporary document sharing links';
comment on table public.user_preferences is 'Independent theme selection and appearance mode preferences';
