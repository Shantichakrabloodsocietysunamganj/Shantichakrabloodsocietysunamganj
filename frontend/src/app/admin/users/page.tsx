"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (me?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("profiles").select("id, full_name, phone, role, is_verified, created_at").order("created_at", { ascending: false });
    setUsers(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function setRole(id: string, role: string, name: string) {
    setBusy(true);
    await supabase.from("profiles").update({ role }).eq("id", id);
    setBusy(false);
    load();
  }

  async function toggleVerify(id: string, val: boolean) {
    setBusy(true);
    await supabase.from("profiles").update({ is_verified: val }).eq("id", id);
    setBusy(false);
    load();
  }

  const ROLES = [
    { value: "user", label: "User", icon: "👤" },
    { value: "donor", label: "Donor", icon: "🩸" },
    { value: "admin", label: "Admin", icon: "🛡️" },
  ];

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">👥 User & Role Management</h1>
          <p className="text-sm text-ink/60">সব নিবন্ধিত ইউজার ও তাদের role পরিচালনা করুন।</p>
        </div>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="card p-4 text-center"><p className="text-2xl font-extrabold text-ink">{users.length}</p><p className="text-xs text-ink/50">Total Users</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-extrabold text-brand-600">{users.filter((u) => u.role === "admin").length}</p><p className="text-xs text-ink/50">Admins</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-extrabold text-success-600">{users.filter((u) => u.is_verified).length}</p><p className="text-xs text-ink/50">Verified</p></div>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-600">
                {(u.full_name ?? "?").charAt(0)}
              </span>
              <div>
                <p className="font-medium text-ink">{u.full_name ?? "Unknown"} {u.is_verified && <span className="text-success-600">✓</span>}</p>
                <p className="text-xs text-ink/40">{u.phone ?? "no phone"} • joined {new Date(u.created_at).toLocaleDateString("bn-BD")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Verify toggle */}
              <button
                onClick={() => toggleVerify(u.id, !u.is_verified)}
                disabled={busy}
                className={`btn-ghost !px-2 !py-1.5 text-xs ${u.is_verified ? "text-success-700" : "text-ink/40"}`}
              >
                {u.is_verified ? "✓ Verified" : "Unverified"}
              </button>
              {/* Role selector */}
              <select
                value={u.role}
                onChange={(e) => setRole(u.id, e.target.value, u.full_name)}
                disabled={busy}
                className="input !w-auto !py-1.5 text-xs"
              >
                {ROLES.map((r) => <option key={r.value} value={r.value}>{r.icon} {r.label}</option>)}
              </select>
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="py-10 text-center text-sm text-ink/50">কোনো নিবন্ধিত ইউজার নেই।</p>}
      </div>
    </div>
  );
}
