import { triggerSampleIngestion } from "@/app/actions/admin";
import { IngestionRunTable } from "@/components/admin/IngestionRunTable";
import { MetricCard } from "@/components/admin/MetricCard";
import { SourceHealthTable } from "@/components/admin/SourceHealthTable";
import { getAdminIngestionDashboard } from "@/lib/queries/admin";

export default async function AdminIngestionPage() {
  const data = await getAdminIngestionDashboard();

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-700">Operations</p>
          <h1 className="text-3xl font-bold text-ink">Ingestion</h1>
        </div>
        <form action={triggerSampleIngestion}>
          <button className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-lagoon">
            手动触发样本采集
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="最新状态" value={data.latestRun?.status ?? "never_run"} />
        <MetricCard label="今日运行" value={data.runsToday} />
        <MetricCard label="今日新增" value={data.createdToday} />
        <MetricCard label="今日风险" value={data.risksToday} />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-ink">Recent Runs</h2>
        <div className="mt-3 overflow-x-auto">
          <IngestionRunTable runs={data.runs} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-ink">Source Health</h2>
        <div className="mt-3 overflow-x-auto">
          <SourceHealthTable sources={data.sources} />
        </div>
      </section>
    </div>
  );
}
