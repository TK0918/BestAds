# BestAds Admin UI 风格提取与应用指南

本文档说明如何将 BestAds Admin 系统的 UI 风格提取并应用到其他 Cursor 项目中。

## 📋 目录

1. [UI 风格概述](#ui-风格概述)
2. [技术栈分析](#技术栈分析)
3. [提取步骤](#提取步骤)
4. [核心组件提取](#核心组件提取)
5. [应用到新项目](#应用到新项目)

---

## 🎨 UI 风格概述

BestAds Admin 系统采用现代化的管理后台设计风格，主要特点：

- **配色方案**：蓝色到紫色的渐变主题（`from-blue-600 to-purple-600`）
- **字体**：Inter 字体家族
- **布局**：侧边栏 + 主内容区的经典后台布局
- **响应式**：支持移动端和桌面端
- **交互**：流畅的动画过渡效果
- **图标**：Font Awesome 6.4.0

---

## 🛠 技术栈分析

### 外部依赖（CDN）

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome 图标库 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

<!-- Google Fonts - Inter 字体 -->
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### 核心 CSS 类

- Tailwind CSS 工具类
- 自定义 CSS 样式（侧边栏、状态标签、动画等）

---

## 📦 提取步骤

### 步骤 1：创建 UI 组件库文件夹结构

在新项目中创建以下文件夹结构：

```
your-project/
├── ui-components/
│   ├── css/
│   │   ├── base.css          # 基础样式
│   │   ├── sidebar.css       # 侧边栏样式
│   │   └── components.css    # 组件样式
│   ├── js/
│   │   ├── sidebar.js        # 侧边栏交互逻辑
│   │   └── common.js         # 通用工具函数
│   └── templates/
│       └── layout.html       # 基础布局模板
```

### 步骤 2：提取核心 CSS 样式

创建 `ui-components/css/base.css`：

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 侧边栏菜单项样式 */
.sidebar-item {
  position: relative;
  transition: all 0.2s ease;
}

.sidebar-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #667eea;
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.sidebar-item.active::before,
.sidebar-item:hover::before {
  transform: scaleY(1);
}

/* 移动端菜单控制 */
.mobile-menu-open {
  transform: translateX(0);
}

.mobile-menu-closed {
  transform: translateX(-100%);
}

/* 模态框背景模糊 */
.modal-backdrop {
  backdrop-filter: blur(8px);
}

/* 动画效果 */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* 表格悬停效果 */
.table-hover tbody tr:hover {
  background-color: #f9fafb;
}

/* 状态标签样式（可根据项目需求自定义） */
.status-active { background-color: #10b981; color: white; }
.status-limited { background-color: #f59e0b; color: white; }
.status-banned { background-color: #ef4444; color: white; }
.status-pending { background-color: #6b7280; color: white; }
```

### 步骤 3：提取侧边栏 HTML 结构

创建 `ui-components/templates/sidebar.html`：

```html
<!-- 侧边栏 -->
<aside id="sidebar" class="bg-white w-64 min-h-screen shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 mobile-menu-closed lg:mobile-menu-open fixed z-30">
  <!-- 侧边栏头部 -->
  <div class="flex items-center justify-center h-16 border-b border-gray-200">
    <div class="flex items-center">
      <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
        <i class="fas fa-chart-line text-white text-sm"></i>
      </div>
      <span class="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Your App Name
      </span>
    </div>
  </div>

  <!-- 侧边栏菜单区 -->
  <div id="sidebarMenuWrapper" class="overflow-y-auto" style="max-height:calc(100vh - 64px);">
    <nav>
      <!-- 菜单分组示例 -->
      <div class="px-4 mb-6">
        <div class="flex items-center justify-between cursor-pointer group" onclick="toggleMenuSection('mainMenu')">
          <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 select-none">主要功能</h3>
          <i id="mainMenuArrow" class="fas fa-chevron-down text-xs text-gray-400 group-hover:text-blue-600 transition-transform"></i>
        </div>
        <ul id="mainMenu" class="space-y-1 mb-2">
          <li>
            <a href="#" class="sidebar-item flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <i class="fas fa-chart-bar w-5 h-5 mr-3 text-gray-400"></i>
              仪表盘
            </a>
          </li>
          <!-- 更多菜单项... -->
        </ul>
      </div>
    </nav>
  </div>
</aside>

<!-- 遮罩层 (移动端) -->
<div id="sidebar-overlay" class="fixed inset-0 bg-gray-600 bg-opacity-50 opacity-0 hidden z-20 transition-opacity duration-300 ease-linear lg:hidden"></div>
```

### 步骤 4：提取 JavaScript 交互逻辑

创建 `ui-components/js/sidebar.js`：

```javascript
// 菜单分组折叠/展开
function toggleMenuSection(id) {
  const ul = document.getElementById(id);
  const arrow = document.getElementById(id + 'Arrow');
  if (ul.style.display === 'none') {
    ul.style.display = '';
    arrow.classList.remove('fa-chevron-right');
    arrow.classList.add('fa-chevron-down');
  } else {
    ul.style.display = 'none';
    arrow.classList.remove('fa-chevron-down');
    arrow.classList.add('fa-chevron-right');
  }
}

// 侧边栏切换（移动端）
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar.classList.contains('mobile-menu-closed')) {
    sidebar.classList.remove('mobile-menu-closed');
    sidebar.classList.add('mobile-menu-open');
    overlay.classList.remove('hidden');
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-50');
  } else {
    sidebar.classList.remove('mobile-menu-open');
    sidebar.classList.add('mobile-menu-closed');
    overlay.classList.add('opacity-0');
    overlay.classList.remove('opacity-50');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
  }
}

// 点击遮罩层关闭侧边栏
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      toggleSidebar();
    });
  }

  // 菜单项切换高亮
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', function(e) {
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
      }
      document.querySelectorAll('.sidebar-item').forEach(menu => menu.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // 响应式处理
  window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (window.innerWidth >= 1024) {
      sidebar.classList.remove('mobile-menu-closed');
      sidebar.classList.add('mobile-menu-open');
      overlay.classList.add('hidden');
      overlay.classList.add('opacity-0');
      overlay.classList.remove('opacity-50');
    }
  });
});
```

### 步骤 5：提取顶部栏 HTML 结构

创建 `ui-components/templates/header.html`：

```html
<!-- 顶部栏 -->
<header class="bg-white shadow-sm border-b border-gray-200">
  <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
    <!-- 左侧 -->
    <div class="flex items-center">
      <button onclick="toggleSidebar()" class="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
        <i class="fas fa-bars text-lg"></i>
      </button>
      
      <div class="ml-4 lg:ml-0">
        <nav class="flex space-x-2 text-sm" aria-label="Breadcrumb">
          <span class="text-gray-500">模块名称</span>
          <i class="fas fa-chevron-right text-gray-300 text-xs mt-0.5"></i>
          <span class="text-gray-900 font-medium">页面名称</span>
        </nav>
      </div>
    </div>
    
    <!-- 右侧 -->
    <div class="flex items-center space-x-4">
      <div class="relative">
        <button class="p-2 text-gray-400 hover:text-gray-500 relative">
          <i class="fas fa-bell text-lg"></i>
          <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">3</span>
        </button>
      </div>
      
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white text-sm font-medium">A</span>
        </div>
        <span class="hidden md:block text-sm font-medium text-gray-700">用户名</span>
      </div>
    </div>
  </div>
</header>
```

### 步骤 6：创建完整的基础布局模板

创建 `ui-components/templates/layout.html`：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题 - Your App Name</title>
  
  <!-- 外部依赖 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
  
  <!-- 自定义样式 -->
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/sidebar.css">
  <link rel="stylesheet" href="../css/components.css">
</head>
<body class="bg-gray-50">
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <!-- 在这里引入 sidebar.html 的内容 -->
    
    <!-- 遮罩层 -->
    <!-- 在这里引入遮罩层 -->
    
    <!-- 主要内容区域 -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- 顶部栏 -->
      <!-- 在这里引入 header.html 的内容 -->
      
      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto bg-gray-50">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- 你的页面内容 -->
          </div>
        </div>
      </main>
    </div>
  </div>
  
  <!-- JavaScript -->
  <script src="../js/sidebar.js"></script>
  <script src="../js/common.js"></script>
</body>
</html>
```

---

## 🚀 应用到新项目

### 方法一：直接复制文件（推荐）

1. **复制 UI 组件文件夹**
   ```bash
   # 从 admin-system 项目复制到新项目
   cp -r admin-system/ui-components your-new-project/
   ```

2. **在新项目的 HTML 文件中引用**
   ```html
   <!-- 在 <head> 中引入 -->
   <script src="https://cdn.tailwindcss.com"></script>
   <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
   <link rel="stylesheet" href="ui-components/css/base.css">
   
   <!-- 在 <body> 中引入侧边栏和顶部栏 -->
   <!-- 复制 sidebar.html 和 header.html 的内容 -->
   
   <!-- 在 </body> 前引入 JavaScript -->
   <script src="ui-components/js/sidebar.js"></script>
   ```

### 方法二：创建 NPM 包（适合多项目复用）

1. **创建独立的 UI 组件包**
   ```
   bestads-ui-components/
   ├── package.json
   ├── dist/
   │   ├── css/
   │   ├── js/
   │   └── templates/
   └── README.md
   ```

2. **在新项目中安装**
   ```bash
   npm install bestads-ui-components
   ```

3. **在项目中引用**
   ```javascript
   import 'bestads-ui-components/dist/css/base.css';
   import { toggleSidebar } from 'bestads-ui-components/dist/js/sidebar.js';
   ```

### 方法三：使用 Git Submodule（适合团队协作）

1. **将 UI 组件库作为独立仓库**
   ```bash
   git submodule add https://github.com/your-org/bestads-ui-components.git ui-components
   ```

2. **在新项目中引用**
   ```html
   <link rel="stylesheet" href="ui-components/css/base.css">
   ```

---

## 📝 使用示例

### 创建新页面

1. **复制基础模板**
   ```bash
   cp ui-components/templates/layout.html pages/my-page.html
   ```

2. **修改页面内容**
   - 更新 `<title>` 标签
   - 修改面包屑导航
   - 添加你的页面内容

3. **自定义菜单**
   - 在侧边栏中添加你的菜单项
   - 使用相同的 HTML 结构和 CSS 类

### 多选筛选项统一规范

后续所有 `筛选区多选项` 必须统一使用 `单行触发器 + 下拉滚动面板` 方式, 不再直接使用原生 `select[multiple]` 的高控件.

#### 视觉与交互规范

- 默认高度与单选输入保持一致: `38px`
- 默认态只显示摘要文案: `全部` 或 `已选N项`
- 点击触发器展开下拉面板
- 下拉面板使用 `max-height + overflow-y: auto` 滚动展示全部枚举项
- 点击页面空白区域自动收起面板

#### 推荐 CSS

```css
.multi-select { position: relative; width: 9rem; }
.multi-select-btn {
  width: 100%;
  height: 38px;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  background: #fff;
  font-size: 0.875rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #374151;
}
.multi-select-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #E5E7EB;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  padding: 0.5rem;
  z-index: 40;
  display: none;
}
.multi-select.open .multi-select-panel { display: block; }
.multi-select-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  padding: 0.25rem;
}
```

#### 推荐 HTML

```html
<div class="multi-select" id="bdFilter">
  <button type="button" class="multi-select-btn" onclick="toggleMultiSelect('bdFilter')">
    <span class="multi-select-label">全部</span>
    <i class="fas fa-chevron-down text-xs text-gray-400"></i>
  </button>
  <div class="multi-select-panel">
    <label class="multi-select-option"><input type="checkbox" value="BD-A">BD-A</label>
    <label class="multi-select-option"><input type="checkbox" value="BD-B">BD-B</label>
    <label class="multi-select-option"><input type="checkbox" value="BD-C">BD-C</label>
  </div>
</div>
```

#### 推荐 JS

```javascript
function getSelectedValues(id) {
  return Array.from(
    document.querySelectorAll('#' + id + ' input[type="checkbox"]:checked')
  ).map(input => input.value);
}

function updateMultiSelectLabel(id) {
  const root = document.getElementById(id);
  const allInputs = root.querySelectorAll('input[type="checkbox"]');
  const checked = root.querySelectorAll('input[type="checkbox"]:checked');
  const label = root.querySelector('.multi-select-label');
  if (checked.length === 0 || checked.length === allInputs.length) {
    label.textContent = '全部';
  } else {
    label.textContent = '已选' + checked.length + '项';
  }
}

function toggleMultiSelect(id) {
  const target = document.getElementById(id);
  document.querySelectorAll('.multi-select.open').forEach(node => {
    if (node.id !== id) node.classList.remove('open');
  });
  target.classList.toggle('open');
}

function setupMultiSelect() {
  document.querySelectorAll('.multi-select').forEach(root => {
    root.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.addEventListener('change', () => updateMultiSelectLabel(root.id));
    });
    updateMultiSelectLabel(root.id);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.multi-select')) {
      document.querySelectorAll('.multi-select.open').forEach(node => node.classList.remove('open'));
    }
  });
}
```

#### 适用范围

- 侧边栏筛选区
- 报表筛选区
- 弹窗内筛选区

统一要求: 只要是多选筛选项, 一律按本规范实现.

### 紧凑 Tab 列表页

适用于运营端多 Tab 列表页（如「余额监控&自动充值」），字段较多、需横向滚动的场景。参考实现：`admin-system/auto-recharge/notifications.html`。

#### 设计原则

| 区域 | 规范 | 避免 |
| --- | --- | --- |
| 筛选区 | `filter-bar` + `filter-grid`，无「筛选条件」大标题 | `px-6 py-4` + `h3 text-lg` 标题块 |
| 标签 | `filter-label`（12px） | `text-sm mb-2` |
| 输入/下拉 | `filter-input` / `filter-select`（`6px 8px`，13px 字号） | `px-3 py-2` |
| 时间范围 | `datetime-range` + `filter-col-span-2` 占两列 | 单独大栅格 + 松散间距 |
| 操作按钮 | `btn-filter-search` / `btn-filter-reset`（`6px 12px`，13px） | `px-4 py-2` 大按钮 |
| 工具栏 | `tab-toolbar`（`8px 16px`）+ `tab-toolbar-title`（16px） | `px-6 py-4` + `text-lg` |
| 主操作 | `btn-toolbar-primary` / `btn-toolbar-secondary` | 圆角 `rounded-lg` 大块按钮 |
| 数据表 | `table-wrap` + `data-table`，表头/单元格由 CSS 控制间距 | 行内 `px-6 py-3` / `px-6 py-4` |

#### 响应式栅格

- 默认 2 列；`≥768px` 3 列；`≥1024px` 6 列
- 时间范围等宽字段使用 `filter-col-span-2`
- 搜索/重置按钮放在 `filter-actions`，与末行筛选项底对齐

#### CSS（写入 `components.css` 或页面 `<style>`）

```css
/* 紧凑 Tab 页：筛选区 + 工具栏 + 数据表 */
.filter-bar { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; }
.filter-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: end; }
@media (min-width: 768px) { .filter-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .filter-grid { grid-template-columns: repeat(6, minmax(0, 1fr)); } }
.filter-col-span-2 { grid-column: span 2; }
.filter-label { display: block; font-size: 12px; font-weight: 500; color: #374151; margin-bottom: 4px; }
.filter-input, .filter-select { width: 100%; padding: 6px 8px; font-size: 13px; line-height: 1.4; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; color: #374151; }
.filter-input:focus, .filter-select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
.datetime-range { display: flex; align-items: center; gap: 8px; }
.datetime-range .filter-input { flex: 1; min-width: 0; }
.datetime-sep { color: #9ca3af; font-size: 12px; white-space: nowrap; }
.filter-actions { display: flex; gap: 8px; }
.btn-filter-search { flex: 1; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #2563eb; border: none; border-radius: 6px; cursor: pointer; }
.btn-filter-search:hover { background: #1d4ed8; }
.btn-filter-reset { flex: 1; padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #6b7280; border: none; border-radius: 6px; cursor: pointer; }
.btn-filter-reset:hover { background: #4b5563; }
.tab-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; border-bottom: 1px solid #e5e7eb; }
.tab-toolbar-title { font-size: 16px; font-weight: 500; color: #111827; margin: 0; }
.btn-toolbar-primary { padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #2563eb; border: none; border-radius: 6px; cursor: pointer; }
.btn-toolbar-primary:hover { background: #1d4ed8; }
.btn-toolbar-secondary { padding: 6px 12px; font-size: 13px; font-weight: 500; color: #fff; background: #6b7280; border: none; border-radius: 6px; cursor: pointer; }
.btn-toolbar-secondary:hover { background: #4b5563; }
.table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
.data-table { min-width: max-content; width: 100%; border-collapse: collapse; }
.data-table thead th { padding: 8px 12px !important; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.03em; white-space: nowrap; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
.data-table tbody td { padding: 6px 12px !important; font-size: 13px; line-height: 1.35; color: #374151; white-space: nowrap; border-bottom: 1px solid #f3f4f6; }
.data-table tbody tr:hover { background-color: #f9fafb; }
.status-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; line-height: 1.4; }
.tab-nav { overflow-x: auto; -webkit-overflow-scrolling: touch; }
```

#### HTML 结构模板

```html
<!-- Tab 内容区 -->
<div id="content-example" class="tab-content bg-white shadow-sm rounded-b-lg border border-gray-200">
  <!-- 筛选区：无大标题，直接铺字段 -->
  <div class="filter-bar">
    <div class="filter-grid">
      <div class="filter-col-span-2">
        <label class="filter-label">判断时间</label>
        <div class="datetime-range">
          <input type="datetime-local" class="filter-input">
          <span class="datetime-sep">至</span>
          <input type="datetime-local" class="filter-input">
        </div>
      </div>
      <div>
        <label class="filter-label">状态</label>
        <select class="filter-select"><option value="">全部</option></select>
      </div>
      <div class="filter-actions">
        <button type="button" class="btn-filter-search"><i class="fas fa-search mr-1"></i>搜索</button>
        <button type="button" class="btn-filter-reset">重置</button>
      </div>
    </div>
  </div>
  <!-- 列表工具栏 -->
  <div class="tab-toolbar">
    <h3 class="tab-toolbar-title">列表示题</h3>
    <button type="button" class="btn-toolbar-primary"><i class="fas fa-plus mr-1"></i>新增</button>
  </div>
  <!-- 数据表 -->
  <div class="table-wrap">
    <table class="data-table table-hover">
      <thead><tr><th>字段 A</th><th>字段 B</th></tr></thead>
      <tbody><tr><td>值</td><td>值</td></tr></tbody>
    </table>
  </div>
</div>
```

#### 适用范围

- 运营端多 Tab 列表页（筛选 + 工具栏 + 表格）
- 字段 ≥ 6 列、需横向滚动的日志/配置列表
- 新建或改版列表页时，**优先**采用本紧凑规范，勿混用旧版 `px-6 py-4` + `text-lg` 筛选样式

### 自定义样式

如果需要修改主题色，在 `base.css` 中修改：

```css
/* 修改主色调 */
.sidebar-item::before {
  background: #your-color; /* 替换为你的颜色 */
}

/* 修改渐变颜色 */
.bg-gradient-to-r {
  background: linear-gradient(to right, #your-color-1, #your-color-2);
}
```

---

## ✅ 检查清单

在应用到新项目前，确保：

- [ ] 已引入 Tailwind CSS CDN
- [ ] 已引入 Font Awesome 图标库
- [ ] 已引入 Inter 字体
- [ ] 已复制所有 CSS 文件
- [ ] 已复制所有 JavaScript 文件
- [ ] 侧边栏 HTML 结构完整
- [ ] 顶部栏 HTML 结构完整
- [ ] JavaScript 事件监听器已正确绑定
- [ ] 响应式设计正常工作
- [ ] 移动端菜单切换功能正常

---

## 🔧 常见问题

### Q: 如何修改品牌名称和 Logo？

A: 在侧边栏头部区域修改：
```html
<span class="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
  你的应用名称
</span>
```

### Q: 如何添加新的菜单项？

A: 在侧边栏的 `<ul>` 中添加：
```html
<li>
  <a href="your-page.html" class="sidebar-item flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900">
    <i class="fas fa-your-icon w-5 h-5 mr-3 text-gray-400"></i>
    菜单名称
  </a>
</li>
```

### Q: 如何自定义状态标签颜色？

A: 在 `base.css` 中添加或修改：
```css
.status-your-status { 
  background-color: #your-color; 
  color: white; 
}
```

---

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Font Awesome 图标库](https://fontawesome.com/icons)
- [Inter 字体](https://fonts.google.com/specimen/Inter)

---

## 📅 更新日志

- **2026-06-07**: 新增「紧凑 Tab 列表页」规范（筛选区 `filter-bar`、工具栏 `tab-toolbar`、紧凑 `data-table`）；参考 `admin-system/auto-recharge/notifications.html`
- **2024-03-XX**: 创建 UI 风格提取指南

---

**注意**：本文档基于 BestAds Admin 系统的实际代码结构编写，可根据具体项目需求进行调整。

