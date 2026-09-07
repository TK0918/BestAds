/*
 * 客户返点原型配置。
 * 只注册给 admin-module-page.js 渲染；规则子页、结算审核、入账状态由 module-page 钩子更新。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const icon = name => `<i class="fas fa-${name}" aria-hidden="true"></i>`;
  const merchant = value => `<span class="merchant-id">${esc(asText(value))}</span>`;
  const money = value => {
    const text = asText(value);
    if (text === '-') return '<span class="muted">-</span>';
    const number = Number(String(text).replace(/,/g, ''));
    const cls = number > 0 ? 'amount-positive' : number < 0 ? 'amount-negative' : 'amount-zero';
    return `<span class="${cls}">${esc(text)}</span>`;
  };
  const status = value => {
    const text = asText(value);
    const cls = /启用|已完结|账户覆盖|入账成功/.test(text) ? 'status-success'
      : /停用|已作废|入账失败|休眠/.test(text) ? 'status-danger'
      : /待业务|待财务|入账中|无规则/.test(text) ? 'status-warning'
      : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const currentUser = '欧伟权';
  const accountTypes = ['Facebook-三不限', 'Facebook-企业户', 'Facebook-海外户', 'TikTok-企业户', 'Google-海外户', '绑卡户'];
  const batches = ['2026-08', '2026-07'];

  const customers = [
    { merchantId: '14656', customerName: 'test测试币种GBP', walletCurrency: 'GBP' },
    { merchantId: '14229', customerName: 'test金额变动', walletCurrency: 'USD' },
    { merchantId: '1128', customerName: 'adstest', walletCurrency: 'USD' },
    { merchantId: '13672', customerName: '品牌客户A', walletCurrency: 'USD' },
    { merchantId: '12351', customerName: '海外电商客户', walletCurrency: 'USD' }
  ];

  const bindableAccounts = {
    '14656': [
      { accountId: 'act_123456789', accountName: 'FB测试户', accountType: 'Facebook-三不限', bindStatus: '当前绑定' },
      { accountId: 'act_223344556', accountName: 'FB企业户-A', accountType: 'Facebook-企业户', bindStatus: '当前绑定' },
      { accountId: 'act_667788990', accountName: 'TT企业户-A', accountType: 'TikTok-企业户', bindStatus: '当前绑定' },
      { accountId: 'aw_556677889', accountName: 'GG海外户-A', accountType: 'Google-海外户', bindStatus: '当前绑定' },
      { accountId: 'act_888000111', accountName: '已解绑户', accountType: 'Facebook-三不限', bindStatus: '历史绑定' }
    ],
    '14229': [
      { accountId: 'act_238401982', accountName: '金额变动-FB', accountType: 'Facebook-三不限', bindStatus: '当前绑定' },
      { accountId: 'aw_983229001', accountName: '金额变动-GG', accountType: 'Google-海外户', bindStatus: '当前绑定' }
    ],
    '1128': [
      { accountId: 'act_102938475', accountName: 'adstest-FB', accountType: 'Facebook-企业户', bindStatus: '当前绑定' },
      { accountId: 'act_564738291', accountName: 'adstest-TT', accountType: 'TikTok-企业户', bindStatus: '当前绑定' }
    ],
    '13672': [
      { accountId: 'act_136720001', accountName: '品牌A-FB', accountType: 'Facebook-三不限', bindStatus: '当前绑定' }
    ],
    '12351': [
      { accountId: 'act_123510001', accountName: '海外电商-FB', accountType: 'Facebook-三不限', bindStatus: '当前绑定' }
    ]
  };

  const typeRules = [
    { id: 'TR-14656-1', merchantId: '14656', accountType: 'Facebook-三不限', rate: '2.00', startDate: '2026-07-01', endDate: '', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-07-01 10:20:12' },
    { id: 'TR-14656-2', merchantId: '14656', accountType: 'Facebook-企业户', rate: '1.50', startDate: '2026-07-01', endDate: '', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-07-01 10:21:08' },
    { id: 'TR-14656-3', merchantId: '14656', accountType: 'TikTok-企业户', rate: '2.50', startDate: '2026-08-01', endDate: '', status: '启用', updatedBy: '汤秀梅', updatedAt: '2026-08-01 09:12:44' },
    { id: 'TR-14229-1', merchantId: '14229', accountType: 'Facebook-三不限', rate: '1.20', startDate: '2026-06-01', endDate: '', status: '启用', updatedBy: '汤秀梅', updatedAt: '2026-06-01 11:04:35' },
    { id: 'TR-14229-2', merchantId: '14229', accountType: 'Google-海外户', rate: '0.80', startDate: '2026-06-01', endDate: '', status: '启用', updatedBy: '汤秀梅', updatedAt: '2026-06-01 11:05:02' },
    { id: 'TR-1128-1', merchantId: '1128', accountType: 'Facebook-企业户', rate: '1.00', startDate: '2026-05-01', endDate: '', status: '启用', updatedBy: '管理员', updatedAt: '2026-05-12 16:08:20' }
  ];

  const accountOverrides = [
    { id: 'AO-14656-1', merchantId: '14656', accountId: 'act_123456789', accountName: 'FB测试户', accountType: 'Facebook-三不限', bindStatus: '当前绑定', rate: '3.00', startDate: '2026-08-01', endDate: '', status: '启用', calcStatus: '生效中', updatedBy: '欧伟权', updatedAt: '2026-08-01 14:22:10' },
    { id: 'AO-14656-2', merchantId: '14656', accountId: 'act_888000111', accountName: '已解绑户', accountType: 'Facebook-三不限', bindStatus: '历史绑定', rate: '4.00', startDate: '2026-05-01', endDate: '2026-07-31', status: '停用', calcStatus: '休眠中', updatedBy: '欧伟权', updatedAt: '2026-08-02 09:18:33' },
    { id: 'AO-1128-1', merchantId: '1128', accountId: 'act_564738291', accountName: 'adstest-TT', accountType: 'TikTok-企业户', bindStatus: '当前绑定', rate: '1.80', startDate: '2026-08-01', endDate: '', status: '启用', calcStatus: '生效中', updatedBy: '管理员', updatedAt: '2026-08-03 11:50:34' }
  ];

  const settlements = [
    {
      orderId: 'CR20260814656001', merchantId: '14656', customerName: 'test测试币种GBP', period: '2026-08',
      accountCount: '3', spendTotal: '48,620.00', rebateAmount: '1,142.40', status: '待业务', trigger: '手动',
      remark: '-', bizApprover: '-', financeApprover: '-', createdAt: '2026-09-15 10:08:00',
      ops: ['详情', '业务审核']
    },
    {
      orderId: 'CR20260814229001', merchantId: '14229', customerName: 'test金额变动', period: '2026-08',
      accountCount: '2', spendTotal: '31,250.00', rebateAmount: '340.00', status: '待财务', trigger: '手动',
      remark: '业务已核对消耗归属', bizApprover: '汤秀梅', financeApprover: '-', createdAt: '2026-09-15 10:12:22',
      ops: ['详情', '财务审核']
    },
    {
      orderId: 'CR20260813672001', merchantId: '13672', customerName: '品牌客户A', period: '2026-08',
      accountCount: '1', spendTotal: '8,400.00', rebateAmount: '168.00', status: '待财务', trigger: '手动',
      remark: '业务已通过', bizApprover: '欧伟权', financeApprover: '-', createdAt: '2026-09-15 11:02:18',
      ops: ['详情', '财务审核']
    },
    {
      orderId: 'CR20260811280001', merchantId: '1128', customerName: 'adstest', period: '2026-08',
      accountCount: '2', spendTotal: '12,180.00', rebateAmount: '140.04', status: '入账失败', trigger: '手动',
      remark: 'Fund 超时，可按结算单重试', bizApprover: '汤秀梅', financeApprover: '王荣荣', createdAt: '2026-09-15 09:40:11',
      ops: ['详情', '重试入账']
    },
    {
      orderId: 'CR20260714656001', merchantId: '14656', customerName: 'test测试币种GBP', period: '2026-07',
      accountCount: '2', spendTotal: '36,800.00', rebateAmount: '736.00', status: '已完结', trigger: '手动',
      remark: '已入账钱包', bizApprover: '汤秀梅', financeApprover: '王荣荣', createdAt: '2026-08-16 10:05:44',
      ops: ['详情']
    },
    {
      orderId: 'CR20260714229001', merchantId: '14229', customerName: 'test金额变动', period: '2026-07',
      accountCount: '2', spendTotal: '22,100.00', rebateAmount: '240.80', status: '已作废', trigger: '手动',
      remark: '业务驳回：7 月绑定切片需修正后重跑', bizApprover: '欧伟权', financeApprover: '-', createdAt: '2026-08-16 10:18:09',
      ops: ['详情']
    }
  ];

  const settlementDetails = {
    CR20260814656001: [
      { accountId: 'act_123456789', accountName: 'FB测试户', accountType: 'Facebook-三不限', source: '账户覆盖', rate: '3.00', startDate: '2026-08-01', endDate: '2026-08-31', spend: '12,400.00', rebate: '372.00' },
      { accountId: 'act_223344556', accountName: 'FB企业户-A', accountType: 'Facebook-企业户', source: '类型规则', rate: '1.50', startDate: '2026-08-01', endDate: '2026-08-31', spend: '18,220.00', rebate: '273.30' },
      { accountId: 'act_667788990', accountName: 'TT企业户-A', accountType: 'TikTok-企业户', source: '类型规则', rate: '2.50', startDate: '2026-08-01', endDate: '2026-08-31', spend: '18,000.00', rebate: '450.00' }
    ],
    CR20260814229001: [
      { accountId: 'act_238401982', accountName: '金额变动-FB', accountType: 'Facebook-三不限', source: '类型规则', rate: '1.20', startDate: '2026-08-01', endDate: '2026-08-31', spend: '20,000.00', rebate: '240.00' },
      { accountId: 'aw_983229001', accountName: '金额变动-GG', accountType: 'Google-海外户', source: '类型规则', rate: '0.80', startDate: '2026-08-01', endDate: '2026-08-31', spend: '12,500.00', rebate: '100.00' }
    ],
    CR20260813672001: [
      { accountId: 'act_136720001', accountName: '品牌A-FB', accountType: 'Facebook-三不限', source: '类型规则', rate: '2.00', startDate: '2026-08-01', endDate: '2026-08-31', spend: '8,400.00', rebate: '168.00' }
    ],
    CR20260811280001: [
      { accountId: 'act_102938475', accountName: 'adstest-FB', accountType: 'Facebook-企业户', source: '类型规则', rate: '1.00', startDate: '2026-08-01', endDate: '2026-08-31', spend: '9,180.00', rebate: '91.80' },
      { accountId: 'act_564738291', accountName: 'adstest-TT', accountType: 'TikTok-企业户', source: '账户覆盖', rate: '1.80', startDate: '2026-08-01', endDate: '2026-08-31', spend: '3,000.00', rebate: '54.00' }
    ],
    CR20260714656001: [
      { accountId: 'act_123456789', accountName: 'FB测试户', accountType: 'Facebook-三不限', source: '类型规则', rate: '2.00', startDate: '2026-07-01', endDate: '2026-07-31', spend: '20,000.00', rebate: '400.00' },
      { accountId: 'act_223344556', accountName: 'FB企业户-A', accountType: 'Facebook-企业户', source: '类型规则', rate: '1.50', startDate: '2026-07-01', endDate: '2026-07-31', spend: '16,800.00', rebate: '252.00' }
    ],
    CR20260714229001: [
      { accountId: 'act_238401982', accountName: '金额变动-FB', accountType: 'Facebook-三不限', source: '类型规则', rate: '1.20', startDate: '2026-07-01', endDate: '2026-07-31', spend: '14,000.00', rebate: '168.00' },
      { accountId: 'aw_983229001', accountName: '金额变动-GG', accountType: 'Google-海外户', source: '类型规则', rate: '0.80', startDate: '2026-07-01', endDate: '2026-07-31', spend: '8,100.00', rebate: '64.80' }
    ]
  };

  function customerOf(merchantId) {
    return customers.find(item => item.merchantId === merchantId) || { merchantId, customerName: '-', walletCurrency: 'USD' };
  }

  function enabledTypeCount(merchantId) {
    return typeRules.filter(item => item.merchantId === merchantId && item.status === '启用').length;
  }

  function overrideCount(merchantId) {
    return accountOverrides.filter(item => item.merchantId === merchantId).length;
  }

  function latestUpdate(merchantId) {
    const times = typeRules.concat(accountOverrides)
      .filter(item => item.merchantId === merchantId)
      .map(item => item.updatedAt)
      .sort()
      .reverse();
    return times[0] || '-';
  }

  function gapTypes(merchantId) {
    const boundTypes = [...new Set((bindableAccounts[merchantId] || []).filter(item => item.bindStatus === '当前绑定').map(item => item.accountType))];
    const covered = new Set(typeRules.filter(item => item.merchantId === merchantId && item.status === '启用').map(item => item.accountType));
    const overriddenTypes = new Set(accountOverrides.filter(item => item.merchantId === merchantId && item.status === '启用' && item.calcStatus === '生效中').map(item => item.accountType));
    return boundTypes.filter(type => !covered.has(type) && !overriddenTypes.has(type));
  }

  function syncMerchantRows(rows) {
    rows.forEach(row => {
      row.typeRuleCount = String(enabledTypeCount(row.merchantId));
      row.overrideCount = String(overrideCount(row.merchantId));
      row.updatedAt = latestUpdate(row.merchantId);
      row.ops = ['规则配置'];
    });
    return rows;
  }

  const merchantRows = syncMerchantRows(customers.map(item => ({
    merchantId: item.merchantId,
    customerName: item.customerName,
    walletCurrency: item.walletCurrency,
    typeRuleCount: '0',
    overrideCount: '0',
    updatedAt: '-',
    ops: ['规则配置']
  })));

  function periodLabel(startDate, endDate) {
    return `${startDate || '-'} ~ ${endDate || '长期'}`;
  }

  function settlementOps(row) {
    if (row.status === '待业务') return ['详情', '业务审核'];
    if (row.status === '待财务') return ['详情', '财务审核'];
    if (row.status === '入账失败') return ['详情', '重试入账'];
    return ['详情'];
  }

  function nowStamp() {
    const now = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  }

  function overlap(aStart, aEnd, bStart, bEnd) {
    const startA = aStart || '0000-01-01';
    const endA = aEnd || '9999-12-31';
    const startB = bStart || '0000-01-01';
    const endB = bEnd || '9999-12-31';
    return startA <= endB && startB <= endA;
  }

  function tableHtml(columns, rows, actionAttr) {
    const headers = columns.map(column => `<th class="${column.num ? 'num' : ''} ${column.align === 'left' ? 'left' : ''}">${esc(column.label)}</th>`).join('');
    const body = rows.length ? rows.map(row => {
      const cells = columns.map(column => {
        const raw = row[column.key];
        const rendered = column.format ? column.format(raw, row) : esc(asText(raw));
        return `<td class="${column.num ? 'num' : ''} ${column.align === 'left' ? 'left' : ''}">${rendered}</td>`;
      }).join('');
      const ops = (row.ops || []).map(op => `<button type="button" class="btn btn-link op-link ${/停用/.test(op) ? 'op-link--danger' : 'op-link--info'}" ${actionAttr}="${esc(op)}" data-rebate-id="${esc(row.id)}">${esc(op)}</button>`).join('');
      return `<tr>${cells}<td class="ops"><div class="command-group">${ops}</div></td></tr>`;
    }).join('') : `<tr><td class="empty-state" colspan="${columns.length + 1}">暂无数据</td></tr>`;
    return `<div class="table-scroll"><table class="admin-table admin-table--fixed"><thead><tr>${headers}<th class="ops">操作</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function merchantDetailHtml(merchantId, navHtml) {
    const customer = customerOf(merchantId);
    const typeRows = typeRules.filter(item => item.merchantId === merchantId).map(item => ({
      ...item,
      period: periodLabel(item.startDate, item.endDate),
      ops: item.status === '启用' ? ['编辑', '停用'] : ['编辑', '启用']
    }));
    const overrideRows = accountOverrides.filter(item => item.merchantId === merchantId).map(item => ({
      ...item,
      period: periodLabel(item.startDate, item.endDate),
      ops: item.status === '启用' ? ['编辑', '停用'] : ['编辑', '启用']
    }));
    const gaps = gapTypes(merchantId);
    const gapNotice = gaps.length
      ? `<div class="notice">当前绑定账户中，以下账户类型没有启用中的类型规则，也没有生效中的账户覆盖：<strong>${esc(gaps.join('、'))}</strong>。结算时这些账户当天比例为 0。</div>`
      : `<div class="notice">当前绑定账户的账户类型均已覆盖。改规则不会回算已完结月份。</div>`;
    const typeColumns = [
      { key: 'accountType', label: '账户类型', align: 'left' },
      { key: 'rate', label: '返点(%)', num: true },
      { key: 'period', label: '生效时间' },
      { key: 'status', label: '状态', format: status },
      { key: 'updatedBy', label: '更新人' },
      { key: 'updatedAt', label: '更新时间' }
    ];
    const overrideColumns = [
      { key: 'accountId', label: '广告账户ID', align: 'left' },
      { key: 'accountName', label: '广告账户名称', align: 'left' },
      { key: 'accountType', label: '账户类型', align: 'left' },
      { key: 'bindStatus', label: '绑定来源' },
      { key: 'rate', label: '返点(%)', num: true },
      { key: 'period', label: '生效时间' },
      { key: 'status', label: '配置状态', format: status },
      { key: 'calcStatus', label: '计算状态', format: status },
      { key: 'updatedAt', label: '更新时间' }
    ];
    return `<div class="admin-page module-page">${navHtml}
      <section class="admin-card"><div class="admin-card__header"><div class="command-bar command-bar--split"><div class="command-group command-group--primary"><button type="button" class="btn btn-default" data-rebate-back>${icon('arrow-left')}返回商户列表</button></div></div></div>
      <div class="admin-card__body"><p>商户ID ${merchant(customer.merchantId)}　客户名称 ${esc(customer.customerName)}　钱包币种 ${esc(customer.walletCurrency)}</p>${gapNotice}</div></section>
      <section class="admin-card list-card"><div class="admin-card__header"><div class="command-bar command-bar--split"><div class="command-group command-group--primary"><strong>类型规则</strong></div><div class="command-group command-group--secondary"><button type="button" class="btn btn-primary" data-rebate-add-type>${icon('plus')}新增类型规则</button></div></div></div>${tableHtml(typeColumns, typeRows, 'data-rebate-type-action')}</section>
      <section class="admin-card list-card"><div class="admin-card__header"><div class="command-bar command-bar--split"><div class="command-group command-group--primary"><strong>账户覆盖</strong></div><div class="command-group command-group--secondary"><button type="button" class="btn btn-default" data-rebate-add-override>${icon('plus')}新增账户覆盖</button></div></div></div>${tableHtml(overrideColumns, overrideRows, 'data-rebate-override-action')}</section>
    </div>`;
  }

  function typeRuleModalHtml(row, merchantId) {
    const isEdit = Boolean(row);
    const value = row || { merchantId, accountType: accountTypes[0], rate: '', startDate: '', endDate: '', status: '启用' };
    return `<div class="modal-backdrop" data-rebate-type-modal data-rebate-id="${esc(row?.id || '')}"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${isEdit ? '编辑类型规则' : '新增类型规则'}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">同商户同账户类型的启用段不可重叠。结束日期留空表示长期。</div><div class="form-grid">
      <div class="form-field"><label>账户类型 <span style="color:var(--admin-danger)">*</span></label><select name="accountType">${accountTypes.map(item => `<option value="${esc(item)}"${item === value.accountType ? ' selected' : ''}>${esc(item)}</option>`).join('')}</select></div>
      <div class="form-field"><label>返点比例(%) <span style="color:var(--admin-danger)">*</span></label><input name="rate" inputmode="decimal" placeholder="例如 2.00" value="${esc(value.rate || '')}"></div>
      <div class="form-field"><label>生效开始日期 <span style="color:var(--admin-danger)">*</span></label><input name="startDate" type="date" value="${esc(value.startDate || '')}"></div>
      <div class="form-field"><label>生效结束日期</label><input name="endDate" type="date" value="${esc(value.endDate || '')}"></div>
      <div class="form-field"><label>状态 <span style="color:var(--admin-danger)">*</span></label><select name="status"><option value="启用"${value.status === '启用' ? ' selected' : ''}>启用</option><option value="停用"${value.status === '停用' ? ' selected' : ''}>停用</option></select></div>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>保存</button></div></section></div>`;
  }

  function overrideModalHtml(row, merchantId) {
    const isEdit = Boolean(row);
    const accounts = bindableAccounts[merchantId] || [];
    const configured = new Set(accountOverrides.filter(item => item.merchantId === merchantId && (!row || item.id !== row.id)).map(item => item.accountId));
    const options = isEdit ? accounts : accounts.filter(item => !configured.has(item.accountId));
    const value = row || { accountId: options[0]?.accountId || '', rate: '', startDate: '', endDate: '', status: '启用' };
    const accountOptions = options.length
      ? options.map(item => `<option value="${esc(item.accountId)}"${item.accountId === value.accountId ? ' selected' : ''}>${esc(item.accountId)} / ${esc(item.accountName)}（${esc(item.accountType)} · ${esc(item.bindStatus)}）</option>`).join('')
      : '<option value="">当前没有可新增覆盖的账户</option>';
    return `<div class="modal-backdrop" data-rebate-override-modal data-rebate-id="${esc(row?.id || '')}"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${isEdit ? '编辑账户覆盖' : '新增账户覆盖'}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">账户覆盖优先于类型规则。已解绑账户可保留配置，但计算状态为休眠，不参与结算。</div><div class="form-grid">
      <div class="form-field full"><label>广告账户 <span style="color:var(--admin-danger)">*</span></label><select name="accountId"${isEdit ? ' disabled' : ''}>${accountOptions}</select></div>
      <div class="form-field"><label>返点比例(%) <span style="color:var(--admin-danger)">*</span></label><input name="rate" inputmode="decimal" placeholder="例如 3.00" value="${esc(value.rate || '')}"></div>
      <div class="form-field"><label>生效开始日期 <span style="color:var(--admin-danger)">*</span></label><input name="startDate" type="date" value="${esc(value.startDate || '')}"></div>
      <div class="form-field"><label>生效结束日期</label><input name="endDate" type="date" value="${esc(value.endDate || '')}"></div>
      <div class="form-field"><label>状态 <span style="color:var(--admin-danger)">*</span></label><select name="status"><option value="启用"${value.status === '启用' ? ' selected' : ''}>启用</option><option value="停用"${value.status === '停用' ? ' selected' : ''}>停用</option></select></div>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>保存</button></div></section></div>`;
  }

  function triggerModalHtml() {
    const merchantOptions = customers.map(item => `<label class="multi-select-option"><input type="checkbox" data-multiselect-option value="${esc(item.merchantId)}"><span>${esc(item.merchantId)} / ${esc(item.customerName)}</span></label>`).join('');
    const batchOptions = batches.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('');
    return `<div class="modal-backdrop" data-rebate-trigger-modal><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">手动发起结算</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">一期仅支持手动发起。已存在待业务、待财务、入账失败或已完结的「商户 × 月份」不可再发；已作废可重跑。草案按生成时的消耗和规则快照冻结。</div><div class="form-grid">
      <div class="form-field full"><label>商户 <span style="color:var(--admin-danger)">*</span></label><div class="form-multiselect" data-multiselect data-placeholder="请选择商户"><input type="hidden" name="merchantIds" value=""><button type="button" class="multi-select-trigger" data-multiselect-toggle><span data-multiselect-label>请选择商户</span>${icon('chevron-down')}</button><div class="multi-select-menu" data-multiselect-menu>${merchantOptions}</div></div></div>
      <div class="form-field"><label>结算月份 <span style="color:var(--admin-danger)">*</span></label><select name="period"><option value="">请选择</option>${batchOptions}</select></div>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>发起结算</button></div></section></div>`;
  }

  function auditModalHtml(row, kind) {
    const title = kind === 'biz' ? '业务审核' : '财务审核';
    return `<div class="modal-backdrop" data-rebate-audit-modal data-rebate-audit="${esc(kind)}"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">结算单 ${esc(row.orderId)}，返点金额 ${esc(row.rebateAmount)} USD。列表不能改金额；驳回后须修正规则/绑定/消耗再重跑。</div><div class="form-grid">
      <div class="form-field"><label>审核结果 <span style="color:var(--admin-danger)">*</span></label><select name="decision"><option value="通过">通过</option><option value="驳回">驳回</option></select></div>
      <div class="form-field full"><label>备注</label><textarea name="remark" placeholder="驳回时必填"></textarea></div>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>提交</button></div></section></div>`;
  }

  function settlementDetailHtml(row) {
    const details = settlementDetails[row.orderId] || [];
    const body = details.length ? details.map(item => `<tr>
      <td class="left">${esc(item.accountId)}</td>
      <td class="left">${esc(item.accountName)}</td>
      <td class="left">${esc(item.accountType)}</td>
      <td>${status(item.source)}</td>
      <td class="num">${esc(item.rate)}</td>
      <td>${esc(item.startDate)} ~ ${esc(item.endDate)}</td>
      <td class="num">${money(item.spend)}</td>
      <td class="num">${money(item.rebate)}</td>
    </tr>`).join('') : `<tr><td class="empty-state" colspan="8">暂无分段明细</td></tr>`;
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">结算单详情</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body">
      <dl class="detail-grid">
        <div><dt>结算单号</dt><dd>${esc(row.orderId)}</dd></div>
        <div><dt>商户ID</dt><dd>${esc(row.merchantId)}</dd></div>
        <div><dt>客户名称</dt><dd>${esc(row.customerName)}</dd></div>
        <div><dt>结算月份</dt><dd>${esc(row.period)}</dd></div>
        <div><dt>消耗总额</dt><dd>${esc(row.spendTotal)} USD</dd></div>
        <div><dt>返点金额</dt><dd>${esc(row.rebateAmount)} USD</dd></div>
        <div><dt>状态</dt><dd>${status(row.status)}</dd></div>
        <div><dt>触发方式</dt><dd>${esc(row.trigger)}</dd></div>
        <div><dt>业务审核人</dt><dd>${esc(row.bizApprover || '-')}</dd></div>
        <div><dt>财务审核人</dt><dd>${esc(row.financeApprover || '-')}</dd></div>
        <div><dt>备注</dt><dd>${esc(row.remark || '-')}</dd></div>
      </dl>
      <div class="table-scroll" style="margin-top:12px"><table class="admin-table admin-table--fixed"><thead><tr><th class="left">广告账户ID</th><th class="left">广告账户名称</th><th class="left">账户类型</th><th>比例来源</th><th class="num">命中比例(%)</th><th>时间段</th><th class="num">消耗小计</th><th class="num">返点小计</th></tr></thead><tbody>${body}</tbody></table></div>
    </div><div class="modal__footer"><button type="button" class="btn btn-default" data-rebate-download-csv data-rebate-order="${esc(row.orderId)}">下载明细 CSV</button><button type="button" class="btn btn-primary" data-modal-close>关闭</button></div></section></div>`;
  }

  function validRate(value) {
    const amount = Number(value);
    return Number.isFinite(amount) && amount >= 0 && amount <= 100;
  }

  function formatRate(value) {
    return Number(value).toFixed(2);
  }

  function saveTypeRule(merchantId, payload) {
    if (!payload.accountType || !payload.startDate) return { ok: false, message: '请完整填写账户类型和开始日期' };
    if (!validRate(payload.rate)) return { ok: false, message: '返点比例须为 0 到 100 的数字，最多 2 位小数' };
    if (payload.endDate && payload.endDate < payload.startDate) return { ok: false, message: '结束日期不能早于开始日期' };
    const conflict = typeRules.some(item => item.merchantId === merchantId
      && item.accountType === payload.accountType
      && item.status === '启用'
      && payload.status === '启用'
      && item.id !== payload.id
      && overlap(item.startDate, item.endDate, payload.startDate, payload.endDate));
    if (conflict) return { ok: false, message: '同商户同账户类型的启用段不可重叠' };
    const stamp = nowStamp();
    if (payload.id) {
      const target = typeRules.find(item => item.id === payload.id);
      if (!target) return { ok: false, message: '未找到类型规则' };
      Object.assign(target, payload, { rate: formatRate(payload.rate), updatedBy: currentUser, updatedAt: stamp });
    } else {
      typeRules.push({
        id: `TR-${merchantId}-${Date.now()}`,
        merchantId,
        accountType: payload.accountType,
        rate: formatRate(payload.rate),
        startDate: payload.startDate,
        endDate: payload.endDate || '',
        status: payload.status,
        updatedBy: currentUser,
        updatedAt: stamp
      });
    }
    syncMerchantRows(merchantRows);
    return { ok: true };
  }

  function saveOverride(merchantId, payload) {
    if (!payload.accountId || !payload.startDate) return { ok: false, message: '请选择广告账户并填写开始日期' };
    if (!validRate(payload.rate)) return { ok: false, message: '返点比例须为 0 到 100 的数字，最多 2 位小数' };
    if (payload.endDate && payload.endDate < payload.startDate) return { ok: false, message: '结束日期不能早于开始日期' };
    const account = (bindableAccounts[merchantId] || []).find(item => item.accountId === payload.accountId);
    if (!account) return { ok: false, message: '未找到广告账户' };
    const conflict = accountOverrides.some(item => item.merchantId === merchantId
      && item.accountId === payload.accountId
      && item.status === '启用'
      && payload.status === '启用'
      && item.id !== payload.id
      && overlap(item.startDate, item.endDate, payload.startDate, payload.endDate));
    if (conflict) return { ok: false, message: '同一广告账户的启用覆盖段不可重叠' };
    const stamp = nowStamp();
    const calcStatus = account.bindStatus === '历史绑定' ? '休眠中' : (payload.status === '启用' ? '生效中' : '休眠中');
    if (payload.id) {
      const target = accountOverrides.find(item => item.id === payload.id);
      if (!target) return { ok: false, message: '未找到账户覆盖' };
      Object.assign(target, {
        rate: formatRate(payload.rate),
        startDate: payload.startDate,
        endDate: payload.endDate || '',
        status: payload.status,
        calcStatus,
        updatedBy: currentUser,
        updatedAt: stamp
      });
    } else {
      accountOverrides.push({
        id: `AO-${merchantId}-${Date.now()}`,
        merchantId,
        accountId: account.accountId,
        accountName: account.accountName,
        accountType: account.accountType,
        bindStatus: account.bindStatus,
        rate: formatRate(payload.rate),
        startDate: payload.startDate,
        endDate: payload.endDate || '',
        status: payload.status,
        calcStatus,
        updatedBy: currentUser,
        updatedAt: stamp
      });
    }
    syncMerchantRows(merchantRows);
    return { ok: true };
  }

  function toggleRule(kind, id, nextStatus) {
    const list = kind === 'type' ? typeRules : accountOverrides;
    const target = list.find(item => item.id === id);
    if (!target) return { ok: false, message: '未找到规则' };
    if (nextStatus === '启用' && kind === 'type') {
      const conflict = typeRules.some(item => item !== target && item.merchantId === target.merchantId && item.accountType === target.accountType && item.status === '启用' && overlap(item.startDate, item.endDate, target.startDate, target.endDate));
      if (conflict) return { ok: false, message: '同商户同账户类型的启用段不可重叠' };
    }
    if (nextStatus === '启用' && kind === 'override') {
      const conflict = accountOverrides.some(item => item !== target && item.merchantId === target.merchantId && item.accountId === target.accountId && item.status === '启用' && overlap(item.startDate, item.endDate, target.startDate, target.endDate));
      if (conflict) return { ok: false, message: '同一广告账户的启用覆盖段不可重叠' };
    }
    target.status = nextStatus;
    if (kind === 'override') target.calcStatus = target.bindStatus === '历史绑定' || nextStatus === '停用' ? '休眠中' : '生效中';
    target.updatedBy = currentUser;
    target.updatedAt = nowStamp();
    syncMerchantRows(merchantRows);
    return { ok: true };
  }

  function blockedTrigger(merchantId, period) {
    return settlements.some(item => item.merchantId === merchantId && item.period === period && /待业务|待财务|入账失败|已完结/.test(item.status));
  }

  function triggerSettlement(merchantIds, period) {
    if (!merchantIds.length) return { ok: false, message: '请至少选择 1 个商户' };
    if (!period) return { ok: false, message: '请选择结算月份' };
    const blocked = merchantIds.filter(id => blockedTrigger(id, period));
    const allowed = merchantIds.filter(id => !blockedTrigger(id, period));
    if (!allowed.length) return { ok: false, message: `以下商户该月不可再发起：${blocked.join('、')}` };
    allowed.forEach(merchantId => {
      const customer = customerOf(merchantId);
      const existingCancelled = settlements.find(item => item.merchantId === merchantId && item.period === period && item.status === '已作废');
      const orderId = existingCancelled ? `${existingCancelled.orderId.replace(/\d{3}$/, '')}${String(Date.now()).slice(-3)}` : `CR${period.replace('-', '')}${merchantId}001`;
      const spend = merchantId === '12351' ? '6,000.00' : '9,800.00';
      const rebate = merchantId === '12351' ? '120.00' : '196.00';
      const row = {
        orderId,
        merchantId,
        customerName: customer.customerName,
        period,
        accountCount: String((bindableAccounts[merchantId] || []).filter(item => item.bindStatus === '当前绑定').length || 1),
        spendTotal: spend,
        rebateAmount: rebate,
        status: '待业务',
        trigger: '手动',
        remark: '-',
        bizApprover: '-',
        financeApprover: '-',
        createdAt: nowStamp(),
        ops: ['详情', '业务审核']
      };
      settlements.unshift(row);
      settlementDetails[orderId] = (bindableAccounts[merchantId] || []).filter(item => item.bindStatus === '当前绑定').slice(0, 2).map(item => ({
        accountId: item.accountId,
        accountName: item.accountName,
        accountType: item.accountType,
        source: '类型规则',
        rate: '2.00',
        startDate: `${period}-01`,
        endDate: period === '2026-08' ? '2026-08-31' : '2026-07-31',
        spend: '4,900.00',
        rebate: '98.00'
      }));
    });
    const message = blocked.length
      ? `已发起 ${allowed.length} 张草案；以下商户该月不可再发起：${blocked.join('、')}`
      : `已发起 ${allowed.length} 张结算草案`;
    return { ok: true, message };
  }

  function applyAudit(row, kind, decision, remark) {
    if (!row) return { ok: false, message: '未找到结算单' };
    if (decision === '驳回' && !String(remark || '').trim()) return { ok: false, message: '驳回时备注必填' };
    if (kind === 'biz' && row.status !== '待业务') return { ok: false, message: '仅待业务的结算单可做业务审核' };
    if (kind === 'finance' && row.status !== '待财务') return { ok: false, message: '仅待财务的结算单可做财务审核' };
    if (kind === 'finance' && row.bizApprover === currentUser) return { ok: false, message: '同一账号不能自审自批' };
    if (decision === '驳回') {
      row.status = '已作废';
      row.remark = remark;
      if (kind === 'biz') row.bizApprover = currentUser;
      else row.financeApprover = currentUser;
      row.ops = settlementOps(row);
      return { ok: true, message: '已驳回并作废，修正源数据后可重跑' };
    }
    if (kind === 'biz') {
      row.status = '待财务';
      row.bizApprover = currentUser;
      row.remark = remark || '业务已通过';
      row.ops = settlementOps(row);
      return { ok: true, message: '业务审核已通过，进入待财务' };
    }
    row.status = '已完结';
    row.financeApprover = currentUser;
    row.remark = remark || '财务已通过，已入账钱包';
    row.ops = settlementOps(row);
    return { ok: true, message: '财务审核已通过，已入账客户钱包' };
  }

  function retryPosting(row) {
    if (!row || row.status !== '入账失败') return { ok: false, message: '仅入账失败的结算单可重试' };
    row.status = '已完结';
    row.remark = '重试入账成功';
    row.ops = settlementOps(row);
    return { ok: true, message: '已按结算单幂等重试入账成功' };
  }

  function batchBizApprove(rows) {
    const targets = rows.filter(item => item.status === '待业务');
    if (!targets.length) return { ok: false, message: '请勾选待业务的结算单' };
    targets.forEach(row => {
      row.status = '待财务';
      row.bizApprover = currentUser;
      row.remark = '批量业务通过';
      row.ops = settlementOps(row);
    });
    return { ok: true, message: `已批量业务通过 ${targets.length} 张结算单` };
  }

  function downloadCsv(orderId) {
    const details = settlementDetails[orderId] || [];
    const header = ['广告账户ID', '广告账户名称', '账户类型', '比例来源', '命中比例(%)', '开始日期', '结束日期', '消耗小计', '返点小计'];
    const lines = details.map(item => [item.accountId, item.accountName, item.accountType, item.source, item.rate, item.startDate, item.endDate, item.spend, item.rebate].join(','));
    const csv = `\ufeff${header.join(',')}\n${lines.join('\n')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${orderId}-details.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  window.BESTADS_CUSTOMER_REBATE = {
    currentUser,
    merchantRows,
    settlements,
    typeRules,
    accountOverrides,
    customerOf,
    merchantDetailHtml,
    typeRuleModalHtml,
    overrideModalHtml,
    triggerModalHtml,
    auditModalHtml,
    settlementDetailHtml,
    saveTypeRule,
    saveOverride,
    toggleRule,
    triggerSettlement,
    applyAudit,
    retryPosting,
    batchBizApprove,
    downloadCsv,
    findType: id => typeRules.find(item => item.id === id),
    findOverride: id => accountOverrides.find(item => item.id === id)
  };

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    'customer-rebate': {
      title: '客户返点',
      subtitle: '按商户维护返点规则，并按自然月生成结算草案。',
      customerRebate: true,
      tabs: [
        {
          id: 'rules',
          label: '返点规则',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }
          ],
          actions: [],
          filterClass: 'filter-grid--four',
          tableClass: 'admin-table--fixed',
          tableMinWidth: 1080,
          opsWidth: 120,
          footerNote: '点击「规则配置」进入该商户的类型规则和账户覆盖。现网「返点配置 → 客户返点」为旧配置，不再作为结算主数据。',
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant, width: 120 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 220 },
            { key: 'typeRuleCount', label: '启用中的类型规则', num: true, width: 160 },
            { key: 'overrideCount', label: '账户覆盖数', num: true, width: 140 },
            { key: 'updatedAt', label: '最近更新时间', width: 180 }
          ],
          rows: merchantRows
        },
        {
          id: 'settlement',
          label: '返点结算',
          selectable: true,
          filters: [
            { key: 'orderId', label: '结算单号', placeholder: '请输入结算单号' },
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'period', label: '结算月份', type: 'select', options: batches },
            { key: 'status', label: '状态', type: 'select', options: ['待业务', '待财务', '入账失败', '已完结', '已作废'] }
          ],
          actions: [
            { id: 'trigger-settlement', label: '手动发起结算', icon: 'play', primary: true },
            { id: 'batch-biz-approve', label: '批量业务通过', icon: 'check', requiresSelection: true }
          ],
          filterClass: 'cols-5',
          tableClass: 'admin-table--fixed',
          tableMinWidth: 1680,
          opsWidth: 180,
          footerNote: '财务通过后系统自动入账客户钱包，交易类型 CUSTOMER_REBATE。已完结不回算。同一结算单禁止自审自批。',
          columns: [
            { key: 'orderId', label: '结算单号', width: 180 },
            { key: 'merchantId', label: '商户ID', format: merchant, width: 110 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'period', label: '结算月份', width: 110 },
            { key: 'accountCount', label: '涉及账户数', num: true, width: 110 },
            { key: 'spendTotal', label: '消耗总额', num: true, format: money, width: 130 },
            { key: 'rebateAmount', label: '返点金额', num: true, format: money, width: 130 },
            { key: 'status', label: '状态', format: status, width: 110 },
            { key: 'trigger', label: '触发方式', width: 100 },
            { key: 'remark', label: '备注', align: 'left', width: 220 }
          ],
          rows: settlements
        }
      ]
    }
  });
})();
