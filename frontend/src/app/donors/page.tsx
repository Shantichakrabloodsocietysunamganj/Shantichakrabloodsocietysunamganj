import type { Metadata } from "next";
import DonorsClient from "./DonorsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তদাতা খুঁজুন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "রক্তের গ্রুপ ও এলাকা অনুযায়ী নিবন্ধিত রক্তদাতাদের খুঁজুন এবং জরুরি রক্তের প্রয়োজনে যোগাযোগ করুন।",
  alternates: { canonical: "/donors" },
  openGraph: {
    title: "রক্তদাতা খুঁজুন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "রক্তের গ্রুপ ও এলাকা অনুযায়ী নিবন্ধিত রক্তদাতাদের খুঁজুন এবং জরুরি রক্তের প্রয়োজনে যোগাযোগ করুন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/donors",
    type: "website",
  },
};

export default function DonorsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "রক্তদাতা খুঁজুন", url: "https://shanticakrabloodsocaiety.rahatahmed.site/donors" },
        ]}
      />
      <DonorsClient />
    </>
  );
}
