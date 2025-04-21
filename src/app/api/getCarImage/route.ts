import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");

  try {
    // Using Unsplash API with a more specific search
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
        query || "car"
      )}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();
    const imageUrl = data.urls.regular;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    // Fallback to a default car image if the request fails
    console.error("Error fetching image:", error);
    return NextResponse.json({
      imageUrl:
        "https://images.unsplash.com/photo-1579116774295-e5b39a3e2c9c?w=800",
    });
  }
}
