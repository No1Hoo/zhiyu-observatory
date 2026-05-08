import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "智渔观察",
  description: "每日更新的水产产业技术、设备、AI 与价格情报站"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
