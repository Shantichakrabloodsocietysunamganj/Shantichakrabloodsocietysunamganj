import type { Metadata } from "next";
import { site } from "@/data/site";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { tr } from "@/lib/i18n";
import { getLang } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | শান্তিচক্র ব্লাড সোসাইটি",
  description:
    "শান্তিচক্র ব্লাড সোসাইটির ওয়েবসাইট ব্যবহারকারীদের তথ্য সংগ্রহ, সুরক্ষা ও ব্যবহার সম্পর্কিত গোপনীয়তা নীতি।",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "গোপনীয়তা নীতি (Privacy Policy) | শান্তিচক্র ব্লাড সোসাইটি",
    description:
      "শান্তিচক্র ব্লাড সোসাইটির ওয়েবসাইট ব্যবহারকারীদের তথ্য সংগ্রহ, সুরক্ষা ও ব্যবহার সম্পর্কিত গোপনীয়তা নীতি।",
    url: "https://shanticakrabloodsocaiety.rahatahmed.site/privacy",
    type: "website",
  },
};

export default async function PrivacyPage() {
  const lang = await getLang();
  const tx = (s: string) => tr(s, lang);
  return (
    <div className="container-page max-w-3xl py-12">
      <BreadcrumbJsonLd
        items={[
          { name: tx("হোম"), url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: tx("গোপনীয়তা নীতি"), url: "https://shanticakrabloodsocaiety.rahatahmed.site/privacy" },
        ]}
      />
      <span className="eyebrow">Privacy</span>
      <h1 className="section-title mt-3">{tx("গোপনীয়তা নীতি")}</h1>
      <p className="mt-2 text-sm text-ink/50">{tx("সর্বশেষ আপডেট: ২০২৬")}</p>
      <div className="card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink/70 sm:p-8">
        <p>{tx(site.name)} {tx("আপনার গোপনীয়তা সম্মান করে। এই নীতিটি ব্যাখ্যা করে আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে ব্যবহার করি।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("আমরা যা সংগ্রহ করি")}</h2>
        <p>{tx("রক্তদাতা হিসেবে নিবন্ধন বা রক্তের অনুরোধ করার সময় আপনার নাম, ফোন নম্বর, রক্তের গ্রুপ ও এলাকার তথ্য সংগ্রহ করা হয়।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("তথ্য ব্যবহার ও সংরক্ষণ")}</h2>
        <p>{tx("আপনার তথ্য শুধুমাত্র রক্তদান সমন্বয় ও জরুরি মুহূর্তে রক্তের প্রয়োজনে যোগাযোগের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো বাণিজ্যিক বা তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি বা হস্তান্তর করি না।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("নিরাপত্তা")}</h2>
        <p>{tx("তথ্য Supabase-এ Row Level Security (RLS) দিয়ে সুরক্ষিতভাবে সংরক্ষিত থাকে। সাধারণ ব্যবহারকারী অন্যের তথ্য মুছতে বা পরিবর্তন করতে পারে না।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("তথ্য সংশোধন বা মুছে ফেলার অনুরোধ")}</h2>
        <p>{tx("আপনি যেকোনো সময় আপনার নিবন্ধিত তথ্য সংশোধন, আপডেট অথবা আমাদের ডেটাবেস থেকে মুছে ফেলার অনুরোধ করতে পারেন। এ জন্য আমাদের ইমেইল (")}{site.email}{tx(") অথবা যোগাযোগ পৃষ্ঠার মাধ্যমে আমাদের জানান।")}</p>
        <h2 className="text-lg font-bold text-ink">{tx("যোগাযোগ")}</h2>
        <p>{tx("গোপনীয়তা নীতি সম্পর্কে কোনো জিজ্ঞাসা থাকলে যোগাযোগ করুন:")} {site.email} {tx("অথবা ফোনে:")} {site.phone}।</p>
      </div>
    </div>
  );
}
