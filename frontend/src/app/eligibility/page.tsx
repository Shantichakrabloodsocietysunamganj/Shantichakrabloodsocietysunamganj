import type { Metadata } from "next";
import SectionHeading from "@/components/ui/SectionHeading";
import EligibilityChecker from "@/components/EligibilityChecker";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

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

export default async function EligibilityPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("যোগ্যতা যাচাই"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/eligibility" },
        ]}
      />
      <SectionHeading
        eyebrow={tx("যোগ্যতা যাচাই")}
        title={tx("আমি কি এখন রক্ত দিতে পারব?")}
        subtitle={tx("কয়েকটি সহজ প্রশ্নের উত্তর দিয়ে মুহূর্তেই জেনে নিন — কোনো তথ্য সেভ হয় না।")}
      />
      <div className="mt-10">
        <EligibilityChecker />
      </div>
    </div>
  );
}

