#!/usr/bin/env python3
"""Finish UX v0.45: minor copy, delete period rules, PRD + log."""
from pathlib import Path

HTML = Path(__file__).resolve().parents[1] / "main-functions/introducer-spitpoint.html"
PRD = Path(__file__).resolve().parents[2] / "PRD/V 2.23 介绍人和吐点（第二版）.md"
LOG = Path(__file__).resolve().parents[2] / "log.md"

text = HTML.read_text(encoding="utf-8")
repls = [
    ("删除该 L2 时间分段? (原型)", "删除该时间段? (原型)"),
    ("showToast('已删除 L2 时间分段');", "showToast('已删除时间段');"),
    ("showToast('已保存关系并创建首段 L2 时间分段 (原型)", "showToast('已保存关系并创建首段时间段 (原型)"),
    ("V2.23 v0.4: L1 特殊吐点 / L2 客户基础 / L3 介绍人吐点", "V2.23: 介绍人吐点规则 / 客户吐点规则 / 特殊吐点"),
]
for a, b in repls:
    text = text.replace(a, b)

# Delete period: also remove rules bucket
old_del = """          customerBasePeriodStore[relId] = (customerBasePeriodStore[relId] || []).filter(function (x) { return x.id !== sid; });
          syncRelationSpitUi();"""
new_del = """          customerBasePeriodStore[relId] = (customerBasePeriodStore[relId] || []).filter(function (x) { return x.id !== sid; });
          if (customerBaseRuleStore[relId] && customerBaseRuleStore[relId][sid]) {
            delete customerBaseRuleStore[relId][sid];
          }
          syncRelationSpitUi();"""
if old_del in text and "delete customerBaseRuleStore" not in text:
    text = text.replace(old_del, new_del)

HTML.write_text(text, encoding="utf-8")
print("HTML finish OK")

# PRD v0.45
prd = PRD.read_text(encoding="utf-8")
if "| 0.45 |" not in prd:
    prd = prd.replace(
        "| 0.4 | 2026-05-30 | M | - | 待定 | **简化三层模型**",
        "| 0.45 | 2026-05-30 | M | - | 待定 | **业务文案与交互**： 「矩阵」→「规则」； 「计价模式」→「规则类型」； 关系列表仅保留「规则类型」； 客户基础规则并入时间段「设置规则」弹窗 | 降低运营学习成本 |\n| 0.4 | 2026-05-30 | M | - | 待定 | **简化三层模型**",
    )

# Tab B section block replace
old_tab = """- **关系列表**： 关系信息 + L2 分段数、L2 矩阵段数、L1 特殊条数。
- **吐点规则子页**： 关系头 + **L2 客户基础时间分段** + **L2 客户基础矩阵** + **L1 特殊吐点** + **生效预览**。

### 筛选字段

与 V2.20 一致； 增加 **L2 计价模式** 筛选（全部 / 使用介绍人吐点 / 客户基础吐点）。

### 列表字段

| 字段 | 说明 |
| --- | --- |
| 关系生效期 | 同 V2.20 |
| 当前 L2 模式摘要 | 如「Q1 介绍人吐点 → Q2 客户基础」 |
| L2 时间分段数 | Enabled 分段条数 |
| L2 矩阵段数 | 客户基础矩阵 Enabled 条数 |
| L1 特殊条数 | 同前 |"""

new_tab = """- **关系列表**： 关系信息 + **规则类型** 摘要（如「介绍人吐点 → 客户基础」； 含「待设置规则」提示）。
- **吐点规则子页**： 关系头 + **客户吐点规则（时间段 + 设置规则）** + **特殊吐点** + **生效预览**。

### 筛选字段

与 V2.20 一致； 增加 **规则类型** 筛选（全部 / 使用介绍人吐点 / 客户基础吐点）。

### 列表字段

| 字段 | 说明 |
| --- | --- |
| 关系生效期 | 同 V2.20 |
| 规则类型 | 当前关系 L2 时间段规则类型摘要； 若存在「客户基础吐点」段且未配置规则， 展示「待设置规则」 |
| 当前状态 | 同 V2.20 |
| 操作 | 「吐点规则」 |"""

if old_tab in prd:
    prd = prd.replace(old_tab, new_tab)

old_fn = """| 首段 L2 计价模式 | 单选：`使用介绍人吐点` / `客户基础吐点`； 保存时创建首条 L2 时间分段， 起日=关系生效开始 |
| 首段为「客户基础吐点」 | 保存后引导配置 L2 矩阵（至少一段， 允许 0%） |

#### L2 客户基础时间分段

| 字段 | 说明 |
| --- | --- |
| 计价模式 | `使用介绍人吐点` / `客户基础吐点` |
| 生效开始/结束 | 同矩阵分段； 长期有效可选 |
| 配置状态 | 启用/停用 |

**校验**： 同一关系 Enabled 分段时间不重叠； 建议覆盖关系有效期； 空档日预览标黄。

**交互**： 模式=`客户基础吐点` 时， 展示或跳转 **L2 矩阵** 维护区； 模式=`使用介绍人吐点` 时， 无需矩阵。

#### L2 客户基础矩阵

| 项目 | 说明 |
| --- | --- |
| 作用 | 仅在存在 **客户基础吐点** 的 L2 分段生效期内参与结算 |
| 字段 | 媒体、账户类型、吐点比例、生效起止、启用/停用（**同 L3**） |
| 校验 | 同 L3； 矩阵行生效期 **建议落在** 对应 L2 分段内 |"""

new_fn = """| 首段规则类型 | 单选：`使用介绍人吐点` / `客户基础吐点`； 保存时创建首条时间段， 起日=关系生效开始 |
| 首段为「客户基础吐点」 | 保存后进入吐点规则， 对该时间段点击 **设置规则** |

#### 客户吐点规则（时间段）

| 字段 | 说明 |
| --- | --- |
| 规则类型 | `使用介绍人吐点` / `客户基础吐点` |
| 生效开始/结束 | 同吐点规则分段； 长期有效可选 |
| 配置状态 | 启用/停用 |
| 操作 | 规则类型=`客户基础吐点` 时展示 **设置规则**； 打开弹窗维护该段时间内的媒体×账户类型规则 |

**校验**： 同一关系 Enabled 分段时间不重叠； 建议覆盖关系有效期； 空档日预览标黄。

**交互**： 规则类型=`使用介绍人吐点` 时无需设置规则； `客户基础吐点` 时通过 **设置规则** 弹窗维护（不再单独展示矩阵区块）。

#### 客户基础吐点规则（弹窗内）

| 项目 | 说明 |
| --- | --- |
| 作用 | 绑定在某一 **客户基础吐点** 时间段下； 仅在该段生效期内参与结算 |
| 字段 | 媒体、账户类型、吐点比例、生效起止、启用/停用（**同介绍人吐点规则**） |
| 校验 | 同介绍人吐点规则； 规则生效期 **建议落在** 对应时间段内 |"""

if old_fn in prd:
    prd = prd.replace(old_fn, new_fn)

# Introducer list line
prd = prd.replace(
    "操作 **「介绍人吐点」** 进入 L3 矩阵子页（媒体、账户类型、比例、起止、启用/停用）。 校验： 同介绍人同 media×type 的 Enabled 段不重叠。",
    "操作 **「介绍人吐点」** 进入介绍人吐点规则子页（媒体、账户类型、比例、起止、启用/停用）。 列表展示 **介绍人吐点规则条数**。 校验： 同介绍人同 media×type 的 Enabled 段不重叠。",
)

PRD.write_text(prd, encoding="utf-8")
print("PRD OK")

log = LOG.read_text(encoding="utf-8")
entry = """#### 2026-05-30 - V2.23 介绍人和吐点 v0.45（业务文案与交互）

**PRD** `PRD/V 2.23 介绍人和吐点（第二版）.md` (v0.45):
- 「矩阵」→「规则」；「计价模式」→「规则类型」；介绍人列表列「介绍人吐点规则条数」。
- 关系列表仅保留「规则类型」列（去掉分段数/规则条数/特殊条数）；待配置时展示「待设置规则」。
- 吐点规则子页：客户基础规则并入时间段，「客户基础吐点」行操作「设置规则」弹窗维护。

**HTML** `admin-system/main-functions/introducer-spitpoint.html`: 与 PRD 对齐；`customerBaseRuleStore` 按时间段挂载规则。

---

"""
if "v0.45（业务文案与交互）" not in log:
    LOG.write_text(entry + log, encoding="utf-8")
    print("log OK")
else:
    print("log skip")
