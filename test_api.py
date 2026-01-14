import requests
import json
import sys

base_url = "http://localhost:3001/api"

def print_result(name, data, expected_verdict=None):
    print(f"\n--- {name} ---")
    print(f"AI Score: {data.get('ai_score')}")
    print(f"Evidence Count: {data.get('evidence_count')}")
    print(f"Final Verdict: {data.get('final_verdict')}")
    print(f"UI Color: {data.get('ui_color')}")
    
    if expected_verdict:
        if data.get('final_verdict') == expected_verdict:
            print("✅ PASS")
        else:
            print(f"❌ FAIL (Expected {expected_verdict})")

def test_unified_logic():
    # 1. VERIFIED REAL
    # Needs: Positive keywords (AI says Green) + Facts (Evidence > 0)
    # Query: Something real and official.
    try:
        text = "The government of India officially announced the new digital budget verified safe."
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 1: VERIFIED REAL", r.json(), "VERIFIED REAL")
    except Exception as e:
        print(f"Error T1: {e}")

    # 2. POTENTIAL HOAX (The User's specific issue)
    # Needs: Positive/Neutral keywords (AI says Real) + NO Facts (Evidence == 0)
    # Query: "The verified good amazing miracle cure found on Mars."
    # (Keywords "verified", "good", "amazing" -> Low Fake Score -> Real)
    # (Mars cure -> No Gov evidence)
    try:
        text = "The verified good amazing miracle safe cure found on Mars today."
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 2: POTENTIAL HOAX", r.json(), "POTENTIAL HOAX")
    except Exception as e:
        print(f"Error T2: {e}")

    # 3. CONFIRMED FAKE
    # Needs: Negative keywords (AI says Fake) + NO Facts (Evidence == 0)
    # Query: "The terrible bad illegal government lie about aliens."
    try:
        text = "The terrible bad illegal government lie about aliens attacking earth."
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 3: CONFIRMED FAKE", r.json(), "CONFIRMED FAKE")
    except Exception as e:
        print(f"Error T3: {e}")

if __name__ == "__main__":
    test_unified_logic()
