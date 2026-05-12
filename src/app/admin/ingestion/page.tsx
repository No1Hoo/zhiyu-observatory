import { triggerOfficialIngestion, triggerSampleIngestion } from "@/app/actions/admin";
import { IngestionRunTable } from "@/components/admin/IngestionRunTable";
import { MetricCard } from "@/components/admin/MetricCard";
import { SourceHealthTable } from "@/components/admin/SourceHealthTable";
import { getAdminIngestionDashboard } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminIngestionPage() {
  const data = await getAdminIngestionDashboard();

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Operations</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">采集运行</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-foam/45">触发公开来源采集，查看近期运行、失败来源、重复内容与风险计数。</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <form action={triggerOfficialIngestion}>
            <button className="rounded-full border border-aqua/25 bg-aqua/15 px-5 py-3 text-sm font-bold text-aqua transition hover:bg-aqua/25">
              手动触发官方来源采集
            </button>
          </form>
          <form action={triggerSampleIngestion}>
            <button className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-bold text-foam/72 transition hover:bg-white/[0.1] hover:text-foam">
              样本采集
            </button>
          </form>
        </div>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <MetricCard label="最新状态" value={data.latestRun?.status ?? "never_run"} />
        <MetricCard label="今日运行" value={data.runsToday} />
        <MetricCard label="今日新增" value={data.createdToday} />
        <MetricCard label="今日风险" value={data.risksToday} />
      </div>

      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-foam">Recent Runs</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-foam/35">pipeline history</p>
        </div>
        <div className="overflow-x-auto">
          <IngestionRunTable runs={data.runs} />
        </div>
      </section>

      <section className="mt-9">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-black tracking-[-0.04em] text-foam">Source Health</h2>
          <p className="text-xs uppercase tracking-[0.16em] text-foam/35">source monitor</p>
        </div>
        <div className="overflow-x-auto">
          <SourceHealthTable sources={data.sources} />
        </div>
      </section>
    </div>
  );
}
