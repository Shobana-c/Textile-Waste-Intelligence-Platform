import unittest
import sys
import os

# Add parent directory to path so imports work correctly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.scoring_engine import ScoringEngine
from app.services.sustainability_engine import SustainabilityEngine
from app.services.ai_engine import AIEngine

class TestCircularityScoring(unittest.TestCase):
    """
    Tests the Weighted Circularity Score calculation logic
    Formula: 35% Recyclability + 20% Condition + 20% Reuse + 15% Sustainability + 10% Feasibility
    """
    
    def test_cotton_excellent_recovery(self):
        # Perfect Cotton batch
        score_info = ScoringEngine.calculate_circularity_score(
            recyclability_score=90.0,
            condition="Good",
            reuse_score=95.0,
            sustainability_score=85.0,
            fabric_type="Cotton"
        )
        self.assertGreaterEqual(score_info["circularity_score"], 80.0)
        self.assertEqual(score_info["circularity_category"], "Excellent Recovery Potential")

    def test_polyester_damaged_recovery(self):
        # Damaged Polyester batch
        score_info = ScoringEngine.calculate_circularity_score(
            recyclability_score=35.0,
            condition="Damaged",
            reuse_score=30.0,
            sustainability_score=45.0,
            fabric_type="Polyester"
        )
        self.assertLess(score_info["circularity_score"], 50.0)
        self.assertEqual(score_info["circularity_category"], "Moderate Recovery Potential")

    def test_contaminated_boundary_condition(self):
        # Highly contaminated batch should always trigger Disposal Recommended
        score_info = ScoringEngine.calculate_circularity_score(
            recyclability_score=10.0,
            condition="Contaminated",
            reuse_score=10.0,
            sustainability_score=15.0,
            fabric_type="Blend"
        )
        self.assertLess(score_info["circularity_score"], 30.0)
        self.assertEqual(score_info["circularity_category"], "Disposal Recommended")


class TestSustainabilityIntelligence(unittest.TestCase):
    """
    Tests the ESG Offset calculations and coefficients mapping
    """

    def test_cotton_preservation_offsets(self):
        # 100 kg of cotton waste, 90.0% recyclability
        impact = SustainabilityEngine.calculate_environmental_impact(
            fabric_type="Cotton",
            quantity=100.0,
            recyclability_score=90.0
        )
        # Cotton CO2 offset = 15.0 kg CO2/kg * 100 kg * 90.0% efficiency = 1350.0
        # Cotton water offset = 8000 L/kg * 100 kg * 90.0% efficiency = 720000.0
        self.assertEqual(impact["co2_savings"], 1350.0)
        self.assertEqual(impact["water_savings"], 720000.0)
        self.assertEqual(impact["landfill_reduction"], 100.0)

    def test_wool_preservation_offsets(self):
        # 50 kg of wool waste, 85.0% recyclability
        impact = SustainabilityEngine.calculate_environmental_impact(
            fabric_type="Wool",
            quantity=50.0,
            recyclability_score=85.0
        )
        # Wool CO2 offset = 18.0 kg CO2/kg * 50 kg * 85.0% efficiency = 765.0
        # Wool water offset = 4000 L/kg * 50 kg * 85.0% efficiency = 170000.0
        self.assertEqual(impact["co2_savings"], 765.0)
        self.assertEqual(impact["water_savings"], 170000.0)


class TestRecommendationRouting(unittest.TestCase):
    """
    Tests the AI decision routing based on fabric type and quality
    """

    def test_cotton_good_strategy(self):
        # Cotton in Reusable category should route to Donation or Fabric Reuse
        strategy = AIEngine._recommend_strategy("Reusable", "Cotton")
        self.assertIn(strategy, ["Donation", "Fabric Reuse"])

    def test_contaminated_disposal_strategy(self):
        # Contaminated waste category should route to Disposal
        strategy = AIEngine._recommend_strategy("Hazardous Textile Waste", "Blend")
        self.assertEqual(strategy, "Disposal")


if __name__ == "__main__":
    unittest.main()
