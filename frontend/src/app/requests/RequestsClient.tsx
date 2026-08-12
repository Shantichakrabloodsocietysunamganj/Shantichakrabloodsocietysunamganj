"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS } from "@/data/constants";
import type { BloodRequest } from "@/lib/types";
import RequestCard from "@/components/RequestCard";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { t, useLangClient } from "@/lib/i18n";

export default function RequestsPage() {
  const supabase = createClient();
  const lang = useLangClient();
  const [group, setGroup] = useState("");
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("blood_requests")
          .select("*")
          .in("status", ["pending", "approved"])
          .order("needed_date", { ascending: true })
          .order("created_at", { ascending: false });
        if (group) query = query.eq("blood_group", group);
        const { data, error } = await query.limit(60);
        if (error) throw error;
        setRequests((data as BloodRequest[]) ?? []);
      } catch (e: any) {
        setError(e?.message ?? "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [supabase, group]);

  return (
    <div className="container-page py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <span className="eyebrow">{t("donors.group", lang)}</span>
          <h1 className="section-title mt-3">{t("requests.title", lang)}</h1>
          <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-blood-500 to-brand-600" />
          <p className="mt-4 text-ink/60">{t("requests.desc", lang)}</p>
        </div>
        <Link href="/request-blood" className="btn-primary shrink-0">{t("requests.new", lang)}</Link>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        <button
          onClick={() => setGroup("")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${!group ? "bg-brand-600 text-white" : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-brand-50 hover:text-brand-700"}`}
        >
          {lang === "en" ? "All Groups" : "সব গ্রুপ"}
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
            <p className="font-medium text-zinc-700">⚠️ {lang === "en" ? "Failed to load" : "তালিকা আনা যায়নি"}</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        ) : loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (<div key={i} className="card h-64 animate-pulse" />))}
          </div>
        ) : requests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl">✓</div>
            <p className="font-medium text-zinc-800">{lang === "en" ? "No urgent requests right now" : "এই মুহূর্তে কোনো জরুরি অনুরোধ নেই"}</p>
            <p className="mt-1 text-sm text-zinc-500">{lang === "en" ? "Everyone is safe." : "সবাই নিরাপদে আছেন।"}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 80}><RequestCard req={r} lang={lang} /></Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
