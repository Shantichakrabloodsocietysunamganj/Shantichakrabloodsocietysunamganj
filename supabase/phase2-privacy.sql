-- =====================================================================
--  PHASE 2 — PRIVACY HARDENING + DONOR OPT-OUT (single migration)
--  Run AFTER: schema.sql, donor-privacy.sql, requester-followup.sql.
--  Safe to re-run (idempotent).
--
--  Problems this fixes:
--   • `blood_requests` base table was fully readable by anon AND by any
--     authenticated user (raw contact_phone, hemoglobin, disease, …).
--   • `donors` base table was readable by any authenticated user (full
--     row including `phone`) even though anon was revoked.
--   • `profiles` were publicly readable (phone/email leak).
--   • `volunteers` (phone/email) were readable by anon.
--
--  After this migration:
--   • anon        → no base-table read on donors/requests/volunteers;
--                   only the safe public views.
--   • authenticated→ base-table read only for the row they own
--                   (user_id / requested_by = auth.uid()); staff sees all.
--   • staff/admin → full base-table access (unchanged).
-- =====================================================================

-- -------------------------------------------------------------------
-- 1) Donor public-directory consent (opt-out)
--    `public_visible` lets a donor hide themselves from the public
--    donor directory without deleting their record.
-- -------------------------------------------------------------------
alter table public.donors
  add column if not exists public_visible boolean not null default true;

-- Safe public view now respects the opt-out flag.
-- (DROP first: CREATE OR REPLACE cannot drop/change columns on an existing view.)
drop view if exists public.public_donors cascade;
create view public.public_donors as
select
  id, full_name, blood_group, gender, age, district, upazila,
  photo_url, last_donation_date, is_available, is_verified,
  approved, created_at
from public.donors
where approved and deleted_at is null and coalesce(public_visible, true);

grant select on public.public_donors to anon, authenticated;

-- -------------------------------------------------------------------
-- 2) BLOOD REQUESTS — anon read removed; read scoped to requester/staff
-- -------------------------------------------------------------------
revoke select on public.blood_requests from anon;

drop policy if exists "Public blood request read" on public.blood_requests;
drop policy if exists "Own or staff request read" on public.blood_requests;
create policy "Own or staff request read" on public.blood_requests
  for select
  using (requested_by = auth.uid() or public.is_staff());

-- Tighten the public request view (drop medical fields).
-- (DROP first: removing patient_age/patient_gender from the existing view
--  needs a fresh CREATE, not CREATE OR REPLACE.)
drop view if exists public.public_blood_requests cascade;
create view public.public_blood_requests as
select
  id, patient_name, blood_group, units_needed, hospital, district, upazila,
  needed_date, contact_name, message, blood_component, request_type, status,
  created_at
from public.blood_requests
where deleted_at is null;

grant select on public.public_blood_requests to anon, authenticated;

-- -------------------------------------------------------------------
-- 3) DONORS — authenticated read scoped to the donor themselves / staff
--    (anon was already revoked in donor-privacy.sql)
-- -------------------------------------------------------------------
drop policy if exists "Public donor read" on public.donors;
drop policy if exists "Own or staff donor read" on public.donors;
create policy "Own or staff donor read" on public.donors
  for select
  using (user_id = auth.uid() or public.is_staff());

-- -------------------------------------------------------------------
-- 4) PROFILES — stop public read of every profile (phone/email leak).
-- -------------------------------------------------------------------
drop policy if exists "Public profiles read" on public.profiles;
drop policy if exists "Own or staff profile read" on public.profiles;
create policy "Own or staff profile read" on public.profiles
  for select
  using (auth.uid() = id or public.is_staff());

-- -------------------------------------------------------------------
-- 5) VOLUNTEERS — hide phone/email from anonymous clients.
-- -------------------------------------------------------------------
drop view if exists public.public_volunteers cascade;
create view public.public_volunteers as
select id, full_name, upazila, role, status, created_at
from public.volunteers
where deleted_at is null;

grant select on public.public_volunteers to anon, authenticated;
revoke select on public.volunteers from anon;

-- -------------------------------------------------------------------
-- 6) LEADERBOARD — aggregate donation units per donor without exposing
--    the donations table (owner/staff only) to anonymous users.
-- -------------------------------------------------------------------
create or replace function public.get_donor_leaderboard(p_limit int default 10)
returns table(id uuid, full_name text, blood_group text, photo_url text, units bigint)
language sql
security definer
stable
set search_path = public, extensions
as $$
  select d.id, d.full_name, d.blood_group, d.photo_url,
         coalesce(sum(don.units), 0)::bigint as units
  from public.donors d
  left join public.donations don on don.donor_id = d.id
  where d.approved and d.deleted_at is null and coalesce(d.public_visible, true)
  group by d.id, d.full_name, d.blood_group, d.photo_url
  order by units desc, d.created_at asc
  limit p_limit;
$$;

revoke all on function public.get_donor_leaderboard(int) from public;
grant execute on function public.get_donor_leaderboard(int) to anon, authenticated;

-- Public donation count for a single donor (donations are owner/staff-only,
-- so the public donor-verify page uses this instead of the base table).
create or replace function public.get_donor_donation_count(p_donor_id uuid)
returns bigint
language sql
security definer
stable
set search_path = public, extensions
as $$
  select count(*)::bigint from public.donations where donor_id = p_donor_id;
$$;

revoke all on function public.get_donor_donation_count(uuid) from public;
grant execute on function public.get_donor_donation_count(uuid) to anon, authenticated;

-- -------------------------------------------------------------------
-- 7) Donor contact: also reject unavailable (inactive) donors.
--    (Replaces the donor-privacy.sql version — same rate limit + logging,
--    plus an `is_available` requirement.)
-- -------------------------------------------------------------------
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
  where id = p_donor_id and approved and is_available and deleted_at is null;
  if v_phone is null then
    raise exception 'Donor not found' using errcode = 'P0002';
  end if;

  insert into public.donor_contact_events (donor_id, channel, ip_hash)
  values (p_donor_id, p_channel, p_ip_hash);
  return v_phone;
end;
$$;

revoke all on function public.get_donor_contact(uuid, text, text) from public;
grant execute on function public.get_donor_contact(uuid, text, text) to anon, authenticated;

-- -------------------------------------------------------------------
-- 8) Contact-event retention prune helper
--    (used by the scheduled cleanup in phase2-consent-retention.sql)
-- -------------------------------------------------------------------
create or replace function public.prune_contact_events(p_retention_days int default 90)
returns integer
language sql
security definer
set search_path = public, extensions
as $$
  with deleted as (
    delete from public.donor_contact_events
    where created_at < now() - make_interval(days => p_retention_days)
    returning 1
  )
  select count(*)::integer from deleted;
$$;

revoke all on function public.prune_contact_events(int) from public;
grant execute on function public.prune_contact_events(int) to service_role;
