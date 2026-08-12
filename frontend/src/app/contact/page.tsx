import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "যোগাযোগ | শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যোগাযোগ করুন। রক্তদান সংক্রান্ত যেকোনো জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের সাথে যুক্ত হন।",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "যোগাযোগ | শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ",
    description:
      "শান্তিচক্র ব্লাড সোসাইটির সঙ্গে যোগাযোগ করুন। রক্তদান সংক্রান্ত যেকোনো জিজ্ঞাসা বা সহযোগিতার জন্য আমাদের সাথে যুক্ত হন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/contact",
    type: "website",
  },
};

export default async function ContactPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("যোগাযোগ"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/contact" },
        ]}
      />
      <LocalBusinessJsonLd />
      <ContactClient />
    </>
  );
}
