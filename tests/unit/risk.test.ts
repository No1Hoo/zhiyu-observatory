import { describe, expect, it } from "vitest";
import { assessRisk } from "@/lib/ingestion/risk";

describe("assessRisk", () => {
  it("requires review for price content", () => {
    const risk = assessRisk({ category: "PRICE_MARKET", title: "草鱼价格上涨", summary: "样本行情" });
    expect(risk.requiresReview).toBe(true);
    expect(risk.riskLevel).toBeGreaterThanOrEqual(2);
  });

  it("requires review for disease and drug advice", () => {
    const risk = assessRisk({ category: "ANIMAL_HEALTH", title: "病害防控用药建议", summary: "药品方案" });
    expect(risk.requiresReview).toBe(true);
    expect(risk.reasons).toContain("病害或动保建议");
  });

  it("allows low-risk exhibition news", () => {
    const risk = assessRisk({ category: "OVERSEAS", title: "国际水产展会开幕", summary: "展会资讯" });
    expect(risk.requiresReview).toBe(false);
  });
});
