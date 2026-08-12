"use client";

// =====================================================================
//  রক্তপ্রার্থী (Blood Seekers) — যারা রক্তের অনুরোধ দিয়েছেন তাঁদের
//  লাইভ ডিরেক্টরি। রক্তদাতা পেজের মতোই ফিল্টার + কার্ড লেআউট,
//  পার্থক্য শুধু — এখানে নতুন অনুরোধ রিয়েল-টাইমে যুক্ত হয়।
// =====================================================================

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf } from "@/data/constants";
import RequesterCard from "@/components/RequesterCard";
import LiveBadge from "@/components/LiveBadge";
import Reveal from "@/components/Reveal";
import { useLiveRequests } from "@/lib/useLiveRequests";
import { getRequestStatus } from "@/lib/request";
import { t, useLangClient } from "@/lib/i18n";

export default function BloodSeekersClient() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-zinc-500">লোড হচ্ছে…</div>}>
      <SeekersContent />
    </Suspense>
  );
}

function SeekersContent() {
  const lang = useLangClient();
  const en = lang === "en";

  const [group, setGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [q, setQ] = useState("");
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [includeClosed, setIncludeClosed] = useState(false);

  const { requests, loading, error, freshIds, live, lastUpdated, refresh } = useLiveRequests({
    limit: 100,
    group,
    upazila,
    includeClosed,
  });

  // ক্লায়েন্ট-সাইড ফিল্টার (জেলা, সার্চ, জরুরি)
  const filtered = useMemo(() => {
    let list = requests;
    if (district) list = list.filter((r) => r.district === district);
    if (onlyUrgent) list = list.filter((r) => ["critical", "urgent"].includes(getRequestStatus(r, en).key));
    if (q.trim()) {
      const tq = q.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.patient_name.toLowerCase().includes(tq) ||
          r.hospital.toLowerCase().includes(tq) ||
          (r.contact_name ?? "").toLowerCase().includes(tq) ||
          (r.upazila ?? "").toLowerCase().includes(tq) ||
          (r.contact_phone ?? "").includes(tq),
      );
    }
    return list;
  }, [requests, district, onlyUrgent, q, en]);

  // গ্রুপ অনুযায়ী সাজানো (রক্তদাতা পেজের মতো)
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const r of filtered) {
      const arr = map.get(r.blood_group) ?? [];
      arr.push(r);
      map.set(r.blood_group, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const urgentCount = useMemo(
    () => requests.filter((r) => ["critical", "urgent"].includes(getRequestStatus(r, en).key)).length,
    [requests, en],
  );

  const hasFilter = group || district || upazila || q || onlyUrgent || includeClosed;
  const clearFilters = () => {
    setGroup("");
    setDistrict("");
    setUpazila("");
    setQ("");
    setOnlyUrgent(false);
    setIncludeClosed(false);
  };

  return (
    <div className="container-page py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <span className="eyebrow">{en ? "Live Requests" : "লাইভ অনুরোধ"}</span>
          <h1 className="section-title mt-3">{t("seekers.title", lang)}</h1>
          <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-blood-500 to-brand-600" />
          <p className="mt-4 text-ink/60">{t("seekers.desc", lang)}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <LiveBadge live={live} lastUpdated={lastUpdated} en={en} />
            <span className="rounded-full bg-blood-50 px-2.5 py-1 text-[11px] font-bold text-blood-700">
              🩸 {urgentCount.toLocaleString(en ? "en-US" : "bn-BD")} {en ? "urgent now" : "টি এখনই জরুরি"}
            </span>
            <button onClick={refresh} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-bold text-zinc-600 transition hover:bg-zinc-200">
              ⟳ {en ? "Refresh" : "রিফ্রেশ"}
            </button>
          </div>
        </div>
        <Link href="/request-blood" className="btn-blood shrink-0">
          {t("seekers.new", lang)}
        </Link>
      </header>

      {/* ফিল্টার প্যানেল */}
      <div className="card mt-8 p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">{t("donors.group", lang)}</label>
            <select className="input" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">{t("donors.allGroups", lang)}</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("donors.district", lang)}</label>
            <select
              className="input"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setUpazila("");
              }}
            >
              <option value="">{t("donors.allDistricts", lang)}</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("donors.upazila", lang)}</label>
            <select className="input" value={upazila} onChange={(e) => setUpazila(e.target.value)}>
              <option value="">{t("donors.allUpazilas", lang)}</option>
              {(district ? upazilasOf(district) : []).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t("seekers.search", lang)}</label>
            <input
              className="input"
              placeholder={en ? "Patient, hospital, phone…" : "রোগী, হাসপাতাল, ফোন…"}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={onlyUrgent}
                onChange={(e) => setOnlyUrgent(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-blood-600 focus:ring-blood-500"
              />
              {t("seekers.onlyUrgent", lang)}
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={includeClosed}
                onChange={(e) => setIncludeClosed(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
              />
              {t("seekers.includeClosed", lang)}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">
              {loading
                ? en
                  ? "Loading…"
                  : "লোড হচ্ছে…"
                : `${filtered.length.toLocaleString(en ? "en-US" : "bn-BD")} ${en ? "requests" : "টি অনুরোধ"}`}
            </span>
            {hasFilter && (
              <button onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline">
                {t("donors.clearFilters", lang)}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* তালিকা */}
      <div className="mt-8">
        {error ? (
          <div className="card p-10 text-center">
            <p className="text-3xl">⚠️</p>
            <p className="mt-2 font-medium text-zinc-800">{en ? "Failed to load" : "তালিকা আনা যায়নি"}</p>
            <p className="mt-1 text-sm text-zinc-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-64 animate-pulse p-5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
            <p className="font-medium text-zinc-800">
              {hasFilter
                ? en
                  ? "No requests match these filters"
                  : "এই ফিল্টারে কোনো অনুরোধ নেই"
                : en
                  ? "No blood requests right now"
                  : "এই মুহূর্তে কোনো রক্তের অনুরোধ নেই"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{en ? "Everyone is safe." : "সবাই নিরাপদে আছেন।"}</p>
            <Link href="/request-blood" className="btn-blood mt-5">{t("seekers.new", lang)}</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(([g, list]) => (
              <section key={g}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {en ? "Group" : "গ্রুপ"} {g}
                  </h2>
                  <span className="rounded-full bg-blood-50 px-2.5 py-0.5 text-xs font-medium text-blood-700">
                    {list.length.toLocaleString(en ? "en-US" : "bn-BD")} {en ? "requests" : "টি অনুরোধ"}
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((r, i) => (
                    <Reveal key={r.id} delay={(i % 3) * 80}>
                      <RequesterCard req={r} lang={lang} fresh={freshIds.has(r.id)} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
