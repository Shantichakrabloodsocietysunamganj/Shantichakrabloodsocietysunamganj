"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "@/components/StatusBadge";
import { HandHeart, MapPin, Phone, Shield, X } from "@/components/icons";

export default function AdminVolunteersPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("volunteers").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(id: string, status: string) {
    await supabase.from("volunteers").update({ status }).eq("id", id);
    load();
  }
  async function remove(id: string) {
    await supabase.from("volunteers").delete().eq("id", id);
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Shield className="h-7 w-7" /></span><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink"><HandHeart className="h-6 w-6 text-brand-600" />স্বেচ্ছাসেবক ব্যবস্থাপনা</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <div className="space-y-3">
        {items.map((v) => (
          <div key={v.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{v.full_name} <StatusBadge status={v.status} /></p>
                <p className="flex items-center gap-1 text-sm text-ink/60"><Phone className="h-3.5 w-3.5 shrink-0" />{v.phone} {v.email && `• ${v.email}`}</p>
                <p className="flex items-center gap-1 text-sm text-ink/60"><MapPin className="h-3.5 w-3.5 shrink-0" />{v.upazila ?? "—"} {v.role && `• ${v.role}`}</p>
              </div>
              <div className="flex gap-2">
                {v.status === "active"
                  ? <button onClick={() => setStatus(v.id, "inactive")} className="btn-outline !px-3 !py-1.5 text-xs">নিষ্ক্রিয় করুন</button>
                  : <button onClick={() => setStatus(v.id, "active")} className="btn-outline !px-3 !py-1.5 text-xs text-success-700">অনুমোদন</button>}
                <button onClick={() => remove(v.id)} className="btn-ghost !px-2 !py-1.5 text-xs text-blood-600"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-ink/50">কোনো স্বেচ্ছাসেবক নেই।</p>}
      </div>
    </div>
  );
}
