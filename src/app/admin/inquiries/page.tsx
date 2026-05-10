import { getInquiries } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-slate-100 text-slate-600",
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "新留言",
  CONTACTED: "已联系",
  CLOSED: "已关闭",
};

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">合作意向</h1>
      <p className="mt-2 text-sm text-slate-500">广告合作、赞助、供应商推荐线索</p>

      <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">公司</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">联系人</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">预算</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">留言</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">日期</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq: typeof inquiries[number]) => (
              <tr key={inq.id} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-ink">{inq.company}</td>
                <td className="px-4 py-3">
                  <div className="text-slate-700">{inq.contact}</div>
                  <div className="text-xs text-slate-400">{inq.phone}</div>
                  <div className="text-xs text-slate-400">{inq.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{inq.type}</td>
                <td className="px-4 py-3 text-slate-600">{inq.budget ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[inq.status] ?? "bg-slate-100 text-slate-700"
                  }`}>
                    {STATUS_LABELS[inq.status] ?? inq.status}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-slate-500">{inq.message ?? "—"}</td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                  {new Date(inq.createdAt).toLocaleDateString("zh-CN")}
                </td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">暂无合作意向</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}