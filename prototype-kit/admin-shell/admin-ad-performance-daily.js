/*
 * BestAds 运营端「广告业绩日报」。
 * 样例对齐 2026-10-26（T-2）那张日报。10/25、10/26 与两张榜单用图中读数；
 * 10/13–10/24 的逐日消耗只按图中走势还原，原图没有逐日数字。
 */
(function () {
  'use strict';

  const root = document.getElementById('page-root');
  if (!root || document.body.dataset.adminPage !== 'ad-performance-daily') return;

  const GENERATED_DATE = '2026-10-28';
  const TOTAL_SPEND = 1424347;
  const PREV_SPEND = 1727143;
  const PROFIT = 38516;
  const RECHARGE = 1580680;
  const NET_RECHARGE = 1156334;

  const customers = [
    { name: 'Lisa', spend: 139659, prev: 194931 },
    { name: 'Alex el filali', spend: 55564, prev: 69094 },
    { name: 'Antoine', spend: 53747, prev: 83895 },
    { name: 'vlacri lenny', spend: 50429, prev: 58221 },
    { name: 'CUONG NGUYEN', spend: 48242, prev: 63297 },
    { name: 'Haroun', spend: 43138, prev: 50890 },
    { name: 'Marc', spend: 43081, prev: 49450 },
    { name: 'Rayan VX', spend: 39440, prev: 52164 },
    { name: 'Lenny', spend: 37873, prev: 48100 },
    { name: 'Lisa Marc', spend: 35777, prev: 50239 },
    { name: 'Wouter Aiska', spend: 30318, prev: 38041 }
  ];

  const trend = [
    { date: '10/13', spend: 1160000, rate: 2.58 },
    { date: '10/14', spend: 1190000, rate: 2.60 },
    { date: '10/15', spend: 1220000, rate: 2.62 },
    { date: '10/16', spend: 1260000, rate: 2.64 },
    { date: '10/17', spend: 1300000, rate: 2.66 },
    { date: '10/18', spend: 1240000, rate: 2.61 },
    { date: '10/19', spend: 1460000, rate: 2.68 },
    { date: '10/20', spend: 1250000, rate: 2.60 },
    { date: '10/21', spend: 1320000, rate: 2.63 },
    { date: '10/22', spend: 1360000, rate: 2.65 },
    { date: '10/23', spend: 1410000, rate: 2.66 },
    { date: '10/24', spend: 1480000, rate: 2.64 },
    { date: '10/25', spend: PREV_SPEND, rate: 2.64 },
    { date: '10/26', spend: TOTAL_SPEND, rate: 2.70 }
  ];

  const compares = [
    { label: '单日 T-2 10/26', current: TOTAL_SPEND, compareLabel: 'T-3 10/25', compare: PREV_SPEND, rate: -17.53 },
    { label: '月累计 10/01-10/26', current: 32026800, compareLabel: '上月同期 09/01-09/26', compare: 25892433, rate: 23.69 },
    { label: '月累计 10/01-10/26', current: 32026800, compareLabel: '上年同月 10/01-10/26', compare: 18791002, rate: 70.44 }
  ];

  const usd = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const usdSigned = (n) => (n > 0 ? '+' : n < 0 ? '-' : '') + usd(Math.abs(n));
  const pctSigned = (n) => (n > 0 ? '+' : '') + n.toFixed(2) + '%';
  const tone = (n) => (n > 0 ? 'apd-up' : n < 0 ? 'apd-down' : '');
  const ratio = (current, prev) => (current - prev) / prev * 100;

  const spendTop = customers
    .filter((item) => item.name !== 'Wouter Aiska')
    .slice()
    .sort((a, b) => b.spend - a.spend);

  const changeTop = customers
    .map((item) => ({ ...item, delta: item.spend - item.prev }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 10);

  const topSum = spendTop.reduce((sum, item) => sum + item.spend, 0);
  const topShare = topSum / TOTAL_SPEND * 100;

  function showToast(message) {
    const existing = document.querySelector('.apd-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'apd-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2400);
  }

  function chartSvg() {
    const width = 760;
    const height = 268;
    const pad = { l: 52, r: 46, t: 16, b: 28 };
    const innerW = width - pad.l - pad.r;
    const innerH = height - pad.t - pad.b;
    const spendMax = 2000000;
    const rateMax = 3.5;
    const xAt = (index) => pad.l + innerW * index / (trend.length - 1);
    const ySpend = (value) => pad.t + innerH * (1 - value / spendMax);
    const yRate = (value) => pad.t + innerH * (1 - value / rateMax);
    const spendLine = trend.map((item, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)},${ySpend(item.spend).toFixed(1)}`).join('');
    const rateLine = trend.map((item, index) => `${index === 0 ? 'M' : 'L'}${xAt(index).toFixed(1)},${yRate(item.rate).toFixed(1)}`).join('');
    const area = `${spendLine} L${xAt(trend.length - 1).toFixed(1)},${(pad.t + innerH).toFixed(1)} L${xAt(0).toFixed(1)},${(pad.t + innerH).toFixed(1)} Z`;
    const grid = [0, 0.5, 1, 1.5, 2].map((million) => {
      const y = ySpend(million * 1000000);
      return `<line x1="${pad.l}" y1="${y}" x2="${width - pad.r}" y2="${y}" stroke="currentColor" stroke-opacity="0.12"></line>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end">$${million.toFixed(1)}M</text>`;
    }).join('');
    const rateTicks = [0, 0.875, 1.75, 2.625, 3.5].map((rate) => {
      const label = rate === 0 ? '0.0%' : rate === 3.5 ? '3.5%' : `${rate.toFixed(1)}%`;
      return `<text x="${width - pad.r + 8}" y="${yRate(rate) + 4}">${label}</text>`;
    }).join('');
    const xLabels = trend.map((item, index) => {
      const day = Number(item.date.slice(3));
      if (day % 2 === 0 && day !== 26) return '';
      return `<text x="${xAt(index)}" y="${height - 8}" text-anchor="middle">${item.date}</text>`;
    }).join('');
    const last = trend[trend.length - 1];
    const lastX = xAt(trend.length - 1);
    const lastY = ySpend(last.spend);
    const dots = trend.map((item, index) => `<circle data-i="${index}" cx="${xAt(index)}" cy="${ySpend(item.spend)}" r="8" fill="transparent"></circle>`).join('');
    return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="近 14 天消耗与利润率">
      ${grid}
      ${rateTicks}
      ${xLabels}
      <path d="${area}" fill="#d92d20" fill-opacity="0.10"></path>
      <path d="${spendLine}" fill="none" stroke="#d92d20" stroke-width="2"></path>
      <path d="${rateLine}" fill="none" stroke="#8b909a" stroke-width="1.5" stroke-dasharray="4 3"></path>
      <circle cx="${lastX}" cy="${lastY}" r="3.5" fill="#d92d20"></circle>
      <text class="end-label" x="${lastX - 8}" y="${lastY - 8}" text-anchor="end">${usd(last.spend)}</text>
      ${dots}
    </svg>`;
  }

  function compareRows() {
    return compares.map((item) => {
      const max = Math.max(item.current, item.compare);
      return `<div class="apd-cmp-row">
        <div class="apd-cmp-label">${item.label}</div>
        <div class="apd-bars">
          <div class="apd-bar-track"><span class="current" style="width:${item.current / max * 100}%"></span></div>
          <div class="apd-bar-track"><span class="prev" style="width:${item.compare / max * 100}%"></span></div>
        </div>
        <div class="apd-cmp-amount">${usd(item.current)}</div>
        <div class="apd-cmp-compare">${item.compareLabel} ${usd(item.compare)}</div>
        <div class="apd-cmp-rate ${tone(item.rate)}">${pctSigned(item.rate)}</div>
      </div>`;
    }).join('');
  }

  function spendRows() {
    return spendTop.map((item, index) => {
      const rate = ratio(item.spend, item.prev);
      return `<tr>
        <td class="rank">${index + 1}</td>
        <td>${item.name}</td>
        <td class="num">${usd(item.spend)}</td>
        <td class="num">${(item.spend / TOTAL_SPEND * 100).toFixed(1)}%</td>
        <td class="num ${tone(rate)}">${pctSigned(rate)}</td>
      </tr>`;
    }).join('');
  }

  function changeRows() {
    return changeTop.map((item, index) => `<tr>
      <td class="rank">${index + 1}</td>
      <td>${item.name}</td>
      <td class="num ${tone(item.delta)}">${usdSigned(item.delta)}</td>
      <td class="num">${usd(item.spend)}</td>
      <td class="num">${usd(item.prev)}</td>
    </tr>`).join('');
  }

  function summaryHtml() {
    const delta = TOTAL_SPEND - PREV_SPEND;
    const movers = customers
      .map((item) => ({ ...item, delta: item.spend - item.prev }))
      .filter((item) => item.delta !== 0 && Math.sign(item.delta) === Math.sign(delta))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
    const drivers = movers.slice(0, 3);
    const direction = delta < 0 ? '减量' : '增量';
    const month = compares[1];
    const year = compares[2];
    const driverText = drivers.map((item) => `${item.name} <span class="${tone(item.delta)}">${usdSigned(item.delta)}</span>`).join('、');
    return `<div class="apd-summary">
      <p><span class="apd-summary-k">大盘</span>${usd(TOTAL_SPEND)}，较 T-3 <span class="${tone(delta)}">${usdSigned(delta)}（${pctSigned(ratio(TOTAL_SPEND, PREV_SPEND))}）</span></p>
      <p><span class="apd-summary-k">${direction}</span>${driverText}</p>
      <p><span class="apd-summary-k">月累计</span>${usd(month.current)}，较上月同期 <span class="${tone(month.rate)}">${pctSigned(month.rate)}</span>，较去年同期 <span class="${tone(year.rate)}">${pctSigned(year.rate)}</span></p>
    </div>`;
  }

  function reportHtml() {
    return `<article class="apd-paper" id="apdCapture">
      <div class="apd-head">
        <div>
          <h1>广告业绩日报</h1>
          <p class="apd-meta">2026-10-26（T-2） · 数据源 Bestads 运营后台 · 金额 USD</p>
        </div>
        <p class="apd-generated">生成 2026-10-28 14:06:32<br>单日基准 10/25</p>
      </div>
      ${summaryHtml()}
      <section class="apd-kpis">
        <article class="apd-kpi">
          <div class="apd-kpi-label">消耗金额</div>
          <div class="apd-kpi-value">${usd(TOTAL_SPEND)}</div>
          <div class="apd-kpi-sub">较 T-3（10/25）<span class="apd-down"> ${pctSigned(ratio(TOTAL_SPEND, PREV_SPEND))}</span></div>
        </article>
        <article class="apd-kpi">
          <div class="apd-kpi-label">广告利润</div>
          <div class="apd-kpi-value">${usd(PROFIT)}</div>
          <div class="apd-kpi-sub">利润率 2.70%</div>
        </article>
        <article class="apd-kpi">
          <div class="apd-kpi-label">广告充值</div>
          <div class="apd-kpi-value">${usd(RECHARGE)}</div>
          <div class="apd-kpi-sub">净充 <span class="apd-up">${usdSigned(NET_RECHARGE)}</span></div>
        </article>
        <article class="apd-kpi">
          <div class="apd-kpi-label">Top10 集中度</div>
          <div class="apd-kpi-value">${topShare.toFixed(1)}%</div>
          <div class="apd-kpi-sub">Top10 合计 ${usd(topSum)}</div>
        </article>
      </section>
      <section class="apd-section">
        <div class="apd-chart-head">
          <div>
            <h2>一、近 14 天：消耗与利润率</h2>
            <p class="apd-hint">红线为消耗（左轴），虚线为利润率（右轴）。</p>
          </div>
          <div class="apd-legend"><span><i></i>消耗</span><span><i class="rate"></i>利润率</span></div>
        </div>
        <div class="apd-chart" id="apdChart">${chartSvg()}<div class="apd-tip" id="apdTip" hidden></div></div>
      </section>
      <section class="apd-section">
        <h2>二、单日与月累计</h2>
        <p class="apd-hint">单日比 T-2 与 T-3。月累计从本月 1 号到 T-2，分别对比上月同期、上年同月同期。</p>
        <div class="apd-cmp">${compareRows()}</div>
        <p class="apd-note">红条为本期，蓝条为对比期。每行按该行较大值缩放，只看涨跌，不跨行比较长短。</p>
      </section>
      <section class="apd-section">
        <h2>三、消耗 Top10</h2>
        <p class="apd-hint">按当日消耗从大到小。环比是对 T-3（10/25）。</p>
        <div class="apd-table-wrap">
          <table class="apd-table">
            <thead><tr><th>#</th><th>客户</th><th class="num">消耗</th><th class="num">占比</th><th class="num">环比</th></tr></thead>
            <tbody>${spendRows()}</tbody>
          </table>
        </div>
      </section>
      <section class="apd-section">
        <h2>四、变化绝对值 Top10</h2>
        <p class="apd-hint">按 |T-2 − T-3| 从大到小，涨跌都计入。</p>
        <div class="apd-table-wrap">
          <table class="apd-table">
            <thead><tr><th>#</th><th>客户</th><th class="num">变化</th><th class="num">T-2 10/26</th><th class="num">T-3 10/25</th></tr></thead>
            <tbody>${changeRows()}</tbody>
          </table>
        </div>
      </section>
    </article>`;
  }

  function emptyHtml(date) {
    return `<article class="apd-paper">
      <div class="apd-empty">
        <p>${date || '未选择日期'} 还没有业绩日报。当前样例是 ${GENERATED_DATE}。</p>
        <button class="btn btn-primary" type="button" id="apdSampleBtn">查看 2026-10-28</button>
      </div>
    </article>`;
  }

  root.classList.add('apd-root');
  root.innerHTML = `<div class="admin-page">
    <div class="apd-toolbar">
      <div class="apd-date-block">
        <div class="filter-field apd-date-field">
          <label for="apdDate">生成日期</label>
          <input id="apdDate" type="date" value="${GENERATED_DATE}">
        </div>
        <p class="apd-date-note">因为消耗数据尚未稳定，报表使用T-2的数据进行统计。</p>
      </div>
      <button class="btn btn-primary" type="button" id="apdCaptureBtn"><i class="fas fa-camera" aria-hidden="true"></i>复制长图</button>
    </div>
    <div id="apdBody"></div>
  </div>`;

  function render() {
    const date = document.getElementById('apdDate').value;
    const body = document.getElementById('apdBody');
    const captureBtn = document.getElementById('apdCaptureBtn');
    if (date === GENERATED_DATE) {
      body.innerHTML = reportHtml();
      captureBtn.hidden = false;
      bindChart();
      return;
    }
    body.innerHTML = emptyHtml(date);
    captureBtn.hidden = true;
    document.getElementById('apdSampleBtn').addEventListener('click', () => {
      document.getElementById('apdDate').value = GENERATED_DATE;
      render();
    });
  }

  function bindChart() {
    const chart = document.getElementById('apdChart');
    const tip = document.getElementById('apdTip');
    chart.querySelectorAll('[data-i]').forEach((node) => {
      node.addEventListener('mouseenter', () => {
        const item = trend[Number(node.dataset.i)];
        tip.hidden = false;
        tip.innerHTML = `<strong>${item.date}</strong><br>消耗 ${usd(item.spend)}<br>利润率 ${item.rate.toFixed(2)}%`;
        const box = chart.getBoundingClientRect();
        const dot = node.getBoundingClientRect();
        tip.style.left = `${dot.left - box.left + 12}px`;
        tip.style.top = `${dot.top - box.top - 8}px`;
      });
      node.addEventListener('mouseleave', () => {
        tip.hidden = true;
      });
    });
  }

  function loadHtml2Canvas() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.onload = () => (window.html2canvas ? resolve(window.html2canvas) : reject(new Error('html2canvas 未加载')));
      script.onerror = () => reject(new Error('截图组件加载失败'));
      document.head.appendChild(script);
    });
  }

  async function capturePage() {
    const target = document.getElementById('apdCapture');
    if (!target) {
      showToast('先打开有数据的日报');
      return;
    }
    const button = document.getElementById('apdCaptureBtn');
    button.disabled = true;
    button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i>截图中';
    try {
      const html2canvas = await loadHtml2Canvas();
      const canvas = await html2canvas(target, {
        backgroundColor: getComputedStyle(target).backgroundColor || '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('生成截图失败'))), 'image/png');
      });
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error('当前浏览器不支持复制图片');
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('已复制长图');
    } catch (error) {
      showToast('复制失败，请检查浏览器剪贴板权限后重试');
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-camera" aria-hidden="true"></i>复制长图';
    }
  }

  document.getElementById('apdDate').addEventListener('change', render);
  document.getElementById('apdCaptureBtn').addEventListener('click', capturePage);
  render();
})();
