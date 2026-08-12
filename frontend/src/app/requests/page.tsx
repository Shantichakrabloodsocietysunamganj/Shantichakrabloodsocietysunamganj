import type { Metadata } from "next";
import RequestsClient from "./RequestsClient";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "জরুরি রক্তের অনুরোধ তালিকা | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "সুনামগঞ্জ ও সিলেট বিভাগে রক্তের জরুরি অনুরোধসমূহ দেখুন এবং রোগীর জীবন বাঁচাতে উপযুক্ত রক্তের গ্রুপ নিয়ে এগিয়ে আসুন।",
  alternates: { canonical: "/requests" },
  openGraph: {
    title: "জরুরি রক্তের অনুরোধ তালিকা | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "সুনামগঞ্জ ও সিলেট বিভাগে রক্তের জরুরি অনুরোধসমূহ দেখুন এবং রোগীর জীবন বাঁচাতে উপযুক্ত রক্তের গ্রুপ নিয়ে এগিয়ে আসুন।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/requests",
    type: "website",
  },
};

export default async function RequestsPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("জরুরি অনুরোধ তালিকা"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/requests" },
        ]}
      />
      <RequestsClient />
    </>
  );
}
