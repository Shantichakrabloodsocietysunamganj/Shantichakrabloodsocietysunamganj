import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import GuideClient from "./GuideClient";

export const metadata: Metadata = {
  title: "রক্তদান গাইড — আগে, দিনে ও পরে (Donation Guide)",
  description:
    "Before, during and after blood donation guide from Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ): food, checklist and next eligible date.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "রক্তদান গাইড | Shantichakra Blood Society Sunamganj",
    description: "What to eat, what to avoid, a printable checklist and your next eligible donation date.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/guide",
    type: "website",
  },
};

export default async function GuidePage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
          { name: tx("রক্তদান গাইড"), url: "https://shantichakrabloodsociety.rahatahmed.site/guide" },
        ]}
      />
      <GuideClient />
    </>
  );
}
