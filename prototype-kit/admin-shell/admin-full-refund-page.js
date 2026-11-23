/*
 * 运营端全额退款页。状态变化写回 full-refund-store。
 */
(function () {
  'use strict';

  const root = document.getElementById('page-root');
  const api = window.BESTADS_FULL_REFUND;
  if (!root || !api || document.body.dataset.adminPage !== 'full-refund') return;

  const esc = value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
  const money = value => `${api.roundMoney(value).toFixed(2)}`;
  const params = new URLSearchParams(window.location.search);
  const state = {
    merchantId: params.get('merchantId') || '',
    customerName: '',
    status: '',
    selectedId: '',
    detailOpen: false,
    mode: ''
  };

  function toast(message, type) {
    let node = document.getElementById('fullRefundToast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'fullRefundToast';
      node.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:120;padding:10px 16px;border-radius:8px;background:#101828;color:#fff;font-size:13px;';
      document.body.appendChild(node);
    }
    node.style.background = type === 'error' ? '#d92d20' : '#101828';
    node.textContent = message;
    node.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { node.hidden = true; }, 2200);
  }

  function statusTag(value) {
    const cls = value === '已退款' ? 'status-success' : value === '已取消' ? 'status-danger' : 'status-warning';
    return `<span class="status-tag ${cls}">${esc(value)}</span>`;
  }

  function filtered() {
    return api.orders().filter(order => {
      if (state.merchantId && !String(order.merchantId).includes(state.merchantId)) return false;
      if (state.customerName && !String(order.customerName).includes(state.customerName)) return false;
      if (state.status && order.status !== state.status) return false;
      return true;
    });
  }

  function selected() {
    return api.find(state.selectedId);
  }

  function ensureFeishuStyle() {
    if (document.getElementById('feishuNoticeStyle')) return;
    const style = document.createElement('style');
    style.id = 'feishuNoticeStyle';
    style.textContent = `
      #feishuNoticeMask { position: fixed; inset: 0; z-index: 90; display: flex; align-items: flex-start; justify-content: center; padding: 72px 24px 32px; background: rgba(15, 23, 42, .45); }
      .feishu-dialog { width: min(520px, calc(100vw - 48px)); max-height: calc(100vh - 120px); display: flex; flex-direction: column; border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 16px 40px rgba(0, 0, 0, .2); font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif; }
      .feishu-dialog header { height: 52px; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e5e6eb; color: #1f2329; font-size: 14px; font-weight: 600; }
      .feishu-dialog header button { width: 28px; height: 28px; border: 0; border-radius: 6px; background: transparent; color: #646a73; font-size: 18px; cursor: pointer; }
      .feishu-dialog header button:hover { background: #f2f3f5; }
      .feishu-chat { flex: 1; overflow: auto; padding: 16px; background: #f5f6f7; }
      .feishu-msg { display: flex; gap: 10px; margin-bottom: 16px; }
      .feishu-avatar { width: 36px; height: 36px; flex: 0 0 36px; border-radius: 50%; background: #3370ff; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
      .feishu-meta { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
      .feishu-name { color: #1f2329; font-size: 14px; font-weight: 600; }
      .feishu-time { color: #8f959e; font-size: 12px; }
      .feishu-card { width: 360px; max-width: 100%; border-radius: 8px; overflow: hidden; background: #fff; box-shadow: 0 1px 4px rgba(31, 35, 41, .08); }
      .feishu-card__head { padding: 10px 14px; background: #ff8800; color: #fff; font-size: 15px; font-weight: 600; }
      .feishu-card__body { padding: 12px 14px 14px; color: #1f2329; font-size: 13px; line-height: 1.6; }
      .feishu-ats { display: flex; gap: 8px; margin-bottom: 8px; }
      .feishu-ats span { color: #3370ff; }
      .feishu-row { display: grid; grid-template-columns: 56px 1fr; gap: 8px; margin: 2px 0; }
      .feishu-row span { color: #8f959e; }
      .feishu-alert { margin: 10px 0 0; padding-top: 10px; border-top: 1px solid #f0f1f2; color: #1f2329; }
      .feishu-empty { color: #8f959e; font-size: 13px; text-align: center; padding: 28px 0; }
    `;
    document.head.appendChild(style);
  }

  function openFeishuModal() {
    ensureFeishuStyle();
    document.getElementById('feishuNoticeMask')?.remove();
    const notices = api.notices();
    const messages = notices.length ? notices.map(item => `
      <div class="feishu-msg">
        <div class="feishu-avatar">通</div>
        <div>
          <div class="feishu-meta"><span class="feishu-name">BestAds 通知</span><span class="feishu-time">${esc(item.at)}</span></div>
          <article class="feishu-card">
            <div class="feishu-card__head">全额退款申请</div>
            <div class="feishu-card__body">
              <div class="feishu-ats"><span>@${esc(item.bd)}</span><span>@${esc(item.am)}</span></div>
              <div class="feishu-row"><span>客户</span><b>${esc(item.customerName)}</b></div>
              <div class="feishu-row"><span>商户ID</span><b>${esc(item.merchantId)}</b></div>
              <div class="feishu-row"><span>单号</span><b>${esc(item.orderId)}</b></div>
              <div class="feishu-row"><span>说明</span><b>${esc(item.note)}</b></div>
              <p class="feishu-alert">客户已不能再发起广告账户充值。请尽快处理广告账户余额。</p>
            </div>
          </article>
        </div>
      </div>
    `).join('') : '<div class="feishu-empty">还没有飞书通知。客户端提交全额退款后，这里会显示群消息。</div>';
    const mask = document.createElement('div');
    mask.id = 'feishuNoticeMask';
    mask.innerHTML = `
      <div class="feishu-dialog" role="dialog" aria-modal="true" aria-label="飞书群通知">
        <header><span>飞书群 · 广告业务通知</span><button type="button" data-feishu-close aria-label="关闭">×</button></header>
        <div class="feishu-chat">${messages}</div>
      </div>`;
    mask.addEventListener('click', event => {
      if (event.target === mask || event.target.closest('[data-feishu-close]')) mask.remove();
    });
    document.body.appendChild(mask);
  }

  function ensureDetailStyle() {
    if (document.getElementById('refundDetailStyle')) return;
    const style = document.createElement('style');
    style.id = 'refundDetailStyle';
    style.textContent = `
      #refundDetailMask { position: fixed; inset: 0; z-index: 90; display: flex; align-items: center; justify-content: center; padding: 24px; background: rgba(15, 23, 42, .45); }
      .refund-dialog { width: min(1080px, calc(100vw - 48px)); max-height: calc(100vh - 48px); min-height: 0; display: flex; flex-direction: column; border: 1px solid #e5e6eb; border-radius: 6px; background: #fff; box-shadow: 0 16px 40px rgba(0, 0, 0, .2); }
      .refund-dialog header, .refund-dialog footer { display: flex; align-items: center; flex-shrink: 0; min-height: 52px; padding: 0 20px; }
      .refund-dialog header { justify-content: space-between; border-bottom: 1px solid #e5e6eb; }
      .refund-dialog header strong { font-size: 16px; font-weight: 600; color: #1f2329; }
      .refund-dialog header .refund-dialog__title { display: flex; align-items: center; gap: 8px; }
      .refund-dialog header button { width: 28px; height: 28px; border: 0; border-radius: 6px; background: transparent; color: #646a73; font-size: 18px; cursor: pointer; }
      .refund-dialog header button:hover { background: #f2f3f5; }
      .refund-dialog__body { flex: 1; min-height: 0; overflow: auto; padding: 4px 20px 16px; }
      .refund-dialog__body h3 { margin: 18px 0 8px; font-size: 14px; font-weight: 600; color: #1f2329; }
      .refund-dialog__body .muted { margin: 0 0 8px; color: #8f959e; font-size: 12px; }
      .refund-dialog .admin-table { min-width: 0; }
      .refund-dialog .admin-table th, .refund-dialog .admin-table td { height: 40px; }
      .refund-dialog footer { justify-content: flex-end; gap: 8px; border-top: 1px solid #e5e6eb; }
      .refund-dialog footer.is-form { display: block; height: auto; padding: 12px 20px 16px; }
      .refund-dialog footer.is-form .handoff-remark label { display: block; margin-bottom: 6px; color: #1f2329; font-size: 13px; font-weight: 600; }
      .refund-dialog footer.is-form textarea { min-height: 64px; margin: 0; resize: vertical; }
      .refund-dialog footer.is-form .handoff-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
      .refund-dialog footer.is-form .deduct-line { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
      .refund-dialog footer.is-form .deduct-line input { width: 220px; height: 32px; margin: 0; }
      .refund-dialog footer.is-form .deduct-line span { color: #8f959e; font-size: 12px; }
      .refund-dialog footer.is-form .check-line { display: flex; align-items: center; gap: 8px; margin: 0 0 12px; color: #1f2329; font-size: 13px; font-weight: 600; }
      .refund-dialog footer.is-form .check-line input { width: 16px; height: 16px; margin: 0; }
      .refund-dialog textarea { width: 100%; min-height: 72px; margin: 8px 0; }
      .refund-list .admin-table { min-width: 2200px; }
      .refund-list td.remark, .refund-list th.remark { max-width: 220px; white-space: normal; text-align: left; line-height: 20px; }
      .refund-list td.remark { height: auto; padding-top: 8px; padding-bottom: 8px; }
    `;
    document.head.appendChild(style);
  }

  function unfinished(list) {
    return (list || []).filter(item => item.status === '处理中');
  }

  function detailBody(order) {
    const inboundBlocked = api.blocksDeduct(order);
    const readonly = order.status === '已取消' || order.status === '已退款';
    const accountRows = (order.accounts || []).map(item => `<tr><td>${esc(item.media)}</td><td>${esc(item.accountId)}</td><td>${esc(item.name)}</td><td>${esc(item.accountStatus || '正常')}</td><td>${money(item.balance)}</td></tr>`).join('') || '<tr><td colspan="5">暂无广告账户</td></tr>';
    const taskRows = unfinished(order.clears).map(item => `<tr><td>${esc(item.id)}</td><td>${esc(item.type || '清零')}</td><td>${esc(item.accountId)}</td><td>${money(item.amount)}</td><td>${esc(item.status)}</td></tr>`).join('') || '<tr><td colspan="5">没有未完成的广告账户充值、清零、减款</td></tr>';
    const inboundRows = unfinished(order.inbounds).map(item => `<tr><td>${esc(item.id)}</td><td>${esc(item.type)}</td><td>${money(item.amount)}</td><td>${esc(item.status)}</td><td>${order.status === '已取消' ? '-' : `<button class="btn btn-default" type="button" data-refund-act="complete-inbound" data-inbound-id="${esc(item.id)}">入账完成</button>`}</td></tr>`).join('') || '<tr><td colspan="5">没有未完成的在线充值、线下转账</td></tr>';
    return `
      <div class="detail-grid">
        <div><dt>客户ID</dt><dd>${esc(order.customerId)}</dd></div>
        <div><dt>客户名称</dt><dd>${esc(order.customerName)}</dd></div>
        <div><dt>商户ID</dt><dd>${esc(order.merchantId)}</dd></div>
        <div><dt>申请时间</dt><dd>${esc(order.appliedAt || order.submittedAt || '-')}</dd></div>
        <div><dt>申请人</dt><dd>${esc(order.applicant || order.customerName || '-')}</dd></div>
        <div><dt>业务处理时间</dt><dd>${esc(order.businessAt || '-')}</dd></div>
        <div><dt>业务处理人</dt><dd>${esc(order.businessBy || '-')}</dd></div>
        <div><dt>财务处理时间</dt><dd>${esc(order.financeAt || '-')}</dd></div>
        <div><dt>财务处理人</dt><dd>${esc(order.financeBy || '-')}</dd></div>
        <div><dt>钱包真实金额</dt><dd>${money(order.walletReal)} ${esc(order.currency)}</dd></div>
        <div><dt>参考可退金额</dt><dd>${money(order.walletReal)} ${esc(order.currency)}</dd></div>
        <div><dt>已确认扣款</dt><dd>${order.confirmedAmount == null ? '-' : `${money(order.confirmedAmount)} ${esc(order.currency)}`}</dd></div>
      </div>
      ${order.cancelReason ? `<p>取消原因：${esc(order.cancelReason)}</p>` : ''}
      ${!readonly && inboundBlocked ? '<div class="notice notice--warning">有未完成的在线充值或线下转账，确认扣款不可用。入账完成后再扣。</div>' : ''}
      <h3>申请人备注</h3>
      <p>${esc(order.applicantRemark || order.note || '-')}</p>
      ${order.status === '处理中' ? '' : `<h3>业务备注</h3><p>${esc(order.businessRemark || '-')}</p>`}
      ${order.status === '待财务核对' ? '' : `<h3>财务备注</h3><p>${esc(order.financeRemark || '-')}</p>`}
      <h3>广告账户</h3>
      <p class="muted">展示客户当前广告账户状态和余额。余额更新不及时时，不拦截交给财务。</p>
      <div class="table-scroll"><table class="admin-table"><thead><tr><th>媒体</th><th>广告账户ID</th><th>名称</th><th>账户状态</th><th>余额</th></tr></thead><tbody>${accountRows}</tbody></table></div>
      <h3>未完成的广告账户充值 / 清零 / 减款</h3>
      <div class="table-scroll"><table class="admin-table"><thead><tr><th>单号</th><th>类型</th><th>广告账户ID</th><th>金额</th><th>状态</th></tr></thead><tbody>${taskRows}</tbody></table></div>
      <h3>未完成的在线充值 / 线下转账</h3>
      <div class="table-scroll"><table class="admin-table"><thead><tr><th>单号</th><th>类型</th><th>金额</th><th>状态</th><th>操作</th></tr></thead><tbody>${inboundRows}</tbody></table></div>
      <div id="refundActionBox"></div>
    `;
  }

  function detailActions(order) {
    const inboundBlocked = api.blocksDeduct(order);
    if (order.status === '处理中') {
      return `<div class="handoff-remark"><label for="businessRemarkInput">业务备注</label><textarea id="businessRemarkInput" data-business-remark rows="2" placeholder="请填写本次广告账户处理说明"></textarea></div><div class="handoff-actions"><button class="btn btn-primary" type="button" data-refund-act="handoff">广告账户已处理完</button><button class="btn btn-default" type="button" data-refund-act="cancel">取消退款</button></div>`;
    }
    if (order.status === '待财务核对') {
      const wallet = api.roundMoney(order.walletReal);
      const fee = Math.min(50, wallet);
      const refundPart = api.roundMoney(wallet - fee);
      return `<div class="handoff-remark"><label class="check-line"><input type="checkbox" data-with-other-debit>同时生成其他扣费</label><div data-plain-deduct><label for="deductAmountInput">扣款金额</label><div class="deduct-line"><input id="deductAmountInput" data-deduct-amount value="${money(wallet)}"><span>不能大于钱包真实金额 ${money(wallet)} ${esc(order.currency)}</span></div></div><div data-split-deduct hidden><label for="refundFeeInput">退款手续费</label><div class="deduct-line"><input id="refundFeeInput" data-refund-fee value="${money(fee)}"><span>默认 50 ${esc(order.currency)}</span></div><label for="refundPartInput">退款</label><div class="deduct-line"><input id="refundPartInput" data-refund-part value="${money(refundPart)}"><span>两笔合计不能大于 ${money(wallet)} ${esc(order.currency)}</span></div></div><label for="financeRemarkInput">财务备注</label><textarea id="financeRemarkInput" data-finance-remark rows="2" placeholder="请填写本次扣款说明"></textarea></div><div class="handoff-actions"><button class="btn btn-primary" type="button" data-refund-act="deduct" ${inboundBlocked ? 'disabled' : ''}>确认扣款</button><button class="btn btn-default" type="button" data-refund-act="return">退回业务</button><button class="btn btn-default" type="button" data-refund-act="cancel">取消退款</button></div>`;
    }
    return '';
  }

  function closeDetail() {
    state.detailOpen = false;
    document.getElementById('refundDetailMask')?.remove();
  }

  function openDetailModal() {
    const order = selected();
    if (!order) { closeDetail(); return; }
    ensureDetailStyle();
    document.getElementById('refundDetailMask')?.remove();
    const mask = document.createElement('div');
    mask.id = 'refundDetailMask';
    mask.innerHTML = `
      <div class="refund-dialog" role="dialog" aria-modal="true" aria-label="全额退款处理">
        <header>
          <div class="refund-dialog__title"><strong>${esc(order.id)} · ${esc(order.customerName)}</strong>${statusTag(order.status)}</div>
          <button type="button" data-refund-close aria-label="关闭">×</button>
        </header>
        <div class="refund-dialog__body">${detailBody(order)}</div>
        ${detailActions(order) ? `<footer class="${order.status === '处理中' || order.status === '待财务核对' ? 'is-form' : ''}">${detailActions(order)}</footer>` : ''}
      </div>`;
    mask.addEventListener('click', event => {
      if (event.target === mask || event.target.closest('[data-refund-close]')) closeDetail();
    });
    document.body.appendChild(mask);
  }

  function rowAction(order) {
    const label = order.status === '已取消' || order.status === '已退款' ? '查看' : '处理';
    return `<button class="btn btn-link" type="button" data-refund-act="open" data-order-id="${esc(order.id)}">${label}</button>`;
  }

  function refundAmountText(order) {
    if (order.status !== '已退款') return '-';
    if (order.listedRefundAmount != null) return `${money(order.listedRefundAmount)} ${order.currency || ''}`.trim();
    const deducted = (order.debits || []).reduce((sum, item) => sum + api.roundMoney(item.amount), 0);
    const amount = deducted > 0 ? api.roundMoney(deducted) : api.roundMoney(order.confirmedAmount);
    if (!amount) return '-';
    return `${money(amount)} ${order.currency || ''}`.trim();
  }

  function debitRow(order, kind, amount, remark) {
    return {
      merchantId: order.merchantId,
      customerName: order.customerName,
      feeTime: api.nowText(),
      feeType: kind,
      currency: order.currency,
      feeAmount: money(amount),
      walletCurrency: order.currency,
      walletAmount: money(amount),
      status: '扣费成功',
      remark: `全额退款 ${order.id}${remark ? `。${remark}` : ''}`,
      operator: '管理员',
      rollbackTime: '-',
      rollbackOperator: '-',
      rollbackReason: '-',
      ops: ['查看详情', '回退']
    };
  }

  function textCell(value, remark) {
    const text = value == null || value === '' ? '-' : String(value);
    return `<td class="${remark ? 'remark' : 'left'}" title="${esc(text)}">${esc(text)}</td>`;
  }

  function render() {
    ensureDetailStyle();
    const rows = filtered();
    const unread = api.unreadCount();
    root.innerHTML = `
      <div class="admin-page module-page">
        <section class="admin-card filter-card"><div class="admin-card__body">
          <div class="filter-grid cols-5">
            <div class="filter-field"><label>商户ID</label><input data-refund-filter="merchantId" value="${esc(state.merchantId)}" placeholder="请输入商户ID"></div>
            <div class="filter-field"><label>客户名称</label><input data-refund-filter="customerName" value="${esc(state.customerName)}" placeholder="请输入客户名称"></div>
            <div class="filter-field"><label>状态</label><select data-refund-filter="status"><option value="">全部</option>${['处理中', '待财务核对', '已退款', '已取消'].map(item => `<option value="${item}" ${state.status === item ? 'selected' : ''}>${item}</option>`).join('')}</select></div>
            <div class="filter-actions"><button class="btn btn-primary" type="button" data-refund-act="search">搜索</button><button class="btn btn-default" type="button" data-refund-act="reset-filter">重置</button></div>
          </div>
        </div></section>
        <section class="admin-card list-card">
          <div class="admin-card__header">
            <strong>全额退款</strong>
            <div>
              <button class="btn btn-default" type="button" data-refund-act="feishu">飞书通知${unread ? `（${unread}）` : ''}</button>
              <button class="btn btn-default" type="button" data-refund-act="reset-demo">恢复示例</button>
            </div>
          </div>
          <div class="admin-card__body">
            <p class="muted">客户端演示客户是 adstest / 商户 1128。客户从余额管理提交后会出现在本列表，并生成飞书通知。</p>
            <div class="table-scroll refund-list"><table class="admin-table">
              <thead><tr>
                <th>退款单号</th><th>客户ID</th><th>商户ID</th><th>客户名称</th><th>状态</th>
                <th>申请时间</th><th>申请人</th><th class="remark">申请人备注</th>
                <th>业务处理时间</th><th>业务处理人</th><th class="remark">业务备注</th>
                <th>财务处理时间</th><th>财务处理人</th><th class="remark">财务备注</th>
                <th>退款金额</th><th class="ops">操作</th>
              </tr></thead>
              <tbody>
                ${rows.map(order => `<tr>
                  <td>${esc(order.id)}</td><td>${esc(order.customerId)}</td><td>${esc(order.merchantId)}</td><td>${esc(order.customerName)}</td>
                  <td>${statusTag(order.status)}</td>
                  ${textCell(order.appliedAt || order.submittedAt)}
                  ${textCell(order.applicant || order.customerName)}
                  ${textCell(order.applicantRemark || order.note, true)}
                  ${textCell(order.businessAt)}
                  ${textCell(order.businessBy)}
                  ${textCell(order.businessRemark, true)}
                  ${textCell(order.financeAt)}
                  ${textCell(order.financeBy)}
                  ${textCell(order.financeRemark, true)}
                  <td>${esc(refundAmountText(order))}</td>
                  <td class="ops">${rowAction(order)}</td>
                </tr>`).join('') || '<tr><td colspan="16">暂无数据</td></tr>'}
              </tbody>
            </table></div>
          </div>
        </section>
      </div>
    `;
    if (state.detailOpen) openDetailModal();
  }

  function readFilters() {
    state.merchantId = root.querySelector('[data-refund-filter="merchantId"]')?.value.trim() || '';
    state.customerName = root.querySelector('[data-refund-filter="customerName"]')?.value.trim() || '';
    state.status = root.querySelector('[data-refund-filter="status"]')?.value || '';
  }

  function showAction(html) {
    const box = document.getElementById('refundActionBox');
    if (box) box.innerHTML = html;
  }

  document.addEventListener('change', event => {
    const box = event.target.closest('[data-with-other-debit]');
    if (!box) return;
    const mask = document.getElementById('refundDetailMask');
    const plain = mask?.querySelector('[data-plain-deduct]');
    const split = mask?.querySelector('[data-split-deduct]');
    if (plain) plain.hidden = box.checked;
    if (split) split.hidden = !box.checked;
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-refund-act]');
    if (!button) return;
    const act = button.dataset.refundAct;
    if (act === 'search') { readFilters(); render(); return; }
    if (act === 'reset-filter') {
      state.merchantId = '';
      state.customerName = '';
      state.status = '';
      render();
      return;
    }
    if (act === 'reset-demo') { api.resetDemo(); state.selectedId = ''; state.mode = ''; render(); toast('已恢复示例数据'); return; }
    if (act === 'feishu') { api.markNoticesRead(); render(); openFeishuModal(); return; }
    if (act === 'open') { state.detailOpen = true; state.selectedId = button.dataset.orderId; openDetailModal(); return; }
    const order = selected();
    if (!order) return;
    if (act === 'handoff') {
      const remarkField = document.querySelector('#refundDetailMask [data-business-remark]');
      const remark = remarkField?.value.trim() || '';
      if (!remark) { toast('请填写业务备注', 'error'); remarkField?.focus(); return; }
      api.update(order.id, item => {
        item.status = '待财务核对';
        item.businessAt = api.nowText();
        item.businessBy = '管理员';
        item.businessRemark = remark;
      });
      toast('已交给财务。广告账户余额未做拦截。');
      render();
      return;
    }
    if (act === 'return') {
      api.update(order.id, item => {
        item.status = '处理中';
        item.businessAt = '';
        item.businessBy = '';
        item.businessRemark = '';
      });
      toast('已退回业务，锁定保持');
      render();
      return;
    }
    if (act === 'cancel') {
      showAction(`<label>取消原因</label><input data-cancel-reason style="width:100%;margin:8px 0"><button class="btn btn-primary" type="button" data-refund-act="cancel-confirm">确认取消并解除锁定</button>`);
      return;
    }
    if (act === 'cancel-confirm') {
      const reason = document.querySelector('#refundDetailMask [data-cancel-reason]')?.value.trim() || '';
      if (!reason) { toast('请填写取消原因', 'error'); return; }
      const result = api.update(order.id, item => {
        if (item.status === '已退款') return { ok: false, message: '已扣款的退款单不能取消' };
        item.status = '已取消';
        item.cancelReason = reason;
      });
      if (!result.ok) { toast(result.message, 'error'); return; }
      toast('已取消退款并解除锁定');
      render();
      return;
    }
    if (act === 'deduct') {
      if (api.blocksDeduct(order)) { toast('有处理中的入账单，不能扣款', 'error'); return; }
      const remarkField = document.querySelector('#refundDetailMask [data-finance-remark]');
      const financeRemark = remarkField?.value.trim() || '';
      if (!financeRemark) { toast('请填写财务备注', 'error'); remarkField?.focus(); return; }
      const withOther = Boolean(document.querySelector('#refundDetailMask [data-with-other-debit]')?.checked);
      const wallet = api.roundMoney(order.walletReal);
      let listedAmount = 0;
      let walletDelta = 0;
      const ledger = [];
      if (!withOther) {
        const amountField = document.querySelector('#refundDetailMask [data-deduct-amount]');
        listedAmount = api.roundMoney(amountField?.value);
        if (!listedAmount || listedAmount <= 0) { toast('请输入大于 0 的扣款金额', 'error'); amountField?.focus(); return; }
        if (listedAmount > wallet) { toast('扣款金额不能大于钱包真实金额', 'error'); amountField?.focus(); return; }
      } else {
        const feeField = document.querySelector('#refundDetailMask [data-refund-fee]');
        const partField = document.querySelector('#refundDetailMask [data-refund-part]');
        const fee = api.roundMoney(feeField?.value);
        const refundPart = api.roundMoney(partField?.value);
        if (fee < 0 || refundPart < 0) { toast('金额不能小于 0', 'error'); return; }
        if (api.roundMoney(fee + refundPart) <= 0) { toast('请至少填写一笔大于 0 的金额', 'error'); partField?.focus(); return; }
        if (api.roundMoney(fee + refundPart) > wallet) { toast('两笔合计不能大于钱包真实金额', 'error'); partField?.focus(); return; }
        listedAmount = refundPart;
        walletDelta = api.roundMoney(fee + refundPart);
        if (refundPart > 0) ledger.push({ kind: '退款', amount: refundPart });
        if (fee > 0) ledger.push({ kind: '退款手续费', amount: fee });
      }
      const result = api.update(order.id, item => {
        if (api.blocksDeduct(item)) return { ok: false, message: '有处理中的入账单，不能扣款' };
        if (walletDelta) item.walletReal = api.roundMoney(item.walletReal - walletDelta);
        ledger.forEach(entry => item.debits.push({ at: api.nowText(), amount: entry.amount, kind: entry.kind, remark: financeRemark }));
        item.status = '已退款';
        item.confirmedAmount = listedAmount;
        item.listedRefundAmount = listedAmount;
        item.financeAt = api.nowText();
        item.financeBy = '管理员';
        item.financeRemark = financeRemark;
      });
      if (!result.ok) { toast(result.message, 'error'); return; }
      if (withOther) api.addRefundDebits(ledger.map(item => debitRow(order, item.kind, item.amount, financeRemark)));
      toast(withOther ? '其他扣费已生成，退款单变为已退款' : '已退款，未生成其他扣费');
      render();
      return;
    }
    if (act === 'complete-inbound') {
      const result = api.completeInbound(order.id, button.dataset.inboundId);
      if (!result.ok) { toast(result.message, 'error'); return; }
      toast('入账已完成，真实金额已增加');
      render();
    }
  });

  render();
})();
