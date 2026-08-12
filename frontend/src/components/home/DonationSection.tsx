"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Link from "next/link";

type Method = { id?: string; method_name: string; account_number: string; account_type?: string | null; logo_url?: string | null; qr_url?: string | null; instructions?: string | null; color?: string };

const WHY = [
  { icon: "🚨", bn: "জরুরি রক্ত সমন্বয় — যেকোনো সময় দাতা খুঁজে রোগীর কাছে পৌঁছে দেওয়া", en: "Emergency blood coordination — finding donors anytime" },
  { icon: "🙋", bn: "স্বেচ্ছাসেবক নেটওয়ার্ক — এলাকাভিত্তিক স্বেচ্ছাসেবক পরিচালনা", en: "Volunteer network — area-based volunteer management" },
  { icon: "📢", bn: "সচেতনতামূলক প্রচার — নিরাপদ রক্তদানে উৎসাহিত করা", en: "Awareness campaigns — promoting safe blood donation" },
  { icon: "💻", bn: "প্রযুক্তি — ওয়েবসাইট, অ্যাপ ও ডেটাবেস পরিচালনা", en: "Technology — website, database & platform maintenance" },
  { icon: "🩸", bn: "রক্তদান শিবির — নিয়মিত ফ্রি রক্ত গ্রুপ নির্ধারণ ও শিবির", en: "Blood donation camps — free grouping & camps" },
  { icon: "🤝", bn: "সামাজিক সেবা — দরিদ্র রোগীদের বিনামূল্যে সহায়তা", en: "Community outreach — free help for needy patients" },
];

const WHAT_WE_DO = [
  { icon: "🩸", bn: "রক্তদাতা যুক্ত করি", en: "Connect Blood Donors", desc_bn: "সিলেট বিভাগ জুড়ে নিবন্ধিত দাতাদের এক ছাদে — রোগীর প্রয়োজনে তাৎক্ষণিক যুক্ত করি।", desc_en: "Registered donors across Sylhet — instantly connected to patients in need." },
  { icon: "🚨", bn: "জরুরি সেবা ২৪/৭", en: "24/7 Emergency Service", desc_bn: "মাঝরাতেও রক্তের প্রয়োজন হলে আমরা পাশে — কোনো বিরতি নেই।", desc_en: "Blood needed at midnight? We're there — no breaks." },
  { icon: "📍", bn: "এলাকায় সক্রিয়", en: "Grassroots Presence", desc_bn: "সিলেট বিভাগের ৪ জেলা ও বিভিন্ন উপজেলায় আমাদের স্বেচ্ছাসেবী রক্তদাতা নেটওয়ার্ক বিস্তার লাভ করছে।", desc_en: "Growing volunteer & donor network across 4 districts of Sylhet." },
  { icon: "💯", bn: "সম্পূর্ণ ফ্রি", en: "100% Free Service", desc_bn: "কোনো অর্থের লেনদেন নেই — পুরোটাই মানবিক, স্বেচ্ছাসেবী।", desc_en: "No money involved — purely humanitarian & voluntary." },
];

const TIMELINE = [
  { icon: "💰", bn: "আপনার অনুদান", en: "Your Donation" },
  { icon: "🙋", bn: "স্বেচ্ছাসেবক সহায়তা", en: "Volunteer Support" },
  { icon: "🩸", bn: "রক্ত সমন্বয়", en: "Blood Coordination" },
  { icon: "🏥", bn: "রোগী রক্ত পান", en: "Patient Receives Blood" },
  { icon: "❤️", bn: "একটি জীবন বাঁচে", en: "A Life is Saved" },
];

export default function DonationSection({ lang, donorCount = 0 }: { lang: Lang; donorCount?: number }) {
  const en = lang === "en";
  const supabase = createClient();
  const [methods, setMethods] = useState<Method[]>([]);
  const [hasMethods, setHasMethods] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [stats, setStats] = useState({ donors: donorCount, completed: 0, units: 0, volunteers: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("donation_methods").select("*").eq("is_active", true).order("order", { ascending: true });
        if (data && data.length) { setMethods(data); setHasMethods(true); }
        const { data: rpc } = await supabase.rpc("impact_stats");
        if (rpc && rpc[0]) {
          setStats({
            ...rpc[0],
            donors: Math.max((rpc[0] as any).donors || 0, donorCount),
          });
        }
      } catch {}
    })();
  }, [supabase, donorCount]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(null), 2000); };

  const trustItems = [
    { value: Math.max(stats.donors, donorCount), label: en ? "Registered Donors" : "নিবন্ধিত দাতা" },
    { value: stats.completed, label: en ? "Patients Helped" : "সাহায্যপ্রাপ্ত রোগী" },
    { value: stats.units, label: en ? "Blood Units" : "রক্ত ইউনিট" },
    { value: stats.volunteers, label: en ? "Volunteers" : "স্বেচ্ছাসেবক" },
  ];

  return (
    <section id="donate" className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/30 py-16 dark:from-slate-950 dark:to-slate-900">
      <div className="container-page">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blood-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blood-600">❤️ {en ? "Support Us" : "সহযোগিতা করুন"}</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{en ? "Support Our Mission" : "আমাদের মিশনে পাশে দাঁড়ান"}</h2>
            <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
          </div>
        </Reveal>

        {/* আমরা কী করি — Convince / Explain */}
        <Reveal delay={100}>
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50/60 to-white p-6 text-center dark:border-white/5 dark:from-white/5">
            <p className="text-base leading-relaxed text-ink/70">
              {en
                ? "Every day across Sylhet, patients fight for survival — waiting for the right blood. We connect them with registered donors in minutes. But running a 24/7 blood network costs money — technology, awareness camps, volunteer coordination. Your support keeps this life-saving service alive."
                : "প্রতিদিন সিলেট জুড়ে রোগীরা বেঁচে থাকার লড়াই করে — সঠিক রক্তের জন্য অপেক্ষা করে। আমরা মাত্র কয়েক মিনিটে তাদের নিবন্ধিত দাতার সাথে যুক্ত করি। কিন্তু একটি ২৪/৭ রক্তদান নেটওয়ার্ক চালানোর খরচ আছে — প্রযুক্তি, সচেতনতামূলক শিবির, স্বেচ্ছাসেবক সমন্বয়। আপনার সহযোগিতায় এই জীবনরক্ষার সেবা টিকে থাকে।"}
            </p>
          </div>
        </Reveal>

        {/* What We Do cards */}
        <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WHAT_WE_DO.map((w, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card-hover h-full p-5 text-center">
                <span className="text-3xl">{w.icon}</span>
                <h3 className="mt-2 font-display text-sm font-bold text-ink">{en ? w.en : w.bn}</h3>
                <p className="mt-1 text-xs leading-relaxed text-ink/50">{en ? w.desc_en : w.desc_bn}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Trust indicators */}
        <Reveal delay={100}>
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {trustItems.map((t, i) => (
              <div key={i} className="card p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-brand-600 sm:text-3xl"><CountUp end={t.value} /></p>
                <p className="mt-0.5 text-[11px] font-medium text-ink/55">{t.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Emotional appeal */}
        <Reveal delay={150}>
          <div className="mx-auto mt-10 max-w-2xl text-center">
            <p className="font-display text-lg font-bold text-blood-600">
              {en ? "One unit of blood saves three lives. Your donation keeps the network running." : "এক ইউনিট রক্ত তিনটি জীবন বাঁচায়। আপনার সহযোগিতায় এই নেটওয়ার্ক চলমান থাকে।"}
            </p>
          </div>
        </Reveal>

        {/* Donation method cards — ONLY if admin has added them */}
        {hasMethods ? (
          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methods.map((m, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card-hover group relative flex flex-col overflow-hidden p-5">
                  <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: m.color || "#0b4f9c" }} />
                  <div className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-extrabold text-white shadow-md" style={{ background: m.color || "#0b4f9c" }}>
                      {m.method_name.charAt(0)}
                    </span>
                    <span className="font-display text-sm font-bold text-ink">{m.method_name}</span>
                  </div>
                  <p className="mt-3 break-all text-sm font-bold text-ink">{m.account_number}</p>
                  {m.account_type && <p className="text-[11px] text-ink/40">{m.account_type}</p>}
                  <button onClick={() => copy(m.account_number)} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 transition hover:bg-brand-100 dark:bg-white/5">
                    {copied === m.account_number ? "✓ " + (en ? "Copied!" : "কপি হয়েছে!") : `📋 ${en ? "Copy" : "কপি করুন"}`}
                  </button>
                  {m.instructions && <p className="mt-2 text-[11px] leading-relaxed text-ink/45">{m.instructions}</p>}
                  {m.qr_url && (
                    <div className="mt-3 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.qr_url} alt={`${m.method_name} QR`} className="h-24 w-24 rounded-lg object-contain ring-1 ring-zinc-100" />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="mx-auto mt-10 max-w-md rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-8 text-center dark:border-white/10 dark:bg-white/5">
              <p className="text-2xl">💳</p>
              <p className="mt-2 font-medium text-ink">{en ? "Payment methods coming soon" : "পেমেন্ট মেথড শীঘ্রই আসছে"}</p>
              <p className="mt-1 text-sm text-ink/55">{en ? "We're setting up secure donation channels. Meanwhile, contact us directly." : "নিরাপদ ডোনেশন চ্যানেল সেট করা হচ্ছে। এখন সরাসরি যোগাযোগ করুন।"}</p>
              <Link href="/contact" className="btn-primary mt-4">📞 {en ? "Contact Us" : "যোগাযোগ করুন"}</Link>
            </div>
          </Reveal>
        )}

        {/* CTA buttons */}
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/volunteer" className="btn-primary">{en ? "Become a Supporter" : "সমর্থক হোন"}</Link>
            <Link href="/contact" className="btn-outline">{en ? "Contact Us" : "যোগাযোগ করুন"}</Link>
          </div>
        </Reveal>

        {/* Why Donate */}
        <div className="mt-16">
          <Reveal><h3 className="text-center font-display text-xl font-bold text-ink">{en ? "Where Your Money Goes" : "আপনার সহযোগিতা কোথায় ব্যবহৃত হয়"}</h3></Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="card-hover flex items-start gap-3 p-4">
                  <span className="text-2xl">{w.icon}</span>
                  <p className="pt-0.5 text-sm font-medium text-ink/70">{en ? w.en : w.bn}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Impact Timeline */}
        <Reveal>
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-blood-600 p-8 text-center text-white sm:p-10">
            <h3 className="font-display text-xl font-bold">{en ? "How Your Donation Saves a Life" : "আপনার সহযোগিতা কীভাবে জীবন বাঁচায়"}</h3>
            <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
              {TIMELINE.map((t, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="relative">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-2xl ring-2 ring-white/25 backdrop-blur-sm">{t.icon}</span>
                    {i < TIMELINE.length - 1 && <span className="absolute left-full top-1/2 hidden h-0.5 w-full bg-white/20 sm:block" />}
                  </div>
                  <p className="text-xs font-semibold text-white/90">{en ? t.en : t.bn}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
