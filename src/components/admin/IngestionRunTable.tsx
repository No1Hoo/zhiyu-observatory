import type { IngestionRun, Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

type RunWithSource = IngestionRun & { source: Source | null };

const statusLabel: Record<string, string> = {
  running: "运行中",
  success: "成功",
  failed: "失败"
};

export function IngestionRunTable({ runs }: { runs: RunWithSource[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
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
            <tr key={run.id} className="border-t border-slate-100">
              <td className="p-4 text-slate-700">{formatDate(run.startedAt)}</td>
              <td className="p-4 text-slate-700">{run.trigger}</td>
              <td className="p-4 font-medium text-ink">{run.source?.name ?? "未绑定来源"}</td>
              <td className="p-4">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {statusLabel[run.status] ?? run.status}
                </span>
              </td>
              <td className="p-4">{run.itemsSeen}</td>
              <td className="p-4">{run.itemsCreated}</td>
              <td className="p-4">{run.duplicates}</td>
              <td className="p-4">{run.riskCount}</td>
              <td className="max-w-64 p-4 text-xs text-rose-700">{run.errorMessage ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
