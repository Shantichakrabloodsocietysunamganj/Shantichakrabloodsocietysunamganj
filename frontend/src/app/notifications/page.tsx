"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GridSkeleton } from "@/components/ui/Skeleton";

export default function NotificationsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setItems(data ?? []);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  const markAll = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    load();
  };

  if (loading) return <div className="container-page py-12"><GridSkeleton count={2} /></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">🔔 বিজ্ঞপ্তি</h1>
          <p className="text-sm text-ink/60">আপনার সাম্প্রতিক নোটিফিকেশন।</p>
        </div>
        {items.some((i) => !i.is_read) && (
          <button onClick={markAll} className="btn-outline">সব পঠিত হিসেবে চিহ্নিত করুন</button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl">🔕</p>
          <p className="mt-2 font-medium text-ink">কোনো নোটিফিকেশন নেই</p>
          <Link href="/" className="btn-outline mt-4">হোমে যান</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div key={n.id} className={`card p-5 ${n.is_read ? "opacity-70" : "ring-1 ring-brand-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{n.title}</p>
                  {n.body && <p className="mt-1 text-sm text-ink/60">{n.body}</p>}
                </div>
                {!n.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
