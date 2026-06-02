#!/usr/bin/env python3
"""Finish v0.4 HTML fixes: remove duplicate store, fix JS syntax, scheme->mode."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
text = HTML.read_text(encoding="utf-8")

# 1) Remove duplicate customerBaseMatrixStore (second declaration overwrites RB-1)
DUP = """    var l2PeriodEditId = null;
    var customerBaseMatrixStore = {
      'RB-2': [
        { id: 'l2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ],
      'RB-3': [
        { id: 'l2-31', media: 'Meta', accountType: '企业户', rate: 2.8, start: '2026-04-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-32', media: 'TikTok', accountType: '企业户', rate: 2.0, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };
    var currentL3IntroId = null;
    var currentRelationScheme = 'inherit';"""
if DUP in text:
    text = text.replace(DUP, """    var l2PeriodEditId = null;
    var currentL3IntroId = null;""")

# 2) Remove orphaned getMatrixStore fragment
ORPHAN = """

      if (matrixEditContext.target === 'l3') {
        if (!currentL3IntroId) currentL3IntroId = 'C-INT-001';
        if (!introducerL3Store[currentL3IntroId]) introducerL3Store[currentL3IntroId] = [];
        return introducerL3Store[currentL3IntroId];
      }
      var relId = currentRelationId || 'RB-2';
      if (matrixEditContext.target === 'l2m') {
        if (!customerBaseMatrixStore[relId]) customerBaseMatrixStore[relId] = [];
        return customerBaseMatrixStore[relId];
      }
      if (!customerBaseMatrixStore[relId]) customerBaseMatrixStore[relId] = [];
      return customerBaseMatrixStore[relId];
    }

    function openMatrixSegmentModal"""
text = text.replace(ORPHAN, "\n\n    function openMatrixSegmentModal")

# 3) syncRelationSpitUi label id
text = text.replace(
    "var lab = document.getElementById('relation-spit-scheme-label');",
    "var lab = document.getElementById('relation-l2-summary-label');",
)
text = text.replace(
    '吐点方案: <span id="relation-spit-scheme-label"',
    'L2 摘要: <span id="relation-l2-summary-label"',
)

# 4) openMatrixSegmentModal - unify l2/l2m target
text = text.replace(
    "if (title) title.textContent = target === 'l3' ? 'L3 介绍人吐点分段' : (target === 'l2m' ? 'L2-Override 客户基础分段' : 'L2 客户基础矩阵分段');",
    "if (title) title.textContent = target === 'l3' ? 'L3 介绍人吐点矩阵分段' : 'L2 客户基础矩阵分段';",
)

# 5) openL2PeriodModal mode
text = text.replace(
    """      var schemeVal = seg ? seg.scheme : 'inherit';
      radios.forEach(function (r) { r.checked = r.value === schemeVal; });""",
    """      var modeVal = seg ? seg.mode : 'use_introducer';
      radios.forEach(function (r) { r.checked = r.value === modeVal; });""",
)

# 6) l2-period-save
text = text.replace(
    """        var scheme = typeEl ? typeEl.value : 'inherit';
        var start = document.getElementById('l2-period-start').value;
        var longterm = document.getElementById('l2-period-longterm').checked;
        var end = longterm ? '' : document.getElementById('l2-period-end').value;
        var status = document.getElementById('l2-period-status').value === 'disabled' ? 'disabled' : 'enabled';
        if (!start) { showToast('请填写生效开始', 'error'); return; }
        if (!longterm && !end) { showToast('非长期须填写结束日', 'error'); return; }
        var draft = { id: l2PeriodEditId || uid('sch'), scheme: scheme, start: start, end: end, longterm: longterm, status: status };""",
    """        var mode = typeEl ? typeEl.value : 'use_introducer';
        var start = document.getElementById('l2-period-start').value;
        var longterm = document.getElementById('l2-period-longterm').checked;
        var end = longterm ? '' : document.getElementById('l2-period-end').value;
        var status = document.getElementById('l2-period-status').value === 'disabled' ? 'disabled' : 'enabled';
        if (!start) { showToast('请填写生效开始', 'error'); return; }
        if (!longterm && !end) { showToast('非长期须填写结束日', 'error'); return; }
        var draft = { id: l2PeriodEditId || uid('per'), mode: mode, start: start, end: end, longterm: longterm, status: status };""",
)
text = text.replace("showToast('吐点方案生效段已保存');", "showToast('L2 时间分段已保存');")

# 7) preview legend + bar color
text = text.replace(
    """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l3 + '"></span>特殊吐点 (L3)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2 + '"></span>客户基础 (L2-Full)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2o + '"></span>客户基础 (L2-Override)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l1 + '"></span>介绍人吐点 (L1)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';""",
    """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l1 + '"></span>特殊吐点 (L1)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2 + '"></span>客户基础 (L2)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l3 + '"></span>介绍人吐点 (L3)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';""",
)
text = text.replace(
    "var col = bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l2m' ? PREVIEW_COLORS.l2o : (bar.eff.type === 'l3' ? PREVIEW_COLORS.l1 : PREVIEW_COLORS.none)));",
    "var col = bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : PREVIEW_COLORS.none));",
)

# 8) period edit/delete handlers
text = text.replace(
    "if (editSch) { openL2PeriodModal(editSch.getAttribute('data-scheme-id')); return; }",
    "if (editSch) { openL2PeriodModal(editSch.getAttribute('data-period-id')); return; }",
)
text = text.replace(
    "var sid = delSch.getAttribute('data-scheme-id');",
    "var sid = delSch.getAttribute('data-period-id');",
)
text = text.replace("if (!confirm('删除该方案生效段? (原型)'))", "if (!confirm('删除该 L2 时间分段? (原型)'))")
text = text.replace("showToast('已删除方案段');", "showToast('已删除 L2 时间分段');")

# 9) matrix handlers - use l2m only, remove duplicate l2 block
OLD_CLICK = """        var editOv = t.closest('.btn-l2-matrix-edit');
        if (editOv) { openMatrixSegmentModal('l2m', editOv.getAttribute('data-seg-id')); return; }
        var delOv = t.closest('.btn-l2-matrix-del');
        if (delOv) {
          var oid = delOv.getAttribute('data-seg-id');
          if (!confirm('删除该调价分段? (原型)')) return;
          var relId2 = currentRelationId || 'RB-1';
          customerBaseMatrixStore[relId2] = (customerBaseMatrixStore[relId2] || []).filter(function (x) { return x.id !== oid; });
          syncRelationSpitUi();
          renderPreviewGantt();
          showToast('已删除调价分段');
          return;
        }
        var editL2 = t.closest('.btn-l2-matrix-edit');
        if (editL2) {
          openMatrixSegmentModal('l2', editL2.getAttribute('data-seg-id'));
          return;
        }
        var delL2 = t.closest('.btn-l2-matrix-del');
        if (delL2) {
          var sid = delL2.getAttribute('data-seg-id');
          if (!confirm('删除该 L2 矩阵分段? (原型)')) return;
          var relId = currentRelationId || 'RB-2';
          customerBaseMatrixStore[relId] = (customerBaseMatrixStore[relId] || []).filter(function (x) { return x.id !== sid; });
          refreshMatrixViews();
          showToast('已删除 L2 分段');
          return;
        }"""
NEW_CLICK = """        var editL2m = t.closest('.btn-l2-matrix-edit');
        if (editL2m) { openMatrixSegmentModal('l2m', editL2m.getAttribute('data-seg-id')); return; }
        var delL2m = t.closest('.btn-l2-matrix-del');
        if (delL2m) {
          var oid = delL2m.getAttribute('data-seg-id');
          if (!confirm('删除该 L2 矩阵分段? (原型)')) return;
          var relId2 = currentRelationId || 'RB-1';
          customerBaseMatrixStore[relId2] = (customerBaseMatrixStore[relId2] || []).filter(function (x) { return x.id !== oid; });
          syncRelationSpitUi();
          renderPreviewGantt();
          showToast('已删除 L2 矩阵分段');
          return;
        }"""
text = text.replace(OLD_CLICK, NEW_CLICK)

# 10) btn l2 matrix - only l2m
text = text.replace(
    "if (btnL2Add) {\n      btnL2Add.addEventListener('click', function () { openMatrixSegmentModal('l2', null); });\n    }",
    "if (btnL2Add) {\n      btnL2Add.addEventListener('click', function () { openMatrixSegmentModal('l2m', null); });\n    }",
)

# 11) base seg save prefix
text = text.replace(
    "var prefix = tgt === 'l3' ? 'l3' : (tgt === 'l2m' ? 'l2m' : 'l2');",
    "var prefix = tgt === 'l3' ? 'l3' : 'l2m';",
)
text = text.replace(
    "showToast((tgt === 'l3' ? 'L3 介绍人吐点' : (tgt === 'l2m' ? 'L2 客户基础' : 'L2 客户基础矩阵')) + '分段已保存');",
    "showToast((tgt === 'l3' ? 'L3 介绍人吐点' : 'L2 客户基础矩阵') + '分段已保存');",
)

# 12) L3 view delete message
text = text.replace("if (!currentL3IntroId || !confirm('删除该 L1 矩阵分段? (原型)'))", "if (!currentL3IntroId || !confirm('删除该 L3 矩阵分段? (原型)'))")
text = text.replace("showToast('已删除 L1 分段');", "showToast('已删除 L3 矩阵分段');")

# 13) add-binding-save
OLD_ADD = """      customerBasePeriodStore[newRelId] = [
        { id: uid('sch'), scheme: scheme, start: start, end: '', longterm: true, status: 'enabled' }
      ];
      if (scheme === 'independent') {
        customerBaseMatrixStore[newRelId] = [];
      }
      var tbody = document.getElementById('tbody-relations');
      if (tbody) {
        var schemeBadge = scheme === 'independent'
          ? '<span class="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">客户基础</span>'
          : '<span class="rounded-full bg-gray-100 px-2 py-0.5 text-gray-800">继承</span>';
        var row = document.createElement('tr');
        row.className = 'relation-row';
        row.setAttribute('data-relation-id', newRelId);
        row.setAttribute('data-spit-scheme', scheme);
        row.setAttribute('data-intro-merchant', introSel ? introSel.value : 'C-INT-001');
        row.setAttribute('data-intro-disabled', 'false');
        row.innerHTML =
          '<td class="px-4 py-3 font-mono text-xs">' + escHtml(introSel ? introSel.value : 'C-INT-001') + '</td>' +
          '<td class="px-4 py-3">—</td>' +
          '<td class="px-4 py-3 font-mono text-xs">' + escHtml(custId) + '</td>' +
          '<td class="px-4 py-3">—</td>' +
          '<td class="px-4 py-3 whitespace-nowrap text-xs">' + escHtml(start) + ' ~ <span class="text-gray-500">长期</span></td>' +
          '<td class="px-4 py-3 text-xs" data-scheme-summary>' + schemeBadge + '</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-scheme-count>1</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-override-count>0</td>' +
          '<td class="px-4 py-3 text-right tabular-nums text-gray-400" data-l2-full-count>—</td>' +
          '<td class="px-4 py-3 text-right tabular-nums">0</td>' +
          '<td class="px-4 py-3 text-green-700 text-xs">生效中</td>' +
          '<td class="px-4 py-3 whitespace-nowrap">' +
          '<button type="button" class="btn-open-spit-rules rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">吐点规则</button></td>';
        tbody.insertBefore(row, tbody.firstChild);
      }
      closeModal('modal-add-binding');
      syncRelationListMeta();
      showToast('已保存关系并创建首段吐点方案 (原型); 可点击「吐点规则」继续配置');"""

NEW_ADD = """      customerBasePeriodStore[newRelId] = [
        { id: uid('per'), mode: mode, start: start, end: '', longterm: true, status: 'enabled' }
      ];
      if (mode === 'customer_base') {
        customerBaseMatrixStore[newRelId] = [];
      }
      var tbody = document.getElementById('tbody-relations');
      if (tbody) {
        var modeBadge = mode === 'customer_base'
          ? '<span class="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">客户基础吐点</span>'
          : '<span class="rounded-full bg-sky-100 px-2 py-0.5 text-sky-800">使用介绍人吐点</span>';
        var row = document.createElement('tr');
        row.className = 'relation-row';
        row.setAttribute('data-relation-id', newRelId);
        row.setAttribute('data-l2-mode', mode);
        row.setAttribute('data-intro-merchant', introSel ? introSel.value : 'C-INT-001');
        row.setAttribute('data-intro-disabled', 'false');
        row.innerHTML =
          '<td class="px-4 py-3 font-mono text-xs">' + escHtml(introSel ? introSel.value : 'C-INT-001') + '</td>' +
          '<td class="px-4 py-3">—</td>' +
          '<td class="px-4 py-3 font-mono text-xs">' + escHtml(custId) + '</td>' +
          '<td class="px-4 py-3">—</td>' +
          '<td class="px-4 py-3 whitespace-nowrap text-xs">' + escHtml(start) + ' ~ <span class="text-gray-500">长期</span></td>' +
          '<td class="px-4 py-3 text-xs" data-l2-mode-summary>' + modeBadge + '</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>1</td>' +
          '<td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>' + (mode === 'customer_base' ? '0' : '—') + '</td>' +
          '<td class="px-4 py-3 text-right tabular-nums">0</td>' +
          '<td class="px-4 py-3 text-green-700 text-xs">生效中</td>' +
          '<td class="px-4 py-3 whitespace-nowrap">' +
          '<button type="button" class="btn-open-spit-rules rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">吐点规则</button></td>';
        tbody.insertBefore(row, tbody.firstChild);
      }
      closeModal('modal-add-binding');
      syncRelationListMeta();
      showToast('已保存关系并创建首段 L2 时间分段 (原型); 可点击「吐点规则」继续配置');"""
text = text.replace(OLD_ADD, NEW_ADD)

# 14) HTML copy fixes
repls = [
    ("运营维护介绍人身份与客户端可见性; 行内「介绍人吐点」维护 L1", "运营维护介绍人身份与客户端可见性; 行内「介绍人吐点」维护 L3 矩阵 (媒体 × 账户类型)"),
    ("当前: 介绍人吐点 (L1) ·", "当前: 介绍人吐点 (L3) ·"),
    ("介绍人吐点吐点矩阵", "介绍人吐点矩阵 (L3)"),
    ("关系列表点击「吐点规则」进入 L2-Full(可选)、特殊吐点 L3 与生效预览", "关系列表点击「吐点规则」配置 L2 客户基础时间分段/矩阵、L1 特殊吐点与生效预览"),
    ('data-spit-scheme="inherit"', 'data-l2-mode="mixed"'),
    ('data-spit-scheme="independent"', 'data-l2-mode="customer_base"'),
    ("须选择吐点方案; 选「客户基础方案」保存后须配置 L2-Full.", "须选择 L2 首段计价模式; 选「客户基础吐点」保存后须配置 L2 矩阵."),
    ("<span class=\"block font-medium text-gray-700 mb-2\">吐点方案</span>", "<span class=\"block font-medium text-gray-700 mb-2\">L2 首段计价模式</span>"),
    ("新增特殊吐点吐点", "新增特殊吐点"),
    ("特殊吐点吐点分段 (L3)", "特殊吐点分段 (L1)"),
    ("该账户暂无 L3 分段", "该账户暂无 L1 分段"),
    ("该账户已有特殊吐点吐点", "该账户已有特殊吐点"),
    ("(当前无未配置特殊吐点吐点的账户)", "(当前无未配置特殊吐点的账户)"),
    ("特殊吐点吐点已保存", "特殊吐点已保存"),
    ("/* --- V2.23: L3 介绍人吐点 / 关系吐点方案 --- */", "/* --- V2.23 v0.4: L3 介绍人吐点 / L2 客户基础 / L1 特殊 --- */"),
    ("默认矩阵段数", "L3 矩阵段数"),
]
for a, b in repls:
    text = text.replace(a, b)

HTML.write_text(text, encoding="utf-8")
print("finish OK")
