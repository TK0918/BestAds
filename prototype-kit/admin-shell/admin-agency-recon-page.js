/*
 * 代理+我司数据核对（第一期）：按完成日 + 广告账户对比净充值。
 * 只注册给 admin-module-page.js；工单与明细交互由 BESTADS_AGENCY_RECON 提供。
 */
(function () {
  'use strict';

  const legacyHash = String(location.hash || '').replace('#', '');
  if (legacyHash === 'fetch' || legacyHash === 'agencies') {
    history.replaceState(null, '', '#token');
  }

  const merchant = value => `<span class="merchant-id">${value}</span>`;
  const money = value => {
    const text = String(value == null || value === '' ? '-' : value);
    if (text === '-') return '<span class="muted">-</span>';
    const number = Number(String(text).replace(/,/g, ''));
    const cls = number > 0 ? 'amount-positive' : number < 0 ? 'amount-negative' : 'amount-zero';
    return `<span class="${cls}">${text}</span>`;
  };
  const status = value => {
    const text = String(value == null || value === '' ? '-' : value);
    const cls = /一致|可用|已关闭|成功/.test(text) ? 'status-success'
      : /不一致|失效|失败|未覆盖/.test(text) ? 'status-danger'
      : /待处理|处理中|已变化|已飞书/.test(text) ? 'status-warning'
      : 'status-info';
    return `<span class="status-tag ${cls}">${text}</span>`;
  };

  const yesterday = '2026-10-07';
  const currentUser = '财务';
  const tokenOwners = ['业务-李敏', '业务-王凯', '业务-周宁'];
  const managedAgents = [
    { name: 'txm-test', englishName: 'txm-test' },
    { name: 'Rockads', englishName: 'Rockads' },
    { name: '飞书深诺', englishName: 'MeetSocial' },
    { name: '省广', englishName: 'Gimc' },
    { name: 'Madhouse', englishName: 'Madhouse' },
    { name: 'Aurora', englishName: 'Aurora' },
    { name: 'Bravotree', englishName: 'Bravotree' },
    { name: 'Wezonet', englishName: 'Wezonet' },
    { name: 'Navos', englishName: 'Navos' },
    { name: 'Panda', englishName: 'Panda' },
    { name: 'VB-Manual', englishName: 'VB-Manual' },
    { name: 'it-test', englishName: 'it-test' }
  ];
  const managedAgentOptions = managedAgents.map(item => (
    item.name === item.englishName ? item.name : `${item.name}（${item.englishName}）`
  ));

  function nowText() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  const line = (type, amount, time, extra) => Object.assign({ type, amount, time }, extra || {});

  const compareRows = [
    {
      ticketKey: '856275879259933|2026-10-07',
      bizDate: yesterday, accountId: '856275879259933', merchantId: '12080', customerName: 'Nguyễn',
      agency: 'Madhouse', currency: 'USD', agencyNet: '100.00', systemNet: '100.00', diff: '0.00',
      consistent: '一致', ticketStatus: '无', ops: ['查看明细'],
      agencyLines: [line('充值', '100.00', '2026-10-07 11:20:00')],
      systemLines: [line('充值', '100.00', '2026-10-07 11:22:14', { orderId: 'AD20261007112200100000' })]
    },
    {
      ticketKey: '856275879259933-struct|2026-10-07',
      bizDate: yesterday, accountId: '2244420556070169', merchantId: '11899', customerName: 'Vincent Dong',
      agency: 'Madhouse', currency: 'USD', agencyNet: '50.00', systemNet: '50.00', diff: '0.00',
      consistent: '一致', ticketStatus: '无', ops: ['查看明细'],
      agencyLines: [line('充值', '100.00', '2026-10-07 09:10:00'), line('清零', '50.00', '2026-10-07 16:40:00')],
      systemLines: [line('充值', '50.00', '2026-10-07 09:12:08', { orderId: 'AD20261007091200050000' })]
    },
    {
      ticketKey: '1314701019752433|2026-10-07',
      bizDate: yesterday, accountId: '1314701019752433', merchantId: '13663', customerName: '电商二组（程如喜）',
      agency: 'Aurora', currency: 'USD', agencyNet: '2,842.56', systemNet: '0.00', diff: '2,842.56',
      consistent: '不一致', ticketStatus: '无', ops: ['查看明细', '发起工单'],
      agencyLines: [line('充值', '2,842.56', '2026-10-07 08:03:11')],
      systemLines: []
    },
    {
      ticketKey: '1021140653761367|2026-10-07',
      bizDate: yesterday, accountId: '1021140653761367', merchantId: '17260', customerName: "Pierre'ecomaccelarator",
      agency: 'Bravotree', currency: 'USD', agencyNet: '456.12', systemNet: '455.00', diff: '1.12',
      consistent: '不一致', ticketStatus: '待处理', ops: ['查看明细', '查看工单'],
      agencyLines: [line('充值', '456.12', '2026-10-07 10:18:00')],
      systemLines: [line('充值', '455.00', '2026-10-07 10:19:22', { orderId: 'AD20261007101900455000' })]
    },
    {
      ticketKey: '3750892571904559|2026-10-07',
      bizDate: yesterday, accountId: '3750892571904559', merchantId: '11894', customerName: 'MUXUE TRADE LIMITED',
      agency: 'Wezonet', currency: 'USD', agencyNet: '0.00', systemNet: '500.00', diff: '-500.00',
      consistent: '不一致', ticketStatus: '处理中', ops: ['查看明细', '查看工单'],
      agencyLines: [],
      systemLines: [line('充值', '500.00', '2026-10-07 11:39:57', { orderId: 'AD20261007113900500000' })]
    },
    {
      ticketKey: '28067485699542651|2026-10-07',
      bizDate: yesterday, accountId: '28067485699542651', merchantId: '14012', customerName: 'SCL HK',
      agency: 'Navos', currency: 'USD', agencyNet: '100.00', systemNet: '0.00', diff: '100.00',
      consistent: '不一致', ticketStatus: '已关闭', ops: ['查看明细', '查看工单'],
      agencyLines: [line('充值', '100.00', '2026-10-07 14:02:00')],
      systemLines: []
    },
    {
      ticketKey: '1314701019752433|2026-10-06',
      bizDate: '2026-10-06', accountId: '1314701019752433', merchantId: '13663', customerName: '电商二组（程如喜）',
      agency: 'Aurora', currency: 'USD', agencyNet: '2,542.18', systemNet: '2,542.18', diff: '0.00',
      consistent: '一致', ticketStatus: '无', ops: ['查看明细'],
      agencyLines: [line('充值', '2,542.18', '2026-10-06 23:50:00')],
      systemLines: [line('充值', '2,542.18', '2026-10-07 00:06:02', { orderId: 'AD20261007000600254218' })]
    },
    {
      ticketKey: '856275879259933|2026-10-05',
      bizDate: '2026-10-05', accountId: '856275879259933', merchantId: '12080', customerName: 'Nguyễn',
      agency: 'Madhouse', currency: 'USD', agencyNet: '80.00', systemNet: '80.00', diff: '0.00',
      consistent: '一致', ticketStatus: '无', ops: ['查看明细'],
      agencyLines: [line('充值', '80.00', '2026-10-05 15:00:00')],
      systemLines: [line('充值', '80.00', '2026-10-05 15:01:20', { orderId: 'AD20261005150100080000' })]
    }
  ];

  const ticketRows = [
    {
      ticketId: 'WO-20261007-001', ticketKey: '1021140653761367|2026-10-07',
      bizDate: yesterday, accountId: '1021140653761367', merchantId: '17260', customerName: "Pierre'ecomaccelarator",
      agency: 'Bravotree', currency: 'USD', ticketStatus: '待处理', createdAt: '2026-10-08 11:20:00',
      startedAt: '', startedBy: '', closedAt: '', closedBy: '', closeRemark: '',
      snapAgencyNet: '456.12', snapSystemNet: '455.00', snapDiff: '1.12',
      ops: ['查看工单', '开始处理'],
      snapAgencyLines: [line('充值', '456.12', '2026-10-07 10:18:00')],
      snapSystemLines: [line('充值', '455.00', '2026-10-07 10:19:22', { orderId: 'AD20261007101900455000' })]
    },
    {
      ticketId: 'WO-20261007-002', ticketKey: '3750892571904559|2026-10-07',
      bizDate: yesterday, accountId: '3750892571904559', merchantId: '11894', customerName: 'MUXUE TRADE LIMITED',
      agency: 'Wezonet', currency: 'USD', ticketStatus: '处理中', createdAt: '2026-10-08 10:05:00',
      startedAt: '2026-10-08 10:20:00', startedBy: '财务', closedAt: '', closedBy: '', closeRemark: '',
      snapAgencyNet: '0.00', snapSystemNet: '500.00', snapDiff: '-500.00',
      ops: ['查看工单', '关闭工单'],
      snapAgencyLines: [],
      snapSystemLines: [line('充值', '500.00', '2026-10-07 11:39:57', { orderId: 'AD20261007113900500000' })]
    },
    {
      ticketId: 'WO-20261007-003', ticketKey: '28067485699542651|2026-10-07',
      bizDate: yesterday, accountId: '28067485699542651', merchantId: '14012', customerName: 'SCL HK',
      agency: 'Navos', currency: 'USD', ticketStatus: '已关闭', createdAt: '2026-10-08 09:40:00',
      startedAt: '2026-10-08 09:48:00', startedBy: '财务',
      closedAt: '2026-10-08 10:02:00', closedBy: '财务',
      snapAgencyNet: '80.00', snapSystemNet: '0.00', snapDiff: '80.00',
      closeRemark: '代理后补流水与快照不一致，已人工核对差额来源后关闭。',
      ops: ['查看工单'],
      snapAgencyLines: [line('充值', '80.00', '2026-10-07 14:02:00')],
      snapSystemLines: []
    }
  ];

  function tokenOps(status) {
    return status === '启用' ? ['编辑', '停用'] : ['编辑', '启用'];
  }

  const tokenRows = [
    { agency: 'Madhouse', agents: 'Madhouse', tokenStatus: '可用', lastSuccessAt: '2026-10-08 10:12:03', coverDate: yesterday, changeFlag: '无变化', notify: '-', owner: '业务-李敏', status: '启用', ops: tokenOps('启用') },
    { agency: 'Aurora', agents: 'Aurora', tokenStatus: '可用', lastSuccessAt: '2026-10-08 10:12:40', coverDate: yesterday, changeFlag: '已变化', notify: '已飞书', owner: '业务-李敏', status: '启用', ops: tokenOps('启用') },
    { agency: 'Bravotree', agents: 'Bravotree', tokenStatus: '可用', lastSuccessAt: '2026-10-08 10:13:02', coverDate: yesterday, changeFlag: '无变化', notify: '-', owner: '业务-王凯', status: '启用', ops: tokenOps('启用') },
    { agency: 'Wezonet', agents: 'Wezonet', tokenStatus: '可用', lastSuccessAt: '2026-10-08 10:13:18', coverDate: yesterday, changeFlag: '无变化', notify: '-', owner: '业务-王凯', status: '启用', ops: tokenOps('启用') },
    { agency: 'Navos', agents: 'Navos', tokenStatus: '可用', lastSuccessAt: '2026-10-08 10:13:31', coverDate: yesterday, changeFlag: '已变化', notify: '已飞书', owner: '业务-李敏', status: '启用', ops: tokenOps('启用') },
    { agency: 'Rockads', agents: 'Rockads', tokenStatus: '失效', lastSuccessAt: '2026-10-07 10:11:08', coverDate: '2026-10-06', changeFlag: '-', notify: '已飞书（token）', owner: '业务-周宁', status: '启用', ops: tokenOps('启用') },
    { agency: 'MeetSocial', agents: '飞书深诺（MeetSocial）', tokenStatus: '可用', lastSuccessAt: '2026-10-07 10:14:00', coverDate: '2026-10-06', changeFlag: '失败未覆盖', notify: '已飞书', owner: '业务-周宁', status: '启用', ops: tokenOps('启用') },
    { agency: 'VB-Manual', agents: 'VB-Manual', tokenStatus: '未覆盖', lastSuccessAt: '-', coverDate: '-', changeFlag: '-', notify: '-', owner: '-', status: '启用', ops: tokenOps('启用') }
  ];

  function enabledAgencies() {
    return tokenRows.filter(row => row.status === '启用').map(row => row.agency);
  }

  function ticketOps(status) {
    if (status === '待处理') return ['查看工单', '开始处理'];
    if (status === '处理中') return ['查看工单', '关闭工单'];
    return ['查看工单'];
  }

  function compareOps(row) {
    if (row.consistent !== '不一致') return ['查看明细'];
    return row.ticketStatus === '无' ? ['查看明细', '发起工单'] : ['查看明细', '查看工单'];
  }

  function findCompare(tabs, key) {
    const tab = (tabs || []).find(item => item.id === 'compare');
    return (tab?.rows || []).find(row => row.ticketKey === key);
  }

  function findTicket(tabs, key) {
    const tab = (tabs || []).find(item => item.id === 'tickets');
    return (tab?.rows || []).find(row => row.ticketKey === key);
  }

  function parseAgentList(value) {
    return String(value || '').split(/[、/,，\s]+/).map(item => item.trim()).filter(Boolean);
  }

  function syncAgencyFilters(tabs) {
    const names = enabledAgencies();
    (tabs || []).forEach(tab => {
      const field = (tab.filters || []).find(item => item.key === 'agency' && item.type === 'select');
      if (field) field.options = names;
    });
  }

  function emptyTokenHealth() {
    return {
      tokenStatus: '未覆盖',
      lastSuccessAt: '-',
      coverDate: '-',
      changeFlag: '-',
      notify: '-'
    };
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function wrap(value) {
    const text = String(value == null || value === '' ? '-' : value);
    return text === '-' ? '<span class="muted">-</span>' : `<span class="wrap">${esc(text)}</span>`;
  }

  function linesTable(title, lines) {
    if (!lines || !lines.length) {
      return `<div class="notice" style="margin-top:12px">${esc(title)}：无</div>`;
    }
    const rows = lines.map(item => `<tr><td>${esc(item.type)}</td><td class="num">${esc(item.amount)}</td><td>${esc(item.time)}</td><td>${esc(item.orderId || '-')}</td></tr>`).join('');
    return `<h3 class="admin-card__title" style="margin:16px 0 8px">${esc(title)}</h3><div class="table-scroll"><table class="admin-table"><thead><tr><th>类型</th><th>金额</th><th>时间</th><th>系统单号</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function netPair(row) {
    return [
      ['完成日', row.bizDate],
      ['广告账户ID', row.accountId],
      ['商户ID', row.merchantId],
      ['客户名称', row.customerName],
      ['归类代理', row.agency],
      ['币种', row.currency],
      ['代理净充值', row.agencyNet],
      ['我司净充值', row.systemNet],
      ['差额', row.diff],
      ['是否一致', row.consistent]
    ];
  }

  function grid(pairs) {
    return `<dl class="detail-grid">${pairs.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value == null || value === '' ? '-' : value)}</dd></div>`).join('')}</dl>`;
  }

  function detailHtml(row) {
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">当前明细</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="notice">这是库里最新数据，不是工单快照。净额一致时不能发起工单。</div>${grid(netPair(row))}${linesTable('代理流水', row.agencyLines)}${linesTable('我司完成单', row.systemLines)}</div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function createTicketHtml(row) {
    return `<div class="modal-backdrop" data-agency-recon-create-ticket><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">发起工单</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="notice">将冻结此时净额和明细。之后代理数据再变，不改这张单。同一广告账户 + 同一完成日全期只有一张。</div>${grid(netPair(row))}${linesTable('将写入快照的代理流水', row.agencyLines)}${linesTable('将写入快照的我司完成单', row.systemLines)}</div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确认发起</button></div></section></div>`;
  }

  function ticketHtml(ticket, current) {
    const stillDiff = current && current.consistent === '不一致' ? '仍差' : '已平';
    const currentLine = current
      ? `<div class="notice" style="margin-top:12px">当前最新：代理 ${esc(current.agencyNet)} / 我司 ${esc(current.systemNet)} / 差额 ${esc(current.diff)}，${esc(stillDiff)}。只读对照，不改工单结论。</div>`
      : '<div class="notice" style="margin-top:12px">找不到当前对比行。</div>';
    const closedNotice = ticket.ticketStatus === '已关闭'
      ? '<div class="notice">该完成日该账户已有工单且已关闭。若净额又不一致，继续在本单跟进，不另开。</div>'
      : '';
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">工单 ${esc(ticket.ticketId)}</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body">${closedNotice}<dl class="detail-grid"><div><dt>状态</dt><dd>${esc(ticket.ticketStatus)}</dd></div><div><dt>完成日</dt><dd>${esc(ticket.bizDate)}</dd></div><div><dt>广告账户ID</dt><dd>${esc(ticket.accountId)}</dd></div><div><dt>商户ID</dt><dd>${esc(ticket.merchantId)}</dd></div><div><dt>客户名称</dt><dd>${esc(ticket.customerName)}</dd></div><div><dt>归类代理</dt><dd>${esc(ticket.agency)}</dd></div><div><dt>快照代理净额</dt><dd>${esc(ticket.snapAgencyNet)}</dd></div><div><dt>快照我司净额</dt><dd>${esc(ticket.snapSystemNet)}</dd></div><div><dt>快照差额</dt><dd>${esc(ticket.snapDiff)}</dd></div><div><dt>发起时间</dt><dd>${esc(ticket.createdAt || '-')}</dd></div><div><dt>开始处理时间</dt><dd>${esc(ticket.startedAt || '-')}</dd></div><div><dt>开始处理人</dt><dd>${esc(ticket.startedBy || '-')}</dd></div><div><dt>关闭时间</dt><dd>${esc(ticket.closedAt || '-')}</dd></div><div><dt>关闭人</dt><dd>${esc(ticket.closedBy || '-')}</dd></div><div><dt>关闭备注</dt><dd>${esc(ticket.closeRemark || '-')}</dd></div></dl>${currentLine}${linesTable('快照：代理流水', ticket.snapAgencyLines)}${linesTable('快照：我司完成单', ticket.snapSystemLines)}</div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function closeTicketHtml(row) {
    return `<div class="modal-backdrop" data-agency-recon-close-ticket><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">关闭工单</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="notice">关闭后该账户该完成日不再另开新单。之后再差，回本单跟进。</div><dl class="detail-grid"><div><dt>工单号</dt><dd>${esc(row.ticketId)}</dd></div><div><dt>完成日</dt><dd>${esc(row.bizDate)}</dd></div><div><dt>广告账户ID</dt><dd>${esc(row.accountId)}</dd></div><div><dt>快照差额</dt><dd>${esc(row.snapDiff)}</dd></div></dl><div class="form-grid" style="margin-top:12px"><div class="form-field full"><label>关闭备注</label><textarea name="closeRemark" rows="4" placeholder="可记录核对结论、已做处理。非必填。"></textarea><p class="field-help">非必填。例如：已在代理后台补单，或确认差额为手续费后关闭。</p></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确认关闭</button></div></section></div>`;
  }

  function cloneLines(lines) {
    return (lines || []).map(item => Object.assign({}, item));
  }

  function nextTicketId(tickets) {
    const seq = String((tickets.rows || []).length + 1).padStart(3, '0');
    return `WO-20261007-${seq}`;
  }

  function refreshKpis(config, compareRows) {
    const compare = (config.tabs || []).find(item => item.id === 'compare');
    if (!compare || !config.kpis) return;
    const data = compareRows || compare.rows || [];
    const mismatch = data.filter(row => row.consistent === '不一致').length;
    const openable = data.filter(row => row.consistent === '不一致' && row.ticketStatus === '无').length;
    config.kpis.forEach(item => {
      if (item.label === '对比行') item.value = String(data.length);
      if (item.label === '净额不一致') item.value = String(mismatch);
      if (item.label === '可发起工单') item.value = String(openable);
    });
  }

  const configs = {
    'agency-recon': {
      title: '代理+我司数据核对',
      subtitle: '按完成日 + 广告账户对比代理与我司净充值。净额不一致才可发起工单；工单冻结当时快照。',
      kpis: [
        { label: '对比行', value: '6', hint: '当前完成日区间内的账户行' },
        { label: '净额不一致', value: '4', hint: '差额超过最小货币单位' },
        { label: '可发起工单', value: '1', hint: '不一致且尚未有单' }
      ],
      tabs: [
        {
          id: 'compare',
          label: '净充值对比',
          filterClass: 'cols-5',
          defaultFilters: { bizDateStart: yesterday, bizDateEnd: yesterday },
          filters: [
            { key: 'bizDate', label: '完成日', type: 'daterange' },
            { key: 'agency', label: '归类代理', type: 'select', options: enabledAgencies() },
            { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
            { key: 'consistent', label: '是否一致', type: 'select', options: ['一致', '不一致'] },
            { key: 'ticketStatus', label: '工单', type: 'select', options: ['无', '待处理', '处理中', '已关闭'] }
          ],
          footerNote: '默认昨天。把完成日改成 2026-10-05 至 2026-10-07 可看到按天 + 账户展开的多行，不会合成一条。净额一致（含构成不同但净额相同）不能发起工单。',
          tableMinWidth: 1880,
          opsWidth: 168,
          columns: [
            { key: 'bizDate', label: '完成日', width: 120 },
            { key: 'accountId', label: '广告账户ID', align: 'left', width: 170 },
            { key: 'merchantId', label: '商户ID', format: merchant, width: 100 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'agency', label: '归类代理', align: 'left', width: 120 },
            { key: 'currency', label: '币种', width: 80 },
            { key: 'agencyNet', label: '代理净充值', format: money, num: true, width: 130 },
            { key: 'systemNet', label: '我司净充值', format: money, num: true, width: 130 },
            { key: 'diff', label: '差额', format: money, num: true, width: 110 },
            { key: 'consistent', label: '是否一致', format: status, width: 100 },
            { key: 'ticketStatus', label: '工单', format: status, width: 100 }
          ],
          rows: compareRows
        },
        {
          id: 'tickets',
          label: '工单',
          filterClass: 'cols-5',
          filters: [
            { key: 'bizDate', label: '完成日', type: 'date' },
            { key: 'agency', label: '归类代理', type: 'select', options: enabledAgencies() },
            { key: 'accountId', label: '广告账户ID', placeholder: '输入广告账户ID' },
            { key: 'ticketStatus', label: '状态', type: 'select', options: ['待处理', '处理中', '已关闭'] }
          ],
          footerNote: '同一广告账户 + 同一完成日全期一张。已关闭后再差，回本单跟进。快照不随后续爬取改写。',
          tableMinWidth: 2480,
          opsWidth: 168,
          columns: [
            { key: 'ticketId', label: '工单号', align: 'left', width: 150 },
            { key: 'bizDate', label: '完成日', width: 120 },
            { key: 'accountId', label: '广告账户ID', align: 'left', width: 170 },
            { key: 'merchantId', label: '商户ID', format: merchant, width: 100 },
            { key: 'customerName', label: '客户名称', align: 'left', width: 180 },
            { key: 'agency', label: '归类代理', align: 'left', width: 120 },
            { key: 'snapDiff', label: '快照差额', format: money, num: true, width: 120 },
            { key: 'ticketStatus', label: '状态', format: status, width: 100 },
            { key: 'createdAt', label: '发起时间', width: 170 },
            { key: 'startedAt', label: '开始处理时间', width: 170 },
            { key: 'startedBy', label: '开始处理人', width: 110 },
            { key: 'closedAt', label: '关闭时间', width: 170 },
            { key: 'closedBy', label: '关闭人', width: 100 },
            { key: 'closeRemark', label: '关闭备注', align: 'left', format: wrap, width: 240 }
          ],
          rows: ticketRows
        },
        {
          id: 'token',
          label: '代理Token',
          kpis: [],
          filterClass: 'cols-3',
          actions: [{ id: 'create', label: '新增归类', icon: 'plus', primary: true }],
          filters: [
            { key: 'agency', label: '归类代理', placeholder: '输入归类代理' },
            { key: 'tokenStatus', label: 'Token', type: 'select', options: ['可用', '失效', '未覆盖'] },
            { key: 'status', label: '状态', type: 'select', options: ['启用', '停用'] }
          ],
          footerNote: '把代理管理里的代理归到同一套 token。Token 失效飞书给负责人重登，由插件更新。未覆盖表示还没有可用 token。不配时区、不配导出模板。',
          tableMinWidth: 1680,
          opsWidth: 120,
          columns: [
            { key: 'agency', label: '归类代理', align: 'left', width: 140 },
            { key: 'agents', label: '代理', align: 'left', format: wrap, width: 200 },
            { key: 'tokenStatus', label: 'Token', format: status, width: 90 },
            { key: 'lastSuccessAt', label: '最近成功', width: 170 },
            { key: 'coverDate', label: '覆盖完成日', width: 130 },
            { key: 'changeFlag', label: '相对上次', format: status, width: 120 },
            { key: 'notify', label: '飞书', width: 140 },
            { key: 'owner', label: 'Token 负责人', width: 120 },
            { key: 'status', label: '状态', format: status, width: 90 }
          ],
          rows: tokenRows,
          modal: {
            title: '新增归类',
            editTitle: '编辑归类',
            size: 'lg',
            backdropAttr: 'data-agency-recon-token-config',
            notice: '选项来自代理管理。一个代理只能进一个归类。Token 状态由爬取结果带出，这里不能改。',
            fields: [
              { key: 'agency', label: '归类代理', placeholder: '例如 Madhouse', help: '对比表、工单、飞书用这个名字。' },
              { key: 'agents', label: '代理', control: 'multiselect', options: managedAgentOptions, join: '、', placeholder: '选择代理管理中的代理', full: true, help: '来自代理管理。中英文不同时括号内为英文名。一个代理不能同时属于两个归类。' },
              { key: 'owner', label: 'Token 负责人', control: 'select', options: tokenOwners, placeholder: '选择负责人', required: false, help: 'Token 失效时飞书找这个人。没有 token 的归类可先不填。' },
              { key: 'status', label: '状态', control: 'select', options: ['启用', '停用'], placeholder: '选择状态' }
            ]
          }
        }
      ]
    }
  };

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, configs);

  window.BESTADS_AGENCY_RECON = {
    refreshKpis,
    handleRowAction(action, row, api) {
      const tabs = api.tabs;
      if (action === '查看明细') {
        api.openModal(detailHtml(row));
        return true;
      }
      if (action === '发起工单') {
        if (row.consistent !== '不一致') {
          api.showToast('净额一致，不能发起工单', 'error');
          return true;
        }
        const existing = findTicket(tabs, row.ticketKey);
        if (existing) {
          api.state.tab = 'tickets';
          api.render();
          api.openModal(ticketHtml(existing, findCompare(tabs, row.ticketKey)));
          api.showToast('该账户该完成日已有工单，已打开旧单', 'info');
          return true;
        }
        api.state.processingRow = row;
        api.openModal(createTicketHtml(row));
        return true;
      }
      if (action === '查看工单') {
        const found = findTicket(tabs, row.ticketKey) || (tabs.find(item => item.id === 'tickets')?.rows || []).find(item => item.ticketId === row.ticketId);
        if (!found) {
          api.showToast('未找到工单', 'error');
          return true;
        }
        api.state.tab = 'tickets';
        api.render();
        api.openModal(ticketHtml(found, findCompare(tabs, found.ticketKey)));
        return true;
      }
      if (action === '开始处理') {
        row.ticketStatus = '处理中';
        row.startedAt = nowText();
        row.startedBy = currentUser;
        row.ops = ticketOps('处理中');
        const compare = findCompare(tabs, row.ticketKey);
        if (compare) {
          compare.ticketStatus = '处理中';
          compare.ops = compareOps(compare);
        }
        refreshKpis(api.config);
        api.render();
        api.showToast('工单已开始处理（原型）', 'success');
        return true;
      }
      if (action === '关闭工单') {
        api.state.processingRow = row;
        api.openModal(closeTicketHtml(row));
        return true;
      }
      if ((action === '启用' || action === '停用') && api.state.tab === 'token') {
        const next = action === '启用' ? '启用' : '停用';
        row.status = next;
        row.ops = tokenOps(next);
        syncAgencyFilters(tabs);
        api.render();
        api.showToast(next === '停用' ? '已停用。对比筛选不再列出；已有对比行不改。' : '已启用（原型）', 'success');
        return true;
      }
      return false;
    },
    handleSubmit(backdrop, api) {
      if (backdrop?.matches('[data-agency-recon-token-config]')) {
        const tokens = (api.tabs || []).find(item => item.id === 'token');
        if (!tokens) {
          api.showToast('未找到代理Token配置', 'error');
          return true;
        }
        const agency = (backdrop.querySelector('[name="agency"]')?.value || '').trim();
        const agentsValue = (backdrop.querySelector('[name="agents"]')?.value || '').trim();
        const agentList = parseAgentList(agentsValue);
        const owner = (backdrop.querySelector('[name="owner"]')?.value || '').trim();
        const status = (backdrop.querySelector('[name="status"]')?.value || '启用').trim() || '启用';
        const current = api.state.processingRow;
        if (!agency) { api.showToast('请填写归类代理', 'error'); return true; }
        if (!agentList.length) { api.showToast('请选择至少一个代理', 'error'); return true; }
        const nameClash = (tokens.rows || []).find(item => item !== current && item.agency === agency);
        if (nameClash) { api.showToast('归类代理名称已存在', 'error'); return true; }
        const used = new Set();
        for (const item of tokens.rows || []) {
          if (item === current) continue;
          parseAgentList(item.agents).forEach(name => used.add(name));
        }
        const overlap = agentList.find(name => used.has(name));
        if (overlap) {
          api.showToast(`代理 ${overlap} 已属于其他归类`, 'error');
          return true;
        }
        const payload = Object.assign({}, current ? {} : emptyTokenHealth(), {
          agency,
          agents: agentList.join('、'),
          owner: owner || '-',
          status,
          ops: tokenOps(status)
        });
        if (current) Object.assign(current, payload);
        else tokens.rows.unshift(payload);
        syncAgencyFilters(api.tabs);
        api.state.processingRow = null;
        api.closeModal();
        api.render();
        api.showToast(current ? '归类已保存。已有对比行不会改名。' : '已新增归类（原型）', 'success');
        return true;
      }
      if (backdrop?.matches('[data-agency-recon-close-ticket]')) {
        const row = api.state.processingRow;
        if (!row) {
          api.showToast('未找到工单', 'error');
          return true;
        }
        row.ticketStatus = '已关闭';
        row.closedAt = nowText();
        row.closedBy = currentUser;
        row.closeRemark = (backdrop.querySelector('[name="closeRemark"]')?.value || '').trim();
        row.ops = ticketOps('已关闭');
        const compare = findCompare(api.tabs, row.ticketKey);
        if (compare) {
          compare.ticketStatus = '已关闭';
          compare.ops = compareOps(compare);
        }
        api.state.processingRow = null;
        refreshKpis(api.config);
        api.closeModal();
        api.render();
        api.showToast(row.closeRemark ? '工单已关闭，备注已记下（原型）' : '工单已关闭。之后该日该账户再差，仍回本单（原型）', 'success');
        return true;
      }
      if (!backdrop?.matches('[data-agency-recon-create-ticket]')) return false;
      const row = api.state.processingRow;
      const tickets = (api.tabs || []).find(item => item.id === 'tickets');
      if (!row || !tickets) {
        api.showToast('无法创建工单', 'error');
        return true;
      }
      if (findTicket(api.tabs, row.ticketKey)) {
        api.showToast('该账户该完成日已有工单', 'info');
        api.closeModal();
        return true;
      }
      const ticket = {
        ticketId: nextTicketId(tickets),
        ticketKey: row.ticketKey,
        bizDate: row.bizDate,
        accountId: row.accountId,
        merchantId: row.merchantId,
        customerName: row.customerName,
        agency: row.agency,
        currency: row.currency,
        ticketStatus: '待处理',
        createdAt: nowText(),
        startedAt: '',
        startedBy: '',
        closedAt: '',
        closedBy: '',
        closeRemark: '',
        snapAgencyNet: row.agencyNet,
        snapSystemNet: row.systemNet,
        snapDiff: row.diff,
        ops: ticketOps('待处理'),
        snapAgencyLines: cloneLines(row.agencyLines),
        snapSystemLines: cloneLines(row.systemLines)
      };
      tickets.rows.unshift(ticket);
      row.ticketStatus = '待处理';
      row.ops = compareOps(row);
      api.state.processingRow = null;
      refreshKpis(api.config);
      api.closeModal();
      api.state.tab = 'tickets';
      api.render();
      api.showToast(`已发起 ${ticket.ticketId}，快照已冻结（原型）`, 'success');
      return true;
    }
  };
})();
