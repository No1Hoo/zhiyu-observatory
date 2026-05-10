import { SiteHeader } from "@/components/public/SiteHeader";
import { getTopics } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">专题</h1>
        <p className="mt-3 text-slate-600">按专题追踪水产行业热点事件与深度报道。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <a
              key={topic.id}
              href={`/topics/${topic.slug}`}
              className="rounded-lg border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink">{topic.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{topic.description}</p>
                </div>
                {topic.sponsored && (
                  <span className="ml-3 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">赞助</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {topic.tags.split(",").map((tag) => (
                  <span key={tag} className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs text-lagoon">{tag.trim()}</span>
                ))}
              </div>
            </a>
          ))}
        </div>
        {topics.length === 0 && (
          <div className="mt-12 text-center text-slate-400">暂无专题</div>
        )}
      </section>
    </main>
  );
}
