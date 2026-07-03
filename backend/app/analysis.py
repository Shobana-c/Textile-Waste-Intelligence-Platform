from PIL import Image
import io
import random

def analyze_textile_image(file_bytes: bytes, filename: str) -> dict:
    """
    OpenCV/Pillow based feature extractor and simulated CNN classifier.
    Extracts a 3-color palette from uploaded image bytes,
    and returns a realistic fabric classification and recyclability profile.
    """
    # 1. Image dominant color palette extraction using Pillow
    palette = ["#10B981", "#059669", "#047857"] # Fallback palette (Green shades)
    try:
        image = Image.open(io.BytesIO(file_bytes))
        # Resize to 3x1 to extract 3 representative colors (dominant, secondary, accent)
        small_image = image.resize((3, 1), resample=Image.Resampling.LANCZOS)
        
        extracted = []
        for i in range(3):
            color = small_image.getpixel((i, 0))
            if len(color) >= 3:
                r, g, b = color[0], color[1], color[2]
                extracted.append(f"#{r:02x}{g:02x}{b:02x}".upper())
        if len(extracted) == 3:
            palette = extracted
    except Exception as e:
        print(f"Error extracting image color palette: {e}")
    
    # 2. Simulated CNN Classifier logic based on filename clues
    filename_lower = filename.lower()
    
    # Default outputs
    fabric_type = "Cotton"
    condition = "Clean"
    confidence = random.uniform(85.5, 98.2)
    recyclability = 92.0 # Cotton has high recyclability
    
    if "denim" in filename_lower or "jean" in filename_lower:
        fabric_type = "Denim"
        recyclability = 78.0
        confidence = random.uniform(91.0, 97.8)
    elif "cotton" in filename_lower:
        fabric_type = "Cotton"
        recyclability = 92.0
        confidence = random.uniform(90.0, 98.2)
    elif "polyester" in filename_lower or "synthetic" in filename_lower:
        fabric_type = "Polyester"
        recyclability = 35.0 # Synthetics are harder to recycle
        confidence = random.uniform(88.0, 95.5)
    elif "wool" in filename_lower or "sweater" in filename_lower:
        fabric_type = "Wool"
        recyclability = 85.0
        confidence = random.uniform(86.0, 93.4)
    elif "linen" in filename_lower:
        fabric_type = "Linen"
        recyclability = 90.0
        confidence = random.uniform(87.0, 94.2)
    elif "blend" in filename_lower or "mix" in filename_lower:
        fabric_type = "Mixed Fabrics"
        recyclability = 22.0 # Blended fabrics have low recyclability
        confidence = random.uniform(83.0, 91.0)
    else:
        # Random pick among main supported materials
        choices = [
            ("Cotton", 92.0),
            ("Polyester", 35.0),
            ("Wool", 85.0),
            ("Denim", 78.0),
            ("Mixed Fabrics", 22.0)
        ]
        fabric_type, recyclability = random.choice(choices)
        confidence = random.uniform(84.0, 96.0)

    # Detect condition clues in filename
    if "dirty" in filename_lower or "contamin" in filename_lower:
        condition = "Contaminated"
        recyclability = max(5.0, recyclability - 40.0) # Reduces recyclability
    elif "torn" in filename_lower or "damag" in filename_lower or "rip" in filename_lower:
        condition = "Damaged"
        recyclability = max(10.0, recyclability - 15.0)

    return {
        "fabric_type": fabric_type,
        "condition": condition,
        "color": palette[0], # Maintain backwards compatibility
        "palette": palette,
        "confidence_score": round(confidence, 2),
        "recyclability_score": round(recyclability, 2)
    }

def calculate_sustainability_metrics(fabric_type: str, condition: str, quantity_kg: float, recyclability_score: float) -> dict:
    """
    Computes circularity score using weighted equation,
    calculates environmental resources offsets (CO2/Water),
    and generates circular strategy suggestions.
    """
    # 1. Condition score (C)
    cond_lower = condition.lower()
    if cond_lower == "clean":
        cond_score = 100.0
    elif cond_lower == "damaged":
        cond_score = 50.0
    else: # contaminated
        cond_score = 15.0

    # 2. Reuse Potential (Pr)
    if cond_lower == "contaminated":
        reuse_score = 10.0
    elif cond_lower == "damaged":
        reuse_score = 40.0
    else: # Clean
        if fabric_type in ["Cotton", "Linen", "Wool", "Silk"]:
            reuse_score = 90.0
        elif fabric_type == "Denim":
            reuse_score = 85.0
        elif fabric_type in ["Polyester", "Nylon", "Acrylic", "Rayon"]:
            reuse_score = 60.0
        else: # Mixed
            reuse_score = 50.0

    # 3. Environmental Benefit (Eb)
    if fabric_type in ["Cotton", "Linen"]:
        env_benefit = 95.0
    elif fabric_type in ["Wool", "Silk"]:
        env_benefit = 85.0
    elif fabric_type == "Denim":
        env_benefit = 80.0
    elif fabric_type in ["Polyester", "Nylon"]:
        env_benefit = 65.0
    elif fabric_type in ["Acrylic", "Rayon"]:
        env_benefit = 60.0
    else: # Mixed
        env_benefit = 50.0

    # 4. Processing Feasibility (Fe)
    if fabric_type == "Mixed Fabrics":
        feasibility = 30.0
    elif cond_lower == "contaminated":
        feasibility = 20.0
    else: # Clean/Damaged single fibers
        if fabric_type in ["Cotton", "Linen"]:
            feasibility = 90.0
        elif fabric_type == "Denim":
            feasibility = 85.0
        elif fabric_type in ["Wool", "Silk", "Polyester", "Nylon"]:
            feasibility = 80.0
        else: # Rayon, Acrylic
            feasibility = 70.0

    # 5. Weighted Circularity Score
    circularity = (0.35 * recyclability_score) + (0.20 * cond_score) + (0.20 * reuse_score) + (0.15 * env_benefit) + (0.10 * feasibility)

    # 6. Environmental offsets calculations (CO2 in kg, Water in Liters)
    if fabric_type in ["Cotton", "Wool", "Linen", "Silk"]:
        co2_multiplier = 2.6
    elif fabric_type == "Denim":
        co2_multiplier = 2.2
    elif fabric_type in ["Polyester", "Nylon", "Acrylic", "Rayon"]:
        co2_multiplier = 1.8
    else:
        co2_multiplier = 1.2

    co2_savings = quantity_kg * co2_multiplier

    if fabric_type == "Cotton":
        water_multiplier = 20000.0
    elif fabric_type == "Denim":
        water_multiplier = 9000.0
    elif fabric_type in ["Linen", "Wool", "Silk"]:
        water_multiplier = 5000.0
    elif fabric_type in ["Polyester", "Nylon", "Acrylic"]:
        water_multiplier = 100.0
    else: # Mixed, Rayon
        water_multiplier = 1500.0

    water_savings = quantity_kg * water_multiplier

    # 7. Circular Strategy Suggestion
    if cond_lower == "contaminated":
        if fabric_type in ["Mixed Fabrics", "Polyester", "Acrylic"]:
            strategy = "Refuse Derived Fuel (RDF) conversion for thermal energy recovery."
        else:
            strategy = "Decontamination wash processing followed by secondary fabric extraction."
    elif cond_lower == "damaged":
        if fabric_type in ["Cotton", "Linen", "Wool"]:
            strategy = "Mechanical fiber tearing for acoustic insulation insulation mats."
        elif fabric_type == "Polyester":
            strategy = "Mechanical shredding for secondary industrial geo-textiles."
        else:
            strategy = "Conversion to secondary industrial rags and wiping cloths."
    else: # Clean
        if fabric_type in ["Cotton", "Linen"]:
            strategy = "High-grade mechanical sorting & spinning into premium recycled yarn."
        elif fabric_type == "Denim":
            strategy = "Premium panel upcycling or fiber carding for new denim products."
        elif fabric_type == "Wool":
            strategy = "Direct carded thread recycling or premium batting insulation."
        elif fabric_type in ["Polyester", "Nylon"]:
            strategy = "Chemical depolymerization into high-purity recycled rPET pellets."
        else:
            strategy = "Industrial design upcycling or secondary market garment distribution."

    return {
        "circularity_score": round(circularity, 2),
        "co2_savings_kg": round(co2_savings, 2),
        "water_savings_liters": round(water_savings, 2),
        "recycling_strategy": strategy
    }
