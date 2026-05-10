import { Metadata } from "next";
import { SiteHeader } from "@/components/public/SiteHeader";

export const metadata: Metadata = {
  title: "关于我们",
  description: "智渔观察 — 水产产业情报站，了解我们的使命、数据来源与合作方式",
};

export default function AboutPage() {
  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-5 py-12">
        <h1 className="text-3xl font-bold text-ink">关于我们</h1>
        <div className="mt-8 space-y-6 text-base leading-8 text-slate-700">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink">我们的使命</h2>
            <p>
              智渔观察致力于为水产养殖从业者、投资者和研究人员提供每日更新的产业情报，
              重点追踪技术设备、AI 应用、饲料苗种、动保趋势，同时覆盖价格行情、电商动态和海外资讯。
              我们相信，信息透明是产业升级的基础。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink">数据来源</h2>
            <p>
              内容来自 FAO GLOBEFISH、EUMOFA、中国农业农村部、中国水产科学研究院等
              官方公开数据源，以及经过审核的行业媒体。我们坚持标注来源，确保可追溯性。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink">AI 与人工审核</h2>
            <p>
              部分内容摘要由 AI 生成，用于快速整理信息。AI 摘要仅作参考，
              详细内容请查阅原文来源。所有待发布内容均经人工审核，确保准确性。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink">合作与联系</h2>
            <p>
              如有数据合作、内容授权或商务合作意向，请访问{" "}
              <a href="/advertise" className="text-lagoon hover:underline">广告合作</a>{" "}
              页面填写表单。开源项目地址：
              <a
                href="https://github.com/No1Hoo/zhiyu-observatory"
                target="_blank"
                rel="noreferrer"
                className="text-lagoon hover:underline"
              >
                GitHub
              </a>
              。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink">开源说明</h2>
            <p>
              智渔观察为免费开源项目，采用 MIT 许可证。您可以自由部署、修改和分发。
              欢迎提交 Issue 和 Pull Request 帮助改善项目。
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}