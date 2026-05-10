# 部署指南 — 智渔观察

当前代码使用 **Prisma + SQLite**。SQLite 需要持久化磁盘，因此第一版推荐部署到 **Railway** 这类支持持久卷的平台；如果要用 **Vercel**，建议先迁移到 PostgreSQL，或只把 Vercel 作为后续前端托管方案。

---

## Railway 部署（当前推荐）

### 1. 创建 Railway 项目

```bash
railway login
railway init
```

或在 [railway.app](https://railway.app) 导入 GitHub 仓库。

### 2. 配置

仓库已经包含 `railway.json`：

- **Build Command**: `npm run db:generate && npm run build`
- **Start Command**: `npm run start`
- **Healthcheck Path**: `/api/health`
- **SQLite 路径**: `DATABASE_URL=file:/data/zhiyu.db`

`npm run start` 会在服务启动前执行数据库结构检查；如果数据库是空的，会自动 seed 初始内容。

### 3. 环境变量

在 Railway Variables 配置：

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | SQLite 持久化路径 | `file:/data/zhiyu.db` |
| `CRON_SECRET` | 定时采集接口密钥 | 随机字符串，≥32位 |
| `ADMIN_PASSWORD` | Admin 后台密码 | 强密码 |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `https://your-domain.railway.app` |
| `MINIMAX_API_KEY` | AI 摘要（可选） | MiniMax API Key |
| `MINIMAX_MODEL` | AI 模型（可选） | `MiniMax-Text-01` |
| `ALERT_WEBHOOK_URL` | 告警 Webhook（可选） | Slack/钉钉 Webhook URL |

### 4. 定时任务

Railway 支持 Cron Jobs，添加：

```
railway variables --set CRON_SECRET=<secret>
railway add --cron "0 22 * * *" -- https://your-domain.railway.app/api/cron/ingest
```

也可以使用 GitHub Actions（见仓库 `.github/workflows/ingest-cron.yml`），需要在 GitHub Secrets 配置：

| Secret | 说明 |
|--------|------|
| `ZHIYU_INGEST_URL` | `https://your-domain.railway.app/api/cron/ingest` |
| `CRON_SECRET` | 与部署平台一致的密钥 |

---

## Vercel 部署（需要数据库迁移）

Vercel 的 serverless 文件系统不适合当前 SQLite 持久化方案。不能只把 `DATABASE_URL` 改成 PostgreSQL 连接串，因为 `prisma/schema.prisma` 当前 datasource 是 `sqlite`。

如果后续要部署到 Vercel，先做数据库迁移：

1. 将 Prisma datasource provider 从 `sqlite` 改为 `postgresql`
2. 使用 Vercel Postgres、Neon、Supabase 或 Railway Postgres
3. 生成并验证新的 PostgreSQL migration
4. 执行 `npx prisma migrate deploy`
5. 再在 Vercel 导入 GitHub 仓库并配置环境变量

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

当前 SQLite 版本：

```bash
npm run db:migrate
```

如果未来迁移到 PostgreSQL，生产环境改用：

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
