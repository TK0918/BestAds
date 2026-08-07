# 运营端前端上下文与组件规范

## 基线

- 采集范围：`apps/web-antd`
- Git commit：`d997f1a90`（完整 commit：`d997f1a90be51391a96017df57a651d47aba6bd6`）
- 采集日期：`2026-08-06`
- 代码库类型：`vben-admin-monorepo` 中的运营端子应用；应用包名为 `@vben/web-antd`。来源：`package.json:2-4`、`apps/web-antd/package.json:1-3`

## 使用方式

这套文档是当前代码的索引，不是独立 PRD，也不会替代接口契约、视觉稿或测试用例。新增页面、组件或接口时，先从本目录找到已落地的模式，再以目标业务目录的现行代码为最终准则；发现代码与本文不一致时，应更新本文。

| 文档 | 解决的问题 |
| --- | --- |
| [00-overview.md](./00-overview.md) | 应用边界、启动、权限、国际化、主题、微前端与状态管理。 |
| [01-api-layer.md](./01-api-layer.md) | 请求客户端、`defineApi`、模块划分、响应映射与统一导出任务。 |
| [02-routes-and-pages.md](./02-routes-and-pages.md) | 路由加载方式、一级菜单、子页面声明与可见性边界。 |
| [03-design-system.md](./03-design-system.md) | 已接入的主题 token、全局样式、表格样式与真实页面视觉构成。 |
| [04-components.md](./04-components.md) | 已实际使用的 Vben、Ant Design Vue、本地业务组件与专项组件。 |
| [05-patterns.md](./05-patterns.md) | 检索、表格、弹窗、字典、权限、导出、状态和页面间跳转的代码模式。 |
| [06-page-baseline-customer-management.md](./06-page-baseline-customer-management.md) | 客户管理页面的可复用实现基线及测试关注点。 |
| [运营端UI规范.md](./运营端UI规范.md) | 后续运营端 HTML 原型与视觉交互实现必须遵循的统一规范；新规则在此持续补充。 |

## 结论状态

| 状态 | 定义 |
| --- | --- |
| **已实际使用** | 在当前 commit 的入口、路由、页面、组件或调用链中有明确的 import、渲染或调用证据。 |
| **代码中存在但未确认使用** | 文件、导出或依赖存在，但本轮没有把它确认成通用页面基线；不能据此要求新页面使用。 |
| **仅 PRD** | 只在 PRD、截图或口头需求出现、当前代码未找到实现。本轮不把 PRD 作为结论来源；当前文档无此类实现结论。 |
| **待确认** | 需要真实后端数据、运行环境、权限配置、产品决策或尚未扫描到的调用方才能确定。 |

## 证据与脱敏规则

- 每项结论后均给出 `来源：`，格式为相对仓库路径和行号；目录盘点类结论会注明扫描范围。
- 本文不复制 token、密钥、真实接口域名、账号、邮箱、手机号、客户数据或下载地址。涉及这些配置时，只说明其存在与行为，并保留源码位置。
- 运行时菜单是否展示、按钮是否可点击取决于后端菜单数据和 `accessCodes`；路由声明不等于所有用户都可见。来源：`apps/web-antd/src/router/access.ts:29-61`、`apps/web-antd/src/router/guard.ts:104-147`

## 范围外与待确认

- 本轮未读取 PRD、设计稿和截图，因此本文没有“仅 PRD”的具体条目。
- `apps/web-antd/src/assets/` 在当前代码树中未发现；静态文件实际位于 `apps/web-antd/public/`。是否存在构建期外部资源管理，**待确认**。来源：`apps/web-antd/public/`（目录盘点）；`apps/web-antd/src/main.ts:1-85`
- 接口真实 host、鉴权凭据、Sentry 连接信息和第三方统计 ID 已按脱敏规则省略。来源：`apps/web-antd/src/api/request.ts:23-136`、`apps/web-antd/vite.config.mts:34-96`、`apps/web-antd/src/setup/setup-sentry.ts:13-49`
