"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import { BLOOD_GROUPS, DISTRICTS, upazilasOf } from "@/data/constants";
import { buildSosMessage, facebookShareUrl, smsShareUrl, whatsappShareUrl } from "@/lib/sos";
import { useTr } from "@/lib/useLang";

export default function SosClient() {
  const { t: tx, lang, en } = useTr();
  const [form, setForm] = useState({
    patientName: "",
    bloodGroup: "",
    units: "1",
    hospital: "",
    district: "সুনামগঞ্জ",
    upazila: "",
    neededDate: "",
    contactPhone: "",
    extra: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const message = useMemo(
    () =>
      buildSosMessage(
        {
          patientName: form.patientName,
          bloodGroup: form.bloodGroup,
          units: form.units,
          hospital: form.hospital,
          district: form.district,
          upazila: form.upazila,
          neededDate: form.neededDate,
          contactPhone: form.contactPhone,
          extra: form.extra,
        },
        lang,
      ),
    [form, lang],
  );

  const requestHref = `/request-blood${form.bloodGroup ? `?group=${encodeURIComponent(form.bloodGroup)}` : ""}${
    form.district ? `${form.bloodGroup ? "&" : "?"}district=${encodeURIComponent(form.district)}` : ""
  }${form.hospital ? `&hospital=${encodeURIComponent(form.hospital)}` : ""}`;

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("SOS শেয়ার মেসেজ")}</span>
        <h1 className="section-title mt-3">{tx("এক ক্লিকে WhatsApp, SMS ও Facebook-এ পাঠান")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          {tx("তথ্য দিন — নিচে প্রস্তুত বার্তা তৈরি হবে। ফোন নম্বর শুধু আপনি দিলেই বার্তায় যাবে।")}
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-2">
        <form className="card space-y-4 p-6" onSubmit={(e) => e.preventDefault()}>
          <Field label={en ? "Patient name" : "রোগীর নাম"}>
            <input className="input" value={form.patientName} onChange={(e) => set("patientName", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={en ? "Blood group" : "রক্তের গ্রুপ"}>
              <select className="input" value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
                <option value="">{en ? "Select" : "নির্বাচন"}</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
            <Field label={en ? "Units" : "ইউনিট"}>
              <input type="number" min={1} max={10} className="input" value={form.units} onChange={(e) => set("units", e.target.value)} />
            </Field>
          </div>
          <Field label={en ? "Hospital" : "হাসপাতাল"}>
            <input className="input" value={form.hospital} onChange={(e) => set("hospital", e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={en ? "District" : "জেলা"}>
              <select className="input" value={form.district} onChange={(e) => { set("district", e.target.value); set("upazila", ""); }}>
                {DISTRICTS.map((d) => <option key={d} value={d}>{tx(d)}</option>)}
              </select>
            </Field>
            <Field label={en ? "Upazila" : "উপজেলা"}>
              <select className="input" value={form.upazila} onChange={(e) => set("upazila", e.target.value)}>
                <option value="">{en ? "Select" : "নির্বাচন"}</option>
                {upazilasOf(form.district).map((u) => <option key={u} value={u}>{tx(u)}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={en ? "Needed by" : "লাগবে তারিখ"}>
              <input type="date" className="input" value={form.neededDate} onChange={(e) => set("neededDate", e.target.value)} />
            </Field>
            <Field label={en ? "Contact mobile (optional)" : "যোগাযোগ মোবাইল (ঐচ্ছিক)"}>
              <input className="input" value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="01XXXXXXXXX" />
            </Field>
          </div>
          <Field label={tx("অতিরিক্ত কথা (ঐচ্ছিক)")}>
            <textarea className="input min-h-20" value={form.extra} onChange={(e) => set("extra", e.target.value)} placeholder={tx("যেমন: অপারেশনের আগে আজ রাতেই লাগবে")} />
          </Field>
        </form>

        <div className="card flex flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-ink">{tx("বার্তা প্রিভিউ")}</h2>
            <CopyButton text={message} label={tx("বার্তা কপি করুন")} />
          </div>
          <pre className="mt-4 flex-1 whitespace-pre-wrap rounded-2xl bg-canvas p-4 text-sm leading-relaxed text-ink dark:bg-white/5">{message}</pre>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <a href={whatsappShareUrl(message)} target="_blank" rel="noreferrer" className="btn bg-[#25D366] text-white hover:opacity-90">
              WhatsApp
            </a>
            <a href={smsShareUrl(message)} className="btn-outline">{tx("SMS পাঠান")}</a>
            <a href={facebookShareUrl(message)} target="_blank" rel="noreferrer" className="btn bg-[#1877F2] text-white hover:opacity-90">
              Facebook
            </a>
          </div>
          <div className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
            <p className="font-semibold">{tx("অনুরোধও পোস্ট করুন")}</p>
            <p className="mt-1 text-brand-800/80">{tx("শেয়ারের পাশাপাশি ওয়েবসাইটে অনুরোধ রাখলে দাতারা খুঁজে পান।")}</p>
            <Link href={requestHref} className="btn-primary mt-3">{tx("অনুরোধ পোস্ট করুন")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
