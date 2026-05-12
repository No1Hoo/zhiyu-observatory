import { SiteHeader } from "@/components/public/SiteHeader";
import { getSources } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="signal-label">Data Sources</p>
            <h1 className="mt-2 text-5xl font-black tracking-[-0.065em] text-foam md:text-7xl">数据来源</h1>
          </div>
          <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">智渔观察保留每条信息的来源链接、发布时间和 AI 摘要说明。</p>
        </div>
        <div className="overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
              <tr><th className="p-4">来源</th><th className="p-4">类型</th><th className="p-4">地区</th><th className="p-4">可信等级</th></tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-t border-white/10 text-foam/62 transition hover:bg-aqua/5">
                  <td className="p-4 font-bold text-foam"><a href={source.url} target="_blank" rel="noreferrer" className="hover:text-aqua">{source.name}</a></td>
                  <td className="p-4">{source.type}</td>
                  <td className="p-4">{source.country}</td>
                  <td className="p-4"><span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-bold text-aqua">{source.trustLevel}/5</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
