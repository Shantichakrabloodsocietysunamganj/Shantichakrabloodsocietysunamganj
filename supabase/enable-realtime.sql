-- =====================================================================
--  লাইভ রক্তপ্রার্থী (Blood Seekers) সিস্টেম চালু করার SQL
--  ---------------------------------------------------------------
--  এই ফাইলটুকু Supabase Dashboard > SQL Editor এ পেস্ট করে "Run" চাপুন।
--  একবার চালালেই হবে। বারবার চালালেও কোনো ক্ষতি নেই (idempotent)।
--
--  এটি কী করে?
--   • blood_requests টেবিলকে Realtime-এ যুক্ত করে — কেউ রক্তের অনুরোধ
--     পোস্ট করলে সেটি সাথে সাথে সব ইউজারের স্ক্রিনে চলে আসে।
--   • donors টেবিলও Realtime-এ যুক্ত করে (নতুন দাতাও লাইভ দেখা যাবে)।
--   • লাইভ কুয়েরি দ্রুত করার জন্য index বানায়।
--
--  ⚠️ নোট: নতুন কোনো টেবিল বা কলাম লাগবে না — সব আগে থেকেই আছে।
-- =====================================================================

-- ১) DELETE ইভেন্টে পুরো row পাওয়ার জন্য (ক্লায়েন্ট যেন কার্ড সরাতে পারে)
alter table public.blood_requests replica identity full;
alter table public.donors         replica identity full;

-- ২) Realtime publication-এ টেবিল দুটি যোগ করা
do $$
begin
  -- publication না থাকলে তৈরি করি
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;

  -- blood_requests (রক্তের অনুরোধ) — মূল লাইভ টেবিল
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'blood_requests'
  ) then
    alter publication supabase_realtime add table public.blood_requests;
  end if;

  -- donors (রক্তদাতা)
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'donors'
  ) then
    alter publication supabase_realtime add table public.donors;
  end if;
end $$;

-- ৩) দ্রুত লাইভ কুয়েরির জন্য ইনডেক্স
create index if not exists blood_requests_live_idx
  on public.blood_requests (status, needed_date desc, created_at desc);
create index if not exists blood_requests_group_idx
  on public.blood_requests (blood_group);

-- =====================================================================
--  ✅ যাচাই করুন — নিচের কুয়েরি চালিয়ে দেখুন দুটি সারি আসে কি না
--     (blood_requests এবং donors)
-- =====================================================================
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
  and tablename in ('blood_requests', 'donors');
