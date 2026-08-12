import type { Metadata } from "next";
import DonorsClient from "./DonorsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তদাতা খুঁজুন (Find Blood Donors)",
  description:
    "Find volunteer blood donors in Sunamganj and Sylhet Division through Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতাদের খুঁজুন।",
  alternates: { canonical: "/donors" },
  openGraph: {
    title: "রক্তদাতা খুঁজুন (Find Blood Donors) | Shantichakra Blood Society Sunamganj",
    description:
      "Find volunteer blood donors in Sunamganj and Sylhet Division through Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). রক্তের গ্রুপ ও এলাকা অনুযায়ী রক্তদাতাদের খুঁজুন।",
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
