"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { logActivity } from "@/lib/activity";

type TrashTab = "donors" | "requests";

export default function AdminTrashPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TrashTab>("donors");
  const [donors, setDonors] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const [d, r] = await Promise.all([
      supabase.from("donors").select("*").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
      supabase.from("blood_requests").select("*").not("deleted_at", "is", null).order("deleted_at", { ascending: false }),
    ]);
    setDonors(d.data ?? []);
    setRequests(r.data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function restoreDonor(id: string, name: string) {
    setBusy(true);
    await supabase.from("donors").update({ deleted_at: null }).eq("id", id);
    logActivity("দাতা restore করেছেন", name);
    setBusy(false); load();
  }
  async function restoreReq(id: string, name: string) {
    setBusy(true);
    await supabase.from("blood_requests").update({ deleted_at: null }).eq("id", id);
    logActivity("অনুরোধ restore করেছেন", name);
    setBusy(false); load();
  }
  async function permDeleteDonor(id: string, name: string) {
    if (!confirm(`"${name}" স্থায়ীভাবে মুছে ফেলবেন? এটি আর ফেরত আনা যাবে না।`)) return;
    setBusy(true);
    await supabase.from("donors").delete().eq("id", id);
    logActivity("দাতা স্থায়ীভাবে মুছেছেন", name);
    setBusy(false); load();
  }
  async function permDeleteReq(id: string, name: string) {
    if (!confirm(`"${name}" স্থায়ীভাবে মুছে ফেলবেন?`)) return;
    setBusy(true);
    await supabase.from("blood_requests").delete().eq("id", id);
    logActivity("অনুরোধ স্থায়ীভাবে মুছেছেন", name);
    setBusy(false); load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  const active = tab === "donors" ? donors : requests;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">🗑️ ট্র্যাশ — মুছে ফেলা আইটেম</h1>
          <p className="text-sm text-ink/60">soft-delete করা আইটেম এখানে — restore বা স্থায়ীভাবে মুছুন।</p>
        </div>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <nav className="mb-6 flex gap-2">
        <button onClick={() => setTab("donors")} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === "donors" ? "bg-brand-600 text-white" : "bg-white text-ink/70 ring-1 ring-zinc-200"}`}>
          🩸 দাতা ({donors.length})
        </button>
        <button onClick={() => setTab("requests")} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === "requests" ? "bg-brand-600 text-white" : "bg-white text-ink/70 ring-1 ring-zinc-200"}`}>
          📋 অনুরোধ ({requests.length})
        </button>
      </nav>

      {active.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-3xl">🗑️</p>
          <p className="mt-2 font-medium text-ink">ট্র্যাশ খালি</p>
          <p className="mt-1 text-sm text-ink/60">কোনো আইটেম soft-delete করা হয়নি।</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tab === "donors" && donors.map((d) => (
            <div key={d.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group={d.blood_group} size="sm" />
                <div>
                  <p className="font-medium text-ink">{d.full_name}</p>
                  <p className="text-xs text-ink/40">মুছেছেন: {d.deleted_at ? new Date(d.deleted_at).toLocaleString("bn-BD") : ""}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => restoreDonor(d.id, d.full_name)} disabled={busy} className="btn-outline !px-3 !py-1.5 text-xs text-success-700">↩️ Restore</button>
                <button onClick={() => permDeleteDonor(d.id, d.full_name)} disabled={busy} className="btn-ghost !px-3 !py-1.5 text-xs text-blood-600">🗑️ Permanent</button>
              </div>
            </div>
          ))}
          {tab === "requests" && requests.map((r) => (
            <div key={r.id} className="card flex items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <BloodGroupBadge group={r.blood_group} size="sm" />
                <div>
                  <p className="font-medium text-ink">{r.patient_name}</p>
                  <p className="text-xs text-ink/40">মুছেছেন: {r.deleted_at ? new Date(r.deleted_at).toLocaleString("bn-BD") : ""}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => restoreReq(r.id, r.patient_name)} disabled={busy} className="btn-outline !px-3 !py-1.5 text-xs text-success-700">↩️ Restore</button>
                <button onClick={() => permDeleteReq(r.id, r.patient_name)} disabled={busy} className="btn-ghost !px-3 !py-1.5 text-xs text-blood-600">🗑️ Permanent</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
