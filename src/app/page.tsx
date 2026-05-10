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
    <main>
      <SiteHeader />
      <HeroObservatory featured={data.featured} />
      <TrendRadar />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-lagoon">最新入库</p>
              <h2 className="text-2xl font-bold text-ink">每日产业情报</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.latest.map((item) => (
              <IntelCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <PriceTicker prices={data.prices} />
          <AdSlotBox slot={data.adSlots[0]} />
        </div>
      </section>
    </main>
  );
}
