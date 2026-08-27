/*
 * BestAds 运营端「系统配置」模块配置。
 * 页面契约按测试环境抽取：pre-recharge-config / system-dict /
 * permission-audit-log / client-menu-config / notice-config /
 * consumption-drop-alert-config。原型只做本地交互，不调用真实接口。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const tag = value => {
    const text = asText(value);
    const cls = /启用|成功|已处理|开启/.test(text) ? 'status-success'
      : /停用|禁用|失败|关闭|无效/.test(text) ? 'status-danger'
        : /待|处理中|草稿/.test(text) ? 'status-warning'
          : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const text = value => `<span class="wrap">${esc(asText(value))}</span>`;
  const person = value => `<span class="person-cell">${esc(asText(value))}</span>`;
  const money = value => `<span class="amount-zero">${esc(asText(value))}</span>`;
  const exportAction = { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' };
  const mediaOptions = ['Facebook', 'Google', 'TikTok', 'AppLovin', '其他'];
  const statusOptions = ['启用', '停用'];
  const people = {
    tang: '汤秀梅(tangxiumei@bestfulfill.com)',
    wang: '王荣荣(wangrongrong@bestfulfill.com)',
    ou: '欧伟权(ouweiquan@bestfulfill.com)',
    tan: '谭英就(tanyingjiu@bestfulfill.com)',
    cheng: '程允良(chengyunliang@bestfulfill.com)',
    li: '李志伟(lizhiwei@bestfulfill.com)',
    admin: 'admin(ouweiquan@bestfulfill.com)'
  };

  function columns(labels, options = {}) {
    const left = new Set(options.left || []);
    const status = new Set(options.status || []);
    const personCols = new Set(options.person || []);
    const long = new Set(options.long || []);
    return labels.map((label, index) => {
      const col = { key: `c${index}`, label, width: options.widths?.[index] || 140 };
      if (left.has(label)) col.align = 'left';
      if (status.has(label)) col.format = tag;
      if (personCols.has(label)) { col.align = 'left'; col.width = Math.max(col.width, 220); col.format = person; }
      if (long.has(label)) { col.align = 'left'; col.width = Math.max(col.width, 260); col.format = text; }
      if (/金额|充值|消耗|利润|比例|阈值|排序|降幅|次数|数量/.test(label)) { col.num = true; col.sort = true; col.format = col.format || money; }
      if (/日期|时间|ID/.test(label)) col.sort = true;
      return col;
    });
  }

  function row(values, extra = {}) {
    return Object.assign(values.reduce((acc, value, index) => ({ ...acc, [`c${index}`]: value }), {}), extra);
  }

  const commonModals = {
    '启用': { type: 'confirm', title: '启用', copy: '确认启用当前记录？原型只更新交互反馈，不调用真实接口。' },
    '禁用': { type: 'confirm', title: '禁用', danger: true, copy: '确认禁用当前记录？真实系统需要校验是否仍被业务引用。' },
    '停用': { type: 'confirm', title: '停用', danger: true, copy: '确认停用当前记录？真实系统需要校验是否仍被业务引用。' }
  };

  function dictFields(name) {
    return [
      { key: 'code', label: `${name}编码`, placeholder: `输入${name}编码` },
      { key: 'value', label: `${name}值`, placeholder: `输入${name}值` },
      { key: 'name', label: `${name}名称`, placeholder: `输入${name}名称` },
      { key: 'englishName', label: `${name}英文名`, required: false, placeholder: `输入${name}英文名` },
      { key: 'icon', label: '图标', control: 'upload', required: false, placeholder: '上传图标', max: 1, accept: 'image/*' },
      { key: 'status', label: '状态', control: 'select', options: statusOptions, placeholder: '选择状态' }
    ];
  }

  function dictTab(id, label, rows, options = {}) {
    const columnLabels = options.columnLabels || ['ID', '名称', '状态', '更新时间', '操作人'];
    const columnOptions = options.columnOptions || { left: ['名称', '操作人'], status: ['状态'], person: ['操作人'], widths: [90, 260, 110, 180, 260] };
    const fields = options.fields || dictFields(label);
    return {
      id,
      label,
      actions: [{ id: `create-${id}`, label: `新增${label}`, icon: 'plus', primary: true }],
      tableMinWidth: options.tableMinWidth || 1120,
      opsWidth: 130,
      columns: columns(columnLabels, columnOptions),
      rows,
      modals: {
        [`新增${label}`]: { title: `新增${label}`, fields },
        '编辑': { title: `编辑${label}`, fields },
        ...commonModals
      }
    };
  }

  const permissionFields = [
    { key: 'permissionName', label: '权限名称', placeholder: '输入权限名称' },
    { key: 'type', label: '类型', control: 'select', options: ['目录', '菜单', '按钮'], placeholder: '选择类型' },
    { key: 'parent', label: '父级菜单', control: 'select', required: false, options: ['无（顶级菜单）', '资产管理', '用户管理', '设置', '广告投放', '数据分析', '账号和创意', '服务工具', '管理配置'], placeholder: '选择父级目录' },
    { key: 'permissionMark', label: '权限标识', placeholder: '输入权限标识' },
    { key: 'frontRoute', label: '前端路由', required: false, placeholder: '输入前端路由' },
    { key: 'backendRoute', label: '后端路由', control: 'textarea', required: false, placeholder: '输入后端路由' },
    { key: 'sort', label: '排序', required: false, placeholder: '输入排序' }
  ];

  const configs = {
    'precharge-config': {
      title: '预充配置',
      filters: [
        { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
        { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }
      ],
      actions: [
        { id: 'upload', label: '批量上传', icon: 'upload', primary: true, uploadToast: '请选择本地文件批量上传预充配置（原型）' },
        { id: 'create-precharge', label: '新增预充配置', icon: 'plus', primary: true },
        { id: 'download-template', label: '下载模版', icon: 'download' },
        exportAction
      ],
      filterClass: 'cols-5',
      tableMinWidth: 1840,
      opsWidth: 100,
      columns: columns(['商户ID', '客户名称', '历史充值', '历史消耗', '带来总利润', '利润截止日期', '预充比例', '预充金额上限', '剩余预充金额', '启用状态', '最后修改人', '最后修改时间'], { left: ['客户名称', '最后修改人'], status: ['启用状态'], person: ['最后修改人'], widths: [110, 220, 130, 130, 130, 140, 110, 140, 140, 110, 260, 180] }),
      rows: [
        row(['13185', 'Umair-Simos', '12', '23', '6', '2026-08-06', '16.6667%', '1', '1', '启用', people.tang, '2026-08-06 17:36:24'], { merchantId: '13185', customerName: 'Umair-Simos', status: '启用', ops: ['编辑'] }),
        row(['13183', 'Mat', '0', '1', '3', '2026-08-06', '33.3333%', '1', '1', '启用', people.tang, '2026-08-06 17:32:08'], { merchantId: '13183', customerName: 'Mat', status: '启用', ops: ['编辑'] }),
        row(['13249', '产品验收0112改名（内部）', '0', '1', '9', '2026-08-06', '22.2222%', '2', '2', '启用', people.tang, '2026-08-06 14:23:00'], { merchantId: '13249', customerName: '产品验收', status: '启用', ops: ['编辑'] }),
        row(['12816', 'Tobias', '10,000', '10,000', '1,000', '2026-08-01', '10%', '100', '100', '启用', people.li, '2026-08-05 09:08:20'], { merchantId: '12816', customerName: 'Tobias', status: '启用', ops: ['编辑'] }),
        row(['13224', 'ecomalbo-Gabrijell', '1', '1', '0.11', '2026-03-18', '88888.99%', '97.78', '0', '停用', people.tan, '2026-03-18 18:01:15'], { merchantId: '13224', customerName: 'ecomalbo', status: '停用', ops: ['编辑'] }),
        row(['1128', 'adstest', '1', '1', '0.11', '2026-03-18', '111111.11%', '122.22', '0', '停用', people.tan, '2026-03-18 17:56:08'], { merchantId: '1128', customerName: 'adstest', status: '停用', ops: ['编辑'] })
      ],
      modals: {
        '新增预充配置': {
          title: '新增预充配置',
          fields: [
            { key: 'merchantId', label: '商户ID', control: 'select', options: ['13185 / Umair-Simos', '13183 / Mat', '13249 / 产品验收0112改名（内部）', '1128 / adstest'], placeholder: '选择商户' },
            { key: 'historyRecharge', label: '历史充值($)', required: false, placeholder: '输入历史充值' },
            { key: 'historyConsume', label: '历史消耗($)', placeholder: '输入历史消耗' },
            { key: 'profit', label: '带来总利润($)', placeholder: '输入带来总利润' },
            { key: 'profitDate', label: '利润截止日期', type: 'date', placeholder: '选择利润截止日期' },
            { key: 'prechargeLimit', label: '预充金额上限($)', placeholder: '输入预充金额上限' },
            { key: 'status', label: '启用状态', control: 'select', options: statusOptions, placeholder: '选择启用状态' }
          ]
        },
        '编辑': { title: '编辑预充配置', fields: [
          { key: 'c0', label: '商户ID', control: 'readonly', required: false },
          { key: 'c1', label: '客户名称', control: 'readonly', required: false },
          { key: 'c2', label: '历史充值($)', required: false, placeholder: '输入历史充值' },
          { key: 'c3', label: '历史消耗($)', placeholder: '输入历史消耗' },
          { key: 'c4', label: '带来总利润($)', placeholder: '输入带来总利润' },
          { key: 'c5', label: '利润截止日期', placeholder: '选择利润截止日期' },
          { key: 'c7', label: '预充金额上限($)', placeholder: '输入预充金额上限' },
          { key: 'c9', label: '启用状态', control: 'select', options: statusOptions, placeholder: '选择启用状态' }
        ] }
      }
    },

    'system-dict': {
      title: '系统字典',
      tabs: [
        dictTab('transaction-type', '交易类型', [
          row(['728', '更新字典_260808173026', '启用', '2026-08-08 17:30:50', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['727', '更新字典_260807173132', '启用', '2026-08-07 17:31:41', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['726', '测试停用交易类型', '停用', '2026-08-06 17:30:56', people.admin], { status: '停用', ops: ['编辑', '启用'] })
        ]),
        dictTab('account-type', '广告账户类型', [
          row(['241', '广告账户类型123', '停用', '2026-06-29 15:53:06', people.ou], { status: '停用', ops: ['编辑', '启用'] }),
          row(['238', 'Applovin', '启用', '2026-04-08 15:43:23', people.cheng], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['179', 'Bing-企业户', '启用', '2025-12-06 12:01:36', 'system'], { status: '启用', ops: ['编辑', '禁用'] })
        ]),
        dictTab('media-platform', '媒体平台', [
          row(['708', 'Outbrain', '启用', '2026-07-25 11:31:50', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['670', '媒体字典测试', '停用', '2026-06-29 15:09:37', people.tan], { status: '停用', ops: ['编辑', '启用'] }),
          row(['21', 'Google', '启用', '2026-06-18 17:19:44', people.cheng], { status: '启用', ops: ['编辑', '禁用'] })
        ]),
        dictTab('delivery-country', '投放国家', [
          row(['901', '美国', 'United States', 'US', '启用', '2026-08-14 10:12:30', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['902', '加拿大', 'Canada', 'CA', '启用', '2026-08-14 10:12:30', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['903', '英国', 'United Kingdom', 'GB', '启用', '2026-08-14 10:12:30', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['904', '法国', 'France', 'FR', '启用', '2026-08-14 10:12:30', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['905', '荷兰', 'Netherlands', 'NL', '启用', '2026-08-14 10:12:30', people.ou], { status: '启用', ops: ['编辑', '禁用'] })
        ], {
          columnLabels: ['ID', '国家名称', '国家名称(英文)', '国家简称', '状态', '更新时间', '操作人'],
          columnOptions: { left: ['国家名称', '国家名称(英文)', '操作人'], status: ['状态'], person: ['操作人'], widths: [90, 140, 180, 120, 110, 180, 260] },
          tableMinWidth: 1280,
          fields: [
            { key: 'c1', label: '国家名称', placeholder: '输入国家名称' },
            { key: 'c2', label: '国家名称(英文)', placeholder: '输入国家英文名称' },
            { key: 'c3', label: '国家简称', placeholder: '输入国家简称，如 US' },
            { key: 'c4', label: '状态', control: 'select', options: statusOptions, placeholder: '选择状态' }
          ]
        }),
        dictTab('opening-category', '品类匹配', [
          row(['921', '健身与运动', 'Fitness & Sports', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['922', '母婴与亲子', 'Baby Kids & Parenting', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['923', '时尚与服装', 'Fashion & Apparel', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['924', '户外园艺与 DIY', 'Outdoor Garden & DIY', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['925', '玩具与游戏', 'Toys & Games', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['926', '宠物用品', 'Pet Supplies', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['927', '电子产品与智能设备', 'Electronics & Smart Gadgets', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['928', '美妆与个护', 'Beauty & Personal Care', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['929', '汽配与工具', 'Automotive & Tools', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['930', '珠宝腕表与配饰', 'Jewelry Watches & Accessories', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['931', '家居厨房与生活', 'Home Kitchen & Living', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['932', '口服健康保健与营养', 'Oral Health Wellness & Nutrition', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['933', '非口服健康保健与营养', 'Non-Oral Health Wellness & Nutrition', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['934', '其他', 'Other', '启用', '2026-08-27 10:16:08', people.ou], { status: '启用', ops: ['编辑', '禁用'] })
        ], {
          columnLabels: ['ID', '品类名称', '品类名称(英)', '状态', '更新时间', '操作人'],
          columnOptions: { left: ['品类名称', '品类名称(英)', '操作人'], status: ['状态'], person: ['操作人'], widths: [90, 160, 220, 110, 180, 260] },
          tableMinWidth: 1220,
          fields: [
            { key: 'c1', label: '品类名称', placeholder: '输入品类名称' },
            { key: 'c2', label: '品类名称(英)', placeholder: '输入品类英文名称' },
            { key: 'c3', label: '状态', control: 'select', options: statusOptions, placeholder: '选择状态' }
          ]
        }),
        dictTab('bd', 'BD', [
          row(['669', '吴文锐 (wuwenrui@bestfulfill.com)', '启用', '2026-06-29 15:01:46', people.tan], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['667', '程允良 (chengyunliang@bestfulfill.com)', '停用', '2026-06-29 14:59:29', people.tan], { status: '停用', ops: ['编辑', '启用'] }),
          row(['656', '毛琳清 (maolinqing@bestfulfill.com)', '启用', '2026-06-22 15:44:25', people.ou], { status: '启用', ops: ['编辑', '禁用'] })
        ]),
        dictTab('am', 'AM', [
          row(['668', '李志伟 (lizhiwei@bestfulfill.com)', '启用', '2026-06-29 14:57:09', people.tan], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['657', '毛琳清 (maolinqing@bestfulfill.com)', '启用', '2026-06-22 15:44:43', people.ou], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['654', '谭英就 (tanyingjiu@bestfulfill.com)', '启用', '2026-06-22 15:39:39', people.ou], { status: '启用', ops: ['编辑', '禁用'] })
        ]),
        dictTab('currency', '币种', [
          row(['130', 'EUR', '启用', '2025-10-28 11:31:08', '-'], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['131', 'GBP', '启用', '2025-10-28 11:31:08', '-'], { status: '启用', ops: ['编辑', '禁用'] }),
          row(['93', 'USD', '启用', '2025-07-09 18:04:15', 'system'], { status: '启用', ops: ['编辑', '禁用'] })
        ])
      ]
    },

    'permission-audit-log': {
      title: '权限审计日志',
      filters: [
        { key: 'date', label: '操作日期', type: 'daterange' },
        { key: 'operator', label: '操作人姓名', placeholder: '输入操作人姓名' },
        { key: 'module', label: '模块', type: 'select', options: ['子账号管理', '角色管理', '权限模块', '绑卡户管理'], placeholder: '选择模块' },
        { key: 'subModule', label: '子模块', type: 'select', options: ['子账号-创建', '子账号-编辑', '子账号-分配广告账户', '子账号-重置密码', '角色-编辑', '单客户功能权限', 'Slash 额度转移'], placeholder: '选择子模块' },
        { key: 'merchantId', label: '目标商户ID', placeholder: '输入目标商户ID' }
      ],
      actions: [exportAction],
      filterClass: 'cols-5',
      tableMinWidth: 1500,
      hideOperation: true,
      columns: columns(['操作ID', '操作时间', '操作人', '模块', '子模块', '执行对象', '操作内容'], { left: ['操作人', '执行对象', '操作内容'], person: ['操作人'], long: ['操作内容'], widths: [100, 180, 260, 150, 190, 220, 420] }),
      rows: [
        row(['965', '2026-08-09 16:42:18', people.zhang, '绑卡户管理', 'Slash 额度转移', '14229 / c_3bpoltc2u7sf1(7209)', '转入 c_w9x8y7z6v5u4t3(5678)，金额 200.00 USD'], { date: '2026-08-09', operator: '张宇', module: '绑卡户管理', subModule: 'Slash 额度转移', merchantId: '14229' }),
        row(['964', '2026-08-09 15:58:06', people.tang, '绑卡户管理', 'Slash 额度转移', '10152 / c_close_4821(4821)', '转入 c_backup_7301(7301)，金额 20.00 USD；转出卡存在未回收验卡额度，已强提醒'], { date: '2026-08-09', operator: '汤秀梅', module: '绑卡户管理', subModule: 'Slash 额度转移', merchantId: '10152' }),
        row(['963', '2026-08-06 15:18:25', people.wang, '子账号管理', '子账号-分配广告账户', '1128 / test19901007', '为子账号「test19901007」分配广告账户'], { date: '2026-08-06', operator: '王荣荣', module: '子账号管理', subModule: '子账号-分配广告账户', merchantId: '1128' }),
        row(['962', '2026-08-06 15:18:25', people.wang, '子账号管理', '子账号-创建', '1128 / test19901007', '创建子账号「test19901007」'], { date: '2026-08-06', operator: '王荣荣', module: '子账号管理', subModule: '子账号-创建', merchantId: '1128' }),
        row(['956', '2026-08-03 11:49:49', people.tang, '角色管理', '角色-编辑', '1128 / 超级管理员', '编辑角色「超级管理员」，权限 8 项'], { date: '2026-08-03', operator: '汤秀梅', module: '角色管理', subModule: '角色-编辑', merchantId: '1128' }),
        row(['950', '2026-07-30 17:36:15', people.tang, '权限模块', '单客户功能权限', '14606 / BestAds接口测试', '更新商户「BestAds接口测试」功能权限，共 74 项'], { date: '2026-07-30', operator: '汤秀梅', module: '权限模块', subModule: '单客户功能权限', merchantId: '14606' })
      ]
    },

    'client-menu': {
      title: '客户端菜单',
      filters: [
        { key: 'type', label: '类型', type: 'select', options: ['目录', '菜单', '按钮'], placeholder: '选择类型' },
        { key: 'keyword', label: '搜索', placeholder: '输入权限名称 / 权限标识 permission_mark' }
      ],
      actions: [{ id: 'create-menu', label: '新增菜单', icon: 'plus', primary: true }],
      filterClass: 'cols-5',
      treeRows: true,
      treeParentPattern: '.+',
      treeToggleColumnKey: 'c0',
      childTitle: '下级权限',
      tableMinWidth: 1320,
      opsWidth: 150,
      childOpsWidth: 130,
      columns: columns(['权限树', '类型', '权限标识', '前端路由', '排序', '更新时间'], { left: ['权限树', '权限标识', '前端路由'], status: ['类型'], widths: [260, 100, 240, 260, 90, 180] }),
      childColumns: columns(['权限树', '类型', '权限标识', '前端路由', '排序', '更新时间'], { left: ['权限树', '权限标识', '前端路由'], status: ['类型'], widths: [260, 100, 240, 260, 90, 180] }),
      rows: [
        row(['资产管理', '目录', 'asset_management', '-', '10', '2026-07-13 16:52:04'], { type: '目录', keyword: '资产管理 asset_management', ops: ['编辑', '新增下级'], children: [
          row(['广告账户', '菜单', 'asset_management.account', '/asset/account', '11', '2026-07-13 16:52:04'], { type: '菜单', keyword: '广告账户 asset_management.account', ops: ['编辑', '新增下级'] }),
          row(['查看资产', '按钮', 'asset_management.view', '-', '12', '2026-07-13 16:52:04'], { type: '按钮', keyword: '查看资产 asset_management.view', ops: ['编辑'] })
        ] }),
        row(['用户管理', '目录', 'user_management', '-', '20', '2026-07-13 16:52:07'], { type: '目录', keyword: '用户管理 user_management', ops: ['编辑', '新增下级'], children: [
          row(['客户子账号', '菜单', 'user_management.sub_account', '/user/sub-account', '21', '2026-07-13 16:52:07'], { type: '菜单', keyword: '客户子账号 user_management.sub_account', ops: ['编辑', '新增下级'] })
        ] }),
        row(['设置', '目录', 'setting', '-', '30', '2026-07-13 16:54:36'], { type: '目录', keyword: '设置 setting', ops: ['编辑', '新增下级'], children: [
          row(['通知设置', '菜单', 'setting.notice', '/setting/notice', '31', '2026-07-13 16:54:36'], { type: '菜单', keyword: '通知设置 setting.notice', ops: ['编辑', '新增下级'] })
        ] }),
        row(['广告投放', '目录', 'ad_delivery', '-', '40', '2026-07-13 16:52:10'], { type: '目录', keyword: '广告投放 ad_delivery', ops: ['编辑', '新增下级'], children: [] })
      ],
      modals: {
        '新增菜单': { title: '新增权限项', fields: permissionFields },
        '新增下级': { title: '新增权限项', fields: permissionFields },
        '编辑': { title: '编辑权限项', fields: permissionFields }
      }
    },

    'notification-config': {
      title: '通知配置',
      filters: [
        { key: 'keyword', label: '通知查询', placeholder: '输入通知查询' },
        { key: 'client', label: '客户端', type: 'select', options: ['Web', 'H5', 'Web,H5'], placeholder: '选择客户端' },
        { key: 'status', label: '状态', type: 'select', options: statusOptions, placeholder: '选择状态' }
      ],
      actions: [{ id: 'create-notice', label: '新增通知', icon: 'plus', primary: true }],
      filterClass: 'cols-5',
      tableMinWidth: 1560,
      opsWidth: 120,
      columns: columns(['ID', '通知任务', '客户端', '状态', '排序', '通知时间', '更新时间', '更新人'], { left: ['通知任务', '更新人'], status: ['状态'], person: ['更新人'], widths: [90, 260, 120, 100, 90, 260, 180, 260] }),
      rows: [
        row(['20', 'dou专属', 'H5,Web', '停用', '1', '2026-03-12 17:16:50 ~ 长久有效', '2026-04-28 15:30:24', people.admin], { keyword: 'dou专属 20', client: 'Web,H5', status: '停用', ops: ['详情', '编辑'] }),
        row(['22', 'test123', 'Web,H5', '启用', '1', '2026-03-13 11:22:41 ~ 长久有效', '2026-04-28 15:27:57', people.admin], { keyword: 'test123 22', client: 'Web,H5', status: '启用', ops: ['详情', '编辑'] }),
        row(['6', '234414', 'Web', '启用', '22', '2026-03-09 16:20:36 ~ 2026-03-19 16:20:36', '2026-03-12 17:30:41', people.cheng], { keyword: '234414 6', client: 'Web', status: '启用', ops: ['详情', '编辑'] }),
        row(['4', '111', 'H5', '停用', '1', '2026-03-09 16:20:36 ~ 2026-03-19 16:20:36', '2026-03-11 19:51:31', people.tan], { keyword: '111 4', client: 'H5', status: '停用', ops: ['详情', '编辑'] })
      ],
      modals: {
        '新增通知': { title: '新增通知', fields: [
          { key: 'task', label: '通知任务', maxLength: 100, placeholder: '输入通知任务' },
          { key: 'client', label: '客户端', control: 'checkbox', options: ['Web', 'H5'], placeholder: '选择客户端' },
          { key: 'status', label: '状态', control: 'select', options: statusOptions, placeholder: '选择状态' },
          { key: 'scope', label: '作用范围', control: 'select', options: ['全局'], placeholder: '选择作用范围' },
          { key: 'sort', label: '排序', placeholder: '输入排序' },
          { key: 'startAt', label: '开始时间', placeholder: '选择开始时间' },
          { key: 'endAt', label: '结束时间', required: false, placeholder: '选择结束时间' },
          { key: 'content', label: '内容', control: 'textarea', full: true, placeholder: '输入公告内容...' }
        ] },
        '编辑': { title: '编辑通知', fields: [
          { key: 'c1', label: '通知任务', maxLength: 100, placeholder: '输入通知任务' },
          { key: 'c2', label: '客户端', control: 'checkbox', options: ['Web', 'H5'], placeholder: '选择客户端' },
          { key: 'c3', label: '状态', control: 'select', options: statusOptions, placeholder: '选择状态' },
          { key: 'c4', label: '排序', placeholder: '输入排序' },
          { key: 'c5', label: '通知时间', placeholder: '选择通知时间' },
          { key: 'content', label: '内容', control: 'textarea', full: true, placeholder: '输入公告内容...' }
        ] },
        '详情': { title: '查看公告', fields: [
          { key: 'c1', label: '通知任务', control: 'readonly', required: false },
          { key: 'c5', label: '通知时间', control: 'readonly', required: false },
          { key: 'c6', label: '更新时间', control: 'readonly', required: false },
          { key: 'c7', label: '更新人', control: 'readonly', required: false },
          { key: 'content', label: '内容', control: 'textarea', full: true, required: false, placeholder: '展示公告正文、客户端和状态。' }
        ] }
      }
    },

    'ad-consumption-decline-reminder': {
      title: '消耗下降提醒配置',
      tabs: [
        {
          id: 'config',
          label: '配置',
          kpis: [
            { label: '全局最低判断消耗(元)', value: '100', hint: '更新时间 2026-04-09 18:09:09' },
            { label: '全局降幅阈值(%)', value: '10%', hint: '更新人：谭英就' },
            { label: '每日执行时间', value: '16:05:00', hint: '按测试环境展示' },
            { label: '提醒功能总开关', value: '关闭', hint: '可通过编辑全局配置调整' }
          ],
          filters: [
            { key: 'media', label: '媒体', type: 'select', options: mediaOptions, placeholder: '选择媒体' },
            { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
            { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }
          ],
          actions: [
            { id: 'edit-global', label: '编辑全局配置', icon: 'edit', primary: true },
            { id: 'create-exclusive', label: '添加专属配置', icon: 'plus' }
          ],
          filterClass: 'cols-5',
          tableMinWidth: 1340,
          opsWidth: 100,
          columns: columns(['媒体', '账户ID', '账户名称', '最低判断消耗(元)', '降幅阈值(%)', '更新时间', '更新人'], { left: ['账户名称', '更新人'], person: ['更新人'], widths: [120, 190, 260, 160, 140, 180, 260] }),
          rows: [
            row(['Facebook', '8545056082264075', 'MX-B-11-1181', '100', '1.11%', '2026-04-09 17:20:03', people.tan], { media: 'Facebook', accountId: '8545056082264075', accountName: 'MX-B-11-1181', ops: ['编辑'] }),
            row(['Facebook', '573938708665606', 'TL-B-07-1394', '1111', '11%', '2026-04-09 16:16:20', people.tan], { media: 'Facebook', accountId: '573938708665606', accountName: 'TL-B-07-1394', ops: ['编辑'] }),
            row(['Google', '9884526529', 'MUXUE TRADE LIMITED-0LHTD', '11111.11', '100%', '2026-04-09 11:09:09', people.tan], { media: 'Google', accountId: '9884526529', accountName: 'MUXUE TRADE LIMITED', ops: ['编辑'] })
          ]
        },
        {
          id: 'drop-records',
          label: '消耗降幅记录',
          filters: [
            { key: 'date', label: '日期范围', type: 'daterange', value: '2026-08-09' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
            { key: 'bd', label: '商务负责人', type: 'select', options: ['张三', '王荣荣', '汤秀梅'], placeholder: '选择商务负责人' },
            { key: 'am', label: '运营负责人', type: 'select', options: ['李志伟', '程允良', '谭英就'], placeholder: '选择运营负责人' },
            { key: 'media', label: '投放平台', type: 'select', options: mediaOptions, placeholder: '选择投放平台' },
            { key: 'status', label: '处理状态', type: 'select', options: ['待处理', '已处理', '忽略'], placeholder: '选择处理状态' },
            { key: 'accountKeyword', label: '账户 ID / 名称', placeholder: '输入账户 ID / 名称' }
          ],
          actions: [{ id: 'batch-process', label: '批量处理', icon: 'tasks', primary: true, requiresSelection: true }, exportAction],
          selectable: true,
          filterClass: 'cols-5',
          tableMinWidth: 2240,
          opsWidth: 130,
          columns: columns(['执行日期', '客户名称', '商务负责人', '运营负责人', '投放平台', '广告账户ID', '广告账户名称', 'T-2 消耗', 'T-1 消耗', '降幅', '适用阈值', '状态', '处理人', '处理时间', '备注'], { left: ['客户名称', '商务负责人', '运营负责人', '广告账户名称', '处理人', '备注'], person: ['商务负责人', '运营负责人', '处理人'], status: ['状态'], widths: [120, 200, 240, 240, 120, 180, 240, 120, 120, 100, 110, 110, 240, 180, 260] }),
          rows: [
            row(['2026-08-09', 'adstest', people.wang, people.li, 'Facebook', '8545056082264075', 'MX-B-11-1181', '1,200.00', '360.00', '70%', '1.11%', '待处理', '-', '-', '-'], { date: '2026-08-09', customerName: 'adstest', bd: '王荣荣', am: '李志伟', media: 'Facebook', status: '待处理', accountKeyword: '8545056082264075 MX-B-11-1181', ops: ['处理'] }),
            row(['2026-08-08', 'test金额变动', people.tang, people.cheng, 'Google', '9884526529', 'MUXUE TRADE LIMITED-0LHTD', '980.00', '430.00', '56%', '100%', '已处理', people.tan, '2026-08-08 18:12:20', '已确认客户主动降预算'], { date: '2026-08-08', customerName: 'test金额变动', bd: '汤秀梅', am: '程允良', media: 'Google', status: '已处理', accountKeyword: '9884526529 MUXUE', ops: ['详情'] })
          ]
        }
      ],
      modals: {
        '编辑全局配置': { title: '编辑全局配置', fields: [
          { key: 'minConsumption', label: '全局最低判断消耗(元)', placeholder: '输入全局最低判断消耗' },
          { key: 'threshold', label: '全局降幅阈值(%)', placeholder: '输入全局降幅阈值' },
          { key: 'executeTime', label: '每日执行时间', placeholder: '选择每日执行时间' },
          { key: 'enabled', label: '提醒功能总开关', control: 'select', options: ['开启', '关闭'], placeholder: '选择开关' }
        ] },
        '添加专属配置': { title: '添加专属配置', fields: [
          { key: 'media', label: '媒体', control: 'select', options: mediaOptions, placeholder: '选择媒体' },
          { key: 'account', label: '广告账户', control: 'account-search', full: true, options: ['8545056082264075 / MX-B-11-1181 / Facebook', '573938708665606 / TL-B-07-1394 / Facebook', '9884526529 / MUXUE TRADE LIMITED-0LHTD / Google'], placeholder: '输入广告账户名称/ID搜索' },
          { key: 'minConsumption', label: '最低判断消耗(元)', placeholder: '输入最低判断消耗' },
          { key: 'threshold', label: '降幅阈值(%)', placeholder: '输入降幅阈值' }
        ] },
        '编辑': { title: '编辑专属配置', fields: [
          { key: 'c0', label: '媒体', control: 'readonly', required: false },
          { key: 'c1', label: '账户ID', control: 'readonly', required: false },
          { key: 'c2', label: '账户名称', control: 'readonly', required: false },
          { key: 'c3', label: '最低判断消耗(元)', placeholder: '输入最低判断消耗' },
          { key: 'c4', label: '降幅阈值(%)', placeholder: '输入降幅阈值' }
        ] },
        '处理': { title: '处理消耗降幅记录', fields: [
          { key: 'status', label: '处理状态', control: 'select', options: ['已处理', '忽略'], placeholder: '选择处理状态' },
          { key: 'remark', label: '备注', control: 'textarea', full: true, placeholder: '请输入处理备注' }
        ] },
        '详情': { title: '消耗降幅记录详情', fields: [
          { key: 'c0', label: '执行日期', control: 'readonly', required: false },
          { key: 'c1', label: '客户名称', control: 'readonly', required: false },
          { key: 'c6', label: '广告账户名称', control: 'readonly', required: false },
          { key: 'c14', label: '备注', control: 'textarea', full: true, required: false }
        ] },
        '批量处理': { title: '批量处理消耗降幅记录', fields: [
          { key: 'status', label: '处理状态', control: 'select', options: ['已处理', '忽略'], placeholder: '选择处理状态' },
          { key: 'remark', label: '备注', control: 'textarea', full: true, placeholder: '请输入处理备注' }
        ] }
      }
    },

    'paypal-pay-whitelist': {
      title: '在线支付白名单',
      filters: [
        { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
        { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
        { key: 'payChannel', label: '支付渠道', type: 'select', options: ['PayPal', 'Stripe', '银行卡'], placeholder: '选择支付渠道' },
        { key: 'status', label: '状态', type: 'select', options: statusOptions, placeholder: '选择状态' }
      ],
      actions: [{ id: 'create-whitelist', label: '新增白名单', icon: 'plus', primary: true }, exportAction],
      filterClass: 'cols-5',
      tableMinWidth: 1500,
      columns: columns(['商户ID', '客户名称', '支付渠道', '单笔限额', '日累计限额', '币种', '状态', '生效时间', '失效时间', '更新人', '更新时间'], { left: ['客户名称', '更新人'], person: ['更新人'], status: ['状态'], widths: [110, 180, 120, 120, 120, 90, 100, 170, 170, 240, 170] }),
      rows: [
        row(['1128', 'adstest', 'PayPal', '5,000.00', '20,000.00', 'USD', '启用', '2026-08-01 00:00', '2026-12-31 23:59', people.tang, '2026-08-08 12:10:04'], { merchantId: '1128', customerName: 'adstest', payChannel: 'PayPal', status: '启用', ops: ['编辑', '停用'] })
      ]
    }
  };

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, configs);
})();
