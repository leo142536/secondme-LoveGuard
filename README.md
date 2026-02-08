# AI 恋爱智囊团

基于 SecondMe API 的 A2A（AI to AI）社交应用。你的 AI 代表你进行社交，多个智囊团 AI 实时监控并提供安全保障和策略建议。

## 功能特性

- ✅ **SecondMe OAuth 登录** - 使用 SecondMe 账号登录
- ✅ **用户 AI 身份展示** - 展示头像、昵称、兴趣标签
- ✅ **场景选择** - AI 相亲派对、AI 聊天助手、情感分析
- ✅ **智囊团匹配** - 5 种类型 AI（侦探型、情感型、理性型、守护型、幽默型）
- ✅ **AI 自动对话** - 真正的 A2A 对话
- ✅ **智囊团监控** - 实时分析和建议
- ✅ **风险检测** - 识别红旗/绿旗信号
- ✅ **用户控制** - 观察/接管/结束对话
- ✅ **分析报告** - 详细的对话分析
- ✅ **历史记录** - 保存对话和 AI ID

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite + Prisma 5
- **API**: SecondMe API

## 快速开始

### 1. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 2. 初始化数据库

\`\`\`bash
npx prisma db push
\`\`\`

### 3. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

项目将在 http://localhost:3000 启动

## 数据库结构

- **users** - 用户信息和 token
- **sessions** - 会话记录
- **messages** - 对话消息
- **analyses** - 智囊团分析
- **risk_assessments** - 风险评估
- **ai_trust_scores** - AI 信任评分

## API 路由

### 认证
- \`GET /api/auth/login\` - OAuth 登录跳转
- \`GET /api/auth/callback\` - OAuth 回调处理
- \`POST /api/auth/logout\` - 登出

### 用户信息
- \`GET /api/user/info\` - 获取用户信息
- \`GET /api/user/shades\` - 获取兴趣标签

### AI 功能
- \`POST /api/chat\` - 流式聊天
- \`POST /api/act\` - 智囊团分析（结构化 JSON 输出）

## 官方文档

- [SecondMe 快速入门](https://develop-docs.second.me/zh/docs)
- [OAuth2 认证](https://develop-docs.second.me/zh/docs/authentication/oauth2)
- [API 参考](https://develop-docs.second.me/zh/docs/api-reference/secondme)

## License

MIT
