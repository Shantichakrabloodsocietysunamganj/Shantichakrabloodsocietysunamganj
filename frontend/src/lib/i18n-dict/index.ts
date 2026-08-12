// =============================================================
//  Bangla → English translation registry
//  ------------------------------------------------------------
//  The whole UI was authored with Bangla copy hard-coded inside
//  the components, so switching the language toggle to English
//  used to leave most of the page in Bangla.
//
//  Rather than re-keying every string, we translate by value:
//  `tr("কোনো পোস্ট নেই।", lang)` → "No posts yet." when lang is
//  "en", and returns the original Bangla for "bn".
// =============================================================

import { PLACES } from "./places";
import { UI } from "./ui";
import { ADMIN } from "./admin";
import { PAGES } from "./pages";
import { ELIGIBILITY } from "./eligibility";
import { BLOG } from "./blog";

/**
 * Normalise a lookup key: collapse whitespace (JSX text nodes carry
 * indentation) and apply Unicode NFC, because some Bangla source
 * strings are stored decomposed while the dictionary is composed.
 */
function norm(s: string): string {
  return s.normalize("NFC").replace(/\s+/g, " ").trim();
}

const SOURCES = [UI, ADMIN, PAGES, ELIGIBILITY, BLOG, PLACES];

export const BN_EN: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  for (const src of SOURCES) {
    for (const [bnText, enText] of Object.entries(src)) {
      const key = norm(bnText);
      // First dictionary wins so page-specific wording beats the
      // generic place/name transliterations.
      if (!(key in out)) out[key] = enText;
    }
  }
  return out;
})();

/** Look up an English phrase for a Bangla source string. */
export function toEnglish(bnText: string): string | undefined {
  return BN_EN[norm(bnText)];
}
