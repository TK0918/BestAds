/*
 * 对客 API 原型的当前状态和申请单。
 * 客户管理与 API 申请页共用。客户管理上的改权限、停用、恢复只改当前状态，不写入申请单。
 */
(function () {
  const STORAGE_KEY = 'bestads-api-prototype-v1';
  const PERMISSIONS = ['查账户列表', '查账户信息', '发起充值', '发起清零', '发起减款', '查单据结果', '查消耗'];
  const ENDPOINT = 'https://api.bestads.com';

  const customers = {
    '102': { customerId: '102', customerName: 'adstest', merchantId: '1128', status: 'active', permissions: ['查账户列表', '查账户信息'] },
    '3472': { customerId: '3472', customerName: 'test金额变动', merchantId: '14229', status: 'pending', permissions: [] },
    '4801': { customerId: '4801', customerName: '内部免开户费', merchantId: '18888', status: 'active', permissions: ['查账户列表', '查账户信息'] },
    '3589': { customerId: '3589', customerName: 'BestAds接口测试', merchantId: '14606', status: 'disabled', permissions: ['查账户列表', '查账户信息', '查消耗'] },
    '4901': { customerId: '4901', customerName: '新客首次开户', merchantId: '19901', status: 'rejected', permissions: [] }
  };

  const applications = [
    { id: 'API-20261009-001', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', appliedAt: '2026-10-09 09:12:08', applyType: '开通', requestedPermissions: ['查账户列表', '查账户信息', '发起充值'], result: '待处理', processor: '-', processedAt: '-', finalPermissions: [] },
    { id: 'API-20261009-002', customerId: '4801', customerName: '内部免开户费', merchantId: '18888', appliedAt: '2026-10-09 10:40:22', applyType: '升级', requestedPermissions: ['发起充值', '发起清零'], result: '待处理', processor: '-', processedAt: '-', finalPermissions: [] },
    { id: 'API-20261001-003', customerId: '102', customerName: 'adstest', merchantId: '1128', appliedAt: '2026-10-01 14:20:11', applyType: '开通', requestedPermissions: ['查账户列表', '查账户信息', '查消耗', '发起充值'], result: '通过', processor: '谭英就', processedAt: '2026-10-01 16:05:33', finalPermissions: ['查账户列表', '查账户信息'] },
    { id: 'API-20260928-004', customerId: '4901', customerName: '新客首次开户', merchantId: '19901', appliedAt: '2026-09-28 11:08:40', applyType: '开通', requestedPermissions: ['发起充值'], result: '拒绝', processor: '李志伟', processedAt: '2026-09-28 15:22:18', finalPermissions: [] },
    { id: 'API-20260920-005', customerId: '3589', customerName: 'BestAds接口测试', merchantId: '14606', appliedAt: '2026-09-20 09:18:00', applyType: '开通', requestedPermissions: ['查账户列表', '查账户信息', '查消耗'], result: '通过', processor: '谭英就', processedAt: '2026-09-20 11:02:46', finalPermissions: ['查账户列表', '查账户信息', '查消耗'] }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.customers || !Array.isArray(parsed.applications)) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  const saved = load();
  const state = saved || { customers: clone(customers), applications: clone(applications) };

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  if (!saved) persist();

  function nowText() {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function customer(customerId) {
    return state.customers[String(customerId)] || {
      customerId: String(customerId),
      status: 'none',
      permissions: []
    };
  }

  function statusLabel(status) {
    return {
      none: '未开通',
      pending: '申请中',
      rejected: '已拒绝',
      active: '已开通',
      disabled: '已停用'
    }[status] || '未开通';
  }

  function joinPermissions(list) {
    return Array.isArray(list) && list.length ? list.join('、') : '-';
  }

  window.BESTADS_API_STORE = {
    PERMISSIONS,
    ENDPOINT,
    applications: () => state.applications,
    customer,
    statusLabel,
    joinPermissions,
    nowText,
    approve(application, permissions) {
      application.result = '通过';
      application.processor = '谭英就';
      application.processedAt = nowText();
      application.finalPermissions = permissions.slice();
      const current = state.customers[application.customerId] || {
        customerId: application.customerId,
        customerName: application.customerName,
        merchantId: application.merchantId,
        status: 'none',
        permissions: []
      };
      current.status = 'active';
      current.permissions = permissions.slice();
      current.customerName = application.customerName;
      current.merchantId = application.merchantId;
      state.customers[application.customerId] = current;
      persist();
    },
    reject(application) {
      application.result = '拒绝';
      application.processor = '谭英就';
      application.processedAt = nowText();
      application.finalPermissions = [];
      const current = state.customers[application.customerId];
      if (current && application.applyType === '开通') current.status = 'rejected';
      persist();
    },
    updatePermissions(customerId, permissions) {
      const current = state.customers[String(customerId)];
      if (!current || current.status !== 'active') return false;
      current.permissions = permissions.slice();
      persist();
      return true;
    },
    setEnabled(customerId, enabled) {
      const current = state.customers[String(customerId)];
      if (!current) return false;
      if (enabled && current.status === 'disabled') current.status = 'active';
      if (!enabled && current.status === 'active') current.status = 'disabled';
      persist();
      return true;
    }
  };
})();
