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
      <h1 className="text-2xl font-bold text-ink">内容管理</h1>
      <ContentFilters q={q} status={status} category={category} />
      <BulkActionBar
        selected={Array.from(selected)}
      />
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