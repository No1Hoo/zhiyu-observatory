import { SiteHeader } from "@/components/public/SiteHeader";

export default function AdvertisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-sm font-semibold text-lagoon">广告合作</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">面向水产设备、饲料、苗种、动保企业的行业曝光</h1>
        <p className="mt-4 leading-7 text-slate-600">
          智渔观察第一阶段以公益信息和行业情报为主，预留专题赞助、供应商推荐卡、品牌广告位和采购咨询线索入口。
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {["专题赞助", "供应商推荐", "采购/咨询线索", "品牌广告位"].map((item) => (
            <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-ink">{item}</h2>
              <p className="mt-2 text-sm text-slate-600">当前为预留合作形式，后续根据流量数据开放。</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
