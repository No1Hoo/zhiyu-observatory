import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { AdSlotBox } from "@/components/public/AdSlotBox";
import { SiteHeader } from "@/components/public/SiteHeader";
import { AI_DISCLOSURE } from "@/lib/constants";
import { formatDate, splitTags } from "@/lib/format";
import { getIntelBySlug } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zhiyu-observatory.example.com";

const CATEGORY_LABELS: Record<string, string> = {
  AI_AQUACULTURE: "AI 识别",
  SMART_EQUIPMENT: "智能投喂",
  FEED_SEEDLING: "饲料苗种",
  ANIMAL_HEALTH: "动物保健",
  PRICE_MARKET: "价格行情",
  ECOMMERCE: "电商渠道",
  OVERSEAS: "海外市场",
  POLICY: "政策动向",
};

function paragraphs(text: string) {
  return text
    .split(/\n{2,}|\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

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
  const bodyParagraphs = paragraphs(item.aiSummary);

  return (
    <main className="min-h-screen text-foam">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <article className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_340px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-6 shadow-[0_30px_110px_rgba(0,0,0,.26)] backdrop-blur-2xl md:p-9">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
          <nav className="relative mb-7 flex flex-wrap items-center gap-2 text-sm text-foam/42">
            <Link href="/" className="transition hover:text-aqua">首页</Link>
            <span>/</span>
            <Link href="/tech" className="transition hover:text-aqua">技术设备</Link>
            <span>/</span>
            <Link href={categoryHref} className="transition hover:text-aqua">{categoryLabel}</Link>
          </nav>

          <div className="relative flex flex-wrap gap-2 text-xs">
            {splitTags(item.tags).map((tag) => (
              <span key={tag} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua">{tag}</span>
            ))}
          </div>
          <h1 className="relative mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] text-foam md:text-6xl">{item.title}</h1>
          <div className="relative mt-5 flex flex-wrap gap-3 text-sm text-foam/45">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{item.source.name}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{formatDate(item.sourcePublishedAt || item.publishedAt)}</span>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua transition hover:bg-aqua/20">
              查看原文 <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {item.editorSummary ? (
            <section className="relative mt-8 rounded-2xl border border-aqua/20 bg-aqua/10 p-5">
              <div className="mb-3 flex items-center gap-2 text-aqua">
                <BookOpenText className="h-4 w-4" />
                <p className="signal-label">Editor Brief</p>
              </div>
              <p className="text-base leading-8 text-foam/72">{item.editorSummary}</p>
            </section>
          ) : null}

          <div className="relative mt-10 border-t border-white/10 pt-8">
            <p className="signal-label">Full Intelligence</p>
            <div className="mt-5 space-y-6 text-base leading-9 text-foam/72">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={`${item.slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
          <p className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-7 text-foam/45">{AI_DISCLOSURE}</p>
        </div>
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <AdSlotBox />
          <aside className="rounded-[1.7rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <p className="signal-label">Source Trust</p>
            <p className="mt-3 text-3xl font-black tracking-[-0.05em] text-aqua">{item.source.trustLevel}/5</p>
            <p className="mt-2 text-sm leading-6 text-foam/48">来源可信等级用于辅助判断，不代表对内容结论背书。</p>
          </aside>
        </div>
      </article>
    </main>
  );
}
