# Vietnam STR Comps — Analytics Pack

*Source: `data/str_comps.csv` (licensed AirROI API). Snapshot of 684 listings across Da Lat, Da Nang, and Ho Chi Minh City. All revenue = trailing-twelve-month (TTM). Medians used throughout (robust to outliers); p25/p75 show the middle 50% spread. Segments with n<3 are suppressed.*

---

## Key Findings

- **Villas materially out-earn apartments** in the two beach/leisure markets: Da Nang villa median revenue **$10,001 vs $4,440** for apartments (**+125%**); Da Lat **$5,029 vs $3,821** (+32%). In HCMC the gap is small at the median (+5%) but explodes at the top end (4BR villa median **$35,506**).
- **ADR is the strongest revenue lever** (Pearson r = **0.74**), ahead of bedroom count (r = 0.55) and occupancy (r = 0.45). Listings at ≥$200 ADR earn a median **$29,439** — roughly **9x** the <$50 ADR tier ($3,174).
- **Bedrooms scale revenue steeply**: 4BR listings earn a median **$16,922** vs **$3,126** for 1BR — a **5.4x** step. Target 3-4BR stock, not studios/1BRs.
- **The "pool / luxury / villa" naming signal is real money**: listings whose name contains those words earn a median **$9,008 vs $5,180** for the rest (**+74%**), at nearly double the ADR ($94 vs $50). Amenity-led positioning pays.
- **Occupancy has diminishing returns**: revenue jumps from the <40% tier ($4,258) to the 40-55% tier ($9,952), then plateaus (~$11.7-11.8k) above 55%. Chasing ADR/size beats chasing the last points of occupancy.
- **0% of listings are registered** across all three cities — a market-wide legal-compliance gap. This is both a risk flag and a potential differentiator/moat for a compliant operator.
- **HCMC District 3, Binh Thanh, and District 1** are the top revenue districts (median TTM $17,965 / $10,077 / $9,658); Da Nang's Ngũ Hành Sơn ($7,585) leads the beach market.

---

## 1. Per-City Benchmarks

Median (p25 / p75). ADR and revenue in USD; occupancy as a fraction.

| City | n | ADR med (p25-p75) | Occupancy med (p25-p75) | TTM Rev med (p25-p75) |
|---|--:|---|---|---|
| Ho Chi Minh City | 277 | $61 ($44-$99) | 0.30 (0.20-0.50) | $6,575 ($3,669-$12,302) |
| Da Nang | 273 | $55 ($28-$89) | 0.40 (0.20-0.60) | $5,537 ($3,120-$12,747) |
| Da Lat | 134 | $50 ($31-$78) | 0.30 (0.20-0.40) | $4,381 ($2,717-$7,306) |

**Read:** HCMC commands the highest ADR and median revenue. Da Nang has the highest median occupancy (leisure demand) and the widest upside (p75 revenue highest of the three). Da Lat is the smallest, lowest-yield market.

---

## 2. Segment Benchmarks — (City × Property Type × Bedrooms), n≥3

Median (p25 / p75).

| City | Type | BR | n | ADR med | Occ med | TTM Rev med (p25-p75) |
|---|---|--:|--:|--:|--:|---|
| Da Lat | apartment | 1 | 28 | $29 | 0.30 | $2,372 ($1,468-$4,388) |
| Da Lat | apartment | 2 | 17 | $57 | 0.30 | $5,683 ($3,595-$8,511) |
| Da Lat | apartment | 3 | 4 | $62 | 0.40 | $7,222 ($5,464-$10,624) |
| Da Lat | villa | 1 | 19 | $26 | 0.30 | $2,852 ($2,107-$4,990) |
| Da Lat | villa | 2 | 17 | $47 | 0.30 | $5,029 ($2,650-$7,664) |
| Da Lat | villa | 3 | 26 | $78 | 0.20 | $5,204 ($3,913-$11,235) |
| Da Lat | villa | 4 | 18 | $95 | 0.20 | $5,853 ($4,448-$18,263) |
| Da Nang | apartment | 0 | 5 | $35 | 0.20 | $2,770 ($2,201-$4,440) |
| Da Nang | apartment | 1 | 61 | $22 | 0.30 | $2,773 ($1,626-$3,959) |
| Da Nang | apartment | 2 | 59 | $50 | 0.30 | $4,879 ($3,284-$7,529) |
| Da Nang | apartment | 3 | 21 | $84 | 0.50 | $14,522 ($8,132-$15,816) |
| Da Nang | apartment | 4 | 5 | $154 | 0.20 | $12,747 ($7,058-$14,909) |
| Da Nang | villa | 1 | 19 | $20 | 0.40 | $2,206 ($1,670-$3,423) |
| Da Nang | villa | 2 | 15 | $44 | 0.60 | $7,191 ($5,025-$8,266) |
| Da Nang | villa | 3 | 36 | $82 | 0.30 | $9,172 ($5,035-$17,074) |
| Da Nang | villa | 4 | 51 | $117 | 0.40 | **$19,181** ($11,812-$24,417) |
| Ho Chi Minh City | apartment | 0 | 8 | $32 | 0.30 | $2,952 ($2,304-$3,836) |
| Ho Chi Minh City | apartment | 1 | 45 | $41 | 0.40 | $3,930 ($2,566-$6,440) |
| Ho Chi Minh City | apartment | 2 | 67 | $48 | 0.40 | $6,495 ($3,270-$10,139) |
| Ho Chi Minh City | apartment | 3 | 60 | $80 | 0.30 | $9,473 ($4,666-$14,894) |
| Ho Chi Minh City | apartment | 4 | 29 | $129 | 0.30 | $14,598 ($7,444-$20,471) |
| Ho Chi Minh City | villa | 1 | 20 | $43 | 0.30 | $4,171 ($3,270-$5,389) |
| Ho Chi Minh City | villa | 2 | 8 | $52 | 0.30 | $4,605 ($3,517-$8,130) |
| Ho Chi Minh City | villa | 3 | 18 | $84 | 0.20 | $7,170 ($5,034-$9,705) |
| Ho Chi Minh City | villa | 4 | 20 | $200 | 0.50 | **$35,506** ($17,622-$49,337) |

**Standout segments:** HCMC 4BR villas (median $35,506) and Da Nang 4BR villas (median $19,181) are the two highest-yielding segments in the dataset by a wide margin.

---

## 3. Apartment vs Villa — The Villa Premium

Median values per city.

| City | Type | n | ADR med | Occ med | Rev med | Villa Rev premium |
|---|---|--:|--:|--:|--:|--:|
| Da Lat | apartment | 53 | $39 | 0.27 | $3,821 | — |
| Da Lat | villa | 81 | $60 | 0.24 | $5,029 | **+32%** |
| Da Nang | apartment | 151 | $42 | 0.35 | $4,440 | — |
| Da Nang | villa | 122 | $81 | 0.42 | $10,001 | **+125%** |
| Ho Chi Minh City | apartment | 209 | $58 | 0.33 | $6,568 | — |
| Ho Chi Minh City | villa | 68 | $73 | 0.32 | $6,924 | **+5%** |

**Read:** The villa premium is largest in **Da Nang** (+125% revenue, driven by both higher ADR and higher occupancy) and meaningful in Da Lat (+32%). In HCMC the median villa premium is thin (+5%) because villa stock is bimodal — modest 1-2BR villas drag the median, while 4BR villas are the market's top earners.

---

## 4. Revenue Drivers

Pearson correlation with TTM revenue (n=684): **ADR r = 0.74**, **bedrooms r = 0.55**, **occupancy r = 0.45**. ADR is the dominant driver.

**(a) Bedrooms → Revenue** (median TTM by bedroom count)

| Bedrooms | n | Rev med (p25-p75) |
|--:|--:|---|
| 0 (studio) | 18 | $2,761 ($1,920-$3,747) |
| 1 | 192 | $3,126 ($2,076-$4,770) |
| 2 | 183 | $5,537 ($3,313-$9,089) |
| 3 | 165 | $8,488 ($4,898-$14,895) |
| 4 | 125 | $16,922 ($8,420-$24,521) |

*(One 5BR listing excluded from the trend; n=1.)* Each added bedroom lifts the median; the 3→4BR jump is the steepest.

**(b) Occupancy → Revenue** (median TTM by occupancy band)

| Occupancy band | n | Rev med (p25-p75) |
|---|--:|---|
| <40% | 409 | $4,258 ($2,434-$6,659) |
| 40-55% | 127 | $9,952 ($5,441-$15,859) |
| 55-70% | 87 | $11,734 ($6,614-$18,221) |
| ≥70% | 61 | $11,818 ($5,886-$20,377) |

Revenue more than doubles crossing from <40% to 40-55%, then flattens — occupancy above ~55% adds little median revenue.

**(c) ADR → Revenue** (median TTM by ADR band)

| ADR band | n | Rev med (p25-p75) |
|---|--:|---|
| <$50 | 296 | $3,174 ($2,071-$5,158) |
| $50-100 | 250 | $7,936 ($4,635-$12,976) |
| $100-200 | 104 | $13,843 ($7,664-$22,071) |
| ≥$200 | 34 | $29,439 ($19,516-$49,825) |

Revenue rises monotonically and steeply with ADR — the clearest, strongest relationship in the data.

---

## 5. "Pool / Luxury / Villa" Naming Signal

Listings whose `listing_name` contains **pool**, **luxury**, or **villa** vs all others.

| Group | n | ADR med | Rev med |
|---|--:|--:|--:|
| Name contains pool/luxury/villa | 144 | $94 | **$9,008** |
| Other listings | 540 | $50 | $5,180 |

The amenity/luxury-signalled group earns a **+74% higher median revenue** at nearly double the ADR. Marketing a pool/luxury/villa positioning correlates strongly with premium performance.

---

## 6. Registration Rate (Legal-Compliance Signal)

Share of listings with `registered = True`.

| City | n | Registered % |
|---|--:|--:|
| Da Lat | 134 | **0.0%** |
| Da Nang | 273 | **0.0%** |
| Ho Chi Minh City | 277 | **0.0%** |
| **Overall** | 684 | **0.0%** |

**Read:** Not a single listing in the dataset is registered. This signals a market-wide compliance gap. For an arbitrage operator this is a double-edged flag: regulatory/enforcement risk on one hand, but a genuine differentiation and trust moat for a fully-compliant, registered operation on the other.

---

## 7. Top 10 Districts by Median TTM Revenue (min 3 listings)

| Rank | City | District | n | Rev med |
|--:|---|---|--:|--:|
| 1 | Ho Chi Minh City | District 3 | 13 | $17,965 |
| 2 | Ho Chi Minh City | Binh Thanh District | 37 | $10,077 |
| 3 | Ho Chi Minh City | District 1 | 32 | $9,658 |
| 4 | Ho Chi Minh City | District 4 | 15 | $8,934 |
| 5 | Da Nang | Ngũ Hành Sơn District | 48 | $7,585 |
| 6 | Da Lat | Phường 5 | 4 | $6,407 |
| 7 | Ho Chi Minh City | *(unspecified)* | 122 | $6,154 |
| 8 | Da Lat | Phường 10 | 22 | $6,099 |
| 9 | Ho Chi Minh City | Thủ Đức | 21 | $5,513 |
| 10 | Da Nang | Hải Châu District | 54 | $5,448 |

*(Rank 7 aggregates HCMC listings with a blank district field — shown for completeness, not a targetable location.)* HCMC's central districts (3, Binh Thanh, 1, 4) dominate the top of the table; Da Nang's beachfront Ngũ Hành Sơn is the strongest single leisure district.

---

*Methodology: Python stdlib only (`csv`, `statistics`). Medians and linear-interpolated percentiles computed on a race-safe snapshot of the live file. Segments with n<3 suppressed from segment tables. Pearson correlations on all 684 listings.*
