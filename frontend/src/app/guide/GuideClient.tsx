"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ELIGIBLE_DAYS, getEligibility } from "@/lib/donation";
import { fmtDateOnly } from "@/lib/date";
import { num } from "@/lib/format";
import { useTr } from "@/lib/useLang";

type Phase = "before" | "during" | "after";

type CheckItem = { id: string; phase: Phase; bn: string; en: string };

const CHECKLIST: CheckItem[] = [
  { id: "sleep", phase: "before", bn: "আগের রাতে ৬–৮ ঘণ্টা ঘুমিয়েছেন", en: "Slept 6–8 hours the night before" },
  { id: "meal", phase: "before", bn: "হালকা খাবার খেয়ে এসেছেন — খালি পেটে নন", en: "Had a light meal — not on an empty stomach" },
  { id: "water", phase: "before", bn: "রক্তদানের আগে ২–৩ গ্লাস পানি পান করেছেন", en: "Drank 2–3 glasses of water before donating" },
  { id: "id", phase: "before", bn: "জাতীয় পরিচয়পত্র বা ফটো আইডি সঙ্গে আছে", en: "Brought national ID or photo ID" },
  { id: "well", phase: "before", bn: "জ্বর, সর্দি বা অসুস্থ বোধ করছেন না", en: "No fever, cold or feeling unwell" },
  { id: "tell", phase: "during", bn: "ঔষধ বা অসুস্থতার কথা স্টাফকে বলেছেন", en: "Told staff about medicines or illness" },
  { id: "relax", phase: "during", bn: "আরাম করে বসে আছেন, মাথা ঘুরলে বলবেন", en: "Sitting comfortably; will speak up if dizzy" },
  { id: "rest", phase: "after", bn: "দানের পর অন্তত ১০–১৫ মিনিট বিশ্রাম নিয়েছেন", en: "Rested at least 10–15 minutes after donating" },
  { id: "drink", phase: "after", bn: "পানি বা মিষ্টি পানীয় খেয়েছেন", en: "Had water or a sweet drink" },
  { id: "lift", phase: "after", bn: "আজ ভারী জিনিস তুলবেন না / কঠিন ব্যায়াম নয়", en: "No heavy lifting or hard exercise today" },
];

const EAT = {
  before: {
    bn: ["পানি, ডাবের পানি", "আয়রনসমৃদ্ধ খাবার — কচুশাক, কলিজা, মাছ, ডাল", "হালকা ভাত-ডাল বা রুটি", "ভিটামিন সি (লেবু, আমলকী) — আয়রন শোষণে সাহায্য"],
    en: ["Water or coconut water", "Iron-rich food — greens, liver, fish, lentils", "A light rice or bread meal", "Vitamin C (lemon, amla) to help absorb iron"],
  },
  after: {
    bn: ["প্রচুর পানি সারাদিন", "লবণাক্ত হালকা নাস্তা", "ফল ও জুস", "আয়রনসমৃদ্ধ রাতের খাবার"],
    en: ["Plenty of water all day", "A light salty snack", "Fruit and juice", "An iron-rich evening meal"],
  },
};

const AVOID = {
  before: {
    bn: ["খালি পেটে যাওয়া", "মদ / ধূমপান (কমপক্ষে ১২ ঘণ্টা আগে বাদ)", "অতিরিক্ত তেল-মসলা", "রাত জাগা"],
    en: ["Going on an empty stomach", "Alcohol or smoking (stop at least 12 hours before)", "Very oily or spicy food", "Staying up all night"],
  },
  after: {
    bn: ["২ ঘণ্টা ধূমপান নয়", "আজ কঠিন ব্যায়াম / ভারী বোঝা নয়", "রাতে মদ নয়", "ব্যান্ডেজ তাড়াতাড়ি খুলে ফেলা নয়"],
    en: ["No smoking for 2 hours", "No hard exercise or heavy loads today", "No alcohol tonight", "Don’t peel the bandage off early"],
  },
};

const STORAGE_KEY = "shantichakra:donation-checklist:v1";

export default function GuideClient() {
  const { t: tx, lang, en } = useTr();
  const [phase, setPhase] = useState<Phase>("before");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(done)); } catch { /* ignore */ }
  }, [done]);

  const items = CHECKLIST.filter((c) => c.phase === phase);
  const checkedCount = CHECKLIST.filter((c) => done[c.id]).length;
  const elig = useMemo(() => getEligibility(lastDate || null), [lastDate]);
  const eat = phase === "during" ? null : EAT[phase === "after" ? "after" : "before"];
  const avoid = phase === "during" ? null : AVOID[phase === "after" ? "after" : "before"];

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("রক্তদান গাইড")}</span>
        <h1 className="section-title mt-3">{tx("আগে, দিনে ও পরে যা জানা দরকার")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{tx("প্রথমবার বা নিয়মিত — নিরাপদ রক্তদানের ছোট ছোট অভ্যাস।")}</p>
      </header>

      <div className="mx-auto mt-8 flex max-w-xl justify-center gap-2">
        {(["before", "during", "after"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPhase(p)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              phase === p ? "bg-brand-600 text-white" : "bg-white text-ink/70 ring-1 ring-zinc-200 dark:bg-slate-800"
            }`}
          >
            {p === "before" ? tx("আগে") : p === "during" ? tx("দিনে") : tx("পরে")}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold text-ink">{tx("আমার চেকলিস্ট")}</h2>
              <span className="text-xs font-semibold text-ink/50">
                {num(checkedCount, lang)}/{num(CHECKLIST.length, lang)} {tx("সম্পন্ন")}
              </span>
            </div>
            <ul className="mt-4 space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas p-3 dark:bg-white/5">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand-600"
                      checked={!!done[item.id]}
                      onChange={(e) => setDone((s) => ({ ...s, [item.id]: e.target.checked }))}
                    />
                    <span className={`text-sm leading-relaxed ${done[item.id] ? "text-ink/40 line-through" : "text-ink"}`}>
                      {en ? item.en : item.bn}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2 print:hidden">
              <button type="button" className="btn-outline !py-2 text-xs" onClick={() => window.print()}>
                {tx("চেকলিস্ট প্রিন্ট করুন")}
              </button>
              <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => setDone({})}>
                {tx("মুছে ফেলুন")}
              </button>
            </div>
            <p className="mt-3 text-xs text-ink/40">{tx("🔒 চেকলিস্ট শুধু এই ডিভাইসে থাকে — সার্ভারে যায় না।")}</p>
          </section>

          {eat && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <h3 className="font-semibold text-success-700">🥗 {tx("কী খাবেন")}</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink/70">
                  {(en ? eat.en : eat.bn).map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
              <div className="card p-5">
                <h3 className="font-semibold text-blood-600">🚫 {tx("কী এড়াবেন")}</h3>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ink/70">
                  {(en ? avoid!.en : avoid!.bn).map((x) => <li key={x}>{x}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        <aside className="lg:col-span-2 space-y-5">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">{tx("কখন আবার দিতে পারবেন?")}</h2>
            <p className="mt-1 text-sm text-ink/55">{tx("তারিখ দিন — ৯০ দিন পর আপনি আবার যোগ্য।")}</p>
            <label className="label mt-4">{tx("শেষ রক্তদানের তারিখ")}</label>
            <input
              type="date"
              className="input"
              value={lastDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setLastDate(e.target.value)}
            />
            <div className="mt-4 rounded-2xl bg-canvas p-4 text-center dark:bg-white/5">
              {!lastDate ? (
                <p className="text-sm text-ink/70">{tx("কখনো দেননি? তাহলে আজই যোগ্য — শুধু স্বাস্থ্য যাচাই বাকি।")}</p>
              ) : elig.eligible ? (
                <p className="font-semibold text-success-700">{tx("আপনি এখনই রক্ত দিতে পারবেন")}</p>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-wide text-ink/45">{tx("পরবর্তী যোগ্য তারিখ")}</p>
                  <p className="mt-1 font-display text-2xl font-extrabold text-brand-700">
                    {fmtDateOnly(elig.nextEligibleDate, en ? "en-GB" : "bn-BD")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-blood-600">
                    {num(elig.daysRemaining, lang)} {tx("দিন বাকি")}
                  </p>
                </>
              )}
            </div>
            <p className="mt-3 text-xs text-ink/40">
              {en
                ? `This site uses a single ${ELIGIBLE_DAYS}-day interval for every donor.`
                : `এই সাইটে সবার জন্য ${num(ELIGIBLE_DAYS, lang)} দিনের একটি নিয়ম ব্যবহার হয়।`}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/eligibility" className="btn-primary">{tx("যোগ্যতা যাচাই করুন")}</Link>
            <Link href="/become-donor" className="btn-outline">{tx("রক্তদাতা হিসেবে নিবন্ধন করুন")}</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
