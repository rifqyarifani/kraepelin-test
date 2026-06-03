import { describe, it, expect } from "vitest";
import { formatDate, formatPercent } from "@/lib/utils";

describe("formatDate", () => {
  it("formats a valid ISO string into Indonesian date", () => {
    const result = formatDate("2026-06-02T00:00:00.000Z");
    // Indonesian locale: "2 Jun 2026"
    expect(result).toMatch(/2 Jun 2026/);
  });

  it("returns the fallback on invalid input", () => {
    expect(formatDate("not-a-date")).toBe("Tanggal tidak valid");
  });

  it("returns the fallback on empty input", () => {
    expect(formatDate("")).toBe("Tanggal tidak valid");
  });
});

describe("formatPercent", () => {
  it("formats with two fraction digits by default and uses a comma decimal", () => {
    expect(formatPercent(85.5)).toBe("85,50%");
  });

  it("respects custom fraction digits", () => {
    expect(formatPercent(85.555, 1)).toBe("85,6%");
    expect(formatPercent(85, 0)).toBe("85%");
  });
});
