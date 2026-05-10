import Parser from "rss-parser";
import type { IncomingRawItem } from "./types";

type ExtractedRssItem = Omit<IncomingRawItem, "sourceId">;

const parser = new Parser({
  headers: {
    "User-Agent": "ZhiyuObservatory/0.1 (+https://github.com/No1Hoo/zhiyu-observatory)"
  },
  timeout: 15000,
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: false }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: false }],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function parseDate(input: string | undefined): Date {
  if (!input) return new Date();
  const d = new Date(input);
  return isNaN(d.getTime()) ? new Date() : d;
}

function extractSummary(
  item: Parser.Item & { contentEncoded?: string }
): string {
  // Prefer explicit description / summary
  if (item.contentSnippet) return item.contentSnippet.slice(0, 300);
  if (item.contentEncoded) {
    // Strip HTML tags from content:encoded
    const text = item.contentEncoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.slice(0, 300);
  }
  if (item.summary) return item.summary.slice(0, 300);
  return "";
}

export type RssSourceConfig = {
  name: string;
  url: string;         // RSS feed URL
  link?: string;       // Website URL (for resolving relative links)
  limit: number;
};

export async function collectRssItems(config: RssSourceConfig): Promise<ExtractedRssItem[]> {
  const feed = await parser.parseURL(config.url);
  const items: ExtractedRssItem[] = [];

  for (const item of feed.items) {
    if (items.length >= config.limit) break;

    const title = (item.title || "").trim();
    if (title.length < 4) continue;

    // Resolve URL: prefer item.link, fall back to constructing from guid
    let url = (item.link || item.guid || "").trim();
    if (!url) continue;

    // Resolve relative URLs against the website base
    try {
      if (url.startsWith("/")) {
        const base = config.link || new URL(config.url).origin;
        url = new URL(url, base).toString();
      } else if (!/^https?:\/\//i.test(url)) {
        const base = config.link || new URL(config.url).origin;
        url = new URL(url, base).toString();
      }
    } catch {
      continue;
    }

    items.push({
      sourceName: config.name,
      title,
      url,
      summary: extractSummary(item as Parameters<typeof extractSummary>[0]),
      publishedAt: parseDate(item.isoDate || item.pubDate),
    });
  }

  return items;
}