import { IntelCard } from "@/components/public/IntelCard";
import { SiteHeader } from "@/components/public/SiteHeader";
import { getPublishedIntelByCategory } from "@/lib/queries/public";

export default async function TodayPage() {
  const items = await getPublishedIntelByCategory();

  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="text-3xl font-bold text-ink">今日情报</h1>
        <p className="mt-3 text-slate-600">每天精选技术设备、AI 水产、饲料苗种、价格与海外动态。</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <IntelCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
