"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf } from "@/data/constants";
import { useLangClient } from "@/lib/i18n";
import { scrollToPageTop } from "@/lib/motion";
import { rememberRecentlyPostedRequest } from "@/lib/useLiveRequests";
import type { BloodRequest } from "@/lib/types";

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
  hemoglobin: z.string().min(1),
  patient_age: z.string().optional(),
  patient_gender: z.string().optional(),
  disease: z.string().optional(),
  blood_component: z.string().optional(),
});

export default function RequestBloodPage() {
  const supabase = useMemo(() => createClient(), []);
  const lang = useLangClient();
  const en = lang === "en";
  const [form, setForm] = useState<Record<string, any>>({
    patient_name: "", blood_group: "", units_needed: 1, hospital: "",
    district: "সুনামগঞ্জ", upazila: "", needed_date: "", contact_name: "",
    contact_phone: "", message: "",
    hemoglobin: "", patient_age: "", patient_gender: "", disease: "", blood_component: "whole_blood",
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
      // Supplying the id and status ourselves lets us reliably carry this exact
      // row to the list page instead of waiting for a database default/cache.
      const request: BloodRequest = {
        id: crypto.randomUUID(),
        patient_name: parsed.data.patient_name,
        blood_group: parsed.data.blood_group,
        units_needed: parsed.data.units_needed,
        hospital: parsed.data.hospital,
        district: parsed.data.district,
        upazila: parsed.data.upazila,
        needed_date: parsed.data.needed_date,
        contact_name: parsed.data.contact_name,
        contact_phone: parsed.data.contact_phone,
        message: parsed.data.message || null,
        hemoglobin: parsed.data.hemoglobin,
        patient_age: parsed.data.patient_age ? Number(parsed.data.patient_age) : null,
        patient_gender: parsed.data.patient_gender || null,
        disease: parsed.data.disease || null,
        blood_component: parsed.data.blood_component || "whole_blood",
        request_type: "normal",
        status: "pending",
        requested_by: userId,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("blood_requests").insert(request);
      if (error) throw error;

      rememberRecentlyPostedRequest(request);
      setDone(true);
      scrollToPageTop();
    } catch (e: any) {
      setServerError(e?.message ?? (en ? "Could not post the request." : "অনুরোধ পোস্ট করা যায়নি।"));
    } finally {
      setSubmitting(false);
    }
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
        <span className="eyebrow">{en ? "Emergency Help" : "জরুরি সাহায্য"}</span>
        <h1 className="section-title mt-3">{en ? "Request Blood" : "রক্তের অনুরোধ করুন"}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-blood-500 to-brand-600" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{en ? "Enter patient details — your request will appear instantly." : "রোগীর তথ্য দিন — আপনার অনুরোধ তাৎক্ষণিকভাবে প্রকাশ্য তালিকায় চলে যাবে।"}</p>
      </header>
      <form onSubmit={submit} className="mt-8 card p-6 sm:p-8">
        {serverError && <div className="mb-5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">⚠️ {serverError}</div>}
        {Object.keys(errors).length > 0 && <div className="mb-5 rounded-xl bg-blood-50 p-3 text-sm font-medium text-blood-700">⚠️ {en ? "Please fill all required fields correctly." : "অনুগ্রহ করে সব প্রয়োজনীয় তথ্য সঠিকভাবে দিন।"}</div>}
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

        {/* Patient Medical Info */}
        <div className="mt-5 rounded-xl bg-brand-50/50 p-4 dark:bg-white/5">
          <p className="mb-3 text-sm font-bold text-ink">{en ? "🩺 Patient Medical Info" : "🩺 রোগীর চিকিৎসা তথ্য"}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={en ? "Hemoglobin * (g/dL)" : "হিমোগ্লোবিন * (g/dL)"}><input className="input" placeholder={en ? "e.g. 7.5" : "যেমন: ৭.৫"} value={form.hemoglobin} onChange={(e) => set("hemoglobin", e.target.value)} /></Field>
            <Field label={en ? "Patient Age" : "রোগীর বয়স"}><input type="number" min={0} max={120} className="input" value={form.patient_age} onChange={(e) => set("patient_age", e.target.value)} /></Field>
            <Field label={en ? "Patient Gender" : "রোগীর লিঙ্গ"}><select className="input" value={form.patient_gender} onChange={(e) => set("patient_gender", e.target.value)}><option value="">{en ? "Select" : "নির্বাচন"}</option><option value="পুরুষ">{en ? "Male" : "পুরুষ"}</option><option value="নারী">{en ? "Female" : "নারী"}</option><option value="অন্যান্য">{en ? "Other" : "অন্যান্য"}</option></select></Field>
            <Field label={en ? "Condition / Disease" : "রোগীর অবস্থা / রোগ"}><input className="input" placeholder={en ? "Thalassemia, Surgery..." : "থ্যালাসেমিয়া, সার্জারি..."} value={form.disease} onChange={(e) => set("disease", e.target.value)} /></Field>
            <Field label={en ? "Component Needed" : "কী দরকার"}><select className="input" value={form.blood_component} onChange={(e) => set("blood_component", e.target.value)}><option value="whole_blood">{en ? "Whole Blood" : "সম্পূর্ণ রক্ত"}</option><option value="platelets">{en ? "Platelets" : "প্লেটলেট"}</option><option value="plasma">{en ? "Plasma" : "প্লাজমা"}</option></select></Field>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><Link href="/" className="btn-ghost">{en ? "Cancel" : "বাতিল"}</Link><button type="submit" disabled={submitting} className="btn-primary">{submitting ? (en ? "Posting…" : "পোস্ট হচ্ছে…") : (en ? "Post Request" : "অনুরোধ পোস্ট করুন")}</button></div>
      </form>
    </div></div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <div><label className="label">{label}</label>{children}{error && <p className="mt-1 text-xs font-medium text-blood-600">{error}</p>}</div>;
}
