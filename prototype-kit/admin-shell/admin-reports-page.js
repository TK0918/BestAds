/*
 * BestAds 运营端「报表」模块配置。
 * 页面字段、Tab、按钮、样例数据按测试环境报表模块抽取；原型不调用真实接口。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const tag = value => {
    const text = asText(value);
    const cls = /启用|成功|不冲突|正常/.test(text) ? 'status-success' : /停用|失败|冲突|异常/.test(text) ? 'status-danger' : /待|处理中/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const text = value => `<span class="wrap">${esc(asText(value))}</span>`;
  const money = value => `<span class="amount-zero">${esc(asText(value))}</span>`;
  const person = value => `<span class="person-cell">${esc(asText(value))}</span>`;

  const mediaOptions = ['Facebook', 'Google', 'TikTok', 'Applovin', 'X'];
  const industryOptions = ['Fashion & Apparel', 'Beauty & Personal Care', 'Home & Garden', 'Health & Fitness', '未设定'];
  const bdOptions = ['张三(zhangsan@bestfulfill.com)', '王五(wangwu@bestfulfill.com)', '谭英就(tanyingjiu@bestfulfill.com)'];
  const amOptions = ['李四(lisi@bestfulfill.com)', '赵六(zhaoliu@bestfulfill.com)', '汤秀梅(tangxiumei@bestfulfill.com)'];
  const accountTypeOptions = ['Facebook-企业户', 'Facebook-绿通户', 'Facebook-三不限', 'Google-海外户'];
  const agentOptions = ['蓝标', '省广', '维卓', '飞书深诺', 'Rockads'];
  const accountStatusOptions = ['ACTIVE', 'DISABLED', 'CLOSED', 'PENDING_REVIEW'];
  const exportAction = { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' };
  const customFieldsAction = { id: 'custom-fields', label: '自定义字段', icon: 'columns', align: 'right' };

  function columns(labels, options = {}) {
    const left = new Set(options.left || []);
    const status = new Set(options.status || []);
    const long = new Set(options.long || []);
    const personCols = new Set(options.person || []);
    return labels.map((label, index) => {
      const col = { key: `c${index}`, label, width: options.widths?.[index] || 140 };
      if (left.has(label)) col.align = 'left';
      if (long.has(label)) { col.align = 'left'; col.width = Math.max(col.width, 260); col.format = text; }
      if (personCols.has(label)) { col.align = 'left'; col.width = Math.max(col.width, 220); col.format = person; }
      if (status.has(label)) col.format = tag;
      if (/金额|消耗|余额|收款|充值|费用|利润|支出|净值|预算|展示|点击|转化|CTR|CVR|CPC|CPM|CPA|ROAS|环比|变化|占比|数量|账户数|关联卡数/.test(label)) { col.num = true; col.sort = true; col.format = col.format || money; }
      if (/日期|时间|ID/.test(label)) col.sort = true;
      return col;
    });
  }

  function row(values, extra = {}) {
    return Object.assign(values.reduce((acc, value, index) => ({ ...acc, [`c${index}`]: value }), {}), extra);
  }

  const reportConfigs = {
    'industry-report': {
      title: '行业报表',
      filters: [
        { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
        { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
        { key: 'url', label: 'URL地址', placeholder: '输入URL地址' },
        { key: 'industry', label: '行业', type: 'select', options: industryOptions, placeholder: '选择行业' },
        { key: 'reportDate', label: '报告日期', type: 'date' }
      ],
      actions: [exportAction],
      filterClass: 'cols-5',
      tableMinWidth: 1560,
      opsWidth: 110,
      columns: columns(['商户ID', '客户名称', '广告账户ID', '广告账户名称', '广告ID', '币种', '消耗', '行业', '报告输出日期', 'URL地址'], { left: ['客户名称', '广告账户名称'], long: ['URL地址'], widths: [110, 170, 180, 220, 200, 90, 120, 160, 140, 360] }),
      rows: [
        row(['-', '-', '1142946300856936', 'HQ-B-05-428', '120248807670400598', 'USD', '56,391.01', '-', '2026-08-03', 'https://leonieandco.com/products/3d-anti-cellulite-legging'], { merchantId: '-', accountId: '1142946300856936', url: 'leonieandco', reportDate: '2026-08-03', ops: ['修改行业'] }),
        row(['-', '-', '829910873268251', 'HQ-B-00-1229', '120251562476080325', 'USD', '31,889.99', '-', '2026-08-03', 'https://www.facebook.com/171756622678791/posts/122292087776085209'], { accountId: '829910873268251', url: 'facebook', reportDate: '2026-08-03', ops: ['修改行业'] }),
        row(['-', '-', '931850696224874', '#4609 - ashveil 160 - PP - RHKA', '120249102329860379', 'USD', '19,239.37', 'Fashion & Apparel', '2026-08-03', 'https://noorqalb.com/collections/best-sellers'], { accountId: '931850696224874', industry: 'Fashion & Apparel', url: 'noorqalb', reportDate: '2026-08-03', ops: ['修改行业'] })
      ],
      modals: {
        '修改行业': { title: '修改行业', fields: [{ key: 'industry', label: '行业', control: 'select', options: industryOptions, placeholder: '选择行业' }] }
      }
    },

    'customer-fund-change-report': {
      title: '客户资金变动',
      filters: [
        { key: 'date', label: '日期范围', type: 'daterange' },
        { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
        { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }
      ],
      actions: [exportAction, { id: 'refresh-trend', label: '刷新趋势', icon: 'sync', align: 'right' }],
      kpis: [
        { label: '客户数', value: '7', hint: '当前筛选命中的客户资金样本' },
        { label: '钱包变动金额', value: '$ 0', hint: '钱包变动趋近 0 为健康状态' },
        { label: '消耗金额', value: '$ 9,491.96', hint: '选中客户后查看每日资金链路趋势' }
      ],
      charts: [
        { title: '客户资金变动趋势', type: 'bar', items: [{ label: '钱包变动', value: 0, display: '0', color: '#006be6' }, { label: '打款金额', value: 300, display: '300.00', color: '#67c23a' }, { label: '消耗金额', value: 9492, display: '9,491.96', color: '#d7a51a' }] }
      ],
      tableMinWidth: 1120,
      hideOperation: true,
      columns: columns(['商户ID', '客户名称', '币种', '钱包余额', '昨日总资产净值', '钱包变动金额', '打款金额', '支出金额', '消耗金额'], { left: ['客户名称'], widths: [110, 180, 90, 150, 170, 160, 140, 140, 140] }),
      rows: [
        row(['12891', 'Examy', 'USD', '0', '0', '0', '0', '0', '9,491.96'], { merchantId: '12891', customerName: 'Examy' }),
        row(['10152', '电商三组（Mindxis）', 'USD', '12,930.20', '48,120.55', '300.00', '300.00', '0', '60,166.52'], { merchantId: '10152', customerName: '电商三组' })
      ]
    },

    'overall-income-expense': {
      title: '整体收支监控',
      filters: [
        { key: 'dimension', label: '统计维度', type: 'select', options: ['日', '周', '月'], placeholder: '日' },
        { key: 'date', label: '日期范围', type: 'daterange' }
      ],
      kpis: [
        { label: '收入', value: '$ 1,280,000', hint: '按统计维度汇总' },
        { label: '支出', value: '$ 1,182,000', hint: '广告充值、清零、减款等支出口径' },
        { label: '收支差额', value: '$ 98,000', hint: '收入 - 支出' }
      ],
      tableMinWidth: 980,
      hideOperation: true,
      charts: [
        { title: '收入 / 支出趋势', type: 'bar', items: [{ label: '收入', value: 128, display: '1,280,000', color: '#006be6' }, { label: '支出', value: 118, display: '1,182,000', color: '#67c23a' }, { label: '收支差额', value: 9.8, display: '98,000', color: '#d7a51a' }] }
      ],
      columns: columns(['日期', '统计维度', '币种', '收入', '支出', '收支差额', '趋势说明'], { long: ['趋势说明'] }),
      rows: [
        row(['2026-08-09', '日', 'USD', '185,200', '172,800', '12,400', '测试环境以图表展示；原型同步保留趋势图和摘要表。']),
        row(['2026-08-08', '日', 'USD', '164,500', '158,900', '5,600', '收支差额稳定。'])
      ],
      hideOperation: true
    },

    'recharge-distribution-report': {
      title: '充值分布',
      filters: [{ key: 'date', label: '日期范围', type: 'daterange' }],
      kpis: [
        { label: '默认范围', value: '最近15天', hint: '含昨日' },
        { label: '充值类型数', value: '4', hint: '悬停查看类型明细与占比' },
        { label: '最大充值类型', value: '账户充值', hint: '示意数据' }
      ],
      tableMinWidth: 980,
      hideOperation: true,
      charts: [
        { title: '充值类型占比', type: 'donut', center: '充值', items: [{ label: '在线充值', value: 62.4, display: '62.4%', color: '#006be6' }, { label: '线下转账', value: 37.6, display: '37.6%', color: '#67c23a' }] },
        { title: '充值金额趋势', type: 'bar', items: [{ label: '8月6日', value: 72, display: '720,000' }, { label: '8月7日', value: 96, display: '960,000' }, { label: '8月8日', value: 135, display: '1,350,000' }] }
      ],
      columns: columns(['日期', '充值类型', '币种', '金额', '占比', '说明'], { left: ['说明'], long: ['说明'] }),
      rows: [
        row(['2026-08-08', '在线充值', 'USD', '842,000', '62.4%', '客户在线充值占比最高。']),
        row(['2026-08-08', '线下转账', 'USD', '508,000', '37.6%', '线下转账进入客户流水审核。'])
      ]
    },

    'profit-distribution': {
      title: '预计利润分布',
      filters: [{ key: 'date', label: '日期范围', type: 'daterange' }],
      kpis: [
        { label: '默认范围', value: '最近15天', hint: '含昨日' },
        { label: '预计利润', value: '$ 137,218.51', hint: '按服务费与返点估算' },
        { label: 'TOP异动', value: '3', hint: '点击柱子查看下方 TOP 异动分析' }
      ],
      tableMinWidth: 1080,
      hideOperation: true,
      charts: [
        { title: '预计利润分布', type: 'bar', items: [{ label: '电商三组（Mindxis）', value: 18430, display: '18,430.22' }, { label: 'Examy', value: 9492, display: '9,491.96', color: '#67c23a' }] },
        { title: '利润环比', type: 'donut', center: '环比', items: [{ label: '增长', value: 64, display: '64%', color: '#67c23a' }, { label: '下降', value: 36, display: '36%', color: '#f56c6c' }] }
      ],
      columns: columns(['日期', '客户', '币种', '预计利润', '利润变化', '环比', '异动说明'], { left: ['客户', '异动说明'], long: ['异动说明'] }),
      rows: [
        row(['2026-08-08', '电商三组（Mindxis）', 'USD', '18,430.22', '2,140.00', '13.14%', '消耗增长带动预计利润增加。']),
        row(['2026-08-07', 'Examy', 'USD', '9,491.96', '-344.15', '-3.50%', '账户类型消耗下降。'])
      ]
    },

    'consumption-distribution': {
      title: '消耗分布',
      filters: [{ key: 'date', label: '日期范围', type: 'daterange' }],
      kpis: [
        { label: '上月总消耗', value: '--', hint: '自然月合计' },
        { label: '本月总消耗', value: '5,997,089.71', hint: '本月累计至今日' },
        { label: '本月总利润', value: '137,218.51', hint: '本月累计至今日' },
        { label: '时间进度', value: '29.03%', hint: '按自然月进度计算' }
      ],
      tabs: [
        {
          id: 'monthly-consume-rank',
          label: '当月累计消耗榜',
          charts: [
            { title: '当月累计消耗榜 Top', type: 'bar', items: [{ label: '电商三组（Mindxis）', value: 60166, display: '60,166.52' }, { label: 'Examy', value: 9492, display: '9,491.96', color: '#67c23a' }] }
          ],
          tableMinWidth: 980,
          hideOperation: true,
          columns: columns(['排名', '客户', '商户ID', '币种', '累计消耗', '累计利润', '说明'], { left: ['客户', '说明'] }),
          rows: [
            row(['1', '电商三组（Mindxis）', '10152', 'USD', '60,166.52', '3,010.95', '当前累计消耗排名靠前。']),
            row(['2', 'Examy', '12891', 'USD', '9,491.96', '1,146.69', '测试环境榜单摘要。'])
          ]
        },
        {
          id: 'daily-change-rank',
          label: '日消耗排名异动榜',
          charts: [
            { title: '日消耗排名异动', type: 'bar', items: [{ label: 'Lucas De Souza 1', value: 452.66, display: '452.66%' }, { label: 'Examy', value: 38.5, display: '38.50%', color: '#d7a51a' }] }
          ],
          tableMinWidth: 980,
          hideOperation: true,
          columns: columns(['排名', '客户', '币种', '昨日消耗', '今日消耗', '变化', '环比'], { left: ['客户'] }),
          rows: [
            row(['1', 'Lucas De Souza 1', 'USD', '17.66', '97.60', '79.94', '452.66%'])
          ]
        }
      ]
    },

    'customer-reconciliation-daily-report': {
      title: '客户对账日报',
      tabs: [
        {
          id: 'daily',
          label: '日报',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID（精准搜索）' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
            { key: 'statDate', label: '统计日期', type: 'date', value: '2026-08-08' }
          ],
          actions: [exportAction],
          tableMinWidth: 3040,
          hideOperation: true,
          columns: columns(['统计日期', '商户ID', '客户名称', '客户状态', '币种', '期初收款', '期初充值', '期初消耗', '期初其他费用', '收款总额', '充值总额', '其他费用总额', '我司总服务费', '代理总服务费', '消耗总额', '本月收款', '本月充值', '本月其他费用', '我司本月服务费', '代理本月服务费', '本月消耗', '累计未充值余额', '累计消耗余额'], { left: ['客户名称'], status: ['客户状态'] }),
          rows: [
            row(['2026-08-08', '12040', 'Fouad/Blu', '停用', 'USD', '0', '0', '0', '0', '1,377,163.91', '1,265,970.97', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '111,192.94', '0'], { merchantId: '12040', customerName: 'Fouad/Blu', statDate: '2026-08-08' }),
            row(['2026-08-08', '13312', 'Fouad', '启用', 'USD', '25,126,034.12', '25,018,248.63', '24,982,955.7', '8,145.84', '25,126,034.12', '25,018,248.63', '8,145.84', '0', '0', '0', '0', '0', '0', '0', '0', '0', '99,639.65', '0'], { merchantId: '13312', customerName: 'Fouad', statDate: '2026-08-08' })
          ]
        },
        {
          id: 'initial-data',
          label: '期初数据设定',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID（精准搜索）' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }
          ],
          actions: [{ id: 'upload', label: '批量上传', icon: 'upload' }, { id: 'download-template', label: '模板下载', icon: 'download', align: 'right' }, exportAction],
          tableMinWidth: 1580,
          opsWidth: 110,
          columns: columns(['商户ID', '客户名称', '币种', '期初应收款', '期初充值', '期初消耗', '期初其他费用', '期初日期', '修改人', '最后修改时间'], { left: ['客户名称'], person: ['修改人'] }),
          rows: [
            row(['14229', 'test金额变动', 'USD', '20', '20', '10', '5', '2026-08-05', '汤秀梅(tangxiumei@bestfulfill.com)', '2026-08-08 19:24:14'], { merchantId: '14229', customerName: 'test金额变动', ops: ['编辑', '删除'] })
          ],
          modals: {
            '编辑': { title: '编辑期初数据', fields: [{ key: 'c0', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'c1', label: '客户名称', placeholder: '请输入客户名称' }, { key: 'c2', label: '币种', control: 'select', options: ['USD', 'EUR', 'HKD', 'CNY'], placeholder: '选择币种' }, { key: 'c3', label: '期初应收款', placeholder: '请输入期初应收款' }, { key: 'c4', label: '期初充值', placeholder: '请输入期初充值' }, { key: 'c5', label: '期初消耗', placeholder: '请输入期初消耗' }, { key: 'c6', label: '期初其他费用', placeholder: '请输入期初其他费用' }, { key: 'c7', label: '期初日期', placeholder: 'YYYY-MM-DD' }] },
            '删除': { type: 'confirm', title: '删除期初数据', danger: true, copy: '确认删除当前客户的期初数据？删除后将影响客户对账日报期初口径。原型只展示确认态，不会调用真实接口。' }
          }
        }
      ]
    },

    'weekly-ad-data-report': {
      title: '广告周数据',
      tabs: [
        { id: 'account-type-change', label: '账户类型变化', filters: [{ key: 'week', label: '时间范围（自然周）', type: 'textrange', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }, { key: 'accountType', label: '账户类型', type: 'select', options: accountTypeOptions, placeholder: '选择账户类型' }], actions: [exportAction], tableMinWidth: 1080, hideOperation: true, columns: columns(['账户类型', '币种', '6.22～6.28', '7.27～8.2', '变化', '环比'], { left: ['账户类型'] }), rows: [row(['Facebook-GRADYN', 'USD', '344.15', '0', '-344.15', '-100 %']), row(['Google-海外户', 'USD', '0', '0', '0', '0 %'])] },
        { id: 'industry', label: '行业', filters: [{ key: 'week', label: '时间范围（自然周）', type: 'textrange', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }, { key: 'industry', label: '行业', type: 'select', options: industryOptions, placeholder: '选择行业' }], actions: [exportAction], tableMinWidth: 1080, hideOperation: true, columns: columns(['行业', '币种', '6.22～6.28', '7.27～8.2', '变化', '环比'], { left: ['行业'] }), rows: [row(['未设定', 'USD', '342', '1,770,331.21', '1,769,989.21', '517,540.7 %'])] },
        { id: 'new-customer-top', label: '新增客户TOP 20', filters: [{ key: 'week', label: '时间范围（自然周）', type: 'textrange', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }], actions: [exportAction], tableMinWidth: 1280, hideOperation: true, columns: columns(['商户ID', '客户名称', 'BD', 'AM', '币种', '消耗金额', '消耗变动', '环比'], { left: ['客户名称'], person: ['BD', 'AM'] }), rows: [row(['10152', '电商三组（Mindxis）', '-', '-', 'USD', '60,166.52', '60,166.52', '100 %'])] },
        { id: 'new-data-table', label: '新数据表', filters: [{ key: 'week', label: '时间范围（自然周）', type: 'textrange', startPlaceholder: '开始时间', endPlaceholder: '结束时间' }, { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'bd', label: 'BD', type: 'select', options: bdOptions, placeholder: '选择BD' }, { key: 'am', label: 'AM', type: 'select', options: amOptions, placeholder: '选择AM' }, { key: 'customerLevel', label: '客户级别', type: 'select', options: ['全部', '新客', '老客'], placeholder: '选择客户级别' }], actions: [exportAction], filterClass: 'cols-5', tableMinWidth: 1880, hideOperation: true, columns: columns(['商户ID', '客户名称', '首次消耗', '注册时间', '客户级别', 'BD', 'AM', '媒体', '币种', '7.13～7.19', '7.20～7.26', '7.27～8.2', '变化', '环比'], { left: ['客户名称'], person: ['BD', 'AM'] }), rows: [row(['10152', '电商三组（Mindxis）', '2025-10-10', '2025-10-10', '-', '-', '-', '全部', 'USD', '0', '0', '60,166.52', '60,166.52', '100 %'], { merchantId: '10152', customerName: '电商三组' })] }
      ]
    },

    'ad-customer-performance-report': {
      title: '广告客户表现',
      tabs: [
        { id: 'custom-dimension', label: '自定义维度', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'merchantIds', label: '商户ID内容', type: 'textarea', placeholder: '粘贴商户ID，一行一个，或使用空格/逗号分隔' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'bd', label: 'BD', type: 'select', options: bdOptions, placeholder: '选择BD' }, { key: 'am', label: 'AM', type: 'select', options: amOptions, placeholder: '选择AM' }, { key: 'platform', label: '投放平台', type: 'select', options: mediaOptions, placeholder: '选择投放平台' }, { key: 'agent', label: '代理', type: 'multiselect', options: agentOptions }, { key: 'accountStatus', label: '广告账户状态', type: 'multiselect', options: accountStatusOptions }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'campaignId', label: 'Campaign ID', placeholder: '输入Campaign ID' }, { key: 'campaignName', label: 'Campaign名称', placeholder: '输入Campaign名称' }, { key: 'adsetId', label: 'Adset ID', placeholder: '输入Adset ID' }, { key: 'adsetName', label: 'Adset名称', placeholder: '输入Adset名称' }, { key: 'adId', label: 'Ad ID', placeholder: '输入Ad ID' }, { key: 'adName', label: 'Ad名称', placeholder: '输入Ad名称' }, { key: 'url', label: '落地页url', placeholder: '输入落地页url' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业', type: 'select', options: industryOptions, placeholder: '选择行业' }], actions: [exportAction], filterClass: 'cols-5', dimensionGroups: [{ key: 'dateDimension', title: '日期维度', exclusive: true, options: [{ label: '日' }, { label: '自然周' }, { label: '自然月' }] }, { key: 'businessDimension', title: '业务维度', options: [{ label: '客户', checked: true }, { label: '投放平台' }, { label: '代理', checked: true }, { label: '账户类型' }, { label: '广告账户' }, { label: 'Campaign' }, { label: 'Adset' }, { label: 'Ad' }, { label: '国家/地区' }, { label: '行业' }] }], tableMinWidth: 2260, hideOperation: true, columns: columns(['日期分组', '商户ID', '客户名称', 'BD', 'AM', '投放平台', '代理', '账户类型', '广告账户状态', '币种', '消耗', '展示', '点击', '转化', '收入/转化价值', 'CTR', 'CVR', 'CPC', 'CPM', 'CPA', 'ROAS'], { left: ['客户名称'], person: ['BD', 'AM'], status: ['广告账户状态'] }), rows: [row(['7月27日～8月2日', '10152', '电商三组（Mindxis）', '张三(zhangsan@bestfulfill.com)', '李四(lisi@bestfulfill.com)', 'Facebook', '蓝标', 'Facebook-企业户', 'ACTIVE', 'USD', '60,166.52', '1,204,332', '42,193', '1,850', '92,100.00', '3.50%', '4.38%', '1.43', '49.96', '32.52', '1.53'], { merchantId: '10152', customerName: '电商三组', agent: '蓝标', accountStatus: 'ACTIVE' })] },
        { id: 'meta-dashboard', label: 'Meta多维度看板', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'merchantIds', label: '商户ID内容', type: 'textarea', placeholder: '粘贴商户ID，一行一个，或使用空格/逗号分隔' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'bd', label: 'BD', type: 'select', options: bdOptions, placeholder: '选择BD' }, { key: 'am', label: 'AM', type: 'select', options: amOptions, placeholder: '选择AM' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }], actions: [exportAction], filterClass: 'cols-5', tableMinWidth: 1760, hideOperation: true, columns: columns(['维度', 'Top1 标签', 'Top1 花费占比(维度内)', '维度值', '币种', '花费', '花费占比', '展示', '点击', '转化', 'CPM', 'CTR', 'CPC', 'CPA', 'ROAS'], { left: ['Top1 标签', '维度值'] }), rows: [row(['版位', '-', '0%', 'Feed', 'USD', '0', '0%', '0', '0', '0', '0', '0%', '0', '0', '0'])] },
        { id: 'customer', label: '客户', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'customerStatus', label: '客户状态', type: 'select', options: ['启用', '停用'], placeholder: '选择客户状态' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 2600, hideOperation: true, columns: columns(['日期', '商户ID', '客户名称', '所属BD', '所属AM', '国家/地区', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', '转化价值', 'ROAS', '昨日消耗', '消耗环比增长率', '客户状态', '账户数量'], { left: ['客户名称'], person: ['所属BD', '所属AM'], status: ['客户状态'] }), rows: [] },
        { id: 'account', label: '广告账户', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'customer', label: '所属客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择所属客户' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'accountType', label: '账户类型', type: 'select', options: accountTypeOptions, placeholder: '选择账户类型' }, { key: 'platform', label: '投放平台', type: 'select', options: mediaOptions, placeholder: '选择投放平台' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业分类', type: 'select', options: industryOptions, placeholder: '选择行业分类' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 2920, hideOperation: true, columns: columns(['日期', '所属客户ID', '所属客户名称', '所属BD', '所属AM', '广告账户ID', '广告账户名称', '国家/地区', '投放平台', '行业分类', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', 'ROAS', '账户类型', 'Campaign数量', '昨日消耗', '消耗环比增长率'], { left: ['所属客户名称', '广告账户名称'], person: ['所属BD', '所属AM'] }), rows: [] },
        { id: 'customer-ad-data', label: '客户广告数据', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'customerStatus', label: '客户状态', type: 'select', options: ['启用', '停用'], placeholder: '选择客户状态' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 2600, hideOperation: true, columns: columns(['日期', '商户ID', '客户名称', '所属BD', '所属AM', '国家/地区', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', '转化价值', 'ROAS', '昨日消耗', '消耗环比增长率', '客户状态', '账户数量'], { left: ['客户名称'], person: ['所属BD', '所属AM'], status: ['客户状态'] }), rows: [] },
        { id: 'account-ad-data', label: '广告账户广告数据', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'customer', label: '所属客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择所属客户' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'accountType', label: '账户类型', type: 'select', options: accountTypeOptions, placeholder: '选择账户类型' }, { key: 'platform', label: '投放平台', type: 'select', options: mediaOptions, placeholder: '选择投放平台' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业分类', type: 'select', options: industryOptions, placeholder: '选择行业分类' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 2920, hideOperation: true, columns: columns(['日期', '所属客户ID', '所属客户名称', '所属BD', '所属AM', '广告账户ID', '广告账户名称', '国家/地区', '投放平台', '行业分类', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', 'ROAS', '账户类型', 'Campaign数量', '昨日消耗', '消耗环比增长率'], { left: ['所属客户名称', '广告账户名称'], person: ['所属BD', '所属AM'] }), rows: [] },
        { id: 'campaign', label: 'Campaign', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'customer', label: '所属客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择所属客户' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'campaignId', label: 'Campaign ID', placeholder: '输入Campaign ID' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业分类', type: 'select', options: industryOptions, placeholder: '选择行业分类' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 3800, hideOperation: true, columns: columns(['日期', '所属客户ID', '所属客户名称', '所属BD', '所属AM', '所属广告账户ID', '所属广告账户名称', 'Campaign ID', 'Campaign名称', '状态', '推广目标', '国家/地区', '行业分类', '投放平台', '账户币种', '日预算', '总预算', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', '转化价值', 'ROAS', 'Adset数量', '昨日消耗', '消耗环比增长率'], { left: ['所属客户名称', '所属广告账户名称', 'Campaign名称'], person: ['所属BD', '所属AM'], status: ['状态'] }), rows: [] },
        { id: 'adset', label: 'Adset', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'customer', label: '所属客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择所属客户' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'campaignId', label: '所属Campaign', placeholder: '输入Campaign ID' }, { key: 'adsetId', label: 'Adset ID', placeholder: '输入Adset ID' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业分类', type: 'select', options: industryOptions, placeholder: '选择行业分类' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 4000, hideOperation: true, columns: columns(['日期', '所属客户ID', '所属客户名称', '所属BD', '所属AM', '所属广告账户ID', '所属广告账户名称', '所属Campaign ID', '所属Campaign名称', 'Adset ID', 'Adset名称', '状态', '竞价策略', '竞价', '国家/地区', '行业分类', '账户币种', '日预算', '总预算', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', '转化价值', 'ROAS', 'Ad数量', '昨日消耗', '消耗环比增长率'], { left: ['所属客户名称', '所属广告账户名称', '所属Campaign名称', 'Adset名称'], person: ['所属BD', '所属AM'], status: ['状态'] }), rows: [] },
        { id: 'ad', label: 'Ad', filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'customer', label: '广告客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择广告客户' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'campaignId', label: '所属Campaign', placeholder: '输入Campaign ID' }, { key: 'adsetId', label: '所属Adset', placeholder: '输入Adset ID' }, { key: 'adId', label: 'Ad ID', placeholder: '输入Ad ID' }, { key: 'country', label: '国家/地区', type: 'select', options: ['US', 'GB', 'MX', 'CN'], placeholder: '选择国家/地区' }, { key: 'industry', label: '行业分类', type: 'select', options: industryOptions, placeholder: '选择行业分类' }, { key: 'bd', label: '所属BD', type: 'select', options: bdOptions, placeholder: '选择所属BD' }, { key: 'am', label: '所属AM', type: 'select', options: amOptions, placeholder: '选择所属AM' }], actions: [exportAction, customFieldsAction], filterClass: 'cols-5', tableMinWidth: 4300, hideOperation: true, columns: columns(['日期', '所属客户ID', '所属客户名称', '所属BD', '所属AM', '所属广告账户ID', '所属广告账户名称', '所属Campaign ID', '所属Campaign名称', '所属Adset ID', '所属Adset名称', 'Ad ID', 'Ad名称', '状态', '标题', '描述', '行动按钮', 'URL', '素材', '国家/地区', '行业分类', '账户币种', '广告消耗', '曝光量', '点击量', 'CTR', '转化量', 'CVR', '平均CPM', '平均CPC', '平均CPA', '转化价值', 'ROAS', '昨日消耗', '消耗环比增长率'], { left: ['所属客户名称', '所属广告账户名称', '所属Campaign名称', '所属Adset名称', 'Ad名称', '标题', '描述', 'URL', '素材'], person: ['所属BD', '所属AM'], status: ['状态'], long: ['URL', '素材'] }), rows: [] }
      ]
    },

    'bind-card-account': {
      title: '绑卡户管理',
      tabs: [
        {
          id: 'config',
          label: '广告账户和银行卡配置',
          filters: [{ key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Google', 'TikTok', 'AppLovin', '其他'], placeholder: '选择媒体' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'cardId', label: '卡ID', placeholder: '输入卡ID' }, { key: 'cardLast4', label: '卡后四位', placeholder: '输入卡后四位' }, { key: 'cardStatus', label: '卡状态', type: 'select', options: ['正常', '冻结', '关闭'], placeholder: '选择卡状态' }, { key: 'isUsing', label: '是否使用卡', type: 'select', options: ['是', '否'], placeholder: '选择是否使用卡' }, { key: 'verifyStatus', label: '验卡任务状态', type: 'select', options: ['未申请', '审批中', '待验卡', '已验卡(未回收)', '回收失败', '已回收', '已充值关单(未回收)', '已取消', '已驳回'], placeholder: '选择验卡任务状态' }],
          actions: [{ id: 'refresh-card-limit', label: '更新信用卡额度', icon: 'sync' }, { id: 'bind-card', label: '绑定可用卡', icon: 'link' }, { id: 'create-sub-card', label: '新增子信用卡', icon: 'plus' }, exportAction],
          filterClass: 'cols-5',
          treeRows: true,
          treeToggleColumnKey: 'c1',
          tableMinWidth: 1780,
          opsWidth: 280,
          childOpsWidth: 420,
          columns: columns(['媒体', '广告账户ID', '广告账户名称', '商户ID', '客户名称', '关联卡数', '使用卡验卡提示', '使用卡ID', '使用卡后四位', '使用卡币种', '使用卡可用额度', '最后操作人'], { left: ['广告账户名称', '客户名称', '最后操作人'], person: ['最后操作人'], status: ['使用卡验卡提示'], widths: [110, 180, 220, 100, 180, 110, 180, 260, 130, 110, 150, 240] }).map((column, index) => ({ ...column, key: `c${index + 1}` })),
          childColumns: columns(['卡ID', '卡后四位', '卡币种', '总额度', '已用额度', '可用额度', '卡状态', '是否使用卡', '验卡申请额度', '验卡额度状态', '创建时间'], { left: ['卡ID'], status: ['卡状态', '是否使用卡', '验卡额度状态'], widths: [260, 110, 110, 120, 120, 120, 110, 120, 150, 180, 170] }).map((column, index) => ({ ...column, key: `c${index + 13}` })),
          rows: [
            row(['账户行', 'Facebook', '821285917232112', 'HQ-W-12-13', '1128', 'adstest', '3', '待验卡·请去媒体', 'c_2dsw82249hx2s', '0751', 'USD', '519.00', '张三(zhangsan@bestfulfill.com)', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2026-08-08 10:11:02'], { media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '1128', customerName: 'adstest', verifyStatus: '待验卡', ops: ['修改使用卡', '验卡任务详情'] }),
            row(['卡行', 'Facebook', '821285917232112', 'HQ-W-12-13', '1128', 'adstest', '-', '-', '-', '-', '-', '-', '张三(zhangsan@bestfulfill.com)', 'c_2dsw82249hx2s', '0751', 'USD', '520.00', '1.00', '519.00', '正常', '是', '519.00 USD', '待验卡', '2026-08-08 10:11:02'], { media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '1128', customerName: 'adstest', cardId: 'c_2dsw82249hx2s', cardLast4: '0751', cardStatus: '正常', isUsing: '是', verifyStatus: '待验卡', canTransfer: false, ops: ['验卡任务详情', '标记媒体已验证', '取消任务', '查看完整卡信息'] }),
            row(['卡行', 'Facebook', '821285917232112', 'HQ-W-12-13', '1128', 'adstest', '-', '-', '-', '-', '-', '-', '张三(zhangsan@bestfulfill.com)', 'c_6b4m32v9ab21', '1288', 'USD', '300.00', '42.00', '258.00', '正常', '否', '-', '未申请', '2026-08-07 16:24:55'], { media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '1128', customerName: 'adstest', cardId: 'c_6b4m32v9ab21', cardLast4: '1288', cardStatus: '正常', isUsing: '否', verifyStatus: '未申请', canTransfer: false, ops: ['申请验卡初始额度', '查看完整卡信息', '解绑', '冻结卡'] }),
            row(['卡行', 'Facebook', '821285917232112', 'HQ-W-12-13', '1128', 'adstest', '-', '-', '-', '-', '-', '-', '张三(zhangsan@bestfulfill.com)', 'c_frz81n2a00kq', '9910', 'USD', '50.00', '10.00', '40.00', '冻结', '否', '-', '未申请', '2026-08-06 12:03:18'], { media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '1128', customerName: 'adstest', cardId: 'c_frz81n2a00kq', cardLast4: '9910', cardStatus: '冻结', isUsing: '否', verifyStatus: '未申请', ops: ['查看完整卡信息'] }),
            row(['账户行', 'Google', '973462981122', 'G-Alpha-042', '14229', 'test金额变动', '2', '已验卡·可充值', 'c_3bpoltc2u7sf1', '7209', 'USD', '498.00', '李彦(liyan@bestfulfill.com)', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2026-08-08 18:42:31'], { media: 'Google', accountId: '973462981122', accountName: 'G-Alpha-042', merchantId: '14229', customerName: 'test金额变动', verifyStatus: '已验卡(未回收)', transferWarning: '该广告账户存在未回收验卡额度 499.00 USD。转出时需要确认退款是否已体现，建议转出后仍保留验卡额度。', transferFromOptions: [{ value: 'c_3bpoltc2u7sf1', label: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可转 498.00 USD', max: 498, verifyAmount: 499, status: '已验卡(未回收)' }, { value: 'c_w9x8y7z6v5u4t3', label: 'c_w9x8y7z6v5u4t3(5678)｜已回收｜可转 199.00 USD', max: 199, status: '已回收' }], transferToOptions: [{ value: 'c_3bpoltc2u7sf1', label: 'c_3bpoltc2u7sf1(7209)｜正常｜可转入' }, { value: 'c_w9x8y7z6v5u4t3', label: 'c_w9x8y7z6v5u4t3(5678)｜正常｜可转入' }], ops: ['修改使用卡', '额度转移', '验卡任务详情'] }),
            row(['卡行', 'Google', '973462981122', 'G-Alpha-042', '14229', 'test金额变动', '-', '-', '-', '-', '-', '-', '李彦(liyan@bestfulfill.com)', 'c_3bpoltc2u7sf1', '7209', 'USD', '500.00', '2.00', '498.00', '正常', '是', '499.00 USD', '已验卡(未回收)', '2026-08-08 18:42:31'], { media: 'Google', accountId: '973462981122', accountName: 'G-Alpha-042', merchantId: '14229', customerName: 'test金额变动', cardId: 'c_3bpoltc2u7sf1', cardLast4: '7209', cardStatus: '正常', isUsing: '是', verifyStatus: '已验卡(未回收)', verifyAmount: 499, preVerifyLimit: 1, transferWarning: '该卡有验卡额度 499.00 USD 尚未回收。请确保可用额度中已体现媒体验卡费用的退回情况；建议转出后卡上仍保留验卡额度。', transferFromOptions: [{ value: 'c_3bpoltc2u7sf1', label: 'c_3bpoltc2u7sf1(7209)｜已验卡(未回收)｜可转 498.00 USD', max: 498, verifyAmount: 499, status: '已验卡(未回收)' }], transferToOptions: [{ value: 'c_w9x8y7z6v5u4t3', label: 'c_w9x8y7z6v5u4t3(5678)｜正常｜可转入' }], ops: ['验卡任务详情', '确认验卡退款并回收', '查看完整卡信息', '转出额度'] }),
            row(['卡行', 'Google', '973462981122', 'G-Alpha-042', '14229', 'test金额变动', '-', '-', '-', '-', '-', '-', '李彦(liyan@bestfulfill.com)', 'c_w9x8y7z6v5u4t3', '5678', 'USD', '200.00', '0.00', '200.00', '正常', '否', '-', '已回收', '2026-08-05 09:10:20'], { media: 'Google', accountId: '973462981122', accountName: 'G-Alpha-042', merchantId: '14229', customerName: 'test金额变动', cardId: 'c_w9x8y7z6v5u4t3', cardLast4: '5678', cardStatus: '正常', isUsing: '否', verifyStatus: '已回收', transferFromOptions: [{ value: 'c_w9x8y7z6v5u4t3', label: 'c_w9x8y7z6v5u4t3(5678)｜已回收｜可转 199.00 USD', max: 199, status: '已回收' }], transferToOptions: [{ value: 'c_3bpoltc2u7sf1', label: 'c_3bpoltc2u7sf1(7209)｜正常｜可转入' }], ops: ['查看完整卡信息', '解绑', '冻结卡', '转出额度'] }),
            row(['账户行', 'TikTok', '739291002991', 'TT-SEA-019', '10152', '电商三组（Mindxis）', '2', '审批中·不可充', 'c_pending_2219', '2219', 'USD', '1.00', '王五(wangwu@bestfulfill.com)', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2026-08-09 09:35:44'], { media: 'TikTok', accountId: '739291002991', accountName: 'TT-SEA-019', merchantId: '10152', customerName: '电商三组（Mindxis）', verifyStatus: '审批中', ops: ['修改使用卡', '验卡任务详情'] }),
            row(['卡行', 'TikTok', '739291002991', 'TT-SEA-019', '10152', '电商三组（Mindxis）', '-', '-', '-', '-', '-', '-', '王五(wangwu@bestfulfill.com)', 'c_pending_2219', '2219', 'USD', '1.00', '0.00', '1.00', '正常', '是', '450.00 USD', '审批中', '2026-08-09 09:35:44'], { media: 'TikTok', accountId: '739291002991', accountName: 'TT-SEA-019', merchantId: '10152', customerName: '电商三组', cardId: 'c_pending_2219', cardLast4: '2219', cardStatus: '正常', isUsing: '是', verifyStatus: '审批中', ops: ['验卡任务详情'] }),
            row(['卡行', 'TikTok', '739291002991', 'TT-SEA-019', '10152', '电商三组（Mindxis）', '-', '-', '-', '-', '-', '-', '王五(wangwu@bestfulfill.com)', 'c_reject_8330', '8330', 'USD', '1.00', '0.00', '1.00', '正常', '否', '300.00 USD', '已驳回', '2026-08-02 14:18:12'], { media: 'TikTok', accountId: '739291002991', accountName: 'TT-SEA-019', merchantId: '10152', customerName: '电商三组', cardId: 'c_reject_8330', cardLast4: '8330', cardStatus: '正常', isUsing: '否', verifyStatus: '已驳回', ops: ['申请验卡初始额度', '验卡任务详情', '查看完整卡信息'] }),
            row(['账户行', 'AppLovin', '1587676814', 'silixwear-MH-0121', '10152', '电商三组（Mindxis）', '1', '关单未回收·可回收', 'c_close_4821', '4821', 'USD', '98.00', '汤秀梅(tangxiumei@bestfulfill.com)', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2026-08-08 20:16:09'], { media: 'AppLovin', accountId: '1587676814', accountName: 'silixwear-MH-0121', merchantId: '10152', customerName: '电商三组（Mindxis）', verifyStatus: '已充值关单(未回收)', ops: ['验卡任务详情'] }),
            row(['卡行', 'AppLovin', '1587676814', 'silixwear-MH-0121', '10152', '电商三组（Mindxis）', '-', '-', '-', '-', '-', '-', '汤秀梅(tangxiumei@bestfulfill.com)', 'c_close_4821', '4821', 'USD', '520.00', '422.00', '98.00', '正常', '是', '20.00 USD', '已充值关单(未回收)', '2026-08-08 20:16:09'], { media: 'AppLovin', accountId: '1587676814', accountName: 'silixwear-MH-0121', merchantId: '10152', customerName: '电商三组', cardId: 'c_close_4821', cardLast4: '4821', cardStatus: '正常', isUsing: '是', verifyStatus: '已充值关单(未回收)', verifyAmount: 20, preVerifyLimit: 1, hasRechargeAfterVerify: true, transferWarning: '该卡已充值关单但验卡额度 20.00 USD 尚未回收。回收前参与额度转移需要人工确认退款与可用额度。', ops: ['验卡任务详情', '确认验卡退款并回收', '查看完整卡信息'] }),
            row(['账户行', '其他', 'OT-3301991', 'Other-Media-330', '13052', 'T&L', '1', '回收失败·可重试', 'c_fail_6640', '6640', 'USD', '0.50', '张三(zhangsan@bestfulfill.com)', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2026-08-08 09:47:04'], { media: '其他', accountId: 'OT-3301991', accountName: 'Other-Media-330', merchantId: '13052', customerName: 'T&L', verifyStatus: '回收失败', ops: ['验卡任务详情'] }),
            row(['卡行', '其他', 'OT-3301991', 'Other-Media-330', '13052', 'T&L', '-', '-', '-', '-', '-', '-', '张三(zhangsan@bestfulfill.com)', 'c_fail_6640', '6640', 'USD', '420.00', '419.50', '0.50', '正常', '是', '419.00 USD', '回收失败', '2026-08-08 09:47:04'], { media: '其他', accountId: 'OT-3301991', accountName: 'Other-Media-330', merchantId: '13052', customerName: 'T&L', cardId: 'c_fail_6640', cardLast4: '6640', cardStatus: '正常', isUsing: '是', verifyStatus: '回收失败', verifyAmount: 419, preVerifyLimit: 1, transferWarning: '上次回收因可用额度不足失败。重新回收前需确认 Slash 可用额度已足够覆盖验卡申请额度 419.00 USD。', ops: ['验卡任务详情', '确认验卡退款并回收', '查看完整卡信息'] })
          ]
        },
        {
          id: 'check',
          label: '数据核对',
          filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'media', label: '媒体', type: 'select', options: mediaOptions, placeholder: '选择媒体' }, { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' }, { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' }, { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' }, { key: 'cardId', label: '卡ID', placeholder: '输入卡ID' }, { key: 'cardLast4', label: '卡后四位', placeholder: '输入卡后四位' }],
          actions: [exportAction],
          filterClass: 'cols-5',
          tableMinWidth: 2160,
          hideOperation: true,
          columns: columns(['日期', '媒体', '广告账户ID', '广告账户名称', '商户ID', '客户名称', '账户币种', '账户消耗', '卡ID', '卡后四位', '卡币种', '卡消耗', '卡返点', '卡余额', '差异', '核对结果'], { left: ['广告账户名称', '客户名称', '卡ID'], status: ['核对结果'], widths: [120, 110, 170, 220, 100, 170, 100, 120, 240, 110, 100, 120, 120, 120, 120, 120] }),
          rows: [
            row(['2026-08-08', 'Facebook', '821285917232112', 'HQ-W-12-13', '1128', 'adstest', 'USD', '1.00', 'c_2dsw82249hx2s', '0751', 'USD', '1.00', '0.02', '519.00', '0.00', '正常'], { date: '2026-08-08', media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '1128', customerName: 'adstest', cardId: 'c_2dsw82249hx2s', cardLast4: '0751' }),
            row(['2026-08-08', 'Google', '973462981122', 'G-Alpha-042', '14229', 'test金额变动', 'USD', '2.00', 'c_3bpoltc2u7sf1', '7209', 'USD', '2.00', '0.04', '498.00', '0.00', '正常'], { date: '2026-08-08', media: 'Google', accountId: '973462981122', merchantId: '14229', customerName: 'test金额变动', cardId: 'c_3bpoltc2u7sf1', cardLast4: '7209' }),
            row(['2026-08-08', 'AppLovin', '1587676814', 'silixwear-MH-0121', '10152', '电商三组（Mindxis）', 'USD', '422.00', 'c_close_4821', '4821', 'USD', '422.00', '8.44', '98.00', '0.00', '正常'], { date: '2026-08-08', media: 'AppLovin', accountId: '1587676814', merchantId: '10152', customerName: '电商三组', cardId: 'c_close_4821', cardLast4: '4821' }),
            row(['2026-08-08', '其他', 'OT-3301991', 'Other-Media-330', '13052', 'T&L', 'USD', '420.00', 'c_fail_6640', '6640', 'USD', '419.50', '-', '0.50', '0.50', '异常'], { date: '2026-08-08', media: '其他', accountId: 'OT-3301991', merchantId: '13052', customerName: 'T&L', cardId: 'c_fail_6640', cardLast4: '6640' }),
            row(['汇总', '-', '-', '-', '-', '-', 'USD', '845.00', '-', '-', 'USD', '844.50', '8.50', '-', '0.50', '异常'])
          ]
        },
        {
          id: 'audit',
          label: '查看审计',
          filters: [{ key: 'date', label: '日期范围', type: 'daterange' }, { key: 'operator', label: '操作人', placeholder: '输入操作人' }, { key: 'verifier', label: '核验人员', placeholder: '输入核验人员' }, { key: 'cardId', label: '卡ID', placeholder: '输入卡ID' }, { key: 'cardLast4', label: '卡后四位', placeholder: '输入卡后四位' }, { key: 'result', label: '结果', type: 'select', options: ['成功', '失败'], placeholder: '选择结果' }],
          actions: [exportAction],
          filterClass: 'cols-5',
          tableMinWidth: 1780,
          hideOperation: true,
          columns: columns(['时间', '操作人', '卡ID', '卡后四位', '设备', 'IP', '核验方式', '核验人员', '结果', '失败原因'], { left: ['操作人', '设备', '核验人员'], person: ['操作人', '核验人员'], status: ['结果'], long: ['设备'], widths: [170, 240, 240, 110, 320, 140, 140, 240, 100, 170] }),
          rows: [
            row(['2026-08-09 10:25:44', '张三(zhangsan@bestfulfill.com)', 'c_2dsw82249hx2s', '0751', 'macOS / Chrome 149', '14.146.22.136', '飞书扫码确认', '张三(zhangsan@bestfulfill.com)', '成功', '-'], { date: '2026-08-09', operator: '张三', verifier: '张三', cardId: 'c_2dsw82249hx2s', cardLast4: '0751', result: '成功' }),
            row(['2026-08-09 10:18:09', '李彦(liyan@bestfulfill.com)', 'c_3bpoltc2u7sf1', '7209', 'Windows / Edge 127', '113.108.77.21', '飞书扫码确认', '外部人员(unknown@example.com)', '失败', '不在白名单'], { date: '2026-08-09', operator: '李彦', verifier: '外部人员', cardId: 'c_3bpoltc2u7sf1', cardLast4: '7209', result: '失败' }),
            row(['2026-08-08 21:04:18', '汤秀梅(tangxiumei@bestfulfill.com)', 'c_close_4821', '4821', 'macOS / Chrome 149', '14.146.22.136', '飞书扫码确认', '汤秀梅(tangxiumei@bestfulfill.com)', '失败', '飞书核验超时'], { date: '2026-08-08', operator: '汤秀梅', verifier: '汤秀梅', cardId: 'c_close_4821', cardLast4: '4821', result: '失败' }),
            row(['2026-08-08 09:55:31', '王五(wangwu@bestfulfill.com)', 'c_fail_6640', '6640', 'iOS / Feishu WebView', '223.104.68.10', '飞书扫码确认', '王五(wangwu@bestfulfill.com)', '失败', '用户拒绝'], { date: '2026-08-08', operator: '王五', verifier: '王五', cardId: 'c_fail_6640', cardLast4: '6640', result: '失败' })
          ]
        }
      ],
      modals: {
        '更新信用卡额度': { type: 'confirm', title: '更新信用卡额度', copy: '确认触发 Fund 向 Slash 拉取全部子信用卡最新额度与状态？原型只展示同步结果，不调用真实接口。' },
        '绑定可用卡': { title: '绑定可用卡', fields: [{ key: 'media', label: '媒体', control: 'select', options: ['Facebook', 'Google', 'TikTok', 'AppLovin', '其他'], placeholder: '选择媒体' }, { key: 'accountId', label: '广告账户', control: 'select', options: ['821285917232112 / HQ-W-12-13 / 1128 adstest', '973462981122 / G-Alpha-042 / 14229 test金额变动', '739291002991 / TT-SEA-019 / 10152 电商三组'], placeholder: '选择广告账户' }, { key: 'cardId', label: '子卡', control: 'select', options: ['1288 / c_6b4m32v9ab21 / 正常 / 未绑定', '5678 / c_w9x8y7z6v5u4t3 / 正常 / 未绑定'], placeholder: '选择未绑定正常卡' }] },
        '新增子信用卡': { title: '新增子信用卡', fields: [{ key: 'currency', label: '币种', control: 'readonly', value: 'USD', required: false, placeholder: 'USD' }, { key: 'initialLimit', label: '初始额度', control: 'readonly', value: '1', required: false, placeholder: '1' }, { key: 'remark', label: '备注', control: 'textarea', full: true, required: false, maxLength: 200, placeholder: '选填，200个字符内' }, { key: 'media', label: '媒体', control: 'select', options: ['Facebook', 'Google', 'TikTok', 'AppLovin', '其他'], placeholder: '请选择媒体' }, { key: 'accountId', label: '广告账户', control: 'account-search', full: true, options: ['821285917232112 / HQ-W-12-13 / 商户 1128 / adstest', '973462981122 / G-Alpha-042 / 商户 14229 / test金额变动', '739291002991 / TT-SEA-019 / 商户 10152 / 电商三组（Mindxis）', '1587676814 / silixwear-MH-0121 / 商户 10152 / 电商三组（Mindxis）', 'OT-3301991 / Other-Media-330 / 商户 13052 / T&L'], placeholder: '输入广告账户ID或名称搜索，单选搜索结果' }] },
        '修改使用卡': { title: '修改使用卡', fields: [{ key: 'targetCard', label: '目标使用卡', control: 'select', options: ['1288 / c_6b4m32v9ab21 / 可用额度 258.00 USD / 正常', '5678 / c_w9x8y7z6v5u4t3 / 可用额度 200.00 USD / 正常'], placeholder: '选择该账户已关联的非使用卡' }, { key: 'confirm', label: '媒体后台同步确认', control: 'textarea', full: true, placeholder: '请同步到媒体后台改绑此卡，否则该卡消耗无法与广告账户关联。' }] },
        '申请验卡初始额度': { title: '申请验卡初始额度', fields: [{ key: 'verifyAmount', label: '申请金额', placeholder: '请输入 > 0 的 USD 金额' }, { key: 'screenshot', label: '媒体扣款截图', control: 'upload', max: 10, placeholder: '上传媒体扣款截图、PRD 或证明文件' }, { key: 'cardInfo', label: '卡 / 账户信息', control: 'card-context', full: true, required: false }, { key: 'remark', label: '备注', control: 'textarea', full: true, placeholder: '说明媒体与预计扣款等' }] },
        '验卡任务详情': { title: '验卡任务详情', fields: [{ key: 'c13', label: '卡ID', required: false }, { key: 'c14', label: '卡后四位', required: false }, { key: 'c21', label: '验卡申请额度', required: false }, { key: 'c22', label: '验卡额度状态', required: false }, { key: 'c16', label: '总额度', required: false }, { key: 'c18', label: '可用额度', required: false }, { key: 'next', label: '下一步', control: 'textarea', full: true, required: false, placeholder: '待验卡：去媒体并标记 / 可取消；已验卡或关单未回收：确认退款并回收；回收失败：检查可用额度后重试。' }] },
        '标记媒体已验证': { type: 'confirm', title: '标记媒体已验证', copy: '确认媒体验证 / 扣款已经发生？确认后任务进入「已验卡(未回收)」，可放行充值，且不再允许取消。' },
        '取消任务': { title: '取消任务并降回快照', fields: [{ key: 'remark', label: '备注', control: 'textarea', full: true, required: false, placeholder: '如：媒体未扣款 / 验卡失败。仅待验卡状态允许取消，不走飞书审批。' }] },
        '确认验卡退款并回收': { title: '确认验卡退款并回收', fields: [{ key: 'refundPreview', label: '回收预检', control: 'refund-preview', full: true, required: false }, { key: 'slashTxnId', label: 'Slash交易号', required: false, placeholder: '选填' }, { key: 'remark', label: '备注', control: 'textarea', full: true, required: false, placeholder: '选填' }] },
        '额度转移': { title: 'Slash 额度转移', fields: [{ key: 'fromCard', label: '转出卡', control: 'transfer-card-select', placeholder: '选择同账户正常卡' }, { key: 'toCard', label: '转入卡', control: 'transfer-card-select', placeholder: '选择同账户其他正常卡' }, { key: 'amount', label: '转移金额', placeholder: '≤ 可转上限，保留 $1 底线' }, { key: 'warning', label: '未回收提醒', control: 'transfer-warning', full: true, required: false }] },
        '转出额度': { title: '转出额度', fields: [{ key: 'fromCard', label: '转出卡', control: 'transfer-card-select', placeholder: '当前卡自动预填' }, { key: 'toCard', label: '转入卡', control: 'transfer-card-select', placeholder: '选择同账户其他正常卡' }, { key: 'amount', label: '转移金额', placeholder: '≤ min(可用, 总额 - $1)' }, { key: 'warning', label: '未回收提醒', control: 'transfer-warning', full: true, required: false }] },
        '查看完整卡信息': { type: 'card-secret', title: '查看完整卡信息' },
        '解绑': { type: 'confirm', title: '解绑子卡', danger: true, copy: '确认解绑当前子卡？如果该卡已有扣费记录，真实系统会阻断并提示「该卡已有扣费记录，不允许解绑」。' },
        '冻结卡': { type: 'confirm', title: '冻结卡', danger: true, copy: '冻结后卡将无法消费，真实系统会调用 Fund -> Slash 冻结卡并写入审计日志。是否确认？' }
      }
    },

    'acct-txn-summary': {
      title: '综合充值清零减款',
      filters: [
        { key: 'submitTime', label: '提交时间', type: 'daterange' },
        { key: 'id', label: 'ID', placeholder: '输入ID' },
        { key: 'merchantIds', label: '商户ID内容', type: 'textarea', placeholder: '粘贴商户ID，一行一个，或使用空格/逗号分隔' },
        { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
        { key: 'media', label: '媒体', type: 'select', options: mediaOptions, placeholder: '选择媒体' },
        { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
        { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' },
        { key: 'operationType', label: '操作类型', type: 'select', options: ['充值', '清零', '减款'], placeholder: '选择操作类型' },
        { key: 'agent', label: '开户代理', type: 'select', options: ['Rockads', 'Madhouse', 'Gimc'], placeholder: '选择开户代理' },
        { key: 'accountType', label: '账户类型', type: 'select', options: accountTypeOptions, placeholder: '选择账户类型' }
      ],
      actions: [customFieldsAction, exportAction],
      filterClass: 'cols-5',
      tableMinWidth: 3300,
      hideOperation: true,
      columns: columns(['ID', '商户ID', '客户名称', '提交人', '提交时间', '媒体', '广告账户ID', '广告账户名称', '开户代理', '账户类型', '操作类型', '账户币种', '充值/清零/减款金额', '账户服务费率', '代理服务费率', '总服务费用', '我司服务费用', '代理服务费用', '实际充值/清零/减款金额', '钱包币种', '钱包变动金额', '完成时间', '上传数据实际发生日期'], { left: ['客户名称', '提交人', '广告账户名称'], person: ['提交人'] }),
      rows: [
        row(['AD20260808104110277646364', '17794', '-', 'Hiroto', '2026-08-08 10:41:10', 'Facebook', '27648062301520359', '#6775 - hanaleave 261 - PP - RHKA', 'Rockads', '-', '充值', 'USD', '200', '3.00%', '1.00%', '6', '4', '2', '194', 'USD', '-200', '2026-08-08 10:41:13', '-'], { id: 'AD20260808104110277646364', media: 'Facebook', accountId: '27648062301520359', accountName: '#6775 - hanaleave', operationType: '充值', agent: 'Rockads' })
      ]
    },

    'customer-lifecycle-report': {
      title: '客户生命周期',
      tabs: [
        { id: 'multi', label: '多客户分析', filters: [{ key: 'registerDate', label: '注册时间范围', type: 'daterange' }, { key: 'bd', label: 'BD负责人', type: 'select', options: bdOptions, placeholder: '选择BD负责人' }, { key: 'am', label: 'AM负责人', type: 'select', options: amOptions, placeholder: '选择AM负责人' }], actions: [exportAction], kpis: [{ label: '客户总数', value: '0', hint: '当前筛选客户数' }, { label: '打款转化率', value: '0%', hint: '注册到打款' }, { label: '首次账户消耗转化率', value: '0%', hint: '注册到首次账户消耗' }, { label: '累计10k转化率', value: '0%', hint: '累计消耗达到 10k' }], tableMinWidth: 1180, hideOperation: true, columns: columns(['商户ID', '客户名称', 'BD', 'AM', '注册', '打款', '首次账户消耗', '累计消耗金额'], { left: ['客户名称'], person: ['BD', 'AM'] }), rows: [] },
        { id: 'single', label: '单客户分析', filters: [{ key: 'registerDate', label: '注册时间范围', type: 'daterange' }, { key: 'bd', label: 'BD负责人', type: 'select', options: bdOptions, placeholder: '选择BD负责人' }, { key: 'am', label: 'AM负责人', type: 'select', options: amOptions, placeholder: '选择AM负责人' }, { key: 'customer', label: '客户', type: 'select', options: ['10152 电商三组（Mindxis）', '12891 Examy'], placeholder: '选择客户' }], actions: [exportAction], tableMinWidth: 1700, hideOperation: true, columns: columns(['商户ID', '客户名称', 'BD', 'AM', '注册', '打款', '下户', '首次账户充值', '首次账户消耗', '累计1k', '累计5k', '累计10k', '累计100k', '当前卡点'], { left: ['客户名称', '当前卡点'], person: ['BD', 'AM'] }), rows: [] }
      ]
    },

    'non-api-spend': {
      title: '非接口方式获取消耗',
      filters: [
        { key: 'spendDate', label: '消耗日期', type: 'daterange' },
        { key: 'updateDate', label: '更新日期', type: 'daterange' },
        { key: 'media', label: '媒体', type: 'select', options: mediaOptions, placeholder: '选择媒体' },
        { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
        { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' },
        { key: 'source', label: '数据来源', type: 'select', options: ['手工编辑', '批量上传'], placeholder: '选择数据来源' }
      ],
      actions: [{ id: 'upload', label: '上传文件', icon: 'upload' }, { id: 'download-template', label: '下载模版', icon: 'download', align: 'right' }],
      filterClass: 'cols-5',
      tableMinWidth: 1640,
      opsWidth: 100,
      columns: columns(['消耗日期', '媒体', '广告账户ID', '广告账户名称', '币种', '消耗金额', '数据来源', '数据冲突', '更新时间', '更新人员'], { left: ['广告账户名称'], person: ['更新人员'], status: ['数据冲突'] }),
      rows: [
        row(['2026-08-07', 'Facebook', 'test1234343444', 'test', 'USD', '1,000', '手工编辑', '不冲突', '2026-08-08 14:45:46', '汤秀梅 (tangxiumei@bestfulfill.com)'], { spendDate: '2026-08-07', media: 'Facebook', accountId: 'test1234343444', accountName: 'test', source: '手工编辑', ops: ['修改'] })
      ],
      modals: {
        '修改': { title: '修改消耗数据', fields: [{ key: 'c5', label: '消耗金额', placeholder: '请输入消耗金额' }, { key: 'remark', label: '备注', control: 'textarea', full: true, placeholder: '请输入修改原因' }] }
      }
    },

    'ad-daily-report': {
      title: '广告日报',
      filters: [{ key: 'statDate', label: '统计日期', type: 'date', value: '2026-08-08' }],
      actions: [{ id: 'copy-long-image', label: '复制当前页面长图', icon: 'copy', primary: true, align: 'right' }],
      kpis: [
        { label: '8月8日消耗排行', value: 'Top 100', hint: '电商三组（Mindxis） $3,010.95；Examy $1,146.69' },
        { label: '每日充值-清零-减款', value: '$1.2M', hint: '按日汇总展示趋势' },
        { label: '账户类型消耗占比', value: 'Facebook-企业户', hint: '$2.3k，占比 5.76%' }
      ],
      charts: [
        { title: '8月8日消耗排行 Top 100', type: 'bar', items: [{ label: '电商三组（Mindxis）', value: 3010.95, display: '3,010.95' }, { label: 'Examy', value: 1146.69, display: '1,146.69', color: '#67c23a' }, { label: 'test金额变动', value: 420.12, display: '420.12', color: '#d7a51a' }] },
        { title: '每日充值-清零-减款', type: 'bar', items: [{ label: '充值', value: 120, display: '1,200,000', color: '#006be6' }, { label: '清零', value: 18, display: '180,000', color: '#f56c6c' }, { label: '减款', value: 7.5, display: '75,000', color: '#d7a51a' }] },
        { title: '账户类型消耗占比', type: 'donut', center: '消耗', items: [{ label: 'Facebook-企业户', value: 57.6, display: '57.6%', color: '#006be6' }, { label: 'Facebook-绿通户', value: 24.8, display: '24.8%', color: '#67c23a' }, { label: 'Google-海外户', value: 17.6, display: '17.6%', color: '#d7a51a' }] }
      ],
      tableMinWidth: 1180,
      hideOperation: true,
      columns: columns(['榜单', '客户/账户类型', '币种', '金额', '占比', '说明'], { left: ['客户/账户类型', '说明'] }),
      rows: [
        row(['消耗排行', '电商三组（Mindxis）(10152)', 'USD', '3,010.95', '-', '8月8日消耗排行前 100。']),
        row(['账户类型消耗占比', 'Facebook-企业户', 'USD', '2,300.00', '5.76%', '测试环境以图表展示。'])
      ]
    }
  };

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, reportConfigs);
})();
