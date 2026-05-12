import { AdSlotBox } from "@/components/public/AdSlotBox";
import { HeroObservatory } from "@/components/public/HeroObservatory";
import { IntelCard } from "@/components/public/IntelCard";
import { PriceTicker } from "@/components/public/PriceTicker";
import { SiteHeader } from "@/components/public/SiteHeader";
import { TrendRadar } from "@/components/public/TrendRadar";
import { getHomeData } from "@/lib/queries/public";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main className="min-h-screen text-foam">
      <SiteHeader />
      <HeroObservatory featured={data.featured} />
      <TrendRadar />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="signal-label">Latest Intelligence</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">每日产业情报</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-foam/45 md:block">
              经过来源标注与审核流处理的行业信息流，适合快速判断方向与变化。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.latest.map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <PriceTicker prices={data.prices} />
          <AdSlotBox slot={data.adSlots[0]} />
        </div>
      </section>
    </main>
  );
}
