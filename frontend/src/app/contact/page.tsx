import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";

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

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "যোগাযোগ", url: "https://shanticakrabloodsocaiety.rahatahmed.site/contact" },
        ]}
      />
      <LocalBusinessJsonLd />
      <ContactClient />
    </>
  );
}
