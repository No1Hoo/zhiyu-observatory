import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.adSlot.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.source.deleteMany();

  const sources = await Promise.all([
    prisma.source.create({
      data: {
        name: "FAO GLOBEFISH",
        url: "https://www.fao.org/in-action/globefish/en",
        type: "OFFICIAL",
        country: "Global",
        crawlMethod: "WEB_LIST",
        crawlFrequency: "WEEKLY",
        crawlLimit: 10,
        trustLevel: 5,
        defaultReview: "PENDING_REVIEW"
      }
    }),
    prisma.source.create({
      data: {
        name: "EUMOFA Data",
        url: "https://eumofa.eu/data",
        type: "OFFICIAL",
        country: "EU",
        crawlMethod: "WEB_LIST",
        crawlFrequency: "WEEKLY",
        crawlLimit: 10,
        trustLevel: 5,
        defaultReview: "PENDING_REVIEW"
      }
    }),
    prisma.source.create({
      data: {
        name: "农业农村部数据",
        url: "https://data.moa.gov.cn/nyb/pc/index.jsp",
        type: "OFFICIAL",
        country: "中国",
        crawlMethod: "WEB_LIST",
        crawlFrequency: "DAILY",
        crawlLimit: 20,
        trustLevel: 5,
        defaultReview: "PENDING_REVIEW"
      }
    })
  ]);

  await prisma.intelItem.createMany({
    data: [
      {
        sourceId: sources[0].id,
        title: "GLOBEFISH 持续跟踪国际水产品市场与价格趋势",
        slug: "globefish-market-price-trends",
        aiSummary:
          "国际水产品贸易依赖稳定、及时、独立的市场信息。该来源适合跟踪海外价格、贸易流和重点品种市场变化。",
        category: "OVERSEAS",
        tags: "国际市场,价格报告,贸易",
        region: "Global",
        status: "PUBLISHED",
        isFeatured: true,
        riskLevel: 1,
        sourceUrl: "https://www.fao.org/in-action/globefish/en",
        publishedAt: new Date()
      },
      {
        sourceId: sources[1].id,
        title: "EUMOFA 提供欧盟水产养殖、进出口与消费数据入口",
        slug: "eumofa-aquaculture-import-export-data",
        aiSummary:
          "EUMOFA 数据覆盖 first sale、aquaculture、import-export、retail-consumption 等环节，可作为欧洲市场观察的数据来源。",
        category: "PRICE_MARKET",
        tags: "欧盟,数据,价格观察",
        region: "EU",
        status: "PUBLISHED",
        isFeatured: true,
        riskLevel: 2,
        sourceUrl: "https://eumofa.eu/data",
        publishedAt: new Date()
      },
      {
        sourceId: sources[2].id,
        title: "农业农村部数据入口可作为国内批发市场与重点品种观察来源",
        slug: "moa-data-wholesale-key-species",
        aiSummary:
          "农业农村部数据站提供批发市场、重点品种等入口，适合作为国内价格观察的高可信来源。",
        category: "PRICE_MARKET",
        tags: "国内价格,批发市场,重点品种",
        region: "中国",
        status: "PUBLISHED",
        isFeatured: true,
        riskLevel: 2,
        sourceUrl: "https://data.moa.gov.cn/nyb/pc/index.jsp",
        publishedAt: new Date()
      }
    ]
  });

  await prisma.priceObservation.create({
    data: {
      sourceId: sources[2].id,
      species: "南美白对虾",
      region: "华南",
      market: "样本行情",
      price: 38,
      unit: "元/斤",
      observedAt: new Date(),
      sourceUrl: "https://data.moa.gov.cn/nyb/pc/index.jsp",
      status: "PENDING_REVIEW",
      note: "示例数据，用于展示价格观察页面结构。"
    }
  });

  await prisma.topic.createMany({
    data: [
      {
        name: "智能投喂设备观察",
        slug: "smart-feeding-equipment",
        description: "跟踪智能投喂、水质联动、养殖自动化设备动态。",
        tags: "智能投喂,设备,AI",
        sponsored: false
      },
      {
        name: "水产养殖 AI 应用观察",
        slug: "ai-aquaculture-watch",
        description: "跟踪 AI 识别、病害预警、养殖决策辅助和数据化管理。",
        tags: "AI,识别,预警",
        sponsored: false
      }
    ]
  });

  await prisma.adSlot.createMany({
    data: [
      {
        name: "首页右侧合作位",
        page: "home",
        position: "hero-side",
        sizeHint: "320x260",
        content: "智能设备、饲料苗种、动保企业可联系合作。"
      },
      {
        name: "文章详情页相关供应商",
        page: "intel-detail",
        position: "after-content",
        sizeHint: "responsive",
        content: "这里将展示相关供应商推荐。"
      }
    ]
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
