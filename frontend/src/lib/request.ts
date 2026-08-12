// রক্তের অনুরোধ (requester) সম্পর্কিত হেল্পার — donor helper-এর মতোই স্ট্যাটাস/আরজেন্সি হিসাব
import type { BloodRequest } from "@/lib/types";

export type RequestUrgency = "critical" | "urgent" | "soon" | "planned" | "closed";

export type RequestStatusInfo = {
  key: RequestUrgency;
  label: string;
  color: string;
  dot: string;
  pulse: boolean;
};

// কত ঘণ্টা বাকি আছে (নেগেটিভ = তারিখ পার হয়ে গেছে)
export function hoursUntilNeeded(neededDate: string): number {
  return (new Date(neededDate).getTime() - Date.now()) / 3600000;
}

// দাতা কার্ডের status-dot এর মতোই — অনুরোধের লাইভ অবস্থা
export function getRequestStatus(req: Pick<BloodRequest, "needed_date" | "status">, en = false): RequestStatusInfo {
  if (req.status === "completed") {
    return { key: "closed", label: en ? "Fulfilled" : "রক্ত পাওয়া গেছে", color: "text-emerald-600", dot: "bg-emerald-500", pulse: false };
  }
  if (req.status === "cancelled") {
    return { key: "closed", label: en ? "Cancelled" : "বাতিল", color: "text-zinc-400", dot: "bg-zinc-300", pulse: false };
  }

  const h = hoursUntilNeeded(req.needed_date);
  if (h < 0) {
    return {
      key: "critical",
      label: en ? "Overdue — still needed" : "সময় পেরিয়ে গেছে — এখনো দরকার",
      color: "text-blood-600",
      dot: "bg-blood-500 shadow-[0_0_0_3px_rgba(214,40,40,0.18)]",
      pulse: true,
    };
  }
  if (h <= 12) {
    return {
      key: "critical",
      label: en ? "Critical — needed now" : "সংকটাপন্ন — এখনই দরকার",
      color: "text-blood-600",
      dot: "bg-blood-500 shadow-[0_0_0_3px_rgba(214,40,40,0.18)]",
      pulse: true,
    };
  }
  if (h <= 24) {
    return {
      key: "urgent",
      label: en ? "Urgent — within 24h" : "জরুরি — ২৪ ঘণ্টার মধ্যে",
      color: "text-blood-600",
      dot: "bg-blood-500",
      pulse: true,
    };
  }
  if (h <= 72) {
    return {
      key: "soon",
      label: en ? "Needed soon" : "শীঘ্রই দরকার",
      color: "text-amber-600",
      dot: "bg-amber-500",
      pulse: false,
    };
  }
  return {
    key: "planned",
    label: en ? "Scheduled request" : "পরিকল্পিত অনুরোধ",
    color: "text-brand-600",
    dot: "bg-brand-500",
    pulse: false,
  };
}

// "এইমাত্র / ৫ মিনিট আগে" — লাইভ ফিলিং
export function relativeTime(iso: string, en = false): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return en ? "just now" : "এইমাত্র";
  if (mins < 60) return en ? `${mins} min ago` : `${mins.toLocaleString("bn-BD")} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return en ? `${hrs}h ago` : `${hrs.toLocaleString("bn-BD")} ঘণ্টা আগে`;
  const days = Math.floor(hrs / 24);
  return en ? `${days}d ago` : `${days.toLocaleString("bn-BD")} দিন আগে`;
}

export function formatDate(d: string, en = false): string {
  try {
    return new Date(d).toLocaleDateString(en ? "en-GB" : "bn-BD", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return d;
  }
}

export const COMPONENT_LABEL: Record<string, { bn: string; en: string }> = {
  whole_blood: { bn: "সম্পূর্ণ রক্ত", en: "Whole Blood" },
  platelets: { bn: "প্লেটলেট", en: "Platelets" },
  plasma: { bn: "প্লাজমা", en: "Plasma" },
};

export function componentLabel(v: string | null | undefined, en = false): string {
  if (!v) return en ? "Whole Blood" : "সম্পূর্ণ রক্ত";
  const m = COMPONENT_LABEL[v];
  return m ? (en ? m.en : m.bn) : v;
}

// নামের আদ্যক্ষর — ছবি না থাকলে avatar প্লেসহোল্ডার (DonorCard-এর মতো)
export function initialsOf(name: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
