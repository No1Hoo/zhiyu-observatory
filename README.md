# 智渔观察

`智渔观察` 是一个免费的水产产业情报网站 MVP，重点追踪水产养殖技术、智能设备、AI 应用、饲料苗种、动保趋势，并用少量价格行情、电商动态和海外资讯作为流量入口。

## 功能

- 科技观察台风格首页
- 今日情报、技术设备、价格观察、数据来源、广告合作页面
- 信息详情页，保留来源和 AI 摘要说明
- 管理后台 Dashboard
- 来源管理
- 审核工作台
- 内容、专题、广告位管理
- 采集运行记录、来源健康和样本 ingestion 管线
- 受保护的定时采集 API

## 本地运行

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

打开：

- Public site: http://localhost:3000
- Admin: http://localhost:3000/admin
- Ingestion workbench: http://localhost:3000/admin/ingestion

## 采集

本地手动采集：

```bash
npm run ingest:sample
```

线上定时采集入口：

```text
POST /api/cron/ingest
Authorization: Bearer <CRON_SECRET>
```

采集结果会进入后台审核闭环，不会自动发布到公共页面。

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
