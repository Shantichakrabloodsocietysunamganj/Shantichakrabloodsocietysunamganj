"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOOD_GROUPS } from "@/data/constants";
import { t, type Lang } from "@/lib/i18n";
import BloodDrops from "./BloodDrops";
import Particles from "./Particles";
import BloodDrop3D from "./BloodDrop3D";

export default function Hero({
  donorCount,
  openRequestCount,
  lang,
  heroBadge,
  heroDesc,
}: {
  donorCount: number;
  openRequestCount: number;
  lang: Lang;
  heroBadge?: string;
  heroDesc?: string;
}) {
  const router = useRouter();
  const [group, setGroup] = useState("");
  const en = lang === "en";

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-blood-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-brand-400/20 blur-[80px]" />
      <BloodDrops />
      <Particles />

      <div className="container-page relative grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-16">
        {/* Left: Content */}
        <div className="animate-fade-up">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-blood-400/30 bg-blood-500/10 px-3 py-1 text-xs font-bold text-blood-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blood-500" />
            </span>
            🩸 {en ? "Sylhet Division Fully Covered" : "সিলেট বিভাগ সম্পূর্ণ সক্রিয়"}
          </span>

          {/* Headline */}
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {en ? "Every Drop Saves a Life." : "প্রতিটি ফোঁটায় লুকিয়ে আছে একটি জীবন"}
          </h1>

          {/* Subheadline */}
          <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-100/80 sm:text-lg">
            {heroDesc || (en
              ? "We've built a voluntary blood donation network across every district and upazila of Sylhet. Our next mission: expand across all of Bangladesh."
              : "সিলেট বিভাগের প্রতিটি জেলা ও উপজেলায় স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক গড়ে তুলেছি। পরবর্তী লক্ষ্য — সারা বাংলাদেশে এই জীবনরক্ষার সেবা পৌঁছে দেওয়া।")}
          </p>

          {/* CTA Buttons */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/donors" className="btn-blood shadow-glow-red">
              🔴 {en ? "Find Blood Donors" : "রক্তদাতা খুঁজুন"}
            </Link>
            <Link href="/become-donor" className="btn border border-white/25 text-white transition hover:bg-white/10">
              ⚪ {en ? "Become a Donor" : "রক্তদাতা হোন"}
            </Link>
          </div>

          {/* Quick group search */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <p className="mb-2 text-xs font-medium text-brand-200">{en ? "Quick search by blood group:" : "গ্রুপ অনুযায়ী দ্রুত খুঁজুন:"}</p>
            <div className="flex flex-wrap gap-1.5">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => router.push(`/donors?group=${g}`)}
                  className="h-9 w-9 rounded-lg bg-white/10 text-xs font-bold text-white transition-all hover:scale-110 hover:bg-blood-500"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Live Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-white">{donorCount.toLocaleString(en ? "en-US" : "bn-BD")}</p>
              <p className="text-[10px] font-medium text-brand-200/60">{en ? "Registered Donors" : "নিবন্ধিত দাতা"}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-blood-300">{openRequestCount.toLocaleString(en ? "en-US" : "bn-BD")}</p>
              <p className="text-[10px] font-medium text-brand-200/60">{en ? "Blood Requests" : "অনুরোধ"}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/5 p-3 backdrop-blur-sm">
              <p className="text-2xl font-extrabold text-success-400">100%</p>
              <p className="text-[10px] font-medium text-brand-200/60">{en ? "Sylhet Coverage" : "সিলেট কভারেজ"}</p>
            </div>
          </div>
        </div>

        {/* Right: Stats Card */}
        <div className="relative">
          <div className="animate-fade-up [animation-delay:200ms]">
            <div className="rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-3xl font-extrabold text-white">{donorCount.toLocaleString(en ? "en-US" : "bn-BD")}</p>
                  <p className="text-xs text-brand-100/70">{en ? "Donors" : "দাতা"}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 text-center">
                  <p className="text-3xl font-extrabold text-blood-200">{openRequestCount.toLocaleString(en ? "en-US" : "bn-BD")}</p>
                  <p className="text-xs text-brand-100/70">{en ? "Requests" : "অনুরোধ"}</p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl bg-blood-500/90 p-4 text-center">
                <p className="text-xs font-medium text-blood-50">{en ? "LIVE" : "লাইভ"}</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{openRequestCount.toLocaleString(en ? "en-US" : "bn-BD")} {en ? "active" : "টি চলমান"}</p>
                <p className="text-xs text-blood-50/80">{en ? "Your decision can save a life" : "আপনার একটি সিদ্ধান্ত একটি পরিবারকে বাঁচাতে পারে"}</p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success-500" />
                </span>
                <span className="text-xs font-bold text-success-400">{en ? "100% Sylhet Coverage" : "১০০% সিলেট কভারেজ"}</span>
              </div>
            </div>
          </div>
          {/* Floating 3D drop accent */}
          <div className="absolute -bottom-2 -right-1 rotate-[12deg]">
            <BloodDrop3D size={56} />
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <svg className="block w-full text-canvas" viewBox="0 0 1440 60" preserveAspectRatio="none" fill="currentColor">
        <path d="M0,32 C240,60 480,60 720,40 C960,20 1200,20 1440,40 L1440,60 L0,60 Z" />
      </svg>
    </section>
  );
}
