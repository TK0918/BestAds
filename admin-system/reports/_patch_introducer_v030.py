#!/usr/bin/env python3
"""Patch introducer-spitpoint.html for PRD V2.23 v0.3 (scheme segments + L2-Override)."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
text = HTML.read_text(encoding="utf-8")

# --- HTML: relation list header columns ---
text = text.replace(
    """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">吐点方案</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">独立矩阵段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">账户特殊条数</th>""",
    """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">当前吐点方案</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">方案段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">调价段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">独立矩阵段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">账户特殊条数</th>""",
)

text = text.replace(
    """                        <tr class="relation-row" data-relation-id="RB-1" data-spit-scheme="inherit" data-intro-merchant="C-INT-001" data-intro-disabled="false">
                          <td class="px-4 py-3 font-mono text-xs">C-INT-001</td>
                          <td class="px-4 py-3">示例客户 A</td>
                          <td class="px-4 py-3 font-mono text-xs">C-002</td>
                          <td class="px-4 py-3">客户 B</td>
                          <td class="px-4 py-3 whitespace-nowrap text-xs">2026-02-03 ~ <span class="text-gray-500">长期</span></td>
                          <td class="px-4 py-3 text-xs"><span class="rounded-full bg-gray-100 px-2 py-0.5 text-gray-800">继承介绍人默认</span></td>
                          <td class="px-4 py-3 text-right tabular-nums text-gray-400">—</td>
                          <td class="px-4 py-3 text-right tabular-nums">1</td>""",
    """                        <tr class="relation-row" data-relation-id="RB-1" data-spit-scheme="inherit" data-intro-merchant="C-INT-001" data-intro-disabled="false">
                          <td class="px-4 py-3 font-mono text-xs">C-INT-001</td>
                          <td class="px-4 py-3">示例客户 A</td>
                          <td class="px-4 py-3 font-mono text-xs">C-002</td>
                          <td class="px-4 py-3">客户 B</td>
                          <td class="px-4 py-3 whitespace-nowrap text-xs">2026-02-03 ~ <span class="text-gray-500">长期</span></td>
                          <td class="px-4 py-3 text-xs" data-scheme-summary>继承 (Q2 起客户调价)</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums text-gray-400">—</td>
                          <td class="px-4 py-3 text-right tabular-nums">1</td>""",
)

text = text.replace(
    """                          <td class="px-4 py-3 text-xs"><span class="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">客户独立方案</span></td>
                          <td class="px-4 py-3 text-right tabular-nums">3</td>
                          <td class="px-4 py-3 text-right tabular-nums">0</td>""",
    """                          <td class="px-4 py-3 text-xs" data-scheme-summary><span class="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">客户独立</span></td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>0</td>
                          <td class="px-4 py-3 text-right tabular-nums">3</td>
                          <td class="px-4 py-3 text-right tabular-nums">0</td>""",
)

# Add RB-3 demo row: Q1 inherit -> Q2 independent
RB3_ROW = """
                        <tr class="relation-row" data-relation-id="RB-3" data-spit-scheme="inherit" data-intro-merchant="C-INT-001" data-intro-disabled="false">
                          <td class="px-4 py-3 font-mono text-xs">C-INT-001</td>
                          <td class="px-4 py-3">示例客户 A</td>
                          <td class="px-4 py-3 font-mono text-xs">C-010</td>
                          <td class="px-4 py-3">客户 J</td>
                          <td class="px-4 py-3 whitespace-nowrap text-xs">2026-01-01 ~ <span class="text-gray-500">长期</span></td>
                          <td class="px-4 py-3 text-xs" data-scheme-summary>继承 → 独立 (Q2)</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>2</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>0</td>
                          <td class="px-4 py-3 text-right tabular-nums">2</td>
                          <td class="px-4 py-3 text-right tabular-nums">0</td>
                          <td class="px-4 py-3 text-green-700 text-xs">生效中</td>
                          <td class="px-4 py-3 whitespace-nowrap">
                            <button type="button" class="btn-open-spit-rules rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">吐点规则</button>
                          </td>
                        </tr>"""
if "data-relation-id=\"RB-3\"" not in text:
    text = text.replace(
        "                      </tbody>\n                    </table>\n                  </div>\n                  <p class=\"px-4 py-2 text-xs text-gray-500 border-t border-gray-100\">同一客户被多个介绍人介绍时",
        RB3_ROW + "\n                      </tbody>\n                    </table>\n                  </div>\n                  <p class=\"px-4 py-2 text-xs text-gray-500 border-t border-gray-100\">同一客户被多个介绍人介绍时",
    )

text = text.replace(
    "当前: 吐点规则 (客户独立矩阵 · 账户特殊吐点 · 生效预览)",
    "当前: 吐点规则 (方案生效段 · L2-Override / L2-Full · L3 · 生效预览)",
)

SCHEME_AND_OVERRIDE_HTML = """
                    <div id="scheme-segment-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">吐点方案生效段 <span class="text-xs font-normal text-gray-500">(v0.3 按自然日解析继承 / 客户独立)</span></h4>
                        <button type="button" id="btn-scheme-segment-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增方案段</button>
                      </div>
                      <p id="scheme-seg-hint" class="mb-2 text-xs text-amber-800 hidden" role="status"></p>
                      <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-sm">
                          <thead class="bg-gray-50"><tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">吐点方案</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                          </tr></thead>
                          <tbody id="tbody-scheme-segment" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                    </div>

                    <div id="l2-override-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hidden">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">客户调价矩阵 (L2-Override) <span class="text-xs font-normal text-gray-500">(继承方案日覆盖 L1; 如 Q2 仅对客户调价)</span></h4>
                        <button type="button" id="btn-l2-override-add" class="rounded-md bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 hover:bg-teal-100">新增调价分段</button>
                      </div>
                      <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-sm">
                          <thead class="bg-gray-50"><tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">媒体</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">账户类型</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">吐点比例</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                          </tr></thead>
                          <tbody id="tbody-l2-override" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                    </div>
"""

if "tbody-scheme-segment" not in text:
    text = text.replace(
        '                    <div id="l2-full-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hidden">',
        SCHEME_AND_OVERRIDE_HTML + '\n                    <div id="l2-full-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hidden">',
    )

text = text.replace(
    """                    <div id="l2-inherit-hint" class="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
                      当前关系为「继承介绍人默认」, 结算按介绍人 L1 默认矩阵匹配, 无需在此配置 L2-Full.
                    </div>""",
    """                    <div id="l2-inherit-hint" class="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900 hidden">
                      存在「继承」方案生效段: 默认走介绍人 L1; 若需仅对本客户调价 (如 Q2), 请配置上方 <strong>L2-Override</strong>, 无需切换为独立方案.
                    </div>""",
)

text = text.replace(
    "(按季度时间轴; L3 &gt; L2-Full &gt; L1 &gt; 无规则)",
    "(按季度时间轴; L3 &gt; 按日方案 &gt; L2-Full / L2-Override &gt; L1 &gt; 无规则)",
)

MODAL_SCHEME = """
  <div id="modal-scheme-segment" class="modal-shell fixed inset-0 z-[60] hidden items-center justify-center bg-black bg-opacity-40 p-4 modal-backdrop" role="dialog" aria-modal="true">
    <div class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
      <h3 id="modal-scheme-seg-title" class="text-lg font-medium text-gray-900">吐点方案生效段</h3>
      <p class="mt-1 text-xs text-gray-500">同一关系下 Enabled 方案段时间不可重叠.</p>
      <div class="mt-4 grid gap-3 text-sm">
        <div>
          <span class="block font-medium text-gray-700 mb-2">吐点方案</span>
          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="scheme-seg-type" value="inherit" checked class="rounded border-gray-300"> 继承介绍人默认</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="scheme-seg-type" value="independent" class="rounded border-gray-300"> 客户独立方案</label>
        </div>
        <div><label class="text-gray-700" for="scheme-seg-start">生效开始</label><input id="scheme-seg-start" type="date" class="mt-1 w-full rounded-md border px-3 py-2"></div>
        <div class="flex items-center gap-2"><input id="scheme-seg-longterm" type="checkbox" class="rounded border-gray-300"><label for="scheme-seg-longterm" class="text-gray-700">长期有效</label></div>
        <div><label class="text-gray-700" for="scheme-seg-end">生效结束</label><input id="scheme-seg-end" type="date" class="mt-1 w-full rounded-md border px-3 py-2"></div>
        <div><label class="text-gray-700" for="scheme-seg-status">配置状态</label><select id="scheme-seg-status" class="mt-1 w-full rounded-md border px-3 py-2"><option value="enabled">启用</option><option value="disabled">停用</option></select></div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button type="button" class="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" data-close="modal-scheme-segment">取消</button>
        <button type="button" id="scheme-seg-save" class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">保存</button>
      </div>
    </div>
  </div>

"""

if "modal-scheme-segment" not in text:
    text = text.replace(
        '  <div id="modal-base-segment" class="modal-shell',
        MODAL_SCHEME + '  <div id="modal-base-segment" class="modal-shell',
    )

# --- JS: inject stores and functions after relationL2Store ---
JS_STORE = """
    var relationSchemeSegmentStore = {
      'RB-1': [
        { id: 'sch-1', scheme: 'inherit', start: '2026-02-03', end: '', longterm: true, status: 'enabled' }
      ],
      'RB-2': [
        { id: 'sch-2', scheme: 'independent', start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ],
      'RB-3': [
        { id: 'sch-3a', scheme: 'inherit', start: '2026-01-01', end: '2026-03-31', longterm: false, status: 'enabled' },
        { id: 'sch-3b', scheme: 'independent', start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };
    var relationL2OverrideStore = {
      'RB-1': [
        { id: 'ov-1', media: 'Meta', accountType: '企业户', rate: 2.2, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };
    var currentIntroducerMerchant = 'C-INT-001';
    var schemeEditId = null;
"""

if "relationSchemeSegmentStore" not in text:
    text = text.replace(
        "    var relationL2Store = {",
        JS_STORE + "    var relationL2Store = {",
    )
    # Add L2 for RB-3
    text = text.replace(
        """      'RB-2': [
        { id: 'l2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ]
    };""",
        """      'RB-2': [
        { id: 'l2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ],
      'RB-3': [
        { id: 'l2-31', media: 'Meta', accountType: '企业户', rate: 2.8, start: '2026-04-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-32', media: 'TikTok', accountType: '企业户', rate: 2.0, start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };""",
    )

OLD_SYNC = """    function syncRelationSchemeUi() {
      var l2Sec = document.getElementById('l2-full-section');
      var inhHint = document.getElementById('l2-inherit-hint');
      var isIndep = currentRelationScheme === 'independent';
      if (l2Sec) l2Sec.classList.toggle('hidden', !isIndep);
      if (inhHint) inhHint.classList.toggle('hidden', isIndep);
      var lab = document.getElementById('relation-spit-scheme-label');
      if (lab) lab.textContent = isIndep ? '客户独立方案' : '继承介绍人默认';
      if (isIndep) {
        var relId = currentRelationId || 'RB-2';
        renderMatrixTable('tbody-l2-segment', relationL2Store[relId] || [], 'btn-l2-seg-edit', 'btn-l2-seg-del');
      }
    }"""

NEW_SYNC_AND_HELPERS = """    function schemeSegMatchesDay(seg, d) {
      if (seg.status === 'disabled') return false;
      var sd = parseYmd(seg.start);
      var ed = seg.longterm ? null : parseYmd(seg.end);
      if (!sd) return false;
      var dn = dayNum(d);
      return dn >= dayNum(sd) && dn <= (ed ? dayNum(ed) : Infinity);
    }

    function schemeForDay(relId, d) {
      var list = (relationSchemeSegmentStore[relId] || []).filter(function (s) { return s.status !== 'disabled'; });
      for (var i = 0; i < list.length; i++) {
        if (schemeSegMatchesDay(list[i], d)) return list[i].scheme;
      }
      return null;
    }

    function validateSchemeSegments(list, excludeId) {
      var arr = list.filter(function (x) { return x.id !== excludeId; });
      for (var i = 0; i < arr.length; i++) {
        var s = arr[i];
        if (s.status === 'disabled') continue;
        var sd = parseYmd(s.start);
        if (!sd) return '每段需填写生效开始日期';
        var ed = s.longterm ? null : parseYmd(s.end);
        if (!s.longterm && !ed) return '非长期分段需填写结束日期';
        if (!s.longterm && ed && ed < sd) return '结束日不能早于开始日';
        for (var j = i + 1; j < arr.length; j++) {
          var t = arr[j];
          if (t.status === 'disabled') continue;
          if (rangesOverlap(sd, ed, parseYmd(t.start), t.longterm ? null : parseYmd(t.end))) {
            return '吐点方案生效段时间不可重叠';
          }
        }
      }
      return null;
    }

    function schemeTypeLabel(scheme) {
      return scheme === 'independent' ? '客户独立方案' : '继承介绍人默认';
    }

    function renderSchemeSegmentTable() {
      var relId = currentRelationId || 'RB-1';
      var tb = document.getElementById('tbody-scheme-segment');
      if (!tb) return;
      var segs = relationSchemeSegmentStore[relId] || [];
      tb.innerHTML = segs.map(function (seg) {
        var st = seg.status !== 'disabled';
        var badge = seg.scheme === 'independent'
          ? 'rounded-full bg-purple-100 px-2 py-0.5 text-purple-800'
          : 'rounded-full bg-gray-100 px-2 py-0.5 text-gray-800';
        return '<tr data-scheme-id="' + escHtml(seg.id) + '">' +
          '<td class="px-3 py-2"><span class="' + badge + '">' + escHtml(schemeTypeLabel(seg.scheme)) + '</span></td>' +
          '<td class="px-3 py-2 text-gray-600">' + escHtml(formatSegRange(seg)) + '</td>' +
          '<td class="px-3 py-2"><span class="' + (st ? 'text-green-700' : 'text-gray-500') + '">' + (st ? '启用' : '停用') + '</span></td>' +
          '<td class="px-3 py-2 text-right space-x-2">' +
          '<button type="button" class="text-blue-600 hover:underline btn-scheme-seg-edit" data-scheme-id="' + escHtml(seg.id) + '">编辑</button>' +
          '<button type="button" class="text-red-600 hover:underline btn-scheme-seg-del" data-scheme-id="' + escHtml(seg.id) + '">删除</button>' +
          '</td></tr>';
      }).join('');
      var hint = document.getElementById('scheme-seg-hint');
      if (hint) {
        if (!segs.length) {
          hint.textContent = '暂无方案段, 结算日将视为无方案 (比例=0). 请至少新增一段.';
          hint.classList.remove('hidden');
        } else {
          hint.classList.add('hidden');
        }
      }
    }

    function relationSchemeSummary(relId) {
      var segs = (relationSchemeSegmentStore[relId] || []).filter(function (s) { return s.status !== 'disabled'; });
      if (!segs.length) return '无方案段';
      var hasInh = segs.some(function (s) { return s.scheme === 'inherit'; });
      var hasInd = segs.some(function (s) { return s.scheme === 'independent'; });
      if (hasInh && hasInd) return '继承 → 独立';
      return hasInd ? '客户独立' : '继承';
    }

    function syncRelationListMeta() {
      document.querySelectorAll('.relation-row').forEach(function (tr) {
        var rid = tr.getAttribute('data-relation-id');
        if (!rid) return;
        var sum = tr.querySelector('[data-scheme-summary]');
        if (sum) sum.textContent = relationSchemeSummary(rid);
        var sc = tr.querySelector('[data-scheme-count]');
        if (sc) sc.textContent = String((relationSchemeSegmentStore[rid] || []).length);
        var oc = tr.querySelector('[data-override-count]');
        if (oc) oc.textContent = String(countEnabledMatrixSegs(relationL2OverrideStore[rid] || []));
        var ic = tr.querySelector('[data-independent-count]');
        var indepCell = tr.querySelectorAll('td')[tr.querySelectorAll('td').length - 4];
        if (indepCell && indepCell.classList.contains('tabular-nums')) {
          indepCell.textContent = String(countEnabledMatrixSegs(relationL2Store[rid] || [])) || '—';
        }
      });
    }

    function syncRelationSchemeUi() {
      var relId = currentRelationId || 'RB-1';
      renderSchemeSegmentTable();
      var segs = relationSchemeSegmentStore[relId] || [];
      var hasInherit = segs.some(function (s) { return s.scheme === 'inherit' && s.status !== 'disabled'; });
      var hasIndep = segs.some(function (s) { return s.scheme === 'independent' && s.status !== 'disabled'; });
      var ovSec = document.getElementById('l2-override-section');
      var l2Sec = document.getElementById('l2-full-section');
      var inhHint = document.getElementById('l2-inherit-hint');
      if (ovSec) ovSec.classList.toggle('hidden', !hasInherit);
      if (l2Sec) l2Sec.classList.toggle('hidden', !hasIndep);
      if (inhHint) inhHint.classList.toggle('hidden', !hasInherit || hasIndep);
      if (hasInherit) {
        renderMatrixTable('tbody-l2-override', relationL2OverrideStore[relId] || [], 'btn-l2-override-edit', 'btn-l2-override-del');
      }
      if (hasIndep) {
        renderMatrixTable('tbody-l2-segment', relationL2Store[relId] || [], 'btn-l2-seg-edit', 'btn-l2-seg-del');
      }
      var lab = document.getElementById('relation-spit-scheme-label');
      if (lab) lab.textContent = relationSchemeSummary(relId);
      var today = new Date();
      currentRelationScheme = schemeForDay(relId, today) || (hasIndep ? 'independent' : 'inherit');
      syncRelationListMeta();
    }"""

if "function schemeForDay" not in text:
    text = text.replace(OLD_SYNC, NEW_SYNC_AND_HELPERS)

OLD_GET_MATRIX = """    function getMatrixStore() {
      if (matrixEditContext.target === 'l1') {
        if (!currentL1IntroId) currentL1IntroId = 'C-INT-001';
        if (!introducerL1Store[currentL1IntroId]) introducerL1Store[currentL1IntroId] = [];
        return introducerL1Store[currentL1IntroId];
      }
      var relId = currentRelationId || 'RB-2';
      if (!relationL2Store[relId]) relationL2Store[relId] = [];
      return relationL2Store[relId];
    }"""

NEW_GET_MATRIX = """    function getMatrixStore() {
      if (matrixEditContext.target === 'l1') {
        if (!currentL1IntroId) currentL1IntroId = 'C-INT-001';
        if (!introducerL1Store[currentL1IntroId]) introducerL1Store[currentL1IntroId] = [];
        return introducerL1Store[currentL1IntroId];
      }
      var relId = currentRelationId || 'RB-2';
      if (matrixEditContext.target === 'l2o') {
        if (!relationL2OverrideStore[relId]) relationL2OverrideStore[relId] = [];
        return relationL2OverrideStore[relId];
      }
      if (!relationL2Store[relId]) relationL2Store[relId] = [];
      return relationL2Store[relId];
    }"""

text = text.replace(OLD_GET_MATRIX, NEW_GET_MATRIX)

OLD_OPEN_MATRIX_TITLE = """      if (title) title.textContent = target === 'l1' ? 'L1 默认矩阵分段' : 'L2-Full 独立矩阵分段';"""
NEW_OPEN_MATRIX_TITLE = """      if (title) title.textContent = target === 'l1' ? 'L1 默认矩阵分段' : (target === 'l2o' ? 'L2-Override 客户调价分段' : 'L2-Full 独立矩阵分段');"""

text = text.replace(OLD_OPEN_MATRIX_TITLE, NEW_OPEN_MATRIX_TITLE)

OLD_EFF = """    function effectiveForDayV223(account, d) {
      for (var i = 0; i < account.segments.length; i++) {
        var seg = account.segments[i];
        if (seg.status !== 'enabled') continue;
        var sd = parseYmd(seg.start);
        var ed = seg.longterm ? null : parseYmd(seg.end);
        if (!sd) continue;
        var dn = dayNum(d);
        var sdn = dayNum(sd);
        var edn = ed ? dayNum(ed) : Infinity;
        if (dn >= sdn && dn <= edn) {
          return { type: 'l3', rate: seg.rate, seg: seg, label: '账户特殊' };
        }
      }
      var mt = accountMediaType(account);
      if (currentRelationScheme === 'independent') {
        var relId = currentRelationId || 'RB-2';
        var l2list = relationL2Store[relId] || [];
        for (var j = 0; j < l2list.length; j++) {
          if (matrixSegMatchesDay(l2list[j], mt.media, mt.accountType, d)) {
            return { type: 'l2', rate: l2list[j].rate, seg: l2list[j], label: '客户独立' };
          }
        }
      }
      var l1list = introducerL1Store['C-INT-001'] || [];
      for (var k = 0; k < l1list.length; k++) {
        if (matrixSegMatchesDay(l1list[k], mt.media, mt.accountType, d)) {
          return { type: 'l1', rate: l1list[k].rate, seg: l1list[k], label: '介绍人默认' };
        }
      }
      if (!account.media || !account.accountType) {
        return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
      }
      return { type: 'none', rate: 0, seg: null, label: '无规则' };
    }"""

NEW_EFF = """    function effectiveForDayV223(account, d) {
      for (var i = 0; i < account.segments.length; i++) {
        var seg = account.segments[i];
        if (seg.status !== 'enabled') continue;
        var sd = parseYmd(seg.start);
        var ed = seg.longterm ? null : parseYmd(seg.end);
        if (!sd) continue;
        var dn = dayNum(d);
        if (dn >= dayNum(sd) && dn <= (ed ? dayNum(ed) : Infinity)) {
          return { type: 'l3', rate: seg.rate, seg: seg, label: '账户特殊' };
        }
      }
      var relId = currentRelationId || 'RB-1';
      var introId = currentIntroducerMerchant || 'C-INT-001';
      var scheme = schemeForDay(relId, d);
      if (!scheme) {
        return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
      }
      var mt = accountMediaType(account);
      if (scheme === 'independent') {
        var l2f = relationL2Store[relId] || [];
        for (var j = 0; j < l2f.length; j++) {
          if (matrixSegMatchesDay(l2f[j], mt.media, mt.accountType, d)) {
            return { type: 'l2', rate: l2f[j].rate, seg: l2f[j], label: '客户独立' };
          }
        }
        if (!account.media || !account.accountType) {
          return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
        }
        return { type: 'none', rate: 0, seg: null, label: '无规则' };
      }
      var olist = relationL2OverrideStore[relId] || [];
      for (var o = 0; o < olist.length; o++) {
        if (matrixSegMatchesDay(olist[o], mt.media, mt.accountType, d)) {
          return { type: 'l2o', rate: olist[o].rate, seg: olist[o], label: '客户调价' };
        }
      }
      var l1list = introducerL1Store[introId] || [];
      for (var k = 0; k < l1list.length; k++) {
        if (matrixSegMatchesDay(l1list[k], mt.media, mt.accountType, d)) {
          return { type: 'l1', rate: l1list[k].rate, seg: l1list[k], label: '介绍人默认' };
        }
      }
      if (!account.media || !account.accountType) {
        return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
      }
      return { type: 'none', rate: 0, seg: null, label: '无规则' };
    }"""

text = text.replace(OLD_EFF, NEW_EFF)

OLD_COLORS = "    var PREVIEW_COLORS = { l3: '#fbbf24', l2: '#a78bfa', l1: '#93c5fd', none: '#d1d5db' };"
NEW_COLORS = "    var PREVIEW_COLORS = { l3: '#fbbf24', l2: '#a78bfa', l2o: '#2dd4bf', l1: '#93c5fd', none: '#d1d5db' };"
text = text.replace(OLD_COLORS, NEW_COLORS)

OLD_LEG = """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l3 + '"></span>账户特殊 (L3)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2 + '"></span>客户独立 (L2-Full)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l1 + '"></span>介绍人默认 (L1)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';"""

NEW_LEG = """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l3 + '"></span>账户特殊 (L3)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2 + '"></span>客户独立 (L2-Full)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2o + '"></span>客户调价 (L2-Override)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l1 + '"></span>介绍人默认 (L1)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';"""

text = text.replace(OLD_LEG, NEW_LEG)

OLD_BAR_COL = "          var col = bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : PREVIEW_COLORS.none));"
NEW_BAR_COL = "          var col = bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l2o' ? PREVIEW_COLORS.l2o : (bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : PREVIEW_COLORS.none)));"
text = text.replace(OLD_BAR_COL, NEW_BAR_COL)

OLD_REFRESH = """    function refreshMatrixViews() {
      if (currentL1IntroId) {
        renderMatrixTable('tbody-l1-segment', introducerL1Store[currentL1IntroId] || [], 'btn-l1-seg-edit', 'btn-l1-seg-del');
        var row = document.querySelector('[data-intro-id="' + currentL1IntroId + '"]');
        if (row) {
          var tr = row.closest('tr');
          var cnt = tr && tr.querySelector('[data-l1-count]');
          if (cnt) cnt.textContent = String(countEnabledMatrixSegs(introducerL1Store[currentL1IntroId] || []));
        }
      }
      syncRelationSchemeUi();
      renderPreviewGantt();
    }"""
# keep as is if already there

OLD_SAVE_TOAST = "showToast((tgt === 'l1' ? 'L1 默认矩阵' : 'L2 独立矩阵') + '分段已保存');"
NEW_SAVE_TOAST = "showToast((tgt === 'l1' ? 'L1 默认矩阵' : (tgt === 'l2o' ? 'L2 客户调价' : 'L2 独立矩阵')) + '分段已保存');"
text = text.replace(OLD_SAVE_TOAST, NEW_SAVE_TOAST)

OLD_PREFIX = "        var prefix = tgt === 'l1' ? 'l1' : 'l2';"
NEW_PREFIX = "        var prefix = tgt === 'l1' ? 'l1' : (tgt === 'l2o' ? 'l2o' : 'l2');"
text = text.replace(OLD_PREFIX, NEW_PREFIX)

# Open spit rules: set introducer merchant
OLD_OPEN_SPIT = """        selectRelationRow(tr);
        var list = document.getElementById('relations-view-list');
        var spit = document.getElementById('relations-view-spit');
        if (list) list.classList.add('hidden');
        if (spit) spit.classList.remove('hidden');
        currentRelationScheme = tr.getAttribute('data-spit-scheme') || 'inherit';
        initSpitRulePage();
        syncRelationSchemeUi();
        showToast('已进入吐点规则 (L2-Full / L3 / 生效预览)');"""

NEW_OPEN_SPIT = """        selectRelationRow(tr);
        currentIntroducerMerchant = tr.getAttribute('data-intro-merchant') || 'C-INT-001';
        var list = document.getElementById('relations-view-list');
        var spit = document.getElementById('relations-view-spit');
        if (list) list.classList.add('hidden');
        if (spit) spit.classList.remove('hidden');
        initSpitRulePage();
        syncRelationSchemeUi();
        showToast('已进入吐点规则 (方案段 / L2-Override / L2-Full / L3 / 生效预览)');"""

text = text.replace(OLD_OPEN_SPIT, NEW_OPEN_SPIT)

# Add scheme/override handlers before viewSpit listener - inject block
HANDLERS = """
    function openSchemeSegmentModal(editId) {
      schemeEditId = editId || null;
      var relId = currentRelationId || 'RB-1';
      var seg = editId ? (relationSchemeSegmentStore[relId] || []).find(function (x) { return x.id === editId; }) : null;
      var radios = document.querySelectorAll('input[name="scheme-seg-type"]');
      var st = document.getElementById('scheme-seg-start');
      var en = document.getElementById('scheme-seg-end');
      var lt = document.getElementById('scheme-seg-longterm');
      var stat = document.getElementById('scheme-seg-status');
      var schemeVal = seg ? seg.scheme : 'inherit';
      radios.forEach(function (r) { r.checked = r.value === schemeVal; });
      if (seg) {
        if (st) st.value = seg.start;
        if (lt) lt.checked = !!seg.longterm;
        if (en) { en.disabled = !!seg.longterm; en.value = seg.end || ''; }
        if (stat) stat.value = seg.status === 'disabled' ? 'disabled' : 'enabled';
      } else {
        if (st) st.value = '';
        if (lt) lt.checked = false;
        if (en) { en.value = ''; en.disabled = false; }
        if (stat) stat.value = 'enabled';
      }
      if (lt && en) lt.onchange = function () { en.disabled = lt.checked; if (lt.checked) en.value = ''; };
      openModal('modal-scheme-segment');
    }

    var btnSchemeAdd = document.getElementById('btn-scheme-segment-add');
    if (btnSchemeAdd) btnSchemeAdd.addEventListener('click', function () { openSchemeSegmentModal(null); });

    var schemeSegSave = document.getElementById('scheme-seg-save');
    if (schemeSegSave) {
      schemeSegSave.addEventListener('click', function () {
        var relId = currentRelationId || 'RB-1';
        var typeEl = document.querySelector('input[name="scheme-seg-type"]:checked');
        var scheme = typeEl ? typeEl.value : 'inherit';
        var start = document.getElementById('scheme-seg-start').value;
        var longterm = document.getElementById('scheme-seg-longterm').checked;
        var end = longterm ? '' : document.getElementById('scheme-seg-end').value;
        var status = document.getElementById('scheme-seg-status').value === 'disabled' ? 'disabled' : 'enabled';
        if (!start) { showToast('请填写生效开始', 'error'); return; }
        if (!longterm && !end) { showToast('非长期须填写结束日', 'error'); return; }
        var draft = { id: schemeEditId || uid('sch'), scheme: scheme, start: start, end: end, longterm: longterm, status: status };
        if (!relationSchemeSegmentStore[relId]) relationSchemeSegmentStore[relId] = [];
        var list = relationSchemeSegmentStore[relId].filter(function (x) { return x.id !== schemeEditId; }).concat([draft]);
        var err = validateSchemeSegments(list, null);
        if (err) { showToast(err, 'error'); return; }
        if (schemeEditId) {
          var idx = relationSchemeSegmentStore[relId].findIndex(function (x) { return x.id === schemeEditId; });
          if (idx >= 0) relationSchemeSegmentStore[relId][idx] = draft;
        } else {
          relationSchemeSegmentStore[relId].push(draft);
        }
        closeModal('modal-scheme-segment');
        schemeEditId = null;
        syncRelationSchemeUi();
        renderPreviewGantt();
        showToast('吐点方案生效段已保存');
      });
    }

    var btnL2OverrideAdd = document.getElementById('btn-l2-override-add');
    if (btnL2OverrideAdd) btnL2OverrideAdd.addEventListener('click', function () { openMatrixSegmentModal('l2o', null); });

"""

if "openSchemeSegmentModal" not in text:
    text = text.replace("    var btnL1Add = document.getElementById('btn-l1-segment-add');", HANDLERS + "    var btnL1Add = document.getElementById('btn-l1-segment-add');")

# Extend viewSpit click handler for scheme and override
OLD_VIEW_SPIT_START = """    var viewSpit = document.getElementById('relations-view-spit');
    if (viewSpit) {
      viewSpit.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var editL2 = t.closest('.btn-l2-seg-edit');"""

NEW_VIEW_SPIT_START = """    var viewSpit = document.getElementById('relations-view-spit');
    if (viewSpit) {
      viewSpit.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var editSch = t.closest('.btn-scheme-seg-edit');
        if (editSch) { openSchemeSegmentModal(editSch.getAttribute('data-scheme-id')); return; }
        var delSch = t.closest('.btn-scheme-seg-del');
        if (delSch) {
          var sid = delSch.getAttribute('data-scheme-id');
          if (!confirm('删除该方案生效段? (原型)')) return;
          var relId = currentRelationId || 'RB-1';
          relationSchemeSegmentStore[relId] = (relationSchemeSegmentStore[relId] || []).filter(function (x) { return x.id !== sid; });
          syncRelationSchemeUi();
          renderPreviewGantt();
          showToast('已删除方案段');
          return;
        }
        var editOv = t.closest('.btn-l2-override-edit');
        if (editOv) { openMatrixSegmentModal('l2o', editOv.getAttribute('data-seg-id')); return; }
        var delOv = t.closest('.btn-l2-override-del');
        if (delOv) {
          var oid = delOv.getAttribute('data-seg-id');
          if (!confirm('删除该调价分段? (原型)')) return;
          var relId2 = currentRelationId || 'RB-1';
          relationL2OverrideStore[relId2] = (relationL2OverrideStore[relId2] || []).filter(function (x) { return x.id !== oid; });
          syncRelationSchemeUi();
          renderPreviewGantt();
          showToast('已删除调价分段');
          return;
        }
        var editL2 = t.closest('.btn-l2-seg-edit');"""

text = text.replace(OLD_VIEW_SPIT_START, NEW_VIEW_SPIT_START)

# Settlement CSV add 客户调价 row
text = text.replace(
    "var csv = '\\uFEFF客户,账户,命中比例,比例来源,时间段,消耗USD,返还USD\\nC-002,act_123,3.00%,账户特殊,2026-01-01~2026-03-31,40000,1200\\nC-002,act_222,2.00%,介绍人默认,2026-01-01~2026-03-31,12000,240\\n';",
    "var csv = '\\uFEFF客户,账户,命中比例,比例来源,时间段,消耗USD,返还USD\\nC-002,act_123,3.00%,账户特殊,2026-01-01~2026-03-31,40000,1200\\nC-002,act_111,2.20%,客户调价,2026-04-01~2026-06-30,28000,616\\nC-002,act_222,2.00%,介绍人默认,2026-01-01~2026-03-31,12000,240\\n';",
)

text = text.replace(
    "'<tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_222</td><td class=\"border px-2 py-1\">2.00%</td><td class=\"border px-2 py-1\">介绍人默认</td>",
    "'<tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_111</td><td class=\"border px-2 py-1\">2.20%</td><td class=\"border px-2 py-1\">客户调价</td><td class=\"border px-2 py-1\">2026-04-01~2026-06-30</td><td class=\"border px-2 py-1\">28,000.00</td><td class=\"border px-2 py-1\">616.00</td></tr>' +\n        '<tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_222</td><td class=\"border px-2 py-1\">2.00%</td><td class=\"border px-2 py-1\">介绍人默认</td>",
)

# Page intro line if exists
text = text.replace(
    "V2.23 三层吐点模型 L1/L2-Full/L3",
    "V2.23 吐点模型 L1 / L2-Override / L2-Full / L3 (v0.3 方案分段)",
)

# Init on load
if "syncRelationListMeta();" not in text or text.count("syncRelationListMeta();") < 2:
    text = text.replace(
        "    initSpitRulePage();\n",
        "    initSpitRulePage();\n    syncRelationListMeta();\n",
        1,
    )

HTML.write_text(text, encoding="utf-8")
print("OK", HTML)
