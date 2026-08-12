(function () {
  const LANG_KEY = 'bestadsClientLang';
  const THEME_KEY = 'bestadsClientTheme';
  const activeTabByPage = {};

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
    '账户信息': { 'zh-CN': '账户信息', 'en-US': 'Account Info' },
    'BM ID': { 'zh-CN': 'BM ID', 'en-US': 'BM ID' },
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
      aside.sidebar nav { width: 192px; margin: 4px 0 0; }
      aside.sidebar .menu-title,
      aside.sidebar .menu-item { white-space: nowrap; }
      aside.sidebar .menu-item { overflow: hidden; text-overflow: ellipsis; }
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
    const cls = normalized === '启用' || normalized === '完成' ? 'success' : normalized === '停用' ? 'warning' : normalized === '失败' ? 'failed' : 'warning';
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
      '处理中': 'Processing'
    };
    return map[status] || status;
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
        ${renderTable(active.columns, active.rows)}
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
    return `<span class="client-action-row">${actions.map((action) => `<button class="client-link ${action.danger ? 'danger' : ''}" type="button" data-client-page-action="${html(action.action)}" data-row-index="${action.index}">${html(action.label)}</button>`).join('')}</span>`;
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
    modal.innerHTML = `
      <section class="client-modal ${options?.wide ? 'wide' : ''}">
        <div class="client-modal-header">
          <h2 class="client-modal-title">${html(title)}</h2>
          <button class="client-modal-close" type="button" data-client-modal-close>×</button>
        </div>
        <div class="client-modal-body">${body}</div>
        <div class="client-modal-footer">
          <button class="client-button" type="button" data-client-modal-close>${html(tCommon('cancel'))}</button>
          <button class="client-button primary" type="button" data-client-modal-save>${html(options?.confirmText || tCommon('save'))}</button>
        </div>
      </section>
    `;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
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
    openModal(tPage(pageId, 'applyAccount'), `
      <div class="client-form-grid">
        ${formSelect('平台', 'Facebook', ['Facebook', 'TikTok', 'Google', 'Outbrain'])}
        ${formInput('BM ID', '')}
        ${formInput('BM名称', '')}
        ${formInput('时区和数量', 'Europe/Paris × 1')}
        <label class="client-form-field full">
          <span class="client-label">账户信息</span>
          <textarea class="client-textarea" placeholder="URL / Facebook Page"></textarea>
        </label>
      </div>
    `, { wide: true, confirmText: tCommon('confirm') });
  }

  function handlePageAction(pageId, action, index) {
    const data = window.BESTADS_CLIENT_PAGES?.data?.[pageId];
    if (action === 'query') return toast(tCommon('toastQuery'));
    if (action === 'export') return toast(tCommon('toastExport'));
    if (action === 'apply-account') return showApplyAccountModal(pageId);
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
        closeModal();
        return;
      }
      if (event.target.matches('[data-client-modal-save]')) {
        closeModal();
        toast(tCommon('toastSaved'));
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeModal();
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
