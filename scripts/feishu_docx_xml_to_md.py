#!/usr/bin/env python3
"""Convert Lark/Feishu docx XML fragment (from lark-cli docs +fetch JSON) to Markdown."""

from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from html import unescape


def local_tag(tag: str) -> str:
    if tag.startswith("{"):
        return tag.split("}", 1)[-1]
    return tag


def plain_text(el: ET.Element) -> str:
    parts: list[str] = []
    if el.text:
        parts.append(el.text)
    for ch in el:
        parts.append(plain_text(ch))
        if ch.tail:
            parts.append(ch.tail)
    return "".join(parts)


def inline_md(el: ET.Element) -> str:
    """Inline runs inside <p>/<th>/<td>. Per-char <b> from Feishu would yield broken `**`; flatten <b> to plain text."""
    out: list[str] = []
    if el.text:
        out.append(unescape(el.text))
    for ch in el:
        t = local_tag(ch.tag)
        if t == "b":
            out.append(plain_text(ch))
        elif t == "code":
            out.append(f"`{plain_text(ch)}`")
        else:
            out.append(inline_md(ch))
        if ch.tail:
            out.append(unescape(ch.tail))
    return "".join(out).strip()


def render_nested_ul(ul: ET.Element, indent: int) -> list[str]:
    lines: list[str] = []
    for li in ul:
        if local_tag(li.tag) != "li":
            continue
        lines.extend(render_li(li, indent))
    return lines


def render_li(li: ET.Element, indent: int) -> list[str]:
    """One <li>: may be text-only, or <p>..., or `text <ul>...</ul>`, or `<p>...</p><ul>`."""
    pad = "  " * indent
    lines: list[str] = []
    prefix = (li.text or "").strip()
    subs = list(li)

    if not subs:
        if prefix:
            lines.append(f"{pad}- {prefix}\n")
        return lines

    chunks: list[str] = []
    for ch in subs:
        ct = local_tag(ch.tag)
        if ct == "p":
            chunks.append(inline_md(ch))
        elif ct == "code":
            chunks.append(f"`{plain_text(ch)}`")
        elif ct == "ul":
            label_parts: list[str] = []
            if prefix:
                label_parts.append(prefix)
                prefix = ""
            label_parts.extend(chunks)
            chunks = []
            label = " ".join(x for x in label_parts if x).strip()
            if label:
                lines.append(f"{pad}- {label}\n")
            lines.extend(render_nested_ul(ch, indent + 1))
        else:
            lines.extend(render_block(ch))

    tail_parts = ([prefix] if prefix else []) + chunks
    label = " ".join(x for x in tail_parts if x).strip()
    if label:
        lines.append(f"{pad}- {label}\n")
    return lines


def render_block(el: ET.Element) -> list[str]:
    t = local_tag(el.tag)
    lines: list[str] = []

    if t == "title":
        return [f"# {plain_text(el)}\n"]
    if t in ("h1", "h2", "h3", "h4", "h5", "h6"):
        n = int(t[1])
        return ["#" * n + " " + plain_text(el) + "\n"]
    if t == "p":
        s = inline_md(el)
        return [s + "\n"] if s else ["\n"]
    if t == "ul":
        for li in el:
            if local_tag(li.tag) != "li":
                continue
            lines.extend(render_li(li, indent=0))
        lines.append("")
        return lines
    if t == "li":
        return render_li(el, indent=0)
    if t == "blockquote":
        inner: list[str] = []
        for ch in el:
            inner.extend(render_block(ch))
        for L in inner:
            if L.strip():
                lines.append("> " + L.strip() + "\n")
        lines.append("")
        return lines
    if t == "hr":
        return ["\n---\n\n"]
    if t == "pre":
        lang = el.get("lang") or ""
        code_el = None
        for ch in el:
            if local_tag(ch.tag) == "code":
                code_el = ch
                break
        body = plain_text(code_el) if code_el is not None else plain_text(el)
        body = body.replace("\r\n", "\n").replace("\r", "\n")
        fence = lang.strip() if lang else ""
        if fence.lower() in ("plain text", "plaintext", ""):
            b0 = body.lstrip()
            if b0.startswith(
                ("flowchart", "sequenceDiagram", "erDiagram", "stateDiagram", "stateDiagram-v2", "gantt")
            ):
                fence = "mermaid"
        return [f"\n```{fence}\n{body.rstrip()}\n```\n\n"]
    if t == "readonly-block":
        return []
    if t == "sheet":
        sid = el.get("sheet-id", "")
        tok = el.get("token", "")
        return [f"\n> [飞书嵌入电子表格] `sheet-id={sid}` `token={tok}`\n\n"]
    if t == "table":
        rows: list[list[str]] = []
        for tr in el.iter():
            if local_tag(tr.tag) != "tr":
                continue
            cells: list[str] = []
            for cell in tr:
                ct = local_tag(cell.tag)
                if ct not in ("td", "th"):
                    continue
                cells.append(inline_md(cell).replace("\n", " ").replace("|", "\\|"))
            if cells:
                rows.append(cells)
        if not rows:
            return []
        ncol = max(len(r) for r in rows)
        pad = [r + [""] * (ncol - len(r)) for r in rows]
        lines.append("\n| " + " | ".join(pad[0]) + " |\n")
        lines.append("| " + " | ".join(["---"] * ncol) + " |\n")
        for r in pad[1:]:
            lines.append("| " + " | ".join(r) + " |\n")
        lines.append("\n")
        return lines

    for ch in el:
        lines.extend(render_block(ch))
    return lines


def main() -> None:
    src = sys.argv[1] if len(sys.argv) > 1 else "-"
    if src == "-":
        data = json.load(sys.stdin)
    else:
        with open(src, "r", encoding="utf-8") as f:
            data = json.load(f)
    content = data.get("data", {}).get("document", {}).get("content")
    if not content:
        print("No data.document.content", file=sys.stderr)
        sys.exit(1)
    content = content.replace("<br/>", "\n").replace("<br>", "\n")
    wrapped = f"<root>{content}</root>"
    try:
        root = ET.fromstring(wrapped)
    except ET.ParseError as e:
        print("XML parse error:", e, file=sys.stderr)
        sys.exit(2)
    out: list[str] = []
    for ch in root:
        out.extend(render_block(ch))
    text = "".join(out)
    text = re.sub(r"\n{3,}", "\n\n", text)
    sys.stdout.write(text.rstrip() + "\n")


if __name__ == "__main__":
    main()
