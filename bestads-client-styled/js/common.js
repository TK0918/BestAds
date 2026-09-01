// 公共JavaScript文件
// 用于加载组件和管理全局数据

// 页面配置
const PAGE_CONFIG = {
  'index': { title: '首页', description: '欢迎使用BestAds海外广告管理系统' },
  'account-management': { title: '账户管理', description: '管理您的广告账户，查看账户状态和余额信息' },
  'ad-management': { title: '广告管理', description: '管理和查看您的广告投放情况' },
  'operation-records': { title: '操作记录', description: '查看您的开户申请和充值记录，跟踪所有操作的处理状态' },
  'wallet': { title: '钱包', description: '管理您的钱包余额、充值与转账' },
  'ad-review-notifications': { title: '被拒广告', description: '查看您的广告审核结果和详细说明，了解不通过的具体原因' },
  'sub-account-management': { title: '子账号管理', description: '管理和配置子账号信息' },
  'role-management': { title: '角色管理', description: '管理和配置系统角色及权限' },
  'role-create': { title: '创建角色', description: '配置新的系统角色及权限' },
  'role-edit': { title: '编辑角色', description: '修改系统角色及权限' },
  'auto-recharge-rules': { title: '自动充值规则', description: '管理广告账户的自动充值规则, 当账户余额低于设定阈值时自动充值' },
  'introducer-daily-consume': { title: '推荐返佣', description: '按季度查看被介绍客户广告账户消耗、吐点比例与佣金' },
  'location-fee': { title: '地区税费', description: '查看地区税费估算、预收池余额与预收池流水（实际费用以 Meta 账单为准）' }
};

var CLIENT_NAV_I18N = {
  'zh-CN': { nav_referral_rebate: '推荐返佣', nav_location_fee: '地区税费' },
  'en-US': { nav_referral_rebate: 'Referral Rebate', nav_location_fee: 'Location Fees' }
};

function applyClientNavI18n() {
  var lang = localStorage.getItem('bestadsClientLang') || 'zh-CN';
  var pack = CLIENT_NAV_I18N[lang] || CLIENT_NAV_I18N['zh-CN'];
  document.querySelectorAll('[data-i18n-nav="nav_referral_rebate"]').forEach(function (el) {
    if (pack.nav_referral_rebate) el.textContent = pack.nav_referral_rebate;
  });
  document.querySelectorAll('[data-i18n-nav="nav_location_fee"]').forEach(function (el) {
    if (pack.nav_location_fee) el.textContent = pack.nav_location_fee;
  });
}

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
    const target = document.getElementById(targetElementId);
    if (!target) return false;
    console.log(`正在加载组件: ${componentPath} 到 ${targetElementId}`);
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    console.log(`组件 ${componentPath} 加载成功，内容长度: ${html.length}`);
    target.innerHTML = html;
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
  const hasSidebarContainer = !!document.getElementById('sidebar-container');
  const hasHeaderContainer = !!document.getElementById('header-container');
  
  // 尝试加载侧边栏
  const sidebarLoaded = hasSidebarContainer ? await loadComponent('./components/sidebar.html', 'sidebar-container') : true;
  
  // 尝试加载头部
  const headerLoaded = hasHeaderContainer ? await loadComponent('./components/header.html', 'header-container') : true;
  
  // 如果组件加载失败，使用备用方案
  if (hasSidebarContainer && !sidebarLoaded) {
    console.warn('侧边栏组件加载失败，使用备用方案');
    loadFallbackSidebar();
  }
  
  if (hasHeaderContainer && !headerLoaded) {
    console.warn('头部组件加载失败，使用备用方案');
    loadFallbackHeader();
  }
  
  // 设置当前页面激活状态
  setActiveMenuItem(currentPage);

  applyIntroducerDailyNavVisibility();
  applyClientNavI18n();
  
  // 设置页面标题
  setPageTitle(currentPage);
  
  // 更新余额信息
  updateBalanceInfo();

  ensureClientEmailSettingsStyles();
  mountClientEmailSettingsModal();
  if (shouldOpenClientEmailSettings()) {
    window.setTimeout(openClientEmailSettings, 0);
  }
}

// 获取当前页面名称
function getCurrentPageName() {
  const path = window.location.pathname;
  const filename = path.split('/').pop();
  const pageName = filename.replace('.html', '');
  return pageName === '' ? 'index' : pageName;
}

// PRD 7.1: 须同时具备 IntroducerEnabled 与运营后台「客户端可见性」为开. 静态原型用 localStorage 模拟.
function applyIntroducerDailyNavVisibility() {
  const li = document.getElementById('nav-introducer-daily');
  const homeModule = document.getElementById('home-referral-rebate-module');
  const homeQuick = document.getElementById('home-referral-rebate-quick');
  const enabled = localStorage.getItem('bestadsMockIntroducerEnabled') === '1';
  const clientOn = localStorage.getItem('bestadsMockIntroducerClientVisible') === '1';
  const show = enabled && clientOn;
  if (li) {
    if (show) li.classList.remove('hidden');
    else li.classList.add('hidden');
  }
  if (homeModule) {
    if (show) homeModule.classList.remove('hidden');
    else homeModule.classList.add('hidden');
  }
  if (homeQuick) {
    if (show) homeQuick.classList.remove('hidden');
    else homeQuick.classList.add('hidden');
  }
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

function mountClientEmailSettingsModal() {
  if (document.getElementById('clientEmailSettingsModal')) return;
  const modal = document.createElement('div');
  modal.id = 'clientEmailSettingsModal';
  modal.className = 'client-email-settings-backdrop hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <section class="client-email-settings-modal" aria-labelledby="clientEmailSettingsTitle">
      <div class="client-email-settings-header">
        <div>
          <h3 id="clientEmailSettingsTitle">邮件与邮箱</h3>
          <p>维护接收邮箱和低频邮件提醒开关。</p>
        </div>
        <button type="button" class="icon-button" data-client-email-action="close" aria-label="关闭">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="client-email-settings-body">
        <section class="email-settings-section">
          <div class="email-settings-section__header">
            <h4>接收邮箱</h4>
            <span>最多 5 个</span>
          </div>
          <div class="email-recipient-list" data-email-recipient-list>
            ${emailRecipientItem('media.buyer@zephyr.com')}
            ${emailRecipientItem('finance@zephyr.com')}
            ${emailRecipientItem('ops-alert@zephyr.com')}
          </div>
          <div class="email-recipient-add">
            <input class="input-field" data-email-recipient-input placeholder="输入邮箱地址">
            <button type="button" class="btn-secondary" data-client-email-action="add-recipient">
              <i class="fas fa-plus"></i>
              <span>添加</span>
            </button>
          </div>
        </section>

        <section class="email-settings-section">
          <div class="email-settings-section__header">
            <h4>提醒开关</h4>
            <span>关闭后不发送对应邮件</span>
          </div>
          <div class="email-toggle-list">
            ${emailToggleItem('续航不足', '广告账户余额按均耗可能撑不过约定天数', true)}
            ${emailToggleItem('钱包不足·事件', '自动充值因钱包不够失败或跳过', true)}
            ${emailToggleItem('钱包不足·预测', '建议充值合计可能大于钱包可用余额', true)}
            ${emailToggleItem('自动充失败', '自动充值失败，且原因不是钱包不足', true)}
            ${emailToggleItem('账户充失败', '手动账户充值提交后链路失败', true)}
            ${emailToggleItem('钱包到账', '在线充值成功或转账审核通过后入账', true)}
            ${emailToggleItem('清零/减款成功', '广告账户清零或减款成功后，余额已退回钱包', true)}
          </div>
        </section>
      </div>
      <div class="client-email-settings-footer">
        <button type="button" class="btn-secondary" data-client-email-action="close">取消</button>
        <button type="button" class="btn-primary" data-client-email-action="save">保存</button>
      </div>
    </section>
  `;
  document.body.appendChild(modal);
  bindClientEmailSettingsEvents();
}

function shouldOpenClientEmailSettings() {
  const params = new URLSearchParams(window.location.search);
  return params.get('emailSettings') === '1' || window.location.hash === '#email-settings';
}

function ensureClientEmailSettingsStyles() {
  if (document.getElementById('clientEmailSettingsRuntimeStyle')) return;
  const style = document.createElement('style');
  style.id = 'clientEmailSettingsRuntimeStyle';
  style.textContent = `
    :root{--ba-primary:#2759ff;--ba-primary-hover:#1d4be6;--ba-primary-soft:#eef3ff;--ba-success:#18a058;--ba-success-soft:#e9f8ef;--ba-danger:#e5484d;--ba-danger-soft:#fff0f0;--ba-bg:#f5f7fb;--ba-surface:#fff;--ba-surface-muted:#f8fafc;--ba-border:#e5e7eb;--ba-border-strong:#d7dce5;--ba-text:#1f2937;--ba-text-muted:#667085;--ba-text-subtle:#98a2b3;--ba-radius:8px;--ba-shadow:0 8px 24px rgba(31,41,55,.06)}
    .client-user-menu{position:relative;display:inline-flex;align-items:center}
    .client-user-button{height:36px;display:inline-flex;align-items:center;gap:8px;padding:0 8px;border:1px solid transparent;border-radius:var(--ba-radius);background:transparent;color:var(--ba-text-muted);cursor:pointer}
    .client-user-button:hover,.client-user-menu.is-open .client-user-button{border-color:var(--ba-border);background:var(--ba-surface);color:var(--ba-primary)}
    .client-user-button .fa-chevron-down{font-size:11px;color:var(--ba-text-subtle)}
    .client-avatar{width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:#fff;background:var(--ba-primary);font-size:13px;font-weight:600}
    .client-user-name{max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:500}
    .client-user-dropdown{position:absolute;right:0;top:calc(100% + 8px);z-index:900;display:none;min-width:180px;padding:6px;border:1px solid var(--ba-border);border-radius:var(--ba-radius);background:var(--ba-surface);box-shadow:0 12px 30px rgba(15,23,42,.16)}
    .client-user-menu.is-open .client-user-dropdown{display:grid;gap:2px}
    .client-user-dropdown button{width:100%;min-height:36px;display:flex;align-items:center;gap:10px;padding:0 10px;border:0;border-radius:6px;background:transparent;color:var(--ba-text);font:inherit;text-align:left;cursor:pointer}
    .client-user-dropdown button:hover{background:var(--ba-primary-soft);color:var(--ba-primary)}
    .client-email-settings-backdrop{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(15,23,42,.45);backdrop-filter:blur(4px)}
    .client-email-settings-backdrop.hidden{display:none}
    .client-email-settings-modal{width:min(720px,calc(100vw - 48px));max-height:calc(100vh - 64px);display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--ba-border);border-radius:var(--ba-radius);background:var(--ba-surface);box-shadow:0 20px 60px rgba(15,23,42,.24)}
    .client-email-settings-header,.client-email-settings-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 18px;border-bottom:1px solid var(--ba-border)}
    .client-email-settings-header h3{margin:0;color:var(--ba-text);font-size:18px;font-weight:600}.client-email-settings-header p{margin:4px 0 0;color:var(--ba-text-muted);font-size:13px}
    .client-email-settings-body{display:grid;gap:12px;padding:14px 18px;overflow-y:auto;scrollbar-gutter:stable}.client-email-settings-footer{justify-content:flex-end;border-top:1px solid var(--ba-border);border-bottom:0}
    .email-settings-section{border:1px solid var(--ba-border);border-radius:var(--ba-radius);background:var(--ba-surface)}
    .email-settings-section__header span,.email-toggle-item span{color:var(--ba-text-muted);font-size:12px}.email-recipient-item strong,.email-toggle-item strong{color:var(--ba-text);font-weight:600}
    .email-settings-section{overflow:hidden}.email-settings-section__header{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 12px;border-bottom:1px solid var(--ba-border);background:var(--ba-surface-muted)}.email-settings-section__header h4{margin:0;color:var(--ba-text);font-size:15px;font-weight:600}
    .email-recipient-list,.email-toggle-list{display:grid}.email-recipient-item{min-height:44px;display:grid;grid-template-columns:minmax(0,1fr)auto;align-items:center;gap:12px;padding:7px 12px;border-bottom:1px solid var(--ba-border)}.email-recipient-item:hover{background:var(--ba-surface-muted)}.email-recipient-item strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.email-recipient-actions{display:flex;justify-content:flex-end;gap:8px}.email-danger-text{color:var(--ba-danger)!important}.email-recipient-add{display:grid;grid-template-columns:minmax(0,1fr)auto;gap:10px;padding:10px 12px}
    .email-toggle-item{min-height:54px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:8px 12px;border-bottom:1px solid var(--ba-border)}.email-toggle-item>div{display:grid;gap:2px}.email-recipient-item:last-child,.email-toggle-item:last-child{border-bottom:0}
    .client-switch{position:relative;flex:0 0 auto;width:44px;height:24px;border:0;border-radius:999px;background:var(--ba-border-strong);cursor:pointer}.client-switch:before{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(15,23,42,.16);transition:left .16s ease}.client-switch.is-on{background:var(--ba-primary)}.client-switch.is-on:before{left:23px}
    .client-email-settings-modal .input-field{min-height:32px;padding:6px 12px;color:var(--ba-text);background:var(--ba-surface);border:1px solid var(--ba-border-strong);border-radius:var(--ba-radius);outline:none}.client-email-settings-modal .btn-primary,.client-email-settings-modal .btn-secondary,.client-email-settings-modal .btn-text{min-height:32px;border-radius:var(--ba-radius);padding:6px 14px;border:1px solid transparent;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:500;cursor:pointer}.client-email-settings-modal .btn-primary{color:#fff!important;background:var(--ba-primary)!important;border-color:var(--ba-primary)!important}.client-email-settings-modal .btn-secondary{color:var(--ba-primary)!important;background:var(--ba-surface)!important;border-color:var(--ba-primary)!important}.client-email-settings-modal .btn-text{color:var(--ba-primary)!important;background:transparent!important}
    .client-email-settings-modal .icon-button{width:32px;height:32px;border:1px solid var(--ba-border);border-radius:var(--ba-radius);background:var(--ba-surface);color:var(--ba-text-muted);display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
    .client-toast-stack{position:fixed;top:72px;right:24px;z-index:1100;display:grid;gap:8px}.client-toast{min-width:220px;max-width:360px;padding:10px 14px;border:1px solid var(--ba-border);border-left:3px solid var(--ba-success);border-radius:var(--ba-radius);background:var(--ba-surface);color:var(--ba-text);box-shadow:var(--ba-shadow);font-size:13px}.client-toast.error{border-left-color:var(--ba-danger)}.client-modal-open{overflow:hidden}
    @media (max-width:768px){.email-recipient-item{grid-template-columns:1fr}.email-recipient-actions{justify-content:flex-start}}
  `;
  document.head.appendChild(style);
}

function emailRecipientItem(email) {
  const normalizedEmail = normalizeClientEmail(email);
  const safeEmail = escapeClientHtml(normalizedEmail);
  return `
    <div class="email-recipient-item" data-email-value="${safeEmail}">
      <strong>${safeEmail}</strong>
      <div class="email-recipient-actions">
        <button type="button" class="btn-text email-danger-text" data-client-email-action="remove-recipient">删除</button>
      </div>
    </div>
  `;
}

function normalizeClientEmail(value) {
  return String(value == null ? '' : value).trim().toLowerCase();
}

function emailToggleItem(title, desc, enabled) {
  const safeTitle = escapeClientHtml(title);
  const safeDesc = escapeClientHtml(desc);
  return `
    <div class="email-toggle-item">
      <div>
        <strong>${safeTitle}</strong>
        <span>${safeDesc}</span>
      </div>
      <button type="button" class="client-switch ${enabled ? 'is-on' : ''}" data-client-email-action="toggle-email" aria-pressed="${enabled ? 'true' : 'false'}" aria-label="${safeTitle}"></button>
    </div>
  `;
}

function escapeClientHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bindClientEmailSettingsEvents() {
  if (window.__clientEmailSettingsBound) return;
  window.__clientEmailSettingsBound = true;
  document.addEventListener('click', function (event) {
    const userToggle = event.target.closest('[data-client-user-toggle]');
    if (userToggle) {
      event.preventDefault();
      toggleClientUserMenu(userToggle);
      return;
    }
    if (!event.target.closest('[data-client-user-menu]')) closeClientUserMenus();

    const actionNode = event.target.closest('[data-client-email-action]');
    if (!actionNode) {
      if (event.target.id === 'clientEmailSettingsModal') closeClientEmailSettings();
      return;
    }
    const action = actionNode.dataset.clientEmailAction;
    if (action === 'open-settings') {
      closeClientUserMenus();
      openClientEmailSettings();
    }
    if (action === 'close') closeClientEmailSettings();
    if (action === 'save') saveClientEmailSettings();
    if (action === 'add-recipient') addClientEmailRecipient();
    if (action === 'remove-recipient') removeClientEmailRecipient(actionNode);
    if (action === 'toggle-email') toggleClientEmailSetting(actionNode);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeClientUserMenus();
      closeClientEmailSettings();
    }
  });
}

function toggleClientUserMenu(button) {
  const menu = button.closest('[data-client-user-menu]');
  if (!menu) return;
  const open = !menu.classList.contains('is-open');
  closeClientUserMenus();
  menu.classList.toggle('is-open', open);
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeClientUserMenus() {
  document.querySelectorAll('[data-client-user-menu].is-open').forEach(function (menu) {
    menu.classList.remove('is-open');
    menu.querySelector('[data-client-user-toggle]')?.setAttribute('aria-expanded', 'false');
  });
}

function openClientEmailSettings() {
  mountClientEmailSettingsModal();
  const modal = document.getElementById('clientEmailSettingsModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.classList.add('client-modal-open');
}

function closeClientEmailSettings() {
  const modal = document.getElementById('clientEmailSettingsModal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.classList.remove('client-modal-open');
}

function saveClientEmailSettings() {
  closeClientEmailSettings();
  clientToast('邮件与邮箱设置已保存');
}

function addClientEmailRecipient() {
  const input = document.querySelector('[data-email-recipient-input]');
  const list = document.querySelector('[data-email-recipient-list]');
  if (!input || !list) return;
  const email = normalizeClientEmail(input.value);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    clientToast('请输入正确的邮箱地址', 'error');
    return;
  }
  const duplicate = Array.from(list.querySelectorAll('.email-recipient-item')).some(function (item) {
    const existingEmail = item.dataset.emailValue || item.querySelector('strong')?.textContent;
    return normalizeClientEmail(existingEmail) === email;
  });
  if (duplicate) {
    clientToast('该邮箱已存在', 'error');
    input.focus();
    input.select();
    return;
  }
  if (list.querySelectorAll('.email-recipient-item').length >= 5) {
    clientToast('最多添加 5 个邮箱', 'error');
    return;
  }
  list.insertAdjacentHTML('beforeend', emailRecipientItem(email));
  input.value = '';
  clientToast('邮箱已添加');
}

function removeClientEmailRecipient(button) {
  button.closest('.email-recipient-item')?.remove();
  clientToast('邮箱已删除');
}

function toggleClientEmailSetting(button) {
  const enabled = !button.classList.contains('is-on');
  button.classList.toggle('is-on', enabled);
  button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  clientToast(`${button.getAttribute('aria-label')}${enabled ? '已开启' : '已关闭'}`);
}

function clientToast(message, type = 'success') {
  let stack = document.querySelector('.client-toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'client-toast-stack';
    document.body.appendChild(stack);
  }
  const toast = document.createElement('div');
  toast.className = `client-toast ${type}`;
  toast.textContent = message;
  stack.appendChild(toast);
  window.setTimeout(function () { toast.remove(); }, 2000);
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
        <a href="ad-management.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="ad-management">
          <i class="fas fa-ad mr-3" style="color: #B0B5C0;"></i>
          <span>广告管理</span>
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
        <a href="location-fee.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="location-fee">
          <i class="fas fa-globe mr-3" style="color: #B0B5C0;"></i>
          <span data-i18n-nav="nav_location_fee">地区税费</span>
        </a>
      </li>
      <li>
        <a href="auto-recharge-rules.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="auto-recharge-rules">
          <i class="fas fa-sync-alt mr-3" style="color: #B0B5C0;"></i>
          <span>自动充值规则</span>
        </a>
      </li>
      <li id="nav-introducer-daily" class="hidden">
        <a href="introducer-daily-consume.html" class="sidebar-item flex items-center px-4 py-3 text-white hover:text-white rounded-md transition-all duration-200" style="color: #B0B5C0;" onmouseover="this.style.backgroundColor='#1E2230'" onmouseout="this.style.backgroundColor='transparent'" data-page="introducer-daily-consume">
          <i class="fas fa-hand-holding-usd mr-3" style="color: #B0B5C0;"></i>
          <span data-i18n-nav="nav_referral_rebate">推荐返佣</span>
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
	    <div class="client-user-menu" data-client-user-menu>
	      <button type="button" class="client-user-button" data-client-user-toggle aria-haspopup="menu" aria-expanded="false">
	        <span class="client-avatar">A</span>
	        <span class="client-user-name">客户</span>
	        <i class="fas fa-chevron-down"></i>
	      </button>
	      <div class="client-user-dropdown" role="menu">
	        <button type="button" role="menuitem" data-client-email-action="open-settings">
	          <i class="fas fa-envelope"></i>
	          <span>邮件与邮箱</span>
	        </button>
	      </div>
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
  applyIntroducerDailyNavVisibility,
  openClientEmailSettings,
  PAGE_CONFIG,
  BALANCE_DATA
};

window.openClientEmailSettings = openClientEmailSettings;
window.closeClientEmailSettings = closeClientEmailSettings;
