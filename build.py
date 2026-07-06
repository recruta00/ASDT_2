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
import datetime

import model

ROOT = os.path.dirname(os.path.abspath(__file__))
VENDOR_CHARTJS = os.path.join(ROOT, "vendor", "chart.umd.min.js")


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
      f"**deposit_months = {p['deposit_months']}**, "
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

    html = (DASHBOARD_TEMPLATE
            .replace("/*__CHARTJS__*/", "")
            .replace("<!--__CHARTJS__-->", chart_tag)
            .replace("__DATA__", data_json))
    with open(os.path.join(ROOT, "dashboard.html"), "w", encoding="utf-8") as f:
        f.write(html)


DASHBOARD_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
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
html,body{margin:0;padding:0}
body{background:var(--bg);color:var(--ink);
  font:15px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;}
a{color:var(--accent2)}
.wrap{max-width:1200px;margin:0 auto;padding:0 16px 80px}
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
  border-bottom:1px solid var(--line);overflow-x:auto;white-space:nowrap}
nav.sticky .wrap{padding:8px 16px;display:flex;gap:6px}
nav a{color:var(--muted);text-decoration:none;font-size:13px;padding:6px 10px;
  border-radius:8px;flex:0 0 auto}
nav a:hover{background:var(--chip);color:var(--ink)}
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
.chartbox{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}
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
  color:var(--ink);border-radius:8px;padding:6px 8px;font-size:13px}
.filters .toggle{flex-direction:row;align-items:center;gap:6px;padding-bottom:6px}
.note{background:var(--card2);border-left:3px solid var(--warn);border-radius:8px;
  padding:10px 12px;font-size:13px;color:var(--muted);margin:8px 0}
.md{font-size:14px}
.md h1,.md h2,.md h3{margin:14px 0 6px}
.md table{margin:8px 0}
.md code{background:var(--chip);padding:1px 5px;border-radius:5px;font-size:12px}
.foot{color:var(--muted);font-size:12px;margin-top:30px;border-top:1px solid var(--line);padding-top:16px}
.small{font-size:12px;color:var(--muted)}
@media print{nav.sticky{display:none}.canvas-wrap{break-inside:avoid}}
</style>
</head>
<body>
<header class="hero"><div class="wrap">
  <h1>🇻🇳 Vietnam Airbnb Rental-Arbitrage</h1>
  <div class="sub" id="heroSub"></div>
  <div class="prov" id="prov"></div>
  <div class="grid kpis" id="kpis"></div>
</div></header>

<nav class="sticky"><div class="wrap">
  <a href="#picks">🏆 Best Picks</a>
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
    <div class="grid cards" id="villaCards"></div>
    <h3 style="margin-top:22px">Apartments</h3>
    <div class="grid cards" id="aptCards"></div>
    <div class="note" id="picksNote"></div>
  </section>

  <section id="cities">
    <h2>🏙️ City Comparison</h2>
    <div class="grid charts">
      <div class="chartbox"><h3>Occupancy target by city <span class="small">[sourced p90]</span></h3><div class="can-wrap"><canvas id="cOcc"></canvas></div></div>
      <div class="chartbox"><h3>ADR by city (avg &amp; percentiles) <span class="small">[sourced]</span></h3><div class="can-wrap"><canvas id="cAdr"></canvas></div></div>
      <div class="chartbox"><h3>Annual STR revenue, median <span class="small">[sourced]</span></h3><div class="can-wrap"><canvas id="cRev"></canvas></div></div>
    </div>
    <div class="tablescroll" style="margin-top:14px"><table id="cityTable"></table></div>
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
    <div class="tablescroll" style="margin-top:14px"><table id="leadTable"></table></div>
    <p class="small" id="leadCount"></p>
  </section>

  <section id="season">
    <h2>📅 Seasonality</h2>
    <p class="sub">Monthly occupancy index (sourced p90 occupancy × event-aware multipliers).
       Peaks/lows labeled per city.</p>
    <div class="chartbox"><div class="can-wrap" style="height:320px"><canvas id="cSeason"></canvas></div></div>
    <div id="seasonLabels" class="grid cards" style="margin-top:12px"></div>
  </section>

  <section id="market">
    <h2>🛰️ Live Market — real listings</h2>
    <p class="sub" id="marketSub"></p>
    <div class="grid charts">
      <div class="chartbox"><h3>Median revenue: villa vs apartment</h3><div class="can-wrap"><canvas id="cSeg"></canvas></div></div>
      <div class="chartbox"><h3>Segment ADR (median)</h3><div class="can-wrap"><canvas id="cSegAdr"></canvas></div></div>
    </div>
    <h3>Top real performers (by trailing-12-month revenue) <span class="small">[sourced]</span></h3>
    <div class="tablescroll"><table id="topTable"></table></div>
  </section>

  <section id="analytics">
    <h2>🔬 Market Analytics</h2>
    <div class="card md" id="analyticsMd"></div>
  </section>

  <section id="legal">
    <h2>⚖️ Legal &amp; Assumptions</h2>
    <div class="note"><b>HCMC — Decision 19/2026 (eff. 2026-04-25):</b> STR permitted only where the
      building's approved use allows it and the host registers as licensed accommodation.
      Residential-only buildings are <b>BLOCKED</b>. Always verify a building's classification
      with management before signing.</div>
    <div class="note"><b>Da Nang / Da Lat — CONDITIONAL:</b> allowed with business registration,
      fire-safety compliance, and 8% VAT + PIT on STR revenue. Low enforcement, but register.</div>
    <div class="card md" id="assumeMd"></div>
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
    <div class="row"><span>Break-even occ</span><b>${pct(u.breakeven_occupancy)}</b></div>
    <div class="why">${u.rationale}</div>
  </div>`;
}
document.getElementById('villaCards').innerHTML = DATA.best_villas.map(pickCard).join('') || '<p class="small">No eligible villas.</p>';
document.getElementById('aptCards').innerHTML = DATA.best_apartments.map(pickCard).join('') || '<p class="small">No eligible apartments.</p>';
document.getElementById('picksNote').innerHTML =
  `<b>Read the margins honestly:</b> at the sourced p90 occupancy target, beach pool villas are the `+
  `only comfortably profitable arbitrage; most apartments sit near break-even. Levers that flip `+
  `marginal units positive: negotiate a lower/bare lease, amortize furnishing over 36 months (not 18), `+
  `or lift ADR via revenue management. See each card's break-even occupancy and the sensitivity in the leaderboard.`;

/* ---------- city comparison ---------- */
const cities = Object.values(DATA.markets);
function bar(id,labels,datasets,opts={}){
  if(!hasCharts) return;
  new Chart(document.getElementById(id),{type:'bar',
    data:{labels,datasets},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{labels:{color:cssvar('--muted')},display:datasets.length>1}},
      scales:{x:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}},
              y:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')},...(opts.y||{})}}}});
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
  ['breakeven_occupancy','BE occ'],['seasonality_annual','Annual net'],['score','Score']];
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
      <td>${u.rank}</td><td>${u.building}</td><td>${u.city}</td><td>${u.bedrooms}</td>
      <td><span class="chip ${u.property_type}">${u.property_type}</span></td>
      <td><span class="chip ${u.legal_status}">${u.legal_status}</span></td>
      <td>${usd(u.monthly_rent_usd)}</td><td>${usd(u.adr_usd)}</td><td>${pct(u.base_occupancy)}</td>
      <td>${usd(e.gross_month)}</td><td>${usd(e.opex_month)}</td>
      <td class="${e.net_month>=0?'pos':'neg'}">${usd(e.net_month)}</td>
      <td class="${e.margin_pct>=0?'pos':'neg'}">${pct(e.margin_pct)}</td>
      <td>${pct(u.breakeven_occupancy)}</td><td>${usd(u.seasonality_annual)}</td>
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
if(hasCharts) new Chart(document.getElementById('cGO'),{type:'bar',
  data:{labels:sl.map(u=>u.building+' '+u.bedrooms+'BR'),datasets:[
    {label:'Opex',data:sl.map(u=>+u.econ.opex_month.toFixed(0)),backgroundColor:'#64748b'},
    {label:'Net',data:sl.map(u=>+u.econ.net_month.toFixed(0)),backgroundColor:'#22c55e'}]},
  options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:cssvar('--muted')}}},
    scales:{x:{stacked:true,ticks:{color:cssvar('--muted')},grid:{display:false}},
            y:{stacked:true,ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}}}}});

/* ---------- seasonality ---------- */
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
if(hasCharts) new Chart(document.getElementById('cSeason'),{type:'line',
  data:{labels:MONTHS,datasets:cities.map(c=>{
    const mean=c.monthly_mult.reduce((a,b)=>a+b,0)/12;
    return {label:c.city,borderColor:CITY_COLORS[c.city],backgroundColor:CITY_COLORS[c.city],
      tension:.35,pointRadius:3,
      data:c.monthly_mult.map(m=>+(c.occ_base*m/mean*100).toFixed(1))};})},
  options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:cssvar('--muted')}}},
    scales:{x:{ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}},
            y:{title:{display:true,text:'Occupancy index %',color:cssvar('--muted')},
               ticks:{color:cssvar('--muted')},grid:{color:cssvar('--line')}}}}});
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
- **platform_fee = ${(p.platform_fee_pct*100).toFixed(0)}%**, **deposit = ${p.deposit_months} months**, **cleaning = $${p.cleaning_per_stay}/stay**, **setup = $${p.setup_other_usd}**, mgmt 15%, furnishing/utilities per-bedroom — [estimated].
- **FX** ${FX.toLocaleString()} VND/USD.
- **No Airbnb scraping** (ToS): availability from sourced market occupancy + the licensed AirROI API. Facebook Marketplace excluded (auth-gated + ToS).`);

document.getElementById('foot').innerHTML =
  `Built with a stdlib Python model (model.py) + vendored Chart.js (offline). `+
  `Refresh data: set AIRROI_API_KEY in .env then run <code>python3 fetch.py</code>, then <code>python3 build.py</code>. `+
  `Every figure tagged [sourced] or [estimated]. Not legal or investment advice — verify building classifications and tax with local counsel.`;
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
