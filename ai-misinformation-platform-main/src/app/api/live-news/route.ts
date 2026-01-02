import { NextRequest, NextResponse } from "next/server";

const NEWS_API_KEY = "8e4d905088664c108d7e6c9c83da314b";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  publishedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get("topic") || "news";
    const region = searchParams.get("region") || "global";

    let query = topic;
    if (region.toLowerCase() === "india") {
      query = `${topic} AND India`;
    }

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&apiKey=${NEWS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "ok" && data.articles) {
      const articles = data.articles.map((article: NewsArticle) => ({
        title: article.title || "No title",
        description: article.description || "No description available",
        url: article.url,
        image: article.urlToImage,
        source: article.source?.name || "Unknown",
        publishedAt: article.publishedAt,
      }));

      return NextResponse.json({ articles });
    }

    return NextResponse.json({ articles: [], error: data.message });
  } catch (error) {
    console.error("Live news error:", error);
    return NextResponse.json(
      { articles: [], error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
