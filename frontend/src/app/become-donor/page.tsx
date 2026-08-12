import type { Metadata } from "next";
import BecomeDonorClient from "./BecomeDonorClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তদাতা হিসেবে নিবন্ধন করুন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করে শান্তিচক্র ব্লাড সোসাইটির জীবনরক্ষাকারী রক্তদান নেটওয়ার্কে যুক্ত হন।",
  alternates: { canonical: "/become-donor" },
  openGraph: {
    title: "রক্তদাতা হিসেবে নিবন্ধন করুন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করে শান্তিচক্র ব্লাড সোসাইটির জীবনরক্ষাকারী রক্তদান নেটওয়ার্কে যুক্ত হন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/become-donor",
    type: "website",
  },
};

export default async function BecomeDonorPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("রক্তদাতা নিবন্ধন"), url: "https://shantichakrabloodsociety.rahatahmed.site/become-donor" },
        ]}
      />
      <BecomeDonorClient />
    </>
  );
}
