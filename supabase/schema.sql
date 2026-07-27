-- =====================================================================
--  শান্তিচক্র রক্তদান সমিতি — Supabase ডেটাবেস স্কিমা
--  Supabase Dashboard → SQL Editor-এ গিয়ে পুরো ফাইলটি পেস্ট করে চালান।
-- =====================================================================

-- প্রয়োজনীয় এক্সটেনশন (uuid তৈরির জন্য)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- ১) রক্তদাতা টেবিল
-- ---------------------------------------------------------------------
create table if not exists public.donors (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text not null,
  phone               text not null,
  blood_group         text not null,
  gender              text,
  age                 int,
  district            text not null default 'সুনামগঞ্জ',
  upazila             text not null,
  area                text,
  photo_url           text,
  last_donation_date  date,
  is_available        boolean not null default true,
  notes               text,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ২) রক্তের জরুরি অনুরোধ টেবিল
-- ---------------------------------------------------------------------
create table if not exists public.blood_requests (
  id             uuid primary key default gen_random_uuid(),
  patient_name   text not null,
  blood_group    text not null,
  units_needed   int not null default 1,
  hospital       text not null,
  district       text not null default 'সুনামগঞ্জ',
  upazila        text not null,
  needed_date    date not null,
  contact_name   text not null,
  contact_phone  text not null,
  message        text,
  status         text not null default 'open',  -- open | fulfilled | closed
  created_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ৩) যোগাযোগ বার্তা টেবিল
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text,
  phone       text,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security চালু
-- ---------------------------------------------------------------------
alter table public.donors            enable row level security;
alter table public.blood_requests    enable row level security;
alter table public.contact_messages  enable row level security;

-- রক্তদাতা: সবাই দেখতে পারবে + যে কেউ নিবন্ধন করতে পারবে
drop policy if exists "Public can view donors" on public.donors;
create policy "Public can view donors" on public.donors
  for select using (true);

drop policy if exists "Anyone can register as donor" on public.donors;
create policy "Anyone can register as donor" on public.donors
  for insert with check (true);

-- রক্তের অনুরোধ: সবাই দেখবে + যে কেউ অনুরোধ পost করতে পারবে
drop policy if exists "Public can view blood requests" on public.blood_requests;
create policy "Public can view blood requests" on public.blood_requests
  for select using (true);

drop policy if exists "Anyone can post blood request" on public.blood_requests;
create policy "Anyone can post blood request" on public.blood_requests
  for insert with check (true);

-- যোগাযোগ বার্তা: যে কেউ পাঠাতে পারবে (শুধু insert)
drop policy if exists "Anyone can submit contact message" on public.contact_messages;
create policy "Anyone can submit contact message" on public.contact_messages
  for insert with check (true);

-- নোট: ডিলিট/আপডেট শুধুমাত্র service_role দিয়ে (Supabase Dashboard) সম্ভব।
-- অর্থাৎ সাধারণ ভিজিটর কারো ডেটা মুছতে বা পরিবর্তন করতে পারবে না।

-- ---------------------------------------------------------------------
-- ইনডেক্স (দ্রুত সার্চের জন্য)
-- ---------------------------------------------------------------------
create index if not exists donors_blood_group_idx        on public.donors(blood_group);
create index if not exists donors_upazila_idx            on public.donors(upazila);
create index if not exists donors_is_available_idx       on public.donors(is_available);
create index if not exists blood_requests_status_idx     on public.blood_requests(status);
create index if not exists blood_requests_blood_group_idx on public.blood_requests(blood_group);
create index if not exists blood_requests_needed_date_idx on public.blood_requests(needed_date);

-- সম্পন্ন ✓ — এখন frontend চালু করলেই সব কাজ করবে।
