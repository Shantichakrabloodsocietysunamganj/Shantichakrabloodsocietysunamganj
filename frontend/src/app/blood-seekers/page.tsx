import type { Metadata } from "next";
import BloodSeekersClient from "./BloodSeekersClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তপ্রার্থী তালিকা (লাইভ) | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগে যারা এই মুহূর্তে রক্ত খুঁজছেন — তাঁদের লাইভ তালিকা। নতুন অনুরোধ সাথে সাথেই এখানে দেখা যায়।",
  alternates: { canonical: "/blood-seekers" },
  openGraph: {
    title: "রক্তপ্রার্থী তালিকা (লাইভ) | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগে যারা এই মুহূর্তে রক্ত খুঁজছেন — তাঁদের লাইভ তালিকা। নতুন অনুরোধ সাথে সাথেই এখানে দেখা যায়।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/blood-seekers",
    type: "website",
  },
};

export default function BloodSeekersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "রক্তপ্রার্থী তালিকা", url: "https://shanticakrabloodsocaiety.rahatahmed.site/blood-seekers" },
        ]}
      />
      <BloodSeekersClient />
    </>
  );
}
