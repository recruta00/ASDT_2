"""
build_plan.py — render the Da Lat business-plan markdown docs into a single
self-contained, static, responsive business-plan.html (no JS required to read).
Run:  python3 build_plan.py
"""
import os
import build  # reuse build._md_to_html

ROOT = os.path.dirname(os.path.abspath(__file__))
BP = os.path.join(ROOT, "business-plan")

SECTIONS = [
    ("plan", "📋 Business Plan", "BUSINESS_PLAN_DALAT.md"),
    ("setup", "🏛️ Company · Licenses · Tax", "COMPANY_SETUP_VIETNAM.md"),
    ("ops", "⚙️ Operations Playbook", "OPERATIONS_PLAYBOOK.md"),
    ("c1", "📄 Contract: Master Lease", os.path.join("contracts", "01_master_lease.md")),
    ("c2", "📄 Contract: Landlord Consent", os.path.join("contracts", "02_landlord_consent_addendum.md")),
    ("c3", "📄 Contract: Guest Terms", os.path.join("contracts", "03_guest_terms_house_rules.md")),
]

CSS = """
:root{--bg:#0f1720;--card:#18222e;--line:#2a3948;--ink:#e8eef4;--muted:#94a6b8;--accent:#22c55e;--accent2:#38bdf8;--chip:#243244}
@media (prefers-color-scheme: light){:root{--bg:#f4f7fa;--card:#fff;--line:#dce4ec;--ink:#0f2233;--muted:#5a6b7b;--chip:#eef3f8}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:900px;margin:0 auto;padding:0 16px 80px}
header{padding:26px 16px;border-bottom:1px solid var(--line);background:linear-gradient(160deg,rgba(56,189,248,.10),rgba(34,197,94,.06))}
header .wrap{padding-bottom:0}
h1{font-size:24px;margin:0 0 4px}
nav{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch}
nav::-webkit-scrollbar{display:none}
nav .wrap{padding:8px 16px;display:flex;gap:6px}
nav a{flex:0 0 auto;color:var(--muted);text-decoration:none;font-size:13px;padding:8px 12px;border-radius:8px}
nav a:active,nav a:hover{background:var(--chip);color:var(--ink)}
section{border-bottom:1px solid var(--line);padding:8px 0 24px}
.md h1{font-size:22px;margin:24px 0 8px}
.md h2{font-size:18px;margin:20px 0 8px}
.md h3{font-size:15px;margin:16px 0 6px}
.md p{margin:8px 0}
.md ul{margin:8px 0;padding-left:22px}
.md code{background:var(--chip);padding:1px 6px;border-radius:5px;font-size:13px}
.md blockquote,.md > p:first-child{border-left:3px solid var(--accent2);background:var(--card);padding:10px 12px;border-radius:8px;color:var(--muted);font-size:14px}
.tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px;margin:10px 0}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;white-space:nowrap}
th{background:var(--chip);color:var(--muted);position:sticky;top:0}
a{color:var(--accent2)}
.foot{color:var(--muted);font-size:12px;margin-top:24px}
@media (max-width:640px){h1{font-size:20px}.md h1{font-size:19px}}
"""


def render():
    parts = []
    for sid, title, path in SECTIONS:
        full = os.path.join(BP, path)
        if not os.path.exists(full):
            continue
        md = open(full, encoding="utf-8").read()
        html = build._md_to_html(md)
        # wrap tables for horizontal scroll on mobile
        html = html.replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
        parts.append(f'<section id="{sid}"><div class="md">{html}</div></section>')

    nav = "".join(f'<a href="#{sid}">{title}</a>' for sid, title, _ in SECTIONS)
    body = "\n".join(parts)
    doc = f"""<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0f1720" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f4f7fa" media="(prefers-color-scheme: light)">
<title>Da Lat Airbnb Business Plan</title><style>{CSS}</style></head><body>
<header><div class="wrap"><h1>🇻🇳 Da Lat Airbnb Sublease — Business Plan</h1>
<div style="color:var(--muted);font-size:14px">60-day launch plan · company setup · tax · legal contracts · operations. Not legal/tax advice — verify with a licensed Vietnamese lawyer & accountant.</div></div></header>
<nav><div class="wrap">{nav}</div></nav>
<div class="wrap">{body}
<div class="foot">Generated from the business-plan markdown docs. Interactive economics: see the dashboard. This document is research + templates for planning only.</div>
</div></body></html>"""
    out = os.path.join(ROOT, "business-plan.html")
    open(out, "w", encoding="utf-8").write(doc)
    print(f"Wrote {out} ({len(doc)//1024} KB)")


if __name__ == "__main__":
    render()
