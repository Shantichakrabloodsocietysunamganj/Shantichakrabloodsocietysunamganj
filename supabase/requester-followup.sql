-- =====================================================================
-- Requester follow-up: only the browser that posted a blood request can
-- answer "received blood" / "still looking" without logging in.
-- Run once in Supabase Dashboard > SQL Editor.
-- Safe to run again.
-- =====================================================================

create extension if not exists "pgcrypto";

create table if not exists public.blood_request_access (
  request_id uuid primary key references public.blood_requests(id) on delete cascade,
  token_hash text not null,
  next_prompt_at timestamptz not null default (now() + interval '12 hours'),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.blood_request_access enable row level security;

-- Intentionally no direct anon/authenticated policies. Tokens and their hashes
-- are private and can only be used through the two narrowly scoped functions.
revoke all on table public.blood_request_access from anon, authenticated;

create or replace function public.create_blood_request_with_access(
  p_request jsonb,
  p_token text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  v_id uuid := (p_request->>'id')::uuid;
  v_next_prompt timestamptz;
begin
  if length(coalesce(p_token, '')) < 32 then
    raise exception 'Invalid management token';
  end if;

  v_next_prompt := greatest(
    now() + interval '12 hours',
    coalesce((p_request->>'next_prompt_at')::timestamptz, now() + interval '12 hours')
  );

  insert into public.blood_requests (
    id, patient_name, blood_group, units_needed, hospital, district, upazila,
    needed_date, contact_name, contact_phone, message, hemoglobin, patient_age,
    patient_gender, disease, blood_component, request_type, status, requested_by,
    created_at
  ) values (
    v_id,
    p_request->>'patient_name',
    p_request->>'blood_group',
    (p_request->>'units_needed')::int,
    p_request->>'hospital',
    coalesce(nullif(p_request->>'district', ''), 'সুনামগঞ্জ'),
    p_request->>'upazila',
    (p_request->>'needed_date')::date,
    p_request->>'contact_name',
    p_request->>'contact_phone',
    nullif(p_request->>'message', ''),
    nullif(p_request->>'hemoglobin', ''),
    nullif(p_request->>'patient_age', '')::int,
    nullif(p_request->>'patient_gender', ''),
    nullif(p_request->>'disease', ''),
    coalesce(nullif(p_request->>'blood_component', ''), 'whole_blood'),
    'normal',
    'approved',
    auth.uid(),
    coalesce((p_request->>'created_at')::timestamptz, now())
  );

  insert into public.blood_request_access (request_id, token_hash, next_prompt_at)
  values (v_id, encode(digest(p_token, 'sha256'), 'hex'), v_next_prompt);

  return v_id;
end;
$$;

create or replace function public.respond_to_blood_request(
  p_request_id uuid,
  p_token text,
  p_received boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not exists (
    select 1
    from public.blood_request_access
    where request_id = p_request_id
      and token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex')
  ) then
    raise exception 'Invalid request management token' using errcode = '42501';
  end if;

  if p_received then
    update public.blood_requests
      set status = 'completed'
      where id = p_request_id and status in ('pending', 'approved');
    update public.blood_request_access
      set completed_at = now()
      where request_id = p_request_id;
  else
    update public.blood_request_access
      set next_prompt_at = now() + interval '24 hours'
      where request_id = p_request_id;
  end if;

  return true;
end;
$$;

revoke all on function public.create_blood_request_with_access(jsonb, text) from public;
revoke all on function public.respond_to_blood_request(uuid, text, boolean) from public;
grant execute on function public.create_blood_request_with_access(jsonb, text) to anon, authenticated;
grant execute on function public.respond_to_blood_request(uuid, text, boolean) to anon, authenticated;

create index if not exists blood_request_access_next_prompt_idx
  on public.blood_request_access (next_prompt_at)
  where completed_at is null;
