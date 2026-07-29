"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { logActivity } from "@/lib/activity";

export default function AdminDonationsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [donors, setDonors] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ donor_id: "", units: 1, donated_at: new Date().toISOString().slice(0, 10), note: "" });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const [d, dons] = await Promise.all([
      supabase.from("donors").select("id, full_name, blood_group").order("full_name"),
      supabase.from("donations").select("id, units, donated_at, note, donor:donors(full_name, blood_group)").order("donated_at", { ascending: false }).limit(50),
    ]);
    setDonors(d.data ?? []);
    setItems(dons.data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function record(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("donations").insert({
      donor_id: form.donor_id,
      units: Number(form.units),
      donated_at: form.donated_at,
      note: form.note || null,
    });
    if (!error) {
      // দাতার সর্বশেষ রক্তদানের তারিখ আপডেট
      await supabase.from("donors").update({ last_donation_date: form.donated_at }).eq("id", form.donor_id);
      const dn = donors.find((x) => x.id === form.donor_id);
      logActivity("রক্তদান রেকর্ড করেছেন", dn?.full_name);
      setForm({ donor_id: "", units: 1, donated_at: new Date().toISOString().slice(0, 10), note: "" });
      load();
    }
  }
  async function remove(id: string) {
    await supabase.from("donations").delete().eq("id", id);
    logActivity("রক্তদান রেকর্ড মুছেছেন");
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">🩸 রক্তদানের রেকর্ড</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={record} className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-ink">নতুন রক্তদান রেকর্ড করুন</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className="input" required value={form.donor_id} onChange={(e) => setForm({ ...form, donor_id: e.target.value })}>
            <option value="">রক্তদাতা নির্বাচন করুন</option>
            {donors.map((d) => (<option key={d.id} value={d.id}>{d.full_name} ({d.blood_group})</option>))}
          </select>
          <input type="number" min={1} max={10} className="input" placeholder="ইউনিট" value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })} />
          <input type="date" className="input" value={form.donated_at} onChange={(e) => setForm({ ...form, donated_at: e.target.value })} />
          <input className="input" placeholder="নোট (ঐচ্ছিক)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
        </div>
        <button className="btn-primary mt-3">রেকর্ড করুন</button>
      </form>

      <div className="space-y-2">
        {items.map((it) => (
          <div key={it.id} className="card flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              {it.donor && <BloodGroupBadge group={it.donor.blood_group} size="sm" />}
              <div>
                <p className="font-medium text-ink">{it.donor?.full_name ?? "অজানা দাতা"} • {it.units} ইউনিট</p>
                <p className="text-xs text-ink/50">{new Date(it.donated_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}{it.note && ` • ${it.note}`}</p>
              </div>
            </div>
            <button onClick={() => remove(it.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-ink/50">এখনো কোনো রক্তদান রেকর্ড নেই।</p>}
      </div>
    </div>
  );
}
