# 智渔观察

`智渔观察` 是一个免费的水产产业情报网站 MVP，重点追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势，并用少量价格行情、电商动态和海外资讯作为流量入口。

## 功能

- 科技观察台风格首页，含趋势雷达（动态分类统计）
- 今日情报（按分类分组）、技术设备（分类筛选）、价格观察、数据来源、专题页
- 信息详情页（面包屑导航、相对时间、JSON-LD Article schema）
- 管理后台：Dashboard / Sources / Ingestion / Review Queue / Content（筛选+分页+批量）/ Topics+Ads（CRUD模态框）/ Inquiries（合作意向）
- 受保护的定时采集 API（HMAC-SHA256 Cookie 认证）
- MiniMax AI 摘要（可选配置，20s 超时 graceful fallback）
- RSS feed 采集（rss-parser）+ 传统网页采集（regex anchor）
- 合作意向表单（Inquiry model）+ 广告位管理（AdSlot model）

## 本地运行

```bash
npm install
cp .env.example .env
# 编辑 .env，设置 ADMIN_PASSWORD, CRON_SECRET 等
npx prisma generate
npx prisma db push        # 创建/同步数据库 schema
npm run db:seed           # 填充示例数据（27条 intel + 价格/专题/广告位）
npm run dev
```

打开：
- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin（默认无密码，配置 ADMIN_PASSWORD 后生效）

## 采集

本地手动采集：

```bash
npm run ingest:official
npm run ingest:sample
```

线上定时采集入口：

```text
POST /api/cron/ingest
Authorization: Bearer <CRON_SECRET>
```

`ingest:official` 会抓取配置中的官方公开网页列表，`ingest:sample` 只用于本地演示。采集结果会进入后台审核闭环，不会自动发布到公共页面。

## 部署与定时任务

需要配置环境变量：

```text
DATABASE_URL=<production database url>
CRON_SECRET=<long random secret>
```

如果使用 GitHub Actions 调用线上采集接口，在仓库 Secrets 中配置：

```text
ZHIYU_INGEST_URL=https://your-domain.com/api/cron/ingest
CRON_SECRET=<same secret as deployment>
```

`.github/workflows/ingest-cron.yml` 默认每天 UTC 22:15 运行，也可以在 GitHub Actions 手动触发。

## 测试

```bash
npm run test
npm run build
npm run test:e2e
```

## 设计文档

- `docs/superpowers/specs/2026-05-08-zhiyu-observatory-design.md`

## 说明

当前 MVP 使用 SQLite 便于本地开发。`npm run db:migrate` 会应用仓库中的初始 SQL schema 到本地 `prisma/dev.db`，数据库文件不会提交到 Git。
