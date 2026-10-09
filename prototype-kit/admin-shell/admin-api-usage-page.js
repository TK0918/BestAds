/*
 * 运营端报表「API用量统计」。
 * 开通客户数含已停用客户。权限调用次数按客户筛选，不选即全部。
 */
(function () {
  'use strict';

  const root = document.getElementById('page-root');
  if (!root || document.body.dataset.adminPage !== 'api-usage') return;

  const PERMISSIONS = [
    { name: '查账户列表', color: '#1677ff', base: 80 },
    { name: '查账户信息', color: '#13c2c2', base: 52 },
    { name: '发起充值', color: '#52c41a', base: 14 },
    { name: '发起清零', color: '#fa8c16', base: 5 },
    { name: '发起减款', color: '#eb2f96', base: 7 },
    { name: '查单据结果', color: '#722ed1', base: 24 },
    { name: '查消耗', color: '#2f54eb', base: 36 }
  ];

  const CUSTOMERS = [
    { id: '3589', name: 'BestAds接口测试', openedDaysAgo: 18, openedHour: 11, disabledDaysAgo: 1, disabledHour: 9, weight: 4 },
    { id: '4801', name: '内部免开户费', openedDaysAgo: 9, openedHour: 15, weight: 5 },
    { id: '102', name: 'adstest', openedDaysAgo: 6, openedHour: 16, weight: 8 },
    { id: '4770', name: 'Hiroto', openedDaysAgo: 4, openedHour: 9, weight: 4 },
    { id: '3063', name: 'Lucas', openedDaysAgo: 2, openedHour: 8, weight: 6 },
    { id: '4750', name: 'Jad', openedDaysAgo: 0, openedHour: 10, weight: 3 }
  ];

  const hiddenPermissions = new Set();
  let selectedCustomerIds = [];

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatDate(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatHour(date) {
    return `${formatDate(date)} ${pad(date.getHours())}:00`;
  }

  function startOfToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function atDayHour(daysAgo, hour) {
    const date = startOfToday();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(hour, 0, 0, 0);
    return date;
  }

  function defaultRange() {
    const end = startOfToday();
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { start: formatDate(start), end: formatDate(end) };
  }

  function hash(text) {
    let value = 2166136261;
    for (let index = 0; index < text.length; index += 1) {
      value = Math.imul(value ^ text.charCodeAt(index), 16777619);
    }
    return value >>> 0;
  }

  function daysBetween(startText, endText) {
    const start = new Date(`${startText}T00:00:00`);
    const end = new Date(`${endText}T00:00:00`);
    const today = startOfToday();
    const cap = end > today ? today : end;
    const points = [];
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > cap) return points;
    for (let time = new Date(start); time <= cap; time = new Date(time.getFullYear(), time.getMonth(), time.getDate() + 1)) {
      points.push(new Date(time));
    }
    return points;
  }

  function dayEnd(day) {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    if (formatDate(day) === formatDate(now)) return now;
    const end = new Date(day);
    end.setHours(23, 0, 0, 0);
    return end;
  }

  function customerOpen(customer) {
    return atDayHour(customer.openedDaysAgo, customer.openedHour);
  }

  function customerClose(customer) {
    if (customer.disabledDaysAgo == null) return null;
    return atDayHour(customer.disabledDaysAgo, customer.disabledHour);
  }

  function openedCount(day) {
    const end = dayEnd(day);
    return CUSTOMERS.filter(customer => customerOpen(customer) <= end).length;
  }

  function dayCallCount(customer, permission, day) {
    const end = dayEnd(day);
    const start = new Date(day);
    start.setHours(0, 0, 0, 0);
    let total = 0;
    for (let time = new Date(start); time <= end; time = new Date(time.getTime() + 3600000)) {
      total += callCount(customer, permission, time);
    }
    return total;
  }

  function callCount(customer, permission, time) {
    const opened = customerOpen(customer);
    const closed = customerClose(customer);
    if (time < opened) return 0;
    if (closed && time >= closed) return 0;
    const slot = `${customer.id}|${permission.name}|${formatHour(time)}`;
    const wave = hash(slot) % (permission.base + 1);
    return permission.base * customer.weight + wave;
  }

  function selectedCustomers() {
    if (!selectedCustomerIds.length) return CUSTOMERS;
    const picked = new Set(selectedCustomerIds);
    return CUSTOMERS.filter(customer => picked.has(customer.id));
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function niceMax(value) {
    if (value <= 0) return 4;
    const power = 10 ** Math.floor(Math.log10(value));
    const unit = value / power;
    const step = unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10;
    return step * power;
  }

  function chartSvg(labels, series) {
    const width = 960;
    const height = 360;
    const pad = { left: 56, right: 16, top: 16, bottom: 36 };
    const innerWidth = width - pad.left - pad.right;
    const innerHeight = height - pad.top - pad.bottom;
    const visible = series.filter(item => item.values.some(value => value != null));
    const max = niceMax(Math.max(0, ...visible.flatMap(item => item.values)));
    const ticks = [0, 1, 2, 3, 4].map(index => Math.round(max * index / 4));
    const xAt = index => pad.left + (labels.length <= 1 ? innerWidth / 2 : innerWidth * index / (labels.length - 1));
    const yAt = value => pad.top + innerHeight - (innerHeight * value / max);
    const step = labels.length > 31 ? 7 : labels.length > 14 ? 2 : 1;
    const grid = ticks.map(tick => {
      const y = yAt(tick);
      return `<line class="grid" x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}"></line><text class="axis" x="${pad.left - 8}" y="${y + 4}" text-anchor="end">${tick}</text>`;
    }).join('');
    const axis = labels.map((label, index) => {
      if (index % step !== 0 && index !== labels.length - 1) return '';
      return `<text class="axis" x="${xAt(index)}" y="${height - 12}" text-anchor="middle">${esc(label)}</text>`;
    }).join('');
    const lines = visible.map(item => {
      const points = item.values.map((value, index) => `${xAt(index)},${yAt(value)}`).join(' ');
      const dots = item.values.map((value, index) => `<circle cx="${xAt(index)}" cy="${yAt(value)}" r="3.5" fill="${item.color}"></circle>`).join('');
      return `<polyline fill="none" stroke="${item.color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" points="${points}"></polyline>${dots}`;
    }).join('');
    return `<svg viewBox="0 0 ${width} ${height}" role="img">${grid}${lines}${axis}</svg>`;
  }

  function bindPlot(plot, labels, series, title) {
    const tooltip = plot.querySelector('.api-usage-tooltip');
    const svg = plot.querySelector('svg');
    if (!svg) return;
    plot.onmousemove = event => {
      const rect = svg.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const index = Math.round(ratio * (labels.length - 1));
      const rows = series.map(item => `<div><span style="color:${item.color}">●</span> ${esc(item.name)} ${item.values[index]}</div>`).join('');
      tooltip.innerHTML = `<b>${esc(title)}</b><b>${esc(labels[index])}</b>${rows}`;
      tooltip.style.display = 'block';
      const left = event.clientX - plot.getBoundingClientRect().left + 12;
      tooltip.style.left = `${Math.min(left, plot.clientWidth - 180)}px`;
      tooltip.style.top = '12px';
    };
    plot.onmouseleave = () => { tooltip.style.display = 'none'; };
  }

  function renderCustomerChart(days) {
    const plot = document.getElementById('apiUsageCustomerPlot');
    if (!days.length) {
      plot.innerHTML = '<div class="api-usage-empty">请选择有效的时间范围</div>';
      return;
    }
    const labels = days.map(day => formatDate(day).slice(5));
    const series = [{ name: '开通客户数', color: '#1677ff', values: days.map(openedCount) }];
    plot.innerHTML = `${chartSvg(labels, series)}<div class="api-usage-tooltip"></div>`;
    bindPlot(plot, labels, series, '开通 API 的客户数');
  }

  function renderPermissionChart(days) {
    const plot = document.getElementById('apiUsagePermissionPlot');
    const legend = document.getElementById('apiUsageLegend');
    legend.innerHTML = PERMISSIONS.map(permission => `
      <button type="button" data-permission="${esc(permission.name)}" class="${hiddenPermissions.has(permission.name) ? 'is-off' : ''}">
        <i style="background:${permission.color}"></i>${esc(permission.name)}
      </button>
    `).join('');
    if (!days.length) {
      plot.innerHTML = '<div class="api-usage-empty">请选择有效的时间范围</div>';
      return;
    }
    const customers = selectedCustomers();
    const labels = days.map(day => formatDate(day).slice(5));
    const series = PERMISSIONS.filter(permission => !hiddenPermissions.has(permission.name)).map(permission => ({
      name: permission.name,
      color: permission.color,
      values: days.map(day => customers.reduce((sum, customer) => sum + dayCallCount(customer, permission, day), 0))
    }));
    plot.innerHTML = series.length
      ? `${chartSvg(labels, series)}<div class="api-usage-tooltip"></div>`
      : '<div class="api-usage-empty">请至少展示一条权限曲线</div>';
    if (series.length) bindPlot(plot, labels, series, '权限调用次数');
  }

  function currentRange() {
    return {
      start: document.getElementById('apiUsageStart').value,
      end: document.getElementById('apiUsageEnd').value
    };
  }

  function renderCharts() {
    const range = currentRange();
    const days = daysBetween(range.start, range.end);
    renderCustomerChart(days);
    renderPermissionChart(days);
    const now = new Date();
    now.setMinutes(0, 0, 0);
    document.getElementById('apiUsageUpdated').textContent = `图表按天展示。数据每小时更新一次，当天统计到当前小时，最近更新 ${formatHour(now)}。`;
  }

  function customerLabel() {
    if (!selectedCustomerIds.length) return '全部客户';
    return CUSTOMERS.filter(customer => selectedCustomerIds.includes(customer.id)).map(customer => customer.name).join('、');
  }

  const range = defaultRange();
  root.innerHTML = `
    <div class="admin-page api-usage-page">
      <section class="admin-card">
        <div class="admin-card__body">
          <div class="filter-grid">
            <div class="filter-field"><label for="apiUsageStart">开始日期</label><input id="apiUsageStart" type="date" value="${range.start}"></div>
            <div class="filter-field"><label for="apiUsageEnd">结束日期</label><input id="apiUsageEnd" type="date" value="${range.end}"></div>
            <div class="filter-actions">
              <button class="btn btn-primary" type="button" id="apiUsageSearch">查询</button>
              <button class="btn btn-default" type="button" id="apiUsageReset">重置</button>
            </div>
          </div>
          <p class="api-usage-note" id="apiUsageUpdated"></p>
        </div>
      </section>
      <section class="admin-card api-usage-card">
        <div class="admin-card__header"><h2 class="admin-card__title">开通 API 的客户数</h2></div>
        <div class="admin-card__body">
          <p class="api-usage-hint">按天累计。已停用的客户仍计入开通数。</p>
          <div class="api-usage-plot" id="apiUsageCustomerPlot"></div>
        </div>
      </section>
      <section class="admin-card api-usage-card">
        <div class="admin-card__header">
          <h2 class="admin-card__title">权限调用次数</h2>
          <div class="api-usage-card__tools">
            <div class="filter-field filter-field--multi" id="apiUsageCustomers">
              <button type="button" class="multi-select-trigger" data-customer-toggle><span id="apiUsageCustomerLabel">全部客户</span><i class="fas fa-chevron-down"></i></button>
              <div class="multi-select-menu">
                ${CUSTOMERS.map(customer => `<label class="multi-select-option"><input type="checkbox" value="${esc(customer.id)}"><span>${esc(customer.id)} ${esc(customer.name)}</span></label>`).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="admin-card__body">
          <p class="api-usage-hint">每条曲线对应一个权限。点击图例可显示或隐藏。不选客户时统计全部客户。</p>
          <div class="api-usage-legend" id="apiUsageLegend"></div>
          <div class="api-usage-plot" id="apiUsagePermissionPlot"></div>
        </div>
      </section>
    </div>
  `;

  document.getElementById('apiUsageSearch').addEventListener('click', renderCharts);
  document.getElementById('apiUsageReset').addEventListener('click', () => {
    const next = defaultRange();
    document.getElementById('apiUsageStart').value = next.start;
    document.getElementById('apiUsageEnd').value = next.end;
    selectedCustomerIds = [];
    document.querySelectorAll('#apiUsageCustomers input').forEach(input => { input.checked = false; });
    document.getElementById('apiUsageCustomerLabel').textContent = '全部客户';
    hiddenPermissions.clear();
    renderCharts();
  });
  document.getElementById('apiUsageLegend').addEventListener('click', event => {
    const button = event.target.closest('[data-permission]');
    if (!button) return;
    const name = button.dataset.permission;
    if (hiddenPermissions.has(name)) hiddenPermissions.delete(name);
    else hiddenPermissions.add(name);
    renderPermissionChart(daysBetween(currentRange().start, currentRange().end));
  });
  document.querySelector('[data-customer-toggle]').addEventListener('click', () => {
    document.getElementById('apiUsageCustomers').classList.toggle('is-open');
  });
  document.getElementById('apiUsageCustomers').addEventListener('change', () => {
    selectedCustomerIds = Array.from(document.querySelectorAll('#apiUsageCustomers input:checked')).map(input => input.value);
    document.getElementById('apiUsageCustomerLabel').textContent = customerLabel();
    renderPermissionChart(daysBetween(currentRange().start, currentRange().end));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#apiUsageCustomers')) document.getElementById('apiUsageCustomers').classList.remove('is-open');
  });
  window.addEventListener('resize', renderCharts);
  renderCharts();
})();
