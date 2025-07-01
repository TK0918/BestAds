# 钱包页面多语言配置 (Wallet Page i18n Configuration)

## 页面信息
- **文件路径**: `bestads-client-styled/wallet.html`
- **页面名称**: 钱包/余额管理页面
- **支持语言**: 中文简体 (zh-CN), 英文 (en-US)

## 多语言文案对照表

### 1. 页面标题和导航 (Page Title & Navigation)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| page_title | 钱包 - BestAds | Wallet - BestAds |
| nav_home | 首页 | Home |
| nav_account_management | 账户管理 | Account Management |
| nav_operation_records | 操作记录 | Operation Records |
| nav_rejected_ads | 被拒广告 | Rejected Ads |
| nav_wallet | 余额管理 | Wallet Management |

### 2. 页面主标题和功能区 (Main Title & Function Area)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| main_title | 余额管理 | Wallet Management |
| balance_available | 可用余额 | Available Balance |
| balance_real | 真实金额 | Real Amount |
| balance_frozen | 冻结金额 | Frozen Amount |
| btn_online_recharge | 在线充值 | Online Recharge |
| btn_offline_transfer | 线下转账 | Offline Transfer |
| recharge_note | * 在线充值和线下转账支持多币种，到账金额和到账时间以实际为准。 | * Online recharge and offline transfer support multiple currencies. The credited amount and time are subject to actual conditions. |

### 3. 余额说明文案 (Balance Tooltip Text)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| tooltip_available | 剩余可以使用的余额。 | Remaining balance available for use. |
| tooltip_real | 您真实的现金金额，包含冻结金额。 | Your actual cash amount, including frozen funds. |
| tooltip_frozen | 因为预扣款产生的暂时无法使用的金额。例如：广告账户充值$100，会冻结$100。当确定广告账户完成充值后，会真实扣除$100。 | Temporarily unavailable amount due to pre-deduction. For example: when recharging $100 to an ad account, $100 will be frozen. Once the ad account recharge is confirmed, $100 will be actually deducted. |

### 4. Tab标签页标题 (Tab Headers)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| tab_transaction_detail | 交易明细 | Transaction Details |
| tab_online_recharge | 在线充值 | Online Recharge |
| tab_offline_transfer | 线下转账 | Offline Transfer |

### 5. 交易明细Tab (Transaction Details Tab)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| filter_date | 日期 | Date |
| filter_reason | 变动原因 | Transaction Reason |
| filter_all | 全部 | All |
| reason_online_recharge | 在线充值 | Online Recharge |
| reason_offline_transfer | 线下转账 | Offline Transfer |
| reason_ad_account_recharge | 广告账户充值 | Ad Account Recharge |
| reason_ad_account_recharge_failed | 广告账户充值失败 | Ad Account Recharge Failed |
| btn_filter | 筛选 | Filter |
| btn_export | 导出 | Export |
| col_time | 时间 | Time |
| col_reason | 变动原因 | Reason |
| col_amount_change | 变动金额 | Amount Change |
| col_balance_after | 变动后余额 | Balance After |
| col_remark | 备注 | Remark |

### 6. 在线充值Tab (Online Recharge Tab)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| col_recharge_time | 充值时间 | Recharge Time |
| col_payment_platform | 支付平台 | Payment Platform |
| col_platform_payment_id | 平台的支付ID | Platform Payment ID |
| col_payment_currency | 支付币种 | Payment Currency |
| col_payment_amount | 支付金额 | Payment Amount |
| col_status | 状态 | Status |
| col_credited_currency | 入账币种 | Credited Currency |
| col_credited_amount | 入账金额 | Credited Amount |
| col_completion_time | 完成时间 | Completion Time |
| status_success | 成功 | Success |
| status_failed | 失败 | Failed |
| status_in_progress | 进行中 | In Progress |
| remark_success | 到账成功 | Successfully credited |
| remark_waiting | 等待支付平台确认 | Waiting for payment platform confirmation |
| remark_insufficient_funds | 卡片余额不足 | Insufficient card balance |

### 7. 线下转账Tab (Offline Transfer Tab)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| col_submit_time | 提交时间 | Submit Time |
| col_attachment | 附件 | Attachment |
| col_review_time | 审核时间 | Review Time |
| status_under_review | 审核中 | Under Review |
| status_approved | 成功 | Success |
| status_rejected | 失败 | Failed |
| remark_approved | 审核通过 | Review approved |
| remark_waiting_review | 等待审核 | Waiting for review |
| remark_unclear_proof | 支付凭证不清晰 | Payment proof is unclear |
| link_view_attachment | 查看 | View |

### 8. 在线充值弹窗 (Online Recharge Modal)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| modal_online_recharge_title | 在线充值 | Online Recharge |
| label_recharge_amount | 充值金额 | Recharge Amount |
| placeholder_recharge_amount | 请输入充值金额 | Enter recharge amount |
| label_payment_platform | 支付平台 | Payment Platform |
| placeholder_payment_platform | 请选择支付平台 | Select payment platform |
| label_currency | 币种 | Currency |
| btn_cancel | 取消 | Cancel |
| btn_pay | 去支付 | Go to Pay |
| error_amount_invalid | 请输入大于0的数值，支持两位小数 | Please enter a value greater than 0, supporting two decimal places |
| error_platform_required | 请选择支付平台 | Please select a payment platform |

### 9. 线下转账弹窗 (Offline Transfer Modal)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| modal_offline_transfer_title | 线下转账 | Offline Transfer |
| label_platform_payment_id | 平台的支付ID | Platform Payment ID |
| placeholder_platform_payment_id | 可选，支付平台返回的ID | Optional, ID returned by payment platform |
| label_upload_attachment | 上传附件 | Upload Attachment |
| file_upload_note | 最多可上传10个文件，支持jpg/png/pdf格式 | Maximum 10 files, supports jpg/png/pdf formats |
| btn_submit | 提交 | Submit |

### 10. 提示弹窗 (Notification Modals)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| modal_payment_tip_title | 支付提示 | Payment Reminder |
| payment_tip_message | 请在新标签页完成支付后，再刷新页面。 | Please complete payment in the new tab, then refresh the page. |
| modal_success_title | 提交成功 | Submission Successful |
| offline_success_message | 提交成功，请耐心等待审核。 | Submission successful, please wait patiently for review. |
| btn_got_it | 知道了 | Got it |

### 11. 语言切换 (Language Selector)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| lang_chinese | 中文 | 中文 |
| lang_english | English | English |

### 12. 用户角色 (User Role)

| 键值 (Key) | 中文 (zh-CN) | 英文 (en-US) |
|------------|-------------|-------------|
| user_role | 客户 | Customer |

## 数据示例翻译 (Sample Data Translation)

### 交易明细示例数据

| 中文备注 | 英文备注 |
|---------|---------|
| 账户ID: FB12345678，失败金额: $100.00 | Account ID: FB12345678, Failed Amount: $100.00 |
| 账户ID: FB12345678，充值金额: $100.00 | Account ID: FB12345678, Recharge Amount: $100.00 |
| Wise转账到账 | Wise transfer credited |
| Stripe | Stripe |
| 账户ID: GG87654321，充值金额: $500.00 | Account ID: GG87654321, Recharge Amount: $500.00 |
| PayPal | PayPal |

## 使用说明 (Usage Instructions)

1. **键值命名规范**: 使用下划线分隔的小写字母，如 `balance_available`
2. **层级结构**: 按功能模块分组，便于管理和维护
3. **占位符**: 涉及动态内容的文案，使用 `{variable}` 格式标记变量位置
4. **币种符号**: 美元符号 `$` 在中英文中保持一致
5. **数字格式**: 金额数字格式在中英文中保持一致 (如: 1,000.00)

## 实施建议 (Implementation Suggestions)

1. **前端框架**: 建议使用 Vue.js 的 i18n 插件或类似的国际化解决方案
2. **存储方式**: 可以将翻译内容存储在 JSON 文件中，便于动态加载
3. **默认语言**: 建议以中文为默认语言，英文为备选语言
4. **语言切换**: 支持页面内实时切换，并记住用户的语言偏好
5. **API响应**: 后端API返回的错误信息和状态文本也需要支持多语言

## 扩展性考虑 (Scalability Considerations)

- 为未来可能添加的其他语言预留扩展空间
- 考虑不同语言的文本长度差异，确保UI布局的适应性
- 日期时间格式的本地化处理
- 数字和货币格式的本地化处理 