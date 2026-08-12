import type { Metadata } from "next";
import RequestsClient from "./RequestsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "জরুরি অনুরোধ তালিকা (Urgent Blood Requests)",
  description:
    "View urgent blood requests across Sunamganj and Sylhet Division at Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). রক্তের জরুরি অনুরোধসমূহ দেখুন এবং এগিয়ে আসুন।",
  alternates: { canonical: "/requests" },
  openGraph: {
    title: "জরুরি অনুরোধ তালিকা (Urgent Blood Requests) | Shantichakra Blood Society Sunamganj",
    description:
      "View urgent blood requests across Sunamganj and Sylhet Division at Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). রক্তের জরুরি অনুরোধসমূহ দেখুন এবং এগিয়ে আসুন।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/requests",
    type: "website",
  },
};

export default async function RequestsPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("জরুরি অনুরোধ তালিকা"), url: "https://shantichakrabloodsociety.rahatahmed.site/requests" },
        ]}
      />
      <RequestsClient />
    </>
  );
}
