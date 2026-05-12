import { PriceTicker } from "@/components/public/PriceTicker";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPriceObservations } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function PricesPage() {
  const prices = await getPriceObservations();

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.035] p-7 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
          <p className="signal-label">Market Watch</p>
          <h1 className="mt-2 text-5xl font-black tracking-[-0.065em] text-foam md:text-7xl">价格观察</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-foam/50">只展示公开来源样本数据，标注来源、地区和日期，不代表全市场实时价格。</p>
        </div>
        <PriceTicker prices={prices} />
      </section>
    </main>
  );
}
