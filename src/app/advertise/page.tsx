import { SiteHeader } from "@/components/public/SiteHeader";
import AdvertiseClient from "./AdvertiseClient";

export default function AdvertisePage() {
  return (
    <main>
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-5 py-10">
        <p className="text-sm font-semibold text-lagoon">广告合作</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">面向水产设备、饲料、苗种、动保企业的行业曝光</h1>
        <p className="mt-4 leading-7 text-slate-600">
          智渔观察以行业情报为核心，为水产行业供应商提供精准对接目标读者的机会。
        </p>
        <AdvertiseClient />
      </section>
    </main>
  );
}