import { describe, it, expect } from "vitest";
import { getEligibility, getDonorStatus, isFutureDonationDate, ELIGIBLE_DAYS } from "./donation";

// Freeze "today" to a fixed Dhaka date for deterministic tests.
const NOW = new Date("2026-08-13T00:00:00Z");

describe("getEligibility", () => {
  it("never donated → eligible", () => {
    const r = getEligibility(null, NOW);
    expect(r.eligible).toBe(true);
    expect(r.daysRemaining).toBe(0);
    expect(r.nextEligibleDate).toBeNull();
  });

  it("eligible exactly at 90 days", () => {
    // 90 days before 2026-08-13 is 2026-05-15
    const r = getEligibility("2026-05-15", NOW);
    expect(r.eligible).toBe(true);
    expect(r.daysRemaining).toBe(0);
  });

  it("not eligible right after donation", () => {
    const r = getEligibility("2026-08-01", NOW);
    expect(r.eligible).toBe(false);
    expect(r.daysRemaining).toBeGreaterThan(0);
    // next eligible = 2026-08-01 + 90 days = 2026-10-30
    expect(r.nextEligibleDate).toBe("2026-10-30");
  });

  it("computes next eligible date as lastDonation + 90 days", () => {
    const r = getEligibility("2026-01-01", NOW);
    expect(r.nextEligibleDate).toBe("2026-04-01");
  });

  it("handles month boundaries correctly", () => {
    // 2026-11-30 + 90 days → 2027-02-28
    expect(getEligibility("2026-11-30", NOW).nextEligibleDate).toBe("2027-02-28");
  });
});

describe("getDonorStatus", () => {
  it("unavailable donor is grey regardless of eligibility", () => {
    const s = getDonorStatus(false, null, false);
    expect(s.label).toContain("অনুপস্থিত");
  });
  it("available + eligible → ready", () => {
    const s = getDonorStatus(true, null, false);
    expect(s.label).toContain("প্রস্তুত");
  });
  it("available + not eligible → days remaining", () => {
    const s = getDonorStatus(true, "2026-08-01", false);
    expect(s.label).toContain("দিন পর");
  });
});

describe("isFutureDonationDate", () => {
  it("detects future donation dates", () => {
    expect(isFutureDonationDate("2026-12-31", NOW)).toBe(true);
  });
  it("past/today dates are not future", () => {
    expect(isFutureDonationDate("2026-08-13", NOW)).toBe(false);
    expect(isFutureDonationDate("2026-01-01", NOW)).toBe(false);
  });
  it("null is not future", () => {
    expect(isFutureDonationDate(null, NOW)).toBe(false);
  });
});

describe("ELIGIBLE_DAYS", () => {
  it("is 90", () => {
    expect(ELIGIBLE_DAYS).toBe(90);
  });
});
