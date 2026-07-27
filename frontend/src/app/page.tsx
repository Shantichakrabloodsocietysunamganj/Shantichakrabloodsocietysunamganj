import Link from "next/link";
import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import StatItem from "@/components/StatItem";
import RequestCard from "@/components/RequestCard";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/data/site";
import type { BloodRequest } from "@/lib/types";

// ডেটা একসাথে আনা হয় (server-side)
async function getData() {
  const supabase = createClient();
  try {
    const [donors, openReqs, recentReqs] = await Promise.all([
      supabase.from("donors").select("*", { count: "exact", head: true }),
      supabase
        .from("blood_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "open"),
      supabase
        .from("blood_requests")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    return {
      donorCount: donors.count ?? 0,
      openRequestCount: openReqs.count ?? 0,
      recent: (recentReqs.data as BloodRequest[] | null) ?? [],
      ok: !donors.error,
    };
  } catch {
    return { donorCount: 0, openRequestCount: 0, recent: [], ok: false };
  }
}

export default async function Home() {
  const { donorCount, openRequestCount, recent, ok } = await getData();

  const livesSaved = site.stats.livesSaved || Math.max(donorCount, 0);

  return (
    <>
      <Hero donorCount={donorCount} openRequestCount={openRequestCount} />

      {/* Stats */}
      <section className="container-page -mt-8">
        <div className="card grid grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
          <StatItem value={donorCount} label="নিবন্ধিত রক্তদাতা" />
          <StatItem value={openRequestCount} label="চলমান অনুরোধ" />
          <StatItem value={livesSaved} suffix="+" label="বাঁচানো জীবন" />
          <StatItem value={site.stats.upazilas} label="উপজেলা কভারেজ" />
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading
          eyebrow="কীভাবে কাজ করে"
          title="মাত্র ৩ ধাপে একটি জীবন বাঁচান"
          subtitle="সহজ, দ্রুত এবং সম্পূর্ণ স্বেচ্ছাসেবী — কোনো মধ্যস্বত্বভোগী নেই।"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Step
            n="১"
            title="রক্তদাতা হিসেবে নিবন্ধন করুন"
            desc="আপনার নাম, গ্রুপ ও এলাকা দিয়ে নিবন্ধন সম্পন্ন করুন। আপনি আমাদের দাতা নেটওয়ার্কে যুক্ত হবেন।"
            href="/become-donor"
            cta="নিবন্ধন করুন"
          />
          <Step
            n="২"
            title="রক্তের অনুরোধ পোস্ট করুন"
            desc="জরুরি প্রয়োজনে রোগীর তথ্য দিয়ে অনুরোধ পোস্ট করুন — সারা সুনামগঞ্জের দাতারা দেখতে পাবেন।"
            href="/request-blood"
            cta="অনুরোধ করুন"
          />
          <Step
            n="৩"
            title="সরাসরি যোগাযোগ করুন"
            desc="সঠিক গ্রুপের দাতা খুঁজে সরাসরি কল করুন। একটি সিদ্ধান্ত, একটি বাঁচা জীবন।"
            href="/donors"
            cta="দাতা খুঁজুন"
          />
        </div>
      </section>

      {/* Urgent requests */}
      <section className="bg-zinc-50 py-16 sm:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              center={false}
              eyebrow="এখনই দরকার"
              title="জরুরি রক্তের অনুরোধ"
              subtitle="এই মুহূর্তে সাহায্যের প্রয়োজন এমন রোগীদের তালিকা।"
            />
            <Link href="/requests" className="btn-outline shrink-0">সব অনুরোধ দেখুন →</Link>
          </div>

          {!ok ? (
            <div className="mt-10 card p-8 text-center text-sm text-zinc-500">
              <p className="font-medium text-zinc-700">⚠️ ডেটাবেস সংযোগ পাওয়া যায়নি</p>
              <p className="mt-1">ডেমো দেখতে Supabase-এ <code className="rounded bg-zinc-100 px-1.5 py-0.5">schema.sql</code> চালান (নির্দেশিকা README-তে আছে)।</p>
            </div>
          ) : recent.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {recent.map((r) => (
                <RequestCard key={r.id} req={r} />
              ))}
            </div>
          ) : (
            <div className="mt-10 card p-10 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
              <p className="font-medium text-zinc-800">এই মুহূর্তে কোনো জরুরি অনুরোধ নেই</p>
              <p className="mt-1 text-sm text-zinc-500">সবাই নিরাপদে আছেন — চাইলে আগে থেকেই রক্তদাতা হিসেবে নিবন্ধন করুন।</p>
            </div>
          )}
        </div>
      </section>

      {/* Why donate */}
      <section className="container-page py-16 sm:py-20">
        <SectionHeading eyebrow="কেন রক্ত দান করবেন" title="রক্তদানের উপকারিতা" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Benefit icon="❤️" title="হৃদরোগের ঝুঁকি কমে" desc="নিয়মিত রক্তদানে হার্ট অ্যাটাকের ঝুঁকি কমে।" />
          <Benefit icon="🩸" title="নতুন রক্ত তৈরি" desc="দেহ নতুন রক্তকণিকা তৈরি করে, শরীর সতেজ থাকে।" />
          <Benefit icon="🧬" title="স্বাস্থ্য পরীক্ষা" desc="প্রতিবার রক্তদানের আগে স্বাস্থ্য স্ক্রিনিং হয়।" />
          <Benefit icon="🙏" title="আধ্যাত্মিক শান্তি" desc="একটি অজানা মানুষের জীবন বাঁচানোর আনন্দ অপূর্ব।" />
        </div>
      </section>

      {/* CTA band */}
      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-8 py-12 text-center text-white sm:px-16 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="text-2xl font-bold sm:text-3xl">আজই একটি জীবন বাঁচানোর অংশীদার হোন</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">
            আপনার এক ইউনিট রক্ত তিনটি জীবন বাঁচাতে পারে। সুনামগঞ্জের এই মানবিক উদ্যোগে যুক্ত হোন আজই।
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/become-donor" className="btn bg-white text-brand-700 hover:bg-brand-50">
              রক্তদাতা হিসেবে নিবন্ধন করুন
            </Link>
            <Link href="/donors" className="btn border border-white/40 text-white hover:bg-white/10">
              রক্তদাতা খুঁজুন
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Step({ n, title, desc, href, cta }: { n: string; title: string; desc: string; href: string; cta: string }) {
  return (
    <div className="card relative p-6">
      <span className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white shadow-sm">
        {n}
      </span>
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{desc}</p>
        <Link href={href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
          {cta} →
        </Link>
      </div>
    </div>
  );
}

function Benefit({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{desc}</p>
    </div>
  );
}
