import requests
import json
import sys

base_url = "http://localhost:3001/api"

def print_result(name, data, expected_verdict=None):
    print(f"\n--- {name} ---")
    score = data.get('ai_score')
    count = data.get('evidence_count')
    verdict = data.get('final_verdict')
    color = data.get('ui_color')
    
    print(f"AI Score: {score}")
    print(f"Evidence Count: {count}")
    print(f"Final Verdict: {verdict}")
    print(f"UI Color: {color}")
    
    if expected_verdict:
        if verdict == expected_verdict:
            print("PASS")
        else:
            print(f"FAIL (Expected {expected_verdict})")

def test_unified_logic():
    # TEST 4: POTENTIAL HOAX (Forced Zero Evidence)
    # Query: Nonsense words with positive sentiment keywords.
    try:
        text = "Xylophone verified good correct safe qrzxtyuvw123."
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 4: POTENTIAL HOAX (Zero Matches)", r.json(), "POTENTIAL HOAX")
    except Exception as e:
        print(f"Error T4: {e}")

if __name__ == "__main__":
    test_unified_logic()
