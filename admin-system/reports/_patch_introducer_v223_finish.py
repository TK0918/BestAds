#!/usr/bin/env python3
"""Finish V2.23 introducer-spitpoint.html: matrix CRUD + cleanup broken base-segment refs."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
text = HTML.read_text(encoding="utf-8")

OLD_BLOCK = """    var btnBaseAdd = document.getElementById('btn-base-segment-add');
    if (btnBaseAdd) {
      btnBaseAdd.addEventListener('click', function () { openBaseSegmentModal(null); });
    }

    var baseSegSaveBtn = document.getElementById('base-seg-save');
    if (baseSegSaveBtn) {
      baseSegSaveBtn.addEventListener('click', function () {
      var rate = Number(document.getElementById('base-seg-rate').value);
      var start = document.getElementById('base-seg-start').value;
      var longterm = document.getElementById('base-seg-longterm').checked;
      var end = longterm ? '' : document.getElementById('base-seg-end').value;
      if (rate === '' || isNaN(rate) || rate < 0 || rate > 100) {
        showToast('比例需在 0~100% 之间', 'error');
        return;
      }
      if (!start) {
        showToast('请填写生效开始日期', 'error');
        return;
      }
      if (!longterm && !end) {
        showToast('非长期分段需填写结束日期', 'error');
        return;
      }
      var draft = { id: spitBaseEditId || uid('base'), rate: rate, start: start, end: end, longterm: longterm };
      var list = spitBaseSegments.filter(function (x) { return x.id !== spitBaseEditId; }).concat([draft]);
      var err = validateBaseSegments(list);
      if (err) {
        showToast(err, 'error');
        return;
      }
      if (spitBaseEditId) {
        var idx = spitBaseSegments.findIndex(function (x) { return x.id === spitBaseEditId; });
        if (idx >= 0) spitBaseSegments[idx] = draft;
      } else {
        spitBaseSegments.push(draft);
      }
      closeModal('modal-base-segment');
      renderBaseSegmentTable();
      renderPreviewGantt();
      showToast('基础吐点分段已保存');
    });
    }"""

NEW_BLOCK = """    var btnL1Add = document.getElementById('btn-l1-segment-add');
    if (btnL1Add) {
      btnL1Add.addEventListener('click', function () { openMatrixSegmentModal('l1', null); });
    }
    var btnL2Add = document.getElementById('btn-l2-segment-add');
    if (btnL2Add) {
      btnL2Add.addEventListener('click', function () { openMatrixSegmentModal('l2', null); });
    }

    var baseSegSaveBtn = document.getElementById('base-seg-save');
    if (baseSegSaveBtn) {
      baseSegSaveBtn.addEventListener('click', function () {
        var rate = Number(document.getElementById('base-seg-rate').value);
        var start = document.getElementById('base-seg-start').value;
        var longterm = document.getElementById('base-seg-longterm').checked;
        var end = longterm ? '' : document.getElementById('base-seg-end').value;
        var mediaEl = document.getElementById('matrix-seg-media');
        var atypeEl = document.getElementById('matrix-seg-account-type');
        var statusEl = document.getElementById('matrix-seg-status');
        var media = mediaEl ? mediaEl.value : 'Meta';
        var accountType = atypeEl ? atypeEl.value : '企业户';
        var status = statusEl && statusEl.value === 'disabled' ? 'disabled' : 'enabled';
        if (isNaN(rate) || rate < 0 || rate > 100) {
          showToast('比例需在 0~100% 之间', 'error');
          return;
        }
        if (!start) {
          showToast('请填写生效开始日期', 'error');
          return;
        }
        if (!longterm && !end) {
          showToast('非长期分段需填写结束日期', 'error');
          return;
        }
        var tgt = matrixEditContext.target;
        var editId = matrixEditContext.editId;
        var prefix = tgt === 'l1' ? 'l1' : 'l2';
        var draft = {
          id: editId || uid(prefix),
          media: media,
          accountType: accountType,
          rate: rate,
          start: start,
          end: end,
          longterm: longterm,
          status: status
        };
        var store = getMatrixStore();
        var list = store.filter(function (x) { return x.id !== editId; }).concat([draft]);
        var err = validateMatrixSegments(list, null);
        if (err) {
          showToast(err, 'error');
          return;
        }
        if (editId) {
          var idx = store.findIndex(function (x) { return x.id === editId; });
          if (idx >= 0) store[idx] = draft;
        } else {
          store.push(draft);
        }
        closeModal('modal-base-segment');
        matrixEditContext.editId = null;
        refreshMatrixViews();
        showToast((tgt === 'l1' ? 'L1 默认矩阵' : 'L2 独立矩阵') + '分段已保存');
      });
    }"""

OLD_VIEW_SPIT = """        var editBase = t.closest('.btn-base-seg-edit');
        if (editBase) {
          openBaseSegmentModal(editBase.getAttribute('data-base-id'));
          return;
        }
        var delBase = t.closest('.btn-base-seg-del');
        if (delBase) {
          var bid = delBase.getAttribute('data-base-id');
          if (!confirm('删除该基础分段? (原型)')) return;
          spitBaseSegments = spitBaseSegments.filter(function (x) { return x.id !== bid; });
          renderBaseSegmentTable();
          renderPreviewGantt();
          showToast('已删除基础分段');
          return;
        }
        var addSp = t.closest('.btn-special-add-seg');"""

NEW_VIEW_SPIT = """        var editL2 = t.closest('.btn-l2-seg-edit');
        if (editL2) {
          openMatrixSegmentModal('l2', editL2.getAttribute('data-seg-id'));
          return;
        }
        var delL2 = t.closest('.btn-l2-seg-del');
        if (delL2) {
          var sid = delL2.getAttribute('data-seg-id');
          if (!confirm('删除该 L2 矩阵分段? (原型)')) return;
          var store = getMatrixStore();
          var relId = currentRelationId || 'RB-2';
          relationL2Store[relId] = store.filter(function (x) { return x.id !== sid; });
          refreshMatrixViews();
          showToast('已删除 L2 分段');
          return;
        }
        var addSp = t.closest('.btn-special-add-seg');"""

L1_LISTENER = """
    var l1ViewEl = document.getElementById('introducer-view-l1');
    if (l1ViewEl) {
      l1ViewEl.addEventListener('click', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var editL1 = t.closest('.btn-l1-seg-edit');
        if (editL1) {
          openMatrixSegmentModal('l1', editL1.getAttribute('data-seg-id'));
          return;
        }
        var delL1 = t.closest('.btn-l1-seg-del');
        if (delL1) {
          var sid = delL1.getAttribute('data-seg-id');
          if (!currentL1IntroId || !confirm('删除该 L1 矩阵分段? (原型)')) return;
          var list = introducerL1Store[currentL1IntroId] || [];
          introducerL1Store[currentL1IntroId] = list.filter(function (x) { return x.id !== sid; });
          refreshMatrixViews();
          showToast('已删除 L1 分段');
        }
      });
    }
"""

replacements = [
    (OLD_BLOCK, NEW_BLOCK),
    (OLD_VIEW_SPIT, NEW_VIEW_SPIT),
    (
        "showToast('该账户已有特殊吐点, 请用「新增分段」', 'error');",
        "showToast('该账户已有账户特殊吐点, 请用「新增分段」', 'error');",
    ),
    (
        "showToast('特殊吐点已保存');",
        "showToast('账户特殊吐点已保存');",
    ),
    (
        "'<tbody><tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_123</td><td class=\"border px-2 py-1\">3.00%</td><td class=\"border px-2 py-1\">特殊</td><td class=\"border px-2 py-1\">2026-01-01~2026-03-31</td><td class=\"border px-2 py-1\">40,000.00</td><td class=\"border px-2 py-1\">1,200.00</td></tr></tbody></table>';",
        "'<tbody><tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_123</td><td class=\"border px-2 py-1\">3.00%</td><td class=\"border px-2 py-1\">账户特殊</td><td class=\"border px-2 py-1\">2026-01-01~2026-03-31</td><td class=\"border px-2 py-1\">40,000.00</td><td class=\"border px-2 py-1\">1,200.00</td></tr>' +\n"
        "        '<tr><td class=\"border px-2 py-1\">C-002</td><td class=\"border px-2 py-1\">act_222</td><td class=\"border px-2 py-1\">2.00%</td><td class=\"border px-2 py-1\">介绍人默认</td><td class=\"border px-2 py-1\">2026-01-01~2026-03-31</td><td class=\"border px-2 py-1\">12,000.00</td><td class=\"border px-2 py-1\">240.00</td></tr></tbody></table>';",
    ),
]

for old, new in replacements:
    if old not in text:
        raise SystemExit(f"MISSING pattern ({len(old)} chars): {old[:80]}...")
    text = text.replace(old, new, 1)

if "var l1ViewEl = document.getElementById('introducer-view-l1')" not in text:
    anchor = "    var btnAddSpecialAccount = document.getElementById('btn-add-special-account');"
    if anchor not in text:
        raise SystemExit("anchor for L1 listener not found")
    text = text.replace(anchor, L1_LISTENER + anchor, 1)

# Unbind confirm
text = text.replace(
    "历史关系/基础吐点/特殊吐点永久保留",
    "历史关系/吐点矩阵/账户特殊吐点永久保留",
)

HTML.write_text(text, encoding="utf-8")
print("OK:", HTML)
