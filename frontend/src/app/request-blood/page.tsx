import type { Metadata } from "next";
import RequestBloodClient from "./RequestBloodClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

export const metadata: Metadata = {
  title: "রক্তের অনুরোধ করুন | জরুরি রক্তসেবা | শান্তিচক্র",
  description:
    "জরুরি রক্তের প্রয়োজন হলে রোগীর প্রয়োজনীয় তথ্য দিয়ে রক্তের অনুরোধ পাঠান এবং উপযুক্ত রক্তদাতার সঙ্গে যোগাযোগের সুযোগ নিন।",
  alternates: { canonical: "/request-blood" },
  openGraph: {
    title: "রক্তের অনুরোধ করুন | জরুরি রক্তসেবা | শান্তিচক্র",
    description:
      "জরুরি রক্তের প্রয়োজন হলে রোগীর প্রয়োজনীয় তথ্য দিয়ে রক্তের অনুরোধ পাঠান এবং উপযুক্ত রক্তদাতার সঙ্গে যোগাযোগের সুযোগ নিন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/request-blood",
    type: "website",
  },
};

export default function RequestBloodPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: "রক্তের অনুরোধ করুন", url: "https://shanticakrabloodsocaiety.rahatahmed.site/request-blood" },
        ]}
      />
      <RequestBloodClient />
    </>
  );
}
