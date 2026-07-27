"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/data/site";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "নাম দিন"),
  email: z.string().email("সঠিক ইমেইল দিন").optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(5, "বার্তা লিখুন"),
});

export default function ContactPage() {
  const supabase = createClient();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      });
      if (error) throw error;
      setDone(true);
    } catch (e: any) {
      setServerError(e?.message ?? "বার্তা পাঠাতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">যোগাযোগ করুন</h1>
        <p className="mt-2 text-zinc-600">প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য আমাদের সাথে যোগাযোগ করুন।</p>
      </header>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-5">
        {/* info */}
        <div className="space-y-4 lg:col-span-2">
          <InfoCard icon="📍" title="ঠিকানা" value={site.address} />
          <InfoCard icon="📞" title="ফোন" value={`${site.phone}${site.phone2 ? ` / ${site.phone2}` : ""}`} />
          <InfoCard icon="✉️" title="ইমেইল" value={site.email} />
          <a
            href={site.facebook}
            target="_blank"
            rel="noreferrer"
            className="card flex items-center gap-4 p-5 transition hover:border-brand-200 hover:bg-brand-50"
          >
            <span className="text-2xl">📘</span>
            <div>
              <p className="font-medium text-zinc-900">Facebook</p>
              <p className="text-sm text-brand-600">আমাদের পেজে লাইক দিন →</p>
            </div>
          </a>
        </div>

        {/* form */}
        <div className="lg:col-span-3">
          {done ? (
            <div className="card p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-3xl">✓</div>
              <h2 className="text-xl font-bold text-zinc-900">ধন্যবাদ!</h2>
              <p className="mt-1 text-zinc-600">আপনার বার্তা পেয়েছি। শীঘ্রই যোগাযোগ করব।</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-6 sm:p-8">
              {serverError && (
                <div className="mb-5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700">⚠️ {serverError}</div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">নাম *</label>
                  <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className="mt-1 text-xs font-medium text-brand-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="label">ফোন</label>
                  <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">ইমেইল</label>
                  <input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  {errors.email && <p className="mt-1 text-xs font-medium text-brand-600">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="label">বার্তা *</label>
                  <textarea className="input min-h-28" value={form.message} onChange={(e) => set("message", e.target.value)} />
                  {errors.message && <p className="mt-1 text-xs font-medium text-brand-600">{errors.message}</p>}
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto">
                {submitting ? "পাঠানো হচ্ছে…" : "বার্তা পাঠান"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value }: { icon: string; title: string; value: string }) {
  return (
    <div className="card flex items-start gap-4 p-5">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="font-semibold text-zinc-900">{value}</p>
      </div>
    </div>
  );
}
