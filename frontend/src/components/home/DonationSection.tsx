"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Link from "next/link";

type Method = { id?: string; method_name: string; account_number: string; account_type?: string | null; logo_url?: string | null; qr_url?: string | null; instructions?: string | null; color?: string };

const FALLBACK: Method[] = [
  { method_name: "bKash", account_number: "01626224878", account_type: "Personal", color: "#E2136E", instructions: "Send Money → Personal" },
  { method_name: "Nagad", account_number: "01626224878", account_type: "Personal", color: "#EC1C24", instructions: "Send Money → Personal" },
  { method_name: "Rocket", account_number: "01626224878-1", account_type: "Personal", color: "#8B2C8F", instructions: "Send Money" },
  { method_name: "Bank", account_number: "যোগাযোগ করুন", account_type: "", color: "#0b4f9c", instructions: "ব্যাংক অ্যাকাউন্টের তথ্যের জন্য যোগাযোগ করুন।" },
];

const WHY = [
  { icon: "🚨", bn: "জরুরি রক্ত সমন্বয়", en: "Emergency blood coordination" },
  { icon: "🙋", bn: "স্বেচ্ছাসেবক কার্যক্রম", en: "Volunteer activities" },
  { icon: "📢", bn: "সচেতনতামূলক প্রচার", en: "Awareness campaigns" },
  { icon: "💻", bn: "ওয়েবসাইট ও প্রযুক্তি", en: "Website & technology" },
  { icon: "🩸", bn: "রক্তদান শিবির", en: "Blood donation camps" },
  { icon: "🤝", bn: "সামাজিক সেবা", en: "Community outreach" },
];

const TIMELINE = [
  { icon: "💰", bn: "আপনার অনুদান", en: "Your Donation" },
  { icon: "🙋", bn: "স্বেচ্ছাসেবক সহায়তা", en: "Volunteer Support" },
  { icon: "🩸", bn: "রক্ত সমন্বয়", en: "Blood Coordination" },
  { icon: "🏥", bn: "রোগী রক্ত পান", en: "Patient Receives Blood" },
  { icon: "❤️", bn: "একটি জীবন বাঁচে", en: "A Life is Saved" },
];

export default function DonationSection({ lang }: { lang: Lang }) {
  const en = lang === "en";
  const supabase = createClient();
  const [methods, setMethods] = useState<Method[]>(FALLBACK);
  const [copied, setCopied] = useState<string | null>(null);
  const [stats, setStats] = useState({ donors: 0, completed: 0, units: 0, volunteers: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from("donation_methods").select("*").eq("is_active", true).order("order", { ascending: true });
        if (data && data.length) setMethods(data);
        const { data: rpc } = await supabase.rpc("impact_stats");
        if (rpc && rpc[0]) setStats(rpc[0]);
      } catch {}
    })();
  }, [supabase]);

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(null), 2000); };

  const trustItems = [
    { value: stats.donors, label: en ? "Registered Donors" : "নিবন্ধিত দাতা" },
    { value: stats.completed, label: en ? "Patients Helped" : "সাহায্যপ্রাপ্ত রোগী" },
    { value: stats.units, label: en ? "Blood Units" : "রক্ত ইউনিট" },
    { value: stats.volunteers, label: en ? "Volunteers" : "স্বেচ্ছাসেবক" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/30 py-16 dark:from-slate-950 dark:to-slate-900">
      <div className="container-page">
        {/* Header */}
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blood-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-blood-600">❤️ {en ? "Support Us" : "সহযোগিতা করুন"}</span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{en ? "Support Our Mission" : "আমাদের মিশনে সহযোগিতা করুন"}</h2>
            <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink/60">{en ? "Your contribution helps us connect blood donors with patients, organize emergency blood services, expand our volunteer network, and save more lives across Bangladesh." : "আপনার সহযোগিতায় আমরা রক্তদাতাদের রোগীদের সাথে যুক্ত করি, জরুরি রক্তসেবা প্রদান করি, স্বেচ্ছাসেবক নেটওয়ার্ক বিস্তার করি এবং সারা বাংলাদেশে আরও জীবন বাঁচাই।"}</p>
          </div>
        </Reveal>

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

        {/* Donation method cards */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* CTA buttons */}
        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#donate" className="btn-blood shadow-glow-red">{en ? "❤️ Donate Now" : "❤️ এখনই সহযোগিতা করুন"}</a>
            <Link href="/volunteer" className="btn-primary">{en ? "Become a Supporter" : "সমর্থক হোন"}</Link>
            <Link href="/contact" className="btn-outline">{en ? "Contact Us" : "যোগাযোগ করুন"}</Link>
          </div>
        </Reveal>

        {/* Why Donate */}
        <div className="mt-16">
          <Reveal><h3 className="text-center font-display text-xl font-bold text-ink">{en ? "Why Your Support Matters" : "কেন আপনার সহযোগিতা জরুরি"}</h3></Reveal>
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
