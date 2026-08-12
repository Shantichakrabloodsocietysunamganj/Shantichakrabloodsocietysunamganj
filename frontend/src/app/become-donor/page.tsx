import type { Metadata } from "next";
import BecomeDonorClient from "./BecomeDonorClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তদাতা হিসেবে নিবন্ধন করুন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করে শান্তিচক্র ব্লাড সোসাইটির জীবনরক্ষাকারী রক্তদান নেটওয়ার্কে যুক্ত হন।",
  alternates: { canonical: "/become-donor" },
  openGraph: {
    title: "রক্তদাতা হিসেবে নিবন্ধন করুন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "স্বেচ্ছায় রক্তদাতা হিসেবে নিবন্ধন করে শান্তিচক্র ব্লাড সোসাইটির জীবনরক্ষাকারী রক্তদান নেটওয়ার্কে যুক্ত হন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/become-donor",
    type: "website",
  },
};

export default function BecomeDonorPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "রক্তদাতা নিবন্ধন", url: "https://shanticakrabloodsocaiety.rahatahmed.site/become-donor" },
        ]}
      />
      <BecomeDonorClient />
    </>
  );
}
