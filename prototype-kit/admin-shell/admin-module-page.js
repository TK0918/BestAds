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
  const countWithUnit = value => {
    const text = asText(value);
    return text === '-' ? '<span class="muted">-</span>' : `${esc(text)} 个`;
  };
  const builtInFormatters = { countWithUnit };
  const person = value => `<span class="person-cell">${esc(asText(value))}</span>`;
  const longText = value => `<span class="wrap">${esc(asText(value))}</span>`;
  const helpTip = text => {
    const content = String(text || '').trim();
    return content ? `<span class="admin-help-tip" tabindex="0" role="img" aria-label="${esc(content)}" title="${esc(content)}" data-tooltip="${esc(content)}">${icon('question-circle')}</span>` : '';
  };
  const fieldLabel = (field, required) => `${esc(field.label)}${helpTip(field.help)}${required ? ' <span style="color:var(--admin-danger)">*</span>' : ''}`;
  let runtimeState = null;

  function formatterByName(name) {
    return (window.BESTADS_ADMIN_FORMATTERS && window.BESTADS_ADMIN_FORMATTERS[name]) || builtInFormatters[name];
  }

  function renderValue(column, row) {
    const value = row[column.key];
    if (column.format) return column.format(value, row);
    if (column.formatter) {
      const formatter = formatterByName(column.formatter);
      if (typeof formatter === 'function') return formatter(value, row);
    }
    return esc(asText(value));
  }

  function formatMoney(value, currency) {
    const amount = Number(value || 0);
    return `${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'USD'}`;
  }
  function formatAmountOnly(value) {
    return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function numAmount(value) {
    const normalized = String(value == null ? '' : value).replace(/,/g, '').replace(/[^\d.-]/g, '').trim();
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
  }
  function bindCardId(row) { return row?.cardId || row?.c13 || ''; }
  function bindCardLast4(row) { return row?.cardLast4 || row?.c14 || '-'; }
  function bindCardStatus(row) { return row?.verifyStatus || row?.c22 || '未申请'; }
  function bindCardCardStatus(row) { return row?.cardStatus || row?.c19 || '正常'; }
  function bindCardVerifyAmount(row) { return numAmount(row?.verifyAmount || row?.c21); }
  function bindCardPreVerifyLimit(row) { return numAmount(row?.preVerifyLimit) || 1; }
  function bindCardTotalLimit(row) { return numAmount(row?.c16); }
  function bindCardUsedAmount(row) { return numAmount(row?.c17); }
  function bindCardAvailableAmount(row) { return numAmount(row?.c18); }
  function bindCardIsCardRow(row) { const id = bindCardId(row); return Boolean(id && id !== '-'); }
  function bindCardBlockedStatus(statusText) { return /待审批|审批中|抬额中|抬额失败|待验卡/.test(String(statusText || '')); }
  function bindCardUnrecoveredStatus(statusText) { return /已验卡|已充值关单|回收失败/.test(String(statusText || '')); }
  function bindCardTransferLimit(row) {
    if (!row || row.canTransfer === false) return 0;
    const total = bindCardTotalLimit(row);
    const available = bindCardAvailableAmount(row);
    return Math.max(0, Math.min(available, total - 1));
  }
  function canBindCardTransfer(row) {
    return bindCardIsCardRow(row)
      && row.canTransfer !== false
      && bindCardCardStatus(row) === '正常'
      && !bindCardBlockedStatus(bindCardStatus(row))
      && bindCardTransferLimit(row) > 0;
  }
  function bindCardCardsForRow(row) {
    const direct = (row?.children || []).filter(bindCardIsCardRow);
    if (direct.length) return direct;
    return (row?._treeParent?.children || []).filter(bindCardIsCardRow);
  }
  function bindCardTransferOption(row) {
    const statusText = bindCardStatus(row);
    const limit = bindCardTransferLimit(row);
    const verifyAmount = bindCardVerifyAmount(row);
    return {
      value: bindCardId(row),
      label: `${bindCardId(row)}(${bindCardLast4(row)})｜${statusText}｜可转 ${formatMoney(limit, row?.c15 || 'USD')}`,
      max: limit,
      status: statusText,
      verifyAmount
    };
  }
  function bindCardTransferFromOptions(row) {
    const cards = bindCardCardsForRow(row).filter(canBindCardTransfer);
    if (cards.length) return cards.map(bindCardTransferOption);
    return (row?.transferFromOptions || []).map(option => typeof option === 'string' ? { value: option, label: option, max: numAmount(option), status: '-' } : option);
  }
  function bindCardTransferToOptions(row, excludeValue = '') {
    const cards = bindCardCardsForRow(row).filter(card => bindCardIsCardRow(card) && bindCardCardStatus(card) === '正常' && !bindCardBlockedStatus(bindCardStatus(card)) && bindCardId(card) !== excludeValue);
    if (cards.length) return cards.map(card => ({ value: bindCardId(card), label: `${bindCardId(card)}(${bindCardLast4(card)})｜${bindCardStatus(card)}｜可用 ${formatMoney(bindCardAvailableAmount(card), card.c15 || 'USD')}`, status: bindCardStatus(card) }));
    return (row?.transferToOptions || []).map(option => typeof option === 'string' ? { value: option, label: option, status: '-' } : option).filter(option => option.value !== excludeValue);
  }
  function bindCardTransferWarning(row) {
    if (row?.transferWarning) return row.transferWarning;
    const statusText = bindCardStatus(row);
    if (!bindCardUnrecoveredStatus(statusText)) return '';
    const verifyAmount = bindCardVerifyAmount(row);
    return `该卡验卡额度状态为「${statusText}」，仍存在未回收验卡额度${verifyAmount ? ` ${formatMoney(verifyAmount, row?.c15 || 'USD')}` : ''}。转出前请确认媒体退款和 Slash 可用额度，系统只强提醒，不硬拦截。`;
  }
  function rechargeBlockedStatus(statusText) {
    return /待审批|审批中|抬额中|抬额失败|待验卡/.test(String(statusText || ''));
  }

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

    'meta-assignment-audit': {
      title: '资产分配核对',
      subtitle: '把 Meta 侧「账户 → User → 商户ID」与 BestAds 侧「账户 → 系统归属商户」逐条比对，自动判定一致性。',
      kpis: [
        { label: '匹配正常', value: '2', hint: 'Meta 商户ID = 系统商户ID' },
        { label: '匹配异常', value: '1', hint: 'User 商户与账户归属不一致' },
        { label: '待确认', value: '2', hint: 'User 未设身份或系统侧无归属' },
        { label: 'Meta待分配', value: '2', hint: '系统有归属但 Meta 缺少商户 User' },
        { label: '已跳过', value: '2', hint: '内部人员不参与商户核对' }
      ],
      filters: [
        { key: 'bm', label: '所属 BM', type: 'select', options: ['电商集团 BM', '游戏出海 BM', '品牌广告 BM'], placeholder: '全部' },
        { key: 'accountKeyword', label: '广告账户', placeholder: '账户名 / act_id' },
        { key: 'result', label: '匹配结果', type: 'select', options: ['正常', '异常', '待确认', 'Meta待分配'], placeholder: '全部' },
        { key: 'userKeyword', label: 'User', placeholder: '姓名 / email' }
      ],
      actions: [{ id: 'export', label: '导出数据', icon: 'download', primary: true }],
      filterClass: 'cols-5',
      tableMinWidth: 1580,
      opsWidth: 120,
      columns: [
        { key: 'bm', label: '所属 BM', align: 'left', width: 180 },
        { key: 'accountName', label: '广告账户', align: 'left', width: 220 },
        { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
        { key: 'userName', label: 'User', align: 'left', width: 140 },
        { key: 'userEmail', label: 'User Email', align: 'left', width: 230 },
        { key: 'metaMerchantId', label: 'Meta 商户ID', width: 130 },
        { key: 'systemMerchantId', label: '系统商户ID', width: 130 },
        { key: 'lastSyncAt', label: '上次同步', width: 170 },
        { key: 'result', label: '匹配结果', format: status, width: 120 },
        { key: 'reason', label: '原因', align: 'left', width: 240, format: longText }
      ],
      rows: [
        { bm: '电商集团 BM', accountKeyword: 'EC-US-01 广告账户 act_102938475', accountName: 'EC-US-01 广告账户', accountId: 'act_102938475', userKeyword: '张伟 zhang.wei@corp.com', userName: '张伟', userEmail: 'zhang.wei@corp.com', metaMerchantId: '10086', systemMerchantId: '10086', lastSyncAt: '2026-06-18 03:00', result: '正常', reason: '-', ops: ['详情'] },
        { bm: '电商集团 BM', accountKeyword: 'EC-EU-02 广告账户 act_102938476', accountName: 'EC-EU-02 广告账户', accountId: 'act_102938476', userKeyword: '王芳 wang.fang@corp.com', userName: '王芳', userEmail: 'wang.fang@corp.com', metaMerchantId: '10090', systemMerchantId: '10086', lastSyncAt: '2026-06-18 03:00', result: '异常', reason: 'User 商户 ≠ 系统归属', ops: ['详情'] },
        { bm: '品牌广告 BM', accountKeyword: 'BRAND-CN 广告账户 act_384756102', accountName: 'BRAND-CN 广告账户', accountId: 'act_384756102', userKeyword: 'John Lee john.lee@corp.com', userName: 'John Lee', userEmail: 'john.lee@corp.com', metaMerchantId: '10120', systemMerchantId: '10120', lastSyncAt: '2026-06-18 03:00', result: '正常', reason: '-', ops: ['详情'] },
        { bm: '品牌广告 BM', accountKeyword: 'BRAND-CN 广告账户 act_384756102', accountName: 'BRAND-CN 广告账户', accountId: 'act_384756102', userKeyword: '陈静 chen.jing@corp.com', userName: '陈静', userEmail: 'chen.jing@corp.com', metaMerchantId: '未设身份', systemMerchantId: '10120', lastSyncAt: '2026-06-18 03:00', result: '待确认', reason: 'User 未设身份', ops: ['详情'] },
        { bm: '游戏出海 BM', accountKeyword: 'GAME-SEA 广告账户 act_209384756', accountName: 'GAME-SEA 广告账户', accountId: 'act_209384756', userKeyword: '王芳 wang.fang@corp.com', userName: '王芳', userEmail: 'wang.fang@corp.com', metaMerchantId: '10090', systemMerchantId: '系统无归属', lastSyncAt: '2026-06-18 03:00', result: '待确认', reason: '系统侧无归属商户', ops: ['详情'] },
        { bm: '—', accountKeyword: 'act_555666777', accountName: 'act_555666777', accountId: 'act_555666777', userKeyword: '—', userName: '—', userEmail: '—', metaMerchantId: '未分配', systemMerchantId: '10090', lastSyncAt: '2026-06-18 03:00', result: 'Meta待分配', reason: 'Meta待分配/已分配但User未指向商户ID', ops: ['详情'] },
        { bm: '电商集团 BM', accountKeyword: 'EC-INTERNAL 广告账户 act_998877665', accountName: 'EC-INTERNAL 广告账户', accountId: 'act_998877665', userKeyword: '—', userName: '—', userEmail: '—', metaMerchantId: '内部人员跳过', systemMerchantId: '10150', lastSyncAt: '2026-06-18 03:00', result: 'Meta待分配', reason: 'Meta 侧仅分配内部人员，缺少指向商户ID的 User', ops: ['详情'] }
      ],
      footerNote: '核对口径：内部人员跳过不核对；User 未设身份或系统侧无归属标记为待确认；系统有归属但 Meta 无对应商户 User 标记为 Meta待分配。'
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
    const config = (window.BESTADS_ADMIN_MODULE_CONFIGS && window.BESTADS_ADMIN_MODULE_CONFIGS[key]) || configs[key];
    if (config) return config;
    console.error('[admin-module-page] missing page config for', key);
    return { title: '页面配置缺失', filters: [], columns: [], rows: [], actions: [] };
  }

  function fieldHtml(field, values) {
    const value = values[field.key] || field.value || '';
    if (field.type === 'select') return `<div class="filter-field"><label>${esc(field.label)}</label><select data-filter="${esc(field.key)}"><option value="">${esc(field.placeholder || '全部')}</option>${(field.options || []).map(v => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(v)}</option>`).join('')}</select></div>`;
    if (field.type === 'multiselect') {
      const selected = String(value || '').split('||').filter(Boolean);
      const selectedSet = new Set(selected);
      const buttonText = selected.length ? `${selected[0]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}` : (field.placeholder || `选择${field.label}`);
      return `<div class="filter-field filter-field--multi" data-multiselect><label>${esc(field.label)}</label><input type="hidden" data-filter="${esc(field.key)}" value="${esc(selected.join('||'))}"><button type="button" class="multi-select-trigger" data-multiselect-toggle><span data-multiselect-label>${esc(buttonText)}</span>${icon('chevron-down')}</button><div class="multi-select-menu" data-multiselect-menu>${(field.options || []).map(v => `<label class="multi-select-option"><input type="checkbox" data-multiselect-option value="${esc(v)}"${selectedSet.has(v) ? ' checked' : ''}><span>${esc(v)}</span></label>`).join('')}</div></div>`;
    }
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

  function parseMatchTokens(value) {
    return String(value || '').split(/[、/|,，\s]+/).map(item => item.trim()).filter(Boolean);
  }

  function modalMultiselectLabel(selected, placeholder, allOption) {
    if (!selected.length) return placeholder || '请选择';
    if (allOption && selected.includes(allOption)) return allOption;
    return selected.length === 1 ? selected[0] : `${selected[0]} +${selected.length - 1}`;
  }

  function modalMultiselectControl(field, value) {
    const allOption = field.allOption || '';
    const tokens = parseMatchTokens(value);
    const selected = tokens.includes(allOption) ? [allOption] : tokens;
    const selectedSet = new Set(selected);
    const placeholder = field.placeholder || `选择${field.label}`;
    const join = field.join || ' / ';
    const options = field.options || [];
    return `<div class="form-multiselect" data-multiselect data-all-option="${esc(allOption)}" data-join="${esc(join)}" data-placeholder="${esc(placeholder)}"><input type="hidden" name="${esc(field.key)}" value="${esc(selected.includes(allOption) ? allOption : selected.join(join))}"><button type="button" class="multi-select-trigger" data-multiselect-toggle><span data-multiselect-label>${esc(modalMultiselectLabel(selected, placeholder, allOption))}</span>${icon('chevron-down')}</button><div class="multi-select-menu" data-multiselect-menu>${options.map(option => `<label class="multi-select-option"><input type="checkbox" data-multiselect-option value="${esc(option)}"${selectedSet.has(option) ? ' checked' : ''}><span>${esc(option)}</span></label>`).join('')}</div></div>`;
  }

  function syncModalMultiselect(fieldRoot, changedInput) {
    if (!fieldRoot) return;
    const allOption = fieldRoot.dataset.allOption || '';
    const boxes = Array.from(fieldRoot.querySelectorAll('[data-multiselect-option]'));
    if (allOption && changedInput) {
      if (changedInput.value === allOption && changedInput.checked) {
        boxes.forEach(box => { if (box !== changedInput) box.checked = false; });
      } else if (changedInput.value !== allOption && changedInput.checked) {
        const allBox = boxes.find(box => box.value === allOption);
        if (allBox) allBox.checked = false;
      }
    }
    const selected = boxes.filter(box => box.checked).map(box => box.value);
    const nextValue = selected.includes(allOption) ? allOption : selected.join(fieldRoot.dataset.join || ' / ');
    const hidden = fieldRoot.querySelector('input[type="hidden"][name]');
    const label = fieldRoot.querySelector('[data-multiselect-label]');
    if (hidden) hidden.value = nextValue;
    if (label) label.textContent = modalMultiselectLabel(selected.includes(allOption) ? [allOption] : selected, fieldRoot.dataset.placeholder, allOption);
  }

  function openingBudgetText(value) {
    return String(value == null ? '' : value).trim();
  }

  function openingBudgetMode(row) {
    const min = openingBudgetText(row?.minDailyBudget);
    const max = openingBudgetText(row?.maxDailyBudget);
    if (max) return 'range';
    if (min && Number(min) > 0) return 'min';
    return 'unlimited';
  }

  function openingRuleCurrencySuffix(row) {
    const text = openingBudgetText(row?.currency);
    if (!text || text === '不限') return '';
    return ` ${text}`;
  }

  function formatOpeningBudgetRange(row) {
    const min = openingBudgetText(row?.minDailyBudget);
    const max = openingBudgetText(row?.maxDailyBudget);
    const suffix = openingRuleCurrencySuffix(row);
    if (!max && (!min || Number(min) === 0)) return '不限';
    if (min && !max) return `${min} 以上${suffix}`;
    return `${min || '0'} ~ ${max}${suffix}`;
  }

  function isOpeningBudgetNumber(value) {
    return /^\d+(\.\d+)?$/.test(openingBudgetText(value));
  }

  function readOpeningBudgetRange(root) {
    const box = root?.matches?.('[data-budget-range]') ? root : root?.querySelector?.('[data-budget-range]');
    const mode = box?.querySelector('[data-budget-mode]')?.value || 'unlimited';
    let min = openingBudgetText(box?.querySelector('[data-budget-min]')?.value);
    let max = openingBudgetText(box?.querySelector('[data-budget-max]')?.value);
    if (mode === 'unlimited') {
      min = '';
      max = '';
    } else if (mode === 'min') {
      max = '';
    }
    return { mode, min, max };
  }

  function budgetRangeControl(field, row) {
    const mode = openingBudgetMode(row);
    const min = mode === 'unlimited' ? '' : openingBudgetText(row?.minDailyBudget);
    const max = mode === 'range' ? openingBudgetText(row?.maxDailyBudget) : '';
    return `<div class="budget-range" data-budget-range><select class="budget-range__mode" data-budget-mode aria-label="${esc(field.label || '日预算范围')}"><option value="unlimited"${mode === 'unlimited' ? ' selected' : ''}>不限</option><option value="min"${mode === 'min' ? ' selected' : ''}>指定金额以上</option><option value="range"${mode === 'range' ? ' selected' : ''}>准确区间</option></select><div class="budget-range__inputs" data-budget-inputs${mode === 'unlimited' ? ' hidden' : ''}><input name="minDailyBudget" data-budget-min type="text" inputmode="decimal" placeholder="${mode === 'range' ? '下限，如 0' : '例如 200'}" value="${esc(min)}"><span class="budget-range__suffix" data-budget-min-suffix${mode === 'min' ? '' : ' hidden'}>以上</span><span class="budget-range__suffix" data-budget-range-sep${mode === 'range' ? '' : ' hidden'}>~</span><input name="maxDailyBudget" data-budget-max type="text" inputmode="decimal" placeholder="上限" value="${esc(max)}"${mode === 'range' ? '' : ' hidden'}></div></div>`;
  }

  function syncOpeningBudgetRange(root) {
    const box = root?.matches?.('[data-budget-range]') ? root : root?.querySelector?.('[data-budget-range]');
    if (!box) return;
    const mode = box.querySelector('[data-budget-mode]')?.value || 'unlimited';
    const inputs = box.querySelector('[data-budget-inputs]');
    const minInput = box.querySelector('[data-budget-min]');
    const maxInput = box.querySelector('[data-budget-max]');
    const minSuffix = box.querySelector('[data-budget-min-suffix]');
    const rangeSep = box.querySelector('[data-budget-range-sep]');
    if (inputs) inputs.hidden = mode === 'unlimited';
    if (minSuffix) minSuffix.hidden = mode !== 'min';
    if (rangeSep) rangeSep.hidden = mode !== 'range';
    if (maxInput) {
      maxInput.hidden = mode !== 'range';
      if (mode !== 'range') maxInput.value = '';
    }
    if (minInput) {
      minInput.placeholder = mode === 'range' ? '下限，如 0' : '例如 200';
      if (mode === 'unlimited') minInput.value = '';
    }
  }

  function modalControl(field, value, row) {
    const control = field.control || 'text';
    if (control === 'textarea') return `<textarea name="${esc(field.key)}"${field.maxLength ? ` maxlength="${esc(field.maxLength)}"` : ''} placeholder="${esc(field.placeholder || '')}">${esc(value || '')}</textarea>`;
    if (control === 'readonly') return `<input name="${esc(field.key)}" type="text" value="${esc(value || field.value || '')}" readonly aria-readonly="true">`;
    if (control === 'customer-select' || control === 'role-select' || control === 'status-select') return `<select name="${esc(field.key)}"><option value="">${esc(field.placeholder || '请选择')}</option>${(field.options || []).map(option => `<option value="${esc(option)}"${String(option) === String(value || '') ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
    if (control === 'select') return `<select name="${esc(field.key)}"><option value="">${esc(field.placeholder || '请选择')}</option>${(field.options || []).map(option => `<option value="${esc(option)}"${String(option) === String(value || '') ? ' selected' : ''}>${esc(option)}</option>`).join('')}</select>`;
    if (control === 'multiselect') return modalMultiselectControl(field, value);
    if (control === 'budget-range') return budgetRangeControl(field, row);
    if (control === 'password') return `<input name="${esc(field.key)}" type="password" placeholder="${esc(field.placeholder || '')}" value="${esc(value || '')}">`;
    if (control === 'refund-preview') {
      const total = bindCardTotalLimit(row);
      const used = bindCardUsedAmount(row);
      const available = bindCardAvailableAmount(row);
      const verifyAmount = bindCardVerifyAmount(row);
      const preLimit = bindCardPreVerifyLimit(row);
      const hasRecharge = row?.hasRechargeAfterVerify || /已充值关单/.test(bindCardStatus(row));
      const targetTotal = hasRecharge ? Math.max(preLimit, total - verifyAmount) : preLimit;
      const blocked = verifyAmount > 0 && available < verifyAmount;
      const items = [
        ['卡ID', `${bindCardId(row)}(${bindCardLast4(row)})`],
        ['当前总额度', formatMoney(total, row?.c15 || 'USD')],
        ['当前已用额度', formatMoney(used, row?.c15 || 'USD')],
        ['当前可用额度', formatMoney(available, row?.c15 || 'USD')],
        ['验卡申请额度', verifyAmount ? formatMoney(verifyAmount, row?.c15 || 'USD') : '-'],
        ['回收后总额度', formatMoney(targetTotal, row?.c15 || 'USD')]
      ];
      return `<div class="readonly-context">${items.map(([label, itemValue]) => `<div><dt>${esc(label)}</dt><dd>${esc(itemValue)}</dd></div>`).join('')}</div><div class="notice ${blocked ? 'notice--danger' : 'notice--success'}">${blocked ? '可用额度不足以回收：当前可用额度小于验卡申请额度，本次确认会被拦截并标记为回收失败。' : '预检通过：确认后不走飞书审批，系统会调 Fund 回收验卡临时额度。'}</div>`;
    }
    if (control === 'transfer-card-select') {
      const isFrom = field.key === 'fromCard';
      const defaultFrom = runtimeState?.processingAction === '转出额度' ? bindCardId(row) : '';
      const options = isFrom ? bindCardTransferFromOptions(row) : bindCardTransferToOptions(row, defaultFrom);
      const selectedValue = isFrom ? (value || defaultFrom) : value;
      const attr = isFrom ? 'data-transfer-from' : 'data-transfer-to';
      return `<select name="${esc(field.key)}" ${attr}><option value="">${esc(field.placeholder || '请选择')}</option>${options.map(option => `<option value="${esc(option.value || option.label)}" data-max="${esc(option.max || 0)}" data-status="${esc(option.status || '')}" data-verify-amount="${esc(option.verifyAmount || 0)}"${String(option.value || option.label) === String(selectedValue || '') ? ' selected' : ''}>${esc(option.label || option.value)}</option>`).join('')}</select>`;
    }
    if (control === 'transfer-warning') {
      const warning = bindCardTransferWarning(row);
      return warning ? `<div class="notice notice--warning" data-transfer-warning>${esc(warning)}</div>` : '<div class="notice" data-transfer-warning>转出卡无未回收验卡额度提醒。系统仍会校验同账户、正常卡、可转上限和 $1 底线。</div>';
    }
    if (control === 'account-search') {
      const options = field.options || [];
      return `<div class="account-search-picker" data-account-picker><input type="search" data-account-picker-search placeholder="${esc(field.placeholder || '输入广告账户ID或名称搜索')}"><div class="account-search-results">${options.map(option => `<label class="account-search-option" data-account-picker-option data-account-key="${esc(String(option).toLowerCase())}"><input type="radio" name="${esc(field.key)}" value="${esc(option)}"><span>${esc(option)}</span></label>`).join('')}</div></div>`;
    }
    if (control === 'checkbox' || control === 'account-multi-select') return `<div class="account-check-list">${(field.options || []).map((option, index) => `<label class="account-check"><input type="checkbox" name="${esc(field.key)}" value="${esc(option)}" ${String(value || '').includes(option) ? 'checked' : ''}><span>${esc(option)}</span></label>`).join('')}</div>`;
    if (control === 'upload') return `<div class="upload-dropzone" data-upload-zone data-upload-max="${esc(field.max || 10)}" tabindex="0"><input type="file" name="${esc(field.key)}" data-upload-input hidden multiple accept="${esc(field.accept || 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip')}"><div class="upload-dropzone__icon">${icon('cloud-upload-alt')}</div><div class="upload-dropzone__copy"><strong>${esc(field.placeholder || '拖拽文件到此处，或点击上传')}</strong><span>支持直接粘贴、本地上传、拖拽上传；最多 ${esc(field.max || 10)} 个文件。</span></div><button class="btn btn-default" type="button" data-upload-browse>选择文件</button><ul class="upload-file-list" data-upload-list></ul></div>`;
    if (control === 'card-context') {
      const items = [
        ['媒体', row?.media || row?.c1],
        ['广告账户', `${row?.accountName || row?.c3 || '-'} / ${row?.accountId || row?.c2 || '-'}`],
        ['商户 / 客户', `${row?.merchantId || row?.c4 || '-'} / ${row?.customerName || row?.c5 || '-'}`],
        ['卡ID', row?.cardId || row?.c13],
        ['卡后四位', row?.cardLast4 || row?.c14],
        ['卡额度', `总额 ${row?.c16 || '-'}，已用 ${row?.c17 || '-'}，可用 ${row?.c18 || '-'}`],
        ['当前验卡额度状态', row?.verifyStatus || row?.c22]
      ];
      return `<div class="readonly-context">${items.map(([label, itemValue]) => `<div><dt>${esc(label)}</dt><dd>${esc(asText(itemValue))}</dd></div>`).join('')}</div>`;
    }
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
    if (modal?.type === 'card-secret') return cardSecretModal(modal, row);
    if (modal?.type === 'opening-audit') return openingAuditModal(modal, row);
    if (modal?.type === 'opening-result' || modal?.type === 'opening-result-success' || modal?.type === 'opening-result-failed') return openingResultModal(modal, row);
    if (modal?.type === 'opening-cancel') return openingCancelModal(modal, row);
    if (modal?.type === 'opening-reopen') return openingReopenModal(modal, row);
    if (modal?.type === 'opening-rule-config') return openingRuleConfigModal(modal, row);
    if (modal?.type === 'opening-fee-config') return openingFeeConfigModal(modal);
    if (modal?.type === 'opening-apply-create') return openingApplyCreateModal(modal);
    if (modal?.type === 'opening-email-preview') return openingEmailPreviewModal(modal);
    if (modal?.type === 'batch-debit') return batchDebitModal(modal);
    const fields = modal?.fields || [];
    const transferAttrs = fields.some(field => /transfer-card-select|transfer-warning/.test(field.control || '')) ? ' data-transfer-modal' : '';
    const hasRow = row && Object.keys(row).length > 0;
    const sizeClass = modal?.size === 'lg' ? ' modal-lg' : modal?.size === 'md' ? ' modal-md' : '';
    const backdropAttr = modal?.backdropAttr ? ` ${modal.backdropAttr}` : '';
    return `<div class="modal-backdrop"${backdropAttr}><section class="modal${sizeClass}"><div class="modal__header"><h2 class="modal__title">${esc(modal?.title || '操作')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid"${transferAttrs}>${fields.map(field => { const required = hasRow && field.editRequired !== undefined ? field.editRequired : field.required !== false; return `<div class="form-field${field.full ? ' full' : ''}"><label>${fieldLabel(field, required)}</label>${modalControl(field, row?.[field.key], row)}${field.help ? `<p class="field-help">${esc(field.help)}</p>` : ''}</div>`; }).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function offlineTransferAuditModal(modal, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '线下转账审核')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">原型只更新本地列表状态，不会提交测试环境数据。</div><div class="detail-grid"><div><dt>转账单号</dt><dd>${esc(row.orderId || '-')}</dd></div><div><dt>客户</dt><dd>${esc(row.customerName || '-')}（商户ID: ${esc(row.merchantId || '-')}）</dd></div><div><dt>支付平台</dt><dd>${esc(row.platform || '-')}</dd></div><div><dt>支付金额</dt><dd>${esc(row.payAmount || '-')} ${esc(row.payCurrency || '')}</dd></div></div><div class="form-grid" data-offline-audit-modal><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 入账币种</label><select data-audit-currency><option value="USD"${row.accountCurrency === 'USD' ? ' selected' : ''}>USD</option><option value="EUR"${row.accountCurrency === 'EUR' ? ' selected' : ''}>EUR</option><option value="HKD"${row.accountCurrency === 'HKD' ? ' selected' : ''}>HKD</option></select></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 入账金额</label><input data-audit-amount inputmode="decimal" placeholder="请输入入账金额" value="${esc(row.accountAmount && row.accountAmount !== '-' ? row.accountAmount : row.payAmount || '')}"></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 审核结果</label><select data-audit-status><option value="成功">审核通过</option><option value="失败">审核失败</option></select></div><div class="form-field full"><label>备注</label><textarea data-audit-remark placeholder="请输入审核备注">${esc(row.remark && row.remark !== '-' ? row.remark : '')}</textarea></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function receiptPreviewModal(modal, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '查看凭证')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="detail-grid"><div><dt>支付平台</dt><dd>${esc(row.platform || '-')}</dd></div><div><dt>平台支付ID</dt><dd>${esc(row.platformPayId || '-')}</dd></div><div><dt>支付金额</dt><dd>${esc(row.payAmount || '-')} ${esc(row.payCurrency || '')}</dd></div><div><dt>凭证文件</dt><dd>${esc(row.receiptFile || row.attachment || '-')}</dd></div></div><div class="receipt-preview-box"><div class="receipt-preview-box__icon">${icon('file-invoice-dollar')}</div><div><strong>支付凭证预览</strong><p>这里展示客户上传的银行转账、水单或第三方支付截图。原型使用脱敏 Fixture，不加载真实附件。</p></div></div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function openingRuleConfigModal(modal, row) {
    const source = row && Object.keys(row).length ? row : { status: '启用', priority: '50', currency: 'USD' };
    const fields = modal.fields || [];
    const form = fields.map(field => {
      const required = field.required !== false;
      return `<div class="form-field${field.full ? ' full' : ''}"><label>${fieldLabel(field, required)}</label>${modalControl(field, source?.[field.key], source)}</div>`;
    }).join('');
    const mode = modal.mode || 'edit';
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '账户规则')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid" data-opening-rule-config-modal data-rule-mode="${esc(mode)}">${form}<div class="form-field full"><label>单账户费用预览</label><div class="opening-rule-preview opening-rule-preview--compact" data-rule-config-preview><div><span>最低首充金额</span><strong data-rule-preview-base>-</strong></div><p data-rule-preview-note>-</p></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>${mode === 'copy' ? '确认复制' : mode === 'create' ? '确认新增' : '保存'}</button></div></section></div>`;
  }

  function openingFeeHelpers() {
    return window.BESTADS_OPENING_FEE_HELPERS || {
      siteFee: () => ({ amount: 30, currency: 'USD' }),
      merchantStatus: () => '已收取',
      quoteForMerchant: () => ({ status: '已收取', amount: 0, currency: 'USD' }),
      markCharged() {},
      formatAmount: (amount) => `${Number(amount || 0).toFixed(2)} USD`,
      currentLabel: () => '当前开户费：30.00 USD'
    };
  }

  function openingFeeRecordLabel(amount, applyId, suffix) {
    if (!(Number(amount) > 0)) return '无开户费';
    return `FEE-${applyId || 'AO'}${suffix ? ` ${suffix}` : ''}`;
  }

  function syncOpeningFeeStatusOnRows(rows, merchantId) {
    const status = openingFeeHelpers().merchantStatus(merchantId);
    (rows || []).forEach(item => {
      if (String(item?.merchantId) === String(merchantId)) item.openingFeeStatus = status;
    });
  }

  function openingFeeConfigModal(modal) {
    const fee = openingFeeHelpers().siteFee();
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '修改开户费')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="form-grid" data-opening-fee-config-modal><div class="form-field full"><p class="field-help">只影响之后「未收取」商户的新报价。已提交快照、已扣单据不变。</p></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 全站开户费</label><input data-opening-fee-amount inputmode="decimal" min="0" step="0.01" value="${esc(openingFeeHelpers().formatAmount(fee.amount, false))}"></div><div class="form-field"><label>币种</label><select data-opening-fee-currency><option value="USD"${fee.currency === 'USD' ? ' selected' : ''}>USD</option></select></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>保存</button></div></section></div>`;
  }

  const OPENING_ASSET_SAMPLES = {
    Facebook: '121212345678901, 898989765432101',
    Google: '123-456-7890, 987-654-3210',
    TikTok: '7012345678901234567, 7098765432109876543'
  };

  function openingApplyCustomers() {
    return [
      { merchantId: '1128', customerId: '102', customerName: 'adstest' },
      { merchantId: '19901', customerId: '4901', customerName: '新客首次开户' },
      { merchantId: '18888', customerId: '4801', customerName: '内部免开户费' },
      { merchantId: '14229', customerId: '3472', customerName: 'test金额变动' },
      { merchantId: '11894', customerId: '2688', customerName: '测试用户_1777106273' },
      { merchantId: '13328', customerId: '2658', customerName: '测试何' },
      { merchantId: '12059', customerId: '2853', customerName: '-' },
      { merchantId: '17794', customerId: '4770', customerName: '开户取消样例' }
    ];
  }

  function openingApplyCustomerLabel(item) {
    return item.customerName && item.customerName !== '-' ? `${item.customerId} ${item.customerName}` : item.customerId;
  }

  function openingApplyMerchantOptions(selectedId) {
    const seen = new Set();
    const merchants = openingApplyCustomers().filter(item => {
      if (seen.has(item.merchantId)) return false;
      seen.add(item.merchantId);
      return true;
    });
    return `<option value="">请选择商户ID</option>${merchants.map(item => {
      const status = openingFeeHelpers().merchantStatus(item.merchantId);
      return `<option value="${esc(item.merchantId)}"${String(item.merchantId) === String(selectedId || '') ? ' selected' : ''}>${esc(item.merchantId)}（${esc(status)}）</option>`;
    }).join('')}`;
  }

  function openingApplyCustomerOptions(merchantId, selectedId) {
    const customers = openingApplyCustomers().filter(item => !merchantId || item.merchantId === merchantId);
    return `<option value="">请选择客户</option>${customers.map(item => `<option value="${esc(item.customerId)}" data-merchant-id="${esc(item.merchantId)}" data-customer-name="${esc(item.customerName)}"${String(item.customerId) === String(selectedId || '') ? ' selected' : ''}>${esc(openingApplyCustomerLabel(item))}</option>`).join('')}`;
  }

  function openingAssetMeta(media) {
    if (media === 'Facebook') {
      return { label: 'BM ID', placeholder: '多个 BM ID 可用逗号或空格分隔', tip: '仅 Facebook 需要。支持输入多个 BM ID，可用逗号或空格分隔。', empty: '暂未识别到 BM ID', sample: OPENING_ASSET_SAMPLES.Facebook };
    }
    if (media === 'Google') {
      return { label: 'MCC', placeholder: '多个 MCC 可用逗号或空格分隔', tip: '仅 Google 需要。支持输入多个 MCC，可用逗号或空格分隔。', empty: '暂未识别到 MCC', sample: OPENING_ASSET_SAMPLES.Google };
    }
    if (media === 'TikTok') {
      return { label: 'BC', placeholder: '多个 BC 可用逗号或空格分隔', tip: '仅 TikTok 需要。支持输入多个 BC，可用逗号或空格分隔。', empty: '暂未识别到 BC', sample: OPENING_ASSET_SAMPLES.TikTok };
    }
    return null;
  }

  function parseOpeningAssetIds(value) {
    return Array.from(new Set(String(value || '').split(/[\s,，]+/).map(item => item.trim()).filter(Boolean)));
  }

  function isKnownOpeningAssetSample(value) {
    const normalized = String(value || '').trim();
    return !normalized || Object.values(OPENING_ASSET_SAMPLES).includes(normalized);
  }

  function openingApplyCountries() {
    return ['美国', '加拿大', '英国', '法国', '荷兰'];
  }

  function openingApplyCountryOptions(selected) {
    const current = selected || '美国';
    return openingApplyCountries().map(item => `<option value="${esc(item)}"${item === current ? ' selected' : ''}>${esc(item)}</option>`).join('');
  }

  function openingApplyCategories() {
    return ['健身与运动', '母婴与亲子', '时尚与服装', '户外园艺与 DIY', '玩具与游戏', '宠物用品', '电子产品与智能设备', '美妆与个护', '汽配与工具', '珠宝腕表与配饰', '家居厨房与生活', '口服健康保健与营养', '非口服健康保健与营养', '其他'];
  }

  function openingApplyCategoryOptions() {
    return `<option value="">请选择投放品类</option>${openingApplyCategories().map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('')}`;
  }

  function openingWalletCurrency(merchantId) {
    const map = window.BESTADS_CUSTOMER_WALLET || {};
    return (map[String(merchantId)] || map.default || { currency: 'USD' }).currency;
  }

  function openingWalletAvailable(merchantId) {
    const map = window.BESTADS_CUSTOMER_WALLET || {};
    return Number((map[String(merchantId)] || map.default || { available: 5000 }).available || 0);
  }

  function openingHasDefaultWallet(merchantId) {
    const map = window.BESTADS_CUSTOMER_WALLET || {};
    return Boolean(map[String(merchantId)] || map.default);
  }

  function openingLiveFx() {
    return window.BESTADS_WALLET_FX || { USD: 1, EUR: 0.92, GBP: 0.78, HKD: 7.8 };
  }

  function convertOpeningAmount(amount, from, to, rates) {
    const fx = rates || openingLiveFx();
    const fromRate = Number(fx[from] || 1);
    const toRate = Number(fx[to] || 1);
    return Number(amount || 0) * (toRate / fromRate);
  }

  function openingFeeCaptured(row) {
    const rec = String(row?.openingFeeRecord || '');
    return numAmount(row?.openingFee) > 0 && /FEE-/.test(rec) && !/失败|待重试|未扣款|客户付款后|已回退/.test(rec);
  }

  function openingPrechargeItemList(row) {
    const rec = String(row?.prechargeRecord || '').trim();
    if (!rec || rec === '-' || /客户付款后|无充值记录/.test(rec)) return [];
    return rec.split(/\s*\/\s*/).map(item => item.trim()).filter(Boolean);
  }

  function openingPrechargeItemFailed(text) {
    return /失败待重试|扣款失败|未扣款/.test(String(text || ''));
  }

  function openingPrechargeItemCaptured(text) {
    const rec = String(text || '');
    return /AD-OPEN-/.test(rec) && !openingPrechargeItemFailed(rec) && !/失败退款|未扣成功/.test(rec);
  }

  function openingPrechargeCaptured(row) {
    const items = openingPrechargeItemList(row);
    if (!items.length) return false;
    return items.every(openingPrechargeItemCaptured);
  }

  function openingAnyPrechargeCaptured(row) {
    return openingPrechargeItemList(row).some(openingPrechargeItemCaptured);
  }

  function openingPrechargeFailed(row) {
    return openingPrechargeItemList(row).some(openingPrechargeItemFailed) || /失败待重试|扣款失败/.test(String(row?.prechargeRecord || ''));
  }

  function openingFeeFailed(row) {
    return numAmount(row?.openingFee) > 0 && /失败|待重试/.test(String(row?.openingFeeRecord || '')) && !openingFeeCaptured(row);
  }

  function openingHasCapturedFunds(row) {
    return row?.paymentStatus === '已扣款' || openingFeeCaptured(row) || openingAnyPrechargeCaptured(row);
  }

  function openingFailedPrechargeWalletAmount(row) {
    const wallet = openingWalletCurrency(row?.merchantId);
    const currency = row?.currency || 'USD';
    const items = openingAccountFeeItems(row);
    const records = openingPrechargeItemList(row);
    if (!records.length) {
      return (!openingPrechargeCaptured(row) && numAmount(row?.precharge) > 0)
        ? convertOpeningAmount(numAmount(row.precharge), currency, wallet)
        : 0;
    }
    return records.reduce((sum, text, i) => {
      if (openingPrechargeItemCaptured(text)) return sum;
      return sum + convertOpeningAmount(items[i]?.precharge || 0, currency, wallet);
    }, 0);
  }

  function formatOpeningFeeLabel(openingFeeUsd, walletCurrency) {
    if (!(Number(openingFeeUsd) > 0)) return `${formatOpeningApplyAmount(0, walletCurrency)}（本次不收取开户费）`;
    const usdText = formatOpeningApplyAmount(openingFeeUsd, 'USD');
    if ((walletCurrency || 'USD') === 'USD') return usdText;
    return `${formatOpeningApplyAmount(convertOpeningAmount(openingFeeUsd, 'USD', walletCurrency), walletCurrency)}（标价 ${usdText}）`;
  }

  function openingSetMatches(source, target) {
    const textValue = String(source || '').trim();
    if (!textValue || textValue === '全部' || textValue === '不限') return true;
    const tokens = textValue.split(/[、/|,，]+/).map(item => item.trim()).filter(Boolean);
    return tokens.includes(String(target || '').trim());
  }

  function openingConfiguredRules() {
    return Array.isArray(window.BESTADS_OPENING_RULES) ? window.BESTADS_OPENING_RULES : [];
  }

  function openingEnabledRules(media) {
    return openingConfiguredRules().filter(item => item.status !== '停用' && (!media || item.mediaChannel === media));
  }

  function matchOpeningRules(row) {
    const budget = numAmount(row?.dailyBudget);
    const category = String(row?.category || '').trim();
    const country = String(row?.country || '').trim();
    const applyCurrency = String(row?.currency || 'USD').trim();
    const media = String(row?.mediaChannel || '');
    const budgetMatches = item => {
      const min = numAmount(item.minDailyBudget);
      const max = numAmount(item.maxDailyBudget);
      if (min && budget < min) return false;
      if (max && budget > max) return false;
      return true;
    };
    return openingEnabledRules(media)
      .filter(item => openingSetMatches(item.countryMatch, country) && openingSetMatches(item.categoryMatch, category) && budgetMatches(item) && openingSetMatches(item.currency, applyCurrency))
      .slice()
      .sort((a, b) => numAmount(a.priority) - numAmount(b.priority));
  }

  function openingQuoteFromRule(row, item, openingFeeOverride) {
    const count = Math.max(1, Number(row?.accountCount || 1) || 1);
    const merchantQuote = openingFeeHelpers().quoteForMerchant(row?.merchantId);
    const openingFee = openingFeeOverride != null ? Number(openingFeeOverride) : merchantQuote.amount;
    const precharge = item ? numAmount(item.prechargeBasePerAccount) * count : 0;
    const walletCurrency = openingWalletCurrency(row?.merchantId);
    const accountCurrency = String(row?.currency || 'USD');
    const fx = openingLiveFx();
    const walletOpeningFee = convertOpeningAmount(openingFee, 'USD', walletCurrency, fx);
    const walletPrecharge = convertOpeningAmount(precharge, accountCurrency, walletCurrency, fx);
    return {
      ...(item || {}),
      agent: item?.agent || '',
      accountType: item?.accountType || '',
      merchantOpeningFeeStatus: merchantQuote.status,
      openingFee,
      prechargePerAccount: item ? numAmount(item.prechargeBasePerAccount) : 0,
      precharge,
      total: walletOpeningFee + walletPrecharge,
      walletCurrency,
      walletOpeningFee,
      walletPrecharge,
      walletTotal: walletOpeningFee + walletPrecharge
    };
  }

  const OPENING_AGENT_OPTIONS = ['Madhouse', 'Gimc', 'Rockads', 'Panda', 'Wezonet', 'MeetSocial', 'it-test'];
  const OPENING_TYPE_OPTIONS = ['Facebook-绿通户', 'Facebook-企业户', 'Facebook-三不限', 'Google-海外户', 'TikTok-企业户', 'Snapchat-企业户', 'AppLovin-企业户', '其他媒体账户'];

  function formatOpeningApplyAmount(amount, currency) {
    return `${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'USD'}`;
  }

  function estimateOpeningApplyQuote(modalRoot) {
    const merchantId = modalRoot?.querySelector('[data-opening-merchant]')?.value || '';
    const category = modalRoot?.querySelector('[data-opening-category]')?.value || '';
    const merchantQuote = openingFeeHelpers().quoteForMerchant(merchantId);
    if (!merchantId || !category) return { ready: false, matched: false, openingFee: merchantQuote.amount, precharge: 0, total: 0, walletTotal: 0, feeStatus: merchantQuote.status };
    const row = {
      merchantId,
      mediaChannel: modalRoot.querySelector('[data-opening-media]')?.value || '',
      country: modalRoot.querySelector('[data-opening-country]')?.value || '',
      category,
      dailyBudget: modalRoot.querySelector('[data-opening-budget]')?.value || '',
      currency: modalRoot.querySelector('[data-opening-currency]')?.value || 'USD',
      accountCount: modalRoot.querySelector('[data-opening-count]')?.value || '1'
    };
    const matched = matchOpeningRules(row)[0];
    const quote = openingQuoteFromRule(row, matched || null);
    return {
      ready: true,
      matched: Boolean(matched),
      openingFee: quote.openingFee,
      precharge: quote.precharge,
      total: quote.walletTotal,
      walletTotal: quote.walletTotal,
      walletCurrency: quote.walletCurrency,
      feeStatus: merchantQuote.status
    };
  }

  function syncOpeningApplyCustomers(modalRoot, keepCustomer) {
    if (!modalRoot) return;
    const merchantId = modalRoot.querySelector('[data-opening-merchant]')?.value || '';
    const customerSel = modalRoot.querySelector('[data-opening-customer]');
    if (!customerSel) return;
    const current = keepCustomer ? (customerSel.value || '') : '';
    const matched = openingApplyCustomers().filter(item => !merchantId || item.merchantId === merchantId);
    const next = matched.some(item => item.customerId === current) ? current : (matched.length === 1 ? matched[0].customerId : '');
    customerSel.innerHTML = openingApplyCustomerOptions(merchantId, next);
  }

  function syncOpeningApplyMerchantFromCustomer(modalRoot) {
    if (!modalRoot) return;
    const option = modalRoot.querySelector('[data-opening-customer]')?.selectedOptions?.[0];
    const merchantId = option?.dataset.merchantId || '';
    const merchantSel = modalRoot.querySelector('[data-opening-merchant]');
    if (!merchantSel || !merchantId || merchantSel.value === merchantId) return;
    merchantSel.value = merchantId;
    syncOpeningApplyCustomers(modalRoot, true);
  }

  function syncOpeningApplyAssetFields(modalRoot) {
    if (!modalRoot) return;
    const wrap = modalRoot.querySelector('[data-opening-bm-wrap]');
    if (!wrap) return;
    const media = modalRoot.querySelector('[data-opening-media]')?.value || '';
    const meta = openingAssetMeta(media);
    wrap.hidden = !meta;
    if (!meta) return;
    const label = wrap.querySelector('[data-opening-asset-label]');
    const input = wrap.querySelector('[data-opening-bm-ids]');
    const tip = wrap.querySelector('[data-opening-asset-tip]');
    if (label) label.textContent = meta.label;
    if (tip) tip.textContent = meta.tip;
    if (input) {
      input.placeholder = meta.placeholder;
      if (isKnownOpeningAssetSample(input.value)) input.value = meta.sample;
    }
    syncOpeningApplyAssetPreview(modalRoot);
  }

  function syncOpeningApplyAssetPreview(modalRoot) {
    const preview = modalRoot?.querySelector('[data-opening-bm-preview]');
    if (!preview) return;
    const media = modalRoot.querySelector('[data-opening-media]')?.value || '';
    const meta = openingAssetMeta(media);
    const ids = parseOpeningAssetIds(modalRoot.querySelector('[data-opening-bm-ids]')?.value || '');
    preview.innerHTML = ids.length
      ? ids.map(id => `<span class="opening-bm-chip">${esc(id)}</span>`).join('')
      : `<span class="opening-bm-empty">${esc(meta?.empty || '暂未识别到 ID')}</span>`;
  }

  function syncOpeningApplyEstimate(modalRoot) {
    if (!modalRoot) return;
    const currency = modalRoot.querySelector('[data-opening-currency]')?.value || 'USD';
    const suffix = modalRoot.querySelector('[data-opening-budget-currency]');
    if (suffix) suffix.textContent = currency;
    const breakdown = estimateOpeningApplyQuote(modalRoot);
    const total = modalRoot.querySelector('[data-opening-estimate]');
    const openingFeeTarget = modalRoot.querySelector('[data-opening-estimate-opening]');
    const prechargeTarget = modalRoot.querySelector('[data-opening-estimate-precharge]');
    if (!breakdown.ready) {
      if (total) total.textContent = '-';
      if (openingFeeTarget) openingFeeTarget.textContent = '-';
      if (prechargeTarget) prechargeTarget.textContent = '-';
      return;
    }
    const wallet = breakdown.walletCurrency || openingWalletCurrency(modalRoot.querySelector('[data-opening-merchant]')?.value);
    if (openingFeeTarget) {
      openingFeeTarget.textContent = formatOpeningFeeLabel(breakdown.openingFee, wallet);
    }
    if (!breakdown.matched) {
      if (total) total.textContent = '-（待审核定价）';
      if (prechargeTarget) prechargeTarget.textContent = '-';
      return;
    }
    if (total) total.textContent = formatOpeningApplyAmount(breakdown.walletTotal, wallet);
    if (prechargeTarget) prechargeTarget.textContent = formatOpeningApplyAmount(convertOpeningAmount(breakdown.precharge, currency, wallet), wallet);
  }

  function syncOpeningApplyCreateModal(modalRoot) {
    const root = modalRoot || document.querySelector('[data-opening-apply-create-modal]');
    if (!root) return;
    syncOpeningApplyCustomers(root, true);
    syncOpeningApplyAssetFields(root);
    syncOpeningApplyEstimate(root);
  }

  function openingApplyCreateModal(modal) {
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal?.title || '新建开户申请')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">内部代客户提交开户申请。除选择商户和客户外，填写内容与客户端申请开户一致。</div><div class="form-grid" data-opening-apply-create-modal>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 商户ID</label><select data-opening-merchant>${openingApplyMerchantOptions('')}</select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 客户</label><select data-opening-customer>${openingApplyCustomerOptions('', '')}</select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 媒体渠道</label><select data-opening-media><option value="">请选择媒体渠道</option><option value="Facebook">Facebook</option><option value="Google">Google</option><option value="TikTok">TikTok</option><option value="Snapchat">Snapchat</option><option value="AppLovin">AppLovin</option><option value="Taboola">Taboola</option><option value="Outbrain">Outbrain</option><option value="X">X</option></select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 投放URL</label><input data-opening-url type="text" value="https://www.luminara-home.com" placeholder="请输入投放URL"></div>
      <div class="form-field full" data-opening-bm-wrap hidden><label data-opening-asset-label>BM ID</label><input data-opening-bm-ids type="text" value="" placeholder="多个 BM ID 可用逗号或空格分隔"><p class="field-help" data-opening-asset-tip>仅 Facebook 需要。支持输入多个 BM ID，可用逗号或空格分隔。</p><div class="opening-bm-preview" data-opening-bm-preview aria-live="polite"></div></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 投放国家</label><select data-opening-country>${openingApplyCountryOptions('美国')}</select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 时区</label><select data-opening-timezone><option value="America/Los_Angeles" selected>America/Los_Angeles</option><option value="America/New_York">America/New_York</option><option value="Europe/London">Europe/London</option><option value="Europe/Amsterdam">Europe/Amsterdam</option><option value="America/Chicago">America/Chicago</option><option value="UTC">UTC</option></select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 账户币种</label><select data-opening-currency><option value="USD" selected>USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="HKD">HKD</option></select></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 日预算</label><div class="input-with-suffix"><input data-opening-budget type="text" inputmode="decimal" value="300" placeholder="请输入日预算"><span class="input-suffix" data-opening-budget-currency>USD</span></div></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 账户数</label><input data-opening-count type="text" inputmode="numeric" value="2" placeholder="请输入账户数"></div>
      <div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 投放品类</label><select data-opening-category>${openingApplyCategoryOptions()}</select></div>
      <div class="form-field full"><div class="opening-apply-estimate" aria-live="polite"><div><p class="opening-apply-estimate__title">预估开户费用</p><p class="opening-apply-estimate__desc">开户费按商户首次一口价收取，标价为 USD，实扣和合计按钱包默认币种折算。首充按最低首充乘以账户数。日预算只用于匹配规则。无命中规则时合计为 -（待审核定价），提交时不扣款，最终金额以运营审核结果为准。</p><div class="opening-apply-estimate__breakdown"><span>开户费：<b data-opening-estimate-opening>-</b></span><span>首充（广告账户充值）：<b data-opening-estimate-precharge>-</b></span></div></div><div class="opening-apply-estimate__total"><span>合计</span><strong data-opening-estimate>-</strong></div></div></div>
      <label class="opening-apply-consent full"><input data-opening-auto-pay type="checkbox" checked><span>代客户确认：若最终金额与初始报价一致，同意系统直接扣除开户费和各账户首充；不一致时再通知客户确认。</span></label>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>提交申请</button></div></section></div>`;
  }

  const OPENING_CONFIRM_EMAIL_SAMPLE = {
    customerName: 'test金额变动',
    applyId: 'AO20260812008',
    submittedAt: '2026-08-12 16:42:09',
    openingRecordsUrl: '../../bestads-client-styled/operation-records.html?tab=opening&applyId=AO20260812008'
  };

  function openingConfirmEmailCopy(lang) {
    const sample = OPENING_CONFIRM_EMAIL_SAMPLE;
    if (lang === 'zh') {
      return {
        kicker: '开户通知',
        subject: '请确认您的 BestAds 开户申请',
        title: '请确认开户申请',
        intro: `您好，${sample.customerName}。您有一笔 BestAds 开户申请待确认付款。请登录系统，进入操作记录中的开户记录查看最新信息并完成确认。出于安全考虑，本邮件不展示费用明细，具体金额请以 BestAds 系统为准。如您已完成确认，请忽略本邮件。`,
        idLabel: '申请ID',
        timeLabel: '申请时间',
        cta: '前往开户记录',
        footer: '本邮件由 BestAds 自动发送，请勿直接回复。'
      };
    }
    return {
      kicker: 'Account Opening',
      subject: 'Action needed: please confirm your BestAds account opening request',
      title: 'Please confirm your account opening request',
      intro: `Hi ${sample.customerName}, your BestAds account opening request is ready for confirmation. Please sign in and open Opening Records to review the latest details and complete payment confirmation. For security, this email does not include fee details. Please confirm the amount in BestAds. If you have already completed confirmation, please ignore this email.`,
      idLabel: 'Application ID',
      timeLabel: 'Submitted at',
      cta: 'Review Opening Records',
      footer: 'This email was sent by BestAds. Please do not reply to this message.'
    };
  }

  function openingConfirmEmailHtml(lang) {
    const copy = openingConfirmEmailCopy(lang);
    const sample = OPENING_CONFIRM_EMAIL_SAMPLE;
    return `<article class="email-rendered">
      <header class="email-rendered__brand">
        <div class="email-rendered__logo">B</div>
        <div><strong>BestAds</strong><span>${esc(copy.kicker)}</span></div>
      </header>
      <main class="email-rendered__body">
        <p class="email-rendered__subject">${esc(copy.subject)}</p>
        <h1>${esc(copy.title)}</h1>
        <p class="email-rendered__intro">${esc(copy.intro)}</p>
        <table class="opening-email-meta">
          <tbody>
            <tr><th>${esc(copy.idLabel)}</th><td>${esc(sample.applyId)}</td></tr>
            <tr><th>${esc(copy.timeLabel)}</th><td>${esc(sample.submittedAt)}</td></tr>
          </tbody>
        </table>
        <div class="email-rendered__actions">
          <a class="email-rendered__cta" href="${esc(sample.openingRecordsUrl)}" target="_blank" rel="noopener noreferrer">${esc(copy.cta)}</a>
        </div>
      </main>
      <footer class="email-rendered__footer">${esc(copy.footer)}</footer>
    </article>`;
  }

  function openingEmailPreviewModal(modal) {
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal?.title || '确认付款邮件原型')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="opening-email-preview" data-opening-email-preview>
      <div class="opening-email-toolbar">
        <div class="opening-email-tabs">
          <button class="is-active" type="button" data-opening-email-lang="en">English</button>
          <button type="button" data-opening-email-lang="zh">中文</button>
        </div>
        <span class="muted">原型预览，不发送真实邮件</span>
      </div>
      <div class="opening-email-frame" data-opening-email-frame>${openingConfirmEmailHtml('en')}</div>
    </div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>关闭</button></div></section></div>`;
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

  function debitSelectOptions(options, placeholder, selected) {
    return `<option value="">${esc(placeholder)}</option>${(options || []).map(option => `<option value="${esc(option)}"${String(option) === String(selected || '') ? ' selected' : ''}>${esc(option)}</option>`).join('')}`;
  }

  function batchDebitItemHtml(modal, item = {}) {
    const types = modal.feeTypes || [];
    const currencies = modal.currencies || ['USD', 'EUR', 'GBP'];
    return `<div class="debit-item-card" data-debit-item><div class="debit-item-card__head"><strong data-debit-item-label>扣费 1</strong><button type="button" class="btn btn-link btn-link-danger" data-debit-remove hidden>删除</button></div><div class="debit-item-grid"><div class="form-field"><label>扣费类型 <span style="color:var(--admin-danger)">*</span></label><select data-debit-type>${debitSelectOptions(types, '请选择扣费类型', item.feeType)}</select></div><div class="form-field"><label>扣费币种 <span style="color:var(--admin-danger)">*</span></label><select data-debit-currency>${debitSelectOptions(currencies, '请选择币种', item.currency || 'USD')}</select></div><div class="form-field"><label>扣费金额 <span style="color:var(--admin-danger)">*</span></label><input type="text" inputmode="decimal" data-debit-amount placeholder="请输入扣费金额" value="${esc(item.feeAmount || '')}"></div></div><div class="form-field"><label>备注</label><input type="text" data-debit-remark placeholder="请输入备注" value="${esc(item.remark || '')}"></div></div>`;
  }

  function batchDebitModal(modal) {
    const customers = modal.customers || [];
    const customerOptions = customers.map(customer => `<option value="${esc(customer.id)}" data-customer-name="${esc(customer.name)}" data-merchant-id="${esc(customer.merchantId)}" data-wallet-currency="${esc(customer.walletCurrency || 'USD')}" data-current-balance="${esc(customer.currentBalance || '0')}" data-available-amount="${esc(customer.availableAmount || '0')}" data-real-amount="${esc(customer.realAmount || '0')}" data-credit-limit="${esc(customer.creditLimit || '0')}" data-used-limit="${esc(customer.usedLimit || '0')}">${esc(customer.name)}（商户ID: ${esc(customer.merchantId)}）</option>`).join('');
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '新增其他扣费')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="debit-form" data-debit-modal><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 客户（单选）</label><select data-debit-customer><option value="">请选择客户</option>${customerOptions}</select></div><div class="readonly-context debit-wallet" data-debit-wallet hidden><div><dt>钱包币种</dt><dd data-debit-wallet-currency>-</dd></div><div><dt>当前余额</dt><dd class="debit-balance-danger" data-debit-current-balance>-</dd></div><div><dt>可用金额</dt><dd data-debit-available-amount>-</dd></div><div><dt>真实金额</dt><dd data-debit-real-amount>-</dd></div><div><dt>信用额度</dt><dd data-debit-credit-limit>-</dd></div><div><dt>已用额度</dt><dd data-debit-used-limit>-</dd></div><div><dt>剩余额度</dt><dd data-debit-remaining-limit>-</dd></div></div><div class="form-field full debit-item-panel"><label>扣费明细 <span style="color:var(--admin-danger)">*</span></label><div class="debit-item-list" data-debit-item-list>${batchDebitItemHtml(modal)}</div><div class="debit-item-toolbar"><button type="button" class="btn btn-default" data-debit-add>${icon('plus')}添加一条扣费</button><div class="debit-total-row"><span>本次总扣费：<strong data-debit-total>0.00</strong></span><span>预计钱包扣款：<strong data-debit-wallet-total>-</strong></span></div></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function rechargeRequestModal(modal) {
    const customers = modal.customers || [];
    const accountRows = customers.flatMap(customer => (customer.accounts || []).map(account => ({ ...account, customerId: customer.id, customerName: customer.name, merchantId: customer.merchantId, walletBalance: customer.balance })));
    const rowsHtml = accountRows.map(account => {
      const statusText = account.verifyStatus || '无验卡任务';
      const blocked = rechargeBlockedStatus(statusText);
      const reason = account.gateReason || (blocked ? `使用卡验卡任务处于${statusText}，需先标记媒体已验证后再充值` : '-');
      const statusClass = blocked ? 'status-danger' : /已验卡|已充值关单|已回收/.test(statusText) ? 'status-success' : 'status-info';
      return `<tr data-recharge-account-row data-customer-id="${esc(account.customerId)}" data-account-key="${esc(`${account.name} ${account.id}`.toLowerCase())}" hidden${blocked ? ' class="is-disabled-row"' : ''}><td class="select-cell"><input type="checkbox" data-recharge-account value="${esc(account.id)}" data-account-name="${esc(account.name)}" data-customer-id="${esc(account.customerId)}" data-customer-name="${esc(account.customerName)}" data-merchant-id="${esc(account.merchantId)}" data-currency="${esc(account.currency)}" data-balance="${esc(account.balance)}" data-wallet-balance="${esc(account.walletBalance)}" data-service-rate="${esc(account.serviceRate ?? 0)}" data-pre-tax-rate="${esc(account.preTaxRate ?? 0)}" data-verify-status="${esc(statusText)}" data-card-id="${esc(account.cardId || '')}" data-card-label="${esc(account.cardLabel || '')}" data-other-cards="${esc(account.otherCards || '')}" data-gate-reason="${esc(reason)}"${blocked ? ' disabled' : ''}></td><td class="left">${esc(account.name)}(${esc(account.id)})</td><td>${esc(account.currency)}</td><td class="num">${esc(account.balance)}</td><td><span class="status-tag ${statusClass}">${esc(statusText)}</span></td><td class="left">${esc(reason)}</td></tr>`;
    }).join('');
    return `<div class="modal-backdrop"><section class="modal modal-recharge"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '发起充值')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="recharge-form" data-recharge-modal><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 客户（单选）</label><select data-recharge-customer><option value="">选择客户</option>${customers.map(customer => `<option value="${esc(customer.id)}" data-customer-name="${esc(customer.name)}" data-merchant-id="${esc(customer.merchantId)}">${esc(customer.id)} ${esc(customer.name)}（商户ID: ${esc(customer.merchantId)}）</option>`).join('')}</select></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 广告账户（多选）</label><div class="recharge-account-toolbar"><input type="text" data-recharge-account-search placeholder="输入广告账户"><button type="button" class="btn btn-primary" data-recharge-query>${icon('search')}查 询</button></div><div class="table-scroll recharge-account-table recharge-account-table--fit"><table class="admin-table admin-table--fixed"><colgroup><col style="width:44px"><col style="width:28%"><col style="width:12%"><col style="width:13%"><col style="width:16%"><col style="width:27%"></colgroup><thead><tr><th class="select-cell"></th><th class="left">账户名称</th><th>币种</th><th class="num">当前余额</th><th>验卡状态</th><th class="left">不可充值原因</th></tr></thead><tbody>${rowsHtml}</tbody></table><div class="empty-state recharge-empty" data-recharge-empty>暂无数据</div></div><div class="pagination recharge-account-pagination"><span data-recharge-count>共 0 条记录</span><div class="pagination__actions"><button type="button" class="page-number" disabled>‹</button><button type="button" class="page-number is-active">1</button><button type="button" class="page-number" disabled>›</button></div></div></div><div class="form-field full recharge-amount-panel" data-recharge-amount-panel><label>充值金额设置</label><div class="notice recharge-select-notice" data-recharge-select-notice>请至少选择一个广告账户</div><div class="recharge-amount-list" data-recharge-amount-list></div><div class="recharge-total-row"><span>总充值金额：<strong data-recharge-total>0.00 USD</strong></span><span>可用余额：<strong data-recharge-wallet>-</strong></span></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-modal-submit>确 定</button></div></section></div>`;
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

  function openingClientStatus(status) {
    if (status === '待客户确认付款') return '待确认';
    if (status === '开户成功' || status === '部分成功') return '完成';
    if (status === '开户取消' || status === '审核不通过') return '失败';
    if (status === '扣款异常') return '处理中';
    return '处理中';
  }

  function openingOpsForStatus(status) {
    if (status === '待运营审核') return ['审核开户', '查看详情'];
    if (status === '审核不通过') return ['查看详情'];
    if (status === '待客户确认付款') return ['查看详情', '取消开户', '重开审核'];
    if (status === '扣款异常') return ['重试扣款', '查看详情', '取消开户'];
    if (status === '已付款待开户') return ['登记开户结果', '查看详情', '取消开户'];
    if (status === '开户成功') return ['查看详情'];
    if (status === '部分成功') return ['查看详情'];
    if (status === '开户取消') return ['查看详情'];
    return ['查看详情'];
  }

  function refreshOpeningRow(row) {
    if (!row) return;
    row.ops = openingOpsForStatus(row.status);
  }

  function openingVersion(row, suffix = 'v2') {
    const base = String(row?.quoteVersion || '').trim();
    if (!base) return `Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${suffix}`;
    if (/-/.test(base)) return `${base}-${suffix}`;
    return `${base}-${suffix}`;
  }

  function openingRuleQuoteVersion() {
    const date = currentTimestamp().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `RULE-${date}-${random}`;
  }

  function openingRuleOptions(row) {
    return matchOpeningRules(row).map(item => openingQuoteFromRule(row, item));
  }

  function openingAuditChoices(row) {
    const matched = openingRuleOptions(row);
    if (matched.length) return { mode: 'matched', options: matched };
    const mediaRules = openingEnabledRules(row?.mediaChannel).slice().sort((a, b) => numAmount(a.priority) - numAmount(b.priority));
    if (mediaRules.length) return { mode: 'media', options: mediaRules.map(item => openingQuoteFromRule(row, item)) };
    return { mode: 'manual', options: [] };
  }

  function openingSelectedRule(row, modalRoot) {
    const choices = openingAuditChoices(row);
    if (choices.mode === 'manual') {
      const quote = openingQuoteFromRule(row, null);
      quote.agent = modalRoot?.querySelector('[data-opening-agent]')?.value || '';
      quote.accountType = modalRoot?.querySelector('[data-opening-type]')?.value || '';
      return quote;
    }
    const options = choices.options;
    const agentValue = modalRoot?.querySelector('[data-opening-agent]')?.value || '';
    if (agentValue) return options.find(option => openingRuleKey(option) === agentValue) || options[0];
    return options[0];
  }

  function openingRuleKey(option) {
    return option?.ruleId || `${option.agent}||${option.accountType}`;
  }

  function openingRuleSummary(option) {
    return `开户费 ${formatAmountOnly(option.openingFee)}（商户${option.merchantOpeningFeeStatus || '已收取'}） + 首充 ${formatAmountOnly(option.precharge)} = ${formatAmountOnly(option.walletTotal != null ? option.walletTotal : option.total)}`;
  }

  function openingHasAutoPayAuth(row) {
    const auth = String(row?.paymentAuth || '');
    if (/未授权/.test(auth)) return false;
    return /已同意金额一致|自动扣款/.test(auth);
  }

  function openingAuditOutcome(row, quote) {
    const authorized = openingHasAutoPayAuth(row);
    const initialText = String(row?.initialQuote || '').trim();
    const hasInitial = initialText && initialText !== '-';
    const initialWallet = numAmount(row?.initialWalletTotal || row?.initialQuote);
    const finalWallet = Number(quote?.walletTotal != null ? quote.walletTotal : quote?.total || 0);
    const sameQuote = hasInitial && Math.abs(initialWallet - finalWallet) < 0.015;
    if (!authorized) {
      return { type: 'confirm', status: '待客户确认付款', label: '未授权自动扣款，客户确认付款', note: '客户未授权金额一致时自动扣款，确认审核后需客户回系统确认付款。' };
    }
    if (!hasInitial || !sameQuote) {
      return { type: 'confirm', status: '待客户确认付款', label: '金额不一致，客户确认付款', note: '确认审核后邮件通知客户回系统确认付款。比对按钱包默认币种折算后的合计。' };
    }
    return { type: 'auto', status: '已付款待开户', label: '金额一致，自动扣款', note: '确认审核后直接从客户钱包扣款，并进入已付款待开户。' };
  }

  function openingSyncedAccounts(row) {
    const customer = row?.customerName || row?.applyId || '客户';
    const currency = row?.currency || 'USD';
    return [
      { id: '1002116215352952', name: 'Oliva-Amsterdam', currency: 'EUR' },
      { id: '1001765238416132', name: 'TL-G-12-712', currency: 'USD' },
      { id: '1003988442196501', name: `${customer}-Auto-01`, currency },
      { id: '1003988442196502', name: `${customer}-Auto-02`, currency }
    ];
  }

  function openingAuditQuoteValues(modalRoot, rule, row) {
    const preview = modalRoot?.querySelector('[data-opening-rule-preview]');
    const editing = Boolean(preview?.classList.contains('is-editing'));
    const openingFee = editing ? numAmount(modalRoot.querySelector('[data-opening-fee-input]')?.value) : Number(rule?.openingFee || 0);
    const precharge = editing ? numAmount(modalRoot.querySelector('[data-opening-precharge-input]')?.value) : Number(rule?.precharge || 0);
    const edited = Math.abs(openingFee - Number(rule?.openingFee || 0)) > 0.001 || Math.abs(precharge - Number(rule?.precharge || 0)) > 0.001;
    const walletCurrency = openingWalletCurrency(row?.merchantId || rule?.merchantId);
    const accountCurrency = String(row?.currency || 'USD');
    const fx = openingLiveFx();
    const walletOpeningFee = convertOpeningAmount(openingFee, 'USD', walletCurrency, fx);
    const walletPrecharge = convertOpeningAmount(precharge, accountCurrency, walletCurrency, fx);
    return { openingFee, precharge, total: walletOpeningFee + walletPrecharge, walletOpeningFee, walletPrecharge, walletTotal: walletOpeningFee + walletPrecharge, walletCurrency, accountCurrency, edited };
  }

  function setOpeningFeeEditing(modalRoot, editing) {
    const preview = modalRoot?.querySelector('[data-opening-rule-preview]');
    preview?.classList.toggle('is-editing', editing);
    const editBtn = modalRoot?.querySelector('[data-opening-edit-fee]');
    const resetBtn = modalRoot?.querySelector('[data-opening-reset-fee]');
    if (editBtn) editBtn.hidden = editing;
    if (resetBtn) resetBtn.hidden = !editing;
  }

  function applyOpeningAuditQuote(modalRoot, rule, row, options = {}) {
    if (!modalRoot || !rule) return;
    if (options.reset) setOpeningFeeEditing(modalRoot, false);
    const feeInput = modalRoot.querySelector('[data-opening-fee-input]');
    const prechargeInput = modalRoot.querySelector('[data-opening-precharge-input]');
    const preview = modalRoot.querySelector('[data-opening-rule-preview]');
    const editing = Boolean(preview?.classList.contains('is-editing'));
    if (options.reset || !editing) {
      if (feeInput) feeInput.value = formatAmountOnly(rule.openingFee);
      if (prechargeInput) prechargeInput.value = formatAmountOnly(rule.precharge);
    }
    const quote = openingAuditQuoteValues(modalRoot, rule, row);
    const fee = modalRoot.querySelector('[data-opening-fee]');
    const precharge = modalRoot.querySelector('[data-opening-precharge]');
    const finalQuote = modalRoot.querySelector('[data-opening-final-quote]');
    const outcome = modalRoot.querySelector('[data-opening-outcome]');
    const outcomeNote = modalRoot.querySelector('[data-opening-outcome-note]');
    const changed = modalRoot.querySelector('[data-opening-fee-changed]');
    if (fee) fee.textContent = `${formatAmountOnly(quote.openingFee)} USD`;
    if (precharge) precharge.textContent = `${formatAmountOnly(quote.precharge)} ${quote.accountCurrency || row?.currency || 'USD'}`;
    if (finalQuote) finalQuote.textContent = `${formatAmountOnly(quote.walletTotal)} ${quote.walletCurrency || 'USD'}`;
    const nextOutcome = openingAuditOutcome(row, quote);
    if (outcome) outcome.textContent = nextOutcome.label;
    if (outcomeNote) outcomeNote.textContent = nextOutcome.note;
    if (changed) changed.hidden = !quote.edited;
  }

  function openingAuditModal(modal, row) {
    const choices = openingAuditChoices(row);
    const manual = choices.mode === 'manual';
    const options = choices.options;
    const selected = manual ? openingQuoteFromRule(row, null) : (options.find(option => option.agent === row?.agent && option.accountType === row?.accountType) || options[0]);
    const outcome = openingAuditOutcome(row, selected);
    const merchantQuote = openingFeeHelpers().quoteForMerchant(row?.merchantId);
    const siteFee = openingFeeHelpers().siteFee();
    const agentOptions = manual
      ? OPENING_AGENT_OPTIONS.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('')
      : options.map(option => `<option value="${esc(openingRuleKey(option))}"${openingRuleKey(option) === openingRuleKey(selected) ? ' selected' : ''}>${esc(option.agent)}</option>`).join('');
    const typeOptions = manual
      ? OPENING_TYPE_OPTIONS.map(item => `<option value="${esc(item)}">${esc(item)}</option>`).join('')
      : options.map(option => `<option value="${esc(openingRuleKey(option))}"${openingRuleKey(option) === openingRuleKey(selected) ? ' selected' : ''}>${esc(option.accountType)}</option>`).join('');
    const hint = manual
      ? '当前申请未命中启用规则，且该媒体没有可带出的规则。请选择代理和账户类型，并点击「修改」后填写首充。'
      : choices.mode === 'media'
        ? '当前申请未命中规则。下列为该媒体启用规则，选择后带出金额；最终报价需与初始报价比对。'
        : '开户费按商户首次一口价收取，不乘账户数。未收取带出全站开户费；已收取或不收取默认为 0。本单仍可修改开户费和首充。';
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '审核开户')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="opening-modal-stack"><dl class="readonly-context readonly-context--wide"><div><dt>申请ID</dt><dd>${esc(row?.applyId || '-')}</dd></div><div><dt>客户</dt><dd>${esc(row?.customerName || '-')}（${esc(row?.customerId || '-')})</dd></div><div><dt>商户开户费状态</dt><dd>${esc(merchantQuote.status)}</dd></div><div><dt>全站开户费</dt><dd>${esc(openingFeeHelpers().formatAmount(siteFee.amount))}</dd></div><div><dt>投放URL</dt><dd><a class="admin-inline-link" href="${esc(row?.url || '#')}" target="_blank" rel="noopener noreferrer">${esc(row?.url || '-')}</a></dd></div><div><dt>投放国家</dt><dd>${esc(row?.country || '-')}</dd></div><div><dt>时区</dt><dd>${esc(row?.timezone || '-')}</dd></div><div><dt>账户币种</dt><dd>${esc(row?.currency || 'USD')}</dd></div><div><dt>日预算</dt><dd>${esc(row?.dailyBudget || '-')}</dd></div><div><dt>账户数</dt><dd>${esc(row?.accountCount || '-')}</dd></div><div><dt>投放品类</dt><dd>${esc(row?.category || '-')}</dd></div><div><dt>初始报价</dt><dd>${esc(row?.initialQuote || '-')}</dd></div><div><dt>报价版本</dt><dd>${esc(row?.quoteVersion || '-')}</dd></div><div><dt>自动扣款授权</dt><dd>${esc(row?.paymentAuth || '未记录')}</dd></div><div><dt>钱包默认币种</dt><dd>${esc(openingWalletCurrency(row?.merchantId))}</dd></div></dl><div class="form-grid" data-opening-audit-modal data-opening-audit-mode="${esc(choices.mode)}"><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 代理</label><select data-opening-agent>${agentOptions}</select></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 账户类型</label><select data-opening-type>${typeOptions}</select></div><div class="form-field full"><div class="opening-quote-label"><label>规则报价</label><div class="command-group"><button type="button" class="btn btn-link" data-opening-edit-fee>修改</button><button type="button" class="btn btn-link" data-opening-reset-fee hidden>恢复规则金额</button></div></div><div class="opening-rule-preview" data-opening-rule-preview data-opening-rule-options="${esc(JSON.stringify(options))}"><div><span>开户费（USD）</span><strong data-opening-fee>${esc(formatAmountOnly(selected.openingFee))} USD</strong><input data-opening-fee-input inputmode="decimal" min="0" step="0.01" value="${esc(formatAmountOnly(selected.openingFee))}"></div><div><span>首充（${esc(row?.currency || 'USD')}）</span><strong data-opening-precharge>${esc(formatAmountOnly(selected.precharge))} ${esc(row?.currency || 'USD')}</strong><input data-opening-precharge-input inputmode="decimal" min="0" step="0.01" value="${esc(formatAmountOnly(selected.precharge))}"></div><div><span>最终报价（${esc(selected.walletCurrency || openingWalletCurrency(row?.merchantId))}）</span><strong data-opening-final-quote>${esc(formatAmountOnly(selected.walletTotal != null ? selected.walletTotal : selected.total))} ${esc(selected.walletCurrency || openingWalletCurrency(row?.merchantId))}</strong></div><div><span>处理方式</span><strong data-opening-outcome>${esc(outcome.label)}</strong></div><p data-opening-outcome-note>${esc(outcome.note)}</p><p data-opening-fee-hint>${esc(hint)}</p><em data-opening-fee-changed hidden>已改规则金额，最终报价将按修改后的开户费和首充计算。</em></div></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-danger" data-opening-audit-cancel>取消开户</button><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确认审核</button></div></section></div>`;
  }

  function openingAccountCount(row) {
    return Math.max(1, Number(row?.accountCount || 1) || 1);
  }

  function openingItemNo(index) {
    return String(index).padStart(2, '0');
  }

  function openingPlaceholderRecords(applyId, count, prefix, suffix, prechargeAmount) {
    if (!(Number(prechargeAmount) > 0)) return '无充值记录';
    const id = applyId || 'AO';
    return Array.from({ length: count }, (_, i) => `${prefix}${id}-${openingItemNo(i + 1)}${suffix || ''}`).join(' / ');
  }

  function retryOpeningPrechargeRecords(row) {
    if (!(numAmount(row?.precharge) > 0)) return '无充值记录';
    const count = openingAccountCount(row);
    const items = openingPrechargeItemList(row);
    if (!items.length) return openingPlaceholderRecords(row.applyId, count, 'AD-OPEN-', ' 待绑定账户', numAmount(row.precharge));
    return Array.from({ length: count }, (_, i) => {
      const text = items[i] || '';
      if (openingPrechargeItemCaptured(text)) return text;
      return `AD-OPEN-${row.applyId}-${openingItemNo(i + 1)} 待绑定账户`;
    }).join(' / ');
  }

  function refundOpeningPrechargeRecords(row) {
    if (!(numAmount(row?.precharge) > 0)) return '无充值记录';
    const count = openingAccountCount(row);
    const items = openingPrechargeItemList(row);
    return Array.from({ length: count }, (_, i) => {
      const text = items[i] || '';
      const id = `AD-OPEN-${row.applyId}-${openingItemNo(i + 1)}`;
      if (openingPrechargeItemCaptured(text)) return `${id} 失败退款`;
      if (openingPrechargeItemFailed(text)) return `${id} 未扣成功，无退款`;
      return text || `${id} 未扣成功，无退款`;
    }).join(' / ');
  }

  function parseOpeningRate(value) {
    const text = String(value || '').trim().replace(/%/g, '');
    if (!text) return { ok: true, set: false, value: '', label: '未设置' };
    if (!/^\d+(\.\d{1,4})?$/.test(text)) return { ok: false, set: false, value: '', label: '未设置' };
    return { ok: true, set: true, value: `${text}%`, label: `${text}%` };
  }

  function openingAccountFeeItems(row) {
    const count = openingAccountCount(row);
    const prechargeCents = Math.round(numAmount(row?.precharge) * 100);
    const prechargeEach = Math.floor(prechargeCents / count);
    const prechargeRemainder = prechargeCents - prechargeEach * count;
    return Array.from({ length: count }, (_, i) => {
      const last = i === count - 1;
      const precharge = (prechargeEach + (last ? prechargeRemainder : 0)) / 100;
      return { precharge, refund: precharge };
    });
  }

  function openingAccountSlotsHtml(row, syncedAccounts) {
    const feeItems = openingAccountFeeItems(row);
    const options = syncedAccounts.map(account => `<option value="${esc(account.id)}" data-account-name="${esc(account.name)}" data-currency="${esc(account.currency)}">${esc(account.id)} / ${esc(account.name)} / ${esc(account.currency)}</option>`).join('');
    return `<div class="opening-account-slots">${feeItems.map((item, i) => {
      const index = i + 1;
      const precharge = formatAmountOnly(item.precharge);
      const refund = formatAmountOnly(item.refund);
      return `<section class="opening-account-slot" data-opening-account-slot data-slot-index="${index}" data-opening-precharge="${esc(precharge)}"><div class="opening-account-slot__head"><strong>账户 ${index}</strong><label class="opening-slot-fail"><input type="checkbox" data-opening-slot-failed> 本账户开户失败</label></div><div class="opening-account-slot__fees"><div><span>首充金额</span><strong>${esc(precharge)}</strong></div><div><span>失败将退回</span><strong data-opening-slot-refund>${esc(refund)}</strong></div></div><div class="form-grid" data-opening-slot-success><div class="form-field full"><label>账户来源</label><select data-opening-account-source><option value="synced">选择已同步广告账户</option><option value="manual">录入广告账户</option></select></div><div class="form-field full" data-opening-synced-panel><label><span style="color:var(--admin-danger)">*</span> 已同步广告账户</label><select data-opening-synced-account><option value="">请选择广告账户</option>${options}</select></div><div class="form-field" data-opening-manual-panel hidden><label><span style="color:var(--admin-danger)">*</span> 广告账户ID</label><input data-opening-account-id placeholder="请输入广告账户ID"></div><div class="form-field" data-opening-manual-panel hidden><label><span style="color:var(--admin-danger)">*</span> 广告账户名称</label><input data-opening-account-name placeholder="请输入广告账户名称"></div><div class="form-field" data-opening-manual-panel hidden><label><span style="color:var(--admin-danger)">*</span> 币种</label><select data-opening-account-currency><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="HKD">HKD</option></select></div><div class="form-field"><label>账户服务费率</label><input data-opening-service-rate placeholder="选填，例如 3.00"><p class="field-help">不填则不设置该账户服务费率；填 0 会新增费率为 0 的配置。</p></div><div class="form-field"><label>预收税费费率</label><input data-opening-pre-tax-rate placeholder="选填，例如 0.00"><p class="field-help">不填则不设置该账户预收税费费率；填 0 会新增费率为 0 的配置。</p></div></div></section>`;
    }).join('')}</div>`;
  }

  function openingResultModal(modal, row) {
    const syncedAccounts = openingSyncedAccounts(row);
    const applyUrl = row?.url && /^https?:\/\//i.test(String(row.url))
      ? `<a class="admin-inline-link" href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">${esc(row.url)}</a>`
      : esc(row?.url || '-');
    const merchantStatus = openingFeeHelpers().merchantStatus(row?.merchantId);
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '登记开户结果')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="opening-modal-stack" data-opening-result-modal><dl class="readonly-context readonly-context--wide"><div><dt>申请ID</dt><dd>${esc(row?.applyId || '-')}</dd></div><div><dt>客户</dt><dd>${esc(row?.customerName || '-')}（${esc(row?.customerId || '-')})</dd></div><div><dt>商户开户费状态</dt><dd>${esc(merchantStatus)}</dd></div><div><dt>本单开户费</dt><dd>${esc(row?.openingFee || '-')}</dd></div><div><dt>媒体渠道</dt><dd>${esc(row?.mediaChannel || '-')}</dd></div><div><dt>URL</dt><dd>${applyUrl}</dd></div><div><dt>投放品类</dt><dd>${esc(row?.category || '-')}</dd></div><div><dt>投放国家</dt><dd>${esc(row?.country || '-')}</dd></div><div><dt>时区</dt><dd>${esc(row?.timezone || '-')}</dd></div><div><dt>账户币种</dt><dd>${esc(row?.currency || 'USD')}</dd></div><div><dt>日预算</dt><dd>${esc(row?.dailyBudget || '-')}</dd></div><div><dt>账户数</dt><dd>${esc(row?.accountCount || '-')}</dd></div><div><dt>最终报价</dt><dd>${esc(row?.finalQuote || row?.initialQuote || '-')}</dd></div><div><dt>首充合计</dt><dd>${esc(row?.precharge || '-')}</dd></div></dl><div class="opening-result-toolbar"><p>按账户登记开户结果。失败只退该账户首充，不退本单开户费。</p><button type="button" class="btn btn-default" data-opening-fail-all>全部失败并退款</button></div><p class="opening-result-refund" data-opening-refund-summary hidden></p><p class="opening-result-all-fail" data-opening-all-fail-hint hidden>全部账户将记为开户取消，只退各账户首充，开户费不随账户失败回退。</p>${openingAccountSlotsHtml(row, syncedAccounts)}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit data-opening-result-confirm>确认</button></div></section></div>`;
  }

  function openingReopenModal(modal, row) {
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '重开审核')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><dl class="readonly-context" data-opening-reopen-modal><div><dt>申请ID</dt><dd>${esc(row?.applyId || '-')}</dd></div><div><dt>当前状态</dt><dd>${esc(row?.status || '-')}</dd></div><div><dt>账户币种</dt><dd>${esc(row?.currency || 'USD')}</dd></div><div><dt>报价版本</dt><dd>${esc(row?.quoteVersion || '-')}</dd></div><div><dt>重开后状态</dt><dd>待运营审核</dd></div></dl></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确认重开</button></div></section></div>`;
  }

  function openingCancelModal(modal, row) {
    const captured = openingHasCapturedFunds(row);
    const feeCaptured = openingFeeCaptured(row);
    const preCaptured = openingPrechargeCaptured(row);
    const method = captured
      ? (row?.status === '扣款异常'
        ? `扣款异常取消：${feeCaptured ? '已成功的开户费走其他扣费回退' : '开户费未成功不退'}；${preCaptured ? '已成功的首充走充值失败退款' : '首充未成功不退'}。商户开户费状态不自动回退。`
        : '开户费走其他扣费回退（只退钱，不改商户开户费状态），首充充值单失败退款')
      : '不产生扣费和充值记录';
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '取消开户')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><dl class="readonly-context" data-opening-cancel-modal><div><dt>申请ID</dt><dd>${esc(row?.applyId || '-')}</dd></div><div><dt>当前状态</dt><dd>${esc(row?.status || '-')}</dd></div><div><dt>账户币种</dt><dd>${esc(row?.currency || 'USD')}</dd></div><div><dt>付款状态</dt><dd>${esc(row?.paymentStatus || '-')}</dd></div><div><dt>处理方式</dt><dd>${esc(method)}</dd></div>${captured ? `<div><dt>本单开户费</dt><dd>${esc(row?.openingFee || '-')}</dd></div><div><dt>商户开户费状态</dt><dd>${esc(openingFeeHelpers().merchantStatus(row?.merchantId))}</dd></div><div><dt>首充充值金额</dt><dd>${esc(row?.precharge || '-')}</dd></div>` : ''}</dl></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-danger" data-modal-submit>确认取消开户</button></div></section></div>`;
  }

  function openingAssetIdLabel(media) {
    return openingAssetMeta(media)?.label || '';
  }

  function openingDetailModal(title, row) {
    const visible = value => value != null && value !== '' && value !== '-';
    const item = (label, value, html = false) => visible(value) ? `<div><dt>${esc(label)}</dt><dd>${html ? value : esc(value)}</dd></div>` : '';
    const url = visible(row?.url) && /^https?:\/\//i.test(String(row.url)) ? `<a class="admin-inline-link" href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">${esc(row.url)}</a>` : esc(row?.url || '-');
    const sections = [
      ['申请信息', [
        item('申请ID', row?.applyId),
        item('客户', visible(row?.customerName) ? `${row.customerName}（${row.customerId || '-'}）` : row?.customerId),
        item('商户ID', row?.merchantId),
        item('开户费状态', row?.openingFeeStatus || openingFeeHelpers().merchantStatus(row?.merchantId)),
        item('媒体渠道', row?.mediaChannel),
        item('申请时间', row?.applyAt),
        item('投放URL', url, true),
        item(openingAssetIdLabel(row?.mediaChannel), row?.assetIds || row?.bmIds),
        item('投放国家', row?.country),
        item('时区', row?.timezone),
        item('账户币种', row?.currency || 'USD'),
        item('日预算', row?.dailyBudget),
        item('账户数', row?.accountCount),
        item('投放品类', row?.category)
      ]],
      ['报价资金', [
        item('初始报价', row?.initialQuote),
        item('最终报价', row?.finalQuote),
        item('钱包默认币种', row?.walletCurrency),
        item('自动扣款授权', row?.paymentAuth),
        item('报价版本', row?.quoteVersion),
        item('开户费', row?.openingFee),
        item('首充充值金额', row?.precharge),
        item('付款状态', row?.paymentStatus),
        item('开户费扣费单', row?.openingFeeRecord),
        item('首充充值单', row?.prechargeRecord)
      ]],
      ['处理结果', [
        item('开户状态', row?.status),
        item('客户端状态', openingClientStatus(row?.status)),
        item('开户代理', row?.agent),
        item('账户类型', row?.accountType),
        item('开户结果账户', row?.accountInfo),
        item('处理备注', row?.remark)
      ]]
    ];
    const body = sections.map(([sectionTitle, items]) => {
      const html = items.filter(Boolean).join('');
      return html ? `<section class="opening-detail-section"><h3>${esc(sectionTitle)}</h3><dl class="readonly-context readonly-context--wide">${html}</dl></section>` : '';
    }).filter(Boolean).join('');
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(title || '查看详情')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="opening-detail-stack">${body}</div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function openingRuleDetailModal(title, row) {
    const items = [
      ['规则ID', row?.ruleId],
      ['媒体渠道', row?.mediaChannel],
      ['匹配优先级', row?.priority],
      ['状态', row?.status],
      ['开户代理', row?.agent],
      ['账户类型', row?.accountType],
      ['投放国家匹配', row?.countryMatch],
      ['品类匹配', row?.categoryMatch],
      ['日预算范围', row?.dailyBudgetRange],
      ['最低首充金额', asText(row?.prechargeBasePerAccount)],
      ['币种', row?.currency || '不限'],
      ['报价版本', row?.quoteVersion],
      ['最后修改人', row?.updatedBy],
      ['最后修改时间', row?.updatedAt],
      ['备注', row?.remark]
    ];
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title || '查看详情')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><dl class="readonly-context readonly-context--wide">${items.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(asText(value))}</dd></div>`).join('')}</dl></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function locationFeeFormatRatio(raw) {
    const num = Number(String(raw == null ? '' : raw).replace(/%/g, '').trim());
    if (!Number.isFinite(num) || num < 0) return '';
    return `${num.toFixed(2)}%`;
  }

  function locationFeeSuggestTopup(row) {
    const diff = Number(String(row?.difference || '0').replace(/,/g, ''));
    return Math.max(0, Number.isFinite(diff) ? -diff : 0).toFixed(2);
  }

  function locationFeeFeishuModal(rows) {
    const seen = new Set();
    const items = [];
    (rows || []).forEach(row => {
      if (row.compareStatus !== '临界' && row.compareStatus !== '不足') return;
      const merchantId = String(row.merchantId || '');
      if (seen.has(merchantId)) return;
      seen.add(merchantId);
      items.push(row);
    });
    const notice = '每日估算跑完后发送。每个商户ID单独发一条飞书消息，并同时 @ 对应 BD 和 AM，便于在该条消息中回复跟进。只含对比状态为临界、不足的客户；差额 = 0 仍为充足，不发送。';
    const cards = items.length
      ? items.map((row, index) => `<div class="feishu-digest"><div class="feishu-digest__head"><strong>地区税费差额日报</strong><span>2026-08-31 09:05 · 消息 ${index + 1} / ${items.length} · 商户ID ${esc(row.merchantId || '-')} · ${esc(row.compareStatus)}</span></div><div class="feishu-digest__item"><div class="feishu-digest__at">@${esc(row.bd || '-')} @${esc(row.am || '-')}</div><p><strong>${esc(row.customerName || '-')}</strong> · 商户ID ${esc(row.merchantId || '-')} · ${esc(row.currency || '-')}</p><p>预估 ${esc(row.estimatedTax)} · 池 ${esc(row.poolBalance)} · 差额 ${esc(row.difference)} · ${esc(row.compareStatus)}</p><p>建议补入 ${esc(locationFeeSuggestTopup(row))} ${esc(row.currency || '')} · 入口：地区税费 / 客户预估税费&amp;预收池总览</p></div></div>`).join('')
      : '<div class="feishu-digest"><div class="feishu-digest__head"><strong>地区税费差额日报</strong><span>2026-08-31 09:05 · 今日无需发送</span></div><div class="feishu-digest__item">当前没有临界或不足客户，不发送。</div></div>';
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">飞书通知示意</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">${notice}</div><div class="feishu-digest-list">${cards}</div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function locationFeeCreateResultModal(results, ratioText, page) {
    const pageSize = 5;
    const list = results || [];
    const created = list.filter(item => item.action === '本次新增').length;
    const overwritten = list.filter(item => item.action === '覆盖现有配置').length;
    const missing = list.filter(item => item.action === '未找到').length;
    const pages = Math.max(1, Math.ceil(list.length / pageSize));
    const current = Math.min(Math.max(1, Number(page) || 1), pages);
    const slice = list.slice((current - 1) * pageSize, current * pageSize);
    const rowsHtml = slice.map(item => `<tr><td class="left">${esc(item.accountId)}</td><td class="left">${esc(item.accountName)}</td><td class="left"><span class="merchant-id">${esc(item.merchantId)}</span></td><td class="left">${esc(item.customerName)}</td><td>${esc(item.before)}</td><td>${esc(item.action)}</td><td class="ops"><button type="button" class="op-link op-link--danger" data-location-fee-result-remove="${esc(item.accountId)}">移除</button></td></tr>`).join('');
    const pageButtons = Array.from({ length: pages }, (_, index) => {
      const num = index + 1;
      return `<button class="page-number${num === current ? ' is-active' : ''}" type="button" data-location-fee-result-page="${num}">${num}</button>`;
    }).join('');
    const summary = `预收比例 ${esc(ratioText)}。本次新增 ${created} 个，覆盖现有配置 ${overwritten} 个${missing ? `，未找到 ${missing} 个` : ''}。`;
    return `<div class="modal-backdrop" data-location-fee-create-result><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">账户预收比例提交结果</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">${summary}</div><div class="table-scroll"><table class="admin-table result-table"><thead><tr><th class="left">广告账户ID</th><th class="left">广告账户名称</th><th class="left">当前商户ID</th><th class="left">客户名称</th><th>原配置</th><th>操作结果</th><th class="ops">操作</th></tr></thead><tbody>${rowsHtml || '<tr><td class="empty-state" colspan="7">没有可处理的广告账户</td></tr>'}</tbody></table></div><div class="pagination"><span>共 ${list.length} 条记录</span><div class="pagination__actions"><button class="page-number" type="button" data-location-fee-result-page="${current - 1}"${current <= 1 ? ' disabled' : ''}>‹</button>${pageButtons}<button class="page-number" type="button" data-location-fee-result-page="${current + 1}"${current >= pages ? ' disabled' : ''}>›</button></div></div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function locationFeeBatchRatioModal(count) {
    return `<div class="modal-backdrop" data-location-fee-batch-ratio><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">批量设置预收比例</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><p class="confirm-copy">将对已选 <strong>${count}</strong> 个广告账户设置预收比例。已有账户覆盖将被覆盖。</p><div class="form-grid"><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 预收比例 K%</label><input name="ratio" data-location-fee-ratio placeholder="例如 5，0 表示显式不预收"></div><p class="field-help">0% 为显式不预收，与删除（回退客户规则）不同。</p></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`;
  }

  function confirmModal(title, copy, danger, action, options = {}) {
    const confirmText = options.confirmText || '确定';
    const cancelText = options.cancelText || '取消';
    const sizeClass = options.size === 'md' ? ' modal-md' : ' modal-sm';
    return `<div class="modal-backdrop"${action ? ` data-confirm-action="${esc(action)}"` : ''}><section class="modal${sizeClass}"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="confirm-copy">${copy}</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>${esc(cancelText)}</button><button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-modal-submit>${esc(confirmText)}</button></div></section></div>`;
  }

  function isSlashTransferRecord(row) {
    return Boolean(row?.transferOrderId || /^TR\d+/.test(String(row?.c0 || '')));
  }

    function detailModal(title, row, tab) {
      if (/查看转移履历|查看处理记录/.test(title) && isSlashTransferRecord(row)) return slashTransferHistoryModal(row);
      const labelMap = new Map((tab?.columns || []).map(column => [column.key, column.label]));
      const preferredKeys = (tab?.columns || []).map(column => column.key);
      const extraKeys = tab?.hideExtraDetailFields ? [] : Object.keys(row || {}).filter(key => key !== 'ops' && key !== 'selectable' && !labelMap.has(key));
      const keys = preferredKeys.concat(extraKeys).filter(key => key in (row || {}) && key !== 'ops' && key !== 'selectable');
      const bindCardNotice = row?.bindCard === '是' ? `<div class="notice notice--warning"><strong>飞书通知增量：</strong>使用卡：${esc(row.card || row.cardSnapshot || '-')}；${esc(row.otherCards || '其他关联卡：无')}</div>` : '';
      return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">以下为按页面字段契约整理的原型信息；真实提交需以后端接口权限为准。</div>${bindCardNotice}<dl class="detail-grid">${keys.map(key => `<div><dt>${esc(labelMap.get(key) || key)}</dt><dd>${esc(asText(row[key]))}</dd></div>`).join('')}</dl></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
    }
    function slashTransferHistoryModal(row) {
      const summary = [
        ['转移单号', row.transferOrderId || row.c0],
        ['处理状态', row.transferStatus || row.c1],
        ['广告账户', `${row.c3 || '-'} / ${row.accountId || row.c2 || '-'}`],
        ['商户 / 客户', `${row.merchantId || row.c4 || '-'} / ${row.customerName || row.c5 || '-'}`],
        ['转出卡', row.c6],
        ['当前转入卡', row.c7],
        ['转移金额', row.c8],
        ['待处理金额', row.c11]
      ];
      const logs = row.transferLogs || [];
      const history = logs.length ? logs : [{ at: row.updatedAt || row.c15, operator: row.c14 || '-', action: row.transferStatus || row.c1 || '当前处理结果', status: row.transferStatus || row.c1 || '-', detail: row.c12 || '-' }];
      return `<div class="modal-backdrop"><section class="modal modal-transfer-history"><div class="modal__header"><h2 class="modal__title">额度转移履历</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">记录这笔额度转移从发起、Fund 子步骤回调到人工重试 / 换卡 / 退回的完整过程。</div><dl class="readonly-context">${summary.map(([label, itemValue]) => `<div><dt>${esc(label)}</dt><dd>${esc(asText(itemValue))}</dd></div>`).join('')}</dl><div class="transfer-history-list">${history.map(item => `<div class="transfer-history-item"><div class="transfer-history-item__line"><span class="transfer-history-item__dot"></span><strong>${esc(item.action || '-')}</strong><span class="status-tag ${/失败/.test(item.status || '') ? 'status-danger' : /处理中|退回中/.test(item.status || '') ? 'status-warning' : /成功|已取消|已退回/.test(item.status || '') ? 'status-success' : 'status-info'}">${esc(item.status || '-')}</span></div><div class="transfer-history-item__meta">${esc(item.at || '-')} · ${esc(item.operator || '-')}</div><div class="transfer-history-item__detail">${esc(item.detail || '-')}</div></div>`).join('')}</div></div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
    }

  function cardSecretModal(modal, row) {
    const cardId = row.cardId || row.c13 || '-';
    const last4 = row.cardLast4 || row.c14 || '-';
    return `<div class="modal-backdrop"><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '查看完整卡信息')}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">原型模拟飞书扫码核验流程，不展示真实卡号、密码、CVV 或有效期。</div><div class="card-secret-demo"><div class="card-secret-demo__qr">${icon('qrcode')}<span>飞书扫码确认</span></div><div class="card-secret-demo__content"><p><strong>卡 ID：</strong>${esc(cardId)}</p><p><strong>卡后四位：</strong>${esc(last4)}</p><p><strong>核验规则：</strong>校验飞书 open_id / user_id 是否在卡信息查看白名单。</p><p><strong>展示约束：</strong>120 秒倒计时自动关闭；全屏水印包含操作人、工号、IP、精确时间；关闭后移除敏感 DOM。</p><p><strong>审计：</strong>关闭弹窗后写入查看成功 / 失败审计日志。</p></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取 消</button><button type="button" class="btn btn-primary" data-modal-submit>模拟核验通过</button></div></section></div>`;
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
    const hasCustomRender = Boolean(column.format || column.formatter);
    let rendered = renderValue(column, row);
    if (row._treeLevel != null && column.key === (row._treeToggleColumn || 'c0')) {
      const toggle = row._hasChildren ? `<button class="tree-expander${row._expanded ? ' is-expanded' : ''}" type="button" data-tree-toggle="${esc(row._treeKey)}" aria-label="${row._expanded ? '收起' : '展开'}子卡">${icon('chevron-right')}</button>` : '<span class="tree-expander-spacer"></span>';
      rendered = `<span class="tree-cell tree-cell--level-${row._treeLevel}">${toggle}<span>${hasCustomRender ? rendered : esc(asText(value))}</span></span>`;
    }
    return `<td class="${column.num ? 'num ' : ''}${column.align === 'left' ? 'left ' : ''}${column.format === longText ? 'wrap' : ''}">${rendered}</td>`;
  }

  function rowActionClass(action) {
    if (/解绑|冻结|取消|删除|失败|驳回|作废/.test(action)) return 'op-link--danger';
    if (/申请|标记|确认|新增|绑定|重试|审核|开户成功|登记开户结果/.test(action)) return 'op-link--primary';
    if (/转移|转出|修改|换转入|退回|重开/.test(action)) return 'op-link--warning';
    return 'op-link--info';
  }

  function boot() {
    const root = document.getElementById('page-root');
    if (!root) return;
    const config = pageConfig();
    const tabs = config.tabs || [{ id: 'list', label: '', ...config }];
    const state = { tab: tabs[0].id, groupTab: {}, values: {}, sort: {}, selected: {}, fields: {}, expanded: {}, dragFieldKey: null, pendingAdjustment: null, pendingProcess: null, processingRow: null, processingAction: null, locationFeeCreateResult: null };
    runtimeState = state;

    function activeTab() { return tabs.find(item => item.id === state.tab) || tabs[0]; }
    function navGroups() {
      const groups = [];
      const indexByKey = new Map();
      tabs.forEach(tab => {
        if (!tab.label && !tab.navGroup) return;
        const key = tab.navGroup || tab.id;
        if (!indexByKey.has(key)) {
          indexByKey.set(key, groups.length);
          groups.push({ key, label: tab.navGroup || tab.label, tabs: [] });
        }
        groups[indexByKey.get(key)].tabs.push(tab);
      });
      return groups;
    }
    function rememberGroupTab(tabId) {
      const tab = tabs.find(item => item.id === tabId);
      if (tab?.navGroup) state.groupTab[tab.navGroup] = tabId;
    }
    function selectedSet(tab) { if (!state.selected[tab.id]) state.selected[tab.id] = new Set(); return state.selected[tab.id]; }
    function expandedSet(tab) { if (!state.expanded[tab.id]) state.expanded[tab.id] = new Set(tab.defaultExpandedKeys || []); return state.expanded[tab.id]; }
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
    function rowMatches(row, values, rangeFields, rangeValueKeys, tab) {
      const filterByKey = new Map((tab?.filters || []).map(field => [field.key, field]));
      const matchedTextFilters = Object.keys(values).every(key => {
        if (rangeValueKeys.has(key)) return true;
        const field = filterByKey.get(key);
        if (field?.match === 'ids') {
          const tokens = parseMatchTokens(values[key]).map(item => item.toLowerCase());
          if (!tokens.length) return true;
          const rowValue = String(row[field.rowKey || field.key] || '').toLowerCase();
          return tokens.includes(rowValue);
        }
        if (!(key in row)) return true;
        if (!values[key]) return true;
        const rowValue = String(row[key] || '').toLowerCase();
        const filterValues = String(values[key]).split('||').filter(Boolean).map(item => item.toLowerCase());
        return filterValues.length > 1 ? filterValues.some(item => rowValue.includes(item)) : rowValue.includes(filterValues[0] || '');
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
    }
    function treeKey(row, index) {
      return row.treeKey || row.accountId || row.c2 || `row-${index}`;
    }
    function normalizedTreeRows(tab) {
      const rawRows = tab.rows || [];
      const parentPattern = new RegExp(tab.treeParentPattern || '账户');
      const isAlreadyNested = rawRows.some(row => Array.isArray(row.children)) && rawRows.every(row => {
        const rowType = String(row.c0 || row.rowType || '');
        return !rowType || parentPattern.test(rowType);
      });
      if (isAlreadyNested) return rawRows;
      const parents = [];
      let currentParent = null;
      rawRows.forEach(row => {
        const rowType = String(row.c0 || row.rowType || '');
        if (parentPattern.test(rowType) || !currentParent) {
          currentParent = row;
          currentParent.children = [];
          parents.push(currentParent);
          return;
        }
        currentParent.children.push(row);
      });
      return parents;
    }
    function rows(tab) {
      const values = state.values[tab.id] || {};
      const rangeFields = new Map((tab.filters || []).filter(field => field.type === 'daterange').map(field => [field.key, {
        startKey: field.startKey || `${field.key}Start`,
        endKey: field.endKey || `${field.key}End`
      }]));
      const rangeValueKeys = new Set(Array.from(rangeFields.values()).flatMap(item => [item.startKey, item.endKey]));
      const sort = state.sort[tab.id];
      const sorter = (a, b) => String(a[sort.key] || '').localeCompare(String(b[sort.key] || ''), 'zh-CN', { numeric: true }) * (sort.dir === 'desc' ? -1 : 1);
      if (tab.treeRows) {
        const expanded = expandedSet(tab);
        let parents = normalizedTreeRows(tab).filter(parent => rowMatches(parent, values, rangeFields, rangeValueKeys, tab) || (parent.children || []).some(child => rowMatches(child, values, rangeFields, rangeValueKeys, tab)));
        if (sort) parents = parents.slice().sort(sorter);
        return parents.map((parent, parentIndex) => {
          const key = treeKey(parent, parentIndex);
          const parentMatches = rowMatches(parent, values, rangeFields, rangeValueKeys, tab);
          const childRows = parentMatches ? (parent.children || []) : (parent.children || []).filter(child => rowMatches(child, values, rangeFields, rangeValueKeys, tab));
          parent._treeLevel = 0;
          parent._treeKey = key;
          parent._treeToggleColumn = tab.treeToggleColumnKey || 'c0';
          parent._expanded = expanded.has(key);
          parent._hasChildren = Boolean((parent.children || []).length);
          parent._visibleChildren = childRows;
          childRows.forEach((child, childIndex) => {
            child._treeLevel = 1;
            child._treeKey = `${key}-${childIndex}`;
            child._treeParentKey = key;
            child._treeChildIndex = childIndex;
            Object.defineProperty(child, '_treeParent', { value: parent, enumerable: false, configurable: true });
          });
          return parent;
        });
      }
      let result = (tab.rows || []).filter(row => rowMatches(row, values, rangeFields, rangeValueKeys, tab));
      if (sort) result = result.slice().sort(sorter);
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
    function syncOpeningRuleConfigPreview(modalRoot) {
      if (!modalRoot) return;
      const base = numAmount(modalRoot.querySelector('[name="prechargeBasePerAccount"]')?.value);
      const currency = modalRoot.querySelector('[name="currency"]')?.value || 'USD';
      const previewBase = modalRoot.querySelector('[data-rule-preview-base]');
      const previewNote = modalRoot.querySelector('[data-rule-preview-note]');
      if (previewBase) previewBase.textContent = formatMoney(base, currency);
      if (previewNote) previewNote.textContent = '报价等于开户费加最低首充乘以账户数。日预算只用于匹配规则，不参与金额计算。0 表示该规则没有首充要求。开户费为全站一口价，不在本规则上配置。';
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
        const input = row.querySelector('[data-recharge-account]');
        if (input && (!visible || input.disabled)) input.checked = false;
        if (visible) visibleCount += 1;
      });
      const empty = modalRoot.querySelector('[data-recharge-empty]');
      if (empty) empty.hidden = visibleCount > 0;
      const count = modalRoot.querySelector('[data-recharge-count]');
      if (count) count.textContent = `共 ${visibleCount} 条记录`;
      refreshRechargeAmounts(modalRoot);
    }
    function syncOpeningRulePreview(modalRoot, changedSelect) {
      if (!modalRoot) return;
      if (modalRoot.dataset.openingAuditMode === 'manual') {
        applyOpeningAuditQuote(modalRoot, openingSelectedRule(state.processingRow, modalRoot), state.processingRow);
        return;
      }
      const preview = modalRoot.querySelector('[data-opening-rule-preview]');
      const options = JSON.parse(preview?.dataset.openingRuleOptions || '[]');
      if (!options.length) return;
      const agentSelect = modalRoot.querySelector('[data-opening-agent]');
      const typeSelect = modalRoot.querySelector('[data-opening-type]');
      const changedKey = changedSelect?.value || changedSelect?.selectedOptions?.[0]?.dataset.ruleKey;
      const fallback = agentSelect?.value || typeSelect?.value || '';
      const selected = options.find(option => openingRuleKey(option) === changedKey)
        || options.find(option => openingRuleKey(option) === fallback)
        || options[0];
      const selectedKey = openingRuleKey(selected);
      if (agentSelect) agentSelect.value = selectedKey;
      if (typeSelect) typeSelect.value = selectedKey;
      applyOpeningAuditQuote(modalRoot, selected, state.processingRow, { reset: true });
    }
    function toggleOpeningAccountSource(sourceSelect) {
      const slot = sourceSelect?.closest('[data-opening-account-slot]') || sourceSelect?.closest('[data-opening-result-modal]');
      if (!slot) return;
      const source = sourceSelect?.value || slot.querySelector('[data-opening-account-source]')?.value || 'synced';
      slot.querySelectorAll('[data-opening-synced-panel]').forEach(node => { node.hidden = source !== 'synced'; });
      slot.querySelectorAll('[data-opening-manual-panel]').forEach(node => { node.hidden = source !== 'manual'; });
    }
    function syncOpeningResultFailState(modalRoot) {
      if (!modalRoot) return;
      const slots = Array.from(modalRoot.querySelectorAll('[data-opening-account-slot]'));
      const refund = slots.reduce((sum, slot) => {
        const failed = Boolean(slot.querySelector('[data-opening-slot-failed]')?.checked);
        slot.classList.toggle('is-failed', failed);
        if (!failed) return sum;
        return {
          count: sum.count + 1,
          precharge: sum.precharge + numAmount(slot.dataset.openingPrecharge)
        };
      }, { count: 0, precharge: 0 });
      const allFailed = slots.length > 0 && refund.count === slots.length;
      const hint = modalRoot.querySelector('[data-opening-all-fail-hint]');
      if (hint) {
        hint.hidden = !allFailed;
        if (allFailed) hint.textContent = `全部账户将记为开户取消，只退回首充 ${formatAmountOnly(refund.precharge)}。开户费不随账户失败回退。`;
      }
      const summary = modalRoot.querySelector('[data-opening-refund-summary]');
      if (summary) {
        const showPartial = refund.count > 0 && !allFailed;
        summary.hidden = !showPartial;
        if (showPartial) summary.textContent = `已标记 ${refund.count} 个失败账户，将退回首充 ${formatAmountOnly(refund.precharge)}。开户费不随账户失败回退。`;
      }
      const failAllBtn = modalRoot.querySelector('[data-opening-fail-all]');
      if (failAllBtn) failAllBtn.textContent = allFailed ? '取消全部失败标记' : '全部失败并退款';
      const confirm = modalRoot.closest('.modal')?.querySelector('[data-opening-result-confirm]');
      if (confirm) {
        confirm.textContent = allFailed ? '确认全部失败并退款' : '确认';
        confirm.classList.toggle('btn-danger', allFailed);
        confirm.classList.toggle('btn-primary', !allFailed);
      }
    }
    function toggleOpeningResultAllFailed(modalRoot) {
      if (!modalRoot) return;
      const boxes = Array.from(modalRoot.querySelectorAll('[data-opening-slot-failed]'));
      if (!boxes.length) return;
      const nextFailed = !boxes.every(input => input.checked);
      boxes.forEach(input => {
        input.checked = nextFailed;
        const success = input.closest('[data-opening-account-slot]')?.querySelector('[data-opening-slot-success]');
        if (success) success.hidden = nextFailed;
      });
      syncOpeningResultFailState(modalRoot);
    }
    function toggleOpeningSlotFailed(checkbox) {
      const slot = checkbox?.closest('[data-opening-account-slot]');
      if (!slot) return;
      const success = slot.querySelector('[data-opening-slot-success]');
      if (success) success.hidden = Boolean(checkbox.checked);
      syncOpeningResultFailState(slot.closest('[data-opening-result-modal]'));
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
        list.innerHTML = checked.map(input => `<div class="recharge-amount-card" data-recharge-amount-card data-account-id="${esc(input.value)}" data-account-name="${esc(input.dataset.accountName || '')}" data-customer-id="${esc(input.dataset.customerId || '')}" data-customer-name="${esc(input.dataset.customerName || '')}" data-merchant-id="${esc(input.dataset.merchantId || '')}" data-currency="${esc(input.dataset.currency || 'USD')}" data-service-rate="${esc(input.dataset.serviceRate || '0')}" data-pre-tax-rate="${esc(input.dataset.preTaxRate || '0')}" data-verify-status="${esc(input.dataset.verifyStatus || '')}" data-card-label="${esc(input.dataset.cardLabel || '')}" data-other-cards="${esc(input.dataset.otherCards || '')}"><div class="recharge-amount-info"><strong>${esc(input.dataset.accountName || input.value)}</strong><div class="recharge-amount-meta"><span>当前余额：${esc(input.dataset.balance || '-')} ${esc(input.dataset.currency || '')}</span><span>服务费：<b data-service-fee>-</b></span><span>预收税费：<b data-pre-tax-fee>-</b></span><span>实际到账：<b data-actual-amount>-</b></span></div></div><input type="text" inputmode="decimal" placeholder="输入充值金额" data-recharge-amount-input></div>`).join('');
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
    function formatAmountOnly(value) {
      return Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function numAmount(value) {
      const normalized = String(value == null ? '' : value).replace(/,/g, '').replace(/[^\d.-]/g, '').trim();
      const amount = Number(normalized);
      return Number.isFinite(amount) ? amount : 0;
    }
    function bindCardId(row) { return row?.cardId || row?.c13 || ''; }
    function bindCardLast4(row) { return row?.cardLast4 || row?.c14 || '-'; }
    function bindCardStatus(row) { return row?.verifyStatus || row?.c22 || '未申请'; }
    function bindCardCardStatus(row) { return row?.cardStatus || row?.c19 || '正常'; }
    function bindCardVerifyAmount(row) { return numAmount(row?.verifyAmount || row?.c21); }
    function bindCardPreVerifyLimit(row) { return numAmount(row?.preVerifyLimit) || 1; }
    function bindCardTotalLimit(row) { return numAmount(row?.c16); }
    function bindCardUsedAmount(row) { return numAmount(row?.c17); }
    function bindCardAvailableAmount(row) { return numAmount(row?.c18); }
    function bindCardIsCardRow(row) { const id = bindCardId(row); return Boolean(id && id !== '-'); }
    function bindCardBlockedStatus(statusText) { return /待审批|审批中|抬额中|抬额失败|待验卡/.test(String(statusText || '')); }
    function bindCardUnrecoveredStatus(statusText) { return /已验卡|已充值关单|回收失败/.test(String(statusText || '')); }
    function bindCardTransferLimit(row) {
      if (!row || row.canTransfer === false) return 0;
      const total = bindCardTotalLimit(row);
      const available = bindCardAvailableAmount(row);
      return Math.max(0, Math.min(available, total - 1));
    }
    function canBindCardTransfer(row) {
      return bindCardIsCardRow(row)
        && row.canTransfer !== false
        && bindCardCardStatus(row) === '正常'
        && !bindCardBlockedStatus(bindCardStatus(row))
        && bindCardTransferLimit(row) > 0;
    }
    function bindCardParentForRow(row) {
      const tab = activeTab();
      const accountId = row?.accountId || row?.c2;
      return normalizedTreeRows(tab).find(parent => parent === row || (parent.children || []).includes(row) || (accountId && (parent.accountId === accountId || parent.c2 === accountId)));
    }
    function bindCardCardsForRow(row) {
      const direct = (row?.children || []).filter(bindCardIsCardRow);
      if (direct.length) return direct;
      return (bindCardParentForRow(row)?.children || []).filter(bindCardIsCardRow);
    }
    function bindCardTransferOption(row) {
      const statusText = bindCardStatus(row);
      const limit = bindCardTransferLimit(row);
      const verifyAmount = bindCardVerifyAmount(row);
      return {
        value: bindCardId(row),
        label: `${bindCardId(row)}(${bindCardLast4(row)})｜${statusText}｜可转 ${formatMoney(limit, row?.c15 || 'USD')}`,
        max: limit,
        status: statusText,
        verifyAmount
      };
    }
    function bindCardTransferFromOptions(row) {
      const cards = bindCardCardsForRow(row).filter(canBindCardTransfer);
      if (cards.length) return cards.map(bindCardTransferOption);
      return (row?.transferFromOptions || []).map(option => typeof option === 'string' ? { value: option, label: option, max: numAmount(option), status: '-' } : option);
    }
    function bindCardTransferToOptions(row, excludeValue = '') {
      const cards = bindCardCardsForRow(row).filter(card => bindCardIsCardRow(card) && bindCardCardStatus(card) === '正常' && !bindCardBlockedStatus(bindCardStatus(card)) && bindCardId(card) !== excludeValue);
      if (cards.length) return cards.map(card => ({ value: bindCardId(card), label: `${bindCardId(card)}(${bindCardLast4(card)})｜${bindCardStatus(card)}｜可用 ${formatMoney(bindCardAvailableAmount(card), card.c15 || 'USD')}`, status: bindCardStatus(card) }));
      return (row?.transferToOptions || []).map(option => typeof option === 'string' ? { value: option, label: option, status: '-' } : option).filter(option => option.value !== excludeValue);
    }
    function bindCardTransferWarning(row) {
      if (row?.transferWarning) return row.transferWarning;
      const statusText = bindCardStatus(row);
      if (!bindCardUnrecoveredStatus(statusText)) return '';
      const verifyAmount = bindCardVerifyAmount(row);
      return `该卡验卡额度状态为「${statusText}」，仍存在未回收验卡额度${verifyAmount ? ` ${formatMoney(verifyAmount, row?.c15 || 'USD')}` : ''}。转出前请确认媒体退款和 Slash 可用额度，系统只强提醒，不硬拦截。`;
    }
    function setBindCardAmounts(row, total, used, available) {
      row.c16 = formatAmountOnly(total);
      row.c17 = formatAmountOnly(used);
      row.c18 = formatAmountOnly(available);
    }
    function rechargeBlockedStatus(statusText) {
      return /待审批|审批中|抬额中|抬额失败|待验卡/.test(String(statusText || ''));
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
    function debitFxToUsd(currency) {
      return ({ USD: 1, EUR: 1.143, GBP: 1.27 }[currency] || 1);
    }
    function convertDebitToWallet(amount, fromCurrency, walletCurrency) {
      const usd = Number(amount || 0) * debitFxToUsd(fromCurrency);
      const wallet = usd / debitFxToUsd(walletCurrency);
      return Math.round(wallet * 100) / 100;
    }
    function formatDebitListAmount(value) {
      const amount = Number(value || 0);
      if (!Number.isFinite(amount)) return '0';
      return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
    }
    function formatDebitTotalByCurrency(amounts) {
      const entries = Object.entries(amounts).filter(([, value]) => value > 0);
      if (!entries.length) return '0.00';
      return entries.map(([currency, value]) => `${formatAmountOnly(value)} ${currency}`).join(' + ');
    }
    function selectedDebitCustomer(modalRoot) {
      const option = modalRoot?.querySelector('[data-debit-customer]')?.selectedOptions?.[0];
      if (!option || !option.value) return null;
      return {
        id: option.value,
        name: option.dataset.customerName || '-',
        merchantId: option.dataset.merchantId || option.value,
        walletCurrency: option.dataset.walletCurrency || 'USD',
        currentBalance: numAmount(option.dataset.currentBalance),
        availableAmount: numAmount(option.dataset.availableAmount),
        realAmount: numAmount(option.dataset.realAmount),
        creditLimit: numAmount(option.dataset.creditLimit),
        usedLimit: numAmount(option.dataset.usedLimit)
      };
    }
    function debitItemValues(card) {
      return {
        feeType: card.querySelector('[data-debit-type]')?.value || '',
        currency: card.querySelector('[data-debit-currency]')?.value || '',
        feeAmount: parseAmount(card.querySelector('[data-debit-amount]')?.value),
        remark: card.querySelector('[data-debit-remark]')?.value.trim() || '-'
      };
    }
    function syncBatchDebitItems(modalRoot) {
      if (!modalRoot) return;
      const cards = Array.from(modalRoot.querySelectorAll('[data-debit-item]'));
      cards.forEach((card, index) => {
        const label = card.querySelector('[data-debit-item-label]');
        if (label) label.textContent = `扣费 ${index + 1}`;
        const remove = card.querySelector('[data-debit-remove]');
        if (remove) remove.hidden = cards.length <= 1;
      });
    }
    function refreshBatchDebitWallet(modalRoot) {
      if (!modalRoot) return;
      const customer = selectedDebitCustomer(modalRoot);
      const wallet = modalRoot.querySelector('[data-debit-wallet]');
      if (wallet) wallet.hidden = !customer;
      if (!customer) {
        refreshBatchDebitTotal(modalRoot);
        return;
      }
      const setText = (selector, value) => {
        const node = modalRoot.querySelector(selector);
        if (node) node.textContent = value;
      };
      setText('[data-debit-wallet-currency]', customer.walletCurrency);
      setText('[data-debit-current-balance]', formatAmountOnly(customer.currentBalance));
      setText('[data-debit-available-amount]', formatAmountOnly(customer.availableAmount));
      setText('[data-debit-real-amount]', formatAmountOnly(customer.realAmount));
      setText('[data-debit-credit-limit]', formatAmountOnly(customer.creditLimit));
      setText('[data-debit-used-limit]', formatAmountOnly(customer.usedLimit));
      setText('[data-debit-remaining-limit]', formatAmountOnly(Math.max(0, customer.creditLimit - customer.usedLimit)));
      modalRoot.querySelectorAll('[data-debit-item]').forEach(card => {
        const amount = card.querySelector('[data-debit-amount]')?.value.trim();
        const select = card.querySelector('[data-debit-currency]');
        if (select && !amount) select.value = customer.walletCurrency;
      });
      refreshBatchDebitTotal(modalRoot);
    }
    function refreshBatchDebitTotal(modalRoot) {
      if (!modalRoot) return;
      const customer = selectedDebitCustomer(modalRoot);
      const totals = {};
      let walletTotal = 0;
      let count = 0;
      modalRoot.querySelectorAll('[data-debit-item]').forEach(card => {
        const item = debitItemValues(card);
        if (!item.feeAmount || !item.currency) return;
        totals[item.currency] = (totals[item.currency] || 0) + item.feeAmount;
        walletTotal += convertDebitToWallet(item.feeAmount, item.currency, customer?.walletCurrency || item.currency);
        count += 1;
      });
      const totalNode = modalRoot.querySelector('[data-debit-total]');
      const walletNode = modalRoot.querySelector('[data-debit-wallet-total]');
      if (totalNode) totalNode.textContent = count ? `${formatDebitTotalByCurrency(totals)}（${count} 笔）` : '0.00';
      if (walletNode) walletNode.textContent = customer && count ? `${formatAmountOnly(walletTotal)} ${customer.walletCurrency}` : '-';
    }
    function addBatchDebitItem(modalRoot) {
      const list = modalRoot?.querySelector('[data-debit-item-list]');
      const last = list?.querySelector('[data-debit-item]:last-child');
      if (!list || !last) return;
      const clone = last.cloneNode(true);
      clone.querySelectorAll('input, select').forEach(node => {
        if (node.matches('[data-debit-currency]')) {
          const customer = selectedDebitCustomer(modalRoot);
          node.value = customer?.walletCurrency || node.value || 'USD';
          return;
        }
        node.value = '';
      });
      list.appendChild(clone);
      syncBatchDebitItems(modalRoot);
      refreshBatchDebitTotal(modalRoot);
    }
    function removeBatchDebitItem(button) {
      const modalRoot = button.closest('[data-debit-modal]');
      const card = button.closest('[data-debit-item]');
      const list = modalRoot?.querySelector('[data-debit-item-list]');
      if (!modalRoot || !card || !list || list.querySelectorAll('[data-debit-item]').length <= 1) return;
      card.remove();
      syncBatchDebitItems(modalRoot);
      refreshBatchDebitTotal(modalRoot);
    }
    function submitBatchDebitModal(modalRoot, tab) {
      const customer = selectedDebitCustomer(modalRoot);
      if (!customer) { showToast('请先选择客户', 'error'); return false; }
      const cards = Array.from(modalRoot.querySelectorAll('[data-debit-item]'));
      const items = [];
      for (const [index, card] of cards.entries()) {
        const type = card.querySelector('[data-debit-type]')?.value || '';
        const currency = card.querySelector('[data-debit-currency]')?.value || '';
        const amountText = card.querySelector('[data-debit-amount]')?.value.trim() || '';
        const amount = parseAmount(amountText);
        if (!type) { showToast(`请选择第 ${index + 1} 笔扣费类型`, 'error'); return false; }
        if (!currency) { showToast(`请选择第 ${index + 1} 笔扣费币种`, 'error'); return false; }
        if (!amountText || !amount) { showToast(`请输入第 ${index + 1} 笔大于 0 的扣费金额`, 'error'); return false; }
        items.push({
          feeType: type,
          currency,
          feeAmount: amount,
          remark: card.querySelector('[data-debit-remark]')?.value.trim() || '-'
        });
      }
      if (!items.length) { showToast('请至少添加一笔扣费', 'error'); return false; }
      const walletTotal = items.reduce((sum, item) => sum + convertDebitToWallet(item.feeAmount, item.currency, customer.walletCurrency), 0);
      if (walletTotal > customer.availableAmount) {
        showToast(`预计钱包扣款 ${formatAmountOnly(walletTotal)} ${customer.walletCurrency} 超过可用金额 ${formatAmountOnly(customer.availableAmount)} ${customer.walletCurrency}`, 'error');
        return false;
      }
      const time = currentTimestamp();
      const newRows = items.map(item => ({
        merchantId: customer.merchantId,
        customerName: customer.name,
        feeTime: time,
        feeType: item.feeType,
        currency: item.currency,
        feeAmount: formatDebitListAmount(item.feeAmount),
        walletCurrency: customer.walletCurrency,
        walletAmount: formatDebitListAmount(convertDebitToWallet(item.feeAmount, item.currency, customer.walletCurrency)),
        status: '扣费成功',
        remark: item.remark,
        operator: '管理员',
        rollbackTime: '-',
        rollbackOperator: '-',
        rollbackReason: '-',
        ops: ['查看详情', '回退']
      }));
      tab.rows = newRows.concat(tab.rows || []);
      selectedSet(tab).clear();
      render();
      showToast(`已生成 ${newRows.length} 笔其他扣费（原型）`, 'success');
      return true;
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
    function submitRechargeModal(modalRoot, tab) {
      const select = modalRoot.querySelector('[data-recharge-customer]');
      const option = select?.selectedOptions?.[0];
      const selectedAccounts = Array.from(modalRoot.querySelectorAll('[data-recharge-account]:checked'));
      if (!select?.value) { showToast('请先选择客户', 'error'); return false; }
      if (!selectedAccounts.length) { showToast('请至少选择一个可充值广告账户', 'error'); return false; }
      const blocked = selectedAccounts.find(input => rechargeBlockedStatus(input.dataset.verifyStatus));
      if (blocked) {
        showToast(blocked.dataset.gateReason || '使用卡验卡任务处于待验卡/审批中，需先标记媒体已验证后再充值', 'error');
        return false;
      }
      const cards = Array.from(modalRoot.querySelectorAll('[data-recharge-amount-card]'));
      const time = currentTimestamp();
      const newRows = [];
      cards.forEach((card, index) => {
        const amountValue = parseAmount(card.querySelector('[data-recharge-amount-input]')?.value);
        if (!amountValue) return;
        const currency = card.dataset.currency || 'USD';
        const serviceRate = Number(card.dataset.serviceRate || 0);
        const preTaxRate = Number(card.dataset.preTaxRate || 0);
        const serviceFee = amountValue * serviceRate / 100;
        const preTaxFee = amountValue * preTaxRate / 100;
        const actualAmount = Math.max(0, amountValue - serviceFee - preTaxFee);
        const cardLabel = card.dataset.cardLabel || '-';
        const otherCards = card.dataset.otherCards || '其他关联卡：无';
        const autoClose = /已验卡/.test(card.dataset.verifyStatus || '');
        newRows.push({
          orderId: `AD-PROTO-${Date.now()}-${index + 1}`,
          customerId: card.dataset.customerId || select.value,
          customerName: card.dataset.customerName || option?.dataset.customerName || '-',
          merchantId: card.dataset.merchantId || option?.dataset.merchantId || '-',
          submitter: '管理员(admin@bestfulfill.com)',
          submittedAt: time,
          accountId: card.dataset.accountId || '-',
          accountName: card.dataset.accountName || '-',
          bindCard: cardLabel && cardLabel !== '-' ? '是' : '否',
          card: cardLabel,
          otherCards,
          currency,
          agent: '-',
          amount: formatAmountOnly(amountValue),
          preTaxRate: `${formatAmountOnly(preTaxRate)}%`,
          preTaxFee: formatAmountOnly(preTaxFee),
          accountFeeRate: `${formatAmountOnly(serviceRate)}%`,
          agentFeeRate: '0.00%',
          totalFee: formatAmountOnly(serviceFee),
          companyFee: formatAmountOnly(serviceFee),
          agentFee: '0.00',
          actualAmount: formatAmountOnly(actualAmount),
          walletCurrency: currency,
          walletAmount: formatAmountOnly(amountValue),
          status: '完成',
          completedAt: time,
          remark: autoClose ? `验卡任务已关单为「已充值关单(未回收)」；飞书通知：使用卡 ${cardLabel}；${otherCards}` : '原型新增充值工单',
          ops: ['查看详情', '标记状态']
        });
      });
      if (!newRows.length) { showToast('请输入充值金额', 'error'); return false; }
      tab.rows = newRows.concat(tab.rows || []);
      selectedSet(tab).clear();
      render();
      const autoClosedCount = newRows.filter(row => /已充值关单/.test(row.remark || '')).length;
      showToast(`已新增 ${newRows.length} 条充值工单（原型）${autoClosedCount ? `；${autoClosedCount} 个已验卡任务已关单为「已充值关单(未回收)」` : ''}`, 'success');
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
    function openingRuleOpsForStatus(statusValue) {
      return statusValue === '停用' ? ['编辑', '复制', '启用', '查看详情'] : ['编辑', '复制', '停用', '查看详情'];
    }
    function refreshOpeningRuleRow(row) {
      if (!row) return;
      row.dailyBudgetRange = formatOpeningBudgetRange(row);
      row.ops = openingRuleOpsForStatus(row.status);
    }
    function openingRuleIdPrefix(mediaChannel) {
      if (mediaChannel === 'Google') return 'OR-GG';
      if (mediaChannel === 'TikTok') return 'OR-TT';
      if (mediaChannel === 'Snapchat') return 'OR-SC';
      if (mediaChannel === 'AppLovin') return 'OR-AL';
      if (mediaChannel === 'Taboola') return 'OR-TB';
      if (mediaChannel === 'Outbrain') return 'OR-OB';
      if (mediaChannel === 'X') return 'OR-X';
      if (mediaChannel === '其他媒体') return 'OR-OM';
      return 'OR-FB';
    }
    function submitOpeningRuleConfig(modalRoot, tab) {
      const row = state.processingRow;
      const mode = modalRoot?.dataset.ruleMode || 'edit';
      const form = new FormData();
      modalRoot?.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => form.set(input.name, input.value.trim()));
      const requiredKeys = ['mediaChannel', 'priority', 'status', 'agent', 'accountType', 'countryMatch', 'categoryMatch', 'prechargeBasePerAccount', 'currency'];
      const missing = requiredKeys.find(key => !String(form.get(key) || '').trim());
      if (missing) { showToast('请完整填写必填规则字段', 'error'); return false; }
      const priority = String(form.get('priority') || '').trim();
      if (!/^[1-9]\d{0,2}$/.test(priority) || Number(priority) > 999) {
        showToast('匹配优先级需填写 1-999 的正整数，数值越小越优先', 'error');
        return false;
      }
      const prechargeText = String(form.get('prechargeBasePerAccount') || '').trim();
      if (!isOpeningBudgetNumber(prechargeText)) {
        showToast('最低首充金额需为不小于 0 的数字，可填写 0', 'error');
        return false;
      }
      const mediaChannel = String(form.get('mediaChannel') || '').trim();
      const statusValue = String(form.get('status') || '').trim();
      if (statusValue === '启用') {
        const conflict = (tab.rows || []).some(item => {
          if (mode === 'edit' && row && item === row) return false;
          return item.mediaChannel === mediaChannel && item.status === '启用' && String(item.priority) === priority;
        });
        if (conflict) {
          showToast('同一媒体启用规则的匹配优先级不可重复', 'error');
          return false;
        }
      }
      const budget = readOpeningBudgetRange(modalRoot);
      if (budget.mode === 'min') {
        if (!budget.min) { showToast('请填写日预算下限', 'error'); return false; }
        if (!isOpeningBudgetNumber(budget.min)) { showToast('日预算下限需为不小于 0 的数字', 'error'); return false; }
        if (Number(budget.min) === 0) { showToast('0 以上等同于不限，请改选「不限」', 'error'); return false; }
      }
      if (budget.mode === 'range') {
        if (!budget.min || !budget.max) { showToast('请填写日预算区间的下限和上限', 'error'); return false; }
        if (!isOpeningBudgetNumber(budget.min) || !isOpeningBudgetNumber(budget.max)) { showToast('日预算区间需为不小于 0 的数字', 'error'); return false; }
        if (Number(budget.max) < Number(budget.min)) { showToast('日预算上限不能小于下限', 'error'); return false; }
      }
      const target = mode === 'edit' && row ? row : {};
      ['mediaChannel', 'priority', 'status', 'agent', 'accountType', 'countryMatch', 'categoryMatch', 'prechargeBasePerAccount', 'currency', 'remark'].forEach(key => {
        target[key] = String(form.get(key) || '').trim();
      });
      target.minDailyBudget = budget.min;
      target.maxDailyBudget = budget.max;
      target.quoteVersion = openingRuleQuoteVersion();
      target.updatedAt = currentTimestamp();
      target.updatedBy = '管理员(admin@bestfulfill.com)';
      if (mode !== 'edit') {
        const nextNo = String((tab.rows || []).length + 1).padStart(3, '0');
        target.ruleId = `${openingRuleIdPrefix(target.mediaChannel)}-${nextNo}`;
        tab.rows = [target].concat(tab.rows || []);
      }
      refreshOpeningRuleRow(target);
      if (Array.isArray(window.BESTADS_OPENING_RULES)) window.BESTADS_OPENING_RULES = tab.rows;
      state.processingRow = null;
      state.processingAction = null;
      closeModal();
      render();
      showToast(mode === 'copy' ? '已复制账户规则（原型）' : mode === 'create' ? '已新增账户规则（原型）' : '已保存账户规则（原型）', 'success');
      return true;
    }
    function submitOpeningFeeConfig(modalRoot) {
      const amount = numAmount(modalRoot?.querySelector('[data-opening-fee-amount]')?.value);
      const currency = modalRoot?.querySelector('[data-opening-fee-currency]')?.value || 'USD';
      if (amount < 0) {
        showToast('开户费不能为负数', 'error');
        return false;
      }
      window.BESTADS_OPENING_FEE = { amount, currency };
      closeModal();
      render();
      showToast('已更新全站开户费。只影响之后未收取商户的新报价（原型）', 'success');
      return true;
    }
    function submitOpeningApplyCreate(modalRoot) {
      const tab = activeTab();
      const merchantSel = modalRoot?.querySelector('[data-opening-merchant]');
      const customerSel = modalRoot?.querySelector('[data-opening-customer]');
      const mediaSel = modalRoot?.querySelector('[data-opening-media]');
      const categorySel = modalRoot?.querySelector('[data-opening-category]');
      const merchantId = merchantSel?.value || '';
      const customerId = customerSel?.value || '';
      const mediaChannel = mediaSel?.value || '';
      const category = categorySel?.value || '';
      const url = modalRoot?.querySelector('[data-opening-url]')?.value.trim() || '';
      const country = modalRoot?.querySelector('[data-opening-country]')?.value.trim() || '';
      const timezone = modalRoot?.querySelector('[data-opening-timezone]')?.value.trim() || '';
      const currency = modalRoot?.querySelector('[data-opening-currency]')?.value || 'USD';
      const budgetRaw = String(modalRoot?.querySelector('[data-opening-budget]')?.value || '').trim();
      const countRaw = String(modalRoot?.querySelector('[data-opening-count]')?.value || '').trim();
      const highlight = el => { if (el) { el.style.outline = '2px solid var(--admin-danger)'; el.focus(); } };
      if (!merchantId) { highlight(merchantSel); showToast('请选择商户ID', 'error'); return false; }
      if (!customerId) { highlight(customerSel); showToast('请选择客户', 'error'); return false; }
      if (!mediaChannel) { highlight(mediaSel); showToast('请选择媒体渠道', 'error'); return false; }
      if (!url) { highlight(modalRoot.querySelector('[data-opening-url]')); showToast('请输入投放URL', 'error'); return false; }
      if (!country) { highlight(modalRoot.querySelector('[data-opening-country]')); showToast('请选择投放国家', 'error'); return false; }
      if (!timezone) { highlight(modalRoot.querySelector('[data-opening-timezone]')); showToast('请选择时区', 'error'); return false; }
      if (!budgetRaw || Number(budgetRaw) < 0 || !Number.isFinite(Number(budgetRaw))) { highlight(modalRoot.querySelector('[data-opening-budget]')); showToast('请输入有效日预算', 'error'); return false; }
      const accountCount = Number(countRaw);
      if (!countRaw || !Number.isInteger(accountCount) || accountCount < 1 || accountCount > 20) { highlight(modalRoot.querySelector('[data-opening-count]')); showToast('账户数需为 1 到 20 的整数', 'error'); return false; }
      if (!category) { highlight(categorySel); showToast('请选择投放品类', 'error'); return false; }
      const customerOption = customerSel.selectedOptions?.[0];
      const customerName = customerOption?.dataset.customerName || '-';
      const assetMeta = openingAssetMeta(mediaChannel);
      const assetIds = assetMeta ? parseOpeningAssetIds(modalRoot.querySelector('[data-opening-bm-ids]')?.value || '').join(' / ') : '';
      const autoPay = Boolean(modalRoot.querySelector('[data-opening-auto-pay]')?.checked);
      const breakdown = estimateOpeningApplyQuote(modalRoot);
      const date = currentTimestamp().slice(0, 10).replace(/-/g, '');
      const seq = String((tab.rows || []).length + 1).padStart(3, '0');
      const applyId = `AO${date}${seq}`;
      const merchantQuote = openingFeeHelpers().quoteForMerchant(merchantId);
      const walletCurrency = openingWalletCurrency(merchantId);
      const feeNote = merchantQuote.status === '未收取'
        ? `商户未收取开户费，本单预估带出全站开户费 ${openingFeeHelpers().formatAmount(merchantQuote.amount)}`
        : merchantQuote.status === '不收取'
          ? '商户开户费状态为不收取，本单开户费默认为 0'
          : '该商户已收取过开户费';
      const matchNote = breakdown.matched ? '' : '；未命中账户规则，预估合计为 -（待审核定价），由审核确认最终费用';
      const row = {
        applyId,
        customerId,
        customerName,
        merchantId,
        openingFeeStatus: merchantQuote.status,
        mediaChannel,
        applyAt: currentTimestamp(),
        status: '待运营审核',
        paymentStatus: '未扣款',
        url,
        assetIds: assetIds || '-',
        country,
        timezone,
        dailyBudget: budgetRaw,
        currency,
        accountCount: String(accountCount),
        category,
        initialQuote: breakdown.matched ? Number(breakdown.walletTotal).toFixed(2) : '-（待审核定价）',
        initialWalletTotal: breakdown.matched ? Number(breakdown.walletTotal).toFixed(2) : '-',
        walletCurrency,
        finalQuote: '-',
        quoteVersion: `Q-${date}-${seq}`,
        agent: '-',
        accountType: '-',
        openingFee: '-',
        precharge: '-',
        openingFeeRecord: '-',
        prechargeRecord: '-',
        accountInfo: '-',
        paymentAuth: autoPay ? '已同意金额一致时自动扣款' : '未授权自动扣款，待最终报价后确认',
        remark: `内部代客户提交；${autoPay ? '客户已同意金额一致时自动扣款' : '未授权自动扣款，待最终报价后确认'}；${feeNote}${matchNote}`
      };
      refreshOpeningRow(row);
      tab.rows = [row].concat(tab.rows || []);
      closeModal();
      render();
      showToast('开户申请已提交（原型）', 'success');
      return true;
    }
    function submitOpeningAudit(modalRoot) {
      const row = state.processingRow;
      if (!row) { showToast('未找到开户申请', 'error'); return false; }
      const mode = modalRoot?.dataset.openingAuditMode || 'matched';
      const rule = openingSelectedRule(row, modalRoot);
      const quote = openingAuditQuoteValues(modalRoot, rule, row);
      if (quote.openingFee < 0 || quote.precharge < 0) {
        showToast('开户费和首充不能为负数', 'error');
        return false;
      }
      if (mode === 'manual' && !quote.edited) {
        showToast('当前无命中规则，请点击修改后确认首充金额', 'error');
        return false;
      }
      if (mode === 'manual' && !(rule.agent && rule.accountType)) {
        showToast('请选择代理和账户类型', 'error');
        return false;
      }
      let nextQuote = { ...quote, edited: quote.edited };
      const liveQuote = openingFeeHelpers().quoteForMerchant(row.merchantId);
      if (!quote.edited && liveQuote.status === '已收取' && quote.openingFee > 0) {
        nextQuote = openingAuditQuoteValues(modalRoot, { ...rule, openingFee: 0, precharge: quote.precharge }, row);
        nextQuote.openingFee = 0;
        nextQuote.edited = false;
        nextQuote.forcedConfirm = true;
      }
      let outcome = openingAuditOutcome(row, nextQuote);
      if (nextQuote.forcedConfirm) {
        outcome = { type: 'confirm', status: '待客户确认付款', label: '开户费已改 0，客户确认付款', note: '扣款时商户已收取开户费，本单开户费改为 0，需客户确认。' };
      }
      if (outcome.type === 'auto' && !openingHasDefaultWallet(row.merchantId)) {
        outcome = { type: 'confirm', status: '待客户确认付款', label: '无默认钱包，客户确认付款', note: '无默认钱包，不允许自动扣款，转待客户确认付款。' };
      }
      if (outcome.type === 'auto' && openingWalletAvailable(row.merchantId) + 0.001 < Number(nextQuote.walletTotal || 0)) {
        outcome = { type: 'confirm', status: '待客户确认付款', label: '余额不足，客户确认付款', note: '钱包可用余额不足，保持待客户确认付款，请客户充值后再确认。' };
      }
      const finalQuote = formatAmountOnly(nextQuote.walletTotal);
      row.agent = rule.agent || modalRoot.querySelector('[data-opening-agent]')?.value || '-';
      row.accountType = rule.accountType || modalRoot.querySelector('[data-opening-type]')?.value || '-';
      row.openingFee = formatAmountOnly(nextQuote.openingFee);
      row.precharge = formatAmountOnly(nextQuote.precharge);
      row.finalQuote = finalQuote;
      row.feeEdited = Boolean(quote.edited);
      row.openingFeeStatus = liveQuote.status;
      row.remark = outcome.type === 'auto' ? '金额一致，已按客户授权自动扣款' : (outcome.note || '总额不一致，已邮件通知客户回系统确认付款');
      if (outcome.type === 'auto') {
        const count = openingAccountCount(row);
        row.status = '已付款待开户';
        row.paymentStatus = '已扣款';
        row.walletCharge = finalQuote;
        row.openingFeeRecord = openingFeeRecordLabel(nextQuote.openingFee, row.applyId);
        row.prechargeRecord = openingPlaceholderRecords(row.applyId, count, 'AD-OPEN-', ' 待绑定账户', nextQuote.precharge);
        if (nextQuote.openingFee > 0) {
          openingFeeHelpers().markCharged(row.merchantId, nextQuote.openingFee);
          row.openingFeeStatus = openingFeeHelpers().merchantStatus(row.merchantId);
          syncOpeningFeeStatusOnRows(activeTab()?.rows, row.merchantId);
        }
      } else {
        row.status = '待客户确认付款';
        row.paymentStatus = '待客户确认';
        row.walletCharge = '-';
        row.openingFeeRecord = nextQuote.openingFee > 0 ? '客户付款后生成' : '无开户费';
        row.prechargeRecord = '客户付款后生成占位充值单';
      }
      refreshOpeningRow(row);
      state.processingRow = null;
      closeModal();
      render();
      showToast(outcome.type === 'auto' ? '已完成审核并扣款，等待开户结果（原型）' : '已邮件通知客户确认付款（原型）', 'success');
      return true;
    }
    function submitOpeningResult(modalRoot) {
      const row = state.processingRow;
      if (!row) { showToast('未找到开户申请', 'error'); return false; }
      const slots = Array.from(modalRoot.querySelectorAll('[data-opening-account-slot]'));
      if (!slots.length) { showToast('未找到开户账户槽位', 'error'); return false; }
      const results = [];
      for (const slot of slots) {
        const failed = Boolean(slot.querySelector('[data-opening-slot-failed]')?.checked);
        const index = Number(slot.dataset.slotIndex || results.length + 1);
        const precharge = numAmount(slot.dataset.openingPrecharge);
        if (failed) {
          results.push({ failed: true, index, precharge });
          continue;
        }
        const source = slot.querySelector('[data-opening-account-source]')?.value || 'synced';
        const syncedSelect = slot.querySelector('[data-opening-synced-account]');
        const selectedSynced = syncedSelect?.selectedOptions?.[0];
        const accountId = source === 'manual' ? slot.querySelector('[data-opening-account-id]')?.value.trim() : syncedSelect?.value;
        const accountName = source === 'manual' ? slot.querySelector('[data-opening-account-name]')?.value.trim() : selectedSynced?.dataset.accountName;
        const currency = source === 'manual' ? (slot.querySelector('[data-opening-account-currency]')?.value || 'USD') : (selectedSynced?.dataset.currency || 'USD');
        const serviceRate = parseOpeningRate(slot.querySelector('[data-opening-service-rate]')?.value);
        const preTaxRate = parseOpeningRate(slot.querySelector('[data-opening-pre-tax-rate]')?.value);
        if (!accountId) { showToast(`请填写账户 ${index} 的广告账户ID`, 'error'); return false; }
        if (!accountName) { showToast(`请填写账户 ${index} 的广告账户名称`, 'error'); return false; }
        if (!serviceRate.ok) { showToast(`账户 ${index} 的账户服务费率格式不正确`, 'error'); return false; }
        if (!preTaxRate.ok) { showToast(`账户 ${index} 的预收税费费率格式不正确`, 'error'); return false; }
        results.push({ failed: false, index, source, accountId, accountName, currency, serviceRate, preTaxRate, precharge });
      }
      const successItems = results.filter(item => !item.failed);
      const failedItems = results.filter(item => item.failed);
      const refundPrecharge = failedItems.reduce((sum, item) => sum + Number(item.precharge || 0), 0);
      const refundCopy = `首充 ${formatAmountOnly(refundPrecharge)}`;
      const chargedOpeningFee = numAmount(row.openingFee);
      const successIds = successItems.map(item => item.accountId);
      if (new Set(successIds).size !== successIds.length) {
        showToast('成功账户的广告账户ID不能重复', 'error');
        return false;
      }
      if (!successItems.length) {
        row.status = '开户取消';
        row.paymentStatus = chargedOpeningFee > 0 ? '部分退款' : '已退款';
        row.accountInfo = '-';
        row.openingFeeRecord = openingFeeRecordLabel(chargedOpeningFee, row.applyId);
        row.prechargeRecord = numAmount(row.precharge) > 0
          ? results.map(item => `AD-OPEN-${row.applyId}-${openingItemNo(item.index)} 失败退款`).join(' / ')
          : '无充值记录';
        row.remark = `全部账户开户失败，已退回${refundCopy}；开户费不随账户失败回退`;
        refreshOpeningRow(row);
        state.processingRow = null;
        closeModal();
        render();
        showToast(`全部账户开户失败，已退回${refundCopy}（原型）`, 'success');
        return true;
      }
      row.status = failedItems.length ? '部分成功' : '开户成功';
      row.paymentStatus = failedItems.length ? '部分退款' : '已扣款';
      row.accountInfo = successItems.map(item => `${item.accountId} / ${item.accountName} / ${item.currency}（服务费率 ${item.serviceRate.label}，预收税率 ${item.preTaxRate.label}）`).join('；') + (failedItems.length ? `；${failedItems.length} 个账户失败已退首充` : '');
      row.openingFeeRecord = openingFeeRecordLabel(chargedOpeningFee, row.applyId);
      row.prechargeRecord = results.map(item => {
        const id = `AD-OPEN-${row.applyId}-${openingItemNo(item.index)}`;
        return item.failed ? `${id} 失败退款` : `${id} 已绑定 ${item.accountId} 并已发起充值`;
      }).join(' / ');
      row.remark = failedItems.length
        ? `部分成功：${successItems.length} 成功 ${failedItems.length} 失败；失败账户已退回${refundCopy}；开户费不随账户失败回退`
        : `已按填写结果处理费率：未填不设置，填 0 写入 0；系统已发起广告账户充值`;
      refreshOpeningRow(row);
      state.processingRow = null;
      closeModal();
      render();
      showToast(failedItems.length ? `部分成功：成功账户已发起充值，失败账户已退回${refundCopy}（原型）` : '已登记开户结果。未填费率不设置，填 0 会写入 0 的配置（原型）', 'success');
      return true;
    }
    function submitOpeningCancel(modalRoot) {
      const row = state.processingRow;
      if (!row) { showToast('未找到开户申请', 'error'); return false; }
      if (row.status === '开户成功' || row.status === '部分成功' || row.status === '开户取消') {
        showToast('当前状态已是终态，不支持取消开户', 'error');
        return false;
      }
      const paid = openingHasCapturedFunds(row);
      row.status = '开户取消';
      row.accountInfo = '-';
      row.walletCharge = '-';
      if (paid) {
        const feeCaptured = openingFeeCaptured(row);
        const anyPreCaptured = openingAnyPrechargeCaptured(row);
        const chargedOpeningFee = feeCaptured ? numAmount(row.openingFee) : 0;
        row.openingFeeRecord = chargedOpeningFee > 0 ? openingFeeRecordLabel(chargedOpeningFee, row.applyId, '已回退') : (numAmount(row.openingFee) > 0 && openingFeeFailed(row) ? '开户费未扣成功，无回退' : row.openingFeeRecord);
        row.prechargeRecord = refundOpeningPrechargeRecords(row);
        row.paymentStatus = (chargedOpeningFee > 0 || anyPreCaptured) ? '已退款' : '未扣款';
        row.remark = chargedOpeningFee > 0
          ? (anyPreCaptured ? '开户取消，已退开户费和已成功的首充；失败侧不重复退；商户开户费状态不自动回退' : '开户取消，已退开户费；首充未扣成功无需退款；商户开户费状态不自动回退')
          : (anyPreCaptured ? '开户取消，已退成功侧首充；无开户费或开户费未扣成功' : '开户取消，未产生需回退的成功扣款');
      } else {
        row.paymentStatus = '未扣款';
        row.openingFeeRecord = '未扣款，无扣费记录';
        row.prechargeRecord = '未扣款，无充值记录';
        row.remark = '开户取消，未产生扣费和充值记录';
      }
      refreshOpeningRow(row);
      state.processingRow = null;
      closeModal();
      render();
      showToast(paid ? '已取消开户并退款；商户开户费状态不自动回退（原型）' : '已取消开户，未产生扣费和充值记录（原型）', 'success');
      return true;
    }
    function submitOpeningReopen(modalRoot) {
      const row = state.processingRow;
      if (!row) { showToast('未找到开户申请', 'error'); return false; }
      if (row.paymentStatus === '已扣款') {
        showToast('已付款申请不支持重开审核，可取消开户并退款', 'error');
        return false;
      }
      row.remark = '重开审核开户申请';
      row.status = '待运营审核';
      row.paymentStatus = '未扣款';
      row.agent = '-';
      row.accountType = '-';
      row.finalQuote = '-';
      row.openingFee = '-';
      row.precharge = '-';
      row.walletCharge = '-';
      row.openingFeeRecord = '-';
      row.prechargeRecord = '-';
      row.accountInfo = '-';
      row.quoteVersion = row.quoteVersion || openingVersion(row, 'reopen');
      refreshOpeningRow(row);
      state.processingRow = null;
      closeModal();
      render();
      showToast('已重开审核。初始报价快照已保留，开户状态回到待运营审核（原型）', 'success');
      return true;
    }
    function operationButtons(row, index, dataset = '') {
      return (row.ops || []).map(op => `<button type="button" class="btn btn-link op-link ${rowActionClass(op)}" data-row-action="${esc(op)}" data-row-index="${index}"${dataset}${row.selectable === false ? ' disabled' : ''}>${esc(op)}</button>`).join('');
    }
    function childTableHtml(tab, parentRow, parentIndex) {
      if (!tab.treeRows || !parentRow._expanded) return '';
      const childRows = parentRow._visibleChildren || [];
      const childColumns = tab.childColumns || [];
      const childOpsWidth = tab.childOpsWidth || 320;
      const childMinWidth = childColumns.reduce((sum, column) => sum + (column.width || 140), 0) + childOpsWidth;
      const childHeaders = childColumns.map(column => {
        const headerClass = [column.num ? 'num' : '', column.align === 'left' ? 'left' : ''].filter(Boolean).join(' ');
        return `<th class="${headerClass}">${esc(column.label)}</th>`;
      }).join('');
      const childBody = childRows.length ? childRows.map((child, childIndex) => {
        const childForOps = tab.id === 'config' && bindCardIsCardRow(child) ? { ...child, ops: bindCardOpsForStatus(child) } : child;
        const ops = operationButtons(childForOps, parentIndex, ` data-child-index="${childIndex}"`);
        return `<tr class="tree-child-data-row">${childColumns.map(column => renderCell(column, child)).join('')}<td class="ops"><div class="command-group">${ops}</div></td></tr>`;
      }).join('') : `<tr><td class="empty-state" colspan="${childColumns.length + 1}">暂无子卡数据</td></tr>`;
      return `<tr class="tree-child-panel-row"><td colspan="__COLSPAN__"><div class="tree-child-panel"><div class="tree-child-panel__title">${esc(tab.childTitle || '下级明细')}</div><div class="table-scroll tree-child-table-scroll"><table class="admin-table admin-table--fixed tree-child-table" style="min-width:${childMinWidth}px"><colgroup>${childColumns.map(column => `<col style="width:${column.width || 140}px">`).join('')}<col style="width:${childOpsWidth}px"></colgroup><thead><tr>${childHeaders}<th class="ops">操作</th></tr></thead><tbody>${childBody}</tbody></table></div></div></td></tr>`;
    }
    function bindCardOpsForStatus(row) {
      const status = row.verifyStatus || row.c22 || '未申请';
      const cardStatus = row.cardStatus || row.c19 || '正常';
      const transferOps = canBindCardTransfer(row) ? ['转出额度'] : [];
      if (cardStatus === '冻结') return ['查看完整卡信息'];
      if (status === '待验卡') return ['验卡任务详情', '标记媒体已验证', '取消任务', '查看完整卡信息'];
      if (status === '已验卡(未回收)') return ['验卡任务详情', '确认验卡退款并回收', '查看完整卡信息', ...transferOps];
      if (status === '已充值关单(未回收)' || status === '回收失败') return ['验卡任务详情', '确认验卡退款并回收', '查看完整卡信息', ...transferOps];
      if (status === '审批中') return ['验卡任务详情'];
      if (status === '已驳回' || status === '已取消') return ['申请验卡初始额度', '验卡任务详情', '查看完整卡信息'];
      if (status === '已回收') return ['查看完整卡信息', '解绑', '冻结卡', ...transferOps];
      return ['申请验卡初始额度', '查看完整卡信息', '解绑', '冻结卡', ...transferOps];
    }
    function refreshBindCardParent(parent) {
      if (!parent) return;
      const statuses = (parent.children || []).map(child => child.verifyStatus || child.c22 || '');
      const prompt = statuses.includes('待验卡') ? '待验卡·请去媒体'
        : statuses.includes('已验卡(未回收)') ? '已验卡·可充值'
          : statuses.includes('审批中') ? '审批中·不可充'
            : statuses.includes('已充值关单(未回收)') ? '关单未回收·可回收'
              : statuses.includes('回收失败') ? '回收失败·可重试'
                : '-';
      parent.c7 = prompt;
      parent.verifyStatus = statuses.find(Boolean) || '-';
    }
    function updateBindCardRowStatus(row, nextStatus, options = {}) {
      if (!row) return false;
      row.verifyStatus = nextStatus;
      row.c22 = nextStatus;
      if (options.amount) row.c21 = `${options.amount} USD`;
      row.c23 = currentTimestamp();
      row.ops = bindCardOpsForStatus(row);
      const tab = activeTab();
      const parent = normalizedTreeRows(tab).find(item => item === row || (item.children || []).includes(row) || item.accountId === row.accountId || item.c2 === row.c2);
      refreshBindCardParent(parent);
      return true;
    }
    function findBindCardById(row, cardId) {
      return bindCardCardsForRow(row).find(card => bindCardId(card) === cardId);
    }
    function submitBindCardTransferAction(backdrop, row) {
      const transferModal = backdrop?.querySelector('[data-transfer-modal]');
      if (!transferModal) return false;
      const fromSelect = transferModal.querySelector('[data-transfer-from]');
      const toSelect = transferModal.querySelector('[data-transfer-to]');
      const fromValue = fromSelect?.value || '';
      const toValue = toSelect?.value || '';
      const amount = parseAmount(transferModal.querySelector('[name="amount"]')?.value);
      const fromOption = fromSelect?.selectedOptions?.[0];
      const maxAmount = numAmount(fromOption?.dataset.max);
      if (!fromValue) { showToast('请选择转出卡', 'error'); return 'pending'; }
      if (!toValue) { showToast('请选择转入卡', 'error'); return 'pending'; }
      if (fromValue === toValue) { showToast('转出卡和转入卡不能相同', 'error'); return 'pending'; }
      if (!amount) { showToast('请输入转移金额', 'error'); return 'pending'; }
      if (!maxAmount || amount > maxAmount) { showToast(`转移金额不可超过可转上限 ${formatMoney(maxAmount, 'USD')}，且转出后总额必须保留 $1`, 'error'); return 'pending'; }
      const fromCard = findBindCardById(row, fromValue);
      const toCard = findBindCardById(row, toValue);
      if (!fromCard || !toCard) { showToast('只允许同一广告账户下的关联卡互转', 'error'); return 'pending'; }
      if (!canBindCardTransfer(fromCard) || bindCardBlockedStatus(bindCardStatus(toCard))) { showToast('待审批、抬额中、抬额失败或待验卡状态不可参与额度转移', 'error'); return 'pending'; }
      const fromTotal = bindCardTotalLimit(fromCard);
      const fromUsed = bindCardUsedAmount(fromCard);
      const fromAvailable = bindCardAvailableAmount(fromCard);
      const toTotal = bindCardTotalLimit(toCard);
      const toUsed = bindCardUsedAmount(toCard);
      const toAvailable = bindCardAvailableAmount(toCard);
      setBindCardAmounts(fromCard, fromTotal - amount, fromUsed, fromAvailable - amount);
      setBindCardAmounts(toCard, toTotal + amount, toUsed, toAvailable + amount);
      fromCard.c23 = currentTimestamp();
      toCard.c23 = currentTimestamp();
      fromCard.ops = bindCardOpsForStatus(fromCard);
      toCard.ops = bindCardOpsForStatus(toCard);
      const parent = bindCardParentForRow(row);
      if (parent) parent.c12 = '管理员(admin@bestfulfill.com)';
      state.processingRow = null;
      state.processingAction = null;
      closeModal();
      render();
      showToast(`已提交 Slash 额度转移：${fromValue} → ${toValue}，${formatMoney(amount, 'USD')}；已写入权限审计样例（原型）`, 'success');
      return true;
    }
    function updateSlashTransferRecord(row, status, stepPatch, nextOps, note) {
      row.transferStatus = status;
      row.c1 = status;
      Object.entries(stepPatch || {}).forEach(([key, value]) => { row[key] = value; });
      row.c14 = '管理员(admin@bestfulfill.com)';
      row.c15 = currentTimestamp();
      row.updatedAt = row.c15;
      row.ops = nextOps || ['查看转移履历'];
      row.transferLogs = (row.transferLogs || []).concat([{ at: row.c15, operator: row.c14, action: state.processingAction || status, status, detail: row.c12 || note || '-' }]);
      state.processingRow = null;
      state.processingAction = null;
      closeModal();
      render();
      showToast(note || `额度转移单已更新为：${status}（原型）`, 'success');
      return true;
    }
    function submitSlashTransferRecordAction(backdrop, action, row) {
      if (!isSlashTransferRecord(row)) return false;
      if (action === '重试转出') {
        if (row.transferStatus !== '转出降额失败') { showToast('只有转出降额失败状态允许重试转出', 'error'); return 'pending'; }
        return updateSlashTransferRecord(row, '处理中', { c9: '降额重试中', c10: '待开始', c12: '已重新提交转出卡降额请求，等待 Fund 返回结果', c13: '转出卡/转入卡锁定' }, ['查看转移履历'], '已重试转出卡降额，原转移单进入处理中（原型）');
      }
      if (action === '取消转移') {
        if (row.transferStatus !== '转出降额失败') { showToast('转出卡已降额后不能取消，只能退回或继续转入', 'error'); return 'pending'; }
        return updateSlashTransferRecord(row, '已取消', { c9: '未降额', c10: '未升额', c11: '0.00 USD', c12: '转出未成功，业务取消该笔转移', c13: '未锁定' }, ['查看转移履历'], '已取消额度转移，未产生单边额度变动（原型）');
      }
      if (action === '重试转入') {
        if (!/转入升额失败|退回失败/.test(row.transferStatus || '')) { showToast('只有转入升额失败或退回失败状态允许重试转入', 'error'); return 'pending'; }
        return updateSlashTransferRecord(row, '处理中', { c10: '升额重试中', c12: '转出卡已降额，本次只重试转入卡升额', c13: '转出卡额度锁定' }, ['查看转移履历'], '已重试转入卡升额，不会重复降低转出卡额度（原型）');
      }
      if (action === '换转入卡重试') {
        if (!/转入升额失败|退回失败/.test(row.transferStatus || '')) { showToast('只有转入升额失败或退回失败状态允许换转入卡重试', 'error'); return 'pending'; }
        const nextCard = backdrop?.querySelector('[name="newToCard"]')?.value || '';
        if (!nextCard) { showToast('请选择新的转入卡', 'error'); return 'pending'; }
        const cardText = nextCard.split('｜')[0];
        return updateSlashTransferRecord(row, '处理中', { c7: cardText, toCardId: cardText.replace(/\(.+\)/, ''), c10: '升额重试中', c12: `已更换转入卡为 ${cardText}，仅重试转入升额步骤`, c13: '转出卡/新转入卡锁定' }, ['查看转移履历'], '已更换转入卡并发起升额重试（原型）');
      }
      if (action === '退回转出卡') {
        if (row.transferStatus !== '转入升额失败') { showToast('只有转出已成功且转入失败时允许退回', 'error'); return 'pending'; }
        return updateSlashTransferRecord(row, '退回中', { c10: '不再升额', c12: '已提交退回请求，将待处理额度加回转出卡', c13: '转出卡额度锁定' }, ['查看转移履历'], '已提交退回转出卡请求（原型）');
      }
      if (action === '重试退回') {
        if (row.transferStatus !== '退回失败') { showToast('只有退回失败状态允许重试退回', 'error'); return 'pending'; }
        return updateSlashTransferRecord(row, '退回中', { c12: '退回失败后已重新提交 Fund 加回转出卡请求', c13: '转出卡额度锁定' }, ['查看转移履历'], '已重试退回转出卡（原型）');
      }
      return false;
    }
    function submitBindCardPrototypeAction(backdrop) {
      const action = state.processingAction;
      const row = state.processingRow;
      if (!action || !row) return false;
      const slashTransferResult = submitSlashTransferRecordAction(backdrop, action, row);
      if (slashTransferResult) return slashTransferResult;
      if (action === '申请验卡初始额度') {
        const amount = backdrop?.querySelector('[name="verifyAmount"]')?.value.trim();
        if (!amount) { showToast('请输入申请金额', 'error'); return 'pending'; }
        updateBindCardRowStatus(row, '审批中', { amount });
      } else if (action === '取消任务') {
        if (bindCardStatus(row) !== '待验卡') { showToast('只有待验卡状态允许取消任务', 'error'); return 'pending'; }
        updateBindCardRowStatus(row, '已取消');
      } else if (action === '确认验卡退款并回收') {
        const verifyAmount = bindCardVerifyAmount(row);
        const available = bindCardAvailableAmount(row);
        if (!verifyAmount) { showToast('缺少验卡申请额度，无法回收', 'error'); return 'pending'; }
        if (available < verifyAmount) {
          updateBindCardRowStatus(row, '回收失败');
          state.processingRow = null;
          state.processingAction = null;
          closeModal();
          render();
          showToast('可用额度不足以回收：本次未调额，已标记为回收失败（原型）', 'error');
          return true;
        }
        const total = bindCardTotalLimit(row);
        const nextTotal = row.hasRechargeAfterVerify || /已充值关单/.test(bindCardStatus(row)) ? Math.max(bindCardPreVerifyLimit(row), total - verifyAmount) : bindCardPreVerifyLimit(row);
        const decrease = Math.max(0, total - nextTotal);
        const nextAvailable = Math.max(0, available - decrease);
        const nextUsed = Math.max(0, nextTotal - nextAvailable);
        setBindCardAmounts(row, nextTotal, nextUsed, nextAvailable);
        updateBindCardRowStatus(row, '已回收');
      } else if (action === '标记媒体已验证') {
        updateBindCardRowStatus(row, '已验卡(未回收)');
      } else if (action === '额度转移' || action === '转出额度') {
        return submitBindCardTransferAction(backdrop, row);
      } else {
        return false;
      }
      state.processingRow = null;
      state.processingAction = null;
      closeModal();
      render();
      showToast(`已更新验卡额度状态：${row.c22 || row.verifyStatus}（原型）`, 'success');
      return true;
    }
    function unmatchedIdsNotice(tab) {
      const fields = (tab.filters || []).filter(item => item.match === 'ids');
      return fields.map(field => {
        const tokens = parseMatchTokens((state.values[tab.id] || {})[field.key]);
        if (!tokens.length) return '';
        const rowKey = field.rowKey || field.key;
        const found = new Set((tab.rows || []).map(row => String(row[rowKey] || '').toLowerCase()));
        const missing = tokens.filter(id => !found.has(id.toLowerCase()));
        if (!missing.length) return '';
        return `<div class="notice notice--warning">未找到 ${missing.length} 个${esc(field.label)}：${esc(missing.join('、'))}</div>`;
      }).join('');
    }
    function applyLocationFeeOverride(row, ratioText) {
      row.ratio = ratioText;
      row.hasOverride = true;
      row.source = '账户覆盖';
      row.updatedAt = currentTimestamp();
      row.ops = ['编辑', '删除'];
    }
    function clearLocationFeeOverride(row) {
      row.hasOverride = false;
      row.ratio = row.customerRatio ? row.customerRatio : '—';
      row.source = row.customerRatio ? '客户规则' : '未配置';
      row.updatedAt = currentTimestamp();
      row.ops = ['编辑'];
    }
    function restoreLocationFeeCreateItem(item) {
      if (!item?.row || item.action === '未找到' || !item.snapshot) return;
      const snap = item.snapshot;
      item.row.hasOverride = snap.hasOverride;
      item.row.ratio = snap.ratio;
      item.row.source = snap.source;
      item.row.updatedAt = snap.updatedAt;
      item.row.ops = (snap.ops || []).slice();
    }
    function refreshLocationFeeCreateResultModal(renderList) {
      const payload = state.locationFeeCreateResult;
      if (!payload) return;
      const pages = Math.max(1, Math.ceil((payload.results || []).length / 5));
      payload.page = Math.min(Math.max(1, payload.page || 1), pages);
      closeModal();
      if (renderList) render();
      openModal(locationFeeCreateResultModal(payload.results, payload.ratioText, payload.page));
    }
    function readFilters(tab) {
    const values = {};
    root.querySelectorAll('[data-filter]').forEach(node => {
        values[node.dataset.filter] = node.value.trim();
      });
      state.values[tab.id] = values;
    }
    function render() {
      const tab = activeTab();
      const groups = navGroups();
      const hasTabs = groups.length > 1;
      const tabHtml = hasTabs ? `<div class="business-tabs" role="tablist">${groups.map(group => {
        const active = group.tabs.some(item => item.id === state.tab);
        const targetId = active ? state.tab : (state.groupTab[group.key] || group.tabs[0].id);
        return `<button type="button" class="business-tab${active ? ' is-active' : ''}" data-tab="${esc(targetId)}">${esc(group.label)}</button>`;
      }).join('')}</div>` : '';
      const activeGroup = groups.find(group => group.tabs.some(item => item.id === state.tab));
      const subTabHtml = activeGroup && activeGroup.tabs.length > 1 ? `<div class="sub-tabs" role="tablist">${activeGroup.tabs.map(item => `<button type="button" class="sub-tab${item.id === state.tab ? ' is-active' : ''}" data-tab="${esc(item.id)}">${esc(item.label)}</button>`).join('')}</div>` : '';
      const navHtml = (tabHtml || subTabHtml) ? `<div class="tab-nav-stack">${tabHtml}${subTabHtml}</div>` : '';
      const kpis = tab.kpis || config.kpis || [];
      const kpiHtml = kpis.length ? `<section class="kpi-grid" aria-label="${esc(tab.title || config.title || '统计')}">${kpis.map(item => `<div class="admin-card kpi-card"><p class="kpi-card__label">${esc(item.label)}</p><div class="kpi-card__value">${esc(item.value)}</div><p class="kpi-card__hint">${esc(item.hint || '')}</p></div>`).join('')}</section>` : '';
      const filterHtml = tab.filters?.length ? `<section class="admin-card filter-card"><div class="admin-card__body"><div class="filter-grid ${tab.filterClass || (tab.filters.length >= 5 ? 'cols-5' : tab.filters.length === 3 ? 'cols-3' : '')}">${tab.filters.map(field => fieldHtml(field, state.values[tab.id] || {})).join('')}<div class="filter-actions"><button class="btn btn-primary" type="button" data-action="search">${icon('search')}搜 索</button><button class="btn btn-default" type="button" data-action="reset">重 置</button></div></div></div></section>` : '';
      const actionHtml = (tab.actions || []).map(action => `<button type="button" class="btn ${action.primary ? 'btn-primary' : 'btn-default'}" data-action="${esc(action.id)}">${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`).join('');
      const actionClass = action => action.danger ? 'btn-danger' : action.primary ? 'btn-primary' : 'btn-default';
      const actionAttrs = action => `${action.requiresSelection ? ' data-requires-selection' : ''}${action.uploadToast ? ` data-upload-toast="${esc(action.uploadToast)}"` : ''}`;
      const renderToolbarAction = action => {
        if (action.kind === 'note') {
          const text = typeof action.text === 'function' ? action.text() : (action.text || action.label || '');
          return `<span class="opening-fee-current">${esc(text)}</span>`;
        }
        return `<button type="button" class="btn ${actionClass(action)}" data-action="${esc(action.id)}" data-action-label="${esc(action.label)}"${actionAttrs(action)}>${action.icon ? icon(action.icon) : ''}${esc(action.label)}</button>`;
      };
      const leftActions = (tab.actions || []).filter(action => action.align !== 'right').map(renderToolbarAction).join('');
      const rightActions = (tab.actions || []).filter(action => action.align === 'right').map(renderToolbarAction).join('');
      const showOps = !tab.hideOperation;
      const columns = displayedColumns(tab);
      const selected = selectedSet(tab);
      const currentRows = rows(tab);
      const selectableRows = currentRows.map((row, index) => ({ row, index })).filter(item => item.row.selectable !== false);
      const colspan = columns.length + (tab.selectable ? 1 : 0) + (showOps ? 1 : 0);
      const tableRows = currentRows.map((row, index) => {
        const treeAttrs = row._treeLevel != null ? ` class="tree-row tree-row--level-${row._treeLevel}${row._hasChildren ? ' tree-row--parent' : ''}" data-tree-row="${esc(row._treeKey || '')}"` : '';
        const ops = operationButtons(row, index);
        const parentHtml = `<tr${treeAttrs}>${tab.selectable ? `<td class="select-cell"><input type="checkbox" data-select-row="${index}" aria-label="选择第 ${index + 1} 行"${selected.has(index) ? ' checked' : ''}${row.selectable === false ? ' disabled' : ''}></td>` : ''}${columns.map(column => renderCell(column, row)).join('')}${showOps ? `<td class="ops"><div class="command-group">${ops}</div></td>` : ''}</tr>`;
        const childHtml = childTableHtml(tab, row, index).replace('__COLSPAN__', String(colspan));
        return parentHtml + childHtml;
      }).join('');
      const headers = columns.map(column => {
        const headerClass = [column.num ? 'num' : '', column.align === 'left' ? 'left' : '', column.help ? 'has-help' : ''].filter(Boolean).join(' ');
        const sortIcon = icon(state.sort[tab.id]?.key === column.key && state.sort[tab.id]?.dir === 'desc' ? 'sort-down' : 'sort-up');
        const headerLabel = column.sort ? `<button class="sort-trigger" type="button" data-sort="${esc(column.key)}">${esc(column.label)} ${sortIcon}</button>` : `<span class="table-header-label">${esc(column.label)}</span>`;
        return `<th class="${headerClass}"><span class="table-header-content">${headerLabel}${helpTip(column.help)}</span></th>`;
      }).join('');
      const selectHead = tab.selectable ? `<th class="select-cell"><input type="checkbox" data-select-all aria-label="选择全部"${selectableRows.length && selected.size === selectableRows.length ? ' checked' : ''}${selectableRows.length ? '' : ' disabled'}></th>` : '';
      const colgroup = `<colgroup>${tab.selectable ? '<col style="width:52px">' : ''}${columns.map(column => `<col style="width:${column.width || 160}px">`).join('')}${showOps ? `<col style="width:${tab.opsWidth || 180}px">` : ''}</colgroup>`;
      const footerNote = tab.footerNote ? `<div class="notice module-footer-note">${esc(tab.footerNote)}</div>` : '';
      const cardHeader = leftActions || rightActions ? `<div class="admin-card__header"><div class="command-bar command-bar--split"><div class="command-group command-group--primary">${leftActions}</div><div class="command-group command-group--secondary">${rightActions}</div></div></div>` : '';
      root.innerHTML = `<div class="admin-page module-page">${navHtml}${kpiHtml}${filterHtml}${unmatchedIdsNotice(tab)}${dimensionSelectorHtml(tab)}${chartsHtml(tab, config)}<section class="admin-card list-card">${cardHeader}<div class="table-scroll"><table class="admin-table admin-table--fixed" style="min-width:${currentTableMinWidth(tab, columns, showOps)}px">${colgroup}<thead><tr>${selectHead}${headers}${showOps ? '<th class="ops">操作</th>' : ''}</tr></thead><tbody>${tableRows || `<tr><td class="empty-state" colspan="${colspan}">暂无数据</td></tr>`}</tbody></table></div>${footerNote}<div class="pagination"><span>共 ${currentRows.length} 条记录</span><div class="pagination__actions"><button class="page-number" disabled>‹</button><button class="page-number is-active">1</button><button class="page-number" disabled>›</button></div></div><input type="file" data-file-upload hidden></section></div>`;
      root.querySelectorAll('[data-requires-selection]').forEach(button => { button.disabled = selected.size === 0; });
    }
    function handleRowAction(action, row) {
      const tab = activeTab();
      if (action === '删除' && tab.id === 'ratio-account') {
        state.processingRow = row;
        openModal(confirmModal('删除账户预收比例', `删除后回退客户规则（或未配置）。不预收请设显式 0%，不要用删除。<br><br>广告账户 <strong>${esc(row.accountId || '-')}</strong> 当前来源：${esc(row.source || '-')}。`, true, 'location-fee-row-delete', { size: 'md' }));
        return;
      }
      const modal = tab.modals?.[action] || config.modals?.[action];
      if (modal) {
        state.processingRow = row;
        state.processingAction = action;
        if (modal.type === 'offline-transfer-audit') state.processingRow = row;
        if (modal.type === 'monitor-follow') state.processingRow = row;
        if (/confirm/.test(modal.type || '')) {
          openModal(confirmModal(modal.title || action, modal.copy || `确认执行“${esc(action)}”？原型不会调用真实接口。`, modal.danger, modal.type));
          return;
        }
        openModal(formModal(modal, row));
        syncOpeningBudgetRange(document.querySelector('[data-opening-rule-config-modal]'));
        syncOpeningRuleConfigPreview(document.querySelector('[data-opening-rule-config-modal]'));
        syncOpeningApplyCreateModal(document.querySelector('[data-opening-apply-create-modal]'));
        return;
      }
      if (action === '重开') {
        const reopenModal = tab.modals?.['重开审核'] || config.modals?.['重开审核'];
        state.processingRow = row;
        state.processingAction = '重开审核';
        openModal(formModal(reopenModal || { type: 'opening-reopen', title: '重开审核' }, row));
        return;
      }
      if (action === '编辑' && tab.modal) {
        state.processingRow = row;
        state.processingAction = action;
        openModal(formModal({ ...tab.modal, title: tab.modal.editTitle || tab.modal.title || '编辑' }, row));
        return;
      }
      if (/重置密码/.test(action)) {
        openModal(confirmModal('重置密码', `确定要重置 <strong>${esc(row.loginAccount || '该子账号')}</strong> 的登录密码吗？重置后请通过安全渠道告知用户。`, true));
        return;
      }
      if (/启用|禁用|停用/.test(action)) {
        if (row?.ruleId && /账户规则配置/.test(config.title || '')) {
          if (action === '启用') {
            const conflict = (tab.rows || []).some(item => item !== row && item.mediaChannel === row.mediaChannel && item.status === '启用' && String(item.priority) === String(row.priority));
            if (conflict) {
              showToast('同一媒体启用规则的匹配优先级不可重复', 'error');
              return;
            }
          }
          row.status = action === '启用' ? '启用' : '停用';
          row.updatedAt = currentTimestamp();
          row.updatedBy = '管理员(admin@bestfulfill.com)';
          refreshOpeningRuleRow(row);
          if (Array.isArray(window.BESTADS_OPENING_RULES)) window.BESTADS_OPENING_RULES = tab.rows;
          render();
          showToast(`账户规则已${row.status}（原型）`, row.status === '启用' ? 'success' : 'info');
          return;
        }
        openModal(confirmModal(action, `确定要${esc(action)} <strong>${esc(row.roleName || row.loginAccount || row.customerName || row.name || '当前记录')}</strong> 吗？`, action === '禁用'));
        return;
      }
      if (/回退|释放|预收补入/.test(action)) {
        const extra = action === '回退' && row.feeType === '开户费' ? '<p>回退只退钱，不会改商户开户费状态。若要再收或免除，请到客户管理修改开户费状态。</p>' : '';
        openModal(confirmModal(action, `请确认对商户ID <strong>${esc(row.merchantId || '-')}</strong> 执行“${esc(action)}”操作。该操作会影响资金流水，请确认后继续。${extra}`, true));
        return;
      }
      if (/下载文件/.test(action)) {
        if (row.status !== '处理成功') {
          showToast(row.status === '处理中' ? '任务仍在处理中，暂不可下载' : '处理失败，没有可下载文件', 'error');
          return;
        }
        showToast(`已开始下载任务 ${row.taskId}（原型）`, 'success');
        return;
      }
      if (/查看转移履历|查看处理记录|查看详情|查看明细|关系与吐点|权限管理|子账号管理|更新余额/.test(action)) {
        if (tab.id === 'list' && row?.applyId && 'paymentStatus' in row && 'prechargeRecord' in row) {
          openModal(openingDetailModal(action, row));
          return;
        }
        if (row?.ruleId && /账户规则配置/.test(config.title || '')) {
          openModal(openingRuleDetailModal(action, row));
          return;
        }
        openModal(detailModal(action, row, tab));
        return;
      }
      if (/重试扣款/.test(action)) {
        const feeNeed = openingFeeFailed(row);
        const preNeed = openingPrechargeFailed(row) || (!openingPrechargeCaptured(row) && numAmount(row.precharge) > 0 && row.status === '扣款异常');
        const remainWallet = (feeNeed ? convertOpeningAmount(numAmount(row.openingFee), 'USD', openingWalletCurrency(row.merchantId)) : 0)
          + (preNeed ? openingFailedPrechargeWalletAmount(row) : 0);
        if (openingWalletAvailable(row.merchantId) + 0.001 < remainWallet) {
          row.remark = '重试扣款时钱包余额不足，保持扣款异常。请客户把钱包充够后，再由运营重试失败侧，避免按整单再付一遍开户费';
          refreshOpeningRow(row);
          render();
          showToast('钱包可用余额不足，仍停在扣款异常。请充值后再重试失败侧（原型）', 'error');
          return;
        }
        if (feeNeed) row.openingFeeRecord = openingFeeRecordLabel(numAmount(row.openingFee), row.applyId);
        if (preNeed) row.prechargeRecord = retryOpeningPrechargeRecords(row);
        if (numAmount(row.openingFee) > 0 && openingFeeCaptured(row)) {
          openingFeeHelpers().markCharged(row.merchantId, numAmount(row.openingFee));
          row.openingFeeStatus = openingFeeHelpers().merchantStatus(row.merchantId);
          syncOpeningFeeStatusOnRows(activeTab()?.rows, row.merchantId);
        }
        row.status = '已付款待开户';
        row.paymentStatus = '已扣款';
        row.walletCharge = row.finalQuote || row.initialQuote;
        row.remark = '扣款异常已重试失败侧并成功，进入已付款待开户';
        refreshOpeningRow(row);
        render();
        showToast('已重试失败侧扣款并成功（原型）', 'success');
        return;
      }
      if (/审核报价|审核开户/.test(action)) {
        state.processingRow = row;
        state.processingAction = action;
        openModal(formModal({ type: 'opening-audit', title: '审核开户' }, row));
        return;
      }
      if (/登记开户结果|开户成功|开户失败/.test(action)) {
        state.processingRow = row;
        state.processingAction = action;
        openModal(formModal({ type: 'opening-result', title: '登记开户结果' }, row));
        return;
      }
      if (/取消开户|作废\/重开/.test(action)) {
        state.processingRow = row;
        state.processingAction = action;
        openModal(formModal({ type: 'opening-cancel', title: '取消开户' }, row));
        return;
      }
      if (/重开审核/.test(action)) {
        state.processingRow = row;
        state.processingAction = action;
        openModal(formModal({ type: 'opening-reopen', title: '重开审核' }, row));
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
      const multiToggle = event.target.closest('[data-multiselect-toggle]');
      if (multiToggle) {
        const current = multiToggle.closest('[data-multiselect]');
        root.querySelectorAll('[data-multiselect].is-open').forEach(node => { if (node !== current) node.classList.remove('is-open'); });
        current?.classList.toggle('is-open');
        return;
      }
      if (!event.target.closest('[data-multiselect]')) root.querySelectorAll('[data-multiselect].is-open').forEach(node => node.classList.remove('is-open'));
      const treeToggle = event.target.closest('[data-tree-toggle]');
      if (treeToggle) {
        const tab = activeTab();
        const set = expandedSet(tab);
        const key = treeToggle.dataset.treeToggle;
        if (set.has(key)) set.delete(key); else set.add(key);
        render();
        return;
      }
      const treeParentRow = event.target.closest('tr.tree-row--parent');
      if (treeParentRow && !event.target.closest('button, a, input, select, textarea, label')) {
        const tab = activeTab();
        const set = expandedSet(tab);
        const key = treeParentRow.dataset.treeRow;
        if (set.has(key)) set.delete(key); else set.add(key);
        render();
        return;
      }
      const tabButton = event.target.closest('[data-tab]');
      if (tabButton) { state.tab = tabButton.dataset.tab; rememberGroupTab(state.tab); render(); return; }
      const actionButton = event.target.closest('[data-action]');
      if (actionButton) {
        const tab = activeTab();
        if (actionButton.dataset.action === 'search') { readFilters(tab); render(); showToast('已按当前条件更新列表（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'reset') { state.values[tab.id] = {}; state.sort[tab.id] = null; selectedSet(tab).clear(); render(); showToast('筛选条件已重置', 'info'); return; }
        if (actionButton.dataset.action === 'export') { showToast('导出任务已创建，可在导出中心查看进度（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'feishu-notice') {
          const overview = tabs.find(item => item.id === 'overview');
          openModal(locationFeeFeishuModal(overview?.rows || []));
          return;
        }
        if (actionButton.dataset.action === 'batch-ratio') {
          const count = selectedSet(tab).size;
          if (!count) { showToast('请先勾选需要批量处理的记录', 'error'); return; }
          openModal(locationFeeBatchRatioModal(count));
          return;
        }
        if (actionButton.dataset.action === 'batch-delete-ratio') {
          const count = selectedSet(tab).size;
          if (!count) { showToast('请先勾选需要批量处理的记录', 'error'); return; }
          openModal(confirmModal('批量删除账户覆盖', `删除后回退客户规则（或未配置）。不预收请设显式 0%，不要用删除。<br><br>将对已选 <strong>${count}</strong> 条执行删除。`, true, 'location-fee-batch-delete', { size: 'md' }));
          return;
        }
        if (actionButton.dataset.action === 'download-template') { showToast('已开始下载导入模版（原型）', 'success'); return; }
        if (actionButton.dataset.action === 'custom-fields') { openModal(customFieldsModal(tab, fieldPref(tab))); return; }
        if (actionButton.dataset.action === 'upload') { const input = root.querySelector('[data-file-upload]'); if (input) { input.value = ''; input.click(); } showToast(actionButton.dataset.uploadToast || `请选择本地文件执行“${actionButton.dataset.actionLabel || actionButton.textContent.trim()}”（原型）`, 'info'); return; }
        if (actionButton.hasAttribute('data-requires-selection') && selectedSet(tab).size === 0) { showToast('请先勾选需要操作的广告账户', 'error'); return; }
        const actionLabel = actionButton.dataset.actionLabel || actionButton.textContent.trim();
        const modal = tab.modals?.[actionLabel] || config.modals?.[actionLabel];
        if (actionButton.dataset.action === 'batch-status' || actionButton.dataset.action === 'batch-rebate') {
          const count = selectedSet(tab).size;
          if (!count) { showToast('请先勾选需要批量处理的记录', 'error'); return; }
          openModal(confirmModal(actionLabel, `将对已选 <strong>${count}</strong> 条记录执行“${esc(actionLabel)}”。提交前请确认影响范围。`, false));
          return;
        }
        if (/confirm/.test(modal?.type || '')) openModal(confirmModal(modalTextWithSelection(modal.title, tab), modalTextWithSelection(modal.copy, tab), modal.danger, modal.type));
        else if (modal) {
          openModal(formModal(modal, {}));
          syncOpeningBudgetRange(document.querySelector('[data-opening-rule-config-modal]'));
          syncOpeningRuleConfigPreview(document.querySelector('[data-opening-rule-config-modal]'));
          syncOpeningApplyCreateModal(document.querySelector('[data-opening-apply-create-modal]'));
        }
        else if ((/^create/.test(actionButton.dataset.action || '') || /新增|创建/.test(actionLabel)) && tab.modal) {
          state.processingRow = null;
          state.processingAction = 'create';
          const createModal = {
            ...tab.modal,
            title: tab.modal.title || actionLabel,
            fields: tab.modal.createFields || tab.modal.fields,
            size: tab.modal.createSize || tab.modal.size
          };
          if (tab.id === 'ratio-account') createModal.backdropAttr = 'data-location-fee-create-ratio';
          openModal(formModal(createModal, {}));
        }
        else showToast(`${actionLabel}操作已触发（原型）`, 'success');
        return;
      }
      const rowAction = event.target.closest('[data-row-action]');
      if (rowAction) {
        const parentRow = rows(activeTab())[Number(rowAction.dataset.rowIndex)] || {};
        const childIndex = rowAction.dataset.childIndex;
        const targetRow = childIndex != null ? (parentRow._visibleChildren || parentRow.children || [])[Number(childIndex)] || parentRow : parentRow;
        handleRowAction(rowAction.dataset.rowAction, targetRow);
        return;
      }
      const sortButton = event.target.closest('[data-sort]');
      if (sortButton) { const tab = activeTab(); const key = sortButton.dataset.sort; const current = state.sort[tab.id]; state.sort[tab.id] = !current || current.key !== key ? { key, dir: 'asc' } : current.dir === 'asc' ? { key, dir: 'desc' } : null; render(); }
      const rowSelect = event.target.closest('[data-select-row]');
      if (rowSelect && !rowSelect.disabled) { const tab = activeTab(); const set = selectedSet(tab); const index = Number(rowSelect.dataset.selectRow); if (rowSelect.checked) set.add(index); else set.delete(index); render(); }
      const selectAll = event.target.closest('[data-select-all]');
      if (selectAll && !selectAll.disabled) { const tab = activeTab(); const set = selectedSet(tab); set.clear(); if (selectAll.checked) rows(tab).forEach((row, index) => { if (row.selectable !== false) set.add(index); }); render(); }
    });
    root.addEventListener('change', event => {
      const multiOption = event.target.closest('[data-multiselect-option]');
      if (multiOption) {
        const fieldRoot = multiOption.closest('[data-multiselect]');
        const selected = Array.from(fieldRoot.querySelectorAll('[data-multiselect-option]:checked')).map(input => input.value);
        const hidden = fieldRoot.querySelector('[data-filter]');
        const label = fieldRoot.querySelector('[data-multiselect-label]');
        if (hidden) hidden.value = selected.join('||');
        if (label) label.textContent = selected.length ? `${selected[0]}${selected.length > 1 ? ` +${selected.length - 1}` : ''}` : fieldRoot.querySelector('label')?.textContent?.replace(/^/, '选择') || '请选择';
        return;
      }
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
      const emailLang = event.target.closest('[data-opening-email-lang]');
      if (emailLang) {
        const root = emailLang.closest('[data-opening-email-preview]');
        const lang = emailLang.dataset.openingEmailLang || 'en';
        root?.querySelectorAll('[data-opening-email-lang]').forEach(button => {
          button.classList.toggle('is-active', button === emailLang);
        });
        const frame = root?.querySelector('[data-opening-email-frame]');
        if (frame) frame.innerHTML = openingConfirmEmailHtml(lang);
        return;
      }
      const modalMultiToggle = event.target.closest('.modal-backdrop [data-multiselect-toggle]');
      if (modalMultiToggle) {
        const current = modalMultiToggle.closest('[data-multiselect]');
        document.querySelectorAll('.modal-backdrop [data-multiselect].is-open').forEach(node => {
          if (node !== current) node.classList.remove('is-open');
        });
        current?.classList.toggle('is-open');
        return;
      }
      if (event.target.closest('.modal-backdrop') && !event.target.closest('[data-multiselect]')) {
        document.querySelectorAll('.modal-backdrop [data-multiselect].is-open').forEach(node => node.classList.remove('is-open'));
      }
      const uploadBrowse = event.target.closest('[data-upload-browse], [data-upload-zone]');
      if (uploadBrowse && !event.target.closest('[data-upload-list]')) {
        const zone = uploadBrowse.closest('[data-upload-zone]');
        const input = zone?.querySelector('[data-upload-input]');
        if (input && event.target !== input) {
          input.click();
          return;
        }
      }
      const resultRemove = event.target.closest('[data-location-fee-result-remove]');
      if (resultRemove) {
        const payload = state.locationFeeCreateResult;
        const accountId = resultRemove.getAttribute('data-location-fee-result-remove');
        const item = payload?.results?.find(entry => String(entry.accountId) === accountId);
        if (item) restoreLocationFeeCreateItem(item);
        if (payload) payload.results = (payload.results || []).filter(entry => String(entry.accountId) !== accountId);
        refreshLocationFeeCreateResultModal(true);
        return;
      }
      const resultPage = event.target.closest('[data-location-fee-result-page]');
      if (resultPage && !resultPage.disabled) {
        const payload = state.locationFeeCreateResult;
        if (payload) payload.page = Number(resultPage.getAttribute('data-location-fee-result-page')) || 1;
        refreshLocationFeeCreateResultModal(false);
        return;
      }
      const closeButton = event.target.closest('[data-modal-close]');
      if (closeButton) {
        const backdrop = closeButton.closest('.modal-backdrop');
        if (backdrop?.matches('[data-location-fee-create-result]')) state.locationFeeCreateResult = null;
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
        if (!backdrop?.dataset.confirmAction || backdrop.dataset.confirmAction === 'confirm') {
          state.processingRow = null;
          state.processingAction = null;
        }
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
      if (event.target.closest('[data-opening-audit-cancel]')) {
        const backdrop = event.target.closest('.modal-backdrop');
        const openingAuditRoot = backdrop?.querySelector('[data-opening-audit-modal]');
        if (openingAuditRoot) submitOpeningCancel(openingAuditRoot);
        return;
      }
      if (event.target.closest('[data-opening-edit-fee]')) {
        const modalRoot = event.target.closest('[data-opening-audit-modal]');
        setOpeningFeeEditing(modalRoot, true);
        applyOpeningAuditQuote(modalRoot, openingSelectedRule(state.processingRow, modalRoot), state.processingRow);
        return;
      }
      if (event.target.closest('[data-opening-reset-fee]')) {
        const modalRoot = event.target.closest('[data-opening-audit-modal]');
        applyOpeningAuditQuote(modalRoot, openingSelectedRule(state.processingRow, modalRoot), state.processingRow, { reset: true });
        return;
      }
      if (event.target.closest('[data-opening-fail-all]')) {
        const modalRoot = event.target.closest('[data-opening-result-modal]');
        toggleOpeningResultAllFailed(modalRoot);
        return;
      }
      if (event.target.closest('[data-modal-submit]')) {
        const backdrop = event.target.closest('.modal-backdrop');
        const tab = activeTab();
        if (backdrop?.dataset.confirmAction === 'location-fee-batch-delete') {
          const current = rows(tab);
          const selected = Array.from(selectedSet(tab)).map(index => current[index]).filter(Boolean);
          let deleted = 0;
          let skipped = 0;
          selected.forEach(row => {
            if (row.hasOverride) {
              clearLocationFeeOverride(row);
              deleted += 1;
            } else skipped += 1;
          });
          selectedSet(tab).clear();
          closeModal();
          render();
          showToast(`已删除 ${deleted} 条账户覆盖${skipped ? `，${skipped} 条无覆盖已跳过` : ''}（原型）`, 'success');
          return;
        }
        if (backdrop?.dataset.confirmAction === 'location-fee-row-delete') {
          const row = state.processingRow;
          const had = Boolean(row?.hasOverride);
          if (had) clearLocationFeeOverride(row);
          state.processingRow = null;
          closeModal();
          render();
          showToast(had ? '已删除账户覆盖，已回退客户规则（原型）' : '当前无账户覆盖，无需删除（原型）', had ? 'success' : 'info');
          return;
        }
        if (backdrop?.matches('[data-location-fee-batch-ratio]') || backdrop?.querySelector('[data-location-fee-batch-ratio]')) {
          const ratioText = locationFeeFormatRatio(backdrop.querySelector('[data-location-fee-ratio]')?.value);
          if (!ratioText) { showToast('请输入有效的预收比例', 'error'); return; }
          const current = rows(tab);
          const selected = Array.from(selectedSet(tab)).map(index => current[index]).filter(Boolean);
          selected.forEach(row => applyLocationFeeOverride(row, ratioText));
          selectedSet(tab).clear();
          closeModal();
          render();
          showToast(`已为 ${selected.length} 个广告账户设置预收比例 ${ratioText}（原型）`, 'success');
          return;
        }
        if (backdrop?.matches('[data-location-fee-create-ratio]')) {
          const ratioText = locationFeeFormatRatio(backdrop.querySelector('[name="ratio"]')?.value);
          if (!ratioText) { showToast('请输入有效的预收比例', 'error'); return; }
          const ids = [...new Set(parseMatchTokens(backdrop.querySelector('[name="accountId"]')?.value))];
          if (!ids.length) { showToast('请输入广告账户ID', 'error'); return; }
          const results = ids.map(accountId => {
            const row = (tab.rows || []).find(item => String(item.accountId) === accountId);
            if (!row) {
              return { accountId, accountName: '—', merchantId: '—', customerName: '—', before: '—', action: '未找到' };
            }
            const action = row.hasOverride ? '覆盖现有配置' : '本次新增';
            const before = row.hasOverride ? (row.ratio || '—') : '无';
            const snapshot = { hasOverride: row.hasOverride, ratio: row.ratio, source: row.source, updatedAt: row.updatedAt, ops: (row.ops || []).slice() };
            applyLocationFeeOverride(row, ratioText);
            return { accountId, accountName: row.accountName || '—', merchantId: row.merchantId || '—', customerName: row.customerName || '—', before, action, row, snapshot };
          });
          state.processingRow = null;
          state.locationFeeCreateResult = { results, ratioText, page: 1 };
          closeModal();
          render();
          openModal(locationFeeCreateResultModal(results, ratioText, 1));
          return;
        }
        if (tab.id === 'ratio-account' && backdrop?.querySelector('[name="ratio"]')) {
          const ratioText = locationFeeFormatRatio(backdrop.querySelector('[name="ratio"]')?.value);
          if (!ratioText) { showToast('请输入有效的预收比例', 'error'); return; }
          const row = state.processingRow;
          if (!row) { showToast('请选择要编辑的广告账户', 'error'); return; }
          applyLocationFeeOverride(row, ratioText);
          state.processingRow = null;
          closeModal();
          render();
          showToast(`已更新账户预收比例 ${ratioText}（原型）`, 'success');
          return;
        }
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
        const rechargeModal = backdrop?.querySelector('[data-recharge-modal]');
        if (rechargeModal) {
          if (submitRechargeModal(rechargeModal, tab)) closeModal();
          return;
        }
        const debitModal = backdrop?.querySelector('[data-debit-modal]');
        if (debitModal) {
          if (submitBatchDebitModal(debitModal, tab)) closeModal();
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
        const openingAuditRoot = backdrop?.querySelector('[data-opening-audit-modal]');
        if (openingAuditRoot) {
          submitOpeningAudit(openingAuditRoot);
          return;
        }
        const openingResultRoot = backdrop?.querySelector('[data-opening-result-modal]');
        if (openingResultRoot) {
          submitOpeningResult(openingResultRoot);
          return;
        }
        const openingCancelRoot = backdrop?.querySelector('[data-opening-cancel-modal]');
        if (openingCancelRoot) {
          submitOpeningCancel(openingCancelRoot);
          return;
        }
        const openingReopenRoot = backdrop?.querySelector('[data-opening-reopen-modal]');
        if (openingReopenRoot) {
          submitOpeningReopen(openingReopenRoot);
          return;
        }
        const openingRuleRoot = backdrop?.querySelector('[data-opening-rule-config-modal]');
        if (openingRuleRoot) {
          submitOpeningRuleConfig(openingRuleRoot, tab);
          return;
        }
        const openingFeeConfigRoot = backdrop?.querySelector('[data-opening-fee-config-modal]');
        if (openingFeeConfigRoot) {
          submitOpeningFeeConfig(openingFeeConfigRoot);
          return;
        }
        const openingApplyCreateRoot = backdrop?.querySelector('[data-opening-apply-create-modal]');
        if (openingApplyCreateRoot) {
          submitOpeningApplyCreate(openingApplyCreateRoot);
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
        const bindCardResult = submitBindCardPrototypeAction(backdrop);
        if (bindCardResult) return;
        closeModal();
        state.processingRow = null;
        state.processingAction = null;
        showToast('操作已提交，列表将在成功后刷新（原型）', 'success');
      }
      if (event.target.closest('[data-recharge-query]')) {
        refreshRechargeModal(event.target.closest('[data-recharge-modal]'));
      }
      if (event.target.closest('[data-debit-add]')) {
        addBatchDebitItem(event.target.closest('[data-debit-modal]'));
        return;
      }
      if (event.target.closest('[data-debit-remove]')) {
        removeBatchDebitItem(event.target.closest('[data-debit-remove]'));
        return;
      }
      if (event.target.closest('[data-assign-query]')) {
        refreshAssignModal(event.target.closest('[data-assign-modal]'));
      }
      if (event.target.closest('[data-adjustment-query]')) {
        refreshAdjustmentModal(event.target.closest('[data-adjustment-modal]'));
      }
    });
    document.body.addEventListener('input', event => {
      const search = event.target.closest('[data-account-picker-search]');
      if (!search) return;
      const keyword = search.value.trim().toLowerCase();
      const picker = search.closest('[data-account-picker]');
      let visibleCount = 0;
      picker?.querySelectorAll('[data-account-picker-option]').forEach(option => {
        const visible = !keyword || (option.dataset.accountKey || '').includes(keyword);
        option.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      picker?.classList.toggle('is-empty', visibleCount === 0);
    });
    document.body.addEventListener('change', event => {
      const modalMultiOption = event.target.closest('.modal-backdrop [data-multiselect-option]');
      if (modalMultiOption) {
        syncModalMultiselect(modalMultiOption.closest('[data-multiselect]'), modalMultiOption);
        return;
      }
      const uploadInput = event.target.closest('[data-upload-input]');
      if (!uploadInput) return;
      const zone = uploadInput.closest('[data-upload-zone]');
      const max = Number(zone?.dataset.uploadMax || 10);
      const files = Array.from(uploadInput.files || []).slice(0, max);
      const list = zone?.querySelector('[data-upload-list]');
      if (list) list.innerHTML = files.map(file => `<li>${icon('paperclip')}<span>${esc(file.name)}</span></li>`).join('');
      showToast(files.length ? `已选择 ${files.length} 个文件（最多 ${max} 个）` : '未选择文件', files.length ? 'success' : 'info');
    });
    document.body.addEventListener('dragover', event => {
      if (event.target.closest('[data-upload-zone]')) {
        event.preventDefault();
        event.target.closest('[data-upload-zone]')?.classList.add('is-dragover');
      }
    });
    document.body.addEventListener('dragleave', event => {
      event.target.closest('[data-upload-zone]')?.classList.remove('is-dragover');
    });
    document.body.addEventListener('drop', event => {
      const zone = event.target.closest('[data-upload-zone]');
      if (!zone) return;
      event.preventDefault();
      zone.classList.remove('is-dragover');
      const max = Number(zone.dataset.uploadMax || 10);
      const files = Array.from(event.dataTransfer?.files || []).slice(0, max);
      const list = zone.querySelector('[data-upload-list]');
      if (list) list.innerHTML = files.map(file => `<li>${icon('paperclip')}<span>${esc(file.name)}</span></li>`).join('');
      showToast(files.length ? `已拖拽上传 ${files.length} 个文件（原型）` : '未检测到文件', files.length ? 'success' : 'info');
    });
    document.body.addEventListener('paste', event => {
      const zone = event.target.closest('[data-upload-zone]');
      if (!zone) return;
      const max = Number(zone.dataset.uploadMax || 10);
      const files = Array.from(event.clipboardData?.files || []).slice(0, max);
      const list = zone.querySelector('[data-upload-list]');
      if (list && files.length) list.innerHTML = files.map((file, index) => `<li>${icon('image')}<span>${esc(file.name || `粘贴图片-${index + 1}.png`)}</span></li>`).join('');
      if (files.length) showToast(`已粘贴 ${files.length} 个文件（原型）`, 'success');
    });
    document.body.addEventListener('change', event => {
      const rechargeCustomer = event.target.closest('[data-recharge-customer]');
      if (rechargeCustomer) {
        const modalRoot = rechargeCustomer.closest('[data-recharge-modal]');
        modalRoot.querySelectorAll('[data-recharge-account]').forEach(input => { input.checked = false; });
        refreshRechargeModal(modalRoot);
        return;
      }
      const debitCustomer = event.target.closest('[data-debit-customer]');
      if (debitCustomer) {
        refreshBatchDebitWallet(debitCustomer.closest('[data-debit-modal]'));
        return;
      }
      if (event.target.closest('[data-debit-type], [data-debit-currency]')) {
        refreshBatchDebitTotal(event.target.closest('[data-debit-modal]'));
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
      const openingRuleSelect = event.target.closest('[data-opening-agent], [data-opening-type]');
      if (openingRuleSelect) {
        syncOpeningRulePreview(openingRuleSelect.closest('[data-opening-audit-modal]'), openingRuleSelect);
        return;
      }
      const openingAccountSource = event.target.closest('[data-opening-account-source]');
      if (openingAccountSource) {
        toggleOpeningAccountSource(openingAccountSource);
        return;
      }
      const openingSlotFailed = event.target.closest('[data-opening-slot-failed]');
      if (openingSlotFailed) {
        toggleOpeningSlotFailed(openingSlotFailed);
        return;
      }
      const openingApplyCreateSelect = event.target.closest('[data-opening-apply-create-modal] select, [data-opening-apply-create-modal] input');
      if (openingApplyCreateSelect) {
        const modalRoot = openingApplyCreateSelect.closest('[data-opening-apply-create-modal]');
        if (openingApplyCreateSelect.matches('[data-opening-merchant]')) syncOpeningApplyCustomers(modalRoot, false);
        if (openingApplyCreateSelect.matches('[data-opening-customer]')) syncOpeningApplyMerchantFromCustomer(modalRoot);
        if (openingApplyCreateSelect.matches('[data-opening-media]')) syncOpeningApplyAssetFields(modalRoot);
        if (openingApplyCreateSelect.matches('[data-opening-bm-ids]')) syncOpeningApplyAssetPreview(modalRoot);
        syncOpeningApplyEstimate(modalRoot);
        return;
      }
      const openingRuleConfigInput = event.target.closest('[data-opening-rule-config-modal] input, [data-opening-rule-config-modal] select, [data-opening-rule-config-modal] textarea');
      if (openingRuleConfigInput) {
        const modalRoot = openingRuleConfigInput.closest('[data-opening-rule-config-modal]');
        if (openingRuleConfigInput.matches('[data-budget-mode]') || openingRuleConfigInput.closest('[data-budget-range]')) syncOpeningBudgetRange(modalRoot);
        syncOpeningRuleConfigPreview(modalRoot);
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
      if (event.target.closest('[data-debit-amount]')) refreshBatchDebitTotal(event.target.closest('[data-debit-modal]'));
      if (event.target.closest('[data-assign-account-search]')) refreshAssignModal(event.target.closest('[data-assign-modal]'));
      if (event.target.closest('[data-adjustment-account-search]')) refreshAdjustmentModal(event.target.closest('[data-adjustment-modal]'));
      if (event.target.closest('[data-adjustment-amount-input]')) recalculateAdjustmentAmounts(event.target.closest('[data-adjustment-modal]'));
      if (event.target.closest('[data-opening-apply-create-modal] input, [data-opening-apply-create-modal] select')) {
        const modalRoot = event.target.closest('[data-opening-apply-create-modal]');
        if (event.target.matches('[data-opening-bm-ids]')) syncOpeningApplyAssetPreview(modalRoot);
        syncOpeningApplyEstimate(modalRoot);
      }
      if (event.target.closest('[data-opening-rule-config-modal] input, [data-opening-rule-config-modal] textarea')) syncOpeningRuleConfigPreview(event.target.closest('[data-opening-rule-config-modal]'));
      if (event.target.closest('[data-opening-fee-input], [data-opening-precharge-input]')) {
        const modalRoot = event.target.closest('[data-opening-audit-modal]');
        applyOpeningAuditQuote(modalRoot, openingSelectedRule(state.processingRow, modalRoot), state.processingRow);
      }
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
