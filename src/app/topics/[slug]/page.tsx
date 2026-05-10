import { notFound } from "next/navigation";
import { Metadata } from "next";
import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getTopicBySlug, getIntelByTag } from "@/lib/queries/public";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) return { title: "专题未找到" };
  return {
    title: topic.name,
    description: topic.description,
  };
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = await getTopicBySlug(slug);
  if (!topic) notFound();

  const tags = topic.tags.split(",").map((t) => t.trim());
  const allItems = await Promise.all(
    tags.map((tag) => getIntelByTag(tag))
  );

  const dedup = new Map<string, (typeof allItems)[number][number]>();
  for (const items of allItems) {
    for (const item of items) {
      dedup.set(item.id, item);
    }
  }
  const items = Array.from(dedup.values());

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="mb-6 border-b border-slate-100 pb-6">
          <nav className="mb-4 text-sm text-slate-500">
            <a href="/topics" className="hover:text-lagoon">专题</a>
            <span> / </span>
            <span>{topic.name}</span>
          </nav>
          <h1 className="text-3xl font-bold text-ink">{topic.name}</h1>
          <p className="mt-3 text-slate-600">{topic.description}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-lagoon">{tag}</span>
            ))}
            {topic.sponsored && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">赞助专题</span>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-12 text-center text-slate-400">该专题暂无内容</div>
        )}
      </section>
    </main>
  );
}