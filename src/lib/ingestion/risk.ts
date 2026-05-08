import type { IntelCategory, RiskResult } from "./types";

type RiskInput = {
  category: IntelCategory;
  title: string;
  summary: string;
};

export function assessRisk(input: RiskInput): RiskResult {
  const reasons: string[] = [];
  let riskLevel = 1;
  const text = `${input.title} ${input.summary}`;

  if (input.category === "PRICE_MARKET") {
    riskLevel = Math.max(riskLevel, 2);
    reasons.push("价格行情");
  }

  if (input.category === "ANIMAL_HEALTH" || /病害|动保|药|用药|防控/.test(text)) {
    riskLevel = Math.max(riskLevel, 3);
    reasons.push("病害或动保建议");
  }

  if (/推荐|采购|代理|招商|独家/.test(text)) {
    riskLevel = Math.max(riskLevel, 2);
    reasons.push("商业倾向");
  }

  return {
    riskLevel,
    requiresReview: riskLevel >= 2,
    reasons
  };
}
