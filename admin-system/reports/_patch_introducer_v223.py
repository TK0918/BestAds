#!/usr/bin/env python3
"""Patch introducer-spitpoint.html to PRD V2.23."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"

REPLACEMENTS = [
    (
        "介绍人列表, 介绍人关系与吐点, 吐点结算 (示例 UI, 对接后端后替换为真实数据; PRD 6.2 将关系与基础/特殊吐点合并为同一模块)",
        "介绍人列表, 介绍人关系与吐点, 吐点结算 (V2.23 三层吐点模型 L1/L2-Full/L3)",
    ),
    (
        '<p class="mt-1 text-sm text-gray-500">运营维护介绍人身份与客户端可见性</p>',
        '<p class="mt-1 text-sm text-gray-500">运营维护介绍人身份与客户端可见性; 行内「吐点默认矩阵」维护 L1</p>',
    ),
    (
        """                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"><button type="button" class="sort-col text-left uppercase text-xs font-medium text-gray-500 hover:text-gray-800" data-sort="became-at" title="点击切换排序 (原型)">成为介绍人时间 <i class="fas fa-sort text-gray-400 ml-1" aria-hidden="true"></i></button></th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                    </tr></thead>""",
        """                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">默认矩阵段数</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"><button type="button" class="sort-col text-left uppercase text-xs font-medium text-gray-500 hover:text-gray-800" data-sort="became-at" title="点击切换排序 (原型)">成为介绍人时间 <i class="fas fa-sort text-gray-400 ml-1" aria-hidden="true"></i></button></th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作人</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    </tr></thead>""",
    ),
    (
        """                        <td class="px-6 py-4 tabular-nums" data-rel-count>3</td>
                        <td class="px-6 py-4 whitespace-nowrap tabular-nums" data-became-at>2026-01-10 09:30:00</td>
                        <td class="px-6 py-4 text-xs text-gray-600">欧伟权 (ouweiquan@bestfulfill.com)</td>
                      </tr>""",
        """                        <td class="px-6 py-4 tabular-nums" data-rel-count>3</td>
                        <td class="px-6 py-4 tabular-nums" data-l1-count>4</td>
                        <td class="px-6 py-4 whitespace-nowrap tabular-nums" data-became-at>2026-01-10 09:30:00</td>
                        <td class="px-6 py-4 text-xs text-gray-600">欧伟权 (ouweiquan@bestfulfill.com)</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button type="button" class="btn-open-l1-matrix rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100" data-intro-id="C-INT-001">吐点默认矩阵</button>
                        </td>
                      </tr>""",
    ),
    (
        """                        <td class="px-6 py-4 tabular-nums" data-rel-count>0</td>
                        <td class="px-6 py-4 whitespace-nowrap tabular-nums" data-became-at>2025-11-02 14:00:00</td>
                        <td class="px-6 py-4 text-xs text-gray-600">系统 (system)</td>
                      </tr>""",
        """                        <td class="px-6 py-4 tabular-nums" data-rel-count>0</td>
                        <td class="px-6 py-4 tabular-nums" data-l1-count>0</td>
                        <td class="px-6 py-4 whitespace-nowrap tabular-nums" data-became-at>2025-11-02 14:00:00</td>
                        <td class="px-6 py-4 text-xs text-gray-600">系统 (system)</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <button type="button" class="btn-open-l1-matrix rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100" data-intro-id="C-INT-002">吐点默认矩阵</button>
                        </td>
                      </tr>""",
    ),
    (
        """                  <div>
                    <label class="block text-gray-700 mb-1" for="relations-filter-bind-state">生效状态</label>
                    <select id="relations-filter-bind-state" class="w-full border rounded-md px-3 py-2">
                      <option value="">全部</option>
                      <option>当前生效</option>
                      <option>历史</option>
                    </select>
                  </div>""",
        """                  <div>
                    <label class="block text-gray-700 mb-1" for="relations-filter-spit-scheme">吐点方案</label>
                    <select id="relations-filter-spit-scheme" class="w-full border rounded-md px-3 py-2">
                      <option value="">全部</option>
                      <option value="inherit">继承介绍人默认</option>
                      <option value="independent">客户独立方案</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-1" for="relations-filter-bind-state">生效状态</label>
                    <select id="relations-filter-bind-state" class="w-full border rounded-md px-3 py-2">
                      <option value="">全部</option>
                      <option>当前生效</option>
                      <option>历史</option>
                    </select>
                  </div>""",
    ),
    (
        "关系列表中点击「吐点规则」进入基础吐点, 特殊吐点与生效预览子页; 返回键回到列表",
        "关系列表点击「吐点规则」进入 L2-Full(可选)、账户特殊 L3 与生效预览; 返回键回到列表",
    ),
    (
        "默认按生效开始降序; 点击「吐点规则」进入基础吐点 / 特殊吐点 / 生效预览",
        "默认按生效开始降序; 点击「吐点规则」配置关系吐点",
    ),
    (
        """                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">当前基础吐点</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">特殊吐点数</th>""",
        """                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">吐点方案</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">独立矩阵段数</th>
                        <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">账户特殊条数</th>""",
    ),
    (
        """                          <td class="px-4 py-3 whitespace-nowrap text-xs">2026-02-03 ~ <span class="text-gray-500">长期</span></td>
                          <td class="px-4 py-3 text-right tabular-nums text-blue-800 font-medium">1.00%</td>
                          <td class="px-4 py-3 text-right tabular-nums">1</td>""",
        """                          <td class="px-4 py-3 whitespace-nowrap text-xs">2026-02-03 ~ <span class="text-gray-500">长期</span></td>
                          <td class="px-4 py-3 text-xs"><span class="rounded-full bg-gray-100 px-2 py-0.5 text-gray-800">继承介绍人默认</span></td>
                          <td class="px-4 py-3 text-right tabular-nums text-gray-400">—</td>
                          <td class="px-4 py-3 text-right tabular-nums">1</td>""",
    ),
    (
        """                          <td class="px-4 py-3 whitespace-nowrap text-xs">2025-06-01 ~ 2025-12-31</td>
                          <td class="px-4 py-3 text-right text-gray-400">—</td>
                          <td class="px-4 py-3 text-right tabular-nums">0</td>""",
        """                          <td class="px-4 py-3 whitespace-nowrap text-xs">2025-06-01 ~ 2025-12-31</td>
                          <td class="px-4 py-3 text-xs"><span class="rounded-full bg-purple-100 px-2 py-0.5 text-purple-800">客户独立方案</span></td>
                          <td class="px-4 py-3 text-right tabular-nums">3</td>
                          <td class="px-4 py-3 text-right tabular-nums">0</td>""",
    ),
    (
        'data-relation-id="RB-1"',
        'data-relation-id="RB-1" data-spit-scheme="inherit"',
    ),
    (
        'data-relation-id="RB-2"',
        'data-relation-id="RB-2" data-spit-scheme="independent"',
    ),
    (
        "当前: 吐点规则 (基础吐点 · 特殊吐点 · 生效预览)",
        "当前: 吐点规则 (客户独立矩阵 · 账户特殊吐点 · 生效预览)",
    ),
    (
        """                          <p class="mt-2 text-xs text-gray-600">关系生效期: 2026-02-03 ~ 长期 · <span class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">Bound 生效中</span></p>""",
        """                          <p class="mt-2 text-xs text-gray-600">关系生效期: 2026-02-03 ~ 长期 · 吐点方案: <span id="relation-spit-scheme-label" class="font-medium text-blue-800">继承介绍人默认</span> · <span class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-green-800">生效中</span></p>""",
    ),
    (
        """                    <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                      <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <h4 class="font-medium text-gray-900">基础吐点 <span class="text-xs font-normal text-gray-500">(段间不可重叠; 结束可空表示长期)</span></h4>
                        <button type="button" id="btn-base-segment-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增分段</button>
                      </div>
                      <p id="base-seg-hint" class="mb-2 hidden text-xs text-gray-500" role="status"></p>
                      <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-sm">
                          <thead class="bg-gray-50"><tr>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">基础吐点比例</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">生效区间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">更新人</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">更新时间</th>
                            <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                          </tr></thead>
                          <tbody id="tbody-base-segment" class="divide-y divide-gray-200"></tbody>
                        </table>
                      </div>
                    </div>""",
        """                    <div id="l2-full-section" class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hidden">
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
                    <div id="l2-inherit-hint" class="rounded-lg border border-blue-100 bg-blue-50/60 p-4 text-sm text-blue-900">
                      当前关系为「继承介绍人默认」, 结算按介绍人 L1 默认矩阵匹配, 无需在此配置 L2-Full.
                    </div>""",
    ),
    (
        """                        <h4 class="font-medium text-gray-900">特殊吐点 <span class="text-xs font-normal text-gray-500">(从客户当前与历史绑定账户选择; 同账户分段不可重叠)</span></h4>
                        <button type="button" id="btn-add-special-account" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100">新增账户特殊吐点</button>""",
        """                        <h4 class="font-medium text-gray-900">账户特殊吐点 (L3) <span class="text-xs font-normal text-gray-500">(单账户例外; 优先级最高)</span></h4>
                        <button type="button" id="btn-add-special-account" class="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800 hover:bg-blue-100">新增账户特殊吐点</button>""",
    ),
    (
        """                        <h4 class="font-medium text-gray-900">生效预览 <span class="text-xs font-normal text-gray-500">(按季度时间轴; 无固定月表头; 色块内为区间与比例; 特殊 &gt; 基础 &gt; 空档)</span></h4>""",
        """                        <h4 class="font-medium text-gray-900">生效预览 <span class="text-xs font-normal text-gray-500">(按季度时间轴; L3 &gt; L2-Full &gt; L1 &gt; 无规则)</span></h4>""",
    ),
    (
        """      <p class="mt-1 text-sm text-gray-500">同一介绍人对同一客户绑定时间段不可重叠; 不可与前一段结束日同日衔接新段; 结束日可空表示长期 (PRD 6.2). 须同时配置至少一段基础吐点, 比例允许 0.</p>""",
        """      <p class="mt-1 text-sm text-gray-500">同一介绍人对同一客户绑定时间段不可重叠; 结束日可空表示长期. 须选择吐点方案; 选「客户独立方案」保存后须配置 L2-Full.</p>""",
    ),
    (
        """        <div class="rounded-md border border-blue-100 bg-blue-50/60 p-3">
          <p class="font-medium text-gray-800">基础吐点 (必填, PRD 6.2.2.1)</p>
          <p class="mt-1 text-xs text-gray-600">第一段开始时间默认对齐关系开始; 段间不可重叠, 允许空档.</p>
          <div class="mt-2 grid grid-cols-2 gap-2">
            <div><label class="text-gray-700 text-xs" for="add-binding-base-rate">基础吐点比例 (%)</label><input id="add-binding-base-rate" type="number" step="0.01" min="0" max="100" class="mt-1 w-full rounded-md border px-3 py-2" placeholder="0 ~ 100, 可填 0"></div>
            <div><label class="text-gray-700 text-xs" for="add-binding-base-end">本段结束 (可空=长期)</label><input id="add-binding-base-end" type="date" class="mt-1 w-full rounded-md border px-3 py-2"></div>
          </div>
        </div>""",
        """        <div>
          <span class="block font-medium text-gray-700 mb-2">吐点方案</span>
          <label class="mr-4 inline-flex items-center gap-2"><input type="radio" name="add-binding-scheme" value="inherit" checked class="rounded border-gray-300"> 继承介绍人默认</label>
          <label class="inline-flex items-center gap-2"><input type="radio" name="add-binding-scheme" value="independent" class="rounded border-gray-300"> 客户独立方案</label>
          <p class="mt-1 text-xs text-gray-600">继承默认无需在关系内配矩阵; 独立方案保存后须配置 L2-Full.</p>
        </div>""",
    ),
    (
        """      <h3 id="modal-base-seg-title" class="text-lg font-medium text-gray-900">基础吐点分段</h3>
      <p class="mt-1 text-xs text-gray-500">各段生效区间不可重叠 (含边界日); 比例 0~100%, 可填 0.</p>
      <div class="mt-4 grid gap-3 text-sm">
        <div><label class="text-gray-700" for="base-seg-rate">基础吐点比例 (%)</label><input id="base-seg-rate" type="number" step="0.01" min="0" max="100" class="mt-1 w-full rounded-md border px-3 py-2"></div>""",
        """      <h3 id="modal-base-seg-title" class="text-lg font-medium text-gray-900">矩阵分段</h3>
      <p class="mt-1 text-xs text-gray-500">媒体 × 账户类型 × 时间段; Enabled 段不可重叠.</p>
      <div class="mt-4 grid gap-3 text-sm">
        <div><label class="text-gray-700" for="matrix-seg-media">媒体</label><select id="matrix-seg-media" class="mt-1 w-full rounded-md border px-3 py-2"><option>Meta</option><option>TikTok</option><option>Google</option><option>AppLovin</option><option>Snapchat</option></select></div>
        <div><label class="text-gray-700" for="matrix-seg-account-type">账户类型</label><select id="matrix-seg-account-type" class="mt-1 w-full rounded-md border px-3 py-2"><option>企业户</option><option>三不限</option><option>绿通户</option></select></div>
        <div><label class="text-gray-700" for="base-seg-rate">吐点比例 (%)</label><input id="base-seg-rate" type="number" step="0.01" min="0" max="100" class="mt-1 w-full rounded-md border px-3 py-2"></div>
        <div><label class="text-gray-700" for="matrix-seg-status">配置状态</label><select id="matrix-seg-status" class="mt-1 w-full rounded-md border px-3 py-2"><option value="enabled">启用</option><option value="disabled">停用</option></select></div>""",
    ),
    (
        """      <h3 id="modal-special-seg-title" class="text-lg font-medium text-gray-900">特殊吐点分段</h3>""",
        """      <h3 id="modal-special-seg-title" class="text-lg font-medium text-gray-900">账户特殊吐点分段 (L3)</h3>""",
    ),
    (
        "停用介绍人: 现有关系/基础吐点/特殊吐点仍然保留并参与结算",
        "停用介绍人: 现有关系/吐点默认矩阵/关系吐点/账户特殊吐点仍然保留并参与结算",
    ),
    (
        "'<td class=\"border px-2 py-1\">特殊</td>'",
        "'<td class=\"border px-2 py-1\">账户特殊</td>'",
    ),
    (
        "var csv = '\\uFEFF客户,账户,命中比例,比例来源,时间段,消耗USD,返还USD\\nC-002,act_123,3.00%,特殊,2026-01-01~2026-03-31,40000,1200\\n';",
        "var csv = '\\uFEFF客户,账户,命中比例,比例来源,时间段,消耗USD,返还USD\\nC-002,act_123,3.00%,账户特殊,2026-01-01~2026-03-31,40000,1200\\nC-002,act_222,2.00%,介绍人默认,2026-01-01~2026-03-31,12000,240\\n';",
    ),
]

L1_VIEW_INSERT = """
              <div id="introducer-view-l1" class="hidden flex flex-col gap-4">
                <div class="flex flex-wrap items-center gap-3">
                  <button type="button" id="btn-back-introducer-list" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <i class="fas fa-arrow-left text-xs" aria-hidden="true"></i> 返回介绍人列表
                  </button>
                  <span class="text-sm text-gray-500">当前: 吐点默认矩阵 (L1) · <span id="l1-intro-label" class="font-medium text-gray-900">—</span></span>
                </div>
                <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h4 class="font-medium text-gray-900">介绍人默认吐点矩阵</h4>
                    <button type="button" id="btn-l1-segment-add" class="rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100">新增分段</button>
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
                      <tbody id="tbody-l1-segment" class="divide-y divide-gray-200"></tbody>
                    </table>
                  </div>
                </div>
              </div>
"""

JS_INSERT_MARKER = "    function escHtml(s) {"
JS_BLOCK = r"""
    /* --- V2.23: L1 默认矩阵 / 关系吐点方案 --- */
    var introducerL1Store = {
      'C-INT-001': [
        { id: 'l1-1', media: 'Meta', accountType: '企业户', rate: 1.5, start: '2025-01-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l1-2', media: 'Meta', accountType: '三不限', rate: 2.0, start: '2025-01-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l1-3', media: 'TikTok', accountType: '企业户', rate: 1.2, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l1-4', media: 'Google', accountType: '绿通户', rate: 0.8, start: '2026-01-01', end: '2026-12-31', longterm: false, status: 'enabled' }
      ],
      'C-INT-002': []
    };
    var relationL2Store = {
      'RB-2': [
        { id: 'l2-1', media: 'Meta', accountType: '企业户', rate: 2.5, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-2', media: 'TikTok', accountType: '三不限', rate: 3.0, start: '2025-06-01', end: '', longterm: true, status: 'enabled' },
        { id: 'l2-3', media: 'Google', accountType: '企业户', rate: 1.0, start: '2025-06-01', end: '2025-12-31', longterm: false, status: 'enabled' }
      ]
    };
    var currentL1IntroId = null;
    var currentRelationScheme = 'inherit';
    var matrixEditContext = { target: 'l1', editId: null };

    function countEnabledMatrixSegs(list) {
      return list.filter(function (s) { return s.status !== 'disabled'; }).length;
    }

    function renderMatrixTable(tbodyId, segments, btnClass, delClass) {
      var tb = document.getElementById(tbodyId);
      if (!tb) return;
      tb.innerHTML = segments.map(function (seg) {
        var st = seg.status !== 'disabled';
        return '<tr data-seg-id="' + escHtml(seg.id) + '">' +
          '<td class="px-3 py-2">' + escHtml(seg.media) + '</td>' +
          '<td class="px-3 py-2">' + escHtml(seg.accountType) + '</td>' +
          '<td class="px-3 py-2">' + escHtml(String(seg.rate)) + '%</td>' +
          '<td class="px-3 py-2 text-gray-600">' + escHtml(formatSegRange(seg)) + '</td>' +
          '<td class="px-3 py-2"><span class="' + (st ? 'text-green-700' : 'text-gray-500') + '">' + (st ? '启用' : '停用') + '</span></td>' +
          '<td class="px-3 py-2 text-right space-x-2">' +
          '<button type="button" class="text-blue-600 hover:underline ' + btnClass + '" data-seg-id="' + escHtml(seg.id) + '">编辑</button>' +
          '<button type="button" class="text-red-600 hover:underline ' + delClass + '" data-seg-id="' + escHtml(seg.id) + '">删除</button>' +
          '</td></tr>';
      }).join('');
    }

    function openIntroducerL1View(introId) {
      currentL1IntroId = introId;
      var listMain = document.querySelector('#panel-list > div.mb-8');
      var filterBox = document.querySelector('#panel-list .bg-white.shadow-sm.rounded-lg.border');
      var tableBox = document.querySelector('#panel-list .bg-white.shadow-sm.rounded-lg.overflow-hidden');
      var l1View = document.getElementById('introducer-view-l1');
      if (listMain) listMain.classList.add('hidden');
      if (filterBox) filterBox.classList.add('hidden');
      if (tableBox) tableBox.classList.add('hidden');
      if (l1View) l1View.classList.remove('hidden');
      var label = document.getElementById('l1-intro-label');
      if (label) label.textContent = introId;
      renderMatrixTable('tbody-l1-segment', introducerL1Store[introId] || [], 'btn-l1-seg-edit', 'btn-l1-seg-del');
    }

    function closeIntroducerL1View() {
      var listMain = document.querySelector('#panel-list > div.mb-8');
      var panels = document.querySelectorAll('#panel-list > .bg-white.shadow-sm.rounded-lg');
      var l1View = document.getElementById('introducer-view-l1');
      if (listMain) listMain.classList.remove('hidden');
      panels.forEach(function (p) { p.classList.remove('hidden'); });
      if (l1View) l1View.classList.add('hidden');
      currentL1IntroId = null;
    }

    document.querySelectorAll('.btn-open-l1-matrix').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openIntroducerL1View(btn.getAttribute('data-intro-id'));
      });
    });
    var btnBackL1 = document.getElementById('btn-back-introducer-list');
    if (btnBackL1) btnBackL1.addEventListener('click', closeIntroducerL1View);

    function syncRelationSchemeUi() {
      var l2Sec = document.getElementById('l2-full-section');
      var inhHint = document.getElementById('l2-inherit-hint');
      var isIndep = currentRelationScheme === 'independent';
      if (l2Sec) l2Sec.classList.toggle('hidden', !isIndep);
      if (inhHint) inhHint.classList.toggle('hidden', isIndep);
      var lab = document.getElementById('relation-spit-scheme-label');
      if (lab) lab.textContent = isIndep ? '客户独立方案' : '继承介绍人默认';
      if (isIndep) {
        var rid = document.querySelector('.relation-row.bg-blue-50\\/80, .relation-row.ring-2');
        var tr = document.querySelector('.relation-row.bg-blue-50\\/80') || document.querySelector('.relation-row.ring-blue-200');
        if (!tr) tr = document.querySelector('.relation-row');
        var relId = tr ? tr.getAttribute('data-relation-id') : 'RB-2';
        renderMatrixTable('tbody-l2-segment', relationL2Store[relId] || [], 'btn-l2-seg-edit', 'btn-l2-seg-del');
      }
    }

"""

JS_PREVIEW_PATCH = """    var PREVIEW_COLORS = { l3: '#fbbf24', l2: '#a78bfa', l1: '#93c5fd', none: '#d1d5db' };

    function accountMediaType(acc) {
      return { media: acc.media || 'Meta', accountType: acc.accountType || '企业户' };
    }

    function matrixSegMatchesDay(seg, media, accountType, d) {
      if (seg.status === 'disabled') return false;
      if (seg.media !== media || seg.accountType !== accountType) return false;
      var sd = parseYmd(seg.start);
      var ed = seg.longterm ? null : parseYmd(seg.end);
      if (!sd) return false;
      var dn = dayNum(d);
      var sdn = dayNum(sd);
      var edn = ed ? dayNum(ed) : Infinity;
      return dn >= sdn && dn <= edn;
    }

    function effectiveForDayV223(account, d) {
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
        var tr = document.querySelector('.relation-row.bg-blue-50\\/80') || document.querySelector('.relation-row');
        var relId = tr ? tr.getAttribute('data-relation-id') : 'RB-2';
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
    }
"""

def main():
    text = HTML.read_text(encoding="utf-8")
    for old, new in REPLACEMENTS:
        if old not in text:
            print("WARN missing:", old[:60])
        else:
            text = text.replace(old, new, 1)
    if 'id="introducer-view-l1"' not in text:
        anchor = "            </div>\n\n            <div id=\"panel-relations\""
        text = text.replace(anchor, L1_VIEW_INSERT + anchor, 1)
    if "introducerL1Store" not in text and JS_INSERT_MARKER in text:
        text = text.replace(JS_INSERT_MARKER, JS_BLOCK + "\n    function escHtml(s) {", 1)
    if "effectiveForDayV223" not in text:
        text = text.replace(
            "    var PREVIEW_COLORS = { base: '#93c5fd', special: '#fbbf24', none: '#d1d5db' };",
            JS_PREVIEW_PATCH,
            1,
        )
        text = text.replace(
            "        var eff = effectiveForDay(account, d);",
            "        var eff = effectiveForDayV223(account, d);",
            1,
        )
        text = text.replace(
            """      var typ = eff.type === 'special' ? '特殊' : (eff.type === 'base' ? '基础' : '无规则');
      if (eff.type === 'none') {
        return r0 + '~' + r1 + ' · ' + typ;
      }
      return r0 + '~' + r1 + ' · ' + eff.rate + '% · ' + typ;""",
            """      var typ = eff.label || '无规则';
      if (eff.type === 'none') {
        return r0 + '~' + r1 + ' · ' + typ;
      }
      return r0 + '~' + r1 + ' · ' + eff.rate + '% · ' + typ;""",
            1,
        )
        text = text.replace(
            """      return accName + ' ' + formatYmdIso(start) + '~' + formatYmdIso(end) + ' · ' + (eff.type === 'none' ? '无规则' : (eff.type === 'special' ? '特殊吐点' : '基础吐点') + ' ' + eff.rate + '%' + (eff.seg && eff.seg.id ? ' · 段 ' + eff.seg.id : ''));""",
            """      return accName + ' ' + formatYmdIso(start) + '~' + formatYmdIso(end) + ' · ' + (eff.type === 'none' ? (eff.warn ? '缺少账户属性' : '无规则') : (eff.label || '') + ' ' + eff.rate + '%');""",
            1,
        )
        text = text.replace(
            """          var col = bar.eff.type === 'special' ? PREVIEW_COLORS.special : (bar.eff.type === 'base' ? PREVIEW_COLORS.base : PREVIEW_COLORS.none);""",
            """          var col = bar.eff.type === 'l3' ? PREVIEW_COLORS.l3 : (bar.eff.type === 'l2' ? PREVIEW_COLORS.l2 : (bar.eff.type === 'l1' ? PREVIEW_COLORS.l1 : PREVIEW_COLORS.none));""",
            1,
        )
        text = text.replace(
            """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.special + '"></span>特殊吐点</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.base + '"></span>基础吐点</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';""",
            """        leg.innerHTML = '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l3 + '"></span>账户特殊 (L3)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l2 + '"></span>客户独立 (L2-Full)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.l1 + '"></span>介绍人默认 (L1)</span>' +
          '<span class="inline-flex items-center gap-1"><span class="inline-block h-2 w-4 rounded" style="background:' + PREVIEW_COLORS.none + '"></span>无规则</span>';""",
            1,
        )
    # accounts with media/type
    text = text.replace(
        "{ id: 'act-111', name: 'FB-US-111', label: '当前绑定'",
        "{ id: 'act-111', name: 'FB-US-111', media: 'Meta', accountType: '企业户', label: '当前绑定'",
        1,
    )
    text = text.replace(
        "{ id: 'act-222', name: 'GG-UK-222', label: '当前绑定'",
        "{ id: 'act-222', name: 'GG-UK-222', media: 'Google', accountType: '企业户', label: '当前绑定'",
        1,
    )
    text = text.replace(
        "{ id: 'act-333', name: 'TT-SG-333', label: '历史绑定'",
        "{ id: 'act-333', name: 'TT-SG-333', media: 'TikTok', accountType: '三不限', label: '历史绑定'",
        1,
    )
    text = text.replace(
        "showToast('已进入吐点规则 (基础吐点 / 特殊吐点 / 生效预览)');",
        "currentRelationScheme = tr.getAttribute('data-spit-scheme') || 'inherit'; syncRelationSchemeUi(); showToast('已进入吐点规则 (L2-Full / L3 / 生效预览)');",
        1,
    )
    text = text.replace(
        """      if (rate.value === '' || Number(rate.value) < 0 || Number(rate.value) > 100) {
        showToast('基础吐点比例需在 0~100% 之间 (可填 0)', 'error');
        return;
      }
      closeModal('modal-add-binding');
      showToast('已保存关系 + 基础吐点 (原型); 生效预览将随保存刷新 (PRD 6.2)');""",
        """      var schemeEl = document.querySelector('input[name="add-binding-scheme"]:checked');
      var scheme = schemeEl ? schemeEl.value : 'inherit';
      closeModal('modal-add-binding');
      showToast('已保存关系, 吐点方案: ' + (scheme === 'independent' ? '客户独立方案' : '继承介绍人默认') + ' (原型)');""",
        1,
    )
    text = text.replace(
        "function initSpitRulePage() {\n      renderBaseSegmentTable();\n      renderSpecialAccounts();\n      renderPreviewGantt();\n    }",
        "function initSpitRulePage() {\n      syncRelationSchemeUi();\n      renderSpecialAccounts();\n      renderPreviewGantt();\n    }",
        1,
    )
    HTML.write_text(text, encoding="utf-8")
    print("patched", HTML)


if __name__ == "__main__":
    main()
