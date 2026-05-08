import { MetricCard } from "@/components/admin/MetricCard";
import { getAdminDashboard } from "@/lib/queries/admin";

export default async function AdminPage() {
  const data = await getAdminDashboard();

  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="今日抓取" value={data.rawToday} />
        <MetricCard label="待审核" value={data.pending} />
        <MetricCard label="已发布" value={data.published} />
        <MetricCard label="失败来源" value={data.failedSources} />
      </div>
    </div>
  );
}
