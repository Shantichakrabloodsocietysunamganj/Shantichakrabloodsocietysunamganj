import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import TrackClient from "./TrackClient";

export const metadata: Metadata = {
  title: "অনুরোধ ট্র্যাক করুন (Track Blood Request)",
  description:
    "Track a blood request by patient name, hospital or ID at Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). Phone numbers are never searchable.",
  alternates: { canonical: "/track" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "অনুরোধ ট্র্যাক করুন | Shantichakra Blood Society Sunamganj",
    description: "Check whether a blood request is still live, completed or cancelled.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/track",
    type: "website",
  },
};

export default async function TrackPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
          { name: tx("অনুরোধ ট্র্যাক করুন"), url: "https://shantichakrabloodsociety.rahatahmed.site/track" },
        ]}
      />
      <TrackClient />
    </>
  );
}
