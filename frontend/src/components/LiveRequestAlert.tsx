"use client";

// =====================================================================
//  LiveRequestAlert — সাইটের যেকোনো পেজে থাকা অবস্থায় কেউ নতুন রক্তের
//  অনুরোধ পোস্ট করলে নিচে-ডানে একটি লাইভ পপ-আপ কার্ড দেখা যায়।
//  ইউজার বুঝতে পারে — এটি সত্যিকারের লাইভ সিস্টেম।
// =====================================================================

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Droplets, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { BloodRequest } from "@/lib/types";
import { useLangClient } from "@/lib/i18n";

const DISMISS_MS = 14000;

export default function LiveRequestAlert() {
  const supabase = useMemo(() => createClient(), []);
  const lang = useLangClient();
  const en = lang === "en";
  const [item, setItem] = useState<BloodRequest | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;

    const channel = supabase
      .channel("live-request-alert")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "blood_requests" }, (payload) => {
        const row = payload.new as BloodRequest;
        if (!["pending", "approved"].includes(row.status)) return;
        if ((row as any).deleted_at) return;
        setItem(row);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setItem(null), DISMISS_MS);

        // মৃদু নোটিফিকেশন সাউন্ড (ব্রাউজার অনুমতি দিলে)
        try {
          const Ctx = (window as any).AudioContext ?? (window as any).webkitAudioContext;
          if (!Ctx) return;
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
        } catch {}
      })
      .subscribe();

    return () => {
      clearTimeout(hideTimer);
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!item) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[60] w-[min(20rem,calc(100vw-2rem))] animate-panel-in sm:right-24">
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
              {en ? `${item.patient_name} needs blood` : `${item.patient_name}-এর রক্ত দরকার`}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/55">
              {item.units_needed} {en ? "unit(s)" : "ব্যাগ"} • {item.hospital}
            </p>
            <p className="mt-0.5 truncate text-xs text-ink/45">{item.upazila}</p>
          </div>
        </div>

        <div className="flex gap-2 border-t border-zinc-100 p-3 dark:border-white/10">
          <a href={`tel:${item.contact_phone}`} className="btn-blood flex-1 !py-2 text-xs">
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
