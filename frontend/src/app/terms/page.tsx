import type { Metadata } from "next";
import { site } from "@/data/site";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "ব্যবহারের শর্তাবলী (Terms of Use) | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির ওয়েবসাইট ও সেবা ব্যবহারের শর্তাবলী এবং নীতিমালা।",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "ব্যবহারের শর্তাবলী (Terms of Use) | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "শান্তিচক্র ব্লাড সোসাইটির ওয়েবসাইট ও সেবা ব্যবহারের শর্তাবলী এবং নীতিমালা।",
    url: "https://shantichakrabloodsociety.rahatahmed.site/terms",
    type: "website",
  },
};

export default async function TermsPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <div className="container-page max-w-3xl py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shantichakrabloodsociety.rahatahmed.site" },
          { name: tx("শর্তাবলী"), url: "https://shantichakrabloodsociety.rahatahmed.site/terms" },
        ]}
      />
      <span className="eyebrow">Terms</span>
      <h1 className="section-title mt-3">{tx("শর্তাবলী")}</h1>
      <p className="mt-2 text-sm text-ink/50">{tx("সর্বশেষ আপডেট: ২০২৬")}</p>
      <div className="card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink/70 sm:p-8">
        <p>{tx(site.name)}{tx("-এর পরিষেবা ব্যবহার করে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("স্বেচ্ছাসেবী পরিষেবা")}</h2>
        <p>{tx("এই প্ল্যাটফর্ম সম্পূর্ণ স্বেচ্ছাসেবী ও অলাভজনক। রক্তদান বা সমন্বয়ের জন্য কোনো আর্থিক লেনদেন হয় না।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("দায়বদ্ধতা")}</h2>
        <p>{tx("সংগঠন রক্তদাতা ও গ্রহীতার মধ্যে সমন্বয় সাহায্য করে মাত্র; রক্তের গুণগত মান বা চিকিৎসা সম্পর্কিত বিষয়ে দায়বদ্ধ নয়।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("সঠিক তথ্য")}</h2>
        <p>{tx("ব্যবহারকারী সঠিক তথ্য প্রদানের জন্য দায়ী। ভুল তথ্য দিলে অ্যাকাউন্ট স্থগিত করা হতে পারে।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("যোগাযোগ")}</h2>
        <p>{tx("প্রশ্নের জন্য:")} {site.email}</p>
      </div>
    </div>
  );
}
