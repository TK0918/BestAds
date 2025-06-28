# BestAds 组件化方案使用说明

## 概述

本方案将左侧菜单和页面顶部抽取为公共组件，实现统一管理。通过修改一处地方，所有页面都能同步更新菜单和余额信息。

## 文件结构

```
bestads-client-styled/
├── components/
│   ├── sidebar.html          # 侧边栏组件
│   └── header.html           # 头部组件
├── css/
│   └── common.css            # 公共样式文件
├── js/
│   └── common.js             # 公共JavaScript文件
├── template.html             # 新页面模板
└── README-组件化方案.md      # 本说明文档
```

## 核心功能

### 1. 统一侧边栏管理
- **文件位置**: `components/sidebar.html`
- **功能**: 所有页面共享同一个侧边栏
- **自动激活**: 根据当前页面自动高亮对应菜单项
- **新增菜单**: 只需修改 `sidebar.html` 一个文件

### 2. 统一头部管理
- **文件位置**: `components/header.html`
- **功能**: 包含页面标题、通知、语言选择、余额显示等
- **余额管理**: 统一管理所有页面的余额显示

### 3. 全局数据管理
- **文件位置**: `js/common.js`
- **余额数据**: 统一管理余额信息，修改一处全局生效
- **页面配置**: 统一管理页面标题和描述

## 使用方法

### 创建新页面

1. **复制模板文件**:
   ```bash
   cp template.html new-page.html
   ```

2. **修改页面标题**:
   ```html
   <title>新页面标题 - BestAds</title>
   ```

3. **添加页面配置**:
   在 `js/common.js` 的 `PAGE_CONFIG` 中添加：
   ```javascript
   const PAGE_CONFIG = {
     // ... 现有配置
     'new-page': { 
       title: '新页面', 
       description: '新页面的描述信息' 
     }
   };
   ```

4. **添加到侧边栏**:
   在 `components/sidebar.html` 中添加菜单项：
   ```html
   <li>
     <a href="new-page.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="new-page">
       <i class="fas fa-新图标 mr-3" style="color: #B0B5C0;"></i>
       <span>新页面</span>
     </a>
   </li>
   ```

5. **添加页面内容**:
   在模板的内容区域添加具体功能

### 修改菜单

只需修改 `components/sidebar.html` 文件：

```html
<!-- 修改现有菜单项 -->
<a href="new-url.html" data-page="new-page-name">
  <i class="fas fa-new-icon mr-3"></i>
  <span>新菜单名称</span>
</a>

<!-- 添加新菜单项 -->
<li>
  <a href="another-page.html" class="sidebar-item..." data-page="another-page">
    <i class="fas fa-another-icon mr-3"></i>
    <span>另一个页面</span>
  </a>
</li>
```

### 修改余额信息

只需修改 `js/common.js` 文件中的 `BALANCE_DATA`：

```javascript
const BALANCE_DATA = {
  available: '$3,500.00',    // 修改可用余额
  real: '$3,700.00',         // 修改真实金额
  frozen: '$150.00',         // 修改冻结金额
  inTransit: '$100.00',      // 修改在途金额
  creditLimit: '$2,000.00',  // 修改信用额度
  usedCredit: '$300.00'      // 修改已用额度
};
```

或者在任何页面中动态更新：

```javascript
// 更新部分余额信息
CommonUtils.updateBalance({
  available: '$4,000.00',
  real: '$4,200.00'
});

// 获取当前余额信息
const currentBalance = CommonUtils.getBalanceData();
```

## 页面改造步骤

### 现有页面改造

1. **添加公共文件引用**:
   ```html
   <head>
     <!-- 现有引用 -->
     <link rel="stylesheet" href="./css/common.css">
   </head>
   <body>
     <!-- 页面内容 -->
     
     <!-- 在body结束前添加 -->
     <script src="./js/common.js"></script>
   </body>
   ```

2. **替换侧边栏**:
   ```html
   <!-- 原来的侧边栏代码 -->
   <div class="w-60 bg-slate-800 h-full flex flex-col">
     <!-- 大量HTML代码 -->
   </div>
   
   <!-- 替换为 -->
   <div id="sidebar-container">
     <!-- 侧边栏将通过JavaScript动态加载 -->
   </div>
   ```

3. **替换头部**:
   ```html
   <!-- 原来的头部代码 -->
   <header class="h-16 bg-slate-800...">
     <!-- 大量HTML代码 -->
   </header>
   
   <!-- 替换为 -->
   <div id="header-container">
     <!-- 头部将通过JavaScript动态加载 -->
   </div>
   ```

4. **移除重复样式**:
   删除页面中重复的CSS样式，使用公共样式文件

## 高级功能

### 自定义页面标题
```javascript
// 在页面JavaScript中
document.addEventListener('DOMContentLoaded', function() {
  // 设置自定义标题
  CommonUtils.setPageTitle('custom-page');
});
```

### 动态更新余额
```javascript
// 从服务器获取最新余额后更新
fetch('/api/balance')
  .then(response => response.json())
  .then(data => {
    CommonUtils.updateBalance(data);
  });
```

### 页面特定的通知
```javascript
// 使用统一的通知系统
CommonUtils.showNotification('操作成功', 'success');
```

## 优势

1. **维护简单**: 菜单和余额只需修改一处
2. **一致性**: 所有页面保持统一的视觉风格
3. **扩展性**: 新增页面非常简单
4. **性能**: 组件缓存，减少重复代码
5. **响应式**: 自动适配不同屏幕尺寸

## 注意事项

1. **路径问题**: 确保文件路径正确，组件文件使用相对路径
2. **浏览器兼容**: 使用了 fetch API，需要现代浏览器支持
3. **CORS**: 本地开发可能需要启动本地服务器
4. **缓存**: 浏览器可能缓存组件文件，开发时注意清除缓存

## 本地开发

推荐使用简单的HTTP服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js (需要先安装 http-server)
npx http-server

# PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 故障排除

1. **组件不显示**: 检查控制台错误，确认文件路径正确
2. **样式不生效**: 确认 common.css 文件引用正确
3. **菜单不高亮**: 检查 data-page 属性是否与页面名称匹配
4. **余额不更新**: 确认元素ID是否正确，检查JavaScript错误 