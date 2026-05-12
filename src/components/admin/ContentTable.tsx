"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { publishItem, rejectItem, deleteItem } from "@/app/actions/admin";

const STATUS_OPTIONS = [
  { value: "", label: "全部状态" },
  { value: "PENDING_REVIEW", label: "待审核" },
  { value: "PUBLISHED", label: "已发布" },
  { value: "REJECTED", label: "已拒绝" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "全部分类" },
  { value: "AI_AQUACULTURE", label: "AI 识别" },
  { value: "SMART_EQUIPMENT", label: "智能投喂" },
  { value: "FEED_SEEDLING", label: "饲料苗种" },
  { value: "ANIMAL_HEALTH", label: "动物保健" },
  { value: "PRICE_MARKET", label: "价格行情" },
  { value: "ECOMMERCE", label: "电商渠道" },
  { value: "OVERSEAS", label: "海外市场" },
  { value: "POLICY", label: "政策动向" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING_REVIEW: "border-amber-300/25 bg-amber-300/10 text-amber-100",
  PUBLISHED: "border-aqua/25 bg-aqua/10 text-aqua",
  REJECTED: "border-rose-300/25 bg-rose-300/10 text-rose-100",
};

export function ContentFilters({ q, status, category }: { q: string; status: string; category: string }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function buildUrl(overrides: Record<string, string>) {
    const params: Record<string, string> = { q, status, category, ...overrides };
    const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
    return `/admin/content${sp ? `?${sp}` : ""}`;
  }

  return (
    <div className="mb-5 grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl md:grid-cols-[1fr_190px_190px]">
      <input
        type="search"
        placeholder="搜索标题 / 标签 / 来源..."
        defaultValue={q}
        onChange={(e) => {
          const val = e.target.value;
          startTransition(() => router.push(buildUrl(val ? { q: val } : { q: "" })));
        }}
        className="min-w-48 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-foam placeholder:text-foam/30 outline-none transition focus:border-aqua/50 focus:ring-2 focus:ring-aqua/10"
      />
      <select
        value={status}
        onChange={(e) => startTransition(() => router.push(buildUrl({ status: e.target.value })))}
        className="rounded-2xl border border-white/10 bg-[#07131b] px-4 py-3 text-sm text-foam outline-none transition focus:border-aqua/50 focus:ring-2 focus:ring-aqua/10"
      >
        {STATUS_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
      <select
        value={category}
        onChange={(e) => startTransition(() => router.push(buildUrl({ category: e.target.value })))}
        className="rounded-2xl border border-white/10 bg-[#07131b] px-4 py-3 text-sm text-foam outline-none transition focus:border-aqua/50 focus:ring-2 focus:ring-aqua/10"
      >
        {CATEGORY_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
      </select>
    </div>
  );
}

type ContentItem = { id: string; title: string; status: string; category: string; riskLevel: number; isFeatured: boolean; source: { name: string } };

export function ContentTable({ items, total, page, totalPages, q, status, category, selected, onSelect, onSelectAll }: { items: ContentItem[]; total: number; page: number; totalPages: number; q: string; status: string; category: string; selected: string[]; onSelect: (id: string) => void; onSelectAll: () => void }) {
  const [isPending, startTransition] = useTransition();

  function pageUrl(p: number) {
    const params: Record<string, string> = { q, status, category, page: String(p) };
    return `/admin/content?${new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()}`;
  }

  const allSelected = items.length > 0 && items.every((i) => selected.includes(i.id));

  return (
    <>
      <div className="overflow-x-auto rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
        <table className="w-full min-w-[920px] text-sm">
          <thead className="border-b border-white/10 bg-white/[0.045] text-xs uppercase tracking-[0.16em] text-foam/42">
            <tr>
              <th className="px-4 py-4 text-left"><input type="checkbox" checked={allSelected} onChange={onSelectAll} className="h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-300" /></th>
              <th className="px-4 py-4 text-left">标题</th>
              <th className="px-4 py-4 text-left">分类</th>
              <th className="px-4 py-4 text-left">风险</th>
              <th className="px-4 py-4 text-left">状态</th>
              <th className="px-4 py-4 text-left">来源</th>
              <th className="px-4 py-4 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-white/10 text-foam/62 transition hover:bg-aqua/5">
                <td className="px-4 py-4"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => onSelect(item.id)} className="h-4 w-4 rounded border-white/20 bg-white/10 accent-cyan-300" /></td>
                <td className="px-4 py-4">
                  <span className="font-bold text-foam">{item.title}</span>
                  {item.isFeatured && <span className="ml-2 rounded-full border border-aqua/25 bg-aqua/10 px-2 py-0.5 text-xs text-aqua">精选</span>}
                </td>
                <td className="px-4 py-4">{CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category}</td>
                <td className="px-4 py-4"><span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${item.riskLevel >= 3 ? "bg-rose-300/15 text-rose-100" : item.riskLevel === 2 ? "bg-amber-300/15 text-amber-100" : "bg-white/[0.07] text-foam/60"}`}>{item.riskLevel}</span></td>
                <td className="px-4 py-4"><span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${STATUS_COLORS[item.status] ?? "border-white/10 bg-white/[0.05] text-foam/55"}`}>{STATUS_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status}</span></td>
                <td className="px-4 py-4">{item.source.name}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {item.status !== "PUBLISHED" && <button onClick={() => startTransition(() => publishItem(item.id))} disabled={isPending} className="text-xs font-bold text-aqua hover:text-cyan-200 disabled:opacity-50">发布</button>}
                    {item.status === "PUBLISHED" && <button onClick={() => startTransition(() => rejectItem(item.id))} disabled={isPending} className="text-xs font-bold text-foam/50 hover:text-foam disabled:opacity-50">撤回</button>}
                    <button onClick={() => { if (confirm("确认删除这条内容？")) startTransition(() => deleteItem(item.id)); }} disabled={isPending} className="text-xs font-bold text-rose-200 hover:text-rose-100 disabled:opacity-50">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="py-12 text-center text-foam/35">暂无内容，试试调整筛选条件</div>}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-foam/45">共 {total} 条，第 {page}/{totalPages} 页</span>
          <div className="flex gap-2">
            {page > 1 && <a href={pageUrl(page - 1)} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-foam/70 hover:bg-white/[0.1]">上一页</a>}
            {page < totalPages && <a href={pageUrl(page + 1)} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-foam/70 hover:bg-white/[0.1]">下一页</a>}
          </div>
        </div>
      )}
    </>
  );
}

export function BulkActionBar({ selected }: { selected: string[] }) {
  const [isPending, startTransition] = useTransition();
  if (selected.length === 0) return null;
  function bulkPublish() { for (const id of selected) startTransition(() => publishItem(id)); }
  function bulkReject() { for (const id of selected) startTransition(() => rejectItem(id)); }
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-[1.4rem] border border-aqua/20 bg-aqua/10 p-4 text-sm text-foam/70">
      <span className="font-bold text-aqua">已选择 {selected.length} 条</span>
      <button onClick={bulkPublish} disabled={isPending} className="rounded-full border border-aqua/25 bg-aqua/15 px-4 py-2 text-xs font-bold text-aqua hover:bg-aqua/25 disabled:opacity-50">批量发布</button>
      <button onClick={bulkReject} disabled={isPending} className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-bold text-foam/70 hover:bg-white/[0.1] disabled:opacity-50">批量撤回</button>
    </div>
  );
}