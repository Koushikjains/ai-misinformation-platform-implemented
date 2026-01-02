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
    desc = data.get('description')
    explanation = data.get('verdict_explanation')
    evidence = data.get('evidence', [])
    
    print(f"AI Score: {score}")
    print(f"Evidence Count: {count}")
    print(f"Final Verdict: {verdict}")
    print(f"UI Color: {color}")
    if desc:
        print(f"Description: {desc}")
    if explanation:
        print(f"Explanation: {explanation}")
    
    print(f"First Evidence Item (if any):")
    if evidence and len(evidence) > 0:
        first = evidence[0]
        print(f"  Link: {first.get('link')}")
        print(f"  isGovt: {first.get('isGovt')}")
        print(f"  isTrusted: {first.get('isTrusted')}")

    if expected_verdict:
        if verdict == expected_verdict:
            print("✅ PASS")
        else:
            print(f"❌ FAIL (Expected {expected_verdict})")

def test_unified_logic():
    # TEST 1: VERIFIED REAL (Govt/Trusted)
    try:
        text = "The government of India budget session new policy on digital education verified."
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 1: VERIFIED REAL", r.json(), "VERIFIED REAL")
    except Exception as e:
        print(f"Error T1: {e}")

    # TEST 4: INVALID INPUT (< 20 chars)
    try:
        text = "Too short"
        r = requests.post(f"{base_url}/predict", json={"text": text, "model_type": "deep_learning"})
        print_result("TEST 4: INVALID INPUT", r.json(), "NOT A VALID SENTENCE")
    except Exception as e:
        print(f"Error T4: {e}")

if __name__ == "__main__":
    test_unified_logic()
