import type { PriceObservation, Source } from "@prisma/client";
import { Activity, TrendingUp } from "lucide-react";
import { formatDate } from "@/lib/format";

export function PriceTicker({ prices }: { prices: Array<PriceObservation & { source: Source }> }) {
  return (
    <section className="premium-card overflow-hidden rounded-[1.7rem] p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="signal-label">Price Watch</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-foam">价格观察</h2>
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-aqua/25 bg-aqua/10">
          <TrendingUp className="h-5 w-5 text-aqua" />
        </div>
      </div>
      <p className="text-sm leading-6 text-foam/50">样本型公开来源观察，不代表全市场实时价格。</p>
      <div className="mt-5 space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-sm transition hover:border-aqua/25 hover:bg-aqua/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-foam">{price.species} · {price.region}</p>
                <p className="mt-1 text-xs text-foam/42">{price.market} · {price.source.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black tracking-[-0.04em] text-aqua">
                  {price.price}
                  {price.unit}
                </p>
                <p className="mt-1 text-xs text-foam/42">{formatDate(price.observedAt)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-foam/35">
              <Activity className="h-3.5 w-3.5 text-aqua" />
              <span>sample observation</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
