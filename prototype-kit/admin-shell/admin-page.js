/*
 * BestAds 运营端主要功能页面内容区。
 * 这些页面使用测试环境已确认的字段和样例数据进行静态演示，不代表已经接入真实 API。
 */
(function () {
  'use strict';

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
    const cls = /启用|成功|充足|正常|已完成|可下载|完成/.test(text) ? 'status-success' : /失败|停用|不足|回退|禁用|异常/.test(text) ? 'status-danger' : /处理中|待/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${text}</span>`;
  };
  const countWithUnit = value => {
    const text = value == null || value === '' ? '-' : String(value);
    return text === '-' ? '<span class="muted">-</span>' : `${esc(text)} 个`;
  };
  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const icon = name => `<i class="fas fa-${name}" aria-hidden="true"></i>`;

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
      title: '返点配置', subtitle: '按账户类型、账户和客户配置返点比例。',
      tabs: [
        { id: 'type', label: '账户类型返点', filters: [{ key: 'agent', label: '代理', placeholder: '请输入代理名称' }, { key: 'media', label: '媒体', type: 'select', options: ['Facebook', 'Tiktok', 'Google'] }, { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }], actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }], columns: [{ key: 'agent', label: '代理', align: 'left' }, { key: 'media', label: '媒体' }, { key: 'accountType', label: '账户类型', align: 'left' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedBy', label: '修改人' }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ agent: 'it-test', media: 'Facebook', accountType: '广告账户类型123', rebate: '5.00', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-08-07 16:20:00', ops: ['编辑'] }, { agent: 'Madhouse', media: 'Facebook', accountType: 'Google-企业户', rebate: '6.00', status: '启用', updatedBy: '管理员', updatedAt: '2026-08-06 12:08:44', ops: ['编辑'] }, { agent: 'Panda', media: 'Tiktok', accountType: 'Tiktok-企业户', rebate: '4.50', status: '启用', updatedBy: '欧伟权', updatedAt: '2026-08-05 09:21:37', ops: ['编辑'] }] },
        { id: 'account', label: '账户返点', filters: [{ key: 'accountName', label: '广告账户', placeholder: '请输入广告账户' }, { key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }], actions: [{ id: 'batch-status', label: '批量修改状态', icon: 'edit' }, { id: 'batch-rebate', label: '批量修改返点', icon: 'percent' }, { id: 'create', label: '新增配置', icon: 'plus', primary: true }], selectable: true, columns: [{ key: 'accountName', label: '广告账户', align: 'left' }, { key: 'merchantId', label: '商户ID', format: merchant }, { key: 'media', label: '媒体' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ accountName: 'act_123456789 / test测试', merchantId: '14656', media: 'Facebook', rebate: '5.00', status: '启用', updatedAt: '2026-08-07 10:23:01', ops: ['编辑'] }, { accountName: 'aw_987654321 / adstest', merchantId: '1128', media: 'Google', rebate: '3.50', status: '停用', updatedAt: '2026-08-04 17:04:15', ops: ['编辑'] }] },
        { id: 'customer', label: '客户返点', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }], actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'media', label: '媒体' }, { key: 'rebate', label: '返点(%)', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '最后修改时间' }], rows: [{ merchantId: '14656', customerName: 'test测试币种GBP', media: 'Facebook', rebate: '2.00', status: '启用', updatedAt: '2026-08-07 10:20:12', ops: ['编辑'] }, { merchantId: '14229', customerName: 'test金额变动', media: 'Google', rebate: '1.50', status: '启用', updatedAt: '2026-08-06 16:44:08', ops: ['编辑'] }] }
      ]
    },
    'deduction-details': {
      title: '其他扣费', subtitle: '查看地区税费预收、释放等其他资金流水，数据为测试环境样例。',
      tabs: [{ id: 'list', label: '', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }, { key: 'operator', label: '操作人', placeholder: '请输入操作人' }, { key: 'feeType', label: '扣费类型', type: 'select', options: ['地区税费预收补入', '预收税费释放'] }, { key: 'status', label: '流水状态', type: 'select', options: ['扣费成功', '已回退'] }, { key: 'currency', label: '扣费币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }, { key: 'feeTime', label: '扣费时间', type: 'date' }], actions: [{ id: 'create', label: '新增其他扣费', icon: 'plus', primary: true }, { id: 'export', label: '导出数据', icon: 'download' }], columns: [
        { key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'feeTime', label: '扣费时间' }, { key: 'feeType', label: '扣费类型', align: 'left' }, { key: 'currency', label: '扣费币种' }, { key: 'feeAmount', label: '扣费金额', format: money, num: true }, { key: 'walletCurrency', label: '钱包币种' }, { key: 'walletAmount', label: '钱包扣费金额', format: money, num: true }, { key: 'status', label: '流水状态', format: status }, { key: 'remark', label: '备注', align: 'left' }, { key: 'operator', label: '扣费操作人' }, { key: 'rollbackTime', label: '回退时间' }, { key: 'rollbackOperator', label: '回退操作人' }, { key: 'rollbackReason', label: '回退原因', align: 'left' }
      ], rows: [{ merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-07 14:20:00', feeType: '地区税费预收补入', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '扣费成功', remark: '税费预收池补入', operator: '欧伟权', rollbackTime: '-', rollbackOperator: '-', rollbackReason: '-', ops: ['查看详情', '回退'] }, { merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-06 16:32:44', feeType: '预收税费释放', currency: 'USD', feeAmount: '30', walletCurrency: 'USD', walletAmount: '30', status: '已回退', remark: '释放可用预收', operator: '欧伟权', rollbackTime: '2026-08-07 09:16:03', rollbackOperator: '管理员', rollbackReason: '测试回退', ops: ['查看详情'] }, { merchantId: '14229', customerName: 'test金额变动', feeTime: '2026-08-05 11:03:18', feeType: '地区税费预收补入', currency: 'EUR', feeAmount: '10', walletCurrency: 'USD', walletAmount: '11.43', status: '扣费成功', remark: '汇率换算由接口返回', operator: '欧伟权', rollbackTime: '-', rollbackOperator: '-', rollbackReason: '-', ops: ['查看详情', '回退'] }], modal: { title: '新增其他扣费', fields: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入5位商户ID' }, { key: 'feeType', label: '扣费类型', placeholder: '请选择扣费类型' }, { key: 'currency', label: '扣费币种', placeholder: '请选择币种' }, { key: 'feeAmount', label: '扣费金额', placeholder: '请输入扣费金额' }, { key: 'remark', label: '备注', placeholder: '请输入备注', full: true }] } }]
    },
    'location-fee': {
      title: '地区税费', subtitle: '管理客户预收池、税费比例、流水和税率范围。',
      tabs: [
        { id: 'overview', label: '客户预估税费&预收池总览', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }, { key: 'compareStatus', label: '对比状态', type: 'select', options: ['充足', '不足'] }, { key: 'currency', label: '币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }], actions: [{ id: 'export', label: '导出数据', icon: 'download' }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'currency', label: '币种' }, { key: 'estimatedTax', label: '预估税费', format: money, num: true }, { key: 'poolBalance', label: '预收池余额', format: money, num: true }, { key: 'difference', label: '差额', format: money, num: true }, { key: 'compareStatus', label: '对比状态', format: status }, { key: 'balanceTax', label: '余额税费', format: money, num: true }, { key: 'releasable', label: '可释放', format: money, num: true }], rows: [{ merchantId: '1128', customerName: 'adstest', currency: 'USD', estimatedTax: '150', poolBalance: '-120', difference: '-270', compareStatus: '不足', balanceTax: '-', releasable: '0', ops: ['查看明细', '预收补入'] }, { merchantId: '14229', customerName: 'test金额变动', currency: 'USD', estimatedTax: '60', poolBalance: '96.85', difference: '36.85', compareStatus: '充足', balanceTax: '13.83', releasable: '23.02', ops: ['查看明细', '释放'] }] },
        { id: 'ratio', label: '税费预收比例', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'customerName', label: '客户名称', placeholder: '请输入客户名称' }, { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }], actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'ratio', label: '预收比例', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '更新时间' }], rows: [{ merchantId: '14229', customerName: 'test金额变动', ratio: '15.00%', status: '启用', updatedAt: '2026-08-06 16:00:00', ops: ['编辑'] }, { merchantId: '14656', customerName: 'test测试币种GBP', ratio: '10.00%', status: '启用', updatedAt: '2026-08-05 11:20:05', ops: ['编辑'] }] },
        { id: 'pool', label: '预收池流水', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'flowType', label: '流水类型', type: 'select', options: ['预收补入', '税费释放'] }, { key: 'currency', label: '币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }], actions: [{ id: 'export', label: '导出数据', icon: 'download' }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'flowType', label: '流水类型' }, { key: 'currency', label: '币种' }, { key: 'amount', label: '金额', format: money, num: true }, { key: 'createdAt', label: '发生时间' }, { key: 'operator', label: '操作人' }], rows: [{ merchantId: '14229', customerName: 'test金额变动', flowType: '预收补入', currency: 'USD', amount: '30', createdAt: '2026-08-07 14:20:00', operator: '欧伟权', ops: ['查看详情'] }, { merchantId: '14229', customerName: 'test金额变动', flowType: '税费释放', currency: 'USD', amount: '-30', createdAt: '2026-08-07 09:16:03', operator: '管理员', ops: ['查看详情'] }] },
        { id: 'detail', label: '税费明细', filters: [{ key: 'merchantId', label: '商户ID', placeholder: '请输入商户ID' }, { key: 'country', label: '国家/地区', placeholder: '请输入国家/地区' }, { key: 'currency', label: '币种', type: 'select', options: ['USD', 'EUR', 'GBP'] }], actions: [{ id: 'export', label: '导出数据', icon: 'download' }], columns: [{ key: 'merchantId', label: '商户ID', format: merchant }, { key: 'customerName', label: '客户名称', align: 'left' }, { key: 'country', label: '国家/地区' }, { key: 'taxableAmount', label: '计税金额', format: money, num: true }, { key: 'taxAmount', label: '税费金额', format: money, num: true }, { key: 'currency', label: '币种' }, { key: 'createdAt', label: '统计时间' }], rows: [{ merchantId: '14229', customerName: 'test金额变动', country: '美国', taxableAmount: '460.00', taxAmount: '60.00', currency: 'USD', createdAt: '2026-08-07 23:59:59', ops: ['查看详情'] }, { merchantId: '14656', customerName: 'test测试币种GBP', country: '英国', taxableAmount: '1,020.00', taxAmount: '102.00', currency: 'GBP', createdAt: '2026-08-07 23:59:59', ops: ['查看详情'] }] },
        { id: 'config', label: '税率与范围配置', filters: [{ key: 'country', label: '国家/地区', placeholder: '请输入国家/地区' }, { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }], actions: [{ id: 'create', label: '新增配置', icon: 'plus', primary: true }], columns: [{ key: 'country', label: '国家/地区' }, { key: 'scope', label: '计税范围', align: 'left' }, { key: 'rate', label: '税率', num: true }, { key: 'status', label: '状态', format: status }, { key: 'updatedAt', label: '更新时间' }], rows: [{ country: '美国', scope: '广告消耗', rate: '13.00%', status: '启用', updatedAt: '2026-08-06 15:10:10', ops: ['编辑'] }, { country: '英国', scope: '广告消耗', rate: '20.00%', status: '启用', updatedAt: '2026-08-05 09:32:45', ops: ['编辑'] }] }
      ]
    },
    'export-center': {
      title: '导出中心', subtitle: '查看导出任务处理状态，成功任务可下载文件。',
      tabs: [{ id: 'list', label: '', filters: [{ key: 'taskId', label: '任务ID', placeholder: '请输入任务ID' }], actions: [], columns: [{ key: 'taskId', label: '任务ID', num: true }, { key: 'fileName', label: '导出文件名称 / 失败原因', align: 'left' }, { key: 'startAt', label: '导出开始时间' }, { key: 'exportAt', label: '导出时间' }, { key: 'operator', label: '操作人' }, { key: 'status', label: '状态', format: status }], rows: [{ taskId: '851', fileName: 'ads_account_load_url_log_export_1785984412.xlsx', startAt: '2026-08-08 10:10:12', exportAt: '2026-08-08 10:10:24', operator: '欧伟权', status: '处理成功', ops: ['下载文件'] }, { taskId: '711', fileName: '指定时间范围内无数据', startAt: '2026-08-07 16:24:08', exportAt: '2026-08-07 16:24:09', operator: '管理员', status: '处理失败', ops: ['下载文件'] }, { taskId: '702', fileName: 'customer_recharge_report_1785901211.xlsx', startAt: '2026-08-07 11:00:01', exportAt: '-', operator: '管理员', status: '处理中', ops: ['下载文件'] }] }]
    }
  };

  function getConfig() {
    const key = document.body && document.body.dataset ? document.body.dataset.adminPage : '';
    return configs[key] || configs['customer-sub-account'];
  }

  function fieldHtml(field, values) {
    const value = values[field.key] || '';
    if (field.type === 'select') return `<div class="filter-field"><label>${esc(field.label)}</label><select data-filter="${esc(field.key)}"><option value="">全部</option>${(field.options || []).map(v => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
    return `<div class="filter-field"><label>${esc(field.label)}</label><input data-filter="${esc(field.key)}" type="${field.type === 'date' ? 'date' : 'text'}" placeholder="${esc(field.placeholder || '')}" value="${esc(value)}"></div>`;
  }

  function columnHtml(column, row) {
    const value = row[column.key];
    const rendered = column.format ? column.format(value) : column.formatter === 'countWithUnit' ? countWithUnit(value) : asText(value);
    return `<td class="${column.num ? 'num ' : ''}${column.align === 'left' ? 'left ' : ''}${column.wrap ? 'wrap' : ''}">${rendered}</td>`;
  }

  function modalControlHtml(field, value) {
    const control = field.control || (field.type === 'textarea' ? 'textarea' : 'text');
    const normalizedValue = Array.isArray(value) ? value : [value];
    if (control === 'textarea') return `<textarea name="${esc(field.key)}" placeholder="${esc(field.placeholder || '')}">${esc(value || '')}</textarea>`;
    if (control === 'customer-select' || control === 'role-select' || control === 'status-select') {
      return `<select name="${esc(field.key)}"><option value="">${esc(field.placeholder || '请选择')}</option>${(field.options || []).map(option => `<option value="${esc(option)}"${String(option) === String(value || '') ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
    }
    if (control === 'account-multi-select') {
      return `<div class="account-check-list">${(field.options || []).map((option, index) => {
        const checked = normalizedValue.includes(option);
        const id = `${field.key}-${index}`;
        return `<label class="account-check"><input id="${esc(id)}" type="checkbox" name="${esc(field.key)}" value="${esc(option)}"${checked ? ' checked' : ''}><span>${esc(option)}</span></label>`;
      }).join('')}</div>`;
    }
    const type = control === 'password' ? 'password' : 'text';
    return `<input name="${esc(field.key)}" type="${type}" placeholder="${esc(field.placeholder || '')}" value="${esc(value || '')}">`;
  }

  function modalFormHtml(modal, title, row) {
    const fields = (modal && modal.fields) || [];
    return `<div class="modal-backdrop" data-modal="form"><section class="modal"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close aria-label="关闭">${icon('times')}</button></div><div class="modal__body"><div class="form-grid">${fields.map(field => { const required = row && field.editRequired !== undefined ? field.editRequired : field.required !== false; return `<div class="form-field${field.full ? ' full' : ''}"><label>${esc(field.label)}${required ? ' <span style="color:var(--admin-danger)">*</span>' : ''}</label>${modalControlHtml(field, row && row[field.key])}</div>`; }).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function confirmModalHtml(title, copy, danger) {
    return `<div class="modal-backdrop" data-modal="confirm"><section class="modal modal-sm"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close aria-label="关闭">${icon('times')}</button></div><div class="modal__body"><div class="confirm-copy">${copy}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-modal-submit>确定</button></div></section></div>`;
  }

  function detailModalHtml(title, row) {
    return `<div class="modal-backdrop" data-modal="detail"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close aria-label="关闭">${icon('times')}</button></div><div class="modal__body"><div class="notice">以下为原型展示的测试环境样例，不代表已从生产接口读取。</div><dl class="detail-grid">${Object.keys(row || {}).filter(k => k !== 'ops').map(key => `<div><dt>${esc(key)}</dt><dd>${esc(asText(row[key]))}</dd></div>`).join('')}</dl></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function boot() {
    const root = document.getElementById('page-root');
    if (!root) return;
    const config = getConfig();
    const state = { tab: (config.tabs && config.tabs[0] && config.tabs[0].id) || 'list', values: {}, rows: {}, selected: new Set(), sort: {} };
    (config.tabs || []).forEach(tab => { state.rows[tab.id] = tab.rows ? tab.rows.slice() : []; });

    function activeTab() { return (config.tabs || []).find(tab => tab.id === state.tab) || config.tabs[0]; }
    function showToast(message, type) {
      let stack = document.querySelector('.toast-stack');
      if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; document.body.appendChild(stack); }
      const node = document.createElement('div'); node.className = `toast ${type || 'info'}`; node.textContent = message; stack.appendChild(node);
      window.setTimeout(() => node.remove(), 2600);
    }
    function openModal(html) { document.body.insertAdjacentHTML('beforeend', html); }
    function closeModal() { const node = document.querySelector('.modal-backdrop'); if (node) node.remove(); }
    function render() {
      const tab = activeTab();
      const hasTabs = (config.tabs || []).filter(item => item.label).length > 1;
      const tabHtml = hasTabs ? `<div class="business-tabs" role="tablist">${config.tabs.filter(item => item.label).map(item => `<button type="button" class="business-tab${item.id === state.tab ? ' is-active' : ''}" role="tab" aria-selected="${item.id === state.tab}" data-tab="${esc(item.id)}">${esc(item.label)}</button>`).join('')}</div>` : '';
      const filterHtml = (tab.filters && tab.filters.length) ? `<section class="admin-card filter-card"><div class="admin-card__body"><div class="filter-grid ${tab.filterClass || (tab.filters.length >= 7 ? 'cols-7' : tab.filters.length >= 5 ? 'cols-5' : tab.filters.length === 3 ? 'cols-3' : '')}">${tab.filters.map(field => fieldHtml(field, state.values[state.tab] || {})).join('')}<div class="filter-actions"><button class="btn btn-default" type="button" data-action="reset">重置</button><button class="btn btn-primary" type="button" data-action="search">${icon('search')}搜索</button></div></div></div></section>` : '';
      const actions = (tab.actions || []).map(action => `<button type="button" class="btn ${action.primary ? 'btn-primary' : 'btn-default'}" data-action="${esc(action.id)}"${action.requiresSelection ? ' data-requires-selection' : ''}>${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const selectHead = tab.selectable ? '<th style="width:50px"><input type="checkbox" data-select-all aria-label="全选"></th>' : '';
      const rows = filteredRows(tab).map((row, index) => `<tr data-row-index="${index}">${tab.selectable ? `<td><input type="checkbox" data-select-row="${index}" aria-label="选择第${index + 1}行"></td>` : ''}${tab.columns.map(column => column.sort ? `<td class="${column.num ? 'num ' : ''}${column.align === 'left' ? 'left ' : ''}"><span>${column.format ? column.format(row[column.key]) : column.formatter === 'countWithUnit' ? countWithUnit(row[column.key]) : asText(row[column.key])}</span></td>` : columnHtml(column, row)).join('')}<td class="ops"><div class="command-group">${(row.ops || []).map(op => `<button type="button" class="btn btn-link${/重置密码|删除/.test(op) ? ' btn-link-danger' : ''}" data-row-action="${esc(op)}" data-row-index="${index}">${esc(op)}</button>`).join('')}</div></td></tr>`).join('');
      const sortHeaders = tab.columns.map(column => { const headerClass = [column.num ? 'num' : '', column.headerAlign === 'left' ? 'left' : ''].filter(Boolean).join(' '); return column.sort ? `<th class="${headerClass}"><button type="button" class="sort-trigger ${state.sort[state.tab] && state.sort[state.tab].key === column.key ? `is-${state.sort[state.tab].dir}` : ''}" data-sort="${esc(column.key)}">${esc(column.label)} ${icon(state.sort[state.tab] && state.sort[state.tab].key === column.key && state.sort[state.tab].dir === 'desc' ? 'sort-down' : 'sort-up')}</button></th>` : `<th class="${headerClass}">${esc(column.label)}</th>`; }).join('');
      const colgroup = (tab.columns || []).some(column => column.width) || tab.tableMinWidth ? `<colgroup>${tab.selectable ? '<col style="width:50px">' : ''}${tab.columns.map(column => `<col style="width:${column.width || 160}px">`).join('')}<col style="width:${tab.opsWidth || 240}px"></colgroup>` : '';
      const tableClass = `admin-table${tab.tableClass ? ` ${tab.tableClass}` : ''}`;
      const tableStyle = tab.tableMinWidth ? ` style="min-width:${tab.tableMinWidth}px"` : '';
      const tableHtml = `<section class="admin-card list-card"><div class="admin-card__header"><div class="command-bar" style="width:100%"><div class="command-group">${actions || '<span class="muted">共 ' + filteredRows(tab).length + ' 条记录</span>'}</div><span class="muted">测试环境样例</span></div></div><div class="table-scroll"><table class="${tableClass}"${tableStyle}>${colgroup}<thead><tr>${selectHead}${sortHeaders}<th class="ops">操作</th></tr></thead><tbody>${rows || `<tr><td class="empty-state" colspan="${tab.columns.length + (tab.selectable ? 2 : 1)}">暂无数据</td></tr>`}</tbody></table></div><div class="pagination"><span>共 ${filteredRows(tab).length} 条，第 1- ${filteredRows(tab).length} 条</span><div class="pagination__actions"><button type="button" class="page-number" data-page-action="prev" disabled>‹</button><button type="button" class="page-number is-active">1</button><button type="button" class="page-number" data-page-action="next" disabled>›</button></div></div></section>`;
      root.innerHTML = `<div class="admin-page">${tabHtml}${filterHtml}${tableHtml}</div>`;
      root.querySelectorAll('.table-scroll').forEach(node => { node.scrollLeft = 0; });
      syncSelectionState();
    }
    function filteredRows(tab) {
      const values = state.values[state.tab] || {};
      let result = (state.rows[state.tab] || []).filter(row => Object.keys(values).every(key => !values[key] || String(row[key] || '').toLowerCase().includes(String(values[key]).toLowerCase())));
      const sort = state.sort[state.tab];
      if (sort) result = result.slice().sort((a, b) => String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''), 'zh-CN', { numeric: true }) * (sort.dir === 'desc' ? -1 : 1));
      return result;
    }
    function syncSelectionState() {
      root.querySelectorAll('[data-requires-selection]').forEach(button => { button.disabled = state.selected.size === 0; });
      const all = root.querySelector('[data-select-all]');
      const items = root.querySelectorAll('[data-select-row]');
      if (all) all.checked = items.length > 0 && state.selected.size === items.length;
      items.forEach(item => { item.checked = state.selected.has(Number(item.dataset.selectRow)); });
    }
    function readFilters() {
      const values = {}; root.querySelectorAll('[data-filter]').forEach(node => { values[node.dataset.filter] = node.value.trim(); }); state.values[state.tab] = values;
    }
    function actionForRow(action, row) {
      if (/编辑|创建|新增/.test(action)) { const tab = activeTab(); const modalTitle = action === '编辑' ? ((tab.modal && tab.modal.editTitle) || '编辑配置') : ((tab.modal && tab.modal.title) || action); openModal(modalFormHtml(tab.modal || { fields: [] }, modalTitle, row)); return; }
      if (/重置密码/.test(action)) { openModal(confirmModalHtml('重置密码', `确定要重置 <strong>${esc(row.loginAccount || '该子账号')}</strong> 的登录密码吗？重置后请通过安全渠道告知用户。`, true)); return; }
      if (/启用|禁用/.test(action)) { openModal(confirmModalHtml(action, `确定要${esc(action)} <strong>${esc(row.roleName || row.loginAccount || row.customerName || '当前记录')}</strong> 吗？`, action === '禁用')); return; }
      if (/回退|释放/.test(action)) { openModal(confirmModalHtml(action, `请确认对商户ID <strong>${esc(row.merchantId || '-')}</strong> 执行“${esc(action)}”操作。该操作会影响资金流水，请确认后继续。`, true)); return; }
      if (/下载文件/.test(action)) { if (row.status !== '处理成功') { showToast(row.status === '处理中' ? '任务仍在处理中，暂不可下载' : '处理失败，没有可下载文件', 'error'); return; } showToast(`已开始下载任务 ${row.taskId}（原型）`, 'success'); return; }
      if (/查看详情|关系与吐点|权限管理|子账号管理|更新余额/.test(action)) { openModal(detailModalHtml(action, row)); return; }
      showToast(`${action}操作已触发（原型）`, 'success');
    }

    root.addEventListener('click', event => {
      const tabButton = event.target.closest('[data-tab]');
      if (tabButton) { state.tab = tabButton.dataset.tab; state.selected.clear(); render(); return; }
      const sortButton = event.target.closest('[data-sort]');
      if (sortButton) { const key = sortButton.dataset.sort; const current = state.sort[state.tab]; state.sort[state.tab] = !current || current.key !== key ? { key, dir: 'asc' } : current.dir === 'asc' ? { key, dir: 'desc' } : null; state.selected.clear(); render(); return; }
      const rowAction = event.target.closest('[data-row-action]');
      if (rowAction) { const row = filteredRows(activeTab())[Number(rowAction.dataset.rowIndex)]; actionForRow(rowAction.dataset.rowAction, row || {}); return; }
      const actionButton = event.target.closest('[data-action]');
      if (!actionButton) return;
      const action = actionButton.dataset.action;
      if (action === 'search') { readFilters(); state.selected.clear(); showToast('已按当前条件更新列表（原型）', 'success'); render(); return; }
      if (action === 'reset') { state.values[state.tab] = {}; state.sort[state.tab] = null; state.selected.clear(); showToast('筛选条件已重置', 'info'); render(); return; }
      const tab = activeTab();
      if (action === 'export') { showToast('导出任务已创建，可在导出中心查看进度', 'success'); return; }
      if (action === 'batch-status' || action === 'batch-rebate') { openModal(confirmModalHtml(action === 'batch-status' ? '批量修改状态' : '批量修改返点', `将对已选 <strong>${state.selected.size}</strong> 条记录执行批量修改。提交前请确认影响范围。`, false)); return; }
      if (/create/.test(action)) { openModal(modalFormHtml(tab.modal || { fields: [] }, tab.modal && tab.modal.title || '新增配置')); return; }
      showToast(`${actionButton.textContent.trim()}操作已触发（原型）`, 'success');
    });
    root.addEventListener('change', event => {
      if (event.target.matches('[data-select-row]')) { const index = Number(event.target.dataset.selectRow); if (event.target.checked) state.selected.add(index); else state.selected.delete(index); syncSelectionState(); }
      if (event.target.matches('[data-select-all]')) { const items = root.querySelectorAll('[data-select-row]'); items.forEach(item => { const index = Number(item.dataset.selectRow); if (event.target.checked) state.selected.add(index); else state.selected.delete(index); }); syncSelectionState(); }
    });
    document.body.addEventListener('click', event => {
      if (event.target.closest('[data-modal-close]')) { closeModal(); return; }
      if (event.target.matches('[data-modal-submit]') || event.target.closest('[data-modal-submit]')) { closeModal(); showToast('操作已提交，列表将在成功后刷新（原型）', 'success'); }
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
