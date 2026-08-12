"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTr } from "@/lib/useLang";

// জরুরি রক্তের অনুরোধ থাকলে উপরে পালসিং ব্যানার দেখায় — এখন রিয়েল-টাইম
export default function EmergencyBanner() {
  const { t: tx } = useTr();
  const supabase = useMemo(() => createClient(), []);
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { count: c } = await supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .in("status", ["pending", "approved"])
          .gte("needed_date", new Date().toISOString().slice(0, 10));
        setCount(c ?? 0);
        setShow(!!c && c > 0);
      } catch {}
    };
    load();

    // নতুন অনুরোধ এলে সাথে সাথে গণনা বাড়ে (realtime)
    const channel = supabase
      .channel("emergency-banner-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "blood_requests" }, () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 2500);
        load();
      })
      .subscribe();

    const id = setInterval(load, 60000);
    return () => {
      clearInterval(id);
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (!show) return null;

  return (
    <a
      href="/blood-seekers"
      className={`fixed inset-x-0 top-16 z-[50] flex min-h-12 items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold text-white shadow-md transition-all lg:top-16 ${
        flash ? "bg-blood-700 animate-pulse" : "bg-blood-600 hover:bg-blood-700"
      }`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      🚨 {count.toLocaleString("bn-BD")} {tx("টি জরুরি রক্তের অনুরোধ অপেক্ষমাণ — দেখুন →")}
    </a>
  );
}
