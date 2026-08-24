/*
 * BestAds 运营端「IT双周会报表」看板。
 * 独立于报表表格契约，不走 admin-reports-page.js。
 */
(function () {
  'use strict';

  const root = document.getElementById('page-root');
  if (!root) return;

  const M = {
    fund: {
      current: {
        net: 10951193.04, gross: 10954855.03, refund: 3661.99, refundN: 5, count: 2479, people: 452,
        online: 610489.93, offline: 10344365.10,
        newAmt: 1307939.09, oldAmt: 9643253.95, unknownAmt: 0,
        newPeople: 214, oldPeople: 238, newCount: 838, oldCount: 1641
      },
      prev: {
        net: 10465753.56, gross: 10511150.74, refund: 45397.18, refundN: 6, count: 2395, people: 444,
        online: 777434.01, offline: 9733716.73,
        newAmt: 1198282.24, oldAmt: 9267471.32, unknownAmt: 0,
        newPeople: 208, oldPeople: 236, newCount: 763, oldCount: 1632
      }
    },
    rec: {
      current: {
        net: 11638269.58, recharge: 11752153.91, clear: 95819.48, reduce: 18064.85, count: 5752, people: 490,
        newAmt: 1677045.27, oldAmt: 9961224.31, unknownAmt: 0,
        newPeople: 227, oldPeople: 263, newCount: 1466, oldCount: 4286
      },
      prev: {
        net: 10998699.69, recharge: 11300396.69, clear: 252806.86, reduce: 48890.14, count: 5616, people: 486,
        newAmt: 1520921.12, oldAmt: 9477778.57, unknownAmt: 0,
        newPeople: 219, oldPeople: 267, newCount: 1365, oldCount: 4251
      }
    },
    spend: {
      current: {
        amount: 11835794.46, people: 549, accounts: 1015,
        newAmt: 1984755.57, oldAmt: 9844228.03, unknownAmt: 6810.86,
        newPeople: 258, oldPeople: 291, newAccounts: 358, oldAccounts: 657
      },
      prev: {
        amount: 11299859.04, people: 554, accounts: 1045,
        newAmt: 1839657.92, oldAmt: 9452483.17, unknownAmt: 7717.95,
        newPeople: 256, oldPeople: 298, newAccounts: 358, oldAccounts: 687
      }
    },
    funnel: [
      { name: '注册', count: 1864, prevCount: 1764 },
      { name: '打款', count: 1420, prevCount: 1310 },
      { name: '下户', count: 1288, prevCount: 1230 },
      { name: '首次账户充值', count: 1196, prevCount: 1110 },
      { name: '首次账户消耗', count: 1084, prevCount: 1005 },
      { name: '累计消耗 1k', count: 742, prevCount: 690 },
      { name: '累计消耗 5k', count: 418, prevCount: 400 },
      { name: '累计消耗 10k', count: 286, prevCount: 260 },
      { name: '累计消耗 100k', count: 52, prevCount: 48 }
    ],
    up: [
      { name: 'Arthur-10', neu: false, spendPrev: 361492.91, spendCur: 506609.51, spendDelta: 145116.60, fundPrev: 303517.25, fundCur: 586968.84, recPrev: 360998.30, recCur: 562238.96 },
      { name: 'Saamir Mithwani', neu: false, spendPrev: 229360.54, spendCur: 343023.93, spendDelta: 113663.39, fundPrev: 130000.00, fundCur: 220000.00, recPrev: 219000.00, recCur: 335867.55 },
      { name: 'Meder', neu: false, spendPrev: 106283.83, spendCur: 214826.88, spendDelta: 108543.05, fundPrev: 108100.00, fundCur: 245000.00, recPrev: 105100.00, recCur: 233000.00 },
      { name: 'Jad', neu: true, spendPrev: 4385.75, spendCur: 75439.04, spendDelta: 71053.29, fundPrev: 8000.00, fundCur: 79000.00, recPrev: 6000.00, recCur: 79000.00 },
      { name: 'CUONG NGUYEN', neu: false, spendPrev: 498569.91, spendCur: 566295.26, spendDelta: 67725.35, fundPrev: 568000.00, fundCur: 758000.00, recPrev: 543000.00, recCur: 683000.00 }
    ],
    down: [
      { name: 'Examy', neu: false, spendPrev: 293230.69, spendCur: 174570.00, spendDelta: -118660.69, fundPrev: 250000.00, fundCur: 250000.00, recPrev: 297000.00, recCur: 75000.00 },
      { name: '电商1组-牧雪组', neu: true, spendPrev: 780537.97, spendCur: 664545.64, spendDelta: -115992.33, fundPrev: 0.00, fundCur: 0.00, recPrev: 378500.00, recCur: 359000.00 },
      { name: 'Tal X ADFABLE', neu: false, spendPrev: 136744.18, spendCur: 32636.59, spendDelta: -104107.59, fundPrev: 138000.00, fundCur: 42000.00, recPrev: 150617.86, recCur: 32500.00 },
      { name: 'Harvey', neu: false, spendPrev: 108976.87, spendCur: 40559.00, spendDelta: -68417.87, fundPrev: 150000.00, fundCur: 100000.00, recPrev: 117984.19, recCur: 40000.00 },
      { name: 'Nguyễn', neu: false, spendPrev: 129471.09, spendCur: 87929.70, spendDelta: -41541.39, fundPrev: 200450.00, fundCur: 0.00, recPrev: 110000.00, recCur: 50000.00 }
    ]
  };

  const money = (n) => {
    const sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  const num = (n) => n.toLocaleString('en-US');
  const pct = (n) => {
    if (n == null || !isFinite(n)) return '—';
    const sign = n > 0 ? '+' : '';
    return sign + (n * 100).toFixed(2) + '%';
  };
  const wow = (c, p) => p ? (c - p) / p : null;
  const cls = (n) => (n > 0.0005 ? 'up' : n < -0.0005 ? 'down' : 'flat');
  const share = (part, total) => total ? part / total : 0;
  const moneyDelta = (n) => (n > 0 ? '+' : '') + money(n);
  const pad2 = (n) => String(n).padStart(2, '0');
  const parseDate = (value) => {
    const [y, m, d] = String(value).split('-').map(Number);
    return new Date(y, m - 1, d);
  };
  const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  const formatYMD = (date) => `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  const formatMD = (date) => `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  const DEFAULT_DATE = formatYMD(new Date());
  const windowsFromStatDate = (value) => {
    const stat = parseDate(value);
    return {
      currentStart: addDays(stat, -14),
      currentEnd: addDays(stat, -1),
      prevStart: addDays(stat, -28),
      prevEnd: addDays(stat, -15)
    };
  };
  const newCustomerCutoff = (periodEnd) => new Date(periodEnd.getFullYear(), periodEnd.getMonth() - 6, 1);
  const footnoteText = (statDate) => {
    const w = windowsFromStatDate(statDate);
    const cutoff = newCustomerCutoff(w.currentEnd);
    const oldEnd = addDays(cutoff, -1);
    const prevText = w.prevStart.getFullYear() === w.currentStart.getFullYear()
      ? `${formatMD(w.prevStart)} 至 ${formatMD(w.prevEnd)}`
      : `${formatYMD(w.prevStart)} 至 ${formatMD(w.prevEnd)}`;
    return `本期 ${formatYMD(w.currentStart)} 至 ${formatMD(w.currentEnd)}，对比上期 ${prevText}。新客 = ${formatYMD(cutoff)} 及以后注册；老客 = ${formatYMD(oldEnd)} 及以前注册。`;
  };
  const funnelHintText = (statDate) => {
    const w = windowsFromStatDate(statDate);
    const yearStart = `${parseDate(statDate).getFullYear()}-01-01`;
    return `人群为 ${yearStart} 至各时点已注册的商户ID。对比 ${formatYMD(w.prevEnd)} 与 ${formatYMD(w.currentEnd)}。商户ID数看上期 → 本期及数量变化；整体看上期 → 本期转化率及百分点变化。`;
  };
  const signedInt = (n) => (n > 0 ? '+' : '') + num(n);
  const ppDelta = (curRate, prevRate) => {
    if (curRate == null || prevRate == null || !isFinite(curRate) || !isFinite(prevRate)) return '—';
    const delta = (curRate - prevRate) * 100;
    const sign = delta > 0 ? '+' : '';
    return sign + delta.toFixed(1) + 'pp';
  };

  function showToast(message) {
    const existing = document.querySelector('.itb-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'itb-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => window.html2canvas ? resolve(window.html2canvas) : reject(new Error('html2canvas 未加载'));
      script.onerror = () => reject(new Error('截图组件加载失败'));
      document.head.appendChild(script);
    });
  }

  async function capturePage() {
    const button = document.getElementById('itbCaptureBtn');
    const target = document.getElementById('itbCapture');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>截图中';
    try {
      const html2canvas = await loadHtml2Canvas();
      const canvas = await html2canvas(target, {
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#f1f3f6',
        scale: 2,
        useCORS: true,
        logging: false,
        onclone(doc) {
          const slot = doc.querySelector('.itb-kpi-slot');
          if (slot) {
            slot.style.display = 'grid';
            slot.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
            slot.style.gap = '16px';
          }
          const bottom = doc.querySelector('.itb-bottom');
          if (bottom) {
            bottom.style.display = 'block';
            bottom.style.gridTemplateColumns = 'minmax(0, 1fr)';
            bottom.style.gap = '0';
          }
          const capture = doc.querySelector('#itbCapture');
          if (capture) capture.style.padding = '16px';
        }
      });
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => result ? resolve(result) : reject(new Error('生成截图失败')), 'image/png');
      });
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('当前浏览器不支持复制图片');
      }
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('已复制截图');
    } catch (error) {
      showToast('复制失败，请检查浏览器剪贴板权限后重试');
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-camera" aria-hidden="true"></i>一键截图';
    }
  }

  root.classList.add('it-biweekly-root');
  root.innerHTML = `
    <div class="admin-page">
      <div class="itb-toolbar">
        <div class="filter-field itb-date-field">
          <label for="itbStatDate">统计日期</label>
          <input id="itbStatDate" type="date" value="${DEFAULT_DATE}" max="${DEFAULT_DATE}">
        </div>
        <button class="btn btn-primary" type="button" id="itbCaptureBtn"><i class="fas fa-camera" aria-hidden="true"></i>一键截图</button>
      </div>
      <div class="itb-capture" id="itbCapture">
        <div class="itb-dash">
          <section class="itb-kpi-slot" id="kpiGroups"></section>
          <div class="itb-bottom">
            <article class="itb-card">
              <h2>客户生命周期漏斗</h2>
              <p class="itb-hint" id="itbFunnelHint"></p>
              <div id="lifecycleFunnel"></div>
            </article>
          </div>
        </div>
        <p class="itb-footnote" id="itbFootnote"></p>
      </div>
    </div>
  `;

  function updateFootnote() {
    const statDate = document.getElementById('itbStatDate').value || DEFAULT_DATE;
    document.getElementById('itbFootnote').textContent = footnoteText(statDate);
    document.getElementById('itbFunnelHint').textContent = funnelHintText(statDate);
  }

  function renderGroups() {
    const groups = [
      {
        title: '钱包净入账',
        desc: '在线 + 线下 − 转账审核退回',
        cur: M.fund.current.net,
        prev: M.fund.prev.net,
        wowv: wow(M.fund.current.net, M.fund.prev.net),
        split: M.fund.current,
        prevSplit: M.fund.prev,
        extra: [
          { label: '总入账次数', val: num(M.fund.current.count), w: wow(M.fund.current.count, M.fund.prev.count) },
          { label: '总入账商户ID数', val: num(M.fund.current.people), w: wow(M.fund.current.people, M.fund.prev.people) }
        ],
        note: '毛入账 ' + money(M.fund.current.gross) + '<br>线下 ' + money(M.fund.current.offline) + ' · 在线 ' + money(M.fund.current.online)
      },
      {
        title: '广告账户净充值',
        desc: '充值 − 清零 − 减款 · 提交时间',
        cur: M.rec.current.net,
        prev: M.rec.prev.net,
        wowv: wow(M.rec.current.net, M.rec.prev.net),
        split: M.rec.current,
        prevSplit: M.rec.prev,
        extra: [
          { label: '总充值次数', val: num(M.rec.current.count), w: wow(M.rec.current.count, M.rec.prev.count) },
          { label: '总充值商户ID数', val: num(M.rec.current.people), w: wow(M.rec.current.people, M.rec.prev.people) },
          { label: '清零 + 减款', val: money(M.rec.current.clear + M.rec.current.reduce), w: wow(M.rec.current.clear + M.rec.current.reduce, M.rec.prev.clear + M.rec.prev.reduce) }
        ],
        note: '毛充值 ' + money(M.rec.current.recharge) + '<br>清零 ' + money(M.rec.current.clear) + ' · 减款 ' + money(M.rec.current.reduce)
      },
      {
        title: '广告账户消耗',
        desc: '只计消耗 > 0 的商户ID数 / 账户数',
        cur: M.spend.current.amount,
        prev: M.spend.prev.amount,
        wowv: wow(M.spend.current.amount, M.spend.prev.amount),
        split: M.spend.current,
        prevSplit: M.spend.prev,
        extra: [
          { label: '总消耗账户数', val: num(M.spend.current.accounts), w: wow(M.spend.current.accounts, M.spend.prev.accounts) },
          { label: '总消耗商户ID数', val: num(M.spend.current.people), w: wow(M.spend.current.people, M.spend.prev.people) }
        ]
      }
    ];
    document.getElementById('kpiGroups').innerHTML = groups.map((g) => {
      const ns = share(g.split.newAmt, g.cur);
      const os = share(g.split.oldAmt, g.cur);
      const us = share(g.split.unknownAmt || 0, g.cur);
      const newWow = wow(g.split.newAmt, g.prevSplit.newAmt);
      const newPeopleWow = wow(g.split.newPeople, g.prevSplit.newPeople);
      return `
        <article class="itb-card">
          <div class="itb-group-head">
            <div>
              <div class="itb-eyebrow">${g.title}</div>
              <div class="itb-big">${money(g.cur)}</div>
              <div class="itb-wow ${cls(g.wowv)}">环比 ${pct(g.wowv)}</div>
            </div>
            <div class="itb-mini" style="min-width:128px">
              <div class="itb-label">上期</div>
              <div class="itb-val">${money(g.prev)}</div>
              <div class="itb-subv">${g.desc}</div>
            </div>
          </div>
          <div class="itb-bar">
            <span style="width:${ns * 100}%;background:var(--itb-new)"></span>
            <span style="width:${os * 100}%;background:var(--itb-old)"></span>
            <span style="width:${us * 100}%;background:var(--itb-pending)"></span>
          </div>
          <div class="itb-legend">
            <span><i class="itb-dot" style="background:var(--itb-new)"></i>新客 ${pct(ns).replace('+', '')} · ${g.split.newPeople}</span>
            <span><i class="itb-dot" style="background:var(--itb-old)"></i>老客 ${pct(os).replace('+', '')} · ${g.split.oldPeople}</span>
          </div>
          <div class="itb-metric-row" style="grid-template-columns:${g.extra.length === 3 ? 'minmax(0,1fr) minmax(0,1fr) minmax(0,1.55fr)' : `repeat(${g.extra.length}, minmax(0, 1fr))`}">
            ${g.extra.map((item) => item.html || `
              <div class="itb-mini">
                <div class="itb-label">${item.label}</div>
                <div class="itb-val itb-val-with-wow">${item.val}${item.w == null ? '' : `<span class="itb-wow ${cls(item.w)}">${pct(item.w)}</span>`}</div>
              </div>
            `).join('')}
          </div>
          <div class="itb-metric-row itb-metric-row-1">
            <div class="itb-mini itb-mini-split">
              <div>
                <div class="itb-label">新客金额</div>
                <div class="itb-val itb-val-with-wow">${money(g.split.newAmt)}<span class="itb-wow ${cls(newWow)}">${pct(newWow)}</span></div>
              </div>
              <div>
                <div class="itb-label">新客商户ID数</div>
                <div class="itb-val itb-val-with-wow">${num(g.split.newPeople)}<span class="itb-wow ${cls(newPeopleWow)}">${pct(newPeopleWow)}</span></div>
              </div>
            </div>
          </div>
          ${g.note ? `<p class="itb-note">${g.note}</p>` : ''}
        </article>
      `;
    }).join('');
  }

  function renderMovers() {
    // 本期暂不展示投放涨跌 Top，保留渲染函数便于后续打开。
    const host = document.getElementById('movers');
    if (!host) return;
    const row = (item) => {
      const w = wow(item.spendCur, item.spendPrev);
      return `
        <div class="itb-mover">
          <div>
            <b>${item.name}</b><span class="itb-tag ${item.neu ? 'itb-tag-ok' : 'itb-tag-old'}">${item.neu ? '新客' : '老客'}</span>
            <div class="itb-meta"><div>消耗 ${money(item.spendPrev)} → ${money(item.spendCur)}</div></div>
          </div>
          <div class="itb-delta itb-wow ${cls(item.spendDelta)}">${moneyDelta(item.spendDelta)}<span class="itb-sub">${pct(w)}</span></div>
        </div>
      `;
    };
    document.getElementById('movers').innerHTML = `
      <div class="itb-mover-col">
        <h3>增量 Top</h3>
        ${M.up.map(row).join('')}
      </div>
      <div class="itb-mover-col">
        <h3>减量 Top</h3>
        ${M.down.map(row).join('')}
      </div>
    `;
  }

  function renderFunnel() {
    const stages = M.funnel;
    const base = stages[0] ? stages[0].count : 0;
    const prevBase = stages[0] ? stages[0].prevCount : 0;
    const rateValue = (part, total) => (total ? part / total : null);
    const rateText = (part, total) => {
      const value = rateValue(part, total);
      if (value == null) return '—';
      return (value * 100).toFixed(1) + '%';
    };
    const pairText = (prev, cur) => `${prev} → ${cur}`;
    const slices = stages.map((stage) => {
      const width = base ? Math.max(6, stage.count / base * 100) : 0;
      return `<div class="itb-funnel-slice" title="${stage.name}"><span style="width:${width}%"></span></div>`;
    }).join('');
    const rows = stages.map((stage) => {
      const countDelta = stage.count - stage.prevCount;
      const curRate = rateValue(stage.count, base);
      const prevRate = rateValue(stage.prevCount, prevBase);
      const rateCls = (curRate == null || prevRate == null) ? 'flat' : cls(curRate - prevRate);
      return `
        <div class="itb-funnel-row">
          <b>${stage.name}</b>
          <span>${pairText(num(stage.prevCount), num(stage.count))}</span>
          <span class="itb-wow ${cls(countDelta)}">${signedInt(countDelta)}</span>
          <span>${pairText(rateText(stage.prevCount, prevBase), rateText(stage.count, base))}</span>
          <span class="itb-wow ${rateCls}">${ppDelta(curRate, prevRate)}</span>
        </div>
      `;
    }).join('');
    document.getElementById('lifecycleFunnel').innerHTML = `
      <div class="itb-funnel-wrap">
        <div class="itb-funnel-chart">
          <div class="itb-funnel-chart-head" aria-hidden="true"></div>
          ${slices}
        </div>
        <div class="itb-funnel-legend">
          <div class="itb-funnel-row itb-funnel-row-head">
            <span>事件</span>
            <span>商户ID数</span>
            <span>数量变化</span>
            <span>整体</span>
            <span>变化</span>
          </div>
          ${rows}
        </div>
      </div>
    `;
  }

  renderGroups();
  renderFunnel();
  updateFootnote();
  document.getElementById('itbStatDate').addEventListener('change', updateFootnote);
  document.getElementById('itbCaptureBtn').addEventListener('click', capturePage);
})();
