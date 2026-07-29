"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

// লগইন করা ইউজারের না-পঠিত নোটিফিকেশন সংখ্যা দেখায়
export default function NotificationBell() {
  const supabase = createClient();
  const [count, setCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !active) return;
      const { count: c } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
      if (active) {
        setCount(c ?? 0);
        setReady(true);
      }
    })();
    return () => { active = false; };
  }, [supabase]);

  if (!ready) return null;

  return (
    <Link href="/notifications" className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink/70 hover:bg-brand-50 hover:text-brand-700" aria-label="বিজ্ঞপ্তি">
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0a3 3 0 1 1-6 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 animate-pop items-center justify-center rounded-full bg-blood-500 px-1 text-[10px] font-bold text-white">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
