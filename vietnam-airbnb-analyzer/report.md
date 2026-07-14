# Vietnam Airbnb Rental-Arbitrage — Executive Report

_Generated 2026-07-14 · FX 26,000 VND/USD · USD basis, VND shown alongside in the dashboard._

**What this answers:** which specific buildings/units to lease long-term and sublet short-term across Da Nang, Da Lat, and Ho Chi Minh City for maximum **net** monthly margin — with legal viability as a hard gate.

> Figures are marked **[sourced]** (AirROI licensed API / public rental portals) or **[estimated]** (documented assumptions). STR occupancy/ADR are sourced from the AirROI Airbnb Data API; long-term rents from FazWaz/DotProperty/Hoozing/Chotot; operating cost assumptions are estimated and centralized in `model.py`.

## Take these — ranked shortlist

| # | Unit | City | Type | Legal | Net/mo | Margin | Payback | Score |
|---|------|------|------|-------|-------:|-------:|--------:|------:|
| 1 | My An Luxury Villa 3BR | Da Nang | villa | CONDITIONAL | $186 | 5% | 69mo | 0.84 |
| 2 | Saigon Royal 1BR | Ho Chi Minh City | apartment | PASS | $-67 | -6% | — | 0.70 |
| 3 | An Gia Skyline 2BR | Ho Chi Minh City | apartment | PASS | $-119 | -11% | — | 0.66 |
| 4 | Icon56 1BR | Ho Chi Minh City | apartment | PASS | $-209 | -21% | — | 0.59 |
| 5 | Xuan Huong Lake house 3BR | Da Lat | villa | CONDITIONAL | $-50 | -3% | — | 0.58 |
| 6 | Monarchy 2BR | Da Nang | apartment | CONDITIONAL | $-25 | -2% | — | 0.57 |
| 7 | F.Home 1BR | Da Nang | apartment | CONDITIONAL | $-38 | -5% | — | 0.56 |
| 8 | Azura 2BR | Da Nang | apartment | CONDITIONAL | $-115 | -6% | — | 0.52 |
| 9 | Central homestay 2BR | Da Lat | apartment | CONDITIONAL | $-134 | -12% | — | 0.51 |
| 10 | Hillside villa 4BR | Da Lat | villa | CONDITIONAL | $-186 | -10% | — | 0.50 |

### Best villas / houses

- **My An Luxury Villa 3BR** (Da Nang) — $186/mo net, 5% margin, legal CONDITIONAL. $186/mo net at 5% margin, 69mo payback; Da Nang 3BR My An Luxury Villa — legal conditional (register+tax).
- **Xuan Huong Lake house 3BR** (Da Lat) — $-50/mo net, -3% margin, legal CONDITIONAL. $-50/mo net at -3% margin, no payback (net<=0); Da Lat 3BR Xuan Huong Lake house — legal conditional (register+tax).
- **Hillside villa 4BR** (Da Lat) — $-186/mo net, -10% margin, legal CONDITIONAL. $-186/mo net at -10% margin, no payback (net<=0); Da Lat 4BR Hillside villa — legal conditional (register+tax).
- **The Point villa 3BR** (Da Nang) — $-352/mo net, -11% margin, legal CONDITIONAL. $-352/mo net at -11% margin, no payback (net<=0); Da Nang 3BR The Point villa — legal conditional (register+tax).
- **Euro Village villa 4BR** (Da Nang) — $-609/mo net, -16% margin, legal CONDITIONAL. $-609/mo net at -16% margin, no payback (net<=0); Da Nang 4BR Euro Village villa — legal conditional (register+tax).
- **One River villa 3BR** (Da Nang) — $-588/mo net, -21% margin, legal CONDITIONAL. $-588/mo net at -21% margin, no payback (net<=0); Da Nang 3BR One River villa — legal conditional (register+tax).

### Best apartments

- **Saigon Royal 1BR** (Ho Chi Minh City) — $-67/mo net, -6% margin, legal PASS. $-67/mo net at -6% margin, no payback (net<=0); Ho Chi Minh City 1BR Saigon Royal — legal PASS.
- **An Gia Skyline 2BR** (Ho Chi Minh City) — $-119/mo net, -11% margin, legal PASS. $-119/mo net at -11% margin, no payback (net<=0); Ho Chi Minh City 2BR An Gia Skyline — legal PASS.
- **Icon56 1BR** (Ho Chi Minh City) — $-209/mo net, -21% margin, legal PASS. $-209/mo net at -21% margin, no payback (net<=0); Ho Chi Minh City 1BR Icon56 — legal PASS.
- **Monarchy 2BR** (Da Nang) — $-25/mo net, -2% margin, legal CONDITIONAL. $-25/mo net at -2% margin, no payback (net<=0); Da Nang 2BR Monarchy — legal conditional (register+tax).
- **F.Home 1BR** (Da Nang) — $-38/mo net, -5% margin, legal CONDITIONAL. $-38/mo net at -5% margin, no payback (net<=0); Da Nang 1BR F.Home — legal conditional (register+tax).
- **Azura 2BR** (Da Nang) — $-115/mo net, -6% margin, legal CONDITIONAL. $-115/mo net at -6% margin, no payback (net<=0); Da Nang 2BR Azura — legal conditional (register+tax).

## What a budget earns (capital planner)

Greedy deployment into the best **profitable & legal** units (each consumes deposit + furnishing + setup upfront):

| Budget | Units funded | Capital deployed | Monthly profit | Annual | Cash-on-cash |
|--------|-------------:|-----------------:|---------------:|-------:|-------------:|
| $20,000 | 1 | $12,800 | $186 | $2,233 | 17% |
| $50,000 | 1 | $12,800 | $186 | $2,233 | 17% |
| $100,000 | 1 | $12,800 | $186 | $2,233 | 17% |

> **Only 1 of 21 candidate units are profitable & legal at current asking rents** — so above a small threshold, *more capital sits idle*: the binding constraint is **sourcing leases that pencil**, not money. Negotiate each lease toward its **max supportable rent** (in the dashboard leaderboard); many marginal units flip positive with a 10–15% rent cut, 36-month furnishing amortization, or premium ADR.

## Verdict by city

- **Da Nang** — **GO (villas).** Beach pool villas (An Bang / My Khe) are the only comfortably profitable arbitrage; mid-market apartments are break-even at current rent-to-ADR ratios. CONDITIONAL legal (register + 8% VAT/PIT).
- **Ho Chi Minh City** — **GATED.** Decision 19/2026 blocks STR in residential-only buildings — the highest-revenue villa (Thao Dien) is legally BLOCKED. Only mixed-use / tourism-classified towers (D4 river stock) can pass, and those are thin-margin. Verify each building's approved use before signing.
- **Da Lat** — **CAUTION.** Sourced occupancy is the lowest of the three markets and short average stays inflate cleaning cost; villa/house arbitrage is negative at current lease costs. Domestic weekend/Tet demand only. CONDITIONAL legal.

## Assumptions log

- **Occupancy (occ_base)** = AirROI **p90** occupancy per city (excellent-operator target) [sourced]. Market average and Airbtics figures retained for context. Rental arbitrage only pencils at top-decile execution; sensitivity grids show downside.
- **ADR** per unit from AirROI sourced segment medians, adjusted up for premium buildings [sourced/estimated]. Market ADR percentiles sourced from AirROI.
- **Long-term rents** from public portals (FazWaz/DotProperty/Hoozing) [sourced] except Da Lat (thin portal inventory — [estimated], low confidence) and interpolated villa 3BR.
- **amort_months = 18** (spec default). Furnishing+setup amortized over 18 months is conservative; extending to 36 months (typical for 2–5yr leases) roughly doubles net for marginal units — a key lever, shown in sensitivity.
- **platform_fee_pct = 3%**, **deposit = 1mo advance rent + 1mo caution (2mo total)**, **cleaning_per_stay = $18**, **setup_other = $800**, mgmt_fee 15%, furnishing/utilities per-bedroom — all [estimated], centralized in `model.py`.
- **FX** 26,000 VND/USD (2026 seed; override via `.env`).
- **Da Lat data gap** filled with sourced AirROI Lam Dong figures (occ ~39% avg, ADR ~$46); Nha Trang/Hoi An proxy retained as [estimated] contrast.
- **Legal:** HCMC Decision 19/2026 (eff. 2026-04-25) — STR only where approved building use permits + host registered. Da Nang/Da Lat CONDITIONAL (register + fire-safety + 8% VAT/PIT). BLOCKED units excluded from shortlist.
- **Compliance note:** 0% of 815 sampled live listings were registered — a market-wide gap and a moat for a compliant operator.

## Data sources
- **STR occupancy/ADR/revenue + comparable listings:** AirROI Airbnb Data API (licensed) — https://www.airroi.com/api
- **Long-term rents:** FazWaz.vn, DotProperty.com.vn, Hoozing, Chotot, MySaigonCity
- **No Airbnb live-site or calendar scraping** (ToS). Availability modeled from sourced market occupancy. Facebook Marketplace not used (auth-gated + ToS).

_See `data/analytics.md` for the full 684-listing market analytics, and open `dashboard.html` for the interactive leaderboard, charts, and best-picks._
