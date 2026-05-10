"use client";

import { useState } from "react";
import { createTopic, updateTopic, deleteTopic, createAdSlot, updateAdSlot, deleteAdSlot } from "@/app/actions/admin";

type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tags: string;
  sponsored: boolean;
};

type AdSlot = {
  id: string;
  name: string;
  page: string;
  position: string;
  sizeHint: string;
  enabled: boolean;
  label: string;
  content: string | null;
};

export default function TopicsAdsClient({
  topics: initialTopics,
  adSlots: initialAdSlots,
}: {
  topics: Topic[];
  adSlots: AdSlot[];
}) {
  const [topics, setTopics] = useState(initialTopics);
  const [adSlots, setAdSlots] = useState(initialAdSlots);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Topics Section */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-ink">Topics / Ads</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowTopicForm(true); setEditingTopic(null); }}
              className="rounded-md bg-lagoon px-3 py-2 text-sm text-white"
            >
              + 新建专题
            </button>
            <button
              onClick={() => { setShowSlotForm(true); setEditingSlot(null); }}
              className="rounded-md bg-obsidian px-3 py-2 text-sm text-white"
            >
              + 新建广告位
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Topics */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">专题</h2>
            <div className="mt-4 space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-start justify-between rounded-md border border-slate-100 p-3">
                  <div>
                    <p className="font-medium text-ink">{topic.name}</p>
                    <p className="mt-1 text-xs text-slate-400">/{topic.slug} · {topic.tags}</p>
                    <p className="mt-1 text-sm text-slate-500">{topic.description}</p>
                    {topic.sponsored && (
                      <span className="mt-1 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">赞助</span>
                    )}
                  </div>
                  <div className="ml-3 flex gap-2">
                    <button
                      onClick={() => { setEditingTopic(topic); setShowTopicForm(true); }}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >编辑</button>
                    <button
                      onClick={async () => {
                        if (confirm(`确认删除专题「${topic.name}」？`)) {
                          await deleteTopic(topic.id);
                          setTopics((prev) => prev.filter((t) => t.id !== topic.id));
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >删除</button>
                  </div>
                </div>
              ))}
              {topics.length === 0 && (
                <p className="text-sm text-slate-400">暂无专题</p>
              )}
            </div>
          </div>

          {/* Ad Slots */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">广告位</h2>
            <div className="mt-4 space-y-3">
              {adSlots.map((slot) => (
                <div key={slot.id} className="flex items-start justify-between rounded-md border border-slate-100 p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-ink">{slot.name}</p>
                      {slot.enabled ? (
                        <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-xs text-green-700">启用</span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">禁用</span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">/{slot.page} · {slot.position} · {slot.sizeHint}</p>
                    <p className="mt-1 text-sm text-slate-500">{slot.label} · {slot.content ?? "无内容"}</p>
                  </div>
                  <div className="ml-3 flex gap-2">
                    <button
                      onClick={() => { setEditingSlot(slot); setShowSlotForm(true); }}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >编辑</button>
                    <button
                      onClick={async () => {
                        if (confirm(`确认删除广告位「${slot.name}」？`)) {
                          await deleteAdSlot(slot.id);
                          setAdSlots((prev) => prev.filter((s) => s.id !== slot.id));
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >删除</button>
                  </div>
                </div>
              ))}
              {adSlots.length === 0 && (
                <p className="text-sm text-slate-400">暂无广告位</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Topic Form Modal */}
      {showTopicForm && (
        <TopicFormModal
          topic={editingTopic}
          onClose={() => { setShowTopicForm(false); setEditingTopic(null); }}
          onSave={async (data) => {
            if (editingTopic) {
              await updateTopic(editingTopic.id, data);
              setTopics((prev) => prev.map((t) => t.id === editingTopic.id ? { ...t, ...data } : t));
            } else {
              // Re-fetch would be complex; just close and let parent refresh
              setShowTopicForm(false);
              setEditingTopic(null);
            }
          }}
        />
      )}

      {/* AdSlot Form Modal */}
      {showSlotForm && (
        <SlotFormModal
          slot={editingSlot}
          onClose={() => { setShowSlotForm(false); setEditingSlot(null); }}
          onSave={async (data) => {
            if (editingSlot) {
              await updateAdSlot(editingSlot.id, data);
              setAdSlots((prev) => prev.map((s) => s.id === editingSlot.id ? { ...s, ...data } : s));
            } else {
              setShowSlotForm(false);
              setEditingSlot(null);
            }
          }}
        />
      )}
    </div>
  );
}

function TopicFormModal({
  topic,
  onClose,
  onSave,
}: {
  topic: Topic | null;
  onClose: () => void;
  onSave: (data: { name: string; slug: string; description: string; tags: string; sponsored?: boolean }) => void;
}) {
  const [name, setName] = useState(topic?.name ?? "");
  const [slug, setSlug] = useState(topic?.slug ?? "");
  const [description, setDescription] = useState(topic?.description ?? "");
  const [tags, setTags] = useState(topic?.tags ?? "");
  const [sponsored, setSponsored] = useState(topic?.sponsored ?? false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-ink">{topic ? "编辑专题" : "新建专题"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, slug, description, tags, sponsored });
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9-]+" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">标签（逗号分隔）</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} required placeholder="AI,水产,技术" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} id="sponsored" className="rounded border-slate-300" />
            <label htmlFor="sponsored" className="text-sm text-slate-700">赞助专题</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">取消</button>
            <button type="submit" className="rounded-md bg-lagoon px-4 py-2 text-sm text-white">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SlotFormModal({
  slot,
  onClose,
  onSave,
}: {
  slot: AdSlot | null;
  onClose: () => void;
  onSave: (data: {
    name: string; page: string; position: string; sizeHint?: string;
    enabled?: boolean; label?: string; content?: string;
  }) => void;
}) {
  const [name, setName] = useState(slot?.name ?? "");
  const [page, setPage] = useState(slot?.page ?? "home");
  const [position, setPosition] = useState(slot?.position ?? "");
  const [sizeHint, setSizeHint] = useState(slot?.sizeHint ?? "responsive");
  const [enabled, setEnabled] = useState(slot?.enabled ?? true);
  const [label, setLabel] = useState(slot?.label ?? "广告合作");
  const [content, setContent] = useState(slot?.content ?? "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-ink">{slot ? "编辑广告位" : "新建广告位"}</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ name, page, position, sizeHint, enabled, label, content: content || undefined });
            onClose();
          }}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">名称</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">页面</label>
              <select value={page} onChange={(e) => setPage(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                <option value="home">首页</option>
                <option value="intel-detail">文章详情</option>
                <option value="prices">价格页</option>
                <option value="tech">技术页</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">位置</label>
              <input value={position} onChange={(e) => setPosition(e.target.value)} required placeholder="hero-side" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">尺寸提示</label>
            <input value={sizeHint} onChange={(e) => setSizeHint(e.target.value)} placeholder="320x260" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">标签文字</label>
            <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">内容描述</label>
            <textarea value={content ?? ""} onChange={(e) => setContent(e.target.value)} rows={2} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} id="slot-enabled" className="rounded border-slate-300" />
            <label htmlFor="slot-enabled" className="text-sm text-slate-700">启用</label>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700">取消</button>
            <button type="submit" className="rounded-md bg-obsidian px-4 py-2 text-sm text-white">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}