"use client";

import { useState } from "react";
import Link from "next/link";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { BLOOD_GROUPS, SUNAMGANJ_UPAZILAS } from "@/data/constants";

const schema = z.object({
  patient_name: z.string().min(2, "রোগীর নাম দিন"),
  blood_group: z.enum(BLOOD_GROUPS as unknown as [string, ...string[]], {
    errorMap: () => ({ message: "প্রয়োজনীয় গ্রুপ নির্বাচন করুন" }),
  }),
  units_needed: z.coerce.number().int().min(1, "অন্তত ১ ইউনিট").max(10, "সর্বোচ্চ ১০ ইউনিট"),
  hospital: z.string().min(2, "হাসপাতাল/ক্লিনিকের নাম দিন"),
  upazila: z.string().min(1, "উপজেলা নির্বাচন করুন"),
  needed_date: z.string().min(1, "তারিখ দিন"),
  contact_name: z.string().min(2, "যোগাযোগের নাম দিন"),
  contact_phone: z.string().min(6, "সঠিক ফোন নম্বর দিন").regex(/^[+0-9\s-]+$/, "ফোন নম্বর সঠিক নয়"),
  message: z.string().optional(),
});

export default function RequestBloodPage() {
  const supabase = createClient();
  const [form, setForm] = useState<Record<string, any>>({
    patient_name: "",
    blood_group: "",
    units_needed: 1,
    hospital: "",
    upazila: "",
    needed_date: "",
    contact_name: "",
    contact_phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("blood_requests").insert({
        ...parsed.data,
        status: "open",
      });
      if (error) throw new Error("অনুরোধ সংরক্ষণে সমস্যা হয়েছে");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setServerError(e?.message ?? "কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md card p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-3xl">🩸</div>
          <h1 className="text-2xl font-bold text-zinc-900">অনুরোধটি পোস্ট হয়েছে</h1>
          <p className="mt-2 text-zinc-600">
            আপনার রক্তের অনুরোধ সারা সুনামগঞ্জের দাতাদের কাছে দৃশ্যমান। আশা করি শীঘ্রই সাহায্য পাবেন।
            জরুরি প্রয়োজনে সরাসরি দাতাদের সাথেও যোগাযোগ করুন।
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/donors" className="btn-primary">এখনই রক্তদাতা খুঁজুন</Link>
            <Link href="/requests" className="btn-ghost">সব অনুরোধ দেখুন</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-3xl">
        <header className="text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            জরুরি সাহায্য
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">রক্তের অনুরোধ করুন</h1>
          <p className="mt-2 text-zinc-600">
            রোগীর তথ্য দিন — আপনার অনুরোধ তাৎক্ষণিকভাবে প্রকাশ্য তালিকায় চলে যাবে।
          </p>
        </header>

        <form onSubmit={submit} className="mt-8 card p-6 sm:p-8">
          {serverError && (
            <div className="mb-5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">⚠️ {serverError}</div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="রোগীর নাম *" error={errors.patient_name}>
              <input className="input" value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} />
            </Field>
            <Field label="প্রয়োজনীয় রক্তের গ্রুপ *" error={errors.blood_group}>
              <select className="input" value={form.blood_group} onChange={(e) => set("blood_group", e.target.value)}>
                <option value="">নির্বাচন করুন</option>
                {BLOOD_GROUPS.map((g) => (<option key={g} value={g}>{g}</option>))}
              </select>
            </Field>
            <Field label="কত ইউনিট লাগবে *" error={errors.units_needed}>
              <input type="number" min={1} max={10} className="input" value={form.units_needed} onChange={(e) => set("units_needed", e.target.value)} />
            </Field>
            <Field label="হাসপাতাল / ক্লিনিক *" error={errors.hospital}>
              <input className="input" value={form.hospital} onChange={(e) => set("hospital", e.target.value)} placeholder="যেমন: সুনামগঞ্জ সদর হাসপাতাল" />
            </Field>
            <Field label="উপজেলা *" error={errors.upazila}>
              <select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}>
                <option value="">নির্বাচন করুন</option>
                {SUNAMGANJ_UPAZILAS.map((u) => (<option key={u} value={u}>{u}</option>))}
              </select>
            </Field>
            <Field label="রক্ত লাগবে কখন *" error={errors.needed_date}>
              <input type="date" className="input" value={form.needed_date} onChange={(e) => set("needed_date", e.target.value)} />
            </Field>
            <Field label="যোগাযোগের নাম *" error={errors.contact_name}>
              <input className="input" value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} />
            </Field>
            <Field label="যোগাযোগ মোবাইল *" error={errors.contact_phone}>
              <input className="input" value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="01XXXXXXXXX" />
            </Field>
          </div>

          <div className="mt-5">
            <Field label="বিস্তারিত (ঐচ্ছিক)">
              <textarea className="input min-h-24" value={form.message} onChange={(e) => set("message", e.target.value)} placeholder="যেমন: অপারেশনের জন্য জরুরি, রাতে লাগবে ইত্যাদি" />
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link href="/" className="btn-ghost">বাতিল</Link>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "পোস্ট হচ্ছে…" : "অনুরোধ পোস্ট করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs font-medium text-brand-600">{error}</p>}
    </div>
  );
}
