import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Droplets, FlaskConical, Megaphone, Phone, ShieldCheck, Truck, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SectionHeading from "@/components/ui/SectionHeading";
import CopyButton from "@/components/CopyButton";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";
import { telHref } from "@/lib/format";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "আর্থিক সহযোগিতা | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "স্বেচ্ছাসেবী রক্তদান কার্যক্রম পরিচালনায় শান্তিচক্র ব্লাড সোসাইটিকে আর্থিক সহযোগিতা করুন।",
  alternates: { canonical: "/donate" },
  openGraph: {
    title: "আর্থিক সহযোগিতা | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "স্বেচ্ছাসেবী রক্তদান কার্যক্রম পরিচালনায় শান্তিচক্র ব্লাড সোসাইটিকে আর্থিক সহযোগিতা করুন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/donate",
    type: "website",
  },
};

export const revalidate = 60;

type DonationMethod = {
  id: string;
  method_name: string;
  account_number: string;
  account_type: string | null;
  logo_url: string | null;
  qr_url: string | null;
  instructions: string | null;
  is_active: boolean;
  order: number;
};

const supports = [
  { icon: Droplets, title: "রক্তদান শিবির", desc: "শিবির আয়োজন, পিন-ব্যানার ও দাতাদের জন্য পুষ্টিকর খাবারের খরচ" },
  { icon: FlaskConical, title: "ফ্রি গ্রুপ টেস্ট", desc: "মানুষের রক্তের গ্রুপ বিনামূল্যে নির্ধারণের কিট কেনা" },
  { icon: Truck, title: "জরুরি সংগ্রহ", desc: "হাওর অঞ্চলসহ দূরবর্তী এলাকায় দাতা সংগ্রহের যাতায়াত" },
  { icon: Megaphone, title: "সচেতনতা", desc: "স্বেচ্ছায় রক্তদান নিয়ে প্রচারণা ও সচেতনতামূলক অনুষ্ঠান" },
];

export default async function DonatePage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  let methods: DonationMethod[] = [];
  try {
    const { data } = await supabase
      .from("donation_methods")
      .select("*")
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("order", { ascending: true });
    methods = (data as DonationMethod[]) ?? [];
  } catch {
    methods = [];
  }

  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("আর্থিক সহযোগিতা"), url: "https://shantichakrabloodsociety.rahatahmed.site/donate" },
        ]}
      />
      <SectionHeading
        eyebrow={tx("সহযোগিতা")}
        title={tx("আপনার সহযোগিতায় এগিয়ে যাক এই উদ্যোগ")}
        subtitle={tx("রক্তদান সম্পূর্ণ বিনামূল্যে — তবে শিবির আয়োজন, রক্তের গ্রুপ টেস্ট কিট ও প্রচারণার খরচ চলে শুধু আপনাদের ভালোবাসায়।")}
      />

      {/* কোন কাজে ব্যয় হয় */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {supports.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <div className="card h-full p-5 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600"><s.icon className="h-6 w-6" strokeWidth={1.8} /></span>
              <p className="mt-2.5 font-semibold text-ink">{tx(s.title)}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{tx(s.desc)}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* অনুদানের মাধ্যম */}
      <div className="mt-14">
        <h2 className="flex items-center justify-center gap-2 text-center font-display text-xl font-bold text-ink"><CreditCard className="h-5 w-5 text-brand-600" /> {tx("অনুদান পাঠানোর মাধ্যম")}</h2>

        {methods.length > 0 ? (
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2">
            {methods.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div className="card h-full p-6">
                  <div className="flex items-center gap-3">
                    {m.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.logo_url} alt={m.method_name} className="h-11 w-11 rounded-xl object-cover ring-1 ring-black/5" />
                    ) : (
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><CreditCard className="h-5 w-5" /></span>
                    )}
                    <div>
                      <p className="font-display font-bold text-ink">{m.method_name}</p>
                      {m.account_type && (
                        <span className="mt-0.5 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-ink/70 dark:bg-white/10">
                          {m.account_type}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-canvas px-4 py-3">
                    <span className="select-all font-mono text-lg font-bold tracking-wide text-ink">
                      {m.account_number}
                    </span>
                    <CopyButton text={m.account_number} />
                  </div>

                  {m.instructions && (
                    <p className="mt-3 text-sm leading-relaxed text-ink/60">{m.instructions}</p>
                  )}

                  {m.qr_url && (
                    <div className="mt-4 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.qr_url} alt={`${m.method_name} QR`} className="h-36 w-36 rounded-xl object-contain ring-1 ring-black/5" />
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="card mx-auto mt-8 max-w-xl p-10 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blood-500/10 text-blood-600"><Wallet className="h-6 w-6" strokeWidth={1.8} /></span>
            <p className="mt-3 font-semibold text-ink">{tx("সরাসরি সহযোগিতা করতে চান?")}</p>
            <p className="mt-1 text-sm text-ink/60">
              {tx("আমাদের স্বেচ্ছাসেবকদের সাথে সরাসরি কথা বলে সহায়তার মাধ্যম জেনে নিন —")}{" "}
              <a href={`tel:${site.phone}`} className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline">
                <Phone className="h-3.5 w-3.5" /> {site.phone}
              </a>
            </p>
          </div>
        )}
      </div>

      {/* স্বচ্ছতা + বিকল্প */}
      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <div className="card p-6">
          <p className="flex items-center gap-2 font-display font-bold text-ink"><ShieldCheck className="h-5 w-5 text-brand-600" /> {tx("আমাদের অঙ্গীকার")}</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">
            {tx(site.name)} {tx("সম্পূর্ণ স্বেচ্ছাসেবী ও অলাভজনক সংগঠন। আর্থিক সহযোগিতার প্রতিটি টাকা খরচ হয় শুধুমাত্র রক্তদান শিবির ও সচেতনতামূলক কার্যক্রমে। প্রতিষ্ঠানের আয়-ব্যয়ের হিসাব কমিটির কাছে সংরক্ষিত থাকে।")}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-blood-500 to-blood-600 p-6 text-white">
          <p className="flex items-center gap-2 font-display font-bold"><Droplets className="h-5 w-5" /> {tx("সবচেয়ে বড় দান: আপনার রক্ত")}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            {tx("টাকার চেয়েও মূল্যবান হলো আপনার এক ব্যাগ রক্ত — যা বাঁচাতে পারে তিনটি প্রাণ।")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/become-donor" className="btn-primary !bg-white !text-blood-600 !py-2 text-sm">
              {tx("রক্তদাতা হোন")}
            </Link>
            <Link href="/eligibility" className="btn-outline !border-white/40 !text-white !py-2 text-sm hover:!bg-white/10">
              {tx("যোগ্যতা যাচাই করুন")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
