import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

const TRUSTED_SOURCES = {
  // Official Government
  GOVT: ['gov.in', 'nic.in', 'pib.gov.in', '.gov'],
  // Top Trusted News Domains
  MEDIA: ['bbc.com', 'reuters.com', 'ndtv.com', 'thehindu.com', 'indianexpress.com', 'timesofindia', 'aniin.com', 'pti.in']
};

interface Evidence {
  title: string;
  snippet: string;
  link: string;
  isGovt: boolean;
  isTrusted: boolean;
}

async function fetchEvidence(query: string): Promise<Evidence[]> {
  try {
    // UPDATED: Broad search (remove site restrictions) to see all top news
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.items && Array.isArray(data.items)) {
      return data.items.slice(0, 10).map((item: { title: string; snippet: string; link: string }) => {
        const link = item.link || "";
        let isGovt = false;
        let isTrustedMedia = false;

        try {
          const hostname = new URL(link).hostname.toLowerCase();
          isGovt = TRUSTED_SOURCES.GOVT.some(domain => hostname.includes(domain));
          isTrustedMedia = TRUSTED_SOURCES.MEDIA.some(domain => hostname.includes(domain));
        } catch (e) {
          // Handle invalid URLs gracefully, default to false
        }

        return {
          title: item.title || "No title",
          snippet: item.snippet || "No description available",
          link: link,
          isGovt,
          isTrusted: isTrustedMedia
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return [];
  }
}

function classicMLPredict(text: string): { fake_score: number } {
  const fakeIndicators = [
    "shocking", "unbelievable", "secret", "they don't want you to know",
    "breaking", "urgent", "share before deleted", "mainstream media",
    "conspiracy", "cover-up", "exposed", "truth revealed", "wake up",
    "miracle", "cure", "100%", "guaranteed", "hoax", "scam"
  ];

  const realIndicators = [
    "according to", "study shows", "research", "scientists",
    "officials", "confirmed", "reported", "announced", "statement",
    "evidence", "data", "analysis", "peer-reviewed"
  ];

  const lowerText = text.toLowerCase();
  let fakeScore = 0;
  let realScore = 0;

  fakeIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) fakeScore += 1;
  });

  realIndicators.forEach(indicator => {
    if (lowerText.includes(indicator)) realScore += 1;
  });

  const totalIndicators = fakeScore + realScore;
  let fake_probability: number;

  if (totalIndicators === 0) {
    fake_probability = 0.4; // Default to slightly "Real" if neutral
  } else {
    fake_probability = fakeScore / totalIndicators;
  }

  return { fake_score: Math.min(Math.max(fake_probability, 0.01), 0.99) };
}

async function deepLearningPredict(text: string): Promise<{ fake_score: number }> {
  const truncatedText = text.slice(0, 1000);

  const sentimentIndicators = {
    negative: ["bad", "terrible", "awful", "horrible", "fake", "false", "lie", "wrong", "misleading", "dangerous", "corrupt", "illegal", "evil"],
    positive: ["good", "great", "true", "correct", "verified", "confirmed", "accurate", "factual", "legitimate", "official", "proven", "safe"]
  };

  const lowerText = truncatedText.toLowerCase();
  let negScore = 0;
  let posScore = 0;

  sentimentIndicators.negative.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) negScore += matches.length * 1.5;
  });

  sentimentIndicators.positive.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) posScore += matches.length;
  });

  const totalScore = negScore + posScore;
  let fake_probability: number;

  if (totalScore === 0) {
    // UPDATED: Default to 0.4 (Neutral/Leaning Real) instead of random coin flip
    fake_probability = 0.4;
  } else {
    // Score ratio -> probability
    fake_probability = negScore / totalScore;
  }

  return { fake_score: Math.min(Math.max(fake_probability, 0.01), 0.99) };
}

function determineUnifiedVerdict(fakeScore: number, trustedEvidenceCount: number): { verdict: string; color: string; explanation: string } {
  const isAiFake = fakeScore >= 0.5;
  const hasEvidence = trustedEvidenceCount > 0;

  if (!isAiFake && hasEvidence) {
    return {
      verdict: "VERIFIED REAL",
      color: "green",
      explanation: "✅ Verified by trusted sources with professional writing style."
    };
  } else if (!isAiFake && !hasEvidence) {
    return {
      verdict: "POTENTIAL HOAX",
      color: "amber",
      explanation: "⚠️ Professional writing style, but NO evidence found in trusted sources."
    };
  } else if (isAiFake && hasEvidence) {
    return {
      verdict: "SENSATIONALIZED",
      color: "yellow",
      explanation: "ℹ️ Facts confirmed by sources, but the writing style is sensational/clickbait."
    };
  } else {
    return {
      verdict: "CONFIRMED FAKE",
      color: "red",
      explanation: "⛔ Suspicious writing style and zero evidence found in trusted sources."
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, model_type } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // INPUT VALIDATION: Bad Input Check
    // Condition: If len(text) < 20 OR if the text contains fewer than 3 words.
    const wordCount = text.trim().split(/\s+/).length;
    if (text.trim().length < 20 || wordCount < 3) {
      return NextResponse.json({
        final_verdict: "NOT A VALID SENTENCE",
        ui_color: "gray",
        evidence: [],
        description: "The input is too short or meaningless to analyze. Please enter a complete news headline or paragraph.",
        // Providing safe defaults for other fields to satisfy interface
        ai_score: 0,
        ai_label: "UNKNOWN",
        evidence_count: 0,
        verdict_explanation: "Input invalid."
      });
    }

    // 1. Run AI Model
    let prediction: { fake_score: number };
    if (model_type === "classic") {
      prediction = classicMLPredict(text);
    } else {
      prediction = await deepLearningPredict(text);
    }

    // 2. Run Google Fact Check (Broad Search)
    const allEvidence = await fetchEvidence(text);

    // Filter for legitimate verified items for the score
    const trustedEvidenceCount = allEvidence.filter(e => e.isGovt || e.isTrusted).length;

    // 3. Unified Verification Logic
    const { verdict, color, explanation } = determineUnifiedVerdict(prediction.fake_score, trustedEvidenceCount);

    // NOTE: We map "color" to specific specific UI requirements in frontend
    // green -> emerald
    // amber -> orange/amber
    // yellow -> yellow
    // red -> red

    return NextResponse.json({
      ai_score: prediction.fake_score,
      ai_label: prediction.fake_score >= 0.5 ? "FAKE" : "REAL",
      evidence_count: trustedEvidenceCount,
      final_verdict: verdict,
      ui_color: color,
      verdict_explanation: explanation,
      evidence: allEvidence, // Send ALL evidence to frontend, let frontend style distinctions
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
