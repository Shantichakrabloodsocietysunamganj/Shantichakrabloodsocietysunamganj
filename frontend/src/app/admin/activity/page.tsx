"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ClipboardList, Shield } from "@/components/icons";

export default function AdminActivityPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(100);
    setLogs(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Shield className="h-7 w-7" /></span><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink"><ClipboardList className="h-6 w-6 text-brand-600" />অ্যাক্টিভিটি লগ</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>
      <div className="space-y-2">
        {logs.map((l) => (
          <div key={l.id} className="card flex items-center justify-between gap-3 p-3 text-sm">
            <div>
              <p className="font-medium text-ink">{l.action} {l.detail && <span className="text-ink/50">— {l.detail}</span>}</p>
              <p className="text-xs text-ink/40">by {l.actor}</p>
            </div>
            <span className="text-xs text-ink/40">{new Date(l.created_at).toLocaleString("bn-BD")}</span>
          </div>
        ))}
        {logs.length === 0 && <p className="text-center text-sm text-ink/50">এখনো কোনো কার্যকলাপ লগ নেই।</p>}
      </div>
    </div>
  );
}
