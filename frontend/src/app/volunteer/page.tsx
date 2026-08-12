import type { Metadata } from "next";
import VolunteerClient from "./VolunteerClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "স্বেচ্ছাসেবী নিবন্ধন (Become a Volunteer)",
  description:
    "Join Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ) as a volunteer in Sunamganj and Sylhet Division. সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছাসেবী হিসেবে মানবিক কার্যক্রমে যুক্ত হন।",
  alternates: { canonical: "/volunteer" },
  openGraph: {
    title: "স্বেচ্ছাসেবী নিবন্ধন (Become a Volunteer) | Shantichakra Blood Society Sunamganj",
    description:
      "Join Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ) as a volunteer in Sunamganj and Sylhet Division. সুনামগঞ্জ ও সিলেট বিভাগে স্বেচ্ছাসেবী হিসেবে মানবিক কার্যক্রমে যুক্ত হন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/volunteer",
    type: "website",
  },
};

export default async function VolunteerPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("স্বেচ্ছাসেবী নিবন্ধন"), url: "https://shantichakrabloodsociety.rahatahmed.site/volunteer" },
        ]}
      />
      <VolunteerClient />
    </>
  );
}
