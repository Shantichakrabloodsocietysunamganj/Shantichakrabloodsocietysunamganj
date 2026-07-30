"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf, GENDERS } from "@/data/constants";
import { useLangClient, t } from "@/lib/i18n";

const schema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(6).regex(/^[+0-9\s-]+$/),
  blood_group: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]]),
  gender: z.string().optional(),
  age: z.coerce.number().int().min(18).max(60).optional().or(z.literal("").transform(() => undefined)),
  district: z.string().min(1),
  upazila: z.string().min(1),
  area: z.string().optional(),
  last_donation_date: z.string().optional(),
  is_available: z.boolean().default(true),
  notes: z.string().optional(),
});

type FormState = Record<string, any>;

export default function BecomeDonorPage() {
  const supabase = createClient();
  const lang = useLangClient();
  const en = lang === "en";
  const [form, setForm] = useState<FormState>({
    full_name: "", phone: "", blood_group: "", gender: "", age: "",
    district: "সুনামগঞ্জ", upazila: "", area: "", last_donation_date: "",
    is_available: true, notes: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, [supabase]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f && f.size > 200 * 1024) {
      setServerError(en ? "Image must be under 200KB. Please compress it and try again." : "ছবি ২০০ কিলোবাইটের মধ্যে হতে হবে। ছবি ছোট করে আবার চেষ্টা করুন।");
      setPhoto(null); setPhotoPreview(null); e.target.value = "";
      return;
    }
    setServerError(null);
    setPhoto(f);
    if (f) setPhotoPreview(URL.createObjectURL(f)); else setPhotoPreview(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null); setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) { const errs: Record<string, string> = {}; for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message; setErrors(errs); return; }
    setSubmitting(true);
    try {
      let photo_url: string | null = null;
      if (photo) { const fd = new FormData(); fd.append("file", photo); const res = await fetch("/api/upload", { method: "POST", body: fd }); const json = await res.json(); if (!res.ok) throw new Error(json.error); photo_url = json.url; }
      const { error } = await supabase.from("donors").insert({
        user_id: userId, full_name: parsed.data.full_name, phone: parsed.data.phone,
        blood_group: parsed.data.blood_group, gender: parsed.data.gender || null,
        age: parsed.data.age ?? null, district: parsed.data.district, upazila: parsed.data.upazila,
        area: parsed.data.area || null, photo_url,
        last_donation_date: parsed.data.last_donation_date || null,
        is_available: parsed.data.is_available, notes: parsed.data.notes || null,
      });
      if (error) throw new Error("error");
      setDone(true); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) { setServerError(e?.message ?? "error"); } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="container-page py-20"><div className="mx-auto max-w-md card p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-emerald-50 text-3xl">✓</div>
        <h1 className="text-2xl font-bold text-zinc-900">{en ? "Thank you, hero! 🙏" : "ধন্যবাদ, নায়ক! 🙏"}</h1>
        <p className="mt-2 text-zinc-600">{en ? "Welcome to Shantichakra Blood Society. Your information has been saved — you're now live on the donor list." : "আপনাকে শান্তিচক্র ব্লাড সোসাইটিতে স্বাগতম। আপনার তথ্য সংরক্ষিত হয়েছে — এখন থেকে আপনি দাতা তালিকায় দৃশ্যমান।"}</p>
        <div className="mt-6 flex flex-col gap-3"><Link href="/donors" className="btn-primary">{en ? "View Donors" : "রক্তদাতা তালিকা দেখুন"}</Link><Link href="/" className="btn-ghost">{en ? "Home" : "হোমে ফিরুন"}</Link></div>
      </div></div>
    );
  }

  return (
    <div className="container-page py-10"><div className="mx-auto max-w-3xl">
      <header className="text-center">
        <span className="eyebrow">{en ? "Humanitarian Initiative" : "মানবিক উদ্যোগ"}</span>
        <h1 className="section-title mt-3">{en ? "Register as a Blood Donor" : "রক্তদাতা হিসেবে নিবন্ধন করুন"}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{en ? "Join the Sylhet blood donation network. Every registration is a potential life saved." : "আপনার তথ্য দিন এবং সিলেট বিভাগের রক্তদান নেটওয়ার্কে যুক্ত হোন। প্রতিটি নিবন্ধন একটি সম্ভাব্য জীবন রক্ষা।"}</p>
      </header>
      <form onSubmit={submit} className="mt-8 card p-6 sm:p-8">
        {serverError && <div className="mb-5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">⚠️ {serverError}</div>}
        <div className="mb-6 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200">
            {photoPreview ? <img src={photoPreview} alt="preview" className="h-full w-full object-cover" /> : <span className="text-2xl text-zinc-400">📷</span>}
          </div>
          <div>
            <label className="label">{en ? "Photo (optional)" : "ছবি (ঐচ্ছিক)"}</label>
            <input type="file" accept="image/*" onChange={onPhoto} className="block text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100" />
            <p className="mt-1 text-xs text-zinc-400">{en ? "Max 200KB (≈100KB ideal), square crop" : "সর্বোচ্চ ২০০ কিলোবাইট (১০০KB-এর কাছাকাছি), চৌকো ক্রপ হবে"}</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={en ? "Full Name *" : "পুরো নাম *"} error={errors.full_name ? (en ? "Required" : "দিন") : undefined}><input className="input" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></Field>
          <Field label={en ? "Mobile *" : "মোবাইল *"} error={errors.phone ? (en ? "Invalid" : "সঠিক নয়") : undefined}><input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" /></Field>
          <Field label={en ? "Blood Group *" : "রক্তের গ্রুপ *"} error={errors.blood_group ? (en ? "Select" : "নির্বাচন") : undefined}><select className="input" value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন করুন"}</option>{BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
          <Field label={en ? "District *" : "জেলা *"} error={errors.district ? (en ? "Select" : "নির্বাচন") : undefined}><select className="input" value={form.district} onChange={(e) => { set("district", e.target.value); set("upazila", ""); }}>{DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}</select></Field>
          <Field label={en ? "Upazila *" : "উপজেলা *"} error={errors.upazila ? (en ? "Select" : "নির্বাচন") : undefined}><select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন করুন"}</option>{upazilasOf(form.district).map((u) => <option key={u} value={u}>{u}</option>)}</select></Field>
          <Field label={en ? "Age (18–60)" : "বয়স (১৮–৬০)"} error={errors.age ? (en ? "18–60" : "১৮-৬০") : undefined}><input type="number" min={18} max={60} className="input" value={form.age} onChange={(e) => set("age", e.target.value)} /></Field>
          <Field label={en ? "Gender" : "লিঙ্গ"}><select className="input" value={form.gender} onChange={(e) => set("gender", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন"}</option>{GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
          <Field label={en ? "Area" : "এলাকা"}><input className="input" value={form.area} onChange={(e) => set("area", e.target.value)} /></Field>
          <Field label={en ? "Last Donation Date" : "সর্বশেষ রক্তদান"}><input type="date" className="input" value={form.last_donation_date} onChange={(e) => set("last_donation_date", e.target.value)} /></Field>
        </div>
        <div className="mt-5"><Field label={en ? "Additional Info (optional)" : "অতিরিক্ত তথ্য (ঐচ্ছিক)"}><textarea className="input min-h-24" value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
        <label className="mt-4 flex items-start gap-3 rounded-xl bg-emerald-50 p-4"><input type="checkbox" checked={form.is_available} onChange={(e) => set("is_available", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500" /><span className="text-sm font-medium text-emerald-800">{en ? "I am currently available to donate blood." : "আমি বর্তমানে রক্তদানে প্রস্তুত আছি।"}</span></label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><Link href="/" className="btn-ghost">{en ? "Cancel" : "বাতিল"}</Link><button type="submit" disabled={submitting} className="btn-primary">{submitting ? (en ? "Registering…" : "নিবন্ধন হচ্ছে…") : (en ? "Complete Registration" : "নিবন্ধন সম্পন্ন করুন")}</button></div>
      </form>
    </div></div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}{error && <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>}</div>;
}
