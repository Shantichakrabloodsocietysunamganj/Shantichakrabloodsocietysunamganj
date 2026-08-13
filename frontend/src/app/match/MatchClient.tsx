"use client";

import { useState } from "react";
import Link from "next/link";
import { BLOOD_GROUPS, DISTRICTS } from "@/data/constants";
import { useTr } from "@/lib/useLang";

type Intent = "need" | "donate" | "volunteer" | "numbers" | "";

export default function MatchClient() {
  const { t: tx, en } = useTr();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState<Intent>("");
  const [group, setGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [urgent, setUrgent] = useState<"now" | "soon" | "">("");

  const needsDetails = intent === "need" || intent === "donate";

  const pickIntent = (value: Intent) => {
    setIntent(value);
    setStep(value === "volunteer" || value === "numbers" ? 3 : 2);
  };

  const donorHref = `/donors?${new URLSearchParams({
    ...(group ? { group } : {}),
    ...(district ? { district } : {}),
  }).toString()}`;
  const requestHref = `/request-blood?${new URLSearchParams({
    ...(group ? { group } : {}),
    ...(district ? { district } : {}),
  }).toString()}`;
  const sosHref = `/sos`;

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("দ্রুত সহায়তা")}</span>
        <h1 className="section-title mt-3">{tx("আপনি কী করতে চান?")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{tx("৩ ধাপে সঠিক জায়গায় পৌঁছে যান — কোনো অ্যাকাউন্ট লাগবে না।")}</p>
        <p className="mt-3 text-xs font-semibold text-ink/40">{en ? `Step ${step} of 3` : `ধাপ ${step} / ৩`}</p>
      </header>

      <div className="mx-auto mt-10 max-w-2xl">
        {step === 1 && (
          <div className="grid gap-3">
            <IntentCard icon="🚨" title={tx("আমার রক্ত লাগবে")} desc={tx("রোগীর জন্য দাতা খুঁজুন বা অনুরোধ পোস্ট করুন")} onClick={() => pickIntent("need")} />
            <IntentCard icon="🩸" title={tx("আমি রক্ত দিতে চাই")} desc={tx("যোগ্যতা দেখে নিবন্ধন করুন")} onClick={() => pickIntent("donate")} />
            <IntentCard icon="🙋" title={tx("স্বেচ্ছাসেবক হতে চাই")} desc={tx("শিবির ও সমন্বয়ে হাত লাগান")} onClick={() => pickIntent("volunteer")} />
            <IntentCard icon="☎️" title={tx("জরুরি নম্বর লাগবে")} desc={tx("হাসপাতাল, ব্লাড ব্যাংক, ৯৯৯")} onClick={() => pickIntent("numbers")} />
          </div>
        )}

        {step === 2 && needsDetails && (
          <div className="card space-y-5 p-6">
            <div>
              <p className="label">{tx("রক্তের গ্রুপ বেছে নিন")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {BLOOD_GROUPS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGroup(g)}
                    className={`h-11 min-w-11 rounded-xl px-3 text-sm font-bold ${
                      group === g ? "bg-brand-600 text-white" : "bg-zinc-100 text-ink dark:bg-slate-800"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{tx("জেলা (ঐচ্ছিক)")}</label>
              <select className="input" value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="">{en ? "Any district" : "যেকোনো জেলা"}</option>
                {DISTRICTS.map((d) => <option key={d} value={d}>{tx(d)}</option>)}
              </select>
            </div>
            {intent === "need" && (
              <div>
                <p className="label">{tx("কত জরুরি?")}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Choice active={urgent === "now"} onClick={() => setUrgent("now")}>{tx("এখনই / আজ")}</Choice>
                  <Choice active={urgent === "soon"} onClick={() => setUrgent("soon")}>{tx("আগামী কয়েকদিন")}</Choice>
                </div>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <button type="button" className="btn-ghost" onClick={() => setStep(1)}>{tx("আগের ধাপ")}</button>
              <button type="button" className="btn-primary" onClick={() => setStep(3)}>{tx("পরবর্তী")}</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold text-ink">{tx("আপনার জন্য প্রস্তুত পথ")}</h2>
            <div className="mt-5 grid gap-3">
              {intent === "need" && (
                <>
                  <Link href={requestHref} className="btn-blood">{tx("অনুরোধ পোস্ট করুন")}</Link>
                  <Link href={donorHref} className="btn-primary">{tx("এই গ্রুপের দাতা খুঁজুন")}</Link>
                  <Link href={sosHref} className="btn-outline">{tx("SOS বার্তা তৈরি করুন")}</Link>
                  {urgent === "now" && <Link href="/emergency" className="btn-outline">{tx("জরুরি ডিরেক্টরি খুলুন")}</Link>}
                </>
              )}
              {intent === "donate" && (
                <>
                  <Link href="/eligibility" className="btn-primary">{tx("যোগ্যতা যাচাই করুন")}</Link>
                  <Link href="/guide" className="btn-outline">{tx("দানের আগে গাইড পড়ুন")}</Link>
                  <Link href="/become-donor" className="btn-outline">{tx("নিবন্ধন করুন")}</Link>
                  <Link href="/compatibility" className="btn-ghost">{tx("রক্ত সামঞ্জস্যতা")}</Link>
                </>
              )}
              {intent === "volunteer" && (
                <>
                  <Link href="/volunteer" className="btn-primary">{tx("স্বেচ্ছাসেবক আবেদন")}</Link>
                  <Link href="/events" className="btn-outline">{tx("রক্তদান কর্মসূচি")}</Link>
                  <Link href="/about" className="btn-ghost">{tx("আমাদের সম্পর্কে")}</Link>
                </>
              )}
              {intent === "numbers" && (
                <>
                  <Link href="/emergency" className="btn-blood">{tx("জরুরি ডিরেক্টরি খুলুন")}</Link>
                  <Link href="/contact" className="btn-outline">{tx("যোগাযোগ")}</Link>
                  <a href="tel:999" className="btn-outline">🚑 999</a>
                </>
              )}
            </div>
            <button type="button" className="btn-ghost mt-5" onClick={() => { setStep(1); setIntent(""); setGroup(""); setUrgent(""); }}>
              {tx("আগের ধাপ")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function IntentCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="card-hover flex w-full items-start gap-4 p-5 text-left">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-2xl">{icon}</span>
      <span>
        <span className="block font-display text-lg font-bold text-ink">{title}</span>
        <span className="mt-1 block text-sm text-ink/60">{desc}</span>
      </span>
    </button>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
        active ? "bg-brand-600 text-white" : "bg-zinc-100 text-ink dark:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}
