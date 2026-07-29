import type { Metadata } from "next";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "শর্তাবলী" };

export default function TermsPage() {
  return (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-3xl font-bold text-ink">শর্তাবলী</h1>
      <p className="mt-1 text-sm text-ink/50">সর্বশেষ আপডেট: ২০২৬</p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink/70">
        <p>{site.name}-এর পরিষেবা ব্যবহার করে আপনি নিচের শর্তাবলীতে সম্মত হচ্ছেন।</p>
        <h2 className="text-lg font-bold text-ink">স্বেচ্ছাসেবী পরিষেবা</h2>
        <p>এই প্ল্যাটফর্ম সম্পূর্ণ স্বেচ্ছাসেবী ও অলাভজনক। রক্তদান বা সমন্বয়ের জন্য কোনো আর্থিক লেনদেশন হয় না।</p>
        <h2 className="text-lg font-bold text-ink">দায়বদ্ধতা</h2>
        <p>সংগঠন রক্তদাতা ও গ্রহীতার মধ্যে সমন্বয় সাহায্য করে মাত্র; রক্তের গুণগত মান বা চিকিৎসা সম্পর্কিত বিষয়ে দায়বদ্ধ নয়।</p>
        <h2 className="text-lg font-bold text-ink">সঠিক তথ্য</h2>
        <p>ব্যবহারকারী সঠিক তথ্য প্রদানের জন্য দায়ী। ভুল তথ্য দিলে অ্যাকাউন্ট স্থগিত করা হতে পারে।</p>
        <h2 className="text-lg font-bold text-ink">যোগাযোগ</h2>
        <p>প্রশ্নের জন্য: {site.email}</p>
      </div>
    </div>
  );
}
