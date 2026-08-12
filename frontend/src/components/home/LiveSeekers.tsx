"use client";

// =====================================================================
//  LiveSeekers — হোমপেজে "এই মুহূর্তে যাঁরা রক্ত খুঁজছেন" সেকশন।
//  ফিচার্ড রক্তদাতা সেকশনের মতোই দেখতে, কিন্তু ডেটা রিয়েল-টাইম:
//  কেউ নতুন অনুরোধ পোস্ট করলেই কার্ডটি সাথে সাথে এখানে চলে আসে।
// =====================================================================

import Link from "next/link";
import { useEffect, useState } from "react";
import { Droplet, HeartHandshake, X } from "lucide-react";
import RequesterCard from "@/components/RequesterCard";
import LiveBadge from "@/components/LiveBadge";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLiveRequests } from "@/lib/useLiveRequests";
import { t, type Lang } from "@/lib/i18n";

export default function LiveSeekers({ lang, limit = 6 }: { lang: Lang; limit?: number }) {
  const en = lang === "en";
  const { requests, loading, freshIds, live, lastUpdated, newCount, resetNew } = useLiveRequests({ limit });

  // নতুন অনুরোধ এলে নোটিশ বার — ১৫ সেকেন্ড পরে নিজে থেকেই চলে যায়
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    if (newCount === 0) {
      setShowNotice(false);
      return;
    }
    setShowNotice(true);
    const id = setTimeout(() => setShowNotice(false), 15000);
    return () => clearTimeout(id);
  }, [newCount]);

  return (
    <section className="container-page py-16 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Reveal>
          <SectionHeading
            center={false}
            eyebrow={t("seekers.eyebrow", lang)}
            title={t("seekers.homeTitle", lang)}
            subtitle={t("seekers.homeSub", lang)}
          />
        </Reveal>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Link href="/request-blood" className="btn-blood">
            <Droplet className="h-4 w-4" /> {t("seekers.postRequest", lang)}
          </Link>
          <LiveBadge live={live} lastUpdated={lastUpdated} en={en} />
          <Link href="/blood-seekers" className="btn-outline">
            {t("seekers.viewAll", lang)}
          </Link>
        </div>
      </div>

      {/* লাইভ নোটিশ — কেউ এইমাত্র অনুরোধ পোস্ট করলে সবাই দেখতে পাবে */}
      {showNotice && newCount > 0 && (
        <div className="animate-pop mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blood-300 bg-gradient-to-r from-blood-600 to-blood-500 px-4 py-3 text-white shadow-glow-red" role="status" aria-live="polite">
          <p className="inline-flex items-center gap-2 text-sm font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
            </span>
            🩸 +{newCount.toLocaleString(en ? "en-US" : "bn-BD")} {en ? (newCount === 1 ? "new blood request just arrived" : "new blood requests just arrived") : "নতুন রক্তের অনুরোধ এইমাত্র এসেছে"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetNew();
                setShowNotice(false);
              }}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/25"
            >
              {t("seekers.gotIt", lang)}
            </button>
            <button onClick={() => setShowNotice(false)} aria-label={en ? "Close" : "বন্ধ"} className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-10">
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse p-5" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <HeartHandshake className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <p className="font-medium text-ink">{en ? "No one is waiting for blood right now" : "এই মুহূর্তে কেউ রক্তের অপেক্ষায় নেই"}</p>
            <p className="mt-1 text-sm text-ink/60">{en ? "New requests will appear here instantly." : "নতুন অনুরোধ এলে সাথে সাথেই এখানে দেখা যাবে।"}</p>
            <Link href="/request-blood" className="btn-blood mt-5">{t("seekers.new", lang)}</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {requests.slice(0, limit).map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 100}>
                <RequesterCard req={r} lang={lang} fresh={freshIds.has(r.id)} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
