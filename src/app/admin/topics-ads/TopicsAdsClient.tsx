"use client";

import { useState } from "react";
import { createTopic, updateTopic, deleteTopic, createAdSlot, updateAdSlot, deleteAdSlot } from "@/app/actions/admin";

type Topic = { id: string; name: string; slug: string; description: string; tags: string; sponsored: boolean };
type AdSlot = { id: string; name: string; page: string; position: string; sizeHint: string; enabled: boolean; label: string; content: string | null };

const fieldClass = "w-full rounded-2xl border border-white/10 bg-[#07131b] px-4 py-3 text-sm text-foam outline-none transition placeholder:text-foam/30 focus:border-aqua/50 focus:ring-2 focus:ring-aqua/10";
const secondaryButton = "rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-bold text-foam/70 transition hover:bg-white/[0.1] hover:text-foam";
const primaryButton = "rounded-full border border-aqua/25 bg-aqua/15 px-4 py-2 text-sm font-bold text-aqua transition hover:bg-aqua/25";

export default function TopicsAdsClient({ topics: initialTopics, adSlots: initialAdSlots }: { topics: Topic[]; adSlots: AdSlot[] }) {
  const [topics, setTopics] = useState(initialTopics);
  const [adSlots, setAdSlots] = useState(initialAdSlots);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-aqua">Topics / Ads</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] text-foam md:text-6xl">专题与合作位</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setShowTopicForm(true); setEditingTopic(null); }} className={primaryButton}>+ 新建专题</button>
            <button onClick={() => { setShowSlotForm(true); setEditingSlot(null); }} className={secondaryButton}>+ 新建广告位</button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-[-0.04em] text-foam">专题</h2>
              <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-bold text-aqua">{topics.length}</span>
            </div>
            <div className="space-y-3">
              {topics.map((topic) => (
                <div key={topic.id} className="rounded-[1.3rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-aqua/30 hover:bg-aqua/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-foam">{topic.name}</p>
                      <p className="mt-1 text-xs text-foam/35">/{topic.slug} · {topic.tags}</p>
                      <p className="mt-2 text-sm leading-6 text-foam/55">{topic.description}</p>
                      {topic.sponsored && <span className="mt-2 inline-block rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">赞助</span>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => { setEditingTopic(topic); setShowTopicForm(true); }} className="text-xs font-bold text-aqua">编辑</button>
                      <button onClick={async () => { if (confirm(`确认删除专题「${topic.name}」？`)) { await deleteTopic(topic.id); setTopics((prev) => prev.filter((t) => t.id !== topic.id)); } }} className="text-xs font-bold text-rose-200">删除</button>
                    </div>
                  </div>
                </div>
              ))}
              {topics.length === 0 && <p className="text-sm text-foam/35">暂无专题</p>}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/[0.045] p-5 shadow-[0_24px_80px_rgba(0,0,0,.22)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-[-0.04em] text-foam">广告位</h2>
              <span className="rounded-full border border-aqua/20 bg-aqua/10 px-3 py-1 text-xs font-bold text-aqua">{adSlots.length}</span>
            </div>
            <div className="space-y-3">
              {adSlots.map((slot) => (
                <div key={slot.id} className="rounded-[1.3rem] border border-white/10 bg-white/[0.045] p-4 transition hover:border-aqua/30 hover:bg-aqua/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-foam">{slot.name}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-xs ${slot.enabled ? "border-aqua/25 bg-aqua/10 text-aqua" : "border-white/10 bg-white/[0.05] text-foam/45"}`}>{slot.enabled ? "启用" : "禁用"}</span>
                      </div>
                      <p className="mt-1 text-xs text-foam/35">/{slot.page} · {slot.position} · {slot.sizeHint}</p>
                      <p className="mt-2 text-sm leading-6 text-foam/55">{slot.label} · {slot.content ?? "无内容"}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => { setEditingSlot(slot); setShowSlotForm(true); }} className="text-xs font-bold text-aqua">编辑</button>
                      <button onClick={async () => { if (confirm(`确认删除广告位「${slot.name}」？`)) { await deleteAdSlot(slot.id); setAdSlots((prev) => prev.filter((s) => s.id !== slot.id)); } }} className="text-xs font-bold text-rose-200">删除</button>
                    </div>
                  </div>
                </div>
              ))}
              {adSlots.length === 0 && <p className="text-sm text-foam/35">暂无广告位</p>}
            </div>
          </div>
        </div>
      </section>

      {showTopicForm && <TopicFormModal topic={editingTopic} onClose={() => { setShowTopicForm(false); setEditingTopic(null); }} onSave={async (data) => { if (editingTopic) { await updateTopic(editingTopic.id, data); setTopics((prev) => prev.map((t) => t.id === editingTopic.id ? { ...t, ...data } : t)); } else { await createTopic(data); location.reload(); } }} />}
      {showSlotForm && <SlotFormModal slot={editingSlot} onClose={() => { setShowSlotForm(false); setEditingSlot(null); }} onSave={async (data) => { if (editingSlot) { await updateAdSlot(editingSlot.id, data); setAdSlots((prev) => prev.map((s) => s.id === editingSlot.id ? { ...s, ...data } : s)); } else { await createAdSlot(data); location.reload(); } }} />}
    </div>
  );
}

function TopicFormModal({ topic, onClose, onSave }: { topic: Topic | null; onClose: () => void; onSave: (data: { name: string; slug: string; description: string; tags: string; sponsored?: boolean }) => void }) {
  const [name, setName] = useState(topic?.name ?? ""); const [slug, setSlug] = useState(topic?.slug ?? ""); const [description, setDescription] = useState(topic?.description ?? ""); const [tags, setTags] = useState(topic?.tags ?? ""); const [sponsored, setSponsored] = useState(topic?.sponsored ?? false);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-xl"><div className="w-full max-w-md rounded-[1.8rem] border border-white/10 bg-[#07131b] p-6 shadow-2xl"><h3 className="mb-5 text-2xl font-black text-foam">{topic ? "编辑专题" : "新建专题"}</h3><form onSubmit={(e) => { e.preventDefault(); onSave({ name, slug, description, tags, sponsored }); onClose(); }} className="space-y-4"><input placeholder="名称" value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} /><input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required pattern="[a-z0-9-]+" className={fieldClass} /><textarea placeholder="描述" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={fieldClass} /><input placeholder="标签（逗号分隔）" value={tags} onChange={(e) => setTags(e.target.value)} required className={fieldClass} /><label className="flex items-center gap-2 text-sm text-foam/60"><input type="checkbox" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} className="accent-cyan-300" />赞助专题</label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>取消</button><button type="submit" className={primaryButton}>保存</button></div></form></div></div>;
}

function SlotFormModal({ slot, onClose, onSave }: { slot: AdSlot | null; onClose: () => void; onSave: (data: { name: string; page: string; position: string; sizeHint?: string; enabled?: boolean; label?: string; content?: string }) => void }) {
  const [name, setName] = useState(slot?.name ?? ""); const [page, setPage] = useState(slot?.page ?? "home"); const [position, setPosition] = useState(slot?.position ?? ""); const [sizeHint, setSizeHint] = useState(slot?.sizeHint ?? "responsive"); const [enabled, setEnabled] = useState(slot?.enabled ?? true); const [label, setLabel] = useState(slot?.label ?? "广告合作"); const [content, setContent] = useState(slot?.content ?? "");
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-xl"><div className="w-full max-w-md rounded-[1.8rem] border border-white/10 bg-[#07131b] p-6 shadow-2xl"><h3 className="mb-5 text-2xl font-black text-foam">{slot ? "编辑广告位" : "新建广告位"}</h3><form onSubmit={(e) => { e.preventDefault(); onSave({ name, page, position, sizeHint, enabled, label, content: content || undefined }); onClose(); }} className="space-y-4"><input placeholder="名称" value={name} onChange={(e) => setName(e.target.value)} required className={fieldClass} /><div className="grid grid-cols-2 gap-3"><select value={page} onChange={(e) => setPage(e.target.value)} className={fieldClass}><option value="home">首页</option><option value="intel-detail">文章详情</option><option value="prices">价格页</option><option value="tech">技术页</option></select><input placeholder="位置" value={position} onChange={(e) => setPosition(e.target.value)} required className={fieldClass} /></div><input placeholder="尺寸提示" value={sizeHint} onChange={(e) => setSizeHint(e.target.value)} className={fieldClass} /><input placeholder="标签文字" value={label} onChange={(e) => setLabel(e.target.value)} className={fieldClass} /><textarea placeholder="内容描述" value={content ?? ""} onChange={(e) => setContent(e.target.value)} rows={2} className={fieldClass} /><label className="flex items-center gap-2 text-sm text-foam/60"><input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="accent-cyan-300" />启用</label><div className="flex justify-end gap-2"><button type="button" onClick={onClose} className={secondaryButton}>取消</button><button type="submit" className={primaryButton}>保存</button></div></form></div></div>;
}