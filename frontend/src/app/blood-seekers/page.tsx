import type { Metadata } from "next";
import BloodSeekersClient from "./BloodSeekersClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তপ্রার্থী তালিকা (Live Blood Seekers)",
  description:
    "Live emergency blood requests and blood seekers in Sunamganj and Sylhet Division via Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). সুনামগঞ্জ ও সিলেট বিভাগে যারা রক্ত খুঁজছেন তাঁদের লাইভ তালিকা।",
  alternates: { canonical: "/blood-seekers" },
  openGraph: {
    title: "রক্তপ্রার্থী তালিকা (Live Blood Seekers) | Shantichakra Blood Society Sunamganj",
    description:
      "Live emergency blood requests and blood seekers in Sunamganj and Sylhet Division via Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). সুনামগঞ্জ ও সিলেট বিভাগে যারা রক্ত খুঁজছেন তাঁদের লাইভ তালিকা।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/blood-seekers",
    type: "website",
  },
};

export default async function BloodSeekersPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("রক্তপ্রার্থী তালিকা"), url: "https://shantichakrabloodsociety.rahatahmed.site/blood-seekers" },
        ]}
      />
      <BloodSeekersClient />
    </>
  );
}
