"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BLOOD_GROUPS } from "@/data/constants";
import { t, type Lang } from "@/lib/i18n";
import BloodDrops from "./BloodDrops";
import Particles from "./Particles";
import BloodDrop3D from "./BloodDrop3D";
import HeroMap from "./HeroMap";

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

  const search = () =>
    router.push(group ? `/donors?group=${encodeURIComponent(group)}` : "/donors");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-600" />
      <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blood-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand-400/30 blur-3xl" />
      <BloodDrops />
      <Particles />

      <div className="container-page relative grid items-center gap-8 py-12 lg:grid-cols-2 lg:py-20">
        {/* Left: Content */}
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-300 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blood-400" />
            </span>
            {heroBadge || t("hero.badge", lang)}
          </span>

          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.2] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("hero.title1", lang)}<br />
            <span className="bg-gradient-to-r from-blood-300 to-amber-200 bg-clip-text text-transparent">
              {t("hero.title2", lang)}
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-brand-100 sm:text-lg">{heroDesc || t("hero.desc", lang)}</p>

          {/* Quick group search */}
          <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md">
            <p className="mb-2 text-xs font-medium text-brand-200">{t("hero.selectGroup", lang)}</p>
            <div className="flex flex-wrap gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => router.push(`/donors?group=${g}`)}
                  className={`h-10 w-10 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-110 ${
                    group === g ? "bg-blood-500 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {g}
                </button>
              ))}
              <button onClick={search} className="btn-white ml-1 !px-4 !py-2 text-xs">
                {t("hero.findDonors", lang)} →
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/request-blood" className="btn-blood shadow-glow-red">{t("hero.emergency", lang)}</Link>
            <Link href="/become-donor" className="btn border border-white/30 text-white hover:bg-white/10">{t("hero.join", lang)}</Link>
          </div>

          {/* Inline stats */}
          <div className="mt-6 flex gap-6">
            <div>
              <p className="text-2xl font-extrabold text-white">{donorCount.toLocaleString(lang === "en" ? "en-US" : "bn-BD")}</p>
              <p className="text-xs text-brand-100/70">{t("hero.donors", lang)}</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <p className="text-2xl font-extrabold text-blood-200">{openRequestCount.toLocaleString(lang === "en" ? "en-US" : "bn-BD")}</p>
              <p className="text-xs text-brand-100/70">{t("hero.requests", lang)}</p>
            </div>
            <div className="border-l border-white/20 pl-6">
              <div className="flex items-center gap-1">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blood-500" />
                </span>
                <span className="text-sm font-bold text-blood-200">{lang === "en" ? "LIVE" : "লাইভ"}</span>
              </div>
              <p className="text-xs text-brand-100/70">{lang === "en" ? "Network" : "নেটওয়ার্ক"}</p>
            </div>
          </div>
        </div>

        {/* Right: 3D Bangladesh Map */}
        <div className="relative hidden lg:block">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/8 to-white/3 p-6 backdrop-blur-md">
            <HeroMap lang={lang} />
          </div>
          {/* Floating 3D drop accent */}
          <div className="absolute -bottom-4 -right-2 rotate-[8deg]">
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
