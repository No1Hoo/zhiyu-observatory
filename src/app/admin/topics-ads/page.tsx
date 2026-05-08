import { getTopicsAndAds } from "@/lib/queries/admin";

export default async function TopicsAdsPage() {
  const { topics, adSlots } = await getTopicsAndAds();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Topics/Ads</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg bg-white p-5">
          <h2 className="text-xl font-semibold">专题</h2>
          {topics.map((topic) => (
            <p key={topic.id} className="mt-3 text-sm text-slate-600">
              {topic.name}
            </p>
          ))}
        </section>
        <section className="rounded-lg bg-white p-5">
          <h2 className="text-xl font-semibold">广告位</h2>
          {adSlots.map((slot) => (
            <p key={slot.id} className="mt-3 text-sm text-slate-600">
              {slot.name} · {slot.position}
            </p>
          ))}
        </section>
      </div>
    </div>
  );
}
