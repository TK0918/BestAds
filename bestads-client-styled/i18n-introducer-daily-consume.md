# 推荐返佣页面多语言配置 (Referral Rebate i18n)

## 页面信息
- **文件路径**: `bestads-client-styled/introducer-daily-consume.html`
- **页面名称**: 推荐返佣（V2.23 v0.48；原 V2.20「介绍人季度消耗」）
- **支持语言**: 中文简体 (zh-CN), 英文 (en-US)
- **实现方式**: 页内 `translations` 对象 + `data-i18n` / `data-i18n-placeholder` / `data-i18n-sample`；侧栏 `data-i18n-nav` + `common.js` 中 `CLIENT_NAV_I18N`；语言偏好存 `localStorage.bestadsClientLang`

## 多语言文案对照表

### 1. 页面标题

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| page_title | 推荐返佣 - BestAds | Referral Rebate - BestAds |
| main_title | 推荐返佣 | Referral Rebate |
| nav_referral_rebate | 推荐返佣 | Referral Rebate |

### 2. 常驻 Disclaimer

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| disclaimer | 免责声明：本页消耗与佣金数据仅供参考，可能受媒体报表延迟与追踪稳定性影响；实际消耗与佣金结算以财务部门提供的数据为准。 | Disclaimer: The consumption data is for reference only and may be affected by reporting delays and tracking stability. Actual spend and commission settlement shall be based on the data provided by our financial department. |

### 3. 指标卡

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| card_total_spend | 总消耗 (USD) | Total Spend (USD) |
| card_customer_count | 客户数 | Clients |
| card_commission | 佣金 (USD) | Commission (USD) |

### 4. 筛选项

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| filter_year | 年度 | Year |
| filter_quarter | 季度 | Quarter |
| filter_customer | 被介绍客户 | Referred Client |
| filter_customer_placeholder | 模糊搜索, 多选由后端支持 | Fuzzy search; multi-select via API |
| filter_media | 媒体 | Media |
| filter_media_all | 全部 | All |
| filter_account_id | 广告账户ID | Ad Account ID |
| filter_account_id_placeholder | 精确或模糊搜索 | Exact or fuzzy search |
| btn_search | 查询 | Search |
| btn_reset | 重置 | Reset |
| btn_export | 导出 | Export |
| export_empty | 当前筛选下暂无列表数据，无法导出。 | No list data for current filters. Export cancelled. |
| export_filename | 推荐返佣列表 | referral-rebate-list |

### 5. 列表字段

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| col_quarter | 计算季度 | Calculation Quarter |
| col_customer_name | 客户名称 | Client Name |
| col_media | 媒体 | Media |
| col_account_name | 广告账户名称 | Ad Account Name |
| col_account_id | 广告账户ID | Ad Account ID |
| col_spend_range | 消耗范围 | Spend Range |
| col_consume | 消耗 (USD) | Spend (USD) |
| col_spit_rate | 吐点比例 | Rebate Rate |
| col_commission | 佣金 (USD) | Commission (USD) |
| empty_state | 暂无数据, 请调整筛选条件后重试. | No data. Adjust filters and try again. |

> 列表粒度: **季度 × 广告账户**（相对 V2.20 的季度 × 客户已升级）。

### 6. 样例数据（仅原型）

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| customer_b | 客户 B | Client B |
| customer_c | 客户 C | Client C |
