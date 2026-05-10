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
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  PUBLISHED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function ContentFilters({
  q,
  status,
  category,
}: {
  q: string;
  status: string;
  category: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function buildUrl(overrides: Record<string, string>) {
    const params: Record<string, string> = { q, status, category, ...overrides };
    const sp = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString();
    return `/admin/content${sp ? `?${sp}` : ""}`;
  }

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <input
        type="search"
        placeholder="搜索标题/标签/来源..."
        defaultValue={q}
        onChange={(e) => {
          const val = e.target.value;
          startTransition(() => router.push(buildUrl(val ? { q: val } : { q: "" })));
        }}
        className="flex-1 min-w-48 rounded-md border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      />
      <select
        value={status}
        onChange={(e) =>
          startTransition(() => router.push(buildUrl({ status: e.target.value })))
        }
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        value={category}
        onChange={(e) =>
          startTransition(() => router.push(buildUrl({ category: e.target.value })))
        }
        className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
      >
        {CATEGORY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

type ContentItem = {
  id: string;
  title: string;
  status: string;
  category: string;
  riskLevel: number;
  isFeatured: boolean;
  source: { name: string };
};

export function ContentTable({
  items,
  total,
  page,
  totalPages,
  q,
  status,
  category,
  selected,
  onSelect,
  onSelectAll,
}: {
  items: ContentItem[];
  total: number;
  page: number;
  totalPages: number;
  q: string;
  status: string;
  category: string;
  selected: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  function pageUrl(p: number) {
    const params: Record<string, string> = { q, status, category, page: String(p) };
    return `/admin/content?${new URLSearchParams(
      Object.entries(params).filter(([, v]) => v)
    ).toString()}`;
  }

  const allSelected = items.length > 0 && items.every((i) => selected.includes(i.id));

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-slate-300"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">标题</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">分类</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">风险</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">来源</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => onSelect(item.id)}
                    className="rounded border-slate-300"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{item.title}</span>
                  {item.isFeatured && (
                    <span className="ml-2 rounded bg-cyan-100 px-1.5 py-0.5 text-xs text-cyan-700">精选</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {CATEGORY_OPTIONS.find((c) => c.value === item.category)?.label ?? item.category}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                    item.riskLevel >= 3 ? "bg-red-100 text-red-700" :
                    item.riskLevel === 2 ? "bg-orange-100 text-orange-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {item.riskLevel}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    STATUS_COLORS[item.status] ?? "bg-slate-100 text-slate-700"
                  }`}>
                    {STATUS_OPTIONS.find((s) => s.value === item.status)?.label ?? item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{item.source.name}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {item.status !== "PUBLISHED" && (
                      <button
                        onClick={() => startTransition(() => publishItem(item.id))}
                        disabled={isPending}
                        className="text-xs text-cyan-600 hover:text-cyan-800 disabled:opacity-50"
                      >发布</button>
                    )}
                    {item.status === "PUBLISHED" && (
                      <button
                        onClick={() => startTransition(() => rejectItem(item.id))}
                        disabled={isPending}
                        className="text-xs text-slate-500 hover:text-slate-700 disabled:opacity-50"
                      >撤回</button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("确认删除这条内容？")) {
                          startTransition(() => deleteItem(item.id));
                        }
                      }}
                      disabled={isPending}
                      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                    >删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            暂无内容，试试调整筛选条件
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-slate-500">共 {total} 条，第 {page}/{totalPages} 页</span>
          <div className="flex gap-1">
            {page > 1 && (
              <a href={pageUrl(page - 1)} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">
                上一页
              </a>
            )}
            {page < totalPages && (
              <a href={pageUrl(page + 1)} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-50">
                下一页
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function BulkActionBar({ selected }: { selected: string[] }) {
  const [isPending, startTransition] = useTransition();

  if (selected.length === 0) return null;

  function bulkPublish() {
    for (const id of selected) {
      startTransition(() => publishItem(id));
    }
  }

  function bulkReject() {
    for (const id of selected) {
      startTransition(() => rejectItem(id));
    }
  }

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-cyan-200 bg-cyan-50 p-3 text-sm">
      <span className="font-medium text-cyan-800">已选择 {selected.length} 条</span>
      <button
        onClick={bulkPublish}
        disabled={isPending}
        className="rounded-md bg-cyan-600 px-3 py-1 text-white hover:bg-cyan-700 disabled:opacity-50"
      >
        批量发布
      </button>
      <button
        onClick={bulkReject}
        disabled={isPending}
        className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100 disabled:opacity-50"
      >
        批量撤回
      </button>
    </div>
  );
}