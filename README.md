# Vietnam Airbnb Rental-Arbitrage Analyzer

Decide **which specific buildings/units to lease long-term and sublet short-term**
across **Da Nang, Da Lat, and Ho Chi Minh City** for maximum **net** monthly margin —
with **legal viability as a hard gate**.

Open **`dashboard.html`** in any browser (double-click, or email it to your team). It's a
single self-contained file — data embedded, Chart.js vendored inline, works fully offline.

## What's inside

| File | Purpose |
|------|---------|
| `dashboard.html` | **The deliverable.** Best-picks (apartments & villas), leaderboard, charts, seasonality, live-market comps, analytics. Responsive/mobile, offline. |
| `report.md` | Executive summary: ranked shortlist, per-city verdicts, assumptions log. |
| `data/analytics.md` | Deep analytics over 800+ real listings (villa premium, ADR as lever, registration gap). |
| `data/str_products_best.md` | Top 15 real apartments & villas to emulate, by trailing-12-month revenue. |
| `model.py` | Ingestion + arbitrage economics engine + legal gate + scoring (stdlib only). |
| `test_model.py` | Unit tests (stdlib `unittest`). |
| `fetch.py` | Refresh market data from the **licensed AirROI API** (ToS-safe). |
| `build.py` | Regenerate `dashboard.html` + `report.md` from the CSVs. |
| `data/*.csv` | Inputs (see below). |

## Quick start

```bash
python3 test_model.py     # run the unit tests (no install needed)
python3 build.py          # regenerate dashboard.html + report.md
# then open dashboard.html
```

No dependencies required for the model/dashboard (Python 3 stdlib + vendored Chart.js).
`fetch.py` uses `requests` (already common); it degrades gracefully if absent.

## Refreshing the data

### 1. Market STR stats (occupancy / ADR / revenue) — licensed API
We use **AirROI** (compliant Airbnb Data API — **no scraping of Airbnb**).

1. Buy a key: <https://www.airroi.com/api> → **Developers → Airbnb API Pricing** (free tier available), get the key in the **Developer Dashboard**.
2. Put it in `.env` (git-ignored):
   ```
   AIRROI_API_KEY=your_key_here
   FX_VND_PER_USD=26000
   ```
3. Refresh:
   ```bash
   python3 fetch.py            # rewrites data/markets.csv with sourced occupancy/ADR
   python3 fetch.py --dry-run  # preview without writing
   python3 build.py            # rebuild the dashboard
   ```
   Without a key, the seeded (already-sourced) values are kept.

> **"Airbnb calendar" data:** buy availability/occupancy from a licensed provider
> (AirROI, or AirDNA <https://www.airdna.co/products/api>, Airbtics
> <https://airbtics.com/airbnb-api>). We do **not** scrape Airbnb's site/calendar
> endpoints — that violates their ToS and the data is unreliable.

### 2. Long-term rents — public portals
Edit `data/rents.csv`. Grab current rents from FazWaz.vn, DotProperty.com.vn, Hoozing,
Chotot.com, Batdongsan.com.vn. Set `rent_source` to `sourced` or `estimated`. Convert VND→USD
at the rate in `.env`.

### 3. Guest-side nightly comps
Edit `data/comps.csv` (per-building `adr_usd`, optional `occupancy_override`, `source`).
Or let the AirROI harvest populate `data/str_comps.csv` (real listings).

> **Facebook Marketplace** is auth-gated and its ToS forbids scraping, so it is not
> ingested automatically. To include a listing you found there, add a row to
> `data/rents.csv` (or `data/comps.csv`) with `source=facebook` — the model will pick it up.

## Data files (schemas)

- **`data/markets.csv`** — per city: `occ_base` (target = AirROI p90), `occ_airbtics`, `occ_airroi`,
  `adr_base/median/avg/top25/top10`, `annual_rev_median`, `monthly_mult` (12 `;`-separated seasonality
  factors), `peak_label`, `low_label`, `legal_regime`, `occ_source`, `adr_source`.
- **`data/buildings.csv`** — `building_id`, `city`, `building`, `area`, `bedrooms`, `property_type`
  (apartment/villa), `building_use` (mixed-use / tourism-condotel / tourism-homestay / residential).
- **`data/rents.csv`** — `building_id`, `monthly_rent_usd`, `rent_source`.
- **`data/comps.csv`** — `building_id`, `adr_usd`, `occupancy_override`, `source`.
- **`data/str_comps.csv`** — harvested real listings (sourced): ADR, occupancy, TTM revenue, ratings, etc.

Keep CSV free-text fields **comma-free** (use `;` or `-`) — some fields aren't quoted.

## The model (in one screen)

```
gross_month   = adr * 30 * occupancy
platform_fees = gross * 3%
cleaning      = (30 / avg_stay_nights) * cleaning_per_stay
capex_amort   = (furnishing_capex + setup) / amort_months     # default 18
opex          = rent + utilities + mgmt(15%) + cleaning + platform_fees + capex_amort
net_month     = gross - opex ;  margin = net/gross
payback       = upfront / net ;  upfront = deposit*rent + capex + setup
breakeven_occupancy solves net = 0
score = 0.35*net + 0.20*margin + 0.15*(1/payback) + 0.20*legal + 0.10*demand_stability
```

**Legal gate:** HCMC → `PASS` only if building use ∈ {mixed-use, tourism/condotel} under
**Decision 19/2026** (else `BLOCKED`); Da Nang/Da Lat → `CONDITIONAL` (register + fire-safety +
8% VAT/PIT). `BLOCKED` units score 0 and are excluded from the shortlist.

All operating assumptions live at the top of `model.py` and are tunable.

## Key findings (seed data)
- **Villas beat apartments decisively** — Da Nang villa median revenue ~2.2× apartments; the
  top real performers are all private-pool villas ($50–83k/yr).
- **Apartment arbitrage is structurally thin** at current rent-to-ADR ratios; only beach pool
  villas clear a comfortable margin at the sourced p90-occupancy target.
- **HCMC's highest-revenue villa is legally BLOCKED** (residential land under Decision 19/2026) —
  the legal gate is the binding constraint there.
- **0% of sampled live listings are registered** — a compliance gap and a moat for a compliant operator.

## Notes
- Every figure in the UI is tagged **[sourced]** or **[estimated]**.
- Not legal or investment advice — verify each building's approved-use classification and tax
  treatment with local counsel before signing.
