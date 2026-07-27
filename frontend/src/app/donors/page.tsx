"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, SUNAMGANJ_UPAZILAS } from "@/data/constants";
import type { Donor } from "@/lib/types";
import DonorCard from "@/components/DonorCard";

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

  const [group, setGroup] = useState(params.get("group") ?? "");
  const [upazila, setUpazila] = useState(params.get("upazila") ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("donors")
        .select("*")
        .order("is_available", { ascending: false })
        .order("created_at", { ascending: false });

      if (group) query = query.eq("blood_group", group);
      if (upazila) query = query.eq("upazila", upazila);
      if (onlyAvailable) query = query.eq("is_available", true);

      const { data, error } = await query.limit(100);
      if (error) throw error;

      let list = (data as Donor[]) ?? [];
      if (q.trim()) {
        const t = q.trim().toLowerCase();
        list = list.filter(
          (d) =>
            d.full_name.toLowerCase().includes(t) ||
            (d.area ?? "").toLowerCase().includes(t) ||
            (d.phone ?? "").includes(t),
        );
      }
      setDonors(list);
    } catch (e: any) {
      setError(e?.message ?? "রক্তদাতা তালিকা আনা যায়নি");
      setDonors([]);
    } finally {
      setLoading(false);
    }
  }, [supabase, group, upazila, onlyAvailable, q]);

  useEffect(() => {
    fetchDonors();
    // URL sync
    const sp = new URLSearchParams();
    if (group) sp.set("group", group);
    if (upazila) sp.set("upazila", upazila);
    if (q) sp.set("q", q);
    const qs = sp.toString();
    router.replace(qs ? `/donors?${qs}` : "/donors");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, upazila, onlyAvailable, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, Donor[]>();
    for (const d of donors) {
      const arr = map.get(d.blood_group) ?? [];
      arr.push(d);
      map.set(d.blood_group, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [donors]);

  const clearFilters = () => {
    setGroup("");
    setUpazila("");
    setQ("");
    setOnlyAvailable(false);
  };

  const hasFilter = group || upazila || q || onlyAvailable;

  return (
    <div className="container-page py-10">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">রক্তদাতা খুঁজুন</h1>
        <p className="mt-2 text-zinc-600">
          গ্রুপ ও এলাকা দিয়ে সুনামগঞ্জের নিবন্ধিত রক্তদাতা খুঁজে বের করুন। সরাসরি ফোন কলে যোগাযোগ করুন।
        </p>
      </header>

      {/* Filters */}
      <div className="mt-8 card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label">রক্তের গ্রুপ</label>
            <select className="input" value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">সব গ্রুপ</option>
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">উপজেলা</label>
            <select className="input" value={upazila} onChange={(e) => setUpazila(e.target.value)}>
              <option value="">সব উপজেলা</option>
              {SUNAMGANJ_UPAZILAS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">নাম / এলাকা / ফোন</label>
            <input
              className="input"
              placeholder="যেমন: রহিম, ছাতক, 01..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
            />
            শুধু প্রস্তুত দাতা দেখান
          </label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-500">
              {loading ? "খুঁছি..." : `${donors.length.toLocaleString("bn-BD")} জন পাওয়া গেছে`}
            </span>
            {hasFilter && (
              <button onClick={clearFilters} className="text-sm font-medium text-brand-600 hover:underline">
                ফিল্টার মুছুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {error ? (
          <ErrorState message={error} />
        ) : loading ? (
          <GridSkeleton />
        ) : donors.length === 0 ? (
          <EmptyState hasFilter={!!hasFilter} />
        ) : (
          <div className="space-y-12">
            {grouped.map(([g, list]) => (
              <section key={g}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-bold text-zinc-900">গ্রুপ {g}</h2>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                    {list.length.toLocaleString("bn-BD")} জন
                  </span>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((d) => (
                    <DonorCard key={d.id} donor={d} />
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

function ErrorState({ message }: { message: string }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-3xl">⚠️</p>
      <p className="mt-2 font-medium text-zinc-800">তালিকা আনা যায়নি</p>
      <p className="mt-1 text-sm text-zinc-500">{message}</p>
      <p className="mt-1 text-xs text-zinc-400">Supabase-এ schema.sql চালানো হয়েছে কিনা দেখুন।</p>
    </div>
  );
}

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  return (
    <div className="card p-12 text-center">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-2xl">🩸</div>
      <p className="font-medium text-zinc-800">
        {hasFilter ? "এই ফিল্টারে কোনো দাতা নেই" : "এখনো কোনো রক্তদাতা নিবন্ধন করেননি"}
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        {hasFilter ? "ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।" : "প্রথম রক্তদাতা হিসেবে যুক্ত হোন!"}
      </p>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card h-56 animate-pulse p-5">
          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-2xl bg-zinc-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-zinc-100" />
              <div className="h-3 w-1/2 rounded bg-zinc-100" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full rounded bg-zinc-100" />
            <div className="h-3 w-1/2 rounded bg-zinc-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
