import { PrismaClient } from "@prisma/client";
import { createSlug } from "@/lib/slug";

const prisma = new PrismaClient();

async function main() {
  await prisma.adSlot.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.priceObservation.deleteMany();
  await prisma.intelItem.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.source.deleteMany();

  // ── Sources ────────────────────────────────────────────────
  const [fao, eumofa, moa, cafs] = await Promise.all([
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
        defaultReview: "PENDING_REVIEW",
      },
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
        defaultReview: "PENDING_REVIEW",
      },
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
        defaultReview: "PENDING_REVIEW",
      },
    }),
    prisma.source.create({
      data: {
        name: "中国水产科学研究院",
        url: "https://www.cafs.ac.cn/",
        type: "OFFICIAL",
        country: "中国",
        crawlMethod: "WEB_LIST",
        crawlFrequency: "WEEKLY",
        crawlLimit: 15,
        trustLevel: 5,
        defaultReview: "PENDING_REVIEW",
      },
    }),
  ]);

  // ── Intel Items (25 items, mixed statuses) ──────────────────
  const intelItems = [
    // ── AI_AQUACULTURE (5) ──
    {
      sourceId: cafs.id,
      title: "AI 识别技术在南美白对虾养殖中的应用突破",
      category: "AI_AQUACULTURE",
      tags: "AI识别,病害检测,对虾养殖,智能监控",
      aiSummary:
        "中国水产科学研究院发布 AI 图像识别系统，可自动检测对虾体色异常和活动行为异常，识别准确率达 92%。该系统可在 3 秒内完成单池巡检，大幅降低人工监控成本。建议关注 AI 病害预警设备在大型养殖场的落地进度。",
      region: "中国",
      species: "南美白对虾",
      riskLevel: 1,
      isFeatured: true,
    },
    {
      sourceId: cafs.id,
      title: "循环水养殖数据化管理平台投入应用",
      category: "AI_AQUACULTURE",
      tags: "数据平台,循环水养殖,智能管理,水质分析",
      aiSummary:
        "基于云端的循环水养殖（RAS）数据管理平台上线，整合溶氧、氨氮、pH 值、投喂量等核心指标，AI 算法辅助优化投喂策略。初期测试显示饵料系数下降 12%，节能效果显著。",
      region: "华南",
      species: "多品种",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: fao.id,
      title: "FAO 推广 AI 辅助养殖决策支持系统",
      category: "AI_AQUACULTURE",
      tags: "FAO,AI决策支持,养殖管理,数字农业",
      aiSummary:
        "FAO 在东南亚试点 AI 辅助养殖决策系统，结合传感器数据和历史产量预测最佳出塘时间。试点渔民平均收入提升 8%，饲料浪费减少 15%。FAO 计划 2027 年前向 20 个国家推广。",
      region: "Global",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: cafs.id,
      title: "深度学习模型预测水产养殖细菌性病害暴发",
      category: "AI_AQUACULTURE",
      tags: "深度学习,病害预测,细菌性感染,预警系统",
      aiSummary:
        "研究团队利用深度学习对水温、溶解氧、养殖密度等环境因子建模，提前 7 天预测细菌性病害暴发风险，准确率 85%。模型已开源，适合集成到现有监控系统。",
      region: "中国",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: eumofa.id,
      title: "欧盟启动 AI 水产养殖监管沙盒计划",
      category: "AI_AQUACULTURE",
      tags: "欧盟,AI监管,水产养殖,数字创新",
      aiSummary:
        "欧盟委员会启动水产养殖 AI 监管沙盒，首批纳入 5 个成员国的智能养殖项目。沙盒内允许 AI 设备在受控环境下试验新型投喂优化算法。预计 2027 年形成统一的 AI 水产养殖认证标准。",
      region: "EU",
      riskLevel: 1,
      isFeatured: false,
    },

    // ── SMART_EQUIPMENT (5) ──
    {
      sourceId: cafs.id,
      title: "智能投喂机在淡水池塘养殖中规模化应用",
      category: "SMART_EQUIPMENT",
      tags: "智能投喂,池塘养殖,自动化设备,节本增效",
      aiSummary:
        "基于声学检测和图像分析的智能投喂机已在珠三角淡水池塘养殖中规模化应用。根据鱼群密度和活跃度动态调整投喂量，饵料系数降低 18%，人力成本减少 40%。单台设备服务面积可达 30 亩。",
      region: "华南",
      species: "草鱼,鲈鱼",
      equipment: "智能投喂",
      riskLevel: 1,
      isFeatured: true,
    },
    {
      sourceId: cafs.id,
      title: "多参数水质监测传感器国产化价格跌破千元",
      category: "SMART_EQUIPMENT",
      tags: "水质监测,传感器,国产化,IoT养殖",
      aiSummary:
        "国产多参数水质监测传感器（溶解氧/氨氮/pH/温度）价格首次降至千元以内，支持 4G 联网实时上传数据。适合中小养殖户部署，搭配手机 App 可随时查看池塘水质。准确率接近进口万元级产品。",
      region: "中国",
      equipment: "水质监测",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "农业农村部推动池塘养殖机械化升级",
      category: "SMART_EQUIPMENT",
      tags: "机械化,池塘养殖,政策支持,设备补贴",
      aiSummary:
        "农业农村部 2026 年继续推进池塘养殖机械化升级，重点补贴智能增氧机、水质在线监测设备和自动投喂机。单台最高补贴 30%，申报截止日期 2026 年 6 月底。建议关注当地渔业部门的具体申报流程。",
      region: "中国",
      equipment: "增氧设备",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: cafs.id,
      title: "水下机器人巡检系统在海水养殖开始推广",
      category: "SMART_EQUIPMENT",
      tags: "水下机器人,海水养殖,网箱监测,自动化",
      aiSummary:
        "携带高清摄像头和水质探头的水下巡检机器人开始在海水网箱养殖中推广，可自动绕行网箱一周并生成水下环境报告。检测网衣破损、观察鱼群状态、测量溶解氧分布。单机作业半径 200 米，适合大型海上养殖区。",
      region: "华东",
      species: "石斑鱼",
      equipment: "监测设备",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: fao.id,
      title: "FAO 推进全球水产养殖机械化技术指南更新",
      category: "SMART_EQUIPMENT",
      tags: "FAO,机械化指南,技术规范,全球养殖",
      aiSummary:
        "FAO 发布《全球水产养殖机械化技术指南（2026版）》，新增智能投喂、精准增氧、在线监测三个领域的设备选型建议，覆盖海水网箱、淡水池塘、陆基循环水三种主要养殖模式。提供中英法西四种语言版本。",
      region: "Global",
      equipment: "综合设备",
      riskLevel: 1,
      isFeatured: false,
    },

    // ── FEED_SEEDLING (5) ──
    {
      sourceId: moa.id,
      title: "南美白对虾苗种质量分级标准 2026 年起实施",
      category: "FEED_SEEDLING",
      tags: "对虾,苗种分级,质量标准,养殖规范",
      aiSummary:
        "农业农村部发布南美白对虾苗种质量分级国家标准，将虾苗分为特级、一级、二级三个等级，明确病毒检测、活力指标、盐度适应性等技术要求。2026 年 7 月起强制执行，将倒逼育苗场提升品控。",
      region: "华南",
      species: "南美白对虾",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: cafs.id,
      title: "石斑鱼工厂化育苗技术突破成活率提升至 75%",
      category: "FEED_SEEDLING",
      tags: "石斑鱼,工厂化育苗,成活率,技术突破",
      aiSummary:
        "水产科学研究院工厂化育苗团队通过温控、光照、饵料三阶段优化，石斑鱼育苗成活率从 45% 提升至 75%，育苗周期缩短 15 天。每批次可多出苗 30 万尾，有效降低苗种成本。",
      region: "华南",
      species: "石斑鱼",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "饲料原料价格回落，淡水鱼配合饲料价格下行",
      category: "FEED_SEEDLING",
      tags: "饲料价格,原料行情,草鱼,成本下降",
      aiSummary:
        "2026 年 4 月豆粕、菜粕价格环比下降 8%，淡水鱼配合饲料出厂价随之松动。华南地区草鱼配合饲料报价约 3800-4000 元/吨，较年初下降 5%。饲料成本约占养殖总成本 55-65%，降价对养殖盈利改善有明显帮助。",
      region: "华南",
      species: "草鱼",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: cafs.id,
      title: "小龙虾育养分离模式在湖北湖南快速推广",
      category: "FEED_SEEDLING",
      tags: "小龙虾,育养分离,养殖模式,技术推广",
      aiSummary:
        "育养分离模式将成虾养殖和小龙虾育苗分开管理，湖北湖南两省推广面积已超过 80 万亩。该模式每亩可增产商品虾 30-50 斤，增收约 600-1000 元/亩，同时提高虾苗质量。",
      region: "华中",
      species: "小龙虾",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: fao.id,
      title: "全球鱼粉产量下降推高高端饲料成本",
      category: "FEED_SEEDLING",
      tags: "鱼粉,饲料原料,供应紧张,成本压力",
      aiSummary:
        "FAO 最新报告显示 2025 年全球鱼粉产量同比下降 12%，主要受秘鲁鳀鱼捕捞配额减少影响。鱼粉价格持续高企，蛋白含量 65% 鱼粉到岸价突破 1800 美元/吨。高蛋白特种饲料（如虾料、石斑鱼料）成本面临上涨压力。",
      region: "Global",
      riskLevel: 2,
      isFeatured: false,
    },

    // ── ANIMAL_HEALTH (4) ──
    {
      sourceId: cafs.id,
      title: "水产用噬菌体替抗产品进入临床试验阶段",
      category: "ANIMAL_HEALTH",
      tags: "噬菌体,替抗,动保产品,临床试验",
      aiSummary:
        "针对副溶血弧菌的噬菌体产品在水产养殖中进入临床试验阶段。实验显示对虾感染副溶血弧菌后使用噬菌体治疗，死亡率从 60% 降至 15%，且无药残风险。如通过临床，将成为重要的替抗选择。",
      region: "中国",
      species: "南美白对虾",
      riskLevel: 3,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "农业农村部加强水产养殖用药监管，多省排查",
      category: "ANIMAL_HEALTH",
      tags: "用药监管,药残检测,执法检查,规范用药",
      aiSummary:
        "农业农村部 2026 年继续加强水产养殖用药监管，重点排查孔雀石绿、氯霉素、硝基呋喃类等禁用药物。多省开展突击检查，部分养殖场因检出违禁药物被处罚。建议养殖从业者严格规范用药并保留处方记录。",
      region: "中国",
      riskLevel: 3,
      isFeatured: false,
    },
    {
      sourceId: cafs.id,
      title: "草鱼老三病联合免疫方案在珠三角验证有效",
      category: "ANIMAL_HEALTH",
      tags: "草鱼,老三病,免疫方案,珠三角",
      aiSummary:
        "针对草鱼老三病（烂鳃、肠炎、赤皮）的联合免疫方案在珠三角验证，通过注射或口服疫苗组合，可降低发病率 50% 以上。免疫一次保护期约 6 个月，适合存塘时间较长的成鱼养殖。",
      region: "华南",
      species: "草鱼",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: eumofa.id,
      title: "欧盟加强水产养殖抗生素使用限制",
      category: "ANIMAL_HEALTH",
      tags: "欧盟,抗生素限制,水产养殖,法规趋严",
      aiSummary:
        "欧盟通过新法规进一步限制水产养殖抗生素使用，要求所有成员国 2027 年前将抗生素使用量再降低 30%。已禁止用于促生长目的的抗生素，并对预防性用药实施配额管理。出口欧盟的水产品需额外提供抗生素残留检测报告。",
      region: "EU",
      riskLevel: 2,
      isFeatured: false,
    },

    // ── PRICE_MARKET (4) ──
    {
      sourceId: eumofa.id,
      title: "欧洲三文鱼价格再创新高，养殖企业利润增厚",
      category: "PRICE_MARKET",
      tags: "三文鱼,欧洲价格,养殖利润,市场分析",
      aiSummary:
        "EUMOFA 数据显示 2026 年第一季度欧洲大西洋鲑（三文鱼）批发价突破 12 欧元/公斤，同比上涨 22%。主要原因是挪威和智利养殖产量增速放缓，而全球需求持续增长。欧洲大型养殖企业利润率升至 35%，中小养殖户表示担忧成本传导压力。",
      region: "EU",
      species: "三文鱼",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "2026年4月全国淡水鱼批发价格环比涨跌互现",
      category: "PRICE_MARKET",
      tags: "淡水鱼,批发价格,行情,月报",
      aiSummary:
        "农业农村部市场预警团队数据显示，2026 年 4 月全国重点水产品批发市场草鱼均价 12.5 元/公斤，环比下跌 3%；鲈鱼均价 24.8 元/公斤，环比上涨 7%；鳜鱼均价 58 元/公斤，环比持平。整体淡水鱼价格稳中偏弱，存塘量充足是主要原因。",
      region: "中国",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "南美白对虾价格波动剧烈，珠三角虾价跌破 30 元",
      category: "PRICE_MARKET",
      tags: "对虾,价格波动,珠三角,市场风险",
      aiSummary:
        "2026 年 5 月珠三角南美白对虾（30 头/斤）塘头价约 27-29 元/斤，逼近养殖成本线。主要是华南新一批达规格虾集中上市，加上泰国、厄瓜多尔进口虾冲击市场。业内建议控制养殖密度，分批出虾以降低集中上市风险。",
      region: "华南",
      species: "南美白对虾",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: fao.id,
      title: "FAO 全球水产品贸易报告：养殖产品占比首超捕捞",
      category: "PRICE_MARKET",
      tags: "FAO,水产品贸易,养殖占比,全球市场",
      aiSummary:
        "FAO 发布的《2026 全球水产品贸易报告》显示，养殖水产品在全球水产品贸易中的占比首次超过 50%，标志着水产养殖进入主导时代。鲈鱼、鳕鱼、巴沙鱼是增长最快的养殖出口品种，中国是全球最大的养殖水产品出口国。",
      region: "Global",
      riskLevel: 1,
      isFeatured: false,
    },

    // ── ECOMMERCE (2) ──
    {
      sourceId: moa.id,
      title: "水产电商渗透率提升，冷链物流支撑下沉重心上行",
      category: "ECOMMERCE",
      tags: "水产电商,冷链物流,渠道变化,销售模式",
      aiSummary:
        "2026 年水产电商渗透率持续提升，活鲜冰鲜水产线上销售占比约 18%，同比增加 3 个百分点。冷链物流基础设施完善是关键推手，重点城市 24 小时达已成标配。电商渠道更适合高价值品种（虾、蟹、石斑鱼），传统批发渠道面临转型压力。",
      region: "中国",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: eumofa.id,
      title: "欧洲线上水产消费快速增长，DTC 品牌崛起",
      category: "ECOMMERCE",
      tags: "欧洲,线上消费,DTC品牌,水产零售",
      aiSummary:
        "EUMOFA 数据显示欧洲消费者水产线上购买比例从 2023 年的 12% 升至 2026 年的 22%。DTC（直达消费者）水产品牌快速增长，绕开传统零售中间环节，利润率提升 15-20%。主要增长集中在鲑鱼、虾和即食水产罐头。",
      region: "EU",
      riskLevel: 1,
      isFeatured: false,
    },

    // ── OVERSEAS (2) ──
    {
      sourceId: fao.id,
      title: "厄瓜多尔虾产业扩张，2025 年出口量突破 100 万吨",
      category: "OVERSEAS",
      tags: "厄瓜多尔,对虾出口,产业扩张,全球竞争",
      aiSummary:
        "厄瓜多尔 2025 年虾出口量达 105 万吨，首次突破百万吨大关，主要增量来自新建大型养殖场的产能释放。厄虾以成本优势（约为中国本地成本的 60-70%）大量进入中国和东南亚市场，对华南对虾养殖形成直接竞争压力。",
      region: "南美",
      species: "南美白对虾",
      riskLevel: 2,
      isFeatured: false,
    },
    {
      sourceId: eumofa.id,
      title: "挪威三文鱼养殖扩张计划引发环境争议",
      category: "OVERSEAS",
      tags: "挪威,三文鱼,环境争议,养殖扩张",
      aiSummary:
        "挪威政府批准多个三文鱼养殖扩张计划，引发海虱问题和养殖区生态影响的争议。环保组织警告大规模扩张可能对野生鱼群造成压力。目前挪威三文鱼养殖密度监管趋严，新批扩张项目需通过更严格的环境评估。",
      region: "北欧",
      species: "三文鱼",
      riskLevel: 2,
      isFeatured: false,
    },

    // ── POLICY (2) ──
    {
      sourceId: moa.id,
      title: "2026 年中央财政继续支持渔业绿色发展项目",
      category: "POLICY",
      tags: "财政补贴,绿色发展,循环水养殖,政策支持",
      aiSummary:
        "2026 年中央财政继续安排专项资金支持渔业绿色发展，重点支持循环水养殖（RAS）、池塘标准化改造、尾水处理设施建设。单项目补贴最高可达投资额的 30%。申报主体为规模化养殖企业或合作社，申报窗口通常在 3-5 月。",
      region: "中国",
      riskLevel: 1,
      isFeatured: false,
    },
    {
      sourceId: moa.id,
      title: "沿海养殖区空间规划调整，多省清理违规养殖设施",
      category: "POLICY",
      tags: "海域使用,养殖区规划,违规清理,政策收紧",
      aiSummary:
        "沿海各省陆续推进养殖区空间规划调整，对占用航道、生态敏感区的养殖设施进行清理。广东、福建、江苏均已公布清退名单，违规设施需在 2026 年底前自行拆除或迁移。深远海养殖设施和合规池塘暂不受影响。",
      region: "中国",
      riskLevel: 2,
      isFeatured: false,
    },
  ];

  const existingSlugs: string[] = [];

  // Create items with proper slugs
  for (const item of intelItems) {
    const baseSlug = createSlug(item.title);
    const slug = ensureUniqueSlug(baseSlug, existingSlugs);
    existingSlugs.push(slug);

    const now = new Date();
    const status = item.riskLevel >= 3 ? "PENDING_REVIEW" : "PUBLISHED";

    await prisma.intelItem.create({
      data: {
        sourceId: item.sourceId,
        title: item.title,
        slug,
        aiSummary: item.aiSummary + "\n\nAI 生成摘要，仅供参考，以原文来源为准。",
        category: item.category,
        tags: item.tags,
        species: item.species || null,
        equipment: item.equipment || null,
        region: item.region,
        status,
        isFeatured: item.isFeatured || false,
        riskLevel: item.riskLevel,
        sourceUrl: `https://example.com/${slug}`,
        sourcePublishedAt: now,
        publishedAt: status === "PUBLISHED" ? now : null,
      },
    });
  }

  // ── Price Observations (8 items) ────────────────────────────
  const priceData = [
    { species: "草鱼", region: "华南", market: "广州黄沙水产市场", price: 12.5, unit: "元/斤", note: "2026年4月均价" },
    { species: "鲈鱼", region: "华南", market: "佛山中南市场", price: 24.8, unit: "元/斤", note: "存塘减少，价格上涨" },
    { species: "鳜鱼", region: "华中", market: "武汉白沙洲市场", price: 58.0, unit: "元/斤", note: "规格鱼价格稳定" },
    { species: "南美白对虾", region: "珠三角", market: "珠海斗门收购点", price: 28.5, unit: "元/斤", note: "30头/斤，近期下行" },
    { species: "石斑鱼", region: "海南", market: "海口海南市场", price: 38.0, unit: "元/斤", note: "1-2斤规格" },
    { species: "小龙虾", region: "湖北", market: "武汉白沙洲", price: 22.0, unit: "元/斤", note: "456钱规格，均价" },
    { species: "三文鱼", region: "欧洲", market: "批发均价", price: 12.0, unit: "欧元/公斤", note: "2026Q1批发价" },
    { species: "南美白对虾", region: "华南", market: "珠三角塘头价", price: 27.0, unit: "元/斤", note: "30头，逼近成本" },
  ];

  for (const p of priceData) {
    await prisma.priceObservation.create({
      data: {
        sourceId: moa.id,
        species: p.species,
        region: p.region,
        market: p.market,
        price: p.price,
        unit: p.unit,
        observedAt: new Date(),
        sourceUrl: "https://data.moa.gov.cn/",
        status: "PENDING_REVIEW",
        note: p.note,
      },
    });
  }

  // ── Topics (5) ──────────────────────────────────────────────
  await prisma.topic.createMany({
    data: [
      {
        name: "智能投喂设备观察",
        slug: "smart-feeder",
        description: "跟踪智能投喂、水质联动、养殖自动化设备动态与技术进展。",
        tags: "智能投喂,设备,AI,自动化",
        sponsored: false,
      },
      {
        name: "水产养殖 AI 应用观察",
        slug: "ai-aquaculture-watch",
        description: "跟踪 AI 识别、病害预警、养殖决策辅助和数据化管理。",
        tags: "AI,识别,预警,数据分析",
        sponsored: false,
      },
      {
        name: "全球对虾市场动态",
        slug: "global-shrimp-market",
        description: "跟踪厄瓜多尔、印度、泰国及中国对虾的进出口、价格与养殖动态。",
        tags: "对虾,价格,出口,竞争",
        sponsored: false,
      },
      {
        name: "循环水养殖技术",
        slug: "ras-technology",
        description: "关注 RAS 系统设备、运营成本和国产化进展。",
        tags: "循环水,设备,成本,国产化",
        sponsored: false,
      },
      {
        name: "水产用药规范",
        slug: "aquaculture-drug-regulation",
        description: "跟踪兽药法规、违禁药检测、替抗产品研发动态。",
        tags: "用药,监管,替抗,食品安全",
        sponsored: false,
      },
    ],
  });

  // ── AdSlots (3) ─────────────────────────────────────────────
  await prisma.adSlot.createMany({
    data: [
      {
        name: "首页右侧合作位",
        page: "home",
        position: "hero-side",
        sizeHint: "320x260",
        enabled: true,
        label: "广告合作",
        content: "智能设备、饲料苗种、动保企业可联系合作。",
      },
      {
        name: "文章详情页供应商推荐",
        page: "intel-detail",
        position: "after-content",
        sizeHint: "responsive",
        enabled: true,
        label: "供应商推荐",
        content: "精准对接水产养殖设备与投入品供应商。",
      },
      {
        name: "价格页面赞助商",
        page: "prices",
        position: "top-banner",
        sizeHint: "728x90",
        enabled: false,
        label: "合作推广",
        content: null,
      },
    ],
  });

  console.log(`✅ Seed complete: ${intelItems.length} intel items, ${priceData.length} price observations`);
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

function ensureUniqueSlug(baseSlug: string, existing: string[]): string {
  if (!existing.includes(baseSlug)) return baseSlug;
  let counter = 1;
  while (existing.includes(`${baseSlug}-${counter}`)) counter++;
  return `${baseSlug}-${counter}`;
}