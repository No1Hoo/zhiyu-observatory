import type { Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

export function SourceHealthTable({ sources }: { sources: Source[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4">来源</th>
            <th className="p-4">类型</th>
            <th className="p-4">方法</th>
            <th className="p-4">启用</th>
            <th className="p-4">最近采集</th>
            <th className="p-4">状态</th>
            <th className="p-4">错误</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id} className="border-t border-slate-100">
              <td className="p-4">
                <p className="font-medium text-ink">{source.name}</p>
                <p className="text-xs text-slate-500">{source.url}</p>
              </td>
              <td className="p-4">{source.type}</td>
              <td className="p-4">{source.crawlMethod}</td>
              <td className="p-4">{source.enabled ? "启用" : "暂停"}</td>
              <td className="p-4">{source.lastCrawledAt ? formatDate(source.lastCrawledAt) : "尚未采集"}</td>
              <td className="p-4">{source.lastStatus}</td>
              <td className="max-w-80 p-4 text-xs text-rose-700">{source.lastError ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
