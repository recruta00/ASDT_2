"""
build.py — assemble the self-contained dashboard.html and report.md.

Runs the model, serializes results to a JSON blob, inlines a vendored Chart.js
(so the page works fully offline), and writes:
    dashboard.html   single self-contained file (double-click to open / email)
    report.md        executive summary + ranked picks + assumptions

Usage:  python3 build.py
"""

import json
import math
import os
import re
import datetime

import model

ROOT = os.path.dirname(os.path.abspath(__file__))
VENDOR_CHARTJS = os.path.join(ROOT, "vendor", "chart.umd.min.js")
CITY_COLORS = {"Da Nang": "#38bdf8", "Ho Chi Minh City": "#22c55e", "Da Lat": "#f59e0b"}


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def sanitize(obj):
    """Recursively replace inf/-inf/nan with None so JSON is valid + finite."""
    if isinstance(obj, float):
        return obj if math.isfinite(obj) else None
    if isinstance(obj, dict):
        return {k: sanitize(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [sanitize(v) for v in obj]
    return obj


def load_text(path):
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return f.read()
    return ""


def build_payload():
    result = model.analyze()
    fx = model.get_fx()

    units = result["units"]
    by_id = {u["building_id"]: u for u in units}

    payload = {
        "generated_at": os.environ.get("BUILD_DATE", "")
                        or datetime.date.today().isoformat(),
        "fx_vnd_per_usd": fx,
        "params": result["params"],
        "markets": result["markets"],
        "units": units,
        "shortlist": [by_id[i] for i in result["shortlist"]],
        "best_apartments": [by_id[i] for i in result["best_apartments"]],
        "best_villas": [by_id[i] for i in result["best_villas"]],
        "str_comps_summary": result.get("str_comps_summary"),
        "str_comps_total": len(result.get("str_comps", [])),
        "capital_scenarios": result.get("capital_scenarios", {}),
        "analytics_md": load_text(os.path.join(model.DATA_DIR, "analytics.md")),
        "products_md": load_text(os.path.join(model.DATA_DIR, "str_products_best.md")),
    }
    return sanitize(payload)


# --------------------------------------------------------------------------
# report.md
# --------------------------------------------------------------------------
def money(x):
    if x is None:
        return "n/a"
    return f"${x:,.0f}"


def write_report(payload):
    lines = []
    A = lines.append
    A("# Vietnam Airbnb Rental-Arbitrage — Executive Report")
    A("")
    A(f"_Generated {payload['generated_at']} · FX {payload['fx_vnd_per_usd']:,.0f} VND/USD · "
      f"USD basis, VND shown alongside in the dashboard._")
    A("")
    A("**What this answers:** which specific buildings/units to lease long-term and "
      "sublet short-term across Da Nang, Da Lat, and Ho Chi Minh City for maximum "
      "**net** monthly margin — with legal viability as a hard gate.")
    A("")
    A("> Figures are marked **[sourced]** (AirROI licensed API / public rental portals) "
      "or **[estimated]** (documented assumptions). STR occupancy/ADR are sourced from "
      "the AirROI Airbnb Data API; long-term rents from FazWaz/DotProperty/Hoozing/Chotot; "
      "operating cost assumptions are estimated and centralized in `model.py`.")
    A("")

    # Headline picks
    A("## Take these — ranked shortlist")
    A("")
    A("| # | Unit | City | Type | Legal | Net/mo | Margin | Payback | Score |")
    A("|---|------|------|------|-------|-------:|-------:|--------:|------:|")
    for u in payload["shortlist"]:
        e = u["econ"]
        pb = e["payback_months"]
        pb_txt = f"{pb:.0f}mo" if pb else "—"
        A(f"| {u['rank']} | {u['building']} {u['bedrooms']}BR | {u['city']} | "
          f"{u['property_type']} | {u['legal_status']} | {money(e['net_month'])} | "
          f"{e['margin_pct']*100:.0f}% | {pb_txt} | {u['score']:.2f} |")
    A("")

    # Best villas / apartments
    for label, key in [("Best villas / houses", "best_villas"),
                       ("Best apartments", "best_apartments")]:
        A(f"### {label}")
        A("")
        for u in payload[key]:
            e = u["econ"]
            A(f"- **{u['building']} {u['bedrooms']}BR** ({u['city']}) — "
              f"{money(e['net_month'])}/mo net, {e['margin_pct']*100:.0f}% margin, "
              f"legal {u['legal_status']}. {u['rationale']}")
        A("")

    # Capital deployment
    A("## What a budget earns (capital planner)")
    A("")
    A("Greedy deployment into the best **profitable & legal** units (each consumes "
      "deposit + furnishing + setup upfront):")
    A("")
    A("| Budget | Units funded | Capital deployed | Monthly profit | Annual | Cash-on-cash |")
    A("|--------|-------------:|-----------------:|---------------:|-------:|-------------:|")
    for b in ("20000", "50000", "100000"):
        s = payload["capital_scenarios"][b]
        A(f"| {money(float(b))} | {s['units']} | {money(s['deployed'])} | "
          f"{money(s['net_month'])} | {money(s['net_year'])} | {s['cash_on_cash_pct']:.0f}% |")
    A("")
    nprofit = sum(1 for u in payload["units"]
                  if u["legal_status"] != "BLOCKED" and u["econ"]["net_month"] > 0)
    A(f"> **Only {nprofit} of {len(payload['units'])} candidate units are profitable & legal at "
      "current asking rents** — so above a small threshold, *more capital sits idle*: the binding "
      "constraint is **sourcing leases that pencil**, not money. Negotiate each lease toward its "
      "**max supportable rent** (in the dashboard leaderboard); many marginal units flip positive "
      "with a 10–15% rent cut, 36-month furnishing amortization, or premium ADR.")
    A("")

    # Per-city verdicts
    A("## Verdict by city")
    A("")
    verdicts = {
        "Da Nang": "**GO (villas).** Beach pool villas (An Bang / My Khe) are the only "
                   "comfortably profitable arbitrage; mid-market apartments are break-even "
                   "at current rent-to-ADR ratios. CONDITIONAL legal (register + 8% VAT/PIT).",
        "Ho Chi Minh City": "**GATED.** Decision 19/2026 blocks STR in residential-only "
                            "buildings — the highest-revenue villa (Thao Dien) is legally "
                            "BLOCKED. Only mixed-use / tourism-classified towers (D4 river "
                            "stock) can pass, and those are thin-margin. Verify each "
                            "building's approved use before signing.",
        "Da Lat": "**CAUTION.** Sourced occupancy is the lowest of the three markets and "
                  "short average stays inflate cleaning cost; villa/house arbitrage is "
                  "negative at current lease costs. Domestic weekend/Tet demand only. "
                  "CONDITIONAL legal.",
    }
    for city, v in verdicts.items():
        A(f"- **{city}** — {v}")
    A("")

    # Assumptions
    p = payload["params"]
    A("## Assumptions log")
    A("")
    A(f"- **Occupancy (occ_base)** = AirROI **p90** occupancy per city (excellent-operator "
      "target) [sourced]. Market average and Airbtics figures retained for context. "
      "Rental arbitrage only pencils at top-decile execution; sensitivity grids show downside.")
    A(f"- **ADR** per unit from AirROI sourced segment medians, adjusted up for premium "
      "buildings [sourced/estimated]. Market ADR percentiles sourced from AirROI.")
    A(f"- **Long-term rents** from public portals (FazWaz/DotProperty/Hoozing) [sourced] "
      "except Da Lat (thin portal inventory — [estimated], low confidence) and interpolated "
      "villa 3BR.")
    A(f"- **amort_months = {p['amort_months']}** (spec default). Furnishing+setup amortized "
      "over 18 months is conservative; extending to 36 months (typical for 2–5yr leases) "
      "roughly doubles net for marginal units — a key lever, shown in sensitivity.")
    A(f"- **platform_fee_pct = {p['platform_fee_pct']*100:.0f}%**, "
      f"**deposit = 1mo advance rent + 1mo caution ({p['deposit_months']}mo total)**, "
      f"**cleaning_per_stay = {money(p['cleaning_per_stay'])}**, "
      f"**setup_other = {money(p['setup_other_usd'])}**, mgmt_fee 15%, "
      "furnishing/utilities per-bedroom — all [estimated], centralized in `model.py`.")
    A(f"- **FX** {payload['fx_vnd_per_usd']:,.0f} VND/USD (2026 seed; override via `.env`).")
    A(f"- **Da Lat data gap** filled with sourced AirROI Lam Dong figures "
      "(occ ~39% avg, ADR ~$46); Nha Trang/Hoi An proxy retained as [estimated] contrast.")
    A(f"- **Legal:** HCMC Decision 19/2026 (eff. 2026-04-25) — STR only where approved "
      "building use permits + host registered. Da Nang/Da Lat CONDITIONAL (register + "
      "fire-safety + 8% VAT/PIT). BLOCKED units excluded from shortlist.")
    A(f"- **Compliance note:** 0% of {payload['str_comps_total']} sampled live listings were "
      "registered — a market-wide gap and a moat for a compliant operator.")
    A("")
    A("## Data sources")
    A("- **STR occupancy/ADR/revenue + comparable listings:** AirROI Airbnb Data API "
      "(licensed) — https://www.airroi.com/api")
    A("- **Long-term rents:** FazWaz.vn, DotProperty.com.vn, Hoozing, Chotot, MySaigonCity")
    A("- **No Airbnb live-site or calendar scraping** (ToS). Availability modeled from "
      "sourced market occupancy. Facebook Marketplace not used (auth-gated + ToS).")
    A("")
    A("_See `data/analytics.md` for the full 684-listing market analytics, and open "
      "`dashboard.html` for the interactive leaderboard, charts, and best-picks._")

    with open(os.path.join(ROOT, "report.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


# --------------------------------------------------------------------------
# Static (server-side) HTML rendering — so the dashboard shows ALL details with
# ZERO JavaScript. JS (charts, interactive planner, sorting) only enhances it.
# --------------------------------------------------------------------------
def _u(n):
    if n is None:
        return "n/a"
    n = round(n)
    return ("-$" if n < 0 else "$") + f"{abs(n):,.0f}"


def _v(n, fx):
    if n is None:
        return ""
    return "₫" + f"{round(abs(n) * fx):,}"


def _pc(x):
    return "n/a" if x is None else f"{x * 100:.0f}%"


def _pay(e):
    pb = e.get("payback_months")
    return f"{pb:.0f} mo" if (pb and math.isfinite(pb)) else "—"


def _pick_card(u, fx):
    e = u["econ"]
    pos = e["net_month"] >= 0
    link = (f'<div class="row" style="margin-top:6px"><a href="{u["source_url"]}" '
            f'target="_blank" rel="noopener">🔗 View real rental listing →</a></div>'
            if u.get("source_url") else "")
    return f"""<div class="card pick">
  <div class="rank">#{u['rank']} · score {u['score']:.2f}</div>
  <div class="name">{u['building']} · {u['bedrooms']}BR</div>
  <div class="area">{u['city']} — {u['area']}
    <span class="chip {u['property_type']}">{u['property_type']}</span>
    <span class="chip {u['legal_status']}">{u['legal_status']}</span></div>
  <div class="net {'pos' if pos else 'neg'}">{_u(e['net_month'])}<span class="small"> /mo · {_v(e['net_month'], fx)}</span></div>
  <div class="row"><span>Margin</span><b class="{'pos' if pos else 'neg'}">{_pc(e['margin_pct'])}</b></div>
  <div class="row"><span>Gross / Opex</span><b>{_u(e['gross_month'])} / {_u(e['opex_month'])}</b></div>
  <div class="row"><span>Rent (long lease)</span><b>{_u(u['monthly_rent_usd'])}</b></div>
  <div class="row"><span>Payback / Upfront</span><b>{_pay(e)} / {_u(e['upfront'])}</b></div>
  <div class="row"><span>&nbsp;↳ deposit terms</span><b>1mo rent + 1mo caution = {_u(e['advance_rent'] + e['caution_deposit'])}</b></div>
  <div class="row"><span>Break-even occ</span><b>{_pc(u['breakeven_occupancy'])}</b></div>
  <div class="why">{u['rationale']}</div>
  {link}
</div>"""


def _md_to_html(md):
    """Minimal server-side markdown -> HTML (headings, bold, code, lists, tables)."""
    if not md:
        return '<p class="small">Not available.</p>'
    import html as _h
    out, in_tbl, in_list = [], False, False

    def inline(s):
        s = _h.escape(s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
        s = re.sub(r"`(.+?)`", r"<code>\1</code>", s)
        return s

    for ln in md.split("\n"):
        if re.match(r"^\s*\|.*\|", ln):
            if re.match(r"^[\s|:\-]+$", ln):
                continue
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if not in_tbl:
                if in_list:
                    out.append("</ul>"); in_list = False
                out.append("<table><tr>" + "".join(f"<th>{inline(c)}</th>" for c in cells) + "</tr>")
                in_tbl = True
            else:
                out.append("<tr>" + "".join(f'<td style="text-align:left">{inline(c)}</td>' for c in cells) + "</tr>")
            continue
        elif in_tbl:
            out.append("</table>"); in_tbl = False
        if ln.startswith("### "):
            out.append(f"<h3>{inline(ln[4:])}</h3>")
        elif ln.startswith("## "):
            out.append(f'<h2 style="font-size:16px">{inline(ln[3:])}</h2>')
        elif ln.startswith("# "):
            out.append(f"<h2>{inline(ln[2:])}</h2>")
        elif re.match(r"^\s*[-*]\s", ln):
            if not in_list:
                out.append("<ul>"); in_list = True
            item = re.sub(r"^\s*[-*]\s", "", ln)
            out.append(f"<li>{inline(item)}</li>")
        elif ln.strip() == "":
            if in_list:
                out.append("</ul>"); in_list = False
        else:
            if in_list:
                out.append("</ul>"); in_list = False
            out.append(f"<p>{inline(ln)}</p>")
    if in_tbl:
        out.append("</table>")
    if in_list:
        out.append("</ul>")
    return "\n".join(out)


def static_sections(payload):
    fx = payload["fx_vnd_per_usd"]
    units = payload["units"]
    markets = list(payload["markets"].values())
    by_id = {u["building_id"]: u for u in units}
    S = {}

    # Hero
    eligible = [u for u in units if u["legal_status"] != "BLOCKED"]
    profit = [u for u in eligible if u["econ"]["net_month"] > 0]
    top = payload["shortlist"][0] if payload["shortlist"] else None
    best_margin = max((u["econ"]["margin_pct"] for u in eligible), default=0)
    kpis = [
        ("Top pick net/mo", _u(top["econ"]["net_month"]) if top else "—",
         f"{top['building']} {top['bedrooms']}BR" if top else ""),
        ("Profitable & legal", f"{len(profit)} / {len(units)}", "units at 20 nights/mo"),
        ("Best margin", _pc(best_margin), "among eligible"),
        ("Markets", "3", "Da Nang · Da Lat · HCMC"),
    ]
    S["kpis"] = "".join(
        f'<div class="card kpi"><div class="n">{v}</div><div class="l">{l}</div>'
        f'<div class="l">{s}</div></div>' for l, v, s in kpis)

    # Best picks
    S["villa"] = ("".join(_pick_card(u, fx) for u in payload["best_villas"])
                  or '<p class="small">No eligible villas.</p>')
    S["apt"] = ("".join(_pick_card(u, fx) for u in payload["best_apartments"])
                or '<p class="small">No eligible apartments.</p>')

    # Capital scenarios (static table of $20k/$50k/$100k at asking rents)
    rows = []
    for b in ("20000", "50000", "100000"):
        c = payload["capital_scenarios"][b]
        picks = ", ".join(f"{p['building']} {p['bedrooms']}BR" for p in c["picks"]) or "—"
        rows.append(f"<tr><td>{_u(float(b))}</td><td>{c['units']}</td><td>{_u(c['deployed'])}</td>"
                    f"<td class='pos'>{_u(c['net_month'])}/mo</td><td>{c['cash_on_cash_pct']:.0f}%</td>"
                    f"<td class='small'>{picks}</td></tr>")
    S["cap"] = ("<thead><tr><th>Budget</th><th>Units</th><th>Deployed</th><th>Profit/mo</th>"
                "<th>Cash-on-cash</th><th>Which units</th></tr></thead><tbody>"
                + "".join(rows) + "</tbody>")

    # City table
    def legalchip(r):
        return "BLOCKED" if r["legal_regime"] == "GATED" else "CONDITIONAL"
    S["city"] = ("<thead><tr><th>City</th><th>Listings</th><th>Occ p90</th><th>Occ avg</th>"
                 "<th>ADR avg</th><th>ADR median</th><th>ADR p90</th><th>Annual rev</th>"
                 "<th>Peak</th><th>Legal</th></tr></thead><tbody>"
                 + "".join(
                     f"<tr><td>{c['city']}</td><td>{c['active_listings']:,}</td><td>{_pc(c['occ_base'])}</td>"
                     f"<td>{_pc(c['occ_airroi'])}</td><td>{_u(c['adr_avg'])}</td><td>{_u(c['adr_median'])}</td>"
                     f"<td>{_u(c['adr_top10'])}</td><td>{_u(c['annual_rev_median'])}</td>"
                     f"<td class='small'>{c['peak_label']}</td>"
                     f"<td><span class='chip {legalchip(c)}'>{c['legal_regime']}</span></td></tr>"
                     for c in markets) + "</tbody>")

    # Leaderboard (all units, rank order)
    lead_head = ("#","Building","City","BR","Type","Legal","Rent","ADR","Occ","Gross",
                 "Opex","Net/mo","Margin","BE occ","Max rent","Annual net","Score")
    lrows = []
    for u in units:
        e = u["econ"]
        bl = " class=\"blocked\"" if u["legal_status"] == "BLOCKED" else ""
        name = (f'<a href="{u["source_url"]}" target="_blank" rel="noopener">{u["building"]}</a>'
                if u.get("source_url") else u["building"])
        lrows.append(
            f"<tr{bl}><td>{u['rank']}</td><td>{name}</td><td>{u['city']}</td><td>{u['bedrooms']}</td>"
            f"<td><span class='chip {u['property_type']}'>{u['property_type']}</span></td>"
            f"<td><span class='chip {u['legal_status']}'>{u['legal_status']}</span></td>"
            f"<td>{_u(u['monthly_rent_usd'])}</td><td>{_u(u['adr_usd'])}</td><td>{_pc(u['base_occupancy'])}</td>"
            f"<td>{_u(e['gross_month'])}</td><td>{_u(e['opex_month'])}</td>"
            f"<td class='{'pos' if e['net_month']>=0 else 'neg'}'>{_u(e['net_month'])}</td>"
            f"<td class='{'pos' if e['margin_pct']>=0 else 'neg'}'>{_pc(e['margin_pct'])}</td>"
            f"<td>{_pc(u['breakeven_occupancy'])}</td><td>{_u(u['max_supportable_rent'])}</td>"
            f"<td>{_u(u['seasonality_annual'])}</td><td>{u['score']:.2f}</td></tr>")
    S["lead"] = ("<thead><tr>" + "".join(f'<th data-k="">{h}</th>' for h in lead_head)
                 + "</tr></thead><tbody>" + "".join(lrows) + "</tbody>")

    # Seasonality table
    MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    def sidx(c):
        mean = sum(c["monthly_mult"]) / 12
        return [round(c["occ_base"] * m / mean * 100) for m in c["monthly_mult"]]
    S["season"] = ("<thead><tr><th>City</th>" + "".join(f"<th>{m}</th>" for m in MONTHS)
                   + "</tr></thead><tbody>"
                   + "".join("<tr><td>{}</td>{}</tr>".format(
                       c["city"], "".join(f"<td>{v}</td>" for v in sidx(c))) for c in markets)
                   + "</tbody>")
    S["seasonlabels"] = "".join(
        f'<div class="card"><b style="color:{CITY_COLORS.get(c["city"],"#38bdf8")}">{c["city"]}</b>'
        f'<div class="row" style="display:flex;justify-content:space-between"><span class="small">Peak</span><span>{c["peak_label"]}</span></div>'
        f'<div class="row" style="display:flex;justify-content:space-between"><span class="small">Low</span><span>{c["low_label"]}</span></div></div>'
        for c in markets)

    # Live market
    summ = payload.get("str_comps_summary")
    if summ:
        S["bench"] = ("<thead><tr><th>Market</th><th>Type</th><th>n</th><th>Occ median</th>"
                      "<th>ADR median</th><th>Best occ</th><th>Best nightly</th><th>Best $/yr</th></tr></thead><tbody>"
                      + "".join(
                          f"<tr><td>{s['city']}</td><td><span class='chip {s['property_type']}'>{s['property_type']}</span></td>"
                          f"<td>{s['n']}</td><td>{_pc(s['occ_median'])}</td><td>{_u(s['adr_median'])}</td>"
                          f"<td><b>{_pc(s['best_occ'])}</b></td><td><b>{_u(s['best_adr'])}</b></td>"
                          f"<td class='pos'>{_u(s['best_rev'])}</td></tr>" for s in summ["segments"]) + "</tbody>")
        S["top"] = ("<thead><tr><th>Listing</th><th>City</th><th>District</th><th>Type</th><th>BR</th>"
                    "<th>ADR</th><th>Occ</th><th>TTM revenue</th><th>Rating</th></tr></thead><tbody>"
                    + "".join(
                        f"<tr><td>{p.get('listing_name') or '—'}</td><td>{p['city']}</td>"
                        f"<td class='small'>{p.get('district') or ''}</td>"
                        f"<td><span class='chip {p['property_type']}'>{p['property_type']}</span></td>"
                        f"<td>{p.get('bedrooms') if p.get('bedrooms') is not None else ''}</td>"
                        f"<td>{_u(p['adr_usd'])}</td><td>{_pc(p['occupancy'])}</td>"
                        f"<td class='pos'>{_u(p['ttm_revenue'])}</td>"
                        f"<td>{str(p['rating'])+'★' if p.get('rating') else ''}</td></tr>"
                        for p in summ["top_performers"][:20]) + "</tbody>")
        S["marketsub"] = (f"{payload['str_comps_total']} real Airbnb listings sourced from the "
                          "AirROI licensed API (no scraping). Segment medians below.")
    else:
        S["bench"] = S["top"] = ""
        S["marketsub"] = ""

    S["analytics"] = _md_to_html(payload.get("analytics_md", ""))
    p = payload["params"]
    S["assume"] = _md_to_html(
        "### Assumptions (all tunable in model.py)\n"
        "- **Occupancy** = 20 booked nights/month (~67%) operating basis [operator-stated].\n"
        "- **ADR** per unit from AirROI sourced segment medians, premium-adjusted [sourced/estimated].\n"
        "- **Long-term rents** from FazWaz/DotProperty/Hoozing [sourced]; Da Lat [estimated].\n"
        f"- **amort_months = {p['amort_months']}** (spec default; 36mo roughly doubles net for marginal units).\n"
        f"- **platform_fee = {p['platform_fee_pct']*100:.0f}%**, **deposit = 1mo advance rent + 1mo caution "
        f"({p['deposit_months']}mo)**, **cleaning = ${p['cleaning_per_stay']}/stay** (scales with booked nights), "
        f"**setup = ${p['setup_other_usd']}**, mgmt 15%, furnishing/utilities per-bedroom — [estimated].\n"
        f"- **FX** {fx:,.0f} VND/USD.\n"
        "- **No Airbnb scraping** (ToS): availability from sourced market occupancy + the licensed AirROI API. "
        "Facebook Marketplace excluded (auth-gated + ToS).")

    S["herosub"] = (f"Which buildings/units to lease long-term &amp; sublet short-term — Da Nang · Da Lat · "
                    f"Ho Chi Minh City.<br>Generated {payload['generated_at']} · FX {fx:,.0f} VND/USD · "
                    "USD basis (VND alongside) · 20 nights/month operating basis.")
    S["prov"] = (f'<span class="badge src">[sourced] AirROI API · rental portals</span>'
                 f'<span class="badge est">[estimated] operating costs</span>'
                 f'<span class="badge">{payload["str_comps_total"]} real listings analyzed</span>'
                 f'<span class="badge">{len(units)} lease candidates</span>')
    return S


# --------------------------------------------------------------------------
# dashboard.html
# --------------------------------------------------------------------------
def write_dashboard(payload):
    data_json = json.dumps(payload, allow_nan=False, ensure_ascii=False)
    chartjs = load_text(VENDOR_CHARTJS)
    if chartjs:
        chart_tag = f"<script>{chartjs}</script>"
    else:
        # Offline vendor missing -> fall back to CDN (charts need network).
        chart_tag = ('<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/'
                     'dist/chart.umd.min.js"></script>')

    S = static_sections(payload)
    html = (DASHBOARD_TEMPLATE
            .replace("/*__CHARTJS__*/", "")
            .replace("<!--__CHARTJS__-->", chart_tag))
    for key, val in S.items():
        html = html.replace(f"__S_{key.upper()}__", val)
    # Data blob last (may itself contain no tokens).
    html = html.replace("__DATA__", data_json)
    with open(os.path.join(ROOT, "dashboard.html"), "w", encoding="utf-8") as f:
        f.write(html)


DASHBOARD_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="VN Arbitrage">
<meta name="format-detection" content="telephone=no">
<meta name="theme-color" content="#0f1720" media="(prefers-color-scheme: dark)">
<meta name="theme-color" content="#f4f7fa" media="(prefers-color-scheme: light)">
<title>Vietnam Airbnb Arbitrage — Dashboard</title>
<!--__CHARTJS__-->
<style>
:root{
  --bg:#0f1720; --card:#18222e; --card2:#1e2a38; --line:#2a3948; --ink:#e8eef4;
  --muted:#94a6b8; --accent:#22c55e; --accent2:#38bdf8; --warn:#f59e0b; --bad:#ef4444;
  --pass:#22c55e; --cond:#f59e0b; --block:#64748b; --chip:#243244;
}
@media (prefers-color-scheme: light){
  :root{ --bg:#f4f7fa; --card:#ffffff; --card2:#f0f4f8; --line:#dce4ec; --ink:#0f2233;
    --muted:#5a6b7b; --chip:#eef3f8; }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
html,body{margin:0;padding:0;max-width:100%;overflow-x:hidden}
body{background:var(--bg);color:var(--ink);
  font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;overscroll-behavior-y:none;}
a{color:var(--accent2)}
.wrap{max-width:1200px;margin:0 auto;
  padding:0 max(16px,env(safe-area-inset-left)) 80px max(16px,env(safe-area-inset-right))}
header.hero{padding:34px 16px 22px;border-bottom:1px solid var(--line);
  background:linear-gradient(160deg,rgba(56,189,248,.10),rgba(34,197,94,.06));}
.hero .wrap{padding-bottom:0}
h1{font-size:26px;margin:0 0 6px;letter-spacing:-.4px}
h2{font-size:20px;margin:34px 0 12px;letter-spacing:-.3px}
h3{font-size:16px;margin:18px 0 8px}
.sub{color:var(--muted);font-size:14px}
.prov{margin-top:12px;display:flex;flex-wrap:wrap;gap:8px}
.badge{font-size:11px;padding:3px 9px;border-radius:999px;background:var(--chip);
  border:1px solid var(--line);color:var(--muted)}
.badge.src{color:var(--accent);border-color:rgba(34,197,94,.4)}
.badge.est{color:var(--warn);border-color:rgba(245,158,11,.4)}
nav.sticky{position:sticky;top:0;z-index:20;background:var(--bg);
  border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap;
  -webkit-overflow-scrolling:touch;scrollbar-width:none}
nav.sticky::-webkit-scrollbar{display:none}
nav.sticky .wrap{padding:8px 16px;display:flex;gap:6px}
nav a{color:var(--muted);text-decoration:none;font-size:13px;padding:8px 12px;
  border-radius:8px;flex:0 0 auto;min-height:36px;display:flex;align-items:center}
nav a:active,nav a:hover{background:var(--chip);color:var(--ink)}
.grid{display:grid;gap:14px}
.cards{grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.kpis{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:16px}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px}
.kpi .n{font-size:24px;font-weight:700;letter-spacing:-.5px}
.kpi .l{color:var(--muted);font-size:12px;margin-top:2px}
.pick{position:relative;overflow:hidden}
.pick .rank{position:absolute;top:12px;right:14px;font-size:12px;color:var(--muted)}
.pick .name{font-weight:700;font-size:16px;padding-right:34px}
.pick .area{color:var(--muted);font-size:12px;margin-bottom:10px}
.pick .net{font-size:22px;font-weight:800;margin:6px 0}
.pick .net.pos{color:var(--accent)} .pick .net.neg{color:var(--bad)}
.pick .row{display:flex;justify-content:space-between;font-size:13px;padding:2px 0;color:var(--muted)}
.pick .row b{color:var(--ink);font-weight:600}
.pick .why{font-size:12px;color:var(--muted);margin-top:10px;border-top:1px dashed var(--line);padding-top:8px}
.chip{display:inline-block;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;color:#08121b}
.chip.PASS{background:var(--pass)} .chip.CONDITIONAL{background:var(--cond)}
.chip.BLOCKED{background:var(--block);color:#fff}
.chip.villa{background:rgba(56,189,248,.18);color:var(--accent2);font-weight:600}
.chip.apartment{background:rgba(148,163,184,.18);color:var(--muted);font-weight:600}
.charts{grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
/* Chart boxes are hidden by default and only revealed by JS once charts can
   render — so no-JS / sandboxed viewers see the data tables instead of empty boxes. */
.chartbox{display:none;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
.charts-live .chartbox{display:block}
.chartbox h3{margin:0 0 10px}
.can-wrap{position:relative;height:260px}
table{width:100%;border-collapse:collapse;font-size:13px}
.tablescroll{overflow-x:auto;border:1px solid var(--line);border-radius:14px}
th,td{padding:9px 10px;text-align:right;border-bottom:1px solid var(--line);white-space:nowrap}
th:first-child,td:first-child{text-align:left}
th{position:sticky;top:0;background:var(--card2);cursor:pointer;user-select:none;font-size:12px;color:var(--muted)}
th:hover{color:var(--ink)}
tbody tr:hover{background:var(--card2)}
tr.blocked{opacity:.5}
.neg{color:var(--bad)} .pos{color:var(--accent)}
.filters{display:flex;flex-wrap:wrap;gap:10px;align-items:end;margin:10px 0 14px}
.filters label{font-size:12px;color:var(--muted);display:flex;flex-direction:column;gap:4px}
.filters input,.filters select{background:var(--card);border:1px solid var(--line);
  color:var(--ink);border-radius:8px;padding:9px 10px;font-size:16px;min-height:40px;
  -webkit-appearance:none;appearance:none;max-width:100%}
.filters .toggle{flex-direction:row;align-items:center;gap:8px;padding-bottom:6px;min-height:40px}
.filters .toggle input{width:20px;height:20px;min-height:0}
.note{background:var(--card2);border-left:3px solid var(--warn);border-radius:8px;
  padding:10px 12px;font-size:13px;color:var(--muted);margin:8px 0}
.md{font-size:14px}
.md h1,.md h2,.md h3{margin:14px 0 6px}
.md table{margin:8px 0}
.md code{background:var(--chip);padding:1px 5px;border-radius:5px;font-size:12px}
.foot{color:var(--muted);font-size:12px;margin-top:30px;border-top:1px solid var(--line);padding-top:16px}
.small{font-size:12px;color:var(--muted)}
@media (max-width:640px){
  header.hero{padding:20px 0 16px}
  h1{font-size:21px} h2{font-size:18px;margin:26px 0 10px} h3{font-size:15px}
  .sub{font-size:13px}
  .wrap{padding-bottom:60px}
  .kpis{grid-template-columns:repeat(2,1fr);gap:10px}
  .kpi .n{font-size:20px}
  .cards{grid-template-columns:1fr}
  .charts{grid-template-columns:1fr}
  .can-wrap{height:230px}
  .filters{gap:8px}
  .filters label{flex:1 1 46%;min-width:0}
  .filters input,.filters select{width:100%}
  .filters .toggle{flex:1 1 100%}
  th,td{padding:8px 8px;font-size:12px}
  /* keep the first column readable & anchored while the table scrolls */
  #leadTable td:first-child,#leadTable th:first-child{position:sticky;left:0;background:var(--card2);z-index:1}
  .badge{font-size:10px}
  nav a{font-size:12px;padding:8px 10px}
}
@media (max-width:380px){
  .kpis{grid-template-columns:1fr}
  h1{font-size:19px}
}
@media print{nav.sticky{display:none}.canvas-wrap{break-inside:avoid}}
</style>
</head>
<body>
<header class="hero"><div class="wrap">
  <h1>🇻🇳 Vietnam Airbnb Rental-Arbitrage</h1>
  <div class="sub" id="heroSub">__S_HEROSUB__</div>
  <div class="prov" id="prov">__S_PROV__</div>
  <div class="grid kpis" id="kpis">__S_KPIS__</div>
</div></header>

<nav class="sticky"><div class="wrap">
  <a href="#picks">🏆 Best Picks</a>
  <a href="#capital">💰 Capital Planner</a>
  <a href="#cities">🏙️ City Comparison</a>
  <a href="#leaderboard">📊 Leaderboard</a>
  <a href="#season">📅 Seasonality</a>
  <a href="#market">🛰️ Live Market</a>
  <a href="#analytics">🔬 Analytics</a>
  <a href="#legal">⚖️ Legal & Assumptions</a>
</div></nav>

<div class="wrap">

  <section id="picks">
    <h2>🏆 Best Picks to Lease</h2>
    <p class="sub">Ranked by blended score (net, margin, payback, legal, demand stability).
       BLOCKED units excluded. Net shown in USD with VND alongside.</p>
    <h3>Villas &amp; Houses</h3>
    <div class="grid cards" id="villaCards">__S_VILLA__</div>
    <h3 style="margin-top:22px">Apartments</h3>
    <div class="grid cards" id="aptCards">__S_APT__</div>
    <div class="note" id="picksNote"></div>
  </section>

  <section id="capital">
    <h2>💰 Capital Planner — how much will your budget earn?</h2>
    <p class="sub">Deploys a budget into the best <b>profitable &amp; legal</b> units in score order
       (each consumes deposit + furnishing + setup as upfront). Answers "if I put in $X, what's my monthly profit?"</p>
    <div class="tablescroll"><table id="capStatic">__S_CAP__</table></div>
    <p class="small" style="margin:10px 0 2px">↓ Interactive planner (open in Safari/Chrome to drag the levers):</p>
    <div class="filters">
      <label>Upfront capital (USD)<input id="capBudget" type="number" value="20000" step="1000" style="width:130px"></label>
      <label>Rent negotiated down<select id="capRent">
        <option value="0">0% (asking)</option><option value="0.10">10% below</option>
        <option value="0.12" selected>12% below</option><option value="0.15">15% below</option>
        <option value="0.20">20% below</option></select></label>
      <label>Furnishing amortized over<select id="capAmort">
        <option value="18">18 months</option><option value="24">24 months</option>
        <option value="36" selected>36 months</option><option value="48">48 months</option></select></label>
      <label>Nightly price<select id="capAdr">
        <option value="1">as modeled</option><option value="1.1">+10%</option>
        <option value="1.2">+20%</option><option value="0.85">-15% (safer)</option></select></label>
      <label>Occupancy<select id="capOcc">
        <option value="0">20 nights/mo (67%)</option><option value="0.50">15 nights (50%)</option>
        <option value="0.55">55% (top-earner)</option><option value="0.567">17 nights (57%)</option>
        <option value="0.733">22 nights (73%)</option></select></label>
      <label class="toggle"><input id="capIdeal" type="checkbox" checked> "Ideal" levers</label>
    </div>
    <div class="grid kpis" id="capKpis"></div>
    <div class="tablescroll" style="margin-top:12px"><table id="capTable"></table></div>
    <div class="note" id="capNote"></div>
  </section>

  <section id="cities">
    <h2>🏙️ City Comparison</h2>
    <div class="grid charts">
      <div class="chartbox"><h3>Occupancy target by city <span class="small">[sourced p90]</span></h3><div class="can-wrap"><canvas id="cOcc"></canvas></div></div>
      <div class="chartbox"><h3>ADR by city (avg &amp; percentiles) <span class="small">[sourced]</span></h3><div class="can-wrap"><canvas id="cAdr"></canvas></div></div>
      <div class="chartbox"><h3>Annual STR revenue, median <span class="small">[sourced]</span></h3><div class="can-wrap"><canvas id="cRev"></canvas></div></div>
    </div>
    <div class="tablescroll" style="margin-top:14px"><table id="cityTable">__S_CITY__</table></div>
  </section>

  <section id="leaderboard">
    <h2>📊 Building Leaderboard</h2>
    <div class="filters" id="filters">
      <label>City<select id="fCity"><option value="">All</option></select></label>
      <label>Type<select id="fType"><option value="">All</option><option>apartment</option><option>villa</option></select></label>
      <label>Bedrooms<select id="fBr"><option value="">All</option></select></label>
      <label>Max rent $<input id="fRent" type="number" placeholder="any" style="width:90px"></label>
      <label>Min margin %<input id="fMargin" type="number" placeholder="any" style="width:90px"></label>
      <label class="toggle"><input id="fLegal" type="checkbox"> Legal = PASS only</label>
    </div>
    <div class="grid charts">
      <div class="chartbox"><h3>Net margin by unit ($/mo)</h3><div class="can-wrap"><canvas id="cNet"></canvas></div></div>
      <div class="chartbox"><h3>Gross vs Opex (shortlist)</h3><div class="can-wrap"><canvas id="cGO"></canvas></div></div>
    </div>
    <div class="tablescroll" style="margin-top:14px"><table id="leadTable">__S_LEAD__</table></div>
    <p class="small" id="leadCount"></p>
  </section>

  <section id="season">
    <h2>📅 Seasonality</h2>
    <p class="sub">Monthly occupancy index (sourced p90 occupancy × event-aware multipliers).
       Peaks/lows labeled per city.</p>
    <div class="chartbox"><div class="can-wrap" style="height:320px"><canvas id="cSeason"></canvas></div></div>
    <div class="tablescroll" style="margin-top:12px"><table id="seasonTable">__S_SEASON__</table></div>
    <div id="seasonLabels" class="grid cards" style="margin-top:12px">__S_SEASONLABELS__</div>
  </section>

  <section id="market">
    <h2>🛰️ Live Market — real listings</h2>
    <p class="sub" id="marketSub">__S_MARKETSUB__</p>
    <div class="grid charts">
      <div class="chartbox"><h3>Median revenue: villa vs apartment</h3><div class="can-wrap"><canvas id="cSeg"></canvas></div></div>
      <div class="chartbox"><h3>Segment ADR (median)</h3><div class="can-wrap"><canvas id="cSegAdr"></canvas></div></div>
    </div>
    <h3>Occupancy &amp; best nightly price by segment <span class="small">[sourced from real listings]</span></h3>
    <p class="small">"Best" = the revenue-maximizing operating point of the top-20% earners. Note they run ~50–60% occupancy at a <b>high nightly price</b>, not full calendars.</p>
    <div class="tablescroll"><table id="benchTable">__S_BENCH__</table></div>
    <h3 style="margin-top:18px">Top real performers (by trailing-12-month revenue) <span class="small">[sourced]</span></h3>
    <div class="tablescroll"><table id="topTable">__S_TOP__</table></div>
  </section>

  <section id="analytics">
    <h2>🔬 Market Analytics</h2>
    <div class="card md" id="analyticsMd">__S_ANALYTICS__</div>
  </section>

  <section id="legal">
    <h2>⚖️ Legal &amp; Assumptions</h2>
    <div class="note"><b>HCMC — Decision 19/2026 (eff. 2026-04-25):</b> STR permitted only where the
      building's approved use allows it and the host registers as licensed accommodation.
      Residential-only buildings are <b>BLOCKED</b>. Always verify a building's classification
      with management before signing.</div>
    <div class="note"><b>Da Nang / Da Lat — CONDITIONAL:</b> allowed with business registration,
      fire-safety compliance, and 8% VAT + PIT on STR revenue. Low enforcement, but register.</div>
    <div class="card md" id="assumeMd">__S_ASSUME__</div>
  </section>

  <div class="foot" id="foot"></div>
</div>

<script id="payload" type="application/json">__DATA__</script>
<script>
const DATA = JSON.parse(document.getElementById('payload').textContent);
const FX = DATA.fx_vnd_per_usd;
const hasCharts = typeof Chart !== 'undefined';
const usd = n => n==null ? 'n/a' : (n<0?'-$':'$')+Math.abs(n).toLocaleString(undefined,{maximumFractionDigits:0});
const vnd = n => n==null ? '' : '₫'+Math.round(Math.abs(n)*FX).toLocaleString();
const pct = n => n==null ? 'n/a' : (n*100).toFixed(0)+'%';
const CITY_COLORS = {'Da Nang':'#38bdf8','Ho Chi Minh City':'#22c55e','Da Lat':'#f59e0b'};
const cssvar = k => getComputedStyle(document.body).getPropertyValue(k).trim();

/* ---------- hero ---------- */
document.getElementById('heroSub').innerHTML =
  `Which buildings/units to lease long-term &amp; sublet short-term — Da Nang · Da Lat · Ho Chi Minh City. `+
  `<br>Generated ${DATA.generated_at} · FX ${FX.toLocaleString()} VND/USD · USD basis (VND alongside).`;
document.getElementById('prov').innerHTML =
  `<span class="badge src">[sourced] AirROI API · rental portals</span>`+
  `<span class="badge est">[estimated] operating costs</span>`+
  `<span class="badge">${DATA.str_comps_total} real listings analyzed</span>`+
  `<span class="badge">${DATA.units.length} lease candidates</span>`;

const eligible = DATA.units.filter(u=>u.legal_status!=='BLOCKED');
const profit = eligible.filter(u=>u.econ.net_month>0);
const topPick = DATA.shortlist[0];
const kpis = [
  ['Top pick net/mo', topPick?usd(topPick.econ.net_month):'—', topPick?`${topPick.building} ${topPick.bedrooms}BR`:''],
  ['Profitable & legal', profit.length+' / '+DATA.units.length, 'units at target occ'],
  ['Best margin', pct(Math.max(...eligible.map(u=>u.econ.margin_pct))), 'among eligible'],
  ['Markets', '3', 'Da Nang · Da Lat · HCMC'],
];
document.getElementById('kpis').innerHTML = kpis.map(k=>
  `<div class="card kpi"><div class="n">${k[1]}</div><div class="l">${k[0]}</div><div class="l">${k[2]}</div></div>`).join('');

/* ---------- best picks cards ---------- */
function pickCard(u){
  const e=u.econ, pos=e.net_month>=0;
  const pb=e.payback_months? `${e.payback_months.toFixed(0)} mo` : '—';
  return `<div class="card pick">
    <div class="rank">#${u.rank} · score ${u.score.toFixed(2)}</div>
    <div class="name">${u.building} · ${u.bedrooms}BR</div>
    <div class="area">${u.city} — ${u.area}
      <span class="chip ${u.property_type}">${u.property_type}</span>
      <span class="chip ${u.legal_status}">${u.legal_status}</span></div>
    <div class="net ${pos?'pos':'neg'}">${usd(e.net_month)}<span class="small"> /mo · ${vnd(e.net_month)}</span></div>
    <div class="row"><span>Margin</span><b class="${pos?'pos':'neg'}">${pct(e.margin_pct)}</b></div>
    <div class="row"><span>Gross / Opex</span><b>${usd(e.gross_month)} / ${usd(e.opex_month)}</b></div>
    <div class="row"><span>Rent (long lease)</span><b>${usd(u.monthly_rent_usd)}</b></div>
    <div class="row"><span>Payback / Upfront</span><b>${pb} / ${usd(e.upfront)}</b></div>
    <div class="row"><span>&nbsp;↳ deposit terms</span><b>1mo rent + 1mo caution = ${usd(e.advance_rent+e.caution_deposit)}</b></div>
    <div class="row"><span>Break-even occ</span><b>${pct(u.breakeven_occupancy)}</b></div>
    <div class="why">${u.rationale}</div>
    ${u.source_url?`<div class="row" style="margin-top:6px"><a href="${u.source_url}" target="_blank" rel="noopener">🔗 View real rental listing →</a></div>`:''}
  </div>`;
}
document.getElementById('villaCards').innerHTML = DATA.best_villas.map(pickCard).join('') || '<p class="small">No eligible villas.</p>';
document.getElementById('aptCards').innerHTML = DATA.best_apartments.map(pickCard).join('') || '<p class="small">No eligible apartments.</p>';
document.getElementById('picksNote').innerHTML =
  `<b>Read the margins honestly:</b> at the sourced p90 occupancy target, beach pool villas are the `+
  `only comfortably profitable arbitrage; most apartments sit near break-even. Levers that flip `+
  `marginal units positive: negotiate a lower/bare lease, amortize furnishing over 36 months (not 18), `+
  `or lift ADR via revenue management. See each card's break-even occupancy and the sensitivity in the leaderboard.`;

/* ---------- capital planner (recomputes economics under user levers) ---------- */
const P=DATA.params;
function reEcon(u, rentDisc, amortM, adrMult, occOvr){
  const rent=u.monthly_rent_usd*(1-rentDisc);
  const util=P.utilities_month[u.bedrooms] ?? 90;
  const furn=P.furnishing_capex[u.bedrooms] ?? 6000;
  const adr=u.adr_usd*(adrMult||1);
  const occ=occOvr>0?occOvr:u.base_occupancy;
  const gross=adr*30*occ;
  const mgmt=gross*u.mgmt_fee_pct;
  const clean=(30*occ/u.avg_stay_nights)*P.cleaning_per_stay;
  const plat=gross*P.platform_fee_pct;
  const amort=(furn+P.setup_other_usd)/amortM;
  const opex=rent+util+mgmt+clean+plat+amort;
  const net=gross-opex;
  const upfront=P.deposit_months*rent+furn+P.setup_other_usd;
  return {net, upfront, gross};
}
function deploy(budget, rentDisc, amortM, adrMult, occOvr){
  const cands=DATA.units.filter(u=>u.legal_status!=='BLOCKED')
    .map(u=>({u, e:reEcon(u,rentDisc,amortM,adrMult,occOvr)}))
    .filter(x=>x.e.net>0)
    .sort((a,b)=>b.e.net-a.e.net);
  let spent=0,net=0; const picks=[]; let nv=0,na=0;
  for(const x of cands){ if(spent+x.e.upfront<=budget){ picks.push(x); spent+=x.e.upfront; net+=x.e.net;
    if(x.u.property_type==='villa')nv++; else na++; } }
  return {budget,spent,net,picks,nv,na,nProfitable:cands.length,
          coc: spent>0?net*12/spent*100:0, leftover:budget-spent,
          payback: net>0?spent/net:null};
}
function renderCap(){
  const ideal=document.getElementById('capIdeal').checked;
  const rentDisc=ideal?parseFloat(document.getElementById('capRent').value):0;
  const amortM=ideal?parseInt(document.getElementById('capAmort').value):P.amort_months;
  document.getElementById('capRent').disabled=!ideal;
  document.getElementById('capAmort').disabled=!ideal;
  const adrMult=parseFloat(document.getElementById('capAdr').value)||1;
  const occOvr=parseFloat(document.getElementById('capOcc').value)||0;
  const b=Math.max(0,parseFloat(document.getElementById('capBudget').value)||0);
  const d=deploy(b,rentDisc,amortM,adrMult,occOvr);
  const k=[
    ['Monthly profit', usd(d.net), d.net>0?vnd(d.net)+' /mo':'no unit fits'],
    ['Portfolio', `${d.nv}🏡 + ${d.na}🏢`, `${d.picks.length} of ${d.nProfitable} profitable`],
    ['Capital deployed', usd(d.spent), usd(d.leftover)+' idle'],
    ['Cash-on-cash / yr', d.coc.toFixed(0)+'%', d.payback?`${d.payback.toFixed(0)}mo payback`:'—'],
  ];
  document.getElementById('capKpis').innerHTML=k.map(x=>
    `<div class="card kpi"><div class="n">${x[1]}</div><div class="l">${x[0]}</div><div class="l">${x[2]}</div></div>`).join('');
  const t=document.getElementById('capTable');
  t.innerHTML = d.picks.length ? `<thead><tr><th>Unit</th><th>City</th><th>Type</th><th>Upfront</th><th>Net/mo</th><th>Link</th></tr></thead><tbody>`+
    d.picks.map(x=>`<tr><td>${x.u.building} ${x.u.bedrooms}BR</td><td>${x.u.city}</td>
      <td><span class="chip ${x.u.property_type}">${x.u.property_type}</span></td>
      <td>${usd(x.e.upfront)}</td><td class="pos">${usd(x.e.net)}</td>
      <td>${x.u.source_url?`<a href="${x.u.source_url}" target="_blank" rel="noopener">listing →</a>`:'—'}</td></tr>`).join('')+`</tbody>` : '';
  const baseN=DATA.units.filter(u=>u.legal_status!=='BLOCKED'&&u.econ.net_month>0).length;
  document.getElementById('capNote').innerHTML = ideal
    ? `<b>Ideal mode:</b> assumes you negotiate each lease <b>${(rentDisc*100).toFixed(0)}% below asking</b> and amortize furnishing over <b>${amortM} months</b>. That flips <b>${d.nProfitable} of ${DATA.units.length}</b> units profitable (vs ${baseN} at asking rents). Budget still caps the unit count — a 1-villa + 5-apartment book needs ~$45–50k upfront. Every net figure assumes p90 (excellent-operator) occupancy; see the leaderboard sensitivity for downside.`
    : `<b>Asking-rent mode:</b> only <b>${baseN} of ${DATA.units.length}</b> units are profitable &amp; legal, so the constraint is <b>deal-sourcing, not capital</b>. Toggle "Ideal levers" to see what negotiation + longer amortization unlock.`;
}
['capBudget','capRent','capAmort','capAdr','capOcc','capIdeal'].forEach(id=>{
  document.getElementById(id).oninput=renderCap;
  document.getElementById(id).onchange=renderCap;
});
renderCap();

/* ---------- city comparison ---------- */
const cities = Object.values(DATA.markets);
// Charts are created lazily (deferred to after layout) so iOS WKWebView paints
// them instead of measuring a not-yet-laid-out container as 0x0.
const chartJobs=[];
function bar(id,labels,datasets,opts={}){
  chartJobs.push(()=>new Chart(document.getElementById(id),{type:'bar',
    data:{labels,datasets},
    options:{responsive:true,maintainAspectRatio:false,animation:false,
      plugins:{legend:{labels:{color:cssvar('--muted')},display:datasets.length>1}},
      scales:{x:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}},
              y:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')},...(opts.y||{})}}}}));
}
const cLabels = cities.map(c=>c.city);
const cColors = cLabels.map(c=>CITY_COLORS[c]);
bar('cOcc',cLabels,[{label:'Occupancy p90',data:cities.map(c=>+(c.occ_base*100).toFixed(0)),backgroundColor:cColors}],{y:{max:100}});
bar('cAdr',cLabels,[
  {label:'ADR avg',data:cities.map(c=>c.adr_avg),backgroundColor:cColors},
  {label:'ADR p90',data:cities.map(c=>c.adr_top10),backgroundColor:'rgba(148,163,184,.5)'}]);
bar('cRev',cLabels,[{label:'Annual rev (median)',data:cities.map(c=>c.annual_rev_median),backgroundColor:cColors}]);

/* city table */
const ct=document.getElementById('cityTable');
ct.innerHTML = `<thead><tr><th>City</th><th>Listings</th><th>Occ p90</th><th>Occ avg</th>
  <th>ADR avg</th><th>ADR median</th><th>ADR p90</th><th>Annual rev</th><th>Peak</th><th>Legal</th></tr></thead><tbody>`+
  cities.map(c=>`<tr><td>${c.city}</td><td>${c.active_listings.toLocaleString()}</td>
   <td>${pct(c.occ_base)}</td><td>${pct(c.occ_airroi)}</td><td>${usd(c.adr_avg)}</td>
   <td>${usd(c.adr_median)}</td><td>${usd(c.adr_top10)}</td><td>${usd(c.annual_rev_median)}</td>
   <td class="small">${c.peak_label}</td>
   <td><span class="chip ${c.legal_regime==='GATED'?'BLOCKED':'CONDITIONAL'}">${c.legal_regime}</span></td></tr>`).join('')+`</tbody>`;

/* ---------- leaderboard ---------- */
const fCity=document.getElementById('fCity'), fBr=document.getElementById('fBr');
[...new Set(DATA.units.map(u=>u.city))].forEach(c=>fCity.add(new Option(c,c)));
[...new Set(DATA.units.map(u=>u.bedrooms))].sort((a,b)=>a-b).forEach(b=>fBr.add(new Option(b+'BR',b)));
let sortKey='rank', sortDir=1;
const cols=[['rank','#'],['building','Building'],['city','City'],['bedrooms','BR'],['property_type','Type'],
  ['legal_status','Legal'],['monthly_rent_usd','Rent'],['adr_usd','ADR'],['base_occupancy','Occ'],
  ['gross_month','Gross'],['opex_month','Opex'],['net_month','Net/mo'],['margin_pct','Margin'],
  ['breakeven_occupancy','BE occ'],['max_supportable_rent','Max rent'],['seasonality_annual','Annual net'],['score','Score']];
function val(u,k){
  if(['gross_month','opex_month','net_month','margin_pct','payback_months'].includes(k)) return u.econ[k];
  return u[k];
}
function filtered(){
  const city=fCity.value,type=document.getElementById('fType').value,br=fBr.value,
    rent=parseFloat(document.getElementById('fRent').value),
    marg=parseFloat(document.getElementById('fMargin').value),
    legal=document.getElementById('fLegal').checked;
  return DATA.units.filter(u=>
    (!city||u.city===city)&&(!type||u.property_type===type)&&(br===''||u.bedrooms==br)&&
    (isNaN(rent)||u.monthly_rent_usd<=rent)&&(isNaN(marg)||u.econ.margin_pct*100>=marg)&&
    (!legal||u.legal_status==='PASS'));
}
function renderLead(){
  const rows=filtered().sort((a,b)=>{
    let x=val(a,sortKey),y=val(b,sortKey);
    if(typeof x==='string') return sortDir*(''+x).localeCompare(''+y);
    return sortDir*(((x==null?-1e12:x))-((y==null?-1e12:y)));
  });
  const t=document.getElementById('leadTable');
  t.innerHTML=`<thead><tr>${cols.map(c=>`<th data-k="${c[0]}">${c[1]}</th>`).join('')}</tr></thead><tbody>`+
    rows.map(u=>{const e=u.econ;const bl=u.legal_status==='BLOCKED';
      return `<tr class="${bl?'blocked':''}">
      <td>${u.rank}</td><td>${u.source_url?`<a href="${u.source_url}" target="_blank" rel="noopener">${u.building}</a>`:u.building}</td><td>${u.city}</td><td>${u.bedrooms}</td>
      <td><span class="chip ${u.property_type}">${u.property_type}</span></td>
      <td><span class="chip ${u.legal_status}">${u.legal_status}</span></td>
      <td>${usd(u.monthly_rent_usd)}</td><td>${usd(u.adr_usd)}</td><td>${pct(u.base_occupancy)}</td>
      <td>${usd(e.gross_month)}</td><td>${usd(e.opex_month)}</td>
      <td class="${e.net_month>=0?'pos':'neg'}">${usd(e.net_month)}</td>
      <td class="${e.margin_pct>=0?'pos':'neg'}">${pct(e.margin_pct)}</td>
      <td>${pct(u.breakeven_occupancy)}</td><td>${usd(u.max_supportable_rent)}</td><td>${usd(u.seasonality_annual)}</td>
      <td>${u.score.toFixed(2)}</td></tr>`;}).join('')+`</tbody>`;
  t.querySelectorAll('th').forEach(th=>th.onclick=()=>{
    const k=th.dataset.k; sortDir=(sortKey===k)?-sortDir:1; sortKey=k; renderLead();});
  document.getElementById('leadCount').textContent=`${rows.length} of ${DATA.units.length} units shown · click headers to sort · BLOCKED greyed & excluded from picks`;
}
document.querySelectorAll('#filters input,#filters select').forEach(el=>el.oninput=renderLead);
renderLead();

/* net + gross/opex charts */
const elig = DATA.units.filter(u=>u.legal_status!=='BLOCKED').slice().sort((a,b)=>b.econ.net_month-a.econ.net_month);
bar('cNet',elig.map(u=>u.building+' '+u.bedrooms+'BR'),
  [{label:'Net/mo',data:elig.map(u=>+u.econ.net_month.toFixed(0)),
    backgroundColor:elig.map(u=>u.econ.net_month>=0?'#22c55e':'#ef4444')}]);
const sl=DATA.shortlist;
chartJobs.push(()=>new Chart(document.getElementById('cGO'),{type:'bar',
  data:{labels:sl.map(u=>u.building+' '+u.bedrooms+'BR'),datasets:[
    {label:'Opex',data:sl.map(u=>+u.econ.opex_month.toFixed(0)),backgroundColor:'#64748b'},
    {label:'Net',data:sl.map(u=>+u.econ.net_month.toFixed(0)),backgroundColor:'#22c55e'}]},
  options:{responsive:true,maintainAspectRatio:false,animation:false,
    plugins:{legend:{labels:{color:cssvar('--muted')}}},
    scales:{x:{stacked:true,ticks:{color:cssvar('--muted')},grid:{display:false}},
            y:{stacked:true,ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}}}}}));

/* ---------- seasonality ---------- */
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const seasonIdx = c => { const mean=c.monthly_mult.reduce((a,b)=>a+b,0)/12;
  return c.monthly_mult.map(m=>+(c.occ_base*m/mean*100).toFixed(0)); };
chartJobs.push(()=>new Chart(document.getElementById('cSeason'),{type:'line',
  data:{labels:MONTHS,datasets:cities.map(c=>({label:c.city,borderColor:CITY_COLORS[c.city],
      backgroundColor:CITY_COLORS[c.city],tension:.35,pointRadius:3,data:seasonIdx(c)}))},
  options:{responsive:true,maintainAspectRatio:false,animation:false,
    plugins:{legend:{labels:{color:cssvar('--muted')}}},
    scales:{x:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}},
            y:{title:{display:true,text:'Occupancy index %',color:cssvar('--muted')},
               ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}}}}}));
// Text equivalent so seasonality is legible even if the canvas can't paint.
document.getElementById('seasonTable').innerHTML =
  `<thead><tr><th>City</th>${MONTHS.map(m=>`<th>${m}</th>`).join('')}</tr></thead><tbody>`+
  cities.map(c=>`<tr><td>${c.city}</td>${seasonIdx(c).map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')+
  `</tbody>`;
document.getElementById('seasonLabels').innerHTML = cities.map(c=>
  `<div class="card"><b style="color:${CITY_COLORS[c.city]}">${c.city}</b>
   <div class="row" style="display:flex;justify-content:space-between"><span class="small">Peak</span><span>${c.peak_label}</span></div>
   <div class="row" style="display:flex;justify-content:space-between"><span class="small">Low</span><span>${c.low_label}</span></div></div>`).join('');

/* ---------- live market ---------- */
const S = DATA.str_comps_summary;
if(S){
  document.getElementById('marketSub').textContent =
    `${DATA.str_comps_total} real Airbnb listings sourced from the AirROI licensed API (no scraping). Segment medians below.`;
  const seg=S.segments;
  const byCity={};
  seg.forEach(s=>{(byCity[s.city]=byCity[s.city]||{})[s.property_type]=s;});
  const cnames=Object.keys(byCity);
  bar('cSeg',cnames,[
    {label:'Villa',data:cnames.map(c=>byCity[c].villa?byCity[c].villa.rev_median:0),backgroundColor:'#38bdf8'},
    {label:'Apartment',data:cnames.map(c=>byCity[c].apartment?byCity[c].apartment.rev_median:0),backgroundColor:'#94a6b8'}]);
  bar('cSegAdr',cnames,[
    {label:'Villa',data:cnames.map(c=>byCity[c].villa?byCity[c].villa.adr_median:0),backgroundColor:'#38bdf8'},
    {label:'Apartment',data:cnames.map(c=>byCity[c].apartment?byCity[c].apartment.adr_median:0),backgroundColor:'#94a6b8'}]);
  const bt=document.getElementById('benchTable');
  bt.innerHTML=`<thead><tr><th>Market</th><th>Type</th><th>n</th><th>Occ median</th>
    <th>ADR median</th><th>Best occ</th><th>Best nightly</th><th>Best $/yr</th></tr></thead><tbody>`+
    seg.map(s=>`<tr><td>${s.city}</td><td><span class="chip ${s.property_type}">${s.property_type}</span></td>
     <td>${s.n}</td><td>${pct(s.occ_median)}</td><td>${usd(s.adr_median)}</td>
     <td><b>${pct(s.best_occ)}</b></td><td><b>${usd(s.best_adr)}</b></td><td class="pos">${usd(s.best_rev)}</td></tr>`).join('')+`</tbody>`;
  const tt=document.getElementById('topTable');
  tt.innerHTML=`<thead><tr><th>Listing</th><th>City</th><th>District</th><th>Type</th><th>BR</th>
    <th>ADR</th><th>Occ</th><th>TTM revenue</th><th>Rating</th></tr></thead><tbody>`+
    S.top_performers.slice(0,20).map(p=>`<tr><td>${p.listing_name||'—'}</td><td>${p.city}</td>
     <td class="small">${p.district||''}</td><td><span class="chip ${p.property_type}">${p.property_type}</span></td>
     <td>${p.bedrooms??''}</td><td>${usd(p.adr_usd)}</td><td>${pct(p.occupancy)}</td>
     <td class="pos">${usd(p.ttm_revenue)}</td><td>${p.rating?p.rating+'★':''}</td></tr>`).join('')+`</tbody>`;
}

/* ---------- markdown (tiny renderer) ---------- */
function mdToHtml(md){
  if(!md) return '<p class="small">Not available.</p>';
  const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const lines=md.split('\n'); let html='',inTable=false,inList=false;
  const flush=()=>{if(inList){html+='</ul>';inList=false;}};
  for(let i=0;i<lines.length;i++){
    let ln=lines[i];
    if(/^\s*\|.*\|/.test(ln)){
      const cells=ln.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      if(/^[-:\s|]+$/.test(ln)){continue;}
      if(!inTable){flush();html+='<table>';inTable=true;html+='<tr>'+cells.map(c=>`<th>${esc(c)}</th>`).join('')+'</tr>';}
      else html+='<tr>'+cells.map(c=>`<td style="text-align:left">${esc(c)}</td>`).join('')+'</tr>';
      continue;
    } else if(inTable){html+='</table>';inTable=false;}
    if(/^###\s/.test(ln)){flush();html+=`<h3>${esc(ln.slice(4))}</h3>`;}
    else if(/^##\s/.test(ln)){flush();html+=`<h2 style="font-size:16px">${esc(ln.slice(3))}</h2>`;}
    else if(/^#\s/.test(ln)){flush();html+=`<h2>${esc(ln.slice(2))}</h2>`;}
    else if(/^\s*[-*]\s/.test(ln)){if(!inList){html+='<ul>';inList=true;}html+=`<li>${inline(esc(ln.replace(/^\s*[-*]\s/,'')))}</li>`;}
    else if(ln.trim()===''){flush();}
    else{flush();html+=`<p>${inline(esc(ln))}</p>`;}
  }
  if(inTable)html+='</table>'; if(inList)html+='</ul>';
  return html;
  function inline(s){return s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`(.+?)`/g,'<code>$1</code>');}
}
document.getElementById('analyticsMd').innerHTML = mdToHtml(DATA.analytics_md);

/* assumptions block */
const p=DATA.params;
document.getElementById('assumeMd').innerHTML = mdToHtml(
`### Assumptions (all tunable in model.py)
- **Occupancy target** = AirROI **p90** per city (excellent-operator) [sourced]. Sensitivity grids show downside at -10/-15pp.
- **ADR** per unit from AirROI sourced segment medians, premium-adjusted [sourced/estimated].
- **Long-term rents** from FazWaz/DotProperty/Hoozing [sourced]; Da Lat [estimated, low confidence].
- **amort_months = ${p.amort_months}** (spec default; 36mo roughly doubles net for marginal units).
- **platform_fee = ${(p.platform_fee_pct*100).toFixed(0)}%**, **deposit = 1mo advance rent + 1mo caution (${p.deposit_months}mo)**, **cleaning = $${p.cleaning_per_stay}/stay**, **setup = $${p.setup_other_usd}**, mgmt 15%, furnishing/utilities per-bedroom — [estimated].
- **FX** ${FX.toLocaleString()} VND/USD.
- **No Airbnb scraping** (ToS): availability from sourced market occupancy + the licensed AirROI API. Facebook Marketplace excluded (auth-gated + ToS).`);

document.getElementById('foot').innerHTML =
  `Built with a stdlib Python model (model.py) + vendored Chart.js (offline). `+
  `Refresh data: set AIRROI_API_KEY in .env then run <code>python3 fetch.py</code>, then <code>python3 build.py</code>. `+
  `Every figure tagged [sourced] or [estimated]. Not legal or investment advice — verify building classifications and tax with local counsel.`;

/* ---------- deferred, fault-tolerant chart rendering ---------- */
const chartInstances=[];
function runCharts(){
  if(!hasCharts) return;         // leave chart boxes hidden; the tables carry the data
  document.body.classList.add('charts-live');   // reveal chart boxes now that we can draw
  // Two rAFs => wait for layout + a paint frame before Chart.js measures the
  // container (fixes iOS WKWebView creating a 0-height canvas), then resize.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    chartJobs.forEach(job=>{
      try{ const ch=job(); if(ch){ chartInstances.push(ch); } }
      catch(e){ console.warn('chart failed',e); }
    });
    const nudge=()=>chartInstances.forEach(c=>{try{c.resize();}catch(e){}});
    requestAnimationFrame(nudge);
    setTimeout(nudge,400);           // covers slow WKWebView layout
  }));
}
window.addEventListener('resize',()=>chartInstances.forEach(c=>{try{c.resize();}catch(e){}}));
if(document.readyState==='complete') runCharts();
else window.addEventListener('load', runCharts);
</script>
</body>
</html>"""


if __name__ == "__main__":
    payload = build_payload()
    # Fail loudly if any non-finite leaked into the payload.
    json.dumps(payload, allow_nan=False)
    write_report(payload)
    write_dashboard(payload)
    n = len(payload["units"])
    print(f"Built dashboard.html and report.md — {n} units, "
          f"{len(payload['shortlist'])} in shortlist, "
          f"{payload['str_comps_total']} live listings.")
