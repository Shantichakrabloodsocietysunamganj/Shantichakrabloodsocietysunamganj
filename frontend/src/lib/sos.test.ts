import { describe, it, expect } from "vitest";
import {
  buildSosMessage,
  looksLikeRequestId,
  sanitizePublicSearch,
  whatsappShareUrl,
} from "./sos";

const draft = {
  patientName: "রহিম উদ্দিন",
  bloodGroup: "B+",
  units: 2,
  hospital: "সুনামগঞ্জ সদর হাসপাতাল",
  district: "সুনামগঞ্জ",
  upazila: "সুনামগঞ্জ সদর",
  neededDate: "2026-08-14",
  contactPhone: "01626224878",
  extra: "অপারেশনের আগে লাগবে",
};

describe("buildSosMessage", () => {
  it("includes the essential public fields in Bangla", () => {
    const msg = buildSosMessage(draft, "bn");
    expect(msg).toContain("জরুরি রক্তের প্রয়োজন");
    expect(msg).toContain("B+");
    expect(msg).toContain("রহিম উদ্দিন");
    expect(msg).toContain("সুনামগঞ্জ সদর হাসপাতাল");
    expect(msg).toContain("01626224878");
    expect(msg).toContain("অপারেশনের আগে লাগবে");
    expect(msg).toContain("/request-blood");
  });

  it("includes the essential public fields in English", () => {
    const msg = buildSosMessage(draft, "en");
    expect(msg).toContain("EMERGENCY BLOOD NEEDED");
    expect(msg).toContain("Blood group: B+");
    expect(msg).toContain("Hospital: সুনামগঞ্জ সদর হাসপাতাল");
    expect(msg).toContain("Shantichakra Blood Society Sunamganj");
  });

  it("omits blank optional fields", () => {
    const msg = buildSosMessage(
      { ...draft, extra: "  ", contactPhone: "", neededDate: "" },
      "bn",
    );
    expect(msg).not.toContain("যোগাযোগ:");
    expect(msg).not.toContain("লাগবে:");
    expect(msg).not.toMatch(/অপারেশন/);
  });
});

describe("looksLikeRequestId", () => {
  it("accepts a v4 UUID", () => {
    expect(looksLikeRequestId("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
  });
  it("rejects a name", () => {
    expect(looksLikeRequestId("রহিম")).toBe(false);
    expect(looksLikeRequestId("not-a-uuid")).toBe(false);
  });
});

describe("sanitizePublicSearch", () => {
  it("strips PostgREST filter characters", () => {
    expect(sanitizePublicSearch("রহিম%,hospital.eq.x")).toBe("রহিম hospital eq x");
  });
  it("trims and caps length", () => {
    expect(sanitizePublicSearch("  hello  ")).toBe("hello");
    expect(sanitizePublicSearch("x".repeat(200), 10)).toHaveLength(10);
  });
});

describe("whatsappShareUrl", () => {
  it("encodes the message", () => {
    const url = whatsappShareUrl("B+ রক্ত");
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("B+ রক্ত"));
  });
});
