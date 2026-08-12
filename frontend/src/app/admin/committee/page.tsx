"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTr } from "@/lib/useLang";

export default function AdminCommitteePage() {
  const { t: tx } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", role: "", category: "member", order: 0 });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("committee_members").select("*").order("order", { ascending: true });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  async function uploadPhoto(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setPhotoUrl(json.url);
    setUploading(false);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("committee_members").insert({ ...form, photo_url: photoUrl });
    if (!error) { setForm({ name: "", role: "", category: "member", order: 0 }); setPhotoUrl(null); load(); }
  }
  async function remove(id: string) { await supabase.from("committee_members").delete().eq("id", id); load(); }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">{tx("লোড হচ্ছে…")}</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">{tx("শুধু অ্যাডমিনদের জন্য।")}</p><Link href="/" className="btn-outline mt-4">{tx("হোমে ফিরুন")}</Link></div>;

  const categories = ["founder", "advisor", "member"];
  const labels: Record<string, string> = { founder: tx("প্রতিষ্ঠাতা"), advisor: tx("উপদেষ্টা"), member: tx("কার্যনির্বাহী সদস্য") };

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{tx("👥 কমিটি ব্যবস্থাপনা")}</h1>
        <Link href="/admin" className="btn-outline">{tx("← ড্যাশবোর্ড")}</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-ink">{tx("নতুন সদস্য যোগ করুন")}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder={tx("নাম *")} required value={form.name} onChange={(e) => set("name", e.target.value)} />
          <input className="input" placeholder={tx("পদবি (যেমন: সভাপতি)")} required value={form.role} onChange={(e) => set("role", e.target.value)} />
          <select className="input" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => <option key={c} value={c}>{labels[c]}</option>)}
          </select>
          <input type="number" className="input" placeholder={tx("ক্রম (কম = আগে)")} value={form.order} onChange={(e) => set("order", Number(e.target.value))} />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="preview" className="h-12 w-12 rounded-full object-cover" />
          )}
          <label className="btn-outline cursor-pointer">
            {uploading ? tx("আপলোড…") : (photoUrl ? tx("✓ ছবি সেট") : tx("+ ছবি"))}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
          </label>
          <button className="btn-primary">{tx("যোগ করুন")}</button>
        </div>
      </form>

      {categories.map((cat) => {
        const list = items.filter((i) => i.category === cat);
        if (!list.length) return null;
        return (
          <div key={cat} className="mb-6">
            <h3 className="mb-3 font-bold text-ink">{labels[cat]}</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => (
                <div key={m.id} className="card flex items-center gap-3 p-4">
                  {m.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 font-bold text-brand-600">{(m.name ?? "?").charAt(0)}</span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-ink">{m.name}</p>
                    <p className="text-xs text-brand-600">{m.role}</p>
                  </div>
                  <button onClick={() => remove(m.id)} className="btn-ghost !px-2 !py-1 text-xs text-blood-600">✕</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {items.length === 0 && <p className="text-center text-sm text-ink/50">{tx("কোনো সদস্য যোগ করা হয়নি।")}</p>}
    </div>
  );
}
