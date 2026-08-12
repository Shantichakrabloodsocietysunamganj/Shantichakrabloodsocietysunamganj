import type { Metadata } from "next";
import DonorsClient from "./DonorsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তদাতা খুঁজুন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "রক্তের গ্রুপ ও এলাকা অনুযায়ী নিবন্ধিত রক্তদাতাদের খুঁজুন এবং জরুরি রক্তের প্রয়োজনে যোগাযোগ করুন।",
  alternates: { canonical: "/donors" },
  openGraph: {
    title: "রক্তদাতা খুঁজুন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "রক্তের গ্রুপ ও এলাকা অনুযায়ী নিবন্ধিত রক্তদাতাদের খুঁজুন এবং জরুরি রক্তের প্রয়োজনে যোগাযোগ করুন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/donors",
    type: "website",
  },
};

export default async function DonorsPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("রক্তদাতা খুঁজুন"), url: "https://shantichakrabloodsociety.rahatahmed.site/donors" },
        ]}
      />
      <DonorsClient />
    </>
  );
}
