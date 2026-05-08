import { describe, expect, it } from "vitest";
import { extractOfficialWebItems } from "@/lib/ingestion/official-web";
import type { OfficialWebSourceConfig } from "@/lib/ingestion/official-sources";

const source: OfficialWebSourceConfig = {
  name: "测试官方来源",
  url: "https://example.com/news/",
  type: "OFFICIAL",
  country: "中国",
  categoryHint: "SMART_EQUIPMENT",
  trustLevel: 5,
  limit: 5,
  includeKeywords: ["水产", "养殖", "价格", "设备"]
};

describe("official web ingestion parser", () => {
  it("extracts matching public links, resolves relative urls, and removes duplicates", () => {
    const html = `
      <main>
        <a href="/news/aquaculture-device.html">智能水产养殖设备更新</a>
        <a href="https://example.com/news/aquaculture-device.html">智能水产养殖设备更新</a>
        <a href="./price.html">南美白对虾价格观察</a>
        <a href="/about">机构介绍</a>
        <a href="javascript:void(0)">水产弹窗</a>
      </main>
    `;

    const items = extractOfficialWebItems(html, source);

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      sourceName: "测试官方来源",
      title: "智能水产养殖设备更新",
      url: "https://example.com/news/aquaculture-device.html"
    });
    expect(items[1]).toMatchObject({
      title: "南美白对虾价格观察",
      url: "https://example.com/news/price.html"
    });
  });

  it("uses a safe fallback when no keyword matches", () => {
    const html = `
      <a href="/market">Market update</a>
      <a href="/research">Research briefing</a>
      <a href="/contact">Contact us</a>
    `;

    const items = extractOfficialWebItems(html, { ...source, includeKeywords: [] });

    expect(items.map((item) => item.title)).toEqual(["Market update", "Research briefing"]);
  });
});
