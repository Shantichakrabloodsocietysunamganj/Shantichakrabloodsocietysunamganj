"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTr } from "@/lib/useLang";
import { fmtDate } from "@/lib/format";

export default function AdminMediaCoveragePage() {
  const { t: tx, lang } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", source: "", url: "", summary: "", thumbnail: "", published_date: "", category: "online" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("media_coverage").select("*").order("published_date", { ascending: false, nullsFirst: false });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("media_coverage").insert({
      title: form.title, source: form.source, url: form.url || null, summary: form.summary || null,
      thumbnail: form.thumbnail || null, category: form.category,
      published_date: form.published_date || null,
    });
    setSaving(false);
    if (!error) { setForm({ title: "", source: "", url: "", summary: "", thumbnail: "", published_date: "", category: "online" }); load(); }
  }
  async function remove(id: string) { await supabase.from("media_coverage").delete().eq("id", id); load(); }
  async function uploadThumb(file: File) {
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setForm((f) => ({ ...f, thumbnail: json.url }));
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">{tx("লোড হচ্ছে…")}</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">{tx("শুধু অ্যাডমিনদের জন্য।")}</p><Link href="/" className="btn-outline mt-4">{tx("হোমে ফিরুন")}</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{tx("📰 মিডিয়া কভারেজ")}</h1>
        <Link href="/admin" className="btn-outline">{tx("← ড্যাশবোর্ড")}</Link>
      </header>

      <form onSubmit={add} className="card mb-6 space-y-3 p-5">
        <h2 className="font-semibold text-ink">{tx("নতুন কভারেজ যোগ করুন")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder={tx("শিরোনাম *")} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder={tx("সোর্স (Online Sylhet…) *")} required value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <input className="input" placeholder={tx("লিংক (URL)")} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <input type="date" className="input" value={form.published_date} onChange={(e) => setForm({ ...form, published_date: e.target.value })} />
        </div>
        <textarea className="input min-h-20" placeholder={tx("সারসংক্ষেপ")} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <div className="flex flex-wrap items-center gap-3">
          {form.thumbnail && <img src={form.thumbnail} alt="" className="h-12 w-12 rounded-lg object-cover" />}
          <label className="btn-outline cursor-pointer text-sm">
            {form.thumbnail ? tx("✓ থাম্বনেইল") : tx("+ থাম্বনেইল")}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadThumb(e.target.files[0])} />
          </label>
          <select className="input !w-auto text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="online">{tx("অনলাইন নিউজ")}</option>
            <option value="tv">TV</option>
            <option value="press_release">{tx("প্রেস রিলিজ")}</option>
            <option value="social">{tx("সোশ্যাল মিডিয়া")}</option>
          </select>
          <button disabled={saving} className="btn-primary">{saving ? tx("যোগ হচ্ছে…") : tx("যোগ করুন")}</button>
        </div>
      </form>

      <div className="space-y-3">
        {items.length === 0 && <p className="text-center text-sm text-ink/50">{tx("এখনো কোনো কভারেজ যোগ করা হয়নি।")}</p>}
        {items.map((m) => (
          <div key={m.id} className="card flex items-center gap-4 p-4">
            {m.thumbnail ? <img src={m.thumbnail} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-2xl">📰</span>}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{m.title}</p>
              <p className="text-xs text-ink/40">{m.source} {m.published_date ? `• ${fmtDate(m.published_date, lang)}` : ""}</p>
            </div>
            <button onClick={() => remove(m.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
