"""
Licensed STR data fetcher (ToS-compliant)
=========================================
Refreshes data/markets.csv (and, where available, comps) with LIVE occupancy /
ADR / revenue from a licensed provider the operator has purchased.

This does NOT scrape Airbnb's live site or calendar endpoints (that violates
Airbnb's ToS and returns unreliable data). Instead it calls the official
AirROI Airbnb Data API — the compliant way to obtain availability/occupancy.

  Provider : AirROI   https://www.airroi.com/api
  Buy key  : https://www.airroi.com/api  ->  Developers -> Airbnb API Pricing
  Docs     : https://www.airroi.com/api/documentation
  Auth     : header  X-API-KEY: <key>
  Base URL : https://api.airroi.com
  Endpoint : GET /calculator/estimate?lat=&lng=&bedrooms=&baths=&guests=&currency=usd
  Returns  : projected occupancy, ADR, annual revenue (each with p25/p50/p75/p90
             percentiles) + 12-month revenue distribution, for the location.

Usage:
  1. Put AIRROI_API_KEY in .env (git-ignored).  See .env.example.
  2. python3 fetch.py            # refresh all three markets, rewrite markets.csv
  3. python3 fetch.py --dry-run  # print what would change, write nothing

If no key is set or the API errors, existing seeded CSV values are kept and the
fetcher exits cleanly (fallback), so the pipeline never breaks.
"""

import csv
import os
import sys
import json
import time

try:
    import requests
except ImportError:  # pragma: no cover
    requests = None

BASE_URL = "https://api.airroi.com"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
MARKETS_CSV = os.path.join(DATA_DIR, "markets.csv")

# Representative city-centre coordinates for the calculator estimate.
CITY_COORDS = {
    "Da Nang":          (16.0544, 108.2022),  # Hai Chau / My Khe core
    "Ho Chi Minh City": (10.7769, 106.7009),  # District 1
    "Da Lat":           (11.9404, 108.4583),  # Xuan Huong Lake
}
# Representative unit shape for the market baseline estimate.
EST_BEDROOMS, EST_BATHS, EST_GUESTS = 2, 1, 4

RATE_LIMIT_SECONDS = 1.2  # be polite between calls


def load_env(path=None):
    """Minimal .env loader (no external dep)."""
    path = path or os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip())


def _estimate(api_key, lat, lng, bedrooms=EST_BEDROOMS, baths=EST_BATHS, guests=EST_GUESTS):
    resp = requests.get(
        f"{BASE_URL}/calculator/estimate",
        params={"lat": lat, "lng": lng, "bedrooms": bedrooms,
                "baths": baths, "guests": guests, "currency": "usd"},
        headers={"X-API-KEY": api_key},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def fetch_market(city, api_key):
    """
    Return sourced market metrics for a city, or {} on failure:
      occ_avg, occ_p75, adr_avg, adr_p50, adr_p75, adr_p90, revenue_p50
    """
    coords = CITY_COORDS.get(city)
    if not coords:
        return {}
    try:
        d = _estimate(api_key, coords[0], coords[1])
        pct = d.get("percentiles", {})
        occ_p = pct.get("occupancy", {})
        adr_p = pct.get("average_daily_rate", {})
        rev_p = pct.get("revenue", {})
        out = {
            "occ_avg": d.get("occupancy"),
            "occ_p75": occ_p.get("p75"),
            "occ_p90": occ_p.get("p90"),
            "adr_avg": d.get("average_daily_rate"),
            "adr_p50": adr_p.get("p50"),
            "adr_p75": adr_p.get("p75"),
            "adr_p90": adr_p.get("p90"),
            "revenue_p50": rev_p.get("p50"),
        }
        return {k: v for k, v in out.items() if v is not None}
    except Exception as e:  # network / auth / schema — fall back gracefully
        print(f"  [warn] {city}: fetch failed ({e}); keeping seeded values.")
        return {}


def refresh_markets(dry_run=False):
    load_env()
    api_key = os.environ.get("AIRROI_API_KEY")
    if not api_key:
        print("No AIRROI_API_KEY set — keeping seeded CSV values (fallback). "
              "Buy a key at https://www.airroi.com/api and add it to .env.")
        return False
    if requests is None:
        print("`requests` not installed — cannot fetch; keeping seeded values.")
        return False

    with open(MARKETS_CSV, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
        fieldnames = rows[0].keys()

    changed = False
    for row in rows:
        city = row["city"]
        print(f"Fetching {city} from AirROI /calculator/estimate ...")
        data = fetch_market(city, api_key)
        if not data:
            continue
        # occ_base = p90 occupancy = excellent-operator target (data-driven).
        if "occ_p90" in data:
            row["occ_base"] = f"{data['occ_p90']:.3f}"
            row["occ_source"] = "sourced"
            changed = True
        if "occ_avg" in data:
            row["occ_airroi"] = f"{data['occ_avg']:.3f}"
        if "adr_avg" in data:
            row["adr_avg"] = f"{data['adr_avg']:.0f}"
            row["adr_base"] = f"{data['adr_avg']:.0f}"
            row["adr_source"] = "sourced"
            changed = True
        if "adr_p50" in data:
            row["adr_median"] = f"{data['adr_p50']:.0f}"
        if "adr_p75" in data:
            row["adr_top25"] = f"{data['adr_p75']:.0f}"
        if "adr_p90" in data:
            row["adr_top10"] = f"{data['adr_p90']:.0f}"
        if "revenue_p50" in data:
            row["annual_rev_median"] = f"{data['revenue_p50']:.0f}"
        print(f"  -> {data}")
        time.sleep(RATE_LIMIT_SECONDS)

    if not changed:
        print("No values updated.")
        return False
    if dry_run:
        print("[dry-run] Not writing markets.csv.")
        return True

    with open(MARKETS_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    print(f"Wrote refreshed data to {MARKETS_CSV}")
    return True


if __name__ == "__main__":
    dry = "--dry-run" in sys.argv
    refresh_markets(dry_run=dry)
