import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "গোপনীয়তা নীতি" };

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <span className="eyebrow">Privacy</span>
      <h1 className="section-title mt-3">গোপনীয়তা নীতি</h1>
      <p className="mt-2 text-sm text-ink/50">সর্বশেষ আপডেট: ২০২৬</p>
      <div className="card mt-6 space-y-4 p-6 text-sm leading-relaxed text-ink/70 sm:p-8">
        <p>{site.name} আপনার গোপনীয়তা সম্মান করে। এই নীতিটি ব্যাখ্যা করে আমরা কী তথ্য সংগ্রহ করি এবং কীভাবে ব্যবহার করি।</p>
        <h2 className="text-lg font-bold text-ink">আমরা যা সংগ্রহ করি</h2>
        <p>রক্তদাতা হিসেবে নিবন্ধন বা রক্তের অনুরোধ করার সময় আপনার নাম, ফোন নম্বর, রক্তের গ্রুপ ও এলাকার তথ্য সংগ্রহ করা হয়।</p>
        <h2 className="text-lg font-bold text-ink">তথ্য ব্যবহার</h2>
        <p>আপনার তথ্য শুধুমাত্র রক্তদান সমন্বয়ের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি করি না।</p>
        <h2 className="text-lg font-bold text-ink">নিরাপত্তা</h2>
        <p>তথ্য Supabase-এ Row Level Security দিয়ে সুরক্ষিতভাবে সংরক্ষিত থাকে। সাধারণ ব্যবহারকারী অন্যের তথ্য মুছতে বা পরিবর্তন করতে পারে না।</p>
        <h2 className="text-lg font-bold text-ink">যোগাযোগ</h2>
        <p>এই নীতি সম্পর্কে প্রশ্ন থাকলে {site.email} ঠিকানায় যোগাযোগ করুন।</p>
      </div>
    </div>
  );
}
