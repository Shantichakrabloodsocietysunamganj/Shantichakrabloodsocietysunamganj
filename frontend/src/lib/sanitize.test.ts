import { describe, it, expect } from "vitest";
import { maskName, toPublicRequest, hasNoSensitiveRequestFields } from "./sanitize";
import type { BloodRequest } from "./types";

describe("maskName", () => {
  it("masks a multi-word Bangla name", () => {
    expect(maskName("আবু সালেহ")).toBe("আবু স.");
  });
  it("masks a multi-word English name", () => {
    expect(maskName("Rahat Ahmed")).toBe("Rahat A.");
  });
  it("keeps single-word names", () => {
    expect(maskName("রহিম")).toBe("রহিম");
  });
  it("handles empty/null", () => {
    expect(maskName("")).toBe("");
    expect(maskName(null)).toBe("");
    expect(maskName(undefined)).toBe("");
  });
});

describe("toPublicRequest", () => {
  const full: BloodRequest = {
    id: "id-1",
    patient_name: "রোগী নাম",
    blood_group: "A+",
    units_needed: 2,
    hospital: "হাসপাতাল",
    district: "সুনামগঞ্জ",
    upazila: "সুনামগঞ্জ সদর",
    needed_date: "2026-08-20",
    contact_name: "যোগাযোগ",
    contact_phone: "01712345678",
    message: "জরুরি",
    hemoglobin: "7.5",
    patient_age: 30,
    patient_gender: "পুরুষ",
    disease: "থ্যালাসেমিয়া",
    blood_component: "whole_blood",
    status: "approved",
    created_at: "2026-08-13T00:00:00Z",
  };

  it("strips all sensitive fields", () => {
    const pub = toPublicRequest(full);
    expect(pub).not.toHaveProperty("contact_phone");
    expect(pub).not.toHaveProperty("hemoglobin");
    expect(pub).not.toHaveProperty("disease");
    expect(pub).not.toHaveProperty("patient_age");
    expect(pub).not.toHaveProperty("patient_gender");
    expect(pub).not.toHaveProperty("requested_by");
  });

  it("keeps public fields", () => {
    const pub = toPublicRequest(full);
    expect(pub.id).toBe("id-1");
    expect(pub.blood_group).toBe("A+");
    expect(pub.upazila).toBe("সুনামগঞ্জ সদর");
  });
});

describe("hasNoSensitiveRequestFields", () => {
  it("returns true for clean objects", () => {
    expect(hasNoSensitiveRequestFields({ id: "x", blood_group: "A+" })).toBe(true);
  });
  it("returns false when contact_phone present", () => {
    expect(hasNoSensitiveRequestFields({ contact_phone: "017" })).toBe(false);
  });
  it("returns false when disease present", () => {
    expect(hasNoSensitiveRequestFields({ disease: "x" })).toBe(false);
  });
  it("returns true for non-objects", () => {
    expect(hasNoSensitiveRequestFields(null)).toBe(true);
    expect(hasNoSensitiveRequestFields(undefined)).toBe(true);
    expect(hasNoSensitiveRequestFields("str")).toBe(true);
  });
});
