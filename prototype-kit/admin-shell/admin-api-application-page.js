/*
 * 运营端 API 申请页。只处理客户发起的开通和升级，处理完的记录留在列表里。
 */
(function () {
  const store = window.BESTADS_API_STORE;
  if (!store) return;

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));

  const resultTag = value => {
    const text = value || '-';
    const cls = text === '通过' ? 'status-success' : text === '拒绝' ? 'status-danger' : text === '待处理' ? 'status-warning' : 'status-info';
    return `<span class="status-tag ${cls}">${esc(text)}</span>`;
  };

  let processing = null;

  function permissionChecks(selected) {
    const picked = new Set(selected || []);
    return store.PERMISSIONS.map(permission => `
      <label class="api-permission-option">
        <input type="checkbox" name="apiPermission" value="${esc(permission)}" ${picked.has(permission) ? 'checked' : ''}>
        <span>${esc(permission)}</span>
      </label>
    `).join('');
  }

  function approveModal(row) {
    const current = store.customer(row.customerId);
    const selected = row.applyType === '升级'
      ? current.permissions.concat(row.requestedPermissions || [])
      : (row.requestedPermissions || []);
    return `
      <div class="modal-backdrop">
        <section class="modal modal-md">
          <div class="modal__header">
            <h2 class="modal__title">处理${esc(row.applyType)}申请</h2>
            <button class="modal__close" type="button" data-modal-close>×</button>
          </div>
          <div class="modal__body">
            <div class="detail-grid">
              <div><dt>客户ID</dt><dd>${esc(row.customerId)}</dd></div>
              <div><dt>客户名称</dt><dd>${esc(row.customerName)}</dd></div>
              <div><dt>商户ID</dt><dd>${esc(row.merchantId)}</dd></div>
              <div><dt>类型</dt><dd>${esc(row.applyType)}</dd></div>
            </div>
            <div class="api-permission-context">
              ${row.applyType === '升级' ? `<div><dt>当前已有</dt><dd>${esc(store.joinPermissions(current.permissions))}</dd></div>` : ''}
              <div><dt>客户申请</dt><dd>${esc(store.joinPermissions(row.requestedPermissions))}</dd></div>
            </div>
            <div class="form-field full" style="margin-top:16px;">
              <label>最终权限</label>
              <div class="api-permission-options">${permissionChecks(selected)}</div>
              <p class="field-help">可调整客户勾选的权限。实际权限以本次勾选结果为准。</p>
            </div>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-default" data-modal-close>取消</button>
            <button type="button" class="btn btn-primary" data-api-apply-action="approve">通过</button>
          </div>
        </section>
      </div>
    `;
  }

  function rejectModal(row) {
    return `
      <div class="modal-backdrop">
        <section class="modal modal-md">
          <div class="modal__header">
            <h2 class="modal__title">拒绝${esc(row.applyType)}申请</h2>
            <button class="modal__close" type="button" data-modal-close>×</button>
          </div>
          <div class="modal__body">
            <p class="confirm-copy">拒绝 ${esc(row.customerName)} 的${esc(row.applyType)}申请。拒绝后客户可以再次发起开通申请。</p>
          </div>
          <div class="modal__footer">
            <button type="button" class="btn btn-default" data-modal-close>取消</button>
            <button type="button" class="btn btn-danger" data-api-apply-action="reject">确认拒绝</button>
          </div>
        </section>
      </div>
    `;
  }

  const rows = store.applications().map(row => Object.assign(row, {
    requestedText: store.joinPermissions(row.requestedPermissions),
    finalText: store.joinPermissions(row.finalPermissions),
    ops: row.result === '待处理' ? ['通过', '拒绝'] : []
  }));

  window.BESTADS_ADMIN_MODULE_CONFIGS = Object.assign({}, window.BESTADS_ADMIN_MODULE_CONFIGS || {}, {
    'api-application': {
      title: 'API 申请',
      showTitlebar: false,
      filters: [
        { key: 'customerId', label: '客户ID', placeholder: '输入客户ID' },
        { key: 'customerName', label: '客户名称', placeholder: '输入客户名称' },
        { key: 'applyType', label: '类型', type: 'select', options: ['开通', '升级'] },
        { key: 'result', label: '处理结果', type: 'select', options: ['待处理', '通过', '拒绝'] }
      ],
      filterClass: 'filter-grid--four',
      tableClass: 'admin-table--fixed',
      tableMinWidth: 1680,
      opsWidth: 140,
      columns: [
        { key: 'customerId', label: '客户ID', width: 100 },
        { key: 'customerName', label: '客户名称', align: 'left', width: 160 },
        { key: 'merchantId', label: '商户ID', width: 110 },
        { key: 'appliedAt', label: '申请时间', width: 170 },
        { key: 'applyType', label: '类型', width: 90 },
        { key: 'requestedText', label: '申请权限', align: 'left', width: 280 },
        { key: 'result', label: '处理结果', format: resultTag, width: 110 },
        { key: 'processor', label: '处理人', width: 110 },
        { key: 'processedAt', label: '处理时间', width: 170 },
        { key: 'finalText', label: '最终权限', align: 'left', width: 220 }
      ],
      rows
    }
  });

  window.BESTADS_API_APPLICATION = {
    handleRowAction(action, row, ctx) {
      if (document.body.dataset.adminPage !== 'api-application') return false;
      if (action !== '通过' && action !== '拒绝') return false;
      if (row.result !== '待处理') {
        ctx.showToast('这条申请已经处理过', 'info');
        return true;
      }
      processing = row;
      ctx.openModal(action === '通过' ? approveModal(row) : rejectModal(row));
      return true;
    },
    handleModal(action, backdrop, ctx) {
      const row = processing;
      if (!row) {
        ctx.showToast('未找到申请单', 'error');
        return;
      }
      if (action === 'approve') {
        const permissions = Array.from(backdrop.querySelectorAll('input[name="apiPermission"]:checked')).map(input => input.value);
        if (!permissions.length) {
          ctx.showToast('至少保留一项权限', 'error');
          return;
        }
        store.approve(row, permissions);
        row.finalText = store.joinPermissions(row.finalPermissions);
        row.ops = [];
        processing = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('已通过，客户当前权限已更新', 'success');
        return;
      }
      if (action === 'reject') {
        store.reject(row);
        row.finalText = '-';
        row.ops = [];
        processing = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('已拒绝', 'success');
      }
    }
  };
})();
