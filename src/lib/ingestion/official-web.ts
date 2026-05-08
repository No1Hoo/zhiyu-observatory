import type { OfficialWebSourceConfig } from "./official-sources";
import type { IncomingRawItem } from "./types";

type ExtractedOfficialItem = Omit<IncomingRawItem, "sourceId">;

function decodeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(text: string): string {
  return decodeHtml(text.replace(/<[^>]*>/g, " "));
}

function isAllowedUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

function matchesKeywords(title: string, config: OfficialWebSourceConfig): boolean {
  if (/\b(contact|about|home|login|search|subscribe|privacy|terms)\b|联系我们|关于|首页|登录|搜索/i.test(title)) {
    return false;
  }
  if (config.includeKeywords.length === 0) return true;
  const lowerTitle = title.toLowerCase();
  return config.includeKeywords.some((keyword) => lowerTitle.includes(keyword.toLowerCase()));
}

export function extractOfficialWebItems(html: string, config: OfficialWebSourceConfig): ExtractedOfficialItem[] {
  const anchorPattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  const seen = new Set<string>();
  const items: ExtractedOfficialItem[] = [];

  for (const match of html.matchAll(anchorPattern)) {
    const rawHref = decodeHtml(match[1] ?? "");
    const title = stripTags(match[2] ?? "");
    if (title.length < 4) continue;

    let url: string;
    try {
      url = new URL(rawHref, config.url).toString();
    } catch {
      continue;
    }

    if (!isAllowedUrl(url)) continue;
    if (seen.has(url)) continue;
    if (!matchesKeywords(title, config)) continue;

    seen.add(url);
    items.push({
      sourceName: config.name,
      title,
      url,
      summary: `${config.name} 公共页面链接：${title}`,
      publishedAt: new Date()
    });

    if (items.length >= config.limit) break;
  }

  return items;
}

export async function collectOfficialWebItems(config: OfficialWebSourceConfig): Promise<ExtractedOfficialItem[]> {
  const response = await fetch(config.url, {
    headers: {
      "user-agent": "ZhiyuObservatory/0.1 (+https://github.com/No1Hoo/zhiyu-observatory)"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${config.name}: ${response.status} ${response.statusText}`);
  }

  return extractOfficialWebItems(await response.text(), config);
}
