import type { IntelItem, Source } from "@prisma/client";
import { featureIntelItem, publishIntelItem, rejectIntelItem } from "@/app/actions/admin";

type Item = IntelItem & { source: Source };

export function ReviewQueue({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-600">当前没有待审核内容。</div>;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{item.source.name}</span>
            <span>风险 {item.riskLevel}</span>
            <span>{item.category}</span>
          </div>
          <h2 className="mt-3 text-xl font-semibold text-ink">{item.title}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{item.aiSummary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <form
              action={async () => {
                "use server";
                await publishIntelItem(item.id);
              }}
            >
              <button className="rounded-md bg-lagoon px-3 py-2 text-sm text-white">发布</button>
            </form>
            <form
              action={async () => {
                "use server";
                await featureIntelItem(item.id);
              }}
            >
              <button className="rounded-md bg-obsidian px-3 py-2 text-sm text-white">设为首页推荐</button>
            </form>
            <form
              action={async () => {
                "use server";
                await rejectIntelItem(item.id);
              }}
            >
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700">忽略</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}
