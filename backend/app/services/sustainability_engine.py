from typing import Dict, Any

class SustainabilityEngine:
    # Savings per kg of textile diverted from landfill/recycled
    # Sources: average environmental impact savings indicators for circular textiles
    IMPACT_FACTORS = {
        "Cotton": {
            "co2_savings_per_kg": 15.0,        # kg CO2
            "water_savings_per_kg": 8000.0,    # Liters of water saved
            "landfill_savings_per_kg": 1.0,    # kg diverted
            "resource_savings_per_kg": 1.2     # kg raw material saved
        },
        "Polyester": {
            "co2_savings_per_kg": 9.5,
            "water_savings_per_kg": 1500.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.5
        },
        "Denim": {
            "co2_savings_per_kg": 12.0,
            "water_savings_per_kg": 5000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.3
        },
        "Wool": {
            "co2_savings_per_kg": 18.0,
            "water_savings_per_kg": 4000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.1
        },
        "Linen": {
            "co2_savings_per_kg": 14.0,
            "water_savings_per_kg": 6000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.2
        },
        "Silk": {
            "co2_savings_per_kg": 25.0,
            "water_savings_per_kg": 9000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.0
        },
        "Nylon": {
            "co2_savings_per_kg": 10.0,
            "water_savings_per_kg": 2000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.4
        },
        "Blend": {
            "co2_savings_per_kg": 11.5,
            "water_savings_per_kg": 4500.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.3
        },
        "Mixed Fabrics": {
            "co2_savings_per_kg": 7.0,
            "water_savings_per_kg": 1000.0,
            "landfill_savings_per_kg": 1.0,
            "resource_savings_per_kg": 1.0
        }
    }

    @staticmethod
    def calculate_environmental_impact(fabric_type: str, quantity: float, recyclability_score: float) -> Dict[str, float]:
        """
        Calculates the sustainability footprint and environmental savings.
        Adapts calculations based on the batch recyclability efficiency.
        """
        # Resolve factors with Mixed Fabrics as default
        factors = SustainabilityEngine.IMPACT_FACTORS.get(
            fabric_type, SustainabilityEngine.IMPACT_FACTORS["Mixed Fabrics"]
        )

        efficiency = recyclability_score / 100.0
        
        # Base environmental metrics
        co2 = round(quantity * factors["co2_savings_per_kg"] * efficiency, 2)
        water = round(quantity * factors["water_savings_per_kg"] * efficiency, 2)
        landfill = round(quantity * factors["landfill_savings_per_kg"], 2) # full weight diverted
        resources = round(quantity * factors["resource_savings_per_kg"] * efficiency, 2)

        return {
            "co2_savings": co2,
            "water_savings": water,
            "landfill_reduction": landfill,
            "resource_conservation": resources
        }
