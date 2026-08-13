"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BLOOD_COMPATIBILITY, BLOOD_GROUP_FACTS, BLOOD_GROUPS } from "@/data/constants";
import { useTr } from "@/lib/useLang";

export default function CompatibilityClient() {
  const { t: tx, lang, en } = useTr();
  const [group, setGroup] = useState<string>("O-");
  const info = BLOOD_COMPATIBILITY[group];
  const fact = BLOOD_GROUP_FACTS[group];

  const matrix = useMemo(() => {
    return BLOOD_GROUPS.map((donor) => ({
      donor,
      cells: BLOOD_GROUPS.map((recipient) => BLOOD_COMPATIBILITY[donor].canDonateTo.includes(recipient)),
    }));
  }, []);

  return (
    <div className="container-page py-12">
      <header className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">{tx("রক্ত সামঞ্জস্যতা")}</span>
        <h1 className="section-title mt-3">{tx("কাকে দিতে পারি, কার কাছ থেকে নিতে পারি?")}</h1>
        <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-brand-600 to-blood-500" />
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          {tx("গ্রুপ বেছে নিন — লাল রক্তকণিকা (RBC) সামঞ্জস্যতা মুহূর্তে দেখাবে। এটি সাধারণ নির্দেশিকা, চূড়ান্ত মিল হাসপাতালের ল্যাব করবে।")}
        </p>
      </header>

      <div className="mx-auto mt-10 max-w-3xl card overflow-hidden">
        <div className="border-b border-zinc-100 p-5 sm:p-6">
          <p className="text-sm font-semibold text-ink">{tx("আপনার / রোগীর গ্রুপ")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGroup(g)}
                className={`h-12 min-w-12 rounded-xl px-3 text-sm font-bold transition ${
                  group === g
                    ? "bg-brand-600 text-white shadow-glow"
                    : "bg-zinc-100 text-ink hover:bg-brand-100 hover:text-brand-700 dark:bg-slate-800"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {group === "O-" && (
          <div className="mx-5 mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
            ⭐ {tx("সর্বজনীন দাতা")} — {tx("O− যেকোনো গ্রুপকে লাল রক্তকণিকা দিতে পারে — জরুরি মজুদ সবচেয়ে দামি।")}
          </div>
        )}
        {group === "AB+" && (
          <div className="mx-5 mt-5 rounded-xl bg-brand-50 p-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-200">
            ⭐ {tx("সর্বজনীন গ্রহীতা")} — {tx("AB+ যেকোনো গ্রুপের লাল রক্তকণিকা নিতে পারে।")}
          </div>
        )}
        {fact && (
          <p className="mx-5 mt-4 text-sm text-ink/60">{tx(fact)}</p>
        )}

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-success-50 p-5">
            <h2 className="font-semibold text-success-700">➡️ {tx("এই গ্রুপ যাদেরকে দিতে পারে")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {info.canDonateTo.map((g) => (
                <Link
                  key={g}
                  href={`/donors?group=${encodeURIComponent(g)}`}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-success-700 ring-1 ring-success-100 hover:bg-success-100"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-brand-50 p-5">
            <h2 className="font-semibold text-brand-700">⬅️ {tx("এই গ্রুপ যাদের কাছ থেকে নিতে পারে")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {info.canReceiveFrom.map((g) => (
                <Link
                  key={g}
                  href={`/donors?group=${encodeURIComponent(g)}`}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-zinc-100 p-5">
          <Link href={`/donors?group=${encodeURIComponent(group)}`} className="btn-primary">
            {tx("মিলিয়ে দাতা খুঁজুন")} ({group})
          </Link>
          <Link href={`/request-blood?group=${encodeURIComponent(group)}`} className="btn-blood">
            {tx("এই গ্রুপের অনুরোধ করুন")}
          </Link>
          <Link href="/sos" className="btn-outline">{tx("SOS বার্তা তৈরি করুন")}</Link>
        </div>
      </div>

      <section className="mx-auto mt-14 max-w-4xl">
        <h2 className="font-display text-xl font-bold text-ink">{tx("পূর্ণ সামঞ্জস্যতা সারণি")}</h2>
        <p className="mt-1 text-sm text-ink/55">{tx("সারি = দাতা, কলাম = গ্রহীতা। ✓ মানে দিতে পারে।")}</p>
        <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-zinc-100">
          <table className="min-w-full border-collapse text-center text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-slate-800">
                <th className="sticky left-0 bg-zinc-50 px-3 py-2 text-left text-xs font-semibold text-ink/60 dark:bg-slate-800">{en ? "Donor" : "দাতা"}</th>
                {BLOOD_GROUPS.map((g) => (
                  <th key={g} className="px-2 py-2 font-bold text-ink">{g}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.donor} className="border-t border-zinc-100">
                  <th className="sticky left-0 bg-white px-3 py-2 text-left font-bold text-ink dark:bg-slate-900">{row.donor}</th>
                  {row.cells.map((ok, i) => (
                    <td key={BLOOD_GROUPS[i]} className={`px-2 py-2 ${ok ? "bg-success-50 text-success-700" : "text-ink/20"}`}>
                      {ok ? "✓" : "·"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-amber-50 p-5 text-sm leading-relaxed text-amber-900 ring-1 ring-amber-200">
        <p className="font-semibold">{tx("প্লাজমা সামঞ্জস্যতা উল্টো")}</p>
        <p className="mt-1">{tx("প্লাজমার ক্ষেত্রে AB সর্বজনীন দাতা এবং O সর্বজনীন গ্রহীতা। প্লেটলেটের নিয়ম আলাদা — হাসপাতাল বলবে কী লাগবে।")}</p>
        <p className="mt-3 text-xs">{tx("⚠️ এটি শিক্ষামূলক তথ্য — রক্ত সঞ্চালনের আগে অবশ্যই ক্রস-ম্যাচ করতে হবে।")}</p>
      </div>
    </div>
  );
}
