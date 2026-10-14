(function () {
  const STORAGE_KEY = 'bestads-client-api-demo-v2';
  const PERMISSIONS = ['查账户列表', '查账户信息', '发起充值', '发起清零', '发起减款', '查单据结果', '查消耗'];
  const ENDPOINT = 'https://api.bestads.com';
  const KEY = 'ba_102_adstest';

  const copy = {
    'zh-CN': {
      sample: '示例状态',
      none: '未开通',
      pending: '申请中',
      rejected: '已拒绝',
      active: '已开通',
      upgrade: '升级处理中',
      disabled: '已停用',
      status: '状态',
      endpoint: '对接地址',
      key: 'API 钥匙',
      secret: '密钥',
      allowed: '当前权限',
      apply: '申请开通',
      applyAgain: '再次申请',
      choose: '选择需要的权限',
      submitApply: '提交开通申请',
      pendingText: '开通申请处理中，不能再次发起。',
      rejectedText: '开通申请已拒绝，可以再次发起。',
      disabledText: 'API 已停用，不能调用，也不能重置密钥。',
      reset: '重置密钥',
      resetDone: '密钥已重置',
      upgradeAction: '申请增加权限',
      submitUpgrade: '提交升级申请',
      pickUpgrade: '请勾选要增加的权限',
      upgradePending: '升级申请处理中，不能再次发起。',
      upgradeDone: '升级申请已提交',
      applyDone: '开通申请已提交',
      pickApply: '请勾选需要的权限',
      requested: '本次申请的权限',
      upgradeRequested: '本次申请增加的权限',
      noMore: '当前权限已包含全部操作，不能再申请升级。',
      cancel: '取消',
      ipTitle: 'IP 白名单',
      ipHelp: '填写服务器出口 IP，不是当前打开网页的电脑 IP。未配置时无法调用 API。支持单个公网 IPv4，或 /24 到 /32 的网段，最多 20 条。',
      ipEmpty: '尚未配置 IP 白名单，当前无法调用 API。',
      ipReady: '仅名单内的 IP 可以调用 API。',
      ipDisabledEmpty: 'API 已停用，不能调用。恢复后若仍未配置白名单，也无法调用。',
      ipDisabledReady: 'API 已停用，不能调用。恢复后仅白名单内的 IP 可以调用。',
      ipPlaceholder: '例如 8.8.8.8 或 203.0.113.0/24',
      ipAdd: '添加',
      ipRemove: '删除',
      ipConfirm: '删除后没有白名单，API 将无法调用。确定删除？',
      ipConfirmYes: '确定删除',
      ipFormat: '请输入公网 IPv4，或 /24 到 /32 的网段',
      ipCidr: '网段不能大于 /24',
      ipPrivate: '请填写服务器的公网出口 IP，内网地址不能调用',
      ipDuplicate: '该地址已在白名单中',
      ipLimit: '最多 20 条',
      ipFirst: '已生效。未在名单内的 IP 无法调用 API。',
      ipAdded: '已加入白名单',
      ipRemoved: '已从白名单删除',
      ipCleared: '白名单已清空，API 无法调用'
    },
    'en-US': {
      sample: 'Sample',
      none: 'Not enabled',
      pending: 'Pending',
      rejected: 'Rejected',
      active: 'Enabled',
      upgrade: 'Upgrade pending',
      disabled: 'Disabled',
      status: 'Status',
      endpoint: 'Endpoint',
      key: 'API key',
      secret: 'Secret',
      allowed: 'Current permissions',
      apply: 'Apply',
      applyAgain: 'Apply again',
      choose: 'Select permissions',
      submitApply: 'Submit application',
      pendingText: 'The application is pending. You cannot submit another one.',
      rejectedText: 'The application was rejected. You can apply again.',
      disabledText: 'API access is disabled. Calls and secret reset are unavailable.',
      reset: 'Reset secret',
      resetDone: 'Secret reset',
      upgradeAction: 'Request more permissions',
      submitUpgrade: 'Submit upgrade',
      pickUpgrade: 'Select permissions to add',
      upgradePending: 'An upgrade request is pending. You cannot submit another one.',
      upgradeDone: 'Upgrade request submitted',
      applyDone: 'Application submitted',
      pickApply: 'Select at least one permission',
      requested: 'Requested permissions',
      upgradeRequested: 'Requested additions',
      noMore: 'All operations are already enabled.',
      cancel: 'Cancel',
      ipTitle: 'IP allowlist',
      ipHelp: 'Enter the server egress IP, not the IP of the computer opening this page. API calls are blocked until at least one IP is saved. One public IPv4, or a CIDR from /24 to /32. Up to 20 entries.',
      ipEmpty: 'No IP allowlist yet. API calls are blocked.',
      ipReady: 'Only these IPs can call the API.',
      ipDisabledEmpty: 'API access is disabled. After restore, calls stay blocked until an allowlist is saved.',
      ipDisabledReady: 'API access is disabled. After restore, only these IPs can call the API.',
      ipPlaceholder: 'e.g. 8.8.8.8 or 203.0.113.0/24',
      ipAdd: 'Add',
      ipRemove: 'Remove',
      ipConfirm: 'Removing the last IP blocks all API calls. Remove it?',
      ipConfirmYes: 'Remove',
      ipFormat: 'Enter a public IPv4 address, or a CIDR from /24 to /32',
      ipCidr: 'The network cannot be larger than /24',
      ipPrivate: 'Enter the server public egress IP. Private addresses cannot call the API',
      ipDuplicate: 'This address is already on the allowlist',
      ipLimit: 'Up to 20 entries',
      ipFirst: 'Saved. Calls from other IPs are blocked.',
      ipAdded: 'Added to the allowlist',
      ipRemoved: 'Removed from the allowlist',
      ipCleared: 'Allowlist cleared. API calls are blocked'
    }
  };

  const permissionText = {
    '查账户列表': { 'zh-CN': '查账户列表', 'en-US': 'List accounts' },
    '查账户信息': { 'zh-CN': '查账户信息', 'en-US': 'Account info' },
    '发起充值': { 'zh-CN': '发起充值', 'en-US': 'Recharge' },
    '发起清零': { 'zh-CN': '发起清零', 'en-US': 'Clear' },
    '发起减款': { 'zh-CN': '发起减款', 'en-US': 'Deduct' },
    '查单据结果': { 'zh-CN': '查单据结果', 'en-US': 'Order result' },
    '查消耗': { 'zh-CN': '查消耗', 'en-US': 'Spend' }
  };

  function lang() {
    return localStorage.getItem('bestadsClientLang') === 'en-US' ? 'en-US' : 'zh-CN';
  }

  function t(key) {
    return copy[lang()][key] || key;
  }

  function permLabel(permission) {
    return permissionText[permission]?.[lang()] || permission;
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function freshSecret() {
    return `sk_demo_${Math.random().toString(36).slice(2, 8)}`;
  }

  function blank(status, extra) {
    return Object.assign({
      status,
      permissions: [],
      requested: [],
      upgradeRequested: [],
      upgradePending: false,
      secret: 'sk_demo_7k2m9q',
      whitelist: []
    }, extra);
  }

  function seed() {
    return {
      scenario: 'active',
      items: {
        none: blank('none', { secret: '' }),
        pending: blank('pending', { requested: ['查账户列表', '查账户信息', '发起充值'], secret: '' }),
        rejected: blank('rejected', { requested: ['发起充值'], secret: '' }),
        active: blank('active', { permissions: ['查账户列表', '查账户信息'] }),
        upgrade: blank('active', { permissions: ['查账户列表', '查账户信息'], upgradePending: true, upgradeRequested: ['发起充值', '发起清零'] }),
        disabled: blank('disabled', { permissions: ['查账户列表', '查账户信息', '查消耗'] })
      }
    };
  }

  function load() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return seed();
      const parsed = JSON.parse(raw);
      if (!parsed?.items?.active) return seed();
      Object.values(parsed.items).forEach(item => {
        if (!Array.isArray(item.whitelist)) item.whitelist = [];
      });
      return parsed;
    } catch (error) {
      return seed();
    }
  }

  let state = load();
  let upgradeOpen = false;
  let ipDraft = '';
  let confirmRemove = '';

  function save() {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function current() {
    return state.items[state.scenario];
  }

  function checks(permissions, name, checked, locked) {
    const picked = new Set(checked || []);
    return permissions.map(permission => `
      <label class="client-checkbox-row">
        <input type="checkbox" name="${esc(name)}" value="${esc(permission)}" ${picked.has(permission) ? 'checked' : ''} ${locked ? 'disabled' : ''}>
        <span>${esc(permLabel(permission))}</span>
      </label>
    `).join('');
  }

  function upgradeModal(missing) {
    if (!upgradeOpen) return '';
    return `
      <div class="client-modal-root open" data-api-upgrade-modal>
        <section class="client-modal">
          <div class="client-modal-header">
            <h2 class="client-modal-title">${esc(t('upgradeAction'))}</h2>
            <button class="client-modal-close" type="button" data-api-client-action="upgrade-cancel">×</button>
          </div>
          <div class="client-modal-body">
            <div class="client-permission-grid">${checks(missing, 'upgradePermission', [])}</div>
          </div>
          <div class="client-modal-footer">
            <button class="client-button" type="button" data-api-client-action="upgrade-cancel">${esc(t('cancel'))}</button>
            <button class="client-button primary" type="button" data-api-client-action="upgrade-submit">${esc(t('submitUpgrade'))}</button>
          </div>
        </section>
      </div>
    `;
  }

  function infoRow(label, value) {
    return `<div class="client-form-field"><span class="client-label">${esc(label)}</span><div>${value}</div></div>`;
  }

  function ipToInt(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;
    let value = 0;
    for (const part of parts) {
      if (!/^\d{1,3}$/.test(part)) return null;
      if (part.length > 1 && part.startsWith('0')) return null;
      const num = Number(part);
      if (num > 255) return null;
      value = (value << 8) + num;
    }
    return value >>> 0;
  }

  function intToIp(value) {
    return [24, 16, 8, 0].map(shift => (value >>> shift) & 255).join('.');
  }

  function isPrivateIp(value) {
    const first = (value >>> 24) & 255;
    const second = (value >>> 16) & 255;
    if (first === 0 || first === 10 || first === 127) return true;
    if (first === 169 && second === 254) return true;
    if (first === 172 && second >= 16 && second <= 31) return true;
    if (first === 192 && second === 168) return true;
    if (first >= 224) return true;
    return false;
  }

  function parseIp(raw) {
    const text = String(raw || '').trim();
    const matched = text.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?:\/(\d{1,2}))?$/);
    if (!matched) return { error: 'ipFormat' };
    const ip = ipToInt(matched[1]);
    if (ip == null) return { error: 'ipFormat' };
    const prefix = matched[2] == null ? 32 : Number(matched[2]);
    if (prefix < 24 || prefix > 32) return { error: 'ipCidr' };
    if (isPrivateIp(ip)) return { error: 'ipPrivate' };
    const mask = prefix === 32 ? 0xffffffff : (0xffffffff << (32 - prefix)) >>> 0;
    const network = (ip & mask) >>> 0;
    return { value: prefix === 32 ? intToIp(ip) : `${intToIp(network)}/${prefix}` };
  }

  function whitelistCard(item) {
    const list = item.whitelist || [];
    const notice = item.status === 'disabled'
      ? (list.length ? t('ipDisabledReady') : t('ipDisabledEmpty'))
      : (list.length ? t('ipReady') : t('ipEmpty'));
    const rows = list.map(ip => `
      <div class="client-ip-row">
        <span>${esc(ip)}</span>
        ${confirmRemove === ip ? `
          <span>${esc(t('ipConfirm'))}
            <button class="client-button small danger" type="button" data-api-client-action="ip-remove-yes">${esc(t('ipConfirmYes'))}</button>
            <button class="client-button small" type="button" data-api-client-action="ip-remove-no">${esc(t('cancel'))}</button>
          </span>
        ` : `<button class="client-button small" type="button" data-api-client-action="ip-remove" data-ip="${esc(ip)}">${esc(t('ipRemove'))}</button>`}
      </div>
    `).join('');
    return `
      <section class="client-card">
        <div class="client-card-body">
          <div class="client-form-field">
            <span class="client-label">${esc(t('ipTitle'))}</span>
            <p class="${list.length && item.status !== 'disabled' ? 'client-form-help' : 'client-ip-warn'}">${esc(notice)}</p>
            <p class="client-form-help">${esc(t('ipHelp'))}</p>
          </div>
          ${rows ? `<div class="client-ip-list">${rows}</div>` : ''}
          <div class="client-ip-add">
            <input class="client-input" type="text" data-api-ip-input value="${esc(ipDraft)}" placeholder="${esc(t('ipPlaceholder'))}">
            <button class="client-button primary" type="button" data-api-client-action="ip-add">${esc(t('ipAdd'))}</button>
          </div>
        </div>
      </section>
    `;
  }

  function render(mount) {
    const item = current();
    const statusKey = item.upgradePending ? 'upgrade' : item.status;
    const options = ['none', 'pending', 'rejected', 'active', 'upgrade', 'disabled'].map(key => `
      <option value="${key}" ${state.scenario === key ? 'selected' : ''}>${esc(t(key))}</option>
    `).join('');
    const opened = item.status === 'active' || item.status === 'disabled';
    let body = '';
    if (item.status === 'none' || item.status === 'rejected') {
      body = `
        <p class="client-form-help">${esc(item.status === 'rejected' ? t('rejectedText') : '')}</p>
        <div class="client-form-field">
          <span class="client-label">${esc(t('choose'))}</span>
          <div class="client-permission-grid">${checks(PERMISSIONS, 'applyPermission', item.requested)}</div>
        </div>
        <button class="client-button primary" type="button" data-api-client-action="apply">${esc(item.status === 'rejected' ? t('applyAgain') : t('submitApply'))}</button>
      `;
    } else if (item.status === 'pending') {
      body = `
        <p>${esc(t('pendingText'))}</p>
        ${infoRow(t('requested'), esc(item.requested.map(permLabel).join('、') || '-'))}
      `;
    } else {
      const missing = PERMISSIONS.filter(permission => !item.permissions.includes(permission));
      body = `
        <div class="client-form-grid">
          ${infoRow(t('endpoint'), esc(ENDPOINT))}
          ${infoRow(t('key'), esc(KEY))}
          ${opened && item.status === 'active' ? infoRow(t('secret'), esc(item.secret)) : ''}
          </div>
        <div class="client-form-field" style="margin-top:16px;">
          <span class="client-label">${esc(t('allowed'))}</span>
          <div class="client-permission-grid">${checks(PERMISSIONS, 'currentPermission', item.permissions, true)}</div>
        </div>
        ${item.status === 'disabled' ? `<p>${esc(t('disabledText'))}</p>` : ''}
        ${item.upgradePending ? `<p>${esc(t('upgradePending'))}</p>${infoRow(t('upgradeRequested'), esc(item.upgradeRequested.map(permLabel).join('、')))}` : ''}
        ${item.status === 'active' ? `
          <div class="client-toolbar-actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;">
            <button class="client-button" type="button" data-api-client-action="reset">${esc(t('reset'))}</button>
            ${item.upgradePending || !missing.length ? '' : `<button class="client-button primary" type="button" data-api-client-action="upgrade-open">${esc(t('upgradeAction'))}</button>`}
          </div>
          ${!item.upgradePending && !missing.length ? `<p class="client-form-help">${esc(t('noMore'))}</p>` : ''}
        ` : ''}
        ${upgradeModal(missing)}
      `;
    }
    mount.innerHTML = `
      <div class="client-page-stack">
        <div class="client-toolbar compact">
          <label class="client-field-inline">${esc(t('sample'))}
            <select class="client-select" data-api-client-sample>${options}</select>
          </label>
        </div>
        <section class="client-card">
          <div class="client-card-body">
            <div class="client-form-field" style="margin-bottom:12px;">
              <span class="client-label">${esc(t('status'))}</span>
              <div><span class="client-tag ${item.status === 'active' ? 'success' : item.status === 'rejected' || item.status === 'disabled' ? 'failed' : 'warning'}">${esc(t(statusKey))}</span></div>
            </div>
            ${body}
          </div>
        </section>
        ${opened ? whitelistCard(item) : ''}
      </div>
    `;
  }

  function toast(message, type) {
    const el = document.getElementById('clientShellToast');
    if (!el) return;
    el.textContent = message;
    el.className = `client-shell-toast show ${type || 'success'}`;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { el.className = 'client-shell-toast'; }, 2400);
  }

  function checked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
  }

  document.addEventListener('change', event => {
    const sample = event.target.closest('[data-api-client-sample]');
    if (!sample || document.body.dataset.clientPage !== 'api-access') return;
    state.scenario = sample.value;
    upgradeOpen = false;
    ipDraft = '';
    confirmRemove = '';
    save();
    render(document.getElementById('clientPageMount'));
  });

  document.addEventListener('click', event => {
    if (event.target.matches('[data-api-upgrade-modal]')) {
      upgradeOpen = false;
      render(document.getElementById('clientPageMount'));
      return;
    }
    const action = event.target.closest('[data-api-client-action]');
    if (!action || document.body.dataset.clientPage !== 'api-access') return;
    const item = current();
    const kind = action.dataset.apiClientAction;
    if (kind === 'apply') {
      const requested = checked('applyPermission');
      if (!requested.length) return toast(t('pickApply'));
      state.items.pending = blank('pending', { requested: requested.slice(), secret: '' });
      state.scenario = 'pending';
      save();
      toast(t('applyDone'));
    }
    if (kind === 'reset') {
      if (item.status !== 'active') return;
      item.secret = freshSecret();
      save();
      toast(t('resetDone'));
    }
    if (kind === 'upgrade-open') {
      if (item.status !== 'active' || item.upgradePending) return;
      upgradeOpen = true;
    }
    if (kind === 'upgrade-cancel') upgradeOpen = false;
    if (kind === 'ip-add') {
      if (item.status !== 'active' && item.status !== 'disabled') return;
      const input = document.querySelector('[data-api-ip-input]');
      const raw = input ? input.value : '';
      const parsed = parseIp(raw);
      if (parsed.error) {
        ipDraft = raw;
        toast(t(parsed.error), 'error');
      } else if ((item.whitelist || []).includes(parsed.value)) {
        ipDraft = raw;
        toast(t('ipDuplicate'), 'error');
      } else if ((item.whitelist || []).length >= 20) {
        ipDraft = raw;
        toast(t('ipLimit'), 'error');
      } else {
        const first = !(item.whitelist || []).length;
        item.whitelist = (item.whitelist || []).concat(parsed.value);
        ipDraft = '';
        confirmRemove = '';
        save();
        toast(first ? t('ipFirst') : t('ipAdded'));
      }
    }
    if (kind === 'ip-remove') {
      const value = action.dataset.ip;
      if ((item.whitelist || []).length === 1) {
        confirmRemove = value;
      } else {
        item.whitelist = item.whitelist.filter(ip => ip !== value);
        save();
        toast(t('ipRemoved'));
      }
    }
    if (kind === 'ip-remove-yes') {
      item.whitelist = (item.whitelist || []).filter(ip => ip !== confirmRemove);
      confirmRemove = '';
      save();
      toast(t('ipCleared'), 'warning');
    }
    if (kind === 'ip-remove-no') confirmRemove = '';
    if (kind === 'upgrade-submit') {
      if (item.upgradePending) return;
      const requested = checked('upgradePermission');
      if (!requested.length) return toast(t('pickUpgrade'));
      state.items.upgrade = blank('active', {
        permissions: item.permissions.slice(),
        secret: item.secret,
        upgradePending: true,
        upgradeRequested: requested.slice(),
        whitelist: (item.whitelist || []).slice()
      });
      state.scenario = 'upgrade';
      upgradeOpen = false;
      save();
      toast(t('upgradeDone'));
    }
    render(document.getElementById('clientPageMount'));
  });

  window.BESTADS_CLIENT_API = { render };
})();
