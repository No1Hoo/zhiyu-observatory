import type { Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

function statusClass(status: string) {
  if (status === "success") return "border-aqua/25 bg-aqua/10 text-aqua";
  if (status === "failed") return "border-rose-300/25 bg-rose-300/10 text-rose-200";
  return "border-white/10 bg-white/[0.05] text-foam/50";
}

export function SourceHealthTable({ sources }: { sources: Source[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
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
            <tr key={source.id} className="border-t border-white/10 text-foam/62 transition hover:bg-aqua/5">
              <td className="p-4">
                <p className="font-bold text-foam">{source.name}</p>
                <p className="mt-1 max-w-xl truncate text-xs text-foam/38">{source.url}</p>
              </td>
              <td className="p-4">{source.type}</td>
              <td className="p-4">{source.crawlMethod}</td>
              <td className="p-4">{source.enabled ? "启用" : "暂停"}</td>
              <td className="p-4">{source.lastCrawledAt ? formatDate(source.lastCrawledAt) : "尚未采集"}</td>
              <td className="p-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClass(source.lastStatus)}`}>
                  {source.lastStatus}
                </span>
              </td>
              <td className="max-w-80 p-4 text-xs text-rose-200/80">{source.lastError ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
