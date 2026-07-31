"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminDonationMethodsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ method_name: "", account_number: "", account_type: "", instructions: "", logo_url: "", qr_url: "", is_active: true });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("donation_methods").select("*").order("order", { ascending: true });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("donation_methods").insert({
      method_name: form.method_name, account_number: form.account_number,
      account_type: form.account_type || null, instructions: form.instructions || null,
      logo_url: form.logo_url || null, qr_url: form.qr_url || null, is_active: form.is_active,
    });
    setSaving(false);
    if (!error) { setForm({ method_name: "", account_number: "", account_type: "", instructions: "", logo_url: "", qr_url: "", is_active: true }); load(); }
  }
  async function remove(id: string) { await supabase.from("donation_methods").delete().eq("id", id); load(); }
  async function toggle(id: string, val: boolean) { await supabase.from("donation_methods").update({ is_active: val }).eq("id", id); load(); }
  async function uploadImg(file: File, field: "logo_url" | "qr_url") {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setForm((f) => ({ ...f, [field]: json.url }));
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">💳 ডোনেশন মেথড</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={add} className="card mb-6 space-y-3 p-5">
        <h2 className="font-semibold text-ink">নতুন পেমেন্ট মেথড</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="মেথড নাম (bKash…) *" required value={form.method_name} onChange={(e) => setForm({ ...form, method_name: e.target.value })} />
          <input className="input" placeholder="অ্যাকাউন্ট নম্বর *" required value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })} />
          <input className="input" placeholder="অ্যাকাউন্ট টাইপ (Personal/Merchant)" value={form.account_type} onChange={(e) => setForm({ ...form, account_type: e.target.value })} />
          <input className="input" placeholder="নির্দেশনা" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {form.logo_url && <img src={form.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover" />}
          <label className="btn-outline cursor-pointer text-sm">{form.logo_url ? "✓ লোগো" : "+ লোগো"}<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImg(e.target.files[0], "logo_url")} /></label>
          {form.qr_url && <img src={form.qr_url} alt="" className="h-12 w-12 rounded object-contain" />}
          <label className="btn-outline cursor-pointer text-sm">{form.qr_url ? "✓ QR" : "+ QR কোড"}<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImg(e.target.files[0], "qr_url")} /></label>
          <label className="flex items-center gap-2 text-sm font-medium text-ink"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />সক্রিয়</label>
          <button disabled={saving} className="btn-primary">{saving ? "যোগ হচ্ছে…" : "যোগ করুন"}</button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-center text-sm text-ink/50">এখনো কোনো পেমেন্ট মেথড যোগ করা হয়নি।</p>}
        {items.map((m) => (
          <div key={m.id} className="card flex items-center gap-4 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink">{m.method_name} <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.is_active ? "bg-success-100 text-success-700" : "bg-zinc-200 text-zinc-500"}`}>{m.is_active ? "সক্রিয়" : "বন্ধ"}</span></p>
              <p className="text-xs text-ink/40">{m.account_number} {m.account_type ? `• ${m.account_type}` : ""}</p>
            </div>
            <button onClick={() => toggle(m.id, !m.is_active)} className="btn-ghost !px-2 !py-1 text-xs">{m.is_active ? "বন্ধ করুন" : "চালু করুন"}</button>
            <button onClick={() => remove(m.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
