/*
 * BestAds 运营端模块页原型渲染器。
 * 用于绩效、Meta资产管理等已按测试环境抽取字段的配置驱动页面。
 * 注意：这里的数据用于原型展示，按钮只展示弹窗/确认态，不调用真实接口。
 */
(function () {
  'use strict';

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const asText = value => value == null || value === '' ? '-' : String(value);
  const icon = name => `<i class="fas fa-${name}" aria-hidden="true"></i>`;
  const status = value => {
    const text = asText(value);
    const cls = /正常|成功|启用|是|内部人员|已完成/.test(text) ? 'status-success' : /失败|停用|禁用|异常|非内部/.test(text) ? 'status-danger' : /同步中|待/.test(text) ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const money = value => {
    const text = asText(value);
    if (text === '-') return '<span class="muted">-</span>';
    const number = Number(String(text).replace(/,/g, ''));
    const cls = number > 0 ? 'amount-positive' : number < 0 ? 'amount-negative' : 'amount-zero';
    return `<span class="${cls}">${esc(text)}</span>`;
  };
  const person = value => `<span class="person-cell">${esc(asText(value))}</span>`;
  const longText = value => `<span class="wrap">${esc(asText(value))}</span>`;

  const people = {
    tang: '汤秀梅(tangxiumei@bestfulfill.com)',
    wang: '王荣荣(wangrongrong@bestfulfill.com)',
    ou: '欧伟权(ouweiquan@bestfulfill.com)',
    tan: '谭英就 (tanyingjiu@bestfulfill.com)',
    huang: '黄银冰 (huangyinbing@bestfulfill.com)',
    li: '李志伟 (lizhiwei@bestfulfill.com)',
    zhang: '张宇 (zhangyu3@bestfulfill.com)',
    he: '何毅臻 (heyizhen@bestfulfill.com)',
    cheng: '程允良 (chengyunliang@bestfulfill.com)'
  };

  const kpiOptions = ['总广告消耗', '新客消耗', '广告毛利', '客户数(留存)'];
  const quarterOptions = ['2026Q3', '2026Q2', '2026Q1', '2025Q4'];
  const syncOptions = ['同步中', '正常', 'Token 失效', '同步失败', '从未同步'];
  const yesNoOptions = ['是', '否'];
  const internalOptions = ['内部人员', '非内部'];

  const configs = {
    'meta-bm-config': {
      title: 'BM 配置',
      filters: [
        { key: 'name', label: 'BM 名称', placeholder: '输入 BM 名称' },
        { key: 'bmId', label: 'BM ID', placeholder: '输入 BM ID' },
        { key: 'enabled', label: '启用', type: 'select', options: ['启用', '停用'], placeholder: '选择启用' },
        { key: 'syncState', label: '同步结果', type: 'select', options: syncOptions, placeholder: '选择同步结果' }
      ],
      actions: [{ id: 'create-bm', label: '新增 BM', icon: 'plus', primary: true }],
      tableMinWidth: 1320,
      opsWidth: 170,
      columns: [
        { key: 'name', label: 'BM 名称', align: 'left', width: 220 },
        { key: 'bmId', label: 'BM ID', width: 180, sort: true },
        { key: 'enabled', label: '启用', format: status, width: 100 },
        { key: 'lastSyncAt', label: '上次同步', width: 170 },
        { key: 'syncState', label: '同步结果', format: status, width: 120 },
        { key: 'lastResult', label: '上次结果', width: 150 },
        { key: 'createdAt', label: '新增时间', width: 170 },
        { key: 'updatedAt', label: '更新时间', width: 170 },
        { key: 'updatedBy', label: '更新人', align: 'left', width: 220 }
      ],
      rows: [
        { name: '1112', bmId: '111', enabled: '启用', lastSyncAt: '-', syncState: '同步失败', lastResult: '-', createdAt: '2026-07-22 11:17:49', updatedAt: '2026-07-23 10:49:43', updatedBy: people.wang, ops: ['编辑', '手动同步'] },
        { name: 'v227-probe-should-fail', bmId: '999999999999991', enabled: '启用', lastSyncAt: '-', syncState: '同步失败', lastResult: '-', createdAt: '2026-07-13 16:02:44', updatedAt: '-', updatedBy: '-', ops: ['编辑', '手动同步'] },
        { name: '2', bmId: '21', enabled: '启用', lastSyncAt: '-', syncState: '同步失败', lastResult: '-', createdAt: '2026-07-11 15:46:23', updatedAt: '-', updatedBy: '-', ops: ['编辑', '手动同步'] },
        { name: '434', bmId: '545', enabled: '启用', lastSyncAt: '-', syncState: '同步失败', lastResult: '-', createdAt: '2026-07-11 15:43:32', updatedAt: '-', updatedBy: '-', ops: ['编辑', '手动同步'] },
        { name: '汤秀梅测试BM', bmId: '123456789011111', enabled: '启用', lastSyncAt: '-', syncState: '正常', lastResult: '新增 1 / 移除 1', createdAt: '2026-07-10 17:23:28', updatedAt: '2026-07-22 11:46:52', updatedBy: people.tang, ops: ['编辑', '手动同步'] },
        { name: 'txmBM', bmId: '4389024', enabled: '启用', lastSyncAt: '-', syncState: '同步失败', lastResult: '-', createdAt: '2026-07-10 11:10:26', updatedAt: '-', updatedBy: '-', ops: ['编辑', '手动同步'] }
      ],
      modals: {
        '新增 BM': { title: '新增 BM', fields: [{ key: 'name', label: 'BM 名称', placeholder: '请输入 BM 名称' }, { key: 'bmId', label: 'BM ID', placeholder: '请输入 BM ID' }, { key: 'enabled', label: '启用', control: 'select', options: ['启用', '停用'], placeholder: '选择启用' }, { key: 'token', label: 'System User Token', control: 'textarea', full: true, placeholder: '请输入 System User Token' }] },
        '编辑': { title: '编辑 BM', fields: [{ key: 'name', label: 'BM 名称', placeholder: '请输入 BM 名称' }, { key: 'bmId', label: 'BM ID', placeholder: '请输入 BM ID' }, { key: 'enabled', label: '启用', control: 'select', options: ['启用', '停用'], placeholder: '选择启用' }, { key: 'token', label: 'System User Token', control: 'textarea', full: true, placeholder: '如需更换 Token，请输入新 Token' }] }
      }
    },

    'meta-assets': {
      title: '资产',
      tabs: [
        {
          id: 'ad-account',
          label: 'Ad Account',
          filters: [
            { key: 'bmName', label: 'BM 名称', placeholder: '输入 BM 名称' },
            { key: 'bmId', label: 'BM ID', placeholder: '输入BM ID' },
            { key: 'accountName', label: '广告账户名称', placeholder: '输入广告账户名称' },
            { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
            { key: 'accountStatus', label: '广告账户状态', type: 'select', options: ['ACTIVE', 'DISABLED', 'CLOSED'], placeholder: '选择广告账户状态' },
            { key: 'merchantId', label: '商户ID', placeholder: '输入商户ID' },
            { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
            { key: 'member', label: '成员', placeholder: '输入User名称或Email' },
            { key: 'assigned', label: '已分配成员', type: 'select', options: ['已分配', '未分配'], placeholder: '选择已分配成员' }
          ],
          actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true }],
          filterClass: 'cols-5',
          tableMinWidth: 2100,
          opsWidth: 180,
          columns: [
            { key: 'accountName', label: '广告账户名称', align: 'left', width: 220 },
            { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
            { key: 'bmName', label: 'BM名称', align: 'left', width: 230 },
            { key: 'bmId', label: 'BM ID', width: 180 },
            { key: 'merchantId', label: '商户ID', width: 110 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'accountStatus', label: '广告账户状态', format: status, width: 130 },
            { key: 'timezone', label: '时区', width: 120 },
            { key: 'currency', label: '币种', width: 90 },
            { key: 'balance', label: '余额', format: money, num: true, width: 110, sort: true },
            { key: 'lastSyncAt', label: '上次同步', width: 170 },
            { key: 'user', label: 'User', align: 'left', width: 160 },
            { key: 'email', label: 'User Email', align: 'left', width: 230 },
            { key: 'permission', label: '权限', width: 100 },
            { key: 'internal', label: '是否内部', format: status, width: 110 },
            { key: 'memberAction', label: '成员操作', width: 100 }
          ],
          rows: [
            { accountName: 'TL-B-11-1205', accountId: '1001000035425554', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '-', customerName: '-', accountStatus: 'ACTIVE', timezone: 'UTC+08:00', currency: 'USD', balance: '-', lastSyncAt: '-', user: 'Stan Tl', email: '2tal13205@muxue.vip', permission: '成员', internal: '内部人员', memberAction: '解除/更新', ops: ['解除', '更新'] },
            { accountName: 'TL-G-12-712', accountId: '1001765238416132', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '-', customerName: '-', accountStatus: 'ACTIVE', timezone: 'UTC+08:00', currency: 'USD', balance: '-', lastSyncAt: '-', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] },
            { accountName: 'Oliva-Amsterdam', accountId: '1002116215352952', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '-', customerName: '-', accountStatus: 'ACTIVE', timezone: 'UTC+01:00', currency: 'EUR', balance: '-', lastSyncAt: '-', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] }
          ]
        },
        {
          id: 'pixel',
          label: 'Pixel',
          filters: [
            { key: 'bmName', label: 'BM 名称', placeholder: '输入 BM 名称' },
            { key: 'bmId', label: 'BM ID', placeholder: '输入BM ID' },
            { key: 'pixelName', label: 'Pixel名称', placeholder: '输入Pixel名称' },
            { key: 'pixelId', label: 'Pixel ID', placeholder: '输入Pixel ID' },
            { key: 'member', label: '成员', placeholder: '输入User名称或Email' },
            { key: 'assigned', label: '已分配成员', type: 'select', options: ['已分配', '未分配'], placeholder: '选择已分配成员' }
          ],
          actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true }],
          filterClass: 'cols-5',
          tableMinWidth: 1680,
          opsWidth: 180,
          columns: [
            { key: 'pixelName', label: 'Pixel名称', align: 'left', width: 230 },
            { key: 'pixelId', label: 'Pixel ID', width: 180, sort: true },
            { key: 'bmName', label: 'BM名称', align: 'left', width: 230 },
            { key: 'bmId', label: 'BM ID', width: 180 },
            { key: 'lastSyncAt', label: '上次同步', width: 170 },
            { key: 'user', label: 'User', align: 'left', width: 160 },
            { key: 'email', label: 'User Email', align: 'left', width: 230 },
            { key: 'permission', label: '权限', width: 100 },
            { key: 'internal', label: '是否内部', format: status, width: 110 },
            { key: 'memberAction', label: '成员操作', width: 100 }
          ],
          rows: [
            { pixelName: 'Caeloria Dataset 1', pixelId: '1001795625161833', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', lastSyncAt: '2026-07-08 17:24:53', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] },
            { pixelName: 'PSM DK Pixel', pixelId: '1002705665299362', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', lastSyncAt: '2026-07-08 17:25:17', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] },
            { pixelName: 'Berry home pixel official', pixelId: '1011606670952945', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', lastSyncAt: '2026-07-08 17:24:53', user: 'mouna aberkan', email: '-', permission: '成员', internal: '非内部', memberAction: '解除/更新', ops: ['解除', '更新'] }
          ]
        }
      ]
    },

    'meta-members': {
      title: '成员',
      tabs: [
        {
          id: 'bm-members',
          label: 'BM 成员信息',
          filters: [
            { key: 'bmName', label: 'BM名称', placeholder: '输入 BM 名称' },
            { key: 'bmId', label: 'BM ID', placeholder: '输入 BM ID' },
            { key: 'userName', label: 'User名称', placeholder: '输入User名称' },
            { key: 'email', label: 'User Email', placeholder: '输入User Email' },
            { key: 'role', label: '角色', type: 'select', options: ['管理员', '成员'], placeholder: '选择角色' },
            { key: 'internal', label: '是否内部', type: 'select', options: internalOptions, placeholder: '选择是否内部' }
          ],
          filterClass: 'cols-5',
          tableMinWidth: 1380,
          opsWidth: 180,
          columns: [
            { key: 'bmName', label: 'BM名称', align: 'left', width: 230 },
            { key: 'bmId', label: 'BM ID', width: 180 },
            { key: 'userName', label: 'User名称', align: 'left', width: 180 },
            { key: 'email', label: 'User Email', align: 'left', width: 250 },
            { key: 'role', label: '角色', width: 100 },
            { key: 'internal', label: '是否内部', format: status, width: 120 }
          ],
          rows: [
            { bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', userName: 'Stan Tl', email: '2tal13205@muxue.vip', role: '成员', internal: '内部人员', ops: ['查看资产', '编辑标记'] },
            { bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', userName: '翔（2） 刘', email: '3173594193@qq.com', role: '管理员', internal: '内部人员', ops: ['查看资产', '编辑标记'] },
            { bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', userName: 'Alexandra Alvarez', email: 'aaalvarez1008@gmail.com', role: '成员', internal: '非内部', ops: ['查看资产', '标记内部'] }
          ]
        },
        {
          id: 'internal-mark',
          label: '内部人员标记',
          filters: [
            { key: 'userName', label: 'User名称', placeholder: '输入User名称' },
            { key: 'email', label: 'User Email', placeholder: '输入User Email' },
            { key: 'internal', label: '是否内部', type: 'select', options: internalOptions, placeholder: '选择是否内部' }
          ],
          tableMinWidth: 1120,
          opsWidth: 140,
          columns: [
            { key: 'userName', label: 'User名称', align: 'left', width: 200 },
            { key: 'email', label: 'User Email', align: 'left', width: 260 },
            { key: 'internal', label: '是否内部', format: status, width: 130 },
            { key: 'markedAt', label: '标记时间', width: 180 },
            { key: 'markedBy', label: '标记人', align: 'left', width: 240 }
          ],
          rows: [
            { userName: 'Süheyla Kurt', email: '11949jason@muxue.vip', internal: '内部人员', markedAt: '2026-07-20 16:40:14', markedBy: people.tang, ops: ['编辑'] },
            { userName: 'Ferri Noordijk', email: '23brandgroup@gmail.com', internal: '非内部', markedAt: '-', markedBy: '-', ops: ['标记'] },
            { userName: 'Stan Tl', email: '2tal13205@muxue.vip', internal: '内部人员', markedAt: '2026-07-22 11:44:28', markedBy: people.tang, ops: ['编辑'] }
          ]
        }
      ]
    },

    'meta-operation-log': {
      title: '操作日志',
      filters: [
        { key: 'operator', label: '操作人', placeholder: '输入操作人' },
        { key: 'module', label: '模块', type: 'select', options: ['BM配置', '资产', '成员'], placeholder: '选择模块' },
        { key: 'type', label: '操作类型', type: 'select', options: ['手动同步', '编辑BM', '标记内部人员', '分配成员', '解除成员'], placeholder: '选择操作类型' },
        { key: 'result', label: '结果', type: 'select', options: ['成功', '失败'], placeholder: '选择结果' },
        { key: 'date', label: '操作日期', type: 'date' },
        { key: 'target', label: '操作对象', placeholder: '输入操作对象' }
      ],
      actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true }],
      filterClass: 'cols-5',
      tableMinWidth: 1420,
      opsWidth: 110,
      columns: [
        { key: 'time', label: '操作时间', width: 170, sort: true },
        { key: 'operator', label: '操作人', align: 'left', width: 260, format: person },
        { key: 'module', label: '模块', width: 100 },
        { key: 'type', label: '操作类型', width: 140 },
        { key: 'target', label: '操作对象', align: 'left', width: 180 },
        { key: 'summary', label: '操作摘要', align: 'left', width: 260, format: longText },
        { key: 'result', label: '结果', format: status, width: 100 }
      ],
      rows: [
        { time: '2026-07-23 10:49:47', operator: people.wang, module: 'BM配置', type: '手动同步', target: '1112', summary: '触发手动同步', result: '成功', ops: ['详情'] },
        { time: '2026-07-23 10:49:43', operator: people.wang, module: 'BM配置', type: '编辑BM', target: '111', summary: '编辑 BM', result: '成功', ops: ['详情'] },
        { time: '2026-07-22 11:44:28', operator: people.tang, module: '成员', type: '标记内部人员', target: '2tal13205@muxue.vip', summary: 'email 标记 INTERNAL active=true', result: '成功', ops: ['详情'] }
      ]
    },

    'performance-metric-description': {
      title: '绩效指标说明',
      tableMinWidth: 1100,
      hideOperation: true,
      columns: [
        { key: 'id', label: '指标ID', width: 90, sort: true },
        { key: 'name', label: '指标名称', width: 160 },
        { key: 'definition', label: '指标定义', align: 'left', width: 820, format: longText }
      ],
      rows: [
        { id: '4', name: '客户数(留存)', definition: '本季度存在转账（在线充值、线下转账有发起即可不一定要求成功处理）、广告账户余额操作（充值、减款、清零有发起即可不一定要求成功处理）的客户数。' },
        { id: '3', name: '广告毛利', definition: 'AM/BD关联客户时，客户的广告账户产生消耗。用消耗乘以返点利润（现在系统已经记录的账号返点）。' },
        { id: '2', name: '新客消耗', definition: '记录客户首次消耗的日期，日期本季度和下季度内，客户视为新客。新客阶段产生的消耗，即为新客消耗。' },
        { id: '1', name: '总广告消耗', definition: 'AM/BD关联客户时，客户的广告账户产生的消耗。需要转化为美元币种。' }
      ]
    },

    'performance-config': {
      title: '绩效配置',
      filters: [
        { key: 'quarter', label: '考核季度', type: 'select', options: quarterOptions, placeholder: '选择考核季度' },
        { key: 'owner', label: '考核人员', type: 'select', options: Object.values(people).filter(Boolean), placeholder: '选择考核人员' }
      ],
      actions: [{ id: 'kpi-config', label: '配置KPI', icon: 'sliders-h', primary: true }],
      tableMinWidth: 1180,
      opsWidth: 210,
      columns: [
        { key: 'quarter', label: '考核季度', width: 130 },
        { key: 'owner', label: '考核人员', align: 'left', width: 280, format: person },
        { key: 'kpis', label: '考核指标', align: 'left', width: 520, format: longText }
      ],
      rows: [
        { quarter: '2026Q1', owner: people.tan, kpis: '总广告消耗/广告毛利/新客消耗/客户数(留存)', ops: ['配置详情', '复制并新增'] },
        { quarter: '2026Q1', owner: people.huang, kpis: '新客消耗', ops: ['配置详情', '复制并新增'] },
        { quarter: '2026Q1', owner: people.ou, kpis: '总广告消耗/客户数(留存)', ops: ['配置详情', '复制并新增'] },
        { quarter: '2026Q2', owner: people.he, kpis: '客户数(留存)/广告毛利', ops: ['配置详情', '复制并新增'] }
      ],
      modals: {
        '配置KPI': { title: '配置KPI', fields: [{ key: 'quarter', label: '考核季度', control: 'select', options: quarterOptions, placeholder: '选择考核季度' }, { key: 'owner', label: '考核人员', control: 'select', options: Object.values(people).filter(Boolean), placeholder: '选择考核人员' }, { key: 'kpis', label: '考核指标', control: 'checkbox', options: kpiOptions, full: true }, { key: 'remark', label: '备注', control: 'textarea', full: true, required: false }] },
        '复制并新增': { title: '复制并新增', fields: [{ key: 'quarter', label: '新考核季度', control: 'select', options: quarterOptions, placeholder: '选择考核季度' }, { key: 'owner', label: '考核人员', control: 'select', options: Object.values(people).filter(Boolean), placeholder: '选择考核人员' }, { key: 'kpis', label: '考核指标', control: 'checkbox', options: kpiOptions, full: true }] }
      }
    },

    'all-performance': {
      title: '全员绩效查看',
      filters: [
        { key: 'quarter', label: '考核季度', type: 'select', options: quarterOptions, placeholder: '选择考核季度' },
        { key: 'owner', label: '考核人员', type: 'select', options: Object.values(people).filter(Boolean), placeholder: '选择考核人员' },
        { key: 'ended', label: '考核结束', type: 'select', options: yesNoOptions, placeholder: '选择考核结束' }
      ],
      tableMinWidth: 1380,
      opsWidth: 240,
      columns: [
        { key: 'quarter', label: '考核季度', width: 120 },
        { key: 'owner', label: '考核人员', align: 'left', width: 280, format: person },
        { key: 'kpis', label: '考核指标', align: 'left', width: 430, format: longText },
        { key: 'expectedCoef', label: '预计考核系数', num: true, width: 150, sort: true },
        { key: 'ended', label: '考核结束', format: status, width: 110 },
        { key: 'coef', label: '考核系数', num: true, width: 120, sort: true }
      ],
      rows: [
        { quarter: '2026Q2', owner: people.tan, kpis: '客户数(留存)/广告毛利/总广告消耗', expectedCoef: '0.0771', ended: '是', coef: '-', ops: ['详情', '调整考核系数'] },
        { quarter: '2026Q2', owner: people.he, kpis: '客户数(留存)/广告毛利', expectedCoef: '0', ended: '是', coef: '-', ops: ['详情', '调整考核系数'] },
        { quarter: '2025Q4', owner: people.li, kpis: '总广告消耗/新客消耗', expectedCoef: '0', ended: '是', coef: '2', ops: ['详情', '调整考核系数'] },
        { quarter: '2026Q1', owner: people.cheng, kpis: '客户数(留存)/广告毛利/新客消耗/总广告消耗', expectedCoef: '0', ended: '是', coef: '113.2166', ops: ['详情', '调整考核系数'] }
      ],
      modals: {
        '调整考核系数': { title: '调整考核系数', fields: [{ key: 'coef', label: '考核系数', placeholder: '请输入调整后的考核系数' }, { key: 'reason', label: '调整原因', control: 'textarea', full: true, placeholder: '请输入调整原因' }] }
      }
    },

    'my-performance': {
      title: '我的绩效',
      filters: [{ key: 'quarter', label: '考核季度', type: 'select', options: quarterOptions, placeholder: '选择考核季度', value: '2026Q3' }],
      tableMinWidth: 980,
      hideOperation: true,
      footerNote: '预计考核系数: 0；预计考核系数 = Σ(完成度 × 权重) = 0 = 0',
      columns: [
        { key: 'kpi', label: '考核指标', width: 180 },
        { key: 'target', label: '目标值', num: true, width: 140 },
        { key: 'current', label: '当前值', num: true, width: 140 },
        { key: 'completion', label: '完成度', num: true, width: 140 },
        { key: 'deviation', label: '进度偏差', num: true, width: 140 },
        { key: 'weight', label: '权重', num: true, width: 120 }
      ],
      rows: []
    },

    'performance-log': {
      title: '绩效操作日志',
      filters: [
        { key: 'quarter', label: '考核季度', type: 'select', options: quarterOptions, placeholder: '选择考核季度' },
        { key: 'owner', label: '请选择考核人员', type: 'select', options: Object.values(people).filter(Boolean), placeholder: '选择考核人员' },
        { key: 'type', label: '请选择操作类型', type: 'select', options: ['配置KPI', '修改KPI', '调整考核系数'], placeholder: '选择操作类型' }
      ],
      tableMinWidth: 1480,
      hideOperation: true,
      columns: [
        { key: 'quarter', label: '考核季度', width: 120 },
        { key: 'owner', label: '考核人员', align: 'left', width: 250, format: person },
        { key: 'operator', label: '操作人员', align: 'left', width: 250, format: person },
        { key: 'time', label: '操作时间', width: 170, sort: true },
        { key: 'type', label: '操作类型', width: 130 },
        { key: 'before', label: '操作前数据', align: 'left', width: 330, format: longText },
        { key: 'after', label: '操作后数据', align: 'left', width: 330, format: longText }
      ],
      rows: [
        { quarter: '2026Q1', owner: people.tan, operator: people.tan, time: '2026-03-24 14:35:33', type: '修改KPI', before: '【总广告消耗】目标:1000000 权重:0.3; 【新客消耗】目标:20000 权重:0.2; 【广告毛利】目标:10000 权重:0.3; 【客户数(留存)】目标:10 权重:0.2', after: '【客户数(留存)】目标:1 权重:0.2; 【新客消耗】目标:20000 权重:0.2; 【广告毛利】目标:1000 权重:0.3; 【总广告消耗】目标:1000000 权重:0.3' },
        { quarter: '2026Q1', owner: people.huang, operator: people.tan, time: '2026-03-19 12:00:15', type: '配置KPI', before: '-', after: '【新客消耗】目标:100 权重:1' }
      ]
    }
  };

  function pageConfig() {
    const key = document.body?.dataset?.adminPage;
    return configs[key] || configs['meta-bm-config'];
  }

  function fieldHtml(field, values) {
    const value = values[field.key] || field.value || '';
    if (field.type === 'select') return `<div class="filter-field"><label>${esc(field.label)}</label><select data-filter="${esc(field.key)}"><option value="">${esc(field.placeholder || '全部')}</option>${(field.options || []).map(v => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
    return `<div class="filter-field"><label>${esc(field.label)}</label><input data-filter="${esc(field.key)}" type="${field.type === 'date' ? 'date' : 'text'}" placeholder="${esc(field.placeholder || '')}" value="${esc(value)}"></div>`;
  }

  function modalControl(field, value) {
    const control = field.control || 'text';
    if (control === 'textarea') return `<textarea name="${esc(field.key)}" placeholder="${esc(field.placeholder || '')}">${esc(value || '')}</textarea>`;
    if (control === 'select') return `<select name="${esc(field.key)}"><option value="">${esc(field.placeholder || '请选择')}</option>${(field.options || []).map(option => `<option value="${esc(option)}"${String(option) === String(value || '') ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
    if (control === 'checkbox') return `<div class="account-check-list">${(field.options || []).map((option, index) => `<label class="account-check"><input type="checkbox" name="${esc(field.key)}" value="${esc(option)}" ${String(value || '').includes(option) ? 'checked' : ''}><span>${esc(option)}</span></label>`).join('')}</div>`;
    return `<input name="${esc(field.key)}" type="text" placeholder="${esc(field.placeholder || '')}" value="${esc(value || '')}">`;
  }

  function formModal(modal, row) {
    const fields = modal?.fields || [];
    return `<div class="modal-backdrop"><section class="modal"><div class="modal__header"><h2 class="modal__title">${esc(modal?.title || '操作')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid">${fields.map(field => `<div class="form-field${field.full ? ' full' : ''}"><label>${esc(field.label)}${field.required === false ? '' : ' <span style="color:var(--admin-danger)">*</span>'}</label>${modalControl(field, row?.[field.key])}</div>`).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function confirmModal(title, copy, danger) {
    return `<div class="modal-backdrop"><section class="modal modal-sm"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="confirm-copy">${copy}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-modal-submit>确定</button></div></section></div>`;
  }

  function detailModal(title, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">以下为按测试环境整理的原型信息；真实提交需以后端接口权限为准。</div><dl class="detail-grid">${Object.keys(row || {}).filter(k => k !== 'ops').map(key => `<div><dt>${esc(key)}</dt><dd>${esc(asText(row[key]))}</dd></div>`).join('')}</dl></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function renderCell(column, row) {
    const value = row[column.key];
    const rendered = column.format ? column.format(value) : asText(value);
    return `<td class="${column.num ? 'num ' : ''}${column.align === 'left' ? 'left ' : ''}${column.format === longText ? 'wrap' : ''}">${rendered}</td>`;
  }

  function boot() {
    const root = document.getElementById('page-root');
    if (!root) return;
    const config = pageConfig();
    const tabs = config.tabs || [{ id: 'list', label: '', ...config }];
    const state = { tab: tabs[0].id, values: {}, sort: {} };

    function activeTab() { return tabs.find(item => item.id === state.tab) || tabs[0]; }
    function rows(tab) {
      const values = state.values[tab.id] || {};
      let result = (tab.rows || []).filter(row => Object.keys(values).every(key => !values[key] || String(row[key] || '').toLowerCase().includes(String(values[key]).toLowerCase())));
      const sort = state.sort[tab.id];
      if (sort) result = result.slice().sort((a, b) => String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''), 'zh-CN', { numeric: true }) * (sort.dir === 'desc' ? -1 : 1));
      return result;
    }
    function showToast(message, type) {
      let stack = document.querySelector('.toast-stack');
      if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; document.body.appendChild(stack); }
      const node = document.createElement('div'); node.className = `toast ${type || 'info'}`; node.textContent = message; stack.appendChild(node);
      setTimeout(() => node.remove(), 2400);
    }
    function openModal(html) { document.body.insertAdjacentHTML('beforeend', html); }
    function closeModal() { document.querySelector('.modal-backdrop')?.remove(); }
    function readFilters(tab) {
      const values = {};
      root.querySelectorAll('[data-filter]').forEach(node => { values[node.dataset.filter] = node.value.trim(); });
      state.values[tab.id] = values;
    }
    function render() {
      const tab = activeTab();
      const hasTabs = tabs.filter(item => item.label).length > 1;
      const tabHtml = hasTabs ? `<div class="business-tabs" role="tablist">${tabs.filter(item => item.label).map(item => `<button type="button" class="business-tab${item.id === state.tab ? ' is-active' : ''}" data-tab="${esc(item.id)}">${esc(item.label)}</button>`).join('')}</div>` : '';
      const filterHtml = tab.filters?.length ? `<section class="admin-card filter-card"><div class="admin-card__body"><div class="filter-grid ${tab.filterClass || (tab.filters.length >= 5 ? 'cols-5' : tab.filters.length === 3 ? 'cols-3' : '')}">${tab.filters.map(field => fieldHtml(field, state.values[tab.id] || {})).join('')}<div class="filter-actions"><button class="btn btn-primary" type="button" data-action="search">${icon('search')}搜 索</button><button class="btn btn-default" type="button" data-action="reset">重 置</button></div></div></div></section>` : '';
      const actionHtml = (tab.actions || []).map(action => `<button type="button" class="btn ${action.primary ? 'btn-primary' : 'btn-default'}" data-action="${esc(action.id)}">${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const showOps = !tab.hideOperation;
      const tableRows = rows(tab).map((row, index) => `<tr>${tab.columns.map(column => renderCell(column, row)).join('')}${showOps ? `<td class="ops"><div class="command-group">${(row.ops || []).map(op => `<button type="button" class="btn btn-link${/解除|删除/.test(op) ? ' btn-link-danger' : ''}" data-row-action="${esc(op)}" data-row-index="${index}">${esc(op)}</button>`).join('')}</div></td>` : ''}</tr>`).join('');
      const headers = tab.columns.map(column => { const headerClass = [column.num ? 'num' : '', column.align === 'left' ? 'left' : ''].filter(Boolean).join(' '); return column.sort ? `<th class="${headerClass}"><button class="sort-trigger" type="button" data-sort="${esc(column.key)}">${esc(column.label)} ${icon(state.sort[tab.id]?.key === column.key && state.sort[tab.id]?.dir === 'desc' ? 'sort-down' : 'sort-up')}</button></th>` : `<th class="${headerClass}">${esc(column.label)}</th>`; }).join('');
      const colgroup = `<colgroup>${tab.columns.map(column => `<col style="width:${column.width || 160}px">`).join('')}${showOps ? `<col style="width:${tab.opsWidth || 180}px">` : ''}</colgroup>`;
      const colspan = tab.columns.length + (showOps ? 1 : 0);
      const footerNote = tab.footerNote ? `<div class="notice module-footer-note">${esc(tab.footerNote)}</div>` : '';
      const cardHeader = actionHtml ? `<div class="admin-card__header"><div class="command-bar" style="width:100%"><div class="command-group">${actionHtml}</div></div></div>` : '';
      root.innerHTML = `<div class="admin-page module-page">${tabHtml}${filterHtml}<section class="admin-card list-card">${cardHeader}<div class="table-scroll"><table class="admin-table admin-table--fixed" style="min-width:${tab.tableMinWidth || 980}px">${colgroup}<thead><tr>${headers}${showOps ? '<th class="ops">操作</th>' : ''}</tr></thead><tbody>${tableRows || `<tr><td class="empty-state" colspan="${colspan}">暂无数据</td></tr>`}</tbody></table></div>${footerNote}<div class="pagination"><span>共 ${rows(tab).length} 条记录</span><div class="pagination__actions"><button class="page-number" disabled>‹</button><button class="page-number is-active">1</button><button class="page-number" disabled>›</button></div></div></section></div>`;
    }
    function handleRowAction(action, row) {
      const tab = activeTab();
      const modal = tab.modals?.[action] || config.modals?.[action];
      if (modal) { openModal(formModal(modal, row)); return; }
      if (/手动同步/.test(action)) { openModal(confirmModal('手动同步', `确认对 <strong>${esc(row.name || row.bmId || '当前 BM')}</strong> 触发手动同步？原型仅展示确认态，不会调用测试环境。`, false)); return; }
      if (/分配/.test(action)) { openModal(formModal({ title: '分配成员', fields: [{ key: 'email', label: 'User Email', placeholder: '请输入 User Email' }, { key: 'permission', label: '权限', control: 'select', options: ['管理员', '成员'], placeholder: '选择权限' }] }, row)); return; }
      if (/解除|更新|标记内部|标记|编辑标记|编辑/.test(action)) { openModal(confirmModal(action, `确认对 <strong>${esc(row.email || row.accountName || row.pixelName || row.name || '当前记录')}</strong> 执行“${esc(action)}”？原型不会调用真实接口。`, /解除/.test(action))); return; }
      openModal(detailModal(action, row));
    }

    root.addEventListener('click', event => {
      const tabButton = event.target.closest('[data-tab]');
      if (tabButton) { state.tab = tabButton.dataset.tab; render(); return; }
      const actionButton = event.target.closest('[data-action]');
      if (actionButton) {
        const tab = activeTab();
        if (actionButton.dataset.action === 'search') { readFilters(tab); render(); showToast('已按当前条件更新列表（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'reset') { state.values[tab.id] = {}; state.sort[tab.id] = null; render(); showToast('筛选条件已重置', 'info'); return; }
        if (actionButton.dataset.action === 'export') { showToast('导出任务已创建，可在导出中心查看进度（原型）', 'success'); return; }
        const actionLabel = actionButton.textContent.trim();
        const modal = tab.modals?.[actionLabel] || config.modals?.[actionLabel] || config.modals?.['配置KPI'] || config.modals?.['新增 BM'];
        if (modal) openModal(formModal({ ...modal, title: actionLabel }, {}));
        return;
      }
      const rowAction = event.target.closest('[data-row-action]');
      if (rowAction) handleRowAction(rowAction.dataset.rowAction, rows(activeTab())[Number(rowAction.dataset.rowIndex)] || {});
      const sortButton = event.target.closest('[data-sort]');
      if (sortButton) { const tab = activeTab(); const key = sortButton.dataset.sort; const current = state.sort[tab.id]; state.sort[tab.id] = !current || current.key !== key ? { key, dir: 'asc' } : current.dir === 'asc' ? { key, dir: 'desc' } : null; render(); }
    });
    document.body.addEventListener('click', event => {
      if (event.target.closest('[data-modal-close]')) closeModal();
      if (event.target.closest('[data-modal-submit]')) { closeModal(); showToast('操作已提交，列表将在成功后刷新（原型）', 'success'); }
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
