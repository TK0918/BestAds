# 被拒广告页面多语言配置

## 配置说明
本文件定义了被拒广告页面(ad-review-notifications.html)的多语言翻译配置，支持中文简体(zh-CN)和英文(en-US)。

## 语言配置

### 1. 页面标题和导航 (6项)
```javascript
// 页面标题
page_title: {
  "zh-CN": "被拒广告 - BestAds",
  "en-US": "Rejected Ads - BestAds"
}

// 导航菜单
nav_home: {
  "zh-CN": "首页",
  "en-US": "Home"
}

nav_account_management: {
  "zh-CN": "账户管理",
  "en-US": "Account Management"
}

nav_operation_records: {
  "zh-CN": "操作记录",
  "en-US": "Operation Records"
}

nav_ad_review_notifications: {
  "zh-CN": "被拒广告",
  "en-US": "Rejected Ads"
}

nav_wallet: {
  "zh-CN": "余额管理",
  "en-US": "Wallet Management"
}
```

### 2. 页面主标题和描述 (7项)
```javascript
// 主标题
main_title: {
  "zh-CN": "被拒广告",
  "en-US": "Rejected Ads"
}

// 页面描述
page_description: {
  "zh-CN": "查看您的广告审核结果和详细说明，了解不通过的具体原因",
  "en-US": "View your ad review results and detailed explanations, understand the specific reasons for rejection"
}

// 语言选择器
language_chinese: {
  "zh-CN": "中文",
  "en-US": "Chinese"
}

language_english: {
  "zh-CN": "English",
  "en-US": "English"
}

// 用户角色
user_role: {
  "zh-CN": "客户",
  "en-US": "Customer"
}

// 余额信息
available_balance: {
  "zh-CN": "可用余额",
  "en-US": "Available Balance"
}

// 余额详情
real_amount: {
  "zh-CN": "真实金额",
  "en-US": "Real Amount"
}

frozen_amount: {
  "zh-CN": "冻结金额",
  "en-US": "Frozen Amount"
}
```

### 3. 统计信息 (3项)
```javascript
// 统计标题
total_notifications: {
  "zh-CN": "总通知",
  "en-US": "Total Notifications"
}

// 记录显示格式
showing_records: {
  "zh-CN": "显示 {from} 到 {to} 条，共 {total} 条记录",
  "en-US": "Showing {from} to {to} of {total} records"
}

// 分页信息
records_text: {
  "zh-CN": "条记录",
  "en-US": "records"
}
```

### 4. 筛选区域 (9项)
```javascript
// 筛选标题
filter_conditions: {
  "zh-CN": "筛选条件",
  "en-US": "Filter Conditions"
}

// 时间筛选
creation_time: {
  "zh-CN": "创建时间",
  "en-US": "Creation Time"
}

review_time: {
  "zh-CN": "审核时间",
  "en-US": "Review Time"
}

time_to: {
  "zh-CN": "至",
  "en-US": "To"
}

// 筛选按钮
filter_button: {
  "zh-CN": "筛选",
  "en-US": "Filter"
}

reset_button: {
  "zh-CN": "重置",
  "en-US": "Reset"
}

refresh_button: {
  "zh-CN": "刷新",
  "en-US": "Refresh"
}

// 刷新状态
refreshing: {
  "zh-CN": "刷新中...",
  "en-US": "Refreshing..."
}

// 表格标题
table_title: {
  "zh-CN": "被拒广告",
  "en-US": "Rejected Ads"
}
```

### 5. 表格列标题 (11项)
```javascript
// 表格列名
column_creation_time: {
  "zh-CN": "创建时间",
  "en-US": "Creation Time"
}

column_review_time: {
  "zh-CN": "审核时间",
  "en-US": "Review Time"
}

column_adaccount_id: {
  "zh-CN": "广告账户ID",
  "en-US": "Adaccount ID"
}

column_adaccount_name: {
  "zh-CN": "广告账户名称",
  "en-US": "Adaccount Name"
}

column_campaign_id: {
  "zh-CN": "推广活动ID",
  "en-US": "Campaign ID"
}

column_campaign_name: {
  "zh-CN": "推广活动名称",
  "en-US": "Campaign Name"
}

column_adset_id: {
  "zh-CN": "广告组ID",
  "en-US": "Adset ID"
}

column_adset_name: {
  "zh-CN": "广告组名称",
  "en-US": "Adset Name"
}

column_ad_id: {
  "zh-CN": "广告ID",
  "en-US": "Ad ID"
}

column_ad_name: {
  "zh-CN": "广告名称",
  "en-US": "Ad Name"
}

column_reason: {
  "zh-CN": "拒绝原因",
  "en-US": "Reason"
}
```

### 6. 站内信抽屉 (8项)
```javascript
// 抽屉标题
inbox_title: {
  "zh-CN": "站内信通知",
  "en-US": "Inbox Notifications"
}

// 历史通知
inbox_history_title: {
  "zh-CN": "站内信历史通知",
  "en-US": "Inbox History Notifications"
}

inbox_description: {
  "zh-CN": "显示所有广告审核不通过的通知记录",
  "en-US": "Display all ad review rejection notification records"
}

// 审核状态
review_rejected: {
  "zh-CN": "审核不通过",
  "en-US": "Review Rejected"
}

// 通知内容
notification_content: {
  "zh-CN": "通知内容",
  "en-US": "Notification Content"
}

// ID标签
account_label: {
  "zh-CN": "Account:",
  "en-US": "Account:"
}

campaign_label: {
  "zh-CN": "Campaign:",
  "en-US": "Campaign:"
}

adset_label: {
  "zh-CN": "Adset:",
  "en-US": "Adset:"
}

ad_label: {
  "zh-CN": "Ad:",
  "en-US": "Ad:"
}
```

### 7. 详情模态框 (2项)
```javascript
// 详情标题
detail_modal_title: {
  "zh-CN": "广告审核详情",
  "en-US": "Ad Review Details"
}

// 关闭按钮（通用图标，无需翻译文字）
close_button: {
  "zh-CN": "关闭",
  "en-US": "Close"
}
```

### 8. 分页控件 (3项)
```javascript
// 分页按钮
previous_page: {
  "zh-CN": "上一页",
  "en-US": "Previous"
}

next_page: {
  "zh-CN": "下一页",
  "en-US": "Next"
}

current_page: {
  "zh-CN": "当前页",
  "en-US": "Current Page"
}
```

### 9. 示例数据翻译 (25项)
```javascript
// 广告账户名称示例
sample_account_name_1: {
  "zh-CN": "张三科技广告账户",
  "en-US": "ZhangSan Tech Ad Account"
}

sample_account_name_2: {
  "zh-CN": "保健品公司账户",
  "en-US": "Health Products Company Account"
}

sample_account_name_3: {
  "zh-CN": "减肥产品公司",
  "en-US": "Weight Loss Products Company"
}

sample_account_name_4: {
  "zh-CN": "加密货币投资",
  "en-US": "Cryptocurrency Investment"
}

sample_account_name_5: {
  "zh-CN": "医疗器械公司",
  "en-US": "Medical Equipment Company"
}

// 推广活动名称示例
sample_campaign_name_1: {
  "zh-CN": "智能手机推广活动",
  "en-US": "Smartphone Promotion Campaign"
}

sample_campaign_name_2: {
  "zh-CN": "保健品推广",
  "en-US": "Health Products Promotion"
}

sample_campaign_name_3: {
  "zh-CN": "减肥产品推广",
  "en-US": "Weight Loss Products Promotion"
}

sample_campaign_name_4: {
  "zh-CN": "数字货币投资",
  "en-US": "Digital Currency Investment"
}

sample_campaign_name_5: {
  "zh-CN": "医疗设备推广",
  "en-US": "Medical Equipment Promotion"
}

// 广告组名称示例
sample_adset_name_1: {
  "zh-CN": "智能手机目标受众",
  "en-US": "Smartphone Target Audience"
}

sample_adset_name_2: {
  "zh-CN": "保健品受众",
  "en-US": "Health Products Audience"
}

sample_adset_name_3: {
  "zh-CN": "减肥产品受众",
  "en-US": "Weight Loss Products Audience"
}

sample_adset_name_4: {
  "zh-CN": "投资者受众",
  "en-US": "Investor Audience"
}

sample_adset_name_5: {
  "zh-CN": "医疗设备受众",
  "en-US": "Medical Equipment Audience"
}

// 广告名称示例
sample_ad_name_1: {
  "zh-CN": "革命性智能手机广告",
  "en-US": "Revolutionary Smartphone Ad"
}

sample_ad_name_2: {
  "zh-CN": "神奇保健品广告",
  "en-US": "Miracle Health Product Ad"
}

sample_ad_name_3: {
  "zh-CN": "快速减肥产品",
  "en-US": "Quick Weight Loss Product"
}

sample_ad_name_4: {
  "zh-CN": "数字货币投资机会",
  "en-US": "Digital Currency Investment Opportunity"
}

sample_ad_name_5: {
  "zh-CN": "家用医疗设备",
  "en-US": "Home Medical Equipment"
}

// 拒绝原因示例
sample_reason_1: {
  "zh-CN": "广告文案涉及夸大宣传，建议调整"重新定义未来科技"等表述，使用更客观的产品描述。同时视频演示中的功能展示需要更加真实。",
  "en-US": "Ad copy involves exaggerated claims. Suggest adjusting expressions like 'redefining future technology' and using more objective product descriptions. Video demonstrations should show more realistic features."
}

sample_reason_2: {
  "zh-CN": "严重违反广告法规，涉及虚假医疗声明。广告中"包治百病"、"无副作用"、"立竿见影"等表述属于虚假宣传，必须删除所有医疗功效声明。",
  "en-US": "Serious violation of advertising regulations, involving false medical claims. Expressions like 'cure all diseases', 'no side effects', 'immediate results' are false advertising and all medical efficacy claims must be removed."
}

sample_reason_3: {
  "zh-CN": "减肥效果描述严重不实，"7天瘦20斤"等承诺属于虚假宣传，可能误导消费者并造成健康风险。图片中的对比效果图涉嫌PS造假。",
  "en-US": "Weight loss effect descriptions are seriously false. Promises like 'lose 20 pounds in 7 days' are false advertising that may mislead consumers and cause health risks. Before/after comparison images appear to be photoshopped."
}

sample_reason_4: {
  "zh-CN": "涉嫌金融欺诈，"月入百万"等收益承诺严重违反投资广告规范。加密货币投资风险极高，平台不允许此类高风险投资产品的推广。",
  "en-US": "Suspected financial fraud. Income promises like 'earn millions monthly' seriously violate investment advertising standards. Cryptocurrency investment risks are extremely high, and the platform does not allow promotion of such high-risk investment products."
}

sample_reason_5: {
  "zh-CN": "医疗器械广告缺少必要的资质证明，产品功效描述需要提供相关认证文件。建议补充FDA认证或CE认证等资质证明。",
  "en-US": "Medical device ads lack necessary qualification certificates. Product efficacy descriptions require relevant certification documents. Recommend supplementing FDA or CE certification and other qualification proofs."
}

// 审核消息示例
sample_message_1: {
  "zh-CN": "您的广告因包含夸大性宣传内容被拒绝，请根据建议进行修改后重新提交。如有疑问，请联系客服。",
  "en-US": "Your ad was rejected for containing exaggerated promotional content. Please modify according to suggestions and resubmit. Contact customer service if you have questions."
}

sample_message_2: {
  "zh-CN": "您的保健品广告严重违反平台规定，涉及虚假医疗声明，已被永久拒绝。请重新制作符合法规的广告内容。",
  "en-US": "Your health product ad seriously violates platform regulations, involving false medical claims, and has been permanently rejected. Please create compliant ad content."
}

sample_message_3: {
  "zh-CN": "您的减肥产品广告因夸大效果和虚假宣传被拒绝，请提供真实有效的产品信息，删除所有不实承诺。",
  "en-US": "Your weight loss product ad was rejected for exaggerated effects and false advertising. Please provide true and effective product information and remove all false promises."
}

sample_message_4: {
  "zh-CN": "您的数字货币投资广告因涉嫌金融欺诈被永久拒绝，此类产品不符合平台投放政策。请选择合规的投资产品进行推广。",
  "en-US": "Your digital currency investment ad was permanently rejected for suspected financial fraud. Such products do not comply with platform policies. Please choose compliant investment products for promotion."
}

sample_message_5: {
  "zh-CN": "您的医疗器械广告需要补充相关资质证明文件，请提供FDA或CE认证后重新提交审核。",
  "en-US": "Your medical device ad needs supplementary qualification certificates. Please provide FDA or CE certification and resubmit for review."
}
```

### 10. 功能提示和错误信息 (5项)
```javascript
// 功能提示
no_data: {
  "zh-CN": "暂无数据",
  "en-US": "No data available"
}

loading: {
  "zh-CN": "加载中...",
  "en-US": "Loading..."
}

filter_applied: {
  "zh-CN": "筛选已应用",
  "en-US": "Filter applied"
}

filter_reset: {
  "zh-CN": "筛选已重置",
  "en-US": "Filter reset"
}

data_refreshed: {
  "zh-CN": "数据已刷新",
  "en-US": "Data refreshed"
}
```

## 使用说明

1. **键值命名规范**：使用下划线分隔的小写字母，如 `page_title`、`filter_conditions`
2. **分组管理**：按功能模块分组，便于维护和查找
3. **示例数据**：包含完整的示例数据翻译，确保测试环境的国际化效果
4. **消息模板**：支持变量替换的消息模板，如 `{from}`、`{to}`、`{total}`
5. **特殊内容**：包含专业术语的准确翻译，如广告行业术语

## 实现建议

1. 在页面加载时根据用户语言偏好动态替换文本内容
2. 表格数据和示例内容也应支持多语言切换
3. 日期时间格式根据不同语言环境进行本地化
4. 数字和货币格式按照不同地区习惯显示
5. 错误提示和操作反馈信息的多语言支持

## 总计翻译项目
- 页面标题和导航：6项
- 页面主标题和描述：7项  
- 统计信息：3项
- 筛选区域：9项
- 表格列标题：11项
- 站内信抽屉：8项
- 详情模态框：2项
- 分页控件：3项
- 示例数据翻译：25项
- 功能提示和错误信息：5项

**总计：79个翻译项目** 