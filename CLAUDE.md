# SecondMe 集成项目

## 应用信息

- **App Name**: 海王/海后鉴定专家
- **Client ID**: 18e8f797-77da-***（部分隐藏）

## API 文档

开发时请参考官方文档（从 `.secondme/state.json` 的 `docs` 字段读取）：

| 文档 | 链接 |
|------|------|
| 快速入门 | https://develop-docs.second.me/zh/docs |
| OAuth2 认证 | https://develop-docs.second.me/zh/docs/authentication/oauth2 |
| API 参考 | https://develop-docs.second.me/zh/docs/api-reference/secondme |
| 错误码 | https://develop-docs.second.me/zh/docs/errors |

## 关键信息

- **API 基础 URL**: https://app.mindos.com/gate/lab
- **OAuth 授权 URL**: https://go.second.me/oauth/
- **Access Token 有效期**: 2 小时
- **Refresh Token 有效期**: 30 天

> 所有 API 端点配置请参考 `.secondme/state.json` 中的 `api` 和 `docs` 字段

## 已选模块

根据 App Info 中的 Allowed Scopes 自动推断：

| 模块 | 说明 | 来源 |
|------|------|------|
| ✅ **auth** | OAuth 认证 | user.info（必选） |
| ✅ **profile** | 用户信息展示 | user.info.shades, user.info.softmemory |
| ✅ **chat** | 聊天功能 | chat |
| ✅ **act** | 结构化动作判断 | chat（复用权限） |

## 权限列表 (Scopes)

根据 App Info 中的 Allowed Scopes：

| 权限 | 说明 | 状态 |
|------|------|------|
| `user.info` | 用户基础信息 | ✅ 已授权 |
| `user.info.shades` | 用户兴趣标签 | ✅ 已授权 |
| `user.info.softmemory` | 软记忆数据 | ✅ 已授权 |
| `chat` | 聊天功能 | ✅ 已授权 |
| `voice` | 语音功能 | ✅ 已授权（暂不生成代码） |

## 数据库

- **类型**: SQLite
- **连接串**: file:./dev.db
- **说明**: 数据存储在项目根目录的 `dev.db` 文件中
