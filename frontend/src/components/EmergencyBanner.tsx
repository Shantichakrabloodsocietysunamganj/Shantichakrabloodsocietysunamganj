"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Siren } from "@/components/icons";

// জরুরি রক্তের অনুরোধ থাকলে উপরে পালসিং ব্যানার দেখায়
export default function EmergencyBanner() {
  const supabase = createClient();
  const [count, setCount] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
        const { count: c } = await supabase
          .from("blood_requests")
          .select("*", { count: "exact", head: true })
          .in("status", ["pending", "approved"])
          .gte("needed_date", new Date().toISOString().slice(0, 10));
        if (c && c > 0) { setCount(c); setShow(true); }
      } catch {}
    };
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [supabase]);

  if (!show) return null;

  return (
    <a
      href="/requests"
      className="fixed inset-x-0 top-16 z-[50] flex items-center justify-center gap-2 bg-blood-600 px-4 py-1.5 text-center text-xs font-bold text-white shadow-md transition-transform hover:bg-blood-700 lg:top-16"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      <Siren className="h-3.5 w-3.5" />{count} টি জরুরি রক্তের অনুরোধ অপেক্ষমাণ — দেখুন →
    </a>
  );
}
