#!/usr/bin/env python3
"""V0.4: Simplify introducer-spitpoint.html to 3-layer model (L1 special / L2 customer base / L3 introducer)."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
text = HTML.read_text(encoding="utf-8")

text = text.replace(
    "介绍人列表, 介绍人关系与吐点, 吐点结算 (V2.23 吐点模型 L1 / L2-Override / L2-Full / L3 (v0.3 方案分段))",
    "介绍人列表, 介绍人关系与吐点, 吐点结算 (V2.23 v0.4: L1 特殊吐点 / L2 客户基础 / L3 介绍人吐点)",
)

OLD_BLOCKS = """                    <div id="scheme-segment-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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

                    <div id="l2-full-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hidden">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">客户独立吐点矩阵 (L2-Full) <span class="text-xs font-normal text-gray-500">(媒体 × 账户类型 × 时间段; 整段替换 L1)</span></h4>
                        <button type="button" id="btn-l2-segment-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增分段</button>
                      </div>
                      <p id="l2-seg-hint" class="mb-2 hidden text-xs text-gray-500" role="status"></p>
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
                          <tbody id="tbody-l2-segment" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                    </div>
                    <div id="l2-inherit-hint" class="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900 hidden">
                      存在「继承」方案生效段: 默认走介绍人 L1; 若需仅对本客户调价 (如 Q2), 请配置上方 <strong>L2-Override</strong>, 无需切换为独立方案.
                    </div>

                    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h4 class="font-medium text-gray-900">账户特殊吐点 (L3) <span class="text-xs font-normal text-gray-500">(单账户例外; 优先级最高)</span></h4>"""

NEW_BLOCKS = """                    <div id="l2-period-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
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
                    </div>

                    <div id="l2-matrix-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">客户基础吐点 · 矩阵 (L2) <span class="text-xs font-normal text-gray-500">(仅「客户基础吐点」时段生效)</span></h4>
                        <button type="button" id="btn-l2-matrix-add" class="rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-100">新增矩阵分段</button>
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
                          <tbody id="tbody-l2-matrix" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                    </div>

                    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h4 class="font-medium text-gray-900">特殊吐点 (L1) <span class="text-xs font-normal text-gray-500">(单账户例外; 优先级最高)</span></h4>"""

text = text.replace(OLD_BLOCKS, NEW_BLOCKS)

text = text.replace(
    "(按季度时间轴; L3 &gt; 按日方案 &gt; L2-Full / L2-Override &gt; L1 &gt; 无规则)",
    "(按季度时间轴; L1 特殊 &gt; L2 客户基础 / L3 介绍人吐点 &gt; 无规则)",
)

text = text.replace(
    "当前: 吐点规则 (方案生效段 · L2-Override / L2-Full · L3 · 生效预览)",
    "当前: 吐点规则 (L2 客户基础 · L1 特殊 · 生效预览)",
)

# List header columns
text = text.replace(
    """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">当前吐点方案</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">方案段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">调价段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">独立矩阵段数</th>""",
    """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">L2 模式摘要</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">L2 时间分段</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">L2 矩阵段数</th>""",
)

# RB-1 row
text = text.replace(
    """                          <td class="px-4 py-3 text-xs" data-scheme-summary>继承 (Q2 起客户调价)</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums text-gray-400" data-l2-full-count>—</td>""",
    """                          <td class="px-4 py-3 text-xs" data-l2-mode-summary>Q1 介绍人吐点 → Q2 客户基础</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>2</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>1</td>""",
)

# RB-2
text = text.replace(
    """                          <td class="px-4 py-3 text-xs" data-scheme-summary><span class="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">客户独立</span></td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>0</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-full-count>3</td>""",
    """                          <td class="px-4 py-3 text-xs" data-l2-mode-summary><span class="rounded-full bg-indigo-100 px-2 py-0.5 text-indigo-800">客户基础吐点</span></td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>1</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>3</td>""",
)

# RB-3
text = text.replace(
    """                          <td class="px-4 py-3 text-xs" data-scheme-summary>继承 → 独立 (Q2)</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-scheme-count>2</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-override-count>0</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-full-count>2</td>""",
    """                          <td class="px-4 py-3 text-xs" data-l2-mode-summary>Q1 介绍人吐点 → Q2 客户基础</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-period-count>2</td>
                          <td class="px-4 py-3 text-right tabular-nums" data-l2-matrix-count>2</td>""",
)

# L1 subpage title
text = text.replace("吐点默认矩阵", "介绍人吐点")
text = text.replace("btn-open-l1-matrix", "btn-open-l3-matrix")
text = text.replace("L1 默认矩阵", "L3 介绍人吐点")
text = text.replace("introducer-view-l1", "introducer-view-l3")
text = text.replace("tbody-l1-segment", "tbody-l3-segment")
text = text.replace("btn-l1-segment", "btn-l3-segment")
text = text.replace("btn-l1-seg-", "btn-l3-seg-")
text = text.replace("l1-intro-label", "l3-intro-label")
text = text.replace("data-l1-count", "data-l3-count")
text = text.replace("introducerL1Store", "introducerL3Store")
text = text.replace("'l1'", "'l3'")
text = text.replace("prefix === 'l1'", "prefix === 'l3'")
text = text.replace("target === 'l1'", "target === 'l3'")
text = text.replace("currentL1IntroId", "currentL3IntroId")

# Add binding modal
text = text.replace(
    """          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="add-binding-scheme" value="inherit" checked class="rounded border-gray-300"> 继承介绍人默认</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="add-binding-scheme" value="independent" class="rounded border-gray-300"> 客户独立方案</label>
          <p class="mt-1 text-xs text-gray-600">继承默认无需在关系内配矩阵; 独立方案保存后须配置 L2-Full.</p>""",
    """          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="add-binding-l2-mode" value="use_introducer" checked class="rounded border-gray-300"> 使用介绍人吐点</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="add-binding-l2-mode" value="customer_base" class="rounded border-gray-300"> 客户基础吐点</label>
          <p class="mt-1 text-xs text-gray-600">使用介绍人吐点: 该段时间走 L3 矩阵; 客户基础吐点: 须配置 L2 媒体×账户类型矩阵.</p>""",
)

# Filter
text = text.replace(
    'for="relations-filter-spit-scheme"',
    'for="relations-filter-l2-mode"',
)
text = text.replace(
    """                    <label class="block text-gray-700 mb-1" for="relations-filter-l2-mode">吐点方案</label>
                    <select id="relations-filter-spit-scheme" class="w-full border rounded-md px-3 py-2">
                      <option value="">全部</option>
                      <option value="inherit">继承介绍人默认</option>
                      <option value="independent">客户独立方案</option>
                    </select>""",
    """                    <label class="block text-gray-700 mb-1" for="relations-filter-l2-mode">L2 计价模式</label>
                    <select id="relations-filter-l2-mode" class="w-full border rounded-md px-3 py-2">
                      <option value="">全部</option>
                      <option value="use_introducer">使用介绍人吐点</option>
                      <option value="customer_base">客户基础吐点</option>
                    </select>""",
)

# Modal scheme -> l2 period
text = text.replace("modal-scheme-segment", "modal-l2-period")
text = text.replace("modal-scheme-seg-title", "modal-l2-period-title")
text = text.replace("scheme-seg-type", "l2-period-mode")
text = text.replace("scheme-seg-start", "l2-period-start")
text = text.replace("scheme-seg-longterm", "l2-period-longterm")
text = text.replace("scheme-seg-end", "l2-period-end")
text = text.replace("scheme-seg-status", "l2-period-status")
text = text.replace("scheme-seg-save", "l2-period-save")
text = text.replace(
    """      <h3 id="modal-l2-period-title" class="text-lg font-medium text-gray-900">吐点方案生效段</h3>
      <p class="mt-1 text-xs text-gray-500">同一关系下 Enabled 方案段时间不可重叠.</p>
      <div class="mt-4 grid gap-3 text-sm">
        <div>
          <span class="block font-medium text-gray-700 mb-2">吐点方案</span>
          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="l2-period-mode" value="inherit" checked class="rounded border-gray-300"> 继承介绍人默认</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="l2-period-mode" value="independent" class="rounded border-gray-300"> 客户独立方案</label>
        </div>""",
    """      <h3 id="modal-l2-period-title" class="text-lg font-medium text-gray-900">L2 客户基础 · 时间分段</h3>
      <p class="mt-1 text-xs text-gray-500">同一关系下 Enabled 分段时间不可重叠.</p>
      <div class="mt-4 grid gap-3 text-sm">
        <div>
          <span class="block font-medium text-gray-700 mb-2">计价模式</span>
          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="l2-period-mode" value="use_introducer" checked class="rounded border-gray-300"> 使用介绍人吐点</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="l2-period-mode" value="customer_base" class="rounded border-gray-300"> 客户基础吐点</label>
        </div>""",
)

# Settlement sources
text = text.replace("客户调价", "客户基础")
text = text.replace("客户独立", "客户基础")
text = text.replace("介绍人默认", "介绍人吐点")
text = text.replace("账户特殊", "特殊吐点")

# --- Replace JS store block ---
OLD_STORE = """    var relationSchemeSegmentStore = {
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
    };"""

NEW_STORE = """    var customerBasePeriodStore = {
      'RB-1': [
        { id: 'p1', mode: 'use_introducer', start: '2026-02-03', end: '2026-03-31', longterm: false, status: 'enabled' },
        { id: 'p2', mode: 'customer_base', start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ],
      'RB-2': [
        { id: 'p2b', mode: 'customer_base', start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ],
      'RB-3': [
        { id: 'p3a', mode: 'use_introducer', start: '2026-01-01', end: '2026-03-31', longterm: false, status: 'enabled' },
        { id: 'p3b', mode: 'customer_base', start: '2026-04-01', end: '', longterm: true, status: 'enabled' }
      ]
    };
    var customerBaseMatrixStore = {
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

if OLD_STORE in text:
    text = text.replace(OLD_STORE, NEW_STORE)
else:
    print("WARN: store block not found, partial replace")

text = text.replace("relationL2Store", "customerBaseMatrixStore")
text = text.replace("relationSchemeSegmentStore", "customerBasePeriodStore")
text = text.replace("relationL2OverrideStore", "customerBaseMatrixStore")

# introducerL1Store already renamed to introducerL3Store above - fix init block name
text = text.replace("var introducerL3Store = {", "var introducerL3Store = {", 1)

# Fix duplicate introducer store key if broken
text = text.replace("introducerL1Store", "introducerL3Store")

# matrix context targets
text = text.replace("matrixEditContext = { target: 'l1', editId: null };", "matrixEditContext = { target: 'l3', editId: null };")
text = text.replace("matrixEditContext.target === 'l1'", "matrixEditContext.target === 'l3'")
text = text.replace("matrixEditContext.target === 'l2o'", "matrixEditContext.target === 'l2m'")
text = text.replace("'l2o'", "'l2m'")
text = text.replace("btn-l2-override", "btn-l2-matrix")
text = text.replace("tbody-l2-override", "tbody-l2-matrix")
text = text.replace("btn-l2-override-edit", "btn-l2-matrix-edit")
text = text.replace("btn-l2-override-del", "btn-l2-matrix-del")
text = text.replace("btn-l2-segment-add", "btn-l2-matrix-add")
text = text.replace("tbody-l2-segment", "tbody-l2-matrix")
text = text.replace("btn-l2-seg-edit", "btn-l2-matrix-edit")
text = text.replace("btn-l2-seg-del", "btn-l2-matrix-del")

# Replace sync/effective JS block - find from schemeForDay to end of syncRelationSchemeUi
import re
pat = re.compile(
    r"    function schemeSegMatchesDay\(seg, d\) \{.*?    function getMatrixStore\(\) \{",
    re.DOTALL,
)
NEW_JS = r'''    function periodSegMatchesDay(seg, d) {
      if (seg.status === 'disabled') return false;
      var sd = parseYmd(seg.start);
      var ed = seg.longterm ? null : parseYmd(seg.end);
      if (!sd) return false;
      var dn = dayNum(d);
      return dn >= dayNum(sd) && dn <= (ed ? dayNum(ed) : Infinity);
    }

    function l2PeriodForDay(relId, d) {
      var list = (customerBasePeriodStore[relId] || []).filter(function (s) { return s.status !== 'disabled'; });
      for (var i = 0; i < list.length; i++) {
        if (periodSegMatchesDay(list[i], d)) return list[i];
      }
      return null;
    }

    function validateL2Periods(list, excludeId) {
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
            return 'L2 客户基础时间分段不可重叠';
          }
        }
      }
      return null;
    }

    function l2ModeLabel(mode) {
      return mode === 'customer_base' ? '客户基础吐点' : '使用介绍人吐点';
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
        return '<tr data-period-id="' + escHtml(seg.id) + '">' +
          '<td class="px-3 py-2"><span class="' + badge + '">' + escHtml(l2ModeLabel(seg.mode)) + '</span></td>' +
          '<td class="px-3 py-2 text-gray-600">' + escHtml(formatSegRange(seg)) + '</td>' +
          '<td class="px-3 py-2"><span class="' + (st ? 'text-green-700' : 'text-gray-500') + '">' + (st ? '启用' : '停用') + '</span></td>' +
          '<td class="px-3 py-2 text-right space-x-2">' +
          '<button type="button" class="text-blue-600 hover:underline btn-l2-period-edit" data-period-id="' + escHtml(seg.id) + '">编辑</button>' +
          '<button type="button" class="text-red-600 hover:underline btn-l2-period-del" data-period-id="' + escHtml(seg.id) + '">删除</button>' +
          '</td></tr>';
      }).join('');
      var hint = document.getElementById('l2-period-hint');
      if (hint) {
        if (!segs.length) {
          hint.textContent = '暂无 L2 时间分段, 关系有效期内将尝试走 L3 介绍人吐点; 建议至少配置一段.';
          hint.classList.remove('hidden');
        } else {
          hint.classList.add('hidden');
        }
      }
    }

    function relationL2Summary(relId) {
      var segs = (customerBasePeriodStore[relId] || []).filter(function (s) { return s.status !== 'disabled'; });
      if (!segs.length) return '未配置 L2';
      var hasIntro = segs.some(function (s) { return s.mode === 'use_introducer'; });
      var hasBase = segs.some(function (s) { return s.mode === 'customer_base'; });
      if (hasIntro && hasBase) return '介绍人吐点 → 客户基础';
      return hasBase ? '客户基础吐点' : '介绍人吐点';
    }

    function syncRelationListMeta() {
      document.querySelectorAll('.relation-row').forEach(function (tr) {
        var rid = tr.getAttribute('data-relation-id');
        if (!rid) return;
        var sum = tr.querySelector('[data-l2-mode-summary]');
        if (sum) sum.textContent = relationL2Summary(rid);
        var pc = tr.querySelector('[data-l2-period-count]');
        if (pc) pc.textContent = String((customerBasePeriodStore[rid] || []).length);
        var mc = tr.querySelector('[data-l2-matrix-count]');
        if (mc) mc.textContent = String(countEnabledMatrixSegs(customerBaseMatrixStore[rid] || []));
      });
    }

    function syncRelationSpitUi() {
      var relId = currentRelationId || 'RB-1';
      renderL2PeriodTable();
      renderMatrixTable('tbody-l2-matrix', customerBaseMatrixStore[relId] || [], 'btn-l2-matrix-edit', 'btn-l2-matrix-del');
      var lab = document.getElementById('relation-spit-scheme-label');
      if (lab) lab.textContent = relationL2Summary(relId);
      syncRelationListMeta();
    }

    function getMatrixStore() {
      if (matrixEditContext.target === 'l3') {
        if (!currentL3IntroId) currentL3IntroId = 'C-INT-001';
        if (!introducerL3Store[currentL3IntroId]) introducerL3Store[currentL3IntroId] = [];
        return introducerL3Store[currentL3IntroId];
      }
      var relId = currentRelationId || 'RB-2';
      if (!customerBaseMatrixStore[relId]) customerBaseMatrixStore[relId] = [];
      return customerBaseMatrixStore[relId];
    }

'''

m = pat.search(text)
if m:
    text = text[:m.start()] + NEW_JS + text[m.end():]
else:
    print("WARN: JS block not found")

# openMatrix titles
text = text.replace("L1 默认矩阵分段", "L3 介绍人吐点矩阵分段")
text = text.replace("L2-Full 独立矩阵分段", "L2 客户基础矩阵分段")
text = text.replace("L2-Override 客户调价分段", "L2 客户基础矩阵分段")
text = text.replace("L2 独立矩阵", "L2 客户基础矩阵")
text = text.replace("L2 客户调价", "L2 客户基础")

# effectiveForDay
OLD_EFF = re.compile(
    r"    function effectiveForDayV223\(account, d\) \{.*?    function quarterStartEnd",
    re.DOTALL,
)
NEW_EFF = r'''    function effectiveForDayV223(account, d) {
      for (var i = 0; i < account.segments.length; i++) {
        var seg = account.segments[i];
        if (seg.status !== 'enabled') continue;
        var sd = parseYmd(seg.start);
        var ed = seg.longterm ? null : parseYmd(seg.end);
        if (!sd) continue;
        var dn = dayNum(d);
        if (dn >= dayNum(sd) && dn <= (ed ? dayNum(ed) : Infinity)) {
          return { type: 'l1', rate: seg.rate, seg: seg, label: '特殊吐点' };
        }
      }
      var relId = currentRelationId || 'RB-1';
      var introId = currentIntroducerMerchant || 'C-INT-001';
      var period = l2PeriodForDay(relId, d);
      var mt = accountMediaType(account);
      if (period && period.mode === 'customer_base') {
        var mlist = customerBaseMatrixStore[relId] || [];
        for (var j = 0; j < mlist.length; j++) {
          if (matrixSegMatchesDay(mlist[j], mt.media, mt.accountType, d)) {
            return { type: 'l2', rate: mlist[j].rate, seg: mlist[j], label: '客户基础' };
          }
        }
        if (!account.media || !account.accountType) {
          return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
        }
        return { type: 'none', rate: 0, seg: null, label: '无规则' };
      }
      var l3list = introducerL3Store[introId] || [];
      for (var k = 0; k < l3list.length; k++) {
        if (matrixSegMatchesDay(l3list[k], mt.media, mt.accountType, d)) {
          return { type: 'l3', rate: l3list[k].rate, seg: l3list[k], label: '介绍人吐点' };
        }
      }
      if (!account.media || !account.accountType) {
        return { type: 'none', rate: 0, seg: null, label: '无规则', warn: true };
      }
      return { type: 'none', rate: 0, seg: null, label: '无规则' };
    }

    function quarterStartEnd'''

m2 = OLD_EFF.search(text)
if m2:
    text = text[:m2.start()] + NEW_EFF + text[m2.end():]

# PREVIEW_COLORS
text = text.replace(
    "var PREVIEW_COLORS = { l3: '#fbbf24', l2: '#a78bfa', l2o: '#2dd4bf', l1: '#93c5fd', none: '#d1d5db' };",
    "var PREVIEW_COLORS = { l1: '#fbbf24', l2: '#a78bfa', l3: '#93c5fd', none: '#d1d5db' };",
)

# legend
text = text.replace(
    "账户特殊 (L3)", "特殊吐点 (L1)"
).replace(
    "客户独立 (L2-Full)", "客户基础 (L2)"
).replace(
    "客户调价 (L2-Override)", "客户基础 (L2)"
).replace(
    "介绍人默认 (L1)", "介绍人吐点 (L3)"
)

# bar colors - fix order in renderPreviewGantt
text = text.replace(
    "bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l2o' ? PREVIEW_COLORS.l2o : (bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : PREVIEW_COLORS.none)))",
    "bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : PREVIEW_COLORS.none))",
)

# Rename functions
text = text.replace("syncRelationSchemeUi", "syncRelationSpitUi")
text = text.replace("openSchemeSegmentModal", "openL2PeriodModal")
text = text.replace("schemeEditId", "l2PeriodEditId")
text = text.replace("btn-scheme-segment-add", "btn-l2-period-add")
text = text.replace("btn-scheme-seg-", "btn-l2-period-")
text = text.replace("validateSchemeSegments", "validateL2Periods")
text = text.replace("schemeTypeLabel", "l2ModeLabel")
text = text.replace("renderSchemeSegmentTable", "renderL2PeriodTable")
text = text.replace("relationSchemeSummary", "relationL2Summary")

# openIntroducerL1View -> L3
text = text.replace("openIntroducerL1View", "openIntroducerL3View")
text = text.replace("closeIntroducerL1View", "closeIntroducerL3View")
text = text.replace("btn-open-l3-matrix", "btn-open-l3-matrix")  # idempotent

# Handlers block for period save - replace openSchemeSegmentModal function body references
text = text.replace("schemeForDay", "l2PeriodForDay")
text = text.replace("renderSchemeSegmentTable", "renderL2PeriodTable")

# add-binding save
text = text.replace(
    """      relationSchemeSegmentStore[newRelId] = [
        { id: uid('sch'), scheme: scheme, start: start, end: '', longterm: true, status: 'enabled' }
      ];
      if (scheme === 'independent') {
        relationL2Store[newRelId] = [];
      }""",
    """      var mode = scheme === 'independent' ? 'customer_base' : 'use_introducer';
      var modeEl = document.querySelector('input[name="add-binding-l2-mode"]:checked');
      if (modeEl) mode = modeEl.value;
      customerBasePeriodStore[newRelId] = [
        { id: uid('per'), mode: mode, start: start, end: '', longterm: true, status: 'enabled' }
      ];
      if (mode === 'customer_base') {
        customerBaseMatrixStore[newRelId] = [];
      }""",
)

# Fix add-binding variable - remove old scheme var usage
text = text.replace(
    """      var schemeEl = document.querySelector('input[name="add-binding-scheme"]:checked');
      var scheme = schemeEl ? schemeEl.value : 'inherit';""",
    """      var modeEl = document.querySelector('input[name="add-binding-l2-mode"]:checked');
      var mode = modeEl ? modeEl.value : 'use_introducer';""",
)

text = text.replace(
    "showToast('已进入吐点规则 (方案段 / L2-Override / L2-Full / L3 / 生效预览)');",
    "showToast('已进入吐点规则 (L2 客户基础 · L1 特殊 · 生效预览)');",
)

# CSV line fix - already 客户基础 from earlier replace

HTML.write_text(text, encoding="utf-8")
print("HTML OK", HTML)
