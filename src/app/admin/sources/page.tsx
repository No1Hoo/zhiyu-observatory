import { SourceTable } from "@/components/admin/SourceTable";
import { getAdminSources } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await getAdminSources();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Sources</h1>
      <p className="mt-2 text-slate-600">单独启用、停用和观察每个来源。</p>
      <div className="mt-6">
        <SourceTable sources={sources} />
      </div>
    </div>
  );
}
