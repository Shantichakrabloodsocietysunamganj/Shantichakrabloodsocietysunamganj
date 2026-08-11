"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/Toast";
import { Bell, Shield } from "@/components/icons";

export default function AdminBroadcastPage() {
  const supabase = createClient();
  const router = useRouter();
  const toast = useToast();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", type: "general" });
  const [sending, setSending] = useState(false);
  const [recent, setRecent] = useState<any[]>([]);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data: r } = await supabase.from("notifications").select("title, body, created_at").order("created_at", { ascending: false }).limit(8);
    setRecent(r ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    // সব profile এর জন্য একটি করে notification insert
    const { data: profiles } = await supabase.from("profiles").select("id");
    const users = (profiles ?? []).map((p) => p.id);
    if (!users.length) {
      toast("info", "কোনো নিবন্ধিত ইউজার নেই");
      setSending(false);
      return;
    }
    const rows = users.map((uid) => ({ user_id: uid, title: form.title, body: form.body || null, type: form.type }));
    const { error } = await supabase.from("notifications").insert(rows);
    setSending(false);
    if (error) { toast("error", "পাঠাতে সমস্যা হয়েছে"); return; }
    toast("success", `${users.length} জনকে নোটিফিকেশন পাঠানো হয়েছে`);
    setForm({ title: "", body: "", type: "general" });
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Shield className="h-7 w-7" /></span><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink"><Bell className="h-6 w-6 text-brand-600" />নোটিফিকেশন প্রেরণ</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={send} className="card mb-6 p-5">
        <p className="mb-3 text-sm text-ink/60">এই বার্তাটি সমস্ত নিবন্ধিত ইউজারকে (in-app) পাঠানো হবে।</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="শিরোনাম *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="general">সাধারণ</option>
            <option value="emergency">জরুরি</option>
            <option value="event">ইভেন্ট</option>
          </select>
        </div>
        <textarea className="input mt-3" placeholder="বিস্তারিত (ঐচ্ছিক)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
        <button disabled={sending} className="btn-primary mt-3">{sending ? "পাঠানো হচ্ছে…" : "সবাইকে পাঠান"}</button>
      </form>

      <h2 className="mb-3 font-semibold text-ink">সাম্প্রতিক নোটিফিকেশন</h2>
      <div className="space-y-2">
        {recent.map((n, i) => (
          <div key={i} className="card p-3 text-sm">
            <p className="font-medium text-ink">{n.title}</p>
            {n.body && <p className="text-ink/60">{n.body}</p>}
          </div>
        ))}
        {recent.length === 0 && <p className="text-sm text-ink/50">কোনো নোটিফিকেশন নেই।</p>}
      </div>
    </div>
  );
}
