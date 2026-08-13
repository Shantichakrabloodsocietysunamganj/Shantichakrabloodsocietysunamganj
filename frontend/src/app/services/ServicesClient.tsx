"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  SERVICE_CATEGORIES,
  SERVICES,
  searchServices,
  serviceBadge,
  serviceDesc,
  serviceTitle,
  type ServiceCategory,
  type ServiceItem,
} from "@/data/services";
import { useTr } from "@/lib/useLang";

type Filter = "all" | ServiceCategory;

export default function ServicesClient() {
  const { t: tx, lang, en } = useTr();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const results = useMemo(() => {
    const list = q.trim() ? searchServices(q) : SERVICES;
    return filter === "all" ? list : list.filter((s) => s.category === filter);
  }, [q, filter]);

  const grouped = useMemo(() => {
    return SERVICE_CATEGORIES.map((cat) => ({
      cat,
      items: results.filter((s) => s.category === cat.id),
    })).filter((g) => g.items.length > 0);
  }, [results]);

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("সেবা")}</span>
        <h1 className="section-title mt-3">{tx("এক ছাদে সব সেবা")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          {tx("জরুরি রক্ত থেকে দাতা নিবন্ধন, সামঞ্জস্যতা যাচাই, অনুরোধ ট্র্যাক ও SOS শেয়ার — যা লাগবে, এখানেই।")}
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-2xl">
        <label className="sr-only" htmlFor="service-search">{tx("সেবা খুঁজুন…")}</label>
        <input
          id="service-search"
          className="input h-12 text-base"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tx("যেমন: দাতা, সামঞ্জস্যতা, ট্র্যাক, SOS")}
          autoComplete="off"
        />
        <p className="mt-2 text-center text-xs text-ink/40">{tx("Ctrl+K দিয়ে যেকোনো সেবা খুঁজুন")}</p>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>{tx("সব সেবা")}</FilterChip>
        {SERVICE_CATEGORIES.map((c) => (
          <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
            {en ? c.titleEn : c.titleBn}
          </FilterChip>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/match"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-700 to-blood-600 px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          🧭 {tx("কী লাগবে জানি না?")} <span className="opacity-80">{tx("৩টি প্রশ্নে সঠিক সেবায় পৌঁছে যান।")}</span>
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md card p-10 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 font-semibold text-ink">{tx("কোনো সেবা মেলেনি")}</p>
          <p className="mt-1 text-sm text-ink/60">{tx("অন্য শব্দ দিয়ে খুঁজুন, অথবা সব সেবা দেখুন।")}</p>
          <button type="button" className="btn-outline mt-4" onClick={() => { setQ(""); setFilter("all"); }}>
            {tx("সব সেবা")}
          </button>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {grouped.map(({ cat, items }) => (
            <section key={cat.id} id={cat.id}>
              <div className="mb-5">
                <h2 className="font-display text-xl font-bold text-ink">{en ? cat.titleEn : cat.titleBn}</h2>
                <p className="mt-1 text-sm text-ink/55">{en ? cat.blurbEn : cat.blurbBn}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <ServiceCard key={s.id} item={s} lang={lang} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "bg-white text-ink/70 ring-1 ring-zinc-200 hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-800 dark:ring-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

function ServiceCard({ item, lang }: { item: ServiceItem; lang: "bn" | "en" }) {
  const badge = serviceBadge(item, lang);
  return (
    <Link href={item.href} className="card-hover group flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl">{item.icon}</span>
        {badge && (
          <span className="rounded-full bg-blood-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blood-600 ring-1 ring-blood-200">
            {badge}
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-brand-700">{serviceTitle(item, lang)}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink/60">{serviceDesc(item, lang)}</p>
      <span className="mt-4 text-sm font-semibold text-brand-600 transition group-hover:translate-x-0.5">
        {lang === "en" ? "Open →" : "খুলুন →"}
      </span>
    </Link>
  );
}
