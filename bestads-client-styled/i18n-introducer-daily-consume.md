# 介绍人季度消耗页面多语言配置 (Introducer Quarterly Spend i18n)

## 页面信息
- **文件路径**: `bestads-client-styled/introducer-daily-consume.html`
- **页面名称**: 介绍人季度消耗 (原「每日消耗」, V2.20 调整为按季度聚合)
- **支持语言**: 中文简体 (zh-CN), 英文 (en-US)
- **实现方式**: 页内 `translations` 对象 + `data-i18n` / `data-i18n-placeholder` / `data-i18n-sample`; 语言偏好存 `localStorage.bestadsClientLang`

## 多语言文案对照表

### 1. 页面标题与提示

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| page_title | 介绍人季度消耗 - BestAds | Introducer Quarterly Spend - BestAds |
| main_title | 介绍人季度消耗 | Introducer Quarterly Spend |
| notice_label | 重要提示: | Important: |
| notice_body | 本页按季度展示被介绍客户的广告消耗 (媒体侧口径, USD), 不代表吐点比例或收益. 具体结算金额请以官方对账为准. | This page shows referred clients' ad spend by quarter (media-side, USD). It does not show spit rates or earnings. Settlement amounts are subject to official reconciliation. |

### 2. 指标卡

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| card_total_spend | 总消耗 (USD) | Total Spend (USD) |
| card_customer_count | 客户数 | Clients |

> V2.20 已移除「广告账户数」指标卡.

### 3. 筛选项

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| filter_year | 年度 | Year |
| filter_quarter | 季度 | Quarter |
| filter_customer | 被介绍客户 | Referred Client |
| filter_customer_placeholder | 模糊搜索, 多选由后端支持 | Fuzzy search; multi-select via API |
| btn_search | 查询 | Search |
| btn_reset | 重置 | Reset |

> V2.20 已移除「开始/结束日期」「广告账户」筛选.

### 4. 列表字段

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| col_quarter | 结算季度 | Quarter |
| col_customer_id | 被介绍客户 ID | Referred Client ID |
| col_customer_name | 被介绍客户名称 | Referred Client Name |
| col_consume | 消耗 (USD) | Spend (USD) |
| empty_state | 暂无数据, 请调整筛选条件后重试. | No data. Adjust filters and try again. |

> 列表维度: **季度 × 被介绍客户**; 指标为 **消耗 (USD)**. 不展示日期、媒体、广告账户列.

### 5. 侧栏菜单 (可选扩展)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| nav_introducer_quarterly | 介绍人季度消耗 | Introducer Quarterly Spend |
