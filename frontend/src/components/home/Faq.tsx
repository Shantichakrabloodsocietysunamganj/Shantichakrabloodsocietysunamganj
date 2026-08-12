"use client";

import { useState } from "react";
import { t, type Lang } from "@/lib/i18n";

const getDefaultFAQs = (lang: Lang) => [
  { question: t("faq.q1", lang), answer: t("faq.a1", lang) },
  { question: t("faq.q2", lang), answer: t("faq.a2", lang) },
  { question: t("faq.q3", lang), answer: t("faq.a3", lang) },
  { question: t("faq.q4", lang), answer: t("faq.a4", lang) },
  { question: t("faq.q5", lang), answer: t("faq.a5", lang) },
  { question: t("faq.q6", lang), answer: t("faq.a6", lang) },
];

export default function Faq({ items, lang = "bn" }: { items?: { question: string; answer: string }[]; lang?: Lang }) {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = items && items.length > 0 ? items : getDefaultFAQs(lang);

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
              <span className="font-semibold text-ink">{item.question}</span>
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
                <div className="px-5 pb-5 text-sm leading-relaxed text-ink/70">{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
