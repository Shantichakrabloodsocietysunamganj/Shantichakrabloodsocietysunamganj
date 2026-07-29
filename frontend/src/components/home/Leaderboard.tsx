"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import type { Lang } from "@/lib/i18n";

type Row = { id: string; full_name: string; blood_group: string; photo_url: string | null; units: number };

// সর্বোচ্চ রক্তদানকারী দাতা — donation units অনুযায়ী সাজানো
export default function Leaderboard({ lang }: { lang: Lang }) {
  const supabase = createClient();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const en = lang === "en";
  const medals = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    (async () => {
      try {
        // donation গুলো একত্রিত করে প্রতি দাতার মোট unit বের করি
        const { data: dons } = await supabase.from("donations").select("donor_id, units").limit(500);
        const totals = new Map<string, number>();
        (dons ?? []).forEach((d: any) => {
          if (d.donor_id) totals.set(d.donor_id, (totals.get(d.donor_id) ?? 0) + (d.units ?? 1));
        });
        const ranked = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

        let result: Row[] = [];
        if (ranked.length) {
          const { data: donors } = await supabase
            .from("donors")
            .select("id, full_name, blood_group, photo_url")
            .in("id", ranked.map(([id]) => id));
          const map = new Map((donors ?? []).map((d: any) => [d.id, d]));
          result = ranked
            .map(([id, units]) => {
              const d = map.get(id);
              return d ? { ...d, units } : null;
            })
            .filter((x): x is Row => x !== null);
        }

        // fallback: কোনো donation রেকর্ড না থাকলে সাম্প্রতিক নিবন্ধিত দাতা
        if (!result.length) {
          const { data: recent } = await supabase
            .from("donors")
            .select("id, full_name, blood_group, photo_url")
            .order("created_at", { ascending: false })
            .limit(10);
          result = (recent ?? []).map((d: any) => ({ ...d, units: 0 }));
        }
        setItems(result);
      } catch {}
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;
  if (items.length === 0) return <p className="text-center text-sm text-ink/50">{en ? "No donors yet." : "এখনো কেউ নিবন্ধন করেননি।"}</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((d, i) => (
        <Link key={d.id} href={`/donor/${d.id}`} className="card-hover flex items-center gap-3 p-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center font-display text-lg font-extrabold">
            {i < 3 ? medals[i] : <span className="text-sm text-ink/40">{i + 1}</span>}
          </span>
          {d.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.photo_url} alt={d.full_name} className="h-10 w-10 rounded-full object-cover ring-2 ring-white" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">{d.full_name.charAt(0)}</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{d.full_name}</p>
            <p className="text-xs text-ink/40">
              {d.units > 0 ? `${d.units} ${en ? "units donated" : "ইউনিট রক্তদান"}` : en ? "Registered donor" : "নিবন্ধিত দাতা"}
            </p>
          </div>
          <BloodGroupBadge group={d.blood_group} size="sm" />
        </Link>
      ))}
    </div>
  );
}
