import type { Metadata } from "next";
import "@/styles/globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://zhiyu-observatory.example.com";

export const metadata: Metadata = {
  title: {
    default: "智渔观察",
    template: "%s — 智渔观察",
  },
  description: "每日更新的水产产业技术、设备、AI 与价格情报站",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    siteName: "智渔观察",
    locale: "zh_CN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
