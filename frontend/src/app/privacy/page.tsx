import type { Metadata } from "next";
import { site } from "@/data/site";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
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
  const en = lang === "en";
  return (
    <div className="container-page max-w-3xl py-12">
      <BreadcrumbJsonLd
        items={[
          { name: en ? "Home" : "হোম", url: "https://shanticakrabloodsocaiety.rahatahmed.site" },
          { name: en ? "Privacy Policy" : "গোপনীয়তা নীতি", url: "https://shanticakrabloodsocaiety.rahatahmed.site/privacy" },
        ]}
      />
      <span className="eyebrow">Privacy</span>
      <h1 className="section-title mt-3">{en ? "Privacy Policy" : "গোপনীয়তা নীতি"}</h1>
      <p className="mt-2 text-sm text-ink/50">{en ? "Last updated: 2026" : "সর্বশেষ আপডেট: ২০২৬"}</p>
      <div className="card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink/70 sm:p-8">
        {en ? (
          <>
            <p>{site.nameEn} respects your privacy. This policy explains what we collect and how we use it.</p>
            <h2 className="text-lg font-bold text-ink">What we collect</h2>
            <p>When registering as donor or requesting blood, we collect your name, phone, blood group and area.</p>
            <h2 className="text-lg font-bold text-ink">Use and storage</h2>
            <p>Your info is used only for blood donation coordination and emergency contact. We never sell or transfer to third parties.</p>
            <h2 className="text-lg font-bold text-ink">Security</h2>
            <p>Data is securely stored in Supabase with Row Level Security (RLS). Regular users cannot delete or modify others data.</p>
            <h2 className="text-lg font-bold text-ink">Correction or deletion request</h2>
            <p>You can request correction or deletion anytime via email ({site.email}) or contact page.</p>
            <h2 className="text-lg font-bold text-ink">Contact</h2>
            <p>For privacy questions: {site.email} or phone: {site.phone}.</p>
          </>
        ) : (
          <>
            <p>{site.name} আপনার গোপনীয়তা সম্মান করে। এই নীতিটি ব্যাখ্যা করে আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে ব্যবহার করি।</p>
            <h2 className="text-lg font-bold text-ink">আমরা যা সংগ্রহ করি</h2>
            <p>রক্তদাতা হিসেবে নিবন্ধন বা রক্তের অনুরোধ করার সময় আপনার নাম, ফোন নম্বর, রক্তের গ্রুপ ও এলাকার তথ্য সংগ্রহ করা হয়।</p>
            <h2 className="text-lg font-bold text-ink">তথ্য ব্যবহার ও সংরক্ষণ</h2>
            <p>আপনার তথ্য শুধুমাত্র রক্তদান সমন্বয় ও জরুরি মুহূর্তে রক্তের প্রয়োজনে যোগাযোগের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো বাণিজ্যিক বা তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি বা হস্তান্তর করি না।</p>
            <h2 className="text-lg font-bold text-ink">নিরাপত্তা</h2>
            <p>তথ্য Supabase-এ Row Level Security (RLS) দিয়ে সুরক্ষিতভাবে সংরক্ষিত থাকে। সাধারণ ব্যবহারকারী অন্যের তথ্য মুছতে বা পরিবর্তন করতে পারে না।</p>
            <h2 className="text-lg font-bold text-ink">তথ্য সংশোধন বা মুছে ফেলার অনুরোধ</h2>
            <p>আপনি যেকোনো সময় আপনার নিবন্ধিত তথ্য সংশোধন, আপডেট অথবা আমাদের ডেটাবেস থেকে মুছে ফেলার অনুরোধ করতে পারেন। এ জন্য আমাদের ইমেইল ({site.email}) অথবা যোগাযোগ পৃষ্ঠার মাধ্যমে আমাদের জানান।</p>
            <h2 className="text-lg font-bold text-ink">যোগাযোগ</h2>
            <p>গোপনীয়তা নীতি সম্পর্কে কোনো জিজ্ঞাসা থাকলে যোগাযোগ করুন: {site.email} অথবা ফোনে: {site.phone}।</p>
          </>
        )}
      </div>
    </div>
  );
}
