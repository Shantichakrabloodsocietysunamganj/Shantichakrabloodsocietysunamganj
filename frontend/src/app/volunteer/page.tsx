import type { Metadata } from "next";
import VolunteerClient from "./VolunteerClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "স্বেচ্ছাসেবী হিসেবে যুক্ত হন | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগের মানুষের জীবন বাঁচাতে স্বেচ্ছাসেবী হিসেবে শান্তিচক্র ব্লাড সোসাইটির মানবিক কার্যক্রমে যুক্ত হন।",
  alternates: { canonical: "/volunteer" },
  openGraph: {
    title: "স্বেচ্ছাসেবী হিসেবে যুক্ত হন | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগের মানুষের জীবন বাঁচাতে স্বেচ্ছাসেবী হিসেবে শান্তিচক্র ব্লাড সোসাইটির মানবিক কার্যক্রমে যুক্ত হন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/volunteer",
    type: "website",
  },
};

export default function VolunteerPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "স্বেচ্ছাসেবী নিবন্ধন", url: "https://shanticakrabloodsocaiety.rahatahmed.site/volunteer" },
        ]}
      />
      <VolunteerClient />
    </>
  );
}
