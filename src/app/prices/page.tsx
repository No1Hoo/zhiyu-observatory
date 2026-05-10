import { PriceTicker } from "@/components/public/PriceTicker";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPriceObservations } from "@/lib/queries/public";

export const revalidate = 3600;

export default async function PricesPage() {
  const prices = await getPriceObservations();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">价格观察</h1>
        <p className="mt-3 text-slate-600">只展示公开来源样本数据，标注来源、地区和日期，不代表全市场实时价格。</p>
        <div className="mt-8">
          <PriceTicker prices={prices} />
        </div>
      </section>
    </main>
  );
}
