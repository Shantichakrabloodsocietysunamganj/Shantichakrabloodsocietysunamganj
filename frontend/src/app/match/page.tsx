import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import MatchClient from "./MatchClient";

export const metadata: Metadata = {
  title: "দ্রুত সহায়তা উইজার্ড (Quick Help)",
  description:
    "Answer three questions and Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ) will take you to the right blood service.",
  alternates: { canonical: "/match" },
  openGraph: {
    title: "দ্রুত সহায়তা উইজার্ড | Shantichakra Blood Society Sunamganj",
    description: "Need blood, want to donate, volunteer or find emergency numbers — start here.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/match",
    type: "website",
  },
};

export default async function MatchPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
          { name: tx("দ্রুত সহায়তা"), url: "https://shantichakrabloodsociety.rahatahmed.site/match" },
        ]}
      />
      <MatchClient />
    </>
  );
}
