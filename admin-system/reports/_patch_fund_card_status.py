#!/usr/bin/env python3
"""Patch PRD v0.9 Fund 调信用卡失败 + recharge/deduct/clear HTML."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PRD = ROOT / "PRD/V 2.21 绑卡户调用Slash卡接口完成充值.md"

PRD_REPLACEMENTS = [
    (
        "原「状态」筛选下拉扩展绑卡户 5 个细分态",
        "原「状态」筛选下拉扩展绑卡户 4 个细分态",
    ),
    (
        "全部 / 充值中 / 待人工处理 / 完成 / 失败 / 待 Fund 调额 / Fund 调额成功 / 待媒体后台调整 / 已完成 / 已取消；选项与列表「状态」列枚举一一对应",
        "全部 / 充值中 / 待人工处理 / 完成 / 失败 / 待 Fund 调额 / Fund 调信用卡失败 / 待媒体后台调整 / 已完成 / 已取消；选项与列表「状态」列枚举一一对应",
    ),
    (
        "非绑卡户分支保留 `充值中 / 待人工处理 / 完成 / 失败`；绑卡户分支新增 `待 Fund 调额 / Fund 调额成功 / 待媒体后台调整 / 已完成 / 已取消`；`失败` 在两类充值单中复用同一枚举值",
        "非绑卡户分支保留 `充值中 / 待人工处理 / 完成 / 失败`；绑卡户分支新增 `待 Fund 调额 / Fund 调信用卡失败 / 待媒体后台调整 / 已完成 / 已取消`；绑卡户 Fund 调卡失败使用「Fund 调信用卡失败」, 不复用非绑卡户「失败」",
    ),
    (
        "绑卡户充值单展示绑卡户细分态 `待 Fund 调额 / Fund 调额成功 / 待媒体后台调整 / 已完成 / 失败 / 已取消`；颜色规则：进行中类灰色，成功/已完成绿色，失败/已取消红色",
        "绑卡户充值单展示绑卡户细分态 `待 Fund 调额 / Fund 调信用卡失败 / 待媒体后台调整 / 已完成 / 已取消`；颜色规则：进行中类灰色，成功/已完成绿色，Fund 调信用卡失败/已取消红色",
    ),
    (
        "| 作用   | Fund 调额失败时，重新触发一次 Fund 调额              |\n| 入口   | 列表行内「重试」按钮，仅在状态为「失败」时显示                |",
        "| 作用   | Fund 调信用卡失败时，重新触发一次 Fund 调信用卡              |\n| 入口   | 列表行内「重试」按钮，仅在绑卡户充值单状态为「Fund 调信用卡失败」时显示                |",
    ),
    (
        "| 作用   | Fund 调额持续失败或业务决定不再处理时，关闭该充值单             |\n| 入口   | 列表行内「人工取消」按钮，仅在状态为「失败」时显示                |",
        "| 作用   | Fund 调信用卡持续失败或业务决定不再处理时，关闭该充值单             |\n| 入口   | 列表行内「人工取消」按钮，仅在绑卡户充值单状态为「Fund 调信用卡失败」时显示                |",
    ),
    (
        "| 交互   | 抽屉/弹窗显示：充值单号、账户、金额、币种、使用卡、Fund 单号、卡当前可用额度、状态时间线（各状态进入时间和操作人） |",
        "| 交互   | 抽屉/弹窗显示：充值单号、账户、金额、币种、使用卡、Fund 单号、卡当前可用额度、状态时间线（各状态进入时间和操作人）。列表主状态不含「Fund 调额成功」；时间线可记录 Fund 调信用卡成功等系统事件 |",
    ),
    (
        "绑卡户态 `减款中 / 待 Fund 降额 / Fund 失败 / 完成 / 失败`",
        "绑卡户态 `减款中 / 待 Fund 降额 / Fund 调信用卡失败 / 完成 / 失败`",
    ),
    (
        "绑卡户: `减款中 / 待 Fund 降额 / Fund 失败 / 完成 / 失败`",
        "绑卡户: `减款中 / 待 Fund 降额 / Fund 调信用卡失败 / 完成 / 失败`",
    ),
    (
        "颜色: 进行中灰/黄, 完成绿, 失败/Fund 失败红",
        "颜色: 进行中灰/黄, 完成绿, 失败/Fund 调信用卡失败红",
    ),
    (
        "### Fund 失败重试",
        "### Fund 调信用卡失败重试",
    ),
    (
        "仅在状态「Fund 失败」时显示",
        "仅在状态「Fund 调信用卡失败」时显示",
    ),
    (
        "列表/详情/媒体已完成弹窗/Fund 失败操作前",
        "列表/详情/媒体已完成弹窗/Fund 调信用卡失败操作前",
    ),
    (
        "| 5 | Fund 失败(含卡侧安全底线) | Fund 失败详情 | 使用卡降额失败。可重试或选择「忽略并完成」(仅加钱包, 不降卡)。 | 否 |",
        "| 5 | Fund 调信用卡失败(含卡侧安全底线) | Fund 调信用卡失败详情 | 使用卡调信用卡失败。可重试或选择「忽略并完成」(仅加钱包, 不调卡)。 | 否 |",
    ),
    (
        "绑卡户: `清零中 / 待 Fund 降额 / Fund 失败 / 完成 / 失败`",
        "绑卡户: `清零中 / 待 Fund 降额 / Fund 调信用卡失败 / 完成 / 失败`",
    ),
    (
        "| 入口 | 状态「Fund 失败」 |",
        "| 入口 | 状态「Fund 调信用卡失败」 |",
    ),
    (
        "| 作用 | Fund 降卡失败后重新发起降额 |",
        "| 作用 | Fund 调信用卡失败后重新发起降卡 |",
    ),
]

RECHARGE_FILES = [
    ROOT / "admin-system/fb-business/recharge-management.html",
    ROOT / "admin-system/google-business/recharge-management.html",
    ROOT / "admin-system/other-media-business/recharge-management.html",
]

DEDUCT_CLEAR_FILES = [
    ROOT / "admin-system/fb-business/deduction-management.html",
    ROOT / "admin-system/google-business/deduction-management.html",
    ROOT / "admin-system/fb-business/clear-management.html",
    ROOT / "admin-system/google-business/clear-management.html",
    ROOT / "admin-system/other-media-business/clear-management.html",
]

RECHARGE_REPLACEMENTS = [
    (
        '<option value="Fund 调额成功">Fund 调额成功</option>\n',
        '<option value="Fund 调信用卡失败">Fund 调信用卡失败</option>\n',
    ),
    (
        "//   绑卡户:   待 Fund 调额 / Fund 调额成功 / 待媒体后台调整 / 已完成 / 失败 / 已取消",
        "//   绑卡户:   待 Fund 调额 / Fund 调信用卡失败 / 待媒体后台调整 / 已完成 / 已取消",
    ),
    (
        "status:'Fund 调额成功'",
        "status:'待媒体后台调整'",
    ),
    (
        "'Fund 调额成功': 'bg-gray-100 text-gray-700',\n",
        "'Fund 调信用卡失败': 'bg-red-100 text-red-700',\n",
    ),
    (
        "} else if (item.status === '失败') {",
        "} else if (item.status === 'Fund 调信用卡失败') {",
    ),
    (
        "        agent:'钱一代', amount:1200, status:'待媒体后台调整', completeTime:'', remark:'-',\n"
        "        isBindCardAccount:true, activeCardId:'c_w9x8y7z6v5u4t3', activeCardLast4:'5678',\n"
        "        fundOrderNo:'FUND20240607094520', cardAvailableLimit:1500,\n"
        "        statusTimeline:[\n"
        "          { status:'待 Fund 调额', time:'2024-06-07 09:45:01', operator:'系统' },\n"
        "          { status:'Fund 调额成功', time:'2024-06-07 09:45:38', operator:'系统' }\n"
        "        ] },",
        "        agent:'钱一代', amount:1200, status:'待媒体后台调整', completeTime:'', remark:'等待业务到媒体后台调整',\n"
        "        isBindCardAccount:true, activeCardId:'c_w9x8y7z6v5u4t3', activeCardLast4:'5678',\n"
        "        fundOrderNo:'FUND20240607094520', cardAvailableLimit:1500,\n"
        "        statusTimeline:[\n"
        "          { status:'待 Fund 调额', time:'2024-06-07 09:45:01', operator:'系统' },\n"
        "          { status:'Fund 调信用卡成功', time:'2024-06-07 09:45:38', operator:'系统' },\n"
        "          { status:'待媒体后台调整', time:'2024-06-07 09:45:38', operator:'系统' }\n"
        "        ] },",
    ),
    (
        "{ status:'Fund 调额成功', time:",
        "{ status:'Fund 调信用卡成功', time:",
    ),
    (
        "        agent:'周一代', amount:900, status:'失败', completeTime:'', remark:'Fund 回调超时',\n"
        "        isBindCardAccount:true, activeCardId:'c_h7j8k9l0m1n2o3', activeCardLast4:'3456',\n"
        "        fundOrderNo:'FUND20240606080010', cardAvailableLimit:200,\n"
        "        statusTimeline:[\n"
        "          { status:'待 Fund 调额', time:'2024-06-06 08:00:10', operator:'系统' },\n"
        "          { status:'失败', time:'2024-06-06 08:05:11', operator:'系统' }\n"
        "        ] },",
        "        agent:'周一代', amount:900, status:'Fund 调信用卡失败', completeTime:'', remark:'Fund 回调超时',\n"
        "        isBindCardAccount:true, activeCardId:'c_h7j8k9l0m1n2o3', activeCardLast4:'3456',\n"
        "        fundOrderNo:'FUND20240606080010', cardAvailableLimit:200,\n"
        "        statusTimeline:[\n"
        "          { status:'待 Fund 调额', time:'2024-06-06 08:00:10', operator:'系统' },\n"
        "          { status:'Fund 调信用卡失败', time:'2024-06-06 08:05:11', operator:'系统' }\n"
        "        ] },",
    ),
    (
        "          { status:'失败', time:'2024-06-03 10:10:10', operator:'系统' },\n"
        "          { status:'已取消', time:'2024-06-03 10:45:00', operator:'郑十一' }",
        "          { status:'Fund 调信用卡失败', time:'2024-06-03 10:10:10', operator:'系统' },\n"
        "          { status:'已取消', time:'2024-06-03 10:45:00', operator:'郑十一' }",
    ),
    (
        "        remark:'多次 Fund 调额失败, 业务取消',",
        "        remark:'多次 Fund 调信用卡失败, 业务取消',",
    ),
    (
        """        // 模拟 3 秒后 Fund 回调成功 -> Fund 调额成功 -> 待媒体后台调整
        setTimeout(() => {
          if (item.status !== '待 Fund 调额') return;
          item.status = 'Fund 调额成功';
          item.statusTimeline.push({ status:'Fund 调额成功', time:nowStr(), operator:'系统' });
          renderTable();
          setTimeout(() => {
            if (item.status !== 'Fund 调额成功') return;
            item.status = '待媒体后台调整';
            item.statusTimeline.push({ status:'待媒体后台调整', time:nowStr(), operator:'系统' });
            renderTable();
          }, 100);
        }, 3000);""",
        """        // 模拟 3 秒后 Fund 回调成功 -> 直进待媒体后台调整
        setTimeout(() => {
          if (item.status !== '待 Fund 调额') return;
          item.statusTimeline.push({ status:'Fund 调信用卡成功', time:nowStr(), operator:'系统' });
          item.status = '待媒体后台调整';
          item.statusTimeline.push({ status:'待媒体后台调整', time:nowStr(), operator:'系统' });
          renderTable();
        }, 3000);""",
    ),
    (
        """      if (failed) {
        item.status = '失败';
        item.statusTimeline.push({ status: '失败', time: nowStr(), operator: '系统' });
      } else {
        item.status = 'Fund 调额成功';
        item.statusTimeline.push({ status: 'Fund 调额成功', time: nowStr(), operator: '系统' });
        renderTable();
        setTimeout(() => {
          if (item.status !== 'Fund 调额成功') return;
          item.status = '待媒体后台调整';
          item.statusTimeline.push({ status: '待媒体后台调整', time: nowStr(), operator: '系统' });
          renderTable();
        }, 100);
        return;
      }""",
        """      if (failed) {
        item.status = 'Fund 调信用卡失败';
        item.statusTimeline.push({ status: 'Fund 调信用卡失败', time: nowStr(), operator: '系统' });
      } else {
        item.statusTimeline.push({ status: 'Fund 调信用卡成功', time: nowStr(), operator: '系统' });
        item.status = '待媒体后台调整';
        item.statusTimeline.push({ status: '待媒体后台调整', time: nowStr(), operator: '系统' });
      }""",
    ),
]

DEDUCT_CLEAR_REPLACEMENTS = [
    ('<option value="Fund 失败">Fund 失败</option>', '<option value="Fund 调信用卡失败">Fund 调信用卡失败</option>'),
    ("'Fund 失败': 'bg-red-100 text-red-700'", "'Fund 调信用卡失败': 'bg-red-100 text-red-700'"),
    ("status:'Fund 失败'", "status:'Fund 调信用卡失败'"),
    ("status:'Fund 失败'", "status:'Fund 调信用卡失败'"),
    ("it.status === 'Fund 失败'", "it.status === 'Fund 调信用卡失败'"),
    ("it.status = 'Fund 失败'", "it.status = 'Fund 调信用卡失败'"),
    ("pushTimeline(it, 'Fund 失败')", "pushTimeline(it, 'Fund 调信用卡失败')"),
]


def apply_replacements(path: Path, replacements: list[tuple[str, str]]) -> int:
    text = path.read_text(encoding="utf-8")
    original = text
    for old, new in replacements:
        if old not in text:
            continue
        text = text.replace(old, new)
    if text != original:
        path.write_text(text, encoding="utf-8")
        return 1
    return 0


def main() -> None:
    changed = []
    if apply_replacements(PRD, PRD_REPLACEMENTS):
        changed.append(str(PRD))

    for fp in RECHARGE_FILES:
        if apply_replacements(fp, RECHARGE_REPLACEMENTS):
            changed.append(str(fp))

    for fp in DEDUCT_CLEAR_FILES:
        if apply_replacements(fp, DEDUCT_CLEAR_REPLACEMENTS):
            changed.append(str(fp))

    print("Updated files:")
    for p in changed:
        print(" -", p)
    if not changed:
        print("(no changes applied)")


if __name__ == "__main__":
    main()
