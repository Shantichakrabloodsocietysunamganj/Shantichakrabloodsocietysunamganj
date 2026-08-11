"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf } from "@/data/constants";
import type { Donor } from "@/lib/types";
import DonorCard from "@/components/DonorCard";
import Reveal from "@/components/Reveal";
import { t, useLangClient } from "@/lib/i18n";
import { AlertTriangle, Droplets } from "@/components/icons";

export default function DonorsPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-zinc-500">লোড হচ্ছে…</div>}>
      <DonorsContent />
    </Suspense>
  );
}

function DonorsContent() {
  const supabase = createClient();
  const router = useRouter();
  const params = useSearchParams();
  const lang = useLangClient();

  const [group, setGroup] = useState(params.get("group") ?? "");
  const [district, setDistrict] = useState(params.get("district") ?? "");
  const [upazila, setUpazila] = useState(params.get("upazila") ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("donors").select("*").order("is_available", { ascending: false }).order("created_at", { ascending: false });
      if (group) query = query.eq("blood_group", group);
      if (district) query = query.eq("district", district);
      if (upazila) query = query.eq("upazila", upazila);
      if (onlyAvailable) query = query.eq("is_available", true);
      if (onlyVerified) query = query.eq("is_verified", true);
      query = query.eq("approved", true);
      const { data, error } = await query.limit(100);
      if (error) throw error;
      let list = (data as Donor[]) ?? [];
      if (q.trim()) {
        const tq = q.trim().toLowerCase();
        list = list.filter((d) => d.full_name.toLowerCase().includes(tq) || (d.area ?? "").toLowerCase().includes(tq) || (d.phone ?? "").includes(tq));
      }
      setDonors(list);
    } catch (e: any) {
      setError(e?.message ?? "error");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, group, district, upazila, onlyAvailable, onlyVerified, q]);

  useEffect(() => {
    fetchDonors();
    const sp = new URLSearchParams();
    if (group) sp.set("group", group);
    if (district) sp.set("district", district);
    if (upazila) sp.set("upazila", upazila);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    router.replace(qs ? `/donors?${qs}` : "/donors");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, district, upazila, onlyAvailable, onlyVerified, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Donor[]>();
    for (const d of donors) { const arr = map.get(d.blood_group) ?? []; arr.push(d); map.set(d.blood_group, arr); }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [donors]);

  const clearFilters = () => { setGroup(""); setDistrict(""); setUpazila(""); setQ(""); setOnlyAvailable(false); setOnlyVerified(false); };
  const hasFilter = group || district || upazila || q || onlyAvailable || onlyVerified;

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <span className="eyebrow">{t("donors.group", lang)}</span>
        <h1 className="section-title mt-3">{t("donors.title", lang)}</h1>
        <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mt-4 text-ink/60">{t("donors.desc", lang)}</p>
      </header>

      <div className="mt-8 card p-5">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">{t("donors.group", lang)}</label>
            <select className="input" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">{t("donors.allGroups", lang)}</option>
              {BLOOD_GROUPS.map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>
          </div>
          <div>
            <label className="label">{t("donors.district", lang)}</label>
            <select className="input" value={district} onChange={(e) => { setDistrict(e.target.value); setUpazila(""); }}>
              <option value="">{t("donors.allDistricts", lang)}</option>
              {DISTRICTS.map((d) => (<option key={d} value={d}>{d}</option>))}
            </select>
          </div>
          <div>
            <label className="label">{t("donors.upazila", lang)}</label>
            <select className="input" value={upazila} onChange={(e) => setUpazila(e.target.value)}>
              <option value="">{t("donors.allUpazilas", lang)}</option>
              {(district ? upazilasOf(district) : []).map((u) => (<option key={u} value={u}>{u}</option>))}
            </select>
          </div>
          <div>
            <label className="label">{t("donors.search", lang)}</label>
            <input className="input" placeholder={lang === "en" ? "e.g. Rahim, 01..." : "যেমন: রহিম, ছাতক, 01..."} value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" />
              {t("donors.available", lang)}
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
              <input type="checkbox" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" />
              {t("donors.verified", lang)}
            </label>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">{loading ? (lang === "en" ? "Searching..." : "খুঁছি...") : `${donors.length.toLocaleString("bn-BD")} ${lang === "en" ? "found" : "জন পাওয়া গেছে"}`}</span>
            {hasFilter && (<button onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline">{t("donors.clearFilters", lang)}</button>)}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {error ? (
          <div className="card p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500"><AlertTriangle className="h-6 w-6" /></span>
            <p className="mt-2 font-medium text-zinc-800">{lang === "en" ? "Failed to load" : "তালিকা আনা যায়নি"}</p>
            <p className="mt-1 text-sm text-zinc-500">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="card h-56 animate-pulse p-5" />))}
          </div>
        ) : donors.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Droplets className="h-7 w-7" /></div>
            <p className="font-medium text-zinc-800">{hasFilter ? (lang === "en" ? "No donors match these filters" : "এই ফিল্টারে কোনো দাতা নেই") : (lang === "en" ? "No donors yet" : "এখনো কেউ নিবন্ধন করেননি")}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {grouped.map(([g, list]) => (
              <section key={g}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-bold text-zinc-900">{lang === "en" ? "Group" : "গ্রুপ"} {g}</h2>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">{list.length.toLocaleString("bn-BD")} {lang === "en" ? "donors" : "জন"}</span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((d, i) => (<Reveal key={d.id} delay={(i % 3) * 80}><DonorCard donor={d} lang={lang} /></Reveal>))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
