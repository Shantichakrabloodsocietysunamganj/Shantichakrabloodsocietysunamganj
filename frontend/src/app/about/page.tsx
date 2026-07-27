import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";

export const metadata = { title: "আমাদের সম্পর্কে" };

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50/70 to-white py-16">
        <div className="container-page max-w-3xl text-center">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600">
            আমাদের গল্প
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-zinc-900">{site.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">{site.mission}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/become-donor" className="btn-primary">যুক্ত হোন</Link>
            <Link href="/donors" className="btn-outline">রক্তদাতা খুঁজুন</Link>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">🎯</div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">আমাদের লক্ষ্য</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{site.mission}</p>
          </div>
          <div className="card p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">🌟</div>
            <h2 className="mt-4 text-xl font-bold text-zinc-900">আমাদের স্বপ্ন</h2>
            <p className="mt-2 leading-relaxed text-zinc-600">{site.vision}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-zinc-50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="মূল্যবোধ" title="যে নীতিতে আমরা চলি" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="text-3xl">{v.icon}</div>
                <h3 className="mt-3 font-semibold text-zinc-900">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="নেতৃত্ব" title="পরিচালনা পরিষদ" subtitle="এই উদ্যোগের পেছনে যারা আছেন।" />
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {site.founders.map((f, i) => (
            <div key={i} className="card flex items-center gap-4 p-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-2xl font-bold text-brand-600">
                {f.name.trim().charAt(0) || "?"}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">{f.name}</h3>
                <p className="text-sm text-brand-600">{f.role}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-sm text-zinc-400">
          নাম ও তথ্য পরিবর্তনের জন্য <code className="rounded bg-zinc-100 px-1.5 py-0.5">src/data/site.ts</code> ফাইল এডিট করুন।
        </p>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="rounded-3xl bg-brand-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold">একসাথে একটি পরিবর্তন গড়ি</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-50">আপনার সহযোগিতা ছাড়া এই উদ্যোগ অসম্পূর্ণ। আজই রক্তদাতা হিসেবে যুক্ত হোন।</p>
          <Link href="/become-donor" className="mt-6 inline-flex btn bg-white text-brand-700 hover:bg-brand-50">রক্তদাতা হোন</Link>
        </div>
      </section>
    </div>
  );
}

const VALUES = [
  { icon: "🤝", title: "মানবিকতা", desc: "ধর্ম, বর্ণ বা পেশা ভেদে নয় — প্রতিটি জীবনের পাশে দাঁড়াই।" },
  { icon: "⚡", title: "দ্রুততা", desc: "জরুরি মুহূর্তে সবচেয়ে কম সময়ে সঠিক দাতায় পৌঁছাই।" },
  { icon: "🔒", title: "নিরাপত্তা", desc: "দাতা ও গ্রহীতার তথ্য সুরক্ষিত ও দায়িত্বশীলভাবে ব্যবহৃত হয়।" },
  { icon: "💎", title: "স্বেচ্ছাসেবা", desc: "কোনো আর্থিক লেনদেন নেই — পুরোপুরি স্বেচ্ছাসেবী নেটওয়ার্ক।" },
  { icon: "📍", title: "স্থানীয়তা", desc: "সুনামগঞ্জের মানুষের জন্য, সুনামগঞ্জের মানুষের দ্বারা।" },
  { icon: "🔄", title: "নিরবচ্ছিন্নতা", desc: "২৪/৭ অনুরোধ গ্রহণ ও সমন্বয় — কখনো থামি না।" },
];
