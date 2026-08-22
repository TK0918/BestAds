(function () {
  const LANG_KEY = 'bestadsClientLang';
  const THEME_KEY = 'bestadsClientTheme';
  const activeTabByPage = {};
  const modalContext = {};

  const menuConfig = [
    {
      id: 'ad',
      title: { 'zh-CN': '广告管理', 'en-US': 'Ad Mgmt' },
      mode: true,
      items: []
    },
    {
      id: 'assets',
      title: { 'zh-CN': '资产管理', 'en-US': 'Assets' },
      items: [
        { id: 'account-management', label: { 'zh-CN': '账户管理', 'en-US': 'Accounts' }, href: './account-management.html' },
        { id: 'wallet', label: { 'zh-CN': '余额管理', 'en-US': 'Balance' }, href: './wallet.html' },
        { id: 'operation-records', label: { 'zh-CN': '操作记录', 'en-US': 'Records' }, href: './operation-records.html' },
        { id: 'location-fee', label: { 'zh-CN': '税费明细', 'en-US': 'Tax Details' }, href: './location-fee.html' },
        { id: 'introducer-daily-consume', label: { 'zh-CN': '推荐返佣', 'en-US': 'Referral' }, href: './introducer-daily-consume.html' }
      ]
    },
    {
      id: 'users',
      title: { 'zh-CN': '用户管理', 'en-US': 'Users' },
      items: [
        { id: 'sub-account-management', label: { 'zh-CN': '子账号管理', 'en-US': 'Sub-accounts' }, href: './sub-account-management.html' },
        { id: 'role-management', label: { 'zh-CN': '角色管理', 'en-US': 'Roles' }, href: './role-management.html' }
      ]
    },
    {
      id: 'settings',
      title: { 'zh-CN': '设置', 'en-US': 'Settings' },
      items: [
        { id: 'auto-recharge-rules', label: { 'zh-CN': '自动充值设置', 'en-US': 'Auto Recharge' }, href: './auto-recharge-rules.html' }
      ]
    }
  ];

  const columnTranslations = {
    '申请ID': { 'zh-CN': '申请ID', 'en-US': 'Application ID' },
    '投放信息': { 'zh-CN': '投放信息', 'en-US': 'Campaign Info' },
    '账户数': { 'zh-CN': '账户数', 'en-US': 'Accounts' },
    '初始报价': { 'zh-CN': '初始报价', 'en-US': 'Initial Quote' },
    '最终报价': { 'zh-CN': '最终报价', 'en-US': 'Final Quote' },
    '钱包扣款': { 'zh-CN': '钱包扣款', 'en-US': 'Wallet Charge' },
    '操作': { 'zh-CN': '操作', 'en-US': 'Actions' },
    'BM ID': { 'zh-CN': 'BM ID', 'en-US': 'BM ID' },
    'MCC': { 'zh-CN': 'MCC', 'en-US': 'MCC' },
    'BC': { 'zh-CN': 'BC', 'en-US': 'BC' },
    'BM名称': { 'zh-CN': 'BM名称', 'en-US': 'BM Name' },
    '时区和数量': { 'zh-CN': '时区和数量', 'en-US': 'Time Zone / Qty' },
    '申请时间': { 'zh-CN': '申请时间', 'en-US': 'Applied Time' },
    '状态': { 'zh-CN': '状态', 'en-US': 'Status' },
    '充值ID': { 'zh-CN': '充值ID', 'en-US': 'Recharge ID' },
    '减款ID': { 'zh-CN': '减款ID', 'en-US': 'Deduction ID' },
    '清零ID': { 'zh-CN': '清零ID', 'en-US': 'Clear ID' },
    '平台': { 'zh-CN': '平台', 'en-US': 'Platform' },
    '提交时间': { 'zh-CN': '提交时间', 'en-US': 'Submitted Time' },
    '广告账户ID': { 'zh-CN': '广告账户ID', 'en-US': 'Ad Account ID' },
    '广告账户名称': { 'zh-CN': '广告账户名称', 'en-US': 'Ad Account Name' },
    '广告账户币种': { 'zh-CN': '广告账户币种', 'en-US': 'Currency' },
    '充值金额': { 'zh-CN': '充值金额', 'en-US': 'Recharge Amount' },
    '减款金额': { 'zh-CN': '减款金额', 'en-US': 'Deduction Amount' },
    '清零金额': { 'zh-CN': '清零金额', 'en-US': 'Clear Amount' },
    '实际到账金额': { 'zh-CN': '实际到账金额', 'en-US': 'Actual Arrival' },
    '完成时间': { 'zh-CN': '完成时间', 'en-US': 'Completed Time' },
    '消耗日期': { 'zh-CN': '消耗日期', 'en-US': 'Spend Date' },
    '国家/地区': { 'zh-CN': '国家/地区', 'en-US': 'Country/Region' },
    '币种': { 'zh-CN': '币种', 'en-US': 'Currency' },
    '应税消耗': { 'zh-CN': '应税消耗', 'en-US': 'Taxable Spend' },
    '税率': { 'zh-CN': '税率', 'en-US': 'Tax Rate' },
    '估算税费': { 'zh-CN': '估算税费', 'en-US': 'Estimated Tax' },
    '计算季度': { 'zh-CN': '计算季度', 'en-US': 'Quarter' },
    '客户名称': { 'zh-CN': '客户名称', 'en-US': 'Customer' },
    '媒体': { 'zh-CN': '媒体', 'en-US': 'Media' },
    '消耗范围': { 'zh-CN': '消耗范围', 'en-US': 'Spend Range' },
    '消耗 (USD)': { 'zh-CN': '消耗 (USD)', 'en-US': 'Spend (USD)' },
    '吐点比例': { 'zh-CN': '吐点比例', 'en-US': 'Rebate Rate' },
    '佣金 (USD)': { 'zh-CN': '佣金 (USD)', 'en-US': 'Commission (USD)' },
    '账号名': { 'zh-CN': '账号名', 'en-US': 'Account' },
    '姓名': { 'zh-CN': '姓名', 'en-US': 'Name' },
    '绑定角色': { 'zh-CN': '绑定角色', 'en-US': 'Role' },
    '管理余额账户': { 'zh-CN': '管理余额账户', 'en-US': 'Balance Accounts' },
    '管理广告账户': { 'zh-CN': '管理广告账户', 'en-US': 'Ad Accounts' },
    '最近登录时间': { 'zh-CN': '最近登录时间', 'en-US': 'Last Login' },
    '创建时间': { 'zh-CN': '创建时间', 'en-US': 'Created Time' },
    '操作': { 'zh-CN': '操作', 'en-US': 'Actions' },
    '角色名': { 'zh-CN': '角色名', 'en-US': 'Role Name' },
    '绑定用户数': { 'zh-CN': '绑定用户数', 'en-US': 'Users' },
    '更新时间': { 'zh-CN': '更新时间', 'en-US': 'Updated Time' },
    '规则名称': { 'zh-CN': '规则名称', 'en-US': 'Rule Name' },
    '账户数': { 'zh-CN': '账户数', 'en-US': 'Accounts' },
    '生效时间': { 'zh-CN': '生效时间', 'en-US': 'Active Time' },
    '自动充值冷却期': { 'zh-CN': '自动充值冷却期', 'en-US': 'Cooldown' },
    '单日充值次数上限': { 'zh-CN': '单日充值次数上限', 'en-US': 'Daily Limit' }
  };

  function lang() {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored) return stored;
    return document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('en') ? 'en-US' : 'zh-CN';
  }

  function theme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  function text(value) {
    if (value == null) return '';
    if (typeof value === 'object' && !Array.isArray(value)) return value[lang()] || value['zh-CN'] || value['en-US'] || '';
    return String(value);
  }

  function pagePack(pageId) {
    const all = window.BESTADS_CLIENT_PAGES || {};
    return all.i18n?.[lang()]?.pages?.[pageId] || all.i18n?.['zh-CN']?.pages?.[pageId] || {};
  }

  function commonPack() {
    const all = window.BESTADS_CLIENT_PAGES || {};
    return all.i18n?.[lang()]?.common || all.i18n?.['zh-CN']?.common || {};
  }

  function tCommon(key, values) {
    let value = commonPack()[key] || key;
    Object.keys(values || {}).forEach((name) => {
      value = value.replace(`{${name}}`, values[name]);
    });
    return value;
  }

  function columnLabel(column) {
    return text(columnTranslations[column] || column);
  }

  function optionLabel(option) {
    if (option === '启用' || option === '停用' || option === '完成' || option === '失败' || option === '处理中') return statusI18n(option);
    if (option === '3 小时') return lang() === 'zh-CN' ? option : '3 hours';
    if (option === '1 小时') return lang() === 'zh-CN' ? option : '1 hour';
    if (option === '3 次/日') return lang() === 'zh-CN' ? option : '3 / day';
    return option;
  }

  function tPage(pageId, key) {
    return pagePack(pageId)[key] || key;
  }

  function html(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function pageIdFromDocument() {
    return document.body.dataset.clientPage || location.pathname.split('/').pop().replace('.html', '') || 'index';
  }

  function renderMenuInto(sidebar, activeId) {
    if (!sidebar) return;
    sidebar.innerHTML = `
      <div class="client-brand">
        <span class="client-brand-mark">B</span>
        <span class="client-brand-name">BestAds</span>
      </div>
      <div class="client-mode-toggle"><button class="client-mode-button" type="button">${html(text(menuConfig[0].title))}</button></div>
      <nav class="client-nav">
        ${menuConfig.filter((group) => !group.mode).map((group) => `
          <section class="client-nav-group">
            <div class="client-nav-title">${html(text(group.title))}</div>
            ${group.items.map((item) => `
              <a class="client-nav-item ${item.id === activeId ? 'active' : ''}" href="${item.href}" data-client-menu-item="${item.id}">${html(text(item.label))}</a>
            `).join('')}
          </section>
        `).join('')}
      </nav>
    `;
  }

  function renderLegacyMenu(activeId) {
    document.querySelectorAll('aside.sidebar').forEach((sidebar) => {
      sidebar.innerHTML = `
        <div class="brand">
          <span class="brand-mark">B</span>
          <span class="brand-name">BestAds</span>
        </div>
        <div class="mode-toggle">
          <button class="mode-button" type="button">${html(text(menuConfig[0].title))}</button>
        </div>
        <nav>
          ${menuConfig.filter((group) => !group.mode).map((group) => `
            <section class="menu-group">
              <div class="menu-title">${html(text(group.title))}</div>
              ${group.items.map((item) => `
                <a class="menu-item ${item.id === activeId ? 'active' : ''}" href="${item.href}" data-client-menu-item="${item.id}">${html(text(item.label))}</a>
              `).join('')}
            </section>
          `).join('')}
        </nav>
      `;
    });
  }

  function applyLegacyMenuClassMap() {
    if (document.getElementById('clientLegacyMenuStyle')) return;
    const style = document.createElement('style');
    style.id = 'clientLegacyMenuStyle';
    style.textContent = `
      aside.sidebar .mode-toggle { width: 100%; height: 34px; display: flex; align-items: flex-start; justify-content: center; padding-bottom: 6px; }
      aside.sidebar .mode-button { width: 98px; height: 28px; margin: 0; padding: 0 14px; font-size: 12px; line-height: 14px; }
      aside.sidebar nav,
      aside.sidebar .menu-group { width: 192px; margin-left: 0; margin-right: 0; }
      aside.sidebar nav { margin-top: 4px; }
      aside.sidebar .menu-title,
      aside.sidebar .menu-item { width: 100%; box-sizing: border-box; white-space: nowrap; }
      aside.sidebar .menu-item { display: flex; overflow: hidden; text-overflow: ellipsis; }
      body.theme-dark aside.sidebar .client-brand-name { color: #ffffff; }
      body.theme-dark aside.sidebar .menu-title,
      body.theme-dark aside.sidebar .menu-item { color: #cbd5e1; }
      body.theme-dark aside.sidebar .menu-item.active { background: #eef3ff; color: #2759ff; }
    `;
    document.head.appendChild(style);
  }

  function applyLanguageToDocument() {
    document.documentElement.lang = lang() === 'zh-CN' ? 'zh-CN' : 'en';
  }

  function applyTheme(themeName) {
    document.body.classList.toggle('theme-dark', themeName === 'dark');
    localStorage.setItem(THEME_KEY, themeName);
    document.querySelectorAll('[data-client-theme-label]').forEach((el) => {
      el.textContent = themeName === 'dark' ? (lang() === 'zh-CN' ? '浅色模式' : 'Light Mode') : (lang() === 'zh-CN' ? '暗黑模式' : 'Dark Mode');
    });
  }

  function renderShell(pageId) {
    const app = document.getElementById('clientApp');
    if (!app) {
      applyLegacyMenuClassMap();
      renderLegacyMenu(pageId);
      return false;
    }
    app.className = 'client-app';
    app.innerHTML = `
      <aside class="client-sidebar" id="clientSidebar"></aside>
      <main class="client-main">
        <header class="client-topbar">
          <h1 class="client-page-title" id="clientPageTitle"></h1>
          <div class="client-top-actions">
            <span class="client-wallet-value">-2512.38USD</span>
            <button class="client-top-link theme" type="button" data-client-action="toggle-theme" data-client-theme-label></button>
            <button class="client-icon-button" type="button" aria-label="Notifications">!</button>
            <button class="client-top-link" type="button" data-client-action="toggle-language" data-client-lang-label></button>
            <div class="client-user-menu" data-client-user-menu>
              <button type="button" class="client-user-button" data-client-user-toggle aria-haspopup="menu" aria-expanded="false">
                <span class="client-avatar">A</span>
                <span class="client-user-name">${lang() === 'zh-CN' ? '客户' : 'Customer'}</span>
                <span class="client-user-chevron">⌄</span>
              </button>
              <div class="client-user-dropdown" role="menu">
                <button type="button" role="menuitem" data-client-email-action="open-settings">
                  <span>✉</span>
                  <span>${lang() === 'zh-CN' ? '邮件与邮箱' : 'Email & Mailbox'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div class="client-content">
          <section class="client-page-card">
            <div id="clientPageMount"></div>
          </section>
        </div>
      </main>
      <div id="clientShellModal" class="client-modal-root" aria-hidden="true"></div>
      <div id="clientShellToast" class="client-shell-toast" role="status"></div>
    `;
    renderMenuInto(document.getElementById('clientSidebar'), pageId);
    return true;
  }

  function updateShellLabels(pageId) {
    const pageTitle = pagePack(pageId).title || '';
    const titleEl = document.getElementById('clientPageTitle');
    if (titleEl) titleEl.textContent = pageTitle;
    document.title = `${pageTitle || 'BestAds'} - BestAds`;
    document.querySelectorAll('[data-client-lang-label]').forEach((el) => {
      el.textContent = lang() === 'zh-CN' ? '中文' : 'English';
    });
    document.querySelectorAll('.client-user-name').forEach((el) => {
      el.textContent = lang() === 'zh-CN' ? '客户' : 'Customer';
    });
    document.querySelectorAll('[data-client-email-action="open-settings"] span:last-child').forEach((el) => {
      el.textContent = lang() === 'zh-CN' ? '邮件与邮箱' : 'Email & Mailbox';
    });
    applyTheme(theme());
  }

  function renderToolbar(pageId, toolbar, actions) {
    const fields = (toolbar || []).map((item) => {
      if (item.type === 'range') {
        return `
          <label class="client-range">
            <input type="text" value="${html(item.start)}" placeholder="${html(tPage(pageId, item.startKey))}">
            <span>-</span>
            <input type="text" value="${html(item.end)}" placeholder="${html(tPage(pageId, item.endKey))}">
          </label>
        `;
      }
      if (item.type === 'select') {
        const placeholder = item.commonKey ? tCommon(item.commonKey) : tPage(pageId, item.key);
        return `
          <select class="client-select">
            ${(item.options || ['']).map((option, index) => `<option value="${html(option)}">${html(index === 0 && option === '' ? placeholder : optionLabel(option))}</option>`).join('')}
          </select>
        `;
      }
      return `<input class="client-input" type="text" placeholder="${html(tPage(pageId, item.key))}">`;
    }).join('');

    const actionHtml = (actions || []).map((action) => {
      if (action.kind === 'query') return `<button class="client-button primary" type="button" data-client-page-action="query">${html(tCommon('query'))}</button>`;
      if (action.kind === 'search') return `<button class="client-button primary" type="button" data-client-page-action="query">${html(tCommon('search'))}</button>`;
      if (action.kind === 'export') return `<button class="client-button" type="button" data-client-page-action="export">${html(tCommon('export'))}</button>`;
      return `<button class="client-button ${action.primary ? 'primary' : ''}" type="button" data-client-page-action="${html(action.action)}">${html(tPage(pageId, action.labelKey))}</button>`;
    }).join('');

    return `
      <div class="client-toolbar compact">
        ${fields}
        <span class="client-toolbar-spacer"></span>
        <span class="client-toolbar-actions">${actionHtml}</span>
      </div>
    `;
  }

  function tag(status) {
    const normalized = String(status || '');
    const cls = /启用|完成|成功|已付款|已扣款/.test(normalized) ? 'success' : /失败|取消|退款/.test(normalized) ? 'failed' : 'warning';
    const label = statusI18n(normalized);
    return `<span class="client-tag ${cls}">${html(label)}</span>`;
  }

  function statusI18n(status) {
    if (lang() === 'zh-CN') return status;
    const map = {
      '启用': 'Enabled',
      '停用': 'Disabled',
      '完成': 'Completed',
      '失败': 'Failed',
      '处理中': 'Processing',
      '待确认': 'Awaiting Confirmation',
      '待运营审核': 'Pending Review',
      '待客户确认付款': 'Payment Confirmation',
      '已付款待开户': 'Paid, Opening',
      '开户成功': 'Opened',
      '部分成功': 'Partial Success',
      '开户取消': 'Canceled',
      '扣款异常': 'Payment Exception'
    };
    return map[status] || status;
  }

  function clientOpeningStatus(row) {
    const status = String(row?.openingStatus || row?.status || '');
    if (status === '待客户确认付款' || status === '待确认') return '待确认';
    if (status === '开户成功' || status === '部分成功' || status === '完成') return '完成';
    if (status === '开户取消' || status === '失败' || status === '审核不通过') return '失败';
    return '处理中';
  }

  function openingIsPaymentProcessing(row) {
    return row?.openingStatus === '扣款异常' || row?.paymentStatus === '部分扣款失败';
  }

  function renderCell(cell) {
    if (cell && typeof cell === 'object' && !Array.isArray(cell) && Object.prototype.hasOwnProperty.call(cell, 'status')) {
      return tag(cell.status);
    }
    return html(cell);
  }

  function renderTable(columns, rows, rowRenderer) {
    const body = rows.length
      ? rows.map((row, index) => rowRenderer ? rowRenderer(row, index) : `<tr>${row.map((cell) => `<td>${renderCell(cell)}</td>`).join('')}</tr>`).join('')
      : `<tr><td colspan="${columns.length}"><div class="client-empty">${html(tCommon('empty'))}</div></td></tr>`;
    return `
      <div class="client-table-wrap">
        <table class="client-table">
          <thead>
            <tr>${columns.map((column) => `<th>${html(columnLabel(column))}</th>`).join('')}</tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
      <div class="client-pagination">
        <span>${html(tCommon('total', { count: rows.length }))}</span>
        <span class="client-page-number">1</span>
        <select class="client-select" style="width: 96px;"><option>${html(tCommon('pageSize'))}</option></select>
      </div>
    `;
  }

  function openingRowActions(pageId, row, index) {
    const actions = [
      { label: tPage(pageId, 'viewDetail'), action: 'opening-view', index }
    ];
    if (row.status === '待确认' || row.openingStatus === '待客户确认付款') {
      actions.splice(1, 0, { label: tPage(pageId, 'confirmPayment'), action: 'opening-confirm', index, primary: true });
    }
    return rowActions(actions);
  }

  function renderOpeningRecords(pageId, data) {
    const rows = data.rows || [];
    const columns = ['申请ID', '媒体', '投放信息', '账户数', '初始报价', '最终报价', '钱包扣款', '状态', '操作'];
    return renderTable(columns, rows, (row, index) => `
      <tr>
        <td>${html(row.applyId || '-')}</td>
        <td>${html(row.mediaChannel || '-')}</td>
        <td class="client-wrap-cell">
          <div class="client-cell-stack">
            <strong>${html(row.url || '-')}</strong>
            <span>${html([row.country, row.timezone].filter(Boolean).join(' · ') || '-')}</span>
            <span>${html([row.dailyBudget, row.category].filter(Boolean).join(' · ') || '-')}</span>
          </div>
        </td>
        <td>${html(row.accountCount || '-')}</td>
        <td>${html(row.initialQuote || '-')}</td>
        <td>${html(row.finalQuote || '-')}</td>
        <td>${html(row.walletCharge || '-')}</td>
        <td>${tag(clientOpeningStatus(row))}</td>
        <td class="client-actions-cell">${openingRowActions(pageId, row, index)}</td>
      </tr>
    `);
  }

  function renderOperationRecords(pageId, data) {
    const tabId = activeTabByPage[pageId] || data.defaultTab;
    const tabs = data.tabs || [];
    const active = tabs.find((tab) => tab.id === tabId) || tabs[0];
    const labels = pagePack(pageId).tabs || [];
    return `
      <div class="client-page-stack">
        <div class="client-tabs">
          ${tabs.map((tab) => `<button class="client-tab ${tab.id === active.id ? 'active' : ''}" type="button" data-client-tab="${tab.id}">${html(labels[tab.labelKey] || tab.id)}</button>`).join('')}
        </div>
        ${renderToolbar(pageId, active.toolbar, active.actions)}
        ${active.id === 'opening' ? renderOpeningRecords(pageId, active) : renderTable(active.columns, active.rows)}
      </div>
    `;
  }

  function renderLocationFee(pageId, data) {
    const page = pagePack(pageId);
    return `
      <div class="client-page-stack">
        <div class="client-summary-grid four">
          ${data.summary.map(([key, value]) => `
            <div class="client-summary-item">
              <div class="client-summary-label">${html(page[key])}</div>
              <div class="client-summary-value">${html(value)}</div>
            </div>
          `).join('')}
        </div>
        <div class="client-note">
          <div class="client-note-title">${html(page.noticeTitle)}</div>
          <p>${html(page.notice1)}</p>
          <p>${html(page.notice2)}</p>
          <p>${html(page.notice3)}</p>
        </div>
        <div class="client-summary-grid">
          ${data.reference.map(([key, value]) => `
            <div class="client-summary-item">
              <div class="client-summary-label">${html(page[key])}</div>
              <div class="client-summary-value">${html(value)}</div>
            </div>
          `).join('')}
        </div>
        ${renderToolbar(pageId, data.toolbar, data.actions)}
        ${renderTable(data.columns, data.rows)}
      </div>
    `;
  }

  function renderReferral(pageId, data) {
    const page = pagePack(pageId);
    return `
      <div class="client-page-stack">
        ${renderToolbar(pageId, data.toolbar, data.actions)}
        <div class="client-summary-grid">
          ${data.summary.map(([key, value]) => `
            <div class="client-summary-item">
              <div class="client-summary-label">${html(page[key])}</div>
              <div class="client-summary-value">${html(value)}</div>
            </div>
          `).join('')}
        </div>
        <div class="client-note"><p>${html(page.disclaimer)}</p></div>
        ${renderTable(data.columns, data.rows)}
      </div>
    `;
  }

  function rowActions(actions) {
    return `<span class="client-action-row">${actions.map((action) => `<button class="client-link ${action.danger ? 'danger' : ''} ${action.primary ? 'primary' : ''}" type="button" data-client-page-action="${html(action.action)}" data-row-index="${action.index}">${html(action.label)}</button>`).join('')}</span>`;
  }

  function numberFromText(value) {
    const amount = Number(String(value || '').replace(/,/g, '').replace(/[^\d.-]/g, ''));
    return Number.isFinite(amount) ? amount : 0;
  }

  window.BESTADS_OPENING_FEE = window.BESTADS_OPENING_FEE || { amount: 30, currency: 'USD' };
  window.BESTADS_CLIENT_MERCHANT_ID = window.BESTADS_CLIENT_MERCHANT_ID || '1128';
  window.BESTADS_MERCHANT_OPENING_FEE_STATUS = window.BESTADS_MERCHANT_OPENING_FEE_STATUS || {
    '11894': '已收取',
    '18888': '不收取',
    '19901': '未收取'
  };
  window.BESTADS_WALLET_FX = window.BESTADS_WALLET_FX || { USD: 1, EUR: 0.92, GBP: 0.78, HKD: 7.8 };
  window.BESTADS_CLIENT_WALLET = window.BESTADS_CLIENT_WALLET || { currency: 'USD', available: 5000 };

  const CLIENT_OPENING_RULES = [
    { mediaChannel: 'Facebook', priority: 10, countryMatch: ['美国', '加拿大', '英国', '法国', '荷兰'], categoryMatch: ['服饰配件', '家居收纳', '美妆个护'], minDailyBudget: 0, maxDailyBudget: 500, prechargeBasePerAccount: 550, currency: ['USD'] },
    { mediaChannel: 'Facebook', priority: 20, countryMatch: ['美国', '加拿大', '英国', '法国'], categoryMatch: ['宠物用品', '家居收纳', '服饰配件'], minDailyBudget: 0, maxDailyBudget: 800, prechargeBasePerAccount: 650, currency: ['USD'] },
    { mediaChannel: 'Facebook', priority: 30, countryMatch: ['美国', '加拿大', '英国', '法国', '德国'], categoryMatch: ['保健品'], minDailyBudget: 0, maxDailyBudget: null, prechargeBasePerAccount: 900, currency: ['USD'] },
    { mediaChannel: 'Facebook', priority: 40, countryMatch: ['荷兰', '英国', '法国'], categoryMatch: ['美妆个护', '服饰配件', '家居收纳'], minDailyBudget: 0, maxDailyBudget: 300, prechargeBasePerAccount: 650, currency: ['USD', 'EUR'] },
    { mediaChannel: 'Google', priority: 50, countryMatch: ['美国', '英国', '加拿大'], categoryMatch: '全部', minDailyBudget: 0, maxDailyBudget: null, prechargeBasePerAccount: 500, currency: '不限' },
    { mediaChannel: 'TikTok', priority: 60, countryMatch: ['美国', '英国', '法国'], categoryMatch: ['服饰配件', '美妆个护'], minDailyBudget: 400, maxDailyBudget: null, prechargeBasePerAccount: 600, currency: ['USD'] }
  ];

  function clientWalletCurrency() {
    return window.BESTADS_CLIENT_WALLET?.currency || 'USD';
  }

  function convertClientAmount(amount, from, to) {
    const rates = window.BESTADS_WALLET_FX || { USD: 1, EUR: 0.92, GBP: 0.78, HKD: 7.8 };
    return Number(amount || 0) * ((Number(rates[to] || 1)) / (Number(rates[from] || 1)));
  }

  function clientOpeningFeeQuote() {
    const merchantId = window.BESTADS_CLIENT_MERCHANT_ID || '1128';
    const map = window.BESTADS_MERCHANT_OPENING_FEE_STATUS || {};
    const status = map[String(merchantId)] || '已收取';
    const fee = window.BESTADS_OPENING_FEE || { amount: 30, currency: 'USD' };
    return { status, amount: status === '未收取' ? Number(fee.amount) || 0 : 0, currency: fee.currency || 'USD' };
  }

  function matchClientOpeningRule(media, country, category, budget, currency) {
    const inSet = (source, target) => {
      if (!source || source === '全部' || source === '不限') return true;
      const tokens = Array.isArray(source) ? source : String(source).split(/[、/|,，]+/).map((item) => item.trim()).filter(Boolean);
      return tokens.includes(String(target || '').trim());
    };
    return CLIENT_OPENING_RULES.filter((item) => {
      if (item.mediaChannel !== media) return false;
      if (!inSet(item.countryMatch, country)) return false;
      if (!inSet(item.categoryMatch, category)) return false;
      if (!inSet(item.currency, currency || 'USD')) return false;
      if (item.minDailyBudget && budget < item.minDailyBudget) return false;
      if (item.maxDailyBudget != null && budget > item.maxDailyBudget) return false;
      return true;
    }).sort((a, b) => a.priority - b.priority)[0] || null;
  }

  function estimateOpeningQuoteBreakdown(root = document) {
    const modal = root.querySelector?.('[data-opening-apply-modal]') || root;
    const category = modal.querySelector?.('[data-opening-category]')?.value || '';
    const merchantQuote = clientOpeningFeeQuote();
    if (!category) return { ready: false, matched: false, openingFee: 0, precharge: 0, total: 0, feeStatus: merchantQuote.status };
    const media = modal.querySelector?.('[data-opening-media]')?.value || '';
    const country = modal.querySelector?.('[data-opening-country]')?.value || '';
    const budget = numberFromText(modal.querySelector?.('[data-opening-budget]')?.value);
    const currency = modal.querySelector?.('[data-opening-currency]')?.value || 'USD';
    const count = Math.min(20, Math.max(1, Number(modal.querySelector?.('[data-opening-count]')?.value) || 1));
    const rule = matchClientOpeningRule(media, country, category, budget, currency);
    const openingFee = merchantQuote.amount;
    const wallet = clientWalletCurrency();
    if (!rule) {
      return { ready: true, matched: false, openingFee, precharge: 0, total: 0, walletCurrency: wallet, feeStatus: merchantQuote.status };
    }
    const precharge = Number(rule.prechargeBasePerAccount) * count;
    const walletTotal = convertClientAmount(openingFee, 'USD', wallet) + convertClientAmount(precharge, currency, wallet);
    return { ready: true, matched: true, openingFee, precharge, total: walletTotal, walletCurrency: wallet, feeStatus: merchantQuote.status };
  }

  function estimateOpeningQuote(dailyBudget, accountCount, category) {
    return estimateOpeningQuoteBreakdown().total;
  }

  function formatQuoteAmount(amount, currency) {
    const unit = currency || document.querySelector('[data-opening-currency]')?.value || 'USD';
    return `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
  }

  function openingAccountCurrency(root = document) {
    return root.querySelector('[data-opening-currency]')?.value || 'USD';
  }

  function openingDailyBudgetValue(root = document) {
    return String(root.querySelector('[data-opening-budget]')?.value || '').trim() || '300';
  }

  function syncOpeningBudgetCurrency(root = document) {
    const suffix = root.querySelector('[data-opening-budget-currency]');
    if (suffix) suffix.textContent = openingAccountCurrency(root);
  }

  function syncOpeningEstimate(root = document) {
    const target = root.querySelector('[data-opening-estimate]');
    if (!target) return;
    const modal = root.querySelector('[data-opening-apply-modal]') || root;
    const currency = openingAccountCurrency(modal);
    const wallet = clientWalletCurrency();
    syncOpeningBudgetCurrency(modal);
    const breakdown = estimateOpeningQuoteBreakdown(modal);
    const openingFeeTarget = root.querySelector('[data-opening-estimate-opening]');
    const prechargeTarget = root.querySelector('[data-opening-estimate-precharge]');
    const categorySel = modal.querySelector('[data-opening-category]');
    if (categorySel?.value) categorySel.style.outline = '';
    if (!breakdown.ready) {
      target.textContent = '-';
      if (openingFeeTarget) openingFeeTarget.textContent = '-';
      if (prechargeTarget) prechargeTarget.textContent = '-';
      return;
    }
    if (openingFeeTarget) {
      openingFeeTarget.textContent = breakdown.openingFee > 0
        ? (wallet === 'USD' ? formatQuoteAmount(breakdown.openingFee, 'USD') : `${formatQuoteAmount(convertClientAmount(breakdown.openingFee, 'USD', wallet), wallet)}（标价 ${formatQuoteAmount(breakdown.openingFee, 'USD')}）`)
        : `${formatQuoteAmount(0, wallet)}（本次不收取开户费）`;
    }
    if (!breakdown.matched) {
      target.textContent = '-（待审核定价）';
      if (prechargeTarget) prechargeTarget.textContent = '-';
      return;
    }
    target.textContent = formatQuoteAmount(breakdown.total, wallet);
    if (prechargeTarget) prechargeTarget.textContent = formatQuoteAmount(convertClientAmount(breakdown.precharge, currency, wallet), wallet);
  }

  function parseBmIds(value) {
    return Array.from(new Set(String(value || '').split(/[\s,，]+/).map((item) => item.trim()).filter(Boolean)));
  }

  const OPENING_ASSET_SAMPLES = {
    Facebook: '121212345678901, 898989765432101',
    Google: '123-456-7890, 987-654-3210',
    TikTok: '7012345678901234567, 7098765432109876543'
  };

  function openingAssetMeta(media) {
    if (media === 'Facebook') {
      return {
        label: 'BM ID',
        placeholder: '多个 BM ID 可用逗号或空格分隔',
        tip: '仅 Facebook 需要。支持输入多个 BM ID，可用逗号或空格分隔。',
        empty: '暂未识别到 BM ID',
        sample: OPENING_ASSET_SAMPLES.Facebook
      };
    }
    if (media === 'Google') {
      return {
        label: 'MCC',
        placeholder: '多个 MCC 可用逗号或空格分隔',
        tip: '仅 Google 需要。支持输入多个 MCC，可用逗号或空格分隔。',
        empty: '暂未识别到 MCC',
        sample: OPENING_ASSET_SAMPLES.Google
      };
    }
    if (media === 'TikTok') {
      return {
        label: 'BC',
        placeholder: '多个 BC 可用逗号或空格分隔',
        tip: '仅 TikTok 需要。支持输入多个 BC，可用逗号或空格分隔。',
        empty: '暂未识别到 BC',
        sample: OPENING_ASSET_SAMPLES.TikTok
      };
    }
    return null;
  }

  function isKnownAssetSample(value) {
    const normalized = String(value || '').trim();
    return !normalized || Object.values(OPENING_ASSET_SAMPLES).includes(normalized);
  }

  function openingAssetIdLabel(media) {
    return openingAssetMeta(media)?.label || 'BM ID';
  }

  function openingAssetIdValue(row) {
    if (!openingAssetMeta(row?.mediaChannel)) return '-';
    return row?.bmIds || row?.assetIds || '-';
  }

  function syncBmPreview(root = document) {
    const preview = root.querySelector('[data-opening-bm-preview]');
    if (!preview) return;
    const modal = root.querySelector('[data-opening-apply-modal]') || root;
    const media = modal.querySelector('[data-opening-media]')?.value || '';
    const meta = openingAssetMeta(media);
    const ids = parseBmIds(root.querySelector('[data-opening-bm-ids]')?.value || '');
    preview.innerHTML = ids.length
      ? ids.map((id) => `<span class="client-bm-chip">${html(id)}</span>`).join('')
      : `<span class="client-bm-empty">${html(meta?.empty || '暂未识别到 ID')}</span>`;
  }

  function syncOpeningMediaFields(root = document) {
    const modal = root.querySelector('[data-opening-apply-modal]') || root;
    const wrap = modal.querySelector('[data-opening-bm-wrap]');
    const sel = modal.querySelector('[data-opening-media]');
    if (!wrap) return;
    const media = sel?.value || '';
    if (media && sel) sel.style.outline = '';
    const meta = openingAssetMeta(media);
    wrap.hidden = !meta;
    if (!meta) return;
    const label = wrap.querySelector('[data-opening-asset-label]');
    const input = wrap.querySelector('[data-opening-bm-ids]');
    const tip = wrap.querySelector('[data-opening-asset-tip]');
    if (label) label.textContent = meta.label;
    if (tip) tip.textContent = meta.tip;
    if (input) {
      input.placeholder = meta.placeholder;
      if (isKnownAssetSample(input.value)) input.value = meta.sample;
    }
    syncBmPreview(modal);
  }

  function openingApplyFields() {
    return `
      <div class="client-form-grid" data-opening-apply-modal>
        <label class="client-form-field">
          <span class="client-label">媒体渠道 <span class="client-required">*</span></span>
          <select class="client-select" data-opening-media>
            <option value="">请选择媒体渠道</option>
            <option value="Facebook">Facebook</option>
            <option value="Google">Google</option>
            <option value="TikTok">TikTok</option>
            <option value="Snapchat">Snapchat</option>
            <option value="AppLovin">AppLovin</option>
            <option value="Taboola">Taboola</option>
            <option value="Outbrain">Outbrain</option>
            <option value="X">X</option>
          </select>
        </label>
        <label class="client-form-field full">
          <span class="client-label">投放URL <span class="client-required">*</span></span>
          <input class="client-input" data-opening-url type="text" value="https://www.luminara-home.com">
        </label>
        <label class="client-form-field full client-bm-field" data-opening-bm-wrap hidden>
          <span class="client-label" data-opening-asset-label>BM ID</span>
          <input class="client-input" data-opening-bm-ids type="text" value="" placeholder="多个 BM ID 可用逗号或空格分隔">
          <span class="client-field-tip" data-opening-asset-tip>仅 Facebook 需要。支持输入多个 BM ID，可用逗号或空格分隔。</span>
          <span class="client-bm-preview" data-opening-bm-preview aria-live="polite"></span>
        </label>
        <label class="client-form-field">
          <span class="client-label">投放国家 <span class="client-required">*</span></span>
          <select class="client-select" data-opening-country>
            <option value="美国" selected>美国</option>
            <option value="加拿大">加拿大</option>
            <option value="英国">英国</option>
            <option value="法国">法国</option>
            <option value="荷兰">荷兰</option>
          </select>
        </label>
        <label class="client-form-field">
          <span class="client-label">时区 <span class="client-required">*</span></span>
          <select class="client-select" data-opening-timezone>
            <option value="America/Los_Angeles" selected>America/Los_Angeles</option>
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Europe/Amsterdam">Europe/Amsterdam</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="UTC">UTC</option>
          </select>
        </label>
        <label class="client-form-field">
          <span class="client-label">账户币种 <span class="client-required">*</span></span>
          <select class="client-select" data-opening-currency>
            <option value="USD" selected>USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="HKD">HKD</option>
          </select>
        </label>
        <label class="client-form-field">
          <span class="client-label">日预算 <span class="client-required">*</span></span>
          <div class="client-input-with-suffix">
            <input class="client-input" data-opening-budget type="text" inputmode="decimal" value="300" placeholder="请输入日预算">
            <span class="client-input-suffix" data-opening-budget-currency>USD</span>
          </div>
        </label>
        <label class="client-form-field">
          <span class="client-label">账户数 <span class="client-required">*</span></span>
          <input class="client-input" data-opening-count type="text" value="2">
        </label>
        <label class="client-form-field">
          <span class="client-label">投放品类 <span class="client-required">*</span></span>
          <select class="client-select" data-opening-category>
            <option value="">请选择投放品类</option>
            <option value="家居收纳">家居收纳</option>
            <option value="美妆个护">美妆个护</option>
            <option value="服饰配件">服饰配件</option>
            <option value="宠物用品">宠物用品</option>
            <option value="保健品">保健品</option>
          </select>
        </label>
        <div class="client-opening-estimate full" aria-live="polite">
          <div>
            <p class="client-opening-estimate-title">预估开户费用</p>
            <p class="client-opening-estimate-desc">开户费按商户首次一口价收取，标价为 USD，实扣和合计按钱包默认币种折算。首充按最低首充乘以账户数。日预算只用于匹配规则。无命中规则时合计为 -（待审核定价），提交时不扣款，最终金额以运营审核结果为准。</p>
            <div class="client-opening-breakdown">
              <span>开户费：<b data-opening-estimate-opening>-</b></span>
              <span>首充（广告账户充值）：<b data-opening-estimate-precharge>-</b></span>
            </div>
          </div>
          <div class="client-opening-estimate-total">
            <span>合计</span>
            <strong class="client-opening-estimate-amount" data-opening-estimate>-</strong>
          </div>
        </div>
        <label class="client-checkbox-row client-form-field full client-opening-consent">
          <input data-opening-auto-pay type="checkbox" checked>
          <span>若最终金额与初始报价一致，同意系统直接扣除开户费和各账户首充；不一致时再通知确认。</span>
        </label>
      </div>
      <div class="client-note" style="margin-top:16px;">
        <div class="client-note-title">系统提示</div>
        <p>提交后先生成初始报价快照，运营确认最终报价后再进入扣费或客户确认付款流程。</p>
      </div>
    `;
  }

  function readonlyItem(label, value, options = {}) {
    return `
      <div class="client-readonly-item ${options.full ? 'full' : ''}">
        <span class="client-readonly-label">${html(label)}</span>
        <span class="client-readonly-value ${options.emphasis ? 'emphasis' : ''}">${html(value || '-')}</span>
      </div>
    `;
  }

  function readonlySection(title, items) {
    return `
      <section class="client-readonly-section">
        <h3 class="client-readonly-title">${html(title)}</h3>
        <div class="client-readonly-grid">${items.join('')}</div>
      </section>
    `;
  }

  function openingReviewFields(row) {
    return `
      <div class="client-form-grid">
        ${formInput('初始报价', row?.initialQuote || '-', false)}
        ${formInput('最终报价', row?.finalQuote || row?.initialQuote || '-', true)}
        ${formSelect('执行方式', row?.paymentStatus === '已扣款' ? '金额一致，直接扣款' : '金额不一致，邮件通知客户确认', ['金额一致，直接扣款', '金额不一致，邮件通知客户确认'])}
        ${formInput('代理', 'Madhouse', true)}
        ${formInput('账户类型', 'Facebook-企业户', true)}
        <label class="client-form-field full">
          <span class="client-label">审核说明</span>
          <textarea class="client-textarea" placeholder="填写最终报价依据、是否需要客户确认"></textarea>
        </label>
      </div>
      <div class="client-note" style="margin-top:16px;">
        <div class="client-note-title">比对规则</div>
        <p>当前只比对总额，不对子项做校验。</p>
      </div>
    `;
  }

  function openingPaymentNote(row, forDetail) {
    if (openingIsPaymentProcessing(row)) {
      return forDetail
        ? '付款处理中，请勿重复支付。确认付款或自动扣款时其中任一笔失败，等待运营重试，请勿重复支付。'
        : '付款处理中，请勿重复支付。';
    }
    return '确认付款后会分开扣款：开户费 1 笔（金额大于 0 时），每个有首充的广告账户各 1 笔。例如申请 2 个账户且有首充，一共 3 笔。页面展示金额按当前汇率折算，实际扣款以 Fund 执行时的汇率为准，可能与展示金额有微小差异。开户失败时只退对应账户首充，开户费不随账户失败回退。开户成功表示账户已开出并已发起加款，到账以充值记录为准。';
  }

  function openingPaymentFields(row) {
    const openingFee = row?.openingFee || '-';
    const precharge = row?.precharge || '-';
    return `
      ${readonlySection('客户申请信息', [
        readonlyItem('申请ID', row?.applyId),
        readonlyItem('媒体', row?.mediaChannel),
        readonlyItem('投放国家', row?.country),
        readonlyItem('投放URL', row?.url, { full: true }),
        readonlyItem(openingAssetIdLabel(row?.mediaChannel), openingAssetIdValue(row)),
        readonlyItem('时区', row?.timezone),
        readonlyItem('日预算', row?.dailyBudget),
        readonlyItem('账户数', row?.accountCount),
        readonlyItem('投放品类', row?.category),
        readonlyItem('账户币种', row?.currency || 'USD')
      ])}
      ${readonlySection('报价与余额', [
        readonlyItem('初始报价', row?.initialQuote, { emphasis: true }),
        readonlyItem('最终报价', row?.finalQuote || row?.initialQuote, { emphasis: true }),
        readonlyItem('开户费', openingFee),
        readonlyItem('首充（广告账户充值）', precharge),
        readonlyItem('可用余额', `${Number(window.BESTADS_CLIENT_WALLET?.available || 5000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${clientWalletCurrency()}`, { emphasis: true })
      ])}
      <div class="client-note" style="margin-top:16px;">
        <div class="client-note-title">扣款说明</div>
        <p>${openingPaymentNote(row, false)}</p>
      </div>
    `;
  }

  function openingDetailFields(row) {
    return `
      <div class="client-form-grid">
        ${formInput('申请ID', row.applyId || '-', false)}
        ${formInput('状态', clientOpeningStatus(row), false)}
        ${formInput('媒体', row.mediaChannel || '-', false)}
        ${formInput('URL', row.url || '-', false)}
        ${formInput(openingAssetIdLabel(row.mediaChannel), openingAssetIdValue(row), false)}
        ${formInput('国家 / 时区', `${row.country || '-'} / ${row.timezone || '-'}`, false)}
        ${formInput('日预算', row.dailyBudget || '-', false)}
        ${formInput('账户数', row.accountCount || '-', false)}
        ${formInput('投放品类', row.category || '-', false)}
        ${formInput('账户币种', row.currency || 'USD', false)}
        ${formInput('初始报价', row.initialQuote || '-', false)}
        ${formInput('最终报价', row.finalQuote || '-', false)}
        ${formInput('开户费', row.openingFee || '-', false)}
        ${formInput('首充', row.precharge || '-', false)}
        ${formInput('钱包扣款', row.walletCharge || '-', false)}
        ${formInput('结果', row.result || '-', false)}
        ${formInput('广告账户ID', row.accountInfo || '-', false)}
        ${formInput('其他扣费单', row.openingFeeRecord || '-', false)}
        ${formInput('首充充值单', row.rechargeRecord || '-', false)}
      </div>
      <div class="client-note" style="margin-top:16px;">
        <div class="client-note-title">流程说明</div>
        <p>${openingPaymentNote(row, true)}</p>
      </div>
    `;
  }

  function showOpeningApplyModal() {
    modalContext.type = 'opening-apply';
    modalContext.rowIndex = null;
    openModal('申请开户', openingApplyFields(), { wide: true, confirmText: '提交申请' });
  }

  function showOpeningPaymentModal(row, index) {
    modalContext.type = 'opening-payment';
    modalContext.rowIndex = index;
    openModal('确认付款', openingPaymentFields(row), {
      wide: true,
      footer: `
        <button class="client-button" type="button" data-client-modal-close>关闭窗口</button>
        <button class="client-button danger" type="button" data-client-modal-cancel-opening>取消开户</button>
        <button class="client-button primary" type="button" data-client-modal-save>确认付款</button>
      `
    });
  }

  function showOpeningDetailModal(row) {
    modalContext.type = 'opening-detail';
    modalContext.rowIndex = null;
    openModal('开户详情', openingDetailFields(row), { wide: true, confirmText: '知道了' });
  }

  function renderSubAccounts(pageId, data) {
    return `
      <div class="client-page-stack">
        ${renderToolbar(pageId, data.toolbar, data.actions)}
        ${renderTable(data.columns, data.rows, (row, index) => `
          <tr>
            <td>${html(row.login)}</td>
            <td>${html(row.name)}</td>
            <td>${html(row.role)}</td>
            <td>${tag(row.status)}</td>
            <td>${html(row.balance)}</td>
            <td>${html(row.ads)}</td>
            <td>${html(row.lastLogin)}</td>
            <td>${html(row.created)}</td>
            <td class="client-actions-cell">${rowActions([
              { label: tCommon('edit'), action: 'sub-edit', index },
              { label: tCommon('resetPassword'), action: 'sub-reset', index }
            ])}</td>
          </tr>
        `)}
      </div>
    `;
  }

  function renderRoles(pageId, data) {
    return `
      <div class="client-page-stack">
        ${renderToolbar(pageId, data.toolbar, data.actions)}
        ${renderTable(data.columns, data.rows, (row, index) => `
          <tr>
            <td>${html(row.name)}</td>
            <td>${html(row.users)}</td>
            <td>${tag(row.status)}</td>
            <td>${html(row.updated)}</td>
            <td class="client-actions-cell">${rowActions([{ label: tCommon('edit'), action: 'role-edit', index }])}</td>
          </tr>
        `)}
      </div>
    `;
  }

  function renderAutoRecharge(pageId, data) {
    return `
      <div class="client-page-stack">
        ${renderToolbar(pageId, data.toolbar, data.actions)}
        ${renderTable(data.columns, data.rows, (row, index) => `
          <tr>
            <td>${html(row.name)}</td>
            <td>${html(row.accounts)}</td>
            <td>${tag(row.status)}</td>
            <td>${html(row.activeTime)}</td>
            <td>${html(row.cooldown)}</td>
            <td>${html(row.dailyLimit)}</td>
            <td>${html(row.updated)}</td>
            <td class="client-actions-cell">${rowActions([
              { label: tCommon('edit'), action: 'auto-edit', index },
              { label: row.status === '启用' ? tCommon('disable') : tCommon('enable'), action: 'auto-toggle', index, danger: row.status === '启用' }
            ])}</td>
          </tr>
        `)}
      </div>
    `;
  }

  function renderPage(pageId) {
    const mount = document.getElementById('clientPageMount');
    if (!mount) return;
    const data = window.BESTADS_CLIENT_PAGES?.data?.[pageId];
    if (!data) return;
    if (pageId === 'operation-records') mount.innerHTML = renderOperationRecords(pageId, data);
    if (pageId === 'location-fee') mount.innerHTML = renderLocationFee(pageId, data);
    if (pageId === 'introducer-daily-consume') mount.innerHTML = renderReferral(pageId, data);
    if (pageId === 'sub-account-management') mount.innerHTML = renderSubAccounts(pageId, data);
    if (pageId === 'role-management') mount.innerHTML = renderRoles(pageId, data);
    if (pageId === 'auto-recharge-rules') mount.innerHTML = renderAutoRecharge(pageId, data);
  }

  function toast(message, type = 'success') {
    const el = document.getElementById('clientShellToast');
    if (!el) return;
    el.textContent = message;
    el.className = `client-shell-toast show ${type}`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      el.className = 'client-shell-toast';
    }, 2200);
  }

  function openModal(title, body, options) {
    const modal = document.getElementById('clientShellModal');
    if (!modal) return;
    const footer = options?.footer || `
      <button class="client-button" type="button" data-client-modal-close>${html(tCommon('cancel'))}</button>
      <button class="client-button primary" type="button" data-client-modal-save>${html(options?.confirmText || tCommon('save'))}</button>
    `;
    modal.innerHTML = `
      <section class="client-modal ${options?.wide ? 'wide' : ''}">
        <div class="client-modal-header">
          <h2 class="client-modal-title">${html(title)}</h2>
          <button class="client-modal-close" type="button" data-client-modal-close>×</button>
        </div>
        <div class="client-modal-body">${body}</div>
        <div class="client-modal-footer">${footer}</div>
      </section>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    syncOpeningEstimate(modal);
    syncBmPreview(modal);
    syncOpeningMediaFields(modal);
  }

  function closeModal() {
    const modal = document.getElementById('clientShellModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function formInput(label, value, required) {
    return `
      <label class="client-form-field">
        <span class="client-label">${html(label)}${required ? ' <span class="client-required">*</span>' : ''}</span>
        <input class="client-input" style="width: 100%;" type="text" value="${html(value || '')}">
      </label>
    `;
  }

  function formSelect(label, value, options) {
    return `
      <label class="client-form-field">
        <span class="client-label">${html(label)}</span>
        <select class="client-select" style="width: 100%;">
          ${options.map((option) => `<option ${option === value ? 'selected' : ''}>${html(option)}</option>`).join('')}
        </select>
      </label>
    `;
  }

  function showSubAccountModal(pageId, row) {
    const page = pagePack(pageId);
    openModal(row ? page.modalEdit : page.modalCreate, `
      <div class="client-form-grid">
        ${formInput(page.loginName, row?.login || '', true)}
        ${formInput(page.name, row?.name || '', true)}
        ${formSelect(page.role, row?.role || 'test', ['test123', 'test', 'Management'])}
        ${formSelect(page.status, row?.status || '启用', ['启用', '停用'])}
        ${formInput(page.balanceAccounts, row?.balance || '1')}
        ${formInput(page.adAccounts, row?.ads || '0')}
        ${formInput(page.email, row?.login?.includes('@') ? row.login : '')}
        ${formInput(page.password, row ? '' : 'BestAds@2026')}
      </div>
    `);
  }

  function showRoleModal(pageId, row) {
    const page = pagePack(pageId);
    openModal(row ? page.modalEdit : page.modalCreate, `
      <div class="client-form-grid">
        ${formInput(page.name, row?.name || '', true)}
        ${formSelect(page.status, row?.status || '启用', ['启用', '停用'])}
        <label class="client-form-field full">
          <span class="client-label">${html(page.description)}</span>
          <textarea class="client-textarea"></textarea>
        </label>
        <div class="client-form-field full">
          <span class="client-label">${html(page.permissions)} <span class="client-required">*</span></span>
          <div class="client-permission-grid">
            ${[page.permissionAssets, page.permissionUsers, page.permissionSettings, page.permissionReports].map((permission) => `
              <label class="client-checkbox-row"><input type="checkbox" checked> <span>${html(permission)}</span></label>
            `).join('')}
          </div>
        </div>
      </div>
    `, { wide: true });
  }

  function showAutoModal(pageId, row) {
    const page = pagePack(pageId);
    openModal(row ? page.modalEdit : page.modalCreate, `
      <div class="client-form-grid">
        ${formInput(page.name, row?.name || '', true)}
        ${formSelect(page.status, row?.status || '启用', ['启用', '停用'])}
        ${formInput(page.accounts, row?.accounts || '1')}
        ${formInput(page.threshold, '20 USD')}
        ${formInput(page.amount, '100 USD')}
        ${formInput(page.activeTime, row?.activeTime || '2026-08-12 00:00:00 - 2026-12-31 23:59:59')}
        ${formInput(page.cooldown, row?.cooldown || '3 小时')}
        ${formInput(page.dailyLimit, row?.dailyLimit || '3 次/日')}
      </div>
    `, { wide: true });
  }

  function showApplyAccountModal(pageId) {
    const page = pagePack(pageId);
    modalContext.type = 'opening-apply';
    modalContext.rowIndex = null;
    openModal(page.applyAccount, openingApplyFields(), { wide: true, confirmText: tCommon('confirm') });
  }

  function cancelOpeningRow(pageId, row) {
    if (!row) return false;
    row.openingStatus = '开户取消';
    row.status = '失败';
    row.paymentStatus = '未扣款';
    row.result = '开户取消';
    row.walletCharge = '-';
    row.finalQuote = row.finalQuote || row.initialQuote || '-';
    row.rechargeRecord = '未扣款，无充值记录';
    row.openingFeeRecord = '未扣款，无其他扣费';
    renderPage(pageId);
    return true;
  }

  function actionRows(pageId) {
    const data = window.BESTADS_CLIENT_PAGES?.data?.[pageId];
    if (pageId === 'operation-records') {
      const tabId = activeTabByPage[pageId] || data?.defaultTab;
      const tab = (data?.tabs || []).find((item) => item.id === tabId) || data?.tabs?.[0];
      return tab?.rows || [];
    }
    return data?.rows || [];
  }

  function handlePageAction(pageId, action, index) {
    const data = window.BESTADS_CLIENT_PAGES?.data?.[pageId];
    const row = actionRows(pageId)[index];
    if (action === 'query') return toast(tCommon('toastQuery'));
    if (action === 'export') return toast(tCommon('toastExport'));
    if (action === 'apply-account') return showOpeningApplyModal();
    if (action === 'opening-view') return showOpeningDetailModal(row);
    if (action === 'opening-confirm') return showOpeningPaymentModal(row, index);
    if (action === 'opening-cancel') {
      if (!cancelOpeningRow(pageId, row)) return toast('未找到对应开户记录', 'error');
      return toast('开户申请已取消', 'info');
    }
    if (action === 'sub-create') return showSubAccountModal(pageId);
    if (action === 'sub-edit') return showSubAccountModal(pageId, data.rows[index]);
    if (action === 'sub-reset') return toast(tCommon('toastResetPassword'));
    if (action === 'role-create') return showRoleModal(pageId);
    if (action === 'role-edit') return showRoleModal(pageId, data.rows[index]);
    if (action === 'auto-create') return showAutoModal(pageId);
    if (action === 'auto-edit') return showAutoModal(pageId, data.rows[index]);
    if (action === 'auto-toggle') {
      const row = data.rows[index];
      row.status = row.status === '启用' ? '停用' : '启用';
      renderPage(pageId);
      return toast(tCommon('toastStatusChanged'));
    }
    return undefined;
  }

  function bindEvents(pageId) {
    document.addEventListener('click', (event) => {
      const themeButton = event.target.closest('[data-client-action="toggle-theme"]');
      if (themeButton) {
        applyTheme(theme() === 'dark' ? 'light' : 'dark');
        return;
      }
      const langButton = event.target.closest('[data-client-action="toggle-language"]');
      if (langButton) {
        localStorage.setItem(LANG_KEY, lang() === 'zh-CN' ? 'en-US' : 'zh-CN');
        applyLanguageToDocument();
        updateShellLabels(pageId);
        renderMenuInto(document.getElementById('clientSidebar'), pageId);
        renderPage(pageId);
        return;
      }
      const tab = event.target.closest('[data-client-tab]');
      if (tab) {
        activeTabByPage[pageId] = tab.dataset.clientTab;
        renderPage(pageId);
        return;
      }
      const actionNode = event.target.closest('[data-client-page-action]');
      if (actionNode) {
        handlePageAction(pageId, actionNode.dataset.clientPageAction, Number(actionNode.dataset.rowIndex || 0));
        return;
      }
      if (event.target.matches('[data-client-modal-close]') || event.target.id === 'clientShellModal') {
        modalContext.type = null;
        modalContext.rowIndex = null;
        closeModal();
        return;
      }
      if (event.target.matches('[data-client-modal-cancel-opening]')) {
        const rowIndex = Number(modalContext.rowIndex);
        const row = Number.isFinite(rowIndex) && rowIndex >= 0 ? actionRows(pageId)[rowIndex] : null;
        if (modalContext.type !== 'opening-payment' || !cancelOpeningRow(pageId, row)) {
          toast('未找到对应开户记录', 'error');
          return;
        }
        closeModal();
        modalContext.type = null;
        modalContext.rowIndex = null;
        toast('开户申请已取消', 'info');
        return;
      }
      if (event.target.matches('[data-client-modal-save]')) {
        const rowIndex = Number(modalContext.rowIndex);
        const row = Number.isFinite(rowIndex) && rowIndex >= 0 ? actionRows(pageId)[rowIndex] : null;
        if (modalContext.type === 'opening-apply') {
          const applyRoot = document.querySelector('[data-opening-apply-modal]');
          const rows = actionRows(pageId);
          const mediaChannel = applyRoot?.querySelector('[data-opening-media]')?.value || '';
          if (!mediaChannel) {
            const sel = applyRoot?.querySelector('[data-opening-media]');
            if (sel) { sel.style.outline = '2px solid var(--client-danger, #f53f3f)'; sel.focus(); }
            showToast('请选择媒体渠道', 'error');
            return;
          }
          const category = applyRoot?.querySelector('[data-opening-category]')?.value || '';
          if (!category) {
            const sel = applyRoot?.querySelector('[data-opening-category]');
            if (sel) { sel.style.outline = '2px solid var(--client-danger, #f53f3f)'; sel.focus(); }
            showToast('请选择投放品类', 'error');
            return;
          }
          const url = applyRoot?.querySelector('[data-opening-url]')?.value.trim() || 'https://www.example.com';
          const country = applyRoot?.querySelector('[data-opening-country]')?.value.trim() || '美国';
          const timezone = applyRoot?.querySelector('[data-opening-timezone]')?.value.trim() || 'America/Los_Angeles';
          const dailyBudget = openingDailyBudgetValue(applyRoot);
          const accountCount = applyRoot?.querySelector('[data-opening-count]')?.value.trim() || '1';
          const currency = openingAccountCurrency(applyRoot);
          const assetMeta = openingAssetMeta(mediaChannel);
          const bmIds = assetMeta ? parseBmIds(applyRoot?.querySelector('[data-opening-bm-ids]')?.value || '') : [];
          const autoPay = Boolean(applyRoot?.querySelector('[data-opening-auto-pay]')?.checked);
          syncOpeningEstimate(applyRoot);
          const breakdown = estimateOpeningQuoteBreakdown(applyRoot);
          const wallet = clientWalletCurrency();
          const initialQuote = breakdown.matched ? formatQuoteAmount(breakdown.total, wallet) : '-（待审核定价）';
          const quoteVersion = `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(rows.length + 1).padStart(3, '0')}`;
          rows.unshift({
            applyId: `AO${Date.now()}`,
            mediaChannel,
            url,
            country,
            bmIds: bmIds.join(' / '),
            timezone,
            dailyBudget,
            accountCount,
            category,
            currency,
            initialQuote,
            openingFee: breakdown.openingFee > 0 ? formatQuoteAmount(breakdown.openingFee, 'USD') : formatQuoteAmount(0, 'USD'),
            precharge: breakdown.matched ? formatQuoteAmount(breakdown.precharge, currency) : '-',
            finalQuote: '待运营确认',
            walletCharge: '-',
            paymentStatus: '未扣款',
            paymentAuth: autoPay ? '已同意金额一致时自动扣款' : '未授权自动扣款，待最终报价后确认',
            submittedAt: '2026-08-18 10:30:00',
            openingStatus: '待运营审核',
            status: '处理中',
            result: '-',
            accountInfo: '-',
            openingFeeRecord: '确认费用后生成其他扣费单',
            rechargeRecord: '确认费用后生成占位充值单',
            quoteVersion,
            initialNote: bmIds.length ? `${assetMeta.label}：${bmIds.join(' / ')}` : ''
          });
          renderPage(pageId);
          closeModal();
          modalContext.type = null;
          modalContext.rowIndex = null;
          toast('开户申请已提交', 'success');
          return;
        }
        if (modalContext.type === 'opening-payment' && row) {
          const payable = numberFromText(row.finalQuote || row.initialQuote);
          const available = Number(window.BESTADS_CLIENT_WALLET?.available || 5000);
          if (payable > available) {
            showToast('钱包可用余额不足，请先充值后再确认付款', 'error');
            return;
          }
          row.walletCharge = row.finalQuote || row.initialQuote || '-';
          row.paymentStatus = '已扣款';
          row.openingStatus = '已付款待开户';
          row.status = '处理中';
          row.result = '待开户';
          const openingFeeAmount = numberFromText(row.openingFee);
          const prechargeAmount = numberFromText(row.precharge);
          row.openingFeeRecord = openingFeeAmount > 0 ? `FEE-${row.applyId}` : '无开户费';
          const count = Math.max(1, Number(row.accountCount || 1) || 1);
          row.rechargeRecord = prechargeAmount > 0
            ? Array.from({ length: count }, (_, i) => `AD-OPEN-${row.applyId}-${String(i + 1).padStart(2, '0')} 开户首充（待绑定账户）`).join(' / ')
            : '无充值记录';
          renderPage(pageId);
          closeModal();
          modalContext.type = null;
          modalContext.rowIndex = null;
          toast('已确认付款，等待开户结果', 'success');
          return;
        }
        if (modalContext.type === 'opening-detail') {
          closeModal();
          modalContext.type = null;
          modalContext.rowIndex = null;
          return;
        }
        closeModal();
        modalContext.type = null;
        modalContext.rowIndex = null;
        toast(tCommon('toastSaved'));
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
    });
    document.addEventListener('input', (event) => {
      const openingInput = event.target.closest('[data-opening-budget], [data-opening-count], [data-opening-category], [data-opening-currency], [data-opening-country], [data-opening-media]');
      const bmInput = event.target.closest('[data-opening-bm-ids]');
      if (openingInput) syncOpeningEstimate(openingInput.closest('[data-opening-apply-modal]') || document);
      if (bmInput) syncBmPreview(bmInput.closest('[data-opening-apply-modal]') || document);
    });
    document.addEventListener('change', (event) => {
      const openingInput = event.target.closest('[data-opening-budget], [data-opening-count], [data-opening-category], [data-opening-currency], [data-opening-country], [data-opening-media]');
      const bmInput = event.target.closest('[data-opening-bm-ids]');
      const mediaInput = event.target.closest('[data-opening-media]');
      if (openingInput) syncOpeningEstimate(openingInput.closest('[data-opening-apply-modal]') || document);
      if (bmInput) syncBmPreview(bmInput.closest('[data-opening-apply-modal]') || document);
      if (mediaInput) syncOpeningMediaFields(mediaInput.closest('[data-opening-apply-modal]') || document);
    });
  }

  function initShell() {
    const pageId = pageIdFromDocument();
    applyLanguageToDocument();
    const shellMounted = renderShell(pageId);
    applyTheme(theme());
    if (!shellMounted) return;
    updateShellLabels(pageId);
    renderPage(pageId);
    bindEvents(pageId);
  }

  window.BESTADS_CLIENT_SHELL = {
    menuConfig,
    renderLegacyMenu,
    initShell,
    renderMenuInto
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShell);
  } else {
    initShell();
  }
})();
