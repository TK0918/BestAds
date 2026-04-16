## AppLovin 媒体授权 & 账户管理 PRD

### 1. 需求背景 & 目标
**背景**:
- 现有媒体接入页需要支持 AppLovin, 让客户完成媒体侧授权, 并在归因平台侧建立可用的同步链路.
- 需要一个二级管理页, 用于增删改 AppLovin 账户, 并在保存时验证凭据有效性.

**目标**:
- 在 `media-authorization` 页完成 AppLovin 的授权入口展示, 并根据本地账户数据动态更新连接状态.
- 在 `applovin-account-manage` 页支持账户的增删改和“测试连接”闭环.
- 输入凭据时用产品化引导帮助客户找到 `Reporting Key`.

**成功标准**:
- 用户能在 2 步内完成首次接入: 进入 Manage -> 获取 Reporting Key -> 新增并通过测试连接.
- 当测试连接失败时, 页面能明确提示失败原因, 并保留表单让用户重新填写.
- 删除账户时, 有二次确认弹窗, 防止误删.

### 2. 需求范围
**范围内**:
- `BPS/media-authorization.html` 中新增 AppLovin 卡片, 以及 Manage 跳转.
- `BPS/applovin-account-manage.html` 中实现 AppLovin 账户表格, 新增, 编辑, 删除, 测试连接, 搜索过滤, Reporting Key 引导卡片.
- 页面间通过本地数据源联动, 当前使用 `localStorage`.

**范围外**:
- 真正调用 AppLovin 或服务端鉴权接口(当前为前端模拟测试逻辑).
- 完整的后端密钥管理, 暂不在本 PRD 里实现密钥加密存储方案(但会在后续对接需求中提出).

### 3. 用户角色
- 客户(运营/对接人员): 负责填写 `Account ID` 和 `Reporting Key`.
- 平台管理员: 负责维护账户列表, 重测, 删除.

### 4. 关键用户故事
1. 作为客户, 我第一次配置 AppLovin 时, 我能从引导图找到 `Reporting Key` 并完成新增.
2. 作为客户, 如果 `Reporting Key` 填写错误导致测试失败, 我能看到明确提示并重新填写.
3. 作为管理员, 我能在列表中编辑 `Reporting Key`, 并在保存时重新测试连接.
4. 作为管理员, 我能通过二次确认安全删除账户, 避免误操作.

### 5. 页面与信息架构
**5.1 媒体授权页** (`BPS/media-authorization.html`)
- 入口位置: `Integration` 页签下的媒体接入卡片列表.
- AppLovin 卡片展示:
  - 状态标签: 由本地账户是否存在决定.
  - profile 数: 由本地账户数量决定.
  - 操作按钮: `Manage` 跳转到二级页.

**5.2 二级账户管理页** (`BPS/applovin-account-manage.html`)
- 顶部提供返回链接回媒体授权页.
- 表格用于展示账户列表和操作入口.
- 新增/编辑使用弹窗表单, 并在提交时进行测试连接.
- 删除使用二次确认弹窗.
- 新增/编辑弹窗中提供可折叠的 `Reporting Key` 获取引导卡片.

### 6. 功能清单
**6.1 媒体授权页**
- **功能**: 显示 AppLovin 卡片, 并提供 `Manage` 按钮.
- **功能**: 根据本地账户数据更新 AppLovin 状态与 profile 数.

**6.2 二级管理页**
- **功能**: 列表展示 AppLovin 账户, 支持搜索过滤.
- **功能**: 新增账户(必填 `Account ID` 和 `Reporting Key`), 并自动测试连接.
- **功能**: 编辑账户(必填 `Account ID` 不可编辑, 必填 `Reporting Key` 可编辑), 并自动测试连接.
- **功能**: 测试连接(新增/编辑时自动, 列表支持手动 Retest).
- **功能**: 删除账户, 二次确认弹窗。
- **功能**: `Reporting Key` 引导图文, 可折叠, 默认展开。
- **功能**: Token/Reporting Key 脱敏展示, 仅显示首尾字符片段。

### 7. 详细需求

#### 7.1 媒体授权页 AppLovin 卡片逻辑
- 状态规则:
  - 当本地 `bps_applovin_accounts` 存在至少 1 个账户时, 状态显示 `Connected`.
  - 当本地为空时, 状态显示 `Not connected`.
- profile 数规则(当前前端逻辑):
  - `applovinProfileCount` 显示为 `min(accounts.length, 1)/1 profile`.
- `Manage` 按钮:
  - 点击跳转到 `./applovin-account-manage.html`.

#### 7.2 二级管理页列表与搜索
- 列表表头字段:
  - `Enable sync`
  - `Name`
  - `Account ID`
  - `Reporting Key`
  - `Status`
  - `Currency`
  - `Last synced`
  - `Bind stores`
  - `Actions`
- 搜索:
  - 当前实现: 关键词在 `name` 和 `accountId` 两者中进行包含匹配.
  - 期望后续: 也支持对 `Reporting Key` 脱敏文本进行搜索(当前不做).

#### 7.3 新增账户弹窗
- 打开方式: 点击 `Share media account` 按钮。
- 表单字段:
  - `Account ID *`: 必填, 提交前校验非空.
  - `Reporting Key *`: 必填, 提交前校验非空.
  - `Account name`: 仅在编辑时可见, 新增时隐藏。
- 引导卡片:
  - 默认展开。
  - 点击 `Hide guide` 收起, 再点 `Show guide` 展开。
  - 引导内容提供文字步骤和截图定位说明。

#### 7.4 编辑账户弹窗
- 打开方式: 列表点击 `Edit`。
- 表单字段规则:
  - `Account ID`: 禁用不可编辑, 仅用于标识账户。
  - `Reporting Key`: 可编辑, 提交时必填并触发测试连接。
  - `Account name`: 当前实现编辑时可见, 新增时隐藏.

#### 7.5 测试连接规则(当前实现为模拟)
**触发时机**:
- 新增时点击 `Save and test` 自动触发一次测试连接.
- 编辑时点击 `Save and test` 自动触发一次测试连接.
- 列表点击 `Retest` 触发“重测成功”并更新 `lastSyncedAt`.

**模拟规则**:
- 测试通过条件: `Reporting Key` 字符串长度为偶数.
- 测试失败条件: `Reporting Key` 字符串长度为奇数.

**失败处理**:
- 弹窗内显示失败结果区域, 并要求用户重新填写 `Account ID` 和 `Reporting Key` 后再次提交.

#### 7.6 删除账户
- 打开方式: 列表点击 `Delete`。
- 二次确认弹窗:
  - 弹窗文案提示删除会移除已保存的 `Reporting Key` 并禁用同步.
  - 用户取消: 保持原列表不变。
  - 用户确认: 从本地数据源移除对应账户, 并刷新列表。

#### 7.7 脱敏展示规则(Reporting Key)
- 目标: 不在 UI 层暴露完整 `Reporting Key`.
- 当前实现展示逻辑:
  - 当长度 <= 3: 显示为 `前N字符 + ***`.
  - 当长度 <= 7: 显示为 `前3字符 + *** + 后1字符`.
  - 当长度 > 7: 显示为 `前3字符 + *** + 后4字符`.
- 期望后续(更严格产品化):
  - 统一按 `前3字符 + *** + 后4字符` 展示, 并定义短 Key 的覆盖策略.

### 8. 数据模型(当前 demo 为本地存储)
**数据源**:
- `localStorage` key: `bps_applovin_accounts`
- value: Array of AppLovinAccount.

**AppLovinAccount 字段**:
| 字段 | 类型 | 是否必填 | 说明 |
|---|---|---|---|
| name | string | 否 | 列表展示用名称, 新增时可留空并由页面生成默认值 |
| accountId | string | 是 | AppLovin 账户 ID |
| token | string | 是 | 存储的原始凭据, UI 以 Reporting Key 展示 |
| status | string | 是 | 列表状态, 当前固定为 Connected |
| currency | string | 是 | 列表货币, 当前固定 USD |
| lastSyncedAt | string | 是 | 最近一次同步时间(当前为测试通过后生成) |
| bindStores | string | 是 | 绑定商店数文案, 当前为 1 store |
| syncEnabled | boolean | 是 | 同步开关展示用, 当前仅展示不做真实联动 |

### 9. 校验规则
- **校验**: `Account ID` 必填, 非空才允许测试连接.
- **校验**: `Reporting Key` 必填, 非空才允许测试连接.
- **校验**: 新增时, `Account ID` 需唯一, 若已存在则提示 `This Account ID already exists.` 并阻断保存。

### 10. 交互状态机
**新增/编辑弹窗状态**:
- 初始状态: 未校验, guide 默认展开.
- 提交中: 显示 testingRow, 隐藏 connectResult.
- 测试结果:
  - 成功: 写入本地存储, 刷新列表, 关闭弹窗.
  - 失败: connectResult 展示失败信息, 保持弹窗打开, 允许用户修改后重试。

### 11. 埋点需求(可选)
- **页面曝光**: `applovin_manage_view`
  - 属性: 是否存在账户(existingAccounts: true/false).
- **保存点击**: `applovin_account_save_click`
  - 属性: mode(add/edit).
- **测试结果**: `applovin_connection_test_result`
  - 属性: success(true/false).
- **删除确认**: `applovin_account_delete_confirm`
  - 属性: mode(single/all).

### 12. 安全与合规
- 生产要求:
  - 不在前端或 localStorage 明文存储 `Reporting Key`.
  - `Reporting Key` 在服务端加密存储, 并通过后端测试接口校验有效性.
- UI 要求:
  - 始终使用脱敏展示, 不提供“查看明文”的入口.

### 13. 验收标准
- 满足以下验收项即可认为 AppLovin 功能可用:
  1. 媒体授权页显示 AppLovin 卡片, 且 Manage 正确跳转二级页.
  2. 二级页列表能展示新增的账户, 并按脱敏规则展示 Reporting Key.
  3. 新增/编辑弹窗能校验必填项并触发测试连接.
  4. token 测试失败时, 页面提示失败且不关闭弹窗.
  5. 删除操作存在二次确认, 确认后列表正确刷新。

### 14. 后续演进(与真实服务端对接)
- 替换前端模拟测试:
  - 新增 `POST /applovin/accounts/test-connection` 接口, 返回 success 与 errorCode.
- 替换本地存储:
  - 新增 `POST /applovin/accounts` `PUT /applovin/accounts/:accountId` `DELETE /applovin/accounts/:accountId` 等标准账户接口.
- 同步开关联动:
  - `Enable sync` 需要调用后端开关接口, 并刷新状态与 lastSyncedAt.

