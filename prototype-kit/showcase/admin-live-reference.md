# 运营端真实页面基线（Chrome 实测）

> 采集页面：`https://operation-test-ads.bestads.com/customer-list`  
> 采集日期：2026-08-07  
> 采集方式：Chrome 已登录页面，读取可见 DOM、截图和 computed style。  
> 注意：这是测试环境当前实现，不把接口返回的真实客户数据写入原型。

## 1. 页面外壳

| 区域 | 实测值 |
|---|---|
| 浏览器视口 | `1800 × 871`，`devicePixelRatio = 2` |
| 左侧导航 | `224px` 宽，白色背景，右侧 `1px #e4e4e7` 边框 |
| 顶部 Header | `50px` 高，白色背景，底部 `1px #e4e4e7` 边框 |
| 页面背景 | `#f1f3f6` |
| 页面字体 | `-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", ...` |
| 页面基础字号 | `14px`，行高 `22px` |
| 激活菜单 | 高 `42px`、圆角 `8px`、背景 `rgba(0, 107, 230, 0.15)`、文字 `#006be6` |

## 2. 查询区与命令区

- 查询区使用 Ant Design `Card`，当前实测宽 `1544px`、高 `144px`、圆角 `4px`、边框 `#e4e4e7`、无阴影。
- 查询控件高度统一为 `32px`。
- Input / Select 边框为 `#e4e4e7`，圆角 `4px`，水平内边距约 `11px`。
- 主按钮：背景 `#006be6`、白字、`32px` 高、圆角 `4px`、水平 padding `15px`。
- 默认按钮：白色背景、边框 `#e4e4e7`、文字 `rgba(50, 54, 57, 0.88)`。
- 行内操作：Ant Design `Button type="link" size="small"`，文字 `#006be6`，实测高 `24px`、水平 padding `7px`。
- 当前真实命令：添加客户、客户默认权限、批量修改、批量功能开关、自定义字段、导出数据。

## 3. VXE Grid

- Grid class 含：`size--small`、`row--highlight`、`is--fixed-left`、`is--fixed-right`、`is--scroll-y`、`is--scroll-x`。
- 表头背景 `#f4f4f5`，高度 `40px`，字号 `13px`，字重 `700`，文字色 `#606266`。
- 表格 body 字号 `13px`，行高约 `64px`。
- 表头/表体边界圆角为 `4px`。
- 右固定操作列宽度 `280px`。
- 左选择列宽度 `50px`。

### 当前客户管理列宽

| 列 | 宽度 | 对齐 |
|---|---:|---|
| 选择 | 50 | center |
| 客户ID | 100 | center |
| 客户名称 | 150 | center |
| 商户ID | 180 | center |
| 客户级别 | 100 | center |
| BD | 220 | center |
| AM | 220 | center |
| 客户状态 | 100 | center |
| 币种 | 100 | center |
| 当前余额 | 100 | right |
| 已用额度 | 100 | right |
| 信用额度 | 100 | right |
| 预充金额上限 | 120 | right |
| 剩余预充金额 | 120 | right |
| 可用余额 | 100 | right |
| 真实金额 | 100 | right |
| 冻结金额 | 100 | right |
| 注册时间 | 150 | center |
| 最近登录 | 150 | center |
| 操作 | 280 | center，右固定 |

## 4. 状态与分页

- 启用状态使用 Ant Design `Tag`：背景约 `#f0fff3`、边框 `#dff7e6`、文字 `#57d188`、圆角 `4px`、高度 `22px`、水平 padding `7px`。
- 当前页面实测分页总数文案为“共 481 条记录”。
- 默认分页为 `50条/页`。
- 分页器高度 `36px`，顶部间距 `8px`，使用 `vxe-pager size--mini is--background`。
- 当前页按钮 `26 × 26px`，圆角 `4px`，激活背景 `#006be6`。

## 5. 原型同步结论

当前 showcase 中原先的 Admin 基线需要按以上实测值修正，特别是：

1. 主色从 `#1677ff` 修正为 `#006be6`。
2. 侧栏从 `254px` 修正为 `224px`，Header 从 `64px` 修正为 `50px`。
3. 页面背景从泛化后台色修正为 `#f1f3f6`。
4. Card、按钮、输入框统一使用 `4px` 圆角和 `#e4e4e7` 边框。
5. 客户管理表格补齐真实的 20 列、列宽和右固定 `280px` 操作列。

