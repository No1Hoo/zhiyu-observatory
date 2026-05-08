import type { PriceObservation, Source } from "@prisma/client";
import { formatDate } from "@/lib/format";

export function PriceTicker({ prices }: { prices: Array<PriceObservation & { source: Source }> }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-ink">价格观察</h2>
      <p className="mt-2 text-sm text-slate-500">样本型公开来源观察，不代表全市场实时价格。</p>
      <div className="mt-4 space-y-3">
        {prices.map((price) => (
          <div key={price.id} className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
            <div>
              <p className="font-medium text-ink">
                {price.species} · {price.region}
              </p>
              <p className="text-slate-500">
                {price.market} · {price.source.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-lagoon">
                {price.price}
                {price.unit}
              </p>
              <p className="text-xs text-slate-500">{formatDate(price.observedAt)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
