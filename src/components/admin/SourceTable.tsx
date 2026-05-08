import type { Source } from "@prisma/client";
import { toggleSource } from "@/app/actions/admin";

export function SourceTable({ sources }: { sources: Source[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4">来源</th>
            <th className="p-4">类型</th>
            <th className="p-4">频率</th>
            <th className="p-4">状态</th>
            <th className="p-4">操作</th>
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
              <td className="p-4">{source.crawlFrequency}</td>
              <td className="p-4">
                {source.enabled ? "启用" : "暂停"} · {source.lastStatus}
              </td>
              <td className="p-4">
                <form
                  action={async () => {
                    "use server";
                    await toggleSource(source.id, !source.enabled);
                  }}
                >
                  <button className="rounded-md bg-ink px-3 py-2 text-xs text-white">
                    {source.enabled ? "暂停" : "启用"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
