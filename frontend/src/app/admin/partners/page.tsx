"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTr } from "@/lib/useLang";

export default function AdminPartnersPage() {
  const { t: tx } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data } = await supabase.from("partners").select("*").order("order", { ascending: true });
    setItems(data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function uploadLogo(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setLogoUrl(json.url);
    setUploading(false);
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("partners").insert({ name, logo_url: logoUrl });
    if (!error) { setName(""); setLogoUrl(null); load(); }
  }

  async function remove(id: string) { await supabase.from("partners").delete().eq("id", id); load(); }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">{tx("লোড হচ্ছে…")}</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">{tx("শুধু অ্যাডমিনদের জন্য।")}</p><Link href="/" className="btn-outline mt-4">{tx("হোমে ফিরুন")}</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{tx("🤝 পার্টনার ও সহযোগী")}</h1>
        <Link href="/admin" className="btn-outline">{tx("← ড্যাশবোর্ড")}</Link>
      </header>

      <form onSubmit={add} className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-ink">{tx("নতুন পার্টনার যোগ করুন")}</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-48">
            <label className="label">{tx("নাম")}</label>
            <input className="input" placeholder={tx("যেমন: রেড ক্রিসেন্ট")} required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            {logoUrl && <img src={logoUrl} alt="logo" className="h-10 w-10 rounded-lg object-contain" />}
            <label className="btn-outline cursor-pointer">
              {uploading ? tx("আপলোড…") : (logoUrl ? tx("✓ লোগো") : tx("+ লোগো"))}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </label>
            <button className="btn-primary">{tx("যোগ করুন")}</button>
          </div>
        </div>
      </form>

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-ink/50">এখনো কোনো পার্টনার নেই।</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <div key={p.id} className="card group relative flex flex-col items-center gap-2 p-5 text-center">
              {p.logo_url ? (
                <img src={p.logo_url} alt={p.name} className="h-12 w-12 object-contain" />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-xl font-bold text-brand-600">{p.name.charAt(0)}</span>
              )}
              <p className="text-sm font-medium text-ink">{p.name}</p>
              <button onClick={() => remove(p.id)} className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-lg bg-black/50 text-white group-hover:flex">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
