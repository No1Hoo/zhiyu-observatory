import { MetricCard } from "@/components/admin/MetricCard";
import { getAdminDashboard } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboard();

  return (
    <div>
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Dashboard</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">情报运行总览</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">
          监控采集、审核、发布与来源健康状态，快速判断当前内容管线是否稳定。
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="今日抓取" value={data.rawToday} />
        <MetricCard label="待审核" value={data.pending} />
        <MetricCard label="已发布" value={data.published} />
        <MetricCard label="失败来源" value={data.failedSources} />
      </div>
      <section className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-aqua">Operations Note</p>
        <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-foam">从采集到发布的闭环</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-foam/55">
          智渔观察后台围绕公开来源、采集运行、审核队列、内容发布、专题和合作意向进行组织。建议先看失败来源和待审核数量，再进入 Review Queue 处理内容。
        </p>
      </section>
    </div>
  );
}
