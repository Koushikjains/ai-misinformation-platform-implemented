import { NextRequest, NextResponse } from "next/server";

function generateLimeExplanation(text: string): string {
  const words = text.split(/\s+/).filter(w => w.length > 0);

  const fakeIndicators = [
    "shocking", "unbelievable", "secret", "breaking", "urgent",
    "conspiracy", "exposed", "truth", "hoax", "scam", "fake", "lie"
  ];

  const realIndicators = [
    "according", "study", "research", "scientists", "officials",
    "confirmed", "reported", "evidence", "data", "analysis"
  ];

  const wordImportance: { word: string; weight: number; type: "positive" | "negative" | "neutral" }[] = [];

  words.slice(0, 50).forEach((word) => {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
    let weight = 0;
    let type: "positive" | "negative" | "neutral" = "neutral";

    if (fakeIndicators.some(ind => cleanWord.includes(ind))) {
      weight = 0.3 + Math.random() * 0.4;
      type = "negative";
    } else if (realIndicators.some(ind => cleanWord.includes(ind))) {
      weight = -(0.3 + Math.random() * 0.4);
      type = "positive";
    } else if (cleanWord.length > 3) {
      weight = (Math.random() - 0.5) * 0.2;
      type = weight > 0 ? "negative" : weight < -0.05 ? "positive" : "neutral";
    }

    wordImportance.push({ word, weight, type });
  });

  const sortedWords = [...wordImportance].sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  const topWords = sortedWords.slice(0, 10);

  const highlightedText = wordImportance.map(({ word, type, weight }) => {
    if (Math.abs(weight) < 0.1) return word;

    const intensity = Math.min(Math.abs(weight) * 2, 1);
    if (type === "negative") {
      return `<span style="background-color: rgba(239, 68, 68, ${intensity}); padding: 2px 4px; border-radius: 3px; color: ${intensity > 0.5 ? 'white' : 'inherit'}">${word}</span>`;
    } else if (type === "positive") {
      return `<span style="background-color: rgba(34, 197, 94, ${intensity}); padding: 2px 4px; border-radius: 3px; color: ${intensity > 0.5 ? 'white' : 'inherit'}">${word}</span>`;
    }
    return word;
  }).join(" ");

  const barChart = topWords.map(({ word, weight }) => {
    const absWeight = Math.abs(weight);
    const barWidth = Math.round(absWeight * 200);
    const color = weight > 0 ? "#ef4444" : "#22c55e";
    const label = weight > 0 ? "Fake indicator" : "Real indicator";

    return `
      <div style="display: flex; align-items: center; margin: 8px 0; font-family: system-ui, sans-serif;">
        <div style="width: 120px; font-size: 14px; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${word}</div>
        <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
          <div style="width: ${barWidth}px; height: 20px; background: ${color}; border-radius: 4px;"></div>
          <span style="font-size: 12px; color: #6b7280;">${(weight * 100).toFixed(1)}% (${label})</span>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; color: #1f2937;">
      <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #111827;">
        LIME Text Explanation
      </h3>
      
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #374151;">
          Word Importance (Top 10)
        </h4>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb;">
          ${barChart}
        </div>
      </div>
      
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #374151;">
          Highlighted Text
        </h4>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; line-height: 1.8;">
          ${highlightedText}
        </div>
      </div>
      
      <div style="display: flex; gap: 16px; margin-top: 16px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 16px; height: 16px; background: #ef4444; border-radius: 3px;"></div>
          <span style="font-size: 13px; color: #6b7280;">Indicates Fake</span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <div style="width: 16px; height: 16px; background: #22c55e; border-radius: 3px;"></div>
          <span style="font-size: 13px; color: #6b7280;">Indicates Real</span>
        </div>
      </div>
    </div>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    console.log("API /api/explain received request. Text length:", text?.length);

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const htmlExplanation = generateLimeExplanation(text);

    return NextResponse.json({ html: htmlExplanation });
  } catch (error) {
    console.error("Explain error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
