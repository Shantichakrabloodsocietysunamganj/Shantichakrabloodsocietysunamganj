import type { Metadata } from "next";
import VolunteerClient from "./VolunteerClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "স্বেচ্ছাসেবী হিসেবে যুক্ত হন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগের মানুষের জীবন বাঁচাতে স্বেচ্ছাসেবী হিসেবে শান্তিচক্র ব্লাড সোসাইটির মানবিক কার্যক্রমে যুক্ত হন।",
  alternates: { canonical: "/volunteer" },
  openGraph: {
    title: "স্বেচ্ছাসেবী হিসেবে যুক্ত হন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগের মানুষের জীবন বাঁচাতে স্বেচ্ছাসেবী হিসেবে শান্তিচক্র ব্লাড সোসাইটির মানবিক কার্যক্রমে যুক্ত হন।",
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
