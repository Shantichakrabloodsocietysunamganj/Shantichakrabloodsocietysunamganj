"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { logActivity } from "@/lib/activity";

export default function AdminFaqPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ question: "", answer: "", order: 0 });

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("faqs").select("*").order("order", { ascending: true });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("faqs").insert(form);
    if (!error) { logActivity("FAQ যোগ করেছেন", form.question); setForm({ question: "", answer: "", order: 0 }); load(); }
  }

  async function remove(id: string, q: string) {
    await supabase.from("faqs").delete().eq("id", id);
    logActivity("FAQ মুছেছেন", q);
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">❓ FAQ ব্যবস্থাপনা</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-ink">নতুন প্রশ্ন যোগ করুন</h2>
        <input className="input mb-3" placeholder="প্রশ্ন *" required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
        <textarea className="input mb-3" placeholder="উত্তর *" required value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
        <div className="flex items-center gap-3">
          <input type="number" className="input !w-32" placeholder="ক্রম" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          <button className="btn-primary">যোগ করুন</button>
        </div>
      </form>

      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold text-ink">{f.question}</p>
                <p className="mt-1 text-sm text-ink/60">{f.answer}</p>
              </div>
              <button onClick={() => remove(f.id, f.question)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600 shrink-0">✕</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center text-sm text-ink/50">এখনো কোনো FAQ নেই। উপরের ফর্ম থেকে যোগ করুন।</p>}
      </div>
    </div>
  );
}
