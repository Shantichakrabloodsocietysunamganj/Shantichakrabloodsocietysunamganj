"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/data/site";
import { z } from "zod";
import { t, useLangClient } from "@/lib/i18n";
import { type LucideIcon } from "@/components/icons";
import { AlertTriangle, Check, FacebookIcon, Mail, MapPin, Phone } from "@/components/icons";

const schema = z.object({
  name: z.string().min(2, "min"),
  email: z.string().email("invalid").optional().or(z.literal("")),
  phone: z.string().optional(),
  message: z.string().min(5, "min"),
});

export default function ContactPage() {
  const supabase = createClient();
  const lang = useLangClient();
  const en = lang === "en";
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
      const { error } = await supabase.from("contacts").insert({
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        message: parsed.data.message,
      });
      if (error) throw error;
      setDone(true);
    } catch (e: any) {
      setServerError(e?.message ?? "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{en ? "Get in touch" : "যোগাযোগ"}</span>
        <h1 className="section-title mt-3">{en ? "Contact Us" : t("nav.contact", lang)}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{en ? "Questions, suggestions or partnership? Reach out." : "প্রশ্ন, পরামর্শ বা সহযোগিতার জন্য যোগাযোগ করুন।"}</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <InfoCard icon={Phone} title={en ? "Phone" : "ফোন"} value={site.phone} />
          <InfoCard icon={Mail} title={en ? "Email" : "ইমেইল"} value={site.email} />
          <InfoCard icon={MapPin} title={en ? "Address" : "ঠিকানা"} value={site.address} />
          <a href={site.facebook} target="_blank" rel="noreferrer" className="card flex items-center gap-4 p-5 transition hover:border-brand-200 hover:bg-brand-50">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1877F2]/10 text-[#1877F2]"><FacebookIcon className="h-5 w-5" /></span>
            <div><p className="font-medium text-ink">Facebook</p><p className="text-sm text-brand-600">{en ? "Visit our page →" : "আমাদের পেজে লাইক দিন →"}</p></div>
          </a>
        </div>

        <div className="lg:col-span-3">
          {done ? (
            <div className="card p-10 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check className="h-7 w-7" /></div>
              <h2 className="text-xl font-bold text-ink">{en ? "Thank you!" : "ধন্যবাদ!"}</h2>
              <p className="mt-1 text-ink/60">{en ? "Your message has been received." : "আপনার বার্তা পেয়েছি। শীঘ্রই যোগাযোগ করব।"}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="card p-6 sm:p-8">
              {serverError && (<div className="mb-5 flex items-center gap-1.5 rounded-xl bg-brand-50 p-3 text-sm font-medium text-brand-700"><AlertTriangle className="h-4 w-4 shrink-0" />{serverError}</div>)}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label">{en ? "Name *" : "নাম *"}</label>
                  <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
                  {errors.name && <p className="mt-1 text-xs font-medium text-brand-600">{en ? "Required" : "দিন"}</p>}
                </div>
                <div>
                  <label className="label">{en ? "Phone" : "ফোন"}</label>
                  <input className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">{en ? "Email" : "ইমেইল"}</label>
                  <input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">{en ? "Message *" : "বার্তা *"}</label>
                  <textarea className="input min-h-28" value={form.message} onChange={(e) => set("message", e.target.value)} />
                </div>
              </div>
              <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full sm:w-auto">
                {submitting ? (en ? "Sending…" : "পাঠানো হচ্ছে…") : (en ? "Send Message" : "বার্তা পাঠান")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }: { icon: LucideIcon; title: string; value: string }) {
  return (
    <div className="card flex items-start gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100"><Icon className="h-5 w-5" /></span>
      <div><p className="text-sm font-medium text-ink/50">{title}</p><p className="font-semibold text-ink">{value}</p></div>
    </div>
  );
}
