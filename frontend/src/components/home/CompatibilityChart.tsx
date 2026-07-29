"use client";

import { useState } from "react";
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from "@/data/constants";

export default function CompatibilityChart() {
  const [group, setGroup] = useState<string>("O-");
  const info = BLOOD_COMPATIBILITY[group];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-zinc-100 p-6">
        <h3 className="text-lg font-bold text-ink">রক্ত সামঞ্জস্যতা যাচাই করুন</h3>
        <p className="mt-1 text-sm text-ink/60">আপনার গ্রুপ বেছে নিন, দেখুন কাকে দিতে পারেন বা কার কাছ থেকে নিতে পারেন।</p>
      </div>

      <div className="flex flex-wrap gap-2 p-5">
        {BLOOD_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`h-11 w-11 rounded-xl text-sm font-bold transition ${
              group === g
                ? "bg-brand-600 text-white shadow-glow"
                : "bg-zinc-100 text-ink hover:bg-brand-100 hover:text-brand-700"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="grid gap-4 p-5 pt-0 sm:grid-cols-2">
        <div className="rounded-2xl bg-success-50 p-5">
          <div className="flex items-center gap-2 text-success-700">
            <span>➡️</span>
            <h4 className="font-semibold">এই গ্রুপ যাদেরকে দিতে পারে</h4>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {info.canDonateTo.map((g) => (
              <span key={g} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-success-700 ring-1 ring-success-100">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-brand-50 p-5">
          <div className="flex items-center gap-2 text-brand-700">
            <span>⬅️</span>
            <h4 className="font-semibold">এই গ্রুপ যাদের কাছ থেকে নিতে পারে</h4>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {info.canReceiveFrom.map((g) => (
              <span key={g} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100">
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
