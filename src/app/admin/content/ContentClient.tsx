"use client";

import { useState } from "react";
import { ContentFilters, ContentTable, BulkActionBar } from "@/components/admin/ContentTable";

export default function ContentClient({
  items,
  total,
  page,
  totalPages,
  q,
  status,
  category,
}: {
  items: Array<{
    id: string;
    title: string;
    status: string;
    category: string;
    riskLevel: number;
    isFeatured: boolean;
    source: { name: string };
  }>;
  total: number;
  page: number;
  totalPages: number;
  q: string;
  status: string;
  category: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === items.length ? new Set() : new Set(items.map((i) => i.id))
    );
  }

  return (
    <div>
      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Content Library</p>
          <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">内容管理</h1>
        </div>
        <p className="max-w-md text-sm leading-6 text-foam/45 md:text-right">检索、筛选、发布、撤回或删除情报内容，管理公共端可见的信息资产。</p>
      </div>
      <ContentFilters q={q} status={status} category={category} />
      <BulkActionBar selected={Array.from(selected)} />
      <ContentTable
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        q={q}
        status={status}
        category={category}
        selected={Array.from(selected)}
        onSelect={toggle}
        onSelectAll={toggleAll}
      />
    </div>
  );
}