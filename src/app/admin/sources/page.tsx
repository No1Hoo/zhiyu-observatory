import { SourceTable } from "@/components/admin/SourceTable";
import { getAdminSources } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

export default async function AdminSourcesPage() {
  const sources = await getAdminSources();
  return (
    <div>
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Sources</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">来源网络</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">单独启用、停用和观察每个公开来源，保持情报入口可控。</p>
      </div>
      <SourceTable sources={sources} />
    </div>
  );
}
