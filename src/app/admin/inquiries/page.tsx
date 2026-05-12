import { getInquiries } from "@/lib/queries/admin";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  NEW: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  CONTACTED: "border-aqua/25 bg-aqua/10 text-aqua",
  CLOSED: "border-white/10 bg-white/[0.05] text-foam/45",
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
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Partnership Leads</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">合作意向</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">广告合作、赞助、供应商推荐线索与商业咨询集中管理。</p>
      </div>

      <div className="overflow-x-auto rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
            <tr>
              <th className="px-4 py-4 text-left">公司</th>
              <th className="px-4 py-4 text-left">联系人</th>
              <th className="px-4 py-4 text-left">类型</th>
              <th className="px-4 py-4 text-left">预算</th>
              <th className="px-4 py-4 text-left">状态</th>
              <th className="px-4 py-4 text-left">留言</th>
              <th className="px-4 py-4 text-left">日期</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq: typeof inquiries[number]) => (
              <tr key={inq.id} className="border-t border-white/10 text-foam/62 transition hover:bg-aqua/5">
                <td className="px-4 py-4 font-bold text-foam">{inq.company}</td>
                <td className="px-4 py-4">
                  <div className="font-medium text-foam/80">{inq.contact}</div>
                  <div className="mt-1 text-xs text-foam/38">{inq.phone}</div>
                  <div className="text-xs text-foam/38">{inq.email}</div>
                </td>
                <td className="px-4 py-4">{inq.type}</td>
                <td className="px-4 py-4">{inq.budget ?? "—"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_COLORS[inq.status] ?? "border-white/10 bg-white/[0.05] text-foam/55"}`}>
                    {STATUS_LABELS[inq.status] ?? inq.status}
                  </span>
                </td>
                <td className="max-w-xs truncate px-4 py-4 text-foam/45">{inq.message ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-4 text-foam/38">{new Date(inq.createdAt).toLocaleDateString("zh-CN")}</td>
              </tr>
            ))}
            {inquiries.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-foam/35">暂无合作意向</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}