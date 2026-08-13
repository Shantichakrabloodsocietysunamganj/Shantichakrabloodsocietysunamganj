"use client";

// =====================================================================
//  LiveRequestAlert — সাইটের যেকোনো পেজে থাকা অবস্থায় কেউ নতুন রক্তের
//  অনুরোধ পোস্ট করলে নিচে-ডানে একটি লাইভ পপ-আপ কার্ড দেখা যায়।
//
//  Privacy (Phase 1+2): the base-table postgres_changes subscription was
//  removed — it delivered raw contact_phone to every client. This component
//  now polls the safe `public_blood_requests` view and only ever receives
//  public columns. Contact always goes through the rate-limited endpoint.
// =====================================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Droplets, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { PublicBloodRequest } from "@/lib/types";
import { useLang } from "@/lib/useLang";
import { maskName } from "@/lib/sanitize";

const DISMISS_MS = 14000;
const POLL_MS = 30000;
const FRESH_MS = 60 * 1000;

export default function LiveRequestAlert() {
  const supabase = useMemo(() => createClient(), []);
  const lang = useLang();
  const en = lang === "en";
  const [item, setItem] = useState<PublicBloodRequest | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const knownIds = new Set<string>();
    let firstRun = true;

    const check = async () => {
      const { data } = await supabase
        .from("public_blood_requests")
        .select("id, patient_name, blood_group, units_needed, hospital, upazila, created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      if (!data) return;

      if (firstRun) {
        data.forEach((r) => knownIds.add(r.id));
        firstRun = false;
        return;
      }

      for (const row of data as PublicBloodRequest[]) {
        if (knownIds.has(row.id)) continue;
        knownIds.add(row.id);
        // Only alert for genuinely new requests (posted within the last minute).
        if (Date.now() - new Date(row.created_at).getTime() > FRESH_MS) continue;
        setItem(row);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setItem(null), DISMISS_MS);
        // মৃদু নোটিফিকেশন সাউন্ড (ব্রাউজার অনুমতি দিলে)
        try {
          const Ctx = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ??
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (!Ctx) continue;
          const ctx = new Ctx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.setValueAtTime(1180, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
          osc.connect(gain).connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.32);
        } catch {
          /* ignore */
        }
        break;
      }
    };

    check();
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      check();
    }, POLL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(hideTimer);
    };
  }, [supabase]);

  if (!item) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[48] w-[min(20rem,calc(100vw-2rem))] animate-panel-in sm:right-24">
      <div className="overflow-hidden rounded-2xl border border-blood-200 bg-white shadow-2xl dark:border-blood-500/30 dark:bg-slate-900">
        <div className="flex items-center justify-between bg-gradient-to-r from-blood-600 to-blood-500 px-4 py-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            {en ? "NEW BLOOD REQUEST" : "নতুন রক্তের অনুরোধ"}
          </span>
          <button onClick={() => setItem(null)} aria-label={en ? "Close" : "বন্ধ"} className="text-white/80 transition hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-start gap-3 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blood-50 font-display text-sm font-extrabold text-blood-600 dark:bg-blood-500/10">
            {item.blood_group}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-ink">
              {en ? `${maskName(item.patient_name)} needs blood` : `${maskName(item.patient_name)}-এর রক্ত দরকার`}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/55">
              {item.units_needed} {en ? "unit(s)" : "ব্যাগ"} • {item.hospital}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/45">{item.upazila}</p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-zinc-100 p-3 dark:border-white/10">
          <a href={`/api/requests/${item.id}/contact?channel=call`} className="btn-blood flex-1 !py-2 text-xs">
            <Droplets className="h-3.5 w-3.5" /> {en ? "Call now" : "এখনই কল"}
          </a>
          <Link href="/blood-seekers" onClick={() => setItem(null)} className="btn-ghost !py-2 text-xs">
            {en ? "See all" : "সব দেখুন"}
          </Link>
        </div>
      </div>
    </div>
  );
}
