import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getStartDateForRange } from "@/app/actions/leaderboard-types";

describe("getStartDateForRange", () => {
  const fixedNow = new Date("2026-06-02T14:30:00.000Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for 'all' (no time filter)", () => {
    expect(getStartDateForRange("all")).toBeNull();
  });

  it("returns start of today for 'today'", () => {
    const result = getStartDateForRange("today");
    expect(result).toBeInstanceOf(Date);
    expect(result!.getHours()).toBe(0);
    expect(result!.getMinutes()).toBe(0);
    expect(result!.getSeconds()).toBe(0);
    expect(result!.getMilliseconds()).toBe(0);
  });

  it("returns 7 days ago for 'week'", () => {
    const result = getStartDateForRange("week")!;
    const expected = new Date(fixedNow.getTime() - 7 * 24 * 60 * 60 * 1000);
    expect(result.getTime()).toBe(expected.getTime());
  });

  it("returns 30 days ago for 'month'", () => {
    const result = getStartDateForRange("month")!;
    const expected = new Date(fixedNow.getTime() - 30 * 24 * 60 * 60 * 1000);
    expect(result.getTime()).toBe(expected.getTime());
  });
});
