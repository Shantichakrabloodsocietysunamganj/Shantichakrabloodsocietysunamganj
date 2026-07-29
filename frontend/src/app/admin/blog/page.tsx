"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminBlogPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", author: "" });
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function uploadCover(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setCoverUrl(json.url);
    setUploading(false);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("blogs").insert({ ...form, cover_url: coverUrl, published: true });
    if (!error) { setForm({ title: "", excerpt: "", content: "", author: "" }); setCoverUrl(null); load(); }
  }
  async function remove(id: string) { await supabase.from("blogs").delete().eq("id", id); load(); }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">📝 ব্লগ ব্যবস্থাপনা</h1>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="শিরোনাম *" required value={form.title} onChange={(e) => set("title", e.target.value)} />
          <input className="input" placeholder="লেখক" value={form.author} onChange={(e) => set("author", e.target.value)} />
        </div>
        <input className="input mt-3" placeholder="সারসংক্ষেপ" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} />
        <textarea className="input mt-3 min-h-28" placeholder="বিস্তারিত" value={form.content} onChange={(e) => set("content", e.target.value)} />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="btn-outline cursor-pointer">
            {uploading ? "আপলোড…" : (coverUrl ? "✓ কভার সেট" : "+ কভার ছবি")}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
          </label>
          <button className="btn-primary">পোস্ট প্রকাশ করুন</button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((b) => (
          <div key={b.id} className="card overflow-hidden">
            {b.cover_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.cover_url} alt={b.title} className="h-32 w-full object-cover" />
            )}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-ink">{b.title}</h3>
                <button onClick={() => remove(b.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
              </div>
              {b.excerpt && <p className="mt-1 text-xs text-ink/60 line-clamp-2">{b.excerpt}</p>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-center text-sm text-ink/50">কোনো পোস্ট নেই।</p>}
      </div>
    </div>
  );
}
