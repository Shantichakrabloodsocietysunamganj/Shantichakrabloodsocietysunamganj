import type { Metadata } from "next";
import Link from "next/link";
import Faq from "@/components/home/Faq";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

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
  const tx = (s: string) => tr(s, lang);
  return (
    <div className="container-page py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("সাধারণ জিজ্ঞাসা (FAQ)"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/faq" },
        ]}
      />
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">FAQ</span>
        <h1 className="section-title mt-3">{tx("সাধারণ জিজ্ঞাসিত প্রশ্ন")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">{tx("রক্তদান সম্পর্কে আপনার সব প্রশ্নের উত্তর এক জায়গায়।")}</p>
      </div>
      <div className="mt-10">
        <Faq />
      </div>
      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-brand-50 p-6 text-center">
        <p className="font-semibold text-ink">{tx("আরও প্রশ্ন আছে?")}</p>
        <p className="mt-1 text-sm text-ink/60">{tx("আমাদের সাথে সরাসরি যোগাযোগ করুন।")}</p>
        <Link href="/contact" className="btn-primary mt-4">{tx("যোগাযোগ করুন")}</Link>
      </div>
    </div>
  );
}
