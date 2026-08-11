"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, CheckCircle2, Search, Shield, Zap } from "@/components/icons";

export default function AdminSeoPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ meta_title: "", meta_description: "", meta_keywords: "", ga_id: "" });
  const [ogImage, setOgImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);
    const { data: s } = await supabase.from("site_settings").select("meta_title,meta_description,meta_keywords,og_image,ga_id").eq("id", 1).single();
    if (s) {
      setForm({ meta_title: s.meta_title ?? "", meta_description: s.meta_description ?? "", meta_keywords: s.meta_keywords ?? "", ga_id: s.ga_id ?? "" });
      setOgImage(s.og_image ?? null);
    }
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function uploadOg(file: File) {
    setUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (res.ok) setOgImage(json.url);
    setUploading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("site_settings").update({ ...form, og_image: ogImage }).eq("id", 1);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><Shield className="h-7 w-7" /></span><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink"><Search className="h-6 w-6 text-brand-600" />SEO Settings</h1>
          <p className="text-sm text-ink/60">Search engine optimization — meta tags, keywords, analytics।</p>
        </div>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      {saved && <div className="mb-6 flex items-center rounded-xl bg-success-50 p-3 text-sm font-medium text-success-700"><Check className="mr-1.5 inline h-4 w-4" />সংরক্ষিত হয়েছে</div>}

      <form onSubmit={save} className="card p-6 space-y-4">
        <div>
          <label className="label">Meta Title</label>
          <input className="input" placeholder="Shantichakra Blood Society | Donate Blood, Save Lives" value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
          <p className="mt-1 text-xs text-ink/40">খালি রাখলে ডিফল্ট ব্যবহার হবে। ৫০-৬০ অক্ষর আদর্শ।</p>
        </div>
        <div>
          <label className="label">Meta Description</label>
          <textarea className="input min-h-20" placeholder="স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক — সিলেট বিভাগ..." value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
          <p className="mt-1 text-xs text-ink/40">১৫০-১৬০ অক্ষর আদর্শ। Google সার্চে দেখায়।</p>
        </div>
        <div>
          <label className="label">Meta Keywords (comma separated)</label>
          <input className="input" placeholder="রক্তদান, blood donation, Sylhet, Sunamganj" value={form.meta_keywords} onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })} />
        </div>
        <div>
          <label className="label">Open Graph Image (Social Share)</label>
          <div className="flex items-center gap-4">
            {ogImage && <img src={ogImage} alt="OG" className="h-16 w-16 rounded-lg object-cover" />}
            <label className="btn-outline cursor-pointer">
              {uploading ? "আপলোড…" : (ogImage ? "সেট" : "+ ছবি")}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadOg(e.target.files[0])} />
            </label>
          </div>
          <p className="mt-1 text-xs text-ink/40">Facebook/WhatsApp শেয়ারে এই ছবি দেখায়। ১২০০×৬৩০ আদর্শ।</p>
        </div>
        <div>
          <label className="label">Google Analytics ID</label>
          <input className="input" placeholder="G-XXXXXXXXXX" value={form.ga_id} onChange={(e) => setForm({ ...form, ga_id: e.target.value })} />
          <p className="mt-1 text-xs text-ink/40">GA4 measurement ID। খালি রাখলে tracking বন্ধ থাকবে।</p>
        </div>
        <button disabled={saving} className="btn-primary">{saving ? "সংরক্ষণ হচ্ছে…" : "SEO সংরক্ষণ করুন"}</button>
      </form>

      <div className="mt-6 card p-5">
        <h3 className="mb-2 flex items-center gap-1.5 font-semibold text-ink"><Zap className="h-4 w-4 text-brand-600" />স্বয়ংক্রিয় SEO (আগে থেকেই সক্রিয়)</h3>
        <ul className="space-y-1 text-sm text-ink/60">
          <li><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />robots.txt — <a href="/robots.txt" className="text-brand-600">/robots.txt</a></li>
          <li><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />sitemap.xml — <a href="/sitemap.xml" className="text-brand-600">/sitemap.xml</a></li>
          <li><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />Canonical URL</li>
          <li><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />Open Graph + Twitter Card tags</li>
          <li><CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />Bengali locale (bn_BD)</li>
        </ul>
      </div>
    </div>
  );
}
