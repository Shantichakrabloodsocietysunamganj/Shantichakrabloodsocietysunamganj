"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { looksLikeRequestId, sanitizePublicSearch } from "@/lib/sos";
import { getOwnedBloodRequests } from "@/lib/requestOwnership";
import { shortDate } from "@/lib/format";
import { maskName } from "@/lib/sanitize";
import type { PublicBloodRequest } from "@/lib/types";
import { useTr } from "@/lib/useLang";

const PUBLIC_COLS =
  "id, patient_name, blood_group, units_needed, hospital, district, upazila, needed_date, contact_name, message, blood_component, status, created_at";

export default function TrackClient() {
  const { t: tx, lang } = useTr();
  const supabase = useMemo(() => createClient(), []);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<PublicBloodRequest[]>([]);
  const [owned, setOwned] = useState<PublicBloodRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ids = getOwnedBloodRequests().map((o) => o.id);
    if (ids.length === 0) return;
    supabase
      .from("public_blood_requests")
      .select(PUBLIC_COLS)
      .in("id", ids)
      .then(({ data }) => {
        if (data) setOwned(data as PublicBloodRequest[]);
      });
  }, [supabase]);

  const search = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const raw = sanitizePublicSearch(q);
    if (!raw) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    try {
      let query = supabase.from("public_blood_requests").select(PUBLIC_COLS).order("created_at", { ascending: false }).limit(20);
      if (looksLikeRequestId(raw)) {
        query = query.eq("id", raw);
      } else {
        query = query.or(`patient_name.ilike.%${raw}%,hospital.ilike.%${raw}%`);
      }
      const { data, error: err } = await query;
      if (err) throw err;
      setResults((data as PublicBloodRequest[]) ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("অনুরোধ ট্র্যাক করুন")}</span>
        <h1 className="section-title mt-3">{tx("রক্ত পেয়েছেন কি না, অনুরোধ এখনো লাইভ কি না — দেখে নিন।")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
      </header>

      <form onSubmit={search} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="track-q">{tx("রোগীর নাম, হাসপাতাল বা অনুরোধ আইডি")}</label>
        <input
          id="track-q"
          className="input h-12 flex-1"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={tx("রোগীর নাম, হাসপাতাল বা অনুরোধ আইডি")}
        />
        <button type="submit" disabled={loading || !q.trim()} className="btn-primary h-12 sm:w-36">
          {loading ? tx("খুঁছি…") : tx("খুঁজুন")}
        </button>
      </form>
      <p className="mx-auto mt-2 max-w-xl text-center text-xs text-ink/45">
        {tx("নাম বা হাসপাতাল একটু অন্যভাবে লিখে দেখুন। ফোন নম্বর দিয়ে খোঁজা যায় না — গোপনীয়তার জন্য।")}
      </p>

      {owned.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="font-display text-lg font-bold text-ink">{tx("এই ডিভাইস থেকে করা অনুরোধ")}</h2>
          <div className="mt-4 space-y-3">
            {owned.map((r) => <ResultCard key={r.id} r={r} lang={lang} />)}
          </div>
        </section>
      )}

      <section className="mx-auto mt-10 max-w-3xl">
        {error && <p className="card p-6 text-center text-sm text-blood-600">{error}</p>}
        {searched && !loading && results.length === 0 && !error && (
          <div className="card p-10 text-center">
            <p className="text-3xl">📡</p>
            <p className="mt-3 font-semibold text-ink">{tx("কোনো অনুরোধ পাওয়া যায়নি")}</p>
            <Link href="/request-blood" className="btn-primary mt-4">{tx("নতুন অনুরোধ পোস্ট করুন")}</Link>
          </div>
        )}
        {results.length > 0 && (
          <>
            <p className="mb-3 text-sm text-ink/50">
              {results.length} {tx("টি মিলেছে")}
            </p>
            <div className="space-y-3">
              {results.map((r) => <ResultCard key={r.id} r={r} lang={lang} />)}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ResultCard({ r, lang }: { r: PublicBloodRequest; lang: "bn" | "en" }) {
  const live = r.status === "pending" || r.status === "approved";
  const label =
    r.status === "completed" ? (lang === "en" ? "Completed" : "সম্পন্ন")
      : r.status === "cancelled" ? (lang === "en" ? "Cancelled" : "বাতিল")
        : (lang === "en" ? "Live" : "লাইভ");
  const tone = live ? "bg-brand-500" : r.status === "completed" ? "bg-success-500" : "bg-zinc-500";

  return (
    <Link href={`/requests/${r.id}`} className="card-hover flex items-start gap-4 p-4">
      <BloodGroupBadge group={r.blood_group} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-ink">{maskName(r.patient_name)}</p>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${tone}`}>{label}</span>
        </div>
        <p className="mt-0.5 truncate text-sm text-ink/55">
          {r.units_needed} {lang === "en" ? "units" : "ইউনিট"} • {r.hospital} • {r.upazila}
        </p>
        <p className="mt-0.5 text-xs text-ink/40">{shortDate(r.needed_date, lang)}</p>
      </div>
      <span className="shrink-0 text-sm font-semibold text-brand-600">{lang === "en" ? "View" : "দেখুন"} →</span>
    </Link>
  );
}
