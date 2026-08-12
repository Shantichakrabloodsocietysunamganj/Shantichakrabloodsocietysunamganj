import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import EligibilityChecker from "@/components/EligibilityChecker";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তদানের যোগ্যতা যাচাই | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "আপনি কি রক্তদানের যোগ্য? বয়স, ওজন, শেষ রক্তদান ও স্বাস্থ্য সংক্রান্ত প্রশ্নের মাধ্যমে তাৎক্ষণিকভাবে রক্তদানের যোগ্যতা যাচাই করুন।",
  alternates: { canonical: "/eligibility" },
  openGraph: {
    title: "রক্তদানের যোগ্যতা যাচাই | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "আপনি কি রক্তদানের যোগ্য? বয়স, ওজন, শেষ রক্তদান ও স্বাস্থ্য সংক্রান্ত প্রশ্নের মাধ্যমে তাৎক্ষণিকভাবে রক্তদানের যোগ্যতা যাচাই করুন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/eligibility",
    type: "website",
  },
};

import { getLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export default async function EligibilityPage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: en ? "Home" : "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: en ? "Eligibility Check" : "যোগ্যতা যাচাই", url: "https://shanticakrabloodsocaiety.rahatahmed.site/eligibility" },
        ]}
      />
      <SectionHeading
        eyebrow={t("eligibility.eyebrow", lang)}
        title={t("eligibility.title", lang)}
        subtitle={t("eligibility.sub", lang)}
      />
      <div className="mt-10">
        <EligibilityChecker lang={lang} />
      </div>
    </div>
  );
}

