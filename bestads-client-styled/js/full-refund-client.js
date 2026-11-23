/*
 * 客户端全额退款入口、锁定提示，以及充值/减款/清零拦截。
 */
(function () {
  'use strict';

  const api = window.BESTADS_FULL_REFUND;
  if (!api) return;

  const copy = {
    'zh-CN': {
      button: '全额退款',
      noPerm: '当前未开通全额退款。如需退出合作，请联系商务。',
      banner: '全额退款处理中。当前不能再给广告账户充值，自动充值也会停，不能自行撤回。',
      view: '查看进度',
      impact1: '这是全额退出。提交后不能再给广告账户充值，自动充值也会停。',
      impact2: '广告账户里还没回到钱包的钱，由我方运营收回后再退。',
      impact3: '提交后不能自行撤回。要恢复使用，只能由内部取消。',
      amount: '参考可退金额按当前钱包真实金额 640.00 USD 计算，不含信用额度。',
      check: '我已知晓上述影响，确认提交全额退款',
      note: '退款说明',
      noteTip: '请填写退款原因，以及收款户名、账号、开户行。可不填，后续由工作人员补录。',
      submit: '确认提交',
      cancel: '取消',
      lockedOp: '全额退款处理中，当前不能做这个操作',
      autoOn: '全额退款处理中，不能启用自动充值',
      pay: '全额退款处理中，不能确认开户付款',
      sent: '已提交全额退款，已飞书通知业务',
      status: '当前进度',
      statusMap: { '处理中': '处理中', '待财务核对': '待财务核对', '已退款': '已退款', '已取消': '已取消' }
    },
    'en-US': {
      button: 'Full Refund',
      noPerm: 'Full refund is not enabled. Contact your account manager.',
      banner: 'A full refund is in progress. Ad account top-ups and auto recharge are stopped. You cannot withdraw this request.',
      view: 'View status',
      impact1: 'This closes the account. After submission you cannot top up ad accounts, and auto recharge stops.',
      impact2: 'Remaining ad account balance is returned by our team before the refund.',
      impact3: 'You cannot withdraw this request. Only our team can cancel it.',
      amount: 'The reference amount is the real wallet balance of 640.00 USD, excluding credit.',
      check: 'I understand and confirm the full refund',
      note: 'Refund note',
      noteTip: 'Enter the reason and beneficiary name, account number, and bank. Optional.',
      submit: 'Submit',
      cancel: 'Cancel',
      lockedOp: 'Unavailable during a full refund',
      autoOn: 'Auto recharge cannot be enabled during a full refund',
      pay: 'Opening payment is unavailable during a full refund',
      sent: 'Full refund submitted. The team has been notified.',
      status: 'Status',
      statusMap: { '处理中': 'In progress', '待财务核对': 'Pending finance review', '已退款': 'Refunded', '已取消': 'Cancelled' }
    }
  };

  function text() {
    return localStorage.getItem('bestadsClientLang') === 'en-US' ? copy['en-US'] : copy['zh-CN'];
  }

  function statusLabel(status) {
    return text().statusMap[status] || status;
  }

  function toast(message, type) {
    const exist = document.getElementById('toast') || document.getElementById('clientShellToast');
    if (exist && exist.classList) {
      exist.textContent = message;
      exist.className = `${exist.id === 'toast' ? 'toast' : 'client-shell-toast'} show ${type || 'success'}`;
      clearTimeout(toast.timer);
      toast.timer = setTimeout(() => { exist.className = exist.id === 'toast' ? 'toast' : 'client-shell-toast'; }, 2400);
      return;
    }
    window.alert(message);
  }

  function banner(host) {
    if (!host || host.querySelector('[data-full-refund-banner]')) return;
    const order = api.clientOrder();
    if (!order || order.status === '已取消') return;
    const bar = document.createElement('div');
    bar.dataset.fullRefundBanner = '1';
    bar.style.cssText = 'margin:0 0 12px;padding:10px 12px;border-radius:8px;background:#fff7e8;color:#7a4b00;font-size:13px;line-height:1.5;';
    const link = /wallet\.html$/.test(location.pathname) ? '' : ` <a href="./wallet.html">${text().view}</a>`;
    bar.innerHTML = `${text().banner} ${text().status}：${statusLabel(order.status)}。${link}`;
    host.prepend(bar);
  }

  function lockedGuard(event) {
    if (!api.clientLocked()) return;
    const target = event.target.closest('[data-open="rechargeModal"], [data-open="deductModal"], [data-open="clearModal"], [data-open-payment], #i18n_btn_online_recharge, [onclick*="openSheet(\'recharge\'"], [onclick*="openClearConfirm"]');
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    toast(text().lockedOp, 'error');
  }

  document.addEventListener('click', lockedGuard, true);

  function mountWallet() {
    const button = document.querySelector('[data-open-payment]');
    if (!button || document.getElementById('fullRefundEntry')) return;
    const wrap = document.createElement('div');
    wrap.id = 'fullRefundEntry';
    wrap.style.marginTop = button.parentElement.classList.contains('overview-actions') ? '0' : '12px';
    const allowed = api.allowed(api.CLIENT_MERCHANT_ID, 'web');
    const order = api.clientOrder();
    if (!allowed) {
      wrap.innerHTML = `<p style="color:#8f959e;font-size:13px">${text().noPerm}</p>`;
    } else if (!order || order.status === '已取消') {
      wrap.innerHTML = `<button class="button" type="button" id="openFullRefund">${text().button}</button>`;
    } else {
      wrap.innerHTML = `<p style="font-size:13px">${text().status}：${statusLabel(order.status)}</p>${order.note ? `<p style="font-size:13px;color:#646a73">${order.note}</p>` : ''}`;
    }
    button.parentElement.appendChild(wrap);
    banner(document.querySelector('.content') || document.querySelector('main') || button.parentElement);
    document.getElementById('openFullRefund')?.addEventListener('click', openApply);
  }

  function ensureStyle() {
    if (document.getElementById('fullRefundStyle')) return;
    const style = document.createElement('style');
    style.id = 'fullRefundStyle';
    style.textContent = `
      #fullRefundMask { position: fixed; inset: 0; z-index: 100; display: flex; align-items: flex-start; justify-content: center; padding: 120px 24px 32px; background: rgba(15, 23, 42, .45); overflow: auto; }
      #fullRefundMask section { width: min(520px, calc(100vw - 48px)); border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #1f2329; box-shadow: 0 8px 24px rgba(31, 35, 41, .08); font-family: "PingFang SC", "Helvetica Neue", Arial, sans-serif; font-size: 12px; line-height: 1.5; }
      #fullRefundMask header { min-height: 56px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf0f5; }
      #fullRefundMask h2 { margin: 0; font-size: 16px; line-height: 24px; font-weight: 600; }
      #fullRefundMask .full-refund-close { width: 28px; height: 28px; border: 0; border-radius: 6px; background: transparent; color: #8f959e; font-size: 18px; line-height: 1; cursor: pointer; }
      #fullRefundMask .full-refund-close:hover { background: #f5f7fb; color: #1f2329; }
      #fullRefundMask .full-refund-body { padding: 16px 20px 8px; }
      #fullRefundMask p { margin: 0 0 8px; }
      #fullRefundMask .muted { color: #646a73; }
      #fullRefundMask label.field { display: block; margin: 12px 0 6px; font-weight: 500; }
      #fullRefundMask textarea { width: 100%; min-height: 88px; box-sizing: border-box; border: 1px solid #d9d9d9; border-radius: 8px; padding: 7px 11px; color: #1f2329; font: inherit; resize: vertical; outline: none; }
      #fullRefundMask textarea:focus { border-color: #2759ff; box-shadow: 0 0 0 2px rgba(39, 89, 255, .1); }
      #fullRefundMask textarea::placeholder { color: #b8bcca; }
      #fullRefundMask .check { display: flex; gap: 8px; align-items: flex-start; margin: 12px 0 4px; }
      #fullRefundMask .check input { margin-top: 2px; accent-color: #2759ff; }
      #fullRefundMask footer { min-height: 56px; padding: 12px 20px; display: flex; justify-content: flex-end; gap: 8px; border-top: 1px solid #edf0f5; }
      #fullRefundMask .full-refund-btn { height: 32px; min-width: 76px; padding: 0 15px; border-radius: 8px; border: 1px solid #d9d9d9; background: #fff; color: #1f2329; font: inherit; font-weight: 500; cursor: pointer; }
      #fullRefundMask .full-refund-btn:hover { border-color: #2f6bff; color: #2f6bff; }
      #fullRefundMask .full-refund-btn.primary { border-color: #2759ff; background: #2759ff; color: #fff; }
      #fullRefundMask .full-refund-btn.primary:hover { border-color: #2f6bff; background: #2f6bff; color: #fff; }
    `;
    document.head.appendChild(style);
  }

  function fillApply(mask) {
    const note = mask.querySelector('#fullRefundNote');
    const noteValue = note ? note.value : '';
    const checked = Boolean(mask.querySelector('#fullRefundCheck')?.checked);
    const current = text();
    mask.querySelector('section').innerHTML = `
      <header>
        <h2>${current.button}</h2>
        <button class="full-refund-close" type="button" id="fullRefundClose" aria-label="${current.cancel}">×</button>
      </header>
      <div class="full-refund-body">
        <p>${current.impact1}</p>
        <p>${current.impact2}</p>
        <p>${current.impact3}</p>
        <p class="muted">${current.amount}</p>
        <label class="field" for="fullRefundNote">${current.note}</label>
        <textarea id="fullRefundNote" rows="4" placeholder="${current.noteTip}"></textarea>
        <label class="check"><input id="fullRefundCheck" type="checkbox"><span>${current.check}</span></label>
      </div>
      <footer>
        <button class="full-refund-btn" type="button" id="fullRefundCancel">${current.cancel}</button>
        <button class="full-refund-btn primary" type="button" id="fullRefundSubmit">${current.submit}</button>
      </footer>`;
    const nextNote = mask.querySelector('#fullRefundNote');
    nextNote.value = noteValue;
    mask.querySelector('#fullRefundCheck').checked = checked;
    const close = () => mask.remove();
    mask.querySelector('#fullRefundClose').onclick = close;
    mask.querySelector('#fullRefundCancel').onclick = close;
    mask.querySelector('#fullRefundSubmit').onclick = () => submitApply(mask);
  }

  function submitApply(mask) {
    if (!mask.querySelector('#fullRefundCheck').checked) {
      toast(text().check, 'error');
      return;
    }
    const result = api.submitClient(mask.querySelector('#fullRefundNote').value);
    if (!result.ok) { toast(result.message, 'error'); return; }
    mask.remove();
    toast(text().sent);
    mountWallet();
    location.reload();
  }

  function openApply() {
    ensureStyle();
    const mask = document.createElement('div');
    mask.id = 'fullRefundMask';
    mask.innerHTML = '<section></section>';
    mask.addEventListener('click', (event) => {
      if (event.target === mask) mask.remove();
    });
    document.body.appendChild(mask);
    fillApply(mask);
  }

  function mountH5() {
    const page = document.getElementById('page-wallet');
    if (!page || document.getElementById('h5FullRefund')) return;
    const box = document.createElement('div');
    box.id = 'h5FullRefund';
    box.style.cssText = 'margin:12px 0;padding:12px;border:1px solid #e5e7eb;border-radius:12px;font-size:13px;';
    const allowed = api.allowed(api.CLIENT_MERCHANT_ID, 'h5');
    const order = api.clientOrder();
    if (!allowed) box.textContent = text().noPerm;
    else if (!order || order.status === '已取消') box.innerHTML = `<button type="button" id="openFullRefund" style="width:100%;padding:10px;border:0;border-radius:8px;background:#2759ff;color:#fff">${text().button}</button>`;
    else box.textContent = `${text().status}：${statusLabel(order.status)}`;
    const anchor = document.getElementById('i18n_btn_online_recharge');
    (anchor ? anchor.parentElement : page).appendChild(box);
    document.getElementById('openFullRefund')?.addEventListener('click', openApply);
    if (api.clientLocked()) banner(page);
  }

  function mountAccount() {
    if (!document.querySelector('[data-open="rechargeModal"]')) return;
    const host = document.querySelector('.content') || document.querySelector('.page-header') || document.body;
    if (api.clientLocked()) banner(host);
  }

  window.BESTADS_FULL_REFUND_CLIENT = {
    refreshLanguage,
    guardAutoEnable() {
      if (!api.clientLocked()) return false;
      toast(text().autoOn, 'error');
      return true;
    },
    guardOpeningPay() {
      if (!api.clientLocked()) return false;
      toast(text().pay, 'error');
      return true;
    },
    mountBanner(host) {
      if (api.clientLocked()) banner(host);
    }
  };

  function refreshLanguage() {
    document.getElementById('fullRefundEntry')?.remove();
    document.querySelector('[data-full-refund-banner]')?.remove();
    document.getElementById('h5FullRefund')?.remove();
    if (document.getElementById('page-wallet')) mountH5();
    if (document.querySelector('[data-open-payment]')) mountWallet();
    mountAccount();
    const mask = document.getElementById('fullRefundMask');
    if (mask) fillApply(mask);
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('#languageToggle, [data-client-action="toggle-language"]')) return;
    setTimeout(refreshLanguage, 0);
  });

  if (document.getElementById('page-wallet')) mountH5();
  if (document.querySelector('[data-open-payment]')) mountWallet();
  mountAccount();
})();
