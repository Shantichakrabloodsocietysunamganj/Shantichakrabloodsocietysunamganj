"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplet, Search, UserPlus } from "lucide-react";
import { BLOOD_GROUPS } from "@/data/constants";
import { t, type Lang } from "@/lib/i18n";
import BloodDrops from "./BloodDrops";
import Particles from "./Particles";
import BloodDrop3D from "./BloodDrop3D";
import BangladeshMap from "./BangladeshMap";

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
  const en = lang === "en";
  const num = (n: number) => n.toLocaleString(en ? "en-US" : "bn-BD");

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700" />
      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="motion-compositor pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] animate-aurora rounded-full bg-blood-500/20 blur-[120px]" />
      <div className="motion-compositor pointer-events-none absolute -bottom-48 -left-32 h-[30rem] w-[30rem] animate-aurora rounded-full bg-brand-400/20 blur-[110px] [animation-delay:-9s]" />
      <BloodDrops />
      <Particles />

      <div className="container-page relative grid items-center gap-10 py-12 lg:grid-cols-2 lg:py-16">
        {/* Left: Content */}
        <div className="animate-fade-up">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blood-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blood-500" />
            </span>
            {heroBadge || (en ? "Active in 4 Districts of Sylhet" : "সিলেট বিভাগের ৪ জেলায় সক্রিয়")}
          </span>

          {/* Headline */}
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
            {en ? (
              <>Shantichakra Blood Society Sunamganj — <span className="bg-gradient-to-r from-rose-300 via-white to-rose-200 bg-clip-text text-transparent">Every Drop Saves a Life</span></>
            ) : (
              <>শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ — <span className="bg-gradient-to-r from-rose-300 via-white to-rose-200 bg-clip-text text-transparent">প্রতিটি ফোঁটায় একটি জীবন</span></>
            )}
          </h1>

          {/* Subheadline */}
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100/80 sm:text-lg">
            {heroDesc || t("hero.desc", lang)}
          </p>

          {/* CTA Buttons — প্রথমেই রক্তের অনুরোধ */}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/request-blood" className="btn-blood shadow-glow-red inline-flex items-center gap-2">
              <Droplet className="h-4 w-4" /> {t("hero.needBlood", lang)}
            </Link>
            <Link href="/donors" className="btn inline-flex items-center gap-2 border border-white/25 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15">
              <Search className="h-4 w-4" /> {t("hero.findDonors", lang)}
            </Link>
            <Link href="/become-donor" className="btn inline-flex items-center gap-2 border border-white/25 bg-white/5 text-white backdrop-blur-sm transition hover:bg-white/15">
              <UserPlus className="h-4 w-4" /> {en ? "Become a Donor" : t("nav.becomeDonor", lang)}
            </Link>
          </div>

          {/* Quick group search — glass */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
            <p className="mb-2.5 text-xs font-medium text-brand-200">
              {en ? "Quick search by blood group:" : "গ্রুপ অনুযায়ী দ্রুত খুঁজুন:"}
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {BLOOD_GROUPS.map((g) => (
                <button
                  key={g}
                  onClick={() => router.push(`/donors?group=${g}`)}
                  className="flex h-9 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white transition-all hover:scale-105 hover:bg-blood-500"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Live Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat value={num(donorCount)} label={en ? "Registered Donors" : "নিবন্ধিত দাতা"} />
            <Stat value={num(openRequestCount)} label={en ? "Blood Requests" : "অনুরোধ"} accent="text-rose-300" />
            <Stat value={en ? "4 Districts" : "৪ জেলা"} label={en ? "Sylhet Coverage" : "সিলেট কভারেজ"} accent="text-emerald-300" />
          </div>
        </div>

        {/* Right: Bangladesh Map */}
        <div className="relative flex justify-center">
          <div className="animate-fade-up [animation-delay:200ms]">
            <BangladeshMap />
          </div>
          {/* Floating 3D drop accent */}
          <div className="absolute -bottom-2 right-2 rotate-[12deg] sm:right-6">
            <BloodDrop3D size={44} />
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

function Stat({ value, label, accent = "text-white" }: { value: string; label: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
      <p className={`font-display text-2xl font-extrabold ${accent}`}>{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-brand-200/70">{label}</p>
    </div>
  );
}
