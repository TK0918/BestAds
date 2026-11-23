/*
 * 全额退款原型共享状态。客户端和运营端读写同一份 localStorage。
 * 客户端演示客户固定为 adstest / 商户 1128。
 */
(function () {
  'use strict';

  const KEY = 'bestads-full-refund-v1';
  const PERM_KEY = 'bestads-full-refund-permission-v1';
  const CLIENT_MERCHANT_ID = '1128';
  const WEB_BUTTON = 'button:asset-management_balance-management:full-refund';
  const H5_BUTTON = 'button:h5_balance-management:full-refund';
  const OPEN_STATUS = ['处理中', '待财务核对'];

  function nowText() {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  function roundMoney(value) {
    return Math.round((Number(value) || 0) * 100) / 100;
  }

  function seedState() {
    return {
      orders: [
        {
          id: 'RF20261121002',
          customerId: '3472',
          merchantId: '14229',
          customerName: 'test金额变动',
          bd: '欧伟权',
          am: '管理员',
          status: '待财务核对',
          note: '退款原因：停止投放。收款户名 test金额变动，账号 6222021234567890，开户行 招商银行深圳分行。',
          submittedAt: '2026-11-20 15:12:08',
          applicant: 'test金额变动',
          appliedAt: '2026-11-20 15:12:08',
          applicantRemark: '退款原因：停止投放。收款户名 test金额变动，账号 6222021234567890，开户行 招商银行深圳分行。',
          businessBy: '欧伟权',
          businessAt: '2026-11-20 16:40:22',
          businessRemark: '广告账户余额已核对，交给财务。',
          financeBy: '',
          financeAt: '',
          financeRemark: '',
          walletReal: 10800,
          currency: 'USD',
          confirmedAmount: null,
          accounts: [
            { media: 'Facebook', accountId: '1292368695505904', name: 'MX-G-12-620', accountStatus: '正常', balance: 0.01 },
            { media: 'TikTok', accountId: '7325263652313890817', name: 'HHJC-TT-11-04', accountStatus: '封停', balance: 35.86 }
          ],
      clears: [
        { id: 'AD20260809102644911110001', type: '清零', accountId: '7325263652313890817', amount: 35.86, status: '处理中' }
      ],
          inbounds: [
            { id: 'OT202608090006', type: '线下转账', amount: 1200, status: '处理中' }
          ],
          debits: [],
          cancelReason: ''
        },
        {
          id: 'RF20261121003',
          customerId: '4388',
          merchantId: '16201',
          customerName: 'Arne',
          bd: '王五',
          am: '赵六',
          status: '待财务核对',
          note: '退款原因：项目结束。收款户名 Arne，账号 DE89370400440532013000，开户行 Deutsche Bank。',
          submittedAt: '2026-11-19 11:06:40',
          applicant: 'Arne',
          appliedAt: '2026-11-19 11:06:40',
          applicantRemark: '退款原因：项目结束。收款户名 Arne，账号 DE89370400440532013000，开户行 Deutsche Bank。',
          businessBy: '王五',
          businessAt: '2026-11-19 15:20:08',
          businessRemark: '广告账户已处理完，交给财务。',
          financeBy: '',
          financeAt: '',
          financeRemark: '',
          walletReal: 980.5,
          currency: 'USD',
          confirmedAmount: null,
          accounts: [
            { media: 'Facebook', accountId: '821285917232112', name: 'MX-F-12-2566', accountStatus: '正常', balance: 0.01 }
          ],
          clears: [],
          inbounds: [],
          debits: [],
          cancelReason: ''
        },
        {
          id: 'RF20261118004',
          customerId: '5106',
          merchantId: '19876',
          customerName: 'Demo Shop',
          bd: '谭英就',
          am: '李志伟',
          status: '已退款',
          note: '退款原因：结清退出。收款信息由财务线下保存。',
          submittedAt: '2026-11-18 09:20:11',
          applicant: 'Demo Shop',
          appliedAt: '2026-11-18 09:20:11',
          applicantRemark: '退款原因：结清退出。收款信息由财务线下保存。',
          businessBy: '谭英就',
          businessAt: '2026-11-18 11:05:16',
          businessRemark: '广告账户余额已处理完。',
          financeBy: '管理员',
          financeAt: '2026-11-18 16:02:33',
          financeRemark: '确认按其他扣费扣款 800 USD。',
          walletReal: 120,
          currency: 'USD',
          confirmedAmount: 800,
          accounts: [],
          clears: [],
          inbounds: [],
          debits: [{ at: '2026-11-18 16:02:33', amount: 800, kind: '确认扣款' }],
          cancelReason: ''
        },
        {
          id: 'RF20261115005',
          customerId: '14656',
          merchantId: '14656',
          customerName: 'test测试币种GBP',
          bd: '汤秀梅',
          am: '程允良',
          status: '已取消',
          note: '客户决定继续投放。',
          submittedAt: '2026-11-15 14:02:19',
          applicant: 'test测试币种GBP',
          appliedAt: '2026-11-15 14:02:19',
          applicantRemark: '客户决定继续投放。',
          businessBy: '',
          businessAt: '',
          businessRemark: '',
          financeBy: '',
          financeAt: '',
          financeRemark: '',
          walletReal: 1840,
          currency: 'GBP',
          confirmedAmount: null,
          accounts: [],
          clears: [],
          inbounds: [],
          debits: [],
          cancelReason: '与客户沟通后继续合作'
        }
      ],
      notices: [],
      refundDebitRows: []
    };
  }

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw || !Array.isArray(raw.orders)) return seedState();
      if (!Array.isArray(raw.notices)) raw.notices = [];
      if (!Array.isArray(raw.refundDebitRows)) raw.refundDebitRows = [];
      raw.orders.forEach(order => {
        (order.accounts || []).forEach(item => {
          if (!item.accountStatus) {
            const known = {
              '821285917232112': '正常',
              '6077344284': '停用',
              '1292368695505904': '正常',
              '7325263652313890817': '封停'
            };
            item.accountStatus = known[item.accountId] || '正常';
          }
        });
        (order.clears || []).forEach(item => {
          if (!item.type) item.type = '清零';
        });
        fillAudit(order);
      });
      return raw;
    } catch (error) {
      return seedState();
    }
  }

  function fillAudit(order) {
    if (order.appliedAt == null) order.appliedAt = order.submittedAt || '';
    if (order.applicant == null) order.applicant = order.customerName || '';
    if (order.applicantRemark == null) order.applicantRemark = order.note || '';
    const preset = {
      RF20261121002: {
        businessAt: '2026-11-20 16:40:22',
        businessBy: '欧伟权',
        businessRemark: '广告账户余额已核对，交给财务。'
      },
      RF20261121003: {
        businessAt: '2026-11-19 15:20:08',
        businessBy: '王五',
        businessRemark: '广告账户已处理完，交给财务。'
      },
      RF20261118004: {
        businessAt: '2026-11-18 11:05:16',
        businessBy: '谭英就',
        businessRemark: '广告账户余额已处理完。',
        financeAt: '2026-11-18 16:02:33',
        financeBy: '管理员',
        financeRemark: '确认按其他扣费扣款 800 USD。'
      }
    }[order.id] || {};
    ['businessAt', 'businessBy', 'businessRemark', 'financeAt', 'financeBy', 'financeRemark'].forEach(key => {
      if (order[key] == null) order[key] = preset[key] || '';
    });
  }

  function write(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function readPerm() {
    try {
      return JSON.parse(localStorage.getItem(PERM_KEY) || '{}') || {};
    } catch (error) {
      return {};
    }
  }

  function allowed(merchantId, channel) {
    const record = readPerm()[merchantId];
    if (!record || typeof record[channel] !== 'boolean') return true;
    return record[channel];
  }

  function orders() {
    return read().orders.slice();
  }

  function find(id) {
    return read().orders.find(order => order.id === id) || null;
  }

  function merchantOrders(merchantId) {
    return orders().filter(order => order.merchantId === String(merchantId));
  }

  function openOrder(merchantId) {
    return merchantOrders(merchantId).find(order => OPEN_STATUS.includes(order.status)) || null;
  }

  function latestRefunded(merchantId) {
    return merchantOrders(merchantId).find(order => order.status === '已退款') || null;
  }

  function clientOrder() {
    return openOrder(CLIENT_MERCHANT_ID) || latestRefunded(CLIENT_MERCHANT_ID);
  }

  function clientLocked() {
    const order = clientOrder();
    return Boolean(order && order.status !== '已取消');
  }

  function markFor(merchantId) {
    if (openOrder(merchantId)) return '全额退款中';
    if (latestRefunded(merchantId)) return '已退款';
    return '';
  }

  function blocksRecharge() {
    return false;
  }

  function blocksOtherDebit() {
    return false;
  }

  function blocksDeduct(order) {
    return (order?.inbounds || []).some(item => item.status === '处理中');
  }

  function refundDebitRows() {
    return read().refundDebitRows || [];
  }

  function addRefundDebits(rows) {
    const state = read();
    state.refundDebitRows = (rows || []).concat(state.refundDebitRows || []);
    write(state);
    return state.refundDebitRows;
  }

  function update(id, mutator) {
    const state = read();
    const order = state.orders.find(item => item.id === id);
    if (!order) return { ok: false, message: '未找到退款单' };
    const result = mutator(order, state) || { ok: true };
    if (result.ok === false) return result;
    write(state);
    return { ok: true, order };
  }

  function pushNotice(state, order) {
    state.notices.unshift({
      id: `FS${Date.now()}`,
      orderId: order.id,
      merchantId: order.merchantId,
      customerName: order.customerName,
      bd: order.bd,
      am: order.am,
      note: order.note || '客户未填写退款说明',
      at: order.submittedAt,
      read: false
    });
  }

  function submitClient(note) {
    if (!allowed(CLIENT_MERCHANT_ID, 'web') && !allowed(CLIENT_MERCHANT_ID, 'h5')) {
      return { ok: false, message: '当前账号没有全额退款权限' };
    }
    if (clientLocked()) return { ok: false, message: '已有全额退款申请，不能重复提交' };
    const state = read();
    const submittedAt = nowText();
    const remark = String(note || '').trim();
    const order = {
      id: `RF${Date.now()}`,
      customerId: '102',
      merchantId: CLIENT_MERCHANT_ID,
      customerName: 'adstest',
      bd: '谭英就',
      am: '李志伟',
      status: '处理中',
      note: remark,
      submittedAt,
      applicant: 'adstest',
      appliedAt: submittedAt,
      applicantRemark: remark,
      businessBy: '',
      businessAt: '',
      businessRemark: '',
      financeBy: '',
      financeAt: '',
      financeRemark: '',
      walletReal: 640,
      currency: 'USD',
      confirmedAmount: null,
      accounts: [
        { media: 'Facebook', accountId: '821285917232112', name: 'MX-F-12-2566', accountStatus: '正常', balance: 120 },
        { media: 'Google', accountId: '6077344284', name: 'muxue-HTX0P', accountStatus: '停用', balance: 80 }
      ],
      clears: [
        { id: 'AD202611210001', type: '清零', accountId: '821285917232112', amount: 120, status: '处理中' }
      ],
      inbounds: [],
      debits: [],
      cancelReason: ''
    };
    state.orders.unshift(order);
    pushNotice(state, order);
    write(state);
    return { ok: true, order };
  }

  function resetDemo() {
    localStorage.removeItem(KEY);
    write(seedState());
  }

  window.BESTADS_FULL_REFUND = {
    CLIENT_MERCHANT_ID,
    WEB_BUTTON,
    H5_BUTTON,
    nowText,
    roundMoney,
    orders,
    find,
    openOrder,
    clientOrder,
    clientLocked,
    markFor,
    blocksRecharge,
    blocksOtherDebit,
    blocksDeduct,
    refundDebitRows,
    addRefundDebits,
    allowed,
    setPermissionsFromKeys(merchantId, keys) {
      const list = Array.isArray(keys) ? keys : [];
      const all = readPerm();
      all[String(merchantId)] = {
        web: list.includes(WEB_BUTTON),
        h5: list.includes(H5_BUTTON)
      };
      localStorage.setItem(PERM_KEY, JSON.stringify(all));
    },
    notices() {
      return read().notices.slice();
    },
    unreadCount() {
      return read().notices.filter(item => !item.read).length;
    },
    markNoticesRead() {
      const state = read();
      state.notices.forEach(item => { item.read = true; });
      write(state);
    },
    submitClient,
    update,
    resetDemo,
    completeInbound(id, inboundId) {
      return update(id, order => {
        const inbound = (order.inbounds || []).find(item => item.id === inboundId);
        if (!inbound || inbound.status !== '处理中') return { ok: false, message: '没有处理中的入账单' };
        inbound.status = '已入账';
        order.walletReal = roundMoney(order.walletReal + inbound.amount);
      });
    }
  };
})();
