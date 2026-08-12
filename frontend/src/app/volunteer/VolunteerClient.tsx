"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { SYLHET_DISTRICTS } from "@/data/constants";
import { useToast } from "@/components/Toast";
import { useLangClient, t } from "@/lib/i18n";

const ALL_UPAZILAS = SYLHET_DISTRICTS.flatMap((d) => [...d.upazilas]);

export default function VolunteerPage() {
  const supabase = createClient();
  const toast = useToast();
  const lang = useLangClient();
  const en = lang === "en";
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", upazila: "", role: "" });
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("volunteers").insert(form);
    setSaving(false);
    if (error) {
      toast("error", t("volunteer.error", lang));
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md card p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-success-50 text-3xl">✓</div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">{t("volunteer.thanks", lang)}</h1>
          <p className="mt-2 text-ink/60">{t("volunteer.thanksDesc", lang)}</p>
          <Link href="/" className="btn-primary mt-6">{t("volunteer.backHome", lang)}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl">
        <header className="text-center">
          <span className="eyebrow">{t("volunteer.eyebrow", lang)}</span>
          <h1 className="section-title mt-3">{t("volunteer.title", lang)}</h1>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
          <p className="mx-auto mt-4 max-w-xl text-ink/60">{t("volunteer.sub", lang)}</p>
        </header>

        <form onSubmit={submit} className="mt-8 card p-6 sm:p-8 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">{t("volunteer.fullName", lang)}</label><input required className="input" value={form.full_name} onChange={(e) => set("full_name", e.target.value)} /></div>
            <div><label className="label">{t("volunteer.mobile", lang)}</label><input required className="input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="01XXXXXXXXX" /></div>
            <div><label className="label">{t("volunteer.email", lang)}</label><input className="input" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div><label className="label">{t("volunteer.upazila", lang)}</label>
              <select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}>
                <option value="">{t("volunteer.select", lang)}</option>
                {ALL_UPAZILAS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label">{t("volunteer.howHelp", lang)}</label>
            <input className="input" value={form.role} onChange={(e) => set("role", e.target.value)} placeholder={t("volunteer.placeholder", lang)} />
          </div>
          <button disabled={saving} className="btn-primary w-full">{saving ? t("volunteer.submitting", lang) : t("volunteer.submit", lang)}</button>
        </form>
      </div>
    </div>
  );
}
