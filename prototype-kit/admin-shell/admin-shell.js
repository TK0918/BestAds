/*
 * BestAds 运营端公共 Shell。
 * 页面只需要引入本文件；菜单、Logo、主题按钮和 Tab 会在运行时统一接入。
 * 不使用 fetch 读取菜单，保证 file:// 本地直接打开时也能工作。
 */
(function () {
  'use strict';

  const currentScript = document.currentScript;
  if (!currentScript) return;

  const shellUrl = new URL(currentScript.src, window.location.href);
  const shellDirUrl = new URL('./', shellUrl);
  const repoRootUrl = new URL('../../', shellUrl);
  // 运营端原型公共资源统一版本号。
  // admin-system/**/*.html 中 prototype-kit/admin-shell/* 的 ?v= 应与此值保持一致。
  const SHELL_VERSION = '20260820-it-biweekly-prd';
  const cssUrlObj = new URL('admin-shell.css', shellDirUrl);
  const figmaCssUrlObj = new URL('figma-ops.css', shellDirUrl);
  cssUrlObj.searchParams.set('v', SHELL_VERSION);
  figmaCssUrlObj.searchParams.set('v', SHELL_VERSION);
  const cssUrl = cssUrlObj.href;
  const figmaCssUrl = figmaCssUrlObj.href;
  const menuUrl = new URL('admin-menu.js', shellDirUrl);
  menuUrl.searchParams.set('v', SHELL_VERSION);
  const THEME_KEY = 'bestads-theme';

  function safeStorage(action, fallback) {
    try {
      return action(window.localStorage);
    } catch (error) {
      return fallback;
    }
  }

  function appendStyle() {
    if (document.querySelector('link[data-bestads-admin-shell-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.dataset.bestadsAdminShellCss = 'true';
    document.head.appendChild(link);
  }

  function appendFigmaStyle() {
    if (document.body?.dataset.figmaOps !== 'true') return;
    if (document.querySelector('link[data-bestads-figma-ops-css]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = figmaCssUrl;
    link.dataset.bestadsFigmaOpsCss = 'true';
    document.head.appendChild(link);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function allMenuItems(menu) {
    return (menu || []).reduce((result, group) => result.concat(group.items || []), []);
  }

  function absolutePath(path) {
    return path ? new URL(path, repoRootUrl).href : null;
  }

  function navigateTo(url) {
    if (!url) return;
    window.location.assign(url);
  }

  function bindLocalLinkNavigation(root) {
    if (!root || root.dataset.adminLinkNav === 'true') return;
    root.dataset.adminLinkNav = 'true';
    root.addEventListener('click', event => {
      const link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target && link.target !== '_self') return;
      const href = link.href;
      if (!href || href === window.location.href) return;
      event.preventDefault();
      navigateTo(href);
    });
  }

  function normalizePath(url) {
    const parsed = new URL(url, window.location.href);
    let pathname = parsed.pathname || '/';
    try { pathname = decodeURIComponent(pathname); } catch (error) { /* 使用原始路径 */ }
    return pathname.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
  }

  function isCurrentPage(path) {
    if (!path) return false;
    return normalizePath(window.location.href) === normalizePath(absolutePath(path));
  }

  function findCurrentItem(menu) {
    return allMenuItems(menu).find(item => item.path && isCurrentPage(item.path)) || null;
  }

  function renderSidebar(menu) {
    const sidebar = document.querySelector('[data-admin-shell="sidebar"]') || document.getElementById('sidebar');
    if (!sidebar) return;

    sidebar.dataset.adminShell = 'sidebar';
    const firstChild = sidebar.firstElementChild;
    if (firstChild) {
      firstChild.classList.add('admin-shell-brand-wrap');
      let brand = firstChild.querySelector('.admin-shell-brand');
      if (!brand) {
        brand = document.createElement('a');
        brand.className = 'admin-shell-brand';
        brand.href = absolutePath('admin-system/main-functions/index.html');
        brand.setAttribute('aria-label', 'Ads 工作台');
        brand.innerHTML = '<img class="admin-shell-brand-mark" alt=""><span class="admin-shell-brand-word">Ads</span>';
        firstChild.innerHTML = '';
        firstChild.appendChild(brand);
      }
      const logo = brand.querySelector('.admin-shell-brand-mark');
      if (logo) logo.src = absolutePath('admin-system/assets/logo.png');
    }

    let wrapper = sidebar.querySelector('#sidebarMenuWrapper');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'sidebarMenuWrapper';
      sidebar.appendChild(wrapper);
    }
    wrapper.classList.add('admin-shell-menu-wrapper');

    const currentItem = findCurrentItem(menu);
    const groupsHtml = (menu || []).map(group => {
      const items = group.items || [];
      const containsCurrent = items.some(item => item.path && isCurrentPage(item.path));
      // 页面加载后只展开当前页面所在一级菜单；其余一级菜单收起。
      // 用户在当前页面点击展开仅作为临时查看状态，不跨页面持久化。
      const isCollapsed = !containsCurrent;
      const listId = `admin-shell-group-${group.id}`;
      const groupIconClass = `fas fa-${escapeHtml(group.icon || 'folder')}`;
      const itemsHtml = items.map(item => {
        const active = item.path && isCurrentPage(item.path);
        const planned = item.status === 'planned' || !item.path;
        if (planned) {
          return `<li><span class="sidebar-item admin-shell-item is-planned" aria-disabled="true" title="待建设"><span>${escapeHtml(item.label)}</span><span class="admin-shell-planned">待建设</span></span></li>`;
        }
        return `<li><a class="sidebar-item admin-shell-item${active ? ' is-active active' : ''}" href="${escapeHtml(absolutePath(item.path))}" data-admin-menu-id="${escapeHtml(item.id)}"${active ? ' aria-current="page"' : ''}><span>${escapeHtml(item.label)}</span></a></li>`;
      }).join('');
      return `<section class="admin-shell-group" data-admin-menu-group="${escapeHtml(group.id)}"><button type="button" class="admin-shell-group-toggle" aria-controls="${listId}" aria-expanded="${!isCollapsed}"><span class="admin-shell-group-label"><i class="${groupIconClass}" aria-hidden="true"></i><span>${escapeHtml(group.label)}</span></span><i class="admin-shell-group-caret fas fa-chevron-${isCollapsed ? 'right' : 'down'}" aria-hidden="true"></i></button><ul id="${listId}" class="admin-shell-group-list"${isCollapsed ? ' hidden' : ''}>${itemsHtml}</ul></section>`;
    }).join('');

    const workbenchPath = 'admin-system/main-functions/index.html';
    const workbenchActive = isCurrentPage(workbenchPath);
    wrapper.innerHTML = `<nav class="admin-shell-nav" aria-label="运营端主菜单"><div class="admin-shell-workbench"><a class="sidebar-item admin-shell-item${workbenchActive ? ' is-active active' : ''}" href="${escapeHtml(absolutePath(workbenchPath))}"${workbenchActive ? ' aria-current="page"' : ''}><i class="fas fa-th-large" aria-hidden="true"></i><span>工作台</span></a></div>${groupsHtml}</nav>`;

    wrapper.querySelectorAll('.admin-shell-group-toggle').forEach(button => {
      button.addEventListener('click', () => {
        const group = button.closest('[data-admin-menu-group]');
        const list = group && group.querySelector('.admin-shell-group-list');
        if (!group || !list) return;
        const nextCollapsed = !list.hidden;
        list.hidden = nextCollapsed;
        button.setAttribute('aria-expanded', String(!nextCollapsed));
        const icon = button.querySelector('.admin-shell-group-caret');
        if (icon) icon.className = `admin-shell-group-caret fas fa-chevron-${nextCollapsed ? 'right' : 'down'}`;
      });
    });
    bindLocalLinkNavigation(sidebar);

    if (currentItem) sidebar.dataset.adminCurrent = currentItem.id;
  }

  function getHeader() {
    const existing = document.querySelector('[data-admin-shell="header"]') || document.querySelector('header');
    if (existing) return existing;

    // 兼容极少数历史报表页：页面只有侧边栏和 main，没有 Header。
    const sidebar = document.querySelector('[data-admin-shell="sidebar"]') || document.getElementById('sidebar');
    const content = sidebar && sidebar.nextElementSibling;
    if (!content || !content.querySelector('main')) return null;

    const generated = document.createElement('header');
    generated.className = 'admin-shell-generated-header';
    generated.innerHTML = '<div class="admin-shell-generated-header-row"><div class="admin-shell-generated-breadcrumb"><span>主页</span><i class="fas fa-chevron-right" aria-hidden="true"></i><strong></strong></div><div class="admin-shell-generated-actions"><button type="button" class="admin-shell-theme-toggle" id="themeToggleButton"><i class="fas fa-moon" aria-hidden="true"></i></button><div class="admin-shell-generated-user"><span class="admin-shell-generated-avatar">A</span><span>管理员</span></div></div></div>';
    content.insertBefore(generated, content.firstChild);
    return generated;
  }

  function ensureThemeButton(header) {
    if (!header) return null;
    header.dataset.adminShell = 'header';
    let button = header.querySelector('#themeToggleButton') || header.querySelector('.admin-shell-theme-toggle');
    if (!button) {
      const row = header.querySelector(':scope > div') || header.firstElementChild || header;
      const directChildren = Array.from(row.children || []);
      const right = directChildren.length > 1 ? directChildren[directChildren.length - 1] : row;
      button = document.createElement('button');
      button.id = 'themeToggleButton';
      button.type = 'button';
      button.className = 'admin-shell-theme-toggle';
      button.innerHTML = '<i class="fas fa-moon" aria-hidden="true"></i>';
      const userArea = right && right.lastElementChild;
      if (userArea && userArea !== button) right.insertBefore(button, userArea);
      else right.appendChild(button);
    }
    button.classList.add('admin-shell-theme-toggle');
    button.type = 'button';
    button.removeAttribute('onclick');
    button.addEventListener('click', window.BESTADS_ADMIN_SHELL.toggleTheme);
    return button;
  }

  function ensureHeader(header, menu) {
    if (!header) return;
    header.dataset.adminShell = 'header';
    const breadcrumb = header.querySelector('[aria-label="Breadcrumb"]');
    if (breadcrumb) breadcrumb.dataset.adminShell = 'breadcrumb';
    const generatedTitle = header.querySelector('.admin-shell-generated-breadcrumb strong');
    if (generatedTitle) generatedTitle.textContent = labelForCurrentPage(menu || []);
    ensureThemeButton(header);
  }

  function labelForCurrentPage(menu) {
    const item = findCurrentItem(menu);
    return item ? item.label : (document.title || '页面').replace(/\s*-\s*BestAds.*$/i, '');
  }

  function createTabBar() {
    const header = getHeader();
    if (!header || !header.parentNode) return null;
    const tabBar = document.createElement('div');
    tabBar.className = 'admin-tab-bar';
    tabBar.dataset.adminShell = 'tabs';
    header.parentNode.insertBefore(tabBar, header.nextSibling);
    return tabBar;
  }

  function resolveTabTarget(label, menu) {
    const item = allMenuItems(menu).find(entry => entry.label === label && entry.path);
    return item ? absolutePath(item.path) : null;
  }

  function enhanceTab(tab, menu) {
    const label = Array.from(tab.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent)
      .join('')
      .trim() || tab.textContent.replace(/\s*×\s*$/, '').trim();
    const target = tab.dataset.path || resolveTabTarget(label, menu);
    if (target) {
      tab.dataset.path = target;
      tab.addEventListener('click', event => {
        if (event.target.closest('i')) return;
        navigateTo(target);
      });
    }
  }

  function renderTabs(menu) {
    let tabBar = document.querySelector('[data-admin-shell="tabs"]') || document.querySelector('.admin-tab-bar');
    if (!tabBar) tabBar = createTabBar();
    if (!tabBar) return;
    tabBar.dataset.adminShell = 'tabs';

    const existingTabs = Array.from(tabBar.querySelectorAll('.admin-page-tab'));
    if (!existingTabs.length) {
      tabBar.innerHTML = '<button type="button" class="admin-tab-nav" aria-label="返回" disabled><i class="fas fa-chevron-left" aria-hidden="true"></i></button><div class="admin-tabs-scroll"><button type="button" class="admin-page-tab is-active" role="tab" aria-selected="true"></button></div><button type="button" class="admin-tab-more" aria-label="更多标签"><i class="fas fa-chevron-down" aria-hidden="true"></i></button>';
      const currentTab = tabBar.querySelector('.admin-page-tab');
      currentTab.append(document.createTextNode(labelForCurrentPage(menu)));
      enhanceTab(currentTab, menu);
      return;
    }

    const currentLabel = labelForCurrentPage(menu);
    existingTabs.forEach(tab => {
      const text = tab.textContent.replace(/\s*×\s*$/, '').trim();
      const active = text === currentLabel || (tab.dataset.path && isCurrentPage(tab.dataset.path));
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      enhanceTab(tab, menu);
    });
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('theme-dark', isDark);
    document.querySelectorAll('#themeToggleButton, .admin-shell-theme-toggle').forEach(button => {
      const icon = button.querySelector('i');
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
      const nextLabel = isDark ? '切换浅色模式' : '切换深色模式';
      button.setAttribute('aria-label', nextLabel);
      button.setAttribute('title', nextLabel);
    });
    safeStorage(storage => storage.setItem(THEME_KEY, isDark ? 'dark' : 'light'), null);
  }

  function initTheme() {
    const saved = safeStorage(storage => storage.getItem(THEME_KEY), 'light');
    applyTheme(saved === 'dark' ? 'dark' : 'light');
  }

  function toggleTheme() {
    applyTheme(document.body.classList.contains('theme-dark') ? 'light' : 'dark');
  }

  window.BESTADS_ADMIN_SHELL = window.BESTADS_ADMIN_SHELL || {};
  window.BESTADS_ADMIN_SHELL.version = SHELL_VERSION;
  window.BESTADS_ADMIN_SHELL.toggleTheme = toggleTheme;
  window.BESTADS_ADMIN_SHELL.applyTheme = applyTheme;

  function boot() {
    const menu = window.BESTADS_ADMIN_MENU || [];
    document.body.classList.add('admin-shell-ready');
    document.body.classList.toggle('figma-ops-page', document.body.dataset.figmaOps === 'true');
    appendFigmaStyle();
    renderSidebar(menu);
    ensureHeader(getHeader(), menu);
    renderTabs(menu);
    initTheme();
  }

  appendStyle();
  if (window.BESTADS_ADMIN_MENU) {
    boot();
  } else {
    const menuScript = document.createElement('script');
    menuScript.src = menuUrl.href;
    menuScript.dataset.bestadsAdminMenu = 'true';
    menuScript.onload = boot;
    menuScript.onerror = () => {
      document.body.classList.add('admin-shell-ready');
      ensureHeader(getHeader(), []);
      renderTabs([]);
      initTheme();
    };
    document.head.appendChild(menuScript);
  }
})();
