import { describe, it, expect } from "vitest";
import { computeModel, type MoveId } from "@/lib/model";

/**
 * Unit tests reproducing the exact benchmark scenarios and results
 * from Section 8 of "The Sunday Table: Final Plan, Formulas and Build Spec".
 */
describe("Section 8: Scenarios and results benchmarks", () => {
  it("P0: Do nothing (none)", () => {
    const res = computeModel([]);
    expect(res.cashForPlant).toBe(50.0);
    expect(res.plantGap).toBe(-10.0); // -10.00 (spare)
    expect(res.propertyShare).toBe(60.0);
    expect(res.fairnessGap).toBe(0);
  });

  it("P1: Mr. Mehta's plan (M1 buy)", () => {
    const res = computeModel(["buy"]);
    expect(res.cashForPlant).toBe(33.95);
    expect(res.plantGap).toBe(6.05); // 6.05 short
    expect(res.propertyShare).toBe(67.9);
    expect(res.fairnessGap).toBe(15.0);
  });

  it("P2: Buy it, fund it (M1 + M4: buy + sell Alibaug)", () => {
    const res = computeModel(["buy", "alibaug"]);
    expect(res.cashForPlant).toBe(41.15);
    expect(res.plantGap).toBe(-1.15); // -1.15 (barely clears)
    expect(res.propertyShare).toBe(64.1);
    expect(res.fairnessGap).toBe(15.0);
  });

  it("P3: Fair buy (M1 + M4 + M6: buy + sell Alibaug + equalise Riya)", () => {
    const res = computeModel(["buy", "alibaug", "equal"]);
    expect(res.cashForPlant).toBe(26.15);
    expect(res.plantGap).toBe(13.85); // 13.85 short
    expect(res.propertyShare).toBe(64.1);
    expect(res.fairnessGap).toBe(0);
  });

  it("P4: Rent first (M2 + M4: rent + sell Alibaug)", () => {
    const res = computeModel(["rent", "alibaug"]);
    expect(res.cashForPlant).toBe(56.45);
    expect(res.plantGap).toBe(-16.45); // -16.45 (spare)
    expect(res.propertyShare).toBe(56.4);
    expect(res.fairnessGap).toBe(1.88);
  });

  it("P5: Housing fund hypothesis (M2 + M3 + M4 + M6)", () => {
    const res = computeModel(["rent", "fund", "alibaug", "equal"]);
    expect(res.cashForPlant).toBe(34.58);
    expect(res.plantGap).toBe(5.42); // 5.42 short
    expect(res.propertyShare).toBe(56.4);
    expect(res.fairnessGap).toBe(0);
  });

  it("P6: Big lever (M2 + M3 + M5 + M6: rent + fund + sell BKC + equalise)", () => {
    const res = computeModel(["rent", "fund", "bkc", "equal"]);
    expect(res.cashForPlant).toBe(68.64);
    expect(res.plantGap).toBe(-28.64); // -28.64 (spare)
    expect(res.propertyShare).toBe(37.7);
    expect(res.fairnessGap).toBe(0);
  });
});
