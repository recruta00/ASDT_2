"""
Vietnam Airbnb Rental-Arbitrage Model
=====================================
Ingestion + arbitrage economics engine + legal gate + scoring.

Pure stdlib (csv, json, os, math) — no third-party deps, no build step.
All money is computed in USD; VND is derived for display via VND_PER_USD.

Data flow:
    data/markets.csv   -> per-city STR stats + seasonality + legal regime
    data/buildings.csv -> candidate units (city, building, bedrooms, building_use)
    data/rents.csv     -> long-term monthly rent per unit
    data/comps.csv     -> nightly ADR (and optional occupancy override) per unit

Every figure carries a source flag: "sourced" or "estimated".
"""

import csv
import os
import math

# --------------------------------------------------------------------------
# Global tunable assumptions (all [estimated] unless noted). Centralized so
# the operator can tune them in one place; documented in report.md/README.md.
# --------------------------------------------------------------------------
AMORT_MONTHS = 18            # capex amortization horizon
PLATFORM_FEE_PCT = 0.03      # ~3% Airbnb host service fee
# VN lease signing outlay = 1 month advance rent + 1 month caution deposit.
ADVANCE_RENT_MONTHS = 1      # first month's rent, paid at signing
CAUTION_MONTHS = 1           # refundable caution deposit
DEPOSIT_MONTHS = ADVANCE_RENT_MONTHS + CAUTION_MONTHS  # total months of rent upfront
DEFAULT_VND_PER_USD = 26000  # FX seed (2026); override via .env FX_VND_PER_USD

# Per-bedroom furnishing capex (USD). Studio keyed as 0.
FURNISHING_CAPEX = {0: 3500, 1: 4000, 2: 6000, 3: 8000, 4: 10000}
SETUP_OTHER_USD = 800        # licensing, photography, listing setup (flat)

# Per-bedroom monthly utilities (USD).
UTILITIES_MONTH = {0: 50, 1: 60, 2: 90, 3: 120, 4: 150}

CLEANING_PER_STAY = 18       # USD per turnover clean

# Per-city operating assumptions.
#   avg_stay_nights: longer stays -> fewer turnovers -> lower cleaning cost.
#     Da Nang skews nomad/longer-stay; Da Lat skews weekend/short.
#   mgmt_fee_pct: 15% assumes light co-hosting / self-managed with tooling
#     (full-service co-hosts charge 18-25%; tune per your operation).
CITY_PARAMS = {
    "Da Nang":          {"avg_stay_nights": 4, "mgmt_fee_pct": 0.15},
    "Ho Chi Minh City": {"avg_stay_nights": 3, "mgmt_fee_pct": 0.15},
    "Da Lat":           {"avg_stay_nights": 2.5, "mgmt_fee_pct": 0.15},
}
DEFAULT_CITY_PARAM = {"avg_stay_nights": 3, "mgmt_fee_pct": 0.15}

# Legal multipliers for scoring.
LEGAL_MULTIPLIER = {"PASS": 1.0, "CONDITIONAL": 0.7, "BLOCKED": 0.0}

# Building-use classes that satisfy the HCMC Decision 19/2026 gate.
HCMC_ALLOWED_USE = {"mixed-use", "tourism-condotel", "tourism/condotel", "tourism-homestay"}

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")


# --------------------------------------------------------------------------
# Ingestion
# --------------------------------------------------------------------------
def _read_csv_path(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = []
        for row in csv.DictReader(f):
            row.pop(None, None)  # drop stray columns from unquoted commas
            rows.append(row)
        return rows


def _read_csv(name):
    return _read_csv_path(os.path.join(DATA_DIR, name))


def _parse_mult(s):
    """Parse a semicolon-separated 12-value seasonality multiplier list."""
    vals = [float(x) for x in s.split(";") if x.strip() != ""]
    if len(vals) != 12:
        raise ValueError(f"Expected 12 monthly multipliers, got {len(vals)}: {s}")
    return vals


def load_markets():
    """Return {city: market_dict}."""
    out = {}
    for r in _read_csv("markets.csv"):
        out[r["city"]] = {
            "city": r["city"],
            "active_listings": int(r["active_listings"]),
            "occ_base": float(r["occ_base"]),
            "occ_airbtics": float(r["occ_airbtics"]),
            "occ_airroi": float(r["occ_airroi"]),
            "adr_base": float(r["adr_base"]),
            "adr_median": float(r["adr_median"]),
            "adr_avg": float(r["adr_avg"]),
            "adr_top25": float(r["adr_top25"]),
            "adr_top10": float(r["adr_top10"]),
            "annual_rev_median": float(r["annual_rev_median"]),
            "monthly_mult": _parse_mult(r["monthly_mult"]),
            "peak_label": r["peak_label"],
            "low_label": r["low_label"],
            "legal_regime": r["legal_regime"],
            "occ_source": r["occ_source"],
            "adr_source": r["adr_source"],
            "notes": r["notes"],
        }
    return out


def load_units():
    """Join buildings + rents + comps into candidate unit records."""
    buildings = {r["building_id"]: r for r in _read_csv("buildings.csv")}
    rents = {r["building_id"]: r for r in _read_csv("rents.csv")}
    comps = {r["building_id"]: r for r in _read_csv("comps.csv")}

    units = []
    for bid, b in buildings.items():
        rent = rents.get(bid)
        comp = comps.get(bid)
        if rent is None or comp is None:
            # Skip units without both rent and comp data.
            continue
        bedrooms = int(b["bedrooms"])
        occ_override = comp.get("occupancy_override", "").strip()
        units.append({
            "building_id": bid,
            "city": b["city"],
            "building": b["building"],
            "area": b["area"],
            "bedrooms": bedrooms,
            "property_type": b.get("property_type", "apartment").strip().lower(),
            "building_use": b["building_use"].strip().lower(),
            "vibe": b["vibe"],
            "notes": b["notes"],
            "source_url": b.get("source_url", "").strip(),
            "monthly_rent_usd": float(rent["monthly_rent_usd"]),
            "rent_source": rent["rent_source"],
            "adr_usd": float(comp["adr_usd"]),
            "adr_source": comp["source"],
            "occupancy_override": float(occ_override) if occ_override else None,
        })
    return units


def load_str_comps():
    """
    Load the sourced real-listing catalog (data/str_comps.csv) harvested from
    the AirROI licensed API. Returns [] if the file is absent (optional).
    """
    path = os.path.join(DATA_DIR, "str_comps.csv")
    if not os.path.exists(path):
        return []
    out = []
    for r in _read_csv_path(path):
        try:
            out.append({
                "listing_id": r["listing_id"],
                "city": r["city"],
                "district": r["district"],
                "listing_name": r["listing_name"],
                "property_type": r["property_type"],
                "bedrooms": int(float(r["bedrooms"])) if r["bedrooms"] else None,
                "adr_usd": float(r["adr_usd"]) if r["adr_usd"] else None,
                "occupancy": float(r["occupancy"]) if r["occupancy"] else None,
                "ttm_revenue": float(r["ttm_revenue"]) if r["ttm_revenue"] else None,
                "avg_stay": float(r["avg_stay"]) if r.get("avg_stay") else None,
                "rating": float(r["rating"]) if r.get("rating") else None,
                "reviews": int(float(r["reviews"])) if r.get("reviews") else None,
                "source": r.get("source", "sourced-airroi"),
            })
        except (ValueError, KeyError):
            continue
    return out


def summarize_str_comps(comps):
    """Per (city, property_type) medians + counts, plus overall top performers."""
    from statistics import median
    buckets = {}
    for c in comps:
        if c["adr_usd"] is None or c["occupancy"] is None:
            continue
        key = (c["city"], c["property_type"])
        buckets.setdefault(key, []).append(c)
    segments = []
    for (city, ptype), rows in sorted(buckets.items()):
        rev_rows = [r for r in rows if r["ttm_revenue"] is not None]
        # Top-20% earners = the revenue-maximizing "best nightly price & occ" combo.
        top = sorted(rev_rows, key=lambda r: r["ttm_revenue"], reverse=True)
        top = top[:max(3, len(top) // 5)] if rev_rows else []
        segments.append({
            "city": city,
            "property_type": ptype,
            "n": len(rows),
            "adr_median": round(median(r["adr_usd"] for r in rows), 1),
            "occ_median": round(median(r["occupancy"] for r in rows), 3),
            "rev_median": round(median(r["ttm_revenue"] for r in rev_rows), 0) if rev_rows else None,
            # Sourced "best" operating point (median of top-20% earners):
            "best_adr": round(median(r["adr_usd"] for r in top), 0) if top else None,
            "best_occ": round(median(r["occupancy"] for r in top), 3) if top else None,
            "best_rev": round(median(r["ttm_revenue"] for r in top), 0) if top else None,
        })
    top = sorted([c for c in comps if c["ttm_revenue"] is not None],
                 key=lambda c: c["ttm_revenue"], reverse=True)[:30]
    return {"segments": segments, "top_performers": top, "total": len(comps)}


# --------------------------------------------------------------------------
# Core economics (pure functions)
# --------------------------------------------------------------------------
def gross_month(adr_usd, occupancy_pct):
    return adr_usd * 30.0 * occupancy_pct


def cleaning_month(avg_stay_nights, cleaning_per_stay):
    return (30.0 / avg_stay_nights) * cleaning_per_stay


def capex_amort(furnishing_capex_usd, setup_other_usd, amort_months=AMORT_MONTHS):
    return (furnishing_capex_usd + setup_other_usd) / amort_months


def compute_unit_economics(
    adr_usd,
    occupancy_pct,
    monthly_rent_usd,
    bedrooms,
    avg_stay_nights,
    mgmt_fee_pct,
    utilities_month=None,
    furnishing_capex_usd=None,
    setup_other_usd=SETUP_OTHER_USD,
    cleaning_per_stay=CLEANING_PER_STAY,
    platform_fee_pct=PLATFORM_FEE_PCT,
    deposit_months=DEPOSIT_MONTHS,
    amort_months=AMORT_MONTHS,
):
    """Return the full economics dict for a single unit at a given ADR/occupancy."""
    if utilities_month is None:
        utilities_month = UTILITIES_MONTH.get(bedrooms, 90)
    if furnishing_capex_usd is None:
        furnishing_capex_usd = FURNISHING_CAPEX.get(bedrooms, 6000)

    gross = gross_month(adr_usd, occupancy_pct)
    platform_fees = gross * platform_fee_pct
    mgmt = gross * mgmt_fee_pct
    clean = cleaning_month(avg_stay_nights, cleaning_per_stay)
    amort = capex_amort(furnishing_capex_usd, setup_other_usd, amort_months)

    opex = monthly_rent_usd + utilities_month + mgmt + clean + platform_fees + amort
    net = gross - opex
    margin = (net / gross) if gross > 0 else 0.0

    advance_rent = ADVANCE_RENT_MONTHS * monthly_rent_usd
    caution_deposit = CAUTION_MONTHS * monthly_rent_usd
    upfront = advance_rent + caution_deposit + furnishing_capex_usd + setup_other_usd
    payback = (upfront / net) if net > 0 else float("inf")

    return {
        "adr_usd": adr_usd,
        "occupancy_pct": occupancy_pct,
        "gross_month": gross,
        "platform_fees": platform_fees,
        "mgmt_fee": mgmt,
        "cleaning_month": clean,
        "utilities_month": utilities_month,
        "capex_amort": amort,
        "opex_month": opex,
        "net_month": net,
        "margin_pct": margin,
        "upfront": upfront,
        "advance_rent": advance_rent,
        "caution_deposit": caution_deposit,
        "payback_months": payback,
    }


def breakeven_occupancy(
    adr_usd,
    monthly_rent_usd,
    bedrooms,
    avg_stay_nights,
    mgmt_fee_pct,
    utilities_month=None,
    furnishing_capex_usd=None,
    setup_other_usd=SETUP_OTHER_USD,
    cleaning_per_stay=CLEANING_PER_STAY,
    platform_fee_pct=PLATFORM_FEE_PCT,
    amort_months=AMORT_MONTHS,
):
    """
    Solve occupancy o where net_month == 0.

    net = gross - opex
        = adr*30*o - [rent + util + clean + amort + (mgmt%+plat%)*adr*30*o]
    0   = adr*30*o*(1 - mgmt% - plat%) - fixed
    o   = fixed / (adr*30*(1 - mgmt% - plat%))
    where fixed = rent + util + clean + amort  (all occupancy-independent).
    """
    if utilities_month is None:
        utilities_month = UTILITIES_MONTH.get(bedrooms, 90)
    if furnishing_capex_usd is None:
        furnishing_capex_usd = FURNISHING_CAPEX.get(bedrooms, 6000)

    clean = cleaning_month(avg_stay_nights, cleaning_per_stay)
    amort = capex_amort(furnishing_capex_usd, setup_other_usd, amort_months)
    fixed = monthly_rent_usd + utilities_month + clean + amort

    variable_coeff = adr_usd * 30.0 * (1.0 - mgmt_fee_pct - platform_fee_pct)
    if variable_coeff <= 0:
        return float("inf")
    return fixed / variable_coeff


def long_term_let_floor(monthly_rent_usd, markup_pct=0.15):
    """
    Comparison baseline: net if the operator simply subleases on a 12-month
    lease at a modest markup instead of running STR. Conservative estimate:
    a `markup_pct` spread over the head-lease rent, no furnishing capex.
    """
    return monthly_rent_usd * markup_pct


def seasonality_curve(base_net, base_gross, monthly_mult):
    """
    Apply per-month multipliers to the occupancy-driven portion of net.
    Gross scales with the multiplier; fixed opex stays constant, so:
        net_m = base_gross*mult_m - (base_gross - base_net)
    Returns (list_of_12_net, annual_total_net).
    """
    # Normalize multipliers to mean 1 so seasonality redistributes the annual
    # total rather than inflating it; the base month == annual-average month.
    mean_m = sum(monthly_mult) / len(monthly_mult)
    norm = [m / mean_m for m in monthly_mult] if mean_m else monthly_mult
    fixed_opex = base_gross - base_net
    curve = [base_gross * m - fixed_opex for m in norm]
    return curve, sum(curve)


def sensitivity_grid(unit, base_occ, base_adr, avg_stay_nights, mgmt_fee_pct):
    """
    Recompute net_month across occupancy {-15,-10,base,+10 pp} x ADR {-20%,base,+20%}.
    Returns dict with 'occ_axis', 'adr_axis', and 'net' as a 4x3 matrix.
    """
    occ_deltas = [-0.15, -0.10, 0.0, 0.10]
    adr_factors = [0.80, 1.0, 1.20]
    occ_axis = [max(0.0, min(1.0, base_occ + d)) for d in occ_deltas]
    adr_axis = [round(base_adr * f, 2) for f in adr_factors]

    matrix = []
    for o in occ_axis:
        row = []
        for a in adr_axis:
            econ = compute_unit_economics(
                adr_usd=a, occupancy_pct=o,
                monthly_rent_usd=unit["monthly_rent_usd"],
                bedrooms=unit["bedrooms"],
                avg_stay_nights=avg_stay_nights,
                mgmt_fee_pct=mgmt_fee_pct,
            )
            row.append(round(econ["net_month"], 2))
        matrix.append(row)
    return {
        "occ_axis": [round(o, 3) for o in occ_axis],
        "adr_axis": adr_axis,
        "net": matrix,
    }


# --------------------------------------------------------------------------
# Legal gate
# --------------------------------------------------------------------------
def legal_status(city, building_use):
    """
    Returns (status, notes_list). building_use is lowercase.
    HCMC: Decision 19/2026 — PASS only for approved commercial/tourism use.
    Da Nang / Da Lat: CONDITIONAL (register + fire-safety + 8% VAT/PIT).
    """
    use = building_use.strip().lower()
    if city == "Ho Chi Minh City":
        if use in HCMC_ALLOWED_USE:
            return "PASS", [
                "Verify building_use classification with building management",
                "Register as licensed accommodation (Decision 19/2026, eff. 2026-04-25)",
                "Fire-safety compliance + 8% VAT/PIT",
            ]
        return "BLOCKED", [
            "Residential-only building — STR prohibited under Decision 19/2026",
            "Excluded from shortlist until re-classified as mixed-use/tourism",
        ]
    # Da Nang / Da Lat
    return "CONDITIONAL", [
        "Business registration required",
        "Fire-safety compliance",
        "8% VAT + PIT on STR revenue",
        "Low enforcement, allowed with registration",
    ]


# --------------------------------------------------------------------------
# Scoring
# --------------------------------------------------------------------------
def _norm(values):
    """Min-max normalize to [0,1]; flat lists -> all 0.5."""
    finite = [v for v in values if math.isfinite(v)]
    if not finite:
        return [0.0 for _ in values]
    lo, hi = min(finite), max(finite)
    if hi - lo < 1e-9:
        return [0.5 for _ in values]
    out = []
    for v in values:
        if not math.isfinite(v):
            out.append(0.0)
        else:
            out.append((v - lo) / (hi - lo))
    return out


def demand_stability(market):
    """
    Reward higher occupancy floor and smaller peak-low spread.
    Uses the seasonality multipliers: stability = occ_base / (1 + spread).
    """
    mult = market["monthly_mult"]
    spread = max(mult) - min(mult)
    return market["occ_base"] / (1.0 + spread)


# --------------------------------------------------------------------------
# Orchestration
# --------------------------------------------------------------------------
def analyze():
    """
    Full pipeline: load data, compute economics for every unit, apply legal
    gate, score, rank. Returns a dict ready for JSON serialization / dashboard.
    """
    markets = load_markets()
    units = load_units()

    records = []
    for u in units:
        market = markets[u["city"]]
        cp = CITY_PARAMS.get(u["city"], DEFAULT_CITY_PARAM)
        avg_stay = cp["avg_stay_nights"]
        mgmt_pct = cp["mgmt_fee_pct"]

        base_occ = u["occupancy_override"] if u["occupancy_override"] is not None else market["occ_base"]
        base_adr = u["adr_usd"]

        econ = compute_unit_economics(
            adr_usd=base_adr, occupancy_pct=base_occ,
            monthly_rent_usd=u["monthly_rent_usd"],
            bedrooms=u["bedrooms"],
            avg_stay_nights=avg_stay, mgmt_fee_pct=mgmt_pct,
        )
        be_occ = breakeven_occupancy(
            adr_usd=base_adr, monthly_rent_usd=u["monthly_rent_usd"],
            bedrooms=u["bedrooms"], avg_stay_nights=avg_stay, mgmt_fee_pct=mgmt_pct,
        )
        lt_floor = long_term_let_floor(u["monthly_rent_usd"])
        curve, annual = seasonality_curve(econ["net_month"], econ["gross_month"], market["monthly_mult"])
        grid = sensitivity_grid(u, base_occ, base_adr, avg_stay, mgmt_pct)
        status, legal_notes = legal_status(u["city"], u["building_use"])

        records.append({
            **u,
            "base_occupancy": round(base_occ, 4),
            "avg_stay_nights": avg_stay,
            "mgmt_fee_pct": mgmt_pct,
            "econ": {k: (round(v, 2) if isinstance(v, float) and math.isfinite(v) else v)
                     for k, v in econ.items()},
            "breakeven_occupancy": round(be_occ, 4) if math.isfinite(be_occ) else None,
            # Max rent the unit can bear and still break even (negotiation target):
            # net = 0 when rent = current_rent + net_month (rent is a $-for-$ opex term).
            "max_supportable_rent": round(u["monthly_rent_usd"] + econ["net_month"], 2),
            "long_term_floor": round(lt_floor, 2),
            "seasonality_net": [round(x, 2) for x in curve],
            "seasonality_annual": round(annual, 2),
            "sensitivity": grid,
            "legal_status": status,
            "legal_notes": legal_notes,
            "demand_stability": round(demand_stability(market), 4),
        })

    _score_and_rank(records)

    eligible = [r for r in records if r["legal_status"] != "BLOCKED"]
    str_comps = load_str_comps()

    return {
        "markets": markets,
        "units": records,
        "shortlist": [r["building_id"] for r in eligible][:10],
        "best_apartments": [r["building_id"] for r in eligible
                            if r["property_type"] == "apartment"][:6],
        "best_villas": [r["building_id"] for r in eligible
                        if r["property_type"] == "villa"][:6],
        "str_comps": str_comps,
        "str_comps_summary": summarize_str_comps(str_comps) if str_comps else None,
        "capital_scenarios": {str(b): deploy_capital(records, b)
                              for b in (20000, 50000, 100000)},
        "params": {
            "amort_months": AMORT_MONTHS,
            "platform_fee_pct": PLATFORM_FEE_PCT,
            "deposit_months": DEPOSIT_MONTHS,
            "vnd_per_usd": get_fx(),
            "cleaning_per_stay": CLEANING_PER_STAY,
            "setup_other_usd": SETUP_OTHER_USD,
            # exposed so the dashboard can recompute economics under user levers
            "furnishing_capex": FURNISHING_CAPEX,
            "utilities_month": UTILITIES_MONTH,
        },
    }


def _score_and_rank(records):
    """Attach `score` to each record and sort in place (desc). BLOCKED -> 0."""
    nets = _norm([r["econ"]["net_month"] for r in records])
    margins = _norm([r["econ"]["margin_pct"] for r in records])
    inv_pb = _norm([
        (1.0 / r["econ"]["payback_months"])
        if (r["econ"]["payback_months"] and math.isfinite(r["econ"]["payback_months"]))
        else 0.0
        for r in records
    ])
    demand = _norm([r["demand_stability"] for r in records])

    for i, r in enumerate(records):
        legal_mult = LEGAL_MULTIPLIER[r["legal_status"]]
        score = (
            0.35 * nets[i] +
            0.20 * margins[i] +
            0.15 * inv_pb[i] +
            0.20 * legal_mult +
            0.10 * demand[i]
        )
        # Hard zero for BLOCKED (legal_mult already 0, but enforce overall).
        if r["legal_status"] == "BLOCKED":
            score = 0.0
        r["score"] = round(score, 4)
        r["rationale"] = _rationale(r)

    records.sort(key=lambda r: r["score"], reverse=True)
    for rank, r in enumerate(records, 1):
        r["rank"] = rank


def _rationale(r):
    e = r["econ"]
    if r["legal_status"] == "BLOCKED":
        return f"BLOCKED — residential-only under Decision 19/2026; excluded from shortlist."
    net = e["net_month"]
    margin = e["margin_pct"] * 100
    pb = e["payback_months"]
    pb_txt = f"{pb:.0f}mo payback" if math.isfinite(pb) else "no payback (net<=0)"
    lease = "PASS" if r["legal_status"] == "PASS" else "conditional (register+tax)"
    return (f"${net:,.0f}/mo net at {margin:.0f}% margin, {pb_txt}; "
            f"{r['city']} {r['bedrooms']}BR {r['building']} — legal {lease}.")


# --------------------------------------------------------------------------
# FX
# --------------------------------------------------------------------------
def deploy_capital(records, budget_usd):
    """
    Given an upfront capital budget, greedily deploy it into the best profitable,
    legal units (by rank = score order) until the budget is exhausted. Each unit
    consumes its `upfront` (deposit + furnishing + setup). Returns the portfolio:
    which units, total upfront used, combined monthly net profit, blended payback,
    and annualized cash-on-cash return.
    """
    picks = []
    spent = 0.0
    net_total = 0.0
    for r in records:  # records are already sorted by score (best first)
        if r["legal_status"] == "BLOCKED":
            continue
        if r["econ"]["net_month"] <= 0:
            continue  # only deploy into profitable units
        up = r["econ"]["upfront"]
        if spent + up <= budget_usd:
            picks.append({
                "building_id": r["building_id"],
                "building": r["building"],
                "city": r["city"],
                "bedrooms": r["bedrooms"],
                "property_type": r["property_type"],
                "upfront": up,
                "net_month": r["econ"]["net_month"],
                "source_url": r.get("source_url", ""),
            })
            spent += up
            net_total += r["econ"]["net_month"]
    annual_net = net_total * 12
    coc = (annual_net / spent) if spent > 0 else 0.0  # cash-on-cash on deployed capital
    return {
        "budget": budget_usd,
        "deployed": round(spent, 2),
        "leftover": round(budget_usd - spent, 2),
        "units": len(picks),
        "net_month": round(net_total, 2),
        "net_year": round(annual_net, 2),
        "cash_on_cash_pct": round(coc * 100, 1),
        "blended_payback_months": round(spent / net_total, 1) if net_total > 0 else None,
        "picks": picks,
    }


def get_fx():
    """VND per USD from env, else default seed."""
    v = os.environ.get("FX_VND_PER_USD")
    if v:
        try:
            return float(v)
        except ValueError:
            pass
    return DEFAULT_VND_PER_USD


if __name__ == "__main__":
    import json
    result = analyze()
    print(json.dumps({
        "n_units": len(result["units"]),
        "shortlist": result["shortlist"],
        "top3": [
            {"rank": r["rank"], "id": r["building_id"], "score": r["score"],
             "net": r["econ"]["net_month"], "legal": r["legal_status"]}
            for r in result["units"][:3]
        ],
    }, indent=2))
