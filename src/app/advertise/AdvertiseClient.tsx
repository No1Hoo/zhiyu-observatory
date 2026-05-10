"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/admin";

const INQUIRY_TYPES = [
  { value: "ADVERTISING", label: "广告投放" },
  { value: "SPONSORSHIP", label: "专题赞助" },
  { value: "SUPPLIER", label: "供应商推荐" },
  { value: "OTHER", label: "其他合作" },
];

const BUDGET_OPTIONS = [
  { value: "", label: "请选择" },
  { value: "under-5k", label: "5千元以下" },
  { value: "5k-1w", label: "5千-1万元" },
  { value: "1w-3w", label: "1-3万元" },
  { value: "3w-5w", label: "3-5万元" },
  { value: "over-5w", label: "5万元以上" },
];

export default function AdvertiseClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    await submitInquiry({
      company: fd.get("company") as string,
      contact: fd.get("contact") as string,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      type: fd.get("type") as string,
      message: fd.get("message") as string || undefined,
      budget: fd.get("budget") as string || undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-8 text-center">
        <p className="text-lg font-semibold text-green-800">感谢您的咨询！</p>
        <p className="mt-2 text-sm text-green-600">我们将在 1-3 个工作日内与您联系。</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {["专题赞助", "供应商推荐", "采购/咨询线索", "品牌广告位"].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-ink">{item}</h2>
            <p className="mt-2 text-sm text-slate-600">面向水产设备、饲料、苗种、动保企业，欢迎洽谈合作。</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-ink">填写合作意向</h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">公司名称 *</label>
            <input name="company" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">联系人 *</label>
            <input name="contact" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">联系电话 *</label>
            <input name="phone" type="tel" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">邮箱 *</label>
            <input name="email" type="email" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">合作类型 *</label>
            <select name="type" required className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
              {INQUIRY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">预算范围</label>
            <select name="budget" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
              {BUDGET_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">留言</label>
            <textarea name="message" rows={4} placeholder="请描述您的合作需求和期望..." className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-lagoon px-6 py-2.5 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
            >
              {submitting ? "提交中..." : "提交合作意向"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}