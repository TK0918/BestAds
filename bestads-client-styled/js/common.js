// 公共JavaScript文件
// 用于加载组件和管理全局数据

// 页面配置
const PAGE_CONFIG = {
  'index': { title: '首页', description: '欢迎使用BestAds海外广告管理系统' },
  'account-management': { title: '账户管理', description: '管理您的广告账户，查看账户状态和余额信息' },
  'operation-records': { title: '操作记录', description: '查看您的开户申请和充值记录，跟踪所有操作的处理状态' },
  'wallet': { title: '钱包', description: '管理您的钱包余额、充值与转账' },
  'ad-review-notifications': { title: '被拒广告', description: '查看您的广告审核结果和详细说明，了解不通过的具体原因' }
};

// 余额数据（统一管理）
const BALANCE_DATA = {
  available: '$2,900.00',
  real: '$3,100.00',
  frozen: '$100.00',
  inTransit: '$120.00',
  creditLimit: '$1,000.00',
  usedCredit: '$200.00'
};

// 加载HTML组件
async function loadComponent(componentPath, targetElementId) {
  try {
    console.log(`正在加载组件: ${componentPath} 到 ${targetElementId}`);
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    console.log(`组件 ${componentPath} 加载成功，内容长度: ${html.length}`);
    document.getElementById(targetElementId).innerHTML = html;
    return true;
  } catch (error) {
    console.error(`加载组件失败 ${componentPath}:`, error);
    
    // 如果是CORS错误，提供替代方案
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.warn('可能是CORS问题，尝试使用本地服务器或直接嵌入组件内容');
    }
    return false;
  }
}

// 初始化页面
async function initializePage() {
  // 获取当前页面名称
  const currentPage = getCurrentPageName();
  
  // 尝试加载侧边栏
  const sidebarLoaded = await loadComponent('./components/sidebar.html', 'sidebar-container');
  
  // 尝试加载头部
  const headerLoaded = await loadComponent('./components/header.html', 'header-container');
  
  // 如果组件加载失败，使用备用方案
  if (!sidebarLoaded) {
    console.warn('侧边栏组件加载失败，使用备用方案');
    loadFallbackSidebar();
  }
  
  if (!headerLoaded) {
    console.warn('头部组件加载失败，使用备用方案');
    loadFallbackHeader();
  }
  
  // 设置当前页面激活状态
  setActiveMenuItem(currentPage);
  
  // 设置页面标题
  setPageTitle(currentPage);
  
  // 更新余额信息
  updateBalanceInfo();
}

// 获取当前页面名称
function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  const pageName = filename.replace('.html', '');
  return pageName === '' ? 'index' : pageName;
}

// 设置激活的菜单项
function setActiveMenuItem(currentPage) {
  // 移除所有激活状态
  const menuItems = document.querySelectorAll('.sidebar-item');
  menuItems.forEach(item => {
    item.classList.remove('active');
    item.style.backgroundColor = 'transparent';
    item.style.color = '#B0B5C0';
    const icon = item.querySelector('i');
    if (icon) icon.style.color = '#B0B5C0';
  });
  
  // 设置当前页面激活状态
  const currentMenuItem = document.querySelector(`[data-page="${currentPage}"]`);
  if (currentMenuItem) {
    currentMenuItem.classList.add('active');
    currentMenuItem.style.backgroundColor = '#2A2F3D';
    currentMenuItem.style.color = '#00FFB0';
    const icon = currentMenuItem.querySelector('i');
    if (icon) icon.style.color = '#00FFB0';
  }
}

// 设置页面标题
function setPageTitle(currentPage) {
  const config = PAGE_CONFIG[currentPage];
  if (config) {
    const titleElement = document.getElementById('page-title');
    if (titleElement) {
      titleElement.textContent = config.title;
    }
    
    // 设置页面描述（如果页面有描述元素）
    const descElement = document.querySelector('.page-description');
    if (descElement && config.description) {
      descElement.textContent = config.description;
    }
  }
}

// 更新余额信息
function updateBalanceInfo() {
  // 更新主要余额显示
  const balanceElements = document.querySelectorAll('#balanceAmount');
  balanceElements.forEach(el => {
    if (el) el.textContent = BALANCE_DATA.available;
  });
  
  // 更新详细余额信息
  const balanceDetailElements = document.querySelectorAll('#balanceDetail');
  balanceDetailElements.forEach(el => {
    if (el) el.textContent = BALANCE_DATA.available;
  });
  
  const realAmountElements = document.querySelectorAll('#realAmount');
  realAmountElements.forEach(el => {
    if (el) el.textContent = BALANCE_DATA.real;
  });
  
  const frozenAmountElements = document.querySelectorAll('#frozenAmount');
  frozenAmountElements.forEach(el => {
    if (el) el.textContent = BALANCE_DATA.frozen;
  });
}

// 更新余额数据的公共方法
function updateBalance(newBalanceData) {
  Object.assign(BALANCE_DATA, newBalanceData);
  updateBalanceInfo();
}

// 获取余额数据的公共方法
function getBalanceData() {
  return { ...BALANCE_DATA };
}

// 通用的通知函数（如果页面需要）
function showNotification(message, type = 'info') {
  // 检查页面是否有通知函数
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
  } else {
    // 简单的alert作为fallback
    alert(message);
  }
}

// 通用的站内信抽屉函数（如果页面需要）
function openInboxDrawer() {
  // 检查页面是否有站内信函数
  if (typeof window.openInboxDrawer === 'function') {
    window.openInboxDrawer();
  } else {
    console.log('站内信功能未在此页面实现');
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});

// 备用侧边栏加载函数
function loadFallbackSidebar() {
  const sidebarHTML = `
<!-- 侧边栏组件 -->
<div class="h-full flex flex-col" style="width: 220px; background-color: #0F121A;">
  <!-- Logo -->
  <div class="pt-6 px-8">
    <h1 class="text-white text-2xl font-semibold">BestAds</h1>
  </div>

  <!-- Navigation -->
  <nav class="mt-8 flex-1">
    <ul class="space-y-2 px-4">
      <li>
        <a href="index.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="index">
          <i class="fas fa-home mr-3" style="color: #B0B5C0;"></i>
          <span>首页</span>
        </a>
      </li>
      <li>
        <a href="account-management.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="account-management">
          <i class="fas fa-users mr-3" style="color: #B0B5C0;"></i>
          <span>账户管理</span>
        </a>
      </li>
      <li>
        <a href="#" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="facebook-ads">
          <i class="fab fa-facebook mr-3" style="color: #B0B5C0;"></i>
          <span>Facebook广告</span>
        </a>
      </li>
      <li>
        <a href="operation-records.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="operation-records">
          <i class="fas fa-history mr-3" style="color: #B0B5C0;"></i>
          <span>操作记录</span>
        </a>
      </li>
      <li>
        <a href="#" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="data-analysis">
          <i class="fas fa-chart-bar mr-3" style="color: #B0B5C0;"></i>
          <span>数据分析</span>
        </a>
      </li>
      <li>
        <a href="#" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="ad-placement">
          <i class="fas fa-ad mr-3" style="color: #B0B5C0;"></i>
          <span>广告投放</span>
        </a>
      </li>
      <li>
        <a href="#" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="creative">
          <i class="fas fa-folder mr-3" style="color: #B0B5C0;"></i>
          <span>创意</span>
        </a>
      </li>
      <li>
        <a href="ad-review-notifications.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="ad-review-notifications">
          <i class="fas fa-bell mr-3" style="color: #B0B5C0;"></i>
          <span>被拒广告</span>
        </a>
      </li>
      <li>
        <a href="wallet.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="wallet">
          <i class="fas fa-wallet mr-3" style="color: #B0B5C0;"></i>
          <span>余额管理</span>
        </a>
      </li>
      <li>
        <a href="sub-account-management.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="sub-account-management">
          <i class="fas fa-user-circle mr-3" style="color: #B0B5C0;"></i>
          <span>子账号管理</span>
        </a>
      </li>
      <li>
        <a href="role-management.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="role-management">
          <i class="fas fa-user-shield mr-3" style="color: #B0B5C0;"></i>
          <span>角色管理</span>
        </a>
      </li>
    </ul>
  </nav>
</div>`;
  
  document.getElementById('sidebar-container').innerHTML = sidebarHTML;
}

// 备用头部加载函数
function loadFallbackHeader() {
  const headerHTML = `
<!-- 头部组件 -->
<header class="flex items-center justify-between px-6" style="height: 56px; background-color: #1A1F2B; border-bottom: 1px solid #2E333F;">
  <div class="flex items-center space-x-4">
    <h2 class="text-xl font-semibold text-white" id="page-title">页面标题</h2>
  </div>

  <div class="flex items-center space-x-4">
    <!-- Notification -->
    <div class="relative group">
      <button onclick="openInboxDrawer()" class="p-2 text-gray-400 hover:text-white relative transition-colors duration-200">
        <i class="fas fa-bell text-lg"></i>
        <span class="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">5</span>
      </button>
    </div>

    <!-- Language Selector -->
    <select class="bg-slate-700 text-white px-3 py-2 rounded-md focus:outline-none">
      <option>中文</option>
      <option>English</option>
    </select>

    <!-- User Avatar -->
    <div class="relative group flex items-center">
      <button onclick="window.location.href='wallet.html'" class="btn-secondary flex items-center font-bold text-base transition-all duration-200" style="min-width:120px; color: #00FFB0;">
        <i class="fas fa-wallet mr-2"></i>
        <span id="balanceAmount">$2,900.00</span>
      </button>
      <!-- 悬浮详细信息 -->
      <div class="absolute right-0 top-10 z-50 hidden group-hover:block bg-slate-800 border border-gray-600 rounded-lg shadow-lg p-4 min-w-[220px] text-sm text-gray-200">
        <div class="mb-2 flex items-center justify-between">
          <span>可用余额</span><span class="font-bold text-yellow-300" id="balanceDetail">$2,900.00</span>
        </div>
        <div class="mb-1 flex items-center justify-between">
          <span>真实金额</span><span id="realAmount">$3,100.00</span>
        </div>
        <div class="mb-1 flex items-center justify-between">
          <span>冻结金额</span><span id="frozenAmount">$100.00</span>
        </div>
      </div>
    </div>
    <div class="flex items-center space-x-3">
      <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <span class="text-white text-sm font-medium">A</span>
      </div>
      <span class="hidden md:block text-sm font-medium text-gray-300">客户</span>
    </div>
  </div>
</header>`;
  
  document.getElementById('header-container').innerHTML = headerHTML;
}

// 导出公共函数供其他页面使用
window.CommonUtils = {
  updateBalance,
  getBalanceData,
  showNotification,
  setPageTitle,
  PAGE_CONFIG,
  BALANCE_DATA
}; 