import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }
    
    const url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
      return NextResponse.json({ suggestions: data[1].slice(0, 8) });
    }
    
    return NextResponse.json({ suggestions: [] });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
