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
            { key: 'bd', label: 'BD', placeholder: '输入BD' },
            { key: 'am', label: 'AM', placeholder: '输入AM' },
            { key: 'member', label: '成员', placeholder: '输入User名称或Email' },
            { key: 'assigned', label: '已分配成员', type: 'select', options: ['已分配', '未分配'], placeholder: '选择已分配成员' }
          ],
          actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true }],
          filterClass: 'cols-5',
          tableMinWidth: 2540,
          opsWidth: 180,
          columns: [
            { key: 'accountName', label: '广告账户名称', align: 'left', width: 220 },
            { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
            { key: 'bmName', label: 'BM名称', align: 'left', width: 230 },
            { key: 'bmId', label: 'BM ID', width: 180 },
            { key: 'merchantId', label: '商户ID', width: 110 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'bd', label: 'BD', align: 'left', width: 220, format: person },
            { key: 'am', label: 'AM', align: 'left', width: 220, format: person },
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
            { accountName: 'TL-B-11-1205', accountId: '1001000035425554', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '-', customerName: '-', bd: '-', am: '-', accountStatus: 'ACTIVE', timezone: 'UTC+08:00', currency: 'USD', balance: '-', lastSyncAt: '-', user: 'Stan Tl', email: '2tal13205@muxue.vip', permission: '成员', internal: '内部人员', memberAction: '解除/更新', ops: ['解除', '更新'] },
            { accountName: 'TL-G-12-712', accountId: '1001765238416132', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '14229', customerName: 'test金额变动', bd: '王五(wangwu@bestfulfill.com)', am: '赵六(zhaoliu@bestfulfill.com)', accountStatus: 'ACTIVE', timezone: 'UTC+08:00', currency: 'USD', balance: '-', lastSyncAt: '-', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] },
            { accountName: 'Oliva-Amsterdam', accountId: '1002116215352952', bmName: '广州牧雪信息科技有限公司b', bmId: '1435041650616929', merchantId: '1128', customerName: 'adstest', bd: '张三(zhangsan@bestfulfill.com)', am: '李四(lisi@bestfulfill.com)', accountStatus: 'ACTIVE', timezone: 'UTC+01:00', currency: 'EUR', balance: '-', lastSyncAt: '-', user: '-', email: '-', permission: '-', internal: '-', memberAction: '分配', ops: ['分配'] }
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
    return (window.BESTADS_ADMIN_MODULE_CONFIGS && window.BESTADS_ADMIN_MODULE_CONFIGS[key]) || configs[key] || configs['meta-bm-config'];
  }

  function fieldHtml(field, values) {
    const value = values[field.key] || field.value || '';
    if (field.type === 'select') return `<div class="filter-field"><label>${esc(field.label)}</label><select data-filter="${esc(field.key)}"><option value="">${esc(field.placeholder || '全部')}</option>${(field.options || []).map(v => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
    if (field.type === 'multiselect') return `<div class="filter-field filter-field--multi"><label>${esc(field.label)}</label><select data-filter="${esc(field.key)}" multiple aria-label="${esc(field.label)}">${(field.options || []).map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('')}</select><span class="filter-help">${esc(field.hint || '支持多选')}</span></div>`;
    if (field.type === 'daterange') {
      const startKey = field.startKey || `${field.key}Start`;
      const endKey = field.endKey || `${field.key}End`;
      return `<div class="filter-field"><label>${esc(field.label)}</label><div class="datetime-range"><input data-filter="${esc(startKey)}" type="date" value="${esc(values[startKey] || '')}"><span class="datetime-sep">至</span><input data-filter="${esc(endKey)}" type="date" value="${esc(values[endKey] || '')}"></div></div>`;
    }
    if (field.type === 'textrange') {
      const startKey = field.startKey || `${field.key}Start`;
      const endKey = field.endKey || `${field.key}End`;
      return `<div class="filter-field"><label>${esc(field.label)}</label><div class="datetime-range"><input data-filter="${esc(startKey)}" type="text" placeholder="${esc(field.startPlaceholder || '开始时间')}" value="${esc(values[startKey] || '')}"><span class="datetime-sep">至</span><input data-filter="${esc(endKey)}" type="text" placeholder="${esc(field.endPlaceholder || '结束时间')}" value="${esc(values[endKey] || '')}"></div></div>`;
    }
    if (field.type === 'textarea') return `<div class="filter-field filter-field--textarea"><label>${esc(field.label)}</label><textarea data-filter="${esc(field.key)}" placeholder="${esc(field.placeholder || '')}">${esc(value)}</textarea></div>`;
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
    if (modal?.type === 'recharge-request') return rechargeRequestModal(modal);
    if (modal?.type === 'assign-account') return assignAccountModal(modal);
    if (modal?.type === 'account-adjustment') return accountAdjustmentModal(modal);
    if (modal?.type === 'offline-transfer-audit') return offlineTransferAuditModal(modal, row);
    if (modal?.type === 'receipt-preview') return receiptPreviewModal(modal, row);
    if (modal?.type === 'monitor-follow') return monitorFollowModal(modal, row);
    if (modal?.type === 'monitor-history') return monitorHistoryModal(modal, row);
    if (modal?.type === 'monitor-alert-preview') return monitorAlertPreviewModal(modal);
    const fields = modal?.fields || [];
    return `<div class="modal-backdrop"><section class="modal"><div class="modal__header"><h2 class="modal__title">${esc(modal?.title || '操作')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid">${fields.map(field => `<div class="form-field${field.full ? ' full' : ''}"><label>${esc(field.label)}${field.required === false ? '' : ' <span style="color:var(--admin-danger)">*</span>'}</label>${modalControl(field, row?.[field.key])}</div>`).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function offlineTransferAuditModal(modal, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '线下转账审核')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">原型只更新本地列表状态，不会提交测试环境数据。</div><div class="detail-grid"><div><dt>转账单号</dt><dd>${esc(row.orderId || '-')}</dd></div><div><dt>客户</dt><dd>${esc(row.customerName || '-')}（商户ID: ${esc(row.merchantId || '-')}）</dd></div><div><dt>支付平台</dt><dd>${esc(row.platform || '-')}</dd></div><div><dt>支付金额</dt><dd>${esc(row.payAmount || '-')} ${esc(row.payCurrency || '')}</dd></div></div><div class="form-grid" data-offline-audit-modal><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 入账币种</label><select data-audit-currency><option value="USD"${row.accountCurrency === 'USD' ? ' selected' : ''}>USD</option><option value="EUR"${row.accountCurrency === 'EUR' ? ' selected' : ''}>EUR</option><option value="HKD"${row.accountCurrency === 'HKD' ? ' selected' : ''}>HKD</option></select></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 入账金额</label><input data-audit-amount inputmode="decimal" placeholder="请输入入账金额" value="${esc(row.accountAmount && row.accountAmount !== '-' ? row.accountAmount : row.payAmount || '')}"></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 审核结果</label><select data-audit-status><option value="成功">审核通过</option><option value="失败">审核失败</option></select></div><div class="form-field full"><label>备注</label><textarea data-audit-remark placeholder="请输入审核备注">${esc(row.remark && row.remark !== '-' ? row.remark : '')}</textarea></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function receiptPreviewModal(modal, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '查看凭证')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="detail-grid"><div><dt>支付平台</dt><dd>${esc(row.platform || '-')}</dd></div><div><dt>平台支付ID</dt><dd>${esc(row.platformPayId || '-')}</dd></div><div><dt>支付金额</dt><dd>${esc(row.payAmount || '-')} ${esc(row.payCurrency || '')}</dd></div><div><dt>凭证文件</dt><dd>${esc(row.receiptFile || row.attachment || '-')}</dd></div></div><div class="receipt-preview-box"><div class="receipt-preview-box__icon">${icon('file-invoice-dollar')}</div><div><strong>支付凭证预览</strong><p>这里展示客户上传的银行转账、水单或第三方支付截图。原型使用脱敏 Fixture，不加载真实附件。</p></div></div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function monitorFollowModal(modal, row) {
    const title = modal.title || (row && Object.keys(row).length ? '跟进' : '批量跟进');
    const statusValue = row?.followStatus || '跟进中';
    const target = row?.accountId || row?.ruleName || row?.notificationId || '已选记录';
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><p class="confirm-copy">跟进对象：<strong>${esc(target)}</strong>。原型只更新当前页面 Fixture，不调用真实接口。</p><div class="form-grid" data-monitor-follow-modal><div class="form-field full"><label>跟进状态 <span style="color:var(--admin-danger)">*</span></label><select data-monitor-follow-status><option value="待跟进"${statusValue === '待跟进' ? ' selected' : ''}>待跟进</option><option value="跟进中"${statusValue === '跟进中' ? ' selected' : ''}>跟进中</option><option value="已处理"${statusValue === '已处理' ? ' selected' : ''}>已处理</option></select></div><div class="form-field full"><label>跟进备注</label><textarea data-monitor-follow-remark placeholder="请输入跟进说明">${esc(row?.followRemark || '')}</textarea></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function monitorHistoryModal(modal, row) {
    const history = row?.followHistory || [];
    const current = row?.followAt ? [{ status: row.followStatus, owner: row.followOwner, at: row.followAt, remark: row.followRemark || row.remark || '-' }] : [];
    const records = history.length ? history : current;
    const body = records.length ? records.map(item => `<div class="follow-log"><div class="follow-log__head"><strong>${esc(item.statusLabel || item.status || '-')}</strong><span class="follow-log__meta">${esc(item.at || '-')}</span></div><div class="follow-log__meta">${esc(item.owner || '-')}</div><div class="follow-log__remark">${esc(item.remark || '-')}</div></div>`).join('') : '<div class="empty-state">暂无跟进记录</div>';
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '跟进记录')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body">${body}</div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function monitorAlertPreviewModal(modal) {
    const lines = modal.lines || ['【监控告警】示例消息', '命中记录：3 条', '请相关负责人进入运营端处理。'];
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '飞书告警示意')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="risk-summary">${lines.map(line => `<span>${esc(line)}</span>`).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function rechargeRequestModal(modal) {
    const customers = modal.customers || [];
    const accountRows = customers.flatMap(customer => (customer.accounts || []).map(account => ({ ...account, customerId: customer.id, customerName: customer.name, merchantId: customer.merchantId, walletBalance: customer.balance })));
    return `<div class="modal-backdrop"><section class="modal modal-recharge"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '发起充值')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="recharge-form" data-recharge-modal><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 客户（单选）</label><select data-recharge-customer><option value="">选择客户</option>${customers.map(customer => `<option value="${esc(customer.id)}">${esc(customer.id)} ${esc(customer.name)}（商户ID: ${esc(customer.merchantId)}）</option>`).join('')}</select></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 广告账户（多选）</label><div class="recharge-account-toolbar"><input type="text" data-recharge-account-search placeholder="输入广告账户"><button type="button" class="btn btn-primary" data-recharge-query>${icon('search')}查 询</button></div><div class="table-scroll recharge-account-table"><table class="admin-table admin-table--fixed"><colgroup><col style="width:52px"><col style="width:360px"><col style="width:140px"><col style="width:160px"></colgroup><thead><tr><th class="select-cell"></th><th class="left">账户名称</th><th>广告账户币种</th><th class="num">当前余额</th></tr></thead><tbody>${accountRows.map(account => `<tr data-recharge-account-row data-customer-id="${esc(account.customerId)}" data-account-key="${esc(`${account.name} ${account.id}`.toLowerCase())}" hidden><td class="select-cell"><input type="checkbox" data-recharge-account value="${esc(account.id)}" data-account-name="${esc(account.name)}" data-currency="${esc(account.currency)}" data-balance="${esc(account.balance)}" data-wallet-balance="${esc(account.walletBalance)}" data-service-rate="${esc(account.serviceRate ?? 0)}" data-pre-tax-rate="${esc(account.preTaxRate ?? 0)}"></td><td class="left">${esc(account.name)}(${esc(account.id)})</td><td>${esc(account.currency)}</td><td class="num">${esc(account.balance)}</td></tr>`).join('')}</tbody></table><div class="empty-state recharge-empty" data-recharge-empty>暂无数据</div></div><div class="pagination recharge-account-pagination"><span data-recharge-count>共 0 条记录</span><div class="pagination__actions"><button type="button" class="page-number" disabled>‹</button><button type="button" class="page-number is-active">1</button><button type="button" class="page-number" disabled>›</button></div></div></div><div class="form-field full recharge-amount-panel" data-recharge-amount-panel><label>充值金额设置</label><div class="notice recharge-select-notice" data-recharge-select-notice>请至少选择一个广告账户</div><div class="recharge-amount-list" data-recharge-amount-list></div><div class="recharge-total-row"><span>总充值金额：<strong data-recharge-total>0.00 USD</strong></span><span>可用余额：<strong data-recharge-wallet>-</strong></span></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-modal-submit>确 定</button></div></section></div>`;
  }

  function assignAccountModal(modal) {
    const customers = modal.customers || [];
    const accounts = customers.flatMap(customer => (customer.accounts || []).map(account => ({ ...account, customerId: customer.id, customerName: customer.name, merchantId: customer.merchantId })));
    return `<div class="modal-backdrop"><section class="modal modal-recharge"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '分配账户')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="recharge-form" data-assign-modal><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 客户（单选）</label><select data-assign-customer><option value="">选择客户</option>${customers.map(customer => `<option value="${esc(customer.id)}" data-customer-name="${esc(customer.name)}" data-merchant-id="${esc(customer.merchantId)}" data-bd="${esc(customer.bd || '-')}" data-am="${esc(customer.am || '-')}">${esc(customer.id)} ${esc(customer.name)}（商户ID: ${esc(customer.merchantId)}）</option>`).join('')}</select></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 广告账户（多选）</label><div class="recharge-account-toolbar"><input type="text" data-assign-account-search placeholder="输入广告账户"><button type="button" class="btn btn-primary" data-assign-query>${icon('search')}查 询</button></div><div class="table-scroll recharge-account-table"><table class="admin-table admin-table--fixed"><colgroup><col style="width:52px"><col style="width:360px"><col style="width:120px"><col style="width:240px"></colgroup><thead><tr><th class="select-cell"></th><th class="left">账户</th><th>状态</th><th class="left">不可用原因</th></tr></thead><tbody>${accounts.map(account => `<tr data-assign-account-row data-account-key="${esc(`${account.name} ${account.id}`.toLowerCase())}"><td class="select-cell"><input type="checkbox" data-assign-account value="${esc(account.id)}" data-account-name="${esc(account.name)}" data-agent="${esc(account.agent || '-')}" data-type="${esc(account.type || '-')}" data-account-status="${esc(account.status === '可用' ? '活跃' : '停用')}" data-currency="${esc(account.currency || 'USD')}" data-balance="${esc(account.balance || '-')}" ${account.status === '可用' ? '' : 'disabled'}></td><td class="left">${esc(account.name)}(${esc(account.id)})</td><td>${account.status === '可用' ? '<span class="status-tag status-success">可用</span>' : '<span class="status-tag status-danger">不可用</span>'}</td><td class="left">${esc(account.reason || '-')}</td></tr>`).join('')}</tbody></table></div><div class="pagination recharge-account-pagination"><span data-assign-count>共 ${accounts.length} 条记录</span><div class="pagination__actions"><button type="button" class="page-number" disabled>‹</button><button type="button" class="page-number is-active">1</button><button type="button" class="page-number" disabled>›</button></div></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-modal-submit>确 定</button></div></section></div>`;
  }

  function accountAdjustmentModal(modal) {
    const customers = modal.customers || [];
    const kind = modal.kind || '减款';
    const amountLabel = kind === '清零' ? '可清零金额' : '可减款金额';
    const accounts = customers.flatMap(customer => (customer.accounts || []).map(account => ({ ...account, customerId: customer.id, customerName: customer.name, merchantId: customer.merchantId })));
    const clearCols = kind === '清零' ? '<col style="width:160px"><col style="width:220px">' : '';
    const clearHead = kind === '清零' ? '<th class="num">近 2 天消耗</th><th class="left">不可清零原因</th>' : '';
    const rows = accounts.map(account => {
      const spendValue = account.spend2d == null ? '-' : account.spend2d;
      const spendAmount = Number(String(spendValue).replace(/,/g, ''));
      const blocked = kind === '清零' && Number.isFinite(spendAmount) && spendAmount > 0;
      const reason = blocked ? '近 2 天有消耗，不可清零' : '-';
      return `<tr data-adjustment-account-row data-customer-id="${esc(account.customerId)}" data-account-key="${esc(`${account.name} ${account.id}`.toLowerCase())}" hidden${blocked ? ' class="is-disabled-row"' : ''}><td class="select-cell"><input type="checkbox" data-adjustment-account value="${esc(account.id)}" data-account-name="${esc(account.name)}" data-currency="${esc(account.currency || 'USD')}" data-balance="${esc(account.balance || '')}" data-spend2d="${esc(spendValue)}"${blocked ? ' disabled title="近 2 天有消耗，不可清零"' : ''}></td><td class="left">${esc(account.name)}(${esc(account.id)})</td><td>${esc(account.currency || 'USD')}</td><td class="num">${esc(account.balance || '-')}</td>${kind === '清零' ? `<td class="num">${esc(spendValue)}</td><td class="left">${esc(reason)}</td>` : ''}</tr>`;
    }).join('');
    return `<div class="modal-backdrop"><section class="modal modal-recharge"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || `发起${kind}`)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="recharge-form" data-adjustment-modal data-adjustment-kind="${esc(kind)}"><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 客户（单选）</label><select data-adjustment-customer><option value="">选择客户</option>${customers.map(customer => `<option value="${esc(customer.id)}" data-customer-name="${esc(customer.name)}" data-merchant-id="${esc(customer.merchantId)}">${esc(customer.id)} ${esc(customer.name)}（商户ID: ${esc(customer.merchantId)}）</option>`).join('')}</select></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 广告账户（多选）</label><div class="recharge-account-toolbar"><input type="text" data-adjustment-account-search placeholder="输入广告账户"><button type="button" class="btn btn-primary" data-adjustment-query>${icon('search')}查 询</button></div><div class="table-scroll recharge-account-table"><table class="admin-table admin-table--fixed"><colgroup><col style="width:52px"><col style="width:390px"><col style="width:120px"><col style="width:180px">${clearCols}</colgroup><thead><tr><th class="select-cell"></th><th class="left">账户名称</th><th>账户币种</th><th class="num">${esc(amountLabel)}</th>${clearHead}</tr></thead><tbody>${rows}</tbody></table><div class="empty-state recharge-empty" data-adjustment-empty>暂无数据</div></div><div class="pagination recharge-account-pagination"><span data-adjustment-count>共 0 条记录</span><div class="pagination__actions"><button type="button" class="page-number" disabled>‹</button><button type="button" class="page-number is-active">1</button><button type="button" class="page-number" disabled>›</button></div></div></div><div class="form-field full recharge-amount-panel"><label>${esc(kind)}金额设置</label><div class="notice recharge-select-notice" data-adjustment-select-notice>请至少选择一个广告账户</div><div class="recharge-amount-list" data-adjustment-amount-list></div><div class="recharge-total-row"><span>总${esc(kind)}金额：<strong data-adjustment-total>0.00 USD</strong></span></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-modal-submit>确 定</button></div></section></div>`;
  }

  function confirmModal(title, copy, danger, action, options = {}) {
    const confirmText = options.confirmText || '确定';
    const cancelText = options.cancelText || '取消';
    const sizeClass = options.size === 'md' ? ' modal-md' : ' modal-sm';
    return `<div class="modal-backdrop"${action ? ` data-confirm-action="${esc(action)}"` : ''}><section class="modal${sizeClass}"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="confirm-copy">${copy}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>${esc(cancelText)}</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-modal-submit>${esc(confirmText)}</button></div></section></div>`;
  }

  function detailModal(title, row, tab) {
    const labelMap = new Map((tab?.columns || []).map(column => [column.key, column.label]));
    const preferredKeys = (tab?.columns || []).map(column => column.key);
    const extraKeys = Object.keys(row || {}).filter(key => key !== 'ops' && key !== 'selectable' && !labelMap.has(key));
    const keys = preferredKeys.concat(extraKeys).filter(key => key in (row || {}) && key !== 'ops' && key !== 'selectable');
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">以下为按页面字段契约整理的原型信息；真实提交需以后端接口权限为准。</div><dl class="detail-grid">${keys.map(key => `<div><dt>${esc(labelMap.get(key) || key)}</dt><dd>${esc(asText(row[key]))}</dd></div>`).join('')}</dl></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function customFieldsModal(tab, fieldPref) {
    const columnsByKey = new Map((tab.columns || []).map(column => [column.key, column]));
    const ordered = (fieldPref.order || []).map(key => columnsByKey.get(key)).filter(Boolean);
    const hidden = ordered.filter(column => !fieldPref.visible.has(column.key));
    const visible = ordered.filter(column => fieldPref.visible.has(column.key));
    return `<div class="modal-backdrop drawer-backdrop" data-field-drawer><section class="modal drawer-modal"><div class="modal__header"><h2 class="modal__title">自定义列表字段</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="field-custom-summary"><strong>${visible.length} 项显示</strong><span class="muted">拖拽可调整字段顺序</span></div><div class="account-check-list field-custom-list">${ordered.map(column => `<label class="account-check field-custom-item" draggable="true" data-field-key="${esc(column.key)}"><span class="field-drag-handle">${icon('grip-vertical')}</span><input type="checkbox" data-field-toggle="${esc(column.key)}" ${fieldPref.visible.has(column.key) ? 'checked' : ''}><span>${esc(column.label)}</span></label>`).join('')}</div><div class="field-custom-summary muted"><strong>${hidden.length} 项隐藏</strong><span>${hidden.length ? hidden.map(column => esc(column.label)).join('、') : '暂无数据'}</span></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-action-reset-fields>恢复默认</button><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-field-confirm>确 定</button></div></section></div>`;
  }

  function chartCardHtml(chart) {
    const items = chart.items || [];
    const max = Math.max(1, ...items.map(item => Number(item.value) || 0));
    if (chart.type === 'donut') {
      let cursor = 0;
      const stops = items.map((item, index) => {
        const value = Math.max(0, Number(item.value) || 0);
        const start = cursor;
        cursor += value;
        const end = cursor;
        return `${item.color || ['#006be6', '#67c23a', '#d7a51a', '#f56c6c', '#8b5cf6'][index % 5]} ${start}% ${end}%`;
      }).join(', ');
      return `<section class="admin-card chart-card"><div class="admin-card__header"><h3 class="admin-card__title">${esc(chart.title || '图表')}</h3></div><div class="admin-card__body chart-card__body"><div class="donut-chart" style="--donut-stops:${esc(stops)}"><span>${esc(chart.center || '')}</span></div><div class="chart-legend">${items.map(item => `<span><i style="background:${esc(item.color || '#006be6')}"></i>${esc(item.label)} <b>${esc(item.display || `${item.value}%`)}</b></span>`).join('')}</div></div></section>`;
    }
    return `<section class="admin-card chart-card"><div class="admin-card__header"><h3 class="admin-card__title">${esc(chart.title || '图表')}</h3></div><div class="admin-card__body"><div class="bar-chart">${items.map(item => `<div class="bar-chart__row"><span class="bar-chart__label">${esc(item.label)}</span><div class="bar-chart__track"><i style="width:${Math.max(4, Math.round((Number(item.value) || 0) / max * 100))}%;background:${esc(item.color || '#006be6')}"></i></div><span class="bar-chart__value">${esc(item.display || item.value || '-')}</span></div>`).join('')}</div></div></section>`;
  }

  function chartsHtml(tab, config) {
    const charts = tab.charts || config.charts || [];
    return charts.length ? `<section class="chart-grid">${charts.map(chartCardHtml).join('')}</section>` : '';
  }

  function dimensionSelectorHtml(tab) {
    const groups = tab.dimensionGroups || [];
    if (!groups.length) return '';
    const options = groups.flatMap(group => (group.options || []).map(option => ({ ...option, group })));
    return `<section class="admin-card dimension-card"><div class="admin-card__body dimension-card__body"><div class="dimension-line"><div class="dimension-line__title">统计维度</div><div class="dimension-options">${options.map(item => `<label class="dimension-option"><input type="checkbox" name="${esc(item.group.key)}" data-dimension-group="${esc(item.group.key)}"${item.group.exclusive ? ' data-dimension-exclusive="true"' : ''} ${item.checked ? 'checked' : ''}><span>${esc(item.label)}</span></label>`).join('')}</div></div></div></section>`;
  }

  function renderCell(column, row) {
    const value = row[column.key];
    const rendered = column.format ? column.format(value, row) : asText(value);
    return `<td class="${column.num ? 'num ' : ''}${column.align === 'left' ? 'left ' : ''}${column.format === longText ? 'wrap' : ''}">${rendered}</td>`;
  }

  function boot() {
    const root = document.getElementById('page-root');
    if (!root) return;
    const config = pageConfig();
    const tabs = config.tabs || [{ id: 'list', label: '', ...config }];
    const state = { tab: tabs[0].id, values: {}, sort: {}, selected: {}, fields: {}, dragFieldKey: null, pendingAdjustment: null, pendingProcess: null, processingRow: null };

    function activeTab() { return tabs.find(item => item.id === state.tab) || tabs[0]; }
    function selectedSet(tab) { if (!state.selected[tab.id]) state.selected[tab.id] = new Set(); return state.selected[tab.id]; }
    function defaultFieldPref(tab) {
      const keys = (tab.columns || []).map(column => column.key);
      return { order: keys.slice(), visible: new Set(keys) };
    }
    function fieldPref(tab) {
      if (!state.fields[tab.id]) state.fields[tab.id] = defaultFieldPref(tab);
      return state.fields[tab.id];
    }
    function displayedColumns(tab) {
      const pref = fieldPref(tab);
      const columnsByKey = new Map((tab.columns || []).map(column => [column.key, column]));
      return pref.order.map(key => columnsByKey.get(key)).filter(column => column && pref.visible.has(column.key));
    }
    function refreshFieldDrawer(tab) {
      const drawer = document.querySelector('[data-field-drawer]');
      if (drawer) drawer.outerHTML = customFieldsModal(tab, fieldPref(tab));
    }
    function currentTableMinWidth(tab, columns, showOps) {
      const contentWidth = columns.reduce((sum, column) => sum + (column.width || 160), 0) + (tab.selectable ? 52 : 0) + (showOps ? (tab.opsWidth || 180) : 0);
      return Math.max(980, contentWidth);
    }
    function rows(tab) {
      const values = state.values[tab.id] || {};
      const rangeFields = new Map((tab.filters || []).filter(field => field.type === 'daterange').map(field => [field.key, {
        startKey: field.startKey || `${field.key}Start`,
        endKey: field.endKey || `${field.key}End`
      }]));
      const rangeValueKeys = new Set(Array.from(rangeFields.values()).flatMap(item => [item.startKey, item.endKey]));
      let result = (tab.rows || []).filter(row => {
        const matchedTextFilters = Object.keys(values).every(key => {
          if (rangeValueKeys.has(key)) return true;
          if (!(key in row)) return true;
          return !values[key] || String(row[key] || '').toLowerCase().includes(String(values[key]).toLowerCase());
        });
        if (!matchedTextFilters) return false;
        return Array.from(rangeFields.entries()).every(([key, range]) => {
          const rowDate = String(row[key] || '').slice(0, 10);
          const start = values[range.startKey];
          const end = values[range.endKey];
          if (start && rowDate < start) return false;
          if (end && rowDate > end) return false;
          return true;
        });
      });
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
    function modalTextWithSelection(value, tab) {
      return String(value || '').replace(/\{\{count\}\}/g, String(selectedSet(tab).size));
    }
    function refreshRechargeModal(modalRoot) {
      if (!modalRoot) return;
      const customerId = modalRoot.querySelector('[data-recharge-customer]')?.value || '';
      const keyword = (modalRoot.querySelector('[data-recharge-account-search]')?.value || '').trim().toLowerCase();
      let visibleCount = 0;
      modalRoot.querySelectorAll('[data-recharge-account-row]').forEach(row => {
        const matchesCustomer = customerId && row.dataset.customerId === customerId;
        const matchesKeyword = !keyword || (row.dataset.accountKey || '').includes(keyword);
        const visible = Boolean(matchesCustomer && matchesKeyword);
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      const empty = modalRoot.querySelector('[data-recharge-empty]');
      if (empty) empty.hidden = visibleCount > 0;
      const count = modalRoot.querySelector('[data-recharge-count]');
      if (count) count.textContent = `共 ${visibleCount} 条记录`;
      refreshRechargeAmounts(modalRoot);
    }
    function refreshRechargeAmounts(modalRoot) {
      if (!modalRoot) return;
      const list = modalRoot.querySelector('[data-recharge-amount-list]');
      const notice = modalRoot.querySelector('[data-recharge-select-notice]');
      const total = modalRoot.querySelector('[data-recharge-total]');
      const wallet = modalRoot.querySelector('[data-recharge-wallet]');
      const checked = Array.from(modalRoot.querySelectorAll('[data-recharge-account]:checked'));
      if (notice) notice.hidden = checked.length > 0;
      if (list) {
        list.innerHTML = checked.map(input => `<div class="recharge-amount-card" data-recharge-amount-card data-currency="${esc(input.dataset.currency || 'USD')}" data-service-rate="${esc(input.dataset.serviceRate || '0')}" data-pre-tax-rate="${esc(input.dataset.preTaxRate || '0')}"><div class="recharge-amount-info"><strong>${esc(input.dataset.accountName || input.value)}</strong><div class="recharge-amount-meta"><span>当前余额：${esc(input.dataset.balance || '-')} ${esc(input.dataset.currency || '')}</span><span>服务费：<b data-service-fee>-</b></span><span>预收税费：<b data-pre-tax-fee>-</b></span><span>实际到账：<b data-actual-amount>-</b></span></div></div><input type="text" inputmode="decimal" placeholder="输入充值金额" data-recharge-amount-input></div>`).join('');
      }
      recalculateRechargeAmounts(modalRoot);
      if (wallet) wallet.textContent = checked[0]?.dataset.walletBalance || '-';
    }
    function parseAmount(value) {
      const normalized = String(value || '').replace(/,/g, '').trim();
      const amount = Number(normalized);
      return Number.isFinite(amount) && amount > 0 ? amount : 0;
    }
    function formatMoney(value, currency) {
      return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'USD'}`;
    }
    function recalculateRechargeAmounts(modalRoot) {
      if (!modalRoot) return;
      let totalAmount = 0;
      let totalCurrency = 'USD';
      modalRoot.querySelectorAll('[data-recharge-amount-card]').forEach(card => {
        const currency = card.dataset.currency || 'USD';
        totalCurrency = currency;
        const amountValue = parseAmount(card.querySelector('[data-recharge-amount-input]')?.value);
        const serviceRate = Number(card.dataset.serviceRate || 0) / 100;
        const preTaxRate = Number(card.dataset.preTaxRate || 0) / 100;
        const serviceFee = amountValue * serviceRate;
        const preTaxFee = amountValue * preTaxRate;
        const actualAmount = Math.max(0, amountValue - serviceFee - preTaxFee);
        totalAmount += amountValue;
        const serviceNode = card.querySelector('[data-service-fee]');
        const preTaxNode = card.querySelector('[data-pre-tax-fee]');
        const actualNode = card.querySelector('[data-actual-amount]');
        if (serviceNode) serviceNode.textContent = amountValue ? formatMoney(serviceFee, currency) : '-';
        if (preTaxNode) preTaxNode.textContent = amountValue ? formatMoney(preTaxFee, currency) : '-';
        if (actualNode) actualNode.textContent = amountValue ? formatMoney(actualAmount, currency) : '-';
      });
      const total = modalRoot.querySelector('[data-recharge-total]');
      if (total) total.textContent = formatMoney(totalAmount, totalCurrency);
    }
    function filterRows(modalRoot, rowSelector, searchSelector, countSelector, customerSelector = null, emptySelector = null) {
      if (!modalRoot) return;
      const keyword = (modalRoot.querySelector(searchSelector)?.value || '').trim().toLowerCase();
      const customerId = customerSelector ? (modalRoot.querySelector(customerSelector)?.value || '') : '';
      let visibleCount = 0;
      modalRoot.querySelectorAll(rowSelector).forEach(row => {
        const matchesKeyword = !keyword || (row.dataset.accountKey || '').includes(keyword);
        const matchesCustomer = !customerSelector || (customerId && row.dataset.customerId === customerId);
        const visible = Boolean(matchesKeyword && matchesCustomer);
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      const count = modalRoot.querySelector(countSelector);
      if (count) count.textContent = `共 ${visibleCount} 条记录`;
      const empty = emptySelector ? modalRoot.querySelector(emptySelector) : null;
      if (empty) empty.hidden = visibleCount > 0;
    }
    function refreshAssignModal(modalRoot) {
      filterRows(modalRoot, '[data-assign-account-row]', '[data-assign-account-search]', '[data-assign-count]');
    }
    function refreshAdjustmentModal(modalRoot) {
      filterRows(modalRoot, '[data-adjustment-account-row]', '[data-adjustment-account-search]', '[data-adjustment-count]', '[data-adjustment-customer]', '[data-adjustment-empty]');
      modalRoot?.querySelectorAll('[data-adjustment-account-row][hidden] [data-adjustment-account]').forEach(input => { input.checked = false; });
      refreshAdjustmentAmounts(modalRoot);
    }
    function refreshAdjustmentAmounts(modalRoot) {
      if (!modalRoot) return;
      const kind = modalRoot.dataset.adjustmentKind || '减款';
      const list = modalRoot.querySelector('[data-adjustment-amount-list]');
      const notice = modalRoot.querySelector('[data-adjustment-select-notice]');
      const checked = Array.from(modalRoot.querySelectorAll('[data-adjustment-account]:checked'));
      if (notice) notice.hidden = checked.length > 0;
      if (list) {
        list.innerHTML = checked.map(input => {
          const amount = kind === '清零' ? parseAmount(input.dataset.balance) : 0;
          const spendText = kind === '清零' ? `<span>近 2 天消耗：<b>${esc(input.dataset.spend2d || '0.00')} ${esc(input.dataset.currency || 'USD')}</b></span>` : '';
          return `<div class="recharge-amount-card" data-adjustment-amount-card data-account-id="${esc(input.value)}" data-currency="${esc(input.dataset.currency || 'USD')}" data-balance="${esc(input.dataset.balance || '')}" data-kind="${esc(kind)}"><div class="recharge-amount-info"><strong>${esc(input.dataset.accountName || input.value)}</strong><div class="recharge-amount-meta"><span>${esc(kind === '清零' ? '可清零金额' : '可减款金额')}：${esc(input.dataset.balance || '-')} ${esc(input.dataset.currency || 'USD')}</span>${spendText}</div></div><input type="text" inputmode="decimal" placeholder="${kind === '清零' ? '由媒体结算确认' : `输入${esc(kind)}金额`}" data-adjustment-amount-input value="${amount ? esc(amount) : ''}"${kind === '清零' ? ' readonly' : ''}></div>`;
        }).join('');
      }
      recalculateAdjustmentAmounts(modalRoot);
    }
    function recalculateAdjustmentAmounts(modalRoot) {
      if (!modalRoot) return;
      let totalAmount = 0;
      let totalCurrency = 'USD';
      modalRoot.querySelectorAll('[data-adjustment-amount-card]').forEach(card => {
        totalCurrency = card.dataset.currency || 'USD';
        totalAmount += parseAmount(card.querySelector('[data-adjustment-amount-input]')?.value);
      });
      const total = modalRoot.querySelector('[data-adjustment-total]');
      if (total) total.textContent = formatMoney(totalAmount, totalCurrency);
    }
    function adjustmentRiskCopy(kind, count) {
      const lines = kind === '清零'
        ? ['建议账户停止投放 48 小时后再来清零，金额会更加准确。', '最终清零金额以结算时的金额为准。', '近 2 天（昨天与当天）有消耗的账户不可勾选、不可清零。']
        : ['建议账户停止投放 48 小时后再来减款，金额会更加准确。', '最终减款金额以结算时的金额为准。'];
      return `<div class="risk-confirm"><p class="risk-confirm__sub">请阅读以下说明后再确认。批量操作仅弹一次。</p>${lines.map((line, index) => `<div class="risk-confirm__line"><span>${index + 1}</span><p>${esc(line)}</p></div>`).join('')}<div class="notice risk-confirm__count">本次将提交 ${count} 个账户的${esc(kind)}申请。</div></div>`;
    }
    function openAdjustmentRiskConfirm(kind, count) {
      closeModal();
      openModal(confirmModal(`确认提交${kind}`, adjustmentRiskCopy(kind, count), kind !== '充值', 'confirm-submit-adjustment', { confirmText: '我已知晓，确认提交', size: 'md' }));
    }
    function commitPendingAdjustment() {
      const pending = state.pendingAdjustment;
      if (!pending) return;
      pending.tab.rows = pending.rows.concat(pending.tab.rows || []);
      selectedSet(pending.tab).clear();
      state.pendingAdjustment = null;
      closeModal();
      render();
      showToast(`已新增 ${pending.rows.length} 条${pending.kind}工单（原型）`, 'success');
    }
    function processResultModal(action, row) {
      const pageTitle = activeTab().title || config.title || '';
      const kind = /减款/.test(pageTitle) ? '减款' : /清零/.test(pageTitle) ? '清零' : '';
      const defaultAmount = parseAmount(row.actualAmount || row.walletAmount || row.amount) || '';
      const baseText = kind === '减款' ? '申请减款金额' : row.bindCard === '是' ? '当前使用卡剩余额度' : '清零提交时账户余额';
      return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(action)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid" data-process-modal data-process-action="${esc(action)}" data-process-kind="${esc(kind)}"><div class="form-field"><label>工单ID</label><input value="${esc(row.orderId || '-')}" readonly></div><div class="form-field"><label>广告账户</label><input value="${esc(row.accountName || row.accountId || '-')}" readonly></div><div class="form-field"><label>基准说明</label><input data-process-base-label value="${esc(baseText)}" readonly></div><div class="form-field"><label>基准金额</label><input data-process-base value="${esc(row.amount || '-')}" readonly></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 本次输入金额</label><input type="text" inputmode="decimal" data-process-amount placeholder="请输入实际加回客户钱包金额" value="${esc(defaultAmount)}"></div><div class="notice full">该金额将增加客户钱包。基准缺失或偏差 ≥ 5% 时，需要二次确认；确认后不硬拦，继续按输入金额提交。</div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
    }
    function processRiskCopy(pending) {
      if (!pending.base) {
        return `<div class="risk-confirm"><p>基准金额为 0 或暂时无法获取，系统无法计算 5% 偏差。</p><p class="risk-confirm__sub">请人工核对后再确认。确认后仍将按本次输入金额增加客户钱包。</p><div class="risk-summary"><span>基准说明：${esc(pending.baseLabel)}</span><span>基准金额：${esc(pending.baseRaw || '-')}</span><span>本次输入：${esc(formatMoney(pending.amount, pending.currency))}</span></div></div>`;
      }
      return `<div class="risk-confirm"><p>输入金额与系统基准相差 ≥ 5%。确认后仍将按输入金额增加客户钱包。</p><div class="risk-summary"><span>基准说明：${esc(pending.baseLabel)}</span><span>基准金额：${esc(formatMoney(pending.base, pending.currency))}</span><span>本次输入：${esc(formatMoney(pending.amount, pending.currency))}</span><span>偏差：${esc((pending.delta * 100).toFixed(2))}%</span></div></div>`;
    }
    function commitPendingProcess() {
      const pending = state.pendingProcess;
      if (!pending) return;
      Object.assign(pending.row, {
        actualAmount: pending.amount.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        walletAmount: pending.amount.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        status: '完成',
        completedAt: currentTimestamp(),
        selectable: false,
        remark: pending.row.remark && pending.row.remark !== '-' ? pending.row.remark : `${pending.action}，已完成事中金额确认`
      });
      state.pendingProcess = null;
      closeModal();
      render();
      showToast(`${pending.action}已确认，工单状态已更新（原型）`, 'success');
    }
    function submitProcessModal(modalRoot) {
      const row = state.processingRow;
      if (!row) { showToast('未找到当前工单', 'error'); return 'handled'; }
      const amount = parseAmount(modalRoot.querySelector('[data-process-amount]')?.value);
      if (!amount) { showToast('请输入本次输入金额', 'error'); return 'handled'; }
      const baseRaw = modalRoot.querySelector('[data-process-base]')?.value || '';
      const base = parseAmount(baseRaw);
      const baseLabel = modalRoot.querySelector('[data-process-base-label]')?.value || '';
      const action = modalRoot.dataset.processAction || '处理成功';
      const currency = row.currency || row.walletCurrency || 'USD';
      const delta = base ? Math.abs(amount - base) / Math.abs(base) : null;
      const pending = { row, amount, base, baseRaw, baseLabel, action, currency, delta };
      state.processingRow = null;
      if (!base || delta >= 0.05) {
        state.pendingProcess = pending;
        closeModal();
        openModal(confirmModal(!base ? '无法校验金额偏差' : '金额偏差较大，请二次确认', processRiskCopy(pending), true, 'confirm-process-success', { confirmText: '已知悉，确认提交', cancelText: '返回修改', size: 'md' }));
        return 'pending';
      }
      state.pendingProcess = pending;
      commitPendingProcess();
      return 'handled';
    }
    function currentTimestamp() {
      const now = new Date();
      const pad = value => String(value).padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    function submitAssignModal(modalRoot, tab) {
      const select = modalRoot.querySelector('[data-assign-customer]');
      const option = select?.selectedOptions?.[0];
      const selectedAccounts = Array.from(modalRoot.querySelectorAll('[data-assign-account]:checked'));
      if (!select?.value) { showToast('请先选择客户', 'error'); return false; }
      if (!selectedAccounts.length) { showToast('请至少选择一个可用广告账户', 'error'); return false; }
      const time = currentTimestamp();
      const newRows = selectedAccounts.map(input => ({
        customerId: select.value,
        customerName: option?.dataset.customerName || '-',
        bd: option?.dataset.bd || '-',
        am: option?.dataset.am || '-',
        merchantId: option?.dataset.merchantId || '-',
        accountId: input.value,
        accountName: input.dataset.accountName || '-',
        accountStatus: input.dataset.accountStatus || '活跃',
        currency: input.dataset.currency || 'USD',
        balance: input.dataset.balance || '-',
        agent: input.dataset.agent || '-',
        type: input.dataset.type || '-',
        boundAt: time,
        operator: '管理员(admin@bestfulfill.com)'
      }));
      tab.rows = newRows.concat(tab.rows || []);
      selectedSet(tab).clear();
      render();
      showToast(`已分配 ${newRows.length} 个广告账户（原型）`, 'success');
      return true;
    }
    function submitAdjustmentModal(modalRoot, tab) {
      const kind = modalRoot.dataset.adjustmentKind || '减款';
      const select = modalRoot.querySelector('[data-adjustment-customer]');
      const option = select?.selectedOptions?.[0];
      const cards = Array.from(modalRoot.querySelectorAll('[data-adjustment-amount-card]'));
      if (!select?.value) { showToast('请先选择客户', 'error'); return false; }
      if (!cards.length) { showToast(`请至少选择一个需要${kind}的广告账户`, 'error'); return false; }
      const time = currentTimestamp();
      const orderPrefix = kind === '清零' ? 'AD-CLEAR-PROTO' : 'AD-SUB-PROTO';
      const newRows = cards.map((card, index) => {
        const input = card.querySelector('[data-adjustment-amount-input]');
        const amount = parseAmount(input?.value);
        if (!amount && !(kind === '清零' && (!card.dataset.balance || card.dataset.balance === '-'))) return null;
        const accountName = card.querySelector('.recharge-amount-info strong')?.textContent || '-';
        const amountText = amount ? amount.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '-';
        return {
          orderId: `${orderPrefix}-${Date.now()}-${index + 1}`,
          customerId: select.value,
          customerName: option?.dataset.customerName || '-',
          merchantId: option?.dataset.merchantId || '-',
          submitter: '管理员',
          submittedAt: time,
          accountId: card.dataset.accountId || '-',
          accountName,
          bindCard: '否',
          cardSnapshot: '-',
          currency: card.dataset.currency || 'USD',
          agent: '-',
          amount: amountText,
          actualAmount: kind === '减款' ? amountText : undefined,
          walletCurrency: card.dataset.currency || 'USD',
          walletAmount: amountText,
          status: '待处理',
          completedAt: '-',
          actualDate: kind === '清零' ? '-' : undefined,
          remark: '原型新增工单',
          ops: kind === '清零' ? ['处理成功', '媒体已完成', '标记媒体失败', '重试', '忽略并完成'] : ['媒体已完成', '标记媒体失败', '重试', '忽略并完成']
        };
      }).filter(Boolean);
      if (!newRows.length) { showToast(`请输入${kind}金额`, 'error'); return false; }
      state.pendingAdjustment = { tab, kind, rows: newRows };
      openAdjustmentRiskConfirm(kind, newRows.length);
      return 'pending';
    }
    function removeSelectedRows(tab) {
      const selected = selectedSet(tab);
      const removeIndexes = new Set(selected);
      tab.rows = (tab.rows || []).filter((_, index) => !removeIndexes.has(index));
      selected.clear();
      render();
      showToast('已解除选中账户绑定，当前列表已更新（原型）', 'success');
    }
    function markSelectedRowsFailed(tab) {
      const selected = selectedSet(tab);
      tab.rows = (tab.rows || []).map((row, index) => {
        if (!selected.has(index)) return row;
        return { ...row, status: '失败', completedAt: '-', remark: row.remark === '-' ? '运营处理失败' : row.remark || '运营处理失败', selectable: false };
      });
      selected.clear();
      render();
      showToast('选中清零工单已处理为失败（原型）', 'success');
    }
    function readFilters(tab) {
      const values = {};
      root.querySelectorAll('[data-filter]').forEach(node => {
        values[node.dataset.filter] = node.multiple ? Array.from(node.selectedOptions).map(option => option.value.trim()).filter(Boolean).join(' ') : node.value.trim();
      });
      state.values[tab.id] = values;
    }
    function render() {
      const tab = activeTab();
      const hasTabs = tabs.filter(item => item.label).length > 1;
      const tabHtml = hasTabs ? `<div class="business-tabs" role="tablist">${tabs.filter(item => item.label).map(item => `<button type="button" class="business-tab${item.id === state.tab ? ' is-active' : ''}" data-tab="${esc(item.id)}">${esc(item.label)}</button>`).join('')}</div>` : '';
      const kpis = tab.kpis || config.kpis || [];
      const kpiHtml = kpis.length ? `<section class="kpi-grid" aria-label="${esc(tab.title || config.title || '统计')}">${kpis.map(item => `<div class="admin-card kpi-card"><p class="kpi-card__label">${esc(item.label)}</p><div class="kpi-card__value">${esc(item.value)}</div><p class="kpi-card__hint">${esc(item.hint || '')}</p></div>`).join('')}</section>` : '';
      const filterHtml = tab.filters?.length ? `<section class="admin-card filter-card"><div class="admin-card__body"><div class="filter-grid ${tab.filterClass || (tab.filters.length >= 5 ? 'cols-5' : tab.filters.length === 3 ? 'cols-3' : '')}">${tab.filters.map(field => fieldHtml(field, state.values[tab.id] || {})).join('')}<div class="filter-actions"><button class="btn btn-primary" type="button" data-action="search">${icon('search')}搜 索</button><button class="btn btn-default" type="button" data-action="reset">重 置</button></div></div></div></section>` : '';
      const actionHtml = (tab.actions || []).map(action => `<button type="button" class="btn ${action.primary ? 'btn-primary' : 'btn-default'}" data-action="${esc(action.id)}">${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const actionClass = action => action.danger ? 'btn-danger' : action.primary ? 'btn-primary' : 'btn-default';
      const leftActions = (tab.actions || []).filter(action => action.align !== 'right').map(action => `<button type="button" class="btn ${actionClass(action)}" data-action="${esc(action.id)}" data-action-label="${esc(action.label)}"${action.requiresSelection ? ' data-requires-selection' : ''}>${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const rightActions = (tab.actions || []).filter(action => action.align === 'right').map(action => `<button type="button" class="btn ${actionClass(action)}" data-action="${esc(action.id)}" data-action-label="${esc(action.label)}"${action.requiresSelection ? ' data-requires-selection' : ''}>${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const showOps = !tab.hideOperation;
      const columns = displayedColumns(tab);
      const selected = selectedSet(tab);
      const currentRows = rows(tab);
      const selectableRows = currentRows.map((row, index) => ({ row, index })).filter(item => item.row.selectable !== false);
      const tableRows = currentRows.map((row, index) => `<tr>${tab.selectable ? `<td class="select-cell"><input type="checkbox" data-select-row="${index}" aria-label="选择第 ${index + 1} 行"${selected.has(index) ? ' checked' : ''}${row.selectable === false ? ' disabled' : ''}></td>` : ''}${columns.map(column => renderCell(column, row)).join('')}${showOps ? `<td class="ops"><div class="command-group">${(row.ops || []).map(op => `<button type="button" class="btn btn-link${/解除|删除/.test(op) ? ' btn-link-danger' : ''}" data-row-action="${esc(op)}" data-row-index="${index}"${row.selectable === false ? ' disabled' : ''}>${esc(op)}</button>`).join('')}</div></td>` : ''}</tr>`).join('');
      const headers = columns.map(column => { const headerClass = [column.num ? 'num' : '', column.align === 'left' ? 'left' : ''].filter(Boolean).join(' '); return column.sort ? `<th class="${headerClass}"><button class="sort-trigger" type="button" data-sort="${esc(column.key)}">${esc(column.label)} ${icon(state.sort[tab.id]?.key === column.key && state.sort[tab.id]?.dir === 'desc' ? 'sort-down' : 'sort-up')}</button></th>` : `<th class="${headerClass}">${esc(column.label)}</th>`; }).join('');
      const selectHead = tab.selectable ? `<th class="select-cell"><input type="checkbox" data-select-all aria-label="选择全部"${selectableRows.length && selected.size === selectableRows.length ? ' checked' : ''}${selectableRows.length ? '' : ' disabled'}></th>` : '';
      const colgroup = `<colgroup>${tab.selectable ? '<col style="width:52px">' : ''}${columns.map(column => `<col style="width:${column.width || 160}px">`).join('')}${showOps ? `<col style="width:${tab.opsWidth || 180}px">` : ''}</colgroup>`;
      const colspan = columns.length + (tab.selectable ? 1 : 0) + (showOps ? 1 : 0);
      const footerNote = tab.footerNote ? `<div class="notice module-footer-note">${esc(tab.footerNote)}</div>` : '';
      const cardHeader = leftActions || rightActions ? `<div class="admin-card__header"><div class="command-bar command-bar--split"><div class="command-group command-group--primary">${leftActions}</div><div class="command-group command-group--secondary">${rightActions}</div></div></div>` : '';
      root.innerHTML = `<div class="admin-page module-page">${tabHtml}${kpiHtml}${filterHtml}${dimensionSelectorHtml(tab)}${chartsHtml(tab, config)}<section class="admin-card list-card">${cardHeader}<div class="table-scroll"><table class="admin-table admin-table--fixed" style="min-width:${currentTableMinWidth(tab, columns, showOps)}px">${colgroup}<thead><tr>${selectHead}${headers}${showOps ? '<th class="ops">操作</th>' : ''}</tr></thead><tbody>${tableRows || `<tr><td class="empty-state" colspan="${colspan}">暂无数据</td></tr>`}</tbody></table></div>${footerNote}<div class="pagination"><span>共 ${currentRows.length} 条记录</span><div class="pagination__actions"><button class="page-number" disabled>‹</button><button class="page-number is-active">1</button><button class="page-number" disabled>›</button></div></div><input type="file" data-file-upload hidden></section></div>`;
      root.querySelectorAll('[data-requires-selection]').forEach(button => { button.disabled = selected.size === 0; });
    }
    function handleRowAction(action, row) {
      const tab = activeTab();
      const modal = tab.modals?.[action] || config.modals?.[action];
      if (modal) {
        if (modal.type === 'offline-transfer-audit') state.processingRow = row;
        if (modal.type === 'monitor-follow') state.processingRow = row;
        if (/confirm/.test(modal.type || '')) {
          openModal(confirmModal(modal.title || action, modal.copy || `确认执行“${esc(action)}”？原型不会调用真实接口。`, modal.danger, modal.type));
          return;
        }
        openModal(formModal(modal, row));
        return;
      }
      if (/处理成功|媒体已完成/.test(action)) {
        state.processingRow = row;
        openModal(processResultModal(action, row));
        return;
      }
      if (/手动同步/.test(action)) { openModal(confirmModal('手动同步', `确认对 <strong>${esc(row.name || row.bmId || '当前 BM')}</strong> 触发手动同步？原型仅展示确认态，不会调用测试环境。`, false)); return; }
      if (/分配/.test(action)) { openModal(formModal({ title: '分配成员', fields: [{ key: 'email', label: 'User Email', placeholder: '请输入 User Email' }, { key: 'permission', label: '权限', control: 'select', options: ['管理员', '成员'], placeholder: '选择权限' }] }, row)); return; }
      if (/解除|删除|更新|标记内部|标记|编辑标记|编辑/.test(action)) { openModal(confirmModal(action, `确认对 <strong>${esc(row.email || row.accountName || row.pixelName || row.name || row.customerName || '当前记录')}</strong> 执行“${esc(action)}”？原型不会调用真实接口。`, /解除|删除/.test(action))); return; }
      openModal(detailModal(action, row, tab));
    }

    root.addEventListener('click', event => {
      const tabButton = event.target.closest('[data-tab]');
      if (tabButton) { state.tab = tabButton.dataset.tab; render(); return; }
      const actionButton = event.target.closest('[data-action]');
      if (actionButton) {
        const tab = activeTab();
        if (actionButton.dataset.action === 'search') { readFilters(tab); render(); showToast('已按当前条件更新列表（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'reset') { state.values[tab.id] = {}; state.sort[tab.id] = null; selectedSet(tab).clear(); render(); showToast('筛选条件已重置', 'info'); return; }
        if (actionButton.dataset.action === 'export') { showToast('导出任务已创建，可在导出中心查看进度（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'download-template') { showToast('已开始下载导入模版（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'custom-fields') { openModal(customFieldsModal(tab, fieldPref(tab))); return; }
        if (actionButton.dataset.action === 'upload') { const input = root.querySelector('[data-file-upload]'); if (input) { input.value = ''; input.click(); } showToast('请选择本地文件上传广告账号（原型）', 'info'); return; }
        if (actionButton.hasAttribute('data-requires-selection') && selectedSet(tab).size === 0) { showToast('请先勾选需要操作的广告账户', 'error'); return; }
        const actionLabel = actionButton.dataset.actionLabel || actionButton.textContent.trim();
        const modal = tab.modals?.[actionLabel] || config.modals?.[actionLabel];
        if (/confirm/.test(modal?.type || '')) openModal(confirmModal(modalTextWithSelection(modal.title, tab), modalTextWithSelection(modal.copy, tab), modal.danger, modal.type));
        else if (modal) openModal(formModal(modal, {}));
        else showToast(`${actionLabel}操作已触发（原型）`, 'success');
        return;
      }
      const rowAction = event.target.closest('[data-row-action]');
      if (rowAction) handleRowAction(rowAction.dataset.rowAction, rows(activeTab())[Number(rowAction.dataset.rowIndex)] || {});
      const sortButton = event.target.closest('[data-sort]');
      if (sortButton) { const tab = activeTab(); const key = sortButton.dataset.sort; const current = state.sort[tab.id]; state.sort[tab.id] = !current || current.key !== key ? { key, dir: 'asc' } : current.dir === 'asc' ? { key, dir: 'desc' } : null; render(); }
      const rowSelect = event.target.closest('[data-select-row]');
      if (rowSelect && !rowSelect.disabled) { const tab = activeTab(); const set = selectedSet(tab); const index = Number(rowSelect.dataset.selectRow); if (rowSelect.checked) set.add(index); else set.delete(index); render(); }
      const selectAll = event.target.closest('[data-select-all]');
      if (selectAll && !selectAll.disabled) { const tab = activeTab(); const set = selectedSet(tab); set.clear(); if (selectAll.checked) rows(tab).forEach((row, index) => { if (row.selectable !== false) set.add(index); }); render(); }
    });
    root.addEventListener('change', event => {
      const dimensionInput = event.target.closest('[data-dimension-group]');
      if (dimensionInput?.dataset.dimensionExclusive === 'true' && dimensionInput.checked) {
        root.querySelectorAll(`[data-dimension-group="${CSS.escape(dimensionInput.dataset.dimensionGroup)}"]`).forEach(input => {
          if (input !== dimensionInput) input.checked = false;
        });
      }
      if (event.target.closest('[data-file-upload]')) {
        const file = event.target.files?.[0];
        if (file) showToast(`已选择文件：${file.name}（原型）`, 'success');
      }
    });
    document.body.addEventListener('click', event => {
      const closeButton = event.target.closest('[data-modal-close]');
      if (closeButton) {
        const backdrop = closeButton.closest('.modal-backdrop');
        if (backdrop?.dataset.confirmAction === 'confirm-process-success' && state.pendingProcess) {
          const pending = state.pendingProcess;
          state.processingRow = pending.row;
          state.pendingProcess = null;
          closeModal();
          openModal(processResultModal(pending.action, pending.row));
          const input = document.querySelector('[data-process-amount]');
          if (input) input.value = pending.amount;
          return;
        }
        if (backdrop?.dataset.confirmAction === 'confirm-submit-adjustment') state.pendingAdjustment = null;
        if (backdrop?.querySelector('[data-process-modal]')) state.processingRow = null;
        if (backdrop?.querySelector('[data-offline-audit-modal]')) state.processingRow = null;
        if (backdrop?.querySelector('[data-monitor-follow-modal]')) state.processingRow = null;
        closeModal();
      }
      if (event.target.closest('[data-action-reset-fields]')) {
        const tab = activeTab();
        state.fields[tab.id] = defaultFieldPref(tab);
        render();
        refreshFieldDrawer(tab);
        showToast('列表字段已恢复默认', 'success');
      }
      if (event.target.closest('[data-field-confirm]')) { closeModal(); showToast('自定义字段已保存（原型）', 'success'); }
      if (event.target.closest('[data-modal-submit]')) {
        const backdrop = event.target.closest('.modal-backdrop');
        const tab = activeTab();
        if (backdrop?.dataset.confirmAction === 'confirm-submit-adjustment') {
          commitPendingAdjustment();
          return;
        }
        if (backdrop?.dataset.confirmAction === 'confirm-process-success') {
          commitPendingProcess();
          return;
        }
        if (backdrop?.dataset.confirmAction === 'confirm-remove-selected') {
          closeModal();
          removeSelectedRows(tab);
          return;
        }
        if (backdrop?.dataset.confirmAction === 'confirm-mark-failed') {
          closeModal();
          markSelectedRowsFailed(tab);
          return;
        }
        const assignModal = backdrop?.querySelector('[data-assign-modal]');
        if (assignModal) {
          if (submitAssignModal(assignModal, tab)) closeModal();
          return;
        }
        const adjustmentModal = backdrop?.querySelector('[data-adjustment-modal]');
        if (adjustmentModal) {
          if (submitAdjustmentModal(adjustmentModal, tab) === true) closeModal();
          return;
        }
        const processModal = backdrop?.querySelector('[data-process-modal]');
        if (processModal) {
          submitProcessModal(processModal);
          return;
        }
        const offlineAuditModal = backdrop?.querySelector('[data-offline-audit-modal]');
        if (offlineAuditModal) {
          const row = state.processingRow;
          if (!row) { closeModal(); showToast('未找到待审核记录', 'error'); return; }
          const nextStatus = offlineAuditModal.querySelector('[data-audit-status]')?.value || '成功';
          const amount = offlineAuditModal.querySelector('[data-audit-amount]')?.value.trim();
          const currency = offlineAuditModal.querySelector('[data-audit-currency]')?.value || row.payCurrency || 'USD';
          if (nextStatus === '成功' && !amount) { showToast('请输入入账金额', 'error'); return; }
          row.status = nextStatus;
          row.accountCurrency = nextStatus === '成功' ? currency : '-';
          row.accountAmount = nextStatus === '成功' ? amount : '-';
          row.auditAt = currentTimestamp();
          row.auditor = '管理员(admin@bestfulfill.com)';
          row.remark = offlineAuditModal.querySelector('[data-audit-remark]')?.value.trim() || (nextStatus === '成功' ? '审核通过，已入账' : '审核失败，等待客户重新提交');
          row.ops = ['查看详情', '查看凭证'];
          state.processingRow = null;
          closeModal();
          render();
          showToast(`线下转账已${nextStatus === '成功' ? '审核通过' : '审核失败'}（原型）`, nextStatus === '成功' ? 'success' : 'info');
          return;
        }
        const monitorFollowModalRoot = backdrop?.querySelector('[data-monitor-follow-modal]');
        if (monitorFollowModalRoot) {
          const tab = activeTab();
          const statusValue = monitorFollowModalRoot.querySelector('[data-monitor-follow-status]')?.value || 'in_progress';
          const statusLabel = statusValue;
          const remark = monitorFollowModalRoot.querySelector('[data-monitor-follow-remark]')?.value.trim() || '-';
          const time = currentTimestamp();
          const targets = state.processingRow ? [state.processingRow] : Array.from(selectedSet(tab)).map(index => rows(tab)[index]).filter(Boolean);
          if (!targets.length) { showToast('请先选择需要跟进的记录', 'error'); return; }
          targets.forEach(row => {
            row.followStatus = statusValue;
            row.followOwner = '管理员(admin@bestfulfill.com)';
            row.followAt = time;
            row.followRemark = remark;
            row.followHistory = [{ status: statusValue, statusLabel, owner: row.followOwner, at: time, remark }].concat(row.followHistory || []);
          });
          selectedSet(tab).clear();
          state.processingRow = null;
          closeModal();
          render();
          showToast(`已更新 ${targets.length} 条监控记录跟进状态（原型）`, 'success');
          return;
        }
        closeModal();
        showToast('操作已提交，列表将在成功后刷新（原型）', 'success');
      }
      if (event.target.closest('[data-recharge-query]')) {
        refreshRechargeModal(event.target.closest('[data-recharge-modal]'));
      }
      if (event.target.closest('[data-assign-query]')) {
        refreshAssignModal(event.target.closest('[data-assign-modal]'));
      }
      if (event.target.closest('[data-adjustment-query]')) {
        refreshAdjustmentModal(event.target.closest('[data-adjustment-modal]'));
      }
    });
    document.body.addEventListener('change', event => {
      const rechargeCustomer = event.target.closest('[data-recharge-customer]');
      if (rechargeCustomer) {
        const modalRoot = rechargeCustomer.closest('[data-recharge-modal]');
        modalRoot.querySelectorAll('[data-recharge-account]').forEach(input => { input.checked = false; });
        refreshRechargeModal(modalRoot);
        return;
      }
      const rechargeAccount = event.target.closest('[data-recharge-account]');
      if (rechargeAccount) {
        refreshRechargeAmounts(rechargeAccount.closest('[data-recharge-modal]'));
        return;
      }
      const adjustmentCustomer = event.target.closest('[data-adjustment-customer]');
      if (adjustmentCustomer) {
        const modalRoot = adjustmentCustomer.closest('[data-adjustment-modal]');
        modalRoot.querySelectorAll('[data-adjustment-account]').forEach(input => { input.checked = false; });
        refreshAdjustmentModal(modalRoot);
        return;
      }
      const adjustmentAccount = event.target.closest('[data-adjustment-account]');
      if (adjustmentAccount) {
        refreshAdjustmentAmounts(adjustmentAccount.closest('[data-adjustment-modal]'));
        return;
      }
      const toggle = event.target.closest('[data-field-toggle]');
      if (!toggle) return;
      const tab = activeTab();
      const pref = fieldPref(tab);
      if (toggle.checked) pref.visible.add(toggle.dataset.fieldToggle);
      else pref.visible.delete(toggle.dataset.fieldToggle);
      if (pref.visible.size === 0) {
        pref.visible.add(toggle.dataset.fieldToggle);
        toggle.checked = true;
        showToast('至少保留一个列表字段', 'error');
        return;
      }
      render();
      refreshFieldDrawer(tab);
    });
    document.body.addEventListener('input', event => {
      if (event.target.closest('[data-recharge-account-search]')) refreshRechargeModal(event.target.closest('[data-recharge-modal]'));
      if (event.target.closest('[data-recharge-amount-input]')) recalculateRechargeAmounts(event.target.closest('[data-recharge-modal]'));
      if (event.target.closest('[data-assign-account-search]')) refreshAssignModal(event.target.closest('[data-assign-modal]'));
      if (event.target.closest('[data-adjustment-account-search]')) refreshAdjustmentModal(event.target.closest('[data-adjustment-modal]'));
      if (event.target.closest('[data-adjustment-amount-input]')) recalculateAdjustmentAmounts(event.target.closest('[data-adjustment-modal]'));
    });
    document.body.addEventListener('dragstart', event => {
      const item = event.target.closest('[data-field-key]');
      if (!item) return;
      state.dragFieldKey = item.dataset.fieldKey;
      item.classList.add('is-dragging');
      event.dataTransfer?.setData('text/plain', state.dragFieldKey);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });
    document.body.addEventListener('dragend', event => {
      const item = event.target.closest('[data-field-key]');
      item?.classList.remove('is-dragging');
      state.dragFieldKey = null;
    });
    document.body.addEventListener('dragover', event => {
      if (event.target.closest('[data-field-key]')) event.preventDefault();
    });
    document.body.addEventListener('drop', event => {
      const target = event.target.closest('[data-field-key]');
      const sourceKey = state.dragFieldKey || event.dataTransfer?.getData('text/plain');
      if (!target || !sourceKey || sourceKey === target.dataset.fieldKey) return;
      event.preventDefault();
      const tab = activeTab();
      const pref = fieldPref(tab);
      const order = pref.order.filter(key => key !== sourceKey);
      const targetIndex = order.indexOf(target.dataset.fieldKey);
      order.splice(targetIndex < 0 ? order.length : targetIndex, 0, sourceKey);
      pref.order = order;
      state.dragFieldKey = null;
      render();
      refreshFieldDrawer(tab);
      showToast('列表字段顺序已调整（原型）', 'success');
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
