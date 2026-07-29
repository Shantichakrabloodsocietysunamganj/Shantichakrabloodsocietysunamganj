"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import type { Lang } from "@/lib/i18n";

// সর্বোচ্চ রক্তদানকারী দাতাদের তালিকা (leaderboard)
export default function Leaderboard({ lang }: { lang: Lang }) {
  const supabase = createClient();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const en = lang === "en";
  const medals = ["🥇", "🥈", "🥉"];

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from("donors")
          .select("id, full_name, blood_group, photo_url")
          .order("created_at", { ascending: false })
          .limit(10);
        setItems(data ?? []);
      } catch {}
      setLoading(false);
    })();
  }, [supabase]);

  if (loading) return <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="card h-16 animate-pulse" />)}</div>;
  if (items.length === 0) return <p className="text-center text-sm text-ink/50">{en ? "No donors yet." : "এখনো কেউ নিবন্ধন করেননি।"}</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((d, i) => (
        <Link key={d.id} href={`/donor/${d.id}`} className="card flex items-center gap-3 p-3 transition-all hover:-translate-y-0.5 hover:shadow-glow">
          <span className="flex h-8 w-8 items-center justify-center text-lg font-bold">
            {i < 3 ? medals[i] : <span className="text-sm text-ink/40">{i + 1}</span>}
          </span>
          {d.photo_url ? (
            <img src={d.photo_url} alt={d.full_name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">{d.full_name.charAt(0)}</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{d.full_name}</p>
            <p className="text-xs text-ink/40">{en ? "Registered donor" : "নিবন্ধিত দাতা"}</p>
          </div>
          <BloodGroupBadge group={d.blood_group} size="sm" />
        </Link>
      ))}
    </div>
  );
}
