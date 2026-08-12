import type { Metadata } from "next";
import RequestBloodClient from "./RequestBloodClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "জরুরি রক্তের অনুরোধ (Emergency Blood Request)",
  description:
    "Submit an emergency blood request in Sunamganj and Sylhet Division through Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). জরুরি রক্তের প্রয়োজনে রোগীর তথ্য দিয়ে অনুরোধ পাঠান।",
  alternates: { canonical: "/request-blood" },
  openGraph: {
    title: "জরুরি রক্তের অনুরোধ (Emergency Blood Request) | Shantichakra Blood Society Sunamganj",
    description:
      "Submit an emergency blood request in Sunamganj and Sylhet Division through Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). জরুরি রক্তের প্রয়োজনে রোগীর তথ্য দিয়ে অনুরোধ পাঠান।",
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
