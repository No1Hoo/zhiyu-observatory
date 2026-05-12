import type { IngestionRun, Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

type RunWithSource = IngestionRun & { source: Source | null };

const statusLabel: Record<string, string> = {
  running: "运行中",
  success: "成功",
  failed: "失败"
};

function badge(status: string) {
  if (status === "success") return "border-aqua/25 bg-aqua/10 text-aqua";
  if (status === "failed") return "border-rose-300/25 bg-rose-300/10 text-rose-200";
  return "border-amber-300/25 bg-amber-300/10 text-amber-200";
}

export function IngestionRunTable({ runs }: { runs: RunWithSource[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
          <tr>
            <th className="p-4">开始时间</th>
            <th className="p-4">触发</th>
            <th className="p-4">来源</th>
            <th className="p-4">状态</th>
            <th className="p-4">Seen</th>
            <th className="p-4">Created</th>
            <th className="p-4">Duplicate</th>
            <th className="p-4">Risk</th>
            <th className="p-4">错误</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id} className="border-t border-white/10 text-foam/62 transition hover:bg-aqua/5">
              <td className="p-4">{formatDate(run.startedAt)}</td>
              <td className="p-4">{run.trigger}</td>
              <td className="p-4 font-bold text-foam">{run.source?.name ?? "未绑定来源"}</td>
              <td className="p-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-bold ${badge(run.status)}`}>
                  {statusLabel[run.status] ?? run.status}
                </span>
              </td>
              <td className="p-4">{run.itemsSeen}</td>
              <td className="p-4 text-aqua">{run.itemsCreated}</td>
              <td className="p-4">{run.duplicates}</td>
              <td className="p-4 text-amber-200">{run.riskCount}</td>
              <td className="max-w-64 p-4 text-xs text-rose-200/80">{run.errorMessage ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
