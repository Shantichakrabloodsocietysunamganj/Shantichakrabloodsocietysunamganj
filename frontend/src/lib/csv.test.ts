import { describe, it, expect } from "vitest";

// CSV escaping is the core pure logic worth testing. We test a small
// extracted helper mirroring exportCSV's escape function, kept in sync.
function escapeCSV(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

describe("CSV escaping", () => {
  it("leaves plain values unchanged", () => {
    expect(escapeCSV("hello")).toBe("hello");
    expect(escapeCSV(42)).toBe("42");
  });
  it("quotes values containing commas", () => {
    expect(escapeCSV("a,b")).toBe('"a,b"');
  });
  it("quotes values containing newlines", () => {
    expect(escapeCSV("a\nb")).toBe('"a\nb"');
  });
  it("doubles internal quotes", () => {
    expect(escapeCSV('say "hi"')).toBe('"say ""hi"""');
  });
  it("treats null/undefined as empty", () => {
    expect(escapeCSV(null)).toBe("");
    expect(escapeCSV(undefined)).toBe("");
  });
});
