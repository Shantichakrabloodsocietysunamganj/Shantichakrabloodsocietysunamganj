"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { site } from "@/data/site";
import { useTr } from "@/lib/useLang";
import { fmtDate } from "@/lib/format";

export default function CertificatePage() {
  const { t: tx, lang } = useTr();
  const supabase = createClient();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [donor, setDonor] = useState<any>(null);
  const [count, setCount] = useState(0);
  const [units, setUnits] = useState(0);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: d } = await supabase.from("donors").select("*").eq("user_id", user.id).maybeSingle();
      setDonor(d);
      if (d) {
        const { data: dons } = await supabase.from("donations").select("units").eq("donor_id", d.id);
        const list = dons ?? [];
        setCount(list.length);
        setUnits(list.reduce((s: number, x: any) => s + (x.units ?? 0), 0));
      }
      setReady(true);
    })();
  }, [supabase, router]);

  if (!ready) return <div className="container-page py-20 text-center text-ink/50">{tx("লোড হচ্ছে…")}</div>;
  if (!donor)
    return (
      <div className="container-page py-20 text-center">
        <p className="font-medium text-ink">{tx("সার্টিফিকেটের জন্য রক্তদাতা হিসেবে নিবন্ধন করুন।")}</p>
        <Link href="/become-donor" className="btn-primary mt-4">{tx("রক্তদাতা হোন")}</Link>
      </div>
    );

  return (
    <div className="container-page py-10">
      <div className="mb-4 flex justify-end print:hidden">
        <Link href="/dashboard" className="btn-outline !py-2 text-xs">{tx("← ড্যাশবোর্ড")}</Link>
        <button onClick={() => window.print()} className="btn-primary ml-2 !py-2 text-xs">{tx("🖨️ সার্টিফিকেট ডাউনলোড/প্রিন্ট")}</button>
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border-4 border-double border-brand-600 bg-white p-10 text-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-50" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-blood-50" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">{tx(site.name)}</p>
            <div className="mx-auto my-4 h-px w-24 bg-brand-300" />
            <h1 className="text-3xl font-extrabold text-brand-800">{tx("সম্মাননা সনদ")}</h1>
            <p className="mt-1 text-sm text-ink/60">Certificate of Appreciation</p>

            <p className="mt-8 text-sm text-ink/60">{tx("এই সনদ প্রদান করা হলো")}</p>
            <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-ink">{donor.full_name}</h2>
            <p className="mt-1 text-sm text-ink/60">
              {tx("রক্তের গ্রুপ")} <span className="font-semibold text-ink">{donor.blood_group}</span> • {donor.district}, {donor.upazila}
            </p>

            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/70">
              {tx("মানবিক সেবায় অবদান রাখায় ও নিস্বার্থভাবে")}{" "}
              <span className="font-bold text-blood-600">{units} {tx("ইউনিট")}</span> {tx("রক্ত দান করার জন্য শান্তিচক্র ব্লাড সোসাইটি তাঁকে গভীর কৃতজ্ঞতা জানায়। প্রতিটি ফোঁটা রক্ত একটি বাঁচানো জীবন।")}
            </p>

            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-2xl font-extrabold text-brand-600">{count}</p>
                <p className="text-xs text-ink/50">{tx("মোট রক্তদান")}</p>
              </div>
              <div className="rounded-xl bg-canvas p-3">
                <p className="text-2xl font-extrabold text-blood-600">{units}</p>
                <p className="text-xs text-ink/50">{tx("মোট ইউনিট")}</p>
              </div>
            </div>

            <div className="mt-10 flex items-end justify-between">
              <div className="text-left">
                <div className="h-12 w-32 border-b border-ink/30" />
                <p className="mt-1 text-xs text-ink/50">{tx("সভাপতি,")} {tx(site.shortName)}</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white">
                <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor"><path d="M12 2s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>
              </div>
              <div className="text-right">
                <div className="h-12 w-32 border-b border-ink/30" />
                <p className="mt-1 text-xs text-ink/50">{tx("সাধারণ সম্পাদক")}</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-ink/40">
              {tx("প্রদানের তারিখ:")} {fmtDate(new Date(), lang)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
