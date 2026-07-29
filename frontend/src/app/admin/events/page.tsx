"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminEventsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", location: "", event_date: "", description: "", status: "upcoming" });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("events").insert(form);
    if (!error) { setForm({ title: "", location: "", event_date: "", description: "", status: "upcoming" }); load(); }
  }
  async function remove(id: string) { await supabase.from("events").delete().eq("id", id); load(); }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">📅 ইভেন্ট ব্যবস্থাপনা</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="ইভেন্টের নাম *" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          <input className="input" placeholder="স্থান" value={form.location} onChange={(e) => set("location", e.target.value)} />
          <input type="date" className="input" required value={form.event_date} onChange={(e) => set("event_date", e.target.value)} />
          <select className="input" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="upcoming">আসন্ন</option>
            <option value="ongoing">চলমান</option>
            <option value="completed">সম্পন্ন</option>
          </select>
        </div>
        <textarea className="input mt-3" placeholder="বিবরণ" value={form.description} onChange={(e) => set("description", e.target.value)} />
        <button className="btn-primary mt-3">যোগ করুন</button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <div key={e.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-brand-600">{new Date(e.event_date).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" })}</p>
                <h3 className="font-semibold text-ink">{e.title}</h3>
                {e.location && <p className="text-xs text-ink/60">📍 {e.location}</p>}
              </div>
              <button onClick={() => remove(e.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-sm text-ink/50">কোনো ইভেন্ট নেই।</p>}
      </div>
    </div>
  );
}
