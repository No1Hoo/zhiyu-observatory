import { SiteHeader } from "@/components/public/SiteHeader";
import { getSources } from "@/lib/queries/public";

export const revalidate = 3600;

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">数据来源</h1>
        <p className="mt-3 text-slate-600">智渔观察保留每条信息的来源链接、发布时间和 AI 摘要说明。</p>
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4">来源</th>
                <th className="p-4">类型</th>
                <th className="p-4">地区</th>
                <th className="p-4">可信等级</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-t border-slate-100">
                  <td className="p-4 font-medium text-ink">
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.name}
                    </a>
                  </td>
                  <td className="p-4">{source.type}</td>
                  <td className="p-4">{source.country}</td>
                  <td className="p-4">{source.trustLevel}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
