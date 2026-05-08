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
- 样本 ingestion 管线

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
