"use client";

import { useState } from "react";
import Link from "next/link";
import { BLOOD_GROUPS } from "@/data/constants";
import RequestCard from "@/components/RequestCard";
import LiveBadge from "@/components/LiveBadge";
import Reveal from "@/components/Reveal";
import { useLiveRequests } from "@/lib/useLiveRequests";
import {t} from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

export default function RequestsPage() {
  const lang = useLang();
  const en = lang === "en";
  const [group, setGroup] = useState("");

  // লাইভ ফিড — নতুন অনুরোধ এলে সাথে সাথেই তালিকায় যুক্ত হয়
  const { requests, loading, error, freshIds, live, lastUpdated } = useLiveRequests({ limit: 60, group });

  return (
    <div className="container-page py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="eyebrow">{t("donors.group", lang)}</span>
          <h1 className="section-title mt-3">{t("requests.title", lang)}</h1>
          <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-blood-500 to-brand-600" />
          <p className="mt-4 text-ink/60">{t("requests.desc", lang)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <LiveBadge live={live} lastUpdated={lastUpdated} en={en} />
            <Link href="/blood-seekers" className="rounded-full bg-blood-50 px-2.5 py-1 text-[11px] font-bold text-blood-700 transition hover:bg-blood-100">
              {t("seekers.viewAll", lang)}
            </Link>
          </div>
        </div>
        <Link href="/request-blood" className="btn-primary shrink-0">{t("requests.new", lang)}</Link>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setGroup("")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${!group ? "bg-brand-600 text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-brand-50 hover:text-brand-700"}`}
        >
          {en ? "All Groups" : "সব গ্রুপ"}
        </button>
        {BLOOD_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${group === g ? "bg-brand-600 text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-brand-50 hover:text-brand-700"}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {error ? (
          <div className="card p-10 text-center text-zinc-500">
            <p className="font-medium text-zinc-700">⚠️ {en ? "Failed to load" : "তালিকা আনা যায়নি"}</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="card h-64 animate-pulse" />))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
            <p className="font-medium text-zinc-800">{en ? "No urgent requests right now" : "এই মুহূর্তে কোনো জরুরি অনুরোধ নেই"}</p>
            <p className="mt-1 text-sm text-zinc-500">{en ? "Everyone is safe." : "সবাই নিরাপদে আছেন।"}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 80}>
                <div className={freshIds.has(r.id) ? "animate-pop rounded-2xl ring-2 ring-blood-500/60" : ""}>
                  <RequestCard req={r} lang={lang} />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
