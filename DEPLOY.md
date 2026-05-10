# 部署指南 — 智渔观察

支持两种部署平台：**Vercel**（推荐，Next.js 原生）和 **Railway**（支持 SQLite 持久化）。

---

## Vercel 部署

### 1. Fork / Clone

```bash
git clone https://github.com/No1Hoo/zhiyu-observatory.git
cd zhiyu-observatory
```

### 2. 创建 Vercel 项目

```bash
npm i -g vercel
vercel login
vercel
```

或在 [vercel.com](https://vercel.com) 导入 GitHub 仓库。

### 3. 环境变量

在 Vercel 项目 Settings → Environment Variables 配置：

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | SQLite 路径（Railway 用） | `file:./prisma/dev.db` |
| `CRON_SECRET` | 定时采集接口密钥 | 随机字符串，≥32位 |
| `ADMIN_PASSWORD` | Admin 后台密码 | 强密码 |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `https://your-domain.vercel.app` |
| `MINIMAX_API_KEY` | AI 摘要（可选） | MiniMax API Key |
| `MINIMAX_MODEL` | AI 模型（可选） | `MiniMax-Text-01` |
| `ALERT_WEBHOOK_URL` | 告警 Webhook（可选） | Slack/钉钉 Webhook URL |

### 4. 数据库处理

**SQLite 在 Vercel 的限制**：Vercel 无持久文件系统，SQLite 文件重启后会丢失。

**方案 A：Vercel Postgres（推荐）**
1. 创建 Vercel Postgres 数据库（Marketplace → Postgres）
2. `DATABASE_URL` 改为 Postgres 连接字符串
3. 运行 `npx prisma migrate deploy`

**方案 B：Railway SQLite + Vercel 前端**
- 前端用 Vercel，数据库用 Railway（SQLite 持久）
- 在 Railway 部署 Node.js 服务处理 API 请求

### 5. 定时采集

在 Vercel 项目 Settings → Cron Jobs：
```
URL: /api/cron/ingest
Schedule: 0 22 * * *   # 每天 UTC 22:00
Authorization: Bearer <CRON_SECRET>
```

或使用 GitHub Actions（见仓库 `.github/workflows/ingest-cron.yml`）。

---

## Railway 部署

### 1. 创建 Railway 项目

```bash
railway login
railway init
railway add --variable DATABASE_URL=$(railway variables --get DATABASE_URL)
```

或在 [railway.app](https://railway.app) 导入 GitHub 仓库。

### 2. 配置

- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment Variables**: 参考上方环境变量表格
- **SQLite 路径**: `DATABASE_URL=file:./data/dev.db`

Railway 的 `/data` 目录持久化，SQLite 可安全存储。

### 3. 定时任务

Railway 支持 Cron Jobs，添加：
```
railway variables --set CRON_SECRET=<secret>
railway add --cron "0 22 * * *" -- https://your-domain.railway.app/api/cron/ingest
```

---

## 本地开发

```bash
cp .env.example .env
# 编辑 .env，设置 ADMIN_PASSWORD 等

npm install
npx prisma generate
npx prisma db push        # 或 npm run db:migrate
npm run db:seed          # 填充示例数据
npm run dev
```

---

## 数据库迁移

生产环境：
```bash
npx prisma migrate deploy
```

---

## 常见问题

**Q: Vercel 上 SQLite 数据丢失？**
A: Vercel 文件系统在重启后清空。请使用 Vercel Postgres 或 Railway 持久化存储。

**Q: MiniMax API 不工作？**
A: 检查 `MINIMAX_API_KEY` 是否配置，API 密钥格式是否正确。可在本地用 `minimax_proxy.py` 测试。

**Q: Admin 后台无法登录？**
A: 检查 `ADMIN_PASSWORD` 环境变量是否设置，密码是否正确。