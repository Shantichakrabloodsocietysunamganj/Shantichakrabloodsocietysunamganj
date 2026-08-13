import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";
import CompatibilityClient from "./CompatibilityClient";

export const metadata: Metadata = {
  title: "রক্ত সামঞ্জস্যতা — কাকে দিতে পারি? (Blood Compatibility)",
  description:
    "Interactive ABO/Rh compatibility checker by Shantichakra Blood Society Sunamganj (শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ). See who you can donate to or receive from, then find matching donors in Sunamganj and Sylhet.",
  alternates: { canonical: "/compatibility" },
  openGraph: {
    title: "রক্ত সামঞ্জস্যতা | Shantichakra Blood Society Sunamganj",
    description:
      "Check which blood groups match, then jump straight to matching donors in Sunamganj and Sylhet.",
    url: "https://shantichakrabloodsociety.rahatahmed.site/compatibility",
    type: "website",
  },
};

export default async function CompatibilityPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("সেবা"), url: "https://shantichakrabloodsociety.rahatahmed.site/services" },
          { name: tx("রক্ত সামঞ্জস্যতা"), url: "https://shantichakrabloodsociety.rahatahmed.site/compatibility" },
        ]}
      />
      <CompatibilityClient />
    </>
  );
}
