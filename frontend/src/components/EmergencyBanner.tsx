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
        // Safe-view count only — the base-table realtime subscription was
        // removed because it delivered raw request rows to every client.
        const { count: c } = await supabase
          .from("public_blood_requests")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "approved"])
          .gte("needed_date", new Date().toISOString().slice(0, 10));
        setCount(c ?? 0);
        setShow(!!c && c > 0);
      } catch {
        /* ignore */
      }
    };
    load();

    const id = setInterval(load, 60000);
    return () => {
      clearInterval(id);
    };
  }, [supabase]);

  if (!show) return null;

  return (
    <a
      href="/blood-seekers"
      // The banner lives in normal document flow (right under the sticky
      // navbar), so it scrolls away with the page instead of staying pinned
      // over the viewport. z-40 keeps it below the navbar/menu (z-50) so the
      // mobile menu panel is never covered by the banner.
      className={`relative z-40 flex min-h-12 items-center justify-center gap-2 px-4 py-2 text-center text-sm font-bold text-white shadow-md transition-all ${
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
