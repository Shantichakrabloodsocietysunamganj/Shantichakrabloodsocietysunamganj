"use client";

import { useEffect, useState } from "react";
import { Droplets, Siren, Users, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Lang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { maskName } from "@/lib/sanitize";

type Item = { icon: LucideIcon; text: string; at: number; group: string };

function rel(ts: number, en: boolean) {
  const d = Date.now() - ts;
  const m = Math.floor(d / 60000);
  if (m < 1) return en ? "just now" : "এইমাত্র";
  if (m < 60) return en ? `${m}m ago` : `${m} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return en ? `${h}h ago` : `${h} ঘণ্টা আগে`;
  const day = Math.floor(h / 24);
  return en ? `${day}d ago` : `${day} দিন আগে`;
}

export default function ActivityFeed({ lang }: { lang: Lang }) {
  const supabase = createClient();
  const en = lang === "en";
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [reqs, donors, vols] = await Promise.all([
        supabase.from("public_blood_requests").select("patient_name,blood_group,upazila,created_at").in("status", ["pending", "approved"]).order("created_at", { ascending: false }).limit(5),
        supabase.from("public_donors").select("full_name,blood_group,created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("public_volunteers").select("full_name,upazila,created_at").order("created_at", { ascending: false }).limit(4),
      ]);
      const list: Item[] = [];
      (reqs.data ?? []).forEach((r: { patient_name: string; blood_group: string; upazila: string; created_at: string }) =>
        list.push({ icon: Siren, group: "request", at: new Date(r.created_at).getTime(), text: en ? `Blood request: ${maskName(r.patient_name)} (${r.blood_group}) — ${r.upazila}` : `রক্তের অনুরোধ: ${maskName(r.patient_name)} (${r.blood_group}) — ${r.upazila}` }),
      );
      (donors.data ?? []).forEach((d: { full_name: string; blood_group: string; created_at: string }) =>
        list.push({ icon: Droplets, group: "donor", at: new Date(d.created_at).getTime(), text: en ? `New donor: ${d.full_name} (${d.blood_group})` : `নতুন দাতা: ${d.full_name} (${d.blood_group})` }),
      );
      (vols.data ?? []).forEach((v: { full_name: string; upazila: string | null; created_at: string }) =>
        list.push({ icon: Users, group: "volunteer", at: new Date(v.created_at).getTime(), text: en ? `Volunteer joined: ${v.full_name}${v.upazila ? " — " + v.upazila : ""}` : `স্বেচ্ছাসেবক যোগ দিয়েছেন: ${v.full_name}${v.upazila ? " — " + v.upazila : ""}` }),
      );
      list.sort((a, b) => b.at - a.at);
      setItems(list.slice(0, 8));
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60000); // auto-refresh every 60s
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // কোনো কার্যকলাপ না থাকলে পুরো সেকশনটি লুকানো থাকে
  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-white py-14 dark:bg-slate-950/40">
      <div className="container-page">
        <Reveal>
          <div className="mb-6 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success-500" />
            </span>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">{en ? "Live Activity" : "লাইভ কার্যকলাপ"}</h2>
            <span className="text-xs text-ink/40">{en ? "updates automatically" : "স্বয়ংক্রিয় আপডেট"}</span>
          </div>
        </Reveal>
        <div className="space-y-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-zinc-100 dark:bg-white/5" />)
          ) : (
            items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-2.5 dark:border-white/5 dark:bg-white/5">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${it.group === "request" ? "bg-blood-50 text-blood-600" : it.group === "donor" ? "bg-brand-50 text-brand-600" : "bg-emerald-50 text-emerald-600"}`}>
                  <it.icon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-ink/80">{it.text}</p>
                <span className="shrink-0 text-[11px] text-ink/40">{rel(it.at, en)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
