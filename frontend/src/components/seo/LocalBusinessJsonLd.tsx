import React from "react";
import { site } from "@/data/site";

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["NGO", "LocalBusiness", "Organization"],
    name: "Shantichakra Blood Society Sunamganj",
    alternateName: "শান্তিচক্র ব্লাড সোসাইটি সুনামগঞ্জ",
    url: site.url,
    logo: `${site.url}/images/logo.png`,
    image: `${site.url}/images/logo.png`,
    description:
      "শান্তিচক্র ব্লাড সোসাইটি, সুনামগঞ্জ একটি স্বেচ্ছাসেবী ও অলাভজনক রক্তদান সংগঠন। রক্তদাতা খুঁজুন, রক্তদাতা হিসেবে নিবন্ধন করুন এবং জরুরি রক্তসেবায় যুক্ত হন।",
    foundingDate: "2024",
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "শান্তিগঞ্জ",
      addressLocality: "শান্তিগঞ্জ, সুনামগঞ্জ",
      addressRegion: "সিলেট",
      addressCountry: "BD",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Sylhet Division, Bangladesh",
    },
    sameAs: [site.facebook, site.whatsapp].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
