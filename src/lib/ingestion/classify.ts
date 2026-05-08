import type { ClassificationResult, IntelCategory } from "./types";

const keywordMap: Array<{ category: IntelCategory; tags: string[]; keywords: string[] }> = [
  {
    category: "SMART_EQUIPMENT",
    tags: ["智能设备"],
    keywords: ["智能投喂", "水质监测", "增氧", "设备", "传感器"]
  },
  {
    category: "AI_AQUACULTURE",
    tags: ["AI"],
    keywords: ["AI", "人工智能", "识别", "模型", "算法"]
  },
  {
    category: "FEED_SEEDLING",
    tags: ["饲料苗种"],
    keywords: ["饲料", "苗种", "虾苗", "鱼苗"]
  },
  {
    category: "ANIMAL_HEALTH",
    tags: ["动保"],
    keywords: ["病害", "动保", "药", "防控"]
  },
  {
    category: "PRICE_MARKET",
    tags: ["价格"],
    keywords: ["价格", "行情", "涨", "跌", "批发"]
  },
  {
    category: "ECOMMERCE",
    tags: ["电商"],
    keywords: ["电商", "热销", "平台", "采购"]
  },
  {
    category: "POLICY",
    tags: ["政策"],
    keywords: ["政策", "通知", "标准", "监管"]
  }
];

export function classifyItem(title: string, summary = ""): ClassificationResult {
  const text = `${title} ${summary}`;
  const found = keywordMap.find((entry) => entry.keywords.some((keyword) => text.includes(keyword)));

  if (!found) {
    return { category: "OVERSEAS", tags: ["行业动态"] };
  }

  const species = ["南美白对虾", "草鱼", "鲈鱼", "鳜鱼", "小龙虾"].find((item) => text.includes(item));
  const equipment = ["智能投喂", "水质监测", "增氧"].find((item) => text.includes(item));
  const region = ["华南", "华东", "华北", "中国", "欧盟"].find((item) => text.includes(item));

  return {
    category: found.category,
    tags: [...found.tags, ...found.keywords.filter((keyword) => text.includes(keyword)).slice(0, 3)],
    species,
    equipment,
    region
  };
}
