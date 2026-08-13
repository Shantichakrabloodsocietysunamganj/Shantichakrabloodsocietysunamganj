import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "সেবাসমূহ — রক্তদান, জরুরি সাহায্য ও টুলস (Services)",
  description:
    "All public services of Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ): find donors, request blood, compatibility, request tracking, SOS sharing, donation guide and emergency numbers.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "সেবাসমূহ | Shantichakra Blood Society Sunamganj",
    description:
      "Emergency blood, donor search, compatibility, request tracking, SOS messages and donation guidance — every service in one place.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/services",
    type: "website",
  },
};

export default async function ServicesPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
        ]}
      />
      <ServicesClient />
    </>
  );
}
