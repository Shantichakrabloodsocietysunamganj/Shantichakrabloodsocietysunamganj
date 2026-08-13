import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { site } from "@/data/site";
import { notFound } from "next/navigation";
import { tr, type Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import { shortDate } from "@/lib/format";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient();
  const { data: donor } = await supabase
    .from("donors")
    .select("full_name, blood_group, district, upazila")
    .eq("id", params.id)
    .maybeSingle();

  if (!donor) return { title: "রক্তদাতা যাচাই | শান্তিচক্র ব্লাড সোসাইটি" };

  const title = "রক্তদাতা যাচাই | শান্তিচক্র ব্লাড সোসাইটি";
  const description = "QR কোডের মাধ্যমে শান্তিচক্র ব্লাড সোসাইটির রক্তদাতা যাচাই করুন।";

  return {
    title,
    description,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: { canonical: `/donor/${params.id}` },
    openGraph: { title, description, url: `https://shantichakrabloodsociety.rahatahmed.site/donor/${params.id}`, type: "profile" },
    twitter: { card: "summary", title, description },
  };
}

export default async function DonorVerifyPage({ params }: { params: { id: string } }) {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  const supabase = createClient();
  const { data: donor } = await supabase
    .from("donors")
    .select("id, full_name, blood_group, district, upazila, last_donation_date, is_available, is_verified")
    .eq("id", params.id)
    .maybeSingle();

  if (!donor) notFound();

  const { count: donationCount } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("donor_id", donor.id);

  const isFutureDonationDate = donor.last_donation_date
    ? new Date(donor.last_donation_date) > new Date()
    : false;

  const nextEligible = donor.last_donation_date && !isFutureDonationDate
    ? new Date(new Date(donor.last_donation_date).getTime() + 90 * 24 * 3600 * 1000)
    : null;
  const nextEligibleText = isFutureDonationDate
    ? tx("যাচাই প্রয়োজন")
    : nextEligible && nextEligible.getTime() > Date.now()
      ? shortDate(nextEligible, lang)
      : "এখন প্রস্তুত";

  const pageUrl = `https://shantichakrabloodsociety.rahatahmed.site/donor/${donor.id}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg">
        <div className="card overflow-hidden">
          {/* হেডার */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-5 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">{tx(site.shortName)} {tx("• রক্তদাতা যাচাই")}</p>
            <h1 className="mt-1 text-xl font-bold">{donor.full_name}</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* QR */}
              <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={tx("যাচাই QR")} width={150} height={150} />
              </div>

              {/* তথ্য */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={donor.blood_group} size="lg" />
                  <div>
                    <p className="text-xs text-ink/50">{tx("রক্তের গ্রুপ")}</p>
                    <p className="font-bold text-ink">{donor.blood_group}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Info label={tx("এলাকা")} value={`${donor.district}, ${donor.upazila}`} />
                  <Info label={tx("সর্বশেষ দান")} value={isFutureDonationDate ? "যাচাই প্রয়োজন (ভবিষ্যৎ তারিখ)" : donor.last_donation_date ? shortDate(donor.last_donation_date, lang) : "—"} />
                  <Info label={tx("মোট রক্তদান")} value={`${donationCount ?? 0} বার`} />
                  <Info label={tx("পরবর্তী উপযুক্ত")} value={nextEligibleText} />
                  <Info label={tx("প্রস্তুততা")} value={donor.is_available ? tx("প্রস্তুত") : tx("অনুপস্থিত")} />
                </div>
              </div>
            </div>

            {/* যাচাই স্ট্যাটাস */}
            <div className={`mt-5 flex items-center gap-3 rounded-xl p-4 ${donor.is_verified ? "bg-success-50" : "bg-amber-50"}`}>
              <span className="text-2xl">{donor.is_verified ? "✅" : "⏳"}</span>
              <div>
                <p className={`font-semibold ${donor.is_verified ? "text-success-700" : "text-amber-700"}`}>
                  {donor.is_verified ? tx("যাচাইকৃত রক্তদাতা") : tx("যাচাই চলমান")}
                </p>
                <p className="text-xs text-ink/60">
                  {donor.is_verified ? tx("এই রক্তদাতা শান্তিচক্র ব্লাড সোসাইটি কর্তৃক যাচাইকৃত।") : tx("অ্যাডমিন কর্তৃক যাচাইের অপেক্ষায়।")}
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-ink/40">
              {tx("এই QR স্ক্যান করে রক্তদাতার সত্যতা যাচাই করুন।")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-ink/50">{label}</p>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}
