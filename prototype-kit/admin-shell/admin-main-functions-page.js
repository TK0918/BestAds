/*
 * BestAds 运营端主功能页面配置。
 * 仅注册配置给 admin-module-page.js 渲染，避免 main-functions 继续走旧 admin-page.js 渲染链路。
 */
(function () {
  "use strict";

  const merchant = value => `<span class="merchant-id">${value}</span>`;
  const money = value => {
    const text = String(value == null || value === '' ? '-' : value);
    if (text === '-') return '<span class="muted">-</span>';
    const number = Number(text.replace(/,/g, ''));
    const cls = number > 0 ? 'amount-positive' : number < 0 ? 'amount-negative' : 'amount-zero';
    return `<span class="${cls}">${text}</span>`;
  };
  const status = value => {
    const text = String(value == null || value === '' ? '-' : value);
    const cls = /启用|成功|充足|正常|已完成|可下载|完成|账户覆盖|开启|全部补入/.test(text) ? 'status-success' : /失败|停用|不足|回退|禁用|异常|未通过/.test(text) ? 'status-danger' : /处理中|待|临界|客户规则|未配置|关闭|后付|部分补入|审批中|调额中/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${text}</span>`;
  };
  const countWithUnit = value => {
    const text = value == null || value === '' ? '-' : String(value);
    return text === '-' ? '<span class="muted">-</span>' : `${esc(text)} 个`;
  };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const emptyDash = value => value ? esc(value) : '<span class="muted">—</span>';
  const asText = value => value == null || value === '' ? '-' : String(value);
  const configs = {
    'customer-sub-account': {
      title: '客户子账号管理',
      showTitlebar: false,
      tabs: [
        {
          id: 'roles', label: '角色管理', filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
            { key: 'roleName', label: '角色名', placeholder: '输入角色名' },
            { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }
          ], actions: [{ id: 'create', label: '创建角色', icon: 'plus', primary: true }],
          filterClass: 'filter-grid--four', tableClass: 'admin-table--fixed', tableMinWidth: 1120, opsWidth: 300,
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant, width: 100 }, { key: 'customerName', label: '客户名称', align: 'left', headerAlign: 'left', width: 190 },
            { key: 'roleName', label: '角色名', align: 'left', headerAlign: 'left', width: 210 }, { key: 'boundUsers', label: '绑定用户数', num: true, width: 120 },
            { key: 'status', label: '状态', format: status, width: 110 }, { key: 'updatedAt', label: '更新时间', width: 180 }
          ],
          rows: [
            { merchantId: '1128', customerName: 'adstest', roleName: '超级管理员', boundUsers: '5', status: '启用', updatedAt: '2026-08-07 15:26:12', ops: ['编辑', '启用', '禁用'] },
            { merchantId: '14229', customerName: 'test金额变动', roleName: '角色回归', boundUsers: '2', status: '启用', updatedAt: '2026-08-06 11:04:35', ops: ['编辑', '启用', '禁用'] }
          ],
          modal: { title: '创建角色', editTitle: '编辑角色', fields: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入5位商户ID' }, { key: 'roleName', label: '角色名', placeholder: '请输入角色名' }, { key: 'remark', label: '备注', placeholder: '请输入备注', full: true }] }
        },
        {
          id: 'sub-accounts', label: '子账号管理', filters: [
            { key: 'loginAccount', label: '登录账号', placeholder: '输入登录账号' },
            { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
            { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }
          ], actions: [{ id: 'create-sub-account', label: '创建子账号', icon: 'plus', primary: true }],
          filterClass: 'filter-grid--four', tableClass: 'admin-table--fixed', tableMinWidth: 1480, opsWidth: 240,
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant, width: 100 }, { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'loginAccount', label: '登录账号', align: 'left', width: 220 }, { key: 'name', label: '姓名', width: 110 },
            { key: 'roleName', label: '绑定角色', align: 'left', width: 180 }, { key: 'balanceAccountCount', label: '管理余额账户', formatter: 'countWithUnit', width: 125 },
            { key: 'adAccountCount', label: '管理广告账户', formatter: 'countWithUnit', width: 125 }, { key: 'status', label: '状态', format: status, width: 100 },
            { key: 'lastLoginAt', label: '最近登录', width: 180 }
          ],
          rows: [
            { merchantId: '14229', customerId: '14229 / test金额变动', customerName: 'test金额变动', loginAccount: '456@demo.local', name: '回归2', roleId: '角色回归', roleName: '角色回归', balanceAccountCount: 2, adAccountCount: 0, balanceAccountIds: ['Meta · act_238401982'], adAccountIds: [], status: '启用', lastLoginAt: '2026-08-06 10:21:10', ops: ['编辑', '重置密码'] },
            { merchantId: '1128', customerId: '1128 / adstest', customerName: 'adstest', loginAccount: 'test0520', name: '测试', roleId: '超级管理员', roleName: '超级管理员', balanceAccountCount: 1, adAccountCount: 0, balanceAccountIds: ['Google · aw_983229001'], adAccountIds: [], status: '启用', lastLoginAt: '2026-08-03 11:50:34', ops: ['编辑', '重置密码'] },
            { merchantId: '14229', customerId: '14229 / test金额变动', customerName: 'test金额变动', loginAccount: 'msw_demo@test.local', name: 'MSW_202607280642', roleId: 'MSW_DEMO_ROLE', roleName: 'MSW_DEMO_ROLE', balanceAccountCount: 1, adAccountCount: 0, balanceAccountIds: ['Meta · act_238401982'], adAccountIds: [], status: '启用', lastLoginAt: '2026-07-29 16:43:27', ops: ['编辑', '重置密码'] }
          ],
          modal: {
            title: '创建子账号',
            fields: [
              { key: 'customerId', label: '所属客户', control: 'customer-select', options: ['1128 / adstest', '14229 / test金额变动'], placeholder: '请选择所属客户' },
              { key: 'loginAccount', label: '登录账号', control: 'text', placeholder: '请输入登录账号' },
              { key: 'name', label: '姓名', control: 'text', placeholder: '请输入姓名' },
              { key: 'initialPassword', label: '初始密码', control: 'password', placeholder: '请输入初始密码', editRequired: false },
              { key: 'roleId', label: '绑定角色', control: 'role-select', options: ['超级管理员', '角色回归', 'MSW_DEMO_ROLE'], placeholder: '请选择绑定角色' },
              { key: 'status', label: '状态', control: 'status-select', options: ['启用', '停用'], placeholder: '请选择状态' },
              { key: 'balanceAccountIds', label: '管理余额的广告账户', control: 'account-multi-select', options: ['Meta · act_238401982', 'Google · aw_983229001'] },
              { key: 'adAccountIds', label: '管理广告的广告账户', control: 'account-multi-select', options: ['Meta · act_238401982', 'TikTok · 710293118'] }
            ],
            editTitle: '编辑子账号'
          }
        }
      ]
    },
    'agent-management': {
      title: '代理管理', subtitle: '维护一级代理、服务费率与代理余额提醒。',
      tabs: [{ id: 'list', label: '', filters: [], actions: [{ id: 'create', label: '新增代理', icon: 'plus', primary: true }], columns: [
        { key: 'name', label: '代理名称', align: 'left' }, { key: 'englishName', label: '代理英文名', align: 'left' }, { key: 'connectType', label: '业务对接方式' },
        { key: 'serviceRate', label: '服务费率', num: true }, { key: 'rateStatus', label: '费率状态', format: status }, { key: 'balance', label: '代理余额', format: money, num: true },
        { key: 'balanceUpdatedAt', label: '余额更新时间' }, { key: 'balanceReminder', label: '余额提醒', format: status }, { key: 'updatedAt', label: '更新时间' }, { key: 'updatedBy', label: '修改人' }
      ], rows: [
        { name: 'txm-test', englishName: 'txm-test', connectType: '代理API', serviceRate: '8.00%', rateStatus: '启用', balance: '-', balanceUpdatedAt: '-', balanceReminder: '启用', updatedAt: '2026-08-08 09:12:00', updatedBy: '管理员', ops: ['编辑', '更新余额'] },
        { name: 'Rockads', englishName: 'Rockads', connectType: '代理API', serviceRate: '5.00%', rateStatus: '启用', balance: '348,644.02', balanceUpdatedAt: '2026-08-08 08:30:12', balanceReminder: '启用', updatedAt: '2026-08-07 18:20:04', updatedBy: '欧伟权', ops: ['编辑', '更新余额'] },
        { name: '飞书深诺', englishName: 'MeetSocial', connectType: '代理API', serviceRate: '10.00%', rateStatus: '启用', balance: '-', balanceUpdatedAt: '-', balanceReminder: '停用', updatedAt: '2026-08-06 16:18:21', updatedBy: '欧伟权', ops: ['编辑', '更新余额'] },
        { name: '省广', englishName: 'Gimc', connectType: '代理API', serviceRate: '20.00%', rateStatus: '启用', balance: '-', balanceUpdatedAt: '-', balanceReminder: '启用', updatedAt: '2026-08-05 13:12:10', updatedBy: '管理员', ops: ['编辑', '更新余额'] }
      ], modal: { title: '新增代理', fields: [{ key: 'name', label: '代理名称', placeholder: '请输入代理名称' }, { key: 'englishName', label: '代理英文名', placeholder: '请输入代理英文名' }, { key: 'connectType', label: '业务对接方式', placeholder: '请选择对接方式' }, { key: 'serviceRate', label: '服务费率', placeholder: '请输入服务费率' }, { key: 'remark', label: '备注', placeholder: '请输入备注', full: true }] }
      }]
    },
    'introducer-spitpoint': {
      title: '介绍人和吐点', subtitle: '维护介绍人关系、吐点规则和结算记录。',
      tabs: [
        { id: 'introducers', label: '介绍人列表', filters: [
          { key: 'merchantId', label: '介绍人商户ID内容', placeholder: '粘贴商户ID，一行一个，或使用空格/逗号分隔' }, { key: 'customerName', label: '介绍人客户名称', placeholder: '请输入客户名称' },
          { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }, { key: 'visibility', label: '客户端可见性', type: 'select', options: ['可见', '不可见'] },
          { key: 'becameAt', label: '成为介绍人时间', type: 'date' }, { key: 'operator', label: '操作人', placeholder: '请输入操作人' }
        ], actions: [{ id: 'create', label: '新增介绍人', icon: 'plus', primary: true }, { id: 'export', label: '导出数据', icon: 'download' }], columns: [
          { key: 'merchantId', label: '介绍人商户ID', format: merchant }, { key: 'customerName', label: '介绍人客户名称', align: 'left' }, { key: 'visibility', label: '客户端可见性', format: status },
          { key: 'status', label: '状态', format: status }, { key: 'relatedCount', label: '关联客户数', num: true }, { key: 'ruleCount', label: '介绍人吐点规则条数', num: true },
          { key: 'becameAt', label: '成为介绍人时间' }, { key: 'operator', label: '操作人' }
        ], rows: [
          { merchantId: '14229', customerName: 'test金额变动', visibility: '可见', status: '启用', relatedCount: '6', ruleCount: '2', becameAt: '2026-07-30 11:20:15', operator: '欧伟权', ops: ['关系与吐点'] },
          { merchantId: '14282', customerName: '介绍人测试客户', visibility: '不可见', status: '启用', relatedCount: '3', ruleCount: '1', becameAt: '2026-07-28 16:42:08', operator: '欧伟权', ops: ['关系与吐点'] },
          { merchantId: '12351', customerName: '海外电商客户', visibility: '可见', status: '启用', relatedCount: '12', ruleCount: '4', becameAt: '2026-05-12 10:08:31', operator: '管理员', ops: ['关系与吐点'] },
          { merchantId: '13672', customerName: '品牌客户A', visibility: '可见', status: '停用', relatedCount: '0', ruleCount: '0', becameAt: '2026-04-22 14:19:44', operator: '管理员', ops: ['关系与吐点'] },
          { merchantId: '13664', customerName: '品牌客户B', visibility: '可见', status: '启用', relatedCount: '4', ruleCount: '1', becameAt: '2026-04-18 09:12:02', operator: '欧伟权', ops: ['关系与吐点'] }
        ] },
        { id: 'relations', label: '介绍人关系与吐点', filters: [{ key: 'introducer', label: '介绍人', placeholder: '请输入介绍人商户ID或客户名称' }, { key: 'customer', label: '关联客户', placeholder: '请输入客户名称' }], actions: [{ id: 'create', label: '新增关系', icon: 'plus', primary: true }], columns: [{ key: 'introducer', label: '介绍人', align: 'left' }, { key: 'customer', label: '关联客户', align: 'left' }, { key: 'rule', label: '吐点规则', align: 'left' }, { key: 'period', label: '生效时间' }, { key: 'status', label: '状态', format: status }], rows: [{ introducer: '14229 / test金额变动', customer: '14656 / test测试币种GBP', rule: '广告消耗 3.00%', period: '2026-07-01 ~ 2026-12-31', status: '启用', ops: ['编辑'] }, { introducer: '14282 / 介绍人测试客户', customer: '14651 / 测试用户_1785922215', rule: '广告消耗 2.50%', period: '长期', status: '启用', ops: ['编辑'] }] },
        { id: 'settlement', label: '吐点结算', filters: [{ key: 'orderId', label: '结算单号', placeholder: '请输入结算单号' }, { key: 'settlementPeriod', label: '结算周期', type: 'select', options: ['2026-07', '2026-06'] }, { key: 'status', label: '状态', type: 'select', options: ['待结算', '已结算', '驳回'] }], actions: [{ id: 'export', label: '导出数据', icon: 'download' }], selectable: true, columns: [{ key: 'orderId', label: '结算单号' }, { key: 'period', label: '结算周期' }, { key: 'introducerCount', label: '介绍人数', num: true }, { key: 'amount', label: '吐点金额', format: money, num: true }, { key: 'status', label: '状态', format: status }, { key: 'createdAt', label: '创建时间' }], rows: [{ orderId: 'SP20260807001', period: '2026-07', introducerCount: '12', amount: '1,200.00', status: '待结算', createdAt: '2026-08-07 18:20:01', ops: ['查看详情'] }, { orderId: 'SP20260701008', period: '2026-06', introducerCount: '8', amount: '860.50', status: '已结算', createdAt: '2026-07-08 11:32:20', ops: ['查看详情'] }] }
      ]
    },
    'rebate-config': {
      title: '返点配置', subtitle: '配置代理给我们的返点。付给客户的返点请到「客户返点」。',
      tabs: [
        { id: 'type', label: '账户类型返点', filters: [{ key: 'agent', label: '代理', placeholder: '请输入代理名称' }, { key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Tiktok', 'Google'] }, { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }], actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }], columns: [{ key: 'agent', label: '代理', align: 'left' }, { key: 'media', label: '媒体' }, { key: 'accountType', label: '账户类型', align: 'left' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedBy', label: '修改人' }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ agent: 'it-test', media: 'Facebook', accountType: '广告账户类型123', rebate: '5.00', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-08-07 16:20:00', ops: ['编辑'] }, { agent: 'Madhouse', media: 'Facebook', accountType: 'Google-企业户', rebate: '6.00', status: '启用', updatedBy: '管理员', updatedAt: '2026-08-06 12:08:44', ops: ['编辑'] }, { agent: 'Panda', media: 'Tiktok', accountType: 'Tiktok-企业户', rebate: '4.50', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-08-05 09:21:37', ops: ['编辑'] }] },
        { id: 'account', label: '账户返点', filters: [{ key: 'accountName', label: '广告账户', placeholder: '请输入广告账户' }, { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }], actions: [{ id: 'batch-status', label: '批量修改状态', icon: 'edit' }, { id: 'batch-rebate', label: '批量修改返点', icon: 'percent' }, { id: 'create', label: '新增配置', icon: 'plus', primary: true }], selectable: true, columns: [{ key: 'accountName', label: '广告账户', align: 'left' }, { key: 'merchantId', label: '商户ID', format: merchant }, { key: 'media', label: '媒体' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ accountName: 'act_123456789 / test测试', merchantId: '14656', media: 'Facebook', rebate: '5.00', status: '启用', updatedAt: '2026-08-07 10:23:01', ops: ['编辑'] }, { accountName: 'aw_987654321 / adstest', merchantId: '1128', media: 'Google', rebate: '3.50', status: '停用', updatedAt: '2026-08-04 17:04:15', ops: ['编辑'] }] },
        { id: 'customer', label: '客户返点（旧）', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }], actions: [{ id: 'goto-customer-rebate', label: '前往客户返点', icon: 'external-link-alt', primary: true }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'media', label: '媒体' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ merchantId: '14656', customerName: 'test测试币种GBP', media: 'Facebook', rebate: '2.00', status: '启用', updatedAt: '2026-08-07 10:20:12', ops: ['查看'] }, { merchantId: '14229', customerName: 'test金额变动', media: 'Google', rebate: '1.50', status: '启用', updatedAt: '2026-08-06 16:44:08', ops: ['查看'] }], footerNote: '本 Tab 为旧配置，只读保留。新规则、账户覆盖、月度结算审核请到「客户返点」。' }
      ]
    },
    'deduction-details': {
      title: '其他扣费', subtitle: '查看地区税费预收、释放等其他资金流水，数据为测试环境样例。',
      tabs: [{ id: 'list', label: '', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }, { key: 'operator', label: '操作人', placeholder: '请输入操作人' }, { key: 'feeType', label: '扣费类型', type: 'select', options: ['开户费', '地区税费预收补入', '预收税费释放'] }, { key: 'status', label: '流水状态', type: 'select', options: ['扣费成功', '已回退'] }, { key: 'currency', label: '扣费币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }, { key: 'feeTime', label: '扣费时间', type: 'date' }], actions: [{ id: 'create', label: '新增其他扣费', icon: 'plus', primary: true }, { id: 'export', label: '导出数据', icon: 'download' }], columns: [
        { key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'feeTime', label: '扣费时间' }, { key: 'feeType', label: '扣费类型', align: 'left' }, { key: 'currency', label: '扣费币种' }, { key: 'feeAmount', label: '扣费金额', format: money, num: true }, { key: 'walletCurrency', label: '钱包币种' }, { key: 'walletAmount', label: '钱包扣费金额', format: money, num: true }, { key: 'status', label: '流水状态', format: status }, { key: 'remark', label: '备注', align: 'left' }, { key: 'operator', label: '扣费操作人' }, { key: 'rollbackTime', label: '回退时间' }, { key: 'rollbackOperator', label: '回退操作人' }, { key: 'rollbackReason', label: '回退原因', align: 'left' }
      ], rows: [{ merchantId: '11894', customerName: '测试用户_1777106273', feeTime: '2026-08-12 11:08:50', feeType: '开户费', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '扣费成功', remark: '开户申请 AO20260812002', operator: '系统-开户扣费', rollbackTime: '-', rollbackOperator: '-', rollbackReason: '-', ops: ['查看详情', '回退'] }, { merchantId: '17794', customerName: '-', feeTime: '2026-08-10 14:20:18', feeType: '开户费', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '已回退', remark: '开户申请 AO20260810003 开户取消回退', operator: '系统-开户扣费', rollbackTime: '2026-08-10 16:08:02', rollbackOperator: '管理员', rollbackReason: '代理拒绝开户', ops: ['查看详情'] }, { merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-07 14:20:00', feeType: '地区税费预收补入', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '扣费成功', remark: '税费预收池补入', operator: '欧伟权', rollbackTime: '-', rollbackOperator: '-', rollbackReason: '-', ops: ['查看详情', '回退'] }, { merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-06 16:32:44', feeType: '预收税费释放', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '已回退', remark: '释放可用预收', operator: '欧伟权', rollbackTime: '2026-08-07 09:16:03', rollbackOperator: '管理员', rollbackReason: '测试回退', ops: ['查看详情'] }, { merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-05 11:03:18', feeType: '地区税费预收补入', currency: 'EUR', feeAmount: '10', walletCurrency: 'USD', walletAmount: '11.43', status: '扣费成功', remark: '汇率换算由接口返回', operator: '欧伟权', rollbackTime: '-', rollbackOperator: '-', rollbackReason: '-', ops: ['查看详情', '回退'] }],
        modal: {
          type: 'batch-debit',
          title: '新增其他扣费',
          feeTypes: ['开户费', '地区税费预收补入', '预收税费释放'],
          currencies: ['USD', 'EUR', 'GBP'],
          customers: [
            { id: '14229', name: 'test金额变动', merchantId: '14229', walletCurrency: 'USD', currentBalance: '12480.00', availableAmount: '11200.00', realAmount: '10800.00', creditLimit: '5000.00', usedLimit: '1320.00' },
            { id: '11894', name: '测试用户_1777106273', merchantId: '11894', walletCurrency: 'USD', currentBalance: '3260.00', availableAmount: '2980.00', realAmount: '2800.00', creditLimit: '2000.00', usedLimit: '820.00' },
            { id: '1128', name: 'adstest', merchantId: '1128', walletCurrency: 'USD', currentBalance: '860.00', availableAmount: '640.00', realAmount: '640.00', creditLimit: '0.00', usedLimit: '0.00' },
            { id: '14656', name: 'test测试币种GBP', merchantId: '14656', walletCurrency: 'GBP', currentBalance: '2180.00', availableAmount: '1960.00', realAmount: '1840.00', creditLimit: '800.00', usedLimit: '120.00' }
          ]
        } }]
    },
    'location-fee': {
      title: '地区税费',
      subtitle: '管理客户预收池、自动补入、税费比例、流水、税率范围，以及绑卡户补卡。',
      tabs: [
        {
          id: 'overview',
          label: '客户预估税费&预收池总览',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'bd', label: 'BD', type: 'select', options: ['谭英就', '吴文锐', '欧伟权'] },
            { key: 'am', label: 'AM', type: 'select', options: ['李志伟', '邓港', '管理员'] },
            { key: 'compareStatus', label: '对比状态', type: 'select', options: ['充足', '临界', '不足'] },
            { key: 'currency', label: '币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }
          ],
          actions: [
            { id: 'feishu-notice', label: '飞书通知示意', icon: 'bell' },
            { id: 'export', label: '导出数据', icon: 'download', align: 'right' }
          ],
          footerNote: '每日估算跑完后，对对比状态为临界、不足的客户按商户ID各发一条飞书消息，并同时 @ 对应 BD 和 AM。差额 = 0 仍为充足，不发送。预收池余额 = 预收池总收款 − 总税费扣款。自动补入的阈值、变更记录和补入结果在「自动补入」。',
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'bd', label: 'BD' },
            { key: 'am', label: 'AM' },
            { key: 'currency', label: '币种' },
            { key: 'totalReceipt', label: '预收池总收款', format: money, num: true, help: '可以用来扣除地区税费的总金额。公式：累计充值时的预收税费 + 累计的预收补入 − 累计释放。' },
            { key: 'totalTaxDeduct', label: '总税费扣款', format: money, num: true, help: '累计已经扣除的税费。不包括最近 7 天，因为最近的消耗尚未稳定，所以近 7 天的税费未扣除。' },
            { key: 'estimatedTax', label: '近7天预估税费', format: money, num: true, help: '最近 7 天（包括今天）广告消耗产生的地区税费。因为最近的消耗尚未稳定，所以最近 7 天的地区税费并未在预收池中正式扣除。' },
            { key: 'poolBalance', label: '预收池余额', format: money, num: true, help: '当前预收池的余额。公式：预收池总收款 − 总税费扣款。' },
            { key: 'difference', label: '差额', format: money, num: true, help: '预收池总体的差额。公式：预收池余额 − 近7天预估税费。' },
            { key: 'availableBalance', label: '可用余额', format: money, num: true, help: '当前客户钱包里可以用于补入的金额。' },
            { key: 'compareStatus', label: '对比状态', format: status, help: '当前预收池余额和差额的对比。充足：差额 ≥ 0。临界：预收池余额 ≥ 0 并且差额 ＜ 0。不足：预收池余额 ＜ 0。' },
            { key: 'balanceTax', label: '余额税费', format: money, num: true, help: '客户的广告账户（不包括税费后付的广告账户）余额如果全部消耗完，会产生的最大税费。公式：每个广告账户的余额 × 对应的预收税费比例。例如账户 A 余额 100、比例 5%，账户 B 余额 200、比例 3%，余额税费为 100×5% + 200×3% = 11。这两个广告账户用完余额，最大可能产生的税费是 11。' },
            { key: 'releasable', label: '可释放', format: money, num: true, help: '预收池可以释放回客户钱包的金额。公式：差额 − 余额税费。小于 0 时不可释放。' }
          ],
          rows: [
            { merchantId: '18801', customerName: '余额不足', currency: 'USD', estimatedTax: '200.00', poolBalance: '-1000.00', difference: '-1200.00', compareStatus: '不足', balanceTax: '-', releasable: '0.00', totalReceipt: '400.00', totalTaxDeduct: '1400.00', availableBalance: '100.00', bd: '吴文锐', am: '邓港', ops: ['查看明细', '预收补入'] },
            { merchantId: '18803', customerName: '单独阈值', currency: 'USD', estimatedTax: '700.00', poolBalance: '-200.00', difference: '-900.00', compareStatus: '不足', balanceTax: '-', releasable: '0.00', totalReceipt: '900.00', totalTaxDeduct: '1100.00', availableBalance: '3000.00', bd: '欧伟权', am: '管理员', ops: ['查看明细', '预收补入'] },
            { merchantId: '1128', customerName: 'adstest', currency: 'USD', estimatedTax: '150.00', poolBalance: '-120.00', difference: '-270.00', compareStatus: '不足', balanceTax: '-', releasable: '0.00', totalReceipt: '60.00', totalTaxDeduct: '180.00', availableBalance: '640.00', bd: '谭英就', am: '李志伟', ops: ['查看明细', '预收补入'] },
            { merchantId: '14566', customerName: 'Alpine EU', currency: 'USD', estimatedTax: '920.00', poolBalance: '890.00', difference: '-30.00', compareStatus: '临界', balanceTax: '50.00', releasable: '0.00', totalReceipt: '1890.00', totalTaxDeduct: '1000.00', availableBalance: '4200.00', bd: '吴文锐', am: '邓港', ops: ['查看明细', '预收补入'] },
            { merchantId: '18802', customerName: '昨日已补', currency: 'USD', estimatedTax: '400.00', poolBalance: '400.00', difference: '0.00', compareStatus: '充足', balanceTax: '0.00', releasable: '0.00', totalReceipt: '2200.00', totalTaxDeduct: '1800.00', availableBalance: '1100.00', bd: '谭英就', am: '李志伟', ops: ['查看明细'] },
            { merchantId: '14229', customerName: 'test金额变动', currency: 'USD', estimatedTax: '60.00', poolBalance: '96.85', difference: '36.85', compareStatus: '充足', balanceTax: '13.83', releasable: '23.02', totalReceipt: '180.85', totalTaxDeduct: '84.00', availableBalance: '11200.00', bd: '欧伟权', am: '管理员', ops: ['查看明细', '释放'] }
          ]
        },
        {
          id: 'auto-topup-setting',
          navGroup: '自动补入',
          label: '设置',
          market: {
            threshold: '-800.00',
            updatedBy: '管理员',
            updatedAt: '2026-10-01 10:00:00',
            changeLogs: [
              { at: '2026-10-01 10:00:00', by: '管理员', action: '调整', before: '-500.00', after: '-800.00' },
              { at: '2026-08-20 09:00:00', by: '管理员', action: '新增', after: '-500.00' }
            ]
          },
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'status', label: '状态', type: 'select', options: ['开启', '关闭'] }
          ],
          actions: [{ id: 'add-topup-customer', label: '新增客户设置', icon: 'plus', primary: true }],
          footerNote: '客户设置不能删除。关闭后这条阈值不生效，该客户改用大盘阈值。当时可用余额够补当时差额时全部补入；不够则按可用余额部分补入；可用余额为 0 则补入失败，不记流水。触发自动补入都会发送飞书群通知。',
          opsWidth: 220,
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'threshold', label: '阈值', num: true, help: '阈值是负数。差额小于或等于这个数才自动补入。例如 -0.01 表示差额小于或等于 -0.01 就补。关闭后不使用这条，改用大盘阈值。' },
            { key: 'status', label: '状态', format: status, help: '开启：使用这条客户阈值。关闭：不应用这条设置，改用大盘阈值。不能删除。' },
            { key: 'updatedBy', label: '更新人' },
            { key: 'updatedAt', label: '更新时间' }
          ],
          rows: [
            { merchantId: '18803', customerName: '单独阈值', threshold: '-1000.00', status: '开启', updatedBy: '欧伟权', updatedAt: '2026-09-18 14:00:00', ops: ['编辑', '关闭', '变更记录'], changeLogs: [{ at: '2026-09-18 14:00:00', by: '欧伟权', action: '新增', after: '阈值 -1000.00，状态 开启' }] },
            { merchantId: '18801', customerName: '余额不足', threshold: '-500.00', status: '关闭', updatedBy: '管理员', updatedAt: '2026-10-10 11:30:00', ops: ['编辑', '开启', '变更记录'], changeLogs: [{ at: '2026-10-10 11:30:00', by: '管理员', action: '状态', before: '开启', after: '关闭' }, { at: '2026-09-12 16:00:00', by: '管理员', action: '新增', after: '阈值 -500.00，状态 开启' }] }
          ]
        },
        {
          id: 'auto-topup-log',
          navGroup: '自动补入',
          label: '补入日志',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'result', label: '结果', type: 'select', options: ['全部补入', '部分补入', '补入失败'] },
            { key: 'occurredAt', label: '发起时间', type: 'daterange' }
          ],
          footerNote: '每次自动补入按客户记一条。补入金额记入预收池流水。补入失败不记流水。触发自动补入都会发送飞书群通知。',
          opsWidth: 120,
          columns: [
            { key: 'occurredAt', label: '发起时间' },
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'currency', label: '币种' },
            { key: 'appliedThreshold', label: '适用阈值', help: '阈值是负数。差额小于或等于它才补入。客户设置为开启时用客户阈值，关闭或未设置时用大盘阈值。' },
            { key: 'differenceBefore', label: '当时差额', format: money, num: true, help: '检测到需要自动补入时的差额。差额 = 预收池余额 − 近7天预估税费。' },
            { key: 'availableBefore', label: '当时可用余额', format: money, num: true, help: '检测到需要自动补入时，客户钱包里可以用于补入的金额。' },
            { key: 'topupAmount', label: '补入金额', format: money, num: true, help: '这次实际从钱包补进预收池的金额。全部补入等于当时差额的绝对值。部分补入等于当时可用余额。补入失败为 0。' },
            { key: 'differenceAfter', label: '补入后差额', format: money, num: true, help: '补入完成后的差额。等于当时差额加上补入金额。' },
            { key: 'availableAfter', label: '补入后可用余额', format: money, num: true, help: '补入完成后钱包剩余可用余额。等于当时可用余额减去补入金额。' },
            { key: 'result', label: '结果', format: status, help: '全部补入：当时可用余额大于或等于当时差额的绝对值。部分补入：当时可用余额大于 0 但小于当时差额的绝对值，按可用余额补入。补入失败：当时可用余额为 0，不补入。' },
            { key: 'feishu', label: '飞书通知', help: '只要触发自动补入就发送到飞书群，包括全部补入、部分补入和补入失败。' }
          ],
          rows: [
            { occurredAt: '2026-10-23 09:20:00', merchantId: '18801', customerName: '余额不足', currency: 'USD', appliedThreshold: '-800.00（大盘）', differenceBefore: '-1200.00', availableBefore: '100.00', topupAmount: '100.00', differenceAfter: '-1100.00', availableAfter: '0.00', result: '部分补入', feishu: '已发送', ops: ['查看通知'] },
            { occurredAt: '2026-10-22 09:20:00', merchantId: '1128', customerName: 'adstest', currency: 'USD', appliedThreshold: '-800.00（大盘）', differenceBefore: '-860.00', availableBefore: '0.00', topupAmount: '0.00', differenceAfter: '-860.00', availableAfter: '0.00', result: '补入失败', feishu: '已发送', ops: ['查看通知'] },
            { occurredAt: '2026-10-14 09:20:00', merchantId: '18802', customerName: '昨日已补', currency: 'USD', appliedThreshold: '-800.00（大盘）', differenceBefore: '-900.00', availableBefore: '2000.00', topupAmount: '900.00', differenceAfter: '0.00', availableAfter: '1100.00', result: '全部补入', feishu: '已发送', ops: ['查看通知'] }
          ]
        },
        {
          id: 'ratio-customer',
          navGroup: '税费预收比例',
          label: '客户',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'media', label: '媒体', type: 'select', options: ['Meta', 'Google'] },
            { key: 'accountType', label: '账户类型', type: 'select', options: ['海外户', '企业户'] }
          ],
          actions: [{ id: 'create', label: '新增客户预收比例', icon: 'plus', primary: true }],
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'media', label: '媒体' },
            { key: 'accountType', label: '账户类型' },
            { key: 'ratio', label: '预收比例 K%', num: true },
            { key: 'updatedBy', label: '更新人' },
            { key: 'updatedAt', label: '更新时间' }
          ],
          rows: [
            { merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '15.00%', updatedBy: '欧伟权', updatedAt: '2026-08-06 16:00:00', ops: ['编辑', '日志'], ratioLogs: [{ at: '2026-08-06 16:00:00', by: '欧伟权', action: '新增', after: '15.00%' }] },
            { merchantId: '14656', customerName: 'test测试币种GBP', media: 'Meta', accountType: '海外户', ratio: '10.00%', updatedBy: '管理员', updatedAt: '2026-08-05 11:20:05', ops: ['编辑', '日志'], ratioLogs: [{ at: '2026-08-05 11:20:05', by: '管理员', action: '新增', after: '10.00%' }] }
          ],
          modal: {
            title: '新增客户预收比例',
            editTitle: '编辑客户预收比例',
            fields: [
              { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
              { key: 'media', label: '媒体', control: 'select', options: ['Meta', 'Google'] },
              { key: 'accountType', label: '账户类型', control: 'select', options: ['海外户', '企业户'] },
              { key: 'ratio', label: '预收比例 K%', placeholder: '例如 5，0 表示显式不预收' }
            ]
          }
        },
        {
          id: 'ratio-account',
          navGroup: '税费预收比例',
          label: '广告账户',
          filterClass: 'cols-5',
          selectable: true,
          opsWidth: 220,
          filters: [
            { key: 'accountIds', label: '广告账户ID', type: 'textarea', match: 'ids', rowKey: 'accountId', placeholder: '粘贴广告账户ID，一行一个，或用逗号/空格分隔' },
            { key: 'merchantId', label: '当前商户ID', type: 'textarea', match: 'ids', rowKey: 'merchantId', placeholder: '粘贴当前商户ID，一行一个，或用逗号分隔' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'accountName', label: '广告账户名称', placeholder: '请输入广告账户名称' },
            { key: 'autoAdjust', label: '自动调整', type: 'select', options: ['开启', '关闭'] },
            { key: 'taxMode', label: '税费方式', type: 'select', options: ['预付税费', '后付税费'] }
          ],
          actions: [
            { id: 'create', label: '新增账户预收比例', icon: 'plus', primary: true },
            { id: 'batch-ratio', label: '批量设置比例', icon: 'percent', requiresSelection: true },
            { id: 'batch-tax-mode', label: '批量预付后付', icon: 'exchange-alt', requiresSelection: true }
          ],
          footerNote: '列表来自广告账户，不是仅已配置行。不预收把预收比例设为 0%。自动调整默认开启。关闭后，系统不再按投放地区修改这个账户的预收比例。税费方式在新增时设定，之后用「预付后付」或「批量预付后付」修改。后付充值不预收，不参与自动上调，不计余额税费。',
          columns: [
            { key: 'accountId', label: '广告账户ID', align: 'left' },
            { key: 'accountName', label: '广告账户名称', align: 'left' },
            { key: 'merchantId', label: '当前商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'media', label: '媒体' },
            { key: 'accountType', label: '账户类型' },
            { key: 'ratio', label: '预收比例 K%', num: true, help: '充值时从充值金额里拆出预收的比例。账户上的比例优先于客户规则。没有账户比例时用客户规则。后付税费账户充值时不按这个比例预收。不预收把比例设为 0%。' },
            { key: 'taxMode', label: '税费方式', format: status, help: '预付税费在充值时按预收比例拆出预收。后付税费在充值时不预收，不参与自动上调，不计余额税费。差额仍可自动补入。' },
            { key: 'updatedBy', label: '更新人', help: '系统表示按投放地区自动上调预收比例。人工修改比例显示操作人。改预付后付不改这一列。' },
            { key: 'autoAdjust', label: '自动调整', format: status, help: '开启时，系统按广告账户实际投放地区自动设定预收比例。多个税费地区取最大值。实际税率不高于当前比例时不更新。关闭后系统不再改这个账户。' },
            { key: 'updatedAt', label: '更新时间' }
          ],
          rows: [
            { accountId: '238401982', accountName: 'AT-Prospecting', merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '5.00%', customerRatio: '15.00%', source: '账户覆盖', hasOverride: true, autoAdjust: '开启', taxMode: '预付税费', updatedBy: '系统', updatedAt: '2026-10-14 09:10:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-10-14 09:10:00', by: '系统', action: '调整', before: '2.00%', after: '5.00%', note: '依据奥地利 5.00%' }] },
            { accountId: '880011001', accountName: 'Multi-EU', merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '5.00%', customerRatio: '15.00%', source: '账户覆盖', hasOverride: true, autoAdjust: '开启', taxMode: '预付税费', updatedBy: '系统', updatedAt: '2026-10-14 09:10:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-10-14 09:10:00', by: '系统', action: '调整', before: '3.00%', after: '5.00%', note: '依据奥地利 5.00%，同日还有英国 2.00%' }] },
            { accountId: '770022001', accountName: 'UK-Brand', merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '5.00%', customerRatio: '15.00%', source: '账户覆盖', hasOverride: true, autoAdjust: '关闭', taxMode: '预付税费', updatedBy: '欧伟权', updatedAt: '2026-08-20 10:00:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-08-20 10:00:00', by: '欧伟权', action: '自动调整', before: '开启', after: '关闭' }, { at: '2026-08-20 10:00:00', by: '欧伟权', action: '新增', after: '5.00%' }] },
            { accountId: '987654321', accountName: 'US-Prospecting', merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '15.00%', customerRatio: '15.00%', source: '客户规则', hasOverride: false, autoAdjust: '开启', taxMode: '预付税费', updatedBy: '欧伟权', updatedAt: '2026-08-06 16:00:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [] },
            { accountId: '660088221', accountName: 'DE-Postpay', merchantId: '14229', customerName: 'test金额变动', media: 'Meta', accountType: '海外户', ratio: '5.00%', customerRatio: '15.00%', source: '账户覆盖', hasOverride: true, autoAdjust: '开启', taxMode: '后付税费', updatedBy: '管理员', updatedAt: '2026-09-02 14:20:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-09-02 14:20:00', by: '管理员', action: '税费方式', before: '预付税费', after: '后付税费' }, { at: '2026-09-02 14:20:00', by: '管理员', action: '新增', after: '5.00%' }] },
            { accountId: '555000111', accountName: 'EU-Brand', merchantId: '14566', customerName: 'Alpine EU', media: 'Meta', accountType: '海外户', ratio: '—', customerRatio: '', source: '未配置', hasOverride: false, autoAdjust: '开启', taxMode: '后付税费', updatedBy: '-', updatedAt: '-', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-09-01 11:00:00', by: '管理员', action: '税费方式', before: '预付税费', after: '后付税费' }] },
            { accountId: '720911004', accountName: 'TR-Scale', merchantId: '1128', customerName: 'adstest', media: 'Meta', accountType: '海外户', ratio: '0.00%', customerRatio: '', source: '账户覆盖', hasOverride: true, autoAdjust: '开启', taxMode: '预付税费', updatedBy: '管理员', updatedAt: '2026-08-08 09:12:00', ops: ['编辑', '预付后付', '日志'], ratioLogs: [{ at: '2026-08-08 09:12:00', by: '管理员', action: '新增', after: '0.00%' }] }
          ],
          modal: {
            title: '新增账户预收比例',
            editTitle: '编辑账户预收比例',
            createSize: 'md',
            createFields: [
              { key: 'accountId', label: '广告账户ID', control: 'textarea', full: true, placeholder: '粘贴广告账户ID，一行一个，或用空格分隔', help: '支持一次填写多个广告账户ID，用换行或空格分隔。提交后会列出本次新增与覆盖结果。' },
              { key: 'ratio', label: '预收比例 K%', placeholder: '例如 5，0 表示显式不预收' },
              { key: 'taxMode', label: '税费方式', control: 'select', options: ['预付税费', '后付税费'], default: '预付税费', helpInline: true, help: '只在新增时设定。之后改方式用列表里的「预付后付」或「批量预付后付」。后付税费在充值时不预收。' },
              { key: 'autoAdjust', label: '自动调整', control: 'switch', onValue: '开启', offValue: '关闭', required: false, full: true, helpInline: true, help: '开启自动调整，系统会根据广告账户实际投放地区自动设定预收比例。多个税费地区时取最大值。实际投放地区的税费比例比目前设定低时，系统不更新税费比例。' }
            ],
            size: 'md',
            fields: [
              { key: 'accountId', label: '广告账户ID', control: 'readonly' },
              { key: 'ratio', label: '预收比例 K%', placeholder: '例如 5，0 表示显式不预收' },
              { key: 'autoAdjust', label: '自动调整', control: 'switch', onValue: '开启', offValue: '关闭', required: false, full: true, helpInline: true, help: '开启自动调整，系统会根据广告账户实际投放地区自动设定预收比例。多个税费地区时取最大值。实际投放地区的税费比例比目前设定低时，系统不更新税费比例。' }
            ]
          }
        },
        {
          id: 'ratio-adjust-log',
          label: '比例调整记录',
          hideOperation: true,
          filters: [
            { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }
          ],
          footerNote: '只记录系统按投放地区上调预收比例的结果。实际投放税率不高于当前预收比例时不调整，也不会出现在这里。后付税费账户不参与。已关闭自动调整的账户不会被自动上调，也不会新增记录。',
          columns: [
            { key: 'adjustedAt', label: '调整时间' },
            { key: 'accountId', label: '广告账户ID', align: 'left' },
            { key: 'accountName', label: '广告账户名称', align: 'left' },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'beforeRatio', label: '调整前比例', num: true },
            { key: 'afterRatio', label: '调整后比例', num: true },
            { key: 'region', label: '依据地区', align: 'left' },
            { key: 'regionRate', label: '依据税率', num: true }
          ],
          rows: [
            { adjustedAt: '2026-10-14 09:10:00', accountId: '238401982', accountName: 'AT-Prospecting', customerName: 'test金额变动', beforeRatio: '2.00%', afterRatio: '5.00%', region: '奥地利', regionRate: '5.00%' },
            { adjustedAt: '2026-10-14 09:10:00', accountId: '880011001', accountName: 'Multi-EU', customerName: 'test金额变动', beforeRatio: '3.00%', afterRatio: '5.00%', region: '奥地利（同日还有英国 2%）', regionRate: '5.00%' }
          ]
        },
        {
          id: 'pool',
          label: '预收池流水',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'flowType', label: '类型', type: 'select', options: ['账户充值', '税费扣除', '人工补入', '自动补入', '释放回钱包'] },
            { key: 'direction', label: '出/入账', type: 'select', options: ['入账', '出账'] },
            { key: 'currency', label: '变动币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }
          ],
          actions: [{ id: 'export', label: '导出数据', icon: 'download' }],
          columns: [
            { key: 'occurredAt', label: '时间' },
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'direction', label: '出/入账' },
            { key: 'flowType', label: '类型', help: '账户充值是充值时拆出的预收。税费扣除是从预收池冲掉的税费。人工补入是运营手动补入。自动补入是每日任务实际补进预收池的金额。补入失败不记流水。释放回钱包是把可释放金额退回客户钱包。' },
            { key: 'changeCurrency', label: '变动币种' },
            { key: 'changeAmount', label: '变动金额', format: money, num: true },
            { key: 'poolCurrency', label: '预收池币种' },
            { key: 'poolChangeAmount', label: '预收池变动金额', format: money, num: true },
            { key: 'fxRate', label: '汇率', num: true },
            { key: 'accountId', label: '关联账户' },
            { key: 'refNo', label: '关联单号' },
            { key: 'operator', label: '操作人' }
          ],
          rows: [
            { occurredAt: '2026-10-23 09:20:00', merchantId: '18801', customerName: '余额不足', direction: '入账', flowType: '自动补入', changeCurrency: 'USD', changeAmount: '100.00', poolCurrency: 'USD', poolChangeAmount: '100.00', fxRate: '1', accountId: '—', refNo: 'DD20261023001', operator: '系统', ops: ['查看详情'] },
            { occurredAt: '2026-10-14 09:20:00', merchantId: '18802', customerName: '昨日已补', direction: '入账', flowType: '自动补入', changeCurrency: 'USD', changeAmount: '900.00', poolCurrency: 'USD', poolChangeAmount: '900.00', fxRate: '1', accountId: '—', refNo: 'DD20261014001', operator: '系统', ops: ['查看详情'] },
            { occurredAt: '2026-08-12 11:20:08', merchantId: '14229', customerName: 'test金额变动', direction: '入账', flowType: '账户充值', changeCurrency: 'USD', changeAmount: '50.00', poolCurrency: 'USD', poolChangeAmount: '50.00', fxRate: '1', accountId: '238401982', refNo: 'RC20260812001', operator: '系统-充值', ops: ['查看详情'] },
            { occurredAt: '2026-08-10 09:16:03', merchantId: '14229', customerName: 'test金额变动', direction: '出账', flowType: '税费扣除', changeCurrency: 'USD', changeAmount: '-84.00', poolCurrency: 'USD', poolChangeAmount: '-84.00', fxRate: '1', accountId: '238401982', refNo: 'TX20260810003', operator: '系统-冲抵', ops: ['查看详情'] },
            { occurredAt: '2026-08-07 14:20:00', merchantId: '14229', customerName: 'test金额变动', direction: '入账', flowType: '人工补入', changeCurrency: 'USD', changeAmount: '30.00', poolCurrency: 'USD', poolChangeAmount: '30.00', fxRate: '1', accountId: '—', refNo: 'DD20260807014', operator: '欧伟权', ops: ['查看详情'] },
            { occurredAt: '2026-08-06 16:08:02', merchantId: '14229', customerName: 'test金额变动', direction: '出账', flowType: '释放回钱包', changeCurrency: 'USD', changeAmount: '-20.00', poolCurrency: 'USD', poolChangeAmount: '-20.00', fxRate: '1', accountId: '—', refNo: 'RL20260806002', operator: '管理员', ops: ['查看详情'] },
            { occurredAt: '2026-08-05 11:02:18', merchantId: '14566', customerName: 'Alpine EU', direction: '出账', flowType: '税费扣除', changeCurrency: 'EUR', changeAmount: '-49.00', poolCurrency: 'USD', poolChangeAmount: '-53.26', fxRate: '1.087', accountId: '555000111', refNo: 'TX20260805011', operator: '系统-冲抵', ops: ['查看详情'] }
          ]
        },
        {
          id: 'detail',
          label: '税费明细',
          filters: [
            { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' },
            { key: 'country', label: '国家/地区', placeholder: '请输入国家/地区' },
            { key: 'currency', label: '币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }
          ],
          actions: [{ id: 'export', label: '导出数据', icon: 'download' }],
          columns: [
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'country', label: '国家/地区' },
            { key: 'taxableAmount', label: '计税金额', format: money, num: true },
            { key: 'taxAmount', label: '税费金额', format: money, num: true },
            { key: 'currency', label: '币种' },
            { key: 'createdAt', label: '统计时间' }
          ],
          rows: [
            { merchantId: '14229', customerName: 'test金额变动', country: '奥地利', taxableAmount: '1,200.00', taxAmount: '60.00', currency: 'USD', createdAt: '2026-07-13', ops: ['查看详情'] },
            { merchantId: '14566', customerName: 'Alpine EU', country: '英国', taxableAmount: '2,450.00', taxAmount: '49.00', currency: 'EUR', createdAt: '2026-07-12', ops: ['查看详情'] }
          ]
        },
        {
          id: 'card-topup',
          label: '绑卡户补卡',
          opsWidth: 240,
          filters: [
            { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' },
            { key: 'period', label: '周期', type: 'select', options: ['2026-10-05 ~ 2026-10-11', '2026-09-28 ~ 2026-10-04'] },
            { key: 'status', label: '处理状态', type: 'select', options: ['待发起', '审批中', '调额中', '已完成', '审批未通过', '调额失败'] }
          ],
          footerNote: '每周一生成上上周一至上上周日的绑卡户税费，一行是一个广告账户的一个周期。运营发起飞书审批，审批通过后 Slash 调增当前卡额度。Slash 调额成功后，状态才是已完成。没有当前 Slash 卡不能发起。审批未通过或调额失败可以重新发起。预收池余额小于 0 时，发起前会提示已出现拖欠税费，确认后仍可发起。预收池不再扣这笔。',
          columns: [
            { key: 'generatedAt', label: '生成日期' },
            { key: 'period', label: '周期', help: '每周一生成的是上上周一至上上周日。' },
            { key: 'accountId', label: '广告账户ID', align: 'left' },
            { key: 'accountName', label: '广告账户名称', align: 'left' },
            { key: 'merchantId', label: '商户ID', format: merchant },
            { key: 'customerName', label: '客户名称', align: 'left' },
            { key: 'poolBalance', label: '预收池余额', format: money, num: true, help: '这个客户当前的预收池余额，与总览一致。小于 0 时，发起调额会提示已出现拖欠税费。' },
            { key: 'taxMode', label: '税费方式', format: status },
            { key: 'cardLabel', label: '当前Slash卡', help: '发起时这个绑卡户正在使用的 Slash 卡。没有当前卡不能发起。' },
            { key: 'taxAmount', label: '周期税费金额', format: money, num: true, help: '该周期内这个广告账户产生的税费合计，也是本次增加 Slash 卡额度的金额。' },
            { key: 'status', label: '处理状态', format: status, help: '周一生成后为待发起。运营发起飞书审批后为审批中。审批通过后进入调额中。Slash 调额成功后为已完成。审批未通过或调额失败可以重新发起。' }
          ],
          rows: [
            { generatedAt: '2026-10-19', period: '2026-10-05 ~ 2026-10-11', accountId: '238401982', accountName: 'AT-Prospecting', merchantId: '14229', customerName: 'test金额变动', taxMode: '预付税费', cardLabel: '尾号 4412', taxAmount: '43.00', status: '待发起', selectable: true, ops: ['发起调额', '查看依据'], progress: [{ at: '2026-10-19 09:00:00', title: '系统生成', note: '周期 2026-10-05 ~ 2026-10-11，税费 43.00 USD' }] },
            { generatedAt: '2026-10-19', period: '2026-10-05 ~ 2026-10-11', accountId: '188010088', accountName: '欠费绑卡', merchantId: '18801', customerName: '余额不足', taxMode: '预付税费', cardLabel: '尾号 8801', taxAmount: '12.00', status: '待发起', selectable: true, ops: ['发起调额', '查看依据'], progress: [{ at: '2026-10-19 09:00:00', title: '系统生成', note: '周期 2026-10-05 ~ 2026-10-11，税费 12.00 USD' }] },
            { generatedAt: '2026-10-19', period: '2026-10-05 ~ 2026-10-11', accountId: '660088221', accountName: 'DE-Postpay', merchantId: '14229', customerName: 'test金额变动', taxMode: '后付税费', cardLabel: '尾号 2208', taxAmount: '58.00', status: '审批中', selectable: true, ops: ['查看进度', '查看依据'], progress: [{ at: '2026-10-19 09:00:00', title: '系统生成', note: '周期 2026-10-05 ~ 2026-10-11，税费 58.00 USD' }, { at: '2026-10-20 11:20:00', title: '发起飞书审批', note: '管理员，当前卡 尾号 2208，调增 58.00 USD' }] },
            { generatedAt: '2026-10-19', period: '2026-10-05 ~ 2026-10-11', accountId: '910077002', accountName: '废卡未换', merchantId: '14566', customerName: 'Alpine EU', taxMode: '预付税费', cardLabel: '无', taxAmount: '5.00', status: '待发起', selectable: false, ops: ['发起调额', '查看依据'], progress: [{ at: '2026-10-19 09:00:00', title: '系统生成', note: '周期 2026-10-05 ~ 2026-10-11，税费 5.00 USD。没有当前 Slash 卡，不能发起。' }] },
            { generatedAt: '2026-10-12', period: '2026-09-28 ~ 2026-10-04', accountId: '238401982', accountName: 'AT-Prospecting', merchantId: '14229', customerName: 'test金额变动', taxMode: '预付税费', cardLabel: '尾号 4412', taxAmount: '61.00', status: '已完成', selectable: true, ops: ['查看进度', '查看依据'], progress: [{ at: '2026-10-12 09:00:00', title: '系统生成', note: '周期 2026-09-28 ~ 2026-10-04，税费 61.00 USD' }, { at: '2026-10-13 10:15:00', title: '发起飞书审批', note: '管理员，当前卡 尾号 4412，调增 61.00 USD' }, { at: '2026-10-13 16:40:00', title: '审批通过', note: '飞书审批通过，开始调额' }, { at: '2026-10-13 16:42:00', title: 'Slash 调额成功', note: '尾号 4412 已增加 61.00 USD' }] },
            { generatedAt: '2026-10-12', period: '2026-09-28 ~ 2026-10-04', accountId: '660088221', accountName: 'DE-Postpay', merchantId: '14229', customerName: 'test金额变动', taxMode: '后付税费', cardLabel: '尾号 2208', taxAmount: '30.00', status: '调额失败', selectable: true, ops: ['重新发起', '查看进度', '查看依据'], progress: [{ at: '2026-10-12 09:00:00', title: '系统生成', note: '周期 2026-09-28 ~ 2026-10-04，税费 30.00 USD' }, { at: '2026-10-13 14:05:00', title: '发起飞书审批', note: '管理员，当前卡 尾号 2208，调增 30.00 USD' }, { at: '2026-10-14 09:30:00', title: '审批通过', note: '飞书审批通过，开始调额' }, { at: '2026-10-14 09:31:00', title: 'Slash 调额失败', note: '调额未成功，状态不是已完成，可以重新发起' }] }
          ]
        },
        {
          id: 'card-basis',
          label: '补卡依据',
          hideOperation: true,
          filters: [
            { key: 'period', label: '周期', type: 'select', options: ['2026-10-05 ~ 2026-10-11', '2026-09-28 ~ 2026-10-04'] },
            { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
            { key: 'country', label: '税费地区', type: 'select', options: ['奥地利', '英国'] }
          ],
          actions: [{ id: 'export', label: '下载', icon: 'download', primary: true }],
          footerNote: '一行是一个广告账户、一个消耗日、一个税费地区。只看该周期内的消耗、税费比例和税费金额。',
          columns: [
            { key: 'period', label: '周期' },
            { key: 'accountId', label: '广告账户ID', align: 'left' },
            { key: 'accountName', label: '广告账户名称', align: 'left' },
            { key: 'spendDate', label: '消耗日期' },
            { key: 'country', label: '税费地区' },
            { key: 'taxableSpend', label: '消耗', format: money, num: true },
            { key: 'taxRate', label: '税费比例', num: true },
            { key: 'taxAmount', label: '税费金额', format: money, num: true }
          ],
          rows: [
            { period: '2026-10-05 ~ 2026-10-11', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-10-08', country: '奥地利', taxableSpend: '400.00', taxRate: '5.00%', taxAmount: '20.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-10-09', country: '奥地利', taxableSpend: '260.00', taxRate: '5.00%', taxAmount: '13.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-10-10', country: '英国', taxableSpend: '500.00', taxRate: '2.00%', taxAmount: '10.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '188010088', accountName: '欠费绑卡', spendDate: '2026-10-08', country: '奥地利', taxableSpend: '240.00', taxRate: '5.00%', taxAmount: '12.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '660088221', accountName: 'DE-Postpay', spendDate: '2026-10-05', country: '奥地利', taxableSpend: '600.00', taxRate: '5.00%', taxAmount: '30.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '660088221', accountName: 'DE-Postpay', spendDate: '2026-10-06', country: '英国', taxableSpend: '400.00', taxRate: '2.00%', taxAmount: '8.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '660088221', accountName: 'DE-Postpay', spendDate: '2026-10-11', country: '奥地利', taxableSpend: '400.00', taxRate: '5.00%', taxAmount: '20.00' },
            { period: '2026-10-05 ~ 2026-10-11', accountId: '910077002', accountName: '废卡未换', spendDate: '2026-10-07', country: '奥地利', taxableSpend: '100.00', taxRate: '5.00%', taxAmount: '5.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-09-28', country: '奥地利', taxableSpend: '200.00', taxRate: '5.00%', taxAmount: '10.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-09-29', country: '奥地利', taxableSpend: '100.00', taxRate: '5.00%', taxAmount: '5.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-10-01', country: '奥地利', taxableSpend: '800.00', taxRate: '5.00%', taxAmount: '40.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '238401982', accountName: 'AT-Prospecting', spendDate: '2026-10-02', country: '英国', taxableSpend: '300.00', taxRate: '2.00%', taxAmount: '6.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '660088221', accountName: 'DE-Postpay', spendDate: '2026-09-30', country: '英国', taxableSpend: '1000.00', taxRate: '2.00%', taxAmount: '20.00' },
            { period: '2026-09-28 ~ 2026-10-04', accountId: '660088221', accountName: 'DE-Postpay', spendDate: '2026-10-03', country: '奥地利', taxableSpend: '200.00', taxRate: '5.00%', taxAmount: '10.00' }
          ]
        },
        {
          id: 'config',
          label: '税率与范围配置',
          filters: [
            { key: 'country', label: '国家/地区', placeholder: '请输入国家/地区' },
            { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }
          ],
          actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }],
          columns: [
            { key: 'country', label: '国家/地区' },
            { key: 'scope', label: '计税范围', align: 'left' },
            { key: 'rate', label: '税率', num: true },
            { key: 'status', label: '状态', format: status },
            { key: 'updatedAt', label: '更新时间' }
          ],
          rows: [
            { country: '奥地利', scope: 'Meta × 海外户', rate: '5.00%', status: '启用', updatedAt: '2026-08-06 15:10:10', ops: ['编辑'] },
            { country: '英国', scope: 'Meta × 海外户', rate: '2.00%', status: '启用', updatedAt: '2026-08-05 09:32:45', ops: ['编辑'] }
          ]
        }
      ]
    },
    'export-center': {
      title: '导出中心', subtitle: '查看导出任务处理状态，成功任务可下载文件。',
      tabs: [{ id: 'list', label: '', filters: [{ key: 'taskId', label: '任务ID', placeholder: '请输入任务ID' }], actions: [], columns: [{ key: 'taskId', label: '任务ID', num: true }, { key: 'fileName', label: '导出文件名称 / 失败原因', align: 'left' }, { key: 'startAt', label: '导出开始时间' }, { key: 'exportAt', label: '导出时间' }, { key: 'operator', label: '操作人' }, { key: 'status', label: '状态', format: status }], rows: [{ taskId: '851', fileName: 'ads_account_load_url_log_export_1785984412.xlsx', startAt: '2026-08-08 10:10:12', exportAt: '2026-08-08 10:10:24', operator: '欧伟权', status: '处理成功', ops: ['下载文件'] }, { taskId: '711', fileName: '指定时间范围内无数据', startAt: '2026-08-07 16:24:08', exportAt: '2026-08-07 16:24:09', operator: '管理员', status: '处理失败', ops: ['下载文件'] }, { taskId: '702', fileName: 'customer_recharge_report_1785901211.xlsx', startAt: '2026-08-07 11:00:01', exportAt: '-', operator: '管理员', status: '处理中', ops: ['下载文件'] }] }]
    }
  };


  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, configs);
  window.BESTADS_ADMIN_FORMATTERS = Object.assign({}, window.BESTADS_ADMIN_FORMATTERS || {}, { countWithUnit });
})();
