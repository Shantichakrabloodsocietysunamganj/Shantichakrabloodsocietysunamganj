import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import SosClient from "./SosClient";

export const metadata: Metadata = {
  title: "SOS শেয়ার মেসেজ — WhatsApp / SMS (Emergency Share)",
  description:
    "Create a ready WhatsApp, SMS or Facebook message for an emergency blood need with Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ).",
  alternates: { canonical: "/sos" },
  openGraph: {
    title: "SOS শেয়ার মেসেজ | Shantichakra Blood Society Sunamganj",
    description: "Build a ready emergency blood message and share it on WhatsApp, SMS or Facebook.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/sos",
    type: "website",
  },
};

export default async function SosPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
          { name: tx("SOS শেয়ার মেসেজ"), url: "https://shantichakrabloodsociety.rahatahmed.site/sos" },
        ]}
      />
      <SosClient />
    </>
  );
}
