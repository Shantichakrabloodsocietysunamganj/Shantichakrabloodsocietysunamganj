-- Donor privacy migration
-- Run after schema.sql. Public clients must use public_donors, never public.donors.

-- The view intentionally runs with its owner privileges. It exposes only the
-- allow-listed columns below; anon has no SELECT privilege on donors itself.
create or replace view public.public_donors as
select
  id, full_name, blood_group, gender, age, district, upazila,
  photo_url, last_donation_date, is_available, is_verified,
  approved, created_at
from public.donors
where approved and deleted_at is null;

grant select on public.public_donors to anon, authenticated;

create or replace view public.public_blood_requests as
select id, patient_name, blood_group, units_needed, hospital, district, upazila,
  needed_date, contact_name, message, patient_age, patient_gender,
  blood_component, request_type, status, created_at
from public.blood_requests
where deleted_at is null;
grant select on public.public_blood_requests to anon, authenticated;
revoke select on public.donors from anon;

create table if not exists public.donor_contact_events (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references public.donors(id) on delete cascade,
  channel text not null check (channel in ('call', 'whatsapp')),
  ip_hash text not null,
  created_at timestamptz not null default now()
);
alter table public.donor_contact_events enable row level security;
revoke all on public.donor_contact_events from anon, authenticated;

create or replace function public.get_donor_contact(
  p_donor_id uuid,
  p_channel text,
  p_ip_hash text
) returns text
language plpgsql security definer set search_path = public, extensions
as $$
declare
  v_phone text;
  v_recent integer;
begin
  if p_channel not in ('call', 'whatsapp') or length(coalesce(p_ip_hash, '')) < 32 then
    raise exception 'Invalid contact request' using errcode = '22023';
  end if;

  select count(*) into v_recent
  from public.donor_contact_events
  where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_recent >= 30 then
    raise exception 'Too many contact requests' using errcode = '42900';
  end if;

  select phone into v_phone
  from public.donors
  where id = p_donor_id and approved and deleted_at is null;
  if v_phone is null then
    raise exception 'Donor not found' using errcode = 'P0002';
  end if;

  insert into public.donor_contact_events (donor_id, channel, ip_hash)
  values (p_donor_id, p_channel, p_ip_hash);
  return v_phone;
end;
$$;
create or replace function public.get_request_contact(
  p_request_id uuid, p_channel text, p_ip_hash text
) returns text
language plpgsql security definer set search_path = public, extensions
as $$
declare v_phone text; v_recent integer;
begin
  if p_channel not in ('call', 'whatsapp') or length(coalesce(p_ip_hash, '')) < 32 then raise exception 'Invalid contact request' using errcode = '22023'; end if;
  select count(*) into v_recent from public.donor_contact_events where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_recent >= 30 then raise exception 'Too many contact requests' using errcode = '42900'; end if;
  select contact_phone into v_phone from public.blood_requests where id = p_request_id and deleted_at is null and status in ('pending', 'approved');
  if v_phone is null then raise exception 'Request not found' using errcode = 'P0002'; end if;
  insert into public.donor_contact_events (donor_id, channel, ip_hash)
  values (null, p_channel, p_ip_hash);
  return v_phone;
end;
$$;
revoke all on function public.get_request_contact(uuid, text, text) from public;
grant execute on function public.get_request_contact(uuid, text, text) to anon, authenticated;

revoke all on function public.get_donor_contact(uuid, text, text) from public;
grant execute on function public.get_donor_contact(uuid, text, text) to anon, authenticated;
