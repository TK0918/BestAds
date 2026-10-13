/*
 * V 2.49 监控管理：账户大额充值监控、投放URL监控、BM管理员监控。
 * 数据只在当前页面更新，不调用真实接口。
 */
(function () {
  'use strict';

  const PAGE_IDS = ['large-recharge-monitor', 'landing-url-monitor', 'bm-admin-monitor'];
  const operator = '管理员(admin@bestfulfill.com)';
  const groups = {
    finance: '业务+财务风控群',
    biz: '业务风控群'
  };
  const switchOptions = ['开启', '关闭'];
  const currencies = ['USD', 'EUR', 'GBP'];
  const customers = {
    '14229 test金额变动': { merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)' },
    '1128 adstest': { merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)' },
    '16201 Arne': { merchantId: '16201', customerName: 'Arne', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)' }
  };
  const accounts = {
    '1292368695505904 MX-G-12-620': { accountId: '1292368695505904', accountName: 'MX-G-12-620', media: 'Facebook', currency: 'USD', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)' },
    '821285917232112 HQ-W-12-13': { accountId: '821285917232112', accountName: 'HQ-W-12-13', media: 'Facebook', currency: 'USD', merchantId: '16201', customerName: 'Arne', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)' },
    '1002116215352952 Oliva-Amsterdam': { accountId: '1002116215352952', accountName: 'Oliva-Amsterdam', media: 'Facebook', currency: 'EUR', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)' },
    '1816898937 MX-W-GG-07-10': { accountId: '1816898937', accountName: 'MX-W-GG-07-10', media: 'Google', currency: 'USD', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)' }
  };

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const person = value => `<span class="person-cell">${esc(value || '-')}</span>`;
  const wrap = value => `<span class="wrap">${esc(value || '-').replace(/\n/g, '<br>')}</span>`;
  const onOff = value => `<span class="status-tag ${value === '开启' ? 'status-success' : 'status-info'}">${esc(value || '-')}</span>`;
  const feedbackTag = value => {
    const cls = value === '正常' ? 'status-success' : value === '异常' ? 'status-danger' : 'status-warning';
    return `<span class="status-tag ${cls}">${esc(value || '-')}</span>`;
  };
  const plainTag = value => {
    const text = value || '-';
    const cls = /正常|已发送|内部人员|是/.test(text) ? 'status-success' : /异常|非内部|否/.test(text) ? 'status-danger' : /待/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const amountText = value => {
    const number = Number(String(value == null ? '' : value).replace(/,/g, ''));
    if (!Number.isFinite(number)) return '';
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const nowText = () => {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  const isRiskPage = () => PAGE_IDS.includes(document.body?.dataset?.adminPage || '');
  const readForm = backdrop => {
    const data = {};
    backdrop.querySelectorAll('[name]').forEach(node => {
      data[node.name] = String(node.value || '').trim();
    });
    return data;
  };
  const activeTab = ctx => ctx.tabs.find(item => item.id === ctx.state.tab) || ctx.tabs[0];

  const marketRows = [
    { currency: 'USD', threshold: '5,000.00', notify: '开启', restrict: '开启', updatedBy: operator, updatedAt: '2026-10-08 11:20:16', ops: ['编辑', '删除'] },
    { currency: 'EUR', threshold: '4,000.00', notify: '开启', restrict: '关闭', updatedBy: operator, updatedAt: '2026-10-08 11:22:04', ops: ['编辑', '删除'] }
  ];
  const customerRows = [
    { customerPick: '14229 test金额变动', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', currency: 'USD', threshold: '2,000.00', notify: '开启', restrict: '开启', updatedBy: operator, updatedAt: '2026-10-09 15:06:41', ops: ['编辑', '删除'] },
    { customerPick: '1128 adstest', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)', currency: 'EUR', threshold: '8,000.00', notify: '开启', restrict: '关闭', updatedBy: '张三(zhangsan@bestfulfill.com)', updatedAt: '2026-10-10 09:18:22', ops: ['编辑', '删除'] }
  ];
  const accountRows = [
    { accountPick: '1292368695505904 MX-G-12-620', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', media: 'Facebook', accountName: 'MX-G-12-620', accountId: '1292368695505904', currency: 'USD', threshold: '10,000.00', notify: '开启', restrict: '关闭', updatedBy: operator, updatedAt: '2026-10-11 10:02:18', ops: ['编辑', '删除'] },
    { accountPick: '1002116215352952 Oliva-Amsterdam', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)', media: 'Facebook', accountName: 'Oliva-Amsterdam', accountId: '1002116215352952', currency: 'EUR', threshold: '1,000.00', notify: '开启', restrict: '开启', updatedBy: operator, updatedAt: '2026-10-11 16:40:55', ops: ['编辑', '删除'] }
  ];
  const noticeRows = [
    { notifiedAt: '2026-10-12 09:16:08', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', media: 'Facebook', accountName: 'MX-G-12-620', accountId: '1292368695505904', currency: 'USD', amount: '3,000.00', dayTotal: '6,400.00', hitLevel: '账户', threshold: '10,000.00', source: '客户自助', verified: '否', feishuGroup: groups.finance, mentioned: '王五、赵六', sent: '已发送' },
    { notifiedAt: '2026-10-12 11:02:41', merchantId: '16201', customerName: 'Arne', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', media: 'Facebook', accountName: 'HQ-W-12-13', accountId: '821285917232112', currency: 'USD', amount: '2,500.00', dayTotal: '5,200.00', hitLevel: '大盘', threshold: '5,000.00', source: '客户自助', verified: '是', feishuGroup: groups.finance, mentioned: '王五、赵六', sent: '已发送' },
    { notifiedAt: '2026-10-12 14:28:16', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', media: 'Google', accountName: 'MX-W-GG-07-10', accountId: '1816898937', currency: 'USD', amount: '800.00', dayTotal: '5,600.00', hitLevel: '客户', threshold: '2,000.00', source: '自动充值', verified: '否', feishuGroup: groups.finance, mentioned: '王五、赵六', sent: '已发送' },
    { notifiedAt: '2026-10-11 18:44:03', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)', media: 'Facebook', accountName: 'Oliva-Amsterdam', accountId: '1002116215352952', currency: 'EUR', amount: '1,200.00', dayTotal: '1,200.00', hitLevel: '账户', threshold: '1,000.00', source: '运营代充', verified: '否', feishuGroup: groups.finance, mentioned: '张三、李四', sent: '已发送' }
  ];
  const urlRows = [
    { foundAt: '2026-10-12 08:20:11', merchantId: '16201', customerName: 'Arne', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', accountName: 'HQ-W-12-13', accountId: '821285917232112', newDomain: 'evil-store.com', newUrl: 'https://evil-store.com/landing/a\nhttps://www.evil-store.com/lp/b', previousDomains: 'brand.com', feedback: '待跟进', feedbackBy: '-', feedbackAt: '-', feedbackRemark: '', ops: ['反馈'] },
    { foundAt: '2026-10-11 19:06:40', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', accountName: 'MX-G-12-620', accountId: '1292368695505904', newDomain: 'newbrand.co', newUrl: 'https://newbrand.co/shop', previousDomains: 'oldbrand.com', feedback: '正常', feedbackBy: '王五(wangwu@bestfulfill.com)', feedbackAt: '2026-10-11 20:12:08', feedbackRemark: '客户确认是新站点，继续投放', ops: ['反馈'] },
    { foundAt: '2026-10-10 13:41:22', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)', accountName: 'Oliva-Amsterdam', accountId: '1002116215352952', newDomain: 'quick-loan.example', newUrl: 'https://quick-loan.example/apply', previousDomains: 'oliva-home.com', feedback: '异常', feedbackBy: '李四(lisi@bestfulfill.com)', feedbackAt: '2026-10-10 15:02:36', feedbackRemark: '客户不知情，已要求停投并改密', ops: ['反馈'] }
  ];
  const bmRows = [
    { foundAt: '2026-10-12 07:55:18', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', userName: 'Alex Rivera', email: 'alex.rivera.new@gmail.com', changeType: '新增管理员', internal: '非内部', feedback: '待跟进', feedbackBy: '-', feedbackAt: '-', feedbackRemark: '', ops: ['反馈'] },
    { foundAt: '2026-10-11 21:16:44', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', userName: '翔（2） 刘', email: '3173594193@qq.com', changeType: '成员提权', internal: '内部人员', feedback: '待跟进', feedbackBy: '-', feedbackAt: '-', feedbackRemark: '', ops: ['反馈'] },
    { foundAt: '2026-10-09 10:08:02', bmName: '电商集团 BM', bmId: '1002003004005', userName: 'Stan Tl', email: '2tal13205@muxue.vip', changeType: '新增管理员', internal: '内部人员', feedback: '正常', feedbackBy: operator, feedbackAt: '2026-10-09 10:30:16', feedbackRemark: '入职开通，已核对名单', ops: ['反馈'] },
    { foundAt: '2026-10-08 16:22:51', bmName: '电商集团 BM', bmId: '1002003004005', userName: 'Guest Admin', email: 'guest.admin@outlook.com', changeType: '成员提权', internal: '非内部', feedback: '异常', feedbackBy: '王五(wangwu@bestfulfill.com)', feedbackAt: '2026-10-08 17:05:40', feedbackRemark: '非在职人员，已从 BM 移除', ops: ['反馈'] }
  ];

  const ruleColumns = {
    threshold: { key: 'threshold', label: '阈值', width: 140, num: true, sort: true },
    notify: { key: 'notify', label: '通知', width: 120, format: onOff, help: '开启后，当充值金额大于等于阈值时，会在飞书群发送飞书消息通知大家。' },
    restrict: { key: 'restrict', label: '限制', width: 120, format: onOff, help: '开启后，当充值金额大于等于阈值时，需要主账号邮箱收到的验证码来验证本次充值操作，否则无法成功发起充值。' },
    updatedBy: { key: 'updatedBy', label: '更新人', align: 'left', width: 260, format: person },
    updatedAt: { key: 'updatedAt', label: '更新时间', width: 180, sort: true }
  };
  const switchFields = [
    { key: 'notify', label: '通知', control: 'select', options: switchOptions, placeholder: '请选择通知', help: '开启后，当充值金额大于等于阈值时，会在飞书群发送飞书消息通知大家。' },
    { key: 'restrict', label: '限制', control: 'select', options: switchOptions, placeholder: '请选择限制', help: '开启后，当充值金额大于等于阈值时，需要主账号邮箱收到的验证码来验证本次充值操作，否则无法成功发起充值。' }
  ];
  const thresholdField = { key: 'threshold', label: '阈值', placeholder: '请输入当日累计充值金额', help: '按该币种比较广告账户当日累计充值，减款和清零不抵消。' };
  const feedbackFields = [
    { key: 'feedback', label: '反馈', control: 'select', options: ['正常', '异常'], placeholder: '请选择反馈' },
    { key: 'feedbackRemark', label: '说明', control: 'textarea', full: true, required: false, placeholder: '请输入跟进说明' }
  ];
  const feedbackModal = {
    title: '反馈',
    fields: feedbackFields
  };
  const batchFeedbackModal = {
    title: '批量反馈',
    fields: feedbackFields
  };
  let batchTargets = [];

  function syncMarketNote(tab) {
    tab.footerNote = `大额通知发到「${groups.finance}」，并艾特该客户的 BD、AM。未配置的币种不监控。`;
  }

  const marketTab = {
    id: 'market',
    label: '大盘规则',
    filters: [
      { key: 'currency', label: '币种', type: 'select', options: currencies, placeholder: '请选择币种' },
      { key: 'notify', label: '通知', type: 'select', options: switchOptions, placeholder: '请选择通知' },
      { key: 'restrict', label: '限制', type: 'select', options: switchOptions, placeholder: '请选择限制' }
    ],
    actions: [
      { id: 'create-currency', label: '新增币种', icon: 'plus', primary: true },
      { id: 'notify-groups', label: '通知群设置', icon: 'bell', align: 'right' }
    ],
    tableMinWidth: 980,
    opsWidth: 140,
    columns: [
      { key: 'currency', label: '币种', width: 100 },
      ruleColumns.threshold,
      ruleColumns.notify,
      ruleColumns.restrict,
      ruleColumns.updatedBy,
      ruleColumns.updatedAt
    ],
    rows: marketRows,
    footerNote: '',
    modals: {
      '新增币种': { title: '新增大盘规则', fields: [{ key: 'currency', label: '币种', control: 'select', options: currencies, placeholder: '请选择币种' }, thresholdField, ...switchFields] },
      '编辑': { title: '编辑大盘规则', fields: [{ key: 'currency', label: '币种', control: 'readonly' }, thresholdField, ...switchFields] },
      '通知群设置': { type: 'risk-groups', title: '通知群设置' }
    }
  };
  syncMarketNote(marketTab);

  const customerTab = {
    id: 'customer',
    label: '客户规则',
    filters: [
      { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
      { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
      { key: 'currency', label: '币种', type: 'select', options: currencies, placeholder: '请选择币种' }
    ],
    actions: [{ id: 'create-customer', label: '新增客户规则', icon: 'plus', primary: true }],
    filterClass: 'cols-3',
    tableMinWidth: 1680,
    opsWidth: 140,
    columns: [
      { key: 'merchantId', label: '商户ID', width: 120, sort: true },
      { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
      { key: 'bd', label: 'BD', align: 'left', width: 240, format: person },
      { key: 'am', label: 'AM', align: 'left', width: 240, format: person },
      { key: 'currency', label: '币种', width: 90 },
      ruleColumns.threshold,
      ruleColumns.notify,
      ruleColumns.restrict,
      ruleColumns.updatedBy,
      ruleColumns.updatedAt
    ],
    rows: customerRows,
    footerNote: '保存后，该客户在这个币种下的广告账户整条使用这里的阈值、通知和限制。',
    modals: {
      '新增客户规则': { title: '新增客户规则', fields: [{ key: 'customerPick', label: '客户', control: 'select', options: Object.keys(customers), placeholder: '请选择客户' }, { key: 'currency', label: '币种', control: 'select', options: currencies, placeholder: '请选择币种' }, thresholdField, ...switchFields] },
      '编辑': { title: '编辑客户规则', fields: [{ key: 'customerPick', label: '客户', control: 'readonly' }, { key: 'currency', label: '币种', control: 'readonly' }, thresholdField, ...switchFields] }
    }
  };

  const accountTab = {
    id: 'account',
    label: '账户规则',
    filters: [
      { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
      { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
      { key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Google', 'TikTok'], placeholder: '请选择媒体' },
      { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
      { key: 'accountName', label: '广告账户名称', placeholder: '请输入广告账户名称' }
    ],
    actions: [{ id: 'create-account', label: '新增账户规则', icon: 'plus', primary: true }],
    filterClass: 'cols-5',
    tableMinWidth: 1960,
    opsWidth: 140,
    columns: [
      { key: 'merchantId', label: '商户ID', width: 120, sort: true },
      { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
      { key: 'media', label: '媒体', width: 110 },
      { key: 'accountName', label: '广告账户名称', align: 'left', width: 200 },
      { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
      { key: 'currency', label: '币种', width: 90 },
      ruleColumns.threshold,
      ruleColumns.notify,
      ruleColumns.restrict,
      ruleColumns.updatedBy,
      ruleColumns.updatedAt
    ],
    rows: accountRows,
    footerNote: '保存后，该广告账户整条使用这里的阈值、通知和限制。',
    modals: {
      '新增账户规则': { title: '新增账户规则', size: 'md', fields: [{ key: 'accountPick', label: '广告账户', control: 'select', options: Object.keys(accounts), placeholder: '请选择广告账户', full: true }, thresholdField, ...switchFields] },
      '编辑': { title: '编辑账户规则', fields: [{ key: 'accountPick', label: '广告账户', control: 'readonly', full: true }, thresholdField, ...switchFields] }
    }
  };

  const noticeTab = {
    id: 'notices',
    label: '通知记录',
    filters: [
      { key: 'notifiedAt', label: '通知时间', type: 'daterange' },
      { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
      { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
      { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
      { key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Google', 'TikTok'], placeholder: '请选择媒体' },
      { key: 'hitLevel', label: '命中层级', type: 'select', options: ['大盘', '客户', '账户'], placeholder: '请选择命中层级' },
      { key: 'source', label: '充值来源', type: 'select', options: ['客户自助', '运营代充', '自动充值'], placeholder: '请选择充值来源' },
      { key: 'verified', label: '是否验证码', type: 'select', options: ['是', '否'], placeholder: '请选择是否验证码' }
    ],
    filterClass: 'cols-5',
    tableMinWidth: 2920,
    hideOperation: true,
    columns: [
      { key: 'notifiedAt', label: '通知时间', width: 180, sort: true },
      { key: 'merchantId', label: '商户ID', width: 110, sort: true },
      { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
      { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
      { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
      { key: 'media', label: '媒体', width: 110 },
      { key: 'accountName', label: '广告账户名称', align: 'left', width: 180 },
      { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
      { key: 'currency', label: '币种', width: 90 },
      { key: 'amount', label: '本笔金额', width: 130, num: true, sort: true },
      { key: 'dayTotal', label: '当日累计', width: 130, num: true, sort: true },
      { key: 'hitLevel', label: '命中层级', width: 110, format: plainTag },
      { key: 'threshold', label: '阈值', width: 120, num: true },
      { key: 'source', label: '充值来源', width: 120 },
      { key: 'verified', label: '是否验证码', width: 160, format: plainTag, help: '「是」表示客户已输入主账号邮箱收到的验证码，这笔充值才发起成功。「否」表示这笔充值没有走验证码，包括限制关闭、运营代充和自动充值。' },
      { key: 'feishuGroup', label: '飞书群', align: 'left', width: 180 },
      { key: 'mentioned', label: '艾特', align: 'left', width: 160 },
      { key: 'sent', label: '发送结果', width: 140, format: plainTag, help: '飞书消息是否已经发到大额通知群。已发送表示发送成功。' }
    ],
    rows: noticeRows,
    footerNote: '这里只回看已经发出的大额通知。'
  };

  function pendingInitialFilters() {
    if (new URLSearchParams(window.location.search).get('feedback') !== '待跟进') return {};
    return { initialFilters: { feedback: '待跟进' } };
  }

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign(window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    'large-recharge-monitor': {
      title: '账户大额充值监控',
      tabs: [marketTab, customerTab, accountTab, noticeTab]
    },
    'landing-url-monitor': {
      title: '投放URL监控',
      ...pendingInitialFilters(),
      filters: [
        { key: 'foundAt', label: '发现时间', type: 'daterange' },
        { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
        { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
        { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
        { key: 'newDomain', label: '新注册域', placeholder: '请输入新注册域' },
        { key: 'feedback', label: '反馈', type: 'select', options: ['待跟进', '正常', '异常'], placeholder: '请选择反馈' }
      ],
      filterClass: 'cols-5',
      selectable: true,
      actions: [{ id: 'batch-feedback', label: '批量反馈', icon: 'comment', primary: true }],
      tableMinWidth: 2480,
      opsWidth: 100,
      columns: [
        { key: 'foundAt', label: '发现时间', width: 180, sort: true },
        { key: 'merchantId', label: '商户ID', width: 110, sort: true },
        { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
        { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
        { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
        { key: 'accountName', label: '广告账户名称', align: 'left', width: 180 },
        { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
        { key: 'newDomain', label: '新注册域', align: 'left', width: 180 },
        { key: 'newUrl', label: '新URL', align: 'left', width: 280, format: wrap },
        { key: 'previousDomains', label: '此前投放过的域名', align: 'left', width: 200, format: wrap },
        { key: 'feedback', label: '反馈', width: 110, format: feedbackTag },
        { key: 'feedbackBy', label: '反馈人', align: 'left', width: 240, format: person },
        { key: 'feedbackAt', label: '反馈时间', width: 180, sort: true },
        { key: 'feedbackRemark', label: '说明', align: 'left', width: 240, format: wrap }
      ],
      rows: urlRows,
      footerNote: `飞书发到「${groups.biz}」。同一广告账户出现新的注册域后在这里反馈。`,
      modals: { '反馈': feedbackModal, '批量反馈': batchFeedbackModal }
    },
    'bm-admin-monitor': {
      title: 'BM管理员监控',
      ...pendingInitialFilters(),
      filters: [
        { key: 'foundAt', label: '发现时间', type: 'daterange' },
        { key: 'bmName', label: 'BM名称', placeholder: '请输入BM名称' },
        { key: 'bmId', label: 'BM ID', placeholder: '请输入BM ID' },
        { key: 'email', label: 'User Email', placeholder: '请输入User Email' },
        { key: 'changeType', label: '变化', type: 'select', options: ['新增管理员', '成员提权'], placeholder: '请选择变化' },
        { key: 'internal', label: '是否内部', type: 'select', options: ['内部人员', '非内部'], placeholder: '请选择是否内部' },
        { key: 'feedback', label: '反馈', type: 'select', options: ['待跟进', '正常', '异常'], placeholder: '请选择反馈' }
      ],
      filterClass: 'cols-5',
      selectable: true,
      actions: [{ id: 'batch-feedback', label: '批量反馈', icon: 'comment', primary: true }],
      tableMinWidth: 2200,
      opsWidth: 100,
      columns: [
        { key: 'foundAt', label: '发现时间', width: 180, sort: true },
        { key: 'bmName', label: 'BM名称', align: 'left', width: 240 },
        { key: 'bmId', label: 'BM ID', width: 180, sort: true },
        { key: 'userName', label: 'User名称', align: 'left', width: 160 },
        { key: 'email', label: 'User Email', align: 'left', width: 240 },
        { key: 'changeType', label: '变化', width: 130, format: plainTag },
        { key: 'internal', label: '是否内部', width: 120, format: plainTag },
        { key: 'feedback', label: '反馈', width: 110, format: feedbackTag },
        { key: 'feedbackBy', label: '反馈人', align: 'left', width: 240, format: person },
        { key: 'feedbackAt', label: '反馈时间', width: 180, sort: true },
        { key: 'feedbackRemark', label: '说明', align: 'left', width: 240, format: wrap }
      ],
      rows: bmRows,
      footerNote: `飞书发到「${groups.biz}」。新管理员和成员提权都会出现，内部人员也会通知。`,
      modals: { '反馈': feedbackModal, '批量反馈': batchFeedbackModal }
    }
  });

  function applyRule(row, form) {
    const threshold = amountText(form.threshold);
    if (!threshold || Number(String(form.threshold).replace(/,/g, '')) <= 0) return '请输入大于 0 的阈值';
    if (!switchOptions.includes(form.notify) || !switchOptions.includes(form.restrict)) return '请选择通知和限制';
    row.threshold = threshold;
    row.notify = form.notify;
    row.restrict = form.restrict;
    row.updatedBy = operator;
    row.updatedAt = nowText();
    row.ops = ['编辑', '删除'];
    return '';
  }

  function saveMarket(ctx, form, row) {
    const tab = activeTab(ctx);
    if (!row) {
      if (!currencies.includes(form.currency)) return '请选择币种';
      if (tab.rows.some(item => item.currency === form.currency)) return '该币种已有大盘规则';
      const created = { currency: form.currency };
      const error = applyRule(created, form);
      if (error) return error;
      tab.rows.unshift(created);
      return '';
    }
    return applyRule(row, form);
  }

  function saveCustomer(ctx, form, row) {
    const tab = activeTab(ctx);
    const customer = customers[form.customerPick] || (row ? customers[row.customerPick] : null);
    const currency = form.currency || row?.currency;
    if (!customer) return '请选择客户';
    if (!currencies.includes(currency)) return '请选择币种';
    const duplicated = tab.rows.some(item => item !== row && item.merchantId === customer.merchantId && item.currency === currency);
    if (duplicated) return '该客户在这个币种下已有规则';
    const target = row || { customerPick: form.customerPick, ...customer, currency };
    if (!row) Object.assign(target, customer, { customerPick: form.customerPick, currency });
    const error = applyRule(target, form);
    if (error) return error;
    if (!row) tab.rows.unshift(target);
    return '';
  }

  function saveAccount(ctx, form, row) {
    const tab = activeTab(ctx);
    const account = accounts[form.accountPick] || (row ? accounts[row.accountPick] : null);
    if (!account) return '请选择广告账户';
    if (tab.rows.some(item => item !== row && item.accountId === account.accountId)) return '该广告账户已有规则';
    const target = row || { accountPick: form.accountPick, ...account };
    if (!row) Object.assign(target, account, { accountPick: form.accountPick });
    const error = applyRule(target, form);
    if (error) return error;
    if (!row) tab.rows.unshift(target);
    return '';
  }

  function syncPendingBadge(pageId, rows) {
    const count = rows.filter(row => row.feedback === '待跟进').length;
    const link = document.querySelector(`[data-admin-menu-id="${pageId}"]`);
    if (!link) return;
    let badge = link.querySelector('.admin-shell-badge');
    if (count <= 0) {
      if (badge) badge.remove();
      link.classList.remove('has-badge');
      return;
    }
    const text = count > 99 ? '99+' : String(count);
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'admin-shell-badge';
      badge.title = '只看待跟进';
      if (link.dataset.pendingHref) badge.dataset.pendingHref = link.dataset.pendingHref;
      link.appendChild(badge);
    }
    link.classList.add('has-badge');
    badge.textContent = text;
    badge.setAttribute('aria-label', `待跟进 ${text}`);
  }

  function feedbackError(form) {
    if (!['正常', '异常'].includes(form.feedback)) return '请选择反馈';
    return '';
  }

  function saveFeedback(row, form) {
    const error = feedbackError(form);
    if (error) return error;
    row.feedback = form.feedback;
    row.feedbackRemark = String(form.feedbackRemark || '').trim();
    row.feedbackBy = operator;
    row.feedbackAt = nowText();
    return '';
  }

  window.BESTADS_RISK_MONITOR = {
    isRiskPage,
    prepareBatchFeedback({ selectedRows, state, showToast }) {
      if (!isRiskPage()) return false;
      if (!selectedRows.length) {
        showToast('请先勾选需要反馈的记录', 'error');
        return 'stop';
      }
      batchTargets = selectedRows.slice();
      state.processingRow = null;
      state.processingAction = '批量反馈';
      return 'open';
    },
    renderModal(modal) {
      return `<div class="modal-backdrop" data-risk-groups><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '通知群设置')}</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="form-grid"><div class="form-field full"><label>大额通知群 <span style="color:var(--admin-danger)">*</span></label><input name="financeGroup" type="text" value="${esc(groups.finance)}" placeholder="业务和财务都在的风控群"></div><div class="form-field full"><label>业务通知群 <span style="color:var(--admin-danger)">*</span></label><input name="bizGroup" type="text" value="${esc(groups.biz)}" placeholder="业务所在的风控群"></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>保存</button></div></section></div>`;
    },
    handleRowAction(action, row, ctx) {
      if (!isRiskPage() || action !== '删除') return false;
      ctx.state.processingRow = row;
      const name = row.accountName || row.customerName || row.currency || '这条规则';
      ctx.openModal(`<div class="modal-backdrop" data-risk-delete><section class="modal modal-sm"><div class="modal__header"><h2 class="modal__title">删除规则</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="confirm-copy">删除后，<strong>${esc(name)}</strong> 不再使用这条规则，改按上一层规则；上一层也没有时不监控。</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-danger" data-modal-submit>删除</button></div></section></div>`);
      return true;
    },
    handleSubmit(backdrop, ctx) {
      if (!isRiskPage() || !backdrop) return false;
      if (backdrop.hasAttribute('data-risk-delete')) {
        const tab = activeTab(ctx);
        const row = ctx.state.processingRow;
        const index = tab.rows.indexOf(row);
        if (index < 0) { ctx.showToast('未找到这条规则', 'error'); return true; }
        tab.rows.splice(index, 1);
        ctx.state.processingRow = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('规则已删除（原型）', 'success');
        return true;
      }
      const form = readForm(backdrop);
      if (backdrop.hasAttribute('data-risk-groups')) {
        if (!form.financeGroup || !form.bizGroup) { ctx.showToast('请填写两个飞书群', 'error'); return true; }
        groups.finance = form.financeGroup;
        groups.biz = form.bizGroup;
        syncMarketNote(marketTab);
        noticeRows.forEach(item => { item.feishuGroup = groups.finance; });
        ctx.closeModal();
        ctx.render();
        ctx.showToast('通知群已更新（原型）', 'success');
        return true;
      }
      const row = ctx.state.processingRow;
      if (ctx.state.processingAction === '批量反馈') {
        const targets = batchTargets.slice();
        const error = feedbackError(form);
        if (!targets.length) { ctx.showToast('请先勾选需要反馈的记录', 'error'); return true; }
        if (error) { ctx.showToast(error, 'error'); return true; }
        targets.forEach(item => saveFeedback(item, form));
        batchTargets = [];
        const tab = activeTab(ctx);
        ctx.state.selected?.[tab.id]?.clear();
        ctx.state.processingAction = null;
        const pageId = document.body?.dataset?.adminPage || '';
        if (pageId === 'landing-url-monitor' || pageId === 'bm-admin-monitor') syncPendingBadge(pageId, tab.rows);
        ctx.closeModal();
        ctx.render();
        ctx.showToast(`已反馈 ${targets.length} 条（原型）`, 'success');
        return true;
      }
      if ('feedback' in form) {
        const error = saveFeedback(row, form);
        if (error) { ctx.showToast(error, 'error'); return true; }
        const pageId = document.body?.dataset?.adminPage || '';
        if (pageId === 'landing-url-monitor' || pageId === 'bm-admin-monitor') syncPendingBadge(pageId, activeTab(ctx).rows);
        ctx.state.processingRow = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('反馈已保存（原型）', 'success');
        return true;
      }
      if (!('threshold' in form)) return false;
      const tab = activeTab(ctx);
      const saver = tab.id === 'market' ? saveMarket : tab.id === 'customer' ? saveCustomer : tab.id === 'account' ? saveAccount : null;
      if (!saver) return false;
      const error = saver(ctx, form, row && row.ops ? row : null);
      if (error) { ctx.showToast(error, 'error'); return true; }
      ctx.state.processingRow = null;
      ctx.closeModal();
      ctx.render();
      ctx.showToast('规则已保存（原型）', 'success');
      return true;
    }
  };

  syncPendingBadge('landing-url-monitor', urlRows);
  syncPendingBadge('bm-admin-monitor', bmRows);
})();
