-- =====================================================================
--  Shantichakra Blood Society - Database Schema (ASCII, copy-safe)
--  Paste the whole file in Supabase SQL Editor and Run.
--  Safe to re-run (idempotent).
-- =====================================================================

create extension if not exists "pgcrypto";

-- 1) profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'user' check (role in ('user','donor','admin')),
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-create a profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- helper: is current user an admin (defined AFTER profiles exists)
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- 2) donors (+ new columns if the old table already exists)
create table if not exists public.donors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  phone text not null,
  blood_group text not null,
  gender text,
  age int,
  district text not null default 'Sunamganj',
  upazila text not null,
  union_name text,
  area text,
  photo_url text,
  last_donation_date date,
  is_available boolean not null default true,
  is_verified boolean not null default false,
  notes text,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- approval gate সরানো হয়েছে — নতুন donor সরাসরি live (default approved)
alter table public.donors add column if not exists approved boolean not null default true;
alter table public.donors alter column approved set default true;
update public.donors set approved = true where approved is not true;

-- 3) blood_requests (+ new columns if the old table already exists)
create table if not exists public.blood_requests (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  blood_group text not null,
  units_needed int not null default 1,
  hospital text not null,
  district text not null default 'Sunamganj',
  upazila text not null,
  needed_date date not null,
  contact_name text not null,
  contact_phone text not null,
  message text,
  request_type text not null default 'normal' check (request_type in ('emergency','normal')),
  status text not null default 'pending' check (status in ('pending','approved','completed','cancelled')),
  requested_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 4) donations
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid references public.donors(id) on delete cascade,
  request_id uuid references public.blood_requests(id) on delete set null,
  donated_at date not null default current_date,
  units int not null default 1,
  note text,
  created_at timestamptz not null default now()
);

-- 5) volunteers
create table if not exists public.volunteers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  upazila text,
  role text,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now()
);

-- 6) blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  excerpt text,
  content text,
  cover_url text,
  author text,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7) gallery
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text not null,
  category text default 'organization',
  created_at timestamptz not null default now()
);

-- 8) events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  event_date date not null,
  cover_url text,
  status text not null default 'upcoming' check (status in ('upcoming','ongoing','completed')),
  created_at timestamptz not null default now()
);

-- 9) notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  type text default 'general',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 10) reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year int,
  file_url text,
  summary text,
  created_at timestamptz not null default now()
);

-- 11) contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- 12) site_settings (single row, id=1) - editable from admin panel
create table if not exists public.site_settings (
  id int primary key default 1,
  logo_url text,
  org_name text,
  phone text,
  email text,
  address text,
  facebook text,
  whatsapp text,
  youtube text,
  map_url text,
  hero_image text,
  updated_at timestamptz not null default now(),
  check (id = 1)
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;
-- add new columns if old site_settings already exists
alter table public.site_settings add column if not exists hero_badge text;
alter table public.site_settings add column if not exists hero_desc text;
alter table public.site_settings add column if not exists mission text;
alter table public.site_settings add column if not exists vision text;
alter table public.site_settings add column if not exists meta_title text;
alter table public.site_settings add column if not exists meta_description text;
alter table public.site_settings add column if not exists meta_keywords text;
alter table public.site_settings add column if not exists og_image text;
alter table public.site_settings add column if not exists ga_id text;

-- 13) testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  message text not null,
  rating int default 5,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- 14) committee_members
create table if not exists public.committee_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  category text not null default 'member',
  photo_url text,
  "order" int default 0,
  created_at timestamptz not null default now()
);

-- 15) activity_logs
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor text,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

-- 16) faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  "order" int default 0,
  created_at timestamptz not null default now()
);

-- 17) partners
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  "order" int default 0,
  created_at timestamptz not null default now()
);

-- 18) soft-delete columns on main content tables
alter table public.donors add column if not exists deleted_at timestamptz;
alter table public.blood_requests add column if not exists deleted_at timestamptz;
alter table public.volunteers add column if not exists deleted_at timestamptz;
alter table public.events add column if not exists deleted_at timestamptz;
alter table public.blogs add column if not exists deleted_at timestamptz;
alter table public.testimonials add column if not exists deleted_at timestamptz;
alter table public.committee_members add column if not exists deleted_at timestamptz;
alter table public.gallery add column if not exists deleted_at timestamptz;
alter table public.partners add column if not exists deleted_at timestamptz;
alter table public.faqs add column if not exists deleted_at timestamptz;

-- enable Row Level Security
alter table public.profiles        enable row level security;
alter table public.donors          enable row level security;
alter table public.blood_requests  enable row level security;
alter table public.donations       enable row level security;
alter table public.volunteers      enable row level security;
alter table public.blogs           enable row level security;
alter table public.gallery         enable row level security;
alter table public.events          enable row level security;
alter table public.notifications   enable row level security;
alter table public.reports         enable row level security;
alter table public.contacts        enable row level security;

-- profiles policies
drop policy if exists "Public profiles read" on public.profiles;
create policy "Public profiles read" on public.profiles for select using (true);
drop policy if exists "Own profile update" on public.profiles;
-- নিজের প্রোফাইল অথবা অ্যাডমিন যে কোনো প্রোফাইল আপডেট করতে পারবে (role/verify বদলানোসহ)
create policy "Own profile update" on public.profiles
  for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());
drop policy if exists "Own profile insert" on public.profiles;
create policy "Own profile insert" on public.profiles for insert with check (auth.uid() = id);

-- donors policies
drop policy if exists "Public donor read" on public.donors;
create policy "Public donor read" on public.donors for select using (approved or public.is_admin());
drop policy if exists "Anyone register donor" on public.donors;
create policy "Anyone register donor" on public.donors for insert with check (true);
drop policy if exists "Donor or admin update" on public.donors;
create policy "Donor or admin update" on public.donors for update using (user_id = auth.uid() or public.is_admin());
drop policy if exists "Admin donors delete" on public.donors;
create policy "Admin donors delete" on public.donors for delete using (public.is_admin());

-- blood_requests policies
drop policy if exists "Public blood request read" on public.blood_requests;
create policy "Public blood request read" on public.blood_requests for select using (true);
drop policy if exists "Anyone post blood request" on public.blood_requests;
create policy "Anyone post blood request" on public.blood_requests for insert with check (true);
drop policy if exists "Requester or admin update" on public.blood_requests;
create policy "Requester or admin update" on public.blood_requests for update using (requested_by = auth.uid() or public.is_admin());
drop policy if exists "Admin requests delete" on public.blood_requests;
create policy "Admin requests delete" on public.blood_requests for delete using (public.is_admin());

-- donations policies
drop policy if exists "Donor/admin donations read" on public.donations;
create policy "Donor/admin donations read" on public.donations for select using (
  exists (select 1 from public.donors d where d.id = donor_id and d.user_id = auth.uid())
  or public.is_admin()
);
drop policy if exists "Admin donations write" on public.donations;
create policy "Admin donations write" on public.donations for insert with check (public.is_admin());
-- অ্যাডমিন রক্তদান রেকর্ড মুছতে পারবে
drop policy if exists "Admin donations delete" on public.donations;
create policy "Admin donations delete" on public.donations for delete using (public.is_admin());
-- অ্যাডমিন রক্তদান রেকর্ড আপডেট করতে পারবে
drop policy if exists "Admin donations update" on public.donations;
create policy "Admin donations update" on public.donations for update using (public.is_admin());

-- volunteers policies
drop policy if exists "Public volunteers read" on public.volunteers;
create policy "Public volunteers read" on public.volunteers for select using (true);
drop policy if exists "Anyone apply volunteer" on public.volunteers;
create policy "Anyone apply volunteer" on public.volunteers for insert with check (true);
drop policy if exists "Admin manage volunteers" on public.volunteers;
create policy "Admin manage volunteers" on public.volunteers for update using (public.is_admin());
drop policy if exists "Admin volunteers delete" on public.volunteers;
create policy "Admin volunteers delete" on public.volunteers for delete using (public.is_admin());

-- blogs policies
drop policy if exists "Public blogs read" on public.blogs;
create policy "Public blogs read" on public.blogs for select using (published or public.is_admin());
drop policy if exists "Admin blogs write" on public.blogs;
create policy "Admin blogs write" on public.blogs for insert with check (public.is_admin());
drop policy if exists "Admin blogs update" on public.blogs;
create policy "Admin blogs update" on public.blogs for update using (public.is_admin());
drop policy if exists "Admin blogs delete" on public.blogs;
create policy "Admin blogs delete" on public.blogs for delete using (public.is_admin());

-- gallery policies
drop policy if exists "Public gallery read" on public.gallery;
create policy "Public gallery read" on public.gallery for select using (true);
drop policy if exists "Admin gallery write" on public.gallery;
create policy "Admin gallery write" on public.gallery for insert with check (public.is_admin());
drop policy if exists "Admin gallery update" on public.gallery;
create policy "Admin gallery update" on public.gallery for update using (public.is_admin());
drop policy if exists "Admin gallery delete" on public.gallery;
create policy "Admin gallery delete" on public.gallery for delete using (public.is_admin());

-- events policies
drop policy if exists "Public events read" on public.events;
create policy "Public events read" on public.events for select using (true);
drop policy if exists "Admin events write" on public.events;
create policy "Admin events write" on public.events for insert with check (public.is_admin());
drop policy if exists "Admin events update" on public.events;
create policy "Admin events update" on public.events for update using (public.is_admin());
drop policy if exists "Admin events delete" on public.events;
create policy "Admin events delete" on public.events for delete using (public.is_admin());

-- notifications policies (own only; admin can read all + broadcast)
drop policy if exists "Own notifications read" on public.notifications;
create policy "Own notifications read" on public.notifications
  for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "Own notifications update" on public.notifications;
create policy "Own notifications update" on public.notifications for update using (user_id = auth.uid());
-- অ্যাডমিন সব ইউজারকে notification পাঠাতে পারবে (broadcast)
drop policy if exists "Admin notifications insert" on public.notifications;
create policy "Admin notifications insert" on public.notifications
  for insert with check (public.is_admin());
-- অ্যাডমিন notification মুছতে পারবে
drop policy if exists "Admin notifications delete" on public.notifications;
create policy "Admin notifications delete" on public.notifications for delete using (public.is_admin());

-- reports policies
drop policy if exists "Public reports read" on public.reports;
create policy "Public reports read" on public.reports for select using (true);
drop policy if exists "Admin reports write" on public.reports;
create policy "Admin reports write" on public.reports for insert with check (public.is_admin());
-- অ্যাডমিন report পরিচালনা করতে পারবে
drop policy if exists "Admin reports update" on public.reports;
create policy "Admin reports update" on public.reports for update using (public.is_admin());
drop policy if exists "Admin reports delete" on public.reports;
create policy "Admin reports delete" on public.reports for delete using (public.is_admin());

-- contacts policies
drop policy if exists "Anyone submit contact" on public.contacts;
create policy "Anyone submit contact" on public.contacts for insert with check (true);
drop policy if exists "Admin contacts read" on public.contacts;
create policy "Admin contacts read" on public.contacts for select using (public.is_admin());
drop policy if exists "Admin contacts delete" on public.contacts;
create policy "Admin contacts delete" on public.contacts for delete using (public.is_admin());

-- site_settings policies (public read, admin write)
alter table public.site_settings enable row level security;
drop policy if exists "Public settings read" on public.site_settings;
create policy "Public settings read" on public.site_settings for select using (true);
drop policy if exists "Admin settings write" on public.site_settings;
create policy "Admin settings write" on public.site_settings
  for update using (public.is_admin()) with check (public.is_admin());

-- testimonials policies (public read approved, anyone submit, admin manage)
alter table public.testimonials enable row level security;
drop policy if exists "Public testimonials read" on public.testimonials;
create policy "Public testimonials read" on public.testimonials for select using (approved or public.is_admin());
drop policy if exists "Anyone submit testimonial" on public.testimonials;
create policy "Anyone submit testimonial" on public.testimonials for insert with check (true);
drop policy if exists "Admin testimonials update" on public.testimonials;
create policy "Admin testimonials update" on public.testimonials for update using (public.is_admin());
drop policy if exists "Admin testimonials delete" on public.testimonials;
create policy "Admin testimonials delete" on public.testimonials for delete using (public.is_admin());

-- committee_members policies (public read, admin manage)
alter table public.committee_members enable row level security;
drop policy if exists "Public committee read" on public.committee_members;
create policy "Public committee read" on public.committee_members for select using (true);
drop policy if exists "Admin committee write" on public.committee_members;
create policy "Admin committee write" on public.committee_members for insert with check (public.is_admin());
drop policy if exists "Admin committee update" on public.committee_members;
create policy "Admin committee update" on public.committee_members for update using (public.is_admin());
drop policy if exists "Admin committee delete" on public.committee_members;
create policy "Admin committee delete" on public.committee_members for delete using (public.is_admin());

-- activity_logs policies (admin read, authenticated insert)
alter table public.activity_logs enable row level security;
drop policy if exists "Admin activity read" on public.activity_logs;
create policy "Admin activity read" on public.activity_logs for select using (public.is_admin());
drop policy if exists "Auth insert activity" on public.activity_logs;
create policy "Auth insert activity" on public.activity_logs for insert with check (auth.uid() is not null);

-- faqs policies (public read, admin manage)
alter table public.faqs enable row level security;
drop policy if exists "Public faqs read" on public.faqs;
create policy "Public faqs read" on public.faqs for select using (true);
drop policy if exists "Admin faqs write" on public.faqs;
create policy "Admin faqs write" on public.faqs for insert with check (public.is_admin());
drop policy if exists "Admin faqs update" on public.faqs;
create policy "Admin faqs update" on public.faqs for update using (public.is_admin());
drop policy if exists "Admin faqs delete" on public.faqs;
create policy "Admin faqs delete" on public.faqs for delete using (public.is_admin());

-- partners policies (public read, admin manage)
alter table public.partners enable row level security;
drop policy if exists "Public partners read" on public.partners;
create policy "Public partners read" on public.partners for select using (true);
drop policy if exists "Admin partners write" on public.partners;
create policy "Admin partners write" on public.partners for insert with check (public.is_admin());
drop policy if exists "Admin partners delete" on public.partners;
create policy "Admin partners delete" on public.partners for delete using (public.is_admin());
drop policy if exists "Admin partners update" on public.partners;
create policy "Admin partners update" on public.partners for update using (public.is_admin());

-- 19) media_coverage (press / news coverage)
create table if not exists public.media_coverage (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text not null,
  url text,
  summary text,
  thumbnail text,
  category text default 'online',
  published_date date,
  created_at timestamptz not null default now()
);
alter table public.media_coverage enable row level security;
drop policy if exists "Public media read" on public.media_coverage;
create policy "Public media read" on public.media_coverage for select using (true);
drop policy if exists "Admin media write" on public.media_coverage;
create policy "Admin media write" on public.media_coverage for insert with check (public.is_admin());
drop policy if exists "Admin media update" on public.media_coverage;
create policy "Admin media update" on public.media_coverage for update using (public.is_admin());
drop policy if exists "Admin media delete" on public.media_coverage;
create policy "Admin media delete" on public.media_coverage for delete using (public.is_admin());

-- impact stats (aggregate counts; callable by anyone via RPC)
create or replace function public.impact_stats()
returns table(donors bigint, completed bigint, active_requests bigint, volunteers bigint, donations bigint, units bigint)
language sql security definer stable as $$
  select
    (select count(*) from public.donors where approved and deleted_at is null),
    (select count(*) from public.blood_requests where status = 'completed' and deleted_at is null),
    (select count(*) from public.blood_requests where status in ('pending','approved') and deleted_at is null),
    (select count(*) from public.volunteers where deleted_at is null),
    (select count(*) from public.donations),
    (select coalesce(sum(units),0) from public.donations);
$$;

-- indexes for fast search
create index if not exists donors_blood_group_idx on public.donors(blood_group);
create index if not exists donors_upazila_idx on public.donors(upazila);
create index if not exists donors_is_available_idx on public.donors(is_available);
create index if not exists donors_is_verified_idx on public.donors(is_verified);
create index if not exists donors_approved_idx on public.donors(approved);
create index if not exists blood_requests_status_idx on public.blood_requests(status);
create index if not exists blood_requests_blood_group_idx on public.blood_requests(blood_group);
create index if not exists donations_donor_idx on public.donations(donor_id);
create index if not exists notifications_user_idx on public.notifications(user_id);

-- =====================================================
-- MODERATOR ROLE: staff = admin OR moderator
-- Blood-related tables managed by staff; admin-only features stay admin
-- =====================================================

-- allow 'moderator' in profiles.role
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('user','donor','admin','moderator'));

-- helper: is current user staff (admin or moderator)?
create or replace function public.is_staff()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','moderator')
  );
$$;

-- blood_requests: staff can update + delete
drop policy if exists "Requester or admin update" on public.blood_requests;
create policy "Requester or staff update" on public.blood_requests for update using (requested_by = auth.uid() or public.is_staff());
drop policy if exists "Admin requests delete" on public.blood_requests;
create policy "Staff requests delete" on public.blood_requests for delete using (public.is_staff());

-- donors: staff can update + delete
drop policy if exists "Donor or admin update" on public.donors;
create policy "Donor or staff update" on public.donors for update using (user_id = auth.uid() or public.is_staff());
drop policy if exists "Admin donors delete" on public.donors;
create policy "Staff donors delete" on public.donors for delete using (public.is_staff());

-- donations: staff can read/write/update/delete
drop policy if exists "Donor/admin donations read" on public.donations;
create policy "Staff donations read" on public.donations for select using (
  exists (select 1 from public.donors d where d.id = donor_id and d.user_id = auth.uid())
  or public.is_staff()
);
drop policy if exists "Admin donations write" on public.donations;
create policy "Staff donations write" on public.donations for insert with check (public.is_staff());
drop policy if exists "Admin donations update" on public.donations;
create policy "Staff donations update" on public.donations for update using (public.is_staff());
drop policy if exists "Admin donations delete" on public.donations;
create policy "Staff donations delete" on public.donations for delete using (public.is_staff());

-- events: staff can write/update/delete
drop policy if exists "Admin events write" on public.events;
create policy "Staff events write" on public.events for insert with check (public.is_staff());
drop policy if exists "Admin events update" on public.events;
create policy "Staff events update" on public.events for update using (public.is_staff());
drop policy if exists "Admin events delete" on public.events;
create policy "Staff events delete" on public.events for delete using (public.is_staff());

-- volunteers: staff can manage
drop policy if exists "Admin manage volunteers" on public.volunteers;
create policy "Staff manage volunteers" on public.volunteers for update using (public.is_staff());
drop policy if exists "Admin volunteers delete" on public.volunteers;
create policy "Staff volunteers delete" on public.volunteers for delete using (public.is_staff());

-- blogs, gallery, testimonials, faqs, committee, media_coverage, activity, contacts
drop policy if exists "Admin blogs write" on public.blogs; create policy "Staff blogs write" on public.blogs for insert with check (public.is_staff());
drop policy if exists "Admin blogs update" on public.blogs; create policy "Staff blogs update" on public.blogs for update using (public.is_staff());
drop policy if exists "Admin blogs delete" on public.blogs; create policy "Staff blogs delete" on public.blogs for delete using (public.is_staff());
drop policy if exists "Admin gallery write" on public.gallery; create policy "Staff gallery write" on public.gallery for insert with check (public.is_staff());
drop policy if exists "Admin gallery update" on public.gallery; create policy "Staff gallery update" on public.gallery for update using (public.is_staff());
drop policy if exists "Admin gallery delete" on public.gallery; create policy "Staff gallery delete" on public.gallery for delete using (public.is_staff());
drop policy if exists "Admin testimonials update" on public.testimonials; create policy "Staff testimonials update" on public.testimonials for update using (public.is_staff());
drop policy if exists "Admin testimonials delete" on public.testimonials; create policy "Staff testimonials delete" on public.testimonials for delete using (public.is_staff());
drop policy if exists "Admin faqs write" on public.faqs; create policy "Staff faqs write" on public.faqs for insert with check (public.is_staff());
drop policy if exists "Admin faqs update" on public.faqs; create policy "Staff faqs update" on public.faqs for update using (public.is_staff());
drop policy if exists "Admin faqs delete" on public.faqs; create policy "Staff faqs delete" on public.faqs for delete using (public.is_staff());
drop policy if exists "Admin committee write" on public.committee_members; create policy "Staff committee write" on public.committee_members for insert with check (public.is_staff());
drop policy if exists "Admin committee update" on public.committee_members; create policy "Staff committee update" on public.committee_members for update using (public.is_staff());
drop policy if exists "Admin committee delete" on public.committee_members; create policy "Staff committee delete" on public.committee_members for delete using (public.is_staff());
drop policy if exists "Admin media write" on public.media_coverage; create policy "Staff media write" on public.media_coverage for insert with check (public.is_staff());
drop policy if exists "Admin media update" on public.media_coverage; create policy "Staff media update" on public.media_coverage for update using (public.is_staff());
drop policy if exists "Admin media delete" on public.media_coverage; create policy "Staff media delete" on public.media_coverage for delete using (public.is_staff());
drop policy if exists "Admin activity read" on public.activity_logs; create policy "Staff activity read" on public.activity_logs for select using (public.is_staff());
drop policy if exists "Admin contacts read" on public.contacts; create policy "Staff contacts read" on public.contacts for select using (public.is_staff());
drop policy if exists "Admin contacts delete" on public.contacts; create policy "Staff contacts delete" on public.contacts for delete using (public.is_staff());

-- REMAIN ADMIN-ONLY: profiles update (role mgmt), site_settings,
-- notifications broadcast, reports, partners — keep is_admin()

-- রোগীর অতিরিক্ত তথ্য (হিমোগ্লোবিন ইত্যাদি)
alter table public.blood_requests add column if not exists hemoglobin text;
alter table public.blood_requests add column if not exists patient_age int;
alter table public.blood_requests add column if not exists patient_gender text;
alter table public.blood_requests add column if not exists disease text;
alter table public.blood_requests add column if not exists blood_component text default 'whole_blood';

-- =====================================================
-- SOFT-DELETE FILTER: deleted items hidden from public (RLS level)
-- =====================================================

-- donors: public sees only approved + not-deleted; staff sees all
drop policy if exists "Public donor read" on public.donors;
create policy "Public donor read" on public.donors
  for select using ((approved and deleted_at is null) or public.is_staff());

-- blood_requests: public sees only not-deleted; staff sees all
drop policy if exists "Public blood request read" on public.blood_requests;
create policy "Public blood request read" on public.blood_requests
  for select using (deleted_at is null or public.is_staff());

-- events
drop policy if exists "Public events read" on public.events;
create policy "Public events read" on public.events
  for select using (deleted_at is null or public.is_staff());

-- volunteers
drop policy if exists "Public volunteers read" on public.volunteers;
create policy "Public volunteers read" on public.volunteers
  for select using (deleted_at is null or public.is_staff());

-- blogs: published + not-deleted for public; staff sees all
drop policy if exists "Public blogs read" on public.blogs;
create policy "Public blogs read" on public.blogs
  for select using ((published and deleted_at is null) or public.is_staff());

-- gallery
drop policy if exists "Public gallery read" on public.gallery;
create policy "Public gallery read" on public.gallery
  for select using (deleted_at is null or public.is_staff());

-- testimonials: approved + not-deleted for public
drop policy if exists "Public testimonials read" on public.testimonials;
create policy "Public testimonials read" on public.testimonials
  for select using ((approved and deleted_at is null) or public.is_staff());

-- committee_members
drop policy if exists "Public committee read" on public.committee_members;
create policy "Public committee read" on public.committee_members
  for select using (deleted_at is null or public.is_staff());

-- faqs
drop policy if exists "Public faqs read" on public.faqs;
create policy "Public faqs read" on public.faqs
  for select using (deleted_at is null or public.is_staff());

-- partners (admin-only manage)
drop policy if exists "Public partners read" on public.partners;
create policy "Public partners read" on public.partners
  for select using (deleted_at is null or public.is_admin());

-- 20) donation_methods (bKash/Nagad/Rocket/Bank)
create table if not exists public.donation_methods (
  id uuid primary key default gen_random_uuid(),
  method_name text not null,
  account_number text not null,
  account_type text,
  logo_url text,
  qr_url text,
  instructions text,
  is_active boolean not null default true,
  "order" int default 0,
  created_at timestamptz not null default now()
);
alter table public.donation_methods enable row level security;
drop policy if exists "Public donation methods read" on public.donation_methods;
create policy "Public donation methods read" on public.donation_methods for select using (is_active and deleted_at is null or public.is_staff());
drop policy if exists "Staff donation methods write" on public.donation_methods;
create policy "Staff donation methods write" on public.donation_methods for insert with check (public.is_staff());
drop policy if exists "Staff donation methods update" on public.donation_methods;
create policy "Staff donation methods update" on public.donation_methods for update using (public.is_staff());
drop policy if exists "Staff donation methods delete" on public.donation_methods;
create policy "Staff donation methods delete" on public.donation_methods for delete using (public.is_staff());
alter table public.donation_methods add column if not exists deleted_at timestamptz;

-- DONE
