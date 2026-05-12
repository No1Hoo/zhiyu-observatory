import { SiteHeader } from "@/components/public/SiteHeader";
import { getTopics } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const topics = await getTopics();

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="signal-label">Special Topics</p>
            <h1 className="mt-2 text-5xl font-black tracking-[-0.065em] text-foam md:text-7xl">专题</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">按专题追踪水产行业热点事件、技术路线与深度报道。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <a key={topic.id} href={`/topics/${topic.slug}`} className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-aqua/35">
              <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-aqua/10 blur-3xl transition group-hover:bg-aqua/20" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.04em] text-foam group-hover:text-aqua">{topic.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-foam/55">{topic.description}</p>
                </div>
                {topic.sponsored && <span className="shrink-0 rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">赞助</span>}
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2">
                {topic.tags.split(",").map((tag) => <span key={tag} className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs text-aqua">{tag.trim()}</span>)}
              </div>
            </a>
          ))}
        </div>
        {topics.length === 0 && <div className="mt-12 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-10 text-center text-foam/35">暂无专题</div>}
      </section>
    </main>
  );
}
