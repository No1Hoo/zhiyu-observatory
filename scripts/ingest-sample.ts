import { prisma } from "@/lib/db";
import { ingestItems } from "@/lib/ingestion/pipeline";

async function main() {
  const source = await prisma.source.findFirst({ where: { enabled: true } });
  if (!source) {
    throw new Error("No enabled source found. Run npm run db:seed first.");
  }

  const items = await ingestItems([
    {
      sourceId: source.id,
      sourceName: source.name,
      title: "智能投喂设备在工厂化养殖中提升饲料利用率",
      url: `${source.url}#sample-smart-feeding`,
      summary: "样本内容：智能投喂设备与水质监测联动，帮助减少浪费并提升管理效率。",
      publishedAt: new Date()
    },
    {
      sourceId: source.id,
      sourceName: source.name,
      title: "南美白对虾价格样本出现区域分化",
      url: `${source.url}#sample-shrimp-price`,
      summary: "样本内容：不同地区样本价格表现不一致，需要结合来源和日期谨慎判断。",
      publishedAt: new Date()
    }
  ]);

  console.log(`Ingested ${items.length} items`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
