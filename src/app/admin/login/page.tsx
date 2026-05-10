"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/public/SiteHeader";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(redirect);
      router.refresh();
    } else {
      setError("密码错误，请重试");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[--page-bg]">
      <SiteHeader />
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-ink">管理员登录</h1>
            <p className="mt-2 text-sm text-slate-500">请输入管理员密码</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                name="password"
                placeholder="管理员密码"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-lagoon focus:outline-none focus:ring-1 focus:ring-lagoon"
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-lagoon py-3 text-sm font-semibold text-white transition hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "验证中..." : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}