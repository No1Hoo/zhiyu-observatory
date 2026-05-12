import type { IntelItem, Source } from "@prisma/client";
import { featureIntelItem, publishIntelItem, rejectIntelItem } from "@/app/actions/admin";

type Item = IntelItem & { source: Source };

export function ReviewQueue({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-8 text-foam/55 backdrop-blur-xl">
        当前没有待审核内容。内容管线处于清洁状态。
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.id} className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-6 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
          <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-aqua/10 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-2 text-xs text-foam/45">
            <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-aqua">{item.source.name}</span>
            <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-amber-100">风险 {item.riskLevel}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">{item.category}</span>
          </div>
          <h2 className="relative mt-4 text-2xl font-black leading-tight tracking-[-0.04em] text-foam">{item.title}</h2>
          <p className="relative mt-4 whitespace-pre-line text-sm leading-7 text-foam/58">{item.aiSummary}</p>
          <div className="relative mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
            <form action={async () => { await publishIntelItem(item.id); }}>
              <button className="rounded-full border border-aqua/25 bg-aqua/15 px-4 py-2 text-sm font-bold text-aqua transition hover:bg-aqua/25">发布</button>
            </form>
            <form action={async () => { await featureIntelItem(item.id); }}>
              <button className="rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-bold text-foam/72 transition hover:bg-white/[0.12] hover:text-foam">首页推荐</button>
            </form>
            <form action={async () => { await rejectIntelItem(item.id); }}>
              <button className="rounded-full border border-rose-300/20 bg-rose-300/10 px-4 py-2 text-sm font-bold text-rose-100 transition hover:bg-rose-300/15">忽略</button>
            </form>
          </div>
        </article>
      ))}
    </div>
  );
}