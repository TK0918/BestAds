# 修改日志

## 2024-03-12 - 新增客户对账日报功能

### 新增文件
- `admin-system/reports/customer-reconciliation-daily-report.html` - 客户对账日报页面

### 功能实现

#### Tab1: 日报页面
- 筛选功能：商户ID（模糊搜索）、客户名称（模糊搜索）、统计日期（默认昨天）
- 数据统计表格展示：
  - 统计日期、商户ID、客户名称
  - 应收总额、充值总额、消耗总额
  - 本月应收、本月充值、本月消耗
  - 累计未付账单金额、累计付账单数
- 导出Excel功能

#### Tab2: 期初数据设定页面
- 筛选功能：商户ID（模糊搜索）、客户名称（模糊搜索）
- 列表展示：
  - 商户ID、客户名称
  - 期初应收款、期初充值、期初消耗（支持正负值，保留两位小数）
  - 期初日期、修改人、最后修改时间
  - 操作（编辑、删除）
- 模板下载功能：下载CSV格式的批量上传模板
- 批量上传功能：
  - 支持CSV、XLSX、XLS格式文件
  - 文件解析和数据验证
  - 预览上传效果（显示总条数、有效条数、失败原因）
  - 数据验证规则：
    - 商户ID必填，需判断是否存在
    - 期初应收、期初充值、期初消耗支持正负值，保留两位小数，四舍五入
    - 期初日期格式：年-月-日
  - 覆盖已存在数据的处理
  - 只上传有效数据
- 单条编辑功能：
  - 支持修改期初收款、期初充值、期初消耗、期初日期
  - 商户ID字段为只读，不允许修改
  - 保存后更新修改人和最后修改时间
  - 提示：保存成功后，期初数据会应用到下次统计任务中，历史数据不更新
- 导出功能：导出当前已设定的期初数据
- 删除功能：二次确认删除，删除后下次统计不使用期初数据

### 更新的文件
更新了所有报表文件的侧边栏菜单，添加"客户对账日报"链接：
- `admin-system/reports/customer-recharge-report.html`
- `admin-system/reports/account-recharge-report.html`
- `admin-system/reports/account-consume-report.html`
- `admin-system/reports/negative-ad-report.html`
- `admin-system/reports/report1.html`
- `admin-system/reports/recharge-distribution-report.html`
- `admin-system/reports/profit-fluctuation-report.html`
- `admin-system/reports/data-report.html`
- `admin-system/reports/customer-fund-change-report.html`
- `admin-system/reports/consume-analysis-report.html`

### 技术实现
- 使用Tailwind CSS进行样式设计
- 使用FontAwesome图标库
- 响应式设计，支持移动端和桌面端
- Tab切换功能
- 模态框交互（批量上传、编辑、删除确认）
- CSV文件解析和数据验证
- 数据格式化显示（货币格式、日期格式）
- 通知提示功能

