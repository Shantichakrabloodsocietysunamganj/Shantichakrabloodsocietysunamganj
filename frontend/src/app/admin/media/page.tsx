"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Item = { id: string; url: string; source: string; label: string };
const CATS = ["all", "gallery", "donor", "blog", "event", "committee"] as const;
const CAT_LABEL: Record<string, string> = {
  all: "সব", gallery: "গ্যালারি", donor: "দাতা", blog: "ব্লগ", event: "ইভেন্ট", committee: "কমিটি",
};

export default function AdminMediaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [preview, setPreview] = useState<Item | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data: prof } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (prof?.role !== "admin" && prof?.role !== "moderator") { setReady(true); return; }
    setAuthed(true);

    const [g, d, b, e, c] = await Promise.all([
      supabase.from("gallery").select("id, image_url, title"),
      supabase.from("donors").select("id, photo_url, full_name"),
      supabase.from("blogs").select("id, cover_url, title"),
      supabase.from("events").select("id, cover_url, title"),
      supabase.from("committee_members").select("id, photo_url, name"),
    ]);

    const list: Item[] = [];
    (g.data ?? []).forEach((x: any) => x.image_url && list.push({ id: x.id, url: x.image_url, source: "gallery", label: x.title ?? "gallery" }));
    (d.data ?? []).forEach((x: any) => x.photo_url && list.push({ id: x.id, url: x.photo_url, source: "donor", label: x.full_name }));
    (b.data ?? []).forEach((x: any) => x.cover_url && list.push({ id: x.id, url: x.cover_url, source: "blog", label: x.title }));
    (e.data ?? []).forEach((x: any) => x.cover_url && list.push({ id: x.id, url: x.cover_url, source: "event", label: x.title }));
    (c.data ?? []).forEach((x: any) => x.photo_url && list.push({ id: x.id, url: x.photo_url, source: "committee", label: x.name }));
    setItems(list);
    setReady(true);
  }, [supabase, router]);

  useEffect(() => { load(); }, [load]);

  async function remove(it: Item) {
    const map: Record<string, { table: string; col: string }> = {
      gallery: { table: "gallery", col: "" }, // delete row
      donor: { table: "donors", col: "photo_url" },
      blog: { table: "blogs", col: "cover_url" },
      event: { table: "events", col: "cover_url" },
      committee: { table: "committee_members", col: "photo_url" },
    };
    const m = map[it.source];
    if (it.source === "gallery") {
      await supabase.from(m.table).delete().eq("id", it.id);
    } else {
      await supabase.from(m.table).update({ [m.col]: null }).eq("id", it.id);
    }
    setItems((prev) => prev.filter((x) => x.id !== it.id));
    setPreview(null);
  }

  const filtered = cat === "all" ? items : items.filter((x) => x.source === cat);

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">লোড হচ্ছে…</div>;
  if (!authed) return <div className="container-page py-20 text-center"><p className="text-3xl">🛡️</p><p className="mt-2 font-medium text-ink">শুধু অ্যাডমিনদের জন্য।</p><Link href="/" className="btn-outline mt-4">হোমে ফিরুন</Link></div>;

  return (
    <div className="container-page py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">🖼️ মিডিয়া লাইব্রেরি</h1>
          <p className="text-sm text-ink/60">সাইটে ব্যবহৃত সব ছবি — {items.length} টি।</p>
        </div>
        <Link href="/admin" className="btn-outline">← ড্যাশবোর্ড</Link>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${cat === c ? "bg-brand-600 text-white" : "bg-white text-ink/70 ring-1 ring-zinc-200 hover:bg-brand-50"}`}>
            {CAT_LABEL[c]} {c !== "all" && `(${items.filter((x) => x.source === c).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink/50">এই ক্যাটেগরিতে কোনো ছবি নেই।</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((it) => (
            <div key={it.source + it.id} className="group relative overflow-hidden rounded-xl ring-1 ring-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.url} alt={it.label} className="aspect-square w-full cursor-pointer object-cover" onClick={() => setPreview(it)} />
              <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">{CAT_LABEL[it.source]}</span>
              <button
                onClick={() => remove(it)}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                aria-label="মুছুন"
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {preview && (
        <div onClick={() => setPreview(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 animate-fade-in">
          <div onClick={(e) => e.stopPropagation()} className="relative max-h-full max-w-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.url} alt={preview.label} className="max-h-[80vh] w-auto rounded-xl" />
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white p-3 text-sm">
              <span className="truncate text-ink">{preview.label} <span className="text-ink/40">• {CAT_LABEL[preview.source]}</span></span>
              <button onClick={() => remove(preview)} className="btn-ghost !px-3 !py-1.5 text-xs text-blood-600">মুছুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
