#!/usr/bin/env python3
"""UX v0.45: 规则/规则类型文案; 关系列表精简; L2 规则并入时间分段弹窗."""
from pathlib import Path
import re

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
PRD = Path(__file__).resolve().parents[2] / "PRD/V 2.23 介绍人和吐点（第二版）.md"
text = HTML.read_text(encoding="utf-8")

# --- Relations list: drop count columns ---
OLD_HEAD = """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">关系生效期</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">L2 模式摘要</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">L2 时间分段</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">L2 矩阵段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">特殊吐点条数</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">当前状态</th>"""

NEW_HEAD = """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">关系生效期</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">规则类型</th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">当前状态</th>"""

text = text.replace(OLD_HEAD, NEW_HEAD)

def fix_row(row_id, cells_after_period):
    # cells_after_period: rule_type td inner, status td, button unchanged
    pat = rf'(<tr class="relation-row" data-relation-id="{row_id}"[^>]*>.*?</td>\s*<td class="px-4 py-3 whitespace-nowrap text-xs">[^<]+</td>\s*)<td class="px-4 py-3 text-xs" data-l2-mode-summary>[^<]*(?:<[^>]+>[^<]*)?</td>\s*<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>\d+</td>\s*<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>[^<]*</td>\s*<td class="px-4 py-3 text-right tabular-nums">\d+</td>\s*<td class="px-4 py-3[^"]*">'
    repl = r'\1<td class="px-4 py-3 text-xs" data-rule-type-summary>' + cells_after_period
    text_new = re.sub(pat, repl, text, count=1, flags=re.S)
    return text_new

# Simpler line-by-line for mock rows
for rid, rule_cell in [
    ("RB-1", "Q1 介绍人吐点 → Q2 客户基础"),
    ("RB-2", '<span class="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">客户基础吐点</span>'),
    ("RB-3", "Q1 介绍人吐点 → Q2 客户基础"),
]:
    old = f'data-l2-mode-summary>{rule_cell if "<" not in rule_cell else rule_cell}'
    # remove count tds after rule cell - use regex per row
    pass

# Manual row replacements
text = re.sub(
    r'(<tr class="relation-row" data-relation-id="RB-1"[^>]*>.*?<td class="px-4 py-3 whitespace-nowrap text-xs">2026-02-03 ~ <span class="text-gray-500">长期</span></td>\s*)'
    r'<td class="px-4 py-3 text-xs" data-l2-mode-summary>Q1 介绍人吐点 → Q2 客户基础</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>2</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>1</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums">1</td>\s*',
    r'\1<td class="px-4 py-3 text-xs" data-rule-type-summary>Q1 介绍人吐点 → Q2 客户基础</td>\n                          ',
    text, count=1, flags=re.S)

text = re.sub(
    r'(<tr class="relation-row" data-relation-id="RB-2"[^>]*>.*?<td class="px-4 py-3 whitespace-nowrap text-xs">2025-06-01 ~ 2025-12-31</td>\s*)'
    r'<td class="px-4 py-3 text-xs" data-l2-mode-summary><span class="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">客户基础吐点</span></td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>1</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>3</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums">0</td>\s*',
    r'\1<td class="px-4 py-3 text-xs" data-rule-type-summary><span class="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">客户基础吐点</span></td>\n                          ',
    text, count=1, flags=re.S)

text = re.sub(
    r'(<tr class="relation-row" data-relation-id="RB-3"[^>]*>.*?<td class="px-4 py-3 whitespace-nowrap text-xs">2026-01-01 ~ <span class="text-gray-500">长期</span></td>\s*)'
    r'<td class="px-4 py-3 text-xs" data-l2-mode-summary>Q1 介绍人吐点 → Q2 客户基础</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>2</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>2</td>\s*'
    r'<td class="px-4 py-3 text-right tabular-nums">0</td>\s*',
    r'\1<td class="px-4 py-3 text-xs" data-rule-type-summary>Q1 介绍人吐点 → Q2 客户基础</td>\n                          ',
    text, count=1, flags=re.S)

# Remove l2-matrix-section block
MATRIX_SEC = re.compile(
    r'\s*<div id="l2-matrix-section" class="rounded-lg.*?</div>\s*\n\s*<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">\s*\n\s*<div class="mb-3 flex flex-wrap items-center justify-between gap-2">\s*\n\s*<h4 class="font-medium text-gray-900">特殊吐点',
    re.S,
)
text = MATRIX_SEC.sub(
    '\n\n                    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">\n                      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">\n                        <h4 class="font-medium text-gray-900">特殊吐点',
    text,
    count=1,
)

# Update l2 period section UI
text = text.replace(
    """                    <div id="l2-period-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">客户基础吐点 · 时间分段 (L2) <span class="text-xs font-normal text-gray-500">(按自然日解析计价模式)</span></h4>
                        <button type="button" id="btn-l2-period-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增时间分段</button>
                      </div>
                      <p id="l2-period-hint" class="mb-2 text-xs text-amber-800 hidden" role="status"></p>
                      <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-sm">
                          <thead class="bg-gray-50"><tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">计价模式</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                          </tr></thead>
                          <tbody id="tbody-l2-period" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                      <p class="mt-2 text-xs text-gray-500">「使用介绍人吐点」时段走 <strong>L3 介绍人吐点</strong> 矩阵； 「客户基础吐点」时段须在下表配置 <strong>媒体 × 账户类型</strong> 矩阵.</p>
                    </div>""",
    """                    <div id="l2-period-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">客户吐点规则 <span class="text-xs font-normal text-gray-500">(按时间段配置规则类型; 客户基础吐点须设置规则)</span></h4>
                        <button type="button" id="btn-l2-period-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增时间段</button>
                      </div>
                      <p id="l2-period-hint" class="mb-2 text-xs text-amber-800 hidden" role="status"></p>
                      <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-sm">
                          <thead class="bg-gray-50"><tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">规则类型</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                          </tr></thead>
                          <tbody id="tbody-l2-period" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                      <p class="mt-2 text-xs text-gray-500">「使用介绍人吐点」时段沿用介绍人吐点规则； 「客户基础吐点」时段请点击「设置规则」配置该段时间内的媒体×账户类型吐点比例.</p>
                    </div>""",
)

# Insert modal after modal-l2-period
MODAL_RULES = """
  <div id="modal-l2-period-rules" class="modal-shell fixed inset-0 z-[60] hidden items-center justify-center bg-black bg-opacity-40 p-4 modal-backdrop" role="dialog" aria-modal="true">
    <div class="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
      <h3 class="text-lg font-medium text-gray-900">设置客户基础吐点规则</h3>
      <p id="l2-period-rules-subtitle" class="mt-1 text-xs text-gray-500">—</p>
      <div class="mt-4 overflow-x-auto rounded-md border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-50"><tr>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">媒体</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">账户类型</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">吐点比例</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr></thead>
          <tbody id="tbody-l2-period-rules" class="divide-y divide-gray-200"></tbody>
        </table>
      </div>
      <button type="button" id="btn-l2-period-rule-add" class="mt-3 rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100">新增规则</button>
      <div class="mt-6 flex justify-end gap-2">
        <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-close="modal-l2-period-rules">关闭</button>
      </div>
    </div>
  </div>
"""
if "modal-l2-period-rules" not in text:
    text = text.replace(
        '  <div id="modal-base-segment"',
        MODAL_RULES + '\n  <div id="modal-base-segment"',
    )

# Rename store + nested structure
OLD_STORE = """    var customerBaseMatrixStore = {
      'RB-1': [
        { id: 'm1', media: 'Meta', accountType: '企业户', rate: 2.2, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ],
      'RB-2': [
        { id: 'm2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'm2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'm2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ],
      'RB-3': [
        { id: 'm3-1', media: 'Meta', accountType: '企业户', rate: 2.8, start: '2026-04-01', end: '', longterm: true, status: 'enabled' },
        { id: 'm3-2', media: 'TikTok', accountType: '企业户', rate: 2.0, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };"""

NEW_STORE = """    var customerBaseRuleStore = {
      'RB-1': {
        'p2': [
          { id: 'm1', media: 'Meta', accountType: '企业户', rate: 2.2, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
        ]
      },
      'RB-2': {
        'p2b': [
          { id: 'm2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
          { id: 'm2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
          { id: 'm2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
        ]
      },
      'RB-3': {
        'p3b': [
          { id: 'm3-1', media: 'Meta', accountType: '企业户', rate: 2.8, start: '2026-04-01', end: '', longterm: true, status: 'enabled' },
          { id: 'm3-2', media: 'TikTok', accountType: '企业户', rate: 2.0, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
        ]
      }
    };
    var currentL2PeriodId = null;"""

text = text.replace(OLD_STORE, NEW_STORE)
text = text.replace("customerBaseMatrixStore", "customerBaseRuleStore")

# Label replacements (order matters - avoid double replace)
LABELS = [
    ("L3 矩阵段数", "介绍人吐点规则条数"),
    ("L3 介绍人吐点矩阵 (L3)", "介绍人吐点规则"),
    ("介绍人吐点矩阵 (L3)", "介绍人吐点规则"),
    ("维护 L3 矩阵 (媒体 × 账户类型)", "维护介绍人吐点规则 (媒体 × 账户类型)"),
    ("L2 计价模式", "规则类型"),
    ("L2 首段计价模式", "首段规则类型"),
    ("L2 摘要:", "规则类型:"),
    ("relation-l2-summary-label", "relation-rule-type-summary"),
    ("data-l2-mode-summary", "data-rule-type-summary"),
    ("L3 介绍人吐点矩阵分段", "介绍人吐点规则"),
    ("L2 客户基础矩阵分段", "客户基础吐点规则"),
    ("L2 客户基础矩阵", "客户基础吐点规则"),
    ("矩阵分段", "吐点规则"),
    ("新增矩阵分段", "新增规则"),
    ("媒体 × 账户类型 × 时间段", "媒体 × 账户类型 × 时间段 (吐点规则)"),
    ("默认矩阵段数", "介绍人吐点规则条数"),
    ("配置 L2 矩阵", "设置客户基础吐点规则"),
    ("须配置 L2 媒体×账户类型矩阵", "须点击「设置规则」配置客户基础吐点"),
    ("客户基础矩阵", "客户基础吐点规则"),
]
for a, b in LABELS:
    text = text.replace(a, b)

# modal l2 period radios label in HTML already 规则类型 from above

# JS block replacements
JS_NEW_FUNCS = r'''
    function rulesForPeriod(relId, periodId) {
      var byRel = customerBaseRuleStore[relId] || {};
      return byRel[periodId] || [];
    }

    function countRulesForPeriod(relId, periodId) {
      return countEnabledMatrixSegs(rulesForPeriod(relId, periodId));
    }

    function relationRuleTypeSummary(relId) {
      var segs = (customerBasePeriodStore[relId] || []).filter(function (s) { return s.status !== 'disabled'; });
      if (!segs.length) return '未配置';
      var hasIntro = segs.some(function (s) { return s.mode === 'use_introducer'; });
      var hasBase = segs.some(function (s) { return s.mode === 'customer_base'; });
      var pending = segs.some(function (s) {
        return s.mode === 'customer_base' && countRulesForPeriod(relId, s.id) === 0;
      });
      var base = hasIntro && hasBase ? '介绍人吐点 → 客户基础' : (hasBase ? '客户基础吐点' : '介绍人吐点');
      return pending ? base + ' · 待设置规则' : base;
    }

    function renderL2PeriodTable() {
      var relId = currentRelationId || 'RB-1';
      var tb = document.getElementById('tbody-l2-period');
      if (!tb) return;
      var segs = customerBasePeriodStore[relId] || [];
      tb.innerHTML = segs.map(function (seg) {
        var st = seg.status !== 'disabled';
        var badge = seg.mode === 'customer_base'
          ? 'rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800'
          : 'rounded-full bg-sky-100 px-2 py-0.5 text-sky-800';
        var ruleCnt = seg.mode === 'customer_base' ? countRulesForPeriod(relId, seg.id) : null;
        var ruleHint = ruleCnt === 0 ? ' <span class="text-amber-700 text-[10px]">待设置</span>' : (ruleCnt ? ' <span class="text-gray-500 text-[10px]">(' + ruleCnt + '条)</span>' : '');
        var setBtn = seg.mode === 'customer_base'
          ? '<button type="button" class="text-indigo-700 hover:underline btn-l2-period-set-rules" data-period-id="' + escHtml(seg.id) + '">设置规则</button> '
          : '';
        return '<tr data-period-id="' + escHtml(seg.id) + '">' +
          '<td class="px-3 py-2"><span class="' + badge + '">' + escHtml(l2ModeLabel(seg.mode)) + '</span>' + ruleHint + '</td>' +
          '<td class="px-3 py-2 text-gray-600">' + escHtml(formatSegRange(seg)) + '</td>' +
          '<td class="px-3 py-2"><span class="' + (st ? 'text-green-700' : 'text-gray-500') + '">' + (st ? '启用' : '停用') + '</span></td>' +
          '<td class="px-3 py-2 text-right space-x-2">' + setBtn +
          '<button type="button" class="text-blue-600 hover:underline btn-l2-period-edit" data-period-id="' + escHtml(seg.id) + '">编辑</button>' +
          '<button type="button" class="text-red-600 hover:underline btn-l2-period-del" data-period-id="' + escHtml(seg.id) + '">删除</button>' +
          '</td></tr>';
      }).join('');
      var hint = document.getElementById('l2-period-hint');
      if (hint) {
        if (!segs.length) {
          hint.textContent = '暂无时间段, 关系有效期内将尝试走介绍人吐点规则; 建议至少配置一段.';
          hint.classList.remove('hidden');
        } else {
          hint.classList.add('hidden');
        }
      }
    }

    function relationL2Summary(relId) {
      return relationRuleTypeSummary(relId);
    }

    function syncRelationListMeta() {
      document.querySelectorAll('.relation-row').forEach(function (tr) {
        var rid = tr.getAttribute('data-relation-id');
        if (!rid) return;
        var sum = tr.querySelector('[data-rule-type-summary]');
        if (sum) sum.textContent = relationRuleTypeSummary(rid);
      });
    }

    function syncRelationSpitUi() {
      var relId = currentRelationId || 'RB-1';
      renderL2PeriodTable();
      var lab = document.getElementById('relation-rule-type-summary');
      if (lab) lab.textContent = relationRuleTypeSummary(relId);
      syncRelationListMeta();
    }

    function openL2PeriodRulesModal(periodId) {
      currentL2PeriodId = periodId;
      var relId = currentRelationId || 'RB-1';
      var seg = (customerBasePeriodStore[relId] || []).find(function (x) { return x.id === periodId; });
      var sub = document.getElementById('l2-period-rules-subtitle');
      if (sub && seg) {
        sub.textContent = '时间段: ' + formatSegRange(seg) + ' · 规则类型: ' + l2ModeLabel(seg.mode);
      }
      renderMatrixTable('tbody-l2-period-rules', rulesForPeriod(relId, periodId), 'btn-l2-period-rule-edit', 'btn-l2-period-rule-del');
      openModal('modal-l2-period-rules');
    }

    function getMatrixStore() {
      if (matrixEditContext.target === 'l3') {
        if (!currentL3IntroId) currentL3IntroId = 'C-INT-001';
        if (!introducerL3Store[currentL3IntroId]) introducerL3Store[currentL3IntroId] = [];
        return introducerL3Store[currentL3IntroId];
      }
      var relId = currentRelationId || 'RB-2';
      var pid = currentL2PeriodId;
      if (!pid) return [];
      if (!customerBaseRuleStore[relId]) customerBaseRuleStore[relId] = {};
      if (!customerBaseRuleStore[relId][pid]) customerBaseRuleStore[relId][pid] = [];
      return customerBaseRuleStore[relId][pid];
    }
'''

pat = re.compile(
    r"    function renderL2PeriodTable\(\) \{.*?    function getMatrixStore\(\) \{.*?return customerBaseRuleStore\[relId\];\s*\n    \}",
    re.S,
)
m = pat.search(text)
if m:
    text = text[:m.start()] + JS_NEW_FUNCS.strip() + "\n\n" + text[m.end():]
else:
    print("WARN: JS block not patched")

# effectiveForDay - use rulesForPeriod
text = text.replace(
    """      if (period && period.mode === 'customer_base') {
        var mlist = customerBaseRuleStore[relId] || [];
        for (var j = 0; j < mlist.length; j++) {
          if (matrixSegMatchesDay(mlist[j], mt.media, mt.accountType, d)) {""",
    """      if (period && period.mode === 'customer_base') {
        var mlist = rulesForPeriod(relId, period.id);
        for (var j = 0; j < mlist.length; j++) {
          if (matrixSegMatchesDay(mlist[j], mt.media, mt.accountType, d)) {""",
)

# updateRelationDetailFromRow status cell index
text = text.replace(
    "      if (statusEl && cells[9]) {\n        var st = cells[9].textContent.trim();",
    "      if (statusEl && cells[6]) {\n        var st = cells[6].textContent.trim();",
)
text = text.replace(
    "      var lab = document.getElementById('relation-l2-summary-label');",
    "      var lab = document.getElementById('relation-rule-type-summary');",
)

# period save: init rules bucket for customer_base
text = text.replace(
    "        } else {\n          customerBasePeriodStore[relId].push(draft);\n        }\n        closeModal('modal-l2-period');",
    """        } else {
          customerBasePeriodStore[relId].push(draft);
        }
        if (draft.mode === 'customer_base') {
          if (!customerBaseRuleStore[relId]) customerBaseRuleStore[relId] = {};
          if (!customerBaseRuleStore[relId][draft.id]) customerBaseRuleStore[relId][draft.id] = [];
        }
        closeModal('modal-l2-period');""",
)

# add-binding customer_base init
text = text.replace(
    "      if (mode === 'customer_base') {\n        customerBaseRuleStore[newRelId] = [];\n      }",
    """      if (mode === 'customer_base') {
        var perId = customerBasePeriodStore[newRelId][0].id;
        customerBaseRuleStore[newRelId] = {};
        customerBaseRuleStore[newRelId][perId] = [];
      }""",
)

# add-binding row columns
text = text.replace("data-l2-mode-summary>", "data-rule-type-summary>")
text = text.replace("data-l2-period-count>1</td>\n          '<td class=\"px-4 py-3 text-right tabular-nums\" data-l2-matrix-count>", "REMOVE_ME")
# fix add-binding innerHTML - read file after and fix manually if needed

# Remove obsolete btn-l2-matrix handlers block
text = re.sub(
    r"\n    var btnL2OverrideAdd = document\.getElementById\('btn-l2-matrix-add'\);.*?\n    var btnL2Add = document\.getElementById\('btn-l2-matrix-add'\);\n    if \(btnL2Add\) \{\n      btnL2Add\.addEventListener\('click', function \(\) \{ openMatrixSegmentModal\('l2m', null\); \}\);\n    \}\n",
    "\n    var btnL2PeriodRuleAdd = document.getElementById('btn-l2-period-rule-add');\n    if (btnL2PeriodRuleAdd) {\n      btnL2PeriodRuleAdd.addEventListener('click', function () { openMatrixSegmentModal('l2m', null); });\n    }\n",
    text,
)

# viewSpit click: add set-rules, fix matrix edit to period-rules tbody
text = text.replace(
    "        var editL2m = t.closest('.btn-l2-matrix-edit');",
    "        var setRules = t.closest('.btn-l2-period-set-rules');\n        if (setRules) { openL2PeriodRulesModal(setRules.getAttribute('data-period-id')); return; }\n        var editRule = t.closest('.btn-l2-period-rule-edit');\n        if (editRule) { currentL2PeriodId = currentL2PeriodId || (document.getElementById('modal-l2-period-rules') && !document.getElementById('modal-l2-period-rules').classList.contains('hidden') ? currentL2PeriodId : null); openMatrixSegmentModal('l2m', editRule.getAttribute('data-seg-id')); return; }\n        var delRule = t.closest('.btn-l2-period-rule-del');\n        if (delRule) {\n          var rid = delRule.getAttribute('data-seg-id');\n          if (!confirm('删除该规则? (原型)')) return;\n          var relId3 = currentRelationId || 'RB-1';\n          var pid3 = currentL2PeriodId;\n          if (pid3 && customerBaseRuleStore[relId3] && customerBaseRuleStore[relId3][pid3]) {\n            customerBaseRuleStore[relId3][pid3] = customerBaseRuleStore[relId3][pid3].filter(function (x) { return x.id !== rid; });\n          }\n          openL2PeriodRulesModal(pid3);\n          syncRelationSpitUi();\n          renderPreviewGantt();\n          showToast('已删除规则');\n          return;\n        }\n        var editL2m = t.closest('.btn-l2-matrix-edit');",
)

# Also handle clicks inside modal-l2-period-rules - delegate on document or modal
# refreshMatrixViews after l2m save should reopen rules modal if open
old_refresh_tail = """      syncRelationSpitUi();
      renderPreviewGantt();
    }"""
new_refresh_tail = """      syncRelationSpitUi();
      renderPreviewGantt();
      if (currentL2PeriodId) {
        var modalRules = document.getElementById('modal-l2-period-rules');
        if (modalRules && !modalRules.classList.contains('hidden')) {
          openL2PeriodRulesModal(currentL2PeriodId);
        }
      }
    }"""
text = text.replace(old_refresh_tail, new_refresh_tail, 1)

# Delegate period-rules modal clicks
if "modal-l2-period-rules').addEventListener" not in text:
    text = text.replace(
        "    var viewSpit = document.getElementById('relations-view-spit');",
        """    var modalL2Rules = document.getElementById('modal-l2-period-rules');
    if (modalL2Rules) {
      modalL2Rules.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var ed = t.closest('.btn-l2-period-rule-edit');
        if (ed) { openMatrixSegmentModal('l2m', ed.getAttribute('data-seg-id')); return; }
        var dl = t.closest('.btn-l2-period-rule-del');
        if (dl) {
          var rid = dl.getAttribute('data-seg-id');
          if (!confirm('删除该规则? (原型)')) return;
          var relId = currentRelationId || 'RB-1';
          var pid = currentL2PeriodId;
          if (pid && customerBaseRuleStore[relId] && customerBaseRuleStore[relId][pid]) {
            customerBaseRuleStore[relId][pid] = customerBaseRuleStore[relId][pid].filter(function (x) { return x.id !== rid; });
          }
          openL2PeriodRulesModal(pid);
          syncRelationSpitUi();
          renderPreviewGantt();
          showToast('已删除规则');
        }
      });
    }

    var viewSpit = document.getElementById('relations-view-spit');""",
    )

# Remove duplicate editL2m block if still there (btn-l2-matrix-edit)
text = re.sub(
    r"\n        var editL2m = t\.closest\('\.btn-l2-matrix-edit'\);.*?showToast\('已删除 L2 矩阵分段'\);\n          return;\n        \}\n",
    "\n",
    text,
)

OLD_ADD_ROW = """          '<td class="px-4 py-3 text-xs" data-rule-type-summary>' + modeBadge + '</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>1</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>' + (mode === 'customer_base' ? '0' : '—') + '</td>' +
          '<td class="px-4 py-3 text-right tabular-nums">0</td>' +"""
NEW_ADD_ROW = """          '<td class="px-4 py-3 text-xs" data-rule-type-summary>' + modeBadge + '</td>' +"""
if OLD_ADD_ROW in text:
    text = text.replace(OLD_ADD_ROW, NEW_ADD_ROW)
elif "data-l2-period-count" in text:
    text = re.sub(
        r"'<td class=\"px-4 py-3 text-xs\" data-rule-type-summary>' \+ modeBadge \+ '</td>' \+\n\s*'<td class=\"px-4 py-3 text-right tabular-nums\" data-l2-period-count>1</td>' \+\n\s*'<td class=\"px-4 py-3 text-right tabular-nums\" data-l2-matrix-count>[^']*</td>' \+\n\s*'<td class=\"px-4 py-3 text-right tabular-nums\">0</td>' \+",
        "'<td class=\"px-4 py-3 text-xs\" data-rule-type-summary>' + modeBadge + '</td>' +",
        text,
    )

HTML.write_text(text, encoding="utf-8")
print("HTML UX patch OK")
