# 账户管理页面多语言配置 (Account Management Page i18n Configuration)

## 页面信息
- **文件路径**: `bestads-client-styled/account-management.html`
- **页面名称**: 账户管理页面
- **支持语言**: 中文简体 (zh-CN), 英文 (en-US)

## 多语言文案对照表

### 1. 页面标题和导航 (Page Title & Navigation)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| page_title | 账户管理 - BestAds | Account Management - BestAds |
| nav_home | 首页 | Home |
| nav_account_management | 账户管理 | Account Management |
| nav_operation_records | 操作记录 | Operation Records |
| nav_rejected_ads | 被拒广告 | Rejected Ads |
| nav_wallet | 余额管理 | Wallet Management |

### 2. 页面主标题和描述 (Main Title & Description)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| main_title | 账户管理 | Account Management |
| main_description | 管理您的广告账户，发起开户和充值申请 | Manage your ad accounts, submit account opening and recharge requests |
| balance_available | 可用余额 | Available Balance |
| balance_real | 真实金额 | Real Amount |
| balance_frozen | 冻结金额 | Frozen Amount |
| user_role | 管理员 | Administrator |

### 3. 筛选区域 (Filter Section)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| filter_title | 筛选条件 | Filter Conditions |
| filter_account | 广告账户 | Ad Account |
| filter_account_placeholder | 支持名称和ID模糊查询 | Support fuzzy search by name and ID |
| filter_account_status | 账户状态 | Account Status |
| filter_all_status | 全部状态 | All Status |
| status_active | 活跃 | Active |
| status_inactive | 停用 | Inactive |
| status_pending | 待审核 | Pending |
| status_disabled | 已禁用 | Disabled |
| btn_search | 搜索 | Search |

### 4. 账户列表 (Account List)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| account_list_title | 账户列表 | Account List |
| btn_apply_account | 申请开户 | Apply for Account |
| btn_batch_recharge | 批量充值 | Batch Recharge |
| col_account_name | 广告账户名称 | Ad Account Name |
| col_account_id | 广告账户ID | Ad Account ID |
| col_account_status | 账户状态 | Account Status |
| col_currency | 币种 | Currency |
| col_balance | 余额 | Balance |
| col_timezone | 时区 | Timezone |
| col_create_time | 创建时间 | Create Time |

### 5. 申请开户弹窗 (Account Opening Modal)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| modal_account_opening_title | 申请开户 | Apply for Account Opening |
| label_url | URL | URL |
| btn_add_url | 添加 | Add |
| placeholder_url | 请输入要投放的网站URL | Enter the website URL for advertising |
| url_limit_note | 最少1个，最多20个URL | Minimum 1, maximum 20 URLs |
| label_timezone_quantity | 时区和数量 | Timezone and Quantity |
| btn_add_config | 添加 | Add |
| col_timezone | 时区 | Timezone |
| col_quantity | 数量 | Quantity |
| col_operation | 操作 | Operation |
| placeholder_select_timezone | 请选择时区 | Select timezone |
| timezone_beijing | UTC+8 (北京时间) | UTC+8 (Beijing Time) |
| timezone_utc | UTC+0 (格林威治时间) | UTC+0 (Greenwich Time) |
| timezone_est | UTC-5 (美国东部时间) | UTC-5 (Eastern Time) |
| timezone_pst | UTC-8 (美国西部时间) | UTC-8 (Pacific Time) |
| quantity_limit_note | 单次申请总数量不可超过5个 | Total quantity per application cannot exceed 5 |
| label_bm_id | BM ID | BM ID |
| placeholder_bm_id | 请输入BM ID | Enter BM ID |
| label_bm_name | BM名称 | BM Name |
| placeholder_bm_name | 请输入BM名称 | Enter BM name |
| label_facebook_page | Facebook Page | Facebook Page |
| placeholder_facebook_page | 请输入Facebook Page链接（可选） | Enter Facebook Page link (optional) |
| facebook_page_note | 部分客户开户需要提供Facebook Page，最多20个 | Some customers need to provide Facebook Page for account opening, maximum 20 |
| btn_cancel | 取消 | Cancel |
| btn_submit_application | 提交申请 | Submit Application |

### 6. 批量充值弹窗 (Batch Recharge Modal)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| modal_batch_recharge_title | 批量充值 | Batch Recharge |
| label_select_accounts | 选择充值账户 | Select Recharge Accounts |
| search_placeholder | 支持对账户ID和名称进行搜索 | Support search by account ID and name |
| btn_select_all | 全选 | Select All |
| btn_deselect_all | 取消全选 | Deselect All |
| selected_info | 已选中 {count} 个账户 | Selected {count} accounts |
| col_select | 选择 | Select |
| col_account_info | 账户信息 | Account Info |
| col_currency | 币种 | Currency |
| col_current_balance | 当前余额 | Current Balance |
| col_recharge_amount | 充值金额 | Recharge Amount |
| placeholder_enter_amount | 输入金额 | Enter amount |
| page_info | 显示第 {start} - {end} 条，共 {total} 条记录 | Showing {start} - {end} of {total} records |
| page_size_label | 每页显示 | Items per page |
| btn_prev_page | 上一页 | Previous |
| btn_next_page | 下一页 | Next |

### 7. 充值摘要 (Recharge Summary)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| summary_title | 充值摘要 | Recharge Summary |
| summary_total_amount | 总计金额 | Total Amount |
| summary_selected_count | 选中账户数 | Selected Accounts |
| label_batch_settings | 批量设置 | Batch Settings |
| label_quick_amount | 快速金额设置 | Quick Amount Settings |
| placeholder_custom_amount | 自定义 | Custom |
| btn_apply_amount | 应用 | Apply |
| btn_recharge | 充值 | Recharge |

### 8. 通知消息 (Notification Messages)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| notification_application_submitted | 申请已提交，我们将尽快处理！ | Application submitted, we will process it as soon as possible! |
| notification_max_urls | 最多只能添加20个URL | Maximum 20 URLs can be added |
| notification_min_urls | 至少需要保留一个URL | At least one URL must be kept |
| notification_max_pages | 最多只能添加20个Facebook Page | Maximum 20 Facebook Pages can be added |
| notification_max_configs | 最多只能添加10个配置 | Maximum 10 configurations can be added |
| notification_min_configs | 至少需要保留一个配置 | At least one configuration must be kept |
| notification_url_range_error | 请输入1-20个投放URL | Please enter 1-20 advertising URLs |
| notification_timezone_required | 请为所有配置选择时区 | Please select timezone for all configurations |
| notification_quantity_range_error | 每个配置的数量必须在1-5之间 | Quantity for each configuration must be between 1-5 |
| notification_total_quantity_error | 单次申请数量不可超过5个 | Total quantity per application cannot exceed 5 |
| notification_page_limit_error | Facebook Page不能超过20个 | Facebook Pages cannot exceed 20 |
| notification_account_opening_success | 开户申请已提交！申请账户总数量：{quantity}个，投放URL：{urls}个 | Account opening application submitted! Total accounts: {quantity}, URLs: {urls} |
| notification_batch_recharge_success | 批量充值申请已提交！共{count}个账户，总金额${amount} | Batch recharge application submitted! {count} accounts, total amount ${amount} |
| notification_select_accounts_error | 请至少选择一个账户并设置有效的充值金额 | Please select at least one account and set a valid recharge amount |
| notification_filter_completed | 筛选完成 | Filter completed |

### 9. 表单验证错误 (Form Validation Errors)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| error_url_required | 请输入要投放的网站URL | Please enter the website URL for advertising |
| error_timezone_required | 请选择时区 | Please select timezone |
| error_quantity_required | 请输入数量 | Please enter quantity |
| error_quantity_min | 数量不能少于1 | Quantity cannot be less than 1 |
| error_quantity_max | 数量不能超过5 | Quantity cannot exceed 5 |
| error_amount_min | 最低充值金额：$10 | Minimum recharge amount: $10 |
| error_bm_id_format | BM ID格式不正确 | BM ID format is incorrect |
| error_facebook_page_format | Facebook Page链接格式不正确 | Facebook Page link format is incorrect |

### 10. 状态文本 (Status Text)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| status_active_display | 活跃 | Active |
| status_inactive_display | 停用 | Inactive |
| status_pending_display | 待审核 | Pending |
| status_disabled_display | 已禁用 | Disabled |
| multiple_status_selected | 已选择 {count} 个状态 | {count} statuses selected |

### 11. 排序功能 (Sorting Function)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| sort_account_status | 账户状态 | Account Status |
| sort_balance | 余额 | Balance |
| sort_create_time | 创建时间 | Create Time |
| sort_ascending | 升序 | Ascending |
| sort_descending | 降序 | Descending |

### 12. 账户信息示例数据 (Sample Account Data)

| 中文账户名称 | 英文账户名称 |
|-------------|-------------|
| 测试广告账户01 | Test Ad Account 01 |
| 测试广告账户02 | Test Ad Account 02 |
| 测试广告账户03 | Test Ad Account 03 |
| Google广告账户01 | Google Ad Account 01 |
| Facebook跨境电商账户 | Facebook Cross-border E-commerce Account |
| Facebook游戏推广账户 | Facebook Game Promotion Account |
| Google搜索广告账户 | Google Search Ads Account |
| Facebook本地服务账户 | Facebook Local Services Account |
| Facebook品牌推广账户 | Facebook Brand Promotion Account |
| Google视频广告账户 | Google Video Ads Account |
| Facebook应用推广账户 | Facebook App Promotion Account |
| Google购物广告账户 | Google Shopping Ads Account |

## JavaScript 通知消息模板

### 成功消息模板
```javascript
// 中文
const successMessages_zh = {
  accountOpening: '开户申请已提交！申请账户总数量：${totalQuantity}个，投放URL：${urlCount}个',
  batchRecharge: '批量充值申请已提交！共${accountCount}个账户，总金额$${totalAmount}'
};

// 英文
const successMessages_en = {
  accountOpening: 'Account opening application submitted! Total accounts: ${totalQuantity}, URLs: ${urlCount}',
  batchRecharge: 'Batch recharge application submitted! ${accountCount} accounts, total amount $${totalAmount}'
};
```

### 错误消息模板
```javascript
// 中文
const errorMessages_zh = {
  urlRange: '请输入1-20个投放URL',
  quantityRange: '每个配置的数量必须在1-5之间',
  totalQuantityLimit: '单次申请数量不可超过5个',
  timezoneRequired: '请为所有配置选择时区',
  pageLimit: 'Facebook Page不能超过20个',
  accountSelectionRequired: '请至少选择一个账户并设置有效的充值金额'
};

// 英文
const errorMessages_en = {
  urlRange: 'Please enter 1-20 advertising URLs',
  quantityRange: 'Quantity for each configuration must be between 1-5',
  totalQuantityLimit: 'Total quantity per application cannot exceed 5',
  timezoneRequired: 'Please select timezone for all configurations',
  pageLimit: 'Facebook Pages cannot exceed 20',
  accountSelectionRequired: 'Please select at least one account and set a valid recharge amount'
};
```

## 使用说明 (Usage Instructions)

1. **键值命名规范**: 
   - 使用下划线分隔的小写字母
   - 按功能模块和组件分组
   - 便于在JavaScript中调用

2. **动态内容处理**:
   - 使用 `{variable}` 格式标记变量位置
   - 支持数字和文本变量替换
   - 保持数据格式的本地化

3. **表单验证集成**:
   - 验证错误信息支持多语言
   - 成功/失败通知信息本地化
   - 占位符文本和标签文本分离管理

4. **状态和枚举值**:
   - 账户状态、时区选项等枚举值翻译
   - 保持业务逻辑的一致性
   - 支持状态组合显示

## 实施建议 (Implementation Suggestions)

1. **弹窗组件化**:
   - 开户申请和批量充值弹窗独立翻译
   - 复用公共的按钮和验证文案
   - 支持弹窗标题和内容的动态切换

2. **表单验证增强**:
   - 实时验证错误提示多语言化
   - 成功提交后的确认信息本地化
   - 数据格式验证消息翻译

3. **用户体验优化**:
   - 保持交互逻辑不变，仅切换文案
   - 考虑不同语言文本长度对布局的影响
   - 数字格式和日期格式的本地化

4. **数据绑定**:
   - 示例账户数据支持多语言显示
   - 状态颜色和图标保持不变
   - 排序和筛选功能的文案翻译

## 扩展性考虑 (Scalability Considerations)

- 支持新增账户类型的名称翻译
- 预留新的时区选项翻译空间
- 为新的验证规则预留错误消息模板
- 考虑货币符号和数字格式的地区化显示 