from typing import Dict, Any

class ScoringEngine:
    @staticmethod
    def calculate_circularity_score(
        recyclability_score: float,
        condition: str,
        reuse_score: float,
        sustainability_score: float,
        fabric_type: str
    ) -> Dict[str, Any]:
        """
        Calculates the overall Circularity Score and assigns a circularity category based on:
        - Material Recyclability (35%)
        - Material Condition (20%)
        - Reuse Potential (20%)
        - Environmental Benefit (15%)
        - Processing Feasibility (10%)
        """
        # 1. Condition score mapping (20%)
        condition_map = {
            "Good": 100.0,
            "Worn": 70.0,
            "Damaged": 40.0,
            "Contaminated": 10.0
        }
        condition_score = condition_map.get(condition, 50.0)

        # 2. Processing Feasibility score mapping (10%)
        # Pure natural fibers are easy to process, blends are medium, mixed/contaminated are hard
        if condition == "Contaminated":
            feasibility_score = 10.0
        elif fabric_type in ["Cotton", "Linen", "Wool", "Silk"]:
            feasibility_score = 100.0
        elif fabric_type in ["Polyester", "Nylon", "Denim"]:
            feasibility_score = 85.0
        elif fabric_type == "Blend":
            feasibility_score = 55.0
        else: # Mixed fabrics
            feasibility_score = 30.0

        # 3. Weighted Circularity calculation
        circularity_score = (
            (recyclability_score * 0.35) +
            (condition_score * 0.20) +
            (reuse_score * 0.20) +
            (sustainability_score * 0.15) +
            (feasibility_score * 0.10)
        )
        
        circularity_score = round(max(0.0, min(100.0, circularity_score)), 1)

        # 4. Circularity Category mapping
        if circularity_score >= 80.0:
            category = "Excellent Recovery Potential"
        elif circularity_score >= 60.0:
            category = "High Recovery Potential"
        elif circularity_score >= 40.0:
            category = "Moderate Recovery Potential"
        elif circularity_score >= 20.0:
            category = "Limited Recovery Potential"
        else:
            category = "Disposal Recommended"

        return {
            "circularity_score": circularity_score,
            "circularity_category": category,
            "condition_score": condition_score,
            "processing_feasibility_score": feasibility_score
        }
