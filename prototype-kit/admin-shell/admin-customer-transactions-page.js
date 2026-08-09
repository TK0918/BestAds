/*
 * BestAds 运营端「客户流水」模块配置。
 * 迁移原则：逐页维护字段、Fixture、按钮和弹窗，不使用历史页面全局桥接层。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const tag = value => {
    const text = asText(value);
    const cls = /成功|已入账|审核通过|完成/.test(text) ? 'status-success' : /失败|驳回|失效|关闭/.test(text) ? 'status-danger' : /待|处理中|待审核|待入账|待支付/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const amount = value => {
    const text = asText(value);
    if (text === '-') return '<span class="muted">-</span>';
    const number = Number(String(text).replace(/,/g, ''));
    const cls = number > 0 ? 'amount-positive' : number < 0 ? 'amount-negative' : 'amount-zero';
    return `<span class="${cls}">${esc(text)}</span>`;
  };
  const plainAmount = value => `<span class="amount-zero">${esc(asText(value))}</span>`;
  const linkLike = value => value && value !== '-' ? `<span class="btn btn-link">${esc(value)}</span>` : '<span class="muted">-</span>';
  const text = value => `<span class="wrap">${esc(asText(value))}</span>`;

  const platforms = ['Stripe', 'PayPal', 'Wise', 'Airwallex', 'Payoneer', 'WorldFirst', 'Others'];
  const currencies = ['USD', 'EUR', 'HKD', 'GBP'];
  const customers = {
    adstest: { customerId: '102', merchantId: '11280', name: 'adstest', email: 'ads***@example.com' },
    amount: { customerId: '3472', merchantId: '14229', name: 'test金额变动', email: 'amount***@example.com' },
    arne: { customerId: '4388', merchantId: '16201', name: 'Arne', email: 'arne***@example.com' },
    demo: { customerId: '5106', merchantId: '19876', name: 'Demo Shop', email: 'demo***@example.com' }
  };

  const identityFilters = [
    { key: 'customerId', label: '客户ID', placeholder: '请输入客户ID' },
    { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
    { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
    { key: 'customerEmail', label: '客户邮箱', placeholder: '请输入客户邮箱' }
  ];

  const transactionRows = [
    { flowId: 'AF202608090001', ...customers.adstest, time: '2026-08-09 10:32:18', reason: '在线充值入账', typeCode: 'ONLINE_RECHARGE', currency: 'USD', changeAmount: '+1,000.00', beforeBalance: '2,580.00', afterBalance: '3,580.00', relatedOrder: 'OR202608090001', remark: 'Stripe 充值到账', ops: ['查看详情'] },
    { flowId: 'AF202608080014', ...customers.amount, time: '2026-08-08 16:20:45', reason: '广告账户充值', typeCode: 'AD_ACCOUNT_RECHARGE', currency: 'USD', changeAmount: '-500.00', beforeBalance: '1,580.00', afterBalance: '1,080.00', relatedOrder: 'AD202608080014', remark: '充值至 FB 广告账户 821285917232112', ops: ['查看详情'] },
    { flowId: 'AF202608070026', ...customers.arne, time: '2026-08-07 11:08:22', reason: '广告账户减款退回', typeCode: 'AD_ACCOUNT_REDUCED', currency: 'USD', changeAmount: '+120.50', beforeBalance: '860.00', afterBalance: '980.50', relatedOrder: 'AD20260807002833682397944', remark: '媒体已完成减款，回补客户钱包', ops: ['查看详情'] },
    { flowId: 'AF202608060008', ...customers.demo, time: '2026-08-06 15:44:03', reason: '线下转账入账', typeCode: 'OFFLINE_TRANSFER', currency: 'EUR', changeAmount: '+800.00', beforeBalance: '0.00', afterBalance: '800.00', relatedOrder: 'OT202608060008', remark: 'Wise 水单审核通过', ops: ['查看详情'] },
    { flowId: 'AF202608050011', ...customers.amount, time: '2026-08-05 09:18:10', reason: '其他扣费', typeCode: 'OTHER_DEDUCTION', currency: 'USD', changeAmount: '-36.00', beforeBalance: '1,116.00', afterBalance: '1,080.00', relatedOrder: 'OD202608050011', remark: '手工扣费：素材处理服务', ops: ['查看详情'] }
  ];

  const onlineRows = [
    { orderId: 'OR202608090001', ...customers.adstest, rechargeAt: '2026-08-09 10:30:12', platform: 'Stripe', platformPayId: 'pi_3Qk8pL_demo', payCurrency: 'USD', payAmount: '1,000.00', status: '成功', accountCurrency: 'USD', accountAmount: '1,000.00', completedAt: '2026-08-09 10:32:18', remark: '支付成功后自动入账', ops: ['查看详情', '回调记录'] },
    { orderId: 'OR202608080009', ...customers.amount, rechargeAt: '2026-08-08 13:16:40', platform: 'PayPal', platformPayId: 'PAYID-MOCK-4091', payCurrency: 'USD', payAmount: '500.00', status: '待入账', accountCurrency: '-', accountAmount: '-', completedAt: '-', remark: '等待支付渠道确认', ops: ['查看详情', '回调记录'] },
    { orderId: 'OR202608070017', ...customers.arne, rechargeAt: '2026-08-07 09:41:33', platform: 'Stripe', platformPayId: 'cs_test_8077', payCurrency: 'EUR', payAmount: '300.00', status: '待支付', accountCurrency: '-', accountAmount: '-', completedAt: '-', remark: '客户已创建支付单，未完成支付', ops: ['查看详情'] },
    { orderId: 'OR202608060021', ...customers.demo, rechargeAt: '2026-08-06 18:03:59', platform: 'PayPal', platformPayId: 'PAYID-MOCK-6218', payCurrency: 'USD', payAmount: '200.00', status: '失败', accountCurrency: '-', accountAmount: '-', completedAt: '2026-08-06 18:05:14', remark: '支付渠道返回失败', ops: ['查看详情', '回调记录'] }
  ];

  const offlineRows = [
    { orderId: 'OT202608090006', ...customers.amount, submitAt: '2026-08-09 11:20:33', platform: 'Wise', platformPayId: 'wise_mock_9821', payCurrency: 'USD', payAmount: '1,200.00', attachment: '查看凭证', receiptFile: 'wise_mock_9821.pdf', status: '待审核', accountCurrency: '-', accountAmount: '-', auditAt: '-', auditor: '-', remark: '等待财务确认到账', ops: ['审核', '查看凭证'] },
    { orderId: 'OT202608080003', ...customers.adstest, submitAt: '2026-08-08 15:42:10', platform: 'Airwallex', platformPayId: 'awx_mock_3187', payCurrency: 'USD', payAmount: '2,000.00', attachment: '查看凭证', receiptFile: 'airwallex_mock_3187.png', status: '成功', accountCurrency: 'USD', accountAmount: '2,000.00', auditAt: '2026-08-08 16:05:22', auditor: '王荣荣(wangrongrong@bestfulfill.com)', remark: '审核通过，已入账', ops: ['查看详情', '查看凭证'] },
    { orderId: 'OT202608070012', ...customers.arne, submitAt: '2026-08-07 12:09:44', platform: 'Payoneer', platformPayId: 'payo_mock_7720', payCurrency: 'EUR', payAmount: '650.00', attachment: '查看凭证', receiptFile: 'payoneer_mock_7720.jpg', status: '失败', accountCurrency: '-', accountAmount: '-', auditAt: '2026-08-07 14:20:11', auditor: '汤秀梅(tangxiumei@bestfulfill.com)', remark: '凭证金额与到账记录不一致', ops: ['查看详情', '查看凭证'] },
    { orderId: 'OT202608060008', ...customers.demo, submitAt: '2026-08-06 15:18:07', platform: 'Wise', platformPayId: 'wise_mock_1209', payCurrency: 'EUR', payAmount: '800.00', attachment: '查看凭证', receiptFile: 'wise_mock_1209.pdf', status: '成功', accountCurrency: 'EUR', accountAmount: '800.00', auditAt: '2026-08-06 15:44:03', auditor: '管理员(admin@bestfulfill.com)', remark: 'Wise 水单审核通过', ops: ['查看详情', '查看凭证'] }
  ];

  const transactionColumns = [
    { key: 'flowId', label: '流水号', width: 170, sort: true },
    { key: 'customerId', label: '客户ID', width: 100, sort: true },
    { key: 'merchantId', label: '商户ID', width: 110, sort: true },
    { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
    { key: 'customerEmail', label: '客户邮箱', align: 'left', width: 190 },
    { key: 'time', label: '交易时间', width: 170, sort: true },
    { key: 'reason', label: '变动原因', width: 150 },
    { key: 'typeCode', label: '交易类型编码', width: 180 },
    { key: 'currency', label: '钱包币种', width: 100 },
    { key: 'changeAmount', label: '变动金额', width: 120, num: true, sort: true, format: amount },
    { key: 'beforeBalance', label: '变动前余额', width: 130, num: true, sort: true, format: plainAmount },
    { key: 'afterBalance', label: '变动后余额', width: 130, num: true, sort: true, format: plainAmount },
    { key: 'relatedOrder', label: '关联业务单号', width: 190 },
    { key: 'remark', label: '备注', align: 'left', width: 220, format: text }
  ];

  const rechargeColumns = [
    { key: 'orderId', label: '充值单号', width: 170, sort: true },
    { key: 'customerId', label: '客户ID', width: 100, sort: true },
    { key: 'merchantId', label: '商户ID', width: 110, sort: true },
    { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
    { key: 'customerEmail', label: '客户邮箱', align: 'left', width: 190 },
    { key: 'rechargeAt', label: '充值时间', width: 170, sort: true },
    { key: 'platform', label: '支付平台', width: 120 },
    { key: 'platformPayId', label: '平台支付ID', align: 'left', width: 180 },
    { key: 'payCurrency', label: '支付币种', width: 100 },
    { key: 'payAmount', label: '支付金额', width: 120, num: true, sort: true, format: plainAmount },
    { key: 'status', label: '充值状态', width: 110, format: tag },
    { key: 'accountCurrency', label: '入账币种', width: 100 },
    { key: 'accountAmount', label: '入账金额', width: 120, num: true, sort: true, format: plainAmount },
    { key: 'completedAt', label: '完成时间', width: 170, sort: true },
    { key: 'remark', label: '备注', align: 'left', width: 220, format: text }
  ];

  const offlineColumns = [
    { key: 'orderId', label: '转账单号', width: 170, sort: true },
    { key: 'customerId', label: '客户ID', width: 100, sort: true },
    { key: 'merchantId', label: '商户ID', width: 110, sort: true },
    { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
    { key: 'customerEmail', label: '客户邮箱', align: 'left', width: 190 },
    { key: 'submitAt', label: '提交时间', width: 170, sort: true },
    { key: 'platform', label: '支付平台', width: 120 },
    { key: 'platformPayId', label: '平台支付ID', align: 'left', width: 180 },
    { key: 'payCurrency', label: '支付币种', width: 100 },
    { key: 'payAmount', label: '支付金额', width: 120, num: true, sort: true, format: plainAmount },
    { key: 'attachment', label: '凭证', width: 110, format: linkLike },
    { key: 'status', label: '审核状态', width: 110, format: tag },
    { key: 'accountCurrency', label: '入账币种', width: 100 },
    { key: 'accountAmount', label: '入账金额', width: 120, num: true, sort: true, format: plainAmount },
    { key: 'auditAt', label: '审核时间', width: 170, sort: true },
    { key: 'auditor', label: '审核人', align: 'left', width: 240 },
    { key: 'remark', label: '备注', align: 'left', width: 220, format: text }
  ];

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    'transaction-detail': {
      title: '交易明细',
      filters: [{ key: 'time', label: '交易时间', type: 'date' }].concat(identityFilters, [
        { key: 'reason', label: '变动原因', type: 'select', options: ['在线充值入账', '线下转账入账', '广告账户充值', '广告账户减款退回', '广告账户清零退回', '介绍人吐点结算', '其他扣费'], placeholder: '请选择变动原因' },
        { key: 'relatedOrder', label: '关联业务单号', placeholder: '请输入关联业务单号' }
      ]),
      actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }],
      filterClass: 'cols-5',
      tableMinWidth: 2200,
      opsWidth: 120,
      columns: transactionColumns,
      rows: transactionRows
    },

    'online-recharge': {
      title: '在线充值',
      filters: [{ key: 'rechargeAt', label: '充值时间', type: 'date' }].concat(identityFilters, [
        { key: 'platform', label: '支付平台', type: 'select', options: platforms.slice(0, 2), placeholder: '请选择支付平台' },
        { key: 'status', label: '充值状态', type: 'select', options: ['待支付', '待入账', '成功', '失败', '失效'], placeholder: '请选择充值状态' },
        { key: 'platformPayId', label: '平台支付ID', placeholder: '请输入平台支付ID' }
      ]),
      actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }],
      filterClass: 'cols-5',
      tableMinWidth: 2280,
      opsWidth: 160,
      columns: rechargeColumns,
      rows: onlineRows
    },

    'offline-transfer': {
      title: '线下转账',
      filters: [{ key: 'submitAt', label: '提交时间', type: 'date' }].concat(identityFilters, [
        { key: 'platform', label: '支付平台', type: 'select', options: platforms.slice(2), placeholder: '请选择支付平台' },
        { key: 'status', label: '审核状态', type: 'select', options: ['待审核', '成功', '失败'], placeholder: '请选择审核状态' },
        { key: 'platformPayId', label: '平台支付ID', placeholder: '请输入平台支付ID' }
      ]),
      actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }],
      filterClass: 'cols-5',
      tableMinWidth: 2480,
      opsWidth: 170,
      columns: offlineColumns,
      rows: offlineRows,
      modals: {
        '审核': { type: 'offline-transfer-audit', title: '线下转账审核' },
        '查看凭证': { type: 'receipt-preview', title: '查看凭证' }
      }
    }
  });
})();
