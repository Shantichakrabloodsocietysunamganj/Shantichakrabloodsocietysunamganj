import { describe, it, expect } from "vitest";
import { normalizeBdPhone, toBdE164, toWhatsAppNumber, isValidBdPhone, normalizeBdDigits } from "./phone";

describe("normalizeBdDigits", () => {
  it("converts Bangla digits to ASCII", () => {
    expect(normalizeBdDigits("০১৭১২৩৪৫৬৭৮")).toBe("01712345678");
  });
  it("leaves ASCII digits unchanged", () => {
    expect(normalizeBdDigits("01712345678")).toBe("01712345678");
  });
});

describe("normalizeBdPhone", () => {
  it("normalizes local 017XXXXXXXX", () => {
    expect(normalizeBdPhone("01712345678")).toBe("01712345678");
  });
  it("normalizes +880 format", () => {
    expect(normalizeBdPhone("+8801712345678")).toBe("01712345678");
  });
  it("normalizes 880 format", () => {
    expect(normalizeBdPhone("8801712345678")).toBe("01712345678");
  });
  it("normalizes dashed input", () => {
    expect(normalizeBdPhone("01712-345678")).toBe("01712345678");
  });
  it("normalizes Bangla digit input", () => {
    expect(normalizeBdPhone("০১৭১২৩৪৫৬৭৮")).toBe("01712345678");
  });
  it("normalizes spaced input", () => {
    expect(normalizeBdPhone("0171 234 5678")).toBe("01712345678");
  });
  it("rejects non-BD numbers", () => {
    expect(normalizeBdPhone("12345")).toBeNull();
    expect(normalizeBdPhone("0191234567")).toBeNull(); // 10 digits, not 11
    expect(normalizeBdPhone("abc")).toBeNull();
  });
  it("rejects empty/null", () => {
    expect(normalizeBdPhone("")).toBeNull();
    expect(normalizeBdPhone(null)).toBeNull();
    expect(normalizeBdPhone(undefined)).toBeNull();
  });
});

describe("toBdE164", () => {
  it("converts to +880 E.164", () => {
    expect(toBdE164("01712345678")).toBe("+8801712345678");
  });
  it("handles already-E.164 input", () => {
    expect(toBdE164("+8801712345678")).toBe("+8801712345678");
  });
  it("returns null for invalid", () => {
    expect(toBdE164("nope")).toBeNull();
  });
});

describe("toWhatsAppNumber", () => {
  it("produces 12-digit wa.me number without + or leading 0", () => {
    expect(toWhatsAppNumber("01712345678")).toBe("8801712345678");
  });
  it("handles +880 input", () => {
    expect(toWhatsAppNumber("+8801712345678")).toBe("8801712345678");
  });
  it("returns null for invalid", () => {
    expect(toWhatsAppNumber("bad")).toBeNull();
  });
});

describe("isValidBdPhone", () => {
  it("accepts valid numbers", () => {
    expect(isValidBdPhone("01712345678")).toBe(true);
    expect(isValidBdPhone("+8801612345678")).toBe(true);
  });
  it("rejects invalid", () => {
    expect(isValidBdPhone("")).toBe(false);
    expect(isValidBdPhone("017123")).toBe(false);
  });
});
