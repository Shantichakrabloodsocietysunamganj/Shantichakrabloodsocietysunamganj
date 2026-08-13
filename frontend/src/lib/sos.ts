// =============================================================
//  SOS share-message builder — pure, testable, no PII unless
//  the user typed it into the form themselves.
// =============================================================

import { site } from "@/data/site";
import type { Lang } from "@/lib/i18n";

export type SosDraft = {
  patientName: string;
  bloodGroup: string;
  units: number | string;
  hospital: string;
  district: string;
  upazila: string;
  neededDate: string;
  contactPhone: string;
  extra?: string;
};

export function buildSosMessage(draft: SosDraft, lang: Lang = "bn"): string {
  const lines: string[] = [];
  const push = (label: string, value?: string | number | null) => {
    const v = value == null ? "" : String(value).trim();
    if (!v) return;
    lines.push(`${label}: ${v}`);
  };

  if (lang === "en") {
    lines.push("🚨 *EMERGENCY BLOOD NEEDED*");
    lines.push("");
    push("Patient", draft.patientName);
    push("Blood group", draft.bloodGroup);
    push("Units", draft.units);
    push("Hospital", draft.hospital);
    const area = [draft.upazila, draft.district].map((x) => x.trim()).filter(Boolean).join(", ");
    push("Area", area);
    push("Needed by", draft.neededDate);
    push("Contact", draft.contactPhone);
    if (draft.extra?.trim()) {
      lines.push("");
      lines.push(draft.extra.trim());
    }
    lines.push("");
    lines.push("Please share this message. One unit can save three lives.");
    lines.push(`— ${site.nameEn}`);
    lines.push(`${site.url}/request-blood`);
  } else {
    lines.push("🚨 *জরুরি রক্তের প্রয়োজন*");
    lines.push("");
    push("রোগী", draft.patientName);
    push("রক্তের গ্রুপ", draft.bloodGroup);
    push("ইউনিট", draft.units);
    push("হাসপাতাল", draft.hospital);
    const area = [draft.upazila, draft.district].map((x) => x.trim()).filter(Boolean).join(", ");
    push("এলাকা", area);
    push("লাগবে", draft.neededDate);
    push("যোগাযোগ", draft.contactPhone);
    if (draft.extra?.trim()) {
      lines.push("");
      lines.push(draft.extra.trim());
    }
    lines.push("");
    lines.push("অনুগ্রহ করে শেয়ার করুন। এক ইউনিট রক্ত তিনটি জীবন বাঁচাতে পারে।");
    lines.push(`— ${site.name}`);
    lines.push(`${site.url}/request-blood`);
  }

  return lines.join("\n");
}

export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function smsShareUrl(text: string): string {
  return `sms:?body=${encodeURIComponent(text)}`;
}

export function facebookShareUrl(text: string, url = `${site.url}/request-blood`): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** True if the string looks like a request UUID. */
export function looksLikeRequestId(value: string): boolean {
  return UUID_RE.test(value.trim());
}

/** Strip filter-injection characters from a public search box. */
export function sanitizePublicSearch(raw: string, max = 80): string {
  return raw
    .replace(/[%_,.()"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}
