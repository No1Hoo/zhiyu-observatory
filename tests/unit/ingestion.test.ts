import { describe, expect, it } from "vitest";
import { classifyItem } from "@/lib/ingestion/classify";
import { fingerprintRawItem } from "@/lib/ingestion/dedupe";

describe("ingestion helpers", () => {
  it("classifies smart equipment content", () => {
    const result = classifyItem("智能投喂设备在对虾养殖中应用", "水质监测与投喂联动");
    expect(result.category).toBe("SMART_EQUIPMENT");
    expect(result.tags).toContain("智能投喂");
  });

  it("classifies price content", () => {
    const result = classifyItem("南美白对虾价格上涨", "华南市场价格异动");
    expect(result.category).toBe("PRICE_MARKET");
    expect(result.tags).toContain("价格");
  });

  it("creates same fingerprint for equivalent source/title/url", () => {
    const one = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    const two = fingerprintRawItem("source-a", "Title", "https://example.com/a");
    expect(one).toBe(two);
  });
});
