import type { Metadata } from "next";
import RequestBloodClient from "./RequestBloodClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "রক্তের অনুরোধ করুন | জরুরি রক্তসেবা | শান্তিচক্র",
  description:
    "জরুরি রক্তের প্রয়োজন হলে রোগীর প্রয়োজনীয় তথ্য দিয়ে রক্তের অনুরোধ পাঠান এবং উপযুক্ত রক্তদাতার সঙ্গে যোগাযোগের সুযোগ নিন।",
  alternates: { canonical: "/request-blood" },
  openGraph: {
    title: "রক্তের অনুরোধ করুন | জরুরি রক্তসেবা | শান্তিচক্র",
    description:
      "জরুরি রক্তের প্রয়োজন হলে রোগীর প্রয়োজনীয় তথ্য দিয়ে রক্তের অনুরোধ পাঠান এবং উপযুক্ত রক্তদাতার সঙ্গে যোগাযোগের সুযোগ নিন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/request-blood",
    type: "website",
  },
};

export default async function RequestBloodPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("রক্তের অনুরোধ করুন"), url: "https://shantichakrabloodsociety.rahatahmed.site/request-blood" },
        ]}
      />
      <RequestBloodClient />
    </>
  );
}
