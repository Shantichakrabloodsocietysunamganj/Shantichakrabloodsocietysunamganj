import { describe, it, expect } from "vitest";
import { searchServices, SERVICES, featuredServices, servicesIn } from "@/data/services";

describe("service catalogue", () => {
  it("has unique ids and hrefs", () => {
    const ids = SERVICES.map((s) => s.id);
    const hrefs = SERVICES.map((s) => s.href);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("marks several featured services including the new tools", () => {
    const ids = featuredServices().map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(["compatibility", "guide", "track", "sos", "match"]));
  });

  it("groups every item into a known category", () => {
    for (const cat of ["emergency", "donor", "tools", "org"] as const) {
      expect(servicesIn(cat).length).toBeGreaterThan(0);
    }
    expect(SERVICES.every((s) => ["emergency", "donor", "tools", "org"].includes(s.category))).toBe(true);
  });
});

describe("searchServices", () => {
  it("returns the full catalogue for an empty query", () => {
    expect(searchServices("").length).toBe(SERVICES.length);
    expect(searchServices("   ").length).toBe(SERVICES.length);
  });

  it("finds SOS by Bangla and English keywords", () => {
    expect(searchServices("sos").map((s) => s.id)).toContain("sos");
    expect(searchServices("শেয়ার").map((s) => s.id)).toContain("sos");
    expect(searchServices("whatsapp").map((s) => s.id)).toContain("sos");
  });

  it("ranks an exact title hit above a keyword hit", () => {
    const results = searchServices("ট্র্যাক");
    expect(results[0]?.id).toBe("track");
  });

  it("requires every token to match", () => {
    expect(searchServices("xyzzy-no-such-service")).toEqual([]);
  });
});
