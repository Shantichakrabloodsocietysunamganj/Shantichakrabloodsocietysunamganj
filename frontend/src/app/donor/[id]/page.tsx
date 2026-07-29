import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import BloodGroupBadge from "@/components/BloodGroupBadge";
import { site } from "@/data/site";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "রক্তদাতা যাচাই" };

export default async function DonorVerifyPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: donor } = await supabase
    .from("donors")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!donor) notFound();

  const { count: donationCount } = await supabase
    .from("donations")
    .select("*", { count: "exact", head: true })
    .eq("donor_id", donor.id);

  const pageUrl = `https://shantichakrabloodsocietysunamganj-g.vercel.app/donor/${donor.id}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(pageUrl)}`;

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-lg">
        <div className="card overflow-hidden">
          {/* হেডার */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-6 py-5 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-100">{site.shortName} • রক্তদাতা যাচাই</p>
            <h1 className="mt-1 text-xl font-bold">{donor.full_name}</h1>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              {/* QR */}
              <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="যাচাই QR" width={150} height={150} />
              </div>

              {/* তথ্য */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <BloodGroupBadge group={donor.blood_group} size="lg" />
                  <div>
                    <p className="text-xs text-ink/50">রক্তের গ্রুপ</p>
                    <p className="font-bold text-ink">{donor.blood_group}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Info label="এলাকা" value={`${donor.district}, ${donor.upazila}`} />
                  <Info label="সর্বশেষ দান" value={donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" }) : "—"} />
                  <Info label="মোট রক্তদান" value={`${donationCount ?? 0} বার`} />
                  <Info label="প্রস্তুততা" value={donor.is_available ? "প্রস্তুত" : "অনুপস্থিত"} />
                </div>
              </div>
            </div>

            {/* যাচাই স্ট্যাটাস */}
            <div className={`mt-5 flex items-center gap-3 rounded-xl p-4 ${donor.is_verified ? "bg-success-50" : "bg-amber-50"}`}>
              <span className="text-2xl">{donor.is_verified ? "✅" : "⏳"}</span>
              <div>
                <p className={`font-semibold ${donor.is_verified ? "text-success-700" : "text-amber-700"}`}>
                  {donor.is_verified ? "যাচাইকৃত রক্তদাতা" : "যাচাই চলমান"}
                </p>
                <p className="text-xs text-ink/60">
                  {donor.is_verified ? "এই রক্তদাতা শান্তিচক্র ব্লাড সোসাইটি কর্তৃক যাচাইকৃত।" : "অ্যাডমিন কর্তৃক যাচাইের অপেক্ষায়।"}
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-ink/40">
              এই QR স্ক্যান করে রক্তদাতার সত্যতা যাচাই করুন।
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
