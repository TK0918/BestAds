/*
 * BestAds 运营端「监控管理」模块配置。
 * 覆盖账户封停、账户余额日环比、余额监控&自动充值等监控类页面。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const tag = value => {
    const text = asText(value);
    const cls = /正常|启用|成功|已处理|解封|已发送/.test(text) ? 'status-success' : /封停|失败|禁用|异常/.test(text) ? 'status-danger' : /待|跟进中|处理中|未发送/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const follow = value => {
    const text = value === 'done' ? '已处理' : value === 'in_progress' ? '跟进中' : value === 'pending' ? '待跟进' : asText(value);
    return tag(text);
  };
  const amount = value => `<span class="amount-zero">${esc(asText(value))}</span>`;
  const percent = value => `<span class="${Number(String(value).replace('%', '')) >= 5 ? 'amount-negative' : 'amount-zero'}">${esc(asText(value))}</span>`;
  const person = value => `<span class="person-cell">${esc(asText(value))}</span>`;
  const text = value => `<span class="wrap">${esc(asText(value))}</span>`;

  const mediaOptions = ['Facebook', 'Google', 'TikTok', 'Other'];
  const batchOptions = ['09:00', '14:00'];
  const owners = {
    bdZhang: '张三(zhangsan@bestfulfill.com)',
    bdWang: '王五(wangwu@bestfulfill.com)',
    bdQian: '钱七(qianqi@bestfulfill.com)',
    amLi: '李四(lisi@bestfulfill.com)',
    amZhao: '赵六(zhaoliu@bestfulfill.com)',
    amSun: '孙八(sunba@bestfulfill.com)'
  };

  const monitorActions = [
    { id: 'batch-follow', label: '批量跟进', icon: 'tasks', requiresSelection: true },
    { id: 'alert-preview', label: '飞书告警示意', icon: 'comment-dots', align: 'right' },
    { id: 'export', label: '导出数据', icon: 'download', primary: true, align: 'right' }
  ];

  const monitorModals = {
    '批量跟进': { type: 'monitor-follow', title: '批量跟进' },
    '跟进': { type: 'monitor-follow', title: '跟进' },
    '查看跟进记录': { type: 'monitor-history', title: '跟进记录' },
    '飞书告警示意': {
      type: 'monitor-alert-preview',
      title: '飞书告警示意',
      lines: ['【监控告警】2026-08-09 14:00 批次', '账户封停新增 2 条；账户余额日环比异常 3 条；余额低于阈值 4 条。', '请 BD/AM 或运营负责人进入运营端完成跟进闭环。']
    }
  };

  const accountStatusRows = [
    { monitorAt: '2026-08-09 14:00:00', batch: '14:00', eventType: '封停', media: 'Facebook', accountId: '821285917232112', accountName: 'HQ-W-12-13', merchantId: '16201', customerName: 'Arne', bd: owners.bdWang, am: owners.amZhao, currency: 'USD', balance: '0.01', accountStatus: '封停', followStatus: '待跟进', followOwner: '-', followAt: '-', followRemark: '-', ops: ['跟进', '查看跟进记录'] },
    { monitorAt: '2026-08-09 09:00:00', batch: '09:00', eventType: '解封', media: 'Facebook', accountId: '438877120043995', accountName: 'MX-B-08-729', merchantId: '11280', customerName: 'adstest', bd: owners.bdZhang, am: owners.amLi, currency: 'USD', balance: '1,260.50', accountStatus: '正常', followStatus: '已处理', followOwner: '管理员(admin@bestfulfill.com)', followAt: '2026-08-09 09:25:31', followRemark: '已通知客户恢复投放', ops: ['跟进', '查看跟进记录'] },
    { monitorAt: '2026-08-08 14:00:00', batch: '14:00', eventType: '无新增通知', media: 'Google', accountId: '-', accountName: '-', merchantId: '-', customerName: '-', bd: '-', am: '-', currency: '-', balance: '-', accountStatus: '无新增', followStatus: '已处理', followOwner: '系统', followAt: '2026-08-08 14:00:02', followRemark: '本批次无新增封停/解封账户', selectable: false, ops: ['查看详情'] },
    { monitorAt: '2026-08-08 09:00:00', batch: '09:00', eventType: '封停', media: 'TikTok', accountId: '736592004118820', accountName: 'TT-LA-08-17', merchantId: '14229', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, currency: 'USD', balance: '320.00', accountStatus: '封停', followStatus: '跟进中', followOwner: '王荣荣(wangrongrong@bestfulfill.com)', followAt: '2026-08-08 10:14:22', followRemark: '已向代理确认封停原因', ops: ['跟进', '查看跟进记录'] }
  ];

  const statusStatsRows = [
    { date: '2026-08-09', media: 'Facebook', totalAccounts: '1,238', banCount: '2', unbanCount: '1', netBan: '+1', affectedCustomers: '2', banRate: '0.16%' },
    { date: '2026-08-09', media: 'Google', totalAccounts: '486', banCount: '0', unbanCount: '0', netBan: '0', affectedCustomers: '0', banRate: '0.00%' },
    { date: '2026-08-08', media: 'TikTok', totalAccounts: '312', banCount: '1', unbanCount: '0', netBan: '+1', affectedCustomers: '1', banRate: '0.32%' }
  ];

  const balanceRows = [
    { checkDate: '2026-08-08', merchantId: '16201', customerName: 'Arne', bd: owners.bdWang, am: owners.amZhao, accountId: '821285917232112', accountName: 'HQ-W-12-13', media: 'Facebook', bindCard: '否', currency: 'USD', prevEnd: '1,020.50', recharge: '0.00', spend: '128.20', clear: '0.00', reduce: '120.50', expected: '771.80', dayEnd: '650.30', diff: '121.50', diffPct: '15.74%', followStatus: '待跟进', followOwner: '-', followAt: '-', followRemark: '-', ops: ['跟进', '查看跟进记录'] },
    { checkDate: '2026-08-08', merchantId: '14229', customerName: 'test金额变动', bd: owners.bdWang, am: owners.amZhao, accountId: '1292368695505904', accountName: 'MX-G-12-620', media: 'Google', bindCard: '否', currency: 'USD', prevEnd: '520.00', recharge: '300.00', spend: '42.00', clear: '0.00', reduce: '0.00', expected: '778.00', dayEnd: '777.95', diff: '0.05', diffPct: '0.01%', followStatus: '跟进中', followOwner: '管理员(admin@bestfulfill.com)', followAt: '2026-08-09 10:12:30', followRemark: '已联系财务复核', ops: ['跟进', '查看跟进记录'] },
    { checkDate: '2026-08-07', merchantId: '11280', customerName: 'adstest', bd: owners.bdZhang, am: owners.amLi, accountId: '438877120043995', accountName: 'MX-B-08-729', media: 'Facebook', bindCard: '是', currency: 'USD', prevEnd: '1,560.00', recharge: '0.00', spend: '88.12', clear: '0.00', reduce: '0.00', expected: '1,471.88', dayEnd: '1,471.88', diff: '0.00', diffPct: '0.00%', followStatus: '已处理', followOwner: '李四(lisi@bestfulfill.com)', followAt: '2026-08-08 09:50:01', followRemark: '绑卡户余额口径已确认', ops: ['跟进', '查看跟进记录'] }
  ];

  const balanceMonitorRuleRows = [
    { ruleName: 'test123', condition: '小于 $12', status: '停用', interval: '48 小时', accountCount: '1', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-06-29 14:51:05', ops: ['编辑'] },
    { ruleName: 'v224-mon-1782385472834', condition: '小于 $500', status: '启用', interval: '12 小时', accountCount: '1', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-06-29 14:21:42', ops: ['编辑'] },
    { ruleName: 'test告警', condition: '小于 $250', status: '启用', interval: '24 小时', accountCount: '0', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-03-04 11:00:44', ops: ['编辑'] }
  ];

  const balanceMonitorLogRows = [
    { judgeAt: '2026-08-05 16:55:04', ruleName: 'v224-mon-1782385472834', media: 'Google', agent: 'Wezonet', accountId: '1816898937', accountName: 'MX-W-GG-07-10', hitBalance: '$ 210', threshold: '$ 500', noticeReceiver: '-', sent: '否', notSentReason: '未达到最短通知间隔' },
    { judgeAt: '2026-08-05 16:54:44', ruleName: 'test告警', media: 'Facebook', agent: 'Gimc', accountId: '1292368695505904', accountName: 'MX-G-12-620', hitBalance: '$ 40.14', threshold: '$ 250', noticeReceiver: '谭英就(tanyingjiu@bestfulfill.com)', sent: '是', notSentReason: '-' },
    { judgeAt: '2026-08-05 16:53:21', ruleName: 'test123', media: 'Facebook', agent: 'BlueFocus', accountId: '821285917232112', accountName: 'HQ-W-12-13', hitBalance: '$ 0.01', threshold: '$ 12', noticeReceiver: '-', sent: '否', notSentReason: '规则停用' }
  ];

  const autoRechargeRuleRows = [
    { merchantId: '14229', customerName: 'test金额变动', ruleName: '11122', condition: '小于 $111', rechargeAmount: '$ 10', cooldown: '不限', dailyLimit: '不限', status: '启用', effectiveTime: '2026-07-29 11:58:51 ~ 2026-07-29 11:58:53 (账户时区 UTC-8)', accountCount: '1', createdBy: 'test金额变动(tyjtest123)', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-08-05 16:55:16', ops: ['编辑'] },
    { merchantId: '14229', customerName: 'test金额变动', ruleName: 'v224-ops-1782385550080', condition: '小于 $50', rechargeAmount: '$ 20', cooldown: '不限', dailyLimit: '不限', status: '启用', effectiveTime: '2026-06-25 08:00:00 ~ 2026-06-29 11:41:39 (账户时区 UTC-8)', accountCount: '1', createdBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-08-05 16:55:16', ops: ['编辑'] },
    { merchantId: '1128', customerName: 'adstest', ruleName: 'test-111', condition: '小于 $1', rechargeAmount: '$ 100', cooldown: '6h', dailyLimit: '3次', status: '停用', effectiveTime: '2026-07-28 00:00:00 ~ 2026-07-28 00:00:00 (账户时区 UTC-8)', accountCount: '1', createdBy: 'adstest(ads@bestfulfill.com)', updatedBy: '谭英就(tanyingjiu@bestfulfill.com)', updatedAt: '2026-08-05 16:06:15', ops: ['编辑'] }
  ];

  const autoRechargeLogRows = [
    { judgeAt: '2026-08-05 16:55:04', merchantId: '14229', customerName: 'test金额变动', ruleName: '啦啦啦监控测试8', media: 'Facebook', agent: 'Gimc', accountId: '1292368695505904', accountName: 'MX-G-12-620', hitBalance: '$ 40.14', threshold: '$ 100', rechargeAmount: '$ 11', cooldown: '不限', dailyLimit: '不限', successCount: '1', result: '跳过', skipReason: '余额置信窗口中', rechargeOrderId: '-' },
    { judgeAt: '2026-08-05 16:54:46', merchantId: '14229', customerName: 'test金额变动', ruleName: '啦啦啦监控测试8', media: 'Facebook', agent: 'Gimc', accountId: '1292368695505904', accountName: 'MX-G-12-620', hitBalance: '$ 40.14', threshold: '$ 100', rechargeAmount: '$ 11', cooldown: '不限', dailyLimit: '不限', successCount: '1', result: '跳过', skipReason: '存在在途自动充值单', rechargeOrderId: '-' },
    { judgeAt: '2026-08-05 16:54:26', merchantId: '14229', customerName: 'test金额变动', ruleName: '啦啦啦监控测试8', media: 'Facebook', agent: 'Gimc', accountId: '1292368695505904', accountName: 'MX-G-12-620', hitBalance: '$ 40.14', threshold: '$ 100', rechargeAmount: '$ 11', cooldown: '不限', dailyLimit: '不限', successCount: '1', result: '发起成功', skipReason: '-', rechargeOrderId: 'AD20260805165426380014183' }
  ];

  const autoRechargeChangeLogRows = [
    { operateAt: '2026-08-05 16:55:16', operator: '谭英就(tanyingjiu@bestfulfill.com)', merchantId: '14229', customerName: 'test金额变动', ruleId: '48', ruleName: '11122', operateType: '启用', changeSummary: '{ before: { status: "停用" }, after: { status: "启用" } }', source: '运营端', remark: '-' },
    { operateAt: '2026-08-05 16:06:15', operator: '谭英就(tanyingjiu@bestfulfill.com)', merchantId: '1128', customerName: 'adstest', ruleId: '39', ruleName: 'test-111', operateType: '编辑', changeSummary: '{ threshold: "$1", rechargeAmount: "$100", dailyLimit: "3次" }', source: '运营端', remark: '-' },
    { operateAt: '2026-07-29 11:58:53', operator: 'test金额变动(tyjtest123)', merchantId: '14229', customerName: 'test金额变动', ruleId: '48', ruleName: '11122', operateType: '新增', changeSummary: '{ condition: "小于 $111", rechargeAmount: "$10" }', source: '客户端', remark: '-' }
  ];

  const customerFilters = [
    { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
    { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
    { key: 'bd', label: 'BD', placeholder: '请输入BD' },
    { key: 'am', label: 'AM', placeholder: '请输入AM' }
  ];

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    'account-status-monitor': {
      title: '账户封停监控',
      tabs: [
        {
          id: 'records',
          label: '监控记录',
          filters: [
            { key: 'monitorAt', label: '监控日期', type: 'date' },
            { key: 'batch', label: '监控批次', type: 'select', options: batchOptions, placeholder: '请选择监控批次' },
            { key: 'eventType', label: '事件类型', type: 'select', options: ['封停', '解封', '无新增通知'], placeholder: '请选择事件类型' },
            { key: 'media', label: '媒体平台', type: 'select', options: mediaOptions, placeholder: '请选择媒体平台' },
            { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
            ...customerFilters,
            { key: 'followStatus', label: '跟进状态', type: 'select', options: ['待跟进', '跟进中', '已处理'], placeholder: '请选择跟进状态' }
          ],
          actions: monitorActions,
          filterClass: 'cols-5',
          selectable: true,
          tableMinWidth: 2380,
          opsWidth: 190,
          columns: [
            { key: 'monitorAt', label: '监控时间', width: 170, sort: true },
            { key: 'batch', label: '监控批次', width: 100 },
            { key: 'eventType', label: '事件类型', width: 110, format: tag },
            { key: 'media', label: '媒体平台', width: 110 },
            { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
            { key: 'accountName', label: '广告账户名称', align: 'left', width: 220 },
            { key: 'merchantId', label: '商户ID', width: 110, sort: true },
            { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
            { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
            { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
            { key: 'currency', label: '币种', width: 90 },
            { key: 'balance', label: '当前余额', width: 120, num: true, sort: true, format: amount },
            { key: 'accountStatus', label: '账户状态', width: 110, format: tag },
            { key: 'followStatus', label: '跟进状态', width: 110, format: follow },
            { key: 'followOwner', label: '跟进人', align: 'left', width: 220, format: person },
            { key: 'followAt', label: '跟进时间', width: 170, sort: true },
            { key: 'followRemark', label: '跟进备注', align: 'left', width: 220, format: text }
          ],
          rows: accountStatusRows,
          modals: monitorModals
        },
        {
          id: 'stats',
          label: '封停统计',
          filters: [{ key: 'date', label: '统计日期', type: 'date' }, { key: 'media', label: '媒体平台', type: 'select', options: mediaOptions, placeholder: '请选择媒体平台' }],
          actions: [{ id: 'export', label: '导出统计', icon: 'download', primary: true, align: 'right' }],
          tableMinWidth: 1080,
          hideOperation: true,
          columns: [
            { key: 'date', label: '统计日期', width: 140, sort: true },
            { key: 'media', label: '媒体平台', width: 120 },
            { key: 'totalAccounts', label: '监控账户数', width: 130, num: true, sort: true },
            { key: 'banCount', label: '新增封停数', width: 130, num: true, sort: true },
            { key: 'unbanCount', label: '新增解封数', width: 130, num: true, sort: true },
            { key: 'netBan', label: '净新增封停', width: 130, num: true, sort: true },
            { key: 'affectedCustomers', label: '影响客户数', width: 130, num: true, sort: true },
            { key: 'banRate', label: '封停率', width: 120, num: true, sort: true, format: percent }
          ],
          rows: statusStatsRows
        }
      ]
    },

    'balance-day-over-day-report': {
      title: '账户余额日环比',
      kpis: [
        { label: '总异常数', value: '128', hint: '历史累计未归档异常，示意数据不随筛选变化' },
        { label: '最近3天新增异常', value: '18', hint: '不含今天，近3个已产出日终的自然日新增' },
        { label: '全部待跟进', value: '42', hint: '跟进状态为「待跟进」的全量条数' }
      ],
      filters: [
        { key: 'checkDate', label: '核对日期', type: 'date' },
        { key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Google', 'TikTok'], placeholder: '请选择媒体' },
        { key: 'bindCard', label: '是否绑卡户', type: 'select', options: ['是', '否'], placeholder: '请选择是否绑卡户' },
        { key: 'followStatus', label: '跟进状态', type: 'select', options: ['待跟进', '跟进中', '已处理'], placeholder: '请选择跟进状态' },
        { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
        ...customerFilters
      ],
      actions: monitorActions,
      filterClass: 'cols-5',
      selectable: true,
      tableMinWidth: 2860,
      opsWidth: 190,
      columns: [
        { key: 'checkDate', label: '核对日期', width: 120, sort: true },
        { key: 'merchantId', label: '商户ID', width: 110, sort: true },
        { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
        { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
        { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
        { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
        { key: 'accountName', label: '广告账户名称', align: 'left', width: 220 },
        { key: 'media', label: '媒体', width: 100 },
        { key: 'bindCard', label: '是否绑卡户', width: 110 },
        { key: 'currency', label: '币种', width: 90 },
        { key: 'prevEnd', label: '前一天日终余额', width: 150, num: true, sort: true, format: amount },
        { key: 'recharge', label: '当天充值', width: 130, num: true, sort: true, format: amount },
        { key: 'spend', label: '当天消耗', width: 130, num: true, sort: true, format: amount },
        { key: 'clear', label: '当天清零', width: 130, num: true, sort: true, format: amount },
        { key: 'reduce', label: '当天减款', width: 130, num: true, sort: true, format: amount },
        { key: 'expected', label: '推算余额', width: 130, num: true, sort: true, format: amount },
        { key: 'dayEnd', label: '当天日终余额', width: 150, num: true, sort: true, format: amount },
        { key: 'diff', label: '差额', width: 120, num: true, sort: true, format: amount },
        { key: 'diffPct', label: '偏差%', width: 110, num: true, sort: true, format: percent },
        { key: 'followStatus', label: '跟进状态', width: 110, format: follow },
        { key: 'followOwner', label: '跟进人', align: 'left', width: 220, format: person },
        { key: 'followAt', label: '跟进时间', width: 170, sort: true },
        { key: 'followRemark', label: '跟进备注', align: 'left', width: 220, format: text }
      ],
      rows: balanceRows,
      modals: monitorModals
    },

    'balance-monitor-auto-recharge': {
      title: '余额监控&自动充值',
      tabs: [
        {
          id: 'monitor-rules',
          label: '余额监控设置',
          filters: [{ key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' }],
          actions: [{ id: 'create-monitor-rule', label: '新增监控规则', icon: 'plus', primary: true }],
          tableMinWidth: 1240,
          opsWidth: 110,
          columns: [
            { key: 'ruleName', label: '规则名称', align: 'left', width: 260 },
            { key: 'condition', label: '条件', width: 140 },
            { key: 'status', label: '状态', width: 100, format: tag },
            { key: 'interval', label: '最短通知间隔', width: 150 },
            { key: 'accountCount', label: '账户数', width: 100, num: true, sort: true },
            { key: 'updatedBy', label: '最后更新人', align: 'left', width: 260, format: person },
            { key: 'updatedAt', label: '更新时间', width: 170, sort: true }
          ],
          rows: balanceMonitorRuleRows,
          modals: {
            '新增监控规则': { title: '新增监控规则', fields: [{ key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' }, { key: 'condition', label: '条件', control: 'select', options: ['小于 $12', '小于 $250', '小于 $500'], placeholder: '请选择条件' }, { key: 'interval', label: '最短通知间隔', control: 'select', options: ['12 小时', '24 小时', '48 小时'], placeholder: '请选择通知间隔' }, { key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '请选择状态' }, { key: 'accounts', label: '适用账户', control: 'textarea', full: true, placeholder: '请选择或输入适用广告账户；原型不提交测试环境' }] },
            '编辑': { title: '编辑监控规则', fields: [{ key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' }, { key: 'condition', label: '条件', control: 'select', options: ['小于 $12', '小于 $250', '小于 $500'], placeholder: '请选择条件' }, { key: 'interval', label: '最短通知间隔', control: 'select', options: ['12 小时', '24 小时', '48 小时'], placeholder: '请选择通知间隔' }, { key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '请选择状态' }] }
          }
        },
        {
          id: 'monitor-logs',
          label: '余额监控日志',
          filters: [
            { key: 'judgeAt', label: '判断时间', type: 'daterange' },
            { key: 'sent', label: '是否有发送飞书通知', type: 'select', options: ['是', '否'], placeholder: '请选择是否发送' },
            { key: 'notSentReason', label: '未发送原因', placeholder: '请输入未发送原因' }
          ],
          tableMinWidth: 1840,
          hideOperation: true,
          columns: [
            { key: 'judgeAt', label: '判断时间(+8)', width: 170, sort: true },
            { key: 'ruleName', label: '规则名称', align: 'left', width: 230 },
            { key: 'media', label: '媒体平台', width: 110 },
            { key: 'agent', label: '代理', width: 120 },
            { key: 'accountId', label: '广告账户ID', width: 170, sort: true },
            { key: 'accountName', label: '广告账户名称', align: 'left', width: 180 },
            { key: 'hitBalance', label: '命中时余额', width: 120, num: true, sort: true },
            { key: 'threshold', label: '规则阈值', width: 110, num: true, sort: true },
            { key: 'noticeReceiver', label: '通知人', align: 'left', width: 240, format: person },
            { key: 'sent', label: '是否有发送飞书通知', width: 170, format: tag },
            { key: 'notSentReason', label: '未发送原因', align: 'left', width: 220, format: text }
          ],
          rows: balanceMonitorLogRows
        },
        {
          id: 'auto-recharge-rules',
          label: '自动充值设置',
          filters: [
            { key: 'merchantId', label: '商户 ID', placeholder: '请输入商户 ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' },
            { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'], placeholder: '请选择状态' },
            { key: 'accountId', label: '广告账户 ID', placeholder: '请输入广告账户 ID' }
          ],
          actions: [{ id: 'create-auto-recharge-rule', label: '代客新增规则', icon: 'plus', primary: true }],
          filterClass: 'cols-5',
          tableMinWidth: 2260,
          opsWidth: 110,
          columns: [
            { key: 'merchantId', label: '商户 ID', width: 110, sort: true },
            { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
            { key: 'ruleName', label: '规则名称', align: 'left', width: 230 },
            { key: 'condition', label: '条件', width: 120 },
            { key: 'rechargeAmount', label: '充值金额', width: 120, num: true, sort: true },
            { key: 'cooldown', label: '冷却期', width: 100 },
            { key: 'dailyLimit', label: '单日上限', width: 110 },
            { key: 'status', label: '状态', width: 100, format: tag },
            { key: 'effectiveTime', label: '生效时间', align: 'left', width: 330, format: text },
            { key: 'accountCount', label: '账户数', width: 100, num: true, sort: true },
            { key: 'createdBy', label: '创建人', align: 'left', width: 230, format: person },
            { key: 'updatedBy', label: '最后修改人', align: 'left', width: 260, format: person },
            { key: 'updatedAt', label: '修改时间', width: 170, sort: true }
          ],
          rows: autoRechargeRuleRows,
          modals: {
            '代客新增规则': { title: '代客新增自动充值规则', fields: [{ key: 'merchantId', label: '商户 ID', placeholder: '请输入商户 ID' }, { key: 'customerName', label: '客户名称', placeholder: '选择客户后自动带出' }, { key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' }, { key: 'condition', label: '条件', control: 'select', options: ['小于 $1', '小于 $50', '小于 $111'], placeholder: '请选择触发条件' }, { key: 'rechargeAmount', label: '充值金额', placeholder: '请输入充值金额' }, { key: 'cooldown', label: '冷却期', control: 'select', options: ['不限', '6h', '12h', '24h'], placeholder: '请选择冷却期' }, { key: 'dailyLimit', label: '单日上限', control: 'select', options: ['不限', '1次', '2次', '3次'], placeholder: '请选择单日上限' }, { key: 'effectiveTime', label: '生效时间', placeholder: '请选择生效时间范围' }, { key: 'accounts', label: '适用广告账户', control: 'textarea', full: true, placeholder: '请选择广告账户；原型不提交测试环境' }] },
            '编辑': { title: '编辑自动充值规则', fields: [{ key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' }, { key: 'condition', label: '条件', control: 'select', options: ['小于 $1', '小于 $50', '小于 $111'], placeholder: '请选择触发条件' }, { key: 'rechargeAmount', label: '充值金额', placeholder: '请输入充值金额' }, { key: 'cooldown', label: '冷却期', control: 'select', options: ['不限', '6h', '12h', '24h'], placeholder: '请选择冷却期' }, { key: 'dailyLimit', label: '单日上限', control: 'select', options: ['不限', '1次', '2次', '3次'], placeholder: '请选择单日上限' }, { key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '请选择状态' }] }
          }
        },
        {
          id: 'auto-recharge-logs',
          label: '自动充值日志',
          filters: [
            { key: 'judgeAt', label: '判断时间', type: 'daterange' },
            { key: 'merchantId', label: '商户 ID', placeholder: '请输入商户 ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'media', label: '媒体平台', type: 'select', options: mediaOptions, placeholder: '请选择媒体平台' },
            { key: 'agent', label: '代理', placeholder: '请输入代理' },
            { key: 'accountId', label: '广告账户 ID', placeholder: '请输入广告账户 ID' },
            { key: 'accountName', label: '广告账户名称', placeholder: '请输入广告账户名称' },
            { key: 'result', label: '执行结果', type: 'select', options: ['发起成功', '跳过', '发起失败'], placeholder: '请选择执行结果' },
            { key: 'skipReason', label: '跳过原因', placeholder: '请输入跳过原因' }
          ],
          filterClass: 'cols-5',
          tableMinWidth: 2640,
          hideOperation: true,
          columns: [
            { key: 'judgeAt', label: '判断时间(+8)', width: 170, sort: true },
            { key: 'merchantId', label: '商户 ID', width: 110, sort: true },
            { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
            { key: 'ruleName', label: '规则名称', align: 'left', width: 190 },
            { key: 'media', label: '媒体平台', width: 110 },
            { key: 'agent', label: '代理', width: 120 },
            { key: 'accountId', label: '广告账户ID', width: 170, sort: true },
            { key: 'accountName', label: '广告账户名称', align: 'left', width: 180 },
            { key: 'hitBalance', label: '命中时余额', width: 120, num: true, sort: true },
            { key: 'threshold', label: '规则阈值', width: 110, num: true, sort: true },
            { key: 'rechargeAmount', label: '充值金额', width: 120, num: true, sort: true },
            { key: 'cooldown', label: '自动充值冷却期', width: 150 },
            { key: 'dailyLimit', label: '单日充值次数上限', width: 160 },
            { key: 'successCount', label: '当日已自动充值发起成功次数', width: 230, num: true, sort: true },
            { key: 'result', label: '执行结果', width: 110, format: tag },
            { key: 'skipReason', label: '跳过原因', align: 'left', width: 190, format: text },
            { key: 'rechargeOrderId', label: '充值单ID', width: 210 }
          ],
          rows: autoRechargeLogRows
        },
        {
          id: 'auto-recharge-change-logs',
          label: '自动充值变更日志',
          filters: [
            { key: 'operateAt', label: '操作时间', type: 'daterange' },
            { key: 'operator', label: '操作人', placeholder: '请输入操作人' },
            { key: 'merchantId', label: '商户 ID', placeholder: '请输入商户 ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'ruleName', label: '规则名称', placeholder: '请输入规则名称' },
            { key: 'operateType', label: '操作类型', type: 'select', options: ['新增', '编辑', '启用', '停用'], placeholder: '请选择操作类型' }
          ],
          filterClass: 'cols-5',
          tableMinWidth: 1840,
          hideOperation: true,
          columns: [
            { key: 'operateAt', label: '操作时间', width: 170, sort: true },
            { key: 'operator', label: '操作人', align: 'left', width: 260, format: person },
            { key: 'merchantId', label: '商户 ID', width: 110, sort: true },
            { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
            { key: 'ruleId', label: '规则 ID', width: 100, sort: true },
            { key: 'ruleName', label: '规则名称', align: 'left', width: 200 },
            { key: 'operateType', label: '操作类型', width: 110, format: tag },
            { key: 'changeSummary', label: '变更摘要', align: 'left', width: 360, format: text },
            { key: 'source', label: '操作来源', width: 110 },
            { key: 'remark', label: '备注', align: 'left', width: 160, format: text }
          ],
          rows: autoRechargeChangeLogRows
        }
      ]
    }
  });
})();
