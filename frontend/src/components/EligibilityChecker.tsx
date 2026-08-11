"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { bn, bnDate } from "@/lib/format";
import { scrollToPageTop } from "@/lib/motion";

/* ----------------------------------------------------------
   রক্তদান যোগ্যতা যাচাই — সাধারণ চিকিৎসা নির্দেশিকা অনুযায়ী
   (বয়স, ওজন, শেষ রক্তদানের ব্যবধান ও স্বাস্থ্য প্রশ্ন)
   ⚠️ এটি চিকিৎসা পরামর্শের বিকল্প নয়।
---------------------------------------------------------- */

type Gender = "" | "পুরুষ" | "নারী" | "অন্যান্য";
type Tri = "yes" | "no" | null;

type Verdict = {
  status: "eligible" | "wait" | "doctor" | "ineligible";
  title: string;
  reasons: string[];
  notes: string[];
  eligibleFrom?: Date | null;
  daysLeft?: number;
};

const DAY = 24 * 60 * 60 * 1000;

function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * DAY);
}

export default function EligibilityChecker() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<Gender>("");
  const [donatedBefore, setDonatedBefore] = useState<"" | "yes" | "no">("");
  const [lastDate, setLastDate] = useState("");
  const [ans, setAns] = useState<Record<string, Tri>>({});
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  // স্বাস্থ্য প্রশ্নসমূহ — "হ্যাঁ" উত্তরের ফলাফল বাম দিকে
  const healthQuestions = useMemo(
    () =>
      [
        {
          id: "fever",
          q: "এই মুহূর্তে কি জ্বর, সর্দি-কাশি বা কোনো সংক্রমণ আছে?",
          onYes: { kind: "temp" as const, msg: "সম্পূর্ণ সুস্থ হওয়ার পর রক্ত দিন।" },
        },
        {
          id: "dental",
          q: "গত ৭২ ঘণ্টায় কি দাঁত তোলা বা কোনো ডেন্টাল সার্জারি হয়েছে?",
          onYes: { kind: "temp" as const, msg: "ছোটখাটো ডেন্টাল চিকিৎসার কয়েক দিন পর রক্ত দেওয়া যায়।" },
        },
        ...(gender === "নারী"
          ? [
              {
                id: "pregnant",
                q: "আপনি কি গর্ভবতী অথবা বুকের দুধ পান করছেন?",
                onYes: {
                  kind: "temp" as const,
                  msg: "গর্ভাবস্থায় ও স্তন্যদানকালে রক্তদান নিরাপদ নয় — পরে আবার চেষ্টা করুন।",
                },
              },
            ]
          : []),
        {
          id: "surgery",
          q: "গত ৬ মাসে কি বড় শল্যচিকিৎসা হয়েছে বা রক্ত/রক্তের উপাদান গ্রহণ করেছেন?",
          onYes: { kind: "temp" as const, msg: "ঘটনার অন্তত ৬ মাস পর চিকিৎসকের পরামর্শে রক্ত দিন।" },
        },
        {
          id: "tattoo",
          q: "গত ৬ মাসে কি ট্যাটু, বডি পিয়ার্সিং করেছেন বা ব্যবহৃত সুই/সিরিঞ্জ শরীরে লেগেছে?",
          onYes: { kind: "temp" as const, msg: "ঘটনার অন্তত ৬ মাস পর রক্তদান করা যাবে।" },
        },
        {
          id: "chronic",
          q: "হৃদরোগ, চিকিৎসাধীন উচ্চ রক্তচাপ, ডায়াবেটিস, কিডনি-লিভারের দীর্ঘস্থায়ী রোগ, হেপাটাইটিস বি/সি, এইচআইভি বা ক্যান্সারের ইতিহাস আছে কি?",
          onYes: {
            kind: "permanent" as const,
            msg: "এই অবস্থাগুলো থাকলে চিকিৎসকের সুনির্দিষ্ট পরামর্শ ছাড়া রক্তদান করবেন না — অনেক ক্ষেত্রে এটি স্থায়ীভাবে নিষেধ।",
          },
        },
        {
          id: "meds",
          q: "এই মুহূর্তে কি নিয়মিত কোনো ঔষধ (অ্যান্টিবায়োটিকসহ) সেবন করছেন?",
          onYes: {
            kind: "info" as const,
            msg: "রক্তদানের দিন ঔষধের নাম টেকনিশিয়ান/চিকিৎসককে অবশ্যই জানাবেন।",
          },
        },
      ] as const,
    [gender]
  );

  const allHealthAnswered = healthQuestions.every((q) => ans[q.id]);
  const basicOk = age.trim() !== "" && weight.trim() !== "" && gender !== "";
  const donationOk =
    donatedBefore === "no" || (donatedBefore === "yes" && lastDate.trim() !== "");
  const formComplete = basicOk && donatedBefore !== "" && donationOk && allHealthAnswered;

  function evaluate() {
    const reasons: string[] = [];
    const notes: string[] = [];
    let status: Verdict["status"] = "eligible";
    let eligibleFrom: Date | null = null;
    let daysLeft: number | undefined;

    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);

    // ১) বয়স
    if (isNaN(ageNum) || ageNum < 18) {
      status = "ineligible";
      reasons.push(
        `রক্তদানের ন্যূনতম বয়স ১৮ বছর। আগ্রহের জন্য অসংখ্য ধন্যবাদ — ১৮ পূর্ণ হলে আবার আসুন!`
      );
    } else if (ageNum > 65) {
      status = "doctor";
      reasons.push(
        "৬৫ বছরের বেশি বয়সে নিয়মিত দাতা হিসেবে চিকিৎসকের পরামর্শে রক্তদান করা যেতে পারে।"
      );
    }

    // ২) ওজন
    if (!isNaN(weightNum) && weightNum < 50 && status === "eligible") {
      status = "wait";
      reasons.push(
        `রক্তদানের জন্য ন্যূনতম ওজন ৫০ কেজি প্রয়োজন (আপনার ওজন ${bn(weightNum)} কেজি)। ওজন ৫০ কেজি হলে আবার যাচাই করুন।`
      );
    }

    // ৩) স্বাস্থ্য প্রশ্ন
    let hasTemp = false;
    for (const q of healthQuestions) {
      if (ans[q.id] !== "yes") continue;
      if (q.onYes.kind === "permanent") {
        if (status === "eligible" || status === "wait") status = "doctor";
        reasons.push(q.onYes.msg);
      } else if (q.onYes.kind === "temp") {
        if (status === "eligible") status = "wait";
        hasTemp = true;
        reasons.push(q.onYes.msg);
      } else {
        notes.push(q.onYes.msg);
      }
    }
    if (hasTemp && status === "wait" && reasons.length === 0) {
      reasons.push("সাময়িক কারণে এই মুহূর্তে রক্তদানে বিরত থাকুন।");
    }

    // ৪) শেষ রক্তদানের ব্যবধান (পুরুষ ৯০ দিন, নারী ১২০ দিন)
    if (donatedBefore === "yes" && lastDate) {
      const last = new Date(`${lastDate}T00:00:00`);
      if (!isNaN(last.getTime())) {
        const interval = gender === "নারী" ? 120 : 90;
        const next = addDays(last, interval);
        const today = new Date(new Date().toDateString());
        if (next.getTime() > today.getTime() && (status === "eligible" || status === "wait")) {
          status = status === "eligible" ? "wait" : status;
          eligibleFrom = next;
          daysLeft = Math.max(1, Math.ceil((next.getTime() - today.getTime()) / DAY));
          reasons.push(
            `শেষ রক্তদানের পর ${gender === "নারী" ? "৪ মাস (১২০ দিন)" : "৩ মাস (৯০ দিন)"} না হওয়া পর্যন্ত পুনরায় রক্তদান নিরাপদ নয়।`
          );
        } else {
          notes.push("শেষ রক্তদানের নিরাপদ ব্যবধান পূর্ণ হয়েছে। ✓");
        }
      }
    }

    const title =
      status === "eligible"
        ? "🎉 অভিনন্দন! আপনি রক্তদানের যোগ্য"
        : status === "wait"
        ? eligibleFrom
          ? "⏳ একটু অপেক্ষা করুন — তারিখ ঠিক আছে"
          : "⏳ এই মুহূর্তে একটু অপেক্ষা করুন"
        : status === "doctor"
        ? "👨‍⚕️ আগে চিকিৎসকের পরামর্শ নিন"
        : "💛 এখন সম্ভব নয়, তবে আপনার ইচ্ছাটাই অনুপ্রেরণা";

    setVerdict({
      status,
      title,
      reasons,
      notes: eligibleFrom ? [] : notes,
      eligibleFrom,
      daysLeft,
    });
    scrollToPageTop();
  }

  function reset() {
    setVerdict(null);
    setAge(""); setWeight(""); setGender("");
    setDonatedBefore(""); setLastDate(""); setAns({});
    scrollToPageTop();
  }

  const setA = (id: string, v: Tri) => setAns((s) => ({ ...s, [id]: v }));

  /* ---------- ফলাফল ভিউ ---------- */
  if (verdict) {
    const styles = {
      eligible: "border-success-200 bg-success-50",
      wait: "border-amber-200 bg-amber-50",
      doctor: "border-blue-200 bg-blue-50",
      ineligible: "border-zinc-200 bg-zinc-50",
    } as const;
    return (
      <div className="mx-auto max-w-2xl">
        <div className={`card border-2 p-8 text-center ${styles[verdict.status]}`}>
          <h2 className="font-display text-2xl font-extrabold text-ink">{verdict.title}</h2>

          {verdict.eligibleFrom && (
            <div className="mx-auto mt-5 inline-block rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-amber-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">আপনি আবার রক্ত দিতে পারবেন</p>
              <p className="mt-1 font-display text-2xl font-extrabold text-brand-700">
                {bnDate(verdict.eligibleFrom)}
              </p>
              {verdict.daysLeft !== undefined && (
                <p className="mt-1 text-sm font-semibold text-blood-600">
                  আর মাত্র {bn(verdict.daysLeft)} দিন বাকি ⏳
                </p>
              )}
            </div>
          )}

          {verdict.reasons.length > 0 && (
            <ul className="mx-auto mt-6 max-w-md space-y-2 text-left">
              {verdict.reasons.map((r, i) => (
                <li key={i} className="flex gap-2 rounded-xl bg-white/70 p-3 text-sm leading-relaxed text-ink ring-1 ring-black/5">
                  <span className="shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}

          {verdict.notes.length > 0 && (
            <ul className="mx-auto mt-3 max-w-md space-y-2 text-left">
              {verdict.notes.map((n, i) => (
                <li key={i} className="flex gap-2 rounded-xl bg-white/70 p-3 text-sm leading-relaxed text-ink/80 ring-1 ring-black/5">
                  <span className="shrink-0">ℹ️</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}

          {verdict.status === "eligible" && (
            <div className="mx-auto mt-6 max-w-md rounded-xl bg-white/70 p-4 text-left text-sm leading-relaxed text-ink ring-1 ring-black/5">
              <p className="font-semibold">🩸 রক্তদানের আগে মনে রাখুন:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-ink/80">
                <li>আগের রাতে পর্যাপ্ত ঘুম ও হালকা বেলা খাবার খান</li>
                <li>পর্যাপ্ত পানি পান করুন, খালি পেটে যাবেন না</li>
                <li>পরিচয়পত্র (জাতীয় পরিচয়পত্র/বহনযোগ্য আইডি) সঙ্গে রাখুন</li>
              </ul>
            </div>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {verdict.status === "eligible" && (
              <>
                <Link href="/become-donor" className="btn-primary">রক্তদাতা হিসেবে নিবন্ধন করুন →</Link>
                <Link href="/donors" className="btn-outline">দাতারা যেমন করছেন দেখুন</Link>
              </>
            )}
            {verdict.status === "wait" && verdict.eligibleFrom && (
              <Link href="/become-donor" className="btn-primary">এখনই নিবন্ধন করে রাখুন →</Link>
            )}
            <button onClick={reset} className="btn-outline">↻ আবার যাচাই করুন</button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-relaxed text-ink/50">
          ⚠️ এই যাচাই সাধারণ নির্দেশিকার ভিত্তিতে তৈরি — চূড়ান্ত সিদ্ধান্ত রক্তদান কেন্দ্রের চিকিৎসক/টেকনিশিয়ান নেবেন।
        </p>
      </div>
    );
  }

  /* ---------- ফর্ম ভিউ ---------- */
  return (
    <div className="mx-auto max-w-2xl">
      <div className="card space-y-8 p-6 sm:p-8">
        {/* ধাপ ১: মৌলিক তথ্য */}
        <section>
          <SectionLabel num="১" title="মৌলিক তথ্য" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">আপনার বয়স (বছর) *</label>
              <input
                type="number" min={10} max={100} className="input" placeholder="যেমন: ২৫"
                value={age} onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <label className="label">ওজন (কেজি) *</label>
              <input
                type="number" min={20} max={250} step="0.5" className="input" placeholder="যেমন: ৫২"
                value={weight} onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">লিঙ্গ * <span className="font-normal text-ink/40">(রক্তদানের নিরাপদ ব্যবধান নির্ভর করে)</span></label>
              <div className="flex flex-wrap gap-2">
                {(["পুরুষ", "নারী", "অন্যান্য"] as const).map((g) => (
                  <ChoiceBtn key={g} active={gender === g} onClick={() => setGender(g)}>{g}</ChoiceBtn>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ধাপ ২: রক্তদানের অভিজ্ঞতা */}
        <section>
          <SectionLabel num="২" title="আগে রক্ত দিয়েছেন?" />
          <div className="mt-4 flex flex-wrap gap-2">
            <ChoiceBtn active={donatedBefore === "no"} onClick={() => { setDonatedBefore("no"); setLastDate(""); }}>
              না, এটাই প্রথম 😊
            </ChoiceBtn>
            <ChoiceBtn active={donatedBefore === "yes"} onClick={() => setDonatedBefore("yes")}>
              হ্যাঁ, দিয়েছি
            </ChoiceBtn>
          </div>
          {donatedBefore === "yes" && (
            <div className="mt-4 max-w-xs">
              <label className="label">সর্বশেষ রক্তদানের তারিখ *</label>
              <input
                type="date" className="input" value={lastDate}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setLastDate(e.target.value)}
              />
            </div>
          )}
        </section>

        {/* ধাপ ৩: স্বাস্থ্য প্রশ্ন */}
        <section>
          <SectionLabel num="৩" title="স্বাস্থ্য সংক্রান্ত কয়েকটি প্রশ্ন" />
          <div className="mt-4 space-y-4">
            {healthQuestions.map((q) => (
              <div key={q.id} className="rounded-xl bg-canvas p-4">
                <p className="text-sm font-medium leading-relaxed text-ink">{q.q}</p>
                <div className="mt-2.5 flex gap-2">
                  <ChoiceBtn small active={ans[q.id] === "yes"} onClick={() => setA(q.id, "yes")}>হ্যাঁ</ChoiceBtn>
                  <ChoiceBtn small active={ans[q.id] === "no"} onClick={() => setA(q.id, "no")}>না</ChoiceBtn>
                </div>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={evaluate}
          disabled={!formComplete}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formComplete ? "🔍 ফলাফল দেখুন" : "👆 সবগুলো প্রশ্নের উত্তর দিন"}
        </button>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-ink/50">
        🔒 আপনার কোনো তথ্য সার্ভারে পাঠানো হয় না — হিসাবটা আপনার ব্রাউজারেই হয়।
      </p>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <h3 className="flex items-center gap-2.5 font-display font-bold text-ink">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-sm text-white">{num}</span>
      {title}
    </h3>
  );
}

function ChoiceBtn({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl font-medium transition ${
        small ? "px-4 py-1.5 text-sm" : "px-5 py-2.5 text-sm"
      } ${
        active
          ? "bg-brand-600 text-white shadow-md ring-2 ring-brand-600 ring-offset-1"
          : "bg-white text-ink/70 ring-1 ring-zinc-200 hover:bg-brand-50 hover:text-brand-700 dark:bg-slate-800 dark:ring-slate-600"
      }`}
    >
      {children}
    </button>
  );
}
