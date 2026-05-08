import type { IntelCategory } from "./types";

export type OfficialWebSourceConfig = {
  name: string;
  url: string;
  type: string;
  country: string;
  categoryHint: IntelCategory;
  trustLevel: number;
  limit: number;
  includeKeywords: string[];
};

export const officialWebSources: OfficialWebSourceConfig[] = [
  {
    name: "FAO GLOBEFISH",
    url: "https://www.fao.org/in-action/globefish/en",
    type: "OFFICIAL",
    country: "Global",
    categoryHint: "OVERSEAS",
    trustLevel: 5,
    limit: 12,
    includeKeywords: ["fish", "seafood", "aquaculture", "market", "price", "trade", "shrimp", "salmon", "tuna"]
  },
  {
    name: "EUMOFA",
    url: "https://eumofa.eu/",
    type: "OFFICIAL",
    country: "EU",
    categoryHint: "PRICE_MARKET",
    trustLevel: 5,
    limit: 12,
    includeKeywords: ["fish", "seafood", "aquaculture", "market", "price", "trade", "data"]
  },
  {
    name: "农业农村部数据",
    url: "https://data.moa.gov.cn/",
    type: "OFFICIAL",
    country: "中国",
    categoryHint: "PRICE_MARKET",
    trustLevel: 5,
    limit: 12,
    includeKeywords: ["水产", "价格", "批发", "市场", "指数", "农产品"]
  },
  {
    name: "中国水产科学研究院",
    url: "https://www.cafs.ac.cn/",
    type: "OFFICIAL",
    country: "中国",
    categoryHint: "SMART_EQUIPMENT",
    trustLevel: 5,
    limit: 12,
    includeKeywords: ["水产", "养殖", "技术", "科研", "病害", "苗种", "装备", "智能"]
  }
];
