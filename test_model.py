"""
Unit tests for the arbitrage model — stdlib unittest, no third-party deps.
Run:  python3 test_model.py   (or  python3 -m unittest -v)
"""

import math
import unittest

import model


class TestCoreEconomics(unittest.TestCase):
    def test_worked_example_gross(self):
        # Appendix A sanity check: $87 ADR x 70% occ x 30 ~= $1,827/mo gross.
        g = model.gross_month(87.0, 0.70)
        self.assertAlmostEqual(g, 1827.0, delta=1.0)

    def test_gross_zero_occupancy(self):
        self.assertEqual(model.gross_month(100.0, 0.0), 0.0)

    def test_cleaning_month(self):
        # 30 nights / 3-night stays = 10 turnovers x $18 = $180.
        self.assertAlmostEqual(model.cleaning_month(3, 18), 180.0)
        # Longer stays -> fewer cleans.
        self.assertLess(model.cleaning_month(6, 18), model.cleaning_month(3, 18))

    def test_capex_amort_default_horizon(self):
        # (4000 + 800) / 18 months.
        self.assertAlmostEqual(model.capex_amort(4000, 800), 4800 / 18)

    def test_compute_unit_economics_identity(self):
        e = model.compute_unit_economics(
            adr_usd=100, occupancy_pct=0.6, monthly_rent_usd=700, bedrooms=1,
            avg_stay_nights=3, mgmt_fee_pct=0.15,
        )
        # net == gross - opex, and opex is the sum of its components.
        self.assertAlmostEqual(e["net_month"], e["gross_month"] - e["opex_month"])
        recomputed_opex = (700 + e["utilities_month"] + e["mgmt_fee"]
                           + e["cleaning_month"] + e["platform_fees"] + e["capex_amort"])
        self.assertAlmostEqual(e["opex_month"], recomputed_opex)
        # margin == net / gross.
        self.assertAlmostEqual(e["margin_pct"], e["net_month"] / e["gross_month"])

    def test_payback_infinite_when_net_nonpositive(self):
        e = model.compute_unit_economics(
            adr_usd=20, occupancy_pct=0.2, monthly_rent_usd=2000, bedrooms=2,
            avg_stay_nights=3, mgmt_fee_pct=0.15,
        )
        self.assertLessEqual(e["net_month"], 0)
        self.assertFalse(math.isfinite(e["payback_months"]))


class TestBreakeven(unittest.TestCase):
    def test_breakeven_roundtrip(self):
        # At the solved break-even occupancy, net should be ~0.
        kwargs = dict(monthly_rent_usd=700, bedrooms=1,
                      avg_stay_nights=3, mgmt_fee_pct=0.15)
        be = model.breakeven_occupancy(adr_usd=90, **kwargs)
        self.assertTrue(0 < be < 2)
        e = model.compute_unit_economics(adr_usd=90, occupancy_pct=be, **kwargs)
        self.assertAlmostEqual(e["net_month"], 0.0, delta=1.0)

    def test_breakeven_monotonic_in_adr(self):
        # Higher ADR -> lower break-even occupancy required.
        kw = dict(monthly_rent_usd=700, bedrooms=1, avg_stay_nights=3, mgmt_fee_pct=0.15)
        self.assertGreater(model.breakeven_occupancy(adr_usd=50, **kw),
                           model.breakeven_occupancy(adr_usd=120, **kw))


class TestSeasonalityAndSensitivity(unittest.TestCase):
    def test_seasonality_twelve_points(self):
        mult = [1.0] * 12
        curve, annual = model.seasonality_curve(base_net=100, base_gross=1000, monthly_mult=mult)
        self.assertEqual(len(curve), 12)
        # Flat multipliers -> every month equals base net, annual = 12x.
        for x in curve:
            self.assertAlmostEqual(x, 100.0)
        self.assertAlmostEqual(annual, 1200.0)

    def test_seasonality_normalized_no_inflation(self):
        # Non-flat multipliers with mean != 1 must not inflate the annual mean
        # away from base (normalized to mean 1). Peak months exceed base.
        mult = [0.5, 0.5, 1.5, 1.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]
        curve, annual = model.seasonality_curve(base_net=200, base_gross=1000, monthly_mult=mult)
        self.assertAlmostEqual(annual / 12, 200.0, delta=1.0)

    def test_sensitivity_grid_shape(self):
        unit = {"monthly_rent_usd": 700, "bedrooms": 1}
        grid = model.sensitivity_grid(unit, base_occ=0.6, base_adr=90,
                                      avg_stay_nights=3, mgmt_fee_pct=0.15)
        self.assertEqual(len(grid["occ_axis"]), 4)
        self.assertEqual(len(grid["adr_axis"]), 3)
        self.assertEqual(len(grid["net"]), 4)
        self.assertTrue(all(len(row) == 3 for row in grid["net"]))
        # Net increases with ADR along each occupancy row.
        for row in grid["net"]:
            self.assertLess(row[0], row[2])


class TestLegalGate(unittest.TestCase):
    def test_hcmc_residential_blocked(self):
        status, notes = model.legal_status("Ho Chi Minh City", "residential")
        self.assertEqual(status, "BLOCKED")
        self.assertTrue(notes)

    def test_hcmc_mixed_use_pass(self):
        status, _ = model.legal_status("Ho Chi Minh City", "mixed-use")
        self.assertEqual(status, "PASS")

    def test_hcmc_tourism_condotel_pass(self):
        status, _ = model.legal_status("Ho Chi Minh City", "tourism-condotel")
        self.assertEqual(status, "PASS")

    def test_da_nang_conditional(self):
        self.assertEqual(model.legal_status("Da Nang", "residential")[0], "CONDITIONAL")

    def test_da_lat_conditional(self):
        self.assertEqual(model.legal_status("Da Lat", "tourism-homestay")[0], "CONDITIONAL")


class TestFullPipeline(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.result = model.analyze()

    def test_units_present(self):
        self.assertGreater(len(self.result["units"]), 0)

    def test_no_nan_or_none_in_econ(self):
        for u in self.result["units"]:
            for k, v in u["econ"].items():
                if isinstance(v, float):
                    self.assertFalse(math.isnan(v), f"NaN in {u['building_id']}.{k}")
            self.assertIsNotNone(u["score"])
            self.assertFalse(math.isnan(u["score"]))
            # Seasonality curve always 12 points, all finite.
            self.assertEqual(len(u["seasonality_net"]), 12)
            self.assertTrue(all(math.isfinite(x) for x in u["seasonality_net"]))

    def test_shortlist_excludes_blocked(self):
        blocked_ids = {u["building_id"] for u in self.result["units"]
                       if u["legal_status"] == "BLOCKED"}
        self.assertTrue(blocked_ids, "expected at least one BLOCKED unit in seed data")
        for bid in self.result["shortlist"]:
            self.assertNotIn(bid, blocked_ids)

    def test_shortlist_max_ten(self):
        self.assertLessEqual(len(self.result["shortlist"]), 10)

    def test_blocked_units_score_zero(self):
        for u in self.result["units"]:
            if u["legal_status"] == "BLOCKED":
                self.assertEqual(u["score"], 0.0)

    def test_ranking_sorted_desc(self):
        scores = [u["score"] for u in self.result["units"]]
        self.assertEqual(scores, sorted(scores, reverse=True))

    def test_best_picks_split_by_type(self):
        # Villas list contains only villas; apartments only apartments; none BLOCKED.
        by_id = {u["building_id"]: u for u in self.result["units"]}
        for bid in self.result["best_villas"]:
            self.assertEqual(by_id[bid]["property_type"], "villa")
            self.assertNotEqual(by_id[bid]["legal_status"], "BLOCKED")
        for bid in self.result["best_apartments"]:
            self.assertEqual(by_id[bid]["property_type"], "apartment")

    def test_margins_in_sane_range(self):
        for u in self.result["units"]:
            self.assertTrue(-2.0 <= u["econ"]["margin_pct"] <= 1.0,
                            f"insane margin for {u['building_id']}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
