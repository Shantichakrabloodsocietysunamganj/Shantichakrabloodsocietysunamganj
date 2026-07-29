"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf } from "@/data/constants";
import { useLangClient } from "@/lib/i18n";

const schema = z.object({
  patient_name: z.string().min(2),
  blood_group: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]]),
  units_needed: z.coerce.number().int().min(1).max(10),
  hospital: z.string().min(2),
  district: z.string().min(1),
  upazila: z.string().min(1),
  needed_date: z.string().min(1),
  contact_name: z.string().min(2),
  contact_phone: z.string().min(6).regex(/^[+0-9\s-]+$/),
  message: z.string().optional(),
});

export default function RequestBloodPage() {
  const supabase = createClient();
  const lang = useLangClient();
  const en = lang === "en";
  const [form, setForm] = useState<Record<string, any>>({
    patient_name: "", blood_group: "", units_needed: 1, hospital: "",
    district: "সুনামগঞ্জ", upazila: "", needed_date: "", contact_name: "",
    contact_phone: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, [supabase]);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null); setErrors({});
    const parsed = schema.safeParse(form);
    if (!parsed.success) { const errs: Record<string, string> = {}; for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message; setErrors(errs); return; }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("blood_requests").insert({ ...parsed.data, requested_by: userId });
      if (error) throw new Error("error");
      setDone(true); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) { setServerError(e?.message ?? "error"); } finally { setSubmitting(false); }
  };

  if (done) {
    return (
      <div className="container-page py-20"><div className="mx-auto max-w-md card p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">🩸</div>
        <h1 className="text-2xl font-bold text-zinc-900">{en ? "Request Posted" : "অনুরোধটি পোস্ট হয়েছে"}</h1>
        <p className="mt-2 text-zinc-600">{en ? "Your blood request is visible to all donors across Sylhet." : "আপনার রক্তের অনুরোধ সারা সিলেট বিভাগের দাতাদের কাছে দৃশ্যমান।"}</p>
        <div className="mt-6 flex flex-col gap-3"><Link href="/donors" className="btn-primary">{en ? "Find Donors" : "এখনই রক্তদাতা খুঁজুন"}</Link><Link href="/requests" className="btn-ghost">{en ? "All Requests" : "সব অনুরোধ দেখুন"}</Link></div>
      </div></div>
    );
  }

  return (
    <div className="container-page py-10"><div className="mx-auto max-w-3xl">
      <header className="text-center">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">{en ? "Emergency Help" : "জরুরি সাহায্য"}</span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">{en ? "Request Blood" : "রক্তের অনুরোধ করুন"}</h1>
        <p className="mt-2 text-zinc-600">{en ? "Enter patient details — your request will appear instantly." : "রোগীর তথ্য দিন — আপনার অনুরোধ তাৎক্ষণিকভাবে প্রকাশ্য তালিকায় চলে যাবে।"}</p>
      </header>
      <form onSubmit={submit} className="mt-8 card p-6 sm:p-8">
        {serverError && <div className="mb-5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">⚠️ {serverError}</div>}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={en ? "Patient Name *" : "রোগীর নাম *"}><input className="input" value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} /></Field>
          <Field label={en ? "Blood Group *" : "গ্রুপ *"}><select className="input" value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন"}</option>{BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}</select></Field>
          <Field label={en ? "Units *" : "ইউনিট *"}><input type="number" min={1} max={10} className="input" value={form.units_needed} onChange={(e) => set("units_needed", e.target.value)} /></Field>
          <Field label={en ? "Hospital *" : "হাসপাতাল *"}><input className="input" value={form.hospital} onChange={(e) => set("hospital", e.target.value)} /></Field>
          <Field label={en ? "District *" : "জেলা *"}><select className="input" value={form.district} onChange={(e) => { set("district", e.target.value); set("upazila", ""); }}>{DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}</select></Field>
          <Field label={en ? "Upazila *" : "উপজেলা *"}><select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন"}</option>{upazilasOf(form.district).map((u) => <option key={u} value={u}>{u}</option>)}</select></Field>
          <Field label={en ? "Needed Date *" : "তারিখ *"}><input type="date" className="input" value={form.needed_date} onChange={(e) => set("needed_date", e.target.value)} /></Field>
          <Field label={en ? "Contact Name *" : "যোগাযোগের নাম *"}><input className="input" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></Field>
          <Field label={en ? "Contact Mobile *" : "যোগাযোগ মোবাইল *"}><input className="input" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="01XXXXXXXXX" /></Field>
        </div>
        <div className="mt-5"><Field label={en ? "Details (optional)" : "বিস্তারিত (ঐচ্ছিক)"}><textarea className="input min-h-24" value={form.message} onChange={(e) => set("message", e.target.value)} /></Field></div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><Link href="/" className="btn-ghost">{en ? "Cancel" : "বাতিল"}</Link><button type="submit" disabled={submitting} className="btn-primary">{submitting ? (en ? "Posting…" : "পোস্ট হচ্ছে…") : (en ? "Post Request" : "অনুরোধ পোস্ট করুন")}</button></div>
      </form>
    </div></div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}</div>;
}
