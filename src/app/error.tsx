"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[--page-bg] px-6 text-center">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
        <div className="mb-4 text-5xl">⚠️</div>
        <h2 className="mb-2 text-xl font-bold text-red-600">页面出错</h2>
        <p className="mb-6 text-slate-500">
          发生了意外错误，请尝试重新加载页面。
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-lagoon px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-opacity-90"
        >
          重新加载
        </button>
      </div>
    </div>
  );
}