"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOOD_GROUPS } from "@/data/constants";
import { site } from "@/data/site";

export default function Hero({
  donorCount,
  openRequestCount,
}: {
  donorCount: number;
  openRequestCount: number;
}) {
  const router = useRouter();
  const [group, setGroup] = useState("");

  const search = () => {
    router.push(group ? `/donors?group=${encodeURIComponent(group)}` : "/donors");
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 to-white">
      {/* decorative */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="container-page relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-600 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
            </span>
            {site.district} জুড়ে স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
            প্রতিটি ফোঁটা রক্তে<br />
            <span className="text-brand-600">লুকিয়ে আছে একটি জীবন</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
            জরুরি মুহূর্তে সঠিক রক্তদাতা খুঁজে পাওয়া কঠিন। শান্তিচক্র রক্তদান সমিতি সুনামগঞ্জের
            নিবন্ধিত রক্তদাতাদের এক ছাদে এনে রক্তের অভাবে যেন কেউ প্রাণ হারায় না — তা নিশ্চিত করছে।
          </p>

          {/* quick search */}
          <div className="mt-7 rounded-2xl border border-zinc-200 bg-white p-3 shadow-card sm:flex sm:items-center sm:gap-2">
            <div className="flex flex-1 items-center gap-2">
              <svg className="ml-1 h-5 w-5 text-brand-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
              </svg>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full bg-transparent py-2.5 text-sm font-medium text-zinc-800 focus:outline-none"
              >
                <option value="">রক্তের গ্রুপ বেছে নিন</option>
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>গ্রুপ {g} এর দাতা খুঁজুন</option>
                ))}
              </select>
            </div>
            <button onClick={search} className="btn-primary mt-2 w-full sm:mt-0 sm:w-auto">
              রক্তদাতা খুঁজুন
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/request-blood" className="btn-outline">🩸 রক্ত লাগবে? অনুরোধ করুন</Link>
            <Link href="/become-donor" className="btn-ghost">রক্তদাতা হিসেবে যুক্ত হোন →</Link>
          </div>
        </div>

        {/* visual */}
        <div className="relative hidden lg:block">
          <div className="relative mx-auto max-w-sm">
            <div className="card grid grid-cols-2 gap-4 p-6">
              <Stat label="নিবন্ধিত রক্তদাতা" value={donorCount} accent="text-brand-600" />
              <Stat label="চলমান অনুরোধ" value={openRequestCount} accent="text-amber-600" />
              <div className="col-span-2 rounded-xl bg-brand-50 p-4">
                <p className="text-sm font-semibold text-brand-700">এই মুহূর্তে জরুরি</p>
                <p className="mt-1 text-2xl font-extrabold text-brand-700">{openRequestCount} টি অনুরোধ</p>
                <p className="text-xs text-brand-600">আপনার একটি সিদ্ধান্ত একটি পরিবারকে বাঁচাতে পারে</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 rotate-[-6deg]">
              <DropBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div>
      <p className={`text-3xl font-extrabold ${accent}`}>{value.toLocaleString("bn-BD")}</p>
      <p className="text-xs font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function DropBadge() {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-lg">
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
        <path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
      </svg>
    </div>
  );
}
