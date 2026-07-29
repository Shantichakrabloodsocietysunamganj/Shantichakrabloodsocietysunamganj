"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminSettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [form, setForm] = useState({ phone: "", email: "", address: "", facebook: "", whatsapp: "", hero_badge: "", hero_desc: "", mission: "", vision: "" });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [gallery, setGallery] = useState<any[]>([]);
  const [uploadingImg, setUploadingImg] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin") { setReady(true); return; }
    setAuthed(true);

    const [s, g] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", 1).single(),
      supabase.from("gallery").select("*").order("created_at", { ascending: false }),
    ]);
    if (s.data) {
      setLogoUrl(s.data.logo_url ?? null);
      setForm({
        phone: s.data.phone ?? "",
        email: s.data.email ?? "",
        address: s.data.address ?? "",
        facebook: s.data.facebook ?? "",
        whatsapp: s.data.whatsapp ?? "",
        hero_badge: s.data.hero_badge ?? "",
        hero_desc: s.data.hero_desc ?? "",
        mission: s.data.mission ?? "",
        vision: s.data.vision ?? "",
      });
    }
    setGallery(g.data ?? []);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "upload failed");
      await supabase.from("site_settings").update({ logo_url: json.url }).eq("id", 1);
      setLogoUrl(json.url);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch {
      alert("লোগো আপলোডে সমস্যা হয়েছে");
    } finally {
      setUploadingLogo(false);
    }
  }

  async function saveInfo(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("site_settings").update(form).eq("id", 1);
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  }

  async function uploadGallery(files: FileList) {
    setUploadingImg(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) {
        await supabase.from("gallery").insert({ image_url: json.url, title: file.name.split(".")[0] });
      }
    }
    setUploadingImg(false);
    load();
  }

  async function deleteImage(id: string) {
    await supabase.from("gallery").delete().eq("id", id);
    load();
  }

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed)
    return (
      <div className="container-page py-20 text-center">
        <p className="text-3xl">🛡️</p>
        <p className="mt-2 font-medium text-ink">এই পেজ শুধু অ্যাডমিনদের জন্য।</p>
        <Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link>
      </div>
    );

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">⚙️ ওয়েবসাইট সেটিংস</h1>
          <p className="text-sm text-ink/60">এখান থেকে লোগো, যোগাযোগ ও গ্যালারি পরিবর্তন করুন।</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
        </div>
      </header>

      {savedMsg && (
        <div className="mb-6 rounded-xl bg-success-50 p-3 text-sm font-medium text-success-700">✓ সংরক্ষিত হয়েছে</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Logo */}
        <section className="card p-6">
          <h2 className="font-semibold text-ink">🏷️ লোগো</h2>
          <p className="mt-1 text-sm text-ink/60">সাইটের সব জায়গায় দেখাবে।</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-canvas ring-1 ring-zinc-200">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt="logo" className="h-full w-full object-contain p-1" />
              ) : (
                <span className="text-2xl text-ink/30">🖼️</span>
              )}
            </div>
            <label className="btn-outline cursor-pointer">
              {uploadingLogo ? "আপলোড হচ্ছে…" : "লোগো আপলোড করুন"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </label>
          </div>
        </section>

        {/* Contact info */}
        <section className="card p-6">
          <h2 className="font-semibold text-ink">📞 যোগাযোগের তথ্য</h2>
          <p className="mt-1 text-sm text-ink/60">Footer-এ দেখাবে।</p>
          <form onSubmit={saveInfo} className="mt-4 space-y-3">
            <input className="input" placeholder="ফোন" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input className="input" placeholder="ইমেইল" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" placeholder="ঠিকানা" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <input className="input" placeholder="Facebook লিংক" value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} />
            <input className="input" placeholder="WhatsApp লিংক" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            <button disabled={saving} className="btn-primary w-full">{saving ? "সংরক্ষণ হচ্ছে…" : "সংরক্ষণ করুন"}</button>
          </form>
        </section>
      </div>

      {/* Website Content */}
      <section className="card mt-6 p-6">
        <h2 className="font-semibold text-ink">📝 ওয়েবসাইট কন্টেন্ট</h2>
        <p className="mt-1 text-sm text-ink/60">হিরো ব্যাজ, মিশন ও ভিশন টেক্সট পরিবর্তন করুন।</p>
        <form onSubmit={saveInfo} className="mt-4 space-y-3">
          <div><label className="label">হিরো ব্যাজ (badge)</label><input className="input" placeholder="সিলেট বিভাগ জুড়ে..." value={form.hero_badge} onChange={(e) => setForm({ ...form, hero_badge: e.target.value })} /></div>
          <div><label className="label">হিরো বর্ণনা</label><textarea className="input min-h-20" placeholder="জরুরি মুহূর্তে..." value={form.hero_desc} onChange={(e) => setForm({ ...form, hero_desc: e.target.value })} /></div>
          <div><label className="label">মিশন</label><textarea className="input min-h-20" value={form.mission} onChange={(e) => setForm({ ...form, mission: e.target.value })} /></div>
          <div><label className="label">ভিশন</label><textarea className="input min-h-20" value={form.vision} onChange={(e) => setForm({ ...form, vision: e.target.value })} /></div>
          <button disabled={saving} className="btn-primary">{saving ? "সংরক্ষণ হচ্ছে…" : "কন্টেন্ট সংরক্ষণ করুন"}</button>
        </form>
      </section>

      {/* Gallery */}
      <section className="card mt-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-ink">📸 গ্যালারি</h2>
            <p className="mt-1 text-sm text-ink/60">রক্তদান শিবির, কর্মসূচি ও কার্যক্রমের ছবি।</p>
          </div>
          <label className="btn-primary cursor-pointer">
            {uploadingImg ? "আপলোড হচ্ছে…" : "+ ছবি যোগ করুন"}
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && uploadGallery(e.target.files)} />
          </label>
        </div>

        {gallery.length === 0 ? (
          <p className="mt-6 text-center text-sm text-ink/50">এখনো কোনো ছবি নেই।</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-xl ring-1 ring-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.image_url} alt={img.title ?? ""} className="aspect-square w-full object-cover" />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="মুছুন"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
