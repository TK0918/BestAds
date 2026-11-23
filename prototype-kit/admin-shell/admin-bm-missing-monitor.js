/*
 * 未进 BM 监控：通知日志 + 黑名单。
 * 数据只在当前页面更新，不调用真实接口。
 */
(function () {
  'use strict';

  const PAGE_ID = 'bm-missing-monitor';
  const operator = '管理员(admin@bestfulfill.com)';
  const CHUNK = 50;
  let groupName = '业务飞书群';
  let pendingRow = null;

  const esc = value => String(value == null ? '' : value)
    .replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const person = value => `<span class="person-cell">${esc(value || '-')}</span>`;
  const resultTag = value => {
    const text = value || '-';
    const cls = text === '未发送' ? 'status-warning' : 'status-success';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };
  const normId = value => String(value || '').trim().replace(/^act_/i, '');
  const nowText = () => {
    const date = new Date();
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  const isPage = () => (document.body?.dataset?.adminPage || '') === PAGE_ID;
  const readForm = backdrop => {
    const data = {};
    backdrop.querySelectorAll('[name]').forEach(node => {
      data[node.name] = String(node.value || '').trim();
    });
    return data;
  };
  const br = value => esc(value || '').replace(/\n/g, '<br>');

  function messageParts(checkedAt, accounts) {
    const total = accounts.length;
    const parts = Math.ceil(total / CHUNK);
    return Array.from({ length: parts }, (_, index) => {
      const slice = accounts.slice(index * CHUNK, (index + 1) * CHUNK);
      const head = parts > 1
        ? `未进入已绑定 BM 的广告账户（${checkedAt.slice(0, 16)}）\n第 ${index + 1}/${parts} 条，共 ${total} 个`
        : `未进入已绑定 BM 的广告账户（${checkedAt.slice(0, 16)}）\n共 ${total} 个`;
      const lines = slice.map(item => `${item.accountId}${item.accountName ? ` ${item.accountName}` : ''}`);
      return `${head}\n${lines.join('\n')}\n请将上述广告账户授权到已绑定 BM。`;
    });
  }

  function manyAccounts() {
    return Array.from({ length: 60 }, (_, index) => {
      const seq = String(index + 1).padStart(2, '0');
      return { accountId: String(700000000000000 + index + 1), accountName: `FB-MISSING-${seq}` };
    });
  }

  const morningAccounts = [
    { accountId: '1292368695505904', accountName: 'MX-G-12-620' },
    { accountId: '999000111222333', accountName: 'test-upload-01' }
  ];
  const afternoonAccounts = manyAccounts();
  const morningAt = '2026-11-21 10:00:00';
  const afternoonAt = '2026-11-21 14:00:00';
  const eveningAt = '2026-11-21 18:00:00';

  const logs = [
    {
      checkedAt: eveningAt,
      diffCount: '-',
      sendState: '未发飞书',
      resultText: '未发送',
      groupName: '业务飞书群',
      accounts: [],
      messages: ['资产同步结果为空，本轮未发送。'],
      ops: ['查看名单']
    },
    {
      checkedAt: afternoonAt,
      diffCount: '60',
      sendState: '已发飞书',
      resultText: '已发送 2 条',
      groupName: '业务飞书群',
      accounts: afternoonAccounts,
      messages: messageParts(afternoonAt, afternoonAccounts),
      ops: ['查看名单']
    },
    {
      checkedAt: morningAt,
      diffCount: '2',
      sendState: '已发飞书',
      resultText: '已发送',
      groupName: '业务飞书群',
      accounts: morningAccounts,
      messages: messageParts(morningAt, morningAccounts),
      ops: ['查看名单']
    }
  ];

  const blacklist = [
    { accountId: '999000111222333', accountName: 'test-upload-01', remark: '测试', addedBy: operator, addedAt: '2026-11-21 11:20:08', ops: ['移除'] },
    { accountId: '888000111222344', accountName: 'old-unused-02', remark: '弃用', addedBy: '王五(wangwu@bestfulfill.com)', addedAt: '2026-11-15 16:40:22', ops: ['移除'] }
  ];

  const logTab = {
    id: 'notice-log',
    label: '通知日志',
    filters: [
      { key: 'checkedAt', label: '检测时间', type: 'daterange' },
      { key: 'sendState', label: '飞书结果', type: 'select', options: ['已发飞书', '未发飞书'], placeholder: '请选择飞书结果' }
    ],
    actions: [{ id: 'notify-group', label: '通知群', icon: 'bell', align: 'right' }],
    filterClass: 'cols-3',
    tableMinWidth: 760,
    opsWidth: 110,
    columns: [
      { key: 'checkedAt', label: '检测时间', width: 180, sort: true },
      { key: 'diffCount', label: '差集条数', width: 120, sort: true },
      { key: 'resultText', label: '飞书结果', width: 140, format: resultTag }
    ],
    rows: logs,
    footerNote: '',
    modals: {
      '通知群': { type: 'bm-missing-group', title: '通知群' }
    }
  };

  const blackTab = {
    id: 'blacklist',
    label: '黑名单',
    filters: [
      { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
      { key: 'remark', label: '备注', placeholder: '请输入备注' }
    ],
    actions: [
      { id: 'add-blacklist', label: '新增', icon: 'plus', primary: true },
      { id: 'notify-group', label: '通知群', icon: 'bell', align: 'right' }
    ],
    filterClass: 'cols-3',
    tableMinWidth: 1100,
    opsWidth: 90,
    columns: [
      { key: 'accountId', label: '广告账户ID', width: 180, sort: true },
      { key: 'accountName', label: '广告账户名称', align: 'left', width: 220 },
      { key: 'remark', label: '备注', align: 'left', width: 180 },
      { key: 'addedBy', label: '添加人', align: 'left', width: 260, format: person },
      { key: 'addedAt', label: '添加时间', width: 180, sort: true }
    ],
    rows: blacklist,
    footerNote: '',
    modals: {
      '新增': {
        title: '新增黑名单',
        backdropAttr: 'data-bm-missing-add',
        fields: [
          { key: 'accountId', label: '广告账户ID', placeholder: '请输入广告账户ID' },
          { key: 'accountName', label: '广告账户名称', required: false, placeholder: '选填，没有名称也可以加入' },
          { key: 'remark', label: '备注', control: 'textarea', full: true, required: false, placeholder: '可填测试或弃用' }
        ]
      },
      '通知群': { type: 'bm-missing-group', title: '通知群' }
    }
  };

  function syncNotes() {
    logTab.footerNote = `每天 10:00、14:00、18:00 检测。有差集才发飞书，差集为空不记日志。当前通知群是「${groupName}」。改群只影响之后的发送。`;
    blackTab.footerNote = '黑名单中的广告账户不进入差集。移除后若仍不在已绑定 BM，下一次检测会重新发出。已有通知日志不改。';
  }
  syncNotes();

  function detailModal(row) {
    const accounts = row.accounts || [];
    const messages = (row.messages || []).map(part => `<div class="confirm-copy" style="margin-top:12px">${br(part)}</div>`).join('');
    const table = accounts.length
      ? `<div class="table-scroll" style="max-height:320px;margin-top:12px"><table class="admin-table"><thead><tr><th>广告账户ID</th><th>广告账户名称</th></tr></thead><tbody>${accounts.map(item => `<tr><td>${esc(item.accountId)}</td><td class="left">${esc(item.accountName || '-')}</td></tr>`).join('')}</tbody></table></div>`
      : '';
    return `<div class="modal-backdrop" data-bm-missing-detail><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">查看名单</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><dl class="detail-grid"><div><dt>检测时间</dt><dd>${esc(row.checkedAt || '-')}</dd></div><div><dt>差集条数</dt><dd>${esc(row.diffCount || '-')}</dd></div><div><dt>飞书结果</dt><dd>${esc(row.resultText || '-')}</dd></div><div><dt>本轮通知群</dt><dd>${esc(row.groupName || '-')}</dd></div></dl>${messages}${table}</div><div class="modal__footer"><button type="button" class="btn btn-primary" data-modal-close>知道了</button></div></section></div>`;
  }

  function removeModal(row) {
    const name = row.accountName ? `${row.accountId} ${row.accountName}` : row.accountId;
    return `<div class="modal-backdrop" data-bm-missing-remove><section class="modal modal-sm"><div class="modal__header"><h2 class="modal__title">移除黑名单</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="confirm-copy">移除 <strong>${esc(name)}</strong> 后，该广告账户若仍不在已绑定 BM，会从下一次检测重新进入飞书。已发出的通知日志不变。</div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-danger" data-modal-submit>移除</button></div></section></div>`;
  }

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign(window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    [PAGE_ID]: {
      title: '未进 BM 监控',
      tabs: [logTab, blackTab]
    }
  });

  window.BESTADS_BM_MISSING = {
    isPage,
    renderGroupModal(modal) {
      return `<div class="modal-backdrop" data-bm-missing-group><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(modal.title || '通知群')}</h2><button class="modal__close" type="button" data-modal-close><i class="fas fa-times" aria-hidden="true"></i></button></div><div class="modal__body"><div class="form-grid"><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 通知群</label><input name="groupName" type="text" value="${esc(groupName)}" placeholder="请输入飞书群名"><p class="field-help">只影响之后的发送，已有通知日志不变。</p></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>保存</button></div></section></div>`;
    },
    handleRowAction(action, row, ctx) {
      if (!isPage()) return false;
      if (action === '查看名单') {
        ctx.openModal(detailModal(row));
        return true;
      }
      if (action === '移除') {
        pendingRow = row;
        ctx.state.processingRow = row;
        ctx.openModal(removeModal(row));
        return true;
      }
      return false;
    },
    handleSubmit(backdrop, ctx) {
      if (!isPage() || !backdrop) return false;
      if (backdrop.hasAttribute('data-bm-missing-remove')) {
        const row = pendingRow;
        const index = blackTab.rows.indexOf(row);
        if (index < 0) {
          ctx.showToast('未找到这条黑名单', 'error');
          return true;
        }
        blackTab.rows.splice(index, 1);
        pendingRow = null;
        ctx.state.processingRow = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('已移出黑名单（原型）', 'success');
        return true;
      }
      if (backdrop.hasAttribute('data-bm-missing-add')) {
        const form = readForm(backdrop);
        const accountId = normId(form.accountId);
        if (!accountId) {
          ctx.showToast('请输入广告账户ID', 'error');
          return true;
        }
        if (blackTab.rows.some(item => normId(item.accountId) === accountId)) {
          ctx.showToast('该广告账户已在黑名单', 'error');
          return true;
        }
        blackTab.rows.unshift({
          accountId,
          accountName: form.accountName || '',
          remark: form.remark || '',
          addedBy: operator,
          addedAt: nowText(),
          ops: ['移除']
        });
        ctx.closeModal();
        ctx.render();
        ctx.showToast('已加入黑名单（原型）', 'success');
        return true;
      }
      if (backdrop.hasAttribute('data-bm-missing-group')) {
        const form = readForm(backdrop);
        if (!form.groupName) {
          ctx.showToast('请填写通知群', 'error');
          return true;
        }
        groupName = form.groupName;
        syncNotes();
        ctx.closeModal();
        ctx.render();
        ctx.showToast('通知群已更新，已有日志不变（原型）', 'success');
        return true;
      }
      return false;
    }
  };
})();
