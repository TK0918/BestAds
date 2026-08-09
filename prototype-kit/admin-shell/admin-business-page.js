/*
 * BestAds 运营端业务管理模块配置。
 * 字段、按钮、样例数据按 2026-08-09 测试环境只读抽取：
 * FB: /account, /apply-account, /account-assign, /account-recharge, /account-subtraction, /account-clear, /service-fee-config
 * GG: /gg-account, /gg-account-assign, /gg-account-recharge, /gg-account-subtraction, /gg-account-clear, /gg-service-fee-config
 * TT: /tt-account, /tt-account-assign, /tt-account-recharge, /tt-account-subtraction, /tt-account-clear, /tt-service-fee-config
 * Other: /other-media-account, /other-media-account-assign, /other-media-account-recharge, /other-media-account-clear, /other-media-service-fee-config
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const tag = value => {
    const text = String(value || '-');
    const cls = /完成|成功|启用|活跃/.test(text) ? 'status-success' : /失败|停用|关闭|已关闭|取消/.test(text) ? 'status-danger' : /待|处理中/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const amount = value => `<span class="amount-zero">${esc(value == null || value === '' ? '-' : value)}</span>`;
  const person = value => `<span class="person-cell">${esc(value || '-')}</span>`;
  const text = value => `<span class="wrap">${esc(value || '-')}</span>`;

  const dateRange = label => ({ key: 'date', label, type: 'date', placeholder: '开始时间' });
  const select = (key, label, options, placeholder = '请选择') => ({ key, label, type: 'select', options, placeholder });
  const input = (key, label, placeholder) => ({ key, label, placeholder });

  const statusOptions = ['活跃', '停用', '已关闭'];
  const orderStatusOptions = ['待处理', '处理中', '完成', '失败', '人工取消'];
  const yesNo = ['是', '否'];
  const agents = ['Madhouse', 'Gimc', 'Rockads', 'Panda', 'Wezonet', 'MeetSocial', 'it-test'];
  const currencies = ['USD', 'EUR', 'GBP', 'HKD'];
  const mediaOptions = ['Taboola', 'Applovin', 'Snapchat', 'Outbrain', 'X'];
  const owners = {
    bdZhang: '张三(zhangsan@bestfulfill.com)',
    bdWang: '王五(wangwu@bestfulfill.com)',
    bdQian: '钱七(qianqi@bestfulfill.com)',
    amLi: '李四(lisi@bestfulfill.com)',
    amZhao: '赵六(zhaoliu@bestfulfill.com)',
    amSun: '孙八(sunba@bestfulfill.com)'
  };

  const accountFilters = extra => [
    input('accountId', '广告账户ID', extra?.accountIdPlaceholder || '输入账户ID'),
    input('accountName', '广告账户名称', extra?.accountNamePlaceholder || '输入账户名称'),
    ...(extra?.status === false ? [] : [select('status', '状态', statusOptions, '选择状态')]),
    ...(extra?.currency === false ? [] : [select('currency', '币种', currencies, '选择币种')]),
    select('agent', '开户代理', agents, '选择开户代理'),
    select('type', '账户类型', extra?.typeOptions || ['Facebook-企业户', 'Facebook-绿通户', 'Google-海外户', 'Tiktok-企业户', '广告账户类型123'], '选择账户类型'),
    ...(extra?.media ? [select('media', '媒体', mediaOptions, '选择媒体')] : [])
  ];

  const accountColumns = extra => [
    ...(extra?.media ? [{ key: 'media', label: '媒体', width: 110 }] : []),
    { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
    { key: 'accountName', label: '广告账户名称', align: 'left', width: 260 },
    ...(extra?.status === false ? [] : [{ key: 'status', label: '状态', width: 100, format: tag }]),
    ...(extra?.timezone === false ? [] : [{ key: 'timezone', label: '时区', width: 170 }]),
    { key: 'currency', label: '币种', width: 90 },
    { key: 'balance', label: '余额', width: 110, num: true, sort: true, format: amount },
    ...(extra?.spend === false ? [] : [
      { key: 'spend', label: '总消耗', width: 110, num: true, sort: true, format: amount },
      { key: 'limit', label: '消耗上限', width: 110, num: true, sort: true, format: amount }
    ]),
    ...(extra?.age === false ? [] : [{ key: 'age', label: '创建天数', width: 110, num: true, sort: true }]),
    { key: 'createdAt', label: '创建时间', width: 170, sort: true },
    ...(extra?.bm ? [
      { key: 'bm', label: '所属BM', align: 'left', width: 160 },
      { key: 'mediaAgent', label: '媒体代理', width: 120 },
      { key: 'ownerId', label: '所有者ID', width: 130 },
      { key: 'blockedReason', label: '被封原因', align: 'left', width: 160 }
    ] : []),
    ...(extra?.mediaAgent ? [{ key: 'mediaAgent', label: '媒体代理', width: 120 }] : []),
    { key: 'agent', label: '开户代理', width: 130 },
    { key: 'type', label: '账户类型', width: 150 },
    { key: 'updatedAt', label: extra?.updatedLabel || '代理更新时间', width: 170, sort: true },
    { key: 'updatedBy', label: '修改人', align: 'left', width: 220, format: person }
  ];

  const accountPage = (media, rows, extra = {}) => ({
    title: '账户管理',
    filters: accountFilters(extra),
    actions: [
      { id: 'upload', label: '上传广告账号', icon: 'upload', primary: true },
      { id: 'modify-agent', label: '修改代理', icon: 'edit', requiresSelection: true },
      { id: 'modify-type', label: '修改账户类型', icon: 'exchange-alt', requiresSelection: true },
      { id: 'custom-fields', label: '自定义字段', icon: 'sliders-h', align: 'right' },
      { id: 'download-template', label: '下载导入模版', icon: 'download', align: 'right' },
      { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
    ],
    filterClass: extra.media ? 'cols-5' : 'cols-5',
    selectable: true,
    tableMinWidth: extra.tableMinWidth || 2100,
    opsWidth: 130,
    columns: accountColumns(extra),
    rows,
    modals: {
      '上传广告账号': { title: '上传广告账号', fields: [{ key: 'file', label: '导入文件', placeholder: '选择导入文件' }, { key: 'agent', label: '开户代理', control: 'select', options: agents, placeholder: '选择开户代理' }, { key: 'remark', label: '备注', control: 'textarea', full: true, required: false }] },
      '修改代理': { title: '修改开户代理', fields: [{ key: 'agent', label: '开户代理', control: 'select', options: agents, placeholder: '选择开户代理' }] },
      '修改账户类型': { title: '修改账户类型', fields: [{ key: 'type', label: '账户类型', control: 'select', options: ['Facebook-企业户', 'Facebook-绿通户', 'Google-海外户', 'Tiktok-企业户', '广告账户类型123'], placeholder: '选择账户类型' }] }
    }
  });

  const openingPage = {
    title: '开户管理',
    filters: [
      dateRange('申请时间'),
      input('customerId', '客户ID', '输入客户ID'),
      input('merchantId', '商户ID', '输入商户ID'),
      input('customerName', '客户名称', '输入客户名称'),
      select('status', '开户状态', ['待处理', '处理中', '开户成功', '开户失败'], '选择开户状态'),
      select('agentStatus', '一代开户状态', ['客户申请工单', '等待蓝标审核', 'FaceBook审核通过', '取消'], '选择一代开户状态')
    ],
    actions: [
      { id: 'create', label: '新建开户申请', icon: 'plus', primary: true },
      { id: 'custom-fields', label: '自定义字段', icon: 'sliders-h', align: 'right' },
      { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
    ],
    filterClass: 'cols-5',
    tableMinWidth: 2500,
    opsWidth: 150,
    columns: [
      { key: 'applyId', label: '申请ID', width: 90, sort: true },
      { key: 'customerId', label: '客户ID', width: 100 },
      { key: 'customerName', label: '客户名称', align: 'left', width: 170 },
      { key: 'operator', label: '操作人', align: 'left', width: 220, format: person },
      { key: 'merchantId', label: '商户ID', width: 110 },
      { key: 'applyAt', label: '申请时间', width: 170, sort: true },
      { key: 'status', label: '状态', width: 110, format: tag },
      { key: 'agentStatus', label: '一代开户状态', width: 150 },
      { key: 'url', label: 'URL', align: 'left', width: 260, format: text },
      { key: 'timezone', label: '时区', width: 170 },
      { key: 'bmId', label: 'BM ID', width: 130 },
      { key: 'bmName', label: 'BM名称', align: 'left', width: 160 },
      { key: 'page', label: 'Page', align: 'left', width: 220, format: text },
      { key: 'handler', label: '处理人员', align: 'left', width: 220, format: person },
      { key: 'handledAt', label: '处理时间', width: 170 },
      { key: 'agent', label: '开户代理', width: 120 },
      { key: 'accountInfo', label: '账户信息', align: 'left', width: 190 },
      { key: 'remark', label: '备注', align: 'left', width: 180, format: text }
    ],
    rows: [
      { applyId: '149', customerId: '102', customerName: 'adstest', operator: 'adstest', merchantId: '1128', applyAt: '2026-07-30 18:15:11', status: '待处理', agentStatus: '客户申请工单', url: 'https://test-ads.bestads.com/asset-management/account-management', timezone: 'America/Anchorage', bmId: '1', bmName: '23', page: 'https://www.facebook.com/', handler: '-', handledAt: '-', agent: 'Madhouse', accountInfo: '-', remark: '-', ops: ['处理', '取消开户'] },
      { applyId: '141', customerId: '3472', customerName: 'test金额变动', operator: 'test金额变动', merchantId: '14229', applyAt: '2026-07-28 16:34:27', status: '开户失败', agentStatus: '取消', url: 'https://bestfulfill.feishu.cn/wiki/PLwowZdEPim1wFkRf1hcsK1cnWg', timezone: 'America/Chicago', bmId: '1', bmName: '123', page: 'test123', handler: '谭英就(tanyingjiu@bestfulfill.com)', handledAt: '2026-07-28 16:35:15', agent: 'Madhouse', accountInfo: '-', remark: '-', ops: ['处理'] },
      { applyId: '138', customerId: '2658', customerName: '测试何', operator: '测试何', merchantId: '13328', applyAt: '2026-04-11 14:58:01', status: '开户成功', agentStatus: 'FaceBook审核通过', url: 'https://www.mjdraw.cn/home/?from=wx#/mj', timezone: 'America/Los Angeles', bmId: '1', bmName: '12321', page: 'john', handler: '何毅臻(heyizhen@bestfulfill.com)', handledAt: '2026-04-11 14:59:24', agent: 'Madhouse', accountInfo: '2666042513606521 / HQ-B-20-1034', remark: '-', ops: ['处理'] }
    ],
    modals: {
      '新建开户申请': { title: '新建开户申请', fields: [{ key: 'customerId', label: '客户ID', placeholder: '请输入客户ID' }, { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'timezone', label: '时区', placeholder: '请选择时区' }, { key: 'agent', label: '开户代理', control: 'select', options: agents, placeholder: '选择开户代理' }, { key: 'url', label: 'URL', placeholder: '请输入开户链接', full: true }] }
    }
  };

  const assignColumns = media => [
    ...(media ? [{ key: 'media', label: '媒体', width: 110 }] : []),
    { key: 'customerId', label: '客户ID', width: 100 },
    { key: 'merchantId', label: '商户ID', width: 110 },
    { key: 'customerName', label: '客户名称', align: 'left', width: 190 },
    { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
    { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
    { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
    { key: 'accountName', label: '广告账户名称', align: 'left', width: 260 },
    { key: 'accountStatus', label: '广告账户状态', width: 130, format: tag },
    { key: 'currency', label: '广告账户币种', width: 120 },
    { key: 'balance', label: '广告账户余额', width: 130, num: true, sort: true, format: amount },
    { key: 'agent', label: '开户代理', width: 130 },
    { key: 'type', label: '账户类型', width: 150 },
    { key: 'boundAt', label: '绑定时间', width: 170, sort: true },
    { key: 'operator', label: '操作人', align: 'left', width: 240, format: person }
  ];

  const actionCustomers = [
    {
      id: '102',
      name: 'adstest',
      merchantId: '1128',
      bd: owners.bdZhang,
      am: owners.amLi,
      accounts: [
        { id: '907805824316408', name: 'MX-B-08-729', status: '可用', reason: '-', currency: 'USD', balance: '1,260.50', spend2d: '0.00', spendStatus: '无消耗', agent: 'Madhouse', type: 'Facebook-三不限' },
        { id: '424547613979954', name: 'MX-B-12-553', status: '可用', reason: '-', currency: 'USD', balance: '860.00', spend2d: '45.20', spendStatus: '有消耗', agent: 'Madhouse', type: 'Facebook-三不限' },
        { id: '528938479967182', name: 'MX-B-12-768', status: '可用', reason: '-', currency: 'USD', balance: '312.75', spend2d: '-', spendStatus: '查不到', agent: 'Madhouse', type: 'Facebook-三不限' },
        { id: '6413944798708812', name: 'HQ-W-08-10', status: '不可用', reason: '无账户类型', currency: 'USD', balance: '0', spend2d: '0.00', spendStatus: '无消耗', agent: 'Wezonet', type: '-' }
      ]
    },
    {
      id: '3472',
      name: 'test金额变动',
      merchantId: '14229',
      bd: owners.bdWang,
      am: owners.amZhao,
      accounts: [
        { id: '1292368695505904', name: 'MX-G-12-620', status: '可用', reason: '-', currency: 'USD', balance: '520.00', spend2d: '0.00', spendStatus: '无消耗', agent: 'Gimc', type: 'Facebook-三不限' },
        { id: '1446318376445043', name: 'IT - TEST -M', status: '可用', reason: '-', currency: 'USD', balance: '120.00', spend2d: '13.50', spendStatus: '有消耗', agent: 'Gimc', type: 'Facebook-企业户' },
        { id: '1349733090150935', name: 'IT - TEST -2M', status: '可用', reason: '-', currency: 'USD', balance: '0.01', spend2d: '-', spendStatus: '查不到', agent: 'Gimc', type: 'Facebook-企业户' }
      ]
    }
  ];

  const assignPage = (media, rows) => ({
    title: '账户分配',
    tabs: [
      {
        id: 'current',
        label: '当前分配',
        filters: [
          { key: 'date', label: '分配日期', type: 'date', placeholder: '开始日期' },
          input('customerId', '客户ID', '输入客户ID'),
          input('merchantId', '商户ID', '输入商户ID'),
          input('customerName', '客户名称', '输入客户名称'),
          select('bd', 'BD', Object.values(owners).filter(v => v.startsWith('张') || v.startsWith('王') || v.startsWith('钱')), '选择BD'),
          select('am', 'AM', Object.values(owners).filter(v => v.startsWith('李') || v.startsWith('赵') || v.startsWith('孙')), '选择AM'),
          input('accountId', '广告账户ID', '输入广告账户ID'),
          input('accountName', '广告账户名称', '输入广告账户名称'),
          select('accountStatus', '广告账户状态', statusOptions, '选择广告账户状态'),
          ...(media ? [select('media', '媒体', mediaOptions, '选择媒体')] : [])
        ],
        actions: [
          { id: 'batch-unbind', label: '批量解除', icon: 'unlink', requiresSelection: true },
          { id: 'assign', label: '分配账户', icon: 'plus', primary: true },
          { id: 'custom-fields', label: '自定义字段', icon: 'sliders-h', align: 'right' },
          { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
        ],
        filterClass: 'cols-5',
        tableMinWidth: media ? 2250 : 2140,
        selectable: true,
        hideOperation: true,
        columns: assignColumns(media),
        rows,
        modals: {
          '批量解除': { type: 'confirm-remove-selected', title: '确定将选择的账户批量解除绑定吗?（账户个数:{{count}}）', copy: '<span class="danger-copy">将解除所有选中的客户和广告账户关系</span>', danger: false },
          '分配账户': { type: 'assign-account', title: '分配账户', customers: actionCustomers }
        }
      },
      {
        id: 'log',
        label: '分配日志',
        filters: [input('accountId', '广告账户ID', '输入广告账户ID'), input('customerName', '客户名称', '输入客户名称')],
        tableMinWidth: 1200,
        hideOperation: true,
        columns: [
          ...(media ? [{ key: 'media', label: '媒体', width: 110 }] : []),
          { key: 'accountId', label: '广告账户ID', width: 180 },
          { key: 'accountName', label: '广告账户名称', align: 'left', width: 240 },
          { key: 'customerName', label: '客户名称', align: 'left', width: 190 },
          { key: 'type', label: '操作类型', width: 120 },
          { key: 'operator', label: '操作人', align: 'left', width: 240, format: person },
          { key: 'time', label: '操作时间', width: 170 }
        ],
        rows: rows.map((row, index) => ({ ...row, type: index % 2 ? '解除' : '分配', time: row.boundAt }))
      }
    ]
  });

  const orderFilters = (kind, media) => [
    dateRange('提交时间'),
    input('orderId', `${kind}ID`, kind === '充值' || kind === '清零' ? '输入充值ID' : '输入充值ID'),
    input('accountId', '广告账户ID', '输入广告账户ID'),
    input('accountName', '广告账户名称', '输入广告账户名称'),
    select('bindCard', '是否绑卡户', yesNo, '选择是否绑卡户'),
    input('merchantIds', '商户ID内容 展开', '粘贴商户ID，一行一个，或使用空格/逗号分隔'),
    input('customerId', '客户ID', '输入客户ID'),
    input('customerName', '客户名称', '输入客户名称'),
    input('agent', '一代', '输入一代'),
    select('status', '状态', orderStatusOptions, '选择状态'),
    ...(media ? [select('media', '媒体', mediaOptions, '选择媒体')] : [])
  ];

  const orderColumns = (kind, media, options = {}) => [
    ...(media ? [{ key: 'media', label: '媒体', width: 110 }] : []),
    { key: 'orderId', label: `${kind}ID`, width: 230, sort: true },
    { key: 'customerId', label: '客户ID', width: 100 },
    { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
    { key: 'merchantId', label: '商户ID', width: 110 },
    { key: 'submitter', label: '提交人', align: 'left', width: 220, format: person },
    { key: 'submittedAt', label: '提交时间', width: 170, sort: true },
    { key: 'accountId', label: '广告账户ID', width: 190, sort: true },
    { key: 'accountName', label: '广告账户名称', align: 'left', width: 240 },
    { key: 'bindCard', label: '是否绑卡户', width: 110, format: tag },
    { key: kind === '充值' ? 'card' : 'cardSnapshot', label: kind === '充值' ? '使用卡' : '使用卡(快照)', align: 'left', width: 190, format: text },
    { key: 'currency', label: '账户币种', width: 100 },
    { key: 'agent', label: '一代', width: 120 },
    { key: 'amount', label: `${kind}金额`, width: 120, num: true, sort: true, format: amount },
    ...(kind === '充值' ? [
      ...(options.preTax === false ? [] : [
        { key: 'preTaxRate', label: '预收税率', width: 110 },
        { key: 'preTaxFee', label: '预收税费', width: 110, num: true, format: amount }
      ]),
      { key: 'accountFeeRate', label: '账户服务费率', width: 130 },
      { key: 'agentFeeRate', label: '代理服务费率', width: 130 },
      { key: 'totalFee', label: '总服务费用', width: 120, num: true, format: amount },
      { key: 'companyFee', label: '我司服务费用', width: 130, num: true, format: amount },
      { key: 'agentFee', label: '代理服务费用', width: 130, num: true, format: amount },
      { key: 'actualAmount', label: '实际充值金额', width: 130, num: true, format: amount },
      { key: 'walletCurrency', label: '钱包币种', width: 100 },
      { key: 'walletAmount', label: '钱包扣款', width: 120, num: true, format: amount }
    ] : kind === '减款' ? [
      { key: 'actualAmount', label: '实际减款金额', width: 130, num: true, format: amount },
      { key: 'walletCurrency', label: '钱包币种', width: 100 },
      { key: 'walletAmount', label: '增加金额', width: 120, num: true, format: amount }
    ] : [
      { key: 'walletCurrency', label: '钱包币种', width: 100 },
      { key: 'walletAmount', label: '增加金额', width: 120, num: true, format: amount }
    ]),
    { key: 'status', label: '状态', width: 100, format: tag },
    { key: 'completedAt', label: '完成时间', width: 170, sort: true },
    ...(kind === '清零' ? [{ key: 'actualDate', label: '上传数据实际发生日期', width: 180 }] : []),
    { key: 'remark', label: '备注', align: 'left', width: 260, format: text }
  ];

  const orderPage = (kind, rows, media = false, options = {}) => ({
    title: `账户${kind}`,
    filters: orderFilters(kind, media),
    actions: [
      ...(kind === '清零' ? [{ id: 'fill-clear', label: '补充清零数据', icon: 'upload' }, { id: 'fail-clear', label: '处理失败', icon: 'times-circle', requiresSelection: true }] : [{ id: 'manual', label: '人工处理', icon: 'user-check', requiresSelection: true }]),
      { id: 'create', label: `发起${kind}`, icon: 'plus', primary: true, danger: kind !== '充值' },
      ...(kind === '清零' ? [{ id: 'download-template', label: '下载清零数据模版', icon: 'download', align: 'right' }] : []),
      { id: 'custom-fields', label: '自定义字段', icon: 'sliders-h', align: 'right' },
      { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
    ],
    filterClass: 'cols-5',
    selectable: true,
    tableMinWidth: kind === '充值' ? (media ? 3300 : 3200) : kind === '减款' ? 2450 : (media ? 2550 : 2450),
    opsWidth: kind === '充值' ? 180 : 210,
    columns: orderColumns(kind, media, options),
    rows,
    modals: {
      [`发起${kind}`]: kind === '充值'
        ? {
            type: 'recharge-request',
            title: `发起${kind}`,
            customers: [
              {
                id: '102',
                name: 'adstest',
                merchantId: '1128',
                balance: '788,512.92 USD',
                accounts: [
                  { id: '1566924120712203', name: 'HQ-W-12-13', currency: 'USD', balance: '0.01', serviceRate: 3, preTaxRate: 0, verifyStatus: '待验卡', cardId: 'c_2dsw82249hx2s', cardLabel: 'c_2dsw82249hx2s(0751)｜待验卡｜可用 519.00 USD', otherCards: '其他关联卡：1. c_6b4m32v9ab21(1288)｜未申请｜可用 258.00 USD；2. c_frz81n2a00kq(9910)｜冻结｜可用 40.00 USD', gateReason: '使用卡待验卡，请先去媒体完成验证并回系统标记媒体已验证' },
                  { id: '856275879259933', name: 'MX-B-07-01', currency: 'USD', balance: '24,114.05', serviceRate: 3, preTaxRate: 5, verifyStatus: '已验卡(未回收)', cardId: 'c_3bpoltc2u7sf1', cardLabel: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可用 498.00 USD', otherCards: '其他关联卡：1. c_w9x8y7z6v5u4t3(5678)｜已回收｜可用 200.00 USD' },
                  { id: '705119845658146', name: 'TL-B-12-1446', currency: 'USD', balance: '0.01', serviceRate: 3, preTaxRate: 0, verifyStatus: '审批中', cardId: 'c_pending_2219', cardLabel: 'c_pending_2219(2219)｜审批中｜可用 1.00 USD', otherCards: '其他关联卡：无', gateReason: '使用卡验卡抬额审批中，审批通过并标记媒体已验证后才能充值' },
                  { id: '605576992524550', name: 'IT-TEST-2', currency: 'USD', balance: '0.01', serviceRate: 3, preTaxRate: 0 },
                  { id: '804080292207941', name: 'IT-TEST-W', currency: 'USD', balance: '150', serviceRate: 3, preTaxRate: 0 },
                  { id: '740223789120937', name: '#4494 - altairlabs 32 - PP - RHKA', currency: 'USD', balance: '0', serviceRate: 3, preTaxRate: 0 },
                  { id: '121', name: 'test1234', currency: 'EUR', balance: '-', serviceRate: 3, preTaxRate: 0 }
                ]
              },
              {
                id: '3472',
                name: 'test金额变动',
                merchantId: '14229',
                balance: '52,860.00 USD',
                accounts: [
                  { id: '1292368695505904', name: 'MX-G-12-620', currency: 'USD', balance: '0.00', serviceRate: 3, preTaxRate: 5, verifyStatus: '已验卡(未回收)', cardId: 'c_3bpoltc2u7sf1', cardLabel: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可用 498.00 USD', otherCards: '其他关联卡：1. c_w9x8y7z6v5u4t3(5678)｜已回收｜可用 200.00 USD' },
                  { id: '1446318376445043', name: 'IT - TEST -M', currency: 'USD', balance: '120.00', serviceRate: 3, preTaxRate: 0, verifyStatus: '待验卡', cardId: 'c_pending_media_1446', cardLabel: 'c_pending_media_1446(1446)｜待验卡｜可用 20.00 USD', otherCards: '其他关联卡：无', gateReason: '使用卡待验卡，需先去媒体并标记媒体已验证' },
                  { id: '1349733090150935', name: 'IT - TEST -2M', currency: 'USD', balance: '0.01', serviceRate: 3, preTaxRate: 0 }
                ]
              }
            ]
          }
        : { type: 'account-adjustment', kind, title: `发起${kind}`, customers: options.clearUnknownBalance && kind === '清零' ? actionCustomers.map(customer => ({ ...customer, accounts: customer.accounts.map(account => ({ ...account, balance: '-' })) })) : actionCustomers },
      '人工处理': { title: '人工处理', fields: [{ key: 'result', label: '处理结果', control: 'select', options: ['成功', '失败', '取消'], placeholder: '选择处理结果' }, { key: 'remark', label: '处理备注', control: 'textarea', full: true }] },
      '处理失败': { type: 'confirm-mark-failed', title: '确认将选中的清零工单处理失败吗？', copy: '<span class="danger-copy">选中的清零工单状态将更新为失败。</span>', danger: true },
      '补充清零数据': { title: '补充清零数据', fields: [{ key: 'file', label: '清零数据文件', placeholder: '选择清零数据文件' }, { key: 'actualDate', label: '实际发生日期', placeholder: '请选择日期' }] }
    }
  });

  const feePage = (rows, media = false, title = '服务费配置') => ({
    title,
    filters: [
      select('agent', '代理', agents, '选择代理'),
      input('accountId', '广告账户ID', '输入广告账户ID'),
      input('accountName', '广告账户名称', '输入广告账户名称'),
      select('status', '状态', ['启用', '停用'], '选择状态'),
      ...(media ? [select('media', '媒体', mediaOptions, '选择媒体')] : [])
    ],
    actions: [
      { id: 'create', label: '新增配置', icon: 'plus', primary: true },
      { id: 'batch-status', label: '批量修改状态', icon: 'toggle-on' },
      { id: 'batch-fee', label: '批量修改服务费', icon: 'percent' },
      { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
    ],
    filterClass: 'cols-5',
    tableMinWidth: media ? 1500 : 1350,
    opsWidth: 100,
    columns: [
      ...(media ? [{ key: 'media', label: '媒体', width: 110 }] : []),
      { key: 'accountId', label: '广告账户ID', width: 190, sort: true },
      { key: 'accountName', label: '广告账户名称', align: 'left', width: 260 },
      { key: 'accountFee', label: '账户服务费', width: 120 },
      { key: 'status', label: '状态', width: 100, format: tag },
      { key: 'updatedAt', label: '最后修改时间', width: 170, sort: true },
      { key: 'updatedBy', label: '最后修改人', align: 'left', width: 240, format: person },
      { key: 'agent', label: '代理', width: 130 },
      { key: 'agentFee', label: '代理服务费', width: 120 }
    ],
    rows,
    modals: {
      '新增配置': { title: '新增配置', fields: [{ key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' }, { key: 'accountFee', label: '账户服务费', placeholder: '请输入账户服务费' }, { key: 'agent', label: '代理', control: 'select', options: agents, placeholder: '选择代理' }, { key: 'agentFee', label: '代理服务费', placeholder: '请输入代理服务费' }] },
      '编辑': { title: '编辑配置', fields: [{ key: 'accountFee', label: '账户服务费', placeholder: '请输入账户服务费' }, { key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '选择状态' }, { key: 'agentFee', label: '代理服务费', placeholder: '请输入代理服务费' }] },
      '批量修改状态': { title: '批量修改状态', fields: [{ key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '选择状态' }] },
      '批量修改服务费': { title: '批量修改服务费', fields: [{ key: 'accountFee', label: '账户服务费', placeholder: '请输入账户服务费' }, { key: 'agentFee', label: '代理服务费', placeholder: '请输入代理服务费' }] }
    }
  });

  const fbAccounts = [
    { accountId: '1261856769024844', accountName: 'maindanslapatte 11-GX', status: '活跃', timezone: 'Europe/Paris', currency: 'USD', balance: '0', spend: '0.01', limit: '0.01', age: '0', createdAt: '2025-09-25 11:39:38', bm: '-', mediaAgent: '-', ownerId: '-', blockedReason: '-', agent: 'Panda', type: 'Facebook-绿通户', updatedAt: '2026-08-09 08:15:27', updatedBy: '-', ops: ['修改账户名'] },
    { accountId: '1473325683817354', accountName: 'christcomic 1-X', status: '活跃', timezone: 'America/New_York', currency: 'USD', balance: '0.01', spend: '0', limit: '0.01', age: '0', createdAt: '2025-09-25 11:39:38', bm: '-', mediaAgent: '-', ownerId: '-', blockedReason: '-', agent: 'Panda', type: 'Facebook-企业户', updatedAt: '2026-08-09 08:15:27', updatedBy: '-', ops: ['修改账户名'] },
    { accountId: '1114009740245750', accountName: 'noire-london 1-X', status: '活跃', timezone: 'Europe/London', currency: 'USD', balance: '0', spend: '16,420.01', limit: '16,420.01', age: '0', createdAt: '2025-09-25 11:39:38', bm: '-', mediaAgent: '-', ownerId: '-', blockedReason: '-', agent: 'Panda', type: 'Facebook-企业户', updatedAt: '2026-08-09 08:15:27', updatedBy: '-', ops: ['修改账户名'] }
  ];
  const ggAccounts = [
    { accountId: '8200635496', accountName: 'MX-W-GG-11-05', status: '停用', timezone: 'Europe/London', currency: 'USD', balance: '0', spend: '0', limit: '0', age: '0', createdAt: '2026-01-05 15:17:29', agent: 'Wezonet', type: '-', updatedAt: '2026-08-09 08:22:08', updatedBy: '-', ops: ['修改账户名'] },
    { accountId: '8160606825', accountName: 'MUXUE GG 10', status: '停用', timezone: 'America/Anchorage', currency: 'USD', balance: '0', spend: '0', limit: '0', age: '0', createdAt: '2026-01-05 15:17:29', agent: 'Wezonet', type: '-', updatedAt: '2026-08-09 08:22:08', updatedBy: '-', ops: ['修改账户名'] },
    { accountId: '2106297452', accountName: 'MUXUE GG 06', status: '停用', timezone: 'America/Anchorage', currency: 'USD', balance: '92.56', spend: '0', limit: '0', age: '0', createdAt: '2026-01-05 15:17:29', agent: 'Wezonet', type: '-', updatedAt: '2026-08-09 08:22:08', updatedBy: '-', ops: ['修改账户名'] }
  ];
  const ttAccounts = [
    { accountId: '7431074123113365521', accountName: 'HBXY-GG-TT-Amsterdam-05', status: '停用', timezone: 'Europe/Amsterdam', currency: 'USD', balance: '99.49', age: '0', createdAt: '2025-08-09 14:51:14', mediaAgent: '-', agent: 'Gimc', type: 'Tiktok-企业户', updatedAt: '2026-08-09 08:22:05', updatedBy: '-', ops: ['修改账户名'] },
    { accountId: '7409927998951964689', accountName: 'CQFL-GG-TT-07-01', status: '停用', timezone: 'America/Los_Angeles', currency: 'USD', balance: '5,555.2', age: '0', createdAt: '2025-08-09 14:51:04', mediaAgent: '-', agent: 'Gimc', type: 'Tiktok-企业户', updatedAt: '2026-08-09 08:22:05', updatedBy: '-', ops: ['修改账户名'] }
  ];
  const otherAccounts = [
    { media: 'Taboola', accountId: '2015906', accountName: 'Wezo - get rejumask - SC', currency: 'USD', balance: '0', createdAt: '2026-03-26 16:13:08', agent: 'Wezonet-Manual', type: '-', updatedAt: '2026-08-09 08:24:08', updatedBy: '-', ops: ['复制Token', '修改账户名'] },
    { media: 'Taboola', accountId: '1726590', accountName: 'Wezo - beautysecrets.co.il 1 - SC', currency: 'USD', balance: '0', createdAt: '2026-01-06 11:28:35', agent: 'Wezonet-Manual', type: '-', updatedAt: '2026-08-09 08:24:08', updatedBy: '-', ops: ['复制Token', '修改账户名'] },
    { media: 'Applovin', accountId: '1983200478', accountName: 'Lucas De Souza 1', currency: 'USD', balance: '0', createdAt: '2026-07-20 18:25:21', agent: 'it-test', type: '广告账户类型123', updatedAt: '2026-08-09 08:24:08', updatedBy: '-', ops: ['复制Token', '修改账户名'] }
  ];

  const fbAssign = [
    { customerId: '3472', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, merchantId: '14229', accountId: '1292368695505904', accountName: 'MX-G-12-620', accountStatus: '活跃', currency: 'USD', balance: '520.00', agent: 'Gimc', type: 'Facebook-三不限', boundAt: '2026-07-13 16:27:23', operator: '谭英就(tanyingjiu@bestfulfill.com)' },
    { customerId: '3472', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, merchantId: '14229', accountId: '1446318376445043', accountName: 'IT - TEST -M', accountStatus: '活跃', currency: 'USD', balance: '120.00', agent: 'Gimc', type: 'Facebook-企业户', boundAt: '2026-07-06 10:04:02', operator: '谭英就(tanyingjiu@bestfulfill.com)' }
  ];
  const ggAssign = [
    { customerId: '3472', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, merchantId: '14229', accountId: '7470937076', accountName: 'muxue-88DHD', accountStatus: '停用', currency: 'USD', balance: '92.56', agent: 'Gimc', type: 'Google-海外户', boundAt: '2026-07-21 10:10:50', operator: '谭英就(tanyingjiu@bestfulfill.com)' },
    { customerId: '2611', customerName: 'test123tyj', bd: owners.bdQian, am: owners.amSun, merchantId: '13171', accountId: '666', accountName: '123', accountStatus: '停用', currency: 'USD', balance: '0.00', agent: 'Wezonet-Manual', type: '-', boundAt: '2026-01-27 16:19:32', operator: '谭英就(tanyingjiu@bestfulfill.com)' }
  ];
  const ttAssign = [
    { customerId: '3472', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, merchantId: '14229', accountId: '7325263652313890817', accountName: 'HHJC-TT-11-04', accountStatus: '停用', currency: 'USD', balance: '35.86', agent: 'Madhouse', type: 'Tiktok-企业户', boundAt: '2026-06-26 16:06:19', operator: '谭英就(tanyingjiu@bestfulfill.com)' },
    { customerId: '2658', customerName: '测试何', bd: owners.bdZhang, am: owners.amLi, merchantId: '13328', accountId: '7393185783328456721', accountName: 'SZ-MX-G-TT-11-03', accountStatus: '停用', currency: 'USD', balance: '99.49', agent: 'Gimc', type: 'Tiktok-企业户', boundAt: '2026-04-11 15:12:26', operator: '何毅臻(heyizhen@bestfulfill.com)' }
  ];
  const otherAssign = [
    { media: 'Snapchat', customerId: '3472', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, merchantId: '14229', accountId: '343434', accountName: 'cestest', accountStatus: '活跃', currency: 'USD', balance: '-', agent: 'it-test', type: '广告账户类型123', boundAt: '2026-07-29 16:54:21', operator: '谭英就(tanyingjiu@bestfulfill.com)' },
    { media: 'Outbrain', customerId: '102', customerName: 'adstest', bd: owners.bdZhang, am: owners.amLi, merchantId: '1128', accountId: '20260725', accountName: 'Outbrain_test_account', accountStatus: '活跃', currency: 'USD', balance: '-', agent: 'it-test', type: '广告账户类型123', boundAt: '2026-07-25 11:35:12', operator: '欧伟权(ouweiquan@bestfulfill.com)' }
  ];

  const rechargeRows = {
    fb: [
      { orderId: 'AD20260808104110277646364', customerId: '4770', customerName: '-', merchantId: '17794', submitter: 'Hiroto', submittedAt: '2026-08-08 10:41:10', accountId: '27648062301520359', accountName: '#6775 - hanaleave 261 - PP - RHKA', bindCard: '否', card: '-', currency: 'USD', agent: 'Rockads', amount: '200', preTaxRate: '-', preTaxFee: '-', accountFeeRate: '3.00%', agentFeeRate: '1.00%', totalFee: '6', companyFee: '4', agentFee: '2', actualAmount: '194', walletCurrency: 'USD', walletAmount: '200', status: '完成', completedAt: '2026-08-08 10:41:13', remark: '-', ops: ['标记状态', '重试', '人工取消'] },
      { orderId: 'AD20260808101929844051755', customerId: '2688', customerName: '测试用户_1777106273', merchantId: '11894', submitter: 'Brandon Bardwell', submittedAt: '2026-08-08 10:19:30', accountId: '965724766105259', accountName: 'simmple-us 6-GB', bindCard: '否', card: '-', currency: 'USD', agent: 'Madhouse', amount: '600', preTaxRate: '-', preTaxFee: '-', accountFeeRate: '10.00%', agentFeeRate: '0.00%', totalFee: '60', companyFee: '60', agentFee: '0', actualAmount: '540', walletCurrency: 'USD', walletAmount: '600', status: '完成', completedAt: '2026-08-08 10:31:00', remark: '-', ops: ['标记状态'] }
    ],
    gg: [
      { orderId: 'AD20260808083507969754755', customerId: '3063', customerName: '-', merchantId: '12361', submitter: 'Lucas D-12361', submittedAt: '2026-08-08 08:35:08', accountId: '6077344284', accountName: 'muxue-HTX0P', bindCard: '否', card: '-', currency: 'USD', agent: 'Gimc', amount: '500', preTaxRate: '-', preTaxFee: '-', accountFeeRate: '1.00%', agentFeeRate: '0.00%', totalFee: '5', companyFee: '5', agentFee: '0', actualAmount: '495', walletCurrency: 'USD', walletAmount: '500', status: '完成', completedAt: '2026-08-08 08:36:03', remark: '-', ops: ['标记状态'] }
    ],
    tt: [
      { orderId: 'AD20260808044015355079868', customerId: '4750', customerName: '-', merchantId: '17720', submitter: 'Jad', submittedAt: '2026-08-08 04:40:15', accountId: '7665996521594257429', accountName: 'HUACHAO-B-TT-paris-indescents', bindCard: '否', card: '-', currency: 'USD', agent: 'Madhouse', amount: '800', preTaxRate: '', preTaxFee: '', accountFeeRate: '1.00%', agentFeeRate: '0.00%', totalFee: '8', companyFee: '8', agentFee: '0', actualAmount: '792', walletCurrency: 'USD', walletAmount: '800', status: '完成', completedAt: '2026-08-08 04:41:00', remark: '-', ops: ['标记状态'] }
    ],
    other: [
      { media: 'Applovin', orderId: 'AD20260808055833544414472', customerId: '2853', customerName: '-', merchantId: '12059', submitter: 'Lucas De Souza 1', submittedAt: '2026-08-08 05:58:34', accountId: '1983200478', accountName: '-', bindCard: '是', card: 'c_1ihrvn24fl49c(3992)', currency: 'USD', agent: '-', amount: '3,000', accountFeeRate: '3.00%', agentFeeRate: '0.00%', totalFee: '90', companyFee: '90', agentFee: '0', actualAmount: '2,910', walletCurrency: 'USD', walletAmount: '3,000', status: '完成', completedAt: '2026-08-08 09:12:30', remark: '运营标记媒体调额完成', ops: ['标记状态'] }
    ]
  };

  const subtractionRows = {
    fb: [
      { orderId: 'AD20260809091211234560001', customerId: '102', customerName: 'adstest', merchantId: '1128', submitter: '管理员', submittedAt: '2026-08-09 09:12:11', accountId: '907805824316408', accountName: 'MX-B-08-729', bindCard: '是', cardSnapshot: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可用 498.00 USD', otherCards: '其他关联卡：1. c_w9x8y7z6v5u4t3(5678)｜已回收｜可用 200.00 USD', currency: 'USD', agent: 'Madhouse', amount: '120', actualAmount: '-', walletCurrency: 'USD', walletAmount: '120', status: '待处理', completedAt: '-', remark: '待媒体减款后确认钱包加回金额；飞书通知需带其他关联卡', ops: ['查看详情', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260809084622543210002', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: '谭英就(tanyingjiu@bestfulfill.com)', submittedAt: '2026-08-09 08:46:22', accountId: '1292368695505904', accountName: 'MX-G-12-620', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '80', actualAmount: '-', walletCurrency: 'USD', walletAmount: '80', status: '处理中', completedAt: '-', remark: '代理后台处理中', ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260807002833682397944', customerId: '4388', customerName: '-', merchantId: '16201', submitter: 'Arne', submittedAt: '2026-08-07 00:28:34', accountId: '821285917232112', accountName: 'MX-F-12-2566', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'MeetSocial', amount: '300', actualAmount: '300', walletCurrency: 'USD', walletAmount: '300', status: '完成', completedAt: '2026-08-07 00:29:01', remark: '-', selectable: false, ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260806153327888880004', customerId: '2658', customerName: '测试何', merchantId: '13328', submitter: '何毅臻(heyizhen@bestfulfill.com)', submittedAt: '2026-08-06 15:33:27', accountId: '2666042513606521', accountName: 'HQ-B-20-1034', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '50', actualAmount: '-', walletCurrency: 'USD', walletAmount: '0', status: '失败', completedAt: '-', remark: '一代返回失败：账户余额不足', selectable: false, ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ],
    gg: [
      { orderId: 'AD20260809093311678900001', customerId: '102', customerName: 'adstest', merchantId: '1128', submitter: '管理员', submittedAt: '2026-08-09 09:33:11', accountId: '6077344284', accountName: 'muxue-HTX0P', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '60', actualAmount: '-', walletCurrency: 'USD', walletAmount: '60', status: '待处理', completedAt: '-', remark: '待确认媒体实际减款结果', ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260625192240972224967', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: '谭英就(tanyingjiu@bestfulfill.com)', submittedAt: '2026-06-25 19:22:41', accountId: '2275454762', accountName: 'HQY-G-11-05', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '10', actualAmount: '10', walletCurrency: 'USD', walletAmount: '0', status: '失败', completedAt: '-', remark: '省广 返回错误状态码: 1463', selectable: false, ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ],
    tt: [
      { orderId: 'AD20260809095530135790001', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: '管理员', submittedAt: '2026-08-09 09:55:30', accountId: '7325263652313890817', accountName: 'HHJC-TT-11-04', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '35.86', actualAmount: '-', walletCurrency: 'USD', walletAmount: '35.86', status: '待处理', completedAt: '-', remark: '待媒体减款完成后确认', ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260807181620796497300', customerId: '2807', customerName: '-', merchantId: '12013', submitter: 'YSelim', submittedAt: '2026-08-07 18:16:21', accountId: '7558457571202220033', accountName: 'WFRS-B-TT-EST-04-30', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '956', actualAmount: '956', walletCurrency: 'USD', walletAmount: '956', status: '完成', completedAt: '2026-08-07 18:21:00', remark: '-', selectable: false, ops: ['媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ]
  };

  const clearRows = {
    fb: [
      { orderId: 'AD20260809101011999900001', customerId: '102', customerName: 'adstest', merchantId: '1128', submitter: '管理员', submittedAt: '2026-08-09 10:10:11', accountId: '907805824316408', accountName: 'MX-B-08-729', bindCard: '是', cardSnapshot: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可用 498.00 USD', otherCards: '其他关联卡：1. c_w9x8y7z6v5u4t3(5678)｜已回收｜可用 200.00 USD', currency: 'USD', agent: 'Madhouse', amount: '1,260.50', walletCurrency: 'USD', walletAmount: '1,260.50', status: '待处理', completedAt: '-', actualDate: '-', remark: '近2天无消耗，可发起清零；飞书通知需带其他关联卡', ops: ['查看详情', '处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260809095822444400002', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: '谭英就(tanyingjiu@bestfulfill.com)', submittedAt: '2026-08-09 09:58:22', accountId: '1349733090150935', accountName: 'IT - TEST -2M', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '0.01', walletCurrency: 'USD', walletAmount: '0.01', status: '处理中', completedAt: '-', actualDate: '-', remark: '消耗查不到，允许清零后进入人工核对', ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260807233034860481408', customerId: '3142', customerName: '测试用户_1781072321', merchantId: '12836', submitter: 'Yente', submittedAt: '2026-08-07 23:30:35', accountId: '1563389132079425', accountName: '-', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: '-', amount: '1,770.75', walletCurrency: 'USD', walletAmount: '1,770.75', status: '完成', completedAt: '2026-08-08 05:54:47', actualDate: '-', remark: '-', selectable: false, ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260806110830123400004', customerId: '2658', customerName: '测试何', merchantId: '13328', submitter: '何毅臻(heyizhen@bestfulfill.com)', submittedAt: '2026-08-06 11:08:30', accountId: '2666042513606521', accountName: 'HQ-B-20-1034', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '88.42', walletCurrency: 'USD', walletAmount: '0', status: '失败', completedAt: '-', actualDate: '-', remark: '媒体返回失败：账户不存在', selectable: false, ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ],
    gg: [
      { orderId: 'AD20260809101622876540001', customerId: '102', customerName: 'adstest', merchantId: '1128', submitter: '管理员', submittedAt: '2026-08-09 10:16:22', accountId: '6077344284', accountName: 'muxue-HTX0P', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '495.00', walletCurrency: 'USD', walletAmount: '495.00', status: '待处理', completedAt: '-', actualDate: '-', remark: '待处理成功后确认实际回钱包金额', ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260806222201843617068', customerId: '2853', customerName: '-', merchantId: '12059', submitter: 'Lucas De Souza 1', submittedAt: '2026-08-06 22:22:02', accountId: '8530785537', accountName: 'MUXUE TRADE LIMITED-D8XTT', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Gimc', amount: '1,262.18', walletCurrency: 'USD', walletAmount: '1,262.18', status: '完成', completedAt: '2026-08-07 22:23:01', actualDate: '-', remark: '-', selectable: false, ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ],
    tt: [
      { orderId: 'AD20260809102644911110001', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: '管理员', submittedAt: '2026-08-09 10:26:44', accountId: '7325263652313890817', accountName: 'HHJC-TT-11-04', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '35.86', walletCurrency: 'USD', walletAmount: '35.86', status: '待处理', completedAt: '-', actualDate: '-', remark: 'TikTok 只支持清零，不支持减款', ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { orderId: 'AD20260806162603374834874', customerId: '1268', customerName: '-', merchantId: '10076', submitter: '产品验收1212（内部）', submittedAt: '2026-08-06 16:26:03', accountId: '7325263652313890817', accountName: 'HHJC-TT-11-04', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'Madhouse', amount: '35.86', walletCurrency: 'USD', walletAmount: '35.86', status: '完成', completedAt: '2026-08-06 16:31:00', actualDate: '-', remark: '-', selectable: false, ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ],
    other: [
      { media: 'Snapchat', orderId: 'AD20260809104011800100001', customerId: '3472', customerName: 'test金额变动', merchantId: '14229', submitter: 'test金额变动', submittedAt: '2026-08-09 10:40:11', accountId: '343434', accountName: 'cestest', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'it-test', amount: '-', walletCurrency: 'USD', walletAmount: '0', status: '待处理', completedAt: '-', actualDate: '-', remark: '其他媒体拿不到余额，只发起清零', ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] },
      { media: 'Outbrain', orderId: 'AD20260720182520530962917', customerId: '102', customerName: 'adstest', merchantId: '1128', submitter: 'test金额变动', submittedAt: '2026-07-20 18:25:21', accountId: '20260725', accountName: 'Outbrain_test_account', bindCard: '否', cardSnapshot: '-', currency: 'USD', agent: 'it-test', amount: '-', walletCurrency: 'USD', walletAmount: '0', status: '失败', completedAt: '-', actualDate: '-', remark: '人工标记媒体失败', selectable: false, ops: ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] }
    ]
  };

  const fees = {
    fb: [
      { accountId: '573938708665606', accountName: 'TL-B-07-1394', accountFee: '15.00%', status: '启用', updatedAt: '2026-05-12 14:13:29', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', agent: 'Madhouse', agentFee: '5.00%', ops: ['编辑'] },
      { accountId: '121', accountName: 'test1', accountFee: '2.00%', status: '启用', updatedAt: '2026-04-24 11:39:23', updatedBy: 'admin(ouweiquan@bestfulfill.com)', agent: 'it-test', agentFee: '2.00%', ops: ['编辑'] }
    ],
    gg: [{ accountId: '2275454762', accountName: 'HQY-G-11-05', accountFee: '5.00%', status: '停用', updatedAt: '2026-01-05 18:56:36', updatedBy: 'admin(ouweiquan@bestfulfill.com)', agent: 'Gimc', agentFee: '20.00%', ops: ['编辑'] }],
    tt: [{ accountId: '12306test', accountName: 'tiktok手动用户', accountFee: '10.00%', status: '停用', updatedAt: '2026-01-07 14:44:54', updatedBy: 'admin(ouweiquan@bestfulfill.com)', agent: 'GIMC-Manual', agentFee: '0.00%', ops: ['编辑'] }],
    other: [{ media: 'X', accountId: '260808173220', accountName: 'autotest_x_260808173220', accountFee: '10.00%', status: '停用', updatedAt: '2026-08-08 17:32:29', updatedBy: '欧伟权(ouweiquan@bestfulfill.com)', agent: 'it-test', agentFee: '2.00%', ops: ['编辑'] }]
  };

  window.BESTADS_ADMIN_MODULE_CONFIGS = {
    ...(window.BESTADS_ADMIN_MODULE_CONFIGS || {}),
    'fb-account-management': accountPage('fb', fbAccounts, { bm: true, tableMinWidth: 2500 }),
    'fb-account-opening': openingPage,
    'fb-account-allocation': assignPage(false, fbAssign),
    'fb-recharge-management': orderPage('充值', rechargeRows.fb),
    'fb-deduction-management': orderPage('减款', subtractionRows.fb),
    'fb-clear-management': orderPage('清零', clearRows.fb),
    'fb-service-fee-config': feePage(fees.fb, false, '服务费配置'),

    'google-account-management': accountPage('gg', ggAccounts, { tableMinWidth: 2050 }),
    'google-account-allocation': assignPage(false, ggAssign),
    'google-recharge-management': orderPage('充值', rechargeRows.gg),
    'google-deduction-management': orderPage('减款', subtractionRows.gg),
    'google-clear-management': orderPage('清零', clearRows.gg),
    'google-service-fee-config': feePage(fees.gg, false, '账户服务费'),

    'tt-account-management': accountPage('tt', ttAccounts, { spend: false, mediaAgent: true, tableMinWidth: 1900 }),
    'tt-account-allocation': assignPage(false, ttAssign),
    'tt-recharge-management': orderPage('充值', rechargeRows.tt, false, { preTax: false }),
    'tt-deduction-management': orderPage('减款', subtractionRows.tt),
    'tt-clear-management': orderPage('清零', clearRows.tt),
    'tt-service-fee-config': feePage(fees.tt, false, '服务费配置'),

    'other-account-management': accountPage('other', otherAccounts, { media: true, status: false, currency: false, timezone: false, spend: false, age: false, accountIdPlaceholder: '输入广告账户ID', accountNamePlaceholder: '输入广告账户名称', updatedLabel: '更新时间', tableMinWidth: 1500 }),
    'other-account-allocation': assignPage(true, otherAssign),
    'other-recharge-management': orderPage('充值', rechargeRows.other, true, { preTax: false }),
    'other-clear-management': orderPage('清零', clearRows.other, true, { clearUnknownBalance: true }),
    'other-service-fee-config': feePage(fees.other, true, '账户服务费')
  };
})();
