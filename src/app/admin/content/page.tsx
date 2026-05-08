import { getAdminContent } from "@/lib/queries/admin";

export default async function AdminContentPage() {
  const items = await getAdminContent();
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">Content</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {items.map((item) => (
          <div key={item.id} className="border-t border-slate-100 p-4 first:border-t-0">
            <p className="font-medium text-ink">{item.title}</p>
            <p className="text-sm text-slate-500">
              {item.status} · {item.source.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
