"use client";

import { useState } from "react";
import { useTr } from "@/lib/useLang";

const DEFAULT_FAQS = [
  { question: "রক্তদাতা হিসেবে নিবন্ধন করতে কী লাগে?", answer: "শুধু আপনার নাম, সক্রিয় মোবাইল নম্বর, রক্তের গ্রুপ ও এলাকা প্রয়োজন। 'রক্তদাতা হোন' ফর্ম পূরণ করলেই হবে। সম্পূর্ণ ফ্রি।" },
  { question: "রক্ত দিতে বয়সের সীমা কত?", answer: "সাধারণত ১৮ থেকে ৬০ বছর, ওজন কমপক্ষে ৪৫ কেজি এবং সুস্থ থাকলে রক্ত দেওয়া নিরাপদ।" },
  { question: "কতদিন পর পর রক্ত দেওয়া যায়?", answer: "সুস্থ পুরুষ ৩ মাস এবং নারী ৪ মাস পর পর রক্ত দিতে পারেন। বছরে সর্বোচ্চ ৪ বার।" },
  { question: "জরুরি রক্ত লাগলে কীভাবে অনুরোধ করব?", answer: "'রক্ত লাগবে?' পেজে রোগীর তথ্য দিয়ে অনুরোধ পোস্ট করুন। তাৎক্ষণিকভাবে সারা সিলেটের দাতাদের কাছে তা পৌঁছে যাবে।" },
  { question: "আমার তথ্য কি নিরাপদ?", answer: "হ্যাঁ। শুধু রক্তদান সমন্বয়ের জন্য আপনার তথ্য ব্যবহৃত হয়। কেউ আপনার তথ্য মুছতে বা পরিবর্তন করতে পারবে না।" },
  { question: "এই পরিষেবা কি ফ্রি?", answer: "সম্পূর্ণ ফ্রি ও স্বেচ্ছাসেবী। কোনো আর্থিক লেনদেশ এই প্ল্যাটফর্মে নেই।" },
];

export default function Faq({ items }: { items?: { question: string; answer: string }[] }) {
  const { t: tx } = useTr();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = items && items.length > 0 ? items : DEFAULT_FAQS;

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {faqs.map((item, i) => {
        const expanded = open === i;
        const panelId = `faq-panel-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={i} className="card overflow-hidden">
            <button
              id={buttonId}
              type="button"
              aria-expanded={expanded}
              aria-controls={panelId}
              onClick={() => setOpen(expanded ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-semibold text-ink">{tx(item.question)}</span>
              <span
                className={`shrink-0 text-brand-600 transition-transform duration-300 ease-out-expo ${expanded ? "rotate-45" : "rotate-0"}`}
                aria-hidden="true"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                </svg>
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              aria-hidden={!expanded}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo ${
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{tx(item.answer)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
