import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/home/Faq";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { getLang } from "@/lib/i18n-server";
import { t } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা (FAQ) | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "রক্তদান, রক্তদাতা নিবন্ধন, জরুরি রক্তের অনুরোধ ও সংগঠনের কার্যক্রম সম্পর্কিত সাধারণ প্রশ্ন ও উত্তর।",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "সাধারণ জিজ্ঞাসা (FAQ) | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "রক্তদান, রক্তদাতা নিবন্ধন, জরুরি রক্তের অনুরোধ ও সংগঠনের কার্যক্রম সম্পর্কিত সাধারণ প্রশ্ন ও উত্তর।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/faq",
    type: "website",
  },
};

export default async function FaqPage() {
  const lang = await getLang();
  const en = lang === "en";
  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: en ? "Home" : "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: en ? "FAQ" : "সাধারণ জিজ্ঞাসা (FAQ)", url: "https://shanticakrabloodsocaiety.rahatahmed.site/faq" },
        ]}
      />
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{t("faq.eyebrow", lang)}</span>
        <h1 className="section-title mt-3">{t("faq.title", lang)}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{t("faq.sub", lang)}</p>
      </div>
      <div className="mt-10">
        <Faq lang={lang} />
      </div>
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-brand-50 p-6 text-center">
        <p className="font-semibold text-ink">{t("faq.moreQ", lang)}</p>
        <p className="mt-1 text-sm text-ink/60">{t("faq.contactDirect", lang)}</p>
        <Link href="/contact" className="btn-primary mt-4">{t("faq.contactBtn", lang)}</Link>
      </div>
    </div>
  );
}
