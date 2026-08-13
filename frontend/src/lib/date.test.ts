import { describe, it, expect } from "vitest";
import {
  parseDateOnly,
  addDaysToDateOnly,
  diffDays,
  isPastDateOnly,
  dateToDateOnly,
  fmtDateOnly,
} from "./date";

describe("parseDateOnly", () => {
  it("parses YYYY-MM-DD", () => {
    expect(parseDateOnly("2026-08-13")).toEqual({ y: 2026, m: 8, d: 13 });
  });
  it("parses full ISO timestamp (takes date part)", () => {
    expect(parseDateOnly("2026-08-13T12:00:00Z")).toEqual({ y: 2026, m: 8, d: 13 });
  });
  it("rejects invalid", () => {
    expect(parseDateOnly("13-08-2026")).toBeNull();
    expect(parseDateOnly("")).toBeNull();
    expect(parseDateOnly(null)).toBeNull();
    expect(parseDateOnly("2026-13-99")).toBeNull();
  });
});

describe("addDaysToDateOnly", () => {
  it("adds days across month boundary", () => {
    expect(addDaysToDateOnly("2026-05-15", 90)).toBe("2026-08-13");
  });
  it("adds days across year boundary", () => {
    expect(addDaysToDateOnly("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("diffDays", () => {
  it("computes positive days", () => {
    expect(diffDays("2026-08-13", "2026-08-15")).toBe(2);
  });
  it("computes negative days", () => {
    expect(diffDays("2026-08-15", "2026-08-13")).toBe(-2);
  });
  it("same day is zero", () => {
    expect(diffDays("2026-08-13", "2026-08-13")).toBe(0);
  });
});

describe("isPastDateOnly", () => {
  it("detects past dates", () => {
    expect(isPastDateOnly("2020-01-01", new Date("2026-08-13T00:00:00Z"))).toBe(true);
  });
  it("today is not past", () => {
    expect(isPastDateOnly("2026-08-13", new Date("2026-08-13T00:00:00Z"))).toBe(false);
  });
  it("future is not past", () => {
    expect(isPastDateOnly("2026-08-14", new Date("2026-08-13T00:00:00Z"))).toBe(false);
  });
});

describe("fmtDateOnly", () => {
  it("does not shift a day around the UTC boundary (Bangladesh +6)", () => {
    // 2026-08-13 formatted in en-GB must stay 13 Aug, never 12 Aug.
    expect(fmtDateOnly("2026-08-13", "en-GB", { day: "numeric", month: "short", year: "numeric" })).toContain("13");
  });
});

describe("dateToDateOnly", () => {
  it("formats a Date in Asia/Dhaka", () => {
    // 2026-08-13T00:00:00Z is 06:00 in Dhaka → same calendar date.
    expect(dateToDateOnly(new Date("2026-08-13T00:00:00Z"))).toBe("2026-08-13");
  });
});
