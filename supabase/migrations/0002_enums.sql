-- Purpose: Define domain enumeration types for spaces, document statuses, appearance, and activities
-- Dependencies: none
-- Tables/functions affected: public.document_space, public.document_status, public.appearance_mode, public.activity_action

create type public.document_space as enum (
  'government',
  'student'
);

create type public.document_status as enum (
  'active',
  'archived'
);

create type public.appearance_mode as enum (
  'system',
  'light',
  'dark'
);

create type public.activity_action as enum (
  'uploaded',
  'updated',
  'downloaded',
  'shared',
  'share_revoked',
  'deleted'
);
