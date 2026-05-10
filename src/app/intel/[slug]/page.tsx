import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { AdSlotBox } from "@/components/public/AdSlotBox";
import { SiteHeader } from "@/components/public/SiteHeader";
import { AI_DISCLOSURE } from "@/lib/constants";
import { formatDate, splitTags } from "@/lib/format";
import { getIntelBySlug } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zhiyu-observatory.example.com";

const CATEGORY_LABELS: Record<string, string> = {
  AI_AQUACULTURE:  "AI 识别",
  SMART_EQUIPMENT: "智能投喂",
  FEED_SEEDLING:   "饲料苗种",
  ANIMAL_HEALTH:   "动物保健",
  PRICE_MARKET:    "价格行情",
  ECOMMERCE:       "电商渠道",
  OVERSEAS:        "海外市场",
  POLICY:          "政策动向",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getIntelBySlug(slug);
  if (!item) return { title: "未找到" };
  return {
    title: item.title,
    description: item.editorSummary || item.aiSummary,
    openGraph: {
      title: item.title,
      description: item.editorSummary || item.aiSummary,
      type: "article",
      publishedTime: (item.sourcePublishedAt || item.publishedAt)?.toISOString(),
      authors: [item.source.name],
      images: [{ url: `${BASE_URL}/og-default.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function IntelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getIntelBySlug(slug);
  if (!item) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.editorSummary || item.aiSummary,
    author: { "@type": "Organization", name: item.source.name },
    publisher: { "@type": "Organization", name: "智渔观察", url: BASE_URL },
    datePublished: (item.sourcePublishedAt || item.publishedAt)?.toISOString(),
    dateModified: item.updatedAt.toISOString(),
    url: `${BASE_URL}/intel/${slug}`,
  };

  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;
  const categoryHref = `/tech?category=${item.category}`;

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <article className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Breadcrumb */}
          <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
            <Link href="/" className="hover:text-lagoon">首页</Link>
            <span>/</span>
            <Link href="/tech" className="hover:text-lagoon">技术设备</Link>
            <span>/</span>
            <Link href={categoryHref} className="hover:text-lagoon">{categoryLabel}</Link>
          </nav>

          <div className="flex flex-wrap gap-2 text-xs">
            {splitTags(item.tags).map((tag) => (
              <span key={tag} className="rounded-full bg-cyan-50 px-2 py-1 text-lagoon">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight text-ink">{item.title}</h1>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
            <span>{item.source.name}</span>
            <span>{formatDate(item.sourcePublishedAt || item.publishedAt)}</span>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-lagoon hover:underline">
              查看原文
            </a>
          </div>
          <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">
            {item.editorSummary || item.aiSummary}
          </div>
          <p className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">{AI_DISCLOSURE}</p>
        </div>
        <AdSlotBox />
      </article>
    </main>
  );
}
