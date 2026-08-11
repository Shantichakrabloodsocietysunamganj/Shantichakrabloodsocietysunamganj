"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Lang } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import { Droplets, HandHeart, Siren } from "@/components/icons";

type Item = { icon: string; text: string; at: number; group: string };

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
        supabase.from("blood_requests").select("patient_name,blood_group,upazila,created_at").in("status", ["pending", "approved"]).order("created_at", { ascending: false }).limit(5),
        supabase.from("donors").select("full_name,blood_group,created_at").eq("approved", true).order("created_at", { ascending: false }).limit(5),
        supabase.from("volunteers").select("full_name,upazila,created_at").order("created_at", { ascending: false }).limit(4),
      ]);
      const list: Item[] = [];
      (reqs.data ?? []).forEach((r: any) =>
        list.push({ icon: "request", group: "request", at: new Date(r.created_at).getTime(), text: en ? `Blood request: ${r.patient_name} (${r.blood_group}) — ${r.upazila}` : `রক্তের অনুরোধ: ${r.patient_name} (${r.blood_group}) — ${r.upazila}` }),
      );
      (donors.data ?? []).forEach((d: any) =>
        list.push({ icon: "donor", group: "donor", at: new Date(d.created_at).getTime(), text: en ? `New donor: ${d.full_name} (${d.blood_group})` : `নতুন দাতা: ${d.full_name} (${d.blood_group})` }),
      );
      (vols.data ?? []).forEach((v: any) =>
        list.push({ icon: "volunteer", group: "volunteer", at: new Date(v.created_at).getTime(), text: en ? `Volunteer joined: ${v.full_name}${v.upazila ? " — " + v.upazila : ""}` : `স্বেচ্ছাসেবক যোগ দিয়েছেন: ${v.full_name}${v.upazila ? " — " + v.upazila : ""}` }),
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
          ) : items.length === 0 ? (
            <p className="text-sm text-ink/50">{en ? "No recent activity." : "কোনো সাম্প্রতিক কার্যকলাপ নেই।"}</p>
          ) : (
            items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-2.5 dark:border-white/5 dark:bg-white/5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${it.icon === "request" ? "bg-blood-50 text-blood-600" : it.icon === "donor" ? "bg-brand-50 text-brand-600" : "bg-sky-50 text-sky-600"}`}>
                  {it.icon === "request" ? <Siren className="h-3.5 w-3.5" /> : it.icon === "donor" ? <Droplets className="h-3.5 w-3.5" /> : <HandHeart className="h-3.5 w-3.5" />}
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
