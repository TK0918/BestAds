/*
 * 无 API 清零 / 减款：提交前比对 + 飞书复审 / 终审原型。
 * 提交后不调 Fund；审批通过后才入账。
 */
(function () {
  'use strict';

  const ROLE_KEY = 'bestads-clear-approval-role';
  const ROLES = {
    processor: { id: 'processor', name: '李处理', title: '充值组 · 处理人', email: 'li.chuli@bestfulfill.com' },
    reviewer: { id: 'reviewer', name: '王复审', title: '业务 · 复审人', email: 'wang.fushen@bestfulfill.com' },
    finance: { id: 'finance', name: '赵终审', title: '财务 · 终审人', email: 'zhao.zhongshen@bestfulfill.com' }
  };
  const FX = { USD: 1, EUR: 1.143, GBP: 1.27, HKD: 0.128 };
  const FINAL_USD = 5000;
  const RATIO_TRIGGER = 2;
  const COMPARE_SECONDS = 3;

  let ctx = null;

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }
  function icon(name) {
    return `<i class="fas fa-${name}" aria-hidden="true"></i>`;
  }
  function pageKind() {
    const id = document.body?.dataset?.adminPage || '';
    if (/clear-management/.test(id)) return '清零';
    if (/deduction-management/.test(id)) return '减款';
    return '';
  }
  function isTargetPage() {
    return Boolean(pageKind());
  }
  function currentRole() {
    const id = sessionStorage.getItem(ROLE_KEY) || 'processor';
    return ROLES[id] || ROLES.processor;
  }
  function setRole(id) {
    if (!ROLES[id]) return;
    sessionStorage.setItem(ROLE_KEY, id);
    ctx?.render();
  }
  function parseAmount(value) {
    const normalized = String(value == null ? '' : value).replace(/,/g, '').replace(/[^\d.-]/g, '').trim();
    const amount = Number(normalized);
    return Number.isFinite(amount) ? amount : 0;
  }
  function hasAmount(value) {
    const text = String(value == null ? '' : value).replace(/,/g, '').trim();
    if (!text || text === '-') return false;
    return Number.isFinite(Number(text));
  }
  function formatMoney(value, currency) {
    return `${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency || 'USD'}`;
  }
  function toUsd(amount, currency) {
    return Number(amount || 0) * (FX[currency] || 1);
  }
  function baseLabel(kind, row) {
    if (kind === '减款') return '申请减款金额';
    if (row?.bindCard === '是') return '当前使用卡剩余额度';
    return '清零提交时账户余额';
  }
  function nowText() {
    return ctx?.currentTimestamp ? ctx.currentTimestamp() : new Date().toLocaleString('zh-CN', { hour12: false });
  }
  function opsFor(row, kind) {
    const view = row.approval ? ['查看审批'] : [];
    if (row.status === '待复审') return ['飞书复审', ...view];
    if (row.status === '待终审') return ['飞书终审', ...view];
    if (row.status === '已审批待入账') return ['重试入账', ...view];
    if (row.status === '审批驳回' || row.status === '待处理' || row.status === '处理中') {
      return kind === '减款'
        ? ['媒体已完成', '标记媒体失败', ...view]
        : ['处理成功', '媒体已完成', '标记媒体失败', ...view];
    }
    return view.length ? view : (row.ops || []);
  }
  function applyOps(row, kind) {
    row.ops = opsFor(row, kind);
    row.selectable = !/失败|人工取消/.test(row.status || '');
    return row;
  }
  function evaluate(inputAmount, row, kind, ocr) {
    const currency = row.currency || row.walletCurrency || 'USD';
    const baseReady = hasAmount(row.amount);
    const base = baseReady ? parseAmount(row.amount) : 0;
    const usd = toUsd(inputAmount, currency);
    const ratio = baseReady && base > 0 ? inputAmount / base : null;
    const delta = baseReady && base > 0 ? Math.abs(inputAmount - base) / Math.abs(base) : null;
    const ratioHit = ratio != null && ratio >= RATIO_TRIGGER;
    const amountHit = usd >= FINAL_USD;
    const needFinal = Boolean(amountHit || ratioHit);
    const ocrState = ocr?.state || 'idle';
    const ocrAmount = ocr?.amount;
    const ocrMismatch = ocrState === 'matched' && Math.abs((ocrAmount || 0) - inputAmount) > 0.009;
    return {
      currency,
      baseReady,
      base,
      usd,
      ratio,
      delta,
      ratioHit,
      amountHit,
      needFinal,
      finalReason: amountHit ? `单笔折 USD ${usd.toFixed(2)} ≥ ${FINAL_USD}` : ratioHit ? `倍率 ${ratio.toFixed(2)} ≥ ${RATIO_TRIGGER}` : '',
      ocrState,
      ocrAmount,
      ocrMismatch,
      canSubmit: Boolean(inputAmount > 0 && ocrState !== 'idle' && ocrState !== 'none')
    };
  }
  function resolveOcr(mode, inputAmount, base, uploaded) {
    if (!uploaded) return { state: 'none', amount: null, label: '未上传截图，无法识别' };
    if (mode === 'fail') return { state: 'fail', amount: null, label: '未识别' };
    if (mode === 'input') return { state: 'matched', amount: inputAmount, label: formatMoney(inputAmount, 'USD').replace(' USD', '') };
    if (hasAmount(base) || base > 0) return { state: 'matched', amount: base, label: Number(base).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
    return { state: 'fail', amount: null, label: '未识别' };
  }
  function snapshotFromEval(row, kind, action, inputAmount, evalResult, ocrMode, fileName) {
    return {
      kind,
      action,
      orderId: row.orderId,
      accountId: row.accountId,
      accountName: row.accountName,
      customerName: row.customerName,
      merchantId: row.merchantId,
      agent: row.agent,
      currency: evalResult.currency,
      inputAmount,
      baseLabel: baseLabel(kind, row),
      base: evalResult.baseReady ? evalResult.base : null,
      usd: evalResult.usd,
      ratio: evalResult.ratio,
      delta: evalResult.delta,
      needFinal: evalResult.needFinal,
      finalReason: evalResult.finalReason,
      ocrState: evalResult.ocrState,
      ocrAmount: evalResult.ocrAmount,
      ocrMode,
      fileName: fileName || row.approval?.fileName || 'agency-clear.png',
      processor: currentRole().name,
      processorEmail: currentRole().email,
      submittedAt: nowText()
    };
  }
  function compareLine(evalResult) {
    const ratioText = evalResult.ratio == null ? '无基准，不算倍率' : `${evalResult.ratio.toFixed(2)} 倍`;
    const deltaText = evalResult.delta == null ? '—' : `${(evalResult.delta * 100).toFixed(2)}%`;
    return `折 USD ${evalResult.usd.toFixed(2)}；倍率 ${ratioText}；偏差 ${deltaText}；${evalResult.needFinal ? `需终审（${evalResult.finalReason}）` : '仅复审'}`;
  }

  function roleBarHtml() {
    const role = currentRole();
    return `<section class="admin-card clear-approval-rolebar"><div class="clear-approval-rolebar__main"><strong>原型身份</strong><div class="clear-approval-roles">${Object.values(ROLES).map(item => (
      `<button type="button" class="btn ${item.id === role.id ? 'btn-primary' : 'btn-default'}" data-clear-role="${item.id}">${esc(item.title)}</button>`
    )).join('')}</div><p>当前 ${esc(role.title)} ${esc(role.name)}。处理人、复审人、终审人必须是三个不同账号。提交审批后不会加钱包。</p></div></section>`;
  }

  function processModalHtml(action, row) {
    const kind = pageKind();
    const currency = row.currency || 'USD';
    const defaultAmount = hasAmount(row.actualAmount) ? parseAmount(row.actualAmount) : (hasAmount(row.amount) ? parseAmount(row.amount) : '');
    const ocrMode = row.ocrMode || 'base';
    return `<div class="modal-backdrop"><section class="modal modal-lg"><div class="modal__header"><h2 class="modal__title">${esc(action)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">金额将在飞书复审或终审通过后才增加客户钱包。5% 偏差只作提示，不能直接入账。</div><div class="form-grid" data-clear-approval-process data-process-action="${esc(action)}" data-ocr-mode="${esc(ocrMode)}"><div class="form-field"><label>工单ID</label><input value="${esc(row.orderId || '-')}" readonly></div><div class="form-field"><label>广告账户</label><input value="${esc((row.accountName || '-') + ' / ' + (row.accountId || '-'))}" readonly></div><div class="form-field"><label>客户 / 商户ID</label><input value="${esc((row.customerName || '-') + ' / ' + (row.merchantId || '-'))}" readonly></div><div class="form-field"><label>代理</label><input value="${esc(row.agent || '-')}" readonly></div><div class="form-field"><label>基准说明</label><input value="${esc(baseLabel(kind, row))}" readonly></div><div class="form-field"><label>基准金额</label><input value="${esc(hasAmount(row.amount) ? formatMoney(parseAmount(row.amount), currency) : '无基准')}" readonly></div><div class="form-field"><label><span style="color:var(--admin-danger)">*</span> 本次输入金额</label><input type="text" inputmode="decimal" data-process-amount placeholder="请输入实际加回客户钱包金额" value="${esc(defaultAmount === '' ? '' : defaultAmount)}"></div><div class="form-field"><label>原型识别方式</label><select data-ocr-demo><option value="base"${ocrMode === 'base' ? ' selected' : ''}>识别为基准金额（默认，仅供参考）</option><option value="fail"${ocrMode === 'fail' ? ' selected' : ''}>识别失败</option><option value="input"${ocrMode === 'input' ? ' selected' : ''}>识别为录入金额（用于测倍率/终审）</option></select></div><div class="form-field full"><label><span style="color:var(--admin-danger)">*</span> 代理系统截图</label><div class="upload-dropzone" data-upload-zone data-upload-max="1"><input type="file" data-upload-input data-clear-screenshot accept="image/*" hidden><div class="upload-dropzone__icon">${icon('cloud-upload-alt')}</div><div class="upload-dropzone__copy"><strong>拖拽或点击上传代理系统截图</strong><span>仅 1 张，须能看出本次金额</span></div><button class="btn btn-default" type="button" data-upload-browse>选择文件</button><ul class="upload-file-list" data-upload-list></ul></div><p class="field-help">必传，只认这一张。识别结果仅供飞书参考，与录入不一致不拦截提交。</p></div><div class="form-field full"><div class="clear-approval-check" data-clear-check></div></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>提交审批</button></div></section></div>`;
  }

  function processDraftFromModal(modalRoot, row) {
    const amount = parseAmount(modalRoot.querySelector('[data-process-amount]')?.value);
    const uploaded = Boolean(modalRoot.querySelector('[data-clear-screenshot]')?.files?.length || modalRoot.dataset.uploaded === '1');
    const ocrMode = modalRoot.querySelector('[data-ocr-demo]')?.value || row?.ocrMode || 'base';
    const fileName = modalRoot.querySelector('[data-clear-screenshot]')?.files?.[0]?.name || ctx?.state?.processDraft?.fileName || '';
    return {
      action: modalRoot.dataset.processAction || '处理成功',
      amount,
      uploaded,
      ocrMode,
      fileName
    };
  }

  function applyProcessDraft(modalRoot, draft) {
    if (!modalRoot || !draft) return;
    const amountInput = modalRoot.querySelector('[data-process-amount]');
    const ocrSelect = modalRoot.querySelector('[data-ocr-demo]');
    const list = modalRoot.querySelector('[data-upload-list]');
    if (amountInput && draft.amount) amountInput.value = draft.amount;
    if (ocrSelect && draft.ocrMode) ocrSelect.value = draft.ocrMode;
    modalRoot.dataset.ocrMode = draft.ocrMode || 'base';
    if (draft.uploaded) {
      modalRoot.dataset.uploaded = '1';
      if (list && draft.fileName) list.innerHTML = `<li><i class="fas fa-paperclip" aria-hidden="true"></i><span>${esc(draft.fileName)}</span></li>`;
    }
  }

  function clearCompareTimer() {
    if (ctx?.state?.compareTimer) {
      clearTimeout(ctx.state.compareTimer);
      ctx.state.compareTimer = null;
    }
  }

  function refreshProcessModal(modalRoot, row) {
    if (!modalRoot || !row) return;
    const amount = parseAmount(modalRoot.querySelector('[data-process-amount]')?.value);
    const uploaded = Boolean(modalRoot.querySelector('[data-clear-screenshot]')?.files?.length || modalRoot.dataset.uploaded === '1');
    const mode = modalRoot.querySelector('[data-ocr-demo]')?.value || row.ocrMode || 'base';
    modalRoot.dataset.ocrMode = mode;
    if (uploaded) modalRoot.dataset.uploaded = '1';
    const signature = `${amount}|${mode}|${uploaded ? 1 : 0}`;
    if (modalRoot.dataset.compareSig && modalRoot.dataset.compareSig !== signature) {
      clearCompareTimer();
      modalRoot.dataset.comparing = '';
      modalRoot.dataset.phase = '';
      const box = modalRoot.querySelector('[data-clear-check]');
      if (box) box.innerHTML = '';
    }
    modalRoot.dataset.compareSig = signature;
    const ocr = resolveOcr(mode, amount, parseAmount(row.amount), uploaded);
    const evalResult = evaluate(amount, row, pageKind(), ocr);
    const submit = modalRoot.closest('.modal-backdrop')?.querySelector('[data-modal-submit]');
    const comparing = modalRoot.dataset.comparing === '1';
    if (submit) {
      submit.disabled = comparing || !(amount > 0 && uploaded);
      submit.textContent = comparing ? '识别比对中…' : '提交审批';
    }
    return evalResult;
  }

  function waitHtml(seconds) {
    return `<div class="notice">识别比对中，请稍候 ${seconds} 秒…</div>`;
  }

  function riskModalHtml(pending) {
    const ev = pending.evalResult;
    const noBase = !ev.baseReady;
    const title = noBase ? '无法校验金额偏差' : '金额偏差较大，请二次确认';
    const lead = noBase
      ? '基准金额为 0 或暂时无法获取，系统无法计算 5% 偏差。请人工核对后再确认。确认后只提交飞书审批，不会加钱包。'
      : '输入金额与系统基准相差 ≥ 5%。确认后只提交飞书审批，不会加钱包。';
    const gate = ev.needFinal
      ? `<p class="risk-confirm__sub">本单复审通过后还要财务终审。${esc(ev.finalReason)}。</p>`
      : '';
    const ocrText = ev.ocrState === 'fail' ? '未识别' : ev.ocrAmount != null ? formatMoney(ev.ocrAmount, ev.currency) : '—';
    return `<div class="modal-backdrop" data-clear-approval-risk><section class="modal modal-md"><div class="modal__header"><h2 class="modal__title">${esc(title)}</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="risk-confirm"><p>${esc(lead)}</p>${gate}<div class="risk-summary"><span>基准说明：${esc(pending.baseLabel)}</span><span>基准金额：${esc(ev.baseReady ? formatMoney(ev.base, ev.currency) : '无基准')}</span><span>本次输入：${esc(formatMoney(pending.amount, ev.currency))}</span><span>识别金额：${esc(ocrText)}</span>${ev.delta != null ? `<span>偏差：${esc((ev.delta * 100).toFixed(2))}%</span>` : ''}</div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-approval-back>返回修改</button><button type="button" class="btn btn-danger" data-modal-submit>已知悉，确认提交</button></div></section></div>`;
  }

  function feishuHtml(row, stage, readonly) {
    const approval = row.approval || {};
    const kind = approval.kind || pageKind();
    const currency = approval.currency || row.currency || 'USD';
    const ocrText = approval.ocrState === 'fail' ? '未识别' : approval.ocrAmount != null ? formatMoney(approval.ocrAmount, currency) : '—';
    const financeTip = stage === 'final' && !readonly
      ? '<div class="notice notice--warning">本单因 ≥ 5000 USD 或倍率 ≥ 2 进入终审。财务有代理权限，必要时请登录代理后台核对。</div>'
      : '';
    const rejectBox = readonly ? '' : `<div class="form-field full"><label>驳回原因${stage === 'review' || stage === 'final' ? '' : ''}</label><textarea data-approval-reject-reason placeholder="驳回时必填">${esc(row.rejectReason && row.rejectReason !== '-' ? row.rejectReason : '')}</textarea></div>`;
    const footer = readonly
      ? `<button type="button" class="btn btn-primary" data-modal-close>关闭</button>`
      : `<button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-danger" data-approval-reject>驳回</button><button type="button" class="btn btn-primary" data-approval-approve>通过</button>`;
    return `<div class="modal-backdrop"><section class="modal modal-lg clear-approval-feishu" data-clear-approval-feishu data-approval-stage="${esc(stage)}" data-approval-readonly="${readonly ? '1' : '0'}"><div class="modal__header"><h2 class="modal__title">飞书审批 · ${stage === 'final' ? '终审' : stage === 'review' ? '复审' : '详情'}（示意）</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">此单由系统在处理人提交后创建，不能从飞书空白发起。复审以截图和录入金额为准，识别结果仅供参考。</div>${financeTip}<div class="detail-grid"><div><dt>单据号</dt><dd>${esc(row.orderId || '-')}</dd></div><div><dt>操作类型</dt><dd>${esc(kind)}</dd></div><div><dt>广告账户ID</dt><dd>${esc(row.accountId || '-')}</dd></div><div><dt>客户 / 商户ID</dt><dd>${esc((row.customerName || '-') + ' / ' + (row.merchantId || '-'))}</dd></div><div><dt>代理</dt><dd>${esc(row.agent || '-')}</dd></div><div><dt>处理人</dt><dd>${esc(approval.processor || row.processor || '-')}</dd></div><div><dt>录入金额</dt><dd>${esc(formatMoney(approval.inputAmount ?? parseAmount(row.actualAmount), currency))}</dd></div><div><dt>截图识别</dt><dd>${esc(ocrText)}</dd></div><div><dt>基准</dt><dd>${esc(approval.base == null ? '无基准' : `${approval.baseLabel || '基准'} ${formatMoney(approval.base, currency)}`)}</dd></div><div><dt>倍率 / 折USD</dt><dd>${esc((approval.ratio == null ? '无倍率' : approval.ratio.toFixed(2) + ' 倍') + ' / ' + (approval.usd != null ? approval.usd.toFixed(2) : '—'))}</dd></div><div><dt>审批档位</dt><dd>${approval.needFinal ? `复审 + 终审（${esc(approval.finalReason || '')}）` : '仅复审'}</dd></div></div><div class="receipt-preview-box"><div class="receipt-preview-box__icon">${icon('image')}</div><div><strong>${esc(approval.fileName || 'agency-screenshot.png')}</strong><p>代理系统截图。复审请核对此图金额是否等于录入金额。</p></div></div>${rejectBox}${row.approvalLines ? `<div class="clear-approval-lines">${row.approvalLines}</div>` : ''}</div><div class="modal__footer">${footer}</div></section></div>`;
  }

  function creditWallet(row) {
    const amount = row.approval?.inputAmount ?? parseAmount(row.actualAmount);
    const currency = row.walletCurrency || row.currency || 'USD';
    if (row.fundFail) {
      row.status = '已审批待入账';
      row.walletAmount = '0';
      row.completedAt = '-';
      row.remark = '审批已通过，Fund 入账失败。可重试入账，不再审金额。';
      applyOps(row, pageKind());
      return false;
    }
    row.status = '完成';
    row.actualAmount = Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 });
    row.walletAmount = Number(amount).toLocaleString('en-US', { maximumFractionDigits: 2 });
    row.walletCurrency = currency;
    row.completedAt = nowText();
    row.remark = '飞书审批通过，已调 Fund 增加客户钱包。';
    applyOps(row, pageKind());
    return true;
  }

  function openProcess(action, row, draft) {
    if (currentRole().id !== 'processor') {
      ctx.showToast('请切换到充值组处理人后再录入金额', 'error');
      return;
    }
    clearCompareTimer();
    ctx.state.processingRow = row;
    ctx.openModal(processModalHtml(action, row));
    const modalRoot = document.querySelector('[data-clear-approval-process]');
    if (draft) applyProcessDraft(modalRoot, draft);
    refreshProcessModal(modalRoot, row);
  }

  function commitToFeishu(pending) {
    const row = pending.row;
    const evalResult = pending.evalResult;
    row.approval = snapshotFromEval(row, pageKind(), pending.action, pending.amount, evalResult, pending.ocrMode, pending.fileName);
    row.actualAmount = pending.amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
    row.processor = currentRole().name;
    row.reviewer = '';
    row.financeApprover = '';
    row.approvalStage = evalResult.needFinal ? '待复审（通过后终审）' : '待复审';
    row.status = '待复审';
    row.rejectReason = '-';
    row.remark = `已提交飞书复审，尚未加钱包。${compareLine(evalResult)}`;
    applyOps(row, pageKind());
    ctx.state.processingRow = null;
    ctx.state.pendingRisk = null;
    ctx.state.processDraft = null;
    ctx.closeModal();
    ctx.render();
    ctx.showToast('已提交飞书复审，钱包未入账（原型）', 'success');
  }

  function finishCompare(modalRoot, row) {
    modalRoot.dataset.comparing = '';
    const draft = processDraftFromModal(modalRoot, row);
    const evalResult = refreshProcessModal(modalRoot, row);
    const box = modalRoot.querySelector('[data-clear-check]');
    if (!draft.uploaded) {
      if (box) box.innerHTML = '';
      ctx.showToast('请先上传截图', 'error');
      return;
    }
    if (!draft.amount) {
      if (box) box.innerHTML = '';
      ctx.showToast('请输入本次输入金额', 'error');
      return;
    }
    if (box) box.innerHTML = '';
    const pending = {
      row,
      action: draft.action,
      amount: draft.amount,
      evalResult,
      ocrMode: draft.ocrMode,
      fileName: draft.fileName || 'agency-clear.png',
      baseLabel: baseLabel(pageKind(), row)
    };
    ctx.state.processDraft = draft;
    if (!evalResult.baseReady || evalResult.delta >= 0.05) {
      ctx.state.pendingRisk = pending;
      ctx.closeModal();
      ctx.openModal(riskModalHtml(pending));
      return;
    }
    commitToFeishu(pending);
  }

  function startCompare(modalRoot, row) {
    clearCompareTimer();
    modalRoot.dataset.comparing = '1';
    const box = modalRoot.querySelector('[data-clear-check]');
    let left = COMPARE_SECONDS;
    const tick = () => {
      if (!document.body.contains(modalRoot)) {
        clearCompareTimer();
        return;
      }
      if (left <= 0) {
        ctx.state.compareTimer = null;
        finishCompare(modalRoot, row);
        return;
      }
      if (box) box.innerHTML = waitHtml(left);
      refreshProcessModal(modalRoot, row);
      left -= 1;
      ctx.state.compareTimer = setTimeout(tick, 1000);
    };
    tick();
  }

  function submitProcess(modalRoot) {
    const row = ctx.state.processingRow;
    if (!row) { ctx.showToast('未找到当前工单', 'error'); return; }
    if (currentRole().id !== 'processor') { ctx.showToast('只有处理人可以提交审批', 'error'); return; }
    if (modalRoot.dataset.comparing === '1') return;
    const draft = processDraftFromModal(modalRoot, row);
    if (!draft.amount) { ctx.showToast('请输入本次输入金额', 'error'); return; }
    if (!draft.uploaded) { ctx.showToast('请先上传截图', 'error'); return; }
    startCompare(modalRoot, row);
  }

  function reopenProcessFromDraft() {
    const row = ctx.state.processingRow || ctx.state.pendingRisk?.row;
    const draft = ctx.state.processDraft;
    if (!row) return;
    ctx.state.pendingRisk = null;
    ctx.closeModal();
    openProcess(draft?.action || '处理成功', row, draft);
  }

  function openApproval(row, stage, readonly) {
    ctx.state.processingRow = row;
    ctx.openModal(feishuHtml(row, stage, readonly));
  }

  function guardStage(row, stage) {
    const role = currentRole();
    if (stage === 'review') {
      if (role.id !== 'reviewer') return '请切换到复审人身份';
      if (role.name === (row.processor || row.approval?.processor)) return '复审人不能与处理人相同';
    }
    if (stage === 'final') {
      if (role.id !== 'finance') return '请切换到财务终审人身份';
      if ([row.processor, row.reviewer, row.approval?.processor].includes(role.name)) return '终审人不能与处理人或复审人相同';
    }
    return '';
  }

  function approve(stage) {
    const row = ctx.state.processingRow;
    if (!row) return;
    const blocked = guardStage(row, stage);
    if (blocked) { ctx.showToast(blocked, 'error'); return; }
    if (stage === 'review') {
      row.reviewer = currentRole().name;
      if (row.approval) {
        row.approval.reviewer = currentRole().name;
        row.approval.reviewedAt = nowText();
      }
      if (row.approval?.needFinal || row.needFinal) {
        row.status = '待终审';
        row.approvalStage = '待终审';
        row.remark = '复审已通过，等待财务终审，尚未加钱包。';
        applyOps(row, pageKind());
        ctx.state.processingRow = null;
        ctx.closeModal();
        ctx.render();
        ctx.showToast('复审已通过，已发起飞书终审（原型）', 'success');
        return;
      }
      const ok = creditWallet(row);
      ctx.state.processingRow = null;
      ctx.closeModal();
      ctx.render();
      ctx.showToast(ok ? '复审通过，已调 Fund 入账（原型）' : '复审通过，Fund 入账失败，可重试', ok ? 'success' : 'error');
      return;
    }
    row.financeApprover = currentRole().name;
    if (row.approval) {
      row.approval.financeApprover = currentRole().name;
      row.approval.finalAt = nowText();
    }
    const ok = creditWallet(row);
    ctx.state.processingRow = null;
    ctx.closeModal();
    ctx.render();
    ctx.showToast(ok ? '终审通过，已调 Fund 入账（原型）' : '终审通过，Fund 入账失败，可重试', ok ? 'success' : 'error');
  }

  function reject(stage) {
    const row = ctx.state.processingRow;
    if (!row) return;
    const blocked = guardStage(row, stage);
    if (blocked) { ctx.showToast(blocked, 'error'); return; }
    const reason = document.querySelector('[data-approval-reject-reason]')?.value.trim();
    if (!reason) { ctx.showToast('驳回必须填写原因', 'error'); return; }
    row.status = '审批驳回';
    row.approvalStage = '已驳回';
    row.rejectReason = reason;
    row.remark = `${stage === 'final' ? '终审' : '复审'}驳回：${reason}。金额未入账，可改后重提。`;
    applyOps(row, pageKind());
    ctx.state.processingRow = null;
    ctx.closeModal();
    ctx.render();
    ctx.showToast('已驳回，钱包未入账（原型）', 'info');
  }

  function retryFund(row) {
    if (currentRole().id !== 'processor' && currentRole().id !== 'finance') {
      ctx.showToast('入账重试由处理人或财务执行', 'error');
      return;
    }
    row.fundFail = false;
    const ok = creditWallet(row);
    ctx.render();
    ctx.showToast(ok ? '已重试 Fund 并入账（原型）' : '入账仍失败', ok ? 'success' : 'error');
  }

  function afterRender(root) {
    if (!isTargetPage() || !root) return;
    const page = root.querySelector('.module-page');
    if (!page || page.querySelector('.clear-approval-rolebar')) return;
    page.insertAdjacentHTML('afterbegin', roleBarHtml());
  }

  function handleRowAction(action, row) {
    if (!isTargetPage()) return false;
    if (/处理成功|媒体已完成/.test(action)) {
      openProcess(action, row);
      return true;
    }
    if (action === '飞书复审') {
      const blocked = guardStage(row, 'review');
      if (blocked) { ctx.showToast(blocked, 'error'); return true; }
      openApproval(row, 'review', false);
      return true;
    }
    if (action === '飞书终审') {
      const blocked = guardStage(row, 'final');
      if (blocked) { ctx.showToast(blocked, 'error'); return true; }
      openApproval(row, 'final', false);
      return true;
    }
    if (action === '查看审批') {
      openApproval(row, row.status === '待终审' ? 'final' : 'review', true);
      return true;
    }
    if (action === '重试入账') {
      retryFund(row);
      return true;
    }
    return false;
  }

  function handleToolbar(actionLabel, selectedRows) {
    if (!isTargetPage()) return false;
    if (actionLabel === '人工处理') {
      ctx.openModal(`<div class="modal-backdrop"><section class="modal"><div class="modal__header"><h2 class="modal__title">人工处理</h2><button class="modal__close" type="button" data-modal-close>${icon('times')}</button></div><div class="modal__body"><div class="notice">成功入账必须按单填写金额和截图，不能批量。失败或取消可以批量。</div><div class="form-grid" data-clear-approval-manual><div class="form-field full"><label>处理结果</label><select data-manual-result><option value="">选择处理结果</option><option value="成功">成功</option><option value="失败">失败</option><option value="取消">取消</option></select></div></div></div><div class="modal__footer"><button type="button" class="btn btn-default" data-modal-close>取消</button><button type="button" class="btn btn-primary" data-modal-submit>确定</button></div></section></div>`);
      ctx.state.pendingManualRows = selectedRows || [];
      return true;
    }
    return false;
  }

  function handleModalSubmit(backdrop) {
    if (!backdrop) return false;
    if (backdrop.querySelector('[data-clear-approval-process]')) {
      submitProcess(backdrop.querySelector('[data-clear-approval-process]'));
      return true;
    }
    if (backdrop.querySelector('[data-clear-approval-risk]') || backdrop.matches('[data-clear-approval-risk]')) {
      if (!ctx.state.pendingRisk) { ctx.showToast('未找到待确认工单', 'error'); return true; }
      commitToFeishu(ctx.state.pendingRisk);
      return true;
    }
    if (backdrop.querySelector('[data-clear-approval-manual]')) {
      const result = backdrop.querySelector('[data-manual-result]')?.value;
      if (!result) { ctx.showToast('请选择处理结果', 'error'); return true; }
      if (result === '成功') {
        ctx.showToast('成功入账不能批量。请按单点「媒体已完成」并上传截图。', 'error');
        return true;
      }
      const targets = ctx.state.pendingManualRows || [];
      if (!targets.length) { ctx.showToast('请先勾选工单', 'error'); return true; }
      targets.forEach(row => {
        row.status = result === '取消' ? '人工取消' : '失败';
        row.remark = result === '取消' ? '人工取消，未加钱包。' : '人工处理失败，未加钱包。';
        row.selectable = false;
        row.ops = row.approval ? ['查看审批'] : [];
      });
      ctx.state.pendingManualRows = [];
      ctx.closeModal();
      ctx.render();
      ctx.showToast(`已将 ${targets.length} 单标记为${result}（原型）`, 'success');
      return true;
    }
    return false;
  }

  document.addEventListener('click', event => {
    const roleButton = event.target.closest('[data-clear-role]');
    if (roleButton) {
      setRole(roleButton.dataset.clearRole);
      return;
    }
    if (event.target.closest('[data-approval-approve]')) {
      const stage = event.target.closest('[data-clear-approval-feishu]')?.dataset.approvalStage;
      approve(stage);
      return;
    }
    if (event.target.closest('[data-approval-reject]')) {
      const stage = event.target.closest('[data-clear-approval-feishu]')?.dataset.approvalStage;
      reject(stage);
      return;
    }
    if (event.target.closest('[data-approval-back]')) {
      reopenProcessFromDraft();
    }
  });
  document.addEventListener('input', event => {
    if (!event.target.closest('[data-clear-approval-process]')) return;
    refreshProcessModal(event.target.closest('[data-clear-approval-process]'), ctx?.state?.processingRow);
  });
  document.addEventListener('change', event => {
    if (event.target.closest('[data-ocr-demo], [data-clear-screenshot]')) {
      const modalRoot = event.target.closest('[data-clear-approval-process]');
      if (event.target.matches('[data-clear-screenshot]') && event.target.files?.length) {
        modalRoot.dataset.uploaded = '1';
      }
      refreshProcessModal(modalRoot, ctx?.state?.processingRow);
    }
  });

  window.BESTADS_CLEAR_APPROVAL = {
    isTargetPage,
    pageKind,
    attach(next) { ctx = next; },
    afterRender,
    handleRowAction,
    handleToolbar,
    handleModalSubmit,
    openProcess
  };
})();
