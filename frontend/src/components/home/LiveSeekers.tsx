"use client";

// =====================================================================
//  LiveSeekers — হোমপেজে "এই মুহূর্তে যাঁরা রক্ত খুঁজছেন" সেকশন।
//  ফিচার্ড রক্তদাতা সেকশনের মতোই দেখতে, কিন্তু ডেটা রিয়েল-টাইম:
//  কেউ নতুন অনুরোধ পোস্ট করলেই কার্ডটি সাথে সাথে এখানে চলে আসে।
// =====================================================================

import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import RequesterCard from "@/components/RequesterCard";
import LiveBadge from "@/components/LiveBadge";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLiveRequests } from "@/lib/useLiveRequests";
import { t, type Lang } from "@/lib/i18n";

export default function LiveSeekers({ lang, limit = 6 }: { lang: Lang; limit?: number }) {
  const en = lang === "en";
  const { requests, loading, freshIds, live, lastUpdated } = useLiveRequests({ limit });

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
        <div className="flex shrink-0 items-center gap-3">
          <LiveBadge live={live} lastUpdated={lastUpdated} en={en} />
          <Link href="/blood-seekers" className="btn-outline">
            {t("seekers.viewAll", lang)}
          </Link>
        </div>
      </div>

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
