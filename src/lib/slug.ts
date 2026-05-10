import { createHash } from "node:crypto";
import pinyin from "pinyin";

// Chinese keyword to readable slug mapping
const CHINESE_SLUG_MAP: Record<string, string> = {
  // Category keywords
  "智能投喂": "smart-feeder",
  "水质监测": "water-monitoring",
  "增氧设备": "aeration",
  "传感器": "sensor",
  "AI识别": "ai-recognition",
  "人工智能": "ai-aquaculture",
  "病害预警": "disease-warning",
  "饲料配方": "feed-formula",
  "虾苗培育": "shrimp-breeding",
  "鱼苗培育": "fish-fry",
  "南美白对虾": "whiteleg-shrimp",
  "草鱼": "grass-carp",
  "鲈鱼": "bass",
  "鳜鱼": "mandarin-fish",
  "小龙虾": "crayfish",
  "石斑鱼": "grouper",
  "价格行情": "price-market",
  "批发价格": "wholesale-price",
  "养殖技术": "aquaculture-tech",
  "循环水养殖": "ras",
  "池塘养殖": "pond-culture",
  "深海养殖": "offshore-aquaculture",
  "出口数据": "export-data",
  "进口数据": "import-data",
  "政策补贴": "policy-subsidy",
  "动保产品": "animal-health",
  "疫苗研发": "vaccine",
  "电商平台": "ecommerce",
  "冷链物流": "cold-chain",
  "可持续养殖": "sustainable-aquaculture",
};

export function createSlug(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "untitled";

  // ASCII: clean and return
  const ascii = trimmed
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (ascii.length > 0) return ascii.slice(0, 80);

  // Chinese: try mapping first, then pinyin fallback
  let slug = trimmed;

  // Replace known keywords
  for (const [cn, en] of Object.entries(CHINESE_SLUG_MAP)) {
    slug = slug.replace(new RegExp(cn, "g"), en + "-");
  }

  // If still has Chinese, use pinyin for remaining characters
  if (/[一-龥]/.test(slug)) {
    // Extract remaining Chinese and convert to pinyin
    const pyResult = pinyin(slug, { style: pinyin.STYLE_NORMAL, heteronym: false });
    slug = pyResult.flat().join("-").replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  }

  // Final cleanup
  slug = slug.toLowerCase().replace(/^-+|-+$/g, "").replace(/-+/g, "-");

  if (slug.length === 0) {
    const digest = createHash("sha1").update(trimmed).digest("hex").slice(0, 8);
    return `item-${digest}`;
  }

  return slug.slice(0, 80);
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) return baseSlug;
  let counter = 1;
  while (existingSlugs.includes(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}