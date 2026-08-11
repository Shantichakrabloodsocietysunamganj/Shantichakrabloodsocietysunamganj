"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, MessageCircle, Shield, Star, X } from "@/components/icons";

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", role: "", message: "", rating: 5 });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("testimonials").insert({ ...form, approved: true });
    if (!error) { setForm({ name: "", role: "", message: "", rating: 5 }); load(); }
  }

  async function toggle(id: string, val: boolean) {
    await supabase.from("testimonials").update({ approved: val }).eq("id", id);
    load();
  }
  async function remove(id: string) {
    await supabase.from("testimonials").delete().eq("id", id);
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Shield className="h-7 w-7" /></span><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink"><MessageCircle className="h-6 w-6 text-brand-600" />Testimonials</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-ink">নতুন testimonial যোগ করুন</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="নাম" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="ভূমিকা (যেমন: রোগীর স্বজন)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
        </div>
        <textarea className="input mt-3" placeholder="মন্তব্য" required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm text-ink/60">রেটিং:</label>
          <select className="input !w-auto" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
          </select>
          <button className="btn-primary">যোগ করুন</button>
        </div>
      </form>

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-ink">{t.name} <span className="flex text-amber-500">{Array.from({ length: t.rating ?? 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}</span></p>
                <p className="text-sm text-ink/60">{t.message}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => toggle(t.id, !t.approved)} className={`btn-ghost !px-2 !py-1 text-xs ${t.approved ? "text-success-700" : "text-ink/40"}`}>
                  {t.approved ? (<><Check className="mr-1 inline h-3.5 w-3.5" />প্রকাশিত</>) : "অপ্রকাশিত"}
                </button>
                <button onClick={() => remove(t.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-ink/50">কোনো testimonial নেই।</p>}
      </div>
    </div>
  );
}
