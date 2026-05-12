import type { Source } from "@prisma/client";
import { toggleSource } from "@/app/actions/admin";

function statusClass(enabled: boolean) {
  return enabled ? "border-aqua/25 bg-aqua/10 text-aqua" : "border-white/10 bg-white/[0.05] text-foam/45";
}

export function SourceTable({ sources }: { sources: Source[] }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
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
            <tr key={source.id} className="border-t border-white/10 transition hover:bg-aqua/5">
              <td className="p-4">
                <p className="font-bold text-foam">{source.name}</p>
                <p className="mt-1 max-w-xl truncate text-xs text-foam/38">{source.url}</p>
              </td>
              <td className="p-4 text-foam/62">{source.type}</td>
              <td className="p-4 text-foam/62">{source.crawlFrequency}</td>
              <td className="p-4">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusClass(source.enabled)}`}>
                  {source.enabled ? "启用" : "暂停"} · {source.lastStatus}
                </span>
              </td>
              <td className="p-4">
                <form
                  action={async () => {
                    "use server";
                    await toggleSource(source.id, !source.enabled);
                  }}
                >
                  <button className="rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-xs font-bold text-aqua transition hover:bg-aqua/20">
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
