import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/public/SiteHeader";
import { AI_DISCLOSURE } from "@/lib/constants";
import { formatDate, splitTags } from "@/lib/format";
import { getIntelBySlug } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

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

function getParagraphs(text?: string | null) {
  return (text || "暂无正文内容。")
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
      publishedTime: (item.sourcePublishedAt || item.publishedAt || item.createdAt)?.toISOString(),
      authors: [item.source.name],
    },
  };
}

export default async function IntelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getIntelBySlug(slug);
  if (!item) notFound();

  const publishedDate = item.sourcePublishedAt || item.publishedAt || item.createdAt;
  const bodyParagraphs = getParagraphs(item.aiSummary || item.editorSummary);
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <article className="mx-auto grid max-w-7xl gap-8 px-5 py-12 lg:grid-cols-[1fr_340px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-6 shadow-[0_30px_110px_rgba(0,0,0,.26)] backdrop-blur-2xl md:p-9">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-aqua/10 blur-3xl" />
          <nav className="relative mb-7 flex flex-wrap items-center gap-2 text-sm text-foam/42">
            <Link href="/" className="transition hover:text-aqua">首页</Link>
            <span>/</span>
            <Link href="/tech" className="transition hover:text-aqua">技术设备</Link>
            <span>/</span>
            <Link href={`/tech?category=${item.category}`} className="transition hover:text-aqua">{categoryLabel}</Link>
          </nav>

          <div className="relative flex flex-wrap gap-2 text-xs">
            {splitTags(item.tags).map((tag) => (
              <span key={tag} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua">{tag}</span>
            ))}
          </div>
          <h1 className="relative mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.055em] text-foam md:text-6xl">{item.title}</h1>
          <div className="relative mt-5 flex flex-wrap gap-3 text-sm text-foam/45">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{item.source.name}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{formatDate(publishedDate)}</span>
            <a href={item.sourceUrl || "#"} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua transition hover:bg-aqua/20">
              查看原文 <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {item.editorSummary ? (
            <section className="relative mt-8 rounded-2xl border border-aqua/20 bg-aqua/10 p-5">
              <p className="signal-label">Editor Brief</p>
              <p className="mt-3 text-base leading-8 text-foam/72">{item.editorSummary}</p>
            </section>
          ) : null}

          <section className="relative mt-10 border-t border-white/10 pt-8">
            <p className="signal-label">Full Intelligence</p>
            <div className="mt-5 space-y-6 text-base leading-9 text-foam/72">
              {bodyParagraphs.map((paragraph, index) => (
                <p key={`${slug}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </section>

          <p className="relative mt-8 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm leading-7 text-foam/45">{AI_DISCLOSURE}</p>
        </div>
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <aside className="rounded-[1.7rem] border border-dashed border-aqua/30 bg-aqua/10 p-5 backdrop-blur-xl">
            <p className="signal-label">产业合作</p>
            <h3 className="mt-2 text-2xl font-black tracking-[-0.04em] text-foam">合作位预留</h3>
            <p className="mt-3 text-sm leading-7 text-foam/58">设备、饲料、苗种、动保企业可联系合作。</p>
          </aside>
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
