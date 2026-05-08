import { notFound } from "next/navigation";
import { AdSlotBox } from "@/components/public/AdSlotBox";
import { SiteHeader } from "@/components/public/SiteHeader";
import { AI_DISCLOSURE } from "@/lib/constants";
import { formatDate, splitTags } from "@/lib/format";
import { getIntelBySlug } from "@/lib/queries/public";

export default async function IntelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getIntelBySlug(slug);
  if (!item) notFound();

  return (
    <main>
      <SiteHeader />
      <article className="mx-auto grid max-w-6xl gap-8 px-5 py-10 lg:grid-cols-[1fr_320px]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
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
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-lagoon">
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
